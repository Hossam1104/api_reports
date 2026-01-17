// ============================
// GLOBAL REPORT DATA CONTRACTS
// ============================

// SINGLE DEFINITION - Global immutable contract for dashboard integration
// This MUST match exactly what dashboard.html expects
// Initialize with safe defaults immediately
// Calculate statistics first
const totalTests = REPORT_DATA.testCases ? REPORT_DATA.testCases.length : 0;
const passedTests = REPORT_DATA.testCases ? REPORT_DATA.testCases.filter(tc => tc.status === 'passed').length : 0;
const failedTests = REPORT_DATA.testCases ? REPORT_DATA.testCases.filter(tc => tc.status === 'failed').length : 0;
const skippedTests = REPORT_DATA.testCases ? REPORT_DATA.testCases.filter(tc => tc.status === 'skipped').length : 0;
const criticalBugs = REPORT_DATA.testCases ? REPORT_DATA.testCases.filter(tc => tc.severity === 'critical' && tc.status === 'failed').length : 0;
const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;
const folderName = REPORT_DATA.meta.folderName || 'Authentication';

// SINGLE DEFINITION - Global immutable contract for dashboard integration
window.REPORT_SUMMARY = {
    apiName: REPORT_DATA.meta.apiName || "Unnamed API",
    folderName: folderName,
    isTemplate: REPORT_DATA.meta.isTemplate || false,
    totalTests: totalTests,
    passedTests: passedTests,
    failedTests: failedTests,
    skippedTests: skippedTests,
    criticalBugs: criticalBugs,
    successRate: successRate,
    lastUpdated: REPORT_DATA.meta.createdAt || new Date().toLocaleDateString(),
    reportUrl: `./${folderName}/index.html`
};

if (typeof window.REPORT_SUMMARY === 'undefined') {
    window.REPORT_SUMMARY = {
        apiName: "Unnamed API",
        folderName: "",
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        skippedTests: 0,
        criticalBugs: 0,
        successRate: 0,
        lastUpdated: "Not yet run",
        reportUrl: "./index.html",
        isTemplate: true  // Default to template until proven otherwise
    };
}

// ============================
// DEFENSIVE DATA VALIDATION
// ============================

function safeNumber(value, fallback = 0) {
    const num = Number(value);
    return isNaN(num) ? fallback : num;
}

function safeString(value, fallback = "") {
    return value !== null && value !== undefined ? String(value) : fallback;
}

function normalizeCategory(category) {
    const validCategories = [
        'authentication',
        'create',
        'read',
        'update',
        'delete',
        'security',
        'validation',
        'performance'
    ];
    const lowerCategory = safeString(category).toLowerCase();
    return validCategories.includes(lowerCategory) ? lowerCategory : 'read';
}

function normalizeSeverity(severity) {
    const validSeverities = ['critical', 'high', 'medium', 'low'];
    const lowerSeverity = safeString(severity).toLowerCase();
    return validSeverities.includes(lowerSeverity) ? lowerSeverity : 'low';
}

function normalizeStatus(status) {
    const validStatuses = ['passed', 'failed', 'skipped'];
    const lowerStatus = safeString(status).toLowerCase();
    return validStatuses.includes(lowerStatus) ? lowerStatus : 'skipped';
}

// ============================
// FOLDER & PATH DETECTION
// ============================

function autoDetectReportConfig() {
    const currentPath = window.location.pathname || '';
    const folderName = currentPath.split('/').filter(Boolean).slice(-2, -1)[0] || '';
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const reportUrl = folderName ? `./${folderName}/index.html` : './index.html';

    console.log(`Folder detection: path="${currentPath}", folder="${folderName}", url="${reportUrl}"`);

    return {
        folderName: folderName || 'root',
        reportUrl: reportUrl,
        creationDate: currentDate
    };
}

// ============================
// GLOBAL STATE
// ============================

// Test cases array (will be filled from REPORT_DATA)
const testCases = [];
const bugs = [];

// Configuration object with safe defaults
let config = {
    apiName: "Unnamed API",
    baseUrl: "Not Configured",
    environment: "Development",
    authentication: "Bearer Token",
    testDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    creationDate: new Date().toLocaleDateString(),
    executedBy: "Hossam Mohamed",
    executedByTitle: "Senior Software QA Engineer",
    totalTests: 0,
    passedTests: 0,
    failedTests: 0,
    skippedTests: 0,
    criticalBugs: 0,
    successRate: 0,
    releaseReadiness: "Not Tested",
    apiStability: "Unknown",
    criticalIssues: [],
    backendRecommendations: [
        "Populate report-data.js with your API details",
        "Add test cases to report-data.js",
        "Run API tests and update results"
    ],
    immediateActions: [
        "Configure API endpoints in report-data.js",
        "Add authentication details if required"
    ],
    shortTermActions: [
        "Create comprehensive test suite",
        "Establish test data management"
    ],
    longTermActions: [
        "Implement CI/CD integration",
        "Set up performance monitoring"
    ],
    criticalIssuesSummary: "No test data loaded. Please run tests and populate report-data.js",

    sqlInjectionAssessment: "Not Tested",
    authenticationAssessment: "Not Tested",
    authorizationAssessment: "Not Tested",
    validationAssessment: "Not Tested",

    automationSetup: "Manual - Template Mode",
    assertionsCount: 0,
    coveragePercent: "0%",
    testDataInfo: "Template mode - awaiting test data"
};

// ============================
// TEMPLATE MODE DETECTION
// ============================

let IS_TEMPLATE_MODE = true;
let chartsInitialized = false;
let testStatusChart, severityChart, categoryChart;

// ============================
// DOM ELEMENTS
// ============================

