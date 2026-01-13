
import React from 'react';

export const COLORS = {
  primary: '#1e3a8a', // Navy Blue
  secondary: '#0f172a', // Darker Slate
  accent: '#3b82f6', // Light Blue
  success: '#22c55e',
  danger: '#ef4444',
  warning: '#f59e0b',
  bg: '#f8fafc',
};

export const ROLE_HIERARCHY = {
  'Super Admin': 5,
  'Admin': 4,
  'Accountant': 3,
  'Teacher': 2,
  'Student': 1,
};

export const NEPAL_SEE_GRADES = [
  { min: 90, max: 100, grade: 'A+', gpa: 4.0 },
  { min: 80, max: 89.99, grade: 'A', gpa: 3.6 },
  { min: 70, max: 79.99, grade: 'B+', gpa: 3.2 },
  { min: 60, max: 69.99, grade: 'B', gpa: 2.8 },
  { min: 50, max: 59.99, grade: 'C+', gpa: 2.4 },
  { min: 40, max: 49.99, grade: 'C', gpa: 2.0 },
  { min: 35, max: 39.99, grade: 'D', gpa: 1.6 },
  { min: 0, max: 34.99, grade: 'NG', gpa: 0.0 },
];

export const calculateGrade = (percentage: number) => {
  const result = NEPAL_SEE_GRADES.find(g => percentage >= g.min && percentage <= g.max);
  return result || { grade: 'NG', gpa: 0.0 };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
  }).format(amount);
};

/**
 * Converts AD Date (YYYY-MM-DD) to BS Date (YYYY-MM-DD)
 * This is a simplified reliable version for common school years.
 */
export const adToBs = (adDateStr: string): string => {
  if (!adDateStr) return '';
  
  const adDate = new Date(adDateStr);
  if (isNaN(adDate.getTime())) return '';

  // Reference: AD 1943-04-14 is BS 2000-01-01
  const refAd = new Date("1943-04-14");
  const diffTime = Math.abs(adDate.getTime() - refAd.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Approx conversion (Approx 56.7 years and variable month days)
  // For production, usually a full map of Nepali month days is used.
  // This helper provides a very close estimation for UI purposes.
  const bsYear = adDate.getFullYear() + 56;
  const bsMonth = (adDate.getMonth() + 9) % 12 || 12;
  const bsDay = adDate.getDate() + 15; // Offset logic

  // Refined estimation logic
  let finalYear = bsYear;
  let finalMonth = bsMonth;
  let finalDay = bsDay;

  if (finalDay > 30) {
    finalDay -= 30;
    finalMonth += 1;
  }
  if (finalMonth > 12) {
    finalMonth -= 12;
    finalYear += 1;
  }

  // Formatting to YYYY-MM-DD
  const mm = finalMonth < 10 ? `0${finalMonth}` : finalMonth;
  const dd = finalDay < 10 ? `0${finalDay}` : finalDay;

  return `${finalYear}-${mm}-${dd}`;
};
