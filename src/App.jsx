import { useState } from "react";
import { BRAND_GOLD, SERVICES, TIERS } from "./data";
import { createProposal, downloadFile, proposalToMarkdown } from "./generator";

const emptyForm = {
  client: "",
  company: "",
  email: "",
  phone: "",
  service: "",
  tier: "Professional",
  budget: "",
  timeline: "",
  notes: "",
};

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </label>
  );
}

function Section({ title, icon, children }) {
  return (
    <section className="box">
      <div className="box-title"><span>{icon}</span>{title}</div>
      {children}
    </section>
  );
}

function ProposalPreview({ form, proposal }) {
  const budget = form.budget ? `$${Number(form.budget).toLocaleString()} USD` : "TBD";
  return (
    <div className="proposal-card">
      <header className="proposal-header">
        <div>
          <div className="brand-row">
            <div className="brand-mark">E</div>
            <div>
              <div className="brand-name">Elite Era Development L.L.C</div>
              <div className="brand-site">eliteeradev.com</div>
            </div>
          </div>
          <h2>Business Proposal</h2>
          <p>Prepared for <strong>{form.client || "Client"}</strong>{form.company ? ` · ${form.company}` : ""}</p>
        </div>
        <div className="tier-pill">{form.tier} Tier</div>
      </header>

      <section className="proposal-section accent-section">
        <h3>Executive Summary</h3>
        <p>{proposal.summary}</p>
      </section>

      <div className="stats-grid">
        <div><span>Service</span><strong>{form.service || "TBD"}</strong></div>
        <div><span>Investment</span><strong>{budget}</strong></div>
        <div><span>Delivery</span><strong>{form.timeline || "TBD"}</strong></div>
      </div>

      <section className="proposal-section">
        <h3>What We’ll Deliver</h3>
        <div className="deliverables-grid">
          {proposal.deliverables.map((item) => <div key={item} className="deliverable">✦ {item}</div>)}
        </div>
      </section>

      <section className="proposal-section">
        <h3>Project Phases</h3>
        <div className="phase-list">
          {proposal.phases.map((phase, index) => (
            <div className="phase" key={phase.title}>
              <div className="phase-num">{index + 1}</div>
              <div><strong>{phase.title}</strong><p>{phase.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="proposal-section two-col">
        <div><h3>Why Elite Era Development</h3><p>{proposal.whyUs}</p></div>
        <div><h3>Terms & Next Steps</h3><p>{proposal.terms}</p></div>
      </section>

      <footer className="proposal-footer">
        <span>Confidential · {new Date().getFullYear()}</span>
        <strong>Made by Hira Khyzer</strong>
      </footer>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState(emptyForm);
  const [page, setPage] = useState("form");
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState("");

  const set = (key) => (value) => setForm((current) => ({ ...current, [key]: value }));

  function generateProposal() {
    if (!form.client.trim() || !form.service) {
      setError("Please fill in Client Name and Service.");
      return;
    }
    setError("");
    setPage("loading");
    window.setTimeout(() => {
      setProposal(createProposal(form));
      setPage("result");
    }, 650);
  }

  function exportMarkdown() {
    downloadFile("elite-proposal.md", proposalToMarkdown(form, proposal), "text/markdown");
  }

  function exportJson() {
    downloadFile("elite-proposal.json", JSON.stringify({ form, proposal }, null, 2), "application/json");
  }

  function exportText() {
    downloadFile("elite-proposal.txt", proposalToMarkdown(form, proposal), "text/plain");
  }

  return (
    <main className="app-shell">
      <nav className="topbar">
        <div className="brand-row">
          <div className="brand-mark">E</div>
          <div><strong>Elite Era Development L.L.C</strong><span>Proposal Generator</span></div>
        </div>
        {page === "result" && <button className="ghost" onClick={() => { setPage("form"); setProposal(null); }}>New Proposal</button>}
      </nav>

      <div className="container">
        {page === "form" && (
          <>
            <section className="hero">
              <div className="eyebrow">✦ White + Gold Business Tool</div>
              <h1>Create a <span>premium proposal</span> in minutes</h1>
              <p>Use the same structure and features from your uploaded concept, redesigned with a clean white and #f4af00 brand style.</p>
            </section>

            {error && <div className="error">⚠ {error}</div>}

            <Section title="Client Information" icon="👤">
              <div className="form-grid">
                <Field label="Client Name *" value={form.client} onChange={set("client")} placeholder="Jane Smith" />
                <Field label="Company" value={form.company} onChange={set("company")} placeholder="Acme Corp" />
                <Field label="Email" value={form.email} onChange={set("email")} placeholder="jane@company.com" type="email" />
                <Field label="Phone" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
              </div>
            </Section>

            <Section title="Project Scope" icon="🎯">
              <label className="field full"><span>Service Required *</span>
                <select value={form.service} onChange={(event) => set("service")(event.target.value)}>
                  <option value="">Select a service...</option>
                  {SERVICES.map((service) => <option key={service} value={service}>{service}</option>)}
                </select>
              </label>
              <div className="form-grid">
                <Field label="Budget USD" value={form.budget} onChange={set("budget")} placeholder="8000" type="number" />
                <Field label="Timeline" value={form.timeline} onChange={set("timeline")} placeholder="8 weeks" />
              </div>
            </Section>

            <Section title="Engagement Tier" icon="🏆">
              <div className="tier-grid">
                {TIERS.map((tier) => (
                  <button key={tier.name} className={form.tier === tier.name ? "tier selected" : "tier"} onClick={() => set("tier")(tier.name)}>
                    <span>{tier.emoji}</span><strong>{tier.name}</strong><small>{tier.tag}</small><em>{tier.price}</em>
                  </button>
                ))}
              </div>
            </Section>

            <Section title="Additional Context" icon="📝">
              <label className="field full"><span>Notes / Goals / Special Requirements</span>
                <textarea rows="4" value={form.notes} onChange={(event) => set("notes")(event.target.value)} placeholder="Describe goals, pain points, or special requirements..." />
              </label>
            </Section>

            <button className="primary" onClick={generateProposal}>✦ Generate Proposal</button>
          </>
        )}

        {page === "loading" && <section className="loading"><div className="spinner" /><h2>Crafting your proposal...</h2><p>Preparing a polished document for <strong>{form.client}</strong></p></section>}

        {page === "result" && proposal && (
          <>
            <div className="result-actions">
              <button onClick={exportMarkdown}>Download Markdown</button>
              <button onClick={exportJson}>Download JSON</button>
              <button onClick={exportText}>Download TXT</button>
            </div>
            <ProposalPreview form={form} proposal={proposal} />
          </>
        )}
      </div>

      <footer className="site-footer"><strong>Made by Hira Khyzer</strong> · Elite Era Development L.L.C · <span style={{ color: BRAND_GOLD }}>#f4af00</span></footer>
    </main>
  );
}