const testCasesContainer = document.getElementById('test-cases-container');
const bugsGrid = document.getElementById('bugs-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchBox = document.getElementById('searchBox');
const toggleAllBtn = document.getElementById('toggleAllBtn');
const toggleAllBugsBtn = document.getElementById('toggleAllBugsBtn');
const printBtn = document.getElementById('printBtn');
const exportBugReportBtn = document.getElementById('export-report');
const exportTestCasesBtn = document.getElementById('export-test-cases');
const exportFullReportBtn = document.getElementById('export-full-report');
const modal = document.getElementById('details-modal');
const closeModal = document.getElementById('close-modal');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');

// ============================
// STATE MANAGEMENT
// ============================

let currentFilter = 'all';
let searchTerm = '';
let allExpanded = false;
let allBugsExpanded = false;

// ============================
// INITIALIZATION
// ============================

function initializeReport() {
    console.log("Initializing API Test Report...");

    // Auto-detect folder configuration
    const autoConfig = autoDetectReportConfig();
    config.creationDate = autoConfig.creationDate;

    // Load unified data source
    loadUnifiedData();

    // Determine template mode based on actual test data
    // CRITICAL: Template mode if folder is 'report_template' OR no test cases
    IS_TEMPLATE_MODE = REPORT_DATA.meta?.isTemplate === true;
    console.log(`Report mode: ${IS_TEMPLATE_MODE ? 'TEMPLATE (folder=report_template or no data)' : 'DATA (API report with data)'}`);

    // Calculate statistics based on loaded test data
    calculateStatistics();

    // Update global REPORT_SUMMARY contract (CRITICAL)
    updateReportSummaryContract(autoConfig);

    // Update UI elements
    updateConfigElements();
    renderTestCases();
    renderBugs();
    initializeCharts();
    updateCounts();
    setupEventListeners();

    // Update empty state visibility
    updateEmptyStateVisibility();

    console.log("Report initialization complete");
    console.log("REPORT_SUMMARY contract ready:", window.REPORT_SUMMARY);

    // Emit ready signal for dashboard
    setTimeout(() => {
        document.dispatchEvent(new CustomEvent('reportReady', {
            detail: window.REPORT_SUMMARY
        }));
    }, 100);
}

function loadUnifiedData() {
    // Check if unified data source is available
    if (typeof window.REPORT_DATA !== 'undefined' && window.REPORT_DATA) {
        console.log("Loading data from unified report-data.js");

        // Load meta configuration
        if (window.REPORT_DATA.meta) {
            Object.keys(window.REPORT_DATA.meta).forEach(key => {
                if (window.REPORT_DATA.meta[key] !== undefined && window.REPORT_DATA.meta[key] !== "") {
                    if (typeof config[key] === 'number') {
                        config[key] = safeNumber(window.REPORT_DATA.meta[key], config[key]);
                    } else {
                        config[key] = safeString(window.REPORT_DATA.meta[key], config[key]);
                    }
                }
            });
        }

        // Load test cases
        if (Array.isArray(window.REPORT_DATA.testCases)) {
            testCases.length = 0; // Clear array

            window.REPORT_DATA.testCases.forEach(tc => {
                if (tc && typeof tc === 'object') {
                    // Ensure required fields exist with data normalization
                    const safeTestCase = {
                        id: safeString(tc.id, `TC-${testCases.length + 1}`),
                        title: safeString(tc.title, "Untitled Test"),
                        description: safeString(tc.description, ""),
                        endpoint: safeString(tc.endpoint, "/"),
                        method: safeString(tc.method, "GET"),
                        category: normalizeCategory(tc.category),
                        status: normalizeStatus(tc.status),
                        severity: normalizeSeverity(tc.severity),
                        priority: safeString(tc.priority, "P3"),
                        steps: Array.isArray(tc.steps) ? tc.steps : ["Test step not defined"],
                        expectedResult: safeString(tc.expectedResult, ""),
                        actualResult: safeString(tc.actualResult, ""),
                        bugDetails: null
                    };

                    // Handle bug details consistency
                    if (safeTestCase.status === 'failed' && tc.bugDetails && typeof tc.bugDetails === 'object') {
                        // Normalize bug details severity to match test case severity
                        const bugSeverity = normalizeSeverity(tc.bugDetails.severity || tc.severity);
                        safeTestCase.bugDetails = {
                            severity: bugSeverity,
                            actualResult: safeString(tc.bugDetails.actualResult, tc.actualResult || ""),
                            expectedResult: safeString(tc.bugDetails.expectedResult, tc.expectedResult || ""),
                            rootCause: safeString(tc.bugDetails.rootCause, "Not specified"),
                            fix: safeString(tc.bugDetails.fix, "Not specified")
                        };
                        // Ensure test case severity matches bug severity
                        safeTestCase.severity = bugSeverity;
                    } else if (safeTestCase.status === 'failed') {
                        // Create minimal bug details for failed tests without bugDetails
                        safeTestCase.bugDetails = {
                            severity: safeTestCase.severity,
                            actualResult: safeTestCase.actualResult,
                            expectedResult: safeTestCase.expectedResult,
                            rootCause: "Not specified",
                            fix: "Not specified"
                        };
                    }

                    testCases.push(safeTestCase);
                }
            });
            console.log(`Loaded ${window.REPORT_DATA.testCases.length} test cases from unified data`);
        }
    } else {
        console.log("No unified data loaded (report-data.js not found or empty)");
    }
}

function calculateStatistics() {
    // Always calculate from actual test cases
    config.totalTests = testCases.length;
    config.passedTests = testCases.filter(tc => tc.status === 'passed').length;
    config.failedTests = testCases.filter(tc => tc.status === 'failed').length;
    config.skippedTests = testCases.filter(tc => tc.status === 'skipped').length;
    config.criticalBugs = testCases.filter(tc => tc.severity === 'critical' && tc.status === 'failed').length;
    config.successRate = config.totalTests > 0
        ? Math.round((config.passedTests / config.totalTests) * 100)
        : 0;

    // Auto-assess API stability based on results
    if (config.totalTests === 0) {
        config.apiStability = "Not Tested";
        config.releaseReadiness = "Cannot Determine - No Tests Run";
    } else if (config.successRate >= 90 && config.criticalBugs === 0) {
        config.apiStability = "Stable";
        config.releaseReadiness = "Ready for Production";
    } else if (config.successRate >= 70) {
        config.apiStability = "Fair - Needs Improvement";
        config.releaseReadiness = "Needs Critical Bug Fixes";
    } else {
        config.apiStability = "Unstable";
        config.releaseReadiness = "Not Release Ready";
    }
}

function updateReportSummaryContract(autoConfig) {
    // NEVER RE-ASSIGN window.REPORT_SUMMARY - only update fields
    window.REPORT_SUMMARY.apiName = config.apiName || "Unnamed API";
    window.REPORT_SUMMARY.folderName = autoConfig.folderName;

    // CRITICAL: For templates, always show zero stats regardless of test data
    if (IS_TEMPLATE_MODE) {
        window.REPORT_SUMMARY.totalTests = 0;
        window.REPORT_SUMMARY.passedTests = 0;
        window.REPORT_SUMMARY.failedTests = 0;
        window.REPORT_SUMMARY.skippedTests = 0;
        window.REPORT_SUMMARY.criticalBugs = 0;
        window.REPORT_SUMMARY.successRate = 0;
    } else {
        // For API reports, show actual calculated stats
        window.REPORT_SUMMARY.totalTests = safeNumber(config.totalTests, 0);
        window.REPORT_SUMMARY.passedTests = safeNumber(config.passedTests, 0);
        window.REPORT_SUMMARY.failedTests = safeNumber(config.failedTests, 0);
        window.REPORT_SUMMARY.skippedTests = safeNumber(config.skippedTests, 0);
        window.REPORT_SUMMARY.criticalBugs = safeNumber(config.criticalBugs, 0);
        window.REPORT_SUMMARY.successRate = safeNumber(config.successRate, 0);
    }

    window.REPORT_SUMMARY.lastUpdated = config.creationDate || autoConfig.creationDate;
    window.REPORT_SUMMARY.reportUrl = autoConfig.reportUrl;
    window.REPORT_SUMMARY.isTemplate = IS_TEMPLATE_MODE;

    console.log("REPORT_SUMMARY contract updated for dashboard:", window.REPORT_SUMMARY);
}

function updateConfigElements() {
    // Always update these elements
    document.getElementById('apiName').textContent = config.apiName;
    document.getElementById('baseUrl').textContent = config.baseUrl;
    document.getElementById('environment').textContent = config.environment;
    document.getElementById('authentication').textContent = config.authentication;
    document.getElementById('testDate').textContent = config.testDate;
    document.getElementById('createdOn').textContent = config.createdOn;
    document.getElementById('lastModifiedOn').textContent = config.lastModifiedOn;
    document.getElementById('apiNamePlaceholder').textContent = config.apiName;
    document.getElementById('generationDate').textContent = config.creationDate;
    document.getElementById('lastUpdated').textContent = config.creationDate;

    // Update stats display
    document.getElementById('totalTests').textContent = config.totalTests;
    document.getElementById('passedTests').textContent = config.passedTests;
    document.getElementById('failedTests').textContent = config.failedTests;
    document.getElementById('criticalBugs').textContent = config.criticalBugs;
    document.getElementById('passedStats').textContent = config.passedTests;
    document.getElementById('failedStats').textContent = config.failedTests;
    document.getElementById('skippedStats').textContent = config.skippedTests;
    document.getElementById('successRate').textContent = config.successRate + '%';

    // Update API stability verdict
    const stabilityIcon = config.apiStability === 'Stable' ? 'check-circle' : 'question-circle';
    document.getElementById('apiStabilityVerdict').innerHTML = `<i class="fas fa-${stabilityIcon}"></i> API STABILITY: ${config.apiStability}`;
    document.getElementById('releaseReadiness').textContent = config.releaseReadiness;

    // Update security assessments
    document.getElementById('sqlInjectionAssessment').textContent = config.sqlInjectionAssessment;
    document.getElementById('authenticationAssessment').textContent = config.authenticationAssessment;
    document.getElementById('authorizationAssessment').textContent = config.authorizationAssessment;
    document.getElementById('validationAssessment').textContent = config.validationAssessment;

    // Update test environment
    document.getElementById('automationSetup').textContent = config.automationSetup;
    document.getElementById('assertionsCount').textContent = config.assertionsCount;
    document.getElementById('coveragePercent').textContent = config.coveragePercent;
    document.getElementById('testDataInfo').textContent = config.testDataInfo;

    // Update test data section
    document.getElementById('testDataSource').textContent = config.testDataSource || "Not Configured";
    document.getElementById('dataFormat').textContent = config.dataFormat || "JSON";
    document.getElementById('dataRecords').textContent = config.dataRecords || "0";
    document.getElementById('dataUpdateDate').textContent = config.dataUpdateDate || "Not Updated";

    // Update recommendations
    const backendRecs = document.getElementById('backendRecommendations');
    const immediateActions = document.getElementById('immediateActions');
    const shortTermActions = document.getElementById('shortTermActions');
    const longTermActions = document.getElementById('longTermActions');

    if (backendRecs && Array.isArray(config.backendRecommendations)) {
        backendRecs.innerHTML = config.backendRecommendations.map(rec => `<li>${rec}</li>`).join('');
    }
    if (immediateActions && Array.isArray(config.immediateActions)) {
        immediateActions.innerHTML = config.immediateActions.map(action => `<li>${action}</li>`).join('');
    }
    if (shortTermActions && Array.isArray(config.shortTermActions)) {
        shortTermActions.innerHTML = config.shortTermActions.map(action => `<li>${action}</li>`).join('');
    }
    if (longTermActions && Array.isArray(config.longTermActions)) {
        longTermActions.innerHTML = config.longTermActions.map(action => `<li>${action}</li>`).join('');
    }
}

// ============================
// TEST CASES RENDERING
// ============================

function renderTestCases() {
    testCasesContainer.innerHTML = '';

    if (IS_TEMPLATE_MODE) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state-message';
        emptyState.innerHTML = `
            <i class="fas fa-vial"></i>
            <h3>No Test Cases Executed</h3>
            <p>This report has not been populated with test case data.</p>
            <p style="margin-top: 0.75rem; font-size: 0.85rem; color: #666;">
                <i class="fas fa-info-circle"></i> 
                Add test cases to <code>report-data.js</code> to see results here.
            </p>
        `;
        testCasesContainer.appendChild(emptyState);
        return;
    }

    const filteredCases = testCases.filter(testCase => {
        if (currentFilter !== 'all' && currentFilter !== 'create' &&
            currentFilter !== 'read' && currentFilter !== 'update' &&
            currentFilter !== 'delete' && currentFilter !== 'critical' &&
            currentFilter !== 'high' && currentFilter !== 'medium' &&
            currentFilter !== 'low') {
            if (testCase.status !== currentFilter) return false;
        }

        if (currentFilter === 'create' || currentFilter === 'read' ||
            currentFilter === 'update' || currentFilter === 'delete') {
            if (testCase.category !== currentFilter) return false;
        }

        if (currentFilter === 'critical') {
            if (testCase.severity !== 'critical') return false;
        }

        if (currentFilter === 'high') {
            if (testCase.severity !== 'high') return false;
        }

        if (currentFilter === 'medium') {
            if (testCase.severity !== 'medium') return false;
        }

        if (currentFilter === 'low') {
            if (testCase.severity !== 'low') return false;
        }

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const searchableText = `
                ${testCase.id} ${testCase.title} ${testCase.description} 
                ${testCase.endpoint} ${testCase.method} ${testCase.category}
            `.toLowerCase();

            if (!searchableText.includes(searchLower)) return false;
        }

        return true;
    });

    if (filteredCases.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state-message';
        emptyState.innerHTML = `
            <i class="fas fa-search"></i>
            <h3>No Matching Test Cases</h3>
            <p>No test cases match the current filter or search criteria.</p>
        `;
        testCasesContainer.appendChild(emptyState);
        return;
    }

    filteredCases.forEach(testCase => {
        const card = createTestCaseCard(testCase);
        testCasesContainer.appendChild(card);
    });
}

