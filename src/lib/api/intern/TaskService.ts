import api from '../../axios';

export interface TaskItem {
  id: number;
  internship_id?: number;
  company_id?: number;
  assigned_to: number;
  assigned_by?: number;
  title: string;
  description?: string;
  instructions?: string;
  expected_deliverable?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  start_date?: string;
  due_date?: string;
  status: 'assigned' | 'in_progress' | 'submitted' | 'under_review' | 'completed' | 'approved' | 'changes_required' | 'resubmit';
  marks?: number;
  feedback?: string;
  completed_at?: string;
  created_at?: string;
  updated_at?: string;
  is_overdue?: boolean;
  company?: {
    id: number;
    first_name?: string;
    last_name?: string;
    name?: string;
    email?: string;
  };
  internship?: {
    id: number;
    title: string;
    category?: string;
    company_name?: string;
    location?: string;
    start_date?: string;
    end_date?: string;
  };
  latest_submission?: {
    id: number;
    task_id: number;
    submission_comment?: string;
    submission_text?: string;
    proof_files?: string[];
    file_paths?: string[];
    github_link?: string;
    video_link?: string;
    status: string;
    created_at: string;
  };
  submissions?: Array<{
    id: number;
    version: number;
    submission_comment?: string;
    proof_files?: string[];
    github_link?: string;
    video_link?: string;
    status: string;
    created_at: string;
    reviewer?: {
      id: number;
      first_name?: string;
      last_name?: string;
    };
  }>;
}

export interface TaskStats {
  total: number;
  assigned: number;
  in_progress: number;
  pending_review: number;
  completed: number;
  changes_required: number;
  overdue: number;
}

export interface TaskListResponse {
  success: boolean;
  data: {
    data: TaskItem[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
  stats: TaskStats;
}

export interface InternPerformanceStats {
  performance_rate: number;
  average_marks: number;
  total_tasks: number;
  completed_tasks: number;
  pending_review_tasks: number;
  revision_required_tasks: number;
  in_progress_tasks: number;
  assigned_tasks: number;
  total_marks_obtained: number;
  total_max_marks: number;
}

export interface EvaluatedTaskItem {
  id: number;
  title: string;
  priority: string;
  marks: number;
  max_marks: number;
  percentage: number;
  feedback?: string;
  completed_at?: string;
  company_name?: string;
  internship_title?: string;
}

export interface InternPerformanceResponse {
  success: boolean;
  data: {
    stats: InternPerformanceStats;
    evaluated_history: EvaluatedTaskItem[];
  };
}

export const TaskService = {
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    per_page?: number;
  }): Promise<TaskListResponse> => {
    const res = await api.get('/intern/tasks', { params });
    return res.data;
  },

  getPerformance: async (): Promise<InternPerformanceResponse> => {
    const res = await api.get('/intern/tasks/performance');
    return res.data;
  },

  getTask: async (id: number | string): Promise<{ success: boolean; data: TaskItem }> => {
    const res = await api.get(`/intern/tasks/${id}`);
    return res.data;
  },

  startTask: async (id: number | string): Promise<{ success: boolean; message: string; data: TaskItem }> => {
    const res = await api.post(`/intern/tasks/${id}/start`);
    return res.data;
  },

  submitTask: async (
    id: number | string,
    formData: FormData
  ): Promise<{ success: boolean; message: string; data: { task: TaskItem; submission: any } }> => {
    const res = await api.post(`/intern/tasks/${id}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};

