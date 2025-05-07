import React from 'react';
import { motion } from 'framer-motion';

const FormCard = ({ title, icon, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-md border border-purple-100 p-6 mb-6"
    >
      {(title || icon) && (
        <div className="flex items-center mb-4 pb-4 border-b border-gray-100">
          {icon && <div className="text-purple-600 text-2xl mr-3">{icon}</div>}
          {title && <h3 className="text-xl font-semibold text-gray-800">{title}</h3>}
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </motion.div>
  );
};

export default FormCard;