function createTestCaseCard(testCase) {
    const card = document.createElement('div');
    card.className = `test-case-card ${testCase.status}`;
    card.id = `test-case-${testCase.id}`;

    let statusBadgeClass = 'status-passed';
    if (testCase.status === 'failed') statusBadgeClass = 'status-failed';
    if (testCase.status === 'skipped') statusBadgeClass = 'status-skipped';
    if (testCase.status === 'failed' && testCase.severity === 'critical') statusBadgeClass = 'status-critical';

    let severityBadgeClass = 'severity-low';
    if (testCase.severity === 'critical') severityBadgeClass = 'severity-critical';
    if (testCase.severity === 'high') severityBadgeClass = 'severity-high';
    if (testCase.severity === 'medium') severityBadgeClass = 'severity-medium';
    if (testCase.severity === 'low') severityBadgeClass = 'severity-low';

    let methodBadgeClass = 'method-get';
    if (testCase.method === 'POST') methodBadgeClass = 'method-post';
    if (testCase.method === 'PUT') methodBadgeClass = 'method-put';
    if (testCase.method === 'DELETE') methodBadgeClass = 'method-delete';
    if (testCase.method === 'PATCH') methodBadgeClass = 'method-patch';

    card.innerHTML = `
        <div class="test-case-header" onclick="toggleTestDetails('${testCase.id}')">
            <div style="width: 100%;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
                    <h3 style="margin: 0; flex: 1; font-size: 1rem; line-height: 1.4;">
                        <span style="font-weight: 800; color: var(--primary-color);">${testCase.id}:</span> ${testCase.title}
                    </h3>
                    <div class="title-badges">
                        <span class="status-badge ${statusBadgeClass}">${testCase.status.toUpperCase()}</span>
                        <span class="severity-badge ${severityBadgeClass}">${testCase.severity.toUpperCase()}</span>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 8px;">
                    <span class="method-badge ${methodBadgeClass}">${testCase.method}</span>
                    <span style="color: var(--text-secondary); font-family: 'Courier New', monospace; font-size: 0.85rem;">${testCase.endpoint}</span>
                </div>
            </div>
            <i class="fas fa-chevron-down" id="chevron-${testCase.id}" style="margin-top: 4px; margin-left: 8px;"></i>
        </div>
        <div class="test-case-description">
            ${testCase.description}
        </div>
        <div class="test-case-details" id="details-${testCase.id}">
            <div class="detail-row">
                <div class="detail-label">Category:</div>
                <div class="detail-value">${testCase.category.toUpperCase()}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Priority:</div>
                <div class="detail-value">${testCase.priority}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Test Steps:</div>
                <div class="detail-value">
                    <ol style="margin: 0; padding-left: 16px;">
                        ${testCase.steps.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Expected Result:</div>
                <div class="detail-value">${testCase.expectedResult}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Actual Result:</div>
                <div class="detail-value">${testCase.actualResult}</div>
            </div>
            ${testCase.bugDetails ? `
            <div style="margin-top: 16px; padding: 12px; background-color: #fee2e2; border-radius: 6px; border-left: 4px solid var(--danger-color);">
                <h4 style="color: var(--danger-color); margin-top: 0; font-size: 1rem;"><i class="fas fa-bug"></i> Bug Details</h4>
                <div class="detail-row">
                    <div class="detail-label">Severity:</div>
                    <div class="detail-value">${testCase.bugDetails.severity.toUpperCase()}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Actual Result:</div>
                    <div class="detail-value">${testCase.bugDetails.actualResult}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Expected Result:</div>
                    <div class="detail-value">${testCase.bugDetails.expectedResult}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Root Cause:</div>
                    <div class="detail-value">${testCase.bugDetails.rootCause}</div>
                </div>
                <div class="detail-row">
                    <div class="detail-label">Fix Recommendation:</div>
                    <div class="detail-value">${testCase.bugDetails.fix}</div>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    return card;
}

