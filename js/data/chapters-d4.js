// In-depth chapters — Domain 4: Security Operations.
window.SECPLUS = window.SECPLUS || {};
SECPLUS.chapters = SECPLUS.chapters || {};

SECPLUS.chapters["4.1"] = {
  overview: "Secure baselines, hardening, wireless and mobile security, and application security techniques make up the day-to-day work of securing computing resources.",
  sections: [
    { h: "Secure baselines", html: `
<p>A <b>secure baseline</b> is a documented, hardened configuration (often built from CIS Benchmarks or vendor guides). Its life cycle has three steps: <b>establish</b> it (define and test), <b>deploy</b> it (golden images, GPO, MDM, IaC), and <b>maintain</b> it (monitor for drift, update as threats change).</p>
<p><b>Hardening targets</b> and typical steps:</p>
<ul>
<li><b>Workstations and servers</b>: remove unneeded software, patch, EDR, host firewall, disable unused services, least privilege.</li>
<li><b>Switches and routers</b>: SSH not Telnet, SNMPv3, disable unused ports, change defaults, secure management VLAN.</li>
<li><b>Mobile devices</b>: MDM, encryption, screen lock, app control.</li>
<li><b>Cloud infrastructure</b>: least-privilege IAM, no public storage, logging enabled.</li>
<li><b>ICS/SCADA, embedded, RTOS, IoT</b>: segmentation, change defaults, firmware updates where possible.</li>
</ul>` },
    { h: "Wireless security", html: `
<ul>
<li><b>Site survey</b> and <b>heat maps</b>: plan AP placement and coverage and find interference and rogue APs.</li>
<li><b>WPA3</b>: uses <b>SAE</b> (Simultaneous Authentication of Equals) instead of the PSK handshake, which resists offline dictionary attacks and provides forward secrecy. WPA3-Enterprise offers a 192-bit mode.</li>
<li><b>Enterprise vs. personal</b>: Enterprise uses 802.1X and <b>RADIUS</b> for per-user authentication (AAA); Personal uses one shared passphrase.</li>
<li>Avoid WEP, WPA/TKIP and WPS.</li>
</ul>` },
    { h: "Mobile solutions", html: `
<p><b>MDM</b> enforces policies: encryption, passcodes, remote wipe, app allow/block lists, geofencing, and containerization (separating corporate and personal data).</p>
<p><b>Deployment models</b>: <b>BYOD</b> (employee-owned, hardest to control), <b>COPE</b> (corporate-owned, personally enabled), <b>CYOD</b> (employee chooses from approved company devices). Connection methods include cellular, Wi-Fi and Bluetooth, and each needs securing.</p>` },
    { h: "Application security", html: `
<ul>
<li><b>Input validation</b>: accept only expected type, length, format and range; validate on the server side.</li>
<li><b>Secure cookies</b>: <code>Secure</code> (HTTPS only), <code>HttpOnly</code> (no JavaScript access), <code>SameSite</code> (CSRF protection).</li>
<li><b>Static code analysis (SAST)</b>: reviews source code without running it. <b>Dynamic analysis (DAST)</b> and <b>fuzzing</b> test the running app.</li>
<li><b>Code signing</b>: proves publisher identity and integrity.</li>
<li><b>Sandboxing</b>: runs untrusted code in isolation.</li>
<li><b>Monitoring</b>: logs and alerts on application behavior.</li>
</ul>` }
  ],
  tips: [
    "Wireless offline-dictionary resistance: WPA3 / SAE.",
    "Company buys the phone, employee may use it personally: COPE.",
    "Analyze code without running it: static analysis."
  ],
  traps: [
    "Relying on client-side validation alone. It is easily bypassed.",
    "Confusing CYOD (company-owned) with BYOD (employee-owned)."
  ]
};

