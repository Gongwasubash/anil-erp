// Print utility for applying pdf2htmlEX-style formatting
export const applyPrintStyles = () => {
  // Create and inject print styles
  const printStyles = `
    <style id="pdf2htmlex-print-styles">
      @media print {
        @page {
          margin: 0;
          size: A4;
        }
        
        html, body {
          margin: 0;
          padding: 0;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: sans-serif;
          background: white;
        }
        
        .no-print, button, .print-button, nav, .navigation {
          display: none !important;
        }
        
        .print-container {
          position: relative;
          background-color: white;
          overflow: hidden;
          margin: 0;
          border: 0;
          width: 100%;
          height: 100%;
          page-break-after: always;
          page-break-inside: avoid;
        }
        
        .print-content {
          position: absolute;
          border: 0;
          padding: 20px;
          margin: 0;
          top: 0;
          left: 0;
          width: calc(100% - 40px);
          height: calc(100% - 40px);
          overflow: hidden;
          display: block;
        }
        
        .print-header {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
        }
        
        .print-subheader {
          text-align: center;
          font-size: 14px;
          margin-bottom: 15px;
          color: #666;
        }
        
        .print-student-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
        }
        
        .print-student-info p {
          margin: 5px 0;
          font-size: 12px;
          line-height: 1.4;
        }
        
        .print-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        
        .print-table th,
        .print-table td {
          border: 1px solid #000 !important;
          padding: 8px 4px;
          text-align: center;
          vertical-align: middle;
        }
        
        .print-table th {
          background-color: #2c5aa0 !important;
          color: white !important;
          font-weight: bold;
          font-size: 10px;
        }
        
        .print-table tbody tr:nth-child(even) {
          background-color: #f8f9fa !important;
        }
        
        .print-table tbody tr:nth-child(odd) {
          background-color: white !important;
        }
        
        .print-table td:first-child {
          text-align: left;
          font-weight: bold;
          padding-left: 8px;
        }
        
        .print-grade {
          font-weight: bold;
          color: #2c5aa0 !important;
        }
        
        .print-gpa {
          font-weight: bold;
          color: #6f42c1 !important;
        }
        
        .print-result-pass {
          font-weight: bold;
          color: #28a745 !important;
        }
        
        .print-result-fail {
          font-weight: bold;
          color: #dc3545 !important;
        }
        
        .print-summary {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f9fa;
          border: 1px solid #ddd;
        }
        
        .print-summary h3 {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 15px;
          text-align: center;
        }
        
        .print-summary-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 15px;
          text-align: center;
        }
        
        .print-summary-item p:first-child {
          font-size: 10px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .print-summary-item p:last-child {
          font-size: 16px;
          font-weight: bold;
        }
        
        .no-page-break {
          page-break-inside: avoid;
        }
        
        * {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    </style>
  `;
  
  // Remove existing print styles
  const existingStyles = document.getElementById('pdf2htmlex-print-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  // Add new print styles
  document.head.insertAdjacentHTML('beforeend', printStyles);
};

export const removePrintStyles = () => {
  const existingStyles = document.getElementById('pdf2htmlex-print-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
};

export const handlePrint = () => {
  applyPrintStyles();
  
  // Add print classes to elements
  document.body.classList.add('print-mode');
  
  // Trigger print
  window.print();
  
  // Clean up after print dialog closes
  setTimeout(() => {
    document.body.classList.remove('print-mode');
    removePrintStyles();
  }, 1000);
};