// ============================
// BUGS RENDERING
// ============================

function renderBugs() {
    bugsGrid.innerHTML = '';

    // In template mode, always show empty state
    if (IS_TEMPLATE_MODE) {
        const emptyState = document.createElement('div');
        emptyState.className = 'bugs-empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>No Bugs Detected</h3>
            <p>All test cases have passed. No bugs have been identified.</p>
            <p style="margin-top: 0.75rem; font-size: 0.85rem; color: #666;">
                <i class="fas fa-info-circle"></i> Add failed test cases with bug details to report-data.js
            </p>
        `;
        bugsGrid.appendChild(emptyState);
        return;
    }

    // Extract bugs from test cases
    const bugs = [];
    testCases.forEach(testCase => {
        if (testCase.bugDetails) {
            bugs.push({
                testCaseId: testCase.id,
                title: testCase.title,
                severity: testCase.severity,
                priority: testCase.priority,
                bugDetails: testCase.bugDetails
            });
        }
    });

    // Calculate bug statistics
    const bugCounts = {
        p0: bugs.filter(b => b.severity === 'critical').length,
        p1: bugs.filter(b => b.severity === 'high').length,
        p2: bugs.filter(b => b.severity === 'medium').length,
        p3: bugs.filter(b => b.severity === 'low').length,
        total: bugs.length
    };

    // Update UI elements
    document.getElementById('p0-bug-count').textContent = bugCounts.p0;
    document.getElementById('p1-bug-count').textContent = bugCounts.p1;
    document.getElementById('p2-bug-count').textContent = bugCounts.p2;
    document.getElementById('p3-bug-count').textContent = bugCounts.p3;
    document.getElementById('total-bug-count').textContent = bugCounts.total;

    // Update bug summary subtitle
    const bugSubtitle = document.getElementById('bug-summary-subtitle');
    if (bugSubtitle) {
        bugSubtitle.textContent = `(${bugCounts.total} bug${bugCounts.total !== 1 ? 's' : ''} detected, ${bugCounts.p0} critical)`;
    }

    if (bugs.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'bugs-empty-state';
        emptyState.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>No Bugs Detected</h3>
            <p>All test cases have passed. No bugs have been identified.</p>
        `;
        bugsGrid.appendChild(emptyState);
        return;
    }

    bugs.forEach((bug, index) => {
        const card = createBugCard(bug, index);
        bugsGrid.appendChild(card);
    });
}

