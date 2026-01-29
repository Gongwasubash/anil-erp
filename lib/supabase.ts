import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Set school context for RLS
const setSchoolContext = async (schoolId?: string) => {
  if (schoolId && schoolId !== 'all') {
    await supabase.rpc('set_config', {
      setting_name: 'app.current_school_id',
      setting_value: schoolId,
      is_local: true
    });
  }
};

export const supabaseService = {
  supabase,
  
  // Authentication
  loginWithSchool: async (username: string, password: string) => {
    return supabase.rpc('login_user', {
      p_username: username,
      p_password: password
    });
  },
  
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
  getBatches: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('batches').select('*').eq('school_id', schoolId);
  },
  createBatch: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('batches').insert(data);
  },
  updateBatch: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('batches').update(data).eq('id', id);
  },
  deleteBatch: async (id: string, schoolId?: string) => {
    if (schoolId) await setSchoolContext(schoolId);
    return supabase.from('batches').delete().eq('id', id);
  },
  
  // Classes
  getClasses: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('classes').select('*').eq('school_id', schoolId);
  },
  createClass: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('classes').insert(data);
  },
  updateClass: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('classes').update(data).eq('id', id);
  },
  deleteClass: async (id: string, schoolId?: string) => {
    if (schoolId) await setSchoolContext(schoolId);
    return supabase.from('classes').delete().eq('id', id);
  },
  
  // Sections
  getSections: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('sections').select('*').eq('school_id', schoolId);
  },
  createSection: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('sections').insert(data);
  },
  updateSection: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('sections').update(data).eq('id', id);
  },
  deleteSection: async (id: string, schoolId?: string) => {
    if (schoolId) await setSchoolContext(schoolId);
    return supabase.from('sections').delete().eq('id', id);
  },
  
  // Manage Section
  getManageSections: (schoolId?: string) => {
    if (!schoolId) return Promise.resolve({ data: [], error: null });
    return supabase.from('manage_section').select('*').eq('school_id', schoolId).order('created_at', { ascending: false });
  },
  createManageSection: (data: any) => supabase.from('manage_section').insert([data]).select(),
  updateManageSection: (id: string, data: any) => supabase.from('manage_section').update(data).eq('id', id).select(),
  deleteManageSection: (id: string) => supabase.from('manage_section').delete().eq('id', id),
  
  // Batch Class Sections
  getBatchClassSections: () => supabase.from('batch_class_sections').select('*'),
  createBatchClassSection: (data: any) => supabase.from('batch_class_sections').insert([data]).select(),
  updateBatchClassSection: (id: string, data: any) => supabase.from('batch_class_sections').update(data).eq('id', id).select(),
  deleteBatchClassSection: (id: string) => supabase.from('batch_class_sections').delete().eq('id', id),
  
  // Batch Classes
  getBatchClasses: (schoolId?: string) => {
    if (!schoolId) return Promise.resolve({ data: [], error: null });
    return supabase.from('batch_classes').select('*').eq('school_id', schoolId).order('created_at', { ascending: false });
  },
  createBatchClass: (data: any) => supabase.from('batch_classes').insert(data),
  updateBatchClass: (id: string, data: any) => supabase.from('batch_classes').update(data).eq('id', id),
  deleteBatchClass: (id: string) => supabase.from('batch_classes').delete().eq('id', id),
  
  // Subjects
  getSubjects: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('subjects').select('*').eq('school_id', schoolId).order('order_no', { ascending: true });
  },
  createSubject: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('subjects').insert(data);
  },
  updateSubject: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('subjects').update(data).eq('id', id);
  },
  deleteSubject: async (id: string, schoolId?: string) => {
    await setSchoolContext(schoolId);
    return supabase.from('subjects').delete().eq('id', id);
  },
  
  // Subject Assignments
  getSubjectAssignments: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('subject_assignments').select('*').eq('school_id', schoolId).order('created_at', { ascending: false });
  },
  createSubjectAssignment: (data: any) => supabase.from('subject_assignments').insert(data),
  updateSubjectAssignment: (id: string, data: any) => supabase.from('subject_assignments').update(data).eq('id', id),
  deleteSubjectAssignment: (id: string) => supabase.from('subject_assignments').delete().eq('id', id),
  // Upsert subject assignment - insert or update based on unique constraint
  upsertSubjectAssignment: (data: any) => 
    supabase.from('subject_assignments')
      .upsert(data, { 
        onConflict: 'school_id,batch_id,class_id,section_id',
        ignoreDuplicates: false 
      })
      .select(),
  
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
  getDepartments: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('departments').select('*').eq('school_id', schoolId).order('order_no', { ascending: true });
  },
  createDepartment: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('departments').insert(data);
  },
  updateDepartment: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('departments').update(data).eq('id', id);
  },
  deleteDepartment: async (id: string, schoolId?: string) => {
    await setSchoolContext(schoolId);
    return supabase.from('departments').delete().eq('id', id);
  },
  
  // Designations
  getDesignations: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('designations').select('*, departments(department_name)').eq('school_id', schoolId).order('created_at', { ascending: false });
  },
  createDesignation: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('designations').insert(data);
  },
  updateDesignation: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('designations').update(data).eq('id', id);
  },
  deleteDesignation: async (id: string, schoolId?: string) => {
    await setSchoolContext(schoolId);
    return supabase.from('designations').delete().eq('id', id);
  },
  
  // Employees
  getEmployees: async (schoolId?: string) => {
    if (!schoolId) return { data: [], error: null };
    await setSchoolContext(schoolId);
    return supabase.from('employees').select('*, departments(department_name), designations(designation_name), employee_types(employee_type_name)').eq('school_id', schoolId).order('created_at', { ascending: false });
  },
  createEmployee: async (data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('employees').insert(data);
  },
  updateEmployee: async (id: string, data: any) => {
    await setSchoolContext(data.school_id);
    return supabase.from('employees').update(data).eq('id', id).select();
  },
  deleteEmployee: async (id: string, schoolId?: string) => {
    await setSchoolContext(schoolId);
    return supabase.from('employees').delete().eq('id', id);
  }
};