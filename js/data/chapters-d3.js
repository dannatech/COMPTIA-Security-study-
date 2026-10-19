// In-depth chapters — Domain 3: Security Architecture.
window.SECPLUS = window.SECPLUS || {};
SECPLUS.chapters = SECPLUS.chapters || {};

SECPLUS.chapters["3.1"] = {
  overview: "Different architectures shift where risk lives and who manages it. Expect questions on the cloud shared responsibility model, modern app architectures (IaC, serverless, microservices, containers), and specialized systems such as ICS, IoT and embedded devices.",
  sections: [
    { h: "Cloud models and shared responsibility", html: `
<table class="data"><thead><tr><th>Layer</th><th>On-prem</th><th>IaaS</th><th>PaaS</th><th>SaaS</th></tr></thead><tbody>
<tr><td>Data, users, access</td><td>You</td><td>You</td><td>You</td><td>You</td></tr>
<tr><td>Application</td><td>You</td><td>You</td><td>You</td><td>Provider</td></tr>
<tr><td>OS & runtime</td><td>You</td><td>You</td><td>Provider</td><td>Provider</td></tr>
<tr><td>Virtualization, hardware, facility</td><td>You</td><td>Provider</td><td>Provider</td><td>Provider</td></tr>
</tbody></table>
<p>The customer is <b>always</b> responsible for its data, identities and access configuration. A <b>responsibility matrix</b> documents this split. <b>Hybrid</b> cloud mixes on-premises and public cloud. <b>Third-party vendors</b> in the chain add risk that must be assessed (see 5.3). Deployment models: public, private, community and hybrid. <b>Multi-cloud</b> uses several providers for resilience.</p>` },
    { h: "Modern application architectures", html: `
<ul>
<li><b>Infrastructure as Code (IaC)</b>: infrastructure defined in templates (Terraform, CloudFormation) and stored in version control. Consistent, reviewable, scannable before deployment, and less configuration drift.</li>
<li><b>Serverless</b> (FaaS): code runs on events and the provider manages servers. Security focus shifts to code, permissions and the event inputs.</li>
<li><b>Microservices</b>: small independent services talking over APIs. Easier to scale and update, but there are many more APIs to secure (service-to-service authentication, API gateways).</li>
<li><b>Containerization</b>: containers share the host OS kernel, so they are lighter than VMs but have weaker isolation. Secure the images, scan them, and don't run containers as root.</li>
<li><b>Virtualization</b>: a hypervisor runs multiple VMs. Risks include VM escape, VM sprawl and resource reuse.</li>
</ul>` },
    { h: "Network infrastructure models", html: `
<ul>
<li><b>Physical isolation / air gap</b>: no network connection at all. Used for critical OT and classified systems; data moves only by controlled media.</li>
<li><b>Logical segmentation</b>: VLANs, subnets and firewall rules separate traffic on shared hardware.</li>
<li><b>Software-defined networking (SDN)</b>: separates the <b>control plane</b> (decisions) from the <b>data plane</b> (forwarding) for centralized, programmable management.</li>
<li><b>On-premises</b>: full control and full responsibility. <b>Centralized</b> designs are easier to manage but create a single point of failure; <b>decentralized</b> designs are resilient but harder to keep consistent.</li>
</ul>` },
    { h: "Specialized systems", html: `
<ul>
<li><b>ICS/SCADA</b>: control physical processes (power, water, manufacturing). Availability and safety come first; systems are often legacy and can't be patched easily. Protect with segmentation, strict access control, monitoring and air gaps.</li>
<li><b>IoT</b>: cameras, sensors, smart devices. Weak defaults, little patching and limited compute. Put them on an isolated network.</li>
<li><b>Embedded systems</b>: purpose-built computers inside devices, with firmware that is hard to update.</li>
<li><b>RTOS</b>: real-time OS with deterministic timing (medical, automotive, industrial).</li>
<li><b>High availability</b>: redundant design that keeps services running.</li>
</ul>` },
    { h: "Architecture considerations", html: `
<p>Expect trade-off questions. Know the vocabulary: <b>availability, resilience, cost, responsiveness, scalability, ease of deployment, risk transference</b> (shifting responsibility to a provider), <b>ease of recovery, patch availability, inability to patch</b> (ICS and embedded), <b>power</b> and <b>compute</b> constraints (IoT).</p>` }
  ],
  tips: [
    "Who patches the guest OS in IaaS? The customer. In PaaS? The provider.",
    "In SaaS, the customer still owns data classification, user access and MFA.",
    "Containers share the host kernel; VMs have their own OS."
  ],
  traps: [
    "Thinking moving to the cloud transfers ALL responsibility. Data and access always stay with the customer.",
    "Proposing 'just patch it' for ICS. The usual answer is segmentation and compensating controls."
  ]
};