SECPLUS.chapters["4.2"] = {
  overview: "You can't protect what you don't know you have. Asset management runs from procurement to disposal, and each stage has security implications.",
  sections: [
    { h: "Acquisition through monitoring", html: `
<ul>
<li><b>Acquisition/procurement</b>: vet vendors, require security features and support lifecycles, and buy from trusted sources (counterfeit-hardware risk).</li>
<li><b>Assignment/accounting</b>: give each asset an <b>owner</b> and a <b>classification</b>.</li>
<li><b>Monitoring/asset tracking</b>: keep an accurate <b>inventory</b> (CMDB, asset tags, RFID) and use <b>enumeration</b> (network discovery scans) to find unknown or rogue devices.</li>
</ul>` },
    { h: "Disposal and decommissioning", html: `
<ul>
<li><b>Sanitization</b>: removes data so the media can be reused. Methods: overwriting, secure erase, <b>cryptographic erase</b> (destroying the key), which is ideal for SSDs.</li>
<li><b>Destruction</b>: shredding, pulverizing, incineration, <b>degaussing</b> (magnetic media only, not SSDs).</li>
<li><b>Certification</b>: a certificate of destruction or sanitization from the vendor, kept for audits.</li>
<li><b>Data retention</b>: keep data only as long as policy and law require, then dispose of it securely. Legal holds override normal retention.</li>
</ul>` }
  ],
  tips: [
    "Reuse the drive: sanitize. Never reuse it: destroy.",
    "Proof of destruction for auditors: certificate of destruction.",
    "Degaussing doesn't work on SSDs."
  ],
  traps: [
    "Thinking deleting files or formatting a drive sanitizes it. Data remains recoverable."
  ]
};

SECPLUS.chapters["4.3"] = {
  overview: "Vulnerability management is a continuous cycle: identify, analyze, respond, validate, report. Know the sources, the scoring, and the response options.",
  sections: [
    { h: "Identification", html: `
<ul>
<li><b>Vulnerability scans</b>: <i>credentialed</i> scans log in and are more accurate with fewer false positives; <i>non-credentialed</i> scans show the outside attacker's view. <i>Intrusive</i> scans try exploits; <i>non-intrusive</i> scans only detect.</li>
<li><b>Application security</b>: static analysis, dynamic analysis, <b>package monitoring</b> (third-party library vulnerabilities, software composition analysis).</li>
<li><b>Threat feeds</b>: <b>OSINT</b>, proprietary/third-party feeds, information-sharing organizations (ISACs), and the <b>dark web</b> (leaked credentials, chatter).</li>
<li><b>Penetration testing</b>: exploits vulnerabilities to prove impact.</li>
<li><b>Responsible disclosure programs</b> and <b>bug bounties</b>: outside researchers report flaws.</li>
<li><b>System/process audits</b>.</li>
</ul>` },
    { h: "Analysis and prioritization", html: `
<ul>
<li><b>Confirmation</b>: rule out <b>false positives</b> (reported but not real). <b>False negatives</b> (real but missed) are worse.</li>
<li><b>CVE</b>: the unique identifier for a known vulnerability. <b>CVSS</b>: severity score from 0.0 to 10.0 (Low, Medium, High, Critical).</li>
<li><b>Prioritize</b> with context: <b>exposure factor</b>, <b>environmental variables</b> (is it internet-facing? are there compensating controls?), <b>industry/organizational impact</b>, and <b>risk tolerance</b>. A CVSS 9.8 on an isolated lab box may rank below a 7.5 on a public web server.</li>
</ul>` },
    { h: "Response, validation and reporting", html: `
<ul>
<li><b>Patching</b>: the preferred fix.</li>
<li><b>Insurance</b>: transfers financial risk.</li>
<li><b>Segmentation</b> and other <b>compensating controls</b> when a patch isn't possible.</li>
<li><b>Exceptions/exemptions</b>: formally accept the risk for a period, with sign-off.</li>
<li><b>Validation</b>: <b>rescan</b>, audit and verify the fix worked.</li>
<li><b>Reporting</b>: metrics and trends for management.</li>
</ul>` }
  ],
  tips: [
    "Identifier: CVE. Severity score: CVSS.",
    "Confirm a fix: rescan.",
    "More accurate scans: credentialed."
  ],
  traps: [
    "Prioritizing only by CVSS. Context (exposure, asset value) matters.",
    "Thinking a false positive is more dangerous than a false negative. It's the reverse."
  ]
};

