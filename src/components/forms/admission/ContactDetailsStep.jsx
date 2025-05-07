import React from 'react';
import { FaAddressCard, FaPhone } from 'react-icons/fa';
import FormCard from '../FormCard';

const ContactDetailsStep = ({ formData, handleChange, errors }) => {
  return (
    <>
      <FormCard title="Contact Information" icon={<FaPhone />}>
        <div className="flex space-x-4">
          <div className="mb-4 flex-1">
            <label htmlFor="contactNumber" className="block text-gray-700">
              Contact Number (WhatsApp)<span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a 10-digit number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
            {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
          </div>
          <div className="mb-4 flex-1">
            <label htmlFor="alternateContactNumber" className="block text-gray-700">
              Alternate Contact Number
            </label>
            <input
              type="tel"
              id="alternateContactNumber"
              value={formData.alternateContactNumber}
              onChange={handleChange}
              pattern="[0-9]{10}"
              title="Please enter a 10-digit number"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="emailAddress" className="block text-gray-700">
            Email Address<span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="emailAddress"
            value={formData.emailAddress}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.emailAddress && <p className="text-red-500 text-sm mt-1">{errors.emailAddress}</p>}
        </div>
      </FormCard>

      <FormCard title="Address Information" icon={<FaAddressCard />}>
        <div className="flex space-x-4">
          <div className="mb-4 flex-1">
            <label htmlFor="state" className="block text-gray-700">
              State<span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
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
            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
          </div>
          <div className="mb-4 flex-1">
            <label htmlFor="district" className="block text-gray-700">
              District<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
            {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700">
            Residential Address<span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            rows="3"
            required
          ></textarea>
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="pinCode" className="block text-gray-700">
            Pin Code<span className="text-red-500">*</span>
          </label>
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
          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
        </div>
      </FormCard>

      <FormCard title="Family Information">
        <div className="mb-4">
          <label htmlFor="fathersName" className="block text-gray-700">
            Father's Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fathersName"
            value={formData.fathersName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.fathersName && <p className="text-red-500 text-sm mt-1">{errors.fathersName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="fathersOccupation" className="block text-gray-700">
            Father's Occupation<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="fathersOccupation"
            value={formData.fathersOccupation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.fathersOccupation && <p className="text-red-500 text-sm mt-1">{errors.fathersOccupation}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="mothersName" className="block text-gray-700">
            Mother's Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="mothersName"
            value={formData.mothersName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.mothersName && <p className="text-red-500 text-sm mt-1">{errors.mothersName}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="guardianName" className="block text-gray-700">
            Guardian's Name (if different from parents)
          </label>
          <input
            type="text"
            id="guardianName"
            value={formData.guardianName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="guardianRelation" className="block text-gray-700">
            Guardian's Relation
          </label>
          <input
            type="text"
            id="guardianRelation"
            value={formData.guardianRelation}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="guardianContactNumber" className="block text-gray-700">
            Guardian's Contact Number
          </label>
          <input
            type="tel"
            id="guardianContactNumber"
            value={formData.guardianContactNumber}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="Please enter a 10-digit number"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>
      </FormCard>
    </>
  );
};

export default ContactDetailsStep;
