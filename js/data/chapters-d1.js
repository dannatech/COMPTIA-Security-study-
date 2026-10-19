// In-depth chapters — Domain 1: General Security Concepts.
// Each chapter: { overview, sections: [{ h, html }], tips: [], traps: [] }
window.SECPLUS = window.SECPLUS || {};
SECPLUS.chapters = SECPLUS.chapters || {};

SECPLUS.chapters["1.1"] = {
  overview: "Every security decision comes down to choosing controls. The exam expects you to classify any control in two ways at once: by <b>category</b> (who or what implements it) and by <b>type</b> (what it does relative to an incident). Most questions give you a scenario and ask for one of those two labels.",
  sections: [
    { h: "Control categories: who or what implements the control", html: `
<p>A control's <b>category</b> describes how it is implemented:</p>
<table class="data"><thead><tr><th>Category</th><th>Implemented by</th><th>Examples</th></tr></thead><tbody>
<tr><td><b>Technical</b></td><td>Hardware, software, firmware</td><td>Firewalls, antivirus/EDR, encryption, MFA, ACLs, OS hardening</td></tr>
<tr><td><b>Managerial</b></td><td>Management and oversight (administrative)</td><td>Security policies, risk assessments, security planning, vendor reviews</td></tr>
<tr><td><b>Operational</b></td><td>People carrying out day-to-day procedures</td><td>Security guards, awareness training, change-management meetings, log review performed by staff</td></tr>
<tr><td><b>Physical</b></td><td>Tangible barriers in the real world</td><td>Fences, locks, bollards, mantraps, lighting, cameras</td></tr>
</tbody></table>
<p>The hardest pair to separate is managerial and operational. <b>Managerial</b> controls decide what should happen: a policy that requires quarterly access reviews. <b>Operational</b> controls are people actually doing it: the analyst who performs the review each quarter.</p>` },
    { h: "Control types: what the control does", html: `
<p>A control's <b>type</b> describes its function relative to an incident:</p>
<ul>
<li><b>Preventive</b>: stops the event from happening. Firewall deny rules, door locks, least-privilege permissions, input validation.</li>
<li><b>Deterrent</b>: discourages an attacker without physically stopping them. Warning banners, "under video surveillance" signs, visible guards, bright lighting.</li>
<li><b>Detective</b>: identifies and records that something happened or is happening. IDS, SIEM alerts, log review, motion sensors, CCTV recordings reviewed later.</li>
<li><b>Corrective</b>: reduces impact and restores normal operations after an event. Restoring from backup, re-imaging a host, patching the exploited flaw, quarantining malware.</li>
<li><b>Compensating</b>: an alternative used when the primary control is not feasible, providing similar protection. Segmenting an unpatchable legacy server; extra monitoring when separation of duties is impossible in a tiny team.</li>
<li><b>Directive</b>: tells people what to do or not do. Policies, standards, an AUP, "Authorized personnel only" signs, training that instructs a behavior.</li>
</ul>` },
    { h: "Combining category and type", html: `
<p>Every control has a category <i>and</i> a type. Practice reading them both:</p>
<table class="data"><thead><tr><th>Control</th><th>Category</th><th>Type</th></tr></thead><tbody>
<tr><td>Next-generation firewall blocking inbound SMB</td><td>Technical</td><td>Preventive</td></tr>
<tr><td>Security guard at reception</td><td>Operational</td><td>Preventive / deterrent</td></tr>
<tr><td>CCTV camera</td><td>Physical</td><td>Detective (and deterrent if visible)</td></tr>
<tr><td>Acceptable use policy</td><td>Managerial</td><td>Directive</td></tr>
<tr><td>Backup restore after ransomware</td><td>Technical / operational</td><td>Corrective</td></tr>
<tr><td>Isolating an unpatchable PLC on its own VLAN</td><td>Technical</td><td>Compensating</td></tr>
</tbody></table>
<p>One control can serve several types. A camera both deters and detects. When the question says "PRIMARILY" or "BEST", choose the purpose the scenario emphasizes.</p>` },
    { h: "Defense in depth", html: `
<p>No single control is perfect, so organizations layer them: physical, network, host, application, data and people. The goal is that an attacker who bypasses one layer is stopped or detected by the next. In a scenario, a strong answer often <b>adds a different category or type</b> rather than duplicating one that already exists. For example, if preventive firewalls are in place, adding detective monitoring improves the design more than adding a second firewall.</p>` }
  ],
  tips: [
    "When a question includes the word 'sign', ask what the sign is for: it deters (warning) or directs (instruction). Read the wording.",
    "If the primary control is 'not possible', 'too expensive' or 'not supported', the answer is almost always compensating.",
    "Training is operational in category. Its type depends on the goal, usually directive or preventive.",
    "Restoring, re-imaging, patching after an incident and quarantine are corrective."
  ],
  traps: [
    "Confusing detective with deterrent: a hidden camera cannot deter, it only detects.",
    "Labeling a policy as operational: a policy is managerial; people executing procedures is operational.",
    "Thinking a control can only have one type. Read for the PRIMARY purpose."
  ]
};

