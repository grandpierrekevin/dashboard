export interface JiraData {
  id: number;
  name: string;
  description: string;
  key: string;
  issues: Issue[];
  sprints: Sprint[];
  stats: ProjectStats;
  activity: JiraActivity[];
}

export interface JiraActivity {
  date: string;
  tickets: number;
}

export interface Issue {
  id: string;
  key: string;
  title: string;
  type: 'story' | 'bug' | 'task' | 'epic';
  status: 'to_do' | 'in_progress' | 'in_review' | 'done';
  priority: 'lowest' | 'low' | 'medium' | 'high' | 'highest' | 'critical';
  assignee: string;
  reporter: string;
  created: string;
  updated: string;
  description: string;
  labels: string[];
  components: string[];
  storyPoints: number;
  comments: Comment[];
  subtasks: Subtask[];
  transitions: Transition[];
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  created: string;
}

export interface Subtask {
  id: string;
  key: string;
  title: string;
  status: 'to_do' | 'in_progress' | 'in_review' | 'done';
  assignee: string;
}

export interface Transition {
  from: string;
  to: string;
  date: string;
  author: string;
}

export interface Sprint {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'future';
  issues: string[];
}

export interface ProjectStats {
  totalIssues: number;
  openIssues: number;
  inProgressIssues: number;
  doneIssues: number;
  velocity: number;
  lastUpdated: string;
} 