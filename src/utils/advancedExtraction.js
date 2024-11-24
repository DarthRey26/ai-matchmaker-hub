import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nlp from 'compromise';
import natural from 'natural';
import { cleanAndNormalize } from './cleaningUtils.js';
export { matchStudentsToCompanies } from './matchingAlgorithm.js';

// Add tokenizer export
export const tokenizer = new natural.WordTokenizer();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let pdfjsLib;

async function initPdfjsLib() {
  if (typeof window === 'undefined') {
    // Node.js environment
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
    pdfjsLib = pdfjs.default;
    const pdfjsWorker = path.resolve(__dirname, '../../node_modules/pdfjs-dist/build/pdf.worker.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(pdfjsWorker, import.meta.url).href;
  } else {
    // Browser environment
    const pdfjs = await import('pdfjs-dist/build/pdf.js');
    pdfjsLib = pdfjs.default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
  }
}

// Initialize pdfjsLib
await initPdfjsLib();

const common_skills = [
    "Python", "Java", "C\\+\\+", "JavaScript", "SQL", "Machine Learning", "Data Analysis",
    "Project Management", "Leadership", "Communication", "Teamwork", "Problem Solving",
    "Critical Thinking", "Microsoft Office", "Adobe Creative Suite", "Marketing",
    "Sales", "Customer Service", "Financial Analysis", "Accounting", "HTML", "CSS",
    "React", "Node.js", "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum"
];

export async function extractTextFromPDF(pdfPath) {
    if (!pdfjsLib) {
        await initPdfjsLib();
    }
    const data = new Uint8Array(await fs.promises.readFile(pdfPath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items.map(item => item.str).join(' ') + ' ';
    }
    return fullText;
}

function cleanText(text) {
    return text.replace(/[^a-zA-Z\s]/g, '').toLowerCase().trim();
}

function extractSkills(text) {
    const doc = nlp(text);
    const skills = common_skills.filter(skill => 
        new RegExp('\\b' + skill.toLowerCase() + '\\b', 'i').test(text)
    );
    doc.nouns().forEach(noun => {
        if (noun.text.length > 3) skills.push(noun.text);
    });
    doc.verbs().forEach(verb => {
        if (verb.text.length > 3) skills.push(verb.text);
    });
    return [...new Set(skills)].sort();
}

function extractKeywords(text) {
    const doc = nlp(text);
    const keywords = doc.nouns().concat(doc.adjectives()).out('array');
    return [...new Set(keywords)].sort();
}

function extractExperience(text) {
    const datePattern = /(\b\d{4}\b|January|February|March|April|May|June|July|August|September|October|November|December)\s*(\d{4})?/g;
    const dates = text.match(datePattern) || [];
    const doc = nlp(text);
    const jobs = doc.organizations().out('array');
    return [{ dates, job_titles: jobs }];
}

function extractEntities(text, filename) {
    const name = path.basename(filename, path.extname(filename)).replace(/[_-]/g, ' ');
    const emailMatch = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    return {
        name,
        email: emailMatch ? emailMatch[0] : null,
        skills: extractSkills(text),
        experience: extractExperience(text)
    };
}

export async function processResumes(directory) {
    const files = fs.readdirSync(directory);
    const resumeData = [];
    for (const file of files) {
        if (path.extname(file).toLowerCase() === '.pdf') {
            const filePath = path.join(directory, file);
            const text = await extractTextFromPDF(filePath);
            const data = extractEntities(text, file);
            data.skills = extractSkills(text);
            data.keywords = extractKeywords(text);
            resumeData.push(data);
        }
    }
    return resumeData;
}

export async function processCompanyPDFs(directory) {
    try {
        const files = fs.readdirSync(directory);
        const supportedFiles = files.filter(file => 
            file.toLowerCase().endsWith('.pdf') || 
            file.toLowerCase().endsWith('.txt')
        );

        const allCompanies = [];

        for (const file of supportedFiles) {
            const filePath = path.join(directory, file);
            const text = await extractTextFromPDF(filePath);
            const companyInfo = extractCompanyInfo(text, file);
            allCompanies.push(companyInfo);
        }

        // Remove duplicates based on company name
        const uniqueCompanies = Array.from(
            new Map(allCompanies.map(company => [company.company_name, company]))
        ).map(([_, company]) => company);

        return uniqueCompanies;
    } catch (error) {
        console.error('Error processing company documents:', error);
        return [];
    }
}

function extractCompanyInfo(content) {
    const info = {};
    
    const companyNameMatch = content.match(/Company name\s*:?\s*(.+?)(?:\n|$)/i);
    if (companyNameMatch) {
        info.company_name = companyNameMatch[1].trim();
    } else {
        // Fallback: Try to extract from known company names
        const knownCompanies = [
            'Seven Peaks', 'NinjaVan', 'Forvis', 'Nightify', 'Slaaaaash Studios', 'TBS'
        ];
        for (const company of knownCompanies) {
            if (content.includes(company)) {
                info.company_name = company;
                break;
            }
        }
    }
    
    const websiteMatch = content.match(/Company website\s*(.+)/);
    if (websiteMatch) info.website = websiteMatch[1].trim();
    
    const studentsRequiredMatch = content.match(/Number of students\s*(.+)/);
    if (studentsRequiredMatch) info.students_required = studentsRequiredMatch[1].trim();
    
    const allowanceMatch = content.match(/Monthly allowance\s*(.+)/);
    if (allowanceMatch) info.monthly_allowance = allowanceMatch[1].trim();
    
    const workingHoursMatch = content.match(/Working Days:\s*(.+)/);
    if (workingHoursMatch) info.working_hours = workingHoursMatch[1].trim();
    
    const descriptionMatch = content.match(/Company brief\s*description\s*(.+?)\s*Indicate if/s);
    if (descriptionMatch) info.company_description = descriptionMatch[1].trim();
    
    const jobDescriptions = content.match(/(\d+\.\s*.+?Intern.+?)(?=\d+\.\s*.+?Intern|\Z)/gs);
    if (jobDescriptions) {
        info.job_descriptions = jobDescriptions.map(desc => {
            const titleMatch = desc.match(/(\d+\.\s*)(.+?)(?:\n|$)/);
            const descriptionMatch = desc.match(/Job Description\s*:?\s*(.+?)(?:\n|$)/i);
            const requirementsMatch = desc.match(/Requirements\s*:?\s*(.+?)(?:\n|$)/i);
            
            return {
                title: titleMatch ? titleMatch[2].trim() : '',
                description: descriptionMatch ? descriptionMatch[1].trim() : '',
                requirements: requirementsMatch ? requirementsMatch[1].trim() : ''
            };
        });
    }
    
    return cleanAndNormalize(info);
}

function extractEmail(text) {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : null;
}

