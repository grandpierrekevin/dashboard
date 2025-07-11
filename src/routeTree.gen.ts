/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as SonarqubeImport } from './routes/sonarqube'
import { Route as ProfileImport } from './routes/profile'
import { Route as JiraImport } from './routes/jira'
import { Route as JenkinsImport } from './routes/jenkins'
import { Route as GitlabImport } from './routes/gitlab'
import { Route as GithubImport } from './routes/github'
import { Route as DashboardImport } from './routes/dashboard'
import { Route as AboutImport } from './routes/about'
import { Route as R404Import } from './routes/404'
import { Route as IndexImport } from './routes/index'
import { Route as AdminIntegrationsImport } from './routes/admin/integrations'
import { Route as AdminCorrelationImport } from './routes/admin/correlation'

// Create/Update Routes

const SonarqubeRoute = SonarqubeImport.update({
  id: '/sonarqube',
  path: '/sonarqube',
  getParentRoute: () => rootRoute,
} as any)

const ProfileRoute = ProfileImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRoute,
} as any)

const JiraRoute = JiraImport.update({
  id: '/jira',
  path: '/jira',
  getParentRoute: () => rootRoute,
} as any)

const JenkinsRoute = JenkinsImport.update({
  id: '/jenkins',
  path: '/jenkins',
  getParentRoute: () => rootRoute,
} as any)

const GitlabRoute = GitlabImport.update({
  id: '/gitlab',
  path: '/gitlab',
  getParentRoute: () => rootRoute,
} as any)

const GithubRoute = GithubImport.update({
  id: '/github',
  path: '/github',
  getParentRoute: () => rootRoute,
} as any)

const DashboardRoute = DashboardImport.update({
  id: '/dashboard',
  path: '/dashboard',
  getParentRoute: () => rootRoute,
} as any)

const AboutRoute = AboutImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRoute,
} as any)

