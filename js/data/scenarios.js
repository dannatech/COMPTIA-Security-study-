// Worked exam-style scenarios — one per objective. Answer first, then read the step-by-step walkthrough.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.scenarios = {
  "1.1": {
    q: "A hospital cannot install endpoint protection on an MRI workstation because the vendor would void its certification. The security team places the workstation on a dedicated VLAN, allows traffic only to the PACS server, and forwards its logs to the SIEM. Which BEST describes the VLAN and ACL control?",
    c: ["Preventive, technical", "Compensating, technical", "Detective, operational", "Directive, managerial"], a: 1,
    walk: `<ol><li><b>Spot the key phrase.</b> "Cannot install endpoint protection" means the primary control is not feasible.</li>
<li><b>An alternative that reduces the same risk</b> is the definition of a <b>compensating</b> control.</li>
<li><b>Category:</b> VLANs and ACLs are enforced by network devices, so the category is <b>technical</b>.</li>
<li><b>Why not "preventive"?</b> Segmentation does prevent some traffic, but the scenario stresses that it <i>replaces</i> a control that can't be used. The exam wants "compensating".</li>
<li>The SIEM forwarding is a separate <b>detective</b> control. It's a distractor here.</li></ol>`
  },
  "1.2": {
    q: "A company moves to Zero Trust. When a user requests the payroll app, a component evaluates the user's risk score, device compliance and location, then decides to allow access with step-up MFA. Another component then configures the gateway to permit the session. Which components performed these two actions, in order?",
    c: ["PEP, then Policy Engine", "Policy Engine, then Policy Administrator", "Policy Administrator, then PEP", "Implicit trust zone, then PEP"], a: 1,
    walk: `<ol><li><b>The decision</b> (evaluating risk, device and location, then granting or denying) is made by the <b>Policy Engine</b>.</li>
<li><b>Carrying out the decision</b> (telling the gateway to set up the session, issuing tokens) is the <b>Policy Administrator</b>.</li>
<li>The <b>PEP</b> then <i>enforces</i> it in the data plane by actually passing or blocking traffic. It doesn't decide.</li>
<li>Remember: <b>PE decides → PA carries out → PEP enforces</b>.</li></ol>`
  },
  "1.3": {
    q: "An engineer disables TLS 1.0 on a load balancer during an approved window. Thirty minutes later the warehouse scanners stop working because their old firmware only supports TLS 1.0. Testing in staging passed because staging had no scanners. Which change management step MOST likely failed?",
    c: ["Maintenance window", "Backout plan", "Impact analysis / dependency identification", "Version control"], a: 2,
    walk: `<ol><li>The change was approved and done in a window, so the <b>maintenance window</b> worked.</li>
<li>The failure came from an <b>unknown dependency</b>: legacy devices relying on TLS 1.0.</li>
<li>Finding who and what depends on a system is the job of the <b>impact analysis</b>, which considers <b>dependencies</b> and <b>legacy applications</b>.</li>
<li>A <b>backout plan</b> would help them <i>recover</i>, but it isn't the step that failed to <i>prevent</i> the outage.</li></ol>`
  },
  "1.4": {
    q: "A developer must store user passwords for a web app. Attackers recently used precomputed tables and GPU cracking against a competitor. Which approach BEST protects the stored passwords?",
    c: ["Encrypt passwords with AES-256 and store the key on the web server", "Hash with SHA-256", "Use bcrypt or Argon2 with a unique salt per password", "Tokenize passwords in a vault"], a: 2,
    walk: `<ol><li>Passwords should be <b>hashed</b>, not encrypted. Encryption is reversible, and a key stored on the same server falls with it.</li>
<li>Plain SHA-256 is <b>fast</b>, which suits GPU cracking, and unsalted hashes fall to <b>rainbow tables</b>.</li>
<li>A <b>unique salt</b> defeats precomputed tables; <b>key stretching</b> (bcrypt, scrypt, Argon2, PBKDF2) makes each guess expensive.</li>
<li>Tokenization suits data you need to retrieve (card numbers), not password verification.</li></ol>`
  },
  "2.1": {
    q: "Investigators find custom malware that has lived in a defense contractor's network for two years. It exfiltrates small amounts of engineering data at night through encrypted DNS queries and uses a previously unknown exploit. Which threat actor and motivation are MOST likely?",
    c: ["Hacktivist — political beliefs", "Organized crime — financial gain", "Nation-state — espionage", "Unskilled attacker — notoriety"], a: 2,
    walk: `<ol><li><b>Two years of stealth</b> is persistence, the hallmark of an <b>APT</b>.</li>
<li>A <b>custom zero-day</b> means high resources and sophistication.</li>
<li><b>Quietly taking engineering data</b> with no ransom or public message means <b>espionage</b>.</li>
<li>Organized crime usually monetizes quickly (ransomware); hacktivists want publicity.</li></ol>`
  },
  "2.2": {
    q: "The CFO receives a call that sounds exactly like the CEO, asking for an urgent wire transfer to close a confidential acquisition. Minutes later an email arrives from the CEO's real mailbox repeating the request. Which TWO techniques are combined here?",
    c: ["Vishing and business email compromise", "Smishing and typosquatting", "Watering hole and pretexting", "Whaling and side loading"], a: 0,
    walk: `<ol><li>A <b>phone call</b> impersonating the CEO (possibly an AI voice clone) is <b>vishing</b>.</li>
<li>An email from the CEO's <b>real, compromised mailbox</b> asking for a payment is <b>business email compromise</b>.</li>
<li>Urgency and confidentiality are classic pressure tactics.</li>
<li><b>Defense:</b> out-of-band verification on a known number, dual approval for wires, MFA on mailboxes.</li></ol>`
  },
  "2.3": {
    q: "A web app fetches a profile picture from a user-supplied URL. A tester submits http://169.254.169.254/latest/meta-data/iam/ and receives cloud access keys in the response. Which vulnerability is this, and what is the BEST mitigation?",
    c: ["XSS — output encoding", "CSRF — anti-CSRF tokens", "SSRF — allow-list destinations and block internal/metadata addresses", "Directory traversal — chroot the web server"], a: 2,
    walk: `<ol><li>The <b>server</b> makes a request to a URL the attacker chooses. That is <b>Server-Side Request Forgery</b>.</li>
<li>169.254.169.254 is the cloud <b>instance metadata service</b>, a classic SSRF target that can leak credentials.</li>
<li><b>Mitigations:</b> allow-list permitted destinations, block private and link-local ranges, use IMDSv2 (session tokens), and limit IAM role permissions.</li>
<li>CSRF is the <i>user's browser</i> sending forged requests, so it doesn't fit.</li></ol>`
  },
  "2.4": {
    q: "The SIEM shows: 1,200 failed logins across 400 accounts from one IP in 10 minutes, each account tried with 'Autumn2026!'; one success for svc_backup; then svc_backup creating a new domain admin account. What happened, in order?",
    c: ["Brute force, then lateral movement", "Password spraying, then privilege escalation/persistence", "Credential stuffing, then DDoS", "Impossible travel, then data exfiltration"], a: 1,
    walk: `<ol><li><b>One password across hundreds of accounts</b> from one source is <b>password spraying</b>. It stays under lockout thresholds.</li>
<li>The <b>success</b> on svc_backup means a weak service-account password was found.</li>
<li><b>Creating a domain admin</b> is <b>privilege escalation</b> and <b>persistence</b>.</li>
<li><b>Respond:</b> disable both accounts, reset credentials, check for other changes, enforce MFA and long passwords for service accounts (or use managed service accounts).</li></ol>`
  },
  "2.5": {
    q: "A vulnerability is announced in a VPN appliance and is being actively exploited. The vendor patch will not be available for 5 days. Which is the BEST immediate action?",
    c: ["Wait for the patch", "Apply vendor-recommended mitigations, restrict the management interface, and increase monitoring until patched", "Decommission all remote access permanently", "Buy cyber insurance"], a: 1,
    walk: `<ol><li>Patching is ideal but <b>not yet possible</b>, so use <b>compensating controls</b>.</li>
<li>Apply vendor workarounds, restrict exposure (management only from admin networks), use segmentation or isolation where possible, and add <b>monitoring</b> for exploitation indicators.</li>
<li>Then <b>patch as soon as it's released</b> and validate with a rescan.</li>
<li>Insurance transfers financial loss but doesn't stop the attack.</li></ol>`
  },
  "3.1": {
    q: "A company runs its app on IaaS VMs. An audit finds an unpatched guest OS, a storage bucket set to public, and an outdated hypervisor. Which issues are the CUSTOMER responsible for?",
    c: ["All three", "Guest OS and storage bucket", "Hypervisor only", "Storage bucket only"], a: 1,
    walk: `<ol><li>In <b>IaaS</b>, the provider manages facilities, hardware and the <b>hypervisor</b>.</li>
<li>The customer manages the <b>guest OS</b>, applications, data and <b>configurations</b> such as bucket permissions.</li>
<li>So the guest OS and the public bucket are the customer's problems; the hypervisor is the provider's.</li>
<li>Misconfigured storage is one of the most common real-world cloud breaches.</li></ol>`
  },
  "3.2": {
    q: "You must place: a public e-commerce web server, its database, and an IPS that must stop attacks but keep the store online if the IPS fails. Which design is BEST?",
    c: ["Web and DB in the DMZ; IPS passive on a SPAN port", "Web in the DMZ, DB internal; IPS inline configured fail-open", "Both internal; IPS inline fail-closed", "Web internal, DB in the DMZ; IDS inline"], a: 1,
    walk: `<ol><li>Internet-facing services go in the <b>screened subnet (DMZ)</b>; the database stays <b>internal</b>, reachable only from the web tier on its port.</li>
<li>To <b>stop</b> attacks the device must be <b>inline</b> and active, which means an IPS, not an IDS on a SPAN port.</li>
<li>"Keep the store online if it fails" means <b>fail-open</b> (availability first).</li>
<li>Fail-closed would suit something like a high-security admin network.</li></ol>`
  },
  "3.3": {
    q: "A retailer wants developers to test with production-like customer data, keep card numbers out of PCI scope in the order system, and protect laptops if stolen. Match the controls in order:",
    c: ["Masking; tokenization; full-disk encryption", "Hashing; masking; TLS", "Tokenization; hashing; steganography", "Encryption; masking; DLP"], a: 0,
    walk: `<ol><li><b>Test data</b> that looks real but isn't: <b>masking/obfuscation</b>.</li>
<li><b>Reduce PCI scope</b> by replacing card numbers with tokens and keeping the real numbers in a vault: <b>tokenization</b>.</li>
<li><b>Stolen laptop</b> means data at rest: <b>full-disk encryption</b>.</li>
<li>TLS protects data <i>in transit</i>, so it doesn't fit any of these three needs.</li></ol>`
  },
  "3.4": {
    q: "A server gets a full backup on Sunday and differential backups Monday to Saturday at 23:00. It fails Friday at 09:00. The RPO is 24 hours. Which backups are needed to restore, and is the RPO met?",
    c: ["Full + Mon–Thu differentials; RPO not met", "Full + Thursday differential; RPO met (10 hours lost)", "Thursday differential only; RPO met", "Full only; RPO not met"], a: 1,
    walk: `<ol><li><b>Differentials</b> contain all changes since the last <b>full</b>, so the restore needs only the full + the <b>latest</b> differential (Thursday 23:00).</li>
<li>Data lost: Thursday 23:00 to Friday 09:00 = <b>10 hours</b>.</li>
<li>10 hours is within the 24-hour <b>RPO</b>, so it's met.</li>
<li>With <i>incrementals</i>, you'd need the full plus Monday through Thursday.</li></ol>`
  },
  "4.1": {
    q: "A company rolls out new laptops and phones. Requirements: consistent hardened settings, detecting drift, separating corporate and personal data on employee-owned phones, and the strongest Wi-Fi security against password cracking. Which set fits BEST?",
    c: ["Golden image/GPO baseline; MDM with containerization; WPA3 with SAE", "Manual setup; jailbreak detection; WPA2-PSK", "Antivirus only; remote wipe; WEP", "IaC; side loading; open Wi-Fi with captive portal"], a: 0,
    walk: `<ol><li>Consistent settings with drift detection: a <b>secure baseline</b> deployed through images or GPO and monitored.</li>
<li>Separating corporate and personal data on BYOD: <b>MDM containerization</b>.</li>
<li>Resisting offline password cracking: <b>WPA3 / SAE</b>.</li></ol>`
  },
  "4.2": {
    q: "A company is retiring 200 laptops with SSDs. Some will be donated; drives from the finance team must never leave the building intact. Auditors need proof. What is the BEST approach?",
    c: ["Degauss all drives", "Crypto-erase donated drives; physically shred finance drives; obtain certificates of sanitization/destruction", "Format all drives", "Delete user profiles and donate all"], a: 1,
    walk: `<ol><li><b>Degaussing doesn't work on SSDs</b> (flash memory, not magnetic).</li>
<li>For reuse, <b>sanitize</b>: crypto-erase or a secure-erase command.</li>
<li>For high-sensitivity drives, <b>destroy</b> them (shred or pulverize).</li>
<li>Auditors need <b>certification</b> documents. Formatting leaves data recoverable.</li></ol>`
  },
  "4.3": {
    q: "A scan reports: CVE-A (CVSS 9.8) on an isolated lab server with no network access, and CVE-B (CVSS 7.5) on the internet-facing customer portal with a public exploit. Which should be remediated FIRST and why?",
    c: ["CVE-A, because its CVSS is higher", "CVE-B, because exposure and exploitability make its real risk higher", "Neither; accept both", "Both at the same time regardless of resources"], a: 1,
    walk: `<ol><li>CVSS <b>base scores</b> ignore your environment.</li>
<li><b>Environmental factors</b> matter: CVE-B is internet-facing, has a public exploit, and affects a critical customer system.</li>
<li>CVE-A is isolated, so its <b>exposure</b> is very low.</li>
<li>Prioritize CVE-B, then schedule CVE-A, and <b>validate</b> each fix with a rescan.</li></ol>`
  },
  "4.4": {
    q: "Analysts get 3,000 alerts a day from a SIEM rule for 'failed login', and real attacks are being missed. What should the team do FIRST?",
    c: ["Disable the rule", "Tune the rule (thresholds, correlation, context) to cut false positives without creating false negatives", "Buy a second SIEM", "Archive all alerts"], a: 1,
    walk: `<ol><li>Alert fatigue causes <b>missed true positives</b>.</li>
<li><b>Alert tuning</b>: raise thresholds (for example 20 failures from one source in 5 minutes), correlate failures followed by a success, and add context such as geography or asset criticality.</li>
<li>Disabling the rule creates <b>false negatives</b>, a blind spot.</li></ol>`
  },
  "4.5": {
    q: "A firewall has: 1) ALLOW any → web TCP 443; 2) DENY 198.51.100.7 → any; 3) DENY any → any. Attacks from 198.51.100.7 against the web server on 443 still succeed. What is the fix?",
    c: ["Add another DENY at the bottom", "Move rule 2 above rule 1", "Change rule 3 to ALLOW", "Delete rule 1"], a: 1,
    walk: `<ol><li>Rules are evaluated <b>top-down; the first match wins</b>.</li>
<li>Traffic from 198.51.100.7 to the web server on 443 matches <b>rule 1</b> first and is allowed. Rule 2 is never reached.</li>
<li>Put the <b>more specific DENY above</b> the broader ALLOW.</li>
<li>Deleting rule 1 would break the website for everyone.</li></ol>`
  },
  "4.6": {
    q: "Requirements: employees use one login for all SaaS apps; contractors' access must expire automatically; admins get domain admin only for approved tasks for 2 hours. Which combination fits?",
    c: ["SAML SSO; time-based account expiration; just-in-time PAM", "LDAP; DAC; shared admin account", "OAuth only; MAC; permanent admin", "RADIUS; rule-based; password vaulting only"], a: 0,
    walk: `<ol><li>One login across SaaS apps: <b>SSO via SAML</b> (or OIDC) federation.</li>
<li>Contractor access that ends automatically: account expiration as part of <b>deprovisioning</b>.</li>
<li>Temporary elevation: <b>just-in-time</b> permissions through PAM.</li>
<li>Shared admin accounts break accountability and should never be the answer.</li></ol>`
  },
  "4.7": {
    q: "A SOC wants: when EDR flags ransomware behavior, automatically isolate the host, disable the user's account, open a ticket, and page on-call. Which technology and what is a key risk?",
    c: ["SOAR playbook; risk of automation errors or a single point of failure", "SIEM dashboard; risk of slow manual response", "NetFlow; risk of payload loss", "CASB; risk of shadow IT"], a: 0,
    walk: `<ol><li>Orchestrating actions across EDR, identity, ticketing and paging is a <b>SOAR</b> playbook.</li>
<li>Benefits: <b>faster reaction time</b> and a workforce multiplier.</li>
<li>Risks: <b>complexity</b>, a playbook bug isolating critical servers, a <b>single point of failure</b>, and <b>technical debt</b>. Test playbooks and add approval gates for high-impact steps.</li></ol>`
  },
  "4.8": {
    q: "An analyst confirms ransomware on a file server that is still powered on and encrypting. Legal says litigation is likely. Which sequence is BEST?",
    c: ["Power off, re-image, restore", "Isolate from the network, capture memory, image disk with a write blocker and hashes, maintain chain of custody, then eradicate", "Pay the ransom, then investigate", "Run antivirus, then lessons learned"], a: 1,
    walk: `<ol><li><b>Containment</b> first: isolate the network connection to stop the spread, but keep the machine running.</li>
<li><b>Order of volatility</b>: capture <b>RAM</b> before anything else (keys and processes may be in memory).</li>
<li>Image the disk with a <b>write blocker</b>, <b>hash</b> it, and keep <b>chain of custody</b>, because litigation is likely (<b>legal hold</b>).</li>
<li>Then <b>eradicate</b>, <b>recover</b> from clean backups, and hold a <b>lessons learned</b> review.</li></ol>`
  },
  "4.9": {
    q: "A workstation beaconed to a known C2 IP every 60 seconds. You must determine which program made the connections and who was logged in. Which data source is BEST?",
    c: ["Perimeter firewall logs", "NetFlow", "Endpoint/EDR logs (process and user telemetry)", "Vulnerability scan report"], a: 2,
    walk: `<ol><li>Firewall logs and NetFlow show <b>that</b> the host connected, but not <b>which process</b> did.</li>
<li><b>Endpoint logs</b> (EDR, Sysmon event 3) link network connections to the <b>process</b> and the <b>user</b>.</li>
<li>Combine with the firewall logs for the timeline, then contain the host.</li></ol>`
  },
  "5.1": {
    q: "Which document would say: 'Step 1: Disable the user's account in AD. Step 2: Collect the laptop. Step 3: Revoke VPN certificates...'?",
    c: ["Policy", "Standard", "Procedure (offboarding)", "Guideline"], a: 2,
    walk: `<ol><li>Step-by-step instructions are a <b>procedure</b>.</li>
<li>The policy would say "Access must be removed promptly on termination."</li>
<li>A standard would say "Accounts are disabled within 1 hour of termination."</li>
<li>A guideline would only recommend.</li></ol>`
  },
  "5.2": {
    q: "A data center (AV $2,000,000) faces floods that would cause 25% damage. Floods occur once every 20 years. A flood barrier costs $15,000/year and reduces the EF to 5%. Is the barrier cost-effective?",
    c: ["Yes — ALE drops by $20,000/year, a net benefit of $5,000/year after the barrier's cost", "Yes — it saves $25,000/year net", "No — it costs more than it saves", "Cannot be calculated without the MTTR"], a: 0,
    walk: `<ol><li><b>Before:</b> SLE = 2,000,000 × 0.25 = $500,000. ARO = 1/20 = 0.05. ALE = $25,000.</li>
<li><b>After:</b> SLE = 2,000,000 × 0.05 = $100,000. ALE = 100,000 × 0.05 = $5,000.</li>
<li><b>Savings</b> = 25,000 − 5,000 = $20,000/year; <b>net</b> = 20,000 − 15,000 = <b>$5,000/year</b>. It's cost-effective, but only just.</li>
<li>The strategy is <b>mitigation</b> (it reduces impact).</li></ol>`
  },
  "5.3": {
    q: "Before outsourcing payroll, a company wants to: verify the vendor's controls without visiting, keep the right to inspect later, guarantee 99.9% uptime, and prevent disclosure of employee data. Which items cover these?",
    c: ["SOC 2 Type II report; right-to-audit clause; SLA; NDA", "MOU; BPA; SOW; MSA", "Pen test; MOU; MSA; WO", "Questionnaire only"], a: 0,
    walk: `<ol><li>Verify controls remotely: an <b>independent assessment</b> such as a SOC 2 Type II report.</li>
<li>The right to inspect later: a <b>right-to-audit clause</b>.</li>
<li>Uptime guarantee: an <b>SLA</b>.</li>
<li>Confidentiality: an <b>NDA</b>, along with data protection terms.</li></ol>`
  },
  "5.4": {
    q: "A company knew from its risk assessment that its customer database was unencrypted, but did nothing for two years before a breach. Regulators fined it. Which principle did it fail?",
    c: ["Due diligence", "Due care", "Attestation", "Right to be forgotten"], a: 1,
    walk: `<ol><li><b>Due diligence</b> (researching and identifying the risk) happened, because the assessment found it.</li>
<li><b>Due care</b> (acting reasonably to protect) did <b>not</b> happen.</li>
<li>Consequences of non-compliance: fines, reputational damage, possibly sanctions.</li></ol>`
  },
  "5.5": {
    q: "A bank hires testers. They get only the bank's name, may attempt physical entry, and must coordinate live with the SOC so detections improve during the test. Which terms describe this engagement?",
    c: ["Known environment; red team only", "Unknown environment; physical testing; purple team", "Partially known; blue team", "Vulnerability scan; passive recon"], a: 1,
    walk: `<ol><li>Only the name is given, so this is an <b>unknown environment</b> (black box).</li>
<li>Attempting building entry is <b>physical</b> penetration testing.</li>
<li>Live collaboration with defenders is a <b>purple team</b>.</li>
<li>The rules of engagement must explicitly authorize physical testing.</li></ol>`
  },
  "5.6": {
    q: "After 6 months of phishing simulations, the click rate is unchanged at 18% but the report rate rose from 5% to 40%. How should the program be judged, and what is the next step?",
    c: ["Failure; stop the program", "Partially successful; keep going, add targeted training for repeat clickers and reward reporting", "Success; no further action", "Punish everyone who clicked"], a: 1,
    walk: `<ol><li>Rising <b>report rates</b> is a big win: users now act as sensors, and the SOC learns about phishing faster.</li>
<li>A flat <b>click rate</b> means recognition still needs work.</li>
<li>Next: targeted, just-in-time training for repeat clickers, varied simulations, and positive reinforcement.</li>
<li>Punishment discourages reporting and is counterproductive.</li></ol>`
  }
};
