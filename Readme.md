
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
Software QA Engineer