const R404Route = R404Import.update({
  id: '/404',
  path: '/404',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const AdminIntegrationsRoute = AdminIntegrationsImport.update({
  id: '/admin/integrations',
  path: '/admin/integrations',
  getParentRoute: () => rootRoute,
} as any)

const AdminCorrelationRoute = AdminCorrelationImport.update({
  id: '/admin/correlation',
  path: '/admin/correlation',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/404': {
      id: '/404'
      path: '/404'
      fullPath: '/404'
      preLoaderRoute: typeof R404Import
      parentRoute: typeof rootRoute
    }
    '/about': {
      id: '/about'
      path: '/about'
      fullPath: '/about'
      preLoaderRoute: typeof AboutImport
      parentRoute: typeof rootRoute
    }
    '/dashboard': {
      id: '/dashboard'
      path: '/dashboard'
      fullPath: '/dashboard'
      preLoaderRoute: typeof DashboardImport
      parentRoute: typeof rootRoute
    }
    '/github': {
      id: '/github'
      path: '/github'
      fullPath: '/github'
      preLoaderRoute: typeof GithubImport
      parentRoute: typeof rootRoute
    }
    '/gitlab': {
      id: '/gitlab'
      path: '/gitlab'
      fullPath: '/gitlab'
      preLoaderRoute: typeof GitlabImport
      parentRoute: typeof rootRoute
    }
    '/jenkins': {
      id: '/jenkins'
      path: '/jenkins'
      fullPath: '/jenkins'
      preLoaderRoute: typeof JenkinsImport
      parentRoute: typeof rootRoute
    }
    '/jira': {
      id: '/jira'
      path: '/jira'
      fullPath: '/jira'
      preLoaderRoute: typeof JiraImport
      parentRoute: typeof rootRoute
    }
    '/profile': {
      id: '/profile'
      path: '/profile'
      fullPath: '/profile'
      preLoaderRoute: typeof ProfileImport
      parentRoute: typeof rootRoute
    }
    '/sonarqube': {
      id: '/sonarqube'
      path: '/sonarqube'
      fullPath: '/sonarqube'
      preLoaderRoute: typeof SonarqubeImport
      parentRoute: typeof rootRoute
    }
    '/admin/correlation': {
      id: '/admin/correlation'
      path: '/admin/correlation'
      fullPath: '/admin/correlation'
      preLoaderRoute: typeof AdminCorrelationImport
      parentRoute: typeof rootRoute
    }
    '/admin/integrations': {
      id: '/admin/integrations'
      path: '/admin/integrations'
      fullPath: '/admin/integrations'
      preLoaderRoute: typeof AdminIntegrationsImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/404': typeof R404Route
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRoute
  '/github': typeof GithubRoute
  '/gitlab': typeof GitlabRoute
  '/jenkins': typeof JenkinsRoute
  '/jira': typeof JiraRoute
  '/profile': typeof ProfileRoute
  '/sonarqube': typeof SonarqubeRoute
  '/admin/correlation': typeof AdminCorrelationRoute
  '/admin/integrations': typeof AdminIntegrationsRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/404': typeof R404Route
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRoute
  '/github': typeof GithubRoute
  '/gitlab': typeof GitlabRoute
  '/jenkins': typeof JenkinsRoute
  '/jira': typeof JiraRoute
  '/profile': typeof ProfileRoute
  '/sonarqube': typeof SonarqubeRoute
  '/admin/correlation': typeof AdminCorrelationRoute
  '/admin/integrations': typeof AdminIntegrationsRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/404': typeof R404Route
  '/about': typeof AboutRoute
  '/dashboard': typeof DashboardRoute
  '/github': typeof GithubRoute
  '/gitlab': typeof GitlabRoute
  '/jenkins': typeof JenkinsRoute
  '/jira': typeof JiraRoute
  '/profile': typeof ProfileRoute
  '/sonarqube': typeof SonarqubeRoute
  '/admin/correlation': typeof AdminCorrelationRoute
  '/admin/integrations': typeof AdminIntegrationsRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths:
    | '/'
    | '/404'
    | '/about'
    | '/dashboard'
    | '/github'
    | '/gitlab'
    | '/jenkins'
    | '/jira'
    | '/profile'
    | '/sonarqube'
    | '/admin/correlation'
    | '/admin/integrations'
  fileRoutesByTo: FileRoutesByTo
  to:
    | '/'
    | '/404'
    | '/about'
    | '/dashboard'
    | '/github'
    | '/gitlab'
    | '/jenkins'
    | '/jira'
    | '/profile'
    | '/sonarqube'
    | '/admin/correlation'
    | '/admin/integrations'
  id:
    | '__root__'
    | '/'
    | '/404'
    | '/about'
    | '/dashboard'
    | '/github'
    | '/gitlab'
    | '/jenkins'
    | '/jira'
    | '/profile'
    | '/sonarqube'
    | '/admin/correlation'
    | '/admin/integrations'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  R404Route: typeof R404Route
  AboutRoute: typeof AboutRoute
  DashboardRoute: typeof DashboardRoute
  GithubRoute: typeof GithubRoute
  GitlabRoute: typeof GitlabRoute
  JenkinsRoute: typeof JenkinsRoute
  JiraRoute: typeof JiraRoute
  ProfileRoute: typeof ProfileRoute
  SonarqubeRoute: typeof SonarqubeRoute
  AdminCorrelationRoute: typeof AdminCorrelationRoute
  AdminIntegrationsRoute: typeof AdminIntegrationsRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  R404Route: R404Route,
  AboutRoute: AboutRoute,
  DashboardRoute: DashboardRoute,
  GithubRoute: GithubRoute,
  GitlabRoute: GitlabRoute,
  JenkinsRoute: JenkinsRoute,
  JiraRoute: JiraRoute,
  ProfileRoute: ProfileRoute,
  SonarqubeRoute: SonarqubeRoute,
  AdminCorrelationRoute: AdminCorrelationRoute,
  AdminIntegrationsRoute: AdminIntegrationsRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/404",
        "/about",
        "/dashboard",
        "/github",
        "/gitlab",
        "/jenkins",
        "/jira",
        "/profile",
        "/sonarqube",
        "/admin/correlation",
        "/admin/integrations"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/404": {
      "filePath": "404.tsx"
    },
    "/about": {
      "filePath": "about.tsx"
    },
    "/dashboard": {
      "filePath": "dashboard.tsx"
    },
    "/github": {
      "filePath": "github.tsx"
    },
    "/gitlab": {
      "filePath": "gitlab.tsx"
    },
    "/jenkins": {
      "filePath": "jenkins.tsx"
    },
    "/jira": {
      "filePath": "jira.tsx"
    },
    "/profile": {
      "filePath": "profile.tsx"
    },
    "/sonarqube": {
      "filePath": "sonarqube.tsx"
    },
    "/admin/correlation": {
      "filePath": "admin/correlation.tsx"
    },
    "/admin/integrations": {
      "filePath": "admin/integrations.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