function createBugCard(bug, index) {
    const card = document.createElement('div');
    card.className = `bug-card ${bug.severity}`;
    card.id = `bug-${index}`;

    let priorityClass = 'p3';
    if (bug.severity === 'critical') priorityClass = 'p0';
    if (bug.severity === 'high') priorityClass = 'p1';
    if (bug.severity === 'medium') priorityClass = 'p2';
    if (bug.severity === 'low') priorityClass = 'p3';

    card.innerHTML = `
        <div class="bug-header" onclick="toggleBugDetails(${index})">
            <div style="width: 100%;">
                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
                    <div class="bug-title">
                        <span style="font-weight: 800; color: var(--danger-color);">${bug.testCaseId}:</span> ${bug.title}
                    </div>
                    <div class="bug-badges">
                        <span class="severity-badge severity-${bug.severity}">${bug.severity.toUpperCase()}</span>
                        <span class="bug-priority ${priorityClass}">${bug.priority}</span>
                    </div>
                </div>
            </div>
            <i class="fas fa-chevron-down" id="bug-chevron-${index}" style="margin-top: 4px; margin-left: 8px;"></i>
        </div>
        <div class="bug-description">
            ${bug.bugDetails.actualResult}
        </div>
        <div class="bug-details" id="bug-details-${index}">
            <div class="detail-row">
                <div class="detail-label">Expected Result:</div>
                <div class="detail-value">${bug.bugDetails.expectedResult}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Root Cause:</div>
                <div class="detail-value">${bug.bugDetails.rootCause}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Fix Recommendation:</div>
                <div class="detail-value">${bug.bugDetails.fix}</div>
            </div>
            <div style="margin-top: 12px; font-style: italic; color: var(--text-secondary); font-size: 0.85rem;">
                From test case: ${bug.testCaseId}
            </div>
        </div>
    `;

    return card;
}

// ============================
// COMPACT CHARTS INITIALIZATION
// ============================

