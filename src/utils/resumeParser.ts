import { readPdf } from "./pdfUtils";
import { groupTextItemsIntoLines } from "./textProcessing";
import { groupLinesIntoSections } from "./sectionProcessing";
import { extractResumeFromSections } from "./resumeExtraction";

export const parseResumeFromPdf = async (fileUrl: string) => {
  const textItems = await readPdf(fileUrl);
  const lines = groupTextItemsIntoLines(textItems);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);
  return resume;
};
