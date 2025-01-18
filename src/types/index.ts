export interface Student {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  admissionNumber: string;
  class: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  parent: {
    fatherName: string;
    fatherContact: string;
    motherName: string;
    motherContact: string;
    email: string;
  };
  financials: {
    fees: {
      amount: number;
      paid: number;
      due: number;
      lastPaymentDate?: string;
    };
    scholarship?: {
      type: string;
      amount: number;
      validUntil: string;
    };
  };
  uniform: {
    capsIssued: number;
    uniformsIssued: number;
    lastIssuedDate?: string;
  };
  academics?: {
    books: {
      textbooks: string[];
      workbooks: string[];
      notebooks: number;
    };
    specialPrograms: {
      tahfees?: {
        level: string;
        instructor: string;
        schedule: string[];
      };
    };
  };
  extracurricular?: {
    clubs: {
      name: string;
      role: string;
      joinDate: string;
    }[];
  };
  resources?: {
    notebooks: {
      allocated: number;
      received: string[];
    };
  };
}

export interface Class {
  id: string;
  name: string;
  teacher: string;
  subjects: string[];
  capacity: number;
  currentStrength: number;
  academicYear: string;
}

export interface Subject {
  id: string;
  name: string;
  teacher: string;
  maxScore: number;
  books: {
    textbook: string;
    workbook?: string;
    additionalResources?: string[];
  };
}

export interface ParentCredentials {
  id: string;
  studentId: string;
  username: string;
  password: string;
  lastLogin?: string;
}