import React from 'react';
import { FaGraduationCap, FaBookOpen } from 'react-icons/fa';
import FormCard from '../FormCard';

const EducationCourseStep = ({ formData, handleChange, handleCheckboxChange, errors }) => {
  return (
    <>
      <FormCard title="Educational Information" icon={<FaGraduationCap />}>
        <div className="mb-4">
          <label htmlFor="highestEducationalQualification" className="block text-gray-700">
            Highest Educational Qualification<span className="text-red-500">*</span>
          </label>
          <select
            id="highestEducationalQualification"
            value={formData.highestEducationalQualification}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Qualification</option>
            <option value="10th">10th</option>
            <option value="12th">12th</option>
            <option value="Diploma">Diploma</option>
            <option value="Graduate">Graduate</option>
            <option value="Post Graduate">Post Graduate</option>
            <option value="PhD">PhD</option>
            <option value="Other">Other</option>
          </select>
          {errors.highestEducationalQualification && (
            <p className="text-red-500 text-sm mt-1">{errors.highestEducationalQualification}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="boardOrUniversity" className="block text-gray-700">
            Board/University<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="boardOrUniversity"
            value={formData.boardOrUniversity}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.boardOrUniversity && <p className="text-red-500 text-sm mt-1">{errors.boardOrUniversity}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="yearOfPassing" className="block text-gray-700">
            Year of Passing<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="yearOfPassing"
            value={formData.yearOfPassing}
            onChange={handleChange}
            pattern="[0-9]{4}"
            title="Please enter a 4-digit year"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.yearOfPassing && <p className="text-red-500 text-sm mt-1">{errors.yearOfPassing}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="subjectsStudied" className="block text-gray-700">
            Subjects Studied<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subjectsStudied"
            value={formData.subjectsStudied}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          />
          {errors.subjectsStudied && <p className="text-red-500 text-sm mt-1">{errors.subjectsStudied}</p>}
        </div>
      </FormCard>

      <FormCard title="Course Information" icon={<FaBookOpen />}>
        <div className="mb-4">
          <label htmlFor="courseApplied" className="block text-gray-700">
            Course Applied For<span className="text-red-500">*</span>
          </label>
          <select
            id="courseApplied"
            value={formData.courseApplied}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
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
          {errors.courseApplied && <p className="text-red-500 text-sm mt-1">{errors.courseApplied}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="preferredModeOfLearning" className="block text-gray-700">
            Preferred Mode of Learning<span className="text-red-500">*</span>
          </label>
          <select
            id="preferredModeOfLearning"
            value={formData.preferredModeOfLearning}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Mode</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>
          {errors.preferredModeOfLearning && (
            <p className="text-red-500 text-sm mt-1">{errors.preferredModeOfLearning}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Additional Courses<span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tShirt"
                checked={formData.tShirt}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              T-Shirt
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="itTools"
                checked={formData.itTools}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              IT Tools
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="webDesigning"
                checked={formData.webDesigning}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Web Designing
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="tally"
                checked={formData.tally}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Tally
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="gfxDtp"
                checked={formData.gfxDtp}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              GFX DTP
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="python"
                checked={formData.python}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              Python
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="iot"
                checked={formData.iot}
                onChange={handleCheckboxChange}
                className="mr-2"
              />
              IoT
            </label>
          </div>
          {errors.courses && <p className="text-red-500 text-sm mt-1">{errors.courses}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="referralSource" className="block text-gray-700">
            How did you hear about us?<span className="text-red-500">*</span>
          </label>
          <select
            id="referralSource"
            value={formData.referralSource}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
            required
          >
            <option value="">Select Source</option>
            <option value="Friend">Friend</option>
            <option value="Social Media">Social Media</option>
            <option value="Website">Website</option>
            <option value="Newspaper">Newspaper</option>
            <option value="Pamphlet">Pamphlet</option>
            <option value="Other">Other</option>
          </select>
          {errors.referralSource && <p className="text-red-500 text-sm mt-1">{errors.referralSource}</p>}
        </div>

        {formData.referralSource === 'Other' && (
          <div className="mb-4">
            <label htmlFor="referralSourceOther" className="block text-gray-700">
              Please specify<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="referralSourceOther"
              value={formData.referralSourceOther}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
              required
            />
            {errors.referralSourceOther && <p className="text-red-500 text-sm mt-1">{errors.referralSourceOther}</p>}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="referalName" className="block text-gray-700">
            Referral Name (if any)
          </label>
          <input
            type="text"
            id="referalName"
            value={formData.referalName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="computerAccess" className="block text-gray-700">
            Do you have access to a computer?<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="computerAccess"
                id="computerAccess"
                value="yes"
                checked={formData.computerAccess === 'yes'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Yes
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="computerAccess"
                id="computerAccess"
                value="no"
                checked={formData.computerAccess === 'no'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              No
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="computerAccess"
                id="computerAccess"
                value="other"
                checked={formData.computerAccess === 'other'}
                onChange={handleChange}
                className="mr-2"
                required
              />
              Other
            </label>
          </div>
          {formData.computerAccess === 'other' && (
            <input
              type="text"
              id="computerAccessOther"
              value={formData.computerAccessOther}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500 mt-2"
              placeholder="Please specify"
              required
            />
          )}
          {errors.computerAccess && <p className="text-red-500 text-sm mt-1">{errors.computerAccess}</p>}
        </div>
      </FormCard>
    </>
  );
};

export default EducationCourseStep;