SECPLUS.chapters["1.2"] = {
  overview: "This objective covers the foundations every other topic builds on: the CIA triad, non-repudiation, AAA, gap analysis, Zero Trust architecture, physical security, and deception technologies. Expect scenario questions that ask which concept a given control supports.",
  sections: [
    { h: "The CIA triad and non-repudiation", html: `
<ul>
<li><b>Confidentiality</b>: only authorized parties can read the data. Supported by encryption, access controls, data classification and steganography.</li>
<li><b>Integrity</b>: data is accurate and unaltered. Supported by hashing, digital signatures, certificates, file integrity monitoring and version control.</li>
<li><b>Availability</b>: systems and data are accessible when needed. Supported by redundancy, fault tolerance, load balancing, backups, patching and DDoS protection.</li>
</ul>
<p><b>Non-repudiation</b> means a sender cannot credibly deny an action. It is achieved with <b>digital signatures</b>: the signer used a private key only they possess. A hash on its own proves integrity but not <i>who</i> created the data; a signature proves both.</p>` },
    { h: "AAA: authentication, authorization, accounting", html: `
<ol>
<li><b>Identification</b>: claiming an identity (a username).</li>
<li><b>Authentication</b>: proving the claim (password, token, biometric, certificate).</li>
<li><b>Authorization</b>: deciding what the authenticated identity may do (permissions, roles).</li>
<li><b>Accounting</b>: recording what was done (logs, session duration, data transferred), which supports audits and investigations.</li>
</ol>
<p>Systems need authenticating too. Devices commonly authenticate with <b>certificates</b> (for example 802.1X with EAP-TLS). Authorization models such as RBAC and ABAC are covered in objective 4.6. RADIUS and TACACS+ are classic AAA servers.</p>` },
    { h: "Gap analysis", html: `
<p>A <b>gap analysis</b> compares where the organization is today with where it needs to be, usually measured against a framework such as NIST CSF, ISO 27001 or CIS Controls. The output is a list of missing or weak controls, prioritized into a remediation roadmap. Do not confuse it with a <i>risk assessment</i> (which measures likelihood and impact) or a <i>vulnerability scan</i> (which finds technical flaws).</p>` },
    { h: "Zero Trust architecture", html: `
<p>Zero Trust removes <i>implicit</i> trust based on network location: being "inside the LAN" grants nothing. Every request is authenticated, authorized and continuously evaluated.</p>
<p><b>Control plane</b> (the decision-making side):</p>
<ul>
<li><b>Adaptive identity</b>: uses context (device health, location, time, behavior, risk score) to adjust authentication requirements.</li>
<li><b>Threat scope reduction</b>: limits each identity to the minimum resources it needs, shrinking the blast radius.</li>
<li><b>Policy-driven access control</b>: centrally defined policies govern access.</li>
<li><b>Policy Engine (PE)</b>: makes the grant or deny decision.</li>
<li><b>Policy Administrator (PA)</b>: carries out the decision by establishing or tearing down the session and issuing tokens or credentials.</li>
</ul>
<p><b>Data plane</b> (where traffic actually flows):</p>
<ul>
<li><b>Subject/system</b>: the user or device requesting access.</li>
<li><b>Policy Enforcement Point (PEP)</b>: the gateway that allows, monitors and terminates connections as the PA instructs.</li>
<li><b>Implicit trust zones</b>: the area <i>behind</i> the PEP where the resource lives. Zero Trust aims to make these as small as possible.</li>
</ul>` },
    { h: "Physical security", html: `
<ul>
<li><b>Bollards</b>: stop vehicles while letting pedestrians through.</li>
<li><b>Access control vestibule</b> (formerly mantrap): two interlocking doors, so only one person passes at a time. Stops tailgating and piggybacking.</li>
<li><b>Fencing, lighting, video surveillance, security guards, access badges</b>: layered perimeter controls.</li>
<li><b>Sensors</b>: <b>infrared</b> (detects body heat), <b>pressure</b> (detects weight on a floor or mat), <b>microwave</b> (detects motion by reflected microwaves and covers a large area), <b>ultrasonic</b> (detects motion by reflected sound waves).</li>
</ul>` },
    { h: "Deception and disruption technology", html: `
<table class="data"><thead><tr><th>Technology</th><th>What it is</th></tr></thead><tbody>
<tr><td><b>Honeypot</b></td><td>A single decoy system that looks valuable, built to attract and study attackers</td></tr>
<tr><td><b>Honeynet</b></td><td>A network of honeypots that simulates a real environment</td></tr>
<tr><td><b>Honeyfile</b></td><td>A bait file (for example "passwords.xlsx") that alerts when opened</td></tr>
<tr><td><b>Honeytoken</b></td><td>Fake data or credentials (an API key, a database record) with no legitimate use. Any use means compromise.</td></tr>
</tbody></table>
<p>Because no legitimate user should ever touch these, their alerts have extremely low false-positive rates.</p>` }
  ],
  tips: [
    "Signature means non-repudiation. Hash alone means integrity only.",
    "PE decides, PA carries out the decision, PEP enforces it in the data plane.",
    "The question says 'fake credential' or 'fake record': answer honeytoken. 'Fake file': honeyfile.",
    "Preventing tailgating: access control vestibule. Preventing vehicles: bollards."
  ],
  traps: [
    "Picking encryption for integrity. Encryption provides confidentiality; hashing and signatures provide integrity.",
    "Thinking Zero Trust means 'no authentication needed inside'. It is the opposite.",
    "Confusing gap analysis with risk assessment."
  ]
};

