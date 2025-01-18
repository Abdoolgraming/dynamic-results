export type ResultStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AssessmentType = 'CW' | 'HW' | 'CA' | 'EXAM';

export interface Assessment {
  type: AssessmentType;
  score: number;
  maxScore: number;
  date: string;
}

export interface Result {
  id: string;
  studentId: string;
  classId: string;
  subjectId: string;
  teacherId: string;
  term: string;
  academicYear: string;
  assessments: Assessment[];
  totalScore: number;
  grade: string;
  status: ResultStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewComments?: string;
  attendance: number;
}