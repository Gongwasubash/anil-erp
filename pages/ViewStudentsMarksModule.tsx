import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../lib/supabase';
import '../styles/print-marksheet.css';

const ViewStudentsMarksModule: React.FC = () => {
  console.log('ViewStudentsMarksModule component loaded');
  const navigate = useNavigate();
  const [marksheetData, setMarksheetData] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [examTypeData, setExamTypeData] = useState<any>(null);
  const [examNameData, setExamNameData] = useState<any>(null);
  const [batchData, setBatchData] = useState<any>(null);
  const [classData, setClassData] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('printMarksheetData');
    if (data) {
      const parsedData = JSON.parse(data);
      setMarksheetData(parsedData);
      loadSchoolData(parsedData.form.schoolId);
      loadExamData(parsedData.form.examTypeId, parsedData.form.examNameId);
      loadBatchData(parsedData.form.batchId);
      loadClassData(parsedData.form.classId);
      loadSectionData(parsedData.form.sectionId);
      loadAttendanceData(parsedData);
    }
  }, [navigate]);

  const loadSchoolData = async (schoolId: string) => {
    const { data, error } = await supabaseService.supabase.from('schools').select('*').eq('id', schoolId).single();
    if (!error && data) {
      setSchoolData(data);
      console.log('School data loaded:', data); // Debug log
    } else {
      console.log('School data error:', error); // Debug log
    }
  };

  const loadExamData = async (examTypeId: string, examNameId: string) => {
    const [examTypeResult, examNameResult] = await Promise.all([
      supabaseService.supabase.from('exam_types').select('*').eq('id', examTypeId).single(),
      supabaseService.supabase.from('exam_names').select('*').eq('id', examNameId).single()
    ]);
    
    if (!examTypeResult.error) setExamTypeData(examTypeResult.data);
    if (!examNameResult.error) setExamNameData(examNameResult.data);
  };

  const loadBatchData = async (batchId: string) => {
    const { data, error } = await supabaseService.supabase.from('batches').select('*').eq('id', batchId).single();
    if (!error && data) setBatchData(data);
  };

  const loadClassData = async (classId: string) => {
    const { data, error } = await supabaseService.supabase.from('classes').select('*').eq('id', classId).single();
    if (!error && data) setClassData(data);
  };

  const loadSectionData = async (sectionId: string) => {
    const { data, error } = await supabaseService.supabase.from('sections').select('*').eq('id', sectionId).single();
    if (!error && data) setSectionData(data);
  };

  const loadAttendanceData = async (parsedData: any) => {
    const studentIds = parsedData.students ? parsedData.students.map((s: any) => s.student_id) : [parsedData.student?.student_id];
    if (!studentIds[0]) return;
    
    const { data, error } = await supabaseService.supabase
      .from('student_attendance')
      .select('*')
      .eq('school_id', parsedData.form.schoolId)
      .eq('batch_id', parsedData.form.batchId)
      .eq('class_id', parsedData.form.classId)
      .eq('section_id', parsedData.form.sectionId)
      .eq('exam_type_id', parsedData.form.examTypeId)
      .eq('exam_name_id', parsedData.form.examNameId)
      .in('student_id', studentIds);
    
    if (!error && data) {
      const attendanceMap = {};
      data.forEach(record => {
        attendanceMap[record.student_id] = record;
      });
      setAttendanceData(attendanceMap);
    }
  };

  const calculateGrade = (percentage: number, grades: any[]) => {
    const matchedGrade = grades.find(g => percentage >= parseFloat(g.min_percent) && percentage <= parseFloat(g.max_percent));
    return matchedGrade ? { grade: matchedGrade.grade_name, gpa: matchedGrade.grade_point, description: matchedGrade.description } : { grade: 'F', gpa: '0.0', description: 'Fail' };
  };

  if (!marksheetData) {
    // Try to get data from sessionStorage again
    const data = sessionStorage.getItem('printMarksheetData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setMarksheetData(parsedData);
        return <div style={{padding: '20px', fontSize: '18px'}}>Loading marksheet data...</div>;
      } catch (e) {
        console.error('Error parsing marksheet data:', e);
      }
    }
    return <div style={{padding: '20px', fontSize: '18px'}}>Loading marksheet data...</div>;
  }

  const { student, students, form, grades } = marksheetData;
  
  // Debug logging
  console.log('Full marksheet data:', marksheetData);
  console.log('Students array:', students);
  console.log('Single student:', student);
  
  const studentsToRender = students && students.length > 0 ? students : (student ? [student] : []);
  
  if (studentsToRender.length === 0) {
    return (
      <div style={{padding: '20px', fontSize: '18px', color: 'red'}}>
        <p>No student data found. Debug info:</p>
        <pre>{JSON.stringify(marksheetData, null, 2)}</pre>
      </div>
    );
  }
  
  console.log('Final students to render:', studentsToRender);

  const styles = {
    body: { fontFamily: 'Arial, sans-serif', backgroundColor: '#525659', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '20px', gap: '20px' },
    container: { width: '210mm', background: '#fff', padding: '10mm', boxShadow: '0 0 10px rgba(0,0,0,0.3)', fontSize: '13px', display: 'flex', flexDirection: 'column' as const, fontWeight: 'bold' as const },
    header: { display: 'flex', alignItems: 'center', borderBottom: '2px solid #2E3092', paddingBottom: '8px', marginBottom: '8px' },
    logo: { width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', flexShrink: 0 },
    logoImg: { maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' as const },
    headerContent: { flex: 1, textAlign: 'center' as const },
    schoolTitle: { margin: '0', color: '#2E3092', fontSize: '32px', fontWeight: 'bold', textTransform: 'uppercase' as const },
    marksheetTitle: { fontSize: '18px', fontWeight: 'bold', margin: '6px 0', color: '#2E3092' },
    academicYear: { fontSize: '14px', margin: '4px 0', fontWeight: 'bold' },
    studentDetails: { marginBottom: '8px', fontSize: '15px', fontWeight: 'bold', padding: '8px 0', borderBottom: '2px solid #2E3092', borderTop: '2px solid #2E3092' },
    detailRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: '8px' },
    th: { border: '1px solid #2E3092', textAlign: 'center' as const, padding: '5px', fontSize: '12px', backgroundColor: '#EAEFFA', fontWeight: 'bold', color: '#2E3092' },
    td: { border: '1px solid #2E3092', textAlign: 'center' as const, padding: '5px', fontSize: '12px', fontWeight: 'bold' },
    bottomGrid: { display: 'flex', gap: '8px', marginTop: 'auto' },
    gradingScale: { flex: 1, border: '2px solid #2E3092', padding: '4px' },
    h4: { textAlign: 'center' as const, marginTop: '0', marginBottom: '4px', fontWeight: 'bold', fontSize: '13px', color: '#2E3092' },
    footerSigs: { display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '8px' },
    sigBox: { textAlign: 'center' as const, fontSize: '13px', fontWeight: 'bold', color: '#2E3092' }
  };

  return (
    <div style={styles.body}>
      {studentsToRender.map((currentStudent, studentIndex) => (
        <div key={currentStudent.student_id || currentStudent.student_name || studentIndex} 
             style={styles.container} 
             className="marksheet-container">
        <div style={styles.header}>
          <div style={styles.logo}>
            {schoolData?.logo_url ? (
              <img src={schoolData.logo_url} alt="Logo" style={styles.logoImg} />
            ) : (
              <div style={{ color: '#2E3092', fontSize: '40px', fontWeight: 'bold' }}>{schoolData?.school_name?.charAt(0) || 'S'}</div>
            )}
          </div>
          <div style={styles.headerContent}>
            <h1 style={styles.schoolTitle}>{schoolData?.school_name || 'SCHOOL NAME'}</h1>
            <div style={styles.marksheetTitle}>MARKS AND GRADE-SHEET</div>
            <div style={styles.academicYear}>{examNameData?.exam_name || 'Exam'} - {batchData?.batch_no || '2080'}</div>
          </div>
        </div>

        <div style={styles.studentDetails}>
          <div style={styles.detailRow}>
            <span>Name: {currentStudent.student_name}</span>
            <span>Class: {classData?.class_name || currentStudent.class_name}</span>
          </div>
          <div style={styles.detailRow}>
            <span>Section: {sectionData?.section_name || currentStudent.section_name}</span>
            <span>Roll No.: {currentStudent.roll_no}</span>
            <span>Date: {form.printDate || new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div style={{ marginBottom: '8px', fontSize: '13px', fontWeight: 'bold', padding: '4px', backgroundColor: '#EAEFFA', border: '1px solid #2E3092' }}>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            <span>Batch: {batchData?.batch_no || '-'}</span>
            <span>Class: {classData?.class_name || '-'}</span>
            <span>Section: {sectionData?.section_name || '-'}</span>
            <span>Exam Type: {examTypeData?.exam_type || '-'}</span>
            <span>Exam: {examNameData?.exam_name || '-'}</span>
          </div>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th rowSpan={2} style={styles.th}>S.N</th>
              <th rowSpan={2} style={styles.th}>Subject</th>
              <th rowSpan={2} style={styles.th}>Credit Hour</th>
              <th colSpan={2} style={styles.th}>Marks Obtained</th>
              <th rowSpan={2} style={styles.th}>Grade</th>
              <th rowSpan={2} style={styles.th}>GPA</th>
              <th rowSpan={2} style={styles.th}>Remarks</th>
            </tr>
            <tr>
              <th style={styles.th}>Theory</th>
              <th style={styles.th}>Practical</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(currentStudent.subjects).map((subjectId, index) => {
              const mark = currentStudent.subjects[subjectId];
              const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
              const totalPossible = (mark.exam_marks?.th_marks || 100) + (mark.exam_marks?.pr_in_marks || 0);
              const percentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100) : 0;
              const gradeData = calculateGrade(percentage, grades);
              
              return (
                <tr key={subjectId}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{mark.subject_name}</td>
                  <td style={styles.td}>{mark.credit_hour_th_obtained || 0}</td>
                  <td style={styles.td}>{(() => {
                    const theoryPercent = (mark.exam_marks?.th_marks || 0) > 0 ? ((mark.theory_marks_obtained || 0) / (mark.exam_marks.th_marks) * 100) : 0;
                    return calculateGrade(theoryPercent, grades).grade;
                  })()}</td>
                  <td style={styles.td}>{(mark.exam_marks?.pr_in_marks || 0) > 0 ? (() => {
                    const practicalPercent = ((mark.practical_marks_obtained || 0) / (mark.exam_marks.pr_in_marks) * 100);
                    return calculateGrade(practicalPercent, grades).grade;
                  })() : '-'}</td>
                  <td style={styles.td}>{gradeData.grade}</td>
                  <td style={styles.td}>{gradeData.gpa}</td>
                  <td style={styles.td}>{gradeData.description}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr style={{ backgroundColor: '#eee' }}>
              <td colSpan={5} style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>TOTAL GPA:</td>
              <td style={{ ...styles.td, fontWeight: 'bold' }}>
                {(() => {
                  const totalGPA = Object.values(currentStudent.subjects).reduce((sum: number, mark: any) => {
                    const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                    const totalPossible = (mark.exam_marks?.th_marks || 100) + (mark.exam_marks?.pr_in_marks || 0);
                    const percentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100) : 0;
                    return sum + parseFloat(calculateGrade(percentage, grades).gpa);
                  }, 0) / Object.keys(currentStudent.subjects).length;
                  return calculateGrade((totalGPA / 4) * 100, grades).grade;
                })()}
              </td>
              <td style={{ ...styles.td, fontWeight: 'bold' }}>
                  {(Object.values(currentStudent.subjects).reduce((sum: number, mark: any) => {
                    const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                    const totalPossible = (mark.exam_marks?.th_marks || 100) + (mark.exam_marks?.pr_in_marks || 0);
                    const percentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100) : 0;
                    return sum + parseFloat(calculateGrade(percentage, grades).gpa);
                  }, 0) / Object.keys(currentStudent.subjects).length).toFixed(2)}
              </td>
              <td style={{ ...styles.td, fontWeight: 'bold', color: 'green' }}>PASS</td>
            </tr>
            <tr>
              <td colSpan={7} style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>Remarks:</td>
              <td style={{ ...styles.td, fontWeight: 'bold', textAlign: 'left' }}>
                {(() => {
                  const avgGPA = Object.values(currentStudent.subjects).reduce((sum: number, mark: any) => {
                    const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                    const totalPossible = (mark.exam_marks?.th_marks || 100) + (mark.exam_marks?.pr_in_marks || 0);
                    const percentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100) : 0;
                    return sum + parseFloat(calculateGrade(percentage, grades).gpa);
                  }, 0) / Object.keys(currentStudent.subjects).length;
                  const gpaPercent = (avgGPA / 4) * 100;
                  const matchedGrade = grades.find(g => gpaPercent >= parseFloat(g.min_percent) && gpaPercent <= parseFloat(g.max_percent));
                  return matchedGrade?.description || 'No remarks';
                })()}
              </td>
            </tr>
          </tfoot>
        </table>

        <div style={styles.bottomGrid}>
          <div style={styles.gradingScale}>
            <h4 style={styles.h4}>GRADING SCALE</h4>
            <table style={styles.table}>
              <tr><th style={styles.th}>Marks %</th><th style={styles.th}>Grade</th><th style={styles.th}>GPA</th><th style={styles.th}>Remarks</th></tr>
              {grades.map((grade: any, index: number) => (
                <tr key={index}>
                  <td style={styles.td}>{grade.min_percent}-{grade.max_percent}</td>
                  <td style={styles.td}>{grade.grade_name}</td>
                  <td style={styles.td}>{grade.grade_point}</td>
                  <td style={styles.td}>{grade.description}</td>
                </tr>
              ))}
            </table>
          </div>

          <div style={styles.gradingScale}>
            <h4 style={styles.h4}>RESULT SUMMARY</h4>
            <table style={styles.table}>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Overall GPA:</td>
                <td style={styles.td}>
                  {(Object.values(currentStudent.subjects).reduce((sum: number, mark: any) => {
                    const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                    const totalPossible = (mark.exam_marks?.th_marks || 100) + (mark.exam_marks?.pr_in_marks || 0);
                    const percentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100) : 0;
                    return sum + parseFloat(calculateGrade(percentage, grades).gpa);
                  }, 0) / Object.keys(currentStudent.subjects).length).toFixed(2)}
                </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Final Grade:</td>
                <td style={styles.td}>
                  {(() => {
                    const totalGPA = Object.values(currentStudent.subjects).reduce((sum: number, mark: any) => {
                      const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                      const totalPossible = (mark.exam_marks?.th_marks || 100) + (mark.exam_marks?.pr_in_marks || 0);
                      const percentage = totalPossible > 0 ? ((totalObtained / totalPossible) * 100) : 0;
                      return sum + parseFloat(calculateGrade(percentage, grades).gpa);
                    }, 0) / Object.keys(currentStudent.subjects).length;
                    return calculateGrade((totalGPA / 4) * 100, grades).grade;
                  })()}
                </td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Result:</td>
                <td style={{ ...styles.td, color: 'green', fontWeight: 'bold' }}>PASS</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>ATTENDANCE</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Working Days:</td>
                <td style={{ ...styles.td, borderBottom: '1px dotted #000' }}>{attendanceData?.[currentStudent.student_id]?.working_days || '____'}</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Present Days:</td>
                <td style={{ ...styles.td, borderBottom: '1px dotted #000' }}>{attendanceData?.[currentStudent.student_id]?.present_days || '____'}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f2f2f2' }}>CONDUCT</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Discipline:</td>
                <td style={{ ...styles.td, borderBottom: '1px dotted #000' }}>____</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Punctuality:</td>
                <td style={{ ...styles.td, borderBottom: '1px dotted #000' }}>____</td>
              </tr>
            </table>
          </div>
        </div>

        <div style={styles.footerSigs}>
          <div style={styles.sigBox}><div style={{ borderTop: '1px solid #2E3092', paddingTop: '4px', marginTop: '80px', width: '150px' }}>Class Teacher</div></div>
          <div style={styles.sigBox}><div style={{ borderTop: '1px solid #2E3092', paddingTop: '4px', marginTop: '80px', width: '150px' }}>School Seal</div></div>
          <div style={styles.sigBox}><div style={{ borderTop: '1px solid #2E3092', paddingTop: '4px', marginTop: '80px', width: '150px' }}>Principal</div></div>
        </div>


        </div>
      ))}
    </div>
  );
};

export default ViewStudentsMarksModule;