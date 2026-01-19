          ) : activeModule === 'view_students_marks' ? (
            <div>
              <div className="mb-6 relative pb-4">
                <h2 className="text-lg lg:text-2xl text-[#2980b9] font-normal uppercase tracking-tight">
                  View Students Marks
                </h2>
                <div className="h-[2px] w-full bg-[#f3f3f3] absolute bottom-0 left-0"><div className="h-full w-16 lg:w-24 bg-[#2980b9]"></div></div>
              </div>

              <SectionBox>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School*</label>
                      <select 
                        value={viewStudentsMarksForm.schoolId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, schoolId: e.target.value }))}
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
                        value={viewStudentsMarksForm.batchId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, batchId: e.target.value }))}
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
                        value={viewStudentsMarksForm.classId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, classId: e.target.value }))}
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
                        value={viewStudentsMarksForm.sectionId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, sectionId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {sectionsList.map(section => (
                          <option key={section.id} value={section.id}>{section.section_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                      <select 
                        value={viewStudentsMarksForm.subjectId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, subjectId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {subjectsList.map(subject => (
                          <option key={subject.id} value={subject.id}>{subject.subject_name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type</label>
                      <select 
                        value={viewStudentsMarksForm.examTypeId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, examTypeId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examTypesList.map(type => (
                          <option key={type.id} value={type.id}>{type.exam_type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Exam Name</label>
                      <select 
                        value={viewStudentsMarksForm.examNameId}
                        onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, examNameId: e.target.value }))}
                        className="w-full border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:border-blue-400"
                      >
                        <option value="">--- Select ---</option>
                        {examNamesList.map(exam => (
                          <option key={exam.id} value={exam.id}>{exam.exam_name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Print Date</label>
                    <Input 
                      type="date" 
                      value={viewStudentsMarksForm.printDate}
                      onChange={(e) => setViewStudentsMarksForm(p => ({ ...p, printDate: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="p-3.5 flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 bg-white border-t">
                  <BlueBtn>
                    SEARCH
                  </BlueBtn>
                </div>
              </SectionBox>

              {viewStudentsMarksForm.schoolId && viewStudentsMarksForm.batchId && viewStudentsMarksForm.classId && viewStudentsMarksForm.sectionId && (
                <div className="bg-white border border-gray-300 mt-6 rounded-lg shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 text-left">Roll No</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 text-left">Student Name</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 text-center">Class</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 text-center">Section</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 text-center">Subject</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-gray-800 text-center">Full Marks</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-blue-700 text-center bg-blue-50">Theory</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-blue-700 text-center bg-blue-50">Practical</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-green-700 text-center bg-green-50">Total</th>
                          <th className="border border-gray-200 px-3 py-3 text-sm font-semibold text-purple-700 text-center bg-purple-50">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {viewStudentsList.length > 0 ? viewStudentsList.map((student, idx) => {
                          const theoryObtained = viewStudentMarks[student.id]?.theoryObtained || '';
                          const practicalObtained = viewStudentMarks[student.id]?.practicalObtained || '';
                          const totalMarks = (parseInt(theoryObtained) || 0) + (parseInt(practicalObtained) || 0);
                          const grade = totalMarks >= 90 ? 'A+' : totalMarks >= 80 ? 'A' : totalMarks >= 70 ? 'B' : totalMarks >= 60 ? 'C' : totalMarks >= 50 ? 'D' : 'F';
                          const gradeColor = grade === 'A+' || grade === 'A' ? 'text-green-600 font-semibold' : 
                                           grade === 'B' || grade === 'C' ? 'text-yellow-600 font-semibold' : 'text-red-600 font-semibold';
                          
                          return (
                          <tr key={student.id} className="hover:bg-blue-50 transition-colors duration-200">
                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 font-medium">{student.roll_no || student.roll_number || idx + 1}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700">{student.first_name} {student.last_name}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 text-center">{student.class || classesList.find(c => c.id === viewStudentsMarksForm.classId)?.class_name}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 text-center">{student.section || sectionsList.find(s => s.id === viewStudentsMarksForm.sectionId)?.section_name}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 text-center">{subjectsList.find(s => s.id === viewStudentsMarksForm.subjectId)?.subject_name || '-'}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-gray-700 text-center font-medium">100</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-blue-700 text-center font-medium bg-white">{theoryObtained || '-'}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-blue-700 text-center font-medium bg-white">{practicalObtained || '-'}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-green-700 text-center font-semibold bg-white">{totalMarks || '-'}</td>
                            <td className="border border-gray-200 px-3 py-2 text-sm text-center bg-white">
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${gradeColor}`}>{grade}</span>
                            </td>
                          </tr>
                        )}) : (
                          <tr>
                            <td colSpan={10} className="border border-gray-200 px-3 py-8 text-sm text-center text-gray-500">
                              <div className="flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="font-medium">No students found</p>
                                <p className="text-xs text-gray-400 mt-1">Please select filters and search</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>