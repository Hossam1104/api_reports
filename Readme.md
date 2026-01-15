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

📌 Final Notes

This project is designed to be:

Simple

Transparent

Enterprise-friendly

Extensible without risk

If you can edit a JavaScript file, you can add an API report.

If you want next, I can:

Polish this README for open-source publishing

Add screenshots & badges

Create a “Getting Started” quick guide

Write a CONTRIBUTING.md

Just tell me 👍

add some icons and aligments to the file like ** for headrs or * or bullets 

Perfect — below is a polished, user-facing README.md with icons, visual hierarchy, bold headers, clean bullet alignment, and consistent spacing, while keeping it professional, readable, and repository-ready.

You can copy–paste this directly as README.md.

📊 Gazzer API Testing Dashboard

Centralized, static dashboard for visualizing and analyzing API testing reports
Built for QA teams, developers, and technical stakeholders

🚀 Overview

The Gazzer API Testing Dashboard is a lightweight, browser-based reporting system that aggregates API testing results across multiple backend services into one unified view.

It enables teams to:

📈 Track testing progress

🧪 Review execution results

🐞 Analyze failures

📂 Navigate API reports effortlessly

✔ No backend
✔ No database
✔ No build step

✨ Key Features

📊 Unified Dashboard

Total APIs tested

Total test cases

Average success rate

Failed test count

📁 Automatic Report Discovery

Detects API reports by folder structure

No manual configuration required

🧪 Detailed API Reports

Individual test cases

Requests & responses

Status, severity, and priority

Bug root cause & fix notes

🔍 Filtering & Search

Filter by status

Search by test name or endpoint

🖥 Runs Anywhere

Works in any modern browser

Can be hosted statically or opened locally

🧩 How It Works

The dashboard is data-driven.

Each API has its own folder that contains:

A static report page

A JavaScript file with test execution data

The dashboard:

🔍 Scans predefined folders

📥 Loads report data

🧮 Calculates statistics

📊 Renders dashboards automatically

📁 Project Structure
/dashboard-root
│
├── index.html               # 🏠 Main dashboard entry
├── styles.css               # 🎨 Dashboard styling
├── script.js                # ⚙️ Dashboard logic
│
├── Authentication/          # 🔐 Authentication API report
│   ├── index.html
│   └── report-data.js
│
├── Generic Items/            # 📦 Generic Items API report
│   ├── index.html
│   └── report-data.js
│
├── report_template/         # 🧩 Reusable report template
│   ├── index.html
│   └── report-data.js
│
└── README.md                # 📘 Project documentation

📊 Dashboard Sections
📌 Global Statistics

APIs Tested

Total Test Cases

Average Success Rate

Failed Tests Count

📄 API Report Cards

Each API card displays:

🧾 API name

📅 Last execution date

🧪 Total test cases

📈 Success rate

🐞 Failed test count

🔗 Direct link to full report

🧪 Detailed API Report View

Inside an API report you’ll find:

✅ Passed / ❌ Failed / ⏭ Skipped tests

🔁 Request & response payloads

⚠ Severity & priority indicators

🐞 Bug analysis (for failed cases)

🔍 Filters & live search

▶️ How to Run the Dashboard
⭐ Option 1: Open Locally (Recommended)

📥 Clone or download the project

🌐 Open index.html in Chrome or Edge

🔄 Click Scan for Reports

✔ No setup required

🖥 Option 2: Run via Local Server (Optional)

If your browser restricts local files:

# Python
python -m http.server 8080

# Node.js
npx serve .


Then open:

http://localhost:8080

➕ How to Add a New API Report

Adding a new API report is simple and safe.

① Copy the Template
cp -r report_template Orders

② Rename the Folder

The folder name represents the API name:

Orders/

③ Update Report Data

Edit:

Orders/report-data.js


Fill in:

🧾 API metadata

🧪 Test cases

📊 Execution results

④ Scan for Reports

Open the dashboard and click:

🔄 Scan for Reports

Your new API report will appear automatically.

⚠️ Important Notes

🚫 Template reports are excluded from statistics

📁 Folder names must match report metadata

📊 Dashboard is read-only

🧠 Data is trusted as-is

🔄 Refresh anytime using the admin panel

🔐 Security & Privacy

🔒 No credentials are executed

🪪 Tokens shown are informational only

🌐 No API calls are made

✅ Safe for internal sharing

🧪 Who Is This For?

👩‍💻 QA Engineers

🤖 Automation Engineers

🔧 Backend Developers

📋 Tech Leads

📊 Product Owners

🧾 Auditors & Managers

🧑‍💼 Maintained By

Hossam Mohamed
Senior Software QA Engineer