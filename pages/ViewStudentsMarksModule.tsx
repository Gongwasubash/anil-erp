import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../lib/supabase';
import '../styles/print-marksheet.css';

const ViewStudentsMarksModule: React.FC = () => {
  console.log('ViewStudentsMarksModule component loaded');
  const navigate = useNavigate();
  const [marksheetData, setMarksheetData] = useState<any>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [examTypeData, setExamTypeData] = useState<any>(null);
  const [examNameData, setExamNameData] = useState<any>(null);
  const [batchData, setBatchData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('printMarksheetData');
    if (data) {
      const parsedData = JSON.parse(data);
      setMarksheetData(parsedData);
      loadSchoolData(parsedData.form.schoolId);
      loadExamData(parsedData.form.examTypeId, parsedData.form.examNameId);
      loadBatchData(parsedData.form.batchId);
    } else {
      // Sample data
      const sampleData = {
        student: {
          student_name: "ANIL BK",
          roll_no: "4",
          class_name: "1",
          section_name: "A",
          subjects: {
            "1": { subject_name: "English", theory_marks_obtained: 85, practical_marks_obtained: 0, credit_hour_th_obtained: 4, exam_marks: { th_marks: 100, pr_in_marks: 0 } },
            "2": { subject_name: "Nepali", theory_marks_obtained: 78, practical_marks_obtained: 19, credit_hour_th_obtained: 5, exam_marks: { th_marks: 100, pr_in_marks: 20 } },
            "3": { subject_name: "Mathematics", theory_marks_obtained: 92, practical_marks_obtained: 18, credit_hour_th_obtained: 6, exam_marks: { th_marks: 100, pr_in_marks: 20 } },
            "4": { subject_name: "Science", theory_marks_obtained: 88, practical_marks_obtained: 20, credit_hour_th_obtained: 5, exam_marks: { th_marks: 100, pr_in_marks: 20 } },
            "5": { subject_name: "Social Studies", theory_marks_obtained: 90, practical_marks_obtained: 0, credit_hour_th_obtained: 4, exam_marks: { th_marks: 100, pr_in_marks: 0 } }
          }
        },
        form: { schoolId: "1", printDate: "1/28/2026" },
        grades: [
          { grade_name: "A+", grade_point: "4.0", min_percent: "90", max_percent: "100", description: "Outstanding" },
          { grade_name: "A", grade_point: "3.6", min_percent: "80", max_percent: "89", description: "Excellent" },
          { grade_name: "B+", grade_point: "3.2", min_percent: "70", max_percent: "79", description: "Very Good" },
          { grade_name: "B", grade_point: "2.8", min_percent: "60", max_percent: "69", description: "Good" },
          { grade_name: "C+", grade_point: "2.4", min_percent: "50", max_percent: "59", description: "Satisfactory" },
          { grade_name: "C", grade_point: "2.0", min_percent: "40", max_percent: "49", description: "Acceptable" }
        ]
      };
      setMarksheetData(sampleData);
      setSchoolData({ school_name: "EVEREST INTERNATIONAL SCHOOL", address: "Kathmandu, Nepal", phone: "+977-1-4567890", email: "info@everestschool.edu.np" });
      setExamTypeData({ exam_type: "Final Examination" });
      setExamNameData({ exam_name: "Annual Exam 2024" });
      setBatchData({ batch_no: "2080" });
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
    body: { fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0', display: 'flex', flexDirection: 'column' as const, alignItems: 'center', padding: '20px', gap: '30px' },
    container: { width: '8.27in', minWidth: '8.27in', maxWidth: '8.27in', height: '11.69in', minHeight: '11.69in', maxHeight: '11.69in', background: '#fff', border: '1px solid #000', padding: '0.5in', boxShadow: '0 0 10px rgba(0,0,0,0.1)', fontSize: '12px', overflow: 'hidden' },
    header: { display: 'flex', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '5px', marginBottom: '5px' },
    headerContent: { flex: 1, textAlign: 'center' as const },
    logo: { width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', fontSize: '48px', fontWeight: 'bold', marginRight: '15px' },
    h1: { margin: '0', fontSize: '40px', fontWeight: 'bold' },
    p: { margin: '2px 0', fontSize: '14px' },
    studentDetails: { marginBottom: '15px', border: '1px solid #000', padding: '10px', fontSize: '14px', fontWeight: 'bold' },
    row: { display: 'flex', justifyContent: 'space-between', marginBottom: '3px' },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginBottom: '15px' },
    th: { border: '1px solid black', textAlign: 'center' as const, padding: '6px', fontSize: '12px', backgroundColor: '#f2f2f2', fontWeight: 'bold' },
    td: { border: '1px solid black', textAlign: 'center' as const, padding: '6px', fontSize: '12px', fontWeight: 'normal' },
    bottomGrid: { display: 'flex', gap: '15px', marginTop: '15px' },
    gradingScale: { flex: 1, border: '1px solid #000', padding: '8px' },
    h4: { textAlign: 'center' as const, marginTop: '0', marginBottom: '8px', textDecoration: 'underline', fontWeight: 'bold', fontSize: '16px' },
    footerSigs: { display: 'flex', justifyContent: 'space-between', marginTop: '80px' },
    sigBox: { width: '120px', borderTop: '1px solid #000', textAlign: 'center' as const, paddingTop: '3px', fontSize: '14px', fontWeight: 'bold' }
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
              <img 
                src={schoolData.logo_url} 
                alt="School Logo" 
                style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                onError={(e) => {
                  console.log('Logo failed to load:', schoolData.logo_url);
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div style={{ 
              ...styles.logo, 
              display: schoolData?.logo_url ? 'none' : 'flex'
            }}>
              {schoolData?.school_name?.charAt(0) || 'S'}
            </div>
          </div>
          <div style={styles.headerContent}>
            <h1 style={styles.h1}>{schoolData?.school_name || 'SCHOOL NAME'}</h1>
            <p style={styles.p}>{schoolData?.address || 'School Address'}</p>
            <p style={styles.p}>Ph: {schoolData?.phone || 'Phone Number'} | {schoolData?.email || 'Email'}</p>
            <h3 style={{ margin: '8px 0', fontSize: '18px', fontWeight: 'bold' }}>{examNameData?.exam_name || 'Second Term'} - Academic Year {batchData?.batch_no || '2080'}</h3>
          </div>
        </div>

        <div style={styles.studentDetails}>
          <div style={styles.row}>
            <span><strong>Name of Student:</strong> <span style={{ borderBottom: '1px dotted #000', paddingBottom: '2px', minWidth: '300px', display: 'inline-block' }}>{currentStudent.student_name}</span></span>
            <span><strong>Roll No:</strong> <span style={{ borderBottom: '1px dotted #000', paddingBottom: '2px', minWidth: '150px', display: 'inline-block' }}>{currentStudent.roll_no}</span></span>
          </div>
          <div style={styles.row}>
            <span><strong>Class:</strong> <span style={{ borderBottom: '1px dotted #000', paddingBottom: '2px', minWidth: '150px', display: 'inline-block' }}>{currentStudent.class_name}</span></span>
            <span><strong>Section:</strong> <span style={{ borderBottom: '1px dotted #000', paddingBottom: '2px', minWidth: '150px', display: 'inline-block' }}>{currentStudent.section_name}</span></span>
            <span><strong>Date:</strong> <span style={{ borderBottom: '1px dotted #000', paddingBottom: '2px', minWidth: '200px', display: 'inline-block' }}>{form.printDate || ''}</span></span>
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
                <td style={{ ...styles.td, borderBottom: '1px dotted #000' }}>____</td>
              </tr>
              <tr>
                <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Present Days:</td>
                <td style={{ ...styles.td, borderBottom: '1px dotted #000' }}>____</td>
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
          <div style={styles.sigBox}>Class Teacher</div>
          <div style={styles.sigBox}>Head Teacher</div>
          <div style={styles.sigBox}>School Stamp</div>
        </div>


        </div>
      ))}
    </div>
  );
};

export default ViewStudentsMarksModule;