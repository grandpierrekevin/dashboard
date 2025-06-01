import { SonarData } from "@/types/sonarqube";

export const mockSonarData: SonarData[] = [
  {
    id: 1,
    name: "frontend-app",
    description: "Application frontend principale",
    lastAnalysis: "2024-03-20T10:00:00Z",
    qualityGate: {
      status: "passed",
      conditions: [
        {
          metric: "coverage",
          status: "passed",
          value: 85,
          threshold: 80
        },
        {
          metric: "bugs",
          status: "passed",
          value: 0,
          threshold: 5
        },
        {
          metric: "vulnerabilities",
          status: "passed",
          value: 0,
          threshold: 2
        },
        {
          metric: "code_smells",
          status: "passed",
          value: 12,
          threshold: 20
        }
      ]
    },
    metrics: {
      coverage: 85,
      bugs: 0,
      vulnerabilities: 0,
      codeSmells: 12,
      duplications: 2.5,
      lines: 15000,
      ncloc: 12000
    },
    issues: [
      {
        id: "AX-123",
        type: "code_smell",
        severity: "minor",
        component: "src/components/Notifications.tsx",
        line: 45,
        message: "Avoid using console.log statements",
        author: "John Doe",
        creationDate: "2024-03-19T15:00:00Z",
        status: "open",
        resolution: null,
        details: {
          rule: {
            key: "no-console",
            name: "No console statements",
            description: "Console statements should not be used in production code"
          },
          effort: "5min",
          tags: ["bad-practice"]
        }
      },
      {
        id: "AX-124",
        type: "bug",
        severity: "major",
        component: "src/hooks/useAuth.ts",
        line: 78,
        message: "Potential null pointer dereference",
        author: "Jane Smith",
        creationDate: "2024-03-18T10:00:00Z",
        status: "open",
        resolution: null,
        details: {
          rule: {
            key: "null-dereference",
            name: "Null pointer dereference",
            description: "Check for null before dereferencing"
          },
          effort: "15min",
          tags: ["bug", "security"]
        }
      },
      {
        id: "AX-125",
        type: "vulnerability",
        severity: "critical",
        component: "src/utils/crypto.ts",
        line: 12,
        message: "Hardcoded cryptographic key",
        author: "Alice",
        creationDate: "2024-03-17T09:00:00Z",
        status: "open",
        resolution: null,
        details: {
          rule: {
            key: "hardcoded-key",
            name: "Hardcoded cryptographic key",
            description: "Do not use hardcoded keys in production"
          },
          effort: "30min",
          tags: ["security"]
        }
      }
    ],
    hotspots: [
      {
        id: "HS-123",
        component: "src/services/api.ts",
        line: 120,
        message: "Make sure using a hard-coded password is safe here",
        author: "John Doe",
        creationDate: "2024-03-19T14:00:00Z",
        status: "to_review",
        resolution: null,
        details: {
          rule: {
            key: "hardcoded-password",
            name: "Hardcoded password",
            description: "Make sure this is not a real password"
          },
          effort: "10min",
          tags: ["security"]
        }
      }
    ],
    stats: {
      totalIssues: 15,
      openIssues: 10,
      resolvedIssues: 5,
      totalHotspots: 2,
      toReviewHotspots: 1,
      reviewedHotspots: 1,
      lastUpdated: "2024-03-20T10:00:00Z"
    },
    activity: []
  },
  {
    id: 2,
    name: "backend-api",
    description: "API backend principale",
    lastAnalysis: "2024-03-22T11:00:00Z",
    qualityGate: {
      status: "failed",
      conditions: [
        { metric: "coverage", status: "failed", value: 62, threshold: 80 },
        { metric: "bugs", status: "passed", value: 1, threshold: 5 },
        { metric: "vulnerabilities", status: "failed", value: 3, threshold: 2 },
        { metric: "code_smells", status: "passed", value: 8, threshold: 20 }
      ]
    },
    metrics: {
      coverage: 62,
      bugs: 1,
      vulnerabilities: 3,
      codeSmells: 8,
      duplications: 5.1,
      lines: 9000,
      ncloc: 7000
    },
    issues: [
      {
        id: "BX-200",
        type: "vulnerability",
        severity: "major",
        component: "src/api/auth.ts",
        line: 34,
        message: "JWT secret exposé dans le code",
        author: "Eve",
        creationDate: "2024-03-21T10:00:00Z",
        status: "open",
        resolution: null,
        details: {
          rule: { key: "jwt-secret", name: "JWT secret exposé", description: "Ne pas exposer de secrets dans le code" },
          effort: "20min",
          tags: ["security"]
        }
      }
    ],
    hotspots: [],
    stats: {
      totalIssues: 7,
      openIssues: 6,
      resolvedIssues: 1,
      totalHotspots: 0,
      toReviewHotspots: 0,
      reviewedHotspots: 0,
      lastUpdated: "2024-03-22T11:00:00Z"
    },
    activity: []
  }
]; 