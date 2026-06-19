import { describe, expect, it } from "vitest";
import { createProposal, proposalToMarkdown } from "./generator";

const form = {
  client: "Jane Smith",
  company: "Acme Corp",
  service: "Custom Web Development",
  tier: "Professional",
  budget: "8000",
  timeline: "8 weeks",
};

describe("proposal generator", () => {
  it("creates a proposal with required sections", () => {
    const proposal = createProposal(form);
    expect(proposal.summary).toContain("Jane Smith");
    expect(proposal.deliverables.length).toBe(6);
    expect(proposal.phases.length).toBe(4);
    expect(proposal.terms).toContain("8 weeks");
  });

  it("exports markdown with brand credit", () => {
    const proposal = createProposal(form);
    const markdown = proposalToMarkdown(form, proposal);
    expect(markdown).toContain("Elite Era Development L.L.C");
    expect(markdown).toContain("Made by Hira Khyzer");
    expect(markdown).toContain("## Deliverables");
  });
});
