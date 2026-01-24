import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Edit, Trash2, Plus, Search, ChevronDown, BookOpen, Settings, Users } from 'lucide-react';
import { User, School } from '../types';
import { supabaseService } from '../lib/supabase';

const Masters: React.FC<{ user: User }> = ({ user }) => {
  const location = useLocation();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddSchool, setShowAddSchool] = useState(false);
  const [showEditSchool, setShowEditSchool] = useState(false);
  const [editingBranch, setEditingBranch] = useState<any>(null);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    branchName: '',
    country: 'Nepal',
    state: '',
    city: '',
    phoneNo: '',
    address: '',
    email: '',
    websiteUrl: '',
    shortName: '',
    isActive: true
  });

  const nepalCities: { [key: string]: string[] } = {
    'Province No. 1': ['Biratnagar', 'Dharan', 'Itahari', 'Damak', 'Birtamod', 'Mechinagar', 'Triyuga'],
    'Madhesh Province': ['Janakpur', 'Birgunj', 'Kalaiya', 'Gaur', 'Malangwa', 'Bardibas', 'Rajbiraj'],
    'Bagmati Province': ['Kathmandu', 'Lalitpur', 'Bhaktapur', 'Madhyapur Thimi', 'Kirtipur', 'Hetauda', 'Bharatpur'],
    'Gandaki Province': ['Pokhara', 'Gorkha', 'Baglung', 'Mustang', 'Myagdi', 'Parbat', 'Syangja'],
    'Lumbini Province': ['Butwal', 'Siddharthanagar', 'Tilottama', 'Devdaha', 'Sainamaina', 'Kapilvastu', 'Arghakhanchi'],
    'Karnali Province': ['Birendranagar', 'Gulariya', 'Dunai', 'Jumla', 'Chaur Jahari', 'Narayan', 'Dullu'],
    'Sudurpashchim Province': ['Dhangadhi', 'Mahendranagar', 'Tikapur', 'Ghodaghodi', 'Lamki Chuha', 'Dodhara Chandani', 'Parashuram']
  };

  const [branches, setBranches] = useState([]);
  const [schools, setSchools] = useState([]);
  const [batches, setBatches] = useState([]);
  const [showAddBatch, setShowAddBatch] = useState(false);
  const [showEditBatch, setShowEditBatch] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [batchFormData, setBatchFormData] = useState({
    batchNo: '',
    shortName: '',
    basedOnBatch: '',
    isCurrentBatch: false
  });
  const [classes, setClasses] = useState([]);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showEditClass, setShowEditClass] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [classFormData, setClassFormData] = useState({
    className: '',
    shortName: ''
  });
  const [sections, setSections] = useState([]);
  const [showAddSection, setShowAddSection] = useState(false);
  const [sectionFormData, setSectionFormData] = useState({
    sectionName: '',
    shortName: ''
  });
  const [selectedSectionBatch, setSelectedSectionBatch] = useState('');
  const [selectedSectionClass, setSelectedSectionClass] = useState('');
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [manageSections, setManageSections] = useState([]);
  const [editingManageSection, setEditingManageSection] = useState<any>(null);
  const [showEditManageSection, setShowEditManageSection] = useState(false);
  const [batchClasses, setBatchClasses] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingBatchClass, setEditingBatchClass] = useState<any>(null);
  const [showEditBatchClass, setShowEditBatchClass] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);
  const [activeSubjectModule, setActiveSubjectModule] = useState('add_subject');
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [showEditSubject, setShowEditSubject] = useState(false);
  const [subjectFormData, setSubjectFormData] = useState({
    subjectCode: '',
    subjectName: '',
    sortName: '',
    orderNo: 1
  });
  const [subjects, setSubjects] = useState([]);
  const [subjectAssignments, setSubjectAssignments] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedAssignmentBatch, setSelectedAssignmentBatch] = useState('');
  const [selectedAssignmentClass, setSelectedAssignmentClass] = useState('');
  const [selectedAssignmentSections, setSelectedAssignmentSections] = useState<string[]>([]);
  const [selectedAssignmentSubjects, setSelectedAssignmentSubjects] = useState<string[]>([]);
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [showEditAssignment, setShowEditAssignment] = useState(false);
  const [selectedStudentSchool, setSelectedStudentSchool] = useState('');
  const [selectedStudentBatch, setSelectedStudentBatch] = useState('');
  const [selectedStudentClass, setSelectedStudentClass] = useState('');
  const [selectedStudentSection, setSelectedStudentSection] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedStudentSubject, setSelectedStudentSubject] = useState('');
  const [studentSubjectResults, setStudentSubjectResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [existingAssignments, setExistingAssignments] = useState([]);
  const [schoolFormData, setSchoolFormData] = useState({
    schoolName: '',
    director: '',
    panNo: '',
    prefixId: '',
    startingPoint: '',
    shortName: '',
    accountantNo: '',
    feeDueNote: '',
    feeReceiptNote: '',
    logoFile: null as File | null,
    signatureFile: null as File | null,
    country: 'Nepal',
    state: 'Lalitpur',
    city: 'Lalitpur',
    phoneNo: '015261023',
    address: '',
    email: 'anil.maxconnect@gmail.com',
    websiteUrl: ''
  });
  const [departments, setDepartments] = useState([]);
  const [departmentFormData, setDepartmentFormData] = useState({
    orderNo: 1,
    departmentName: '',
    shortName: '',
    aboutDepartment: ''
  });
  const [editingDepartment, setEditingDepartment] = useState<any>(null);
  const [showEditDepartment, setShowEditDepartment] = useState(false);
  const [designations, setDesignations] = useState([]);
  const [designationFormData, setDesignationFormData] = useState({
    departmentId: '',
    designationName: '',
    shortName: ''
  });
  const [editingDesignation, setEditingDesignation] = useState<any>(null);
  const [showEditDesignation, setShowEditDesignation] = useState(false);

  // Load sections from Supabase on component mount
  useEffect(() => {
    loadBranches();
    loadSchools();
    loadBatches();
    loadClasses();
    loadSections();
    loadBatchClasses();
    loadManageSections();
    loadSubjects();
    loadSubjectAssignments();
    loadStudents();
    loadDepartments();
    loadDesignations();
    console.log('Loading master data...');
  }, []);

  const loadBranches = async () => {
    setLoading(true);
    const { data, error } = await supabaseService.getBranches();
    if (error) {
      console.error('Error loading branches:', error);
    } else {
      setBranches(data || []);
    }
    setLoading(false);
  };

  const loadBatchClasses = async () => {
    const { data, error } = await supabaseService.getBatchClasses();
    if (error) {
      console.error('Error loading batch classes:', error);
    } else {
      setBatchClasses(data || []);
    }
  };

  const handleEditBatchClass = (batchClass: any) => {
    setEditingBatchClass(batchClass);
    setSelectedBatch(batchClass.batch_id);
    setSelectedClasses(batchClass.class_ids || []);
    setShowEditBatchClass(true);
  };

  const handleUpdateBatchClass = async () => {
    if (!editingBatchClass || !selectedBatch || selectedClasses.length === 0) {
      alert('Please select a batch and at least one class');
      return;
    }
    
    setLoading(true);
    const batchClassData = {
      batch_id: selectedBatch,
      class_ids: selectedClasses
    };
    
    const { data, error } = await supabaseService.updateBatchClass(editingBatchClass.id, batchClassData);
    
    if (error) {
      console.error('Error updating batch class:', error);
      alert(`Error updating batch class: ${error.message}`);
    } else {
      alert('Batch class updated successfully!');
      setSelectedBatch('');
      setSelectedClasses([]);
      setEditingBatchClass(null);
      setShowEditBatchClass(false);
      loadBatchClasses();
    }
    setLoading(false);
  };

  const handleClassToggle = (classId: string) => {
    const stringClassId = String(classId);
    setSelectedClasses(prev => 
      prev.includes(stringClassId) 
        ? prev.filter(id => id !== stringClassId)
        : [...prev, stringClassId]
    );
  };

  const handleEditSubject = (subject: any) => {
    setEditingSubject(subject);
    setSubjectFormData({
      subjectCode: subject.subject_code || subject.subjectCode,
      subjectName: subject.subject_name || subject.subjectName,
      sortName: subject.sort_name || subject.sortName,
      orderNo: subject.order_no || subject.orderNo
    });
    // Ensure class_ids are converted to strings for proper comparison
    const classIds = subject.class_ids || subject.classIds || [];
    const stringClassIds = classIds.map((id: any) => String(id));
    setSelectedClasses(stringClassIds);
    setShowEditSubject(true);
  };

  const loadSubjects = async () => {
    const { data, error } = await supabaseService.getSubjects();
    if (error) {
      console.error('Error loading subjects:', error);
    } else {
      setSubjects(data || []);
    }
  };

  const handleCreateSubject = async () => {
    setLoading(true);
    const subjectData = {
      subject_code: subjectFormData.subjectCode,
      subject_name: subjectFormData.subjectName,
      sort_name: subjectFormData.sortName,
      order_no: subjectFormData.orderNo,
      class_ids: selectedClasses
    };
    
    const { data, error } = await supabaseService.createSubject(subjectData);
    
    if (error) {
      console.error('Error creating subject:', error);
      alert(`Error creating subject: ${error.message}`);
    } else {
      alert('Subject created successfully!');
      setSubjectFormData({ subjectCode: '', subjectName: '', sortName: '', orderNo: 1 });
      setSelectedClasses([]);
      loadSubjects();
    }
    setLoading(false);
  };

  const handleUpdateSubject = async () => {
    if (!editingSubject) return;
    
    setLoading(true);
    const subjectData = {
      subject_code: subjectFormData.subjectCode,
      subject_name: subjectFormData.subjectName,
      sort_name: subjectFormData.sortName,
      order_no: subjectFormData.orderNo,
      class_ids: selectedClasses
    };
    
    const { data, error } = await supabaseService.updateSubject(editingSubject.id, subjectData);
    
    if (error) {
      console.error('Error updating subject:', error);
      alert(`Error updating subject: ${error.message}`);
    } else {
      alert('Subject updated successfully!');
      setShowEditSubject(false);
      setEditingSubject(null);
      setSubjectFormData({ subjectCode: '', subjectName: '', sortName: '', orderNo: 1 });
      setSelectedClasses([]);
      loadSubjects();
    }
    setLoading(false);
  };

  const handleDeleteSubject = async (subject: any) => {
    if (window.confirm(`Are you sure you want to delete "${subject.subject_name || subject.subjectName}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteSubject(subject.id);
      
      if (error) {
        console.error('Error deleting subject:', error);
        alert(`Error deleting subject: ${error.message}`);
      } else {
        alert('Subject deleted successfully!');
        loadSubjects();
      }
      setLoading(false);
    }
  };

  const loadSubjectAssignments = async () => {
    const { data, error } = await supabaseService.getSubjectAssignments();
    if (error) {
      console.error('Error loading subject assignments:', error);
    } else {
      setSubjectAssignments(data || []);
      setFilteredAssignments(data || []);
    }
  };

  const handleAssignmentSectionToggle = (sectionId: string) => {
    setSelectedAssignmentSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleAssignmentSubjectToggle = (subjectId: string) => {
    const stringSubjectId = String(subjectId);
    setSelectedAssignmentSubjects(prev => 
      prev.includes(stringSubjectId) 
        ? prev.filter(id => id !== stringSubjectId)
        : [...prev, stringSubjectId]
    );
  };

  const handleCreateSubjectAssignment = async () => {
    if (!selectedSchool || !selectedAssignmentBatch || !selectedAssignmentClass || selectedAssignmentSections.length === 0 || selectedAssignmentSubjects.length === 0) {
      alert('Please select school, batch, class, section and subjects');
      return;
    }
    
    setLoading(true);
    
    const assignmentData = {
      school_id: String(selectedSchool),
      batch_id: String(selectedAssignmentBatch),
      class_id: String(selectedAssignmentClass),
      section_id: String(selectedAssignmentSections[0]),
      subject_ids: selectedAssignmentSubjects.map(id => String(id))
    };
    
    const { data, error } = await supabaseService.createSubjectAssignment(assignmentData);
    
    if (error) {
      console.error('Error creating subject assignment:', error);
      alert(`Error creating subject assignment: ${error.message}`);
    } else {
      alert('Subject assignment created successfully!');
      setSelectedSchool('');
      setSelectedAssignmentBatch('');
      setSelectedAssignmentClass('');
      setSelectedAssignmentSections([]);
      setSelectedAssignmentSubjects([]);
      loadSubjectAssignments();
    }
    setLoading(false);
  };

  const handleEditAssignment = (assignment: any) => {
    setEditingAssignment(assignment);
    setSelectedSchool(assignment.school_id);
    setSelectedAssignmentBatch(assignment.batch_id);
    setSelectedAssignmentClass(assignment.class_id);
    setSelectedAssignmentSections([assignment.section_id]);
    setSelectedAssignmentSubjects(assignment.subject_ids || []);
    setShowEditAssignment(true);
  };

  const handleUpdateAssignment = async () => {
    if (!editingAssignment || !selectedSchool || !selectedAssignmentBatch || !selectedAssignmentClass || selectedAssignmentSections.length === 0 || selectedAssignmentSubjects.length === 0) {
      alert('Please select school, batch, class, section and subjects');
      return;
    }
    
    setLoading(true);
    
    const assignmentData = {
      school_id: String(selectedSchool),
      batch_id: String(selectedAssignmentBatch),
      class_id: String(selectedAssignmentClass),
      section_id: String(selectedAssignmentSections[0]),
      subject_ids: selectedAssignmentSubjects.map(id => String(id))
    };
    
    const { data, error } = await supabaseService.updateSubjectAssignment(editingAssignment.id, assignmentData);
    
    if (error) {
      console.error('Error updating subject assignment:', error);
      alert(`Error updating subject assignment: ${error.message}`);
    } else {
      alert('Subject assignment updated successfully!');
      setShowEditAssignment(false);
      setEditingAssignment(null);
      setSelectedSchool('');
      setSelectedAssignmentBatch('');
      setSelectedAssignmentClass('');
      setSelectedAssignmentSections([]);
      setSelectedAssignmentSubjects([]);
      loadSubjectAssignments();
    }
    setLoading(false);
  };

  const handleDeleteAssignment = async (assignment: any) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      setLoading(true);
      const { error } = await supabaseService.deleteSubjectAssignment(assignment.id);
      
      if (error) {
        console.error('Error deleting subject assignment:', error);
        alert(`Error deleting subject assignment: ${error.message}`);
      } else {
        alert('Subject assignment deleted successfully!');
        loadSubjectAssignments();
      }
      setLoading(false);
    }
  };

  const handleSearchAssignments = () => {
    let filtered = [...subjectAssignments];
    
    if (selectedSchool) {
      filtered = filtered.filter(a => String(a.school_id) === String(selectedSchool));
    }
    if (selectedAssignmentBatch) {
      filtered = filtered.filter(a => String(a.batch_id) === String(selectedAssignmentBatch));
    }
    if (selectedAssignmentClass) {
      filtered = filtered.filter(a => String(a.class_id) === String(selectedAssignmentClass));
    }
    if (selectedAssignmentSections.length > 0) {
      filtered = filtered.filter(a => String(a.section_id) === String(selectedAssignmentSections[0]));
    }
    
    setFilteredAssignments(filtered);
  };

  const handleSearchStudentSubjects = async () => {
    console.log('Search filters:', { selectedStudentSchool, selectedStudentBatch, selectedStudentClass, selectedStudentSection });
    console.log('All students:', students);
    
    let filtered = [...students];
    
    // If no filters selected, show all students
    if (!selectedStudentSchool && !selectedStudentBatch && !selectedStudentClass && !selectedStudentSection) {
      setStudentSubjectResults(filtered);
      return;
    }
    
    if (selectedStudentSchool) {
      const schoolName = schools.find(s => String(s.id) === String(selectedStudentSchool))?.school_name;
      filtered = filtered.filter(s => {
        const studentSchool = s.school_id || s.schoolId || s.school || '';
        const match = String(studentSchool) === String(selectedStudentSchool) || 
                     String(studentSchool) === schoolName;
        console.log('School filter:', studentSchool, 'vs', selectedStudentSchool, 'or', schoolName, 'match:', match);
        return match;
      });
    }
    
    if (selectedStudentBatch) {
      const batchName = batches.find(b => String(b.id) === String(selectedStudentBatch))?.batch_no;
      filtered = filtered.filter(s => {
        const studentBatch = s.batch_id || s.batchId || s.batch_no || s.batchNo || s.batch || '';
        const match = String(studentBatch) === String(selectedStudentBatch) || 
                     String(studentBatch) === batchName;
        console.log('Batch filter:', studentBatch, 'vs', selectedStudentBatch, 'or', batchName, 'match:', match);
        return match;
      });
    }
    
    if (selectedStudentClass) {
      const className = classes.find(c => String(c.id) === String(selectedStudentClass))?.class_name;
      filtered = filtered.filter(s => {
        const studentClass = s.class_id || s.classId || s.class || '';
        const match = String(studentClass) === String(selectedStudentClass) || 
                     String(studentClass) === className;
        console.log('Class filter:', studentClass, 'vs', selectedStudentClass, 'or', className, 'match:', match);
        return match;
      });
    }
    
    if (selectedStudentSection) {
      const sectionName = sections.find(s => String(s.id) === String(selectedStudentSection))?.section_name;
      filtered = filtered.filter(s => {
        const studentSection = s.section_id || s.sectionId || s.section || '';
        const match = String(studentSection) === String(selectedStudentSection) || 
                     String(studentSection) === sectionName;
        console.log('Section filter:', studentSection, 'vs', selectedStudentSection, 'or', sectionName, 'match:', match);
        return match;
      });
    }
    
    console.log('Filtered results:', filtered);
    setStudentSubjectResults(filtered);
    
    // Load existing assignments for the selected subject
    if (selectedStudentSubject) {
      console.log('Loading assignments for subject:', selectedStudentSubject);
      const { data, error } = await supabaseService.getStudentSubjectAssignmentsBySubject(selectedStudentSubject);
      console.log('Existing assignments:', data, error);
      if (!error && data) {
        setExistingAssignments(data);
        // Auto-select students who already have this subject assigned
        const assignedStudentIds = data.map(a => a.student_id);
        console.log('Auto-selecting students:', assignedStudentIds);
        setSelectedStudents(assignedStudentIds);
      } else {
        setExistingAssignments([]);
      }
    }
  };

  const handleSubmitStudentSubjects = async () => {
    if (!selectedStudentSubject) {
      alert('Please select a subject');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Get current assignments for this subject
      const { data: currentAssignments } = await supabaseService.getStudentSubjectAssignmentsBySubject(selectedStudentSubject);
      const currentStudentIds = currentAssignments?.map(a => a.student_id) || [];
      
      // Find students to add and remove
      const studentsToAdd = selectedStudents.filter(id => !currentStudentIds.includes(id));
      const studentsToRemove = currentStudentIds.filter(id => !selectedStudents.includes(id));
      
      // Remove unselected assignments
      for (const studentId of studentsToRemove) {
        await supabaseService.deleteStudentSubjectAssignments(studentId, selectedStudentSubject);
      }
      
      // Add new assignments
      if (studentsToAdd.length > 0) {
        const assignmentData = studentsToAdd.map(studentId => ({
          student_id: String(studentId),
          subject_id: String(selectedStudentSubject),
          school_id: String(selectedStudentSchool || ''),
          batch_id: String(selectedStudentBatch || ''),
          class_id: String(selectedStudentClass || ''),
          section_id: String(selectedStudentSection || '')
        }));
        
        await supabaseService.createStudentSubjectAssignments(assignmentData);
      }
      
      alert(`Successfully updated assignments! Added: ${studentsToAdd.length}, Removed: ${studentsToRemove.length}`);
      
      // Refresh the assignments
      handleSearchStudentSubjects();
      
    } catch (error: any) {
      console.error('Error updating student subjects:', error);
      alert(`Error: ${error.message}`);
    }
    
    setSubmitting(false);
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabaseService.supabase.from('students').select('*');
      if (error) {
        console.error('Error loading students:', error);
      } else {
        setStudents(data || []);
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  };

  const loadDepartments = async () => {
    const { data, error } = await supabaseService.getDepartments();
    if (error) {
      console.error('Error loading departments:', error);
    } else {
      setDepartments(data || []);
    }
  };

  const handleCreateDepartment = async () => {
    setLoading(true);
    const departmentData = {
      order_no: departmentFormData.orderNo,
      department_name: departmentFormData.departmentName,
      short_name: departmentFormData.shortName,
      about_department: departmentFormData.aboutDepartment
    };
    
    const { data, error } = await supabaseService.createDepartment(departmentData);
    
    if (error) {
      console.error('Error creating department:', error);
      alert(`Error creating department: ${error.message}`);
    } else {
      alert('Department created successfully!');
      setDepartmentFormData({ orderNo: 1, departmentName: '', shortName: '', aboutDepartment: '' });
      loadDepartments();
    }
    setLoading(false);
  };

  const handleEditDepartment = (department: any) => {
    setEditingDepartment(department);
    setDepartmentFormData({
      orderNo: department.order_no,
      departmentName: department.department_name,
      shortName: department.short_name,
      aboutDepartment: department.about_department || ''
    });
    setShowEditDepartment(true);
  };

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return;
    
    setLoading(true);
    const departmentData = {
      order_no: departmentFormData.orderNo,
      department_name: departmentFormData.departmentName,
      short_name: departmentFormData.shortName,
      about_department: departmentFormData.aboutDepartment
    };
    
    const { data, error } = await supabaseService.updateDepartment(editingDepartment.id, departmentData);
    
    if (error) {
      console.error('Error updating department:', error);
      alert(`Error updating department: ${error.message}`);
    } else {
      alert('Department updated successfully!');
      setShowEditDepartment(false);
      setEditingDepartment(null);
      setDepartmentFormData({ orderNo: 1, departmentName: '', shortName: '', aboutDepartment: '' });
      loadDepartments();
    }
    setLoading(false);
  };

  const handleDeleteDepartment = async (department: any) => {
    if (window.confirm(`Are you sure you want to delete "${department.department_name}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteDepartment(department.id);
      
      if (error) {
        console.error('Error deleting department:', error);
        alert(`Error deleting department: ${error.message}`);
      } else {
        alert('Department deleted successfully!');
        loadDepartments();
      }
      setLoading(false);
    }
  };

  const loadDesignations = async () => {
    const { data, error } = await supabaseService.getDesignations();
    if (error) {
      console.error('Error loading designations:', error);
    } else {
      setDesignations(data || []);
    }
  };

  const handleCreateDesignation = async () => {
    setLoading(true);
    const designationData = {
      department_id: designationFormData.departmentId,
      designation_name: designationFormData.designationName,
      short_name: designationFormData.shortName
    };
    
    const { data, error } = await supabaseService.createDesignation(designationData);
    
    if (error) {
      console.error('Error creating designation:', error);
      alert(`Error creating designation: ${error.message}`);
    } else {
      alert('Designation created successfully!');
      setDesignationFormData({ departmentId: '', designationName: '', shortName: '' });
      loadDesignations();
    }
    setLoading(false);
  };

  const handleEditDesignation = (designation: any) => {
    setEditingDesignation(designation);
    setDesignationFormData({
      departmentId: designation.department_id,
      designationName: designation.designation_name,
      shortName: designation.short_name
    });
    setShowEditDesignation(true);
  };

  const handleUpdateDesignation = async () => {
    if (!editingDesignation) return;
    
    setLoading(true);
    const designationData = {
      department_id: designationFormData.departmentId,
      designation_name: designationFormData.designationName,
      short_name: designationFormData.shortName
    };
    
    const { data, error } = await supabaseService.updateDesignation(editingDesignation.id, designationData);
    
    if (error) {
      console.error('Error updating designation:', error);
      alert(`Error updating designation: ${error.message}`);
    } else {
      alert('Designation updated successfully!');
      setShowEditDesignation(false);
      setEditingDesignation(null);
      setDesignationFormData({ departmentId: '', designationName: '', shortName: '' });
      loadDesignations();
    }
    setLoading(false);
  };

  const handleDeleteDesignation = async (designation: any) => {
    if (window.confirm(`Are you sure you want to delete "${designation.designation_name}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteDesignation(designation.id);
      
      if (error) {
        console.error('Error deleting designation:', error);
        alert(`Error deleting designation: ${error.message}`);
      } else {
        alert('Designation deleted successfully!');
        loadDesignations();
      }
      setLoading(false);
    }
  };

  const handleAddBatchClasses = async () => {
    if (!selectedBatch || selectedClasses.length === 0) {
      alert('Please select a batch and at least one class');
      return;
    }
    
    setLoading(true);
    const batchClassData = {
      batch_id: selectedBatch,
      class_ids: selectedClasses
    };
    
    const { data, error } = await supabaseService.createBatchClass(batchClassData);
    
    if (error) {
      console.error('Error creating batch class:', error);
      alert(`Error creating batch class: ${error.message}`);
    } else {
      alert('Batch classes added successfully!');
      setSelectedBatch('');
      setSelectedClasses([]);
      loadBatchClasses();
    }
    setLoading(false);
  };

  const loadSections = async () => {
    console.log('Loading sections from Supabase...');
    try {
      const { data, error } = await supabaseService.getSections();
      console.log('Sections response:', { data, error });
      if (error) {
        console.error('Error loading sections:', error);
        setSections([]);
      } else {
        console.log('Sections loaded successfully:', data);
        setSections(data || []);
      }
    } catch (error) {
      console.error('Error loading sections:', error);
      setSections([]);
    }
  };

  const handleSectionToggle = (sectionId: string) => {
    setSelectedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleSectionInputChange = (field: string, value: string) => {
    setSectionFormData(prev => ({ ...prev, [field]: value }));
  };

  const loadManageSections = async () => {
    const { data, error } = await supabaseService.getManageSections();
    if (error) {
      console.error('Error loading manage sections:', error);
    } else {
      setManageSections(data || []);
    }
  };

  const handleEditManageSection = (item: any) => {
    setEditingManageSection(item);
    setSelectedSectionBatch(item.batch_id);
    setSelectedSectionClass(item.class_id);
    setSelectedSections(item.section_ids || []);
    setShowEditManageSection(true);
  };

  const handleUpdateManageSection = async () => {
    if (!editingManageSection || !selectedSectionBatch || !selectedSectionClass || selectedSections.length === 0) {
      alert('Please select batch, class and at least one section');
      return;
    }
    
    setLoading(true);
    const manageSectionData = {
      batch_id: selectedSectionBatch,
      class_id: selectedSectionClass,
      section_ids: selectedSections
    };
    
    try {
      const { data, error } = await supabaseService.updateManageSection(editingManageSection.id, manageSectionData);
      
      if (error) {
        throw new Error(error.message);
      }
      
      alert('Manage section updated successfully!');
      setShowEditManageSection(false);
      setEditingManageSection(null);
      setSelectedSectionBatch('');
      setSelectedSectionClass('');
      setSelectedSections([]);
      loadManageSections();
    } catch (error: any) {
      // Fallback to local storage update
      setManageSections(prev => prev.map(item => 
        item.id === editingManageSection.id 
          ? { ...item, ...manageSectionData, updated_at: new Date().toISOString() }
          : item
      ));
      setShowEditManageSection(false);
      setEditingManageSection(null);
      setSelectedSectionBatch('');
      setSelectedSectionClass('');
      setSelectedSections([]);
      alert('Manage section updated successfully (local storage)!');
    }
    setLoading(false);
  };

  const handleAddBatchClassSections = async () => {
    if (!selectedSectionBatch || !selectedSectionClass || selectedSections.length === 0) {
      alert('Please select batch, class and at least one section');
      return;
    }
    
    setLoading(true);
    const manageSectionData = {
      batch_id: selectedSectionBatch,
      class_id: selectedSectionClass,
      section_ids: selectedSections
    };
    
    try {
      const { data, error } = await supabaseService.createManageSection(manageSectionData);
      
      if (error) {
        throw new Error(error.message);
      }
      
      alert('Batch class sections added successfully!');
      setSelectedSectionBatch('');
      setSelectedSectionClass('');
      setSelectedSections([]);
      loadManageSections();
    } catch (error: any) {
      console.error('Supabase error, using local storage:', error);
      
      const newEntry = {
        id: Date.now().toString(),
        ...manageSectionData,
        created_at: new Date().toISOString()
      };
      
      setManageSections(prev => [...prev, newEntry]);
      setSelectedSectionBatch('');
      setSelectedSectionClass('');
      setSelectedSections([]);
      alert('Batch class sections added successfully (local storage)!');
    }
    setLoading(false);
  };

  const handleCreateSection = async () => {
    setLoading(true);
    const sectionData = {
      section_name: sectionFormData.sectionName,
      short_name: sectionFormData.shortName
    };
    
    try {
      const { data, error } = await supabaseService.createSection(sectionData);
      
      if (error) {
        console.error('Error creating section:', error);
        alert(`Error creating section: ${error.message}`);
      } else {
        alert('Section created successfully!');
        setSectionFormData({
          sectionName: '',
          shortName: ''
        });
        setShowAddSection(false);
        loadSections();
      }
    } catch (error: any) {
      console.error('Error creating section:', error);
      alert(`Error creating section: ${error.message}`);
    }
    setLoading(false);
  };

  const loadClasses = async () => {
    const { data, error } = await supabaseService.getClasses();
    if (error) {
      console.error('Error loading classes:', error);
    } else {
      setClasses(data || []);
    }
  };

  const handleClassInputChange = (field: string, value: string) => {
    setClassFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateClass = async () => {
    setLoading(true);
    const classData = {
      class_name: classFormData.className,
      short_name: classFormData.shortName
    };
    
    const { data, error } = await supabaseService.createClass(classData);
    
    if (error) {
      console.error('Error creating class:', error);
      alert(`Error creating class: ${error.message}`);
    } else {
      alert('Class created successfully!');
      setClassFormData({
        className: '',
        shortName: ''
      });
      setShowAddClass(false);
      loadClasses();
    }
    setLoading(false);
  };

  const handleEditClass = (classItem: any) => {
    setEditingClass(classItem);
    setClassFormData({
      className: classItem.class_name || '',
      shortName: classItem.short_name || ''
    });
    setShowEditClass(true);
    setShowAddClass(false);
  };

  const handleUpdateClass = async () => {
    if (!editingClass) return;
    
    setLoading(true);
    const classData = {
      class_name: classFormData.className,
      short_name: classFormData.shortName
    };
    
    const { data, error } = await supabaseService.updateClass(editingClass.id, classData);
    
    if (error) {
      console.error('Error updating class:', error);
      alert(`Error updating class: ${error.message}`);
    } else {
      alert('Class updated successfully!');
      setShowEditClass(false);
      setEditingClass(null);
      loadClasses();
    }
    setLoading(false);
  };

  const loadBatches = async () => {
    const { data, error } = await supabaseService.getBatches();
    if (error) {
      console.error('Error loading batches:', error);
    } else {
      setBatches(data || []);
    }
  };

  const handleBatchInputChange = (field: string, value: string | boolean) => {
    setBatchFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditBatch = (batch: any) => {
    setEditingBatch(batch);
    setBatchFormData({
      batchNo: batch.batch_no || '',
      shortName: batch.short_name || '',
      basedOnBatch: batch.based_on_batch || '',
      isCurrentBatch: batch.is_current_batch || false
    });
    setShowEditBatch(true);
    setShowAddBatch(false);
  };

  const handleUpdateBatch = async () => {
    if (!editingBatch) return;
    
    setLoading(true);
    const batchData = {
      batch_no: batchFormData.batchNo,
      short_name: batchFormData.shortName,
      based_on_batch: batchFormData.basedOnBatch || null,
      is_current_batch: batchFormData.isCurrentBatch
    };
    
    const { data, error } = await supabaseService.updateBatch(editingBatch.id, batchData);
    
    if (error) {
      console.error('Error updating batch:', error);
      alert(`Error updating batch: ${error.message}`);
    } else {
      alert('Batch updated successfully!');
      setShowEditBatch(false);
      setEditingBatch(null);
      loadBatches();
    }
    setLoading(false);
  };

  const handleDeleteBatch = async (batch: any) => {
    if (window.confirm(`Are you sure you want to delete "${batch.batch_no}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteBatch(batch.id);
      
      if (error) {
        console.error('Error deleting batch:', error);
        alert(`Error deleting batch: ${error.message}`);
      } else {
        alert('Batch deleted successfully!');
        loadBatches();
      }
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    setLoading(true);
    const batchData = {
      batch_no: batchFormData.batchNo,
      short_name: batchFormData.shortName,
      based_on_batch: batchFormData.basedOnBatch || null,
      is_current_batch: batchFormData.isCurrentBatch
    };
    
    const { data, error } = await supabaseService.createBatch(batchData);
    
    if (error) {
      console.error('Error creating batch:', error);
      alert(`Error creating batch: ${error.message}`);
    } else {
      alert('Batch created successfully!');
      setBatchFormData({
        batchNo: '',
        shortName: '',
        basedOnBatch: '',
        isCurrentBatch: false
      });
      setShowAddBatch(false);
      loadBatches();
    }
    setLoading(false);
  };

  const loadSchools = async () => {
    const { data, error } = await supabaseService.getSchools();
    if (error) {
      console.error('Error loading schools:', error);
    } else {
      console.log('Schools loaded:', data);
      setSchools(data || []);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field === 'state') {
        return { ...prev, [field]: value, city: '' };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    console.log('Submitting branch data:', formData);
    
    const branchData = {
      branch_name: formData.branchName,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      phone_no: formData.phoneNo,
      address: formData.address,
      email: formData.email,
      website_url: formData.websiteUrl,
      short_name: formData.shortName,
      is_active: formData.isActive
    };
    
    console.log('Sending to Supabase:', branchData);
    
    const { data, error } = await supabaseService.createBranch(branchData);
    
    console.log('Supabase response:', { data, error });
    
    if (error) {
      console.error('Supabase error details:', error);
      alert(`Error creating branch: ${error.message}`);
    } else {
      alert('Branch created successfully!');
      setFormData({
        branchName: '',
        country: 'Nepal',
        state: '',
        city: '',
        phoneNo: '',
        address: '',
        email: '',
        websiteUrl: '',
        shortName: '',
        isActive: true
      });
      setShowAddForm(false);
      loadBranches();
    }
    setLoading(false);
  };

  const handleEdit = (branch: any) => {
    setEditingBranch(branch);
    setFormData({
      branchName: branch.branch_name || '',
      country: branch.country || 'Nepal',
      state: branch.state || '',
      city: branch.city || '',
      phoneNo: branch.phone_no || '',
      address: branch.address || '',
      email: branch.email || '',
      websiteUrl: branch.website_url || '',
      shortName: branch.short_name || '',
      isActive: branch.is_active !== undefined ? branch.is_active : true
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async () => {
    if (!editingBranch) return;
    
    setLoading(true);
    const branchData = {
      branch_name: formData.branchName,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      phone_no: formData.phoneNo,
      address: formData.address,
      email: formData.email,
      website_url: formData.websiteUrl,
      short_name: formData.shortName,
      is_active: formData.isActive
    };
    
    const { data, error } = await supabaseService.updateBranch(editingBranch.id, branchData);
    
    if (error) {
      console.error('Error updating branch:', error);
      alert(`Error updating branch: ${error.message}`);
    } else {
      alert('Branch updated successfully!');
      setShowEditForm(false);
      setEditingBranch(null);
      loadBranches();
    }
    setLoading(false);
  };

  const handleDelete = async (branch: any) => {
    if (window.confirm(`Are you sure you want to delete "${branch.branch_name}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteBranch(branch.id);
      
      if (error) {
        console.error('Error deleting branch:', error);
        alert(`Error deleting branch: ${error.message}`);
      } else {
        alert('Branch deleted successfully!');
        loadBranches();
      }
      setLoading(false);
    }
  };

  const handleEditSchool = (school: any) => {
    setEditingSchool(school);
    setSchoolFormData({
      schoolName: school.school_name || '',
      director: school.director || '',
      panNo: school.pan_no || '',
      prefixId: school.prefix_id || '',
      startingPoint: school.starting_point || '',
      shortName: school.short_name || '',
      accountantNo: school.accountant_no || '',
      feeDueNote: school.fee_due_note || '',
      feeReceiptNote: school.fee_receipt_note || '',
      logoFile: null,
      signatureFile: null,
      country: school.country || 'Nepal',
      state: school.state || 'Lalitpur',
      city: school.city || 'Lalitpur',
      phoneNo: school.phone || '015261023',
      address: school.address || '',
      email: school.email || 'anil.maxconnect@gmail.com',
      websiteUrl: school.website_url || ''
    });
    setShowEditSchool(true);
  };

  const uploadFile = async (file: File, folder: string): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      const { data, error } = await supabaseService.supabase.storage
        .from('school-files')
        .upload(filePath, file);

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      const { data: { publicUrl } } = supabaseService.supabase.storage
        .from('school-files')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('File upload failed:', error);
      return null;
    }
  };

  const handleSchoolInputChange = (field: string, value: string | File | string[]) => {
    setSchoolFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleBranchToggle = (branchId: string) => {
    setSchoolFormData(prev => ({
      ...prev,
      branchIds: prev.branchIds.includes(branchId)
        ? prev.branchIds.filter(id => id !== branchId)
        : [...prev.branchIds, branchId]
    }));
  };

  const handleCreateSchool = async () => {
    if (schools.length >= 1) {
      alert('Only one school is allowed. Please edit the existing school instead.');
      return;
    }
    
    setLoading(true);
    
    let logoUrl = null;
    let signatureUrl = null;
    
    if (schoolFormData.logoFile) {
      logoUrl = await uploadFile(schoolFormData.logoFile, 'logos');
    }
    
    if (schoolFormData.signatureFile) {
      signatureUrl = await uploadFile(schoolFormData.signatureFile, 'signatures');
    }
    
    const schoolData = {
      school_name: schoolFormData.schoolName,
      director: schoolFormData.director,
      pan_no: schoolFormData.panNo,
      prefix_id: schoolFormData.prefixId,
      starting_point: schoolFormData.startingPoint,
      short_name: schoolFormData.shortName,
      accountant_no: schoolFormData.accountantNo,
      fee_due_note: schoolFormData.feeDueNote,
      fee_receipt_note: schoolFormData.feeReceiptNote,
      logo_url: logoUrl,
      signature_url: signatureUrl,
      country: schoolFormData.country,
      state: schoolFormData.state,
      city: schoolFormData.city,
      phone: schoolFormData.phoneNo,
      address: schoolFormData.address,
      email: schoolFormData.email,
      website_url: schoolFormData.websiteUrl
    };
    
    const { data, error } = await supabaseService.createSchool(schoolData);
    
    if (error) {
      console.error('Error creating school:', error);
      alert(`Error creating school: ${error.message}`);
    } else {
      alert('School created successfully!');
      setSchoolFormData({
        schoolName: '',
        director: '',
        panNo: '',
        prefixId: '',
        startingPoint: '',
        shortName: '',
        accountantNo: '',
        feeDueNote: '',
        feeReceiptNote: '',
        logoFile: null,
        signatureFile: null,
        country: 'Nepal',
        state: 'Lalitpur',
        city: 'Lalitpur',
        phoneNo: '015261023',
        address: '',
        email: 'anil.maxconnect@gmail.com',
        websiteUrl: ''
      });
      setShowAddSchool(false);
      loadSchools();
    }
    setLoading(false);
  };

  const handleDeleteSchool = async (school: any) => {
    if (window.confirm(`Are you sure you want to delete "${school.school_name}"?`)) {
      setLoading(true);
      const { error } = await supabaseService.deleteSchool(school.id);
      
      if (error) {
        console.error('Error deleting school:', error);
        alert(`Error deleting school: ${error.message}`);
      } else {
        alert('School deleted successfully!');
        loadSchools();
      }
      setLoading(false);
    }
  };

  const handleUpdateSchool = async () => {
    if (!editingSchool) return;
    
    setLoading(true);
    
    let logoUrl = editingSchool.logo_url;
    let signatureUrl = editingSchool.signature_url;
    
    if (schoolFormData.logoFile) {
      logoUrl = await uploadFile(schoolFormData.logoFile, 'logos');
    }
    
    if (schoolFormData.signatureFile) {
      signatureUrl = await uploadFile(schoolFormData.signatureFile, 'signatures');
    }
    
    const schoolData = {
      school_name: schoolFormData.schoolName,
      director: schoolFormData.director,
      pan_no: schoolFormData.panNo,
      prefix_id: schoolFormData.prefixId,
      starting_point: schoolFormData.startingPoint,
      short_name: schoolFormData.shortName,
      accountant_no: schoolFormData.accountantNo,
      fee_due_note: schoolFormData.feeDueNote,
      fee_receipt_note: schoolFormData.feeReceiptNote,
      logo_url: logoUrl,
      signature_url: signatureUrl,
      country: schoolFormData.country,
      state: schoolFormData.state,
      city: schoolFormData.city,
      phone: schoolFormData.phoneNo,
      address: schoolFormData.address,
      email: schoolFormData.email,
      website_url: schoolFormData.websiteUrl
    };
    
    const { data, error } = await supabaseService.updateSchool(editingSchool.id, schoolData);
    
    if (error) {
      console.error('Error updating school:', error);
      alert(`Error updating school: ${error.message}`);
    } else {
      alert('School updated successfully!');
      setShowEditSchool(false);
      setEditingSchool(null);
      loadSchools();
    }
    setLoading(false);
  };

  const filteredBranches = branches.filter((branch: any) => 
    branch.branch_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    branch.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [activeModule, setActiveModule] = useState(() => {
    const path = location.pathname;
    if (path.includes('manage_branch')) return 'manage_branch';
    if (path.includes('manage_school')) return 'manage_school';
    if (path.includes('add_batch')) return 'add_batch';
    if (path.includes('add_class')) return 'add_class';
    if (path.includes('add_section')) return 'add_section';
    if (path.includes('manage_class')) return 'manage_class';
    if (path.includes('manage_section')) return 'manage_section';
    if (path.includes('manage_religion')) return 'manage_religion';
    if (path.includes('manage_nationality')) return 'manage_nationality';
    if (path.includes('manage_student_cast')) return 'manage_student_cast';
    if (path.includes('add_subject')) return 'add_subject';
    if (path.includes('manage_subject_to_student')) return 'manage_subject_to_student';
    if (path.includes('manage_subject')) return 'manage_subject';
    if (path.includes('subject_masters')) return 'subject_masters';
    if (path.includes('manage_calendar')) return 'manage_calendar';
    if (path.includes('manage_sms_template')) return 'manage_sms_template';
    if (path.includes('manage_blood_group')) return 'manage_blood_group';
    if (path.includes('manage_department')) return 'manage_department';
    if (path.includes('manage_designation')) return 'manage_designation';
    if (path.includes('class_subjects_teacher')) return 'class_subjects_teacher';
    return 'manage_branch';
  });

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('manage_branch')) setActiveModule('manage_branch');
    else if (path.includes('manage_school')) setActiveModule('manage_school');
    else if (path.includes('add_batch')) setActiveModule('add_batch');
    else if (path.includes('add_class')) setActiveModule('add_class');
    else if (path.includes('add_section')) setActiveModule('add_section');
    else if (path.includes('manage_class')) setActiveModule('manage_class');
    else if (path.includes('manage_section')) setActiveModule('manage_section');
    else if (path.includes('manage_religion')) setActiveModule('manage_religion');
    else if (path.includes('manage_nationality')) setActiveModule('manage_nationality');
    else if (path.includes('manage_student_cast')) setActiveModule('manage_student_cast');
    else if (path.includes('add_subject')) setActiveModule('add_subject');
    else if (path.includes('manage_subject_to_student')) setActiveModule('manage_subject_to_student');
    else if (path.includes('manage_subject')) setActiveModule('manage_subject');
    else if (path.includes('subject_masters')) setActiveModule('subject_masters');
    else if (path.includes('manage_calendar')) setActiveModule('manage_calendar');
    else if (path.includes('manage_sms_template')) setActiveModule('manage_sms_template');
    else if (path.includes('manage_blood_group')) setActiveModule('manage_blood_group');
    else if (path.includes('manage_department')) setActiveModule('manage_department');
    else if (path.includes('manage_designation')) setActiveModule('manage_designation');
    else if (path.includes('class_subjects_teacher')) setActiveModule('class_subjects_teacher');
  }, [location.pathname]);

  const handleNext = () => {
    setActiveModule('manage_school');
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'manage_school':
        if (showEditSchool && editingSchool) {
          return (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Manage School
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">School:</label>
                    <input 
                      value={schoolFormData.schoolName}
                      onChange={(e) => handleSchoolInputChange('schoolName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Director:</label>
                    <input 
                      value={schoolFormData.director}
                      onChange={(e) => handleSchoolInputChange('director', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Pan No.:</label>
                    <input 
                      value={schoolFormData.panNo}
                      onChange={(e) => handleSchoolInputChange('panNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">PrefixID:</label>
                    <input 
                      value={schoolFormData.prefixId}
                      onChange={(e) => handleSchoolInputChange('prefixId', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">StartingPoint:</label>
                    <input 
                      value={schoolFormData.startingPoint}
                      onChange={(e) => handleSchoolInputChange('startingPoint', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={schoolFormData.shortName}
                      onChange={(e) => handleSchoolInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Logo:</label>
                    {editingSchool?.logo_url && (
                      <div className="mb-2">
                        <img 
                          src={editingSchool.logo_url} 
                          alt="Current Logo" 
                          className="w-20 h-20 object-cover border rounded" 
                          onError={(e) => {
                            console.log('Logo URL error:', editingSchool.logo_url);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">Current Logo</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchoolInputChange('logoFile', e.target.files?.[0] || null)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Signature:</label>
                    {editingSchool?.signature_url && (
                      <div className="mb-2">
                        <img src={editingSchool.signature_url} alt="Current Signature" className="w-20 h-20 object-cover border rounded" />
                        <p className="text-xs text-gray-500 mt-1">Current Signature</p>
                      </div>
                    )}
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchoolInputChange('signatureFile', e.target.files?.[0] || null)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Country:</label>
                    <input 
                      value={schoolFormData.country}
                      onChange={(e) => handleSchoolInputChange('country', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">State:</label>
                    <input 
                      value={schoolFormData.state}
                      onChange={(e) => handleSchoolInputChange('state', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">City:</label>
                    <input 
                      value={schoolFormData.city}
                      onChange={(e) => handleSchoolInputChange('city', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">PhoneNo:</label>
                    <input 
                      value={schoolFormData.phoneNo}
                      onChange={(e) => handleSchoolInputChange('phoneNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Address:</label>
                    <input 
                      value={schoolFormData.address}
                      onChange={(e) => handleSchoolInputChange('address', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Email ID:</label>
                    <input 
                      value={schoolFormData.email}
                      onChange={(e) => handleSchoolInputChange('email', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Website URL:</label>
                    <input 
                      value={schoolFormData.websiteUrl}
                      onChange={(e) => handleSchoolInputChange('websiteUrl', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Accountant No.:</label>
                    <input 
                      value={schoolFormData.accountantNo}
                      onChange={(e) => handleSchoolInputChange('accountantNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Due Note:</label>
                    <textarea 
                      value={schoolFormData.feeDueNote}
                      onChange={(e) => handleSchoolInputChange('feeDueNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Receipt Note:</label>
                    <textarea 
                      value={schoolFormData.feeReceiptNote}
                      onChange={(e) => handleSchoolInputChange('feeReceiptNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleUpdateSchool}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE'}
                  </button>
                  <button 
                    onClick={() => setShowEditSchool(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage School
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search schools..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  if (schools.length >= 1) {
                    alert('Only one school is allowed. Please edit the existing school instead.');
                    return;
                  }
                  setShowAddSchool(!showAddSchool);
                  setShowEditSchool(false);
                  setSchoolFormData({
                    schoolName: '',
                    director: '',
                    panNo: '',
                    prefixId: '',
                    startingPoint: '',
                    shortName: '',
                    accountantNo: '',
                    branchIds: [],
                    feeDueNote: '',
                    feeReceiptNote: '',
                    logoFile: null,
                    signatureFile: null,
                    country: 'Nepal',
                    state: 'Lalitpur',
                    city: 'Lalitpur',
                    phoneNo: '015261023',
                    address: '',
                    email: 'anil.maxconnect@gmail.com',
                    websiteUrl: ''
                  });
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  schools.length >= 1 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={schools.length >= 1}
              >
                <Plus size={16} />
                {showAddSchool ? 'Cancel' : 'Add New School'}
              </button>
            </div>

            {showAddSchool && (
              <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-md font-bold text-gray-700">Add New School</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">School:</label>
                    <input 
                      value={schoolFormData.schoolName}
                      onChange={(e) => handleSchoolInputChange('schoolName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter school name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Director:</label>
                    <input 
                      value={schoolFormData.director}
                      onChange={(e) => handleSchoolInputChange('director', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter director name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Pan No.:</label>
                    <input 
                      value={schoolFormData.panNo}
                      onChange={(e) => handleSchoolInputChange('panNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter PAN number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">PrefixID:</label>
                    <input 
                      value={schoolFormData.prefixId}
                      onChange={(e) => handleSchoolInputChange('prefixId', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter prefix ID"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">StartingPoint:</label>
                    <input 
                      value={schoolFormData.startingPoint}
                      onChange={(e) => handleSchoolInputChange('startingPoint', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter starting point"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={schoolFormData.shortName}
                      onChange={(e) => handleSchoolInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter short name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Logo:</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchoolInputChange('logoFile', e.target.files?.[0] || null)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Upload Signature:</label>
                    <input 
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSchoolInputChange('signatureFile', e.target.files?.[0] || null)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Country:</label>
                    <input 
                      value={schoolFormData.country}
                      onChange={(e) => handleSchoolInputChange('country', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter country"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">State:</label>
                    <input 
                      value={schoolFormData.state}
                      onChange={(e) => handleSchoolInputChange('state', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">City:</label>
                    <input 
                      value={schoolFormData.city}
                      onChange={(e) => handleSchoolInputChange('city', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">PhoneNo:</label>
                    <input 
                      value={schoolFormData.phoneNo}
                      onChange={(e) => handleSchoolInputChange('phoneNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Address:</label>
                    <input 
                      value={schoolFormData.address}
                      onChange={(e) => handleSchoolInputChange('address', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter address"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Email ID:</label>
                    <input 
                      value={schoolFormData.email}
                      onChange={(e) => handleSchoolInputChange('email', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter email address"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Website URL:</label>
                    <input 
                      value={schoolFormData.websiteUrl}
                      onChange={(e) => handleSchoolInputChange('websiteUrl', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter website URL"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Accountant No.:</label>
                    <input 
                      value={schoolFormData.accountantNo}
                      onChange={(e) => handleSchoolInputChange('accountantNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter accountant number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Due Note:</label>
                    <textarea 
                      value={schoolFormData.feeDueNote}
                      onChange={(e) => handleSchoolInputChange('feeDueNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter fee due note"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Fee Receipt Note:</label>
                    <textarea 
                      value={schoolFormData.feeReceiptNote}
                      onChange={(e) => handleSchoolInputChange('feeReceiptNote', e.target.value)}
                      rows={3}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter fee receipt note"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 p-6 pt-0">
                  <button 
                    onClick={handleCreateSchool}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'CREATING...' : 'CREATE'}
                  </button>
                  <button 
                    onClick={() => setShowAddSchool(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[1200px]">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Logo</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">School</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Student Prefix ID</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Starting Point</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Short Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage Week Off</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage About Us</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage App Screen</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Manage School Physical</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {schools.map((school: any) => (
                      <tr key={school.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          {school.logo_url ? (
                            <img 
                              src={school.logo_url} 
                              alt="School Logo" 
                              className="w-12 h-12 object-cover rounded-lg border"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">{school.prefix_id}</span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{school.school_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{school.prefix_id}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{school.starting_point}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{school.short_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium hover:bg-green-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium hover:bg-purple-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium hover:bg-orange-200 transition-colors">
                            Manage
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleEditSchool(school)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteSchool(school)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" 
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'add_batch':
        if (showEditBatch && editingBatch) {
          return (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Edit Batch
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">BatchNo:</label>
                    <input 
                      value={batchFormData.batchNo}
                      onChange={(e) => handleBatchInputChange('batchNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={batchFormData.shortName}
                      onChange={(e) => handleBatchInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Current Batch:</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={batchFormData.isCurrentBatch}
                        onChange={(e) => handleBatchInputChange('isCurrentBatch', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Set as Current Batch</span>
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Base On Batch:</label>
                    <select 
                      value={batchFormData.basedOnBatch}
                      onChange={(e) => handleBatchInputChange('basedOnBatch', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                    >
                      <option value="">--Select Batch Year--</option>
                      {batches.filter(b => b.id !== editingBatch?.id).map((batch: any) => (
                        <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleUpdateBatch}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE'}
                  </button>
                  <button 
                    onClick={() => setShowEditBatch(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Batch
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search batches..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddBatch(!showAddBatch);
                  setBatchFormData({
                    batchNo: '',
                    shortName: '',
                    basedOnBatch: '',
                    isCurrentBatch: false
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                {showAddBatch ? 'Cancel' : 'Add New Batch'}
              </button>
            </div>

            {showAddBatch && (
              <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-md font-bold text-gray-700">Add New Batch</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">BatchNo:</label>
                    <input 
                      value={batchFormData.batchNo}
                      onChange={(e) => handleBatchInputChange('batchNo', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter batch number"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={batchFormData.shortName}
                      onChange={(e) => handleBatchInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter short name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Current Batch:</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={batchFormData.isCurrentBatch}
                        onChange={(e) => handleBatchInputChange('isCurrentBatch', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Set as Current Batch</span>
                    </label>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Base On Batch:</label>
                    <select 
                      value={batchFormData.basedOnBatch}
                      onChange={(e) => handleBatchInputChange('basedOnBatch', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                    >
                      <option value="">--Select Batch Year--</option>
                      {batches.map((batch: any) => (
                        <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 p-6 pt-0">
                  <button 
                    onClick={handleCreateBatch}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'CREATING...' : 'CREATE'}
                  </button>
                  <button 
                    onClick={() => setShowAddBatch(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch No</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {batches.map((batch: any) => (
                      <tr key={batch.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{batch.batch_no}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{batch.short_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button 
                            onClick={() => handleEditBatch(batch)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'add_class':
        if (showEditClass && editingClass) {
          return (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Edit Class
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Class:</label>
                    <input 
                      value={classFormData.className}
                      onChange={(e) => handleClassInputChange('className', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={classFormData.shortName}
                      onChange={(e) => handleClassInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <button 
                    onClick={handleUpdateClass}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE'}
                  </button>
                  <button 
                    onClick={() => setShowEditClass(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Class
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search classes..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddClass(!showAddClass);
                  setClassFormData({
                    className: '',
                    shortName: ''
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                {showAddClass ? 'Cancel' : 'Add New Class'}
              </button>
            </div>

            {showAddClass && (
              <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-md font-bold text-gray-700">Add New Class</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Class:</label>
                    <input 
                      value={classFormData.className}
                      onChange={(e) => handleClassInputChange('className', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter class name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={classFormData.shortName}
                      onChange={(e) => handleClassInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter short name"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 p-6 pt-0">
                  <button 
                    onClick={handleCreateClass}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'CREATING...' : 'CREATE'}
                  </button>
                  <button 
                    onClick={() => setShowAddClass(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {classes.map((classItem: any) => (
                      <tr key={classItem.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{classItem.class_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{classItem.short_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button 
                            onClick={() => handleEditClass(classItem)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'add_section':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Section
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search sections..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddSection(!showAddSection);
                  setSectionFormData({
                    sectionName: '',
                    shortName: ''
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                {showAddSection ? 'Cancel' : 'Add New Section'}
              </button>
            </div>

            {showAddSection && (
              <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
                <div className="p-4 bg-gray-50 border-b">
                  <h3 className="text-md font-bold text-gray-700">Add New Section</h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">Section:</label>
                    <input 
                      value={sectionFormData.sectionName}
                      onChange={(e) => handleSectionInputChange('sectionName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter section name"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-bold text-gray-700 mb-2">ShortName:</label>
                    <input 
                      value={sectionFormData.shortName}
                      onChange={(e) => handleSectionInputChange('shortName', e.target.value)}
                      className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                      placeholder="Enter short name"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6 p-6 pt-0">
                  <button 
                    onClick={handleCreateSection}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    {loading ? 'CREATING...' : 'CREATE'}
                  </button>
                  <button 
                    onClick={() => setShowAddSection(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Short Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {sections.map((section: any) => (
                      <tr key={section.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{section.section_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{section.short_name}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" title="Edit">
                            <Edit size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'manage_class':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Class
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Batches:</label>
                  <select 
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select ---</option>
                    {batches.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="grid grid-cols-6 gap-4">
                  {classes.map((classItem: any) => (
                    <label 
                      key={classItem.id}
                      className="relative p-4 border-2 border-gray-300 rounded-lg text-center font-bold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedClasses.includes(classItem.id)}
                        onChange={() => handleClassToggle(classItem.id)}
                        className="absolute top-2 right-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="mt-2">{classItem.class_name}</div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={showEditBatchClass ? handleUpdateBatchClass : handleAddBatchClasses}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  {showEditBatchClass ? 'UPDATE' : 'ADD'}
                </button>
                {showEditBatchClass && (
                  <button 
                    onClick={() => {
                      setShowEditBatchClass(false);
                      setEditingBatchClass(null);
                      setSelectedBatch('');
                      setSelectedClasses([]);
                    }}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                )}
                <button 
                  className="bg-green-600 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  NEXT
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Courses</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {batchClasses.map((item: any) => {
                      // Convert both IDs to strings for comparison
                      const batchData = batches.find((b: any) => String(b.id) === String(item.batch_id));
                      const classesData = classes.filter((c: any) => 
                        item.class_ids && item.class_ids.includes(String(c.id))
                      );
                      
                      return (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{item.id}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">
                            {batchData?.batch_no || `Batch ID: ${item.batch_id}`}
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">
                            {classesData.length > 0 ? classesData.map((c: any) => c.class_name).join(', ') : `Class IDs: ${item.class_ids?.join(', ') || 'None'}`}
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button 
                              onClick={() => handleEditBatchClass(item)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'manage_section':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Section
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Batches:</label>
                  <select 
                    value={selectedSectionBatch}
                    onChange={(e) => setSelectedSectionBatch(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select ---</option>
                    {batches.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Class:</label>
                  <select 
                    value={selectedSectionClass}
                    onChange={(e) => setSelectedSectionClass(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select ---</option>
                    {classes.map((classItem: any) => (
                      <option key={classItem.id} value={classItem.id}>{classItem.class_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Sections:</h3>
                <div className="grid grid-cols-6 gap-4">
                  {sections.map((section: any) => (
                    <label 
                      key={section.id}
                      className="relative p-4 border-2 border-gray-300 rounded-lg text-center font-bold text-gray-700 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSections.includes(section.id)}
                        onChange={() => handleSectionToggle(section.id)}
                        className="absolute top-2 right-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="mt-2">{section.section_name}</div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={showEditManageSection ? handleUpdateManageSection : handleAddBatchClassSections}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (showEditManageSection ? 'UPDATING...' : 'ADDING...') : (showEditManageSection ? 'UPDATE' : 'ADD')}
                </button>
                {showEditManageSection && (
                  <button 
                    onClick={() => {
                      setShowEditManageSection(false);
                      setEditingManageSection(null);
                      setSelectedSectionBatch('');
                      setSelectedSectionClass('');
                      setSelectedSections([]);
                    }}
                    className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                  >
                    CANCEL
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Edit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {manageSections.map((item: any) => {
                      const batchData = batches.find((b: any) => String(b.id) === String(item.batch_id));
                      const classData = classes.find((c: any) => String(c.id) === String(item.class_id));
                      const sectionData = sections.filter((s: any) => item.section_ids && item.section_ids.includes(s.id));
                      
                      return (
                        <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">
                            {batchData?.batch_no || 'N/A'}
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">
                            {classData?.class_name || 'N/A'}
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">
                            {sectionData.map(s => s.section_name).join(', ') || 'N/A'}
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button 
                              onClick={() => handleEditManageSection(item)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'subject_masters':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Subject Masters
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search subjects..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );



      case 'add_subject':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Add Subject
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Select Classes:</h3>
                <div className="grid grid-cols-6 gap-2">
                  {classes.map((classItem: any) => (
                    <label key={classItem.id} className="relative flex items-center justify-center p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                      <input 
                        type="checkbox" 
                        checked={selectedClasses.includes(String(classItem.id))}
                        onChange={() => handleClassToggle(classItem.id)}
                        className="absolute top-2 right-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      />
                      <span className="font-bold text-gray-700">{classItem.class_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Subject Code:</label>
                  <input 
                    value={subjectFormData.subjectCode}
                    onChange={(e) => setSubjectFormData(prev => ({ ...prev, subjectCode: e.target.value }))}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    placeholder="Subject Code"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Subject Name:</label>
                  <input 
                    value={subjectFormData.subjectName}
                    onChange={(e) => setSubjectFormData(prev => ({ ...prev, subjectName: e.target.value }))}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    placeholder="Subject Name"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Sort Name:</label>
                  <input 
                    value={subjectFormData.sortName}
                    onChange={(e) => setSubjectFormData(prev => ({ ...prev, sortName: e.target.value }))}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                    placeholder="Sort Name"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Order No:</label>
                  <input 
                    type="number"
                    value={subjectFormData.orderNo}
                    onChange={(e) => setSubjectFormData(prev => ({ ...prev, orderNo: parseInt(e.target.value) || 1 }))}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors" 
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button 
                  onClick={showEditSubject ? handleUpdateSubject : handleCreateSubject}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (showEditSubject ? 'UPDATING...' : 'ADDING...') : (showEditSubject ? 'UPDATE' : 'ADD')}
                </button>
                <button 
                  onClick={() => {
                    setShowEditSubject(false);
                    setEditingSubject(null);
                    setSubjectFormData({ subjectCode: '', subjectName: '', sortName: '', orderNo: 1 });
                    setSelectedClasses([]);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Code</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subject Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sort Name</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Order No</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Edit</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {subjects.map((subject) => (
                      <tr key={subject.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{subject.subject_code || subject.subjectCode}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{subject.subject_name || subject.subjectName}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{subject.sort_name || subject.sortName}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{subject.order_no || subject.orderNo}</td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button 
                            onClick={() => handleEditSubject(subject)}
                            className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                        </td>
                        <td className="px-4 lg:px-8 py-3 lg:py-5">
                          <button 
                            onClick={() => handleDeleteSubject(subject)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" 
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'manage_subject':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Subject
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">School:</label>
                  <select 
                    value={selectedSchool}
                    onChange={(e) => setSelectedSchool(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select School ---</option>
                    {schools.map((school: any) => (
                      <option key={school.id} value={school.id}>{school.school_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">BatchNo:</label>
                  <select 
                    value={selectedAssignmentBatch}
                    onChange={(e) => setSelectedAssignmentBatch(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select Batch ---</option>
                    {batches.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Class:</label>
                  <select 
                    value={selectedAssignmentClass}
                    onChange={(e) => setSelectedAssignmentClass(e.target.value)}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select Class ---</option>
                    {classes.map((classItem: any) => (
                      <option key={classItem.id} value={classItem.id}>{classItem.class_name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-bold text-gray-700 mb-2">Section:</label>
                  <select 
                    value={selectedAssignmentSections[0] || ''}
                    onChange={(e) => setSelectedAssignmentSections(e.target.value ? [e.target.value] : [])}
                    className="border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                  >
                    <option value="">--- Select Section ---</option>
                    {sections.map((section: any) => (
                      <option key={section.id} value={section.id}>{section.section_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-700 mb-4">Select Subjects:</h3>
                <div className="grid grid-cols-4 gap-4">
                  {subjects.map((subject: any) => (
                    <label key={subject.id} className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-blue-50">
                      <input 
                        type="checkbox" 
                        checked={selectedAssignmentSubjects.includes(String(subject.id))}
                        onChange={() => handleAssignmentSubjectToggle(subject.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      />
                      <span className="text-sm font-medium">{subject.subject_code} {subject.subject_name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={showEditAssignment ? handleUpdateAssignment : handleCreateSubjectAssignment}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {loading ? (showEditAssignment ? 'UPDATING...' : 'ADDING...') : (showEditAssignment ? 'UPDATE' : 'ADD')}
                </button>
                <button 
                  onClick={handleSearchAssignments}
                  className="bg-green-600 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  SEARCH
                </button>
                <button 
                  onClick={() => {
                    setShowEditAssignment(false);
                    setEditingAssignment(null);
                    setSelectedSchool('');
                    setSelectedAssignmentBatch('');
                    setSelectedAssignmentClass('');
                    setSelectedAssignmentSections([]);
                    setSelectedAssignmentSubjects([]);
                    setFilteredAssignments(subjectAssignments);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white border-b">
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Sr.No.</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">School</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Subjects</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Edit</th>
                      <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredAssignments.map((assignment: any, index: number) => {
                      const school = schools.find((s: any) => String(s.id) === String(assignment.school_id));
                      const batch = batches.find((b: any) => String(b.id) === String(assignment.batch_id));
                      const classItem = classes.find((c: any) => String(c.id) === String(assignment.class_id));
                      const assignedSection = sections.find((s: any) => String(s.id) === String(assignment.section_id));
                      const assignedSubjects = subjects.filter((s: any) => assignment.subject_ids?.includes(String(s.id)));
                      
                      return (
                        <tr key={assignment.id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-center text-gray-500 font-bold">{index + 1}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{school?.school_name || 'N/A'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{classItem?.class_name || 'N/A'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{assignedSection?.section_name || 'N/A'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{assignedSubjects.map(s => s.subject_name).join(',') || 'N/A'}</td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button 
                              onClick={() => handleEditAssignment(assignment)}
                              className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-xl transition-all" 
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                          </td>
                          <td className="px-4 lg:px-8 py-3 lg:py-5">
                            <button 
                              onClick={() => handleDeleteAssignment(assignment)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all" 
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'manage_subject_to_student':
        return (
          <div>
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Subject to Student
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Search Students</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">School</label>
                  <select 
                    value={selectedStudentSchool}
                    onChange={(e) => setSelectedStudentSchool(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium bg-gray-50 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  >
                    <option value="">Select School</option>
                    {schools.map((school: any) => (
                      <option key={school.id} value={school.id}>{school.school_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Batch</label>
                  <select 
                    value={selectedStudentBatch}
                    onChange={(e) => setSelectedStudentBatch(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium bg-gray-50 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  >
                    <option value="">Select Batch</option>
                    {batches.map((batch: any) => (
                      <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Class</label>
                  <select 
                    value={selectedStudentClass}
                    onChange={(e) => setSelectedStudentClass(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium bg-gray-50 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  >
                    <option value="">Select Class</option>
                    {classes.map((classItem: any) => (
                      <option key={classItem.id} value={classItem.id}>{classItem.class_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Section</label>
                  <select 
                    value={selectedStudentSection}
                    onChange={(e) => setSelectedStudentSection(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium bg-gray-50 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  >
                    <option value="">Select Section</option>
                    {sections.map((section: any) => (
                      <option key={section.id} value={section.id}>{section.section_name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Subject</label>
                  <select 
                    value={selectedStudentSubject}
                    onChange={(e) => setSelectedStudentSubject(e.target.value)}
                    className="w-full px-4 py-2.5 border rounded-xl text-sm font-medium bg-gray-50 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject: any) => (
                      <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-4 mt-6">
                <button 
                  onClick={handleSearchStudentSubjects}
                  className="bg-[#3498db] text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  SEARCH
                </button>
                <button 
                  onClick={() => {
                    setSelectedStudentSchool('');
                    setSelectedStudentBatch('');
                    setSelectedStudentClass('');
                    setSelectedStudentSection('');
                    setStudentSubjectResults([]);
                  }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-sm text-sm font-bold uppercase hover:opacity-90 transition-all"
                >
                  CANCEL
                </button>
                {/* Debug info */}
                <div className="text-xs text-gray-500">
                  Students: {selectedStudents.length}, Subject: {selectedStudentSubject ? 'Selected' : 'None'}
                </div>
              </div>
            </div>

            {(studentSubjectResults.length >= 0 && (selectedStudentSchool || selectedStudentBatch || selectedStudentClass || selectedStudentSection)) && (
              <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b">
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <input 
                            type="checkbox" 
                            checked={selectAll}
                            onChange={(e) => {
                              setSelectAll(e.target.checked);
                              if (e.target.checked) {
                                setSelectedStudents(studentSubjectResults.map(s => s.id));
                              } else {
                                setSelectedStudents([]);
                              }
                            }}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                          />
                          All
                        </th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Roll No</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Name</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Batch</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Class</th>
                        <th className="px-4 lg:px-8 py-3 lg:py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Section</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {studentSubjectResults.length > 0 ? studentSubjectResults.map((student: any, index: number) => {
                        const batch = batches.find((b: any) => String(b.id) === String(student.batch_id || student.batchId)) || 
                                     batches.find((b: any) => b.batch_no === (student.batch_no || student.batchNo || student.batch));
                        const classItem = classes.find((c: any) => String(c.id) === String(student.class_id || student.classId)) || 
                                         classes.find((c: any) => c.class_name === (student.class || student.className));
                        const section = sections.find((s: any) => String(s.id) === String(student.section_id || student.sectionId)) || 
                                       sections.find((s: any) => s.section_name === (student.section || student.sectionName));
                        
                        return (
                          <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                            <td className="px-4 lg:px-8 py-3 lg:py-5">
                              <input 
                                type="checkbox" 
                                checked={selectedStudents.includes(student.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStudents(prev => [...prev, student.id]);
                                  } else {
                                    setSelectedStudents(prev => prev.filter(id => id !== student.id));
                                    setSelectAll(false);
                                  }
                                }}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                              />
                              {existingAssignments.some(a => String(a.student_id) === String(student.id)) && (
                                <span className="ml-2 text-green-600 text-xs font-bold">✓ Assigned</span>
                              )}
                            </td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5 font-black text-gray-900">{student.roll_no || student.rollNo || 'N/A'}</td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{`${student.first_name || student.firstName || ''} ${student.last_name || student.lastName || ''}`.trim() || 'N/A'}</td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{batch?.batch_no || student.batch_no || student.batchNo || student.batch || 'N/A'}</td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{classItem?.class_name || student.class || student.className || 'N/A'}</td>
                            <td className="px-4 lg:px-8 py-3 lg:py-5 text-gray-600">{section?.section_name || student.section || student.sectionName || 'N/A'}</td>
                          </tr>
                        );
                      }) : (
                        <tr>
                          <td colSpan={6} className="px-4 lg:px-8 py-8 text-center text-gray-500">
                            No students found matching the search criteria
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedStudentSubject && (
              <div className="mt-6 flex justify-center">
                <button 
                  onClick={handleSubmitStudentSubjects}
                  disabled={submitting}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg text-sm font-bold uppercase hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                >
                  {submitting ? 'UPDATING...' : 'UPDATE ASSIGNMENTS'}
                </button>
              </div>
            )}
          </div>
        );
      case 'manage_department':
        if (showEditDepartment && editingDepartment) {
          return (
            <div className="w-full">
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Edit Department
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <div className="bg-white border border-gray-300 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
                  <div className="flex items-center border-r h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Order no*:</div>
                    <div className="flex-1 px-2">
                      <input 
                        type="number"
                        value={departmentFormData.orderNo}
                        onChange={(e) => setDepartmentFormData(prev => ({ ...prev, orderNo: parseInt(e.target.value) || 1 }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Department*:</div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text"
                        value={departmentFormData.departmentName}
                        onChange={(e) => setDepartmentFormData(prev => ({ ...prev, departmentName: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
                  <div className="flex items-center border-r h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">ShortName*:</div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text"
                        value={departmentFormData.shortName}
                        onChange={(e) => setDepartmentFormData(prev => ({ ...prev, shortName: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">About*:</div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text"
                        value={departmentFormData.aboutDepartment}
                        onChange={(e) => setDepartmentFormData(prev => ({ ...prev, aboutDepartment: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                  <button 
                    onClick={handleUpdateDepartment}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowEditDepartment(false);
                      setEditingDepartment(null);
                      setDepartmentFormData({ orderNo: 1, departmentName: '', shortName: '', aboutDepartment: '' });
                    }}
                    className="bg-gray-400 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="w-full">
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Department
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white border border-gray-300 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Order no*:</div>
                  <div className="flex-1 px-2">
                    <input 
                      type="number"
                      value={departmentFormData.orderNo}
                      onChange={(e) => setDepartmentFormData(prev => ({ ...prev, orderNo: parseInt(e.target.value) || 1 }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      placeholder="Enter order number"
                    />
                  </div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Department*:</div>
                  <div className="flex-1 px-2">
                    <input 
                      type="text"
                      value={departmentFormData.departmentName}
                      onChange={(e) => setDepartmentFormData(prev => ({ ...prev, departmentName: e.target.value }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      placeholder="Enter department name"
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">ShortName*:</div>
                  <div className="flex-1 px-2">
                    <input 
                      type="text"
                      value={departmentFormData.shortName}
                      onChange={(e) => setDepartmentFormData(prev => ({ ...prev, shortName: e.target.value }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      placeholder="Enter short name"
                    />
                  </div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">About*:</div>
                  <div className="flex-1 px-2">
                    <input 
                      type="text"
                      value={departmentFormData.aboutDepartment}
                      onChange={(e) => setDepartmentFormData(prev => ({ ...prev, aboutDepartment: e.target.value }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      placeholder="Enter department description"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                <button 
                  onClick={handleCreateDepartment}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  {loading ? 'ADDING...' : 'ADD'}
                </button>
                <button 
                  onClick={() => setDepartmentFormData({ orderNo: 1, departmentName: '', shortName: '', aboutDepartment: '' })}
                  className="bg-gray-400 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  CANCEL
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-300 mb-6">
              <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">Department Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Order No</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">DepartmentName</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">ShortName</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((department: any) => (
                      <tr key={department.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{department.order_no}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs">{department.department_name}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{department.short_name}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                          <button 
                            onClick={() => handleEditDepartment(department)}
                            className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-all" 
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                          <button 
                            onClick={() => handleDeleteDepartment(department)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" 
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'manage_designation':
        if (showEditDesignation && editingDesignation) {
          return (
            <div className="w-full">
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  Edit Designation
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <div className="bg-white border border-gray-300 mb-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
                  <div className="flex items-center border-r h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Department*:</div>
                    <div className="flex-1 px-2">
                      <select 
                        value={designationFormData.departmentId}
                        onChange={(e) => setDesignationFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      >
                        <option value="">--- Select ---</option>
                        {departments.map((dept: any) => (
                          <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center border-r h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Designation*:</div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text"
                        value={designationFormData.designationName}
                        onChange={(e) => setDesignationFormData(prev => ({ ...prev, designationName: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex items-center h-10 bg-white">
                    <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Shortname*:</div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text"
                        value={designationFormData.shortName}
                        onChange={(e) => setDesignationFormData(prev => ({ ...prev, shortName: e.target.value }))}
                        className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                  <button 
                    onClick={handleUpdateDesignation}
                    disabled={loading}
                    className="bg-[#3498db] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                  >
                    {loading ? 'UPDATING...' : 'UPDATE'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowEditDesignation(false);
                      setEditingDesignation(null);
                      setDesignationFormData({ departmentId: '', designationName: '', shortName: '' });
                    }}
                    className="bg-gray-400 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                  >
                    CANCEL
                  </button>
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="w-full">
            <div className="mb-6 relative pb-4">
              <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                Manage Designation
              </h2>
              <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
            </div>

            <div className="bg-white border border-gray-300 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 border-b">
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Department*:</div>
                  <div className="flex-1 px-2">
                    <select 
                      value={designationFormData.departmentId}
                      onChange={(e) => setDesignationFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                    >
                      <option value="">--- Select ---</option>
                      {departments.map((dept: any) => (
                        <option key={dept.id} value={dept.id}>{dept.department_name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center border-r h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Designation*:</div>
                  <div className="flex-1 px-2">
                    <input 
                      type="text"
                      value={designationFormData.designationName}
                      onChange={(e) => setDesignationFormData(prev => ({ ...prev, designationName: e.target.value }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      placeholder="Enter designation"
                    />
                  </div>
                </div>
                <div className="flex items-center h-10 bg-white">
                  <div className="w-20 bg-gray-50 h-full flex items-center px-3 text-[10px] font-black uppercase text-gray-400 border-r">Shortname*:</div>
                  <div className="flex-1 px-2">
                    <input 
                      type="text"
                      value={designationFormData.shortName}
                      onChange={(e) => setDesignationFormData(prev => ({ ...prev, shortName: e.target.value }))}
                      className="border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors"
                      placeholder="Enter short name"
                    />
                  </div>
                </div>
              </div>
              <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white">
                <button 
                  onClick={handleCreateDesignation}
                  disabled={loading}
                  className="bg-[#3498db] text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  {loading ? 'ADDING...' : 'ADD'}
                </button>
                <button 
                  onClick={() => setDesignationFormData({ departmentId: '', designationName: '', shortName: '' })}
                  className="bg-gray-400 text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                >
                  CANCEL
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-300 mb-6">
              <div className="p-3 border-b border-gray-300 bg-gray-100 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-700">Search Designation:-</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Department</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Designation</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">ShortName</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Edit</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    {designations.map((designation: any) => (
                      <tr key={designation.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-2 text-xs">{designation.departments?.department_name || 'Administrative'}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs">{designation.designation_name}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">{designation.short_name}</td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                          <button 
                            onClick={() => handleEditDesignation(designation)}
                            className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded transition-all" 
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-xs text-center">
                          <button 
                            onClick={() => handleDeleteDesignation(designation)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-all" 
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Masters Management</h1>
          <p className="text-sm lg:text-base text-gray-500">Manage all master data for the school system</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button className="flex items-center justify-center gap-2 px-4 lg:px-6 py-2 lg:py-2.5 bg-blue-600 text-white rounded-xl text-xs lg:text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all">
            <Plus size={18} className="lg:w-[20px] lg:h-[20px]" /> Quick Add
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Masters;