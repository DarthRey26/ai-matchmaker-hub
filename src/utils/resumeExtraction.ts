import type { Resume } from "../redux/types";
import type { ResumeSectionToLines } from "./types";
import { extractProfile } from "./extractors/extract-profile";
import { extractEducation } from "./extractors/extract-education";
import { extractWorkExperience } from "./extractors/extract-work-experience";
import { extractProject } from "./extractors/extract-project";
import { extractSkills } from "./extractors/extract-skills";

export const extractResumeFromSections = (
  sections: ResumeSectionToLines
): Resume => {
  const { profile } = extractProfile(sections);
  const { educations } = extractEducation(sections);
  const { workExperiences } = extractWorkExperience(sections);
  const { projects } = extractProject(sections);
  const { skills } = extractSkills(sections);

  return {
    profile,
    educations,
    workExperiences,
    projects,
    skills,
    custom: {
      descriptions: [],
    },
  };
};
