import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FeeService from '../../Services/FeeService';
import StudentService from '../../Services/StudentService';

const FeeForm = () => {
  const navigate = useNavigate();
  const [paymentMethodOther, setPaymentMethodOther] = useState(false);
  const [discountReasonOther, setDiscountReasonOther] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const [formData, setFormData] = useState({
    feeCode: '',
    studentId: '',
    otherInfo: '',
    fullName: '',
    course: '',
    feeAmount: '',
    discountAmount: '',
    discountReason: '',
    discountReasonOther: '',
    netAmount: '',
    paymentMethod: '',
    paymentMethodOther: '',
    transactionId: '',
    paymentDate: '',
    remarks: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  // Add useEffect to handle debounced student ID search
  useEffect(() => {
    // Clean up the timeout when component unmounts
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value
    }));

    // If student ID changes, fetch student info with debounce
    if (id === 'studentId') {
      // Clear any existing timeout
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }

      if (value.trim().length > 0) {
        // Set a new timeout to delay the API call
        const timeoutId = setTimeout(() => {
          fetchStudentInfo(value);
        }, 500); // 500ms debounce delay

        setSearchTimeout(timeoutId);
      } else {
        // Clear student info if field is empty
        setStudentInfo(null);
      }
    }

    // Calculate net amount when fee amount or discount amount changes
    if (id === 'feeAmount' || id === 'discountAmount') {
      const feeAmount = id === 'feeAmount' ? parseFloat(value) || 0 : parseFloat(formData.feeAmount) || 0;
      const discountAmount = id === 'discountAmount' ? parseFloat(value) || 0 : parseFloat(formData.discountAmount) || 0;
      const netAmount = feeAmount - discountAmount;

      setFormData(prevData => ({
        ...prevData,
        netAmount: netAmount.toString()
      }));
    }
  };

  const fetchStudentInfo = async (studentId) => {
    try {
      setLoading(true);
      setError(null);

      let response;

      // First try to fetch by registration number
      try {
        console.log('Trying to fetch student by registration number:', studentId);
        response = await StudentService.getStudentByRegNo(studentId);
      } catch (regNoError) {
        console.log('Not found by registration number, trying by ID...');
        // If that fails, try by ID
        try {
          response = await StudentService.getStudentById(studentId);
        } catch (idError) {
          throw new Error('Student not found with the provided ID or registration number');
        }
      }

      console.log('Student data found:', response.data);
      setStudentInfo(response.data);

      // Pre-fill student details if available
      if (response.data) {
        const student = response.data;
        // Determine the course based on the course options in the student data
        let courseValue = student.courseApplied || '';

        // If specific course options are selected, use those
        if (student.itTools) courseValue = 'IT Tools';
        if (student.webDesigning) courseValue = 'Web Designing';
        if (student.tally) courseValue = 'Tally';
        if (student.gfxDtp) courseValue = 'GFX DTP';
        if (student.python) courseValue = 'Python';
        if (student.iot) courseValue = 'IoT';

        setFormData(prevData => ({
          ...prevData,
          studentId: studentId,
          fullName: student.fullName || '',
          course: courseValue,
          // You can pre-fill more fields as needed
          feeAmount: student.totalFee ? student.totalFee.toString() : '',
          discountAmount: student.discount ? student.discount.toString() : '0',
          netAmount: student.netFee ? student.netFee.toString() : ''
        }));
      }
    } catch (err) {
      console.error('Error fetching student info:', err);
      setError(err.message || 'Student not found. Please check the ID or registration number.');
      setStudentInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.feeAmount || !formData.netAmount || !formData.paymentMethod || !formData.transactionId || !formData.paymentDate) {
        throw new Error('Please fill in all required fields');
      }

      // Convert string values to numbers where needed
      const feeDataToSubmit = {
        ...formData,
        feeAmount: parseFloat(formData.feeAmount),
        discountAmount: formData.discountAmount ? parseFloat(formData.discountAmount) : 0,
        netAmount: parseFloat(formData.netAmount)
      };

      console.log('Submitting fee data:', feeDataToSubmit);
      const response = await FeeService.createFee(feeDataToSubmit);
      console.log('Fee submitted successfully:', response);
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        feeCode: '',
        studentId: '',
        otherInfo: '',
        fullName: '',
        course: '',
        feeAmount: '',
        discountAmount: '',
        discountReason: '',
        discountReasonOther: '',
        netAmount: '',
        paymentMethod: '',
        paymentMethodOther: '',
        transactionId: '',
        paymentDate: '',
        remarks: ''
      });

      // Reset other state variables
      setPaymentMethodOther(false);
      setDiscountReasonOther(false);
      setStudentInfo(null);

      // Optionally redirect after a delay
      // setTimeout(() => navigate('/fees'), 2000);
    } catch (err) {
      console.error('Fee submission error:', err);

      // Extract error message from response if available
      let errorMessage = 'Failed to submit fee. Please try again.';

      if (err.response && err.response.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl w-full mx-auto p-6 bg-white bg-opacity-90 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6">Fee Form</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded">
            Fee submitted successfully!
          </div>
        )}

        {studentInfo && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-300 text-blue-700 rounded">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <p><strong>Student Found:</strong> {studentInfo.fullName}</p>
              <p><strong>Registration No:</strong> {studentInfo.generatedRegNo || studentInfo.regNo}</p>
              <p><strong>Course Applied:</strong> {studentInfo.courseApplied || formData.course}</p>
              <p><strong>Contact:</strong> {studentInfo.contactNumber}</p>
              {studentInfo.emailAddress && <p><strong>Email:</strong> {studentInfo.emailAddress}</p>}
              {studentInfo.totalFee && <p><strong>Total Fee:</strong> ₹{studentInfo.totalFee}</p>}
              {studentInfo.paidFee && <p><strong>Paid Fee:</strong> ₹{studentInfo.paidFee}</p>}
              {studentInfo.remainingFee && <p><strong>Remaining Fee:</strong> ₹{studentInfo.remainingFee}</p>}
            </div>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex space-x-4">
            <div className="mb-4 flex-1">
              <label htmlFor="feeCode" className="block text-gray-700">Fee Code<span className="text-red-500">*</span></label>
              <select
                id="feeCode"
                value={formData.feeCode}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Fee Code</option>
                <option value="F001">F001</option>
                <option value="F002">F002</option>
              </select>
            </div>
            <div className="mb-4 flex-1">
              <label htmlFor="studentId" className="block text-gray-700">Student ID / Registration No<span className="text-red-500">*</span></label>
              <div className="relative">
                <input
                  type="text"
                  id="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="Enter ID or Registration Number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                  required
                />
                {loading && (
                  <div className="absolute right-3 top-2">
                    <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter student ID or registration number to auto-fill details</p>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="otherInfo" className="block text-gray-700">Other Info (if needed)</label>
            <input
              type="text"
              id="otherInfo"
              value={formData.otherInfo}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <div className="mb-4 flex-1">
              <label htmlFor="fullName" className="block text-gray-700">Full Name<span className="text-red-500">*</span></label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label htmlFor="course" className="block text-gray-700">Course<span className="text-red-500">*</span></label>
              <select
                id="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Course</option>
                <option value="IT Tools">IT Tools</option>
                <option value="Web Designing">Web Designing</option>
                <option value="Tally">Tally</option>
                <option value="GFX DTP">GFX DTP</option>
                <option value="Python">Python</option>
                <option value="IoT">IoT</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethod" className="block text-gray-700">Payment Method<span className="text-red-500">*</span></label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="creditCard"
                  className="mr-2"
                  checked={formData.paymentMethod === 'creditCard'}
                  onChange={(e) => {
                    setPaymentMethodOther(false);
                    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                  }}
                  required
                />
                Credit Card
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="bankTransfer"
                  className="mr-2"
                  checked={formData.paymentMethod === 'bankTransfer'}
                  onChange={(e) => {
                    setPaymentMethodOther(false);
                    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                  }}
                  required
                />
                Bank Transfer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  id="paymentMethod"
                  value="other"
                  className="mr-2"
                  checked={formData.paymentMethod === 'other'}
                  onChange={(e) => {
                    setPaymentMethodOther(true);
                    setFormData(prev => ({ ...prev, paymentMethod: e.target.value }));
                  }}
                  required
                />
                Other
              </label>
            </div>
            {paymentMethodOther && (
              <input
                type="text"
                id="paymentMethodOther"
                value={formData.paymentMethodOther}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mt-2"
                placeholder="Please specify payment method"
                required
              />
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="discountReason" className="block text-gray-700">Discount Reason (if applicable)</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountReason"
                  id="discountReason"
                  value="scholarship"
                  className="mr-2"
                  checked={formData.discountReason === 'scholarship'}
                  onChange={(e) => {
                    setDiscountReasonOther(false);
                    setFormData(prev => ({ ...prev, discountReason: e.target.value }));
                  }}
                />
                Scholarship
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountReason"
                  id="discountReason"
                  value="specialOffer"
                  className="mr-2"
                  checked={formData.discountReason === 'specialOffer'}
                  onChange={(e) => {
                    setDiscountReasonOther(false);
                    setFormData(prev => ({ ...prev, discountReason: e.target.value }));
                  }}
                />
                Special Offer
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="discountReason"
                  id="discountReason"
                  value="other"
                  className="mr-2"
                  checked={formData.discountReason === 'other'}
                  onChange={(e) => {
                    setDiscountReasonOther(true);
                    setFormData(prev => ({ ...prev, discountReason: e.target.value }));
                  }}
                />
                Other
              </label>
            </div>
            {discountReasonOther && (
              <input
                type="text"
                id="discountReasonOther"
                value={formData.discountReasonOther}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 mt-2"
                placeholder="Please specify discount reason"
              />
            )}
          </div>

          <div className="flex space-x-4">
            <div className="mb-4 flex-1">
              <label htmlFor="feeAmount" className="block text-gray-700">Fee Amount<span className="text-red-500">*</span></label>
              <input
                type="number"
                id="feeAmount"
                value={formData.feeAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label htmlFor="discountAmount" className="block text-gray-700">Discount Amount</label>
              <input
                type="number"
                id="discountAmount"
                value={formData.discountAmount}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="netAmount" className="block text-gray-700">Net Amount<span className="text-red-500">*</span></label>
            <input
              type="number"
              id="netAmount"
              value={formData.netAmount}
              readOnly
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-gray-100"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="mb-4 flex-1">
              <label htmlFor="transactionId" className="block text-gray-700">Transaction ID<span className="text-red-500">*</span></label>
              <input
                type="text"
                id="transactionId"
                value={formData.transactionId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4 flex-1">
              <label htmlFor="paymentDate" className="block text-gray-700">Payment Date<span className="text-red-500">*</span></label>
              <input
                type="date"
                id="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="remarks" className="block text-gray-700">Remarks</label>
            <textarea
              id="remarks"
              value={formData.remarks}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              rows="3"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-gray-500 hover:bg-gray-600'} text-white py-2 rounded-lg focus:outline-none`}
          >
            {loading ? 'Submitting...' : 'Submit Fee Information'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeeForm;
