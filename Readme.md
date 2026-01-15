📊 Gazzer API Testing Dashboard

A centralized, enterprise-ready API testing reporting dashboard designed to visualize, aggregate, and analyze API test execution results across multiple backend services.

This project provides a static, zero-backend dashboard that dynamically discovers API test reports and presents them in a unified, executive-friendly interface.

🚀 What This Project Does

Displays all API testing reports in one dashboard

Aggregates:

Total APIs tested

Total test cases

Average success rate

Failed test counts

Provides per-API detailed reports with:

Test cases

Requests & responses

Execution status

Bug details

Works without a backend server

Runs entirely in the browser

🧩 How the System Works (High Level)

This dashboard is data-driven.

Each API has its own folder containing:

A static report page

A JavaScript data file describing the test results

The dashboard:

Scans predefined folders

Loads each API’s report data

Calculates statistics

Displays everything automatically

No build step.
No database.
No server.

📁 Project Structure
/dashboard-root
│
├── index.html              # Main dashboard (entry point)
├── styles.css              # Dashboard styling
├── script.js               # Dashboard logic
│
├── Authentication/         # Example API report
│   ├── index.html
│   └── report-data.js
│
├── Generic Items/           # Example API report
│   ├── index.html
│   └── report-data.js
│
├── report_template/        # Reusable report template
│   ├── index.html
│   └── report-data.js
│
└── README.md               # This file

📊 Dashboard Features
Global Dashboard

Total APIs tested

Total test cases

Average success rate

Total failed tests

Quick access to all reports

API Report Cards

Each API card shows:

API name

Last execution date

Number of test cases

Success rate

Failed test count

Direct link to the full report

Detailed API Reports

Inside each API report:

Test case list

Request & response payloads

Status badges (Passed / Failed / Skipped)

Severity & priority

Bug root cause and fix recommendations (when applicable)

Filters and search

▶️ How to Run the Dashboard
Option 1: Open Locally (Recommended)

Clone or download the project

Open index.html in a modern browser (Chrome, Edge)

Click “Scan for Reports”

That’s it.

Option 2: Serve via Local Web Server (Optional)

If your browser restricts local file access:

# Python
python -m http.server 8080

# Node
npx serve .


Then open:

http://localhost:8080

➕ How to Add a New API Report

Adding a new API report requires **
no changes to the dashboard code**.

Step 1: Copy the Template

Duplicate the report_template folder:

cp -r report_template Orders

Step 2: Rename the Folder

The folder name is important — it represents the API name.

Example:

Orders/

Step 3: Update the Report Data

Edit:

Orders/report-data.js


Fill in:

API metadata

Test cases

Execution results

Step 4: Scan for Reports

Open the dashboard and click:

Scan for Reports

Your API will appear automatically.

🧠 Important Notes

The dashboard automatically ignores templates

Only real API reports are counted in statistics

Folder names must match report metadata

The dashboard is read-only

All data is trusted as-is

🔐 Security & Privacy

No credentials are stored or executed

Tokens shown in reports are informational

No API calls are made by the dashboard

Safe to share internally

🧪 Intended Audience

QA Engineers

Automation Engineers

Backend Developers

Tech Leads

Product Owners

Auditors & Managers

🧑‍💻 Maintainer

Hossam Mohamed
Senior Software QA Engineer