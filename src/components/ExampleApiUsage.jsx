import { useState, useEffect } from 'react';
import UserService from '../Services/UserService';
import EnquiryService from '../Services/EnquiryService';
import StudentService from '../Services/StudentService';
import FeeService from '../Services/FeeService';

const ExampleApiUsage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [apiType, setApiType] = useState('');

  // Example login function
  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    setApiType('login');
    
    try {
      const loginData = {
        email: 'example@example.com',
        password: 'password123'
      };
      
      const result = await UserService.login(loginData);
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example get all enquiries function
  const handleGetEnquiries = async () => {
    setLoading(true);
    setError(null);
    setApiType('enquiries');
    
    try {
      const result = await EnquiryService.getAllEnquiries();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching enquiries');
      console.error('Enquiry fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example get all students function
  const handleGetStudents = async () => {
    setLoading(true);
    setError(null);
    setApiType('students');
    
    try {
      const result = await StudentService.getAllStudents();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching students');
      console.error('Student fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Example get all fees function
  const handleGetFees = async () => {
    setLoading(true);
    setError(null);
    setApiType('fees');
    
    try {
      const result = await FeeService.getAllFees();
      setData(result);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while fetching fees');
      console.error('Fee fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">API Connection Examples</h2>
      
      <div className="flex space-x-2 mb-4">
        <button 
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Login API
        </button>
        
        <button 
          onClick={handleGetEnquiries}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Get Enquiries
        </button>
        
        <button 
          onClick={handleGetStudents}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Get Students
        </button>
        
        <button 
          onClick={handleGetFees}
          className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Get Fees
        </button>
      </div>
      
      {loading && <p className="text-gray-500">Loading...</p>}
      
      {error && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded mb-4">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      
      {data && (
        <div className="mt-4">
          <h3 className="font-bold text-lg mb-2">
            {apiType === 'login' && 'Login Response'}
            {apiType === 'enquiries' && 'Enquiries Data'}
            {apiType === 'students' && 'Students Data'}
            {apiType === 'fees' && 'Fees Data'}
          </h3>
          <pre className="bg-gray-100 p-3 rounded overflow-auto max-h-60">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ExampleApiUsage;