SECPLUS.chapters["1.3"] = {
  overview: "Unplanned changes cause outages and open security holes. Change management makes every change reviewed, tested, approved, reversible and documented. The exam tests both the business process and the technical implications.",
  sections: [
    { h: "Business processes", html: `
<ul>
<li><b>Approval process</b>: a <b>change advisory board (CAB)</b> or designated approver reviews requests.</li>
<li><b>Ownership</b>: one named person is accountable for the change.</li>
<li><b>Stakeholders</b>: everyone affected (business owners, users, support teams) is identified and informed.</li>
<li><b>Impact analysis</b>: what could break, what the risk is of doing it and of <i>not</i> doing it, and who is affected.</li>
<li><b>Test results</b>: proof the change worked in a test or staging environment.</li>
<li><b>Backout plan</b>: a documented way to revert if the change fails.</li>
<li><b>Maintenance window</b>: a pre-approved low-impact time, such as Sunday at 02:00.</li>
<li><b>Standard operating procedure (SOP)</b>: repeatable, documented steps for routine changes.</li>
</ul>
<p>A typical flow: <b>request → impact analysis → CAB approval → test → schedule in window → implement → verify → document</b>.</p>` },
    { h: "Technical implications", html: `
<ul>
<li><b>Allow lists and deny lists</b>: a new application may need to be added to an application allow list or firewall rules.</li>
<li><b>Restricted activities</b>: limit exactly what the implementer may touch.</li>
<li><b>Downtime</b>: plan for it and communicate it.</li>
<li><b>Service and application restarts</b>: a restart can drop sessions or fail to come back cleanly.</li>
<li><b>Legacy applications</b>: may break with new protocols or ciphers (for example when TLS 1.0 is disabled).</li>
<li><b>Dependencies</b>: other systems relying on the changed one. Missing a dependency is a classic cause of outages.</li>
</ul>` },
    { h: "Documentation and version control", html: `
<p>After a change, update <b>network diagrams</b>, <b>policies and procedures</b>, and runbooks so they match reality. Use <b>version control</b> (for example Git for configs and Infrastructure as Code) so every change is tracked, attributable, reviewable and easy to roll back. Out-of-date documentation slows incident response and causes future change failures.</p>` }
  ],
  tips: [
    "'How do we roll back?' means the backout plan.",
    "'When should we do it?' means the maintenance window.",
    "An outage caused by an unknown reliance on another system points to missed dependencies."
  ],
  traps: [
    "Thinking emergency changes skip documentation. They still need to be documented and reviewed, often after the fact.",
    "Confusing impact analysis (what might happen) with test results (what did happen in testing)."
  ]
};

