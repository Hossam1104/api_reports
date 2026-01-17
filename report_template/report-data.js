// report-data.js - Unified data source for API testing reports
// CRITICAL: This is the ONLY external data file needed

/*
HOW TO USE:
1. Fill in the meta section with your API details
2. Add test cases to the testCases array
3. Save the file
4. The report will automatically use these values
*/

window.REPORT_DATA = {
    // ======================
    // API METADATA SECTION
    // ======================
    meta: {
        // REQUIRED: API Information
        apiName: "Admin Management",
        folderName: "folderName",  //The api folder name
        isTemplate: true, //Set to true if this is a template
        baseUrl: "http://localhost:8000/api",
        environment: "Development",
        authentication: "Bearer Token",
        executedBy: "Hossam Mohamed",
        executedByTitle: "Software QA Engineer",
        createdOn: "2026-01-16",
        lastModifiedOn: "2026-01-16",
        createdAt: "2026-01-16T10:30:00Z",

        // OPTIONAL: Test Environment Details
        automationSetup: "Manual - Ready for Automation",
        assertionsCount: 0,
        coveragePercent: "0%",

        // OPTIONAL: Security Assessment
        sqlInjectionAssessment: "Not Tested",
        authenticationAssessment: "Not Tested",
        authorizationAssessment: "Not Tested",
        validationAssessment: "Not Tested",

        // OPTIONAL: Test Data Info
        testDataSource: "Manual Execution",
        dataFormat: "JSON",
        dataRecords: 0,
        dataUpdateDate: new Date().toLocaleDateString(),

        // OPTIONAL: Recommendations
        backendRecommendations: [
            "Populate this report with actual test results",
            "Review API documentation for completeness",
            "Establish automated testing pipeline"
        ],
        immediateActions: [
            "Configure API endpoints",
            "Add authentication details if required",
            "Validate API response formats"
        ],
        shortTermActions: [
            "Create comprehensive test suite",
            "Establish test data management",
            "Define API versioning strategy"
        ],
        longTermActions: [
            "Implement CI/CD integration",
            "Set up performance monitoring",
            "Establish security testing protocols"
        ]
    },

    // ======================
    // TEST CASES SECTION
    // ======================
    testCases: [
        // EXAMPLE: Uncomment and modify these test cases
        /*
        {
            id: "TC-001",
            title: "Admin Login - Valid Credentials",
            description: "Verify admin can login with valid email and password",
            endpoint: "/api/v1/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "high",
            priority: "P1",
            duration: "1.2s",
            tags: ["authentication", "login", "admin"],
            steps: [
                "Send POST request to /api/v1/auth/login",
                "Include valid admin credentials in request body",
                "Verify response status is 200 OK",
                "Verify response contains valid JWT token",
                "Verify token has admin role claim"
            ],
            expectedResult: "Login successful with valid JWT token containing admin role",
            actualResult: "Login successful, JWT token returned with admin role claim",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...","user":{"id":1,"role":"admin"}}',
            bugDetails: null
        },
        {
            id: "TC-002",
            title: "Admin Login - Invalid Password",
            description: "Verify login fails with incorrect password",
            endpoint: "/api/v1/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request with invalid password",
                "Verify response status is 401 Unauthorized",
                "Verify error message is appropriate"
            ],
            expectedResult: "Login should fail with 401 status",
            actualResult: "Login failed as expected with 401 status",
            bugDetails: null
        },
        {
            id: "TC-003",
            title: "Create User - Missing Required Fields",
            description: "Verify API rejects user creation with missing fields",
            endpoint: "/api/v1/users",
            method: "POST",
            category: "validation",
            status: "failed",
            severity: "critical",
            priority: "P0",
            steps: [
                "Send POST request without required email field",
                "Check response status code",
                "Verify error message indicates missing field"
            ],
            expectedResult: "API should return 400 Bad Request with validation error",
            actualResult: "API returned 200 OK and created incomplete user record",
            bugDetails: {
                severity: "critical",
                actualResult: "API accepted incomplete data and returned 200 status",
                expectedResult: "API should reject incomplete data with 400 status",
                rootCause: "Missing server-side validation for required fields",
                fix: "Add comprehensive validation middleware for all required fields"
            }
        }
        */
        // Add your ACTUAL test cases here following the structure above
        // Remove the comments and fill with your actual test data
    ]
};

// Dashboard integration hint
console.log("report-data.js loaded successfully");
console.log(`API: ${window.REPORT_DATA.meta.apiName}`);
console.log(`Test Cases: ${window.REPORT_DATA.testCases.length}`);