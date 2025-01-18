export type AssessmentType = 'CW' | 'HW' | 'CA' | 'PROJ' | 'EXAM';

export interface AssessmentConfig {
  id: string;
  type: AssessmentType;
  isActive: boolean;
  autoActivateDate?: string;
  autoDeactivateDate?: string;
  maxScore: number;
}

export interface SpecialNeedsStudent extends Student {
  isSpecialNeeds: boolean;
  notes: {
    id: string;
    date: string;
    teacherId: string;
    content: string;
  }[];
}