SECPLUS.chapters["4.4"] = {
  overview: "Monitoring turns raw events into actionable alerts. Know what to monitor, which activities make it work, and which tool fits the job.",
  sections: [
    { h: "What to monitor and core activities", html: `
<p>Monitor <b>systems</b>, <b>applications</b> and <b>infrastructure</b>. Core activities:</p>
<ul>
<li><b>Log aggregation</b>: collect logs centrally (protects evidence and enables correlation).</li>
<li><b>Alerting</b>: rules that trigger on suspicious patterns.</li>
<li><b>Scanning</b>: vulnerability and compliance scans.</li>
<li><b>Reporting</b> and <b>archiving</b>: retain logs for investigations and compliance.</li>
<li><b>Alert response and remediation</b>: <b>quarantine</b>, <b>alert tuning</b> (cut false positives without creating false negatives), and <b>validation</b>.</li>
</ul>` },
    { h: "Tools", html: `
<table class="data"><thead><tr><th>Tool</th><th>Purpose</th></tr></thead><tbody>
<tr><td><b>SIEM</b></td><td>Aggregates and correlates logs from many sources; alerts and dashboards</td></tr>
<tr><td><b>SCAP</b></td><td>Standards (CVE, CVSS, CPE, XCCDF, OVAL) for automated vulnerability and compliance checks</td></tr>
<tr><td><b>Benchmarks</b></td><td>CIS and vendor secure configuration standards</td></tr>
<tr><td><b>Agents vs. agentless</b></td><td>Agents give deep endpoint visibility; agentless avoids installing software</td></tr>
<tr><td><b>Antivirus / EDR</b></td><td>Endpoint malware detection and response</td></tr>
<tr><td><b>DLP</b></td><td>Detects and blocks sensitive data leaving</td></tr>
<tr><td><b>SNMP traps</b></td><td>Devices push alerts to the network management system</td></tr>
<tr><td><b>NetFlow</b></td><td>Traffic flow metadata (who, when, how much), not payloads</td></tr>
<tr><td><b>Vulnerability scanners</b></td><td>Find known flaws and misconfigurations</td></tr>
</tbody></table>
<p>Time synchronization (<b>NTP</b>) across systems is essential, or log correlation fails.</p>` }
  ],
  tips: [
    "Correlate logs from everything: SIEM.",
    "Who talked to whom and how much, without payloads: NetFlow.",
    "Too many false alarms: alert tuning."
  ],
  traps: [
    "Picking a packet capture when only flow metadata is needed (or the reverse).",
    "Forgetting NTP. Unsynced clocks break investigations."
  ]
};

