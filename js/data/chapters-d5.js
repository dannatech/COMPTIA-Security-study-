// In-depth chapters — Domain 5: Security Program Management and Oversight.
window.SECPLUS = window.SECPLUS || {};
SECPLUS.chapters = SECPLUS.chapters || {};

SECPLUS.chapters["5.1"] = {
  overview: "Governance is the framework of documents, structures and roles that direct a security program. You need to tell policies, standards, procedures and guidelines apart, and know each data role.",
  sections: [
    { h: "The document hierarchy", html: `
<table class="data"><thead><tr><th>Document</th><th>Mandatory?</th><th>Example</th></tr></thead><tbody>
<tr><td><b>Policy</b></td><td>Yes, high-level intent</td><td>"All sensitive data must be encrypted."</td></tr>
<tr><td><b>Standard</b></td><td>Yes, specific requirements</td><td>"Use AES-256; passwords are at least 14 characters."</td></tr>
<tr><td><b>Procedure</b></td><td>Yes, step-by-step how-to</td><td>Onboarding/offboarding steps, change management steps, incident <b>playbooks</b></td></tr>
<tr><td><b>Guideline</b></td><td>No, recommendations</td><td>"Consider locking your screen when you step away."</td></tr>
</tbody></table>
<p><b>Common policies</b>: Acceptable Use (AUP), information security, business continuity, disaster recovery, incident response, software development life cycle (SDLC), change management.</p>
<p><b>Common standards</b>: password, access control, physical security, encryption.</p>` },
    { h: "External considerations and governance structures", html: `
<p>Programs must satisfy <b>regulatory</b> (HIPAA, GDPR, SOX), <b>legal</b>, <b>industry</b> (PCI DSS), <b>local/regional</b>, <b>national</b> and <b>global</b> requirements. Documents need regular <b>monitoring and revision</b>.</p>
<p><b>Governance structures</b>: <b>boards</b>, <b>committees</b>, <b>government entities</b>; <b>centralized</b> (one team sets policy for everything, consistent) vs. <b>decentralized</b> (business units decide, flexible but inconsistent).</p>` },
    { h: "Roles for systems and data", html: `
<table class="data"><thead><tr><th>Role</th><th>Responsibility</th></tr></thead><tbody>
<tr><td><b>Owner</b></td><td>Senior person accountable for the data: classifies it and approves access</td></tr>
<tr><td><b>Controller</b></td><td>Determines why and how personal data is processed (privacy law)</td></tr>
<tr><td><b>Processor</b></td><td>Processes data on the controller's behalf (for example a SaaS vendor)</td></tr>
<tr><td><b>Custodian/steward</b></td><td>Day-to-day protection and quality: backups, permissions, labeling</td></tr>
</tbody></table>` }
  ],
  tips: [
    "Step-by-step: procedure. Specific mandatory number: standard. Optional advice: guideline.",
    "A vendor acting on your instructions is a processor; you are the controller."
  ],
  traps: [
    "Calling a guideline mandatory.",
    "Mixing up owner (accountable) with custodian (hands-on)."
  ]
};

