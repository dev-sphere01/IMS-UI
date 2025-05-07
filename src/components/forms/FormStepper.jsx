import React from 'react';
import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa';

const FormStepper = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep >= stepNumber;
          const isClickable = stepNumber < currentStep;
          const isCompleted = step.completed;

          // Determine the appropriate styling based on step state
          let stepStyle = '';
          let textStyle = '';

          if (isCompleted) {
            // Completed step
            stepStyle = 'bg-green-100 border-2 border-green-500';
            textStyle = 'text-green-600';
          } else if (isActive) {
            // Active but not completed
            stepStyle = 'bg-purple-100 border-2 border-purple-500';
            textStyle = 'text-purple-600';
          } else {
            // Inactive
            stepStyle = 'bg-gray-100 border border-gray-300';
            textStyle = 'text-gray-400';
          }

          return (
            <div
              key={stepNumber}
              className={`flex flex-col items-center ${textStyle}`}
            >
              <motion.div
                whileHover={isClickable ? { scale: 1.1 } : {}}
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 cursor-${isClickable ? 'pointer' : 'default'} ${stepStyle}`}
                onClick={() => isClickable && onStepClick(stepNumber)}
              >
                {isCompleted ? <FaCheck className="text-green-500" /> : stepNumber}
              </motion.div>
              <span className="text-xs font-medium">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-2 h-1 bg-gray-200 rounded-full">
        <motion.div
          className="h-full bg-purple-500 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        ></motion.div>
      </div>
    </div>
  );
};

export default FormStepper;