SECPLUS.chapters["4.5"] = {
  overview: "This objective is about changing the enterprise's capabilities to improve security: firewall rules, IDS/IPS, web and DNS filtering, email authentication, OS controls, and endpoint and identity analytics. Firewall rule PBQs are common.",
  sections: [
    { h: "Firewall rules and ACLs", html: `
<ul>
<li>Rules are processed <b>top-down; the first match wins</b>. Put specific rules above general ones.</li>
<li>End with an <b>implicit (or explicit) deny</b>: anything not explicitly allowed is blocked.</li>
<li>Each rule specifies action, source, destination, protocol and port.</li>
<li><b>Screened subnets</b> host public services, with tightly scoped rules from the internet to the DMZ and from the DMZ to internal systems.</li>
<li>Close unneeded ports and protocols; restrict management access to admin networks or jump servers.</li>
</ul>` },
    { h: "IDS/IPS, web filtering and DNS filtering", html: `
<ul>
<li><b>IDS/IPS</b>: keep <b>signatures</b> updated, watch <b>trends</b>, tune rules.</li>
<li><b>Web filter</b>: <b>agent-based</b> (follows the laptop anywhere) or <b>centralized proxy</b>. Features include URL scanning, <b>content categorization</b>, <b>block rules</b> and <b>reputation</b> scores.</li>
<li><b>DNS filtering</b>: refuses to resolve malicious or unwanted domains. Simple and effective against phishing and C2.</li>
</ul>` },
    { h: "Email security", html: `
<table class="data"><thead><tr><th>Mechanism</th><th>What it does</th></tr></thead><tbody>
<tr><td><b>SPF</b></td><td>A DNS TXT record listing which servers may send mail for the domain</td></tr>
<tr><td><b>DKIM</b></td><td>Signs outgoing mail; receivers verify it with a public key in DNS (integrity and domain authenticity)</td></tr>
<tr><td><b>DMARC</b></td><td>Policy for SPF/DKIM failures (none, quarantine, reject) plus reporting; requires alignment with the From domain</td></tr>
<tr><td><b>Email gateway</b></td><td>Filters spam, malware and phishing; sandboxes attachments; rewrites URLs</td></tr>
</tbody></table>` },
    { h: "OS and endpoint controls", html: `
<ul>
<li><b>Group Policy</b> (Windows) and <b>SELinux</b> (Linux mandatory access control) enforce OS security settings.</li>
<li><b>Secure protocols</b>: SSH, SFTP, HTTPS, LDAPS, SNMPv3, IMAPS/POP3S, SRTP, DNSSEC.</li>
<li><b>File integrity monitoring (FIM)</b>: alerts when critical files change.</li>
<li><b>DLP</b>: blocks sensitive data leaving by email, web, USB or cloud.</li>
<li><b>NAC</b>: checks device identity and health (posture) before granting network access.</li>
<li><b>EDR/XDR</b>: endpoint, or extended (endpoint, network, cloud, email), detection and response.</li>
<li><b>User behavior analytics (UBA/UEBA)</b>: baselines normal behavior and flags anomalies (insider threats, compromised accounts).</li>
</ul>` }
  ],
  tips: [
    "A block rule that 'doesn't work' is usually below a broader allow rule. Fix the order.",
    "Tell receivers to reject spoofed mail: DMARC.",
    "Check device health before network access: NAC."
  ],
  traps: [
    "Thinking SPF alone stops spoofing. DMARC is what enforces it.",
    "Forgetting the implicit deny at the end of a rule set."
  ]
};

SECPLUS.chapters["4.6"] = {
  overview: "Identity is the new perimeter. This objective covers the identity life cycle, federation and SSO, access control models, MFA, passwords, and privileged access management.",
  sections: [
    { h: "Identity life cycle", html: `
<ul>
<li><b>Provisioning / deprovisioning</b>: create access on hire; remove it immediately on termination. Automate both from HR systems.</li>
<li><b>Permission assignments</b>: based on role, with least privilege.</li>
<li><b>Identity proofing</b>: verify a person is who they claim to be before issuing an identity.</li>
<li><b>Attestation</b>: periodic access reviews in which managers recertify access, which removes privilege creep.</li>
</ul>` },
    { h: "Federation and SSO", html: `
<ul>
<li><b>SSO</b>: one login grants access to many applications.</li>
<li><b>Federation</b>: trust between organizations or domains; the identity provider (IdP) vouches for users to service providers (SPs).</li>
<li><b>SAML</b>: XML-based assertions, common for enterprise web SSO.</li>
<li><b>OAuth 2.0</b>: <i>authorization</i> delegation through access tokens (an app gets access to your data without your password). <b>OpenID Connect</b> adds <i>authentication</i> on top of OAuth.</li>
<li><b>LDAP</b>: directory queries (389; LDAPS on 636). <b>Kerberos</b>: ticket-based authentication in Active Directory.</li>
</ul>` },
    { h: "Access control models", html: `
<table class="data"><thead><tr><th>Model</th><th>Who decides / based on</th></tr></thead><tbody>
<tr><td><b>Mandatory (MAC)</b></td><td>System enforces labels and clearances; users can't change them</td></tr>
<tr><td><b>Discretionary (DAC)</b></td><td>The resource owner grants access</td></tr>
<tr><td><b>Role-based (RBAC)</b></td><td>Permissions assigned to job roles</td></tr>
<tr><td><b>Rule-based</b></td><td>System-wide rules (ACLs, time-of-day restrictions)</td></tr>
<tr><td><b>Attribute-based (ABAC)</b></td><td>Attributes of user, resource, action and environment combined</td></tr>
</tbody></table>
<p>Also: <b>least privilege</b> and <b>time-of-day restrictions</b>.</p>` },
    { h: "Multifactor authentication", html: `
<p>Factors: <b>something you know</b> (password, PIN), <b>something you have</b> (token, phone, smart card, security key), <b>something you are</b> (biometrics), and <b>somewhere you are</b> (location). MFA requires factors of <i>different</i> types, so a password plus a PIN is still single-factor.</p>
<ul>
<li><b>Hard tokens</b> (FIDO2/U2F security keys, which resist phishing) vs. <b>soft tokens</b> (authenticator apps using <b>TOTP</b> codes that change every 30 seconds; <b>HOTP</b> is counter-based).</li>
<li><b>Biometrics</b>: watch the <b>FAR</b> (false acceptance, a security risk) and <b>FRR</b> (false rejection, a usability problem); the <b>CER</b> is where they are equal (lower is better).</li>
<li>SMS codes are the weakest second factor (SIM swapping).</li>
</ul>` },
    { h: "Passwords and privileged access", html: `
<p><b>Password best practices</b>: length matters most; also complexity, no reuse (password history plus a minimum age), expiration only on evidence of compromise (modern NIST guidance), <b>password managers</b>, and moving to <b>passwordless</b> (passkeys/FIDO2).</p>
<p><b>Privileged access management (PAM)</b>:</p>
<ul>
<li><b>Just-in-time (JIT) permissions</b>: elevated access granted only when needed, then revoked automatically.</li>
<li><b>Password vaulting</b>: privileged credentials checked out from a vault and rotated after use.</li>
<li><b>Ephemeral credentials</b>: short-lived credentials that expire automatically.</li>
</ul>` }
  ],
  tips: [
    "XML assertions for web SSO: SAML. App access to your data without your password: OAuth.",
    "Labels and clearances: MAC. Owner decides: DAC. Job function: RBAC. Many attributes: ABAC.",
    "Password + PIN = ONE factor."
  ],
  traps: [
    "Calling OAuth an authentication protocol. It's authorization; OIDC adds authentication.",
    "Thinking a higher FAR is safer. A high FAR lets impostors in."
  ]
};

