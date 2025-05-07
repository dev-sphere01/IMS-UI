import React from 'react';

const Report = () => {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-3xl font-bold text-white drop-shadow-md mb-2">
        IMS
      </h1>
      <h2 className="text-xl font-semibold text-white drop-shadow-md mb-8">
        Reports
      </h2>

      <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold mb-4">Reporting Dashboard</h3>
        <p className="text-gray-700">
          This is the reporting dashboard. Here you can view and generate various reports for the institution.
        </p>
      </div>
    </div>
  );
};

export default Report;
