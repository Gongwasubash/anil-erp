
export type UserRole = 'Super Admin' | 'Admin' | 'Accountant' | 'Teacher' | 'Student';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
}

export interface Student {
  id: string;
  name: string;
  photoUrl: string;
  class: string;
  section: string;
  rollNo: string;
  guardianName: string;
  phone: string;
  academicYear: string;
  status: 'Active' | 'Inactive';
}

export interface FeeCategory {
  id: string;
  name: string;
  amount: number;
}

export interface FeeBill {
  id: string;
  studentId: string;
  studentName: string;
  month: string;
  year: string;
  items: { category: string; amount: number }[];
  total: number;
  discount: number;
  netAmount: number;
  paidAmount: number;
  status: 'Unpaid' | 'Partial' | 'Paid';
  date: string;
}

export interface Subject {
  id: string;
  class: string;
  name: string;
  fullMarks: number;
  passMarks: number;
  hasPractical: boolean;
  theoryFM: number;
  practicalFM?: number;
}

export interface MarkRecord {
  id: string;
  studentId: string;
  subjectId: string;
  theoryObtained: number;
  practicalObtained: number;
  totalObtained: number;
  grade: string;
  gpa: number;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}