SECPLUS.chapters["4.7"] = {
  overview: "Automation and orchestration (scripts, SOAR, CI/CD, guard rails) let small teams operate securely at scale. Know the use cases, benefits and drawbacks.",
  sections: [
    { h: "Use cases", html: `
<ul>
<li><b>User provisioning</b> and <b>resource provisioning</b> from templates.</li>
<li><b>Guard rails</b>: automatically block or fix non-compliant configurations (no unencrypted buckets).</li>
<li><b>Security groups</b>: automated firewall and group assignments.</li>
<li><b>Ticket creation</b> and <b>escalation</b> from alerts.</li>
<li><b>Enabling/disabling services and access</b> (for example disabling an account on an impossible-travel alert).</li>
<li><b>Continuous integration and testing</b>: security tests in the CI/CD pipeline.</li>
<li><b>Integrations and APIs</b>: connect tools together (SIEM to SOAR to EDR to ticketing).</li>
</ul>
<p><b>SOAR</b> (Security Orchestration, Automation and Response) runs <b>playbooks</b> that automate response steps.</p>` },
    { h: "Benefits and considerations", html: `
<p><b>Benefits</b>: efficiency and time saving, enforcing baselines, standard infrastructure configurations, scaling securely, employee retention (less tedious work), faster reaction time, and acting as a workforce multiplier.</p>
<p><b>Considerations</b>: complexity, cost, a <b>single point of failure</b>, <b>technical debt</b>, and <b>ongoing supportability</b> (who maintains the scripts when their author leaves?).</p>` }
  ],
  tips: [
    "Automatically prevent insecure cloud deployments: guard rails.",
    "Automated response playbooks: SOAR."
  ],
  traps: [
    "Picking 'faster reaction time' when the question asks for a DRAWBACK."
  ]
};

