const DEFAULT_DELIVERABLES = [
  "Discovery and project planning",
  "Custom branded user experience",
  "Core feature implementation",
  "Review and refinement round",
  "Launch-ready documentation",
  "Next-step growth roadmap",
];

const WEB_DELIVERABLES = [
  "Responsive website interface",
  "Reusable component structure",
  "Contact and inquiry form",
  "Performance-focused page layout",
  "SEO-ready page structure",
  "Deployment-ready project files",
];

const DESIGN_DELIVERABLES = [
  "Logo direction",
  "Color and typography system",
  "Brand usage guide",
  "Social media starter assets",
  "Presentation-ready visuals",
  "Final brand package",
];

export function createProposal(form) {
  const service = form.service || "Digital Product Development";
  const company = form.company ? ` at ${form.company}` : "";
  const budget = form.budget ? `$${Number(form.budget).toLocaleString()} USD` : "TBD";
  const timeline = form.timeline || "TBD";
  const deliverables = service.includes("Web") ? WEB_DELIVERABLES : service.includes("Brand") || service.includes("Design") ? DESIGN_DELIVERABLES : DEFAULT_DELIVERABLES;

  return {
    summary: `Elite Era Development L.L.C will help ${form.client || "the client"}${company} complete a focused ${service} project with a polished and professional result. The ${form.tier} tier is structured for clear planning, smooth delivery, and strong presentation quality.`,
    deliverables,
    phases: [
      { title: "Discovery", desc: "Confirm goals, audience, scope, and success criteria." },
      { title: "Planning", desc: "Create the roadmap, timeline, and work structure." },
      { title: "Build", desc: "Produce the main deliverables and review progress." },
      { title: "Handoff", desc: "Deliver final files, guidance, and next steps." },
    ],
    whyUs: "Elite Era Development L.L.C focuses on clean presentation, practical execution, and client-ready digital solutions.",
    terms: `Estimated budget: ${budget}. Timeline: ${timeline}. Next step: confirm scope and begin the discovery phase.`,
  };
}

export function proposalToMarkdown(form, proposal) {
  return [
    `# Business Proposal for ${form.client || "Client"}`,
    "",
    "Prepared by Elite Era Development L.L.C",
    "Made by Hira Khyzer",
    "",
    "## Executive Summary",
    proposal.summary,
    "",
    "## Deliverables",
    ...proposal.deliverables.map((item) => `- ${item}`),
    "",
    "## Project Phases",
    ...proposal.phases.map((phase, index) => `${index + 1}. ${phase.title}: ${phase.desc}`),
    "",
    "## Why Us",
    proposal.whyUs,
    "",
    "## Terms",
    proposal.terms,
  ].join("\n") + "\n";
}

export function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
