// In-depth chapters — Domain 2: Threats, Vulnerabilities, and Mitigations.
window.SECPLUS = window.SECPLUS || {};
SECPLUS.chapters = SECPLUS.chapters || {};

SECPLUS.chapters["2.1"] = {
  overview: "To defend well you need to know who is attacking and why. Questions describe an attacker's resources, skill, access and goals, and ask you to name the actor or the motivation.",
  sections: [
    { h: "Threat actors", html: `
<table class="data"><thead><tr><th>Actor</th><th>Resources & sophistication</th><th>Typical motivation</th></tr></thead><tbody>
<tr><td><b>Nation-state</b></td><td>Highest; custom zero-days, long campaigns (APTs)</td><td>Espionage, war, disruption of critical infrastructure, political influence</td></tr>
<tr><td><b>Organized crime</b></td><td>High; run like businesses (ransomware-as-a-service)</td><td>Financial gain, extortion, data sales</td></tr>
<tr><td><b>Hacktivist</b></td><td>Low to moderate</td><td>Philosophical or political beliefs: defacement, DDoS, leaks</td></tr>
<tr><td><b>Insider threat</b></td><td>Varies, but has legitimate access and knowledge</td><td>Revenge, financial gain, or accidental (negligence)</td></tr>
<tr><td><b>Unskilled attacker</b></td><td>Low; uses others' tools and scripts</td><td>Thrill, notoriety, disruption</td></tr>
<tr><td><b>Shadow IT</b></td><td>Not malicious; employees using unapproved tech</td><td>Convenience. Creates unmanaged risk.</td></tr>
</tbody></table>` },
    { h: "Attributes of an actor", html: `
<ul>
<li><b>Internal vs. external</b>: insiders already have access and bypass perimeter controls, so they are hard to detect.</li>
<li><b>Resources and funding</b>: determine the tools, persistence and ability to buy or develop exploits.</li>
<li><b>Level of sophistication/capability</b>: ranges from running a downloaded script to developing zero-day exploits and supply-chain implants.</li>
</ul>
<p>An <b>APT</b> (Advanced Persistent Threat) is a well-resourced actor, usually a nation-state, that gains access and quietly stays for months, moving laterally and exfiltrating data.</p>` },
    { h: "Motivations", html: `
<p>Know the list: <b>data exfiltration, espionage, service disruption, blackmail, financial gain, philosophical/political beliefs, ethical</b> (authorized or white-hat hacking), <b>revenge, disruption/chaos, war</b>. In a scenario, the clue is usually what the attacker <i>did with the access</i>: encrypting for ransom points to financial gain; defacing with a message points to political beliefs; quietly copying designs for years points to espionage.</p>` }
  ],
  tips: [
    "Years of stealthy access plus a big budget: nation-state / APT.",
    "Ransomware gang: organized crime, financial motive.",
    "Unapproved SaaS app adopted by a department: shadow IT."
  ],
  traps: [
    "Assuming insider threats are always malicious. Negligent insiders are a major source of incidents.",
    "Calling every defacement a 'nation-state'. Political messaging usually points to hacktivists."
  ]
};