SECPLUS.chapters["3.2"] = {
  overview: "This is the 'design the network' objective: where to put devices, how they fail, which firewall or appliance fits, and how to connect remote users and sites securely. Network placement is a common PBQ.",
  sections: [
    { h: "Infrastructure considerations", html: `
<ul>
<li><b>Device placement</b>: public services in the <b>screened subnet</b> (DMZ); sensitive servers internal; management interfaces on an isolated management network.</li>
<li><b>Security zones</b>: trusted, untrusted and screened zones, with controlled paths between them.</li>
<li><b>Attack surface</b>: minimize exposed services and ports.</li>
<li><b>Connectivity</b>: redundant links and secured paths.</li>
<li><b>Failure modes</b>: <b>fail-open</b> lets traffic pass if the device fails (favors availability); <b>fail-closed</b> blocks all traffic (favors security).</li>
<li><b>Device attributes</b>: <b>active</b> (can block) vs. <b>passive</b> (only observes); <b>inline</b> (traffic flows through it) vs. <b>tap/monitor</b> (receives a copy via a SPAN port or network tap).</li>
</ul>` },
    { h: "Network appliances", html: `
<ul>
<li><b>Jump server</b>: a hardened host admins connect through to reach a secure zone; activity is logged.</li>
<li><b>Proxy server</b>: a <i>forward</i> proxy acts for internal clients going out (filtering, caching); a <i>reverse</i> proxy sits in front of servers (load distribution, TLS offload, WAF).</li>
<li><b>IDS/IPS</b>: an IDS detects and alerts (passive); an IPS sits inline and blocks (active). Detection is <i>signature-based</i> (known patterns, few false positives) or <i>anomaly/behavior-based</i> (can catch unknown attacks, more false positives).</li>
<li><b>Load balancer</b>: spreads traffic across servers and health-checks them. Modes are active/active or active/passive, with persistence (sticky sessions) as needed.</li>
<li><b>Sensors</b>: collect network data for the SIEM or NDR.</li>
</ul>` },
    { h: "Port security and firewalls", html: `
<p><b>802.1X</b> provides port-based network access control. The <b>supplicant</b> (client) authenticates through the <b>authenticator</b> (switch or AP) to the <b>authentication server</b> (RADIUS) using <b>EAP</b>. EAP-TLS uses certificates on both sides (strongest); PEAP and EAP-TTLS need only a server certificate.</p>
<table class="data"><thead><tr><th>Firewall</th><th>Description</th></tr></thead><tbody>
<tr><td><b>Layer 4</b></td><td>Filters on IPs, ports and protocols; stateful firewalls track connections</td></tr>
<tr><td><b>Layer 7 / NGFW</b></td><td>Application-aware, deep packet inspection, built-in IPS, identity-based rules</td></tr>
<tr><td><b>WAF</b></td><td>Protects web apps from SQLi, XSS and similar attacks by inspecting HTTP</td></tr>
<tr><td><b>UTM</b></td><td>All-in-one appliance (firewall, AV, content filter, VPN), common in small businesses</td></tr>
</tbody></table>` },
    { h: "Secure communication and access", html: `
<ul>
<li><b>VPN</b>: <i>remote access</i> (user to network) or <i>site-to-site</i> (network to network).</li>
<li><b>IPsec</b>: <b>AH</b> provides integrity and authentication only; <b>ESP</b> adds encryption. <b>Tunnel mode</b> encrypts the whole packet (site-to-site); <b>transport mode</b> encrypts only the payload (host-to-host). IKE (UDP 500) negotiates keys.</li>
<li><b>TLS VPN</b>: works through a browser or light client over 443, so it passes most firewalls.</li>
<li><b>SD-WAN</b>: intelligently routes branch traffic over MPLS, broadband or LTE.</li>
<li><b>SASE</b>: a cloud-delivered combination of SD-WAN and security services (SWG, CASB, ZTNA, FWaaS) close to the user.</li>
</ul>` }
  ],
  tips: [
    "Internet-facing server: DMZ / screened subnet.",
    "Must keep working if the device dies: fail-open. Must stay secure: fail-closed.",
    "Strongest 802.1X EAP method: EAP-TLS (certificates on both sides).",
    "Protect a web app from SQLi/XSS: WAF."
  ],
  traps: [
    "Placing an IDS 'inline to block'. Blocking requires an IPS.",
    "Mixing up AH (no encryption) with ESP (encryption)."
  ]
};

