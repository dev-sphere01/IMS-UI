import React from 'react';
import { FaFileAlt } from 'react-icons/fa';
import FormCard from '../FormCard';
import FileUploadField from '../FileUploadField';

const DocumentsStep = ({ formData, handleChange, handleFileChange, handleFileDelete, errors }) => {
  return (
    <FormCard title="Documents & Photos" icon={<FaFileAlt />}>
      <FileUploadField
        id="aadharPhoto"
        label="Aadhar Card"
        value={formData.aadharPhoto}
        onChange={handleFileChange}
        onDelete={() => handleFileDelete && handleFileDelete('aadharPhoto', formData.aadharPhoto)}
        accept="image/*,.pdf"
        required={true}
        error={errors.aadharPhoto}
      />

      <FileUploadField
        id="candidatePhoto"
        label="Candidate Photo"
        value={formData.candidatePhoto}
        onChange={handleFileChange}
        onDelete={() => handleFileDelete && handleFileDelete('candidatePhoto', formData.candidatePhoto)}
        accept="image/*"
        required={true}
        error={errors.candidatePhoto}
      />

      <FileUploadField
        id="candidateSignature"
        label="Candidate Signature"
        value={formData.candidateSignature}
        onChange={handleFileChange}
        onDelete={() => handleFileDelete && handleFileDelete('candidateSignature', formData.candidateSignature)}
        accept="image/*"
        required={true}
        error={errors.candidateSignature}
      />

      <FileUploadField
        id="candidateLeftThumbImpression"
        label="Candidate Left Thumb Impression"
        value={formData.candidateLeftThumbImpression}
        onChange={handleFileChange}
        onDelete={() => handleFileDelete && handleFileDelete('candidateLeftThumbImpression', formData.candidateLeftThumbImpression)}
        accept="image/*"
        required={false}
        error={errors.candidateLeftThumbImpression}
      />

      <div className="mb-4">
        <label htmlFor="apaarId" className="block text-gray-700">
          APAAR ID
        </label>
        <input
          type="text"
          id="apaarId"
          value={formData.apaarId}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500"
        />
      </div>

      <FileUploadField
        id="tenthMarksheet"
        label="10th Marksheet"
        value={formData.tenthMarksheet}
        onChange={handleFileChange}
        onDelete={() => handleFileDelete && handleFileDelete('tenthMarksheet', formData.tenthMarksheet)}
        accept="image/*,.pdf"
        required={true}
        error={errors.tenthMarksheet}
      />

      <FileUploadField
        id="twelfthMarksheet"
        label="12th Marksheet"
        value={formData.twelfthMarksheet}
        onChange={handleFileChange}
        onDelete={() => handleFileDelete && handleFileDelete('twelfthMarksheet', formData.twelfthMarksheet)}
        accept="image/*,.pdf"
        required={false}
        error={errors.twelfthMarksheet}
      />

      <div className="mb-4">
        <label className="block text-gray-700">
          Ex-Servicemen<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="exServicemen"
              id="exServicemen"
              value="yes"
              checked={formData.exServicemen === 'yes'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="exServicemen"
              id="exServicemen"
              value="no"
              checked={formData.exServicemen === 'no'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            No
          </label>
        </div>
        {errors.exServicemen && <p className="text-red-500 text-sm mt-1">{errors.exServicemen}</p>}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">
          Specially Abled<span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="speciallyAbled"
              id="speciallyAbled"
              value="yes"
              checked={formData.speciallyAbled === 'yes'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            Yes
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="speciallyAbled"
              id="speciallyAbled"
              value="no"
              checked={formData.speciallyAbled === 'no'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            No
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="speciallyAbled"
              id="speciallyAbled"
              value="other"
              checked={formData.speciallyAbled === 'other'}
              onChange={handleChange}
              className="mr-2"
              required
            />
            Other
          </label>
        </div>
        {formData.speciallyAbled === 'other' && (
          <input
            type="text"
            id="speciallyAbledOther"
            value={formData.speciallyAbledOther}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-purple-500 mt-2"
            placeholder="Please specify"
            required
          />
        )}
        {errors.speciallyAbled && <p className="text-red-500 text-sm mt-1">{errors.speciallyAbled}</p>}
      </div>
    </FormCard>
  );
};

export default DocumentsStep;
