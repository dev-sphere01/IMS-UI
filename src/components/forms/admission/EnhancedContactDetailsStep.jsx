import React, { useState, useEffect } from 'react';
import { FaAddressCard, FaPhone, FaUser, FaEnvelope, FaMapMarkerAlt, FaHome, FaUserFriends } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EnhancedFormCard from '../EnhancedFormCard';

const EnhancedContactDetailsStep = ({ formData, handleChange, errors }) => {
  // Calculate completion counters
  const [contactInfoCount, setContactInfoCount] = useState(0);
  const [addressInfoCount, setAddressInfoCount] = useState(0);
  const [familyInfoCount, setFamilyInfoCount] = useState(0);

  // State for other guardian checkbox
  const [hasOtherGuardian, setHasOtherGuardian] = useState(
    formData.guardianName?.trim() || formData.guardianRelation?.trim() || formData.guardianContactNumber?.trim()
      ? true
      : false
  );

  // Update counters when form data changes
  useEffect(() => {
    // Contact info fields
    const contactFields = ['contactNumber', 'alternateContactNumber', 'emailAddress'];
    const contactFilled = contactFields.filter(field => formData[field]?.trim()).length;
    setContactInfoCount(`${contactFilled}/${contactFields.length}`);

    // Address info fields
    const addressFields = ['state', 'district', 'address', 'pinCode'];
    const addressFilled = addressFields.filter(field => formData[field]?.trim()).length;
    setAddressInfoCount(`${addressFilled}/${addressFields.length}`);

    // Family info fields - include guardian fields only if hasOtherGuardian is true
    let familyFields = ['fathersName', 'fathersOccupation', 'mothersName'];

    if (hasOtherGuardian) {
      familyFields = [...familyFields, 'guardianName', 'guardianRelation', 'guardianContactNumber'];
    }

    const familyFilled = familyFields.filter(field => formData[field]?.trim()).length;
    setFamilyInfoCount(`${familyFilled}/${familyFields.length}`);
  }, [formData, hasOtherGuardian]);

  // Input field animation
  const inputVariants = {
    focus: { scale: 1.02, boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)" },
    tap: { scale: 0.98 }
  };

  // Handle guardian checkbox change
  const handleGuardianCheckboxChange = (e) => {
    const { checked } = e.target;
    setHasOtherGuardian(checked);

    // Clear guardian fields if unchecked
    if (!checked) {
      const event = {
        target: { id: 'guardianName', value: '' }
      };
      handleChange(event);

      event.target.id = 'guardianRelation';
      handleChange(event);

      event.target.id = 'guardianContactNumber';
      handleChange(event);
    }
  };

  return (
    <>
      <EnhancedFormCard
        title="Contact Information"
        icon={<FaPhone />}
        counter={contactInfoCount}
        counterLabel="Completed"
        gradientBg={true}
        expandable={true}
        initiallyExpanded={true}
      >
        <div className="flex space-x-4">
          <div className="mb-4 flex-1">
            <label htmlFor="contactNumber" className="block text-white font-medium mb-1">
              Contact Number (WhatsApp)<span className="text-red-200">*</span>
            </label>
            <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
              <input
                type="tel"
                id="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Please enter a 10-digit number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-300 bg-white text-gray-800"
                required
              />
            </motion.div>
            {errors.contactNumber && <p className="text-red-200 text-sm mt-1">{errors.contactNumber}</p>}
          </div>
          <div className="mb-4 flex-1">
            <label htmlFor="alternateContactNumber" className="block text-white font-medium mb-1">
              Alternate Contact Number
            </label>
            <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
              <input
                type="tel"
                id="alternateContactNumber"
                value={formData.alternateContactNumber}
                onChange={handleChange}
                pattern="[0-9]{10}"
                title="Please enter a 10-digit number"
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-300 bg-white text-gray-800"
              />
            </motion.div>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="emailAddress" className="block text-white font-medium mb-1">
            Email Address<span className="text-red-200">*</span>
          </label>
          <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="emailAddress"
                value={formData.emailAddress}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-300 bg-white text-gray-800"
                required
              />
            </div>
          </motion.div>
          {errors.emailAddress && <p className="text-red-200 text-sm mt-1">{errors.emailAddress}</p>}
        </div>
      </EnhancedFormCard>

      <EnhancedFormCard
        title="Address Information"
        icon={<FaAddressCard />}
        counter={addressInfoCount}
        counterLabel="Completed"
      >
        <div className="flex space-x-4">
          <div className="mb-4 flex-1">
            <label htmlFor="state" className="block text-gray-700 font-medium mb-1">
              State<span className="text-red-500">*</span>
            </label>
            <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <select
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                  required
                >
                  <option value="">Select State</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                  <option value="Assam">Assam</option>
                  <option value="Bihar">Bihar</option>
                  <option value="Chhattisgarh">Chhattisgarh</option>
                  <option value="Goa">Goa</option>
                  <option value="Gujarat">Gujarat</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Himachal Pradesh">Himachal Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Manipur">Manipur</option>
                  <option value="Meghalaya">Meghalaya</option>
                  <option value="Mizoram">Mizoram</option>
                  <option value="Nagaland">Nagaland</option>
                  <option value="Odisha">Odisha</option>
                  <option value="Punjab">Punjab</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Sikkim">Sikkim</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tripura">Tripura</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Uttarakhand">Uttarakhand</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Delhi">Delhi</option>
                </select>
              </div>
            </motion.div>
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>
          <div className="mb-4 flex-1">
            <label htmlFor="district" className="block text-gray-700 font-medium mb-1">
              District<span className="text-red-500">*</span>
            </label>
            <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
              <input
                type="text"
                id="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                required
              />
            </motion.div>
            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
            Residential Address<span className="text-red-500">*</span>
          </label>
          <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FaHome className="text-gray-400" />
              </div>
              <textarea
                id="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                rows="3"
                required
              ></textarea>
            </div>
          </motion.div>
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="pinCode" className="block text-gray-700 font-medium mb-1">
            Pin Code<span className="text-red-500">*</span>
          </label>
          <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
            <input
              type="text"
              id="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              pattern="[0-9]{6}"
              title="Please enter a 6-digit pin code"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </motion.div>
          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
        </div>
      </EnhancedFormCard>

      <EnhancedFormCard
        title="Family Information"
        icon={<FaUser />}
        counter={familyInfoCount}
        counterLabel="Completed"
        expandable={true}
      >
        <div className="mb-4">
          <label htmlFor="fathersName" className="block text-gray-700 font-medium mb-1">
            Father's Name<span className="text-red-500">*</span>
          </label>
          <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
            <input
              type="text"
              id="fathersName"
              value={formData.fathersName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
          </motion.div>
          {errors.fathersName && <p className="text-red-500 text-sm mt-1">{errors.fathersName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="fathersOccupation" className="block text-gray-700 font-medium mb-1">
            Father's Occupation
          </label>
          <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
            <input
              type="text"
              id="fathersOccupation"
              value={formData.fathersOccupation}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            />
          </motion.div>
        </div>

        <div className="mb-4">
          <label htmlFor="mothersName" className="block text-gray-700 font-medium mb-1">
            Mother's Name
          </label>
          <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
            <input
              type="text"
              id="mothersName"
              value={formData.mothersName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            />
          </motion.div>
        </div>

        {/* Guardian Checkbox */}
        <div className="mb-4 mt-6 border-t pt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasOtherGuardian"
              checked={hasOtherGuardian}
              onChange={handleGuardianCheckboxChange}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="hasOtherGuardian" className="ml-2 block text-gray-700 font-medium">
              <div className="flex items-center">
                <FaUserFriends className="mr-2 text-purple-500" />
                Student has a guardian other than parents
              </div>
            </label>
          </div>
        </div>

        {/* Guardian Fields - Only shown if hasOtherGuardian is true */}
        {hasOtherGuardian && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100 mt-2 mb-4">
            <h3 className="text-purple-700 font-medium mb-3">Guardian Information</h3>

            <div className="mb-4">
              <label htmlFor="guardianName" className="block text-gray-700 font-medium mb-1">
                Guardian's Name
              </label>
              <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
                <input
                  type="text"
                  id="guardianName"
                  value={formData.guardianName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                />
              </motion.div>
            </div>

            <div className="mb-4">
              <label htmlFor="guardianRelation" className="block text-gray-700 font-medium mb-1">
                Guardian's Relation
              </label>
              <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
                <select
                  id="guardianRelation"
                  value={formData.guardianRelation || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                >
                  <option value="">Select Relation</option>
                  <option value="Grandparent">Grandparent</option>
                  <option value="Uncle">Uncle</option>
                  <option value="Aunt">Aunt</option>
                  <option value="Elder Sibling">Elder Sibling</option>
                  <option value="Other Relative">Other Relative</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </motion.div>
            </div>

            <div className="mb-2">
              <label htmlFor="guardianContactNumber" className="block text-gray-700 font-medium mb-1">
                Guardian's Contact Number
              </label>
              <motion.div whileHover="focus" whileTap="tap" variants={inputVariants}>
                <input
                  type="tel"
                  id="guardianContactNumber"
                  value={formData.guardianContactNumber || ''}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a 10-digit number"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
                />
              </motion.div>
            </div>
          </div>
        )}
      </EnhancedFormCard>
    </>
  );
};

export default EnhancedContactDetailsStep;