SECPLUS.chapters["3.3"] = {
  overview: "Data is what attackers want. Know how data is typed and classified, its three states, the legal concepts of sovereignty and geolocation, and the protection method that fits each situation.",
  sections: [
    { h: "Data types and classifications", html: `
<p><b>Types</b>: regulated (PII, PHI, cardholder data), trade secrets, intellectual property, legal information, financial information, human-readable vs. non-human-readable (barcodes, encoded data).</p>
<p><b>Classifications</b> (commercial/organizational): <b>public</b> (no harm if released), <b>private</b> (internal personal information), <b>sensitive</b>, <b>confidential</b>, <b>restricted</b> (highest internal tier), <b>critical</b> (essential to operations). Classification drives handling, labeling, retention and protection.</p>` },
    { h: "Data states", html: `
<table class="data"><thead><tr><th>State</th><th>Where</th><th>Protections</th></tr></thead><tbody>
<tr><td><b>At rest</b></td><td>Disks, databases, backups</td><td>FDE, file and database encryption, permissions</td></tr>
<tr><td><b>In transit</b></td><td>Moving over networks</td><td>TLS, IPsec, SSH, VPNs</td></tr>
<tr><td><b>In use</b></td><td>Memory and CPU during processing</td><td>Secure enclaves, confidential computing, memory protections</td></tr>
</tbody></table>
<p><b>Data sovereignty</b>: data is subject to the laws of the country where it is stored. <b>Geolocation</b> ties data and users to physical locations, which enables <b>geographic restrictions</b> (geofencing, geo-blocking).</p>` },
    { h: "Methods to secure data", html: `
<ul>
<li><b>Geographic restrictions</b>: limit access or storage by location.</li>
<li><b>Encryption</b>: reversible with a key.</li>
<li><b>Hashing</b>: one-way, for integrity and verification.</li>
<li><b>Masking</b>: hides part of a value from display or in test data.</li>
<li><b>Tokenization</b>: substitutes a token, with the real value kept in a vault.</li>
<li><b>Obfuscation</b>: makes data or code hard to understand.</li>
<li><b>Segmentation</b>: separates sensitive data stores onto restricted networks.</li>
<li><b>Permission restrictions</b>: ACLs and least privilege on the data itself.</li>
</ul>` }
  ],
  tips: [
    "Being processed in RAM means data in use.",
    "Must stay in a specific country means data sovereignty.",
    "Developers need realistic but fake data: masking."
  ],
  traps: [
    "Assuming TLS protects data at rest. It only covers transit.",
    "Thinking 'public' needs no protection at all. Integrity and availability still matter."
  ]
};

