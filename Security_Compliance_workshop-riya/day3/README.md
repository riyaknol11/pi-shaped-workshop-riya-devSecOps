Secure Coding Practices & Code Scanning Demo - Node.js Edition

#### Project Overview
This project demonstrates secure coding practices and automated security scanning in a CI/CD pipeline using GitHub Actions with Node.js/Express. The project includes a deliberately vulnerable Express application scanned using multiple security tools.

#### Security Tools Used

- ESLint + Security Plugin - Static code analysis for JavaScript
- NodeJsScan - SAST tool specifically for Node.js applications
- Semgrep - Multi-language SAST scanner with Node.js/Express rules
- Gitleaks - Secret scanning tool for detecting hardcoded credentials
- NPM Audit - Built-in Node.js dependency vulnerability scanner
- Snyk - Advanced dependency and code vulnerability scanner
- OWASP ZAP - DAST (Dynamic Application Security Testing)
- Retire.js - Scanner for vulnerable JavaScript libraries


![alt text](<screenshots/Vulnerability_endpoint.png>)

![
](<screenshots/vulnerability.png>)


# Security Demo

![alt text](<screenshots/Workflow_Vulnerabilities.png>)


![alt text](<screenshots/secured_application.png>)