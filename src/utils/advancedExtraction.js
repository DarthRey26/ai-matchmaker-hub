import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import nlp from 'compromise';
import natural from 'natural';
export { matchStudentsToCompanies } from './matchingAlgorithm.js';

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
    const files = fs.readdirSync(directory);
    const companyData = [];
    for (const file of files) {
        if (path.extname(file).toLowerCase() === '.pdf') {
            const filePath = path.join(directory, file);
            const text = await extractTextFromPDF(filePath);
            const data = extractDataFromText(text);
            companyData.push(data);
        }
    }
    return companyData;
}

function extractDataFromText(text) {
    const companyNameMatch = text.match(/Company name\s+(.*)/);
    const websiteMatch = text.match(/Company website\s+(.*)/);
    const numStudentsMatch = text.match(/Number of students\s+(\d+)/);
    const allowanceMatch = text.match(/Monthly allowance\s+(.*)/);
    const workingDaysMatch = text.match(/Working Days:\s+(.*)/);
    const descriptionMatch = text.match(/Company brief description\s+(.*?)(?=Indicate)/s);
    const rolesMatch = text.match(/(\d+\.\s+.*?Intern).*?Requirement.*?-\s+(.*)/gs);

    return {
        company_name: companyNameMatch ? companyNameMatch[1].trim() : '',
        website: websiteMatch ? websiteMatch[1].trim() : '',
        num_students: numStudentsMatch ? parseInt(numStudentsMatch[1]) : 0,
        monthly_allowance: allowanceMatch ? allowanceMatch[1].trim() : '',
        working_days: workingDaysMatch ? workingDaysMatch[1].trim() : '',
        company_description: descriptionMatch ? descriptionMatch[1].trim() : '',
        job_roles: rolesMatch ? rolesMatch.map(match => match.split('Requirement')[0].trim()) : [],
        requirements: rolesMatch ? rolesMatch.map(match => match.split('Requirement')[1].trim()) : []
    };
}
