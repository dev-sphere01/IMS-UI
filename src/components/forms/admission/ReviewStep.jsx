import React from 'react';
import { FaCheckCircle, FaUserAlt, FaFileAlt, FaAddressCard, FaGraduationCap, FaMoneyBillWave } from 'react-icons/fa';
import FormCard from '../FormCard';
import FilePreviewCell from '../../common/FilePreviewCell';

const formatCurrency = (value) => {
  if (!value) return '₹0';
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return '₹0';

  if (numValue >= 1000000) {
    return `₹${(numValue / 1000000).toFixed(2)}M`;
  } else if (numValue >= 1000) {
    return `₹${(numValue / 1000).toFixed(1)}K`;
  } else {
    return `₹${numValue}`;
  }
};

const ReviewStep = ({ formData }) => {
  return (
    <>
      <FormCard title="Review Your Information" icon={<FaCheckCircle />}>
        <p className="text-gray-600 mb-4">
          Please review all the information you have entered. Once you submit the form, you won't be able to edit it.
        </p>
      </FormCard>

      <FormCard title="Basic Information" icon={<FaUserAlt />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Form No</p>
            <p className="font-medium">{formData.formNo || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Center Code</p>
            <p className="font-medium">{formData.centerCode || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Employee ID</p>
            <p className="font-medium">{formData.employeeId || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Registration No</p>
            <p className="font-medium">{formData.generatedRegNo || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="font-medium">{formData.fullName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Date of Birth</p>
            <p className="font-medium">{formData.dob || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Gender</p>
            <p className="font-medium">{formData.gender || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Category</p>
            <p className="font-medium">{formData.category || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Aadhar No</p>
            <p className="font-medium">{formData.aadharNo || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Religion</p>
            <p className="font-medium">{formData.religion || 'Not provided'}</p>
          </div>
        </div>
      </FormCard>

      <FormCard title="Documents & Photos" icon={<FaFileAlt />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Aadhar Card</p>
            <div className="mt-1">
              {formData.aadharPhoto ? (
                <FilePreviewCell
                  filePath={formData.aadharPhoto}
                  fileType="pdf"
                  label="Aadhar Card"
                  showLabel={false}
                />
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Candidate Photo</p>
            <div className="mt-1">
              {formData.candidatePhoto ? (
                <FilePreviewCell
                  filePath={formData.candidatePhoto}
                  fileType="image"
                  label="Candidate Photo"
                  showLabel={false}
                />
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Candidate Signature</p>
            <div className="mt-1">
              {formData.candidateSignature ? (
                <FilePreviewCell
                  filePath={formData.candidateSignature}
                  fileType="image"
                  label="Candidate Signature"
                  showLabel={false}
                />
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Left Thumb Impression</p>
            <div className="mt-1">
              {formData.candidateLeftThumbImpression ? (
                <FilePreviewCell
                  filePath={formData.candidateLeftThumbImpression}
                  fileType="image"
                  label="Thumb Impression"
                  showLabel={false}
                />
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">10th Marksheet</p>
            <div className="mt-1">
              {formData.tenthMarksheet ? (
                <FilePreviewCell
                  filePath={formData.tenthMarksheet}
                  fileType="pdf"
                  label="10th Marksheet"
                  showLabel={false}
                />
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">12th Marksheet</p>
            <div className="mt-1">
              {formData.twelfthMarksheet ? (
                <FilePreviewCell
                  filePath={formData.twelfthMarksheet}
                  fileType="pdf"
                  label="12th Marksheet"
                  showLabel={false}
                />
              ) : (
                <span className="text-gray-400">Not uploaded</span>
              )}
            </div>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Ex-Servicemen</p>
            <p className="font-medium">{formData.exServicemen || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Specially Abled</p>
            <p className="font-medium">
              {formData.speciallyAbled === 'other'
                ? formData.speciallyAbledOther
                : formData.speciallyAbled || 'Not provided'}
            </p>
          </div>
        </div>
      </FormCard>

      <FormCard title="Contact Information" icon={<FaAddressCard />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Contact Number</p>
            <p className="font-medium">{formData.contactNumber || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Alternate Contact Number</p>
            <p className="font-medium">{formData.alternateContactNumber || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Email Address</p>
            <p className="font-medium">{formData.emailAddress || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">State</p>
            <p className="font-medium">{formData.state || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">District</p>
            <p className="font-medium">{formData.district || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Pin Code</p>
            <p className="font-medium">{formData.pinCode || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600 text-sm">Residential Address</p>
            <p className="font-medium">{formData.address || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Father's Name</p>
            <p className="font-medium">{formData.fathersName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Father's Occupation</p>
            <p className="font-medium">{formData.fathersOccupation || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Mother's Name</p>
            <p className="font-medium">{formData.mothersName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Guardian's Name</p>
            <p className="font-medium">{formData.guardianName || 'Not provided'}</p>
          </div>
        </div>
      </FormCard>

      <FormCard title="Educational & Course Information" icon={<FaGraduationCap />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Highest Educational Qualification</p>
            <p className="font-medium">{formData.highestEducationalQualification || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Board/University</p>
            <p className="font-medium">{formData.boardOrUniversity || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Year of Passing</p>
            <p className="font-medium">{formData.yearOfPassing || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Subjects Studied</p>
            <p className="font-medium">{formData.subjectsStudied || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Course Applied For</p>
            <p className="font-medium">{formData.courseApplied || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Preferred Mode of Learning</p>
            <p className="font-medium">{formData.preferredModeOfLearning || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600 text-sm">Additional Courses</p>
            <p className="font-medium">
              {[
                formData.tShirt && 'T-Shirt',
                formData.itTools && 'IT Tools',
                formData.webDesigning && 'Web Designing',
                formData.tally && 'Tally',
                formData.gfxDtp && 'GFX DTP',
                formData.python && 'Python',
                formData.iot && 'IoT'
              ]
                .filter(Boolean)
                .join(', ') || 'None selected'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Referral Source</p>
            <p className="font-medium">
              {formData.referralSource === 'Other'
                ? formData.referralSourceOther
                : formData.referralSource || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Referral Name</p>
            <p className="font-medium">{formData.referalName || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Computer Access</p>
            <p className="font-medium">
              {formData.computerAccess === 'other'
                ? formData.computerAccessOther
                : formData.computerAccess || 'Not provided'}
            </p>
          </div>
        </div>
      </FormCard>

      <FormCard title="Payment Details" icon={<FaMoneyBillWave />}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Total Fee</p>
            <p className="font-medium">{formatCurrency(formData.totalFee)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Discount</p>
            <p className="font-medium">{formatCurrency(formData.discount)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Net Fee</p>
            <p className="font-medium">{formatCurrency(formData.netFee)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Paid Fee</p>
            <p className="font-medium">{formatCurrency(formData.paidFee)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Remaining Fee</p>
            <p className="font-medium">{formatCurrency(formData.remainingFee)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Payment Method</p>
            <p className="font-medium">{formData.paymentMethod || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Transaction ID</p>
            <p className="font-medium">{formData.transactionId || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Payment Date</p>
            <p className="font-medium">{formData.paymentDate || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <p className="font-medium">{formData.status || 'Not provided'}</p>
          </div>
          <div className="md:col-span-2">
            <p className="text-gray-600 text-sm">Important Note</p>
            <p className="font-medium">{formData.importantNoteRelatedToTime || 'Not provided'}</p>
          </div>
        </div>
      </FormCard>
    </>
  );
};

export default ReviewStep;
