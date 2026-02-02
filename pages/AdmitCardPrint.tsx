import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabaseService } from '../lib/supabase';

const AdmitCardPrint: React.FC = () => {
  const navigate = useNavigate();
  const [admitCardData, setAdmitCardData] = useState<any>(null);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [examTypeData, setExamTypeData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('printAdmitCardData');
    if (data) {
      const parsedData = JSON.parse(data);
      setAdmitCardData(parsedData);
      loadSchoolData(parsedData.form.schoolId);
      loadExamData(parsedData.form.examTypeId);
    }
  }, []);

  const loadSchoolData = async (schoolId: string) => {
    const { data, error } = await supabaseService.supabase
      .from('schools')
      .select('*')
      .eq('id', schoolId)
      .single();
    if (!error && data) setSchoolData(data);
  };

  const loadExamData = async (examTypeId: string) => {
    const { data, error } = await supabaseService.supabase
      .from('exam_types')
      .select('*')
      .eq('id', examTypeId)
      .single();
    
    if (!error) setExamTypeData(data);
  };

  if (!admitCardData) {
    return <div style={{padding: '20px', fontSize: '18px'}}>Loading admit card data...</div>;
  }

  const { students, form } = admitCardData;

  const styles = `
    @page {
      size: A4;
      margin: 5mm 2mm 2mm 2mm;
    }

    body {
      margin: 0;
      font-family: Arial, sans-serif;
    }

    .admit-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3mm;
      width: 100%;
      justify-items: center;
      margin: 0 auto;
      max-width: 210mm;
    }

    .card {
      width: 86mm;
      height: 54mm;
      border: 1px solid #1e90ff;
      box-sizing: border-box;
      overflow: hidden;
      page-break-inside: avoid;
    }

    .header {
      display: flex;
      align-items: center;
      padding: 0.5mm 3mm;
    }

    .logo {
      width: 18mm;
      height: 18mm;
    }

    .header-text {
      flex: 1;
      text-align: center;
    }

    .school-name {
      font-weight: bold;
      font-size: 16px;
    }

    .contact {
      font-size: 7.5px;
      font-weight: bold;
    }

    .term {
      background: black;
      color: white;
      text-align: center;
      font-size: 9px;
      padding: 0.5mm 0;
      font-weight: bold;
    }

    .body {
      display: flex;
      height: 28mm;
    }

    .side {
      background: #1e90ff;
      color: white;
      width: 8mm;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      font-weight: bold;
      font-size: 9px;
    }

    .content {
      padding: 1mm 2.5mm;
      font-size: 8.5px;
      flex: 1;
      position: relative;
    }

    .content p {
      margin: 0.5mm 0;
      font-weight: bold;
    }

    .signature {
      position: absolute;
      bottom: -10mm;
      right: -9mm;
      font-size: 6px;
      font-weight: bold;
      text-align: center;
      z-index: 10;
      width: 40mm;
      height: 20mm;
    }

    @media print {
      * {
        visibility: hidden;
      }
      
      .admit-cards, .admit-cards * {
        visibility: visible;
      }
      
      .admit-cards {
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  `;

  return (
    <div>
      <style>{styles}</style>
      <div className="admit-cards">
        {students.map((student: any, index: number) => (
          <div key={student.id} className="card">
            <div className="header">
              {schoolData?.logo_url ? (
                <img src={schoolData.logo_url} className="logo" alt="School Logo" />
              ) : (
                <div className="logo" style={{backgroundColor: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold'}}>
                  {schoolData?.school_name?.charAt(0) || 'S'}
                </div>
              )}
              <div className="header-text">
                <div className="school-name">{schoolData?.school_name || 'SCHOOL NAME'}</div>
                <div className="contact">
                  {schoolData?.address || 'Address'} | Contact No.: {schoolData?.phone || 'Phone'}<br />
                  Email: {schoolData?.email || 'Email'}
                </div>
              </div>
            </div>

            <div className="term">{student.batches?.batch_no || 'Second Term'} - {form.examNameId || 'Exam Name'}</div>

            <div className="body">
              <div className="side">ADMIT CARD</div>

              <div className="content">
                <p><strong>Name:</strong> {student.first_name} {student.last_name}</p>
                <p><strong>Class:</strong> {student.classes?.class_name} &nbsp; <strong>Section:</strong> {student.sections?.section_name}</p>
                <p><strong>Roll No.:</strong> {student.roll_no}</p>
                <p><strong>{form.symbolNo || 'Symbol No'}:</strong> {student.symbolNumber && student.symbolNumber !== 'Not Set' ? student.symbolNumber : 'Not Set'}</p>
                <p><strong>Start Date:</strong> {form.examStartDate || 'Not Set'}</p>
                <p><strong>End Date:</strong> {form.examEndDate || 'Not Set'}</p>
                
                <div className="signature">
                  {schoolData?.signature_url || schoolData?.signature_image || schoolData?.signature ? (
                    <div>
                      <div style={{position: 'relative', display: 'block'}}>
                        <img src={schoolData.signature_url || schoolData.signature_image || schoolData.signature} alt="Signature" style={{width: '29mm', height: '10mm', objectFit: 'contain', position: 'absolute', top: '-2mm', left: '15px'}} />
                        <div style={{position: 'absolute', top: '4mm', left: '55px'}}>.........................</div>
                      </div><br />
                      <span style={{fontSize: '6px', marginTop: '3mm', display: 'block'}}>({schoolData?.authorized_signature || 'Authorised Sign.'})</span>
                    </div>
                  ) : (
                    <>
                      .........................<br />
                      <span style={{fontSize: '6px', marginTop: '3mm', display: 'block'}}>({schoolData?.authorized_signature || 'Authorised Sign.'})</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdmitCardPrint;