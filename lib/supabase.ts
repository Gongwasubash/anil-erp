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
  deleteBatchClass: (id: string) => supabase.from('batch_classes').delete().eq('id', id)
};