function initializeCharts() {
    // In template mode, show empty chart messages
    if (IS_TEMPLATE_MODE) {
        const testStatusCtx = document.getElementById('testStatusChart')?.getContext('2d');
        const severityCtx = document.getElementById('severityChart')?.getContext('2d');
        const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');

        const emptyChartHTML = `
            <div class="chart-empty-message">
                <i class="fas fa-chart-pie"></i>
                <h4>No Test Data Available</h4>
                <p>Add test cases to report-data.js to see charts</p>
            </div>
        `;

        if (testStatusCtx) {
            testStatusCtx.canvas.parentElement.classList.add('empty-chart');
            testStatusCtx.canvas.parentElement.innerHTML = emptyChartHTML;
        }
        if (severityCtx) {
            severityCtx.canvas.parentElement.classList.add('empty-chart');
            severityCtx.canvas.parentElement.innerHTML = emptyChartHTML;
        }
        if (categoryCtx) {
            categoryCtx.canvas.parentElement.classList.add('empty-chart');
            categoryCtx.canvas.parentElement.innerHTML = emptyChartHTML;
        }

        chartsInitialized = true;
        return;
    }

    if (chartsInitialized) {
        updateChartsData();
        return;
    }

    const testStatusCtx = document.getElementById('testStatusChart')?.getContext('2d');
    const severityCtx = document.getElementById('severityChart')?.getContext('2d');
    const categoryCtx = document.getElementById('categoryChart')?.getContext('2d');

    // Check if we have data for charts
    const hasTestData = config.totalTests > 0;
    const severityData = calculateSeverityDistribution();
    const categoryData = calculateCategoryDistribution();
    const hasSeverityData = severityData.some(val => val > 0);
    const hasCategoryData = categoryData.some(val => val > 0);

    // Test Status Chart
    if (testStatusCtx) {
        if (hasTestData) {
            testStatusChart = new Chart(testStatusCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Passed', 'Failed', 'Skipped'],
                    datasets: [{
                        data: [config.passedTests, config.failedTests, config.skippedTests],
                        backgroundColor: [
                            'rgba(39, 174, 96, 0.8)',
                            'rgba(231, 76, 60, 0.8)',
                            'rgba(243, 156, 18, 0.8)'
                        ],
                        borderColor: [
                            'rgb(39, 174, 96)',
                            'rgb(231, 76, 60)',
                            'rgb(243, 156, 18)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    family: 'Cairo',
                                    size: 11
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Test Status Distribution',
                            font: {
                                family: 'Cairo',
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        } else {
            testStatusCtx.canvas.parentElement.classList.add('empty-chart');
            testStatusCtx.canvas.parentElement.innerHTML = `
                <div class="chart-empty-message">
                    <i class="fas fa-chart-pie"></i>
                    <h4>No Test Data Available</h4>
                    <p>Add test cases to report-data.js to see charts</p>
                </div>
            `;
        }
    }

    // Severity Chart
    if (severityCtx) {
        if (hasSeverityData) {
            severityChart = new Chart(severityCtx, {
                type: 'bar',
                data: {
                    labels: ['Critical', 'High', 'Medium', 'Low'],
                    datasets: [{
                        label: 'Number of Test Cases',
                        data: severityData,
                        backgroundColor: [
                            'rgba(192, 57, 43, 0.8)',
                            'rgba(231, 76, 60, 0.8)',
                            'rgba(243, 156, 18, 0.8)',
                            'rgba(127, 140, 141, 0.8)'
                        ],
                        borderColor: [
                            'rgb(192, 57, 43)',
                            'rgb(231, 76, 60)',
                            'rgb(243, 156, 18)',
                            'rgb(127, 140, 141)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: {
                            display: true,
                            text: 'Test Case Severity Distribution',
                            font: {
                                family: 'Cairo',
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                font: {
                                    family: 'Cairo',
                                    size: 11
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Cairo',
                                    size: 11
                                }
                            }
                        }
                    }
                }
            });
        } else {
            severityCtx.canvas.parentElement.classList.add('empty-chart');
            severityCtx.canvas.parentElement.innerHTML = `
                <div class="chart-empty-message">
                    <i class="fas fa-chart-bar"></i>
                    <h4>No Data Available</h4>
                    <p>Severity distribution will appear here</p>
                </div>
            `;
        }
    }

    // Category Chart
    if (categoryCtx) {
        if (hasCategoryData) {
            categoryChart = new Chart(categoryCtx, {
                type: 'pie',
                data: {
                    labels: ['Create', 'Read', 'Update', 'Delete', 'Auth', 'Security', 'Validation', 'Performance'],
                    datasets: [{
                        data: categoryData,
                        backgroundColor: [
                            'rgba(52, 152, 219, 0.8)',
                            'rgba(39, 174, 96, 0.8)',
                            'rgba(243, 156, 18, 0.8)',
                            'rgba(231, 76, 60, 0.8)',
                            'rgba(142, 68, 173, 0.8)',
                            'rgba(155, 89, 182, 0.8)',
                            'rgba(41, 128, 185, 0.8)',
                            'rgba(230, 126, 34, 0.8)'
                        ],
                        borderColor: [
                            'rgb(52, 152, 219)',
                            'rgb(39, 174, 96)',
                            'rgb(243, 156, 18)',
                            'rgb(231, 76, 60)',
                            'rgb(142, 68, 173)',
                            'rgb(155, 89, 182)',
                            'rgb(41, 128, 185)',
                            'rgb(230, 126, 34)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    family: 'Cairo',
                                    size: 10
                                }
                            }
                        },
                        title: {
                            display: true,
                            text: 'Test Case Categories',
                            font: {
                                family: 'Cairo',
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    }
                }
            });
        } else {
            categoryCtx.canvas.parentElement.classList.add('empty-chart');
            categoryCtx.canvas.parentElement.innerHTML = `
                <div class="chart-empty-message">
                    <i class="fas fa-chart-pie"></i>
                    <h4>No Data Available</h4>
                    <p>Category distribution will appear here</p>
                </div>
            `;
        }
    }

    chartsInitialized = true;
}

function calculateSeverityDistribution() {
    if (testCases.length === 0) return [0, 0, 0, 0];
    return [
        testCases.filter(tc => tc.severity === 'critical').length,
        testCases.filter(tc => tc.severity === 'high').length,
        testCases.filter(tc => tc.severity === 'medium').length,
        testCases.filter(tc => tc.severity === 'low').length
    ];
}

function calculateCategoryDistribution() {
    if (testCases.length === 0) return [0, 0, 0, 0, 0, 0, 0, 0];
    const categories = ['create', 'read', 'update', 'delete', 'authentication', 'security', 'validation', 'performance'];
    return categories.map(cat =>
        testCases.filter(tc => tc.category === cat).length
    );
}

function updateChartsData() {
    if (!chartsInitialized || IS_TEMPLATE_MODE) return;

    if (testStatusChart) {
        testStatusChart.data.datasets[0].data = [config.passedTests, config.failedTests, config.skippedTests];
        testStatusChart.update();
    }

    if (severityChart) {
        severityChart.data.datasets[0].data = calculateSeverityDistribution();
        severityChart.update();
    }

    if (categoryChart) {
        categoryChart.data.datasets[0].data = calculateCategoryDistribution();
        categoryChart.update();
    }
}

// ============================
// UTILITY FUNCTIONS
// ============================

function updateCounts() {
    const totalCount = testCases.length;
    const passedCount = testCases.filter(tc => tc.status === 'passed').length;
    const failedCount = testCases.filter(tc => tc.status === 'failed').length;
    const skippedCount = testCases.filter(tc => tc.status === 'skipped').length;
    const criticalCount = testCases.filter(tc => tc.severity === 'critical').length;
    const highCount = testCases.filter(tc => tc.severity === 'high').length;
    const mediumCount = testCases.filter(tc => tc.severity === 'medium').length;
    const lowCount = testCases.filter(tc => tc.severity === 'low').length;

    document.getElementById('allTestsCount').textContent = totalCount;
    document.getElementById('passedCount').textContent = passedCount;
    document.getElementById('failedCount').textContent = failedCount;
    document.getElementById('skippedCount').textContent = skippedCount;
    document.getElementById('criticalCount').textContent = criticalCount;
    if (document.getElementById('highCount')) document.getElementById('highCount').textContent = highCount;
    if (document.getElementById('mediumCount')) document.getElementById('mediumCount').textContent = mediumCount;
    if (document.getElementById('lowCount')) document.getElementById('lowCount').textContent = lowCount;
    document.getElementById('totalTestsTitle').textContent = totalCount;
}

function updateEmptyStateVisibility() {
    const hasTestCases = testCases.length > 0;
    const hasBugs = testCases.some(tc => tc.bugDetails);

    // Handle test case controls
    const testControls = document.querySelectorAll('.filters-section, #toggleAllBtn');
    testControls.forEach(el => {
        if (hasTestCases) {
            el.style.display = '';
            el.classList.remove('hidden');
        } else {
            el.style.display = 'none';
            el.classList.add('hidden');
        }
    });

    // Handle bug controls
    const bugControls = document.querySelectorAll('#toggleAllBugsBtn, .bug-stat');
    const bugSection = document.querySelector('.bugs-section');
    const bugHeader = document.querySelector('h2.section-title i.fa-exclamation-triangle')?.closest('h2');

    if (hasBugs) {
        // Show bug section
        if (bugSection) bugSection.style.display = 'block';
        if (bugHeader) bugHeader.style.display = 'flex';
        bugControls.forEach(el => {
            el.style.display = '';
            el.classList.remove('hidden');
        });
    } else {
        // Hide bug section
        if (bugSection) bugSection.style.display = 'none';
        if (bugHeader) bugHeader.style.display = 'none';
        bugControls.forEach(el => {
            el.style.display = 'none';
            el.classList.add('hidden');
        });
    }

    // Search box visibility
    if (searchBox) {
        searchBox.style.display = hasTestCases ? '' : 'none';
    }
}

window.toggleTestDetails = function (testCaseId) {
    // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode
    const details = document.getElementById(`details-${testCaseId}`);
    const chevron = document.getElementById(`chevron-${testCaseId}`);
    const card = document.getElementById(`test-case-${testCaseId}`);

    if (details && chevron) {
        details.classList.toggle('active');
        chevron.style.transform = details.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        if (card) card.classList.toggle('expanded');
    }
};

window.toggleBugDetails = function (bugIndex) {
    // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode
    const details = document.getElementById(`bug-details-${bugIndex}`);
    const chevron = document.getElementById(`bug-chevron-${bugIndex}`);
    const card = document.getElementById(`bug-${bugIndex}`);

    if (details && chevron) {
        details.classList.toggle('active');
        chevron.style.transform = details.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
        if (card) card.classList.toggle('expanded');
    }
};

// ============================
// EVENT LISTENERS SETUP
// ============================

function setupEventListeners() {
    // Toggle all test details
    if (toggleAllBtn) {
        toggleAllBtn.addEventListener('click', () => {
            // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode
            allExpanded = !allExpanded;
            const chevrons = document.querySelectorAll('.test-case-header i');
            const details = document.querySelectorAll('.test-case-details');
            const cards = document.querySelectorAll('.test-case-card');

            chevrons.forEach(chevron => {
                chevron.className = allExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
            });

            details.forEach(detail => {
                if (allExpanded) {
                    detail.classList.add('active');
                } else {
                    detail.classList.remove('active');
                }
            });

            cards.forEach(card => {
                if (allExpanded) {
                    card.classList.add('expanded');
                } else {
                    card.classList.remove('expanded');
                }
            });

            toggleAllBtn.innerHTML = allExpanded
                ? '<i class="fas fa-compress-alt"></i> Collapse All Test Details'
                : '<i class="fas fa-expand-alt"></i> Expand All Test Details';
        });
    }

    // Toggle all bug details
    if (toggleAllBugsBtn) {
        toggleAllBugsBtn.addEventListener('click', () => {
            // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode

            allBugsExpanded = !allBugsExpanded;
            const chevrons = document.querySelectorAll('.bug-header i');
            const details = document.querySelectorAll('.bug-details');
            const cards = document.querySelectorAll('.bug-card');

            chevrons.forEach(chevron => {
                chevron.className = allBugsExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
            });

            details.forEach(detail => {
                if (allBugsExpanded) {
                    detail.classList.add('active');
                } else {
                    detail.classList.remove('active');
                }
            });

            cards.forEach(card => {
                if (allBugsExpanded) {
                    card.classList.add('expanded');
                } else {
                    card.classList.remove('expanded');
                }
            });

            toggleAllBugsBtn.innerHTML = allBugsExpanded
                ? '<i class="fas fa-compress-alt"></i>Collapse All Bug Details'
                : '<i class="fas fa-expand-alt"></i>Expand All Bug Details';
        });
    }

    // Filter test cases
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode

            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.getAttribute('data-filter');
            renderTestCases();
        });
    });

    // Search functionality
    if (searchBox) {
        searchBox.addEventListener('input', () => {
            // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode

            searchTerm = searchBox.value.trim();
            renderTestCases();
        });
    }

    // Print functionality
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Export functionality
    function downloadJSON(data, filenamePrefix) {
        const safeName = (filenamePrefix || 'report').toLowerCase().replace(/[^a-z0-9]/g, '_');
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gazzer_api_${safeName}_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    if (exportBugReportBtn) {
        exportBugReportBtn.addEventListener('click', () => {
            if (IS_TEMPLATE_MODE) return;
            const bugs = testCases.filter(tc => tc.status === 'failed' || tc.bugDetails).map(tc => ({
                id: tc.id,
                title: tc.title,
                severity: tc.severity,
                priority: tc.priority,
                bugDetails: tc.bugDetails
            }));

            const exportData = {
                reportType: "Bug Report",
                apiName: config.apiName,
                environment: config.environment,
                totalBugs: bugs.length,
                exportDate: new Date().toISOString(),
                bugs: bugs
            };

            downloadJSON(exportData, `bug_report_${config.apiName}`);
        });
    }

    if (exportTestCasesBtn) {
        exportTestCasesBtn.addEventListener('click', () => {
            if (IS_TEMPLATE_MODE) return;
            const exportData = {
                reportType: "Test Cases",
                apiName: config.apiName,
                totalTestCases: testCases.length,
                exportDate: new Date().toISOString(),
                testCases: testCases
            };
            downloadJSON(exportData, `test_cases_${config.apiName}`);
        });
    }

    if (exportFullReportBtn) {
        exportFullReportBtn.addEventListener('click', () => {
            if (IS_TEMPLATE_MODE) return;
            const exportData = {
                reportType: "Full Report",
                config: config,
                testCases: testCases,
                reportSummary: window.REPORT_SUMMARY,
                exportDate: new Date().toISOString()
            };
            downloadJSON(exportData, `full_report_${config.apiName}`);
        });
    }

    // Modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    window.showTestCaseModal = function (testCase) {
        // if (IS_TEMPLATE_MODE) return; // Allow toggle even in template mode

        modalTitle.textContent = `Test Case: ${testCase.id}`;

        let modalContent = `
            <h3 style="margin-top: 0;">${testCase.title}</h3>
            <p><strong>Status:</strong> <span class="status-badge status-${testCase.status}">${testCase.status.toUpperCase()}</span></p>
            <p><strong>Severity:</strong> <span class="severity-badge severity-${testCase.severity}">${testCase.severity.toUpperCase()}</span></p>
            <p><strong>Endpoint:</strong> <code>${testCase.method} ${testCase.endpoint}</code></p>
            <p><strong>Description:</strong> ${testCase.description}</p>

            <h4>Test Steps</h4>
            <ol>
                ${testCase.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>

            <h4>Expected Result</h4>
            <p>${testCase.expectedResult}</p>

            <h4>Actual Result</h4>
            <p>${testCase.actualResult}</p>
        `;

        if (testCase.bugDetails) {
            modalContent += `
                <h4 style="color: var(--danger-color);">Bug Details</h4>
                <p><strong>Root Cause:</strong> ${testCase.bugDetails.rootCause}</p>
                <p><strong>Fix Recommendation:</strong> ${testCase.bugDetails.fix}</p>
            `;
        }

        modalBody.innerHTML = modalContent;
        modal.style.display = 'flex';
    };
}

// ============================
// DEFENSIVE GUARDS
// ============================

function validateReportSummary() {
    if (!window.REPORT_SUMMARY) {
        console.error("CRITICAL: window.REPORT_SUMMARY is not defined");
        // Emergency fallback - create it immediately
        window.REPORT_SUMMARY = {
            apiName: "Emergency Fallback",
            folderName: "error",
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            criticalBugs: 0,
            successRate: 0,
            lastUpdated: new Date().toISOString(),
            reportUrl: "./index.html",
            isTemplate: true
        };
        return false;
    }

    const requiredFields = [
        'apiName', 'folderName', 'totalTests', 'passedTests',
        'failedTests', 'skippedTests', 'criticalBugs',
        'successRate', 'lastUpdated', 'reportUrl', 'isTemplate'
    ];

    for (const field of requiredFields) {
        if (typeof window.REPORT_SUMMARY[field] === 'undefined') {
            console.warn(`REPORT_SUMMARY missing field: ${field}, setting default`);
            if (field.includes('Tests') || field.includes('Bugs') || field === 'successRate') {
                window.REPORT_SUMMARY[field] = 0;
            } else if (field === 'apiName') {
                window.REPORT_SUMMARY[field] = "Unnamed API";
            } else if (field === 'folderName') {
                window.REPORT_SUMMARY[field] = "root";
            } else if (field === 'reportUrl') {
                window.REPORT_SUMMARY[field] = "./index.html";
            } else if (field === 'isTemplate') {
                window.REPORT_SUMMARY[field] = true;
            } else {
                window.REPORT_SUMMARY[field] = "";
            }
        }
    }

    return true;
}

// ============================
// INITIALIZE ON LOAD
// ============================

// Duplicate DOMContentLoaded listener removed to prevent double initialization
// See the enhanced listener below around line 1434


// Emergency fallback: If for some reason the report isn't ready,
// ensure REPORT_SUMMARY is still available
setTimeout(() => {
    if (!window.REPORT_SUMMARY || !window.REPORT_SUMMARY.apiName) {
        console.warn("Emergency: REPORT_SUMMARY not properly initialized, creating fallback");
        window.REPORT_SUMMARY = {
            apiName: "Template Report",
            folderName: "template",
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            skippedTests: 0,
            criticalBugs: 0,
            successRate: 0,
            lastUpdated: new Date().toISOString(),
            reportUrl: "./index.html",
            isTemplate: true
        };
    }
}, 2000);

// ============================
// EXPLICIT INITIALIZATION TRIGGER
// ============================

// This function can be called by the dashboard to ensure initialization
window.initializeReportForDashboard = function () {
    if (!window.reportInitialized) {
        console.log("Dashboard triggered explicit initialization");
        initializeReport();
        window.reportInitialized = true;
    }
    return window.REPORT_SUMMARY;
};

// Auto-initialize and emit ready signal
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded, initializing report...");
    validateReportSummary();
    initializeReport();
    window.reportInitialized = true;

    // Emit ready signal for dashboard
    setTimeout(() => {
        if (window.REPORT_SUMMARY && window.REPORT_SUMMARY.apiName) {
            document.dispatchEvent(new CustomEvent('reportReady', {
                detail: window.REPORT_SUMMARY
            }));
            console.log("REPORT_SUMMARY ready for dashboard:", window.REPORT_SUMMARY);
        }
    }, 500);
});

// Fallback initialization for dashboard
setTimeout(() => {
    if (!window.reportInitialized) {
        console.warn("Fallback: Auto-initializing report");
        validateReportSummary();
        initializeReport();
        window.reportInitialized = true;
    }
}, 2000);

// ============================
// NAVIGATION & SCROLL LOGIC
// ============================
function setupNavigation() {
    console.log("Setting up navigation...");
    const navLinks = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.dashboard-section, .api-info-section, .test-cases-section, .bugs-section, .test-data-section, .critical-issues-section, .conclusion-section, .recommendations-grid-section');
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    // Smooth Scrolling with Offset for Sidebar/Header
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Determine offset based on screen size (sidebar vs bottom bar)
                const isMobile = window.innerWidth <= 768;
                const headerOffset = isMobile ? 80 : 20;

                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Update active state manually
                navLinks.forEach(n => n.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Scroll Spy & Scroll-to-Top Visibility
    window.addEventListener('scroll', () => {
        // Scroll Spy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust threshold for better active state switching
            if (pageYOffset >= (sectionTop - 250)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });

        // specific check for dashboard at top
        if (window.pageYOffset < 200) {
            const dashboardLink = document.querySelector('.nav-item[href="#dashboard"]');
            if (dashboardLink) dashboardLink.classList.add('active');
        }

        // Scroll to Top Button Visibility
        if (scrollToTopBtn) {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
    });

    // Scroll to Top Action
    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }
}

// Initialize Navigation immediately if DOM is ready, or on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupNavigation);
} else {
    setupNavigation();
}
