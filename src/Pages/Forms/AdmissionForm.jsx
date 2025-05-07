import React, { useState, useEffect, useCallback } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import StudentService from '../../Services/StudentService';
import EnquiryService from '../../Services/EnquiryService';
import FileService from '../../Services/FileService';
import {
  FaUserGraduate, FaArrowRight, FaArrowLeft,
  FaCheckCircle, FaSearch, FaTrash
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import form step components
import FormStepper from '../../components/forms/FormStepper';
import BasicInfoStep from '../../components/forms/admission/BasicInfoStep';
import DocumentsStep from '../../components/forms/admission/DocumentsStep';
import EnhancedContactDetailsStep from '../../components/forms/admission/EnhancedContactDetailsStep';
import EducationCourseStep from '../../components/forms/admission/EducationCourseStep';
import PaymentDetailsStep from '../../components/forms/admission/PaymentDetailsStep';
import ReviewStep from '../../components/forms/admission/ReviewStep';

const AdmissionForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  // Prevent accidental navigation
  useBeforeUnload(
    useCallback((event) => {
      event.preventDefault();
      return "You have unsaved changes. Are you sure you want to leave?";
    }, [])
  );

  // Search functionality
  const [searchName, setSearchName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Define form steps
  const formSteps = [
    { label: 'Basic Info', completed: false },
    { label: 'Documents', completed: false },
    { label: 'Contact', completed: false },
    { label: 'Education', completed: false },
    { label: 'Payment', completed: false },
    { label: 'Review', completed: false }
  ];

  // UI state variables for "other" options in radio buttons
  const [completedSteps, setCompletedSteps] = useState([]);

  // Form data state
  const [formData, setFormData] = useState({
    // Basic Info
    formNo: '',
    centerCode: '',
    employeeId: '',
    otherInfo: '',
    generatedRegNo: '',
    fullName: '',
    dob: '',
    gender: '',
    category: '',
    aadharNo: '',
    religion: '',

    // Documents
    aadharPhoto: '',
    candidatePhoto: '',
    candidateSignature: '',
    candidateLeftThumbImpression: '',
    apaarId: '',
    tenthMarksheet: '',
    twelfthMarksheet: '',
    exServicemen: '',
    speciallyAbled: '',
    speciallyAbledOther: '',

    // Contact Details
    contactNumber: '',
    alternateContactNumber: '',
    emailAddress: '',
    state: '',
    district: '',
    address: '',
    pinCode: '',
    fathersName: '',
    fathersOccupation: '',
    fathersJobRole: '',
    departmentOrCompany: '',
    mothersName: '',
    guardianName: '',
    guardianRelation: '',
    guardianContactNumber: '',

    // Education & Course
    highestEducationalQualification: '',
    boardOrUniversity: '',
    yearOfPassing: '',
    subjectsStudied: '',
    courseApplied: '',
    preferredModeOfLearning: '',
    tShirt: 'No',
    itTools: 'No',
    webDesigning: 'No',
    tally: 'No',
    gfxDtp: 'No',
    python: 'No',
    iot: 'No',
    referralSource: '',
    referralSourceOther: '',
    referalName: '',
    computerAccess: '',
    computerAccessOther: '',

    // Payment Details
    totalFee: '',
    discount: '',
    netFee: '',
    paidFee: '',
    remainingFee: '',
    paymentMethod: '',
    transactionId: '',
    paymentDate: '',
    importantNoteRelatedToTime: '',
    status: '',
    regNo: '',
    month: ''
  });

  // Handle form field changes
  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;

    // Clear any error messages when user makes changes
    if (error) setError(null);
    if (errors[id || name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[id || name];
        return newErrors;
      });
    }

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [id || name]: checked ? 'Yes' : 'No'
      }));
      return;
    }

    // Handle radio inputs
    if (type === 'radio') {
      setFormData(prev => ({
        ...prev,
        [id || name]: value
      }));

      // Handle special cases for "other" options
      if (id === 'speciallyAbled' || name === 'speciallyAbled') {
        setSpeciallyAbledOther(value === 'other');
      } else if (id === 'referralSource' || name === 'referralSource') {
        setReferralSourceOther(value === 'other');
      } else if (id === 'computerAccess' || name === 'computerAccess') {
        setComputerAccessOther(value === 'other');
      }
      return;
    }

    // Handle numeric inputs
    if (type === 'number') {
      // Calculate net fee when totalFee or discount changes
      if (id === 'totalFee' || id === 'discount') {
        const totalFee = id === 'totalFee' ? parseFloat(value) || 0 : parseFloat(formData.totalFee) || 0;
        const discount = id === 'discount' ? parseFloat(value) || 0 : parseFloat(formData.discount) || 0;
        const netFee = totalFee - discount;

        setFormData(prev => ({
          ...prev,
          [id]: value,
          netFee: netFee.toString()
        }));
        return;
      }

      // Calculate remaining fee when paidFee changes
      if (id === 'paidFee') {
        const netFee = parseFloat(formData.netFee) || 0;
        const paidFee = parseFloat(value) || 0;
        const remainingFee = netFee - paidFee;

        setFormData(prev => ({
          ...prev,
          [id]: value,
          remainingFee: remainingFee.toString()
        }));
        return;
      }
    }

    // Handle all other inputs
    setFormData(prev => ({
      ...prev,
      [id || name]: value
    }));
  };





  // Handle checkbox changes for course selection
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked ? 'Yes' : 'No'
    }));
  };

  // Helper function to convert boolean or string values to "Yes" or "No"
  const convertToYesNo = (value) => {
    if (value === true || value === 'true' || value === 'Yes' || value === 'yes' || value === 'YES') {
      return 'Yes';
    } else if (value === false || value === 'false' || value === 'No' || value === 'no' || value === 'NO') {
      return 'No';
    } else {
      return value || 'No'; // Default to "No" if value is undefined or null
    }
  };

  // Handle file uploads
  const handleFileChange = async (e) => {
    const { id, files } = e.target;
    if (files && files[0]) {
      try {
        // Validate file type and size
        const file = files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
          toast.error(`Invalid file type. Please upload JPEG, PNG, GIF or PDF files.`, {
            position: "bottom-right",
            autoClose: 3000
          });
          return;
        }

        if (file.size > maxSize) {
          toast.error(`File is too large. Maximum size is 5MB.`, {
            position: "bottom-right",
            autoClose: 3000
          });
          return;
        }

        // Show loading toast
        const loadingToastId = toast.loading(`Uploading ${file.name}...`, {
          position: "bottom-right"
        });

        // Determine the appropriate folder based on the document type
        let folder = 'students';
        const studentId = formData.generatedRegNo || formData.regNo || 'temp';
        folder = `students/${studentId}`;

        console.log(`Uploading file ${file.name} to folder ${folder}`);

        try {
          // Log detailed information about the file being uploaded
          console.log(`Uploading file: ${file.name}`);
          console.log(`File type: ${file.type}`);
          console.log(`File size: ${file.size} bytes`);
          console.log(`Target folder: ${folder}`);

          // Upload the file
          const response = await FileService.uploadFile(file, folder);

          console.log('Upload response:', response);

          if (response && response.success) {
            console.log(`File uploaded successfully: ${response.data.path}`);

            // Update form data with the file path
            setFormData(prev => ({
              ...prev,
              [id]: response.data.path
            }));

            // Update loading toast to success
            toast.update(loadingToastId, {
              render: `File uploaded successfully!`,
              type: "success",
              isLoading: false,
              autoClose: 2000
            });
          } else {
            console.warn('File upload API returned unexpected response:', response);

            // Fallback: Just store the filename for now
            setFormData(prev => ({
              ...prev,
              [id]: file.name
            }));

            // Update loading toast
            toast.update(loadingToastId, {
              render: `File selected (upload API returned unexpected response)`,
              type: "warning",
              isLoading: false,
              autoClose: 3000
            });
          }
        } catch (uploadError) {
          console.error('Error with file upload API:', uploadError);

          // Log detailed error information
          if (uploadError.response) {
            console.error('Error response data:', uploadError.response.data);
            console.error('Error response status:', uploadError.response.status);
            console.error('Error response headers:', uploadError.response.headers);
          } else if (uploadError.request) {
            console.error('Error request:', uploadError.request);
          } else {
            console.error('Error message:', uploadError.message);
          }
          console.error('Error config:', uploadError.config);

          // Fallback: Just store the filename for now
          setFormData(prev => ({
            ...prev,
            [id]: file.name
          }));

          // Update loading toast with more detailed error message
          const errorMessage = uploadError.response?.data?.message || uploadError.message;
          toast.update(loadingToastId, {
            render: `Error uploading file: ${errorMessage}`,
            type: "error",
            isLoading: false,
            autoClose: 3000
          });
        }
      } catch (error) {
        console.error('Error handling file:', error);

        // Show error toast
        toast.error(`Error handling file: ${error.message}`, {
          position: "bottom-right",
          autoClose: 3000
        });
      }
    }
  };

  // Handle file deletion
  const handleFileDelete = async (fieldId, filePath) => {
    try {
      console.log(`Deleting file for field ${fieldId}: ${filePath}`);

      // Show loading toast
      const loadingToastId = toast.loading(`Deleting file...`, {
        position: "bottom-right"
      });

      try {
        // Delete the file from the server
        const response = await FileService.deleteFile(filePath);

        if (response && response.success) {
          console.log(`File deleted successfully: ${filePath}`);

          // Update form data to clear the file path
          setFormData(prev => {
            const newFormData = {
              ...prev,
              [fieldId]: ''
            };
            console.log(`Updated form data for ${fieldId}:`, newFormData[fieldId]);
            return newFormData;
          });

          // Update loading toast to success
          toast.update(loadingToastId, {
            render: `File deleted successfully!`,
            type: "success",
            isLoading: false,
            autoClose: 2000
          });
        } else {
          console.warn('File deletion API returned unexpected response:', response);

          // Still update form data to clear the file path
          setFormData(prev => ({
            ...prev,
            [fieldId]: ''
          }));

          // Update loading toast
          toast.update(loadingToastId, {
            render: `File deleted but server returned unexpected response`,
            type: "warning",
            isLoading: false,
            autoClose: 3000
          });
        }
      } catch (deleteError) {
        console.error('Error with file deletion API:', deleteError);

        // Still update form data to clear the file path
        setFormData(prev => ({
          ...prev,
          [fieldId]: ''
        }));

        // Update loading toast with error message
        const errorMessage = deleteError.response?.data?.message || deleteError.message;
        toast.update(loadingToastId, {
          render: `Error deleting file from server, but field has been cleared: ${errorMessage}`,
          type: "warning",
          isLoading: false,
          autoClose: 3000
        });
      }
    } catch (error) {
      console.error('Error handling file deletion:', error);

      // Show error toast
      toast.error(`Error handling file deletion: ${error.message}`, {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  // Generate registration number
  const generateRegNo = () => {
    const branch = formData.centerCode || 'C001';
    const date = new Date();
    const month = date.getMonth() + 1;
    const year = date.getFullYear().toString().slice(-2);
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const regNo = `R${branch}${month}${year}${randomId}`;

    setFormData(prev => ({
      ...prev,
      generatedRegNo: regNo,
      regNo: regNo,
      month: `${month}/${year}`
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare data for API
      const studentData = {
        ...formData,
        // Convert string values to appropriate types
        totalFee: parseFloat(formData.totalFee) || 0,
        discount: parseFloat(formData.discount) || 0,
        netFee: parseFloat(formData.netFee) || 0,
        paidFee: parseFloat(formData.paidFee) || 0,
        remainingFee: parseFloat(formData.remainingFee) || 0,
        // Format date properly for API
        dob: formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''
      };

      // Check if this is an update to an existing record or a new record
      let response;

      // Make sure we have a valid ID for updates
      const hasValidId = formData._id && typeof formData._id === 'string' && formData._id.length === 24;

      console.log('Form data ID:', formData._id);
      console.log('Has valid ID for update:', hasValidId);

      if (hasValidId) {
        try {
          // Update existing student with valid ID
          console.log('Attempting to update student with ID:', formData._id);

          // Include the ID in the data for the backend
          const updateData = {
            ...studentData,
            _id: formData._id
          };

          response = await StudentService.updateStudent(formData._id, updateData);
          console.log('Student record updated successfully:', response);

          // Show success toast
          toast.success('Student record updated successfully!', {
            position: "bottom-right",
            autoClose: 3000
          });
        } catch (updateError) {
          console.error('Error updating student, falling back to create:', updateError);

          // If update fails, try to create a new record
          response = await StudentService.createStudent(studentData);
          console.log('Created new student record as fallback:', response);

          toast.info('Created a new student record instead of updating.', {
            position: "bottom-right",
            autoClose: 3000
          });
        }
      } else {
        // Create new student
        console.log('Creating new student record');
        response = await StudentService.createStudent(studentData);
        console.log('Admission form submitted successfully:', response);

        // Show success toast
        toast.success('Admission form submitted successfully!', {
          position: "bottom-right",
          autoClose: 3000
        });
      }

      setSuccess(true);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          formNo: '',
          centerCode: '',
          employeeId: '',
          otherInfo: '',
          generatedRegNo: '',
          fullName: '',
          dob: '',
          gender: '',
          category: '',
          aadharNo: '',
          aadharPhoto: '',
          candidatePhoto: '',
          candidateSignature: '',
          candidateLeftThumbImpression: '',
          apaarId: '',
          contactNumber: '',
          alternateContactNumber: '',
          emailAddress: '',
          state: '',
          district: '',
          address: '',
          pinCode: '',
          occupation: '',
          departmentOrCompany: '',
          mothersName: '',
          fathersName: '',
          guardianName: '',
          guardianRelation: '',
          guardianContactNumber: '',
          courseApplied: '',
          preferredModeOfLearning: '',
          totalFee: '',
          discount: '',
          netFee: '',
          paidFee: '',
          remainingFee: '',
          regNo: '',
          month: '',
          speciallyAbled: '',
          speciallyAbledOther: '',
          interestedCourseOther: '',
          referralSource: '',
          referralSourceOther: '',
          computerAccess: '',
          computerAccessOther: ''
        });
        setCurrentStep(1);
        setSuccess(false);
        setCompletedSteps([]);

        // Reset form steps completion status
        formSteps.forEach(step => {
          step.completed = false;
        });
      }, 3000);

    } catch (err) {
      console.error('Error submitting admission form:', err);
      setError(err.response?.data?.message || 'Failed to submit admission form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Make the generateRegNo function available globally
  useEffect(() => {
    window.generateRegNo = generateRegNo;
    return () => {
      delete window.generateRegNo;
    };
  }, []);

  // Handle search by name or registration number
  const handleSearch = async () => {
    if (!searchName.trim()) {
      setSearchError('Please enter a name or registration number to search');
      return;
    }

    setSearching(true);
    setSearchError(null);
    setShowSearchResults(true);

    try {
      // First check if the search term looks like a registration number
      const isRegNumber = searchName.trim().toUpperCase().startsWith('R') && searchName.trim().length >= 8;

      if (isRegNumber) {
        // Try to find an existing admission record
        try {
          console.log('Searching for existing admission with reg number:', searchName.trim());
          const studentResponse = await StudentService.getStudentByRegNo(searchName.trim());
          console.log('Found existing student:', studentResponse);

          if (studentResponse && studentResponse.data) {
            // Auto-fill the form with the existing student data
            fillFormWithStudentData(studentResponse.data);
            setShowSearchResults(false);
            return;
          }
        } catch (studentError) {
          console.log('No existing student found with this registration number, searching enquiries instead');
        }
      }

      // If not a reg number or no student found, search enquiries
      const response = await EnquiryService.searchEnquiriesByName(searchName);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Error searching:', error);

      // Show specific error message based on the error type
      if (error.message && error.message.includes('API is not available')) {
        setSearchError('API server is not available. Please try again later.');
      } else if (error.message && error.message.includes('Unable to find student data')) {
        setSearchError('Unable to find student data. API endpoints may be unavailable.');
      } else {
        setSearchError('Failed to search. Please try again.');
      }

      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  // Fill form with existing student data (for updates)
  const fillFormWithStudentData = (student) => {
    console.log("Filling form with existing student data:", student);

    // Create a new form data object with student data
    const newFormData = {
      ...formData,
      // Store the student ID for updates
      _id: student._id,
      // Basic Info
      formNo: student.formNo || `FORM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      generatedRegNo: student.regNo || student.generatedRegNo,
      regNo: student.regNo || student.generatedRegNo,
      month: student.month || `${new Date().getMonth() + 1}/${new Date().getFullYear().toString().slice(-2)}`,
      fullName: formatFieldCase('fullName', student.fullName) || '',
      gender: formatFieldCase('gender', student.gender) || '',
      category: formatFieldCase('category', student.category) || '',
      religion: formatFieldCase('religion', student.religion) || '',
      nationality: formatFieldCase('nationality', student.nationality) || 'Indian',
      dob: student.dob || student.dateOfBirth ? new Date(student.dob || student.dateOfBirth).toISOString().split('T')[0] : '',
      aadharNo: student.aadharNo || '',

      // Contact Details
      emailAddress: student.emailAddress ? student.emailAddress.toLowerCase() : '',
      contactNumber: student.contactNumber || '',
      alternateContactNumber: student.alternateContactNumber || student.alternativeContactNumber || '',
      address: student.address || student.residentialAddress || '',
      pinCode: student.pinCode || '',
      state: formatFieldCase('state', student.state) || '',
      district: formatFieldCase('district', student.district) || '',

      // Family Details
      fathersName: formatFieldCase('fathersName', student.fathersName) || '',
      fathersOccupation: formatFieldCase('fathersOccupation', student.fathersOccupation) || '',
      fathersJobRole: student.fathersJobRole || '',
      departmentOrCompany: student.departmentOrCompany || '',
      mothersName: formatFieldCase('mothersName', student.mothersName) || '',
      guardianName: formatFieldCase('guardianName', student.guardianName) || '',
      guardianRelation: formatFieldCase('guardianRelation', student.guardianRelation) || '',
      guardianContactNumber: student.guardianContactNumber || '',

      // Education & Course
      highestEducationalQualification: student.highestEducationalQualification || student.currentEducationalQualification || '',
      boardOrUniversity: formatFieldCase('boardOrUniversity', student.boardOrUniversity) || '',
      yearOfPassing: student.yearOfPassing ? student.yearOfPassing.toString() : '',
      subjectsStudied: Array.isArray(student.subjectsStudied) ? student.subjectsStudied.join(', ') : student.subjectsStudied || '',
      courseApplied: student.courseApplied || student.interestCourse || student.interestedCourse || '',
      preferredModeOfLearning: formatFieldCase('preferredModeOfLearning', student.preferredModeOfLearning) || '',
      preferredBatchTime: student.preferredBatchTime || '',
      goalsForCourse: student.goalsForCourse || '',
      futureGoal: student.futureGoal || '',

      // Course Preferences (checkboxes)
      tShirt: convertToYesNo(student.tShirt),
      itTools: convertToYesNo(student.itTools),
      webDesigning: convertToYesNo(student.webDesigning),
      tally: convertToYesNo(student.tally),
      gfxDtp: convertToYesNo(student.gfxDtp),
      python: convertToYesNo(student.python),
      iot: convertToYesNo(student.iot),

      // Payment Details
      totalFee: student.totalFee || '',
      discount: student.discount || '',
      netFee: student.netFee || '',
      paidFee: student.paidFee || '',
      remainingFee: student.remainingFee || '',
      paymentMode: student.paymentMode || '',

      // Other Information
      centerCode: formatFieldCase('centerCode', student.centerCode) || '',
      employeeId: student.employeeId || student.employeeID || '',
      referralSource: student.referralSource || '',
      referralSourceOther: student.referralSourceOther || '',
      referalName: student.referalName || student.sourceName || '',
      computerAccess: formatFieldCase('computerAccess', student.computerAccess) || '',
      computerAccessOther: student.computerAccessOther || '',
      importantNote: student.importantNote || '',

      // Special Status
      speciallyAbled: formatFieldCase('speciallyAbled', student.speciallyAbled) || '',
      speciallyAbledOther: student.speciallyAbledOther || '',
      exServicemen: formatFieldCase('exServicemen', student.exServicemen) || ''
    };

    console.log("New form data from student:", newFormData);

    // Update form data
    setFormData(newFormData);

    // Mark all steps as completed
    const allSteps = Array.from({ length: formSteps.length }, (_, i) => i + 1);
    setCompletedSteps(allSteps);

    // Mark all steps as completed in formSteps array
    formSteps.forEach(step => {
      step.completed = true;
    });

    // Show success toast
    toast.success('Existing admission data loaded successfully! You can now update and save changes.', {
      position: "bottom-right",
      autoClose: 3000
    });
  };

  // Fill form with enquiry data
  const fillFormWithEnquiryData = (enquiry) => {
    console.log("Filling form with enquiry data:", enquiry);

    // Generate a registration number if not already present
    let regNo = formData.generatedRegNo;
    if (!regNo) {
      const branch = enquiry.centerCode || 'C001';
      const date = new Date();
      const month = date.getMonth() + 1;
      const year = date.getFullYear().toString().slice(-2);
      const randomId = Math.floor(1000 + Math.random() * 9000);
      regNo = `R${branch}${month}${year}${randomId}`;
    }

    // Convert boolean values to strings for radio buttons
    const convertBooleanToString = (value) => {
      if (value === true) return 'Yes';
      if (value === false) return 'No';
      return value || '';
    };

    // Case handling functions
    const capitalizeFirstLetter = (string) => {
      if (!string) return '';
      return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    // Function to handle case for specific fields
    const formatFieldCase = (field, value) => {
      if (!value) return '';

      // Fields that should be capitalized (first letter uppercase, rest lowercase)
      const capitalizeFields = ['gender', 'category', 'religion', 'nationality', 'speciallyAbled', 'exServicemen'];

      // Fields that should be title case (Each Word Capitalized)
      const titleCaseFields = ['fullName', 'fathersName', 'mothersName', 'guardianName', 'boardOrUniversity'];

      // Fields that should be uppercase
      const uppercaseFields = ['centerCode'];

      if (capitalizeFields.includes(field)) {
        return capitalizeFirstLetter(value);
      } else if (titleCaseFields.includes(field)) {
        return value.split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      } else if (uppercaseFields.includes(field)) {
        return value.toUpperCase();
      }

      // Default: return as is
      return value;
    };

    // Create a new form data object with enquiry data - map ALL fields from enquiry
    const newFormData = {
      ...formData,
      // Basic Info
      formNo: `FORM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      generatedRegNo: regNo,
      regNo: regNo,
      month: `${new Date().getMonth() + 1}/${new Date().getFullYear().toString().slice(-2)}`,
      fullName: formatFieldCase('fullName', enquiry.fullName) || '',
      gender: formatFieldCase('gender', enquiry.gender) || '',
      category: formatFieldCase('category', enquiry.category) || '',
      religion: formatFieldCase('religion', enquiry.religion) || '',
      nationality: formatFieldCase('nationality', enquiry.nationality) || 'Indian',
      dob: enquiry.dateOfBirth ? new Date(enquiry.dateOfBirth).toISOString().split('T')[0] : '',
      aadharNo: enquiry.aadharNo || '',

      // Contact Details
      emailAddress: enquiry.emailAddress ? enquiry.emailAddress.toLowerCase() : '',
      contactNumber: enquiry.contactNumber || '',
      alternateContactNumber: enquiry.alternativeContactNumber || '',
      address: enquiry.residentialAddress || '',
      pinCode: enquiry.pinCode || '',
      state: formatFieldCase('state', enquiry.state) || '',
      district: formatFieldCase('district', enquiry.district) || '',

      // Family Details
      fathersName: formatFieldCase('fathersName', enquiry.fathersName) || '',
      fathersOccupation: formatFieldCase('fathersOccupation', enquiry.fathersOccupation) || '',
      fathersJobRole: enquiry.fathersJobRole || '',
      departmentOrCompany: enquiry.departmentOrCompany || '',
      mothersName: formatFieldCase('mothersName', enquiry.mothersName) || '',
      guardianName: formatFieldCase('guardianName', enquiry.guardianName) || '',
      guardianRelation: formatFieldCase('guardianRelation', enquiry.guardianRelation) || '',
      guardianContactNumber: enquiry.guardianContactNumber || '',

      // Education & Course
      highestEducationalQualification: enquiry.currentEducationalQualification || '',
      boardOrUniversity: formatFieldCase('boardOrUniversity', enquiry.boardUniversity) || '',
      yearOfPassing: enquiry.yearOfPassing ? enquiry.yearOfPassing.toString() : '',
      subjectsStudied: Array.isArray(enquiry.subjectsStudied) ? enquiry.subjectsStudied.join(', ') : enquiry.subjectsStudied || '',
      courseApplied: enquiry.interestCourse || enquiry.interestedCourse || '', // Handle both field names
      preferredModeOfLearning: formatFieldCase('preferredModeOfLearning', enquiry.preferredModeOfLearning) || '',
      preferredBatchTime: enquiry.preferredBatchTime || '',
      goalsForCourse: enquiry.goalsForCourse || '',
      futureGoal: enquiry.futureGoal || '',

      // Course Preferences (checkboxes)
      tShirt: convertToYesNo(enquiry.tShirt),
      itTools: convertToYesNo(enquiry.itTools),
      webDesigning: convertToYesNo(enquiry.webDesigning),
      tally: convertToYesNo(enquiry.tally),
      gfxDtp: convertToYesNo(enquiry.gfxDtp),
      python: convertToYesNo(enquiry.python),
      iot: convertToYesNo(enquiry.iot),

      // Other Information
      centerCode: formatFieldCase('centerCode', enquiry.centerCode) || '',
      employeeId: enquiry.employeeID || '',
      referralSource: enquiry.referralSource || '',
      referralSourceOther: enquiry.referralSourceOther || '',
      referalName: enquiry.sourceName || enquiry.referalName || '', // Handle both field names
      computerAccess: formatFieldCase('computerAccess', convertBooleanToString(enquiry.computerAccess)),
      computerAccessOther: enquiry.computerAccessOther || '',
      importantNote: enquiry.importantNote || '',

      // Special Status
      speciallyAbled: formatFieldCase('speciallyAbled', convertBooleanToString(enquiry.speciallyAbled)),
      speciallyAbledOther: enquiry.speciallyAbledOther || '',
      exServicemen: formatFieldCase('exServicemen', convertBooleanToString(enquiry.exServicemen))
    };

    console.log("New form data:", newFormData);

    // Update form data
    setFormData(newFormData);

    // Close search results after filling the form
    setShowSearchResults(false);
    setSearchName('');

    // Show success toast
    toast.success('Enquiry data loaded successfully!', {
      position: "bottom-right",
      autoClose: 3000
    });

    // Mark the current step as completed
    formSteps[currentStep - 1].completed = true;
    const updatedSteps = [...completedSteps];
    if (!updatedSteps.includes(currentStep)) {
      updatedSteps.push(currentStep);
      setCompletedSteps(updatedSteps);
    }
  };

  // Clear form data
  const clearForm = () => {
    if (window.confirm('Are you sure you want to clear all form data? This action cannot be undone.')) {
      setFormData({
        // Basic Info
        formNo: `FORM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        generatedRegNo: generateRegNo(),
        centerCode: '',
        employeeId: '',
        fullName: '',
        dob: '',
        gender: '',
        category: '',
        aadharNo: '',
        religion: '',
        nationality: 'Indian',

        // Documents
        aadharPhoto: '',
        candidatePhoto: '',
        candidateSignature: '',
        tenthMarksheet: '',
        twelfthMarksheet: '',
        graduationMarksheet: '',
        postGraduationMarksheet: '',
        exServicemen: 'No',
        speciallyAbled: 'No',
        speciallyAbledType: '',
        speciallyAbledPercentage: '',

        // Contact Details
        contactNumber: '',
        alternateContactNumber: '',
        emailAddress: '',
        state: '',
        district: '',
        address: '',
        pinCode: '',
        fathersName: '',
        fathersOccupation: '',
        mothersName: '',
        mothersOccupation: '',
        guardianName: '',
        guardianOccupation: '',
        guardianRelation: '',

        // Education & Course
        highestEducationalQualification: '',
        boardOrUniversity: '',
        yearOfPassing: '',
        subjectsStudied: '',
        courseApplied: '',
        preferredModeOfLearning: '',
        // Course Preferences (checkboxes)
        tShirt: 'No',
        itTools: 'No',
        webDesigning: 'No',
        tally: 'No',
        gfxDtp: 'No',
        python: 'No',
        iot: 'No',
        referralSource: '',
        referralSourceOther: '',
        computerAccess: '',
        computerAccessOther: '',

        // Payment Details
        totalFee: '',
        paidFee: '',
        remainingFee: '',
        paymentMethod: '',
        transactionId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        remarks: ''
      });

      setErrors({});
      setCurrentStep(1);
      setSuccess(false);
      setError(null);
      setCompletedSteps([]);

      // Reset form steps completion status
      formSteps.forEach(step => {
        step.completed = false;
      });

      // Show success toast instead of alert
      toast.info('Form has been cleared successfully!', {
        position: "bottom-right",
        autoClose: 2000
      });
    }
  };

  // Validate form fields for each step
  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) { // Basic Info
      if (!formData.formNo) newErrors.formNo = 'Form number is required';
      if (!formData.centerCode) newErrors.centerCode = 'Center code is required';
      if (!formData.employeeId) newErrors.employeeId = 'Employee ID is required';
      if (!formData.generatedRegNo) newErrors.generatedRegNo = 'Registration number is required';
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.dob) newErrors.dob = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.aadharNo) newErrors.aadharNo = 'Aadhar number is required';
      if (!formData.religion) newErrors.religion = 'Religion is required';
    } else if (step === 2) { // Documents
      if (!formData.aadharPhoto) newErrors.aadharPhoto = 'Aadhar photo is required';
      if (!formData.candidatePhoto) newErrors.candidatePhoto = 'Candidate photo is required';
      if (!formData.candidateSignature) newErrors.candidateSignature = 'Candidate signature is required';
      if (!formData.tenthMarksheet) newErrors.tenthMarksheet = '10th marksheet is required';
      if (!formData.exServicemen) newErrors.exServicemen = 'Ex-servicemen status is required';
      if (!formData.speciallyAbled) newErrors.speciallyAbled = 'Specially abled status is required';
    } else if (step === 3) { // Contact Details
      if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
      if (!formData.emailAddress) newErrors.emailAddress = 'Email address is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.district) newErrors.district = 'District is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.pinCode) newErrors.pinCode = 'Pin code is required';
      if (!formData.fathersName) newErrors.fathersName = 'Father\'s name is required';
      if (!formData.fathersOccupation) newErrors.fathersOccupation = 'Father\'s occupation is required';
      if (!formData.mothersName) newErrors.mothersName = 'Mother\'s name is required';
    } else if (step === 4) { // Education & Course
      if (!formData.highestEducationalQualification) newErrors.highestEducationalQualification = 'Educational qualification is required';
      if (!formData.boardOrUniversity) newErrors.boardOrUniversity = 'Board/University is required';
      if (!formData.yearOfPassing) newErrors.yearOfPassing = 'Year of passing is required';
      if (!formData.subjectsStudied) newErrors.subjectsStudied = 'Subjects studied is required';
      if (!formData.courseApplied) newErrors.courseApplied = 'Course applied is required';
      if (!formData.preferredModeOfLearning) newErrors.preferredModeOfLearning = 'Preferred mode of learning is required';
      if (!formData.referralSource) newErrors.referralSource = 'Referral source is required';
      if (formData.referralSource === 'Other' && !formData.referralSourceOther) {
        newErrors.referralSourceOther = 'Please specify referral source';
      }
      if (!formData.computerAccess) newErrors.computerAccess = 'Computer access information is required';
    } else if (step === 5) { // Payment Details
      if (!formData.totalFee) newErrors.totalFee = 'Total fee is required';
      if (!formData.paidFee) newErrors.paidFee = 'Paid fee is required';
      if (!formData.paymentMethod) newErrors.paymentMethod = 'Payment method is required';
      if (!formData.paymentDate) newErrors.paymentDate = 'Payment date is required';
      if (!formData.status) newErrors.status = 'Status is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation between form steps (without saving)
  const nextStep = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      // Update completed steps
      const updatedSteps = [...completedSteps];
      if (!updatedSteps.includes(currentStep)) {
        updatedSteps.push(currentStep);
        setCompletedSteps(updatedSteps);
      }

      // Update formSteps array to mark current step as completed
      formSteps[currentStep - 1].completed = true;

      // Move to next step
      setCurrentStep(prev => Math.min(prev + 1, formSteps.length));
      window.scrollTo(0, 0);

      // Show success message
      toast.success(`Moving to step ${currentStep + 1}`, {
        position: "bottom-right",
        autoClose: 2000
      });
    } else {
      // Show error message
      toast.error('Please fill in all required fields before proceeding.', {
        position: "bottom-right",
        autoClose: 3000
      });
    }
  };

  const prevStep = () => {
    // No validation needed when going back
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo(0, 0);
  };

  const goToStep = (step) => {
    if (step < currentStep) {
      // Only allow going to completed steps or the current step
      if (completedSteps.includes(step) || step === currentStep) {
        setCurrentStep(step);
        window.scrollTo(0, 0);
      } else {
        toast.warning('Please complete the current step first.', {
          position: "bottom-right",
          autoClose: 2000
        });
      }
    }
  };

  // Render form step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 2:
        return <DocumentsStep formData={formData} handleChange={handleChange} handleFileChange={handleFileChange} handleFileDelete={handleFileDelete} errors={errors} />;
      case 3:
        return <EnhancedContactDetailsStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 4:
        return <EducationCourseStep formData={formData} handleChange={handleChange} handleCheckboxChange={handleCheckboxChange} errors={errors} />;
      case 5:
        return <PaymentDetailsStep formData={formData} handleChange={handleChange} errors={errors} />;
      case 6:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-0 md:p-4">
      <div className="w-full md:max-w-6xl mx-auto p-4 md:p-6 bg-white rounded-xl shadow-lg border border-purple-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FaUserGraduate className="text-purple-600 text-3xl mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Admission Form</h2>
          </div>

          {/* Search Component */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <input
                type="text"
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  if (searchError) setSearchError(null);
                }}
                placeholder="Search by name or registration number"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              {searchError && (
                <div className="absolute text-xs text-red-500 mt-1">{searchError}</div>
              )}
              {showSearchResults && (
                <div className="absolute z-10 mt-1 w-96 bg-white border rounded-lg shadow-lg max-h-80 overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((enquiry) => (
                      <div
                        key={enquiry._id}
                        className="p-3 hover:bg-purple-50 cursor-pointer border-b"
                        onClick={() => fillFormWithEnquiryData(enquiry)}
                      >
                        <div className="font-medium text-purple-700">{enquiry.fullName}</div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          <div className="text-xs text-gray-600"><span className="font-semibold">Email:</span> {enquiry.emailAddress || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Phone:</span> {enquiry.contactNumber || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Gender:</span> {enquiry.gender || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Category:</span> {enquiry.category || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Education:</span> {enquiry.currentEducationalQualification || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Course:</span> {enquiry.interestCourse || enquiry.interestedCourse || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Batch Time:</span> {enquiry.preferredBatchTime || 'N/A'}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Computer:</span> {convertToYesNo(enquiry.computerAccess)}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Specially Abled:</span> {convertToYesNo(enquiry.speciallyAbled)}</div>
                          <div className="text-xs text-gray-600"><span className="font-semibold">Referral:</span> {enquiry.referralSource || 'N/A'}</div>
                        </div>
                        <div className="mt-1 text-xs text-gray-500"><span className="font-semibold">Address:</span> {enquiry.residentialAddress || 'N/A'}</div>
                        <div className="mt-1 text-xs text-gray-500"><span className="font-semibold">Goals:</span> {enquiry.goalsForCourse || 'N/A'}</div>
                        <div className="mt-1 text-xs text-right">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Click to auto-fill form</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-gray-600">No new enquiries found with this name.</p>
                      <p className="text-xs text-gray-500 mt-1">Enquiries that already have admissions are filtered out.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleSearch}
              disabled={searching}
              className={`px-4 py-2 ${searching ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-lg flex items-center`}
            >
              {searching ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch className="mr-2" /> Search
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
            <p>Admission form submitted successfully!</p>
          </div>
        )}



        <FormStepper
          steps={formSteps}
          currentStep={currentStep}
          onStepClick={goToStep}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Render the current step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>

          {/* Form Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <motion.button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:outline-none transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaArrowLeft className="mr-2" />
                  Previous
                </motion.button>
              )}

              <motion.button
                type="button"
                onClick={clearForm}
                className="flex items-center px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash className="mr-2" />
                Clear Form
              </motion.button>
            </div>

            {currentStep < formSteps.length && (
              <motion.button
                type="button"
                onClick={nextStep}
                className="flex items-center px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg focus:outline-none transition-colors ml-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next
                <FaArrowRight className="ml-2" />
              </motion.button>
            )}

            {currentStep === formSteps.length && (
              <motion.button
                type="submit"
                disabled={loading}
                className={`flex items-center px-6 py-2 ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-lg focus:outline-none transition-colors ml-auto`}
                whileHover={loading ? {} : { scale: 1.05 }}
                whileTap={loading ? {} : { scale: 0.95 }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <FaCheckCircle className="ml-2" />
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
      </div>

      {/* Toast container for notifications */}
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default AdmissionForm;

