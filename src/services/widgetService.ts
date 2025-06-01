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
      case 'github':
        return mockGithubData as GithubRepoActivity[];
      case 'gitlab':
        return mockGitlabData as GitlabPipeline[];
      case 'jenkins':
        return mockJenkinsData as JenkinsBuild[];
      case 'jira':
        return mockJiraData as JiraTicket[];
      case 'sonarqube':
        return mockSonarData as any[];
      default:
        throw new Error(`Type de widget non supporté: ${type}`);
    }
  }

  public async refreshWidgetData(type: WidgetType): Promise<WidgetDataType> {
    return this.getWidgetData(type);
  }
}

export const widgetService = WidgetService.getInstance(); 