SECPLUS.chapters["2.2"] = {
  overview: "A threat vector is the path an attacker uses to reach a target; the attack surface is the sum of all those paths. Most breaches start with a human vector, so social engineering is heavily tested.",
  sections: [
    { h: "Message, file and media vectors", html: `
<ul>
<li><b>Email</b>: phishing, malicious attachments and links. The number-one initial access vector.</li>
<li><b>SMS</b>: smishing. <b>Instant messaging</b>: links and files over chat apps.</li>
<li><b>Image-based</b>: malicious code or exploits inside image files; QR-code phishing ("quishing").</li>
<li><b>File-based</b>: weaponized documents (macros), PDFs, archives.</li>
<li><b>Voice call</b>: vishing, including AI voice cloning of executives.</li>
<li><b>Removable devices</b>: USB drops (baiting), malicious cables, infected external drives.</li>
</ul>` },
    { h: "Software, network and supply-chain vectors", html: `
<ul>
<li><b>Vulnerable software</b>: <i>client-based</i> software installs an agent that must be patched on each host; <i>agentless</i> software shifts risk to the central server and protocols it uses.</li>
<li><b>Unsupported systems and applications</b>: end-of-life OSs and apps get no patches.</li>
<li><b>Unsecure networks</b>: open or weak <b>wireless</b> (evil twins, WEP/WPA), exposed <b>wired</b> ports with no 802.1X, <b>Bluetooth</b> (bluejacking sends unsolicited messages; bluesnarfing steals data).</li>
<li><b>Open service ports</b>: every listening service is attack surface.</li>
<li><b>Default credentials</b>: admin/admin on routers, cameras and IoT devices.</li>
<li><b>Supply chain</b>: <b>managed service providers</b> (one MSP compromise reaches all its clients), <b>vendors</b> (malicious updates), <b>suppliers</b> (tampered or counterfeit hardware).</li>
</ul>` },
    { h: "Human vectors and social engineering", html: `
<table class="data"><thead><tr><th>Technique</th><th>Key characteristic</th></tr></thead><tbody>
<tr><td><b>Phishing</b></td><td>Fraudulent messages sent broadly</td></tr>
<tr><td><b>Spear phishing / whaling</b></td><td>Targeted at specific people / at executives</td></tr>
<tr><td><b>Vishing / smishing</b></td><td>Voice calls / SMS</td></tr>
<tr><td><b>Misinformation / disinformation</b></td><td>False info shared unknowingly / deliberately to deceive</td></tr>
<tr><td><b>Impersonation</b></td><td>Pretending to be someone (IT, an executive, a vendor)</td></tr>
<tr><td><b>Business email compromise</b></td><td>Using a real or spoofed business account to redirect payments or steal data</td></tr>
<tr><td><b>Pretexting</b></td><td>A fabricated scenario that justifies the request</td></tr>
<tr><td><b>Watering hole</b></td><td>Compromising a site the target group regularly visits</td></tr>
<tr><td><b>Brand impersonation</b></td><td>Copying a trusted brand's look in emails or sites</td></tr>
<tr><td><b>Typosquatting</b></td><td>Look-alike domains (micros0ft.com)</td></tr>
</tbody></table>
<p>Social engineering exploits <b>authority, urgency, scarcity, familiarity, trust and fear</b>. The defense is a combination of awareness training, verification procedures (call back on a known number), email security (SPF/DKIM/DMARC) and MFA.</p>` }
  ],
  tips: [
    "Payment-redirect email from a real executive mailbox: BEC.",
    "A believable story to justify the request: pretexting.",
    "Compromised third-party IT provider used to hit its customers: supply chain (MSP)."
  ],
  traps: [
    "Mixing up misinformation (unintentional) with disinformation (intentional).",
    "Confusing bluejacking (messages) with bluesnarfing (data theft)."
  ]
};

