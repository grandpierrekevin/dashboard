import { JenkinsData } from "@/types/jenkins";

export const mockJenkinsData: JenkinsData[] = [
  {
    id: "build-1",
    name: "Build #1",
    job: "deploy-prod",
    status: "success",
    branch: "main",
    duration: 120,
    date: "2024-05-01T08:00:00Z",
    canRetry: false,
    consoleUrl: "https://jenkins.example.com/build-1"
  },
  {
    id: "build-2",
    name: "Build #2",
    job: "e2e-tests",
    status: "failed",
    branch: "develop",
    duration: 300,
    date: "2024-05-02T09:30:00Z",
    canRetry: true,
    consoleUrl: "https://jenkins.example.com/build-2"
  },
  {
    id: 1,
    name: "build-app",
    description: "Job de build principal de l'application",
    status: "success",
    lastBuild: {
      id: 201,
      number: 101,
      status: "success",
      startedAt: "2024-03-21T09:00:00Z",
      finishedAt: "2024-03-21T09:05:00Z",
      duration: 300,
      stages: [
        { name: "Install", status: "success", duration: 60, logs: "OK" },
        { name: "Build", status: "success", duration: 120, logs: "OK" },
        { name: "Test", status: "success", duration: 90, logs: "OK" },
        { name: "Deploy", status: "success", duration: 30, logs: "OK" }
      ],
      artifacts: [
        { name: "build-app.zip", size: "2MB", type: "application/zip" }
      ],
      changes: [
        { commit: "abc123", author: "Alice", message: "fix: correctif bug" }
      ]
    },
    recentBuilds: [
      {
        id: 201,
        number: 101,
        status: "success",
        startedAt: "2024-03-21T09:00:00Z",
        finishedAt: "2024-03-21T09:05:00Z",
        duration: 300,
        stages: [
          { name: "Install", status: "success", duration: 60 },
          { name: "Build", status: "success", duration: 120 },
          { name: "Test", status: "success", duration: 90 },
          { name: "Deploy", status: "success", duration: 30 }
        ]
      },
      {
        id: 200,
        number: 100,
        status: "failed",
        startedAt: "2024-03-20T10:00:00Z",
        finishedAt: "2024-03-20T10:10:00Z",
        duration: 600,
        stages: [
          { name: "Install", status: "success", duration: 60 },
          { name: "Build", status: "failed", duration: 540, error: "Erreur compilation" }
        ]
      }
    ],
    stats: {
      totalBuilds: 101,
      successRate: 90,
      averageDuration: 320,
      lastUpdated: "2024-03-21T09:05:00Z"
    },
    activity: [
      { job: "build-app", builds: 5, date: "2024-03-21" },
      { job: "build-app", builds: 3, date: "2024-03-20" }
    ]
  },
  {
    id: 2,
    name: "deploy-prod",
    description: "Déploiement en production",
    status: "running",
    lastBuild: {
      id: 301,
      number: 51,
      status: "running",
      startedAt: "2024-03-21T11:00:00Z",
      finishedAt: "",
      duration: 0,
      stages: [
        { name: "Install", status: "success", duration: 30, logs: "OK" },
        { name: "Deploy", status: "running", duration: 0, logs: "En cours" }
      ],
      artifacts: [],
      changes: [
        { commit: "def456", author: "Bob", message: "chore: update version" }
      ]
    },
    recentBuilds: [
      {
        id: 301,
        number: 51,
        status: "running",
        startedAt: "2024-03-21T11:00:00Z",
        finishedAt: "",
        duration: 0,
        stages: [
          { name: "Install", status: "success", duration: 30 },
          { name: "Deploy", status: "running", duration: 0 }
        ]
      },
      {
        id: 300,
        number: 50,
        status: "success",
        startedAt: "2024-03-20T12:00:00Z",
        finishedAt: "2024-03-20T12:07:00Z",
        duration: 420,
        stages: [
          { name: "Install", status: "success", duration: 30 },
          { name: "Deploy", status: "success", duration: 390 }
        ]
      }
    ],
    stats: {
      totalBuilds: 51,
      successRate: 80,
      averageDuration: 350,
      lastUpdated: "2024-03-21T11:00:00Z"
    },
    activity: [
      { job: "deploy-prod", builds: 2, date: "2024-03-21" },
      { job: "deploy-prod", builds: 4, date: "2024-03-20" }
    ]
  },
  {
    id: 3,
    name: "test-unit",
    description: "Tests unitaires du projet",
    status: "success",
    lastBuild: {
      id: 401,
      number: 201,
      status: "success",
      startedAt: "2024-03-22T08:00:00Z",
      finishedAt: "2024-03-22T08:03:00Z",
      duration: 180,
      stages: [
        { name: "Install", status: "success", duration: 30, logs: "OK" },
        { name: "Test", status: "success", duration: 150, logs: "OK" }
      ],
      artifacts: [],
      changes: [
        { commit: "ghi789", author: "Charlie", message: "test: ajout de tests unitaires" }
      ]
    },
    recentBuilds: [
      {
        id: 401,
        number: 201,
        status: "success",
        startedAt: "2024-03-22T08:00:00Z",
        finishedAt: "2024-03-22T08:03:00Z",
        duration: 180,
        stages: [
          { name: "Install", status: "success", duration: 30 },
          { name: "Test", status: "success", duration: 150 }
        ]
      },
      {
        id: 400,
        number: 200,
        status: "failed",
        startedAt: "2024-03-21T08:00:00Z",
        finishedAt: "2024-03-21T08:05:00Z",
        duration: 300,
        stages: [
          { name: "Install", status: "success", duration: 30 },
          { name: "Test", status: "failed", duration: 270, error: "Erreur de test" }
        ]
      }
    ],
    stats: {
      totalBuilds: 201,
      successRate: 95,
      averageDuration: 210,
      lastUpdated: "2024-03-22T08:03:00Z"
    },
    activity: [
      { job: "test-unit", builds: 3, date: "2024-03-22" },
      { job: "test-unit", builds: 2, date: "2024-03-21" }
    ]
  }
]; 