SECPLUS.chapters["5.2"] = {
  overview: "Risk management is one of the most calculation-heavy topics. Know the process, the qualitative and quantitative formulas, the response strategies, and the business impact metrics.",
  sections: [
    { h: "Identification, assessment and analysis", html: `
<ul>
<li><b>Risk identification</b>: find assets, threats and vulnerabilities.</li>
<li><b>Assessment types</b>: <b>ad hoc</b> (as needed), <b>recurring</b> (scheduled), <b>one-time</b> (for a project), <b>continuous</b> (automated, ongoing).</li>
<li><b>Qualitative analysis</b>: ratings (High/Medium/Low) from likelihood × impact, often on a heat map.</li>
<li><b>Quantitative analysis</b>: dollar values.</li>
</ul>` },
    { h: "Quantitative formulas", html: `
<div class="formula">SLE = AV × EF</div>
<div class="formula">ALE = SLE × ARO</div>
<ul>
<li><b>AV</b>: asset value. <b>EF</b>: exposure factor, the percentage of value lost per event.</li>
<li><b>SLE</b>: single loss expectancy, the cost of one event.</li>
<li><b>ARO</b>: annualized rate of occurrence (once every 4 years = 0.25; 3 times a year = 3).</li>
<li><b>ALE</b>: annualized loss expectancy, the expected yearly cost.</li>
</ul>
<p><b>Worked example</b>: AV $200,000, EF 40% gives SLE $80,000. ARO 0.5 gives ALE $40,000. A control costing $15,000 a year that cuts the ARO to 0.1 gives a new ALE of $8,000. Value = 40,000 − 8,000 − 15,000 = <b>$17,000 a year</b>, so it is worth buying.</p>` },
    { h: "Risk register, appetite and tolerance", html: `
<ul>
<li><b>Risk register</b>: each risk with its <b>owner</b>, likelihood, impact, response and status, plus <b>key risk indicators (KRIs)</b> that warn when a risk is growing, and <b>risk thresholds</b>.</li>
<li><b>Risk appetite</b>: how much risk the organization will pursue: <b>expansionary</b> (accepts more for growth), <b>conservative</b> (minimal), or <b>neutral</b>.</li>
<li><b>Risk tolerance</b>: acceptable variation around a specific risk.</li>
</ul>` },
    { h: "Risk management strategies", html: `
<ul>
<li><b>Transfer</b>: shift the impact to a third party (insurance, outsourcing by contract).</li>
<li><b>Accept</b>: acknowledge and do nothing, using a documented <b>exemption</b> or <b>exception</b>.</li>
<li><b>Avoid</b>: stop the risky activity entirely.</li>
<li><b>Mitigate</b>: reduce likelihood or impact with controls.</li>
</ul>
<p>Residual risk (what remains after controls) must stay within the appetite.</p>` },
    { h: "Business impact analysis", html: `
<table class="data"><thead><tr><th>Metric</th><th>Meaning</th></tr></thead><tbody>
<tr><td><b>RTO</b></td><td>Recovery Time Objective: the maximum tolerable downtime before service must be restored</td></tr>
<tr><td><b>RPO</b></td><td>Recovery Point Objective: the maximum tolerable data loss measured in time (drives backup frequency)</td></tr>
<tr><td><b>MTTR</b></td><td>Mean Time To Repair: average time to fix something</td></tr>
<tr><td><b>MTBF</b></td><td>Mean Time Between Failures: average time between failures (reliability)</td></tr>
</tbody></table>
<p>If backups run every 6 hours, the worst-case data loss is 6 hours, so the RPO can be no better than 6 hours.</p>` }
  ],
  tips: [
    "Always calculate SLE first, then ALE.",
    "Insurance: transfer. Stop doing it: avoid. Add controls: mitigate. Do nothing, documented: accept.",
    "How much data can we lose: RPO. How long can we be down: RTO."
  ],
  traps: [
    "Using ARO = 4 for 'once every 4 years'. It's 1/4 = 0.25.",
    "Mixing up RTO and RPO."
  ]
};

SECPLUS.chapters["5.3"] = {
  overview: "Your security depends on your vendors' security. This objective covers how to assess vendors, select and monitor them, and the agreements that bind them.",
  sections: [
    { h: "Vendor assessment and selection", html: `
<ul>
<li><b>Penetration testing</b> of vendor systems (with permission).</li>
<li><b>Right-to-audit clause</b>: a contractual right to audit the vendor.</li>
<li><b>Evidence of internal audits</b> and <b>independent assessments</b> (SOC 2 Type II, ISO 27001 certification).</li>
<li><b>Supply chain analysis</b>: the vendor's own suppliers and hardware provenance.</li>
<li><b>Due diligence</b>: investigate financial health, security posture and breach history before signing.</li>
<li><b>Conflict of interest</b>: identify relationships that could bias selection.</li>
<li><b>Vendor monitoring</b> and <b>questionnaires</b>: ongoing assessment.</li>
<li><b>Rules of engagement</b>: the scope and limits for testing or interaction.</li>
</ul>` },
    { h: "Agreement types", html: `
<table class="data"><thead><tr><th>Agreement</th><th>Purpose</th></tr></thead><tbody>
<tr><td><b>SLA</b></td><td>Measurable service levels (uptime, response time) and penalties</td></tr>
<tr><td><b>MOA</b></td><td>Memorandum of Agreement: documents cooperation; more formal and may be binding</td></tr>
<tr><td><b>MOU</b></td><td>Memorandum of Understanding: statement of intent, usually not legally binding</td></tr>
<tr><td><b>MSA</b></td><td>Master Service Agreement: umbrella terms for future work</td></tr>
<tr><td><b>WO/SOW</b></td><td>Work Order / Statement of Work: specific deliverables, timeline and scope</td></tr>
<tr><td><b>NDA</b></td><td>Non-Disclosure Agreement: confidentiality obligation</td></tr>
<tr><td><b>BPA</b></td><td>Business Partners Agreement: profit sharing, responsibilities, decision making between partners</td></tr>
</tbody></table>` }
  ],
  tips: [
    "Want to audit the vendor yourself: right-to-audit clause.",
    "99.9% uptime guarantee: SLA. Project deliverables: SOW. Umbrella terms: MSA."
  ],
  traps: [
    "Assuming an MOU is a binding contract."
  ]
};