SECPLUS.chapters["2.3"] = {
  overview: "Vulnerabilities are weaknesses that threats exploit. You should be able to recognize each class from a short description or a code or log snippet, and know the standard mitigation.",
  sections: [
    { h: "Application vulnerabilities", html: `
<ul>
<li><b>Buffer overflow</b>: input larger than the allocated buffer overwrites adjacent memory, often the return address, enabling code execution. Mitigations: bounds checking, memory-safe languages, ASLR, DEP/NX.</li>
<li><b>Memory injection</b>: malicious code injected into a legitimate process's memory (DLL injection, process hollowing) to hide and inherit privileges.</li>
<li><b>Race condition / TOC-TOU</b>: the state changes between the time of check and the time of use. Mitigation: atomic operations and locking.</li>
<li><b>Malicious update</b>: a compromised vendor update channel pushes trojanized code signed with legitimate keys.</li>
</ul>` },
    { h: "Web-based vulnerabilities", html: `
<ul>
<li><b>SQL injection (SQLi)</b>: input like <code>' OR 1=1 --</code> or <code>UNION SELECT</code> changes the query. Fix: <b>parameterized queries</b> plus input validation and least-privileged DB accounts.</li>
<li><b>Cross-site scripting (XSS)</b>: injected <code>&lt;script&gt;</code> runs in other users' browsers. <i>Stored</i> XSS is saved on the server; <i>reflected</i> XSS comes back in the response. Fix: output encoding, input validation, Content Security Policy, HttpOnly cookies.</li>
<li><b>CSRF</b>: tricks a logged-in user's browser into sending an unwanted request. Fix: anti-CSRF tokens and SameSite cookies.</li>
<li><b>SSRF</b>: tricks the server into requesting internal resources such as cloud metadata at 169.254.169.254.</li>
<li><b>Directory traversal</b>: <code>../../etc/passwd</code> escapes the web root.</li>
</ul>` },
    { h: "OS, hardware and virtualization", html: `
<ul>
<li><b>OS-based</b>: unpatched kernels, privilege escalation flaws, insecure default services.</li>
<li><b>Firmware</b>: low-level code in BIOS/UEFI and devices. Hard to patch and survives re-imaging.</li>
<li><b>End-of-life (EOL) / legacy hardware</b>: no more vendor updates.</li>
<li><b>VM escape</b>: code in a guest breaks out to the hypervisor or other guests, the most serious virtualization flaw.</li>
<li><b>Resource reuse</b>: memory or storage reassigned to a new VM or tenant still holds the previous owner's data.</li>
</ul>` },
    { h: "Cloud, supply chain, crypto, misconfiguration, mobile, zero-day", html: `
<ul>
<li><b>Cloud-specific</b>: public storage buckets, overly permissive IAM roles, exposed management APIs, insecure metadata services.</li>
<li><b>Supply chain</b>: a vulnerability introduced through a service, hardware or software provider, including open-source dependencies.</li>
<li><b>Cryptographic</b>: weak or deprecated algorithms (MD5, SHA-1, DES, RC4), short keys, hard-coded keys, bad random number generators, expired certificates.</li>
<li><b>Misconfiguration</b>: default settings, open ports, verbose errors, disabled logging. One of the most common real-world causes of breaches.</li>
<li><b>Mobile</b>: <b>side loading</b> (apps from outside official stores), <b>jailbreaking/rooting</b> (removing OS restrictions, which bypasses the sandbox).</li>
<li><b>Zero-day</b>: unknown to the vendor or unpatched; defenders rely on behavior-based detection and compensating controls.</li>
</ul>` }
  ],
  tips: [
    "Single quotes or UNION/SELECT in input: SQLi. &lt;script&gt;: XSS. ../: traversal. 169.254.169.254: SSRF.",
    "'Between checking and using' describes a race condition (TOC/TOU).",
    "The best fix for SQLi is parameterized queries (prepared statements)."
  ],
  traps: [
    "Mixing up CSRF (the victim's browser sends the request) with SSRF (the server sends the request).",
    "Calling a known-but-unpatched vulnerability a zero-day. Zero-day means no patch exists or the vendor doesn't know about it."
  ]
};

