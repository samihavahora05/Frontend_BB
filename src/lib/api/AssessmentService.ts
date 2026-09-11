import api from "../axios";

export interface CategoryStat {
  category: string;
  count: number;
  marks: number;
}

export interface AssessmentItem {
  id: number;
  title: string;
  slug: string;
  description: string;
  total_questions: number;
  total_marks: number;
  passing_percentage: number;
  duration_minutes: number;
  category_breakdown: CategoryStat[];
  has_active_attempt: boolean;
  active_attempt_id?: number;
  total_attempts: number;
  best_score?: number;
  best_percentage?: number;
  latest_status?: string;
}

export interface AssessmentQuestionItem {
  id: number;
  assessment_id: number;
  order: number;
  category: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
  marks: number;
}

export interface AttemptItem {
  id: number;
  assessment_id: number;
  user_id: number;
  started_at: string;
  submitted_at?: string;
  total_questions: number;
  correct_answers: number;
  wrong_answers: number;
  unanswered: number;
  score: number;
  percentage: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  category_scores?: Record<string, { total: number; correct: number; wrong: number; unanswered: number; score: number }>;
}

export interface AnswerReviewItem {
  question_id: number;
  order: number;
  category: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  selected_answer: 'A' | 'B' | 'C' | 'D' | null;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  is_correct: boolean | null;
  marks_obtained: number;
  explanation?: string;
}

export const AssessmentService = {
  async getAssessments(): Promise<{ success: boolean; data: AssessmentItem[] }> {
    const res = await api.get('/intern/assessments');
    return res.data;
  },

  async getAssessment(id: string | number): Promise<any> {
    const res = await api.get(`/intern/assessments/${id}`);
    return res.data;
  },

  async startAssessment(id: string | number): Promise<any> {
    const res = await api.post(`/intern/assessments/${id}/start`);
    return res.data;
  },

  async saveAnswer(id: string | number, payload: { attempt_id: number; question_id: number; selected_answer: string | null }): Promise<any> {
    const res = await api.post(`/intern/assessments/${id}/save-answer`, payload);
    return res.data;
  },

  async submitAssessment(id: string | number, payload: { attempt_id: number; answers?: Record<number, string> }): Promise<any> {
    const res = await api.post(`/intern/assessments/${id}/submit`, payload);
    return res.data;
  },

  async getResult(id: string | number, attemptId: string | number): Promise<any> {
    const res = await api.get(`/intern/assessments/${id}/result/${attemptId}`);
    return res.data;
  },

  async getHistory(): Promise<{ success: boolean; data: AttemptItem[] }> {
    const res = await api.get('/intern/assessments/history');
    return res.data;
  },

  // Admin APIs: Results
  async getAdminResults(params?: any): Promise<any> {
    const res = await api.get('/admin/assessments/results', { params });
    return res.data;
  },

  async getAdminAttemptDetail(attemptId: string | number): Promise<any> {
    const res = await api.get(`/admin/assessments/results/${attemptId}`);
    return res.data;
  },

  // Admin APIs: Question CRUD & Database Import
  async getAdminQuestions(assessmentId: number | string = 1, params?: any): Promise<any> {
    const res = await api.get(`/admin/assessments/${assessmentId}/questions`, { params });
    return res.data;
  },

  async createAdminQuestion(assessmentId: number | string, payload: any): Promise<any> {
    const res = await api.post(`/admin/assessments/${assessmentId}/questions`, payload);
    return res.data;
  },

  async updateAdminQuestion(questionId: number | string, payload: any): Promise<any> {
    const res = await api.put(`/admin/assessments/questions/${questionId}`, payload);
    return res.data;
  },

  async deleteAdminQuestion(questionId: number | string): Promise<any> {
    const res = await api.delete(`/admin/assessments/questions/${questionId}`);
    return res.data;
  },

  async downloadQuestionsTemplate(): Promise<void> {
    const res = await api.get('/admin/assessments/questions/sample-template', {
      responseType: 'blob',
    });
    const blob = new Blob([res.data], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'assessment_questions_template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  async previewImportQuestions(assessmentId: number | string, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post(`/admin/assessments/${assessmentId}/questions/preview-import`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  async importQuestions(assessmentId: number | string, payload: { questions: any[]; duplicate_strategy?: string }): Promise<any> {
    const res = await api.post(`/admin/assessments/${assessmentId}/questions/import`, payload);
    return res.data;
  },
};
