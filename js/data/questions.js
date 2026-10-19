// Practice questions. a = index of the correct choice, or an array of indexes for "choose two" questions.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.questions = [
  // ---------- Domain 1 ----------
  {
    id: "q1-01", d: 1, o: "1.1",
    q: "A company posts signs warning that the premises are under 24-hour video surveillance. Which control type does the SIGN primarily represent?",
    c: ["Detective", "Deterrent", "Corrective", "Compensating"],
    a: 1,
    e: "The sign discourages would-be intruders, which makes it a deterrent. The cameras themselves would be detective."
  },
  {
    id: "q1-02", d: 1, o: "1.1",
    q: "A legacy manufacturing controller cannot be patched, so the security team places it on an isolated VLAN with strict ACLs. What kind of control is this?",
    c: ["Directive", "Preventive", "Compensating", "Deterrent"],
    a: 2,
    e: "When the primary control (patching) isn't possible, an alternative control that reduces the same risk is a compensating control."
  },
  {
    id: "q1-03", d: 1, o: "1.1",
    q: "Security awareness training delivered to employees is BEST categorized as which control category?",
    c: ["Technical", "Physical", "Operational", "Managerial"],
    a: 2,
    e: "Operational controls are implemented and carried out by people (training, guards). Managerial controls are policies and risk-related oversight."
  },
  {
    id: "q1-04", d: 1, o: "1.2",
    q: "Which of the following provides non-repudiation for an email message?",
    c: ["Encrypting the message with the recipient's public key", "Hashing the message with SHA-256", "Digitally signing the message with the sender's private key", "Sending the message over TLS"],
    a: 2,
    e: "Only the sender holds their private key, so a digital signature proves origin and the sender cannot deny it. A hash alone provides integrity but not proof of who sent it."
  },
  {
    id: "q1-05", d: 1, o: "1.2",
    q: "In a Zero Trust architecture, which component makes the actual decision to grant or deny a subject access to a resource?",
    c: ["Policy Enforcement Point", "Policy Engine", "Implicit trust zone", "Data plane"],
    a: 1,
    e: "The Policy Engine (control plane) decides. The Policy Administrator communicates the decision, and the Policy Enforcement Point (data plane) enforces it."
  },
  {
    id: "q1-06", d: 1, o: "1.2",
    q: "A security analyst places a fake file named 'Executive_Salaries_2026.xlsx' on a file server and configures an alert whenever it is opened. What is this an example of?",
    c: ["Honeypot", "Honeynet", "Honeyfile", "DLP"],
    a: 2,
    e: "A honeyfile is a decoy file used to detect unauthorized access. A honeypot is an entire decoy system; a honeynet is a network of honeypots."
  },
  {
    id: "q1-07", d: 1, o: "1.2",
    q: "Which physical security control is MOST effective at preventing tailgating into a data center?",
    c: ["Bollards", "Access control vestibule", "Security lighting", "Fencing"],
    a: 1,
    e: "An access control vestibule (mantrap) uses two interlocking doors so only one authenticated person passes at a time. Bollards stop vehicles, not people."
  },
  {
    id: "q1-08", d: 1, o: "1.3",
    q: "During a change approval meeting, the board asks how the team will restore the previous configuration if the upgrade fails. Which document addresses this?",
    c: ["Impact analysis", "Backout plan", "Maintenance window", "Standard operating procedure"],
    a: 1,
    e: "A backout plan documents how to revert a change if it causes problems."
  },
  {
    id: "q1-09", d: 1, o: "1.4",
    q: "Which technique makes stored password hashes resistant to precomputed rainbow table attacks?",
    c: ["Salting", "Tokenization", "Steganography", "Data masking"],
    a: 0,
    e: "A unique random salt per password means precomputed hash tables won't match. Key stretching (bcrypt, PBKDF2) further slows brute force."
  },
  {
    id: "q1-10", d: 1, o: "1.4",
    q: "A company wants a single certificate that secures www.example.com, mail.example.com and shop.example.com, as well as example.net. Which option is BEST?",
    c: ["Wildcard certificate", "Self-signed certificate", "SAN certificate", "Code-signing certificate"],
    a: 2,
    e: "A Subject Alternative Name (SAN) certificate can list multiple different hostnames, including different domains. A wildcard (*.example.com) cannot cover example.net."
  },
  {
    id: "q1-11", d: 1, o: "1.4",
    q: "Which hardware component on a laptop's motherboard stores encryption keys used for full-disk encryption and supports measured boot?",
    c: ["HSM", "TPM", "KMS", "Secure enclave"],
    a: 1,
    e: "A Trusted Platform Module (TPM) is a chip on the motherboard. An HSM is a separate, dedicated appliance or card used for key management at scale."
  },
  {
    id: "q1-12", d: 1, o: "1.4",
    q: "A payment processor replaces stored credit card numbers with random values and keeps the mapping in a secured vault. Which technique is this?",
    c: ["Hashing", "Masking", "Tokenization", "Obfuscation by steganography"],
    a: 2,
    e: "Tokenization substitutes sensitive data with a token that has no exploitable value; the real value lives only in the token vault."
  },
  {
    id: "q1-13", d: 1, o: "1.4",
    q: "Which method allows a browser to verify a certificate's revocation status in real time for a single certificate, without downloading a full list?",
    c: ["CRL", "OCSP", "CSR", "Key escrow"],
    a: 1,
    e: "Online Certificate Status Protocol (OCSP) queries the status of a specific certificate. A CRL is a full list of revoked certificates."
  },
  {
    id: "q1-14", d: 1, o: "1.4",
    q: "Which TWO of the following are asymmetric algorithms? (Choose two.)",
    c: ["AES", "RSA", "ECC", "ChaCha20", "SHA-256"],
    a: [1, 2],
    e: "RSA and ECC use public/private key pairs. AES and ChaCha20 are symmetric ciphers. SHA-256 is a hashing algorithm, not encryption."
  },

  // ---------- Domain 2 ----------
  {
    id: "q2-01", d: 2, o: "2.1",
    q: "An attacker group with extensive funding has maintained undetected access to a defense contractor's network for 18 months, exfiltrating design documents. Which threat actor is MOST likely responsible?",
    c: ["Unskilled attacker", "Hacktivist", "Nation-state", "Insider threat"],
    a: 2,
    e: "Long-term stealthy access (an APT), high resources and espionage motives point to a nation-state actor."
  },
  {
    id: "q2-02", d: 2, o: "2.1",
    q: "A marketing team subscribes to an unapproved cloud file-sharing service to exchange files with customers. This is an example of:",
    c: ["Shadow IT", "Insider threat", "Supply chain attack", "Hacktivism"],
    a: 0,
    e: "Shadow IT is technology used without IT department approval. It isn't malicious, but it bypasses security controls."
  },
  {
    id: "q2-03", d: 2, o: "2.2",
    q: "An employee receives a text message claiming to be from the bank with a link to 'verify suspicious activity'. What type of attack is this?",
    c: ["Vishing", "Smishing", "Whaling", "Pharming"],
    a: 1,
    e: "Smishing is phishing via SMS. Vishing uses voice calls; whaling targets executives."
  },
  {
    id: "q2-04", d: 2, o: "2.2",
    q: "Attackers compromise an industry forum frequently visited by employees of a target energy company, planting malware on the site. Which attack is this?",
    c: ["Typosquatting", "Watering hole", "Pretexting", "Brand impersonation"],
    a: 1,
    e: "A watering hole attack infects a site the target group trusts and visits regularly."
  },
  {
    id: "q2-05", d: 2, o: "2.2",
    q: "The accounts payable clerk receives an email from what appears to be the CFO's real mailbox asking for an urgent wire transfer to a new vendor. The CFO's account was compromised. What BEST describes this?",
    c: ["Business email compromise", "Typosquatting", "Spam", "Watering hole"],
    a: 0,
    e: "BEC uses a compromised or spoofed legitimate business email account to trick staff into transferring money or data."
  },
  {
    id: "q2-06", d: 2, o: "2.3",
    q: "A web form passes user input directly into the query: SELECT * FROM users WHERE name = '<input>'. An attacker enters ' OR 1=1 --. Which vulnerability is being exploited?",
    c: ["Cross-site scripting", "SQL injection", "Buffer overflow", "Directory traversal"],
    a: 1,
    e: "The input alters SQL logic. Mitigate with parameterized queries (prepared statements) and input validation."
  },
  {
    id: "q2-07", d: 2, o: "2.3",
    q: "A program checks that a file is safe, but before it opens the file an attacker swaps it for a malicious one. What type of vulnerability is this?",
    c: ["Memory injection", "Race condition (TOC/TOU)", "Integer overflow", "Malicious update"],
    a: 1,
    e: "Time-of-check to time-of-use (TOC/TOU) is a race condition: the state changes between the check and the use."
  },
  {
    id: "q2-08", d: 2, o: "2.3",
    q: "An attacker running code inside a guest VM gains access to the host hypervisor and other guests. This is called:",
    c: ["Resource reuse", "VM escape", "VM sprawl", "Side loading"],
    a: 1,
    e: "VM escape breaks out of a guest's isolation to the hypervisor. Resource reuse refers to leftover data in reallocated memory/storage."
  },
  {
    id: "q2-09", d: 2, o: "2.3",
    q: "Researchers discover an actively exploited vulnerability for which the vendor has not yet released a patch. What is this called?",
    c: ["Legacy vulnerability", "Misconfiguration", "Zero-day", "End-of-life"],
    a: 2,
    e: "A zero-day is unknown to (or unpatched by) the vendor, so defenders have had 'zero days' to fix it."
  },
  {
    id: "q2-10", d: 2, o: "2.4",
    q: "A SIEM shows a user authenticated from New York at 09:02 and from Singapore at 09:20 on the same day. Which indicator does this represent?",
    c: ["Concurrent session usage", "Impossible travel", "Account lockout", "Out-of-cycle logging"],
    a: 1,
    e: "The user could not physically travel that distance in 18 minutes — a strong indicator of compromised credentials."
  },
  {
    id: "q2-11", d: 2, o: "2.4",
    q: "Logs show 5,000 different user accounts each receiving exactly two failed logins using the password 'Winter2026!'. What attack is MOST likely?",
    c: ["Brute force", "Password spraying", "Credential replay", "Rainbow table"],
    a: 1,
    e: "Password spraying tries a few common passwords against many accounts to stay under lockout thresholds. Brute force hammers one account with many passwords."
  },
  {
    id: "q2-12", d: 2, o: "2.4",
    q: "A web server log contains requests like GET /download?file=../../../../etc/passwd. What attack is being attempted?",
    c: ["SQL injection", "Directory traversal", "CSRF", "XSS"],
    a: 1,
    e: "The ../ sequences try to escape the web root and read arbitrary files: directory (path) traversal."
  },
  {
    id: "q2-13", d: 2, o: "2.4",
    q: "Malware spreads automatically from host to host across the network by exploiting an SMB vulnerability, with no user interaction. What type of malware is this?",
    c: ["Trojan", "Worm", "Logic bomb", "Rootkit"],
    a: 1,
    e: "Worms self-replicate across networks without user action. Viruses need a host file and user action; trojans masquerade as legitimate software."
  },
  {
    id: "q2-14", d: 2, o: "2.4",
    q: "A disgruntled developer added code that deletes the payroll database if their account is ever disabled. What is this?",
    c: ["Backdoor", "Logic bomb", "Spyware", "Keylogger"],
    a: 1,
    e: "A logic bomb executes when a specific condition is met — here, the developer's account being disabled."
  },
  {
    id: "q2-15", d: 2, o: "2.4",
    q: "An attacker forces a client and server to negotiate an older, vulnerable version of TLS. What type of attack is this?",
    c: ["Collision", "Downgrade", "Birthday", "Replay"],
    a: 1,
    e: "Downgrade attacks force the use of weaker protocols or ciphers that are easier to break."
  },
  {
    id: "q2-16", d: 2, o: "2.5",
    q: "To prevent unauthorized software from running on kiosks, an administrator configures the system so only specified executables may launch. What is this?",
    c: ["Application allow list", "Sandboxing", "Host-based firewall", "Block list"],
    a: 0,
    e: "An allow list (whitelist) permits only explicitly approved applications; everything else is denied by default."
  },
  {
    id: "q2-17", d: 2, o: "2.5",
    q: "Which TWO actions are part of hardening a newly deployed server? (Choose two.)",
    c: ["Changing default passwords", "Enabling all services for compatibility", "Disabling unused ports and protocols", "Granting all users local admin", "Turning off logging to save disk space"],
    a: [0, 2],
    e: "Hardening reduces attack surface: change defaults, disable unneeded ports/services, remove unnecessary software, and enable endpoint protection."
  },

  // ---------- Domain 3 ----------
  {
    id: "q3-01", d: 3, o: "3.1",
    q: "In which cloud service model is the customer responsible for patching the guest operating system?",
    c: ["SaaS", "PaaS", "IaaS", "FaaS"],
    a: 2,
    e: "With IaaS the provider manages hardware and virtualization; the customer manages the OS, middleware, apps and data."
  },
  {
    id: "q3-02", d: 3, o: "3.1",
    q: "A DevOps team defines servers, networks and firewall rules in version-controlled template files that are deployed automatically. What is this practice?",
    c: ["Serverless", "Infrastructure as Code", "Microservices", "SD-WAN"],
    a: 1,
    e: "Infrastructure as Code (IaC) manages infrastructure through definition files, giving consistent, repeatable deployments."
  },
  {
    id: "q3-03", d: 3, o: "3.1",
    q: "A water treatment facility's control network has no physical or wireless connection to any other network. What is this design?",
    c: ["Screened subnet", "Logical segmentation", "Air gap", "VLAN"],
    a: 2,
    e: "An air gap physically isolates a system from all other networks. VLANs and screened subnets are logical separation."
  },
  {
    id: "q3-04", d: 3, o: "3.2",
    q: "A hospital's inline IPS fails. Management requires that patient-care systems remain reachable even if the IPS goes down. How should it be configured?",
    c: ["Fail-closed", "Fail-open", "Passive mode", "Tap mode"],
    a: 1,
    e: "Fail-open keeps traffic flowing when the device fails, prioritizing availability. Fail-closed would block traffic, prioritizing security."
  },
  {
    id: "q3-05", d: 3, o: "3.2",
    q: "Administrators must connect to servers in a secure zone through a single hardened host that is closely monitored. What is this host called?",
    c: ["Proxy server", "Jump server", "Load balancer", "Bastion VLAN"],
    a: 1,
    e: "A jump server (jump box) is a hardened intermediary used to access and manage devices in a separate security zone."
  },
  {
    id: "q3-06", d: 3, o: "3.2",
    q: "Which device would BEST protect a public web application against SQL injection and cross-site scripting attacks?",
    c: ["Layer 4 firewall", "WAF", "NAC", "Load balancer"],
    a: 1,
    e: "A Web Application Firewall inspects HTTP/S traffic at Layer 7 and blocks common web attacks like SQLi and XSS."
  },
  {
    id: "q3-07", d: 3, o: "3.2",
    q: "A company wants devices plugged into wall jacks to authenticate against a RADIUS server before receiving network access. Which standard should be implemented?",
    c: ["802.11ax", "802.1X", "802.3af", "802.1Q"],
    a: 1,
    e: "802.1X is port-based network access control using EAP with a RADIUS authentication server. 802.1Q is VLAN tagging."
  },
  {
    id: "q3-08", d: 3, o: "3.2",
    q: "A distributed company wants to combine SD-WAN with cloud-delivered security services such as SWG, CASB and ZTNA. Which solution fits?",
    c: ["UTM", "SASE", "NGFW", "IPsec site-to-site VPN"],
    a: 1,
    e: "Secure Access Service Edge (SASE) converges networking (SD-WAN) and security services delivered from the cloud."
  },
  {
    id: "q3-09", d: 3, o: "3.3",
    q: "A database is loaded into a server's RAM and is being processed by an application. What state is this data in?",
    c: ["At rest", "In transit", "In use", "Archived"],
    a: 2,
    e: "Data in use is actively being processed in memory or CPU. Protections include secure enclaves and memory encryption."
  },
  {
    id: "q3-10", d: 3, o: "3.3",
    q: "A European company must ensure customer data is stored only in data centers within the EU to comply with local law. Which concept is this?",
    c: ["Data masking", "Data sovereignty", "Data classification", "Tokenization"],
    a: 1,
    e: "Data sovereignty means data is subject to the laws of the country where it resides, driving geographic storage restrictions."
  },
  {
    id: "q3-11", d: 3, o: "3.4",
    q: "An organization needs a recovery site that can take over operations within minutes with current data. Cost is not a concern. Which should it choose?",
    c: ["Cold site", "Warm site", "Hot site", "Mobile site"],
    a: 2,
    e: "A hot site is fully equipped and has near real-time data, enabling the fastest recovery at the highest cost."
  },
  {
    id: "q3-12", d: 3, o: "3.4",
    q: "Which device provides short-term power to keep servers running during the few seconds before a generator starts?",
    c: ["PDU", "UPS", "Surge protector", "Dual power supply"],
    a: 1,
    e: "An Uninterruptible Power Supply (UPS) uses batteries to bridge brief outages until generator power is available."
  },
  {
    id: "q3-13", d: 3, o: "3.4",
    q: "Department leaders gather in a conference room to walk through how they would respond to a ransomware outbreak, without touching any systems. What is this?",
    c: ["Failover test", "Parallel processing", "Tabletop exercise", "Simulation"],
    a: 2,
    e: "A tabletop exercise is a discussion-based walkthrough of a scenario. A simulation goes further, emulating an actual event."
  },

  // ---------- Domain 4 ----------
  {
    id: "q4-01", d: 4, o: "4.1",
    q: "Which wireless security protocol uses SAE to protect against offline dictionary attacks on the pre-shared key?",
    c: ["WEP", "WPA", "WPA2-PSK", "WPA3"],
    a: 3,
    e: "WPA3 replaces the WPA2 PSK 4-way handshake with Simultaneous Authentication of Equals (SAE)."
  },
  {
    id: "q4-02", d: 4, o: "4.1",
    q: "A company purchases phones for employees and allows limited personal use, while retaining full management of the devices. Which deployment model is this?",
    c: ["BYOD", "COPE", "CYOD", "VDI"],
    a: 1,
    e: "Corporate-Owned, Personally Enabled (COPE). CYOD lets employees choose from an approved list of company devices; BYOD uses personal devices."
  },
  {
    id: "q4-03", d: 4, o: "4.1",
    q: "A developer wants to find vulnerabilities by analyzing source code without executing the application. What should be used?",
    c: ["Dynamic analysis", "Fuzzing", "Static code analysis", "Penetration test"],
    a: 2,
    e: "Static analysis (SAST) reviews code without running it. Dynamic analysis and fuzzing test the running application."
  },
  {
    id: "q4-04", d: 4, o: "4.2",
    q: "Hard drives from retired servers will be resold. Which approach allows reuse while ensuring data cannot be recovered?",
    c: ["Shredding", "Degaussing", "Sanitization (secure overwrite/crypto-erase)", "Deleting partitions"],
    a: 2,
    e: "Sanitization removes data while leaving media usable. Shredding destroys the drive; degaussing renders most modern drives unusable; deleting partitions leaves data recoverable."
  },
  {
    id: "q4-05", d: 4, o: "4.3",
    q: "A vulnerability scanner reports a flaw in software that is not installed on the host. What is this?",
    c: ["True positive", "False positive", "True negative", "False negative"],
    a: 1,
    e: "A false positive is an alert for an issue that doesn't actually exist. False negatives (missed real issues) are more dangerous."
  },
  {
    id: "q4-06", d: 4, o: "4.3",
    q: "Which system provides a numeric severity rating from 0.0 to 10.0 that helps prioritize vulnerabilities?",
    c: ["CVE", "CVSS", "SCAP", "NVD ID"],
    a: 1,
    e: "CVSS (Common Vulnerability Scoring System) scores severity. CVE provides the unique identifier."
  },
  {
    id: "q4-07", d: 4, o: "4.3",
    q: "After applying patches, what is the BEST way to validate that a vulnerability has been remediated?",
    c: ["Update the risk register", "Rescan the system", "Purchase cyber insurance", "Grant an exception"],
    a: 1,
    e: "Rescanning confirms the vulnerability is no longer present — part of the validation step."
  },
  {
    id: "q4-08", d: 4, o: "4.4",
    q: "A security team needs to collect logs from firewalls, servers and endpoints, correlate events, and generate alerts in one place. Which tool is needed?",
    c: ["NetFlow collector", "SIEM", "DLP", "FIM"],
    a: 1,
    e: "A SIEM aggregates and correlates logs from many sources to detect and alert on security events."
  },
  {
    id: "q4-09", d: 4, o: "4.5",
    q: "Which email authentication mechanism tells receiving servers to quarantine or reject messages that fail SPF and DKIM checks?",
    c: ["SPF", "DKIM", "DMARC", "S/MIME"],
    a: 2,
    e: "DMARC publishes a policy (none, quarantine, reject) for handling failures and enables reporting. SPF lists allowed senders; DKIM signs messages."
  },
  {
    id: "q4-10", d: 4, o: "4.5",
    q: "An administrator wants to be alerted whenever critical system binaries on a server are modified. Which control should be used?",
    c: ["DLP", "File integrity monitoring", "NAC", "Web filter"],
    a: 1,
    e: "File integrity monitoring compares file hashes to a known-good baseline and alerts on changes."
  },
  {
    id: "q4-11", d: 4, o: "4.5",
    q: "An organization wants to stop employees from emailing spreadsheets containing customer Social Security numbers outside the company. Which solution is BEST?",
    c: ["DLP", "EDR", "IPS", "SPF"],
    a: 0,
    e: "Data Loss Prevention inspects content and blocks sensitive data from leaving the organization."
  },
  {
    id: "q4-12", d: 4, o: "4.6",
    q: "Employees log in once to their corporate identity provider and can access multiple SaaS applications without re-entering credentials. The IdP sends XML assertions to the apps. Which technology is used?",
    c: ["Kerberos", "SAML", "RADIUS", "TACACS+"],
    a: 1,
    e: "SAML exchanges XML-based authentication assertions between an identity provider and service providers for web SSO."
  },
  {
    id: "q4-13", d: 4, o: "4.6",
    q: "In a military system, users can only read documents whose classification label is at or below their clearance level. Which access control model is this?",
    c: ["DAC", "RBAC", "MAC", "ABAC"],
    a: 2,
    e: "Mandatory Access Control uses labels and clearances enforced by the system; users cannot change permissions."
  },
  {
    id: "q4-14", d: 4, o: "4.6",
    q: "Access is granted only if the user is in the Finance department, using a managed device, and connecting during business hours. Which model is this?",
    c: ["Role-based", "Attribute-based", "Discretionary", "Mandatory"],
    a: 1,
    e: "ABAC evaluates multiple attributes of the user, resource and environment (device, time, location) to make decisions."
  },
  {
    id: "q4-15", d: 4, o: "4.6",
    q: "A user logs in with a password and a PIN. How many authentication factors is this?",
    c: ["One", "Two", "Three", "Zero — it is passwordless"],
    a: 0,
    e: "Both a password and a PIN are 'something you know', so this is single-factor authentication. MFA requires different factor types."
  },
  {
    id: "q4-16", d: 4, o: "4.6",
    q: "Administrators receive elevated privileges only when they request them for a specific task, and the privileges expire automatically after one hour. What is this?",
    c: ["Password vaulting", "Just-in-time permissions", "Federation", "Attestation"],
    a: 1,
    e: "Just-in-time (JIT) access, a PAM capability, grants privileges only when needed and revokes them automatically."
  },
  {
    id: "q4-17", d: 4, o: "4.7",
    q: "Which is a potential DRAWBACK of extensive security automation and orchestration?",
    c: ["Faster reaction time", "Baseline enforcement", "Single point of failure", "Workforce multiplier"],
    a: 2,
    e: "Automation introduces complexity, cost, technical debt and potential single points of failure. The other options are benefits."
  },
  {
    id: "q4-18", d: 4, o: "4.8",
    q: "An analyst has isolated an infected workstation from the network. Which incident response phase comes NEXT?",
    c: ["Detection", "Eradication", "Lessons learned", "Preparation"],
    a: 1,
    e: "Order: Preparation, Detection, Analysis, Containment, Eradication, Recovery, Lessons learned. Isolating the host is containment; removing the malware is eradication."
  },
  {
    id: "q4-19", d: 4, o: "4.8",
    q: "When collecting forensic evidence from a running server, which should be captured FIRST?",
    c: ["Hard disk image", "RAM contents", "Backup tapes", "Remote syslog data"],
    a: 1,
    e: "Order of volatility: CPU registers/cache, then RAM, then swap, disk, remote logs and archives. RAM is lost on power-off."
  },
  {
    id: "q4-20", d: 4, o: "4.8",
    q: "Which document records every person who handled a piece of evidence, when, and for what purpose?",
    c: ["Legal hold", "Chain of custody", "E-discovery request", "Incident report"],
    a: 1,
    e: "Chain of custody proves evidence integrity so it remains admissible in court."
  },
  {
    id: "q4-21", d: 4, o: "4.9",
    q: "An analyst needs to see the actual payload of suspicious traffic between two hosts. Which data source is BEST?",
    c: ["NetFlow records", "Packet capture", "Firewall summary dashboard", "Vulnerability scan"],
    a: 1,
    e: "A packet capture (PCAP) contains full packet contents. NetFlow only provides metadata about flows."
  },

  // ---------- Domain 5 ----------
  {
    id: "q5-01", d: 5, o: "5.1",
    q: "Which document provides step-by-step instructions for performing a specific task, such as onboarding a new employee?",
    c: ["Policy", "Standard", "Procedure", "Guideline"],
    a: 2,
    e: "Procedures are detailed step-by-step instructions. Policies are high-level, standards are specific mandatory rules, guidelines are recommendations."
  },
  {
    id: "q5-02", d: 5, o: "5.1",
    q: "A cloud payroll provider processes employee data according to instructions from a retail company. Under privacy law, the retail company is the:",
    c: ["Data processor", "Data controller", "Data custodian", "Data subject"],
    a: 1,
    e: "The controller determines the purposes and means of processing. The payroll provider is the processor."
  },
  {
    id: "q5-03", d: 5, o: "5.2",
    q: "A server is valued at $50,000. A flood would destroy 40% of it, and floods occur once every 10 years. What is the ALE?",
    c: ["$2,000", "$5,000", "$20,000", "$200,000"],
    a: 0,
    e: "SLE = AV × EF = $50,000 × 0.40 = $20,000. ARO = 1/10 = 0.1. ALE = SLE × ARO = $20,000 × 0.1 = $2,000."
  },
  {
    id: "q5-04", d: 5, o: "5.2",
    q: "A company buys cybersecurity insurance to cover the costs of a potential data breach. Which risk strategy is this?",
    c: ["Accept", "Avoid", "Transfer", "Mitigate"],
    a: 2,
    e: "Insurance transfers the financial impact of a risk to a third party."
  },
  {
    id: "q5-05", d: 5, o: "5.2",
    q: "A business can tolerate losing at most 4 hours of transaction data. Which metric does this define?",
    c: ["RTO", "RPO", "MTTR", "MTBF"],
    a: 1,
    e: "Recovery Point Objective is the maximum acceptable data loss measured in time; it drives backup frequency. RTO is the maximum downtime."
  },
  {
    id: "q5-06", d: 5, o: "5.2",
    q: "Management decides to stop offering a risky legacy service entirely rather than secure it. Which risk response is this?",
    c: ["Avoidance", "Acceptance", "Transference", "Mitigation"],
    a: 0,
    e: "Risk avoidance eliminates the risk by ceasing the activity that causes it."
  },
  {
    id: "q5-07", d: 5, o: "5.3",
    q: "Which contract clause allows a company to evaluate its vendor's security controls directly?",
    c: ["Non-disclosure clause", "Right-to-audit clause", "Indemnification clause", "Force majeure clause"],
    a: 1,
    e: "A right-to-audit clause grants the customer the ability to audit the vendor's controls."
  },
  {
    id: "q5-08", d: 5, o: "5.3",
    q: "Which agreement defines measurable performance expectations such as 99.9% uptime and the penalties if they aren't met?",
    c: ["MOU", "NDA", "SLA", "BPA"],
    a: 2,
    e: "A Service Level Agreement specifies service metrics and remedies. An MOU is typically a non-binding statement of intent."
  },
  {
    id: "q5-09", d: 5, o: "5.3",
    q: "Two companies sign an umbrella contract establishing general terms, and future projects are then defined in individual statements of work. What is the umbrella contract?",
    c: ["MSA", "SLA", "MOA", "WO"],
    a: 0,
    e: "A Master Service Agreement sets the overarching terms; SOWs/work orders define the details of each engagement."
  },
  {
    id: "q5-10", d: 5, o: "5.4",
    q: "A customer in the EU asks a company to permanently delete all personal data held about them. Which right are they exercising?",
    c: ["Data portability", "Right to be forgotten", "Data sovereignty", "Legal hold"],
    a: 1,
    e: "GDPR's right to erasure, commonly called the right to be forgotten."
  },
  {
    id: "q5-11", d: 5, o: "5.5",
    q: "A penetration tester is given network diagrams, source code and credentials before testing. Which type of test is this?",
    c: ["Unknown environment", "Partially known environment", "Known environment", "Passive reconnaissance"],
    a: 2,
    e: "A known environment (formerly white box) test provides full information. Partially known = gray box, unknown = black box."
  },
  {
    id: "q5-12", d: 5, o: "5.5",
    q: "A tester researches a target's employees on social media and reviews public DNS records without sending any traffic to the target's systems. What is this?",
    c: ["Active reconnaissance", "Passive reconnaissance", "Vulnerability scanning", "Pivoting"],
    a: 1,
    e: "Passive reconnaissance (OSINT) gathers information without directly interacting with the target."
  },
  {
    id: "q5-13", d: 5, o: "5.5",
    q: "The offensive security team and the SOC work together in real time during an exercise, sharing findings to improve detections. What is this called?",
    c: ["Red team", "Blue team", "Purple team", "White team"],
    a: 2,
    e: "Purple teaming integrates red (offense) and blue (defense) to improve the organization's defenses collaboratively."
  },
  {
    id: "q5-14", d: 5, o: "5.6",
    q: "What is the PRIMARY goal of running simulated phishing campaigns against employees?",
    c: ["To discipline employees who click links", "To measure and improve users' ability to recognize and report phishing", "To test the email server's capacity", "To satisfy PCI DSS encryption requirements"],
    a: 1,
    e: "Simulated phishing measures susceptibility and builds recognition and reporting habits through training."
  },
  {
    id: "q5-15", d: 5, o: "5.6",
    q: "An employee finds a USB drive labeled 'Q4 Layoffs' in the parking lot. According to good security awareness practice, what should they do?",
    c: ["Plug it into a personal computer to check it", "Plug it into a work computer with antivirus", "Turn it in to the security team without connecting it", "Throw it away"],
    a: 2,
    e: "Unknown removable media may contain malware (baiting). Report and hand it to security rather than connecting it anywhere."
  }
];
