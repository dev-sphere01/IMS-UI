import React from 'react';
import EnrollmentChart from '../../components/dashboard/EnrollmentChart';

const ChartTest = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chart Test Page</h1>
      <div className="max-w-4xl mx-auto">
        <EnrollmentChart />
      </div>
    </div>
  );
};

export default ChartTest;
