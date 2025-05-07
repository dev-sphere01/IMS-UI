import React from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';
import FormCard from '../FormCard';

const formatCurrency = (value) => {
  if (!value) return '';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '';
  
  if (numValue >= 1000000) {
    return `₹${(numValue / 1000000).toFixed(2)}M`;
  } else if (numValue >= 1000) {
    return `₹${(numValue / 1000).toFixed(1)}K`;
  } else {
    return `₹${numValue}`;
  }
};

const PaymentDetailsStep = ({ formData, handleChange, errors }) => {
  return (
    <FormCard title="Payment Details" icon={<FaMoneyBillWave />}>
      <div className="mb-4">
        <label htmlFor="totalFee" className="block text-gray-700">
          Total Fee<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="totalFee"
            value={formData.totalFee}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          <div className="ml-2 text-gray-600">
            {formatCurrency(formData.totalFee)}
          </div>
        </div>
        {errors.totalFee && <p className="text-red-500 text-sm mt-1">{errors.totalFee}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="discount" className="block text-gray-700">
          Discount
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="discount"
            value={formData.discount}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          />
          <div className="ml-2 text-gray-600">
            {formatCurrency(formData.discount)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="netFee" className="block text-gray-700">
          Net Fee<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="netFee"
            value={formData.netFee}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            readOnly
          />
          <div className="ml-2 text-gray-600">
            {formatCurrency(formData.netFee)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="paidFee" className="block text-gray-700">
          Paid Fee<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="paidFee"
            value={formData.paidFee}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          <div className="ml-2 text-gray-600">
            {formatCurrency(formData.paidFee)}
          </div>
        </div>
        {errors.paidFee && <p className="text-red-500 text-sm mt-1">{errors.paidFee}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="remainingFee" className="block text-gray-700">
          Remaining Fee
        </label>
        <div className="flex items-center">
          <input
            type="number"
            id="remainingFee"
            value={formData.remainingFee}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            readOnly
          />
          <div className="ml-2 text-gray-600">
            {formatCurrency(formData.remainingFee)}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="paymentMethod" className="block text-gray-700">
          Payment Method<span className="text-red-500">*</span>
        </label>
        <select
          id="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          required
        >
          <option value="">Select Payment Method</option>
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank Transfer">Bank Transfer</option>
          <option value="Credit Card">Credit Card</option>
          <option value="Debit Card">Debit Card</option>
          <option value="Cheque">Cheque</option>
        </select>
        {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="transactionId" className="block text-gray-700">
          Transaction ID
        </label>
        <input
          type="text"
          id="transactionId"
          value={formData.transactionId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="paymentDate" className="block text-gray-700">
          Payment Date<span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          id="paymentDate"
          value={formData.paymentDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          required
        />
        {errors.paymentDate && <p className="text-red-500 text-sm mt-1">{errors.paymentDate}</p>}
      </div>

      <div className="mb-4">
        <label htmlFor="importantNoteRelatedToTime" className="block text-gray-700">
          Important Note Related to Time
        </label>
        <textarea
          id="importantNoteRelatedToTime"
          value={formData.importantNoteRelatedToTime}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          rows="3"
        ></textarea>
      </div>

      <div className="mb-4">
        <label htmlFor="status" className="block text-gray-700">
          Status<span className="text-red-500">*</span>
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          required
        >
          <option value="">Select Status</option>
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
      </div>
    </FormCard>
  );
};

export default PaymentDetailsStep;
