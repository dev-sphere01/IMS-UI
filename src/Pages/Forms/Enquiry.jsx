import React, { useState, useEffect } from "react";
import EnquiryService from "../../Services/EnquiryService";
import BatchTimingService from "../../Services/BatchTimingService";
import GoalService from "../../Services/GoalService";

const Enquiry = () => {
  const [speciallyAbledOther, setSpeciallyAbledOther] = useState(false);
  const [interestedCourseOther, setInterestedCourseOther] = useState(false);
  const [referralSourceOther, setReferralSourceOther] = useState(false);
  const [computerAccessOther, setComputerAccessOther] = useState(false);

  const [formData, setFormData] = useState({
    centerCode: "",
    employeeId: "",
    otherInfo: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    age: "",
    category: "",
    exServicemen: "",
    speciallyAbled: "",
    speciallyAbledOther: "",
    mobileNumber: "",
    whatsappNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    qualification: "",
    boardUniversity: "",
    yearOfPassing: "",
    subjectsStudied: "",
    occupation: "",
    interestedCourse: "",
    interestedCourseOther: "",
    preferredMode: "", // Added for preferredModeOfLearning
    preferredTimings: "",
    referralSource: "",
    referralSourceOther: "",
    sourceName: "",
    goals: "", // Added for goalsForCourse
    futureGoal: [], // Initialize as array for multiple checkbox values
    computerAccess: "",
    computerAccessOther: "",
    additionalNotes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [batchTimings, setBatchTimings] = useState([]);
  const [batchTimingsLoading, setBatchTimingsLoading] = useState(true);
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);

  // Fetch batch timings and goals when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch batch timings
        setBatchTimingsLoading(true);
        const batchTimingsResponse =
          await BatchTimingService.getAllBatchTimings();
        if (
          batchTimingsResponse.success &&
          Array.isArray(batchTimingsResponse.data)
        ) {
          setBatchTimings(batchTimingsResponse.data);
        } else {
          console.error(
            "Invalid batch timings response:",
            batchTimingsResponse
          );
        }

        // Fetch goals
        setGoalsLoading(true);
        const goalsResponse = await GoalService.getAllGoals();
        if (goalsResponse.success && Array.isArray(goalsResponse.data)) {
          setGoals(goalsResponse.data);
        } else {
          console.error("Invalid goals response:", goalsResponse);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setBatchTimingsLoading(false);
        setGoalsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;

    // Use name as fallback if id is not available
    const fieldName = id || name;

    if (type === "checkbox") {
      // Handle checkboxes (for multiple selections like futureGoal)
      if (name === "futureGoal") {
        // Ensure futureGoal is always an array
        const updatedGoals = Array.isArray(formData.futureGoal)
          ? [...formData.futureGoal]
          : [];

        if (checked) {
          // Add the value if it's checked and not already in the array
          if (!updatedGoals.includes(value)) {
            updatedGoals.push(value);
          }
        } else {
          // Remove the value if it's unchecked
          const index = updatedGoals.indexOf(value);
          if (index !== -1) {
            updatedGoals.splice(index, 1);
          }
        }

        console.log("Updated futureGoal:", updatedGoals); // Debug log

        setFormData((prevData) => ({
          ...prevData,
          futureGoal: updatedGoals,
        }));
      } else {
        // For other checkboxes, just use the checked value
        setFormData((prevData) => ({
          ...prevData,
          [fieldName]: checked,
        }));
      }
    } else if (type === "radio") {
      // For radio buttons, use the name attribute instead of id
      console.log(`Radio button changed: ${name} = ${value}`); // Debug log
      setFormData((prevData) => {
        const updatedData = {
          ...prevData,
          [name]: value,
        };
        console.log("Updated form data after radio change:", updatedData); // Debug log
        return updatedData;
      });
    } else {
      // For other input types, use id or name
      setFormData((prevData) => {
        // Special handling for speciallyAbledOther
        if (fieldName === "speciallyAbledOther") {
          console.log(`Setting speciallyAbledOther to "${value}"`);
        }

        return {
          ...prevData,
          [fieldName]: value,
        };
      });
    }
  };

  const handleGenderChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      gender: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Client-side validation for required fields
    const requiredFields = {
      centerCode: "Center Code",
      employeeId: "Employee ID",
      fullName: "Full Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      mobileNumber: "Contact Number",
      email: "Email Address",
      address: "Residential Address",
      pincode: "Pin Code",
      referralSource: "Referral Source",
    };

    const missingFields = [];

    Object.entries(requiredFields).forEach(([field, label]) => {
      if (!formData[field]) {
        missingFields.push(label);
      }
    });

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following required fields: ${missingFields.join(
          ", "
        )}`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate mobile number format (10 digits)
    const phoneRegex = /^\d{10}$/;
    if (formData.mobileNumber && !phoneRegex.test(formData.mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate all "other" fields
    if (formData.referralSource === "other" && !formData.referralSourceOther) {
      setError("Please specify the referral source");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (
      formData.interestedCourse === "other" &&
      !formData.interestedCourseOther
    ) {
      setError("Please specify the interested course");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (formData.speciallyAbled === "other" && !formData.speciallyAbledOther) {
      setError("Please specify the specially abled details");
      console.warn(
        'Validation failed: speciallyAbled is "other" but speciallyAbledOther is empty'
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    } else if (formData.speciallyAbled === "other") {
      console.log(
        "Validation passed: speciallyAbledOther =",
        formData.speciallyAbledOther
      );
    }

    if (formData.computerAccess === "other" && !formData.computerAccessOther) {
      setError("Please specify the computer access details");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Validate date of birth format
    if (formData.dateOfBirth) {
      try {
        // Check if the date is valid
        const date = new Date(formData.dateOfBirth);
        if (isNaN(date.getTime())) {
          setError("Please enter a valid date of birth in YYYY-MM-DD format");
          window.scrollTo({ top: 0, behavior: "smooth" });
          return;
        }
      } catch (err) {
        setError("Please enter a valid date of birth in YYYY-MM-DD format");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
    }

    setLoading(true);

    try {
      // Helper function to safely trim strings
      const safeTrim = (str) => {
        // Check if the value is a string before trimming
        if (typeof str === "string") {
          return str.trim();
        }
        // If it's not a string, convert to string if it has a value, otherwise return empty string
        return str ? String(str) : "";
      };

      // Map frontend form data to backend model structure
      const enquiryData = {
        // Additional fields for "other" options
        computerAccessDetails: "",
        centerCode: safeTrim(formData.centerCode),
        employeeID: safeTrim(formData.employeeId), // Note: backend uses employeeID, not employeeId
        otherInfo: safeTrim(formData.otherInfo),
        fullName: safeTrim(formData.fullName),
        // Ensure dateOfBirth is in the correct format (YYYY-MM-DD)
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : new Date(),
        gender: formData.gender || "", // Ensure this field is included
        category: safeTrim(formData.category),
        exServicemen: formData.exServicemen === "yes",
        // Set speciallyAbled to true for both 'yes' and 'other' options
        speciallyAbled:
          formData.speciallyAbled === "yes" ||
          formData.speciallyAbled === "other",
        // Only include the speciallyAbledDetails field when 'other' is selected
        speciallyAbledDetails:
          formData.speciallyAbled === "other"
            ? formData.speciallyAbledOther || ""
            : "",
        // Include the original field for backend processing
        speciallyAbledOther:
          formData.speciallyAbled === "other"
            ? formData.speciallyAbledOther || ""
            : "",
        // Ensure contactNumber is provided (required field)
        contactNumber: safeTrim(formData.mobileNumber),
        alternativeContactNumber: safeTrim(formData.whatsappNumber),
        // Ensure emailAddress is provided (required field)
        emailAddress: safeTrim(formData.email),
        residentialAddress: safeTrim(formData.address),
        // Ensure pinCode is provided (required field)
        pinCode: safeTrim(formData.pincode),
        currentEducationalQualification: safeTrim(formData.qualification),
        boardUniversity: safeTrim(formData.boardUniversity),
        yearOfPassing: formData.yearOfPassing || "",
        subjectsStudied: formData.subjectsStudied
          ? [safeTrim(formData.subjectsStudied)]
          : [],
        // Ensure interestCourse is properly mapped
        interestCourse:
          formData.interestedCourse === "other"
            ? safeTrim(formData.interestedCourseOther) // Use the 'other' value
            : safeTrim(formData.interestedCourse),

        // Also include the original values for debugging
        _interestedCourse: safeTrim(formData.interestedCourse),
        _interestedCourseOther:
          formData.interestedCourse === "other"
            ? safeTrim(formData.interestedCourseOther)
            : "",

        // Ensure preferredModeOfLearning is properly mapped from preferredMode
        preferredModeOfLearning: safeTrim(formData.preferredMode),

        // Map other fields
        preferredBatchTime: safeTrim(formData.preferredTimings),
        importantNote: safeTrim(formData.additionalNotes),

        // Ensure referralSource is properly mapped
        referralSource:
          formData.referralSource === "other"
            ? safeTrim(formData.referralSourceOther)
            : safeTrim(formData.referralSource),

        // Also include the original values for debugging
        _referralSource: safeTrim(formData.referralSource),
        _referralSourceOther:
          formData.referralSource === "other"
            ? safeTrim(formData.referralSourceOther)
            : "",

        // Map source name
        sourceName: safeTrim(formData.sourceName),

        // Ensure goalsForCourse is properly mapped from goals
        goalsForCourse: safeTrim(formData.goals),

        // Ensure futureGoal is properly joined as a string if it's an array
        futureGoal:
          Array.isArray(formData.futureGoal) && formData.futureGoal.length > 0
            ? formData.futureGoal.join(", ")
            : typeof formData.futureGoal === "string"
            ? formData.futureGoal
            : "",
        computerAccess:
          formData.computerAccess === "yes" ||
          formData.computerAccess === "other",
      };

      // Handle speciallyAbled 'other' option
      if (formData.speciallyAbled === "other") {
        // Always set speciallyAbledDetails field when 'other' is selected
        enquiryData.speciallyAbledDetails = formData.speciallyAbledOther || "";
        // Log for debugging
        console.log(
          "Setting speciallyAbledDetails:",
          enquiryData.speciallyAbledDetails
        );
        // Also append to otherInfo for backward compatibility
        enquiryData.otherInfo = `${
          enquiryData.otherInfo || ""
        }\nSpecially Abled Details: ${formData.speciallyAbledOther || ""}`;
      }

      if (formData.computerAccess === "other" && formData.computerAccessOther) {
        // Create a computerAccessDetails field
        enquiryData.computerAccessDetails = formData.computerAccessOther;
        // Also append to otherInfo for backward compatibility
        enquiryData.otherInfo = `${
          enquiryData.otherInfo || ""
        }\nComputer Access Details: ${formData.computerAccessOther}`;
      }

      // Log the form data and mapped data for debugging
      console.log("Original form data:", formData);
      console.log(
        "futureGoal type:",
        typeof formData.futureGoal,
        "value:",
        formData.futureGoal
      );
      console.log(
        "preferredMode type:",
        typeof formData.preferredMode,
        "value:",
        formData.preferredMode
      );
      console.log(
        "interestedCourse type:",
        typeof formData.interestedCourse,
        "value:",
        formData.interestedCourse
      );
      console.log(
        "interestedCourseOther type:",
        typeof formData.interestedCourseOther,
        "value:",
        formData.interestedCourseOther
      );
      console.log(
        "speciallyAbled type:",
        typeof formData.speciallyAbled,
        "value:",
        formData.speciallyAbled
      );
      console.log(
        "speciallyAbledOther type:",
        typeof formData.speciallyAbledOther,
        "value:",
        formData.speciallyAbledOther
      );
      console.log(
        "computerAccess type:",
        typeof formData.computerAccess,
        "value:",
        formData.computerAccess
      );
      console.log(
        "computerAccessOther type:",
        typeof formData.computerAccessOther,
        "value:",
        formData.computerAccessOther
      );
      console.log(
        "referralSource type:",
        typeof formData.referralSource,
        "value:",
        formData.referralSource
      );
      console.log(
        "referralSourceOther type:",
        typeof formData.referralSourceOther,
        "value:",
        formData.referralSourceOther
      );

      // Check if any "other" fields are set but their corresponding detail fields are empty
      if (
        formData.referralSource === "other" &&
        !formData.referralSourceOther
      ) {
        console.warn(
          'Warning: referralSource is set to "other" but referralSourceOther is empty'
        );
      }

      if (
        formData.interestedCourse === "other" &&
        !formData.interestedCourseOther
      ) {
        console.warn(
          'Warning: interestedCourse is set to "other" but interestedCourseOther is empty'
        );
      }

      if (
        formData.speciallyAbled === "other" &&
        !formData.speciallyAbledOther
      ) {
        console.warn(
          'Warning: speciallyAbled is set to "other" but speciallyAbledOther is empty'
        );
      }

      if (
        formData.computerAccess === "other" &&
        !formData.computerAccessOther
      ) {
        console.warn(
          'Warning: computerAccess is set to "other" but computerAccessOther is empty'
        );
      }

      console.log("Mapped enquiry data:", enquiryData);
      console.log("Date of birth type:", typeof enquiryData.dateOfBirth);
      console.log("futureGoal in enquiryData:", enquiryData.futureGoal);
      console.log(
        "preferredModeOfLearning in enquiryData:",
        enquiryData.preferredModeOfLearning
      );
      console.log("interestCourse in enquiryData:", enquiryData.interestCourse);
      console.log(
        "_interestedCourse in enquiryData:",
        enquiryData._interestedCourse
      );
      console.log(
        "_interestedCourseOther in enquiryData:",
        enquiryData._interestedCourseOther
      );
      console.log(
        "speciallyAbled in enquiryData:",
        enquiryData.speciallyAbled,
        "type:",
        typeof enquiryData.speciallyAbled
      );
      console.log(
        "speciallyAbledDetails in enquiryData:",
        enquiryData.speciallyAbledDetails,
        "type:",
        typeof enquiryData.speciallyAbledDetails
      );
      console.log(
        "speciallyAbledOther in formData:",
        formData.speciallyAbledOther,
        "type:",
        typeof formData.speciallyAbledOther
      );
      console.log("computerAccess in enquiryData:", enquiryData.computerAccess);
      console.log(
        "computerAccessDetails in enquiryData:",
        enquiryData.computerAccessDetails
      );
      console.log("referralSource in enquiryData:", enquiryData.referralSource);
      console.log(
        "_referralSource in enquiryData:",
        enquiryData._referralSource
      );
      console.log(
        "_referralSourceOther in enquiryData:",
        enquiryData._referralSourceOther
      );

      // Convert the Date object to an ISO string for the API
      enquiryData.dateOfBirth = enquiryData.dateOfBirth
        .toISOString()
        .split("T")[0];
      console.log("Formatted date of birth:", enquiryData.dateOfBirth);

      const response = await EnquiryService.createEnquiry(enquiryData);
      console.log("Enquiry submitted successfully:", response);
      setSuccess(true);

      // Reset form after successful submission
      setFormData({
        centerCode: "",
        employeeId: "",
        otherInfo: "",
        fullName: "",
        gender: "",
        dateOfBirth: "",
        age: "",
        category: "",
        exServicemen: "",
        speciallyAbled: "",
        speciallyAbledOther: "",
        mobileNumber: "",
        whatsappNumber: "",
        email: "",
        address: "",
        city: "",
        state: "",
        pincode: "",
        qualification: "",
        boardUniversity: "",
        yearOfPassing: "",
        subjectsStudied: "",
        occupation: "",
        interestedCourse: "",
        interestedCourseOther: "",
        preferredMode: "", // Reset preferredModeOfLearning
        preferredTimings: "",
        referralSource: "",
        referralSourceOther: "",
        sourceName: "",
        goals: "", // Reset goalsForCourse
        futureGoal: [], // Reset as empty array
        computerAccess: "",
        computerAccessOther: "",
        additionalNotes: "",
      });

      // Reset other state variables
      setSpeciallyAbledOther(false);
      setInterestedCourseOther(false);
      setReferralSourceOther(false);
      setComputerAccessOther(false);

      // Optionally redirect after a delay
      // setTimeout(() => navigate('/enquiries'), 2000);
    } catch (err) {
      console.error("Enquiry submission error:", err);

      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage =
          err.response.data?.message ||
          `Error: ${err.response.status} - ${err.response.statusText}`;

        // Check for validation errors
        if (errorMessage.includes("validation failed")) {
          // Extract the specific validation errors
          const validationErrors = [];

          if (errorMessage.includes("dateOfBirth")) {
            validationErrors.push("Date of Birth is required");
          }

          if (errorMessage.includes("contactNumber")) {
            validationErrors.push("Contact Number is required");
          }

          if (errorMessage.includes("emailAddress")) {
            validationErrors.push("Email Address is required");
          }

          if (errorMessage.includes("pinCode")) {
            validationErrors.push("Pin Code is required");
          }

          if (validationErrors.length > 0) {
            setError(
              `Please fix the following errors: ${validationErrors.join(", ")}`
            );
          } else {
            setError(errorMessage);
          }
        } else {
          setError(errorMessage);
        }
      } else if (err.request) {
        // The request was made but no response was received
        setError(
          "No response received from server. Please check your internet connection."
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);

      // Scroll to top to show error/success message
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="w-full mx-auto p-6 bg-white bg-opacity-95 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 text-center relative pb-3 text-gray-800">
          <span className="relative z-10">Enquiry Form</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-24 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full"></span>
        </h2>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md animate-fadeIn flex items-start">
            <svg className="h-5 w-5 mr-2 mt-0.5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 rounded-md animate-fadeIn">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="font-bold">Enquiry submitted successfully!</p>
            </div>
            <p className="mt-1 ml-7">Thank you for your interest. We will contact you shortly.</p>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
              <svg className="h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Registration Information
            </h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-3 mb-4 group">
                <label htmlFor="centerCode" className="block text-gray-700 font-medium mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  Center Code<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="centerCode"
                    value={formData.centerCode}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all group-hover:border-blue-300 appearance-none"
                    required
                  >
                    <option value="">Select Center Code</option>
                    <option value="C001">C001</option>
                    <option value="C002">C002</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4 group-hover:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-3 mb-4 group">
                <label htmlFor="employeeId" className="block text-gray-700 font-medium mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  Employee ID<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all group-hover:border-blue-300"
                    placeholder="E+Branch+ID"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 mb-4 group">
                <label htmlFor="otherInfo" className="block text-gray-700 font-medium mb-1 group-hover:text-blue-600 transition-colors duration-200">
                  Other Info (if needed)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="otherInfo"
                    value={formData.otherInfo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all group-hover:border-blue-300"
                    placeholder="Any additional information"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Personal Information</h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="fullName" className="block text-gray-700 font-medium mb-1">Full Name<span className="text-red-500">*</span></label>
                <input
                  type="text"
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="col-span-12 md:col-span-3 mb-4">
                <label htmlFor="dateOfBirth" className="block text-gray-700 font-medium mb-1">Date of Birth<span className="text-red-500">*</span></label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  required
                />
              </div>
              <div className="col-span-12 md:col-span-2 mb-4">
                <label htmlFor="gender" className="block text-gray-700 font-medium mb-1">Gender<span className="text-red-500">*</span></label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="preferNotToSay">Prefer Not to Say</option>
                </select>
              </div>
              <div className="col-span-12 md:col-span-3 mb-4">
                <label htmlFor="category" className="block text-gray-700 font-medium mb-1">Category<span className="text-red-500">*</span></label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC/ST">SC/ST</option>
                </select>
              </div>

              <div className="col-span-12 md:col-span-6 mb-4">
                <label className="block text-gray-700 font-medium mb-1">Ex-Servicemen</label>
                <div className="flex items-center space-x-6 mt-1 bg-gray-50 p-3 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="exServicemen"
                      value="yes"
                      className="w-4 h-4 mr-2 text-blue-600"
                      onChange={handleChange}
                      checked={formData.exServicemen === "yes"}
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="exServicemen"
                      value="no"
                      className="w-4 h-4 mr-2 text-blue-600"
                      onChange={handleChange}
                      checked={formData.exServicemen === "no"}
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 mb-4">
                <label className="block text-gray-700 font-medium mb-1">Specially Abled<span className="text-red-500">*</span></label>
                <div className="flex items-center space-x-6 mt-1 bg-gray-50 p-3 rounded-lg">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="speciallyAbled"
                      value="yes"
                      className="w-4 h-4 mr-2 text-blue-600"
                      onChange={() => {
                        setSpeciallyAbledOther(true);
                        setFormData((prev) => ({
                          ...prev,
                          speciallyAbled: "yes",
                          speciallyAbledOther: "",
                        }));
                      }}
                      checked={formData.speciallyAbled === "yes"}
                      required
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="speciallyAbled"
                      value="no"
                      className="w-4 h-4 mr-2 text-blue-600"
                      onChange={() => {
                        setSpeciallyAbledOther(false);
                        setFormData((prev) => ({ ...prev, speciallyAbled: "no" }));
                      }}
                      checked={formData.speciallyAbled === "no"}
                      required
                    />
                    <span>No</span>
                  </label>
                </div>
                {speciallyAbledOther && (
                  <input
                    type="text"
                    id="speciallyAbledOther"
                    name="speciallyAbledOther"
                    value={formData.speciallyAbledOther || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        speciallyAbledOther: value,
                        speciallyAbledDetails: value,
                      }));
                    }}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all mt-2"
                    placeholder="Please specify details"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Contact Information</h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="mobileNumber" className="block text-gray-700 font-medium mb-1">Contact Number (WhatsApp)<span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    pattern="\d{10}"
                    title="Please enter a 10-digit number"
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="whatsappNumber" className="block text-gray-700 font-medium mb-1">Alternative Contact Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    id="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                    pattern="\d{10}"
                    title="Please enter a 10-digit number"
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    placeholder="Optional alternative number"
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email Address<span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-10 mb-4">
                <label htmlFor="address" className="block text-gray-700 font-medium mb-1">Residential Address<span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    placeholder="Enter your complete address"
                    required
                  />
                </div>
              </div>

              <div className="col-span-12 md:col-span-2 mb-4">
                <label htmlFor="pincode" className="block text-gray-700 font-medium mb-1">
                  Pin Code<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  placeholder="6-digit code"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Educational Information</h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="qualification" className="block text-gray-700 font-medium mb-1">
                  Current Educational Qualification
                  <span className="text-red-500">*</span>
                </label>
                <select
                  id="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Qualification</option>
                  <option value="High School">High School</option>
                  <option value="Bachelor">Bachelor</option>
                  <option value="Master">Master</option>
                  <option value="Doctorate">Doctorate</option>
                </select>
              </div>

              <div className="col-span-12 md:col-span-8 mb-4">
                <label htmlFor="boardUniversity" className="block text-gray-700 font-medium mb-1">
                  Board/University<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="boardUniversity"
                  value={formData.boardUniversity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  placeholder="Name of your board or university"
                  required
                />
              </div>

              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="yearOfPassing" className="block text-gray-700 font-medium mb-1">
                  Year of Passing<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="yearOfPassing"
                  value={formData.yearOfPassing}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  placeholder="YYYY"
                  required
                />
              </div>

              <div className="col-span-12 md:col-span-8 mb-4">
                <label htmlFor="subjectsStudied" className="block text-gray-700 font-medium mb-1">
                  Subjects Studied<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subjectsStudied"
                  value={formData.subjectsStudied}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  placeholder="List your major subjects"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-8 transform hover:scale-[1.01] transition-all duration-300">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200 flex items-center">
              <svg className="h-5 w-5 mr-2 text-indigo-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              Course Preferences
            </h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4 mb-4">
                <label className="block text-gray-700 font-medium mb-1 group-hover:text-indigo-600 transition-colors duration-200">
                  Interested Course<span className="text-red-500">*</span>
                </label>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-blue-100 hover:shadow-md transition-all duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                      <input
                        type="radio"
                        name="interestedCourse"
                        value="Course 1"
                        className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500"
                        onChange={() => {
                          setInterestedCourseOther(false);
                          setFormData((prev) => ({
                            ...prev,
                            interestedCourse: "Course 1",
                          }));
                        }}
                        checked={formData.interestedCourse === "Course 1"}
                        required
                      />
                      <span className="font-medium">Course 1</span>
                    </label>
                    <label className="flex items-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1">
                      <input
                        type="radio"
                        name="interestedCourse"
                        value="Course 2"
                        className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500"
                        onChange={() => {
                          setInterestedCourseOther(false);
                          setFormData((prev) => ({
                            ...prev,
                            interestedCourse: "Course 2",
                          }));
                        }}
                        checked={formData.interestedCourse === "Course 2"}
                        required
                      />
                      <span className="font-medium">Course 2</span>
                    </label>
                    <label className="flex items-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1 col-span-2">
                      <input
                        type="radio"
                        name="interestedCourse"
                        value="other"
                        className="w-5 h-5 mr-3 text-blue-600 focus:ring-blue-500"
                        onChange={() => {
                          setInterestedCourseOther(true);
                          setFormData((prev) => ({
                            ...prev,
                            interestedCourse: "other",
                          }));
                        }}
                        checked={formData.interestedCourse === "other"}
                        required
                      />
                      <span className="font-medium">Other</span>
                    </label>
                  </div>
                  {interestedCourseOther && (
                    <div className="mt-3 animate-fadeIn">
                      <input
                        type="text"
                        id="interestedCourseOther"
                        value={formData.interestedCourseOther}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                        placeholder="Please specify the course"
                        required
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Preferred Mode of Learning<span className="text-red-500">*</span>
                </label>
                <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg shadow-sm border border-green-100 hover:shadow-md transition-all duration-300">
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center justify-center cursor-pointer bg-white p-3 rounded-lg border ${formData.preferredMode === "Online" ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"} hover:border-green-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
                      <input
                        type="radio"
                        name="preferredMode"
                        id="preferredMode"
                        value="Online"
                        className="w-5 h-5 mr-3 text-green-600 focus:ring-green-500"
                        onChange={handleChange}
                        checked={formData.preferredMode === "Online"}
                        required
                      />
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Online</span>
                      </div>
                    </label>
                    <label className={`flex items-center justify-center cursor-pointer bg-white p-3 rounded-lg border ${formData.preferredMode === "Offline" ? "border-green-500 ring-2 ring-green-200" : "border-gray-200"} hover:border-green-300 hover:shadow-md transition-all duration-200 transform hover:-translate-y-1`}>
                      <input
                        type="radio"
                        name="preferredMode"
                        id="preferredMode"
                        value="Offline"
                        className="w-5 h-5 mr-3 text-green-600 focus:ring-green-500"
                        onChange={handleChange}
                        checked={formData.preferredMode === "Offline"}
                        required
                      />
                      <div className="flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">Offline</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 mb-4 group">
                <label className="block text-gray-700 font-medium mb-1 group-hover:text-indigo-600 transition-colors duration-200">
                  Course Level<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="courseLevel"
                    name="courseLevel"
                    value={formData.courseLevel || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition-all appearance-none group-hover:border-indigo-300"
                    required
                  >
                    <option value="">Select Level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4 group-hover:text-indigo-500 transition-colors duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Schedule Preferences</h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-6 mb-4">
                <label htmlFor="preferredTimings" className="block text-gray-700 font-medium mb-1">
                  Preferred Batch Time<span className="text-red-500">*</span>
                </label>
                <select
                  id="preferredTimings"
                  value={formData.preferredTimings}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  required
                >
                  <option value="">Select Preferred Time</option>
                  {batchTimingsLoading ? (
                    <option value="" disabled>
                      Loading batch timings...
                    </option>
                  ) : (
                    batchTimings.map((timing) => (
                      <option key={timing._id} value={timing.timing}>
                        {timing.timing}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="col-span-12 md:col-span-6 mb-4">
                <label htmlFor="additionalNotes" className="block text-gray-700 font-medium mb-1">
                  Important Note related to time
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                  placeholder="Any specific time requirements"
                  required
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Referral Information</h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-6 mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Referral Source<span className="text-red-500">*</span>
                </label>
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-lg shadow-sm border border-amber-100">
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex flex-col items-center justify-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-all">
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <input
                        type="radio"
                        name="referralSource"
                        value="Friend"
                        className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                        onChange={() => {
                          setReferralSourceOther(false);
                          setFormData((prev) => ({
                            ...prev,
                            referralSource: "Friend",
                          }));
                        }}
                        checked={formData.referralSource === "Friend"}
                        required
                      />
                      <span className="font-medium mt-1">Friend</span>
                    </label>
                    <label className="flex flex-col items-center justify-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-all">
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <input
                        type="radio"
                        name="referralSource"
                        value="Institution"
                        className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                        onChange={() => {
                          setReferralSourceOther(false);
                          setFormData((prev) => ({
                            ...prev,
                            referralSource: "Institution",
                          }));
                        }}
                        checked={formData.referralSource === "Institution"}
                        required
                      />
                      <span className="font-medium mt-1">Institution</span>
                    </label>
                    <label className="flex flex-col items-center justify-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-amber-300 transition-all">
                      <div className="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <input
                        type="radio"
                        name="referralSource"
                        value="other"
                        className="w-5 h-5 text-amber-600 focus:ring-amber-500"
                        onChange={() => {
                          setReferralSourceOther(true);
                          setFormData((prev) => ({
                            ...prev,
                            referralSource: "other",
                          }));
                        }}
                        checked={formData.referralSource === "other"}
                        required
                      />
                      <span className="font-medium mt-1">Other</span>
                    </label>
                  </div>
                  {referralSourceOther && (
                    <div className="mt-3">
                      <input
                        type="text"
                        id="referralSourceOther"
                        value={formData.referralSourceOther}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
                        placeholder="Please specify the referral source"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-12 md:col-span-6 mb-4">
                <label htmlFor="sourceName" className="block text-gray-700 font-medium mb-1">
                  Source Name<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="sourceName"
                    value={formData.sourceName}
                    onChange={handleChange}
                    className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
                    placeholder="Name of the person who referred you"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="referralCode" className="block text-gray-700 font-medium mb-1">
                    Referral Code (if any)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="referralCode"
                      name="referralCode"
                      value={formData.referralCode || ""}
                      onChange={handleChange}
                      className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-500 transition-all"
                      placeholder="Enter referral code if available"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-3 pb-2 border-b border-gray-200">Goals & Requirements</h3>
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-12 md:col-span-4 mb-4">
                <label htmlFor="goals" className="block text-gray-700 font-medium mb-1">
                  What are your goals for taking this course?
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all appearance-none"
                    required
                  >
                    <option value="">Select Your Goal</option>
                    {goalsLoading ? (
                      <option value="" disabled>
                        Loading goals...
                      </option>
                    ) : (
                      goals.map((goalItem) => (
                        <option key={goalItem._id} value={goalItem.goal}>
                          {goalItem.goal}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Future Goal<span className="text-red-500">*</span>
                </label>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg shadow-sm border border-purple-100">
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center cursor-pointer bg-white p-2 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                      <input
                        type="checkbox"
                        name="futureGoal"
                        value="Goal 1"
                        className="w-4 h-4 mr-2 text-purple-600 focus:ring-purple-500"
                        onChange={handleChange}
                        checked={
                          formData.futureGoal &&
                          formData.futureGoal.includes("Goal 1")
                        }
                      />
                      <span>Goal 1</span>
                    </label>
                    <label className="flex items-center cursor-pointer bg-white p-2 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                      <input
                        type="checkbox"
                        name="futureGoal"
                        value="Goal 2"
                        className="w-4 h-4 mr-2 text-purple-600 focus:ring-purple-500"
                        onChange={handleChange}
                        checked={
                          formData.futureGoal &&
                          formData.futureGoal.includes("Goal 2")
                        }
                      />
                      <span>Goal 2</span>
                    </label>
                    <label className="flex items-center cursor-pointer bg-white p-2 rounded-lg border border-gray-200 hover:border-purple-300 transition-all">
                      <input
                        type="checkbox"
                        name="futureGoal"
                        value="Goal 3"
                        className="w-4 h-4 mr-2 text-purple-600 focus:ring-purple-500"
                        onChange={handleChange}
                        checked={
                          formData.futureGoal &&
                          formData.futureGoal.includes("Goal 3")
                        }
                      />
                      <span>Goal 3</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 mb-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Do you have access to a computer and the necessary software?
                  <span className="text-red-500">*</span>
                </label>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg shadow-sm border border-blue-100">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center justify-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                      <input
                        type="radio"
                        name="computerAccess"
                        value="yes"
                        className="w-5 h-5 mr-2 text-blue-600 focus:ring-blue-500"
                        onChange={() => {
                          setComputerAccessOther(false);
                          setFormData((prev) => ({ ...prev, computerAccess: "yes" }));
                        }}
                        checked={formData.computerAccess === "yes"}
                        required
                      />
                      <span className="font-medium">Yes</span>
                    </label>
                    <label className="flex items-center justify-center cursor-pointer bg-white p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-all">
                      <input
                        type="radio"
                        name="computerAccess"
                        value="no"
                        className="w-5 h-5 mr-2 text-blue-600 focus:ring-blue-500"
                        onChange={() => {
                          setComputerAccessOther(false);
                          setFormData((prev) => ({ ...prev, computerAccess: "no" }));
                        }}
                        checked={formData.computerAccess === "no"}
                        required
                      />
                      <span className="font-medium">No</span>
                    </label>
                  </div>
                  {computerAccessOther && (
                    <div className="mt-3">
                      <input
                        type="text"
                        id="computerAccessOther"
                        value={formData.computerAccessOther}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                        placeholder="Please specify details"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              } text-white py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-lg transition-all text-lg font-medium`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Enquiry"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Enquiry;