SECPLUS.chapters["3.4"] = {
  overview: "Resilience keeps the business running; recovery brings it back. Expect calculations and scenario questions on sites, backups, high availability, testing and power.",
  sections: [
    { h: "High availability", html: `
<p><b>Load balancing</b> distributes requests across independent servers. <b>Clustering</b> joins servers that share state or storage so one can take over for another (failover). Both remove single points of failure. Add redundant power supplies, NICs, RAID and network paths.</p>` },
    { h: "Site considerations", html: `
<table class="data"><thead><tr><th>Site</th><th>Ready state</th><th>Recovery speed</th><th>Cost</th></tr></thead><tbody>
<tr><td><b>Hot</b></td><td>Fully equipped, data replicated</td><td>Minutes to hours</td><td>Highest</td></tr>
<tr><td><b>Warm</b></td><td>Hardware and connectivity, data must be restored</td><td>Hours to days</td><td>Medium</td></tr>
<tr><td><b>Cold</b></td><td>Space, power, cooling only</td><td>Days to weeks</td><td>Lowest</td></tr>
</tbody></table>
<p><b>Geographic dispersion</b>: put recovery sites far enough apart that one regional disaster can't take out both. <b>Platform diversity</b> (different OSs or vendors) and <b>multi-cloud</b> avoid single-vendor failures. <b>Continuity of operations (COOP)</b> keeps essential functions running.</p>` },
    { h: "Capacity planning and testing", html: `
<p><b>Capacity planning</b> covers <b>people</b> (staff to handle surges), <b>technology</b> (compute, licenses) and <b>infrastructure</b> (bandwidth, power, space).</p>
<p><b>Testing</b>, from least to most disruptive:</p>
<ul>
<li><b>Tabletop exercise</b>: a discussion-based walkthrough.</li>
<li><b>Simulation</b>: emulates an actual event (for example a phishing simulation or simulated outage).</li>
<li><b>Parallel processing</b>: run the backup or new system alongside production and compare results.</li>
<li><b>Failover</b>: actually switch to the backup systems.</li>
</ul>` },
    { h: "Backups", html: `
<ul>
<li><b>Full</b>: everything. Slowest to back up, fastest to restore.</li>
<li><b>Incremental</b>: changes since the <i>last backup of any kind</i>. Fastest daily backup; restore needs the full plus <i>every</i> incremental.</li>
<li><b>Differential</b>: changes since the <i>last full</i>. Grows daily; restore needs the full plus the <i>latest</i> differential.</li>
<li><b>Snapshots</b>: point-in-time copies of VMs or storage. <b>Replication</b>: continuous copying to another system or site. <b>Journaling</b>: logs changes so data can be recovered consistently.</li>
<li><b>Onsite vs. offsite</b>: offsite and offline/immutable copies survive disasters and ransomware. The 3-2-1 rule: 3 copies, 2 media types, 1 offsite.</li>
<li><b>Frequency</b> is driven by the <b>RPO</b>. <b>Encrypt</b> backups. <b>Test restores</b> regularly.</li>
</ul>` },
    { h: "Power", html: `
<p><b>UPS</b>: batteries bridge short outages and give time for generators to start or for a graceful shutdown. <b>Generators</b>: long-term power during extended outages. Also useful: dual power supplies, PDUs and multiple utility feeds.</p>` }
  ],
  tips: [
    "Fastest recovery, cost no object: hot site. Cheapest, slowest: cold site.",
    "Incremental restore = full + every incremental. Differential restore = full + last differential.",
    "Seconds of power loss: UPS. Hours or days: generator."
  ],
  traps: [
    "Treating RAID as a backup. RAID gives availability, not protection from deletion or ransomware.",
    "Assuming untested backups work. Always test restores."
  ]
};
