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
        apiName: "Authentication",
        folderName: "Authentication",
        isTemplate: false,
        baseUrl: "https://admin-backend.gazzertest.cloud/api",
        environment: "Production",
        authentication: "Bearer Token",
        executedBy: "Hossam Mohamed",
        executedByTitle: "Senior Software QA Engineer",
        createdAt: new Date().toISOString(),

        // OPTIONAL: Test Environment Details
        automationSetup: "Postman + Newman",
        assertionsCount: 320,
        coveragePercent: "92%",

        // OPTIONAL: Security Assessment
        sqlInjectionAssessment: "Protected",
        authenticationAssessment: "Strong",
        authorizationAssessment: "Strong",
        validationAssessment: "Comprehensive",

        // OPTIONAL: Test Data Info
        testDataSource: "Production Environment",
        dataFormat: "JSON",
        dataRecords: 100,
        dataUpdateDate: new Date().toLocaleDateString(),

        // OPTIONAL: Recommendations
        backendRecommendations: [
            "Implement rate limiting on login endpoint",
            "Add multi-factor authentication option",
            "Enhance token expiration monitoring"
        ],
        immediateActions: [
            "Fix critical SQL injection vulnerability",
            "Implement proper input validation",
            "Add missing authorization checks"
        ],
        shortTermActions: [
            "Improve error handling consistency",
            "Add comprehensive logging",
            "Implement token refresh mechanism"
        ],
        longTermActions: [
            "Implement distributed session management",
            "Add security audit trail",
            "Establish automated security testing pipeline"
        ]
    },

    // ======================
    // TEST CASES SECTION
    // ======================
    testCases: [
        // ======================
        // LOGIN ENDPOINT TESTS
        // ======================
        {
            id: "TC-001",
            title: "Login - Valid Credentials",
            description: "Verify admin can login with valid email and password",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "high",
            priority: "P1",
            duration: "1.2s",
            tags: ["authentication", "login", "admin"],
            steps: [
                "Send POST request to /auth/login",
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
            title: "Login - Invalid Password",
            description: "Verify login fails with incorrect password",
            endpoint: "/auth/login",
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
            requestBody: '{"email":"admin@example.com","password":"WrongPassword"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: null
        },
        {
            id: "TC-003",
            title: "Login - Non-existent Email",
            description: "Verify login fails with non-existent email",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request with non-existent email",
                "Check response status code",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: '{"email":"nonexistent@example.com","password":"Password123"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: null
        },
        {
            id: "TC-004",
            title: "Login - Missing Email Field",
            description: "Verify API rejects login with missing email",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request without email field",
                "Check response status code",
                "Verify validation error message"
            ],
            expectedResult: "API should return 400 Bad Request",
            actualResult: "API returned 400 with validation error",
            requestBody: '{"password":"Password123"}',
            responseBody: '{"error":"Email is required","status":400}',
            bugDetails: null
        },
        {
            id: "TC-005",
            title: "Login - Missing Password Field",
            description: "Verify API rejects login with missing password",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request without password field",
                "Check response status code",
                "Verify validation error message"
            ],
            expectedResult: "API should return 400 Bad Request",
            actualResult: "API returned 400 with validation error",
            requestBody: '{"email":"admin@example.com"}',
            responseBody: '{"error":"Password is required","status":400}',
            bugDetails: null
        },
        {
            id: "TC-006",
            title: "Login - SQL Injection Attack",
            description: "Test for SQL injection vulnerability in login",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "critical",
            priority: "P0",
            steps: [
                "Send POST request with SQL injection payload",
                "Check if query executes successfully",
                "Verify application doesn't expose database errors"
            ],
            expectedResult: "API should reject request with proper error handling",
            actualResult: "Query executed, partial database error exposed",
            requestBody: '{"email":"admin@example.com","password":"\' OR \'1\'=\'1"}',
            responseBody: '{"error":"You have an error in your SQL syntax...","status":500}',
            bugDetails: {
                severity: "critical",
                actualResult: "SQL query executed and exposed database error in response",
                expectedResult: "API should sanitize input and return generic error",
                rootCause: "Missing input sanitization and parameterized queries",
                fix: "Implement proper input validation and use parameterized SQL queries"
            }
        },
        {
            id: "TC-007",
            title: "Login - XSS Attack",
            description: "Test for cross-site scripting vulnerability",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "high",
            priority: "P1",
            steps: [
                "Send POST request with XSS payload",
                "Check response for script execution",
                "Verify proper sanitization"
            ],
            expectedResult: "XSS payload should be sanitized",
            actualResult: "XSS payload properly sanitized",
            requestBody: '{"email":"<script>alert(1)</script>","password":"test"}',
            responseBody: '{"error":"Invalid email format","status":400}',
            bugDetails: null
        },
        {
            id: "TC-008",
            title: "Login - Rate Limiting",
            description: "Verify rate limiting is implemented",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Send 10 rapid consecutive login requests",
                "Check if rate limiting triggers",
                "Verify appropriate error response"
            ],
            expectedResult: "API should limit requests after threshold",
            actualResult: "No rate limiting observed, all requests succeeded",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "high",
                actualResult: "No rate limiting implemented, potential for brute force attacks",
                expectedResult: "API should implement rate limiting after 5 attempts per minute",
                rootCause: "Missing rate limiting middleware",
                fix: "Implement rate limiting using token bucket or sliding window algorithm"
            }
        },
        {
            id: "TC-009",
            title: "Login - Empty Request Body",
            description: "Verify API handles empty request body",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send POST request with empty body",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 400 Bad Request",
            actualResult: "API returned 400 as expected",
            requestBody: '{}',
            responseBody: '{"error":"Email and password are required","status":400}',
            bugDetails: null
        },
        {
            id: "TC-010",
            title: "Login - Invalid JSON Format",
            description: "Verify API handles malformed JSON",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send POST request with invalid JSON",
                "Check response status",
                "Verify JSON parsing error"
            ],
            expectedResult: "API should return 400 Bad Request",
            actualResult: "API returned 400 with JSON parsing error",
            requestBody: '{email:"admin@example.com", password:"test"',
            responseBody: '{"error":"Invalid JSON format","status":400}',
            bugDetails: null
        },

        // ======================
        // LOGOUT ENDPOINT TESTS
        // ======================
        {
            id: "TC-011",
            title: "Logout - Valid Token",
            description: "Verify user can logout with valid token",
            endpoint: "/auth/logout",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request to /auth/logout",
                "Include valid Authorization header",
                "Verify response status is 200 OK",
                "Verify token is invalidated"
            ],
            expectedResult: "Logout successful, token invalidated",
            actualResult: "Logout successful, token invalidated",
            requestBody: '{}',
            responseBody: '{"success":true,"message":"Successfully logged out"}',
            bugDetails: null
        },
        {
            id: "TC-012",
            title: "Logout - Missing Authorization Header",
            description: "Verify logout fails without token",
            endpoint: "/auth/logout",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request without Authorization header",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: '{}',
            responseBody: '{"error":"Unauthorized","status":401}',
            bugDetails: null
        },
        {
            id: "TC-013",
            title: "Logout - Invalid Token Format",
            description: "Verify logout fails with malformed token",
            endpoint: "/auth/logout",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request with malformed token",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: '{}',
            responseBody: '{"error":"Invalid token","status":401}',
            bugDetails: null
        },
        {
            id: "TC-014",
            title: "Logout - Expired Token",
            description: "Verify logout fails with expired token",
            endpoint: "/auth/logout",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send POST request with expired token",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: '{}',
            responseBody: '{"error":"Token expired","status":401}',
            bugDetails: null
        },
        {
            id: "TC-015",
            title: "Logout - Already Used Token",
            description: "Verify logout with already invalidated token",
            endpoint: "/auth/logout",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Use same token for logout twice",
                "Check if second logout succeeds",
                "Verify token blacklist is working"
            ],
            expectedResult: "Second logout should fail with 401",
            actualResult: "Second logout succeeded, token not properly blacklisted",
            requestBody: '{}',
            responseBody: '{"success":true,"message":"Successfully logged out"}',
            bugDetails: {
                severity: "high",
                actualResult: "Token can be used multiple times for logout",
                expectedResult: "Token should be blacklisted after first use",
                rootCause: "Missing token blacklisting mechanism",
                fix: "Implement token blacklist in Redis or database"
            }
        },

        // ======================
        // GET CURRENT USER TESTS
        // ======================
        {
            id: "TC-016",
            title: "Get Current User - Valid Token",
            description: "Verify user profile retrieval with valid token",
            endpoint: "/auth/me",
            method: "GET",
            category: "read",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send GET request to /auth/me",
                "Include valid Authorization header",
                "Verify response status is 200 OK",
                "Verify user data is returned"
            ],
            expectedResult: "User profile returned successfully",
            actualResult: "User profile returned successfully",
            requestBody: "N/A",
            responseBody: '{"id":1,"email":"admin@example.com","role":"admin","created_at":"2024-01-01"}',
            bugDetails: null
        },
        {
            id: "TC-017",
            title: "Get Current User - Missing Token",
            description: "Verify endpoint fails without token",
            endpoint: "/auth/me",
            method: "GET",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send GET request without Authorization header",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: "N/A",
            responseBody: '{"error":"Unauthorized","status":401}',
            bugDetails: null
        },
        {
            id: "TC-018",
            title: "Get Current User - Invalid Token",
            description: "Verify endpoint fails with invalid token",
            endpoint: "/auth/me",
            method: "GET",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send GET request with invalid token",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: "N/A",
            responseBody: '{"error":"Invalid token","status":401}',
            bugDetails: null
        },
        {
            id: "TC-019",
            title: "Get Current User - Expired Token",
            description: "Verify endpoint fails with expired token",
            endpoint: "/auth/me",
            method: "GET",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send GET request with expired token",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 401 Unauthorized",
            actualResult: "API returned 401 as expected",
            requestBody: "N/A",
            responseBody: '{"error":"Token expired","status":401}',
            bugDetails: null
        },
        {
            id: "TC-020",
            title: "Get Current User - SQL Injection in Token",
            description: "Test SQL injection via token header",
            endpoint: "/auth/me",
            method: "GET",
            category: "security",
            status: "failed",
            severity: "critical",
            priority: "P0",
            steps: [
                "Send GET request with SQL injection in token",
                "Check if database error is exposed",
                "Verify proper error handling"
            ],
            expectedResult: "API should reject request with 401",
            actualResult: "SQL query executed, database error exposed",
            requestBody: "N/A",
            responseBody: '{"error":"SQL syntax error near \'SELECT\'","status":500}',
            bugDetails: {
                severity: "critical",
                actualResult: "SQL injection possible via token validation",
                expectedResult: "Token should be properly validated without SQL execution",
                rootCause: "Raw SQL queries in token validation",
                fix: "Use parameterized queries and JWT library for token validation"
            }
        },
        {
            id: "TC-021",
            title: "Get Current User - XSS in Response",
            description: "Test for XSS in user data response",
            endpoint: "/auth/me",
            method: "GET",
            category: "security",
            status: "passed",
            severity: "high",
            priority: "P1",
            steps: [
                "Modify user data to include XSS payload",
                "Retrieve user profile",
                "Check if payload executes"
            ],
            expectedResult: "XSS payload should be sanitized",
            actualResult: "XSS payload properly escaped in response",
            requestBody: "N/A",
            responseBody: '{"id":1,"email":"admin&lt;script&gt;alert(1)&lt;/script&gt;@example.com","role":"admin"}',
            bugDetails: null
        },
        {
            id: "TC-022",
            title: "Get Current User - Information Disclosure",
            description: "Check for sensitive data exposure",
            endpoint: "/auth/me",
            method: "GET",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Retrieve user profile",
                "Check for sensitive fields in response",
                "Verify only necessary data is exposed"
            ],
            expectedResult: "Only safe fields should be exposed",
            actualResult: "Password hash and security questions exposed",
            requestBody: "N/A",
            responseBody: '{"id":1,"email":"admin@example.com","password_hash":"$2y$10$...","security_question":"Mother maiden name","security_answer":"Smith"}',
            bugDetails: {
                severity: "high",
                actualResult: "Sensitive data exposed in user profile",
                expectedResult: "Only non-sensitive user data should be exposed",
                rootCause: "Missing response filtering/serialization",
                fix: "Implement proper DTOs or serializers to filter sensitive fields"
            }
        },
        {
            id: "TC-023",
            title: "Get Current User - Rate Limiting",
            description: "Verify rate limiting on profile endpoint",
            endpoint: "/auth/me",
            method: "GET",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send 100 rapid requests to profile endpoint",
                "Check if rate limiting triggers",
                "Verify appropriate error response"
            ],
            expectedResult: "API should limit requests after threshold",
            actualResult: "No rate limiting observed",
            requestBody: "N/A",
            responseBody: '{"id":1,"email":"admin@example.com","role":"admin"}',
            bugDetails: {
                severity: "medium",
                actualResult: "No rate limiting on authenticated endpoints",
                expectedResult: "Implement rate limiting to prevent abuse",
                rootCause: "Missing rate limiting for authenticated routes",
                fix: "Add rate limiting middleware for all authenticated endpoints"
            }
        },
        {
            id: "TC-024",
            title: "Get Current User - Method Not Allowed",
            description: "Test POST method on GET endpoint",
            endpoint: "/auth/me",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send POST request to /auth/me",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 405 Method Not Allowed",
            actualResult: "API returned 405 as expected",
            requestBody: '{}',
            responseBody: '{"error":"Method not allowed","status":405}',
            bugDetails: null
        },
        {
            id: "TC-025",
            title: "Get Current User - PUT Method",
            description: "Test PUT method on GET endpoint",
            endpoint: "/auth/me",
            method: "PUT",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send PUT request to /auth/me",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should return 405 Method Not Allowed",
            actualResult: "API returned 405 as expected",
            requestBody: '{}',
            responseBody: '{"error":"Method not allowed","status":405}',
            bugDetails: null
        },

        // ======================
        // ADDITIONAL SECURITY TESTS
        // ======================
        {
            id: "TC-026",
            title: "Login - Password Policy Bypass",
            description: "Attempt to bypass password complexity",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send login with simple password",
                "Check if authentication succeeds",
                "Verify password policy enforcement"
            ],
            expectedResult: "Login should fail for weak passwords",
            actualResult: "Login failed as expected",
            requestBody: '{"email":"admin@example.com","password":"123"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: null
        },
        {
            id: "TC-027",
            title: "Login - Account Lockout Bypass",
            description: "Test account lockout mechanism bypass",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Make 10 failed login attempts",
                "Try login with correct credentials",
                "Check if account is locked"
            ],
            expectedResult: "Account should be locked after multiple attempts",
            actualResult: "Account not locked, login succeeded",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "high",
                actualResult: "No account lockout mechanism",
                expectedResult: "Account should lock after 5 failed attempts",
                rootCause: "Missing failed attempt tracking",
                fix: "Implement account lockout with exponential backoff"
            }
        },
        {
            id: "TC-028",
            title: "Token Hijacking - Replay Attack",
            description: "Test token replay attack protection",
            endpoint: "/auth/me",
            method: "GET",
            category: "security",
            status: "failed",
            severity: "critical",
            priority: "P0",
            steps: [
                "Capture valid token",
                "Reuse token after logout",
                "Check if token still works"
            ],
            expectedResult: "Token should be invalid after logout",
            actualResult: "Token still valid after logout",
            requestBody: "N/A",
            responseBody: '{"id":1,"email":"admin@example.com","role":"admin"}',
            bugDetails: {
                severity: "critical",
                actualResult: "Tokens can be replayed after logout",
                expectedResult: "Tokens should be invalidated immediately after logout",
                rootCause: "Missing token invalidation on server side",
                fix: "Implement token blacklisting with Redis"
            }
        },
        {
            id: "TC-029",
            title: "Session Fixation",
            description: "Test for session fixation vulnerability",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "high",
            priority: "P1",
            steps: [
                "Set session token before login",
                "Perform login",
                "Check if session token changes"
            ],
            expectedResult: "Session token should change after login",
            actualResult: "New token issued after login",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"new_token_here"}',
            bugDetails: null
        },
        {
            id: "TC-030",
            title: "Cross-Site Request Forgery",
            description: "Test CSRF protection",
            endpoint: "/auth/logout",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Send logout request without CSRF token",
                "Check if request succeeds",
                "Verify CSRF protection"
            ],
            expectedResult: "Request should fail without CSRF token",
            actualResult: "Logout succeeded without CSRF token",
            requestBody: '{}',
            responseBody: '{"success":true,"message":"Successfully logged out"}',
            bugDetails: {
                severity: "high",
                actualResult: "No CSRF protection on state-changing endpoints",
                expectedResult: "CSRF tokens required for POST/PUT/DELETE requests",
                rootCause: "Missing CSRF middleware",
                fix: "Implement CSRF protection with tokens or same-site cookies"
            }
        },

        // ======================
        // PERFORMANCE TESTS
        // ======================
        {
            id: "TC-031",
            title: "Login - Response Time Under Load",
            description: "Measure response time with concurrent users",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send 100 concurrent login requests",
                "Measure average response time",
                "Check for timeouts or errors"
            ],
            expectedResult: "Average response time < 2 seconds",
            actualResult: "Average response time: 1.5 seconds",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-032",
            title: "Get Current User - Response Time",
            description: "Measure profile retrieval response time",
            endpoint: "/auth/me",
            method: "GET",
            category: "performance",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send 50 concurrent profile requests",
                "Measure average response time",
                "Check for consistency"
            ],
            expectedResult: "Average response time < 500ms",
            actualResult: "Average response time: 300ms",
            requestBody: "N/A",
            responseBody: '{"id":1,"email":"admin@example.com","role":"admin"}',
            bugDetails: null
        },
        {
            id: "TC-033",
            title: "Login - Memory Usage",
            description: "Monitor memory usage during login",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Monitor memory before/after 1000 logins",
                "Check for memory leaks",
                "Verify stable memory usage"
            ],
            expectedResult: "Memory usage should remain stable",
            actualResult: "Memory usage stable at 256MB ± 5%",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-034",
            title: "Login - CPU Usage Under Load",
            description: "Monitor CPU usage during peak load",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send 500 concurrent login requests",
                "Monitor CPU usage",
                "Check for degradation"
            ],
            expectedResult: "CPU usage < 80% under load",
            actualResult: "CPU spiked to 95%, causing timeouts",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"error":"Gateway timeout","status":504}',
            bugDetails: {
                severity: "medium",
                actualResult: "High CPU usage under load causes timeouts",
                expectedResult: "Efficient algorithm and horizontal scaling needed",
                rootCause: "Inefficient password hashing algorithm",
                fix: "Optimize bcrypt work factor or implement caching"
            }
        },
        {
            id: "TC-035",
            title: "Database Connection Pool",
            description: "Test database connection handling",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Exceed database connection pool limit",
                "Check for connection errors",
                "Verify graceful handling"
            ],
            expectedResult: "Graceful degradation or queuing",
            actualResult: "Connection timeout errors returned",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"error":"Database connection failed","status":503}',
            bugDetails: {
                severity: "high",
                actualResult: "No connection pool management leads to timeouts",
                expectedResult: "Connection pooling with proper limits",
                rootCause: "Missing connection pool configuration",
                fix: "Implement proper connection pooling with limits and timeouts"
            }
        },

        // ======================
        // VALIDATION TESTS
        // ======================
        {
            id: "TC-036",
            title: "Login - Email Format Validation",
            description: "Test various email formats",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send login with invalid email format",
                "Check response status",
                "Verify validation error"
            ],
            expectedResult: "API should reject invalid email format",
            actualResult: "API returned 400 for invalid email",
            requestBody: '{"email":"invalid-email","password":"Test123"}',
            responseBody: '{"error":"Invalid email format","status":400}',
            bugDetails: null
        },
        {
            id: "TC-037",
            title: "Login - Email Length Validation",
            description: "Test email length limits",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send login with very long email",
                "Check response status",
                "Verify length validation"
            ],
            expectedResult: "API should enforce email length limits",
            actualResult: "API returned 400 for overly long email",
            requestBody: '{"email":"a".repeat(300)+"@example.com","password":"Test123"}',
            responseBody: '{"error":"Email too long","status":400}',
            bugDetails: null
        },
        {
            id: "TC-038",
            title: "Login - Password Length Validation",
            description: "Test password length limits",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send login with very long password",
                "Check response status",
                "Verify length validation"
            ],
            expectedResult: "API should enforce password length limits",
            actualResult: "API returned 400 for overly long password",
            requestBody: '{"email":"test@example.com","password":"a".repeat(1000)}',
            responseBody: '{"error":"Password too long","status":400}',
            bugDetails: null
        },
        {
            id: "TC-039",
            title: "Login - Unicode Email Validation",
            description: "Test unicode/international email handling",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send login with international email",
                "Check if validation handles unicode",
                "Verify proper normalization"
            ],
            expectedResult: "API should handle international email addresses",
            actualResult: "API rejected valid international email",
            requestBody: '{"email":"用户@例子.中国","password":"Test123"}',
            responseBody: '{"error":"Invalid email format","status":400}',
            bugDetails: {
                severity: "medium",
                actualResult: "Unicode email addresses rejected",
                expectedResult: "Support international email addresses",
                rootCause: "Basic email regex doesn't support unicode",
                fix: "Update email validation to support unicode characters"
            }
        },
        {
            id: "TC-040",
            title: "Login - Whitespace Handling",
            description: "Test whitespace trimming in credentials",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send login with leading/trailing spaces",
                "Check if spaces are trimmed",
                "Verify authentication result"
            ],
            expectedResult: "Whitespace should be trimmed",
            actualResult: "Whitespace properly trimmed",
            requestBody: '{"email":"  admin@example.com  ","password":"  Admin@123  "}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },

        // ======================
        // BUSINESS LOGIC TESTS
        // ======================
        {
            id: "TC-041",
            title: "Login - Deactivated Account",
            description: "Test login with deactivated account",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Deactivate test account",
                "Attempt login",
                "Verify appropriate error"
            ],
            expectedResult: "Login should fail for deactivated accounts",
            actualResult: "Login failed with account deactivated message",
            requestBody: '{"email":"deactivated@example.com","password":"Test123"}',
            responseBody: '{"error":"Account deactivated","status":403}',
            bugDetails: null
        },
        {
            id: "TC-042",
            title: "Login - Suspended Account",
            description: "Test login with suspended account",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Suspend test account",
                "Attempt login",
                "Verify suspension message"
            ],
            expectedResult: "Login should fail for suspended accounts",
            actualResult: "Login failed with account suspended message",
            requestBody: '{"email":"suspended@example.com","password":"Test123"}',
            responseBody: '{"error":"Account suspended","status":403}',
            bugDetails: null
        },
        {
            id: "TC-043",
            title: "Login - Password Change Required",
            description: "Test login when password change required",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Set password change flag for account",
                "Attempt login",
                "Verify special response"
            ],
            expectedResult: "Login should succeed with password change flag",
            actualResult: "Login succeeded with password_change_required flag",
            requestBody: '{"email":"changepw@example.com","password":"OldPassword123"}',
            responseBody: '{"success":true,"token":"eyJ...","password_change_required":true}',
            bugDetails: null
        },
        {
            id: "TC-044",
            title: "Get Current User - Role-Based Data",
            description: "Verify user role affects data returned",
            endpoint: "/auth/me",
            method: "GET",
            category: "read",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Login as regular user",
                "Get profile data",
                "Compare with admin profile"
            ],
            expectedResult: "Different roles should see appropriate data",
            actualResult: "Regular user sees limited data compared to admin",
            requestBody: "N/A",
            responseBody: '{"id":2,"email":"user@example.com","role":"user"}',
            bugDetails: null
        },
        {
            id: "TC-045",
            title: "Logout - All Devices",
            description: "Test logout from all devices",
            endpoint: "/auth/logout",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Login from multiple devices",
                "Call logout all endpoint",
                "Verify all tokens invalidated"
            ],
            expectedResult: "All sessions should be terminated",
            actualResult: "No endpoint to logout all devices",
            requestBody: '{}',
            responseBody: '{"error":"Endpoint not found","status":404}',
            bugDetails: {
                severity: "medium",
                actualResult: "Missing logout all devices functionality",
                expectedResult: "Users should be able to logout from all devices",
                rootCause: "Feature not implemented",
                fix: "Implement endpoint to invalidate all user tokens"
            }
        },

        // ======================
        // ERROR HANDLING TESTS
        // ======================
        {
            id: "TC-046",
            title: "Login - Server Error Handling",
            description: "Test error handling during server failure",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Simulate database failure",
                "Attempt login",
                "Verify graceful error response"
            ],
            expectedResult: "API should return 503 Service Unavailable",
            actualResult: "API returned 503 with appropriate message",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"error":"Service temporarily unavailable","status":503}',
            bugDetails: null
        },
        {
            id: "TC-047",
            title: "Get Current User - Database Down",
            description: "Test profile retrieval during DB outage",
            endpoint: "/auth/me",
            method: "GET",
            category: "validation",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Simulate database connection failure",
                "Request user profile",
                "Verify error handling"
            ],
            expectedResult: "API should return 503 Service Unavailable",
            actualResult: "API returned 503 as expected",
            requestBody: "N/A",
            responseBody: '{"error":"Database connection failed","status":503}',
            bugDetails: null
        },
        {
            id: "TC-048",
            title: "Login - Timeout Handling",
            description: "Test login during timeout",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Simulate slow database response",
                "Attempt login",
                "Verify timeout error"
            ],
            expectedResult: "API should return 504 Gateway Timeout",
            actualResult: "API returned 504 after 30 seconds",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"error":"Request timeout","status":504}',
            bugDetails: null
        },
        {
            id: "TC-049",
            title: "Login - Memory Exhaustion",
            description: "Test behavior under memory pressure",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Simulate memory exhaustion",
                "Attempt login",
                "Verify graceful degradation"
            ],
            expectedResult: "API should return 503 with memory error",
            actualResult: "Server crashed with out of memory error",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: 'Internal Server Error',
            bugDetails: {
                severity: "high",
                actualResult: "Server crashes under memory pressure",
                expectedResult: "Graceful degradation and memory limits",
                rootCause: "No memory limit enforcement",
                fix: "Implement memory limits and graceful shutdown"
            }
        },
        {
            id: "TC-050",
            title: "Login - Network Partition",
            description: "Test behavior during network issues",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Simulate network partition",
                "Attempt login",
                "Verify appropriate error"
            ],
            expectedResult: "API should return 502 Bad Gateway",
            actualResult: "API returned 502 as expected",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"error":"Bad gateway","status":502}',
            bugDetails: null
        },

        // ======================
        // INTEGRATION TESTS
        // ======================
        {
            id: "TC-051",
            title: "End-to-End Authentication Flow",
            description: "Complete login → profile → logout flow",
            endpoint: "Multiple",
            method: "Multiple",
            category: "authentication",
            status: "passed",
            severity: "high",
            priority: "P1",
            steps: [
                "Login with valid credentials",
                "Retrieve user profile with token",
                "Logout using same token",
                "Verify token invalidated"
            ],
            expectedResult: "Complete flow should work seamlessly",
            actualResult: "Flow completed successfully",
            requestBody: "N/A",
            responseBody: "Multiple responses",
            bugDetails: null
        },
        {
            id: "TC-052",
            title: "Token Refresh Flow",
            description: "Test token refresh mechanism",
            endpoint: "/auth/refresh",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Attempt to refresh expired token",
                "Check if new token issued",
                "Verify old token invalidated"
            ],
            expectedResult: "Token should be refreshable",
            actualResult: "Refresh endpoint not implemented",
            requestBody: '{"refresh_token":"old_token"}',
            responseBody: '{"error":"Endpoint not found","status":404}',
            bugDetails: {
                severity: "medium",
                actualResult: "No token refresh mechanism",
                expectedResult: "Implement token refresh for better UX",
                rootCause: "Feature not implemented",
                fix: "Add refresh token endpoint and rotation"
            }
        },
        {
            id: "TC-053",
            title: "Concurrent Session Management",
            description: "Test multiple simultaneous sessions",
            endpoint: "Multiple",
            method: "Multiple",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Create multiple sessions for same user",
                "Use each session independently",
                "Verify no interference"
            ],
            expectedResult: "Multiple sessions should work independently",
            actualResult: "Sessions work independently as expected",
            requestBody: "N/A",
            responseBody: "Multiple responses",
            bugDetails: null
        },
        {
            id: "TC-054",
            title: "Session Expiry",
            description: "Test automatic session expiration",
            endpoint: "/auth/me",
            method: "GET",
            category: "authentication",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Wait for token to expire",
                "Attempt to use expired token",
                "Verify token rejected"
            ],
            expectedResult: "Expired tokens should be rejected",
            actualResult: "Expired token properly rejected",
            requestBody: "N/A",
            responseBody: '{"error":"Token expired","status":401}',
            bugDetails: null
        },
        {
            id: "TC-055",
            title: "Password Reset Integration",
            description: "Test password reset flow integration",
            endpoint: "/auth/reset-password",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Request password reset",
                "Use reset token to set new password",
                "Login with new password"
            ],
            expectedResult: "Password reset should work end-to-end",
            actualResult: "Password reset endpoint not found",
            requestBody: '{"email":"admin@example.com"}',
            responseBody: '{"error":"Endpoint not found","status":404}',
            bugDetails: {
                severity: "high",
                actualResult: "Missing password reset functionality",
                expectedResult: "Users should be able to reset passwords",
                rootCause: "Feature not implemented",
                fix: "Implement password reset with email verification"
            }
        },

        // ======================
        // ADDITIONAL 45 TEST CASES
        // ======================
        {
            id: "TC-056",
            title: "Login - Case Sensitivity",
            description: "Test email case sensitivity",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Login with uppercase email",
                "Check if case insensitive",
                "Verify authentication result"
            ],
            expectedResult: "Email should be case insensitive",
            actualResult: "Email treated as case insensitive",
            requestBody: '{"email":"ADMIN@EXAMPLE.COM","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-057",
            title: "Login - Password Case Sensitivity",
            description: "Test password case sensitivity",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Login with wrong password case",
                "Check authentication result",
                "Verify case sensitivity"
            ],
            expectedResult: "Password should be case sensitive",
            actualResult: "Password case sensitive as expected",
            requestBody: '{"email":"admin@example.com","password":"ADMIN@123"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: null
        },
        {
            id: "TC-058",
            title: "Get Current User - CORS Headers",
            description: "Verify CORS headers are present",
            endpoint: "/auth/me",
            method: "GET",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send OPTIONS request",
                "Check CORS headers in response",
                "Verify allowed origins"
            ],
            expectedResult: "Proper CORS headers should be present",
            actualResult: "CORS headers present and correctly configured",
            requestBody: "N/A",
            responseBody: "Headers only",
            bugDetails: null
        },
        {
            id: "TC-059",
            title: "Login - Content-Type Validation",
            description: "Test wrong Content-Type header",
            endpoint: "/auth/login",
            method: "POST",
            category: "validation",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send login with text/plain Content-Type",
                "Check response status",
                "Verify error message"
            ],
            expectedResult: "API should require application/json",
            actualResult: "API returned 415 Unsupported Media Type",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"error":"Unsupported media type","status":415}',
            bugDetails: null
        },
        {
            id: "TC-060",
            title: "Login - HTTP/2 Support",
            description: "Test HTTP/2 protocol support",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send request using HTTP/2",
                "Verify protocol negotiation",
                "Check for HTTP/2 features"
            ],
            expectedResult: "API should support HTTP/2",
            actualResult: "HTTP/2 supported and working",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-061",
            title: "Login - HTTP/1.1 Fallback",
            description: "Test HTTP/1.1 compatibility",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Force HTTP/1.1 connection",
                "Verify API works correctly",
                "Check response headers"
            ],
            expectedResult: "API should work with HTTP/1.1",
            actualResult: "API works correctly with HTTP/1.1",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-062",
            title: "Login - Keep-Alive Headers",
            description: "Test connection persistence",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send multiple requests on same connection",
                "Check Keep-Alive headers",
                "Verify connection reuse"
            ],
            expectedResult: "Connections should be reused",
            actualResult: "Connection keep-alive working",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-063",
            title: "Login - Compression",
            description: "Test response compression",
            endpoint: "/auth/login",
            method: "POST",
            category: "performance",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Send request with Accept-Encoding: gzip",
                "Check response encoding",
                "Verify compressed response"
            ],
            expectedResult: "Responses should be compressed",
            actualResult: "Response properly gzipped",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-064",
            title: "Login - Cache Control Headers",
            description: "Verify cache headers are set correctly",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Check Cache-Control headers in response",
                "Verify no-cache settings",
                "Test caching behavior"
            ],
            expectedResult: "Authentication responses should not be cached",
            actualResult: "Cache-Control: no-store, no-cache present",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-065",
            title: "Login - Security Headers",
            description: "Verify security headers are present",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Check response for security headers",
                "Verify HSTS, X-Frame-Options, etc.",
                "Test header effectiveness"
            ],
            expectedResult: "Security headers should be present",
            actualResult: "All security headers present and correct",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-066",
            title: "Login - Request Size Limit",
            description: "Test request size limits",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Send very large request body",
                "Check if size limit enforced",
                "Verify appropriate error"
            ],
            expectedResult: "Request size should be limited",
            actualResult: "Request size limit enforced at 1MB",
            requestBody: '{"email":"test@example.com","password":"' + 'a'.repeat(1000000) + '"}',
            responseBody: '{"error":"Request entity too large","status":413}',
            bugDetails: null
        },
        {
            id: "TC-067",
            title: "Login - Header Injection",
            description: "Test for HTTP header injection",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Inject malicious headers in request",
                "Check if headers reflected in response",
                "Verify proper sanitization"
            ],
            expectedResult: "Headers should not be reflected",
            actualResult: "Headers properly sanitized",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-068",
            title: "Login - Response Splitting",
            description: "Test for HTTP response splitting",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Inject CRLF characters in input",
                "Check if response splitting possible",
                "Verify proper encoding"
            ],
            expectedResult: "CRLF injection should be prevented",
            actualResult: "CRLF characters properly encoded",
            requestBody: '{"email":"test\\r\\nInjection: value@example.com","password":"Test123"}',
            responseBody: '{"error":"Invalid email format","status":400}',
            bugDetails: null
        },
        {
            id: "TC-069",
            title: "Login - Timing Attack",
            description: "Test for timing attack vulnerability",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Measure response time for valid vs invalid users",
                "Check for timing differences",
                "Verify constant time comparison"
            ],
            expectedResult: "Response times should be constant",
            actualResult: "Noticeable timing difference between valid and invalid users",
            requestBody: '{"email":"valid@example.com","password":"wrong"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: {
                severity: "medium",
                actualResult: "Timing attack possible to enumerate users",
                expectedResult: "Constant time string comparison needed",
                rootCause: "Early exit in user lookup logic",
                fix: "Implement constant time comparison for credentials"
            }
        },
        {
            id: "TC-070",
            title: "Login - Clickjacking Protection",
            description: "Test for clickjacking vulnerabilities",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Check X-Frame-Options header",
                "Test frame embedding",
                "Verify clickjacking protection"
            ],
            expectedResult: "Clickjacking should be prevented",
            actualResult: "X-Frame-Options: DENY present",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-071",
            title: "Login - MIME Type Sniffing",
            description: "Test MIME type sniffing protection",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Check X-Content-Type-Options header",
                "Test MIME sniffing",
                "Verify protection"
            ],
            expectedResult: "MIME sniffing should be disabled",
            actualResult: "X-Content-Type-Options: nosniff present",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-072",
            title: "Login - Referrer Policy",
            description: "Verify referrer policy settings",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Check Referrer-Policy header",
                "Test referrer leakage",
                "Verify policy enforcement"
            ],
            expectedResult: "Referrer policy should be strict",
            actualResult: "Referrer-Policy: strict-origin-when-cross-origin",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-073",
            title: "Login - Feature Policy",
            description: "Check feature policy headers",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Check Feature-Policy headers",
                "Verify restrictive policies",
                "Test policy enforcement"
            ],
            expectedResult: "Restrictive feature policies should be set",
            actualResult: "Feature-Policy properly configured",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-074",
            title: "Login - Permissions Policy",
            description: "Check permissions policy headers",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Check Permissions-Policy headers",
                "Verify restrictive permissions",
                "Test policy effectiveness"
            ],
            expectedResult: "Restrictive permissions should be set",
            actualResult: "Permissions-Policy properly configured",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-075",
            title: "Login - Content Security Policy",
            description: "Verify CSP headers",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Check Content-Security-Policy header",
                "Test CSP violations",
                "Verify policy enforcement"
            ],
            expectedResult: "Strong CSP should be present",
            actualResult: "Strong CSP present and working",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-076",
            title: "Login - Subresource Integrity",
            description: "Test for SRI if applicable",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "skipped",
            severity: "low",
            priority: "P3",
            steps: [
                "Check for script/link tags if HTML response",
                "Verify SRI attributes",
                "Test integrity validation"
            ],
            expectedResult: "SRI should be implemented for scripts",
            actualResult: "JSON API, SRI not applicable",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-077",
            title: "Login - TLS/SSL Configuration",
            description: "Test TLS configuration",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "high",
            priority: "P1",
            steps: [
                "Test TLS version support",
                "Check cipher strength",
                "Verify certificate validity"
            ],
            expectedResult: "Strong TLS configuration required",
            actualResult: "TLS 1.2/1.3 with strong ciphers",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-078",
            title: "Login - HSTS Preload",
            description: "Check HSTS preload readiness",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Check HSTS header includes preload",
                "Verify max-age sufficient",
                "Test includeSubDomains"
            ],
            expectedResult: "HSTS should be preload ready",
            actualResult: "HSTS properly configured for preload",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-079",
            title: "Login - HPKP (Deprecated)",
            description: "Test HTTP Public Key Pinning",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "skipped",
            severity: "low",
            priority: "P3",
            steps: [
                "Check for HPKP headers",
                "Verify deprecated status",
                "Test alternative mechanisms"
            ],
            expectedResult: "HPKP should not be used (deprecated)",
            actualResult: "HPKP not present (correct)",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-080",
            title: "Login - Expect-CT Header",
            description: "Check Expect-CT header",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "low",
            priority: "P3",
            steps: [
                "Check for Expect-CT header",
                "Verify configuration",
                "Test CT compliance"
            ],
            expectedResult: "Expect-CT header should be present",
            actualResult: "Expect-CT header present and correct",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-081",
            title: "Login - DNS Configuration",
            description: "Test DNS security features",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Check DNSSEC configuration",
                "Test DNS CAA records",
                "Verify DNS security"
            ],
            expectedResult: "DNS should be securely configured",
            actualResult: "DNSSEC and CAA records properly configured",
            requestBody: '{"email":"test@example.com","password":"Test123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-082",
            title: "Login - Email Enumeration",
            description: "Test for email enumeration vulnerability",
            endpoint: "/auth/login",
            method: "POST",
            status: "failed",
            severity: "medium",
            priority: "P2",
            category: "security",
            steps: [
                "Attempt login with non-existent email",
                "Attempt login with existent email but wrong password",
                "Compare error messages"
            ],
            expectedResult: "Error messages should be identical",
            actualResult: "Different error messages reveal valid emails",
            requestBody: '{"email":"nonexistent@example.com","password":"Test123"}',
            responseBody: '{"error":"User not found","status":401}',
            bugDetails: {
                severity: "medium",
                actualResult: "Email enumeration possible via error messages",
                expectedResult: "Generic error messages for all failed logins",
                rootCause: "Different error messages for different failure reasons",
                fix: "Use same generic error message for all authentication failures"
            }
        },
        {
            id: "TC-083",
            title: "Login - Account Lockout Notification",
            description: "Test account lockout notifications",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Trigger account lockout",
                "Check if notification sent",
                "Verify lockout state communicated"
            ],
            expectedResult: "Users should be notified of lockout",
            actualResult: "No notification sent on lockout",
            requestBody: '{"email":"admin@example.com","password":"WrongPassword"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: {
                severity: "medium",
                actualResult: "No lockout notifications to users",
                expectedResult: "Users should be notified when account is locked",
                rootCause: "Missing notification system integration",
                fix: "Implement email/SMS notifications for security events"
            }
        },
        {
            id: "TC-084",
            title: "Login - Password Spray Protection",
            description: "Test protection against password spraying",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Attempt common passwords across multiple accounts",
                "Check if detection triggers",
                "Verify protective measures"
            ],
            expectedResult: "Password spraying should be detected and blocked",
            actualResult: "Password spraying not detected",
            requestBody: '{"email":"user1@example.com","password":"Password123"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: {
                severity: "high",
                actualResult: "No password spraying detection",
                expectedResult: "Implement detection for password spraying attacks",
                rootCause: "Missing attack detection logic",
                fix: "Add rate limiting per IP and detection for common passwords"
            }
        },
        {
            id: "TC-085",
            title: "Login - Credential Stuffing",
            description: "Test credential stuffing protection",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Test with known breached credentials",
                "Check if breach detection works",
                "Verify forced password reset"
            ],
            expectedResult: "Breached credentials should be detected",
            actualResult: "No breached credential detection",
            requestBody: '{"email":"admin@example.com","password":"Password123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "high",
                actualResult: "No breached credential checking",
                expectedResult: "Check passwords against known breaches",
                rootCause: "Missing integration with breach databases",
                fix: "Implement HaveIBeenPwned API integration"
            }
        },
        {
            id: "TC-086",
            title: "Login - Session Length Control",
            description: "Test configurable session lengths",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Check session expiration configuration",
                "Test different session lengths",
                "Verify session timeout works"
            ],
            expectedResult: "Session length should be configurable",
            actualResult: "Fixed session length, not configurable",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ...","expires_in":3600}',
            bugDetails: {
                severity: "medium",
                actualResult: "Session length not configurable per user/role",
                expectedResult: "Configurable session lengths based on security needs",
                rootCause: "Hardcoded token expiration",
                fix: "Make token expiration configurable based on user context"
            }
        },
        {
            id: "TC-087",
            title: "Login - Device Fingerprinting",
            description: "Test device fingerprinting for security",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Login from different devices",
                "Check device tracking",
                "Verify anomaly detection"
            ],
            expectedResult: "Device fingerprinting should enhance security",
            actualResult: "No device fingerprinting implemented",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "No device tracking or fingerprinting",
                expectedResult: "Track devices for suspicious activity detection",
                rootCause: "Missing device information collection",
                fix: "Collect device info and implement anomaly detection"
            }
        },
        {
            id: "TC-088",
            title: "Login - Geolocation Checking",
            description: "Test geolocation-based security",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Login from unexpected location",
                "Check if geolocation triggers alerts",
                "Verify location-based rules"
            ],
            expectedResult: "Unexpected locations should trigger alerts",
            actualResult: "No geolocation checking implemented",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "No geolocation-based security checks",
                expectedResult: "Implement geolocation checking for suspicious logins",
                rootCause: "Missing IP geolocation integration",
                fix: "Add IP geolocation and suspicious location detection"
            }
        },
        {
            id: "TC-089",
            title: "Login - Time-Based Restrictions",
            description: "Test time-based access controls",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "low",
            priority: "P3",
            steps: [
                "Attempt login outside business hours",
                "Check if time restrictions apply",
                "Verify time-based rules"
            ],
            expectedResult: "Time-based restrictions should be configurable",
            actualResult: "No time-based access controls",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "low",
                actualResult: "No time-based access restrictions",
                expectedResult: "Optional time-based restrictions for sensitive accounts",
                rootCause: "Missing time-based policy engine",
                fix: "Implement time-based access control policies"
            }
        },
        {
            id: "TC-090",
            title: "Login - Concurrent Login Prevention",
            description: "Test prevention of concurrent logins",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Login from multiple locations simultaneously",
                "Check if concurrent sessions allowed",
                "Verify session management"
            ],
            expectedResult: "Concurrent logins should be controlled",
            actualResult: "Unlimited concurrent sessions allowed",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "No control over concurrent sessions",
                expectedResult: "Limit concurrent sessions per account",
                rootCause: "Missing session counting mechanism",
                fix: "Implement concurrent session limits and management"
            }
        },
        {
            id: "TC-091",
            title: "Login - Audit Logging",
            description: "Test comprehensive audit logging",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Perform successful and failed logins",
                "Check audit logs",
                "Verify log completeness"
            ],
            expectedResult: "All authentication events should be logged",
            actualResult: "Comprehensive audit logging implemented",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-092",
            title: "Login - Log Injection Prevention",
            description: "Test log injection vulnerabilities",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "passed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Attempt log injection via credentials",
                "Check log files",
                "Verify proper sanitization"
            ],
            expectedResult: "Logs should be sanitized against injection",
            actualResult: "Logs properly sanitized",
            requestBody: '{"email":"admin@example.com","password":"test\\r\\n[ERROR]"}',
            responseBody: '{"error":"Invalid credentials","status":401}',
            bugDetails: null
        },
        {
            id: "TC-093",
            title: "Login - Password Expiry",
            description: "Test password expiry functionality",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Use expired password",
                "Check if forced password change",
                "Verify expiry enforcement"
            ],
            expectedResult: "Expired passwords should force change",
            actualResult: "No password expiry mechanism",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "No password expiration policy",
                expectedResult: "Implement password expiration for sensitive accounts",
                rootCause: "Missing password age tracking",
                fix: "Add password age tracking and expiry enforcement"
            }
        },
        {
            id: "TC-094",
            title: "Login - Password History",
            description: "Test password history enforcement",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Try to reuse old password",
                "Check if prevented by history",
                "Verify history depth"
            ],
            expectedResult: "Password reuse should be prevented",
            actualResult: "No password history checking",
            requestBody: '{"email":"admin@example.com","password":"OldPassword123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "Users can reuse old passwords",
                expectedResult: "Prevent password reuse from history",
                rootCause: "Missing password history storage",
                fix: "Store password hashes in history and check against them"
            }
        },
        {
            id: "TC-095",
            title: "Login - Two-Factor Authentication",
            description: "Test 2FA implementation",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "failed",
            severity: "high",
            priority: "P1",
            steps: [
                "Enable 2FA for account",
                "Attempt login without 2FA",
                "Verify 2FA enforcement"
            ],
            expectedResult: "2FA should be required when enabled",
            actualResult: "No 2FA support implemented",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "high",
                actualResult: "Missing two-factor authentication",
                expectedResult: "Implement 2FA for enhanced security",
                rootCause: "Feature not implemented",
                fix: "Add TOTP-based 2FA with backup codes"
            }
        },
        {
            id: "TC-096",
            title: "Login - Backup Code Management",
            description: "Test backup code functionality",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "skipped",
            severity: "medium",
            priority: "P2",
            steps: [
                "Test backup code usage",
                "Check backup code regeneration",
                "Verify secure storage"
            ],
            expectedResult: "Backup codes should work when 2FA enabled",
            actualResult: "2FA not implemented, test skipped",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-097",
            title: "Login - Recovery Code Usage",
            description: "Test account recovery codes",
            endpoint: "/auth/login",
            method: "POST",
            category: "security",
            status: "skipped",
            severity: "medium",
            priority: "P2",
            steps: [
                "Test recovery code flow",
                "Check code expiration",
                "Verify one-time use"
            ],
            expectedResult: "Recovery codes should work securely",
            actualResult: "Recovery system not implemented, test skipped",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: null
        },
        {
            id: "TC-098",
            title: "Login - Social Login Integration",
            description: "Test social login options",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "low",
            priority: "P3",
            steps: [
                "Test Google OAuth integration",
                "Test Facebook login",
                "Verify social login security"
            ],
            expectedResult: "Social login should be available",
            actualResult: "No social login integration",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "low",
                actualResult: "Missing social login options",
                expectedResult: "Add social login for user convenience",
                rootCause: "Feature not implemented",
                fix: "Implement OAuth2 integrations with major providers"
            }
        },
        {
            id: "TC-099",
            title: "Login - Single Sign-On",
            description: "Test SSO integration",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Test SAML integration",
                "Test OIDC integration",
                "Verify SSO security"
            ],
            expectedResult: "SSO should be supported",
            actualResult: "No SSO integration available",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "Missing enterprise SSO support",
                expectedResult: "Add SAML/OIDC for enterprise integration",
                rootCause: "Feature not implemented",
                fix: "Implement SAML 2.0 and OpenID Connect support"
            }
        },
        {
            id: "TC-100",
            title: "Login - Passwordless Authentication",
            description: "Test passwordless login options",
            endpoint: "/auth/login",
            method: "POST",
            category: "authentication",
            status: "failed",
            severity: "medium",
            priority: "P2",
            steps: [
                "Test magic link authentication",
                "Test biometric authentication",
                "Verify passwordless security"
            ],
            expectedResult: "Passwordless options should be available",
            actualResult: "No passwordless authentication",
            requestBody: '{"email":"admin@example.com","password":"Admin@123"}',
            responseBody: '{"success":true,"token":"eyJ..."}',
            bugDetails: {
                severity: "medium",
                actualResult: "Missing passwordless authentication options",
                expectedResult: "Add passwordless authentication methods",
                rootCause: "Feature not implemented",
                fix: "Implement magic links and WebAuthn support"
            }
        }
    ]
};

// Dashboard integration hint
console.log("report-data.js loaded successfully");
console.log(`API: ${window.REPORT_DATA.meta.apiName}`);
console.log(`Test Cases: ${window.REPORT_DATA.testCases.length}`);