SECPLUS.chapters["4.8"] = {
  overview: "Incident response is a high-yield topic: the phase order, what happens in each phase, training and testing, and the digital forensics concepts that keep evidence admissible.",
  sections: [
    { h: "The incident response process", html: `
<ol>
<li><b>Preparation</b>: IR plan, team roles, tools and jump kits, communication plans, training.</li>
<li><b>Detection</b>: alerts, user reports and threat intelligence surface a possible incident.</li>
<li><b>Analysis</b>: confirm it's real, scope it, and determine severity.</li>
<li><b>Containment</b>: stop the spread by isolating hosts, disabling accounts and blocking IPs. Choose a strategy (isolation, segmentation) that preserves evidence.</li>
<li><b>Eradication</b>: remove the cause (malware, attacker persistence, vulnerable configuration).</li>
<li><b>Recovery</b>: restore systems to production and monitor closely for reinfection.</li>
<li><b>Lessons learned</b>: a post-incident review to improve controls and the plan.</li>
</ol>` },
    { h: "Training, testing and analysis", html: `
<ul>
<li><b>Training</b>: role-specific training for IR team members and awareness for staff.</li>
<li><b>Testing</b>: <b>tabletop exercises</b> (discussion) and <b>simulations</b> (realistic practice).</li>
<li><b>Root cause analysis</b>: find the underlying cause so it doesn't recur.</li>
<li><b>Threat hunting</b>: proactively search for hidden attackers based on hypotheses and intelligence.</li>
</ul>` },
    { h: "Digital forensics", html: `
<ul>
<li><b>Legal hold</b>: preserve all relevant data; suspend normal deletion.</li>
<li><b>Chain of custody</b>: document every person who handled the evidence, when, and why.</li>
<li><b>Acquisition</b>: create forensic images with <b>write blockers</b>; <b>hash</b> the original and the copy to prove integrity.</li>
<li><b>Order of volatility</b>: CPU registers/cache, then RAM, then swap and temp files, then disk, then remote logs, then archives and backups.</li>
<li><b>Preservation</b>: store evidence securely; work only on copies.</li>
<li><b>Reporting</b> and <b>e-discovery</b> (finding and producing electronic evidence for legal proceedings).</li>
</ul>` }
  ],
  tips: [
    "Isolating a host is containment. Removing malware is eradication. Restoring service is recovery.",
    "Capture RAM before pulling the plug.",
    "Proving evidence wasn't altered: hashes plus chain of custody."
  ],
  traps: [
    "Jumping to eradication before containment.",
    "Powering off a compromised machine first, which loses volatile evidence."
  ]
};

SECPLUS.chapters["4.9"] = {
  overview: "Investigations depend on the right data source. Questions describe what you need to learn; you pick the log or tool that reveals it.",
  sections: [
    { h: "Log data", html: `
<table class="data"><thead><tr><th>Source</th><th>Tells you</th></tr></thead><tbody>
<tr><td><b>Firewall logs</b></td><td>Allowed and denied connections, sources, destinations, ports (scans, blocked C2)</td></tr>
<tr><td><b>Application logs</b></td><td>App-level events, errors, logins, transactions (web access logs show SQLi and traversal attempts)</td></tr>
<tr><td><b>Endpoint logs</b></td><td>Process creation, file changes, connections per process (EDR, Sysmon)</td></tr>
<tr><td><b>OS-specific security logs</b></td><td>Windows Security log (4624 logon, 4625 failed logon, 4720 user created), Linux auth.log</td></tr>
<tr><td><b>IDS/IPS logs</b></td><td>Signature matches and blocked attacks</td></tr>
<tr><td><b>Network logs</b></td><td>Switch, router, DHCP, DNS and proxy activity</td></tr>
<tr><td><b>Metadata</b></td><td>Email headers, file timestamps and authors, photo GPS (EXIF)</td></tr>
</tbody></table>` },
    { h: "Other data sources", html: `
<ul>
<li><b>Vulnerability scans</b>: which weaknesses existed at the time.</li>
<li><b>Automated reports</b> and <b>dashboards</b>: trends and anomalies at a glance (SIEM).</li>
<li><b>Packet captures</b>: full payloads for deep analysis (Wireshark, tcpdump).</li>
</ul>` }
  ],
  tips: [
    "Which PROCESS made the connection: endpoint logs (EDR).",
    "Full payload: packet capture. Just who talked to whom: NetFlow or firewall logs.",
    "Many 4625 events: failed logons (brute force or spraying)."
  ],
  traps: [
    "Using firewall logs to identify the process on a host. They can't see that."
  ]
};
