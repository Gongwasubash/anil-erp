import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewStudentsMarksModule: React.FC = () => {
  const navigate = useNavigate();
  const [marksheetData, setMarksheetData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('printMarksheetData');
    if (data) {
      setMarksheetData(JSON.parse(data));
    } else {
      navigate('/exams/view_students_marks');
    }
  }, [navigate]);

  const calculateGrade = (percentage: number, grades: any[]) => {
    if (!grades || grades.length === 0) return { grade: 'N/A', gpa: '0.0' };
    const matchedGrade = grades.find(g => 
      percentage >= parseFloat(g.min_percent) && 
      percentage <= parseFloat(g.max_percent)
    );
    return matchedGrade ? { grade: matchedGrade.grade_name, gpa: matchedGrade.grade_point.toString() } : { grade: 'N/A', gpa: '0.0' };
  };

  if (!marksheetData) {
    return <div className="p-8 text-center">Loading marksheet...</div>;
  }

  const { student, form, examMarks, selectedSubjectName, grades } = marksheetData;

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto border-2 border-black">
        {/* Header */}
        <div className="text-center border-b-2 border-black p-6">
          <h1 className="text-3xl font-bold mb-2">EVEREST SCHOOL</h1>
          <p className="text-lg mb-2">ACADEMIC TRANSCRIPT</p>
          <p className="text-sm">Session: 2023-2024</p>
        </div>

        {/* Student Info */}
        <div className="p-6 border-b border-black">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-bold w-32">Student Name:</span>
                <span className="border-b border-dotted border-black flex-1 px-2">{student.student_name}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-32">Roll Number:</span>
                <span className="border-b border-dotted border-black flex-1 px-2">{student.roll_no}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-32">Class:</span>
                <span className="border-b border-dotted border-black flex-1 px-2">{student.class_name}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-bold w-32">Section:</span>
                <span className="border-b border-dotted border-black flex-1 px-2">{student.section_name}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-32">Date:</span>
                <span className="border-b border-dotted border-black flex-1 px-2">{form.printDate || new Date().toLocaleDateString()}</span>
              </div>
              <div className="w-24 h-32 border-2 border-black ml-auto">
                <div className="text-center text-xs mt-28">PHOTO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Marks Table */}
        <div className="p-6">
          <table className="w-full border-2 border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-sm font-bold">S.No</th>
                <th className="border border-black px-3 py-2 text-sm font-bold">SUBJECT</th>
                <th className="border border-black px-3 py-2 text-sm font-bold">THEORY<br/>MARKS</th>
                <th className="border border-black px-3 py-2 text-sm font-bold">PRACTICAL<br/>MARKS</th>
                <th className="border border-black px-3 py-2 text-sm font-bold">TOTAL<br/>MARKS</th>
                <th className="border border-black px-3 py-2 text-sm font-bold">GRADE</th>
                <th className="border border-black px-3 py-2 text-sm font-bold">RESULT</th>
              </tr>
            </thead>
            <tbody>
              {form.subjectId ? (
                (() => {
                  const mark = Object.values(student.subjects)[0] as any;
                  const totalObtained = (mark?.theory_marks_obtained || 0) + (mark?.practical_marks_obtained || 0);
                  const totalPossible = (examMarks?.th_marks || 0) + (examMarks?.pr_in_marks || 0);
                  const overallPercent = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0.0';
                  const gradeData = calculateGrade(parseFloat(overallPercent), grades);
                  
                  return (
                    <tr>
                      <td className="border border-black px-3 py-2 text-center font-medium">1</td>
                      <td className="border border-black px-3 py-2 font-medium">{selectedSubjectName}</td>
                      <td className="border border-black px-3 py-2 text-center">
                        {mark?.theory_marks_obtained || 0}/{examMarks?.th_marks || 0}
                      </td>
                      <td className="border border-black px-3 py-2 text-center">
                        {(examMarks?.pr_in_marks || 0) > 0 ? `${mark?.practical_marks_obtained || 0}/${examMarks.pr_in_marks}` : 'N/A'}
                      </td>
                      <td className="border border-black px-3 py-2 text-center font-bold">{totalObtained}/{totalPossible}</td>
                      <td className="border border-black px-3 py-2 text-center font-bold">{gradeData.grade}</td>
                      <td className="border border-black px-3 py-2 text-center font-bold">
                        {parseFloat(overallPercent) >= 40 ? 'PASS' : 'FAIL'}
                      </td>
                    </tr>
                  );
                })()
              ) : (
                Object.keys(student.subjects).map((subjectId, index) => {
                  const mark = student.subjects[subjectId];
                  const totalObtained = (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0);
                  const examMark = mark.exam_marks;
                  const totalPossible = examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 200;
                  const overallPercent = totalPossible > 0 ? ((totalObtained / totalPossible) * 100).toFixed(1) : '0.0';
                  const gradeData = calculateGrade(parseFloat(overallPercent), grades);
                  
                  return (
                    <tr key={subjectId}>
                      <td className="border border-black px-3 py-2 text-center font-medium">{index + 1}</td>
                      <td className="border border-black px-3 py-2 font-medium">{mark.subject_name}</td>
                      <td className="border border-black px-3 py-2 text-center">
                        {mark.theory_marks_obtained || 0}/{examMark?.th_marks || 0}
                      </td>
                      <td className="border border-black px-3 py-2 text-center">
                        {(examMark?.pr_in_marks || 0) > 0 ? `${mark.practical_marks_obtained || 0}/${examMark.pr_in_marks}` : 'N/A'}
                      </td>
                      <td className="border border-black px-3 py-2 text-center font-bold">{totalObtained}/{totalPossible}</td>
                      <td className="border border-black px-3 py-2 text-center font-bold">{gradeData.grade}</td>
                      <td className="border border-black px-3 py-2 text-center font-bold">
                        {parseFloat(overallPercent) >= 40 ? 'PASS' : 'FAIL'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Overall Summary */}
        {!form.subjectId && (
          <div className="px-6 pb-6">
            <div className="border-2 border-black p-4">
              <h3 className="text-lg font-bold mb-4 text-center">OVERALL PERFORMANCE</h3>
              {(() => {
                const allSubjectMarks = Object.values(student.subjects);
                const grandTotal = allSubjectMarks.reduce((sum: number, mark: any) => 
                  sum + (mark.theory_marks_obtained || 0) + (mark.practical_marks_obtained || 0), 0);
                const grandTotalPossible = allSubjectMarks.reduce((sum: number, mark: any) => {
                  const examMark = mark.exam_marks;
                  return sum + (examMark ? (examMark.th_marks || 0) + (examMark.pr_in_marks || 0) : 200);
                }, 0);
                const grandPercent = grandTotalPossible > 0 ? ((grandTotal / grandTotalPossible) * 100).toFixed(1) : '0.0';
                const grandGradeData = calculateGrade(parseFloat(grandPercent), grades);
                
                return (
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="border border-black p-3">
                      <p className="text-sm font-bold">TOTAL MARKS</p>
                      <p className="text-xl font-bold">{grandTotal}/{grandTotalPossible}</p>
                    </div>
                    <div className="border border-black p-3">
                      <p className="text-sm font-bold">PERCENTAGE</p>
                      <p className="text-xl font-bold">{grandPercent}%</p>
                    </div>
                    <div className="border border-black p-3">
                      <p className="text-sm font-bold">GRADE</p>
                      <p className="text-xl font-bold">{grandGradeData.grade}</p>
                    </div>
                    <div className="border border-black p-3">
                      <p className="text-sm font-bold">RESULT</p>
                      <p className="text-xl font-bold">{parseFloat(grandPercent) >= 40 ? 'PASS' : 'FAIL'}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t-2 border-black p-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="border-t border-black mt-16 pt-2">
                <p className="text-sm font-bold">CLASS TEACHER</p>
              </div>
            </div>
            <div>
              <div className="border-t border-black mt-16 pt-2">
                <p className="text-sm font-bold">PRINCIPAL</p>
              </div>
            </div>
            <div>
              <div className="border-t border-black mt-16 pt-2">
                <p className="text-sm font-bold">PARENT SIGNATURE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Print Button - Hidden in print */}
        <div className="mt-8 text-center space-x-4 print:hidden">
          <button 
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Print Marksheet
          </button>
          <button 
            onClick={() => navigate('/exams/view_students_marks')}
            className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
          >
            Back to View Marks
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewStudentsMarksModule;