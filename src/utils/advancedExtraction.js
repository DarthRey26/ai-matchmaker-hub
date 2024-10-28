import * as fs from 'fs';
import path from 'path';
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

function extractCompanyInfo(text, fileName) {
    const cleanedText = text
        .replace(/â€"/g, '-')
        .replace(/â€™/g, "'")
        .replace(/â€œ/g, '"')
        .replace(/â€/g, '"')
        .replace(/\s+/g, ' ')
        .trim();

    const companyName = extractValue(cleanedText, /Company name\s*([\s\S]+?)\s*Company website/i);
    const website = extractValue(cleanedText, /Company website\s*([\S]+)/i);
    const studentsText = extractValue(cleanedText, /Number of students\s*([\s\S]+?)\s*Monthly allowance/i);
    const allowanceText = extractValue(cleanedText, /Monthly allowance\s*(?:THB|USD)?\s*([\d,]+)/i);
    const workingDays = extractValue(cleanedText, /Working Days\s*:\s*([\s\S]+?)(?=\s*Internship period|Company brief description)/i);
    const description = extractValue(cleanedText, /Company brief description\s*([\s\S]+?)(?=Indicate if|Role and|$)/i);
    const email = extractEmail(cleanedText);

    const companyInfo = {
        file_name: fileName,
        company_name: companyName,
        website: website,
        number_of_students: parseStudents(studentsText),
        monthly_allowance: parseAllowance(allowanceText),
        working_days: parseWorkingDays(workingDays),
        company_description: cleanDescription(description),
        job_descriptions: extractPositions(cleanedText),
        contact_email: email
    };

    return companyInfo;
}

function extractValue(text, pattern) {
    const match = text.match(pattern);
    return match ? match[1].trim() : '';
}

function parseStudents(text) {
    if (!text) return [];
    
    const studentSpecs = text.split(/,|\sand\s/)
        .map(spec => spec.trim())
        .filter(Boolean);
    
    return studentSpecs.map(spec => {
        const countMatch = spec.match(/(\d+)(?:\s*-\s*(\d+))?\s*student/i);
        const positionMatch = spec.match(/student[s]?\s*(?:in\s*)?(.+?)(?=\s*$|\s*,)/i);
        
        const count = countMatch 
            ? countMatch[2] 
                ? { min: parseInt(countMatch[1]), max: parseInt(countMatch[2]) }
                : parseInt(countMatch[1])
            : 1;
            
        const position = positionMatch 
            ? positionMatch[1].trim() 
            : spec.trim();
            
        return {
            count: count,
            position: position
        };
    });
}

function parseAllowance(text) {
    if (!text) return null;
    
    const amount = parseInt(text.replace(/,/g, ''));
    return amount ? {
        amount: amount,
        currency: 'THB'
    } : null;
}

function parseWorkingDays(text) {
    if (!text) return null;
    const daysMatch = text.match(/(?:Mon|Monday|Tue|Tuesday|Wed|Wednesday|Thu|Thursday|Fri|Friday|Sat|Saturday|Sun|Sunday)(?:\s*(?:to|-)\s*(?:Mon|Monday|Tue|Tuesday|Wed|Wednesday|Thu|Thursday|Fri|Friday|Sat|Saturday|Sun|Sunday))?/i);
    const timeMatch = text.match(/\(([0-9.:]+)\s*-\s*([0-9.:]+)\)/);
    
    return {
        days: daysMatch ? daysMatch[0].trim() : text,
        hours: timeMatch ? {
            start: timeMatch[1].trim(),
            end: timeMatch[2].trim()
        } : null
    };
}

function cleanDescription(text) {
    return text ? text.replace(/\s+/g, ' ').trim() : '';
}

function extractPositions(text) {
    const positions = [];
    const sections = [
        /Role and Responsibilities?([\s\S]+?)(?=Requirements|Qualifications|$)/i,
        /Job Description\s*:?([\s\S]+?)(?=Requirements|Qualifications|$)/i,
        /Position\s*:?([\s\S]+?)(?=Requirements|Qualifications|$)/i
    ];

    for (const pattern of sections) {
        const match = text.match(pattern);
        if (match) {
            const content = match[1];
            const roleMatches = content.match(/[•-]\s*([^\n]+)/g) || [];
            
            roleMatches.forEach(role => {
                positions.push(role.replace(/^[•-]\s*/, '').trim());
            });
        }
    }

    // If no structured positions found, extract from number of students section
    if (positions.length === 0) {
        const studentsMatch = text.match(/Number of students[^]*?(\d+)[^]*?(?:in\s+)?([^,\n]+)/i);
        if (studentsMatch && studentsMatch[2]) {
            positions.push(studentsMatch[2].trim());
        }
    }

    return positions;
}

function extractEmail(text) {
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    return emailMatch ? emailMatch[0] : null;
}
