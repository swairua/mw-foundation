import archive from "../../public/mw-foundation-content.json";

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
  technology: { image: "/assets/images/pexels-a-darmel-7710088.jpg", imageAlt: "Young people learning together" },
  education: { image: "/assets/images/pexels-n-voitkevich-7172820.jpg", imageAlt: "Students learning together" },
  economic: { image: "/assets/images/pexels-greta-hoffman-9705815.jpg", imageAlt: "A woman working at a laptop" },
  wellness: { image: "/assets/images/pexels-rethaferguson-3621954.jpg", imageAlt: "A woman smiling outdoors" },
  disability: { image: "/assets/images/pexels-cottonbro-8527286.jpg", imageAlt: "People sharing a moment together" },
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