SECPLUS.chapters["2.4"] = {
  overview: "Given logs, symptoms or alerts, can you name the attack? This is a scenario-heavy objective and a favorite for performance-based questions (PBQs).",
  sections: [
    { h: "Malware", html: `
<table class="data"><thead><tr><th>Type</th><th>Behavior / indicator</th></tr></thead><tbody>
<tr><td><b>Ransomware</b></td><td>Encrypts files, ransom note, new file extensions, often exfiltrates first (double extortion)</td></tr>
<tr><td><b>Trojan / RAT</b></td><td>Disguised as legitimate software; a RAT opens remote control</td></tr>
<tr><td><b>Worm</b></td><td>Self-replicates across the network with no user action</td></tr>
<tr><td><b>Virus</b></td><td>Attaches to files and needs user execution to spread</td></tr>
<tr><td><b>Spyware / keylogger</b></td><td>Monitors activity and captures keystrokes and credentials</td></tr>
<tr><td><b>Bloatware</b></td><td>Unwanted pre-installed software that enlarges the attack surface</td></tr>
<tr><td><b>Logic bomb</b></td><td>Triggers on a condition (a date, or an account being disabled)</td></tr>
<tr><td><b>Rootkit</b></td><td>Hides at kernel or firmware level, concealing processes and files</td></tr>
</tbody></table>` },
    { h: "Physical and network attacks", html: `
<ul>
<li><b>Physical</b>: brute force (forcing doors and locks), <b>RFID cloning</b> (copying badges), <b>environmental</b> (attacking HVAC, power or fire suppression).</li>
<li><b>DDoS</b>: <i>reflected/amplified</i> attacks send small spoofed requests to DNS, NTP or memcached servers, which return large responses to the victim.</li>
<li><b>DNS attacks</b>: cache poisoning, domain hijacking, DNS tunneling for exfiltration.</li>
<li><b>Wireless</b>: evil twin and rogue APs, deauthentication, jamming.</li>
<li><b>On-path</b> (formerly MITM): ARP poisoning, rogue proxies, SSL stripping.</li>
<li><b>Credential replay</b>: pass-the-hash and pass-the-ticket reuse captured credentials.</li>
</ul>` },
    { h: "Application, cryptographic and password attacks", html: `
<ul>
<li><b>Injection, buffer overflow, replay, privilege escalation</b> (vertical: user to admin; horizontal: user to another user), <b>forgery</b> (CSRF/SSRF), <b>directory traversal</b>.</li>
<li><b>Cryptographic</b>: <b>downgrade</b> (forcing weaker protocols), <b>collision</b> (two inputs, same hash), <b>birthday</b> (the probability math that makes collisions easier to find than expected).</li>
<li><b>Password spraying</b>: one or a few common passwords against <i>many</i> accounts, which avoids lockout.</li>
<li><b>Brute force</b>: many passwords against <i>one</i> account (online), or cracking hashes offline.</li>
<li><b>Credential stuffing</b>: reusing username/password pairs leaked from other breaches.</li>
</ul>` },
    { h: "Indicators of compromise", html: `
<ul>
<li><b>Account lockout</b>: many lockouts point to brute force or spraying.</li>
<li><b>Concurrent session usage</b>: one account active in two places at once.</li>
<li><b>Blocked content</b>: security tools blocking downloads or connections from a host.</li>
<li><b>Impossible travel</b>: logins from distant locations too close together in time.</li>
<li><b>Resource consumption</b>: CPU, disk or bandwidth spikes (cryptomining, DDoS, exfiltration).</li>
<li><b>Resource inaccessibility</b>: files encrypted or services down.</li>
<li><b>Out-of-cycle logging</b>: log events at unusual times or volumes.</li>
<li><b>Published/documented</b>: your data appears on a leak site or a breach is reported publicly.</li>
<li><b>Missing logs</b>: gaps suggest an attacker cleared tracks.</li>
</ul>` }
  ],
  tips: [
    "One password against many accounts means spraying. Many passwords against one account means brute force.",
    "Malware spreading without users clicking anything is a worm.",
    "A login in New York, then in Singapore 15 minutes later, is impossible travel."
  ],
  traps: [
    "Picking 'virus' when the scenario says the malware spread with no user interaction (that is a worm).",
    "Ignoring a SUCCESS line in a spraying log. It means one account is now compromised."
  ]
};

SECPLUS.chapters["2.5"] = {
  overview: "Mitigations are what you do about threats and vulnerabilities. Questions describe a risk and ask for the BEST technique to reduce it.",
  sections: [
    { h: "Core mitigation techniques", html: `
<ul>
<li><b>Segmentation</b>: VLANs, subnets and firewalls between zones to limit lateral movement.</li>
<li><b>Access control</b>: <b>ACLs</b> and <b>permissions</b> restrict who and what can reach a resource.</li>
<li><b>Application allow list</b>: only approved executables run; stronger than a block list.</li>
<li><b>Isolation</b>: quarantine a compromised or high-risk system completely.</li>
<li><b>Patching</b>: removes the vulnerability. Usually the best answer when a patch exists.</li>
<li><b>Encryption</b>: protects confidentiality even if data is stolen.</li>
<li><b>Monitoring</b>: detects what prevention misses (SIEM, EDR).</li>
<li><b>Least privilege</b>: minimum access needed; limits damage from compromised accounts.</li>
<li><b>Configuration enforcement</b>: GPO, MDM or configuration management keeps systems at the secure baseline.</li>
<li><b>Decommissioning</b>: retire unneeded systems properly (remove accounts and DNS records, sanitize data).</li>
</ul>` },
    { h: "Hardening techniques", html: `
<ul>
<li>Install <b>endpoint protection</b> (EDR/antivirus) and a <b>host-based firewall</b>.</li>
<li>Deploy a <b>HIPS</b> (host-based intrusion prevention).</li>
<li><b>Disable unused ports and protocols</b>; remove unnecessary software, including bloatware.</li>
<li><b>Change default passwords</b> and accounts.</li>
<li>Apply vendor/CIS benchmarks; enable logging; enforce secure protocols (SSH not Telnet).</li>
</ul>` }
  ],
  tips: [
    "A patch is available: patch. No patch possible: segment or isolate (compensating control).",
    "To stop unauthorized software, an allow list beats a block list.",
    "An infected host under investigation should be isolated."
  ],
  traps: [
    "Choosing monitoring when the question asks how to PREVENT something.",
    "Forgetting decommissioning, since forgotten old servers are a common breach path."
  ]
};
