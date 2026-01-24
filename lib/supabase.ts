import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const supabaseService = {
  supabase,
  
  // Branches
  getBranches: () => supabase.from('branches').select('*'),
  createBranch: (data: any) => supabase.from('branches').insert(data),
  updateBranch: (id: string, data: any) => supabase.from('branches').update(data).eq('id', id),
  deleteBranch: (id: string) => supabase.from('branches').delete().eq('id', id),
  
  // Schools
  getSchools: () => supabase.from('schools').select('*'),
  createSchool: (data: any) => supabase.from('schools').insert(data),
  updateSchool: (id: string, data: any) => supabase.from('schools').update(data).eq('id', id),
  deleteSchool: (id: string) => supabase.from('schools').delete().eq('id', id),
  
  // Batches
  getBatches: () => supabase.from('batches').select('*'),
  createBatch: (data: any) => supabase.from('batches').insert(data),
  updateBatch: (id: string, data: any) => supabase.from('batches').update(data).eq('id', id),
  deleteBatch: (id: string) => supabase.from('batches').delete().eq('id', id),
  
  // Classes
  getClasses: () => supabase.from('classes').select('*'),
  createClass: (data: any) => supabase.from('classes').insert(data),
  updateClass: (id: string, data: any) => supabase.from('classes').update(data).eq('id', id),
  deleteClass: (id: string) => supabase.from('classes').delete().eq('id', id),
  
  // Sections
  getSections: () => supabase.from('sections').select('*'),
  createSection: (data: any) => supabase.from('sections').insert(data),
  updateSection: (id: string, data: any) => supabase.from('sections').update(data).eq('id', id),
  deleteSection: (id: string) => supabase.from('sections').delete().eq('id', id),
  
  // Manage Section
  getManageSections: () => supabase.from('manage_section').select('*').order('created_at', { ascending: false }),
  createManageSection: (data: any) => supabase.from('manage_section').insert([data]).select(),
  updateManageSection: (id: string, data: any) => supabase.from('manage_section').update(data).eq('id', id).select(),
  deleteManageSection: (id: string) => supabase.from('manage_section').delete().eq('id', id),
  
  // Batch Class Sections
  getBatchClassSections: () => supabase.from('batch_class_sections').select('*'),
  createBatchClassSection: (data: any) => supabase.from('batch_class_sections').insert([data]).select(),
  updateBatchClassSection: (id: string, data: any) => supabase.from('batch_class_sections').update(data).eq('id', id).select(),
  deleteBatchClassSection: (id: string) => supabase.from('batch_class_sections').delete().eq('id', id),
  
  // Batch Classes
  getBatchClasses: () => supabase.from('batch_classes').select('*'),
  createBatchClass: (data: any) => supabase.from('batch_classes').insert(data),
  updateBatchClass: (id: string, data: any) => supabase.from('batch_classes').update(data).eq('id', id),
  deleteBatchClass: (id: string) => supabase.from('batch_classes').delete().eq('id', id),
  
  // Subjects
  getSubjects: () => supabase.from('subjects').select('*').order('order_no', { ascending: true }),
  createSubject: (data: any) => supabase.from('subjects').insert(data),
  updateSubject: (id: string, data: any) => supabase.from('subjects').update(data).eq('id', id),
  deleteSubject: (id: string) => supabase.from('subjects').delete().eq('id', id),
  
  // Subject Assignments
  getSubjectAssignments: () => supabase.from('subject_assignments').select('*').order('created_at', { ascending: false }),
  createSubjectAssignment: (data: any) => supabase.from('subject_assignments').insert(data),
  updateSubjectAssignment: (id: string, data: any) => supabase.from('subject_assignments').update(data).eq('id', id),
  deleteSubjectAssignment: (id: string) => supabase.from('subject_assignments').delete().eq('id', id),
  
  // Student Subject Assignments
  getStudentSubjectAssignments: () => supabase.from('student_subject_assignments').select('*'),
  createStudentSubjectAssignments: (data: any[]) => supabase.from('student_subject_assignments').insert(data),
  deleteStudentSubjectAssignments: (studentId: string, subjectId: string) => 
    supabase.from('student_subject_assignments').delete().eq('student_id', studentId).eq('subject_id', subjectId),
  getStudentSubjectAssignmentsBySubject: (subjectId: string) => 
    supabase.from('student_subject_assignments').select('*').eq('subject_id', subjectId),
  
  // Exam Types
  getExamTypes: () => supabase.from('exam_types').select('*').order('created_at', { ascending: false }),
  createExamType: (data: any) => supabase.from('exam_types').insert(data),
  updateExamType: (id: string, data: any) => supabase.from('exam_types').update(data).eq('id', id),
  deleteExamType: (id: string) => supabase.from('exam_types').delete().eq('id', id),
  
  // Exam Names
  getExamNames: () => supabase.from('exam_names').select('*').order('created_at', { ascending: false }),
  createExamName: (data: any) => supabase.from('exam_names').insert(data),
  updateExamName: (id: string, data: any) => supabase.from('exam_names').update(data).eq('id', id),
  deleteExamName: (id: string) => supabase.from('exam_names').delete().eq('id', id),
  
  // Exam Marks
  getExamMarks: () => supabase.from('exam_marks').select('*').order('created_at', { ascending: false }),
  createExamMarks: (data: any[]) => supabase.from('exam_marks').insert(data).select(),
  updateExamMarks: (id: string, data: any) => supabase.from('exam_marks').update(data).eq('id', id),
  deleteExamMarks: (id: string) => supabase.from('exam_marks').delete().eq('id', id),
  
  // Departments
  getDepartments: () => supabase.from('departments').select('*').order('order_no', { ascending: true }),
  createDepartment: (data: any) => supabase.from('departments').insert(data),
  updateDepartment: (id: string, data: any) => supabase.from('departments').update(data).eq('id', id),
  deleteDepartment: (id: string) => supabase.from('departments').delete().eq('id', id),
  
  // Designations
  getDesignations: () => supabase.from('designations').select('*, departments(department_name)').order('created_at', { ascending: false }),
  createDesignation: (data: any) => supabase.from('designations').insert(data),
  updateDesignation: (id: string, data: any) => supabase.from('designations').update(data).eq('id', id),
  deleteDesignation: (id: string) => supabase.from('designations').delete().eq('id', id),
  
  // Employees
  getEmployees: () => supabase.from('employees').select('*, departments(department_name), designations(designation_name)').order('created_at', { ascending: false }),
  createEmployee: (data: any) => supabase.from('employees').insert(data),
  updateEmployee: (id: string, data: any) => supabase.from('employees').update(data).eq('id', id),
  deleteEmployee: (id: string) => supabase.from('employees').delete().eq('id', id)
};