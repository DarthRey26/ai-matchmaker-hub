import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nlp from 'compromise';
import natural from 'natural';
import { cleanAndNormalize } from './cleaningUtils.js';
export { matchStudentsToCompanies } from './matchingAlgorithm.js';

export const tokenizer = new natural.WordTokenizer();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

<<<<<<< HEAD
let pdfjsLib;

async function initPdfjsLib() {
  if (typeof window === 'undefined') {
    // Node.js environment
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.js');
    pdfjsLib = pdfjs.default;
    const pdfjsWorker = path.resolve(__dirname, '../../node_modules/pdfjs-dist/build/pdf.worker.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(pdfjsWorker, import.meta.url).href;
    pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = 'path_to_your_fonts_directory';
  } else {
    // Browser environment
    const pdfjs = await import('pdfjs-dist/build/pdf.js');
    pdfjsLib = pdfjs.default;
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.standardFontDataUrl = 'path_to_your_fonts_directory';
  }
}

// Initialize pdfjsLib
await initPdfjsLib();

=======
>>>>>>> 5aef5ee750388999b7cc271fd90cb6f9ffd0ccfd
const common_skills = [
    "Python", "Java", "C++", "JavaScript", "SQL", "Machine Learning", "Data Analysis",
    "Project Management", "Leadership", "Communication", "Teamwork", "Problem Solving",
    "Critical Thinking", "Microsoft Office", "Adobe Creative Suite", "Marketing",
    "Sales", "Customer Service", "Financial Analysis", "Accounting", "HTML", "CSS",
    "React", "Node.js", "AWS", "Docker", "Kubernetes", "Git", "Agile", "Scrum"
].map(skill => skill.replace(/\+/g, '\\+')); // Escape + characters properly

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
  
  // Improved company name extraction
  const companyNamePatterns = [
    /company\s*name\s*:?\s*([^:\n]+?)(?=\s*(?:company website|brief company description|$))/i,
    /^([^:\n]+?)\s*company website/i,
    /([^:\n]+?)\s*brief company description/i
  ];

  for (const pattern of companyNamePatterns) {
    const match = content.match(pattern);
    if (match) {
      info.company_name = match[1].trim()
        .replace(/\s+/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
      break;
    }
  }

  // Extract website
  const websiteMatch = content.match(/company\s*website\s*:?\s*([^\n]+)/i);
  if (websiteMatch) info.website = websiteMatch[1].trim();
  
  // Extract description
  const descriptionMatch = content.match(/brief\s*company\s*description\s*:?\s*([^]*?)(?=hours of work|working days|monthly allowance|$)/i);
  if (descriptionMatch) info.company_description = descriptionMatch[1].trim();
  
  // Extract working hours
  const hoursMatch = content.match(/hours\s*of\s*work\s*:?\s*([^\n]+)/i);
  if (hoursMatch) info.working_hours = hoursMatch[1].trim();
  
  // Extract working days
  const daysMatch = content.match(/working\s*days\s*:?\s*([^\n]+)/i);
  if (daysMatch) info.working_days = daysMatch[1].trim();
  
  // Extract allowance
  const allowanceMatch = content.match(/monthly\s*allowance\s*:?\s*([^\n]+)/i);
  if (allowanceMatch) info.monthly_allowance = allowanceMatch[1].trim();
  
  // Extract job descriptions with improved parsing
  const jobDescriptionSection = content.match(/job\s*description\s*\(?s?\)?:?\s*([^]*?)(?=internship requirement|additional note|$)/i);
  if (jobDescriptionSection) {
    const jobDescText = jobDescriptionSection[1];
    info.job_descriptions = jobDescText
      .split(/(?=●|\d+\.)/)
      .filter(desc => desc.trim())
      .map(desc => ({
        description: desc.replace(/^[●\d\.]\s*/, '').trim()
      }));
  }

  // Extract requirements
  const requirementsSection = content.match(/internship\s*requirement\s*\(?s?\)?:?\s*([^]*?)(?=additional note|benefits|$)/i);
  if (requirementsSection) {
    info.requirements = requirementsSection[1]
      .split(/(?=●|\d+\.)/)
      .filter(req => req.trim())
      .map(req => req.replace(/^[●\d\.]\s*/, '').trim());
  }

  return info;
}
