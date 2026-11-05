/**
 * admin/src/utils/formatters.js
 */

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString();
};

export const formatScore = (val) => {
  if (val === null || val === undefined) return '--';
  return `${Number(val).toFixed(1)}%`;
};

export const getEducationLevelLabel = (level) => {
  const map = {
    graduation: 'Graduation / College',
    intermediate: 'Intermediate (11th & 12th)',
    highschool: 'High School (9th & 10th)',
    nursery: 'Primary & Nursery',
    all: 'All Levels',
  };
  return map[level] || level || 'All';
};

export const getTierColor = (level) => {
  const colors = {
    graduation: '#8b5cf6', // Violet
    intermediate: '#06b6d4', // Cyan
    highschool: '#10b981', // Emerald
    nursery: '#f59e0b', // Amber
  };
  return colors[level] || '#6366f1';
};