SECPLUS.chapters["5.4"] = {
  overview: "Compliance means proving you meet your obligations. Know the reporting and monitoring concepts, the consequences of non-compliance, and the privacy concepts that GDPR made famous.",
  sections: [
    { h: "Reporting and consequences", html: `
<p><b>Compliance reporting</b> is <b>internal</b> (to management or the board) or <b>external</b> (to regulators, auditors, customers).</p>
<p><b>Consequences of non-compliance</b>: <b>fines</b>, <b>sanctions</b>, <b>reputational damage</b>, <b>loss of license</b> (for example losing the ability to process cards), and <b>contractual impacts</b>.</p>` },
    { h: "Compliance monitoring", html: `
<ul>
<li><b>Due diligence</b>: investigating and understanding risks and obligations.</li>
<li><b>Due care</b>: acting on that knowledge with ongoing reasonable protection.</li>
<li><b>Attestation and acknowledgement</b>: formal statements that controls exist, or that users read the policies.</li>
<li><b>Internal and external</b> monitoring.</li>
<li><b>Automation</b>: continuous compliance checks (cloud posture tools, SCAP).</li>
</ul>` },
    { h: "Privacy", html: `
<ul>
<li>Legal implications at <b>local/regional, national and global</b> levels.</li>
<li><b>Data subject</b>: the person the data is about. <b>Controller vs. processor</b> (see 5.1).</li>
<li><b>Ownership</b>, <b>data inventory and retention</b>: know what personal data you hold, where, and for how long.</li>
<li><b>Right to be forgotten</b>: the GDPR right to erasure of personal data.</li>
</ul>` }
  ],
  tips: [
    "Due diligence = research. Due care = action.",
    "A customer demands their data be deleted: right to be forgotten."
  ],
  traps: [
    "Swapping due diligence and due care."
  ]
};

SECPLUS.chapters["5.5"] = {
  overview: "Audits verify that controls work; penetration tests prove what an attacker could do. Know the audit types, team colors, environment knowledge levels and reconnaissance types.",
  sections: [
    { h: "Attestation and audits", html: `
<ul>
<li><b>Attestation</b>: a formal opinion that controls are in place and effective.</li>
<li><b>Internal</b>: compliance checks, an <b>audit committee</b> (board-level oversight that keeps internal audit independent), <b>self-assessments</b>.</li>
<li><b>External</b>: <b>regulatory</b> audits and <b>examinations</b>, independent <b>assessments</b>, <b>independent third-party audits</b> (for example a SOC 2 report).</li>
</ul>` },
    { h: "Penetration testing", html: `
<ul>
<li><b>Physical</b>: tailgating, lock picking, badge cloning.</li>
<li><b>Offensive (red team)</b>: attacks. <b>Defensive (blue team)</b>: defends. <b>Integrated (purple team)</b>: both work together and share findings.</li>
<li><b>Known environment</b> (white box): full information. <b>Partially known</b> (gray box): some information. <b>Unknown</b> (black box): no information, mimicking an outside attacker.</li>
<li>Typical flow: rules of engagement → reconnaissance → exploitation → <b>lateral movement/pivoting</b> → persistence → cleanup → report.</li>
</ul>` },
    { h: "Reconnaissance", html: `
<p><b>Passive</b>: gather information without touching the target's systems (OSINT, social media, public DNS and WHOIS, job postings). <b>Active</b>: interact directly (port scans, banner grabbing, vulnerability scans), which can be detected.</p>` }
  ],
  tips: [
    "Tester given credentials and diagrams: known environment.",
    "Red and blue sharing in real time: purple team.",
    "Nmap against the target: active recon. Googling employees: passive."
  ],
  traps: [
    "Calling a vulnerability scan a penetration test. A pen test exploits; a scan only identifies."
  ]
};

SECPLUS.chapters["5.6"] = {
  overview: "People are both the biggest risk and the best sensors. An effective awareness program trains, tests, measures and improves.",
  sections: [
    { h: "Phishing programs", html: `
<ul>
<li><b>Campaigns</b>: simulated phishing at regular intervals.</li>
<li><b>Recognizing a phishing attempt</b>: urgency, mismatched sender or link domains, unexpected attachments, requests for credentials or payment, poor grammar, too-good-to-be-true offers.</li>
<li><b>Responding to reported suspicious messages</b>: an easy report button, quick SOC triage, and feedback to the reporter.</li>
<li><b>Metrics</b>: click rate going down and report rate going up show improvement.</li>
</ul>` },
    { h: "Behavior recognition and training topics", html: `
<p><b>Anomalous behavior</b>: <b>risky</b> (deliberately bypassing controls), <b>unexpected</b> (unusual access times or data volumes), <b>unintentional</b> (mistakes, such as sending data to the wrong recipient).</p>
<p><b>Training topics</b>: policies and handbooks, situational awareness, insider threat, password management, removable media and cables (never plug in found USBs), social engineering, <b>operational security (OPSEC)</b>, and hybrid/remote work.</p>` },
    { h: "Reporting, monitoring and program life cycle", html: `
<p>Track results <b>initially</b> (baseline) and on a <b>recurring</b> basis. Program life cycle: <b>development</b> (assess needs, build content) → <b>execution</b> (deliver, test, measure) → refine based on results.</p>` }
  ],
  tips: [
    "Best measure of program success: reduced click rates and increased reporting.",
    "Found USB drive: hand it to security without plugging it in."
  ],
  traps: [
    "Thinking the goal of phishing simulations is to punish users. The goal is education and measurement."
  ]
};
