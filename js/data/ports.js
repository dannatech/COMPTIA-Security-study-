// Common ports and protocols for Security+.
window.SECPLUS = window.SECPLUS || {};

SECPLUS.ports = [
  { port: "20/21", proto: "TCP", name: "FTP", note: "File transfer (20 data, 21 control). Cleartext — use SFTP/FTPS." },
  { port: "22", proto: "TCP", name: "SSH / SFTP / SCP", note: "Encrypted remote shell and secure file transfer." },
  { port: "23", proto: "TCP", name: "Telnet", note: "Cleartext remote shell — replace with SSH." },
  { port: "25", proto: "TCP", name: "SMTP", note: "Email relay between servers." },
  { port: "53", proto: "TCP/UDP", name: "DNS", note: "Name resolution. Secure with DNSSEC." },
  { port: "67/68", proto: "UDP", name: "DHCP", note: "Automatic IP addressing (67 server, 68 client)." },
  { port: "69", proto: "UDP", name: "TFTP", note: "Trivial FTP — no authentication." },
  { port: "80", proto: "TCP", name: "HTTP", note: "Unencrypted web traffic." },
  { port: "88", proto: "TCP/UDP", name: "Kerberos", note: "Ticket-based authentication." },
  { port: "110", proto: "TCP", name: "POP3", note: "Email retrieval, cleartext." },
  { port: "123", proto: "UDP", name: "NTP", note: "Time synchronization — critical for log correlation." },
  { port: "137-139", proto: "TCP/UDP", name: "NetBIOS", note: "Legacy Windows name/session services." },
  { port: "143", proto: "TCP", name: "IMAP", note: "Email retrieval, cleartext." },
  { port: "161/162", proto: "UDP", name: "SNMP", note: "Device management (162 = traps). Use SNMPv3." },
  { port: "389", proto: "TCP", name: "LDAP", note: "Directory services, cleartext." },
  { port: "443", proto: "TCP", name: "HTTPS", note: "HTTP over TLS." },
  { port: "445", proto: "TCP", name: "SMB", note: "Windows file sharing." },
  { port: "465/587", proto: "TCP", name: "SMTPS / SMTP submission", note: "Secure email submission (465 implicit TLS, 587 STARTTLS)." },
  { port: "514", proto: "UDP", name: "Syslog", note: "Log forwarding (6514 = syslog over TLS)." },
  { port: "636", proto: "TCP", name: "LDAPS", note: "LDAP over TLS." },
  { port: "993", proto: "TCP", name: "IMAPS", note: "IMAP over TLS." },
  { port: "995", proto: "TCP", name: "POP3S", note: "POP3 over TLS." },
  { port: "1433", proto: "TCP", name: "Microsoft SQL Server", note: "Database — should not be exposed to the internet." },
  { port: "1812/1813", proto: "UDP", name: "RADIUS", note: "Authentication (1812) and accounting (1813)." },
  { port: "49", proto: "TCP", name: "TACACS+", note: "Cisco AAA, encrypts full payload." },
  { port: "3389", proto: "TCP", name: "RDP", note: "Remote Desktop Protocol." },
  { port: "5060/5061", proto: "TCP/UDP", name: "SIP", note: "VoIP signaling (5061 = SIP over TLS)." },
  { port: "500", proto: "UDP", name: "IKE (IPsec)", note: "Key exchange for IPsec VPNs." }
];
