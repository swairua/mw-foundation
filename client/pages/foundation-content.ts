import archive from "../mw-foundation-content.json" assert { type: "json" };

export type FocusPage = {
  id: string;
  path: string;
  label: string;
  eyebrow: string;
  title: string;
  image: string;
  imageAlt: string;
  description: string;
  highlights: string[];
};

const imageById: Record<string, { image: string; imageAlt: string }> = {
  technology: { image: "/assets/images/tech-education.jpg", imageAlt: "Students learning with technology" },
  education: { image: "/assets/images/education-global.jpg", imageAlt: "Students in a classroom" },
  economic: { image: "/assets/images/economic-empowerment-women.jpg", imageAlt: "Women working together" },
  wellness: { image: "/assets/images/healthcare-wellness.jpg", imageAlt: "Community health workers" },
  disability: { image: "/assets/images/disability-inclusion-tech.jpg", imageAlt: "Person using assistive technology" },
};

const pillarHighlights: Record<string, string[]> = {
  Technology: ["Digital skills", "Access to knowledge", "Innovation for communities", "Connections that create opportunity"],
  Education: ["Learning pathways", "Youth leadership", "Mentorship and confidence", "Skills for a changing world"],
  "Economic Empowerment": ["Women’s enterprise", "Skills and resources", "Confidence to lead", "More resilient livelihoods"],
  Wellness: ["Mental wellbeing", "Healthy communities", "Resilience and care", "Connection that strengthens us"],
  "Disability Inclusion": ["Access and dignity", "Participation without barriers", "Community belonging", "Opportunity for all"],
};

const focusDefinitions = [
  ["technology", "/tech-and-innovation", "Technology", "Our work · 01", "Technology that opens doors."],
  ["education", "/education", "Education and leadership", "Our work · 02", "Curious minds. Courageous leaders."],
  ["economic", "/economic-empowerment", "Economic empowerment", "Our work · 03", "Backing people to thrive."],
  ["disability", "/disability-inclusion", "Disability inclusion", "Our work · 04", "Every person belongs."],
  ["wellness", "/wellness-and-mental-health", "Wellness and mental health", "Our work · 05", "Wellbeing can flourish."],
] as const;

export const focusPages: FocusPage[] = focusDefinitions.map(([id, path, label, eyebrow, title]) => {
  const pillarName = id === "economic" ? "Economic Empowerment" : id === "disability" ? "Disability Inclusion" : id === "technology" ? "Technology" : id === "education" ? "Education" : "Wellness";
  const pillar = archive.pages.objectives.pillars.find((item) => item.name === pillarName)!;
  return {
    id,
    path,
    label,
    eyebrow,
    title,
    ...imageById[id],
    description: pillar.description,
    highlights: pillarHighlights[pillarName],
  };
});

export const contentArchive = archive;
export const sourceSite = archive.source;

export const focusPageByPath = new Map(focusPages.map((page) => [page.path, page]));
