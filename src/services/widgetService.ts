import { GithubRepoActivity, GitlabPipeline, JenkinsBuild, JiraTicket, SonarMetric } from '@/types/mocks';
import { mockGithubData } from '@/mocks/github';
import { mockGitlabData } from '@/mocks/gitlab';
import { mockJenkinsData } from '@/mocks/jenkins';
import { mockJiraData } from '@/mocks/jira';
import { mockSonarData } from '@/mocks/sonarqube';

export type WidgetDataType = GithubRepoActivity[] | GitlabPipeline[] | JenkinsBuild[] | JiraTicket[] | SonarMetric[];

export type WidgetType = 'github' | 'gitlab' | 'jenkins' | 'jira' | 'sonarqube';

class WidgetService {
  private static instance: WidgetService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
  }

  public static getInstance(): WidgetService {
    if (!WidgetService.instance) {
      WidgetService.instance = new WidgetService();
    }
    return WidgetService.instance;
  }

  private async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}/${endpoint}`);
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
      throw error;
    }
  }

  public async getWidgetData(type: WidgetType): Promise<WidgetDataType> {
    // Pour l'instant, nous utilisons des données mockées
    // Dans une vraie application, ce serait un appel API
    switch (type) {
      case 'github': {
        // Agréger les données GitHub
        const repos = mockGithubData;
        const aggregatedData = repos.map(repo => ({
          name: repo.repo,
          value: repo.commits,
          details: {
            stars: repo.stars,
            commits: repo.commits,
            prs: repo.prs,
            issues: repo.issues
          },
          activity: repo.activity.map(a => ({
            date: a.date,
            commits: a.commits,
            prs: a.prs,
            issues: a.issues
          }))
        }));
        return aggregatedData;
      }
      case 'gitlab':
        return mockGitlabData as GitlabPipeline[];
      case 'jenkins': {
        // Agréger les données Jenkins
        const jobs = mockJenkinsData;
        const aggregatedData = jobs.map(job => ({
          name: job.name,
          value: job.stats?.totalBuilds || 0,
          details: {
            totalBuilds: job.stats?.totalBuilds || 0,
            successRate: job.stats?.successRate || 0,
            averageDuration: job.stats?.averageDuration || 0,
            lastBuild: job.lastBuild
          },
          activity: job.activity.map(a => ({
            date: a.date,
            builds: a.builds
          }))
        }));
        return aggregatedData;
      }
      case 'jira': {
        // Agréger les données Jira
        const projects = mockJiraData;
        const aggregatedData = projects.map(project => ({
          name: project.name,
          value: project.stats.totalIssues,
          details: {
            open: project.stats.openIssues,
            inProgress: project.stats.inProgressIssues,
            done: project.stats.doneIssues,
            velocity: project.stats.velocity
          },
          activity: project.activity.map(a => ({
            date: a.date,
            value: a.tickets
          }))
        }));
        return aggregatedData;
      }
      case 'sonarqube': {
        // Agréger les données SonarQube
        const projects = mockSonarData;
        const aggregatedData = projects.map(project => ({
          name: project.name,
          value: project.stats.totalIssues,
          details: {
            totalIssues: project.stats.totalIssues,
            openIssues: project.stats.openIssues,
            resolvedIssues: project.stats.resolvedIssues,
            totalHotspots: project.stats.totalHotspots,
            toReviewHotspots: project.stats.toReviewHotspots,
            reviewedHotspots: project.stats.reviewedHotspots,
            coverage: project.metrics.coverage,
            bugs: project.metrics.bugs,
            vulnerabilities: project.metrics.vulnerabilities,
            codeSmells: project.metrics.codeSmells
          },
          qualityGate: project.qualityGate,
          lastAnalysis: project.lastAnalysis,
          activity: project.activity.map(a => ({
            date: a.date,
            value: a.issues
          }))
        }));
        return aggregatedData;
      }
      default:
        throw new Error(`Type de widget non supporté: ${type}`);
    }
  }

  public async refreshWidgetData(type: WidgetType): Promise<WidgetDataType> {
    return this.getWidgetData(type);
  }
}

export const widgetService = WidgetService.getInstance(); 