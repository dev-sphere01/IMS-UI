import React from 'react';
import { FaUserAlt } from 'react-icons/fa';
import FormCard from '../FormCard';

const BasicInfoStep = ({ formData, handleChange, errors }) => {
  return (
    <FormCard title="Basic Information" icon={<FaUserAlt />}>
      <div className="flex space-x-4">
        <div className="mb-4 flex-1">
          <label htmlFor="formNo" className="block text-gray-700">
            Form No (F + Branch + Unique Number)<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="formNo"
            value={formData.formNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.formNo && <p className="text-red-500 text-sm mt-1">{errors.formNo}</p>}
        </div>
        <div className="mb-4 flex-1">
          <label htmlFor="centerCode" className="block text-gray-700">
            Center Code<span className="text-red-500">*</span>
          </label>
          <select
            id="centerCode"
            value={formData.centerCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Center Code</option>
            <option value="C001">C001</option>
            <option value="C002">C002</option>
            <option value="C003">C003</option>
          </select>
          {errors.centerCode && <p className="text-red-500 text-sm mt-1">{errors.centerCode}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="employeeId" className="block text-gray-700">
          Employee ID (E + Branch + Unique Number)<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="employeeId"
          value={formData.employeeId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          required
        />
        {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="otherInfo" className="block text-gray-700">
          Other Info (if needed)
        </label>
        <input
          type="text"
          id="otherInfo"
          value={formData.otherInfo}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="generatedRegNo" className="block text-gray-700">
          Registration No (R + Branch + Month + Year + ID)<span className="text-red-500">*</span>
        </label>
        <div className="flex">
          <input
            type="text"
            id="generatedRegNo"
            value={formData.generatedRegNo}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
            readOnly
          />
          <button
            type="button"
            onClick={() => window.generateRegNo && window.generateRegNo()}
            className="ml-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate
          </button>
        </div>
        {errors.generatedRegNo && <p className="text-red-500 text-sm mt-1">{errors.generatedRegNo}</p>}
      </div>

      <div className="flex space-x-4">
        <div className="mb-4 flex-1">
          <label htmlFor="fullName" className="block text-gray-700">
            Full Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
        </div>
        <div className="mb-4 flex-1">
          <label htmlFor="dob" className="block text-gray-700">
            Date of Birth<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="mb-4 flex-1">
          <label htmlFor="gender" className="block text-gray-700">
            Gender<span className="text-red-500">*</span>
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="PreferNotToSay">Prefer Not to Say</option>
          </select>
          {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
        </div>
        <div className="mb-4 flex-1">
          <label htmlFor="category" className="block text-gray-700">
            Category<span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Category</option>
            <option value="General">General</option>
            <option value="OBC">OBC</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="aadharNo" className="block text-gray-700">
          Aadhar No<span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="aadharNo"
          value={formData.aadharNo}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          required
          pattern="[0-9]{12}"
          title="Please enter a valid 12-digit Aadhar number"
        />
        {errors.aadharNo && <p className="text-red-500 text-sm mt-1">{errors.aadharNo}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="religion" className="block text-gray-700">
          Religion<span className="text-red-500">*</span>
        </label>
        <select
          id="religion"
          value={formData.religion}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          required
        >
          <option value="">Select Religion</option>
          <option value="Hindu">Hindu</option>
          <option value="Muslim">Muslim</option>
          <option value="Christian">Christian</option>
          <option value="Sikh">Sikh</option>
          <option value="Buddhist">Buddhist</option>
          <option value="Jain">Jain</option>
          <option value="Other">Other</option>
        </select>
        {errors.religion && <p className="text-red-500 text-sm mt-1">{errors.religion}</p>}
      </div>
    </FormCard>
  );
};

export default BasicInfoStep;
