import React, { useState, useEffect } from 'react';
import { supabaseService } from '../lib/supabase';

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={`border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400 w-full bg-white transition-colors ${props.className || ''}`} />
);

const BlueBtn = ({ children, onClick, color = "bg-[#3498db]", disabled = false }: any) => (
  <button 
    type="button"
    onClick={onClick} 
    disabled={disabled}
    className={`${color} text-white px-5 py-2 rounded-sm text-xs font-bold uppercase hover:opacity-90 transition-all min-w-[100px] disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95 shadow-md`}
  >
    {children}
  </button>
);

const AddStudentMarks: React.FC = () => {
  const [form, setForm] = useState({
    schoolId: '',
    batchId: '',
    classId: '',
    sectionId: '',
    subjectId: '',
    examTypeId: '',
    examNameId: ''
  });

  const [schoolsList] = useState([
    { id: '1', school_name: 'NORMAL MAX TEST ADMIN' }, 
    { id: '2', school_name: 'JHOR SCHOOL' }
  ]);
  const [batchesList] = useState([{ id: '1', batch_no: '2080' }]);
  const [classesList] = useState([{ id: '1', class_name: '1' }]);
  const [sectionsList] = useState([{ id: '1', section_name: 'A' }]);
  const [subjectsList] = useState([{ id: '1', subject_name: 'English' }]);
  const [examTypesList] = useState([{ id: '1', exam_type: 'TERMINAL' }]);
  const [examNamesList] = useState([{ id: '1', exam_name: '1 st terminal' }]);

  return (
    <div className="w-full">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 tracking-tight">Add Student Mark</h1>
          <p className="text-sm lg:text-base text-gray-500">Add marks for students</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        <div className="animate-in fade-in duration-300 p-4 lg:p-8">
          <div className="mb-6 relative pb-4">
            <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
              STUDENT EXAM MARK
            </h2>
            <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
          </div>

          <div className="border-2 border-gray-200 shadow-sm mb-6 bg-white overflow-hidden transition-all duration-300">
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                  <select 
                    value={form.schoolId} 
                    onChange={(e) => setForm(p => ({ ...p, schoolId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {schoolsList.map(school => (
                      <option key={school.id} value={school.id}>{school.school_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Batch No.*</label>
                  <select 
                    value={form.batchId} 
                    onChange={(e) => setForm(p => ({ ...p, batchId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {batchesList.map(batch => (
                      <option key={batch.id} value={batch.id}>{batch.batch_no}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Class*</label>
                  <select 
                    value={form.classId} 
                    onChange={(e) => setForm(p => ({ ...p, classId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {classesList.map(cls => (
                      <option key={cls.id} value={cls.id}>{cls.class_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Section*</label>
                  <select 
                    value={form.sectionId} 
                    onChange={(e) => setForm(p => ({ ...p, sectionId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {sectionsList.map(section => (
                      <option key={section.id} value={section.id}>{section.section_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Subject*</label>
                  <select 
                    value={form.subjectId} 
                    onChange={(e) => setForm(p => ({ ...p, subjectId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {subjectsList.map(subject => (
                      <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type*</label>
                  <select 
                    value={form.examTypeId} 
                    onChange={(e) => setForm(p => ({ ...p, examTypeId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {examTypesList.map(type => (
                      <option key={type.id} value={type.id}>{type.exam_type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name*</label>
                  <select 
                    value={form.examNameId} 
                    onChange={(e) => setForm(p => ({ ...p, examNameId: e.target.value }))}
                    className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                  >
                    <option value="">--- Select ---</option>
                    {examNamesList.map(exam => (
                      <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Student Marks Table */}
          {form.schoolId && form.batchId && form.classId && form.sectionId && form.subjectId && form.examTypeId && form.examNameId && (
            <div className="bg-white border border-gray-300 mt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Roll Number</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">firstname</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">lastname</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Batch</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Class</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Section</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Att.</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory Marks</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory Marks Obtained</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Theory % of marks</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical Marks</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical Marks Obtained</th>
                      <th className="border border-gray-300 px-2 py-2 text-xs font-bold text-gray-700 text-center">Practical % of marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">1</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">John</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs">Doe</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">2080</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">1</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">A</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">P</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">100</td>
                      <td className="border border-gray-300 px-1 py-1">
                        <input type="number" className="w-full text-xs border-0 outline-0 bg-transparent text-center" placeholder="0" />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">0%</td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">50</td>
                      <td className="border border-gray-300 px-1 py-1">
                        <input type="number" className="w-full text-xs border-0 outline-0 bg-transparent text-center" placeholder="0" />
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-xs text-center">0%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentMarks;