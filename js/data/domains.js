// CompTIA Security+ SY0-701 exam domains, weights and condensed objective notes.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.examInfo = {
  code: "SY0-701",
  maxQuestions: 90,
  minutes: 90,
  passingScore: "750 (on a 100–900 scale)",
  questionTypes: "Multiple choice and performance-based questions (PBQs)"
};

SECPLUS.domains = [
  {
    id: 1,
    name: "General Security Concepts",
    weight: 12,
    color: "var(--d1)",
    objectives: [
      {
        id: "1.1",
        title: "Compare and contrast various types of security controls",
        points: [
          "Categories: <b>Technical</b> (firewalls, encryption), <b>Managerial</b> (policies, risk assessments), <b>Operational</b> (guards, awareness training — carried out by people), <b>Physical</b> (locks, fences, bollards).",
          "Control types: <b>Preventive</b> (stops an event), <b>Deterrent</b> (discourages), <b>Detective</b> (identifies/logs), <b>Corrective</b> (fixes after the fact, e.g. restore backup), <b>Compensating</b> (alternate when the primary control isn't possible), <b>Directive</b> (tells people what to do, e.g. policy, signage).",
          "One control can belong to a category AND a type — e.g. a security guard is operational + preventive/deterrent."
        ]
      },
      {
        id: "1.2",
        title: "Summarize fundamental security concepts",
        points: [
          "<b>CIA triad</b>: Confidentiality (encryption, access control), Integrity (hashing, signatures), Availability (redundancy, patching).",
          "<b>Non-repudiation</b>: proof of origin/integrity — digital signatures.",
          "<b>AAA</b>: Authentication, Authorization, Accounting. Authenticate people, systems and devices (certificates).",
          "<b>Gap analysis</b>: compare current state to a desired baseline/framework.",
          "<b>Zero Trust</b>: never trust, always verify. Control plane (adaptive identity, threat scope reduction, policy-driven access control, Policy Engine, Policy Administrator) vs. Data plane (implicit trust zones, subject/system, Policy Enforcement Point).",
          "<b>Physical security</b>: bollards, access control vestibules (mantraps), fencing, video surveillance, guards, badges, lighting; sensors — infrared, pressure, microwave, ultrasonic.",
          "<b>Deception & disruption</b>: honeypot (single decoy system), honeynet (network of them), honeyfile (bait file), honeytoken (fake data/credential that alerts when used)."
        ]
      },
      {
        id: "1.3",
        title: "Explain the importance of change management processes and the impact to security",
        points: [
          "Business processes: approval process, ownership, stakeholders, impact analysis, test results, backout plan, maintenance window, standard operating procedure.",
          "Technical implications: allow/deny lists, restricted activities, downtime, service/application restarts, legacy applications, dependencies.",
          "Documentation: update diagrams and policies/procedures; use <b>version control</b>.",
          "A change advisory board (CAB) reviews and approves changes."
        ]
      },
      {
        id: "1.4",
        title: "Explain the importance of using appropriate cryptographic solutions",
        points: [
          "<b>PKI</b>: public/private key pairs, Certificate Authority (CA), key escrow (third party holds keys).",
          "Encryption levels: full-disk, partition, file, volume, database, record; transport/communication (TLS, IPsec).",
          "<b>Symmetric</b> (one shared key; fast; AES, 3DES, ChaCha20) vs. <b>Asymmetric</b> (key pair; RSA, ECC, Diffie-Hellman for key exchange).",
          "Tools: <b>TPM</b> (chip on motherboard; stores keys, measured boot), <b>HSM</b> (dedicated hardware for key management at scale), <b>KMS</b> (key management system, often cloud), <b>Secure enclave</b> (isolated processor area).",
          "Obfuscation: steganography (hide data in other data), tokenization (replace with token; mapping kept in a vault), data masking (hide part, e.g. ***-**-1234).",
          "<b>Hashing</b> (one-way; SHA-256) for integrity; <b>salting</b> defeats rainbow tables; <b>key stretching</b> (PBKDF2, bcrypt) slows brute force.",
          "<b>Digital signature</b> = hash encrypted with sender's private key → integrity, authentication, non-repudiation.",
          "Blockchain / open public ledger: distributed, tamper-evident record.",
          "Certificates: CA, CRL & OCSP (revocation checks; OCSP stapling), self-signed, third-party, root of trust, CSR generation, wildcard (*.example.com), SAN (multiple names)."
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Threats, Vulnerabilities, and Mitigations",
    weight: 22,
    color: "var(--d2)",
    objectives: [
      {
        id: "2.1",
        title: "Compare and contrast common threat actors and motivations",
        points: [
          "Actors: <b>Nation-state</b> (APT, highest resources), <b>Unskilled attacker</b> (script kiddie), <b>Hacktivist</b> (philosophical/political), <b>Insider threat</b>, <b>Organized crime</b> (financial), <b>Shadow IT</b> (unsanctioned systems).",
          "Attributes: internal vs. external, resources/funding, level of sophistication.",
          "Motivations: data exfiltration, espionage, service disruption, blackmail, financial gain, philosophical/political beliefs, ethical, revenge, disruption/chaos, war."
        ]
      },
      {
        id: "2.2",
        title: "Explain common threat vectors and attack surfaces",
        points: [
          "Message-based: email, SMS (smishing), instant messaging. Image-based, file-based, voice call (vishing), removable devices.",
          "Vulnerable software: client-based vs. agentless. Unsupported systems and applications.",
          "Unsecure networks: wireless, wired, Bluetooth. Open service ports. Default credentials.",
          "Supply chain: managed service providers (MSPs), vendors, suppliers.",
          "Human vectors / social engineering: phishing, vishing, smishing, misinformation/disinformation, impersonation, business email compromise (BEC), pretexting, watering hole, brand impersonation, typosquatting."
        ]
      },
      {
        id: "2.3",
        title: "Explain various types of vulnerabilities",
        points: [
          "Application: memory injection, <b>buffer overflow</b>, race conditions (TOC/TOU), malicious update.",
          "OS-based, web-based: <b>SQL injection</b> (SQLi), <b>cross-site scripting</b> (XSS).",
          "Hardware: firmware, end-of-life, legacy. Virtualization: <b>VM escape</b>, resource reuse.",
          "Cloud-specific, supply chain (service/hardware/software provider), cryptographic, misconfiguration.",
          "Mobile device: side loading, jailbreaking. <b>Zero-day</b>: unknown to vendor, no patch yet."
        ]
      },
      {
        id: "2.4",
        title: "Given a scenario, analyze indicators of malicious activity",
        points: [
          "Malware: ransomware, trojan, worm (self-replicating), spyware, bloatware, virus, keylogger, logic bomb, rootkit.",
          "Physical: brute force, RFID cloning, environmental. Network: DDoS (amplified, reflected), DNS attacks, wireless, on-path, credential replay, malicious code.",
          "Application: injection, buffer overflow, replay, privilege escalation, forgery (CSRF/SSRF), directory traversal.",
          "Cryptographic: downgrade, collision, birthday. Password: spraying (one password, many accounts), brute force.",
          "Indicators: account lockout, concurrent session usage, blocked content, <b>impossible travel</b>, resource consumption/inaccessibility, out-of-cycle logging, published/documented, missing logs."
        ]
      },
      {
        id: "2.5",
        title: "Explain the purpose of mitigation techniques used to secure the enterprise",
        points: [
          "Segmentation, access control (ACLs, permissions), application allow list, isolation, patching, encryption, monitoring.",
          "<b>Least privilege</b>, configuration enforcement, decommissioning.",
          "Hardening: install endpoint protection, host-based firewall, HIPS, disable ports/protocols, change default passwords, remove unnecessary software."
        ]
      }
    ]
  },
  {
    id: 3,
    name: "Security Architecture",
    weight: 18,
    color: "var(--d3)",
    objectives: [
      {
        id: "3.1",
        title: "Compare and contrast security implications of different architecture models",
        points: [
          "Cloud: responsibility matrix (shared responsibility), hybrid, third-party vendors. IaaS → PaaS → SaaS = customer manages less.",
          "Infrastructure as Code (IaC), serverless, microservices.",
          "Network infrastructure: physical isolation (<b>air-gapped</b>), logical segmentation, software-defined networking (SDN).",
          "On-premises, centralized vs. decentralized, containerization, virtualization, IoT, ICS/SCADA, RTOS, embedded systems, high availability.",
          "Considerations: availability, resilience, cost, responsiveness, scalability, ease of deployment, risk transference, ease of recovery, patch availability, inability to patch, power, compute."
        ]
      },
      {
        id: "3.2",
        title: "Given a scenario, apply security principles to secure enterprise infrastructure",
        points: [
          "Device placement, security zones, attack surface, connectivity. Failure modes: <b>fail-open</b> (keeps traffic flowing) vs. <b>fail-closed</b> (blocks traffic).",
          "Device attribute: active vs. passive, inline vs. tap/monitor.",
          "Appliances: jump server, proxy server, IPS/IDS, load balancer, sensors.",
          "Port security: 802.1X, EAP. Firewalls: WAF, UTM, NGFW, Layer 4/Layer 7.",
          "Secure communication: VPN, remote access, tunneling (TLS, IPsec), SD-WAN, SASE."
        ]
      },
      {
        id: "3.3",
        title: "Compare and contrast concepts and strategies to protect data",
        points: [
          "Data types: regulated, trade secret, intellectual property, legal, financial, human- and non-human-readable.",
          "Classifications: sensitive, confidential, public, restricted, private, critical.",
          "Data states: <b>at rest</b>, <b>in transit</b>, <b>in use</b>. Data sovereignty, geolocation.",
          "Methods: geographic restrictions, encryption, hashing, masking, tokenization, obfuscation, segmentation, permission restrictions."
        ]
      },
      {
        id: "3.4",
        title: "Explain the importance of resilience and recovery in security architecture",
        points: [
          "High availability: load balancing vs. clustering. Site considerations: <b>hot</b> (ready now), <b>warm</b> (some equipment), <b>cold</b> (empty space), geographic dispersion.",
          "Platform diversity, multi-cloud systems, continuity of operations, capacity planning (people, technology, infrastructure).",
          "Testing: tabletop exercises, fail over, simulation, parallel processing.",
          "Backups: onsite/offsite, frequency, encryption, snapshots, recovery, replication, journaling.",
          "Power: generators, UPS (short-term battery bridge)."
        ]
      }
    ]
  },
  {
    id: 4,
    name: "Security Operations",
    weight: 28,
    color: "var(--d4)",
    objectives: [
      {
        id: "4.1",
        title: "Given a scenario, apply common security techniques to computing resources",
        points: [
          "Secure baselines: establish, deploy, maintain. Hardening targets: mobile devices, workstations, switches, routers, cloud infrastructure, servers, ICS/SCADA, embedded systems, RTOS, IoT.",
          "Wireless: site surveys, heat maps; WPA3, RADIUS, AAA. Cryptographic protocols; authentication protocols.",
          "Mobile solutions: MDM; deployment models BYOD, COPE (corporate-owned, personally enabled), CYOD (choose your own device).",
          "Application security: input validation, secure cookies, static code analysis, code signing. Sandboxing. Monitoring."
        ]
      },
      {
        id: "4.2",
        title: "Explain the security implications of proper hardware, software, and data asset management",
        points: [
          "Acquisition/procurement process, assignment/accounting (ownership, classification), monitoring/asset tracking (inventory, enumeration).",
          "Disposal/decommissioning: sanitization, destruction, certification, data retention."
        ]
      },
      {
        id: "4.3",
        title: "Explain various activities associated with vulnerability management",
        points: [
          "Identification: vulnerability scan, application security (static/dynamic analysis, package monitoring), threat feeds (OSINT, proprietary, information-sharing orgs, dark web), penetration testing, responsible disclosure / bug bounty, system/process audit.",
          "Analysis: confirmation (false positive / false negative), prioritize, <b>CVSS</b> (severity score), <b>CVE</b> (identifier), classification, exposure factor, environmental variables, industry/organizational impact, risk tolerance.",
          "Response/remediation: patching, insurance, segmentation, compensating controls, exceptions/exemptions.",
          "Validation: rescanning, audit, verification. Reporting."
        ]
      },
      {
        id: "4.4",
        title: "Explain security alerting and monitoring concepts and tools",
        points: [
          "Monitor systems, applications and infrastructure. Activities: log aggregation, alerting, scanning, reporting, archiving, alert response (quarantine, alert tuning).",
          "Tools: SCAP, benchmarks, agents/agentless, <b>SIEM</b> (centralized log correlation), antivirus, DLP, SNMP traps, NetFlow, vulnerability scanners."
        ]
      },
      {
        id: "4.5",
        title: "Given a scenario, modify enterprise capabilities to enhance security",
        points: [
          "Firewall rules, access lists, ports/protocols, screened subnets. IDS/IPS trends and signatures.",
          "Web filter: agent-based, centralized proxy, URL scanning, content categorization, block rules, reputation.",
          "OS security: Group Policy, SELinux. Implementation of secure protocols, DNS filtering, email security (<b>DMARC, DKIM, SPF</b>), gateway.",
          "File integrity monitoring (FIM), DLP, NAC, EDR/XDR, user behavior analytics (UBA)."
        ]
      },
      {
        id: "4.6",
        title: "Given a scenario, implement and maintain identity and access management",
        points: [
          "Provisioning/de-provisioning, permission assignments, identity proofing, federation, <b>SSO</b> (LDAP, OAuth, SAML), interoperability, attestation.",
          "Access control models: <b>Mandatory</b> (labels/clearances), <b>Discretionary</b> (owner decides), <b>Role-based</b>, <b>Rule-based</b>, <b>Attribute-based</b>, time-of-day restrictions, least privilege.",
          "MFA factors: something you know, have, are; somewhere you are. Implementations: biometrics, hard/soft tokens, security keys.",
          "Password concepts: length, complexity, reuse, expiration, age; password managers; passwordless.",
          "Privileged access management (PAM): just-in-time permissions, password vaulting, ephemeral credentials."
        ]
      },
      {
        id: "4.7",
        title: "Explain the importance of automation and orchestration related to secure operations",
        points: [
          "Use cases: user/resource provisioning, guard rails, security groups, ticket creation, escalation, enabling/disabling services, CI testing, integrations and APIs.",
          "Benefits: efficiency, baseline enforcement, standard configurations, scaling securely, employee retention, faster reaction time, workforce multiplier.",
          "Considerations: complexity, cost, single point of failure, technical debt, ongoing supportability."
        ]
      },
      {
        id: "4.8",
        title: "Explain appropriate incident response activities",
        points: [
          "Process: <b>Preparation → Detection → Analysis → Containment → Eradication → Recovery → Lessons learned</b>.",
          "Training, testing (tabletop exercise, simulation), root cause analysis, threat hunting.",
          "Digital forensics: legal hold, <b>chain of custody</b>, acquisition, reporting, preservation, e-discovery. Collect in <b>order of volatility</b> (CPU/cache → RAM → disk → logs/remote → archives)."
        ]
      },
      {
        id: "4.9",
        title: "Given a scenario, use data sources to support an investigation",
        points: [
          "Log data: firewall, application, endpoint, OS-specific security logs, IPS/IDS, network, metadata.",
          "Data sources: vulnerability scans, automated reports, dashboards, packet captures."
        ]
      }
    ]
  },
  {
    id: 5,
    name: "Security Program Management and Oversight",
    weight: 20,
    color: "var(--d5)",
    objectives: [
      {
        id: "5.1",
        title: "Summarize elements of effective security governance",
        points: [
          "Guidelines; policies (AUP, information security, business continuity, disaster recovery, incident response, SDLC, change management).",
          "Standards (password, access control, physical security, encryption); procedures (change management, onboarding/offboarding, playbooks).",
          "External considerations: regulatory, legal, industry, local/regional, national, global.",
          "Monitoring and revision. Governance structures: boards, committees, government entities, centralized/decentralized.",
          "Roles for systems and data: <b>owner</b>, <b>controller</b> (decides why/how data is processed), <b>processor</b> (processes on controller's behalf), <b>custodian/steward</b>."
        ]
      },
      {
        id: "5.2",
        title: "Explain elements of the risk management process",
        points: [
          "Risk identification, assessment (ad hoc, recurring, one-time, continuous), analysis (qualitative vs. quantitative).",
          "<b>SLE = AV × EF</b>; <b>ALE = SLE × ARO</b>. Probability, likelihood, exposure factor, impact.",
          "Risk register: key risk indicators, risk owners, risk threshold. Risk tolerance, risk appetite (expansionary, conservative, neutral).",
          "Strategies: <b>Transfer</b> (insurance), <b>Accept</b> (exemption/exception), <b>Avoid</b> (stop the activity), <b>Mitigate</b> (controls).",
          "Business impact analysis: <b>RTO</b> (max downtime), <b>RPO</b> (max data loss in time), <b>MTTR</b>, <b>MTBF</b>."
        ]
      },
      {
        id: "5.3",
        title: "Explain the processes associated with third-party risk assessment and management",
        points: [
          "Vendor assessment: penetration testing, right-to-audit clause, evidence of internal audits, independent assessments, supply chain analysis.",
          "Vendor selection: due diligence, conflict of interest. Vendor monitoring, questionnaires, rules of engagement.",
          "Agreements: <b>SLA</b> (service levels), <b>MOA/MOU</b> (memorandum of agreement/understanding), <b>MSA</b> (master service agreement), <b>WO/SOW</b> (work order/statement of work), <b>NDA</b>, <b>BPA</b> (business partners agreement)."
        ]
      },
      {
        id: "5.4",
        title: "Summarize elements of effective security compliance",
        points: [
          "Compliance reporting (internal/external). Consequences of non-compliance: fines, sanctions, reputational damage, loss of license, contractual impacts.",
          "Compliance monitoring: due diligence/care, attestation and acknowledgement, internal/external, automation.",
          "Privacy: legal implications, data subject, controller vs. processor, ownership, data inventory and retention, <b>right to be forgotten</b> (GDPR)."
        ]
      },
      {
        id: "5.5",
        title: "Explain types and purposes of audits and assessments",
        points: [
          "Attestation; internal (compliance, audit committee, self-assessments); external (regulatory, examinations, assessment, independent third-party audit).",
          "Penetration testing: physical, offensive (red), defensive (blue), integrated (purple).",
          "Environments: <b>known</b> (white box), <b>partially known</b> (gray box), <b>unknown</b> (black box).",
          "Reconnaissance: <b>passive</b> (OSINT, no direct contact) vs. <b>active</b> (scanning the target)."
        ]
      },
      {
        id: "5.6",
        title: "Given a scenario, implement security awareness practices",
        points: [
          "Phishing campaigns, recognizing phishing attempts, responding to reported suspicious messages.",
          "Anomalous behavior recognition: risky, unexpected, unintentional.",
          "User guidance and training: policy/handbooks, situational awareness, insider threat, password management, removable media and cables, social engineering, operational security, hybrid/remote work environments.",
          "Reporting and monitoring (initial/recurring), development, execution."
        ]
      }
    ]
  }
];
