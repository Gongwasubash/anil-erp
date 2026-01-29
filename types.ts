
export type UserRole = 'Super Admin' | 'Admin' | 'Accountant' | 'Teacher' | 'Student';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  school_id?: string;
  employee_id?: number;
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

export interface Branch {
  id: string;
  branch_name: string;
  country: string;
  state: string;
  city: string;
  phone_no: string;
  address: string;
  email: string;
  website_url: string;
  short_name: string;
  is_active: boolean;
  created_at: string;
}

export interface Batch {
  id: string;
  batch_no: string;
  short_name: string;
  based_on_batch?: string;
  is_current_batch: boolean;
  created_at: string;
}

export interface Class {
  id: string;
  class_name: string;
  short_name: string;
  created_at: string;
}

export interface Section {
  id: string;
  section_name: string;
  short_name: string;
  created_at: string;
}

export interface BatchClass {
  id: string;
  batch_id: string;
  class_ids: string[];
  created_at: string;
}

export interface BatchClassSection {
  id: string;
  batch_id: string;
  class_id: string;
  section_ids: string[];
  created_at: string;
}

export interface School {
  id: string;
  school_name: string;
  director: string;
  pan_no: string;
  prefix_id: string;
  starting_point: string;
  short_name: string;
  logo_url?: string;
  signature_url?: string;
  accountant_no: string;
  branch_ids: string[];
  fee_due_note: string;
  fee_receipt_note: string;
  created_at: string;
}
