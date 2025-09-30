import React from 'react';

const DashboardCardSkeleton = () => {
  return (
    <div style={{
      borderRadius: '8px',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      margin: '10px',
      width: '100%',
      maxWidth: '400px',
    }}>
      <div style={{
        height: '20px',
        width: '70%',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '10px',
      }} />
      <div style={{
        height: '15px',
        width: '90%',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
        marginBottom: '10px',
      }} />
      <div style={{
        height: '15px',
        width: '80%',
        backgroundColor: '#e0e0e0',
        borderRadius: '4px',
      }} />
    </div>
  );
};

export default DashboardCardSkeleton;