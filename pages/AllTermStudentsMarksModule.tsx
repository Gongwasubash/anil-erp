import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';
import '../styles/print-marksheet.css';

const AllTermStudentsMarksModule: React.FC = () => {
  const [marksheetData, setMarksheetData] = useState<any>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [batchData, setBatchData] = useState<any>(null);
  const [classData, setClassData] = useState<any>(null);
  const [sectionData, setSectionData] = useState<any>(null);
  const [examTypeData, setExamTypeData] = useState<any>(null);
  const [finalExamNameData, setFinalExamNameData] = useState<any>(null);
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        @page { size: A4 portrait; margin: 10mm; }
        html, body { margin: 0 !important; padding: 0 !important; height: auto !important; }
        .no-print { display: none !important; }
        body > div:first-child { padding: 0 !important; margin: 0 !important; gap: 0 !important; background: white !important; }
        .marksheet-container { 
          width: 100% !important; 
          max-width: 100% !important;
          page-break-after: always; 
          page-break-inside: avoid; 
          margin: 0 auto !important;
          padding: 8mm !important;
          box-shadow: none !important;
        }
        .marksheet-container:last-child { page-break-after: auto; }
      }
      @media screen {
        body { background: #525659 !important; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  useEffect(() => {
    const data = sessionStorage.getItem('printMarksheetData');
    if (data) {
      const parsedData = JSON.parse(data);
      setMarksheetData(parsedData);
      loadSchoolData(parsedData.form.schoolId);
      loadBatchData(parsedData.form.batchId);
      loadClassData(parsedData.form.classId);
      loadSectionData(parsedData.form.sectionId);
      loadExamTypeData(parsedData.form.examTypeId);
      loadFinalExamNameData(parsedData.form.examNameId);
      loadGrades(parsedData.form.schoolId);
    }
  }, []);

  const loadSchoolData = async (schoolId: string) => {
    const { data } = await supabaseService.supabase.from('schools').select('*').eq('id', schoolId).single();
    if (data) setSchoolData(data);
  };

  const loadBatchData = async (batchId: string) => {
    const { data } = await supabaseService.supabase.from('batches').select('*').eq('id', batchId).single();
    if (data) setBatchData(data);
  };

  const loadClassData = async (classId: string) => {
    const { data } = await supabaseService.supabase.from('classes').select('*').eq('id', classId).single();
    if (data) setClassData(data);
  };

  const loadSectionData = async (sectionId: string) => {
    const { data } = await supabaseService.supabase.from('sections').select('*').eq('id', sectionId).single();
    if (data) setSectionData(data);
  };

  const loadExamTypeData = async (examTypeId: string) => {
    const { data } = await supabaseService.supabase.from('exam_types').select('*').eq('id', examTypeId).single();
    if (data) setExamTypeData(data);
  };

  const loadFinalExamNameData = async (examNameId: string) => {
    const { data } = await supabaseService.supabase.from('final_exam_names').select('*').eq('id', examNameId).single();
    if (data) setFinalExamNameData(data);
  };

  const loadGrades = async (schoolId: string) => {
    const { data } = await supabaseService.supabase.from('grades').select('*').eq('school_id', schoolId).order('min_percent', { ascending: false });
    if (data) setGrades(data);
  };

  const calculateGrade = (percentage: number) => {
    const matchedGrade = grades.find(g => percentage >= parseFloat(g.min_percent) && percentage <= parseFloat(g.max_percent));
    return matchedGrade ? { grade: matchedGrade.grade_name, gpa: matchedGrade.grade_point, description: matchedGrade.description } : { grade: 'F', gpa: '0.0', description: 'Fail' };
  };

  if (!marksheetData) {
    return <div style={{padding: '20px'}}>Loading...</div>;
  }

  const { students, examPercentages, studentMarks, examMarks, subjects, examTypes, form } = marksheetData;

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
      <button 
        onClick={() => window.print()} 
        className="no-print"
        style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          padding: '12px 24px', 
          backgroundColor: '#2E3092', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          fontSize: '16px', 
          fontWeight: 'bold', 
          cursor: 'pointer',
          zIndex: 1000,
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
        }}
      >
        Print Marksheet
      </button>
      {students.map((student: any) => (
        <div key={student.id} style={styles.container} className="marksheet-container">
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
              <div style={styles.academicYear}>{finalExamNameData?.exam_name || 'Final Exam'} - Batch {batchData?.batch_no || '2080'}</div>
            </div>
          </div>

          <div style={styles.studentDetails}>
            <div style={styles.detailRow}>
              <span>Name: {student.first_name} {student.last_name}</span>
              <span>Class: {student.class}</span>
            </div>
            <div style={styles.detailRow}>
              <span>Section: {student.section}</span>
              <span>Roll No.: {student.roll_no}</span>
              <span>Date: {form?.printDate || new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th rowSpan={2} style={styles.th}>S.N.</th>
                <th rowSpan={2} style={styles.th}>Subjects</th>
                <th colSpan={examPercentages.length} style={styles.th}>FINAL EVALUATION</th>
                <th rowSpan={2} style={styles.th}>Total</th>
                <th rowSpan={2} style={styles.th}>Total<br/>(100%)</th>
                <th rowSpan={2} style={styles.th}>Grade</th>
                <th rowSpan={2} style={styles.th}>Point</th>
              </tr>
              <tr>
                {examPercentages.map((perc: any, idx: number) => {
                  return (
                    <th key={idx} style={{...styles.th, fontSize: '10px', padding: '4px'}}>
                      <div style={{fontSize: '11px', fontWeight: 'bold'}}>{perc.exam_name_id}</div>
                      <div style={{fontSize: '9px'}}>Weighted ({perc.exam_percentage}%)</div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject: any, sIndex: number) => {
                const marks = studentMarks[student.id]?.[subject.id] || {};
                let finalPercentage = 0;
                let totalWeighted = 0;
                
                examPercentages.forEach((perc: any) => {
                  const mark = marks[perc.exam_name_id] || 0;
                  const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                  const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                  const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                  const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                  finalPercentage += weightedValue;
                  totalWeighted += weightedValue;
                });

                const firstExamMark = examMarks[subject.id]?.[examPercentages[0]?.exam_name_id];
                const fullMarks = firstExamMark ? (firstExamMark.th_marks || 0) + (firstExamMark.pr_in_marks || 0) : 100;
                const gradeData = calculateGrade(finalPercentage);

                return (
                  <tr key={subject.id}>
                    <td style={styles.td}>{sIndex + 1}</td>
                    <td style={styles.td}>{subject.subject_name}</td>
                    {examPercentages.map((perc: any, pIdx: number) => {
                      const mark = marks[perc.exam_name_id] || 0;
                      const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                      const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                      const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                      const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                      
                      return (
                        <td key={pIdx} style={styles.td}>
                          {mark > 0 ? weightedValue.toFixed(2) : '-'}
                        </td>
                      );
                    })}
                    <td style={{...styles.td, fontWeight: 'bold'}}>
                      {totalWeighted > 0 ? totalWeighted.toFixed(2) : '-'}
                    </td>
                    <td style={styles.td}>
                      {finalPercentage > 0 ? finalPercentage.toFixed(2) : '-'}
                    </td>
                    <td style={styles.td}>{gradeData.grade}</td>
                    <td style={styles.td}>{gradeData.gpa}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ backgroundColor: '#eee' }}>
                <td colSpan={examPercentages.length + 3} style={{ ...styles.td, textAlign: 'right', fontWeight: 'bold' }}>TOTAL GPA:</td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>
                  {(() => {
                    let totalGPA = 0;
                    subjects.forEach((subject: any) => {
                      const marks = studentMarks[student.id]?.[subject.id] || {};
                      let finalPercentage = 0;
                      examPercentages.forEach((perc: any) => {
                        const mark = marks[perc.exam_name_id] || 0;
                        const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                        const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                        const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                        const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                        finalPercentage += weightedValue;
                      });
                      totalGPA += parseFloat(calculateGrade(finalPercentage).gpa);
                    });
                    const avgGPA = totalGPA / subjects.length;
                    return calculateGrade((avgGPA / 4) * 100).grade;
                  })()}
                </td>
                <td style={{ ...styles.td, fontWeight: 'bold' }}>
                  {(() => {
                    let totalGPA = 0;
                    subjects.forEach((subject: any) => {
                      const marks = studentMarks[student.id]?.[subject.id] || {};
                      let finalPercentage = 0;
                      examPercentages.forEach((perc: any) => {
                        const mark = marks[perc.exam_name_id] || 0;
                        const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                        const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                        const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                        const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                        finalPercentage += weightedValue;
                      });
                      totalGPA += parseFloat(calculateGrade(finalPercentage).gpa);
                    });
                    return (totalGPA / subjects.length).toFixed(2);
                  })()}
                </td>
                <td style={{ ...styles.td, fontWeight: 'bold', color: 'green' }}>PASS</td>
              </tr>
            </tfoot>
          </table>

          <div style={styles.bottomGrid}>
            <div style={{...styles.gradingScale, flex: 2}}>
              <h4 style={styles.h4}>GRADING SCALE</h4>
              <table style={styles.table}>
                <thead>
                  <tr><th style={styles.th}>Marks %</th><th style={styles.th}>Grade</th><th style={styles.th}>GPA</th><th style={styles.th}>Remarks</th></tr>
                </thead>
                <tbody>
                  {grades.map((grade: any, index: number) => (
                    <tr key={index}>
                      <td style={styles.td}>{grade.min_percent}-{grade.max_percent}</td>
                      <td style={styles.td}>{grade.grade_name}</td>
                      <td style={styles.td}>{grade.grade_point}</td>
                      <td style={styles.td}>{grade.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{...styles.gradingScale, flex: 1.5}}>
              <h4 style={styles.h4}>RESULT SUMMARY</h4>
              <table style={styles.table}>
                <tbody>
                  <tr>
                    <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Overall GPA:</td>
                    <td style={styles.td}>
                      {(() => {
                        let totalGPA = 0;
                        subjects.forEach((subject: any) => {
                          const marks = studentMarks[student.id]?.[subject.id] || {};
                          let finalPercentage = 0;
                          examPercentages.forEach((perc: any) => {
                            const mark = marks[perc.exam_name_id] || 0;
                            const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                            const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                            const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                            const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                            finalPercentage += weightedValue;
                          });
                          totalGPA += parseFloat(calculateGrade(finalPercentage).gpa);
                        });
                        return (totalGPA / subjects.length).toFixed(2);
                      })()}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ ...styles.td, textAlign: 'left', fontWeight: 'bold' }}>Final Grade:</td>
                    <td style={styles.td}>
                      {(() => {
                        let totalGPA = 0;
                        subjects.forEach((subject: any) => {
                          const marks = studentMarks[student.id]?.[subject.id] || {};
                          let finalPercentage = 0;
                          examPercentages.forEach((perc: any) => {
                            const mark = marks[perc.exam_name_id] || 0;
                            const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                            const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                            const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                            const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                            finalPercentage += weightedValue;
                          });
                          totalGPA += parseFloat(calculateGrade(finalPercentage).gpa);
                        });
                        const avgGPA = totalGPA / subjects.length;
                        return calculateGrade((avgGPA / 4) * 100).grade;
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
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ border: '2px solid #2E3092', padding: '2px 4px', marginTop: '8px' }}>
            <h4 style={{ ...styles.h4, marginBottom: '0px', fontSize: '12px' }}>REMARKS</h4>
            <div style={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '2px', lineHeight: '1.2' }}>
              {(() => {
                let totalGPA = 0;
                subjects.forEach((subject: any) => {
                  const marks = studentMarks[student.id]?.[subject.id] || {};
                  let finalPercentage = 0;
                  examPercentages.forEach((perc: any) => {
                    const mark = marks[perc.exam_name_id] || 0;
                    const examMark = examMarks[subject.id]?.[perc.exam_name_id];
                    const totalMarks = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 100;
                    const actualPercentage = totalMarks > 0 ? (mark / totalMarks) * 100 : 0;
                    const weightedValue = (actualPercentage * perc.exam_percentage) / 100;
                    finalPercentage += weightedValue;
                  });
                  totalGPA += parseFloat(calculateGrade(finalPercentage).gpa);
                });
                const avgGPA = totalGPA / subjects.length;
                const gpaPercent = (avgGPA / 4) * 100;
                const matchedGrade = grades.find(g => gpaPercent >= parseFloat(g.min_percent) && gpaPercent <= parseFloat(g.max_percent));
                return matchedGrade?.description || 'No remarks';
              })()}
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

export default AllTermStudentsMarksModule;