SECPLUS.chapters["1.4"] = {
  overview: "Cryptography is one of the most heavily tested topics. You need to know which tool provides which security goal, how public key infrastructure (PKI) works, the hardware that protects keys, and the certificate concepts you will meet in scenarios.",
  sections: [
    { h: "Symmetric and asymmetric encryption", html: `
<table class="data"><thead><tr><th></th><th>Symmetric</th><th>Asymmetric</th></tr></thead><tbody>
<tr><td>Keys</td><td>One shared secret key</td><td>Public/private key pair</td></tr>
<tr><td>Speed</td><td>Fast, good for bulk data</td><td>Slow, used for small data</td></tr>
<tr><td>Algorithms</td><td>AES (128/192/256), ChaCha20, 3DES (legacy)</td><td>RSA, ECC, Diffie-Hellman (key exchange), DSA/ECDSA (signatures)</td></tr>
<tr><td>Challenge</td><td>Distributing the key securely</td><td>Performance; trusting that a public key really belongs to its owner (PKI solves this)</td></tr>
</tbody></table>
<p>Real protocols such as TLS are <b>hybrid</b>. Asymmetric cryptography (ECDHE) agrees a session key, then symmetric AES encrypts the data. <b>Ephemeral</b> key exchange (DHE/ECDHE) gives <b>Perfect Forward Secrecy</b>: stealing the server's long-term key later cannot decrypt past sessions.</p>
<p>Key rule: <b>encrypt with the recipient's public key</b> (confidentiality); <b>sign with the sender's private key</b> (integrity, authentication, non-repudiation).</p>` },
    { h: "Encryption levels and scopes", html: `
<ul>
<li><b>Full-disk encryption (FDE)</b>: the whole drive (BitLocker, FileVault), often with the TPM. Protects a lost or stolen device.</li>
<li><b>Partition and volume</b>: a specific partition or logical volume.</li>
<li><b>File</b>: individual files (EFS, file-level tools).</li>
<li><b>Database</b>: the entire database, for example Transparent Data Encryption.</li>
<li><b>Record</b>: individual rows or columns, such as just the SSN column.</li>
<li><b>Transport/communication</b>: data in transit (TLS, IPsec, SSH).</li>
</ul>
<p>Key length matters. Longer keys resist brute force better, so AES-256 is stronger than AES-128. ECC achieves strength similar to RSA with much smaller keys (256-bit ECC is roughly equal to 3072-bit RSA), which suits mobile and IoT devices.</p>` },
    { h: "Protecting keys: TPM, HSM, KMS, secure enclave", html: `
<table class="data"><thead><tr><th>Tool</th><th>What it is</th><th>Typical use</th></tr></thead><tbody>
<tr><td><b>TPM</b></td><td>Chip on a motherboard</td><td>Stores FDE keys, secure/measured boot, device attestation</td></tr>
<tr><td><b>HSM</b></td><td>Dedicated tamper-resistant appliance or card</td><td>High-volume key generation and storage, CA private keys, payment systems</td></tr>
<tr><td><b>KMS</b></td><td>Key management service or software (often cloud)</td><td>Creating, rotating and controlling access to keys centrally</td></tr>
<tr><td><b>Secure enclave</b></td><td>Isolated area of a processor</td><td>Protects data <i>in use</i> and biometric templates on phones</td></tr>
</tbody></table>
<p><b>Key escrow</b> means a trusted third party holds copies of keys so data can be recovered (for example after an employee leaves).</p>` },
    { h: "Hashing, salting and key stretching", html: `
<p>A <b>hash</b> is a one-way, fixed-length fingerprint of data (SHA-256, SHA-3). The same input always gives the same output, and any change produces a completely different hash. Uses: integrity checks, password storage and digital signatures. MD5 and SHA-1 are deprecated because of <b>collisions</b>.</p>
<p><b>Salting</b> adds a unique random value to each password before hashing, so identical passwords produce different hashes and precomputed <b>rainbow tables</b> fail.</p>
<p><b>Key stretching</b> (PBKDF2, bcrypt, scrypt, Argon2) runs the hash thousands of times, making each guess expensive and slowing brute force dramatically.</p>
<p><b>HMAC</b> combines a hash with a secret key to prove both integrity and authenticity of a message.</p>` },
    { h: "Obfuscation: steganography, tokenization, masking", html: `
<ul>
<li><b>Steganography</b>: hides data inside other data (an image, audio, video). It conceals that a message exists, not its content.</li>
<li><b>Tokenization</b>: replaces sensitive data with a random token and keeps the real value in a secure token vault. Common for card numbers (PCI DSS scope reduction). The token cannot be mathematically reversed.</li>
<li><b>Data masking</b>: hides part of the value from view, such as ***-**-6789. Used for displays and test data.</li>
</ul>` },
    { h: "Digital signatures, certificates and PKI", html: `
<p><b>Digital signature</b>: hash the message, then encrypt the hash with the sender's <b>private key</b>. The receiver decrypts it with the sender's <b>public key</b> and compares hashes. This proves integrity, authentication and non-repudiation.</p>
<p><b>PKI</b> binds public keys to identities through <b>certificates</b> issued by a <b>Certificate Authority (CA)</b>. A <b>root CA</b> (the <b>root of trust</b>, usually kept offline) signs <b>intermediate CAs</b>, which sign end-entity certificates. Browsers trust certificates that chain to a root in their trust store.</p>
<p><b>Getting a certificate</b>: generate a key pair → create a <b>CSR</b> (Certificate Signing Request) containing the public key and subject → the CA (or a Registration Authority) validates you → the CA signs and issues the certificate → install it with its chain.</p>
<p><b>Certificate types</b>: <b>wildcard</b> (*.example.com, one level of subdomains), <b>SAN</b> (lists multiple names, including different domains), <b>self-signed</b> (no trusted CA, so fine for internal testing but browsers warn), and <b>third-party</b> (issued by a public CA).</p>` },
    { h: "Revocation: CRL and OCSP", html: `
<ul>
<li><b>CRL</b> (Certificate Revocation List): a signed list of revoked serial numbers that clients download periodically. It can be large and stale.</li>
<li><b>OCSP</b> (Online Certificate Status Protocol): a real-time query for a single certificate's status.</li>
<li><b>OCSP stapling</b>: the server fetches its own signed OCSP response and "staples" it to the TLS handshake. This is faster, more private, and takes load off the CA.</li>
</ul>` },
    { h: "Blockchain and open public ledgers", html: `
<p>A <b>blockchain</b> is a distributed, append-only ledger. Each block contains the hash of the previous block, so altering any block breaks every later hash, and many participants hold copies. The result is a tamper-evident record without a central authority. An <b>open public ledger</b> is one anyone can view and verify.</p>` }
  ],
  tips: [
    "Encrypt for someone: use THEIR public key. Prove it was you: sign with YOUR private key.",
    "'Real-time revocation check' means OCSP. 'Server includes the status in the handshake' means OCSP stapling.",
    "'Multiple different domain names on one cert' means SAN. 'All subdomains' means wildcard.",
    "Rainbow tables are defeated by salting. Brute-force speed is reduced by key stretching.",
    "Chip on the motherboard: TPM. Separate appliance for many servers: HSM."
  ],
  traps: [
    "Thinking hashing is encryption. It is one-way and cannot be decrypted.",
    "Confusing tokenization (vault lookup, not reversible mathematically) with encryption (reversible with the key).",
    "Assuming a wildcard covers multiple levels: *.example.com does NOT cover a.b.example.com.",
    "Thinking steganography encrypts data. It only hides it."
  ]
};
