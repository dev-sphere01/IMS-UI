import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const EnhancedFormCard = ({ 
  title, 
  icon, 
  children, 
  counter = null, 
  counterLabel = 'Items',
  expandable = false,
  initiallyExpanded = true,
  gradientBg = false
}) => {
  const [isExpanded, setIsExpanded] = useState(initiallyExpanded);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px rgba(124, 58, 237, 0.1)",
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      whileHover={expandable ? {} : "hover"}
      variants={cardVariants}
      className={`rounded-xl shadow-md border border-purple-100 p-6 mb-6 ${
        gradientBg ? 'bg-gradient-to-r from-purple-600 to-purple-400 text-white' : 'bg-white'
      }`}
    >
      <div 
        className={`flex items-center justify-between mb-4 pb-4 ${
          gradientBg ? 'border-b border-purple-300' : 'border-b border-gray-100'
        }`}
        onClick={() => expandable && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          {icon && (
            <motion.div 
              className={`text-2xl mr-3 ${gradientBg ? 'text-white' : 'text-purple-600'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {icon}
            </motion.div>
          )}
          
          <div>
            {title && (
              <h3 className={`text-xl font-semibold ${gradientBg ? 'text-white' : 'text-gray-800'}`}>
                {title}
              </h3>
            )}
            
            {counter !== null && (
              <div className="flex items-center mt-1">
                <span className={`text-sm ${gradientBg ? 'text-purple-100' : 'text-gray-500'}`}>
                  {counterLabel}: 
                </span>
                <span className={`ml-1 font-semibold ${gradientBg ? 'text-white' : 'text-purple-600'}`}>
                  {counter}
                </span>
              </div>
            )}
          </div>
        </div>
        
        {expandable && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1 rounded-full ${
              gradientBg ? 'bg-purple-500 hover:bg-purple-700' : 'bg-purple-100 hover:bg-purple-200'
            } cursor-pointer`}
          >
            {isExpanded ? (
              <FaChevronUp className={gradientBg ? 'text-white' : 'text-purple-600'} />
            ) : (
              <FaChevronDown className={gradientBg ? 'text-white' : 'text-purple-600'} />
            )}
          </motion.div>
        )}
      </div>
      
      <AnimatePresence>
        {(!expandable || isExpanded) && (
          <motion.div
            initial={expandable ? "hidden" : false}
            animate="visible"
            exit="hidden"
            variants={contentVariants}
            className="space-y-4 overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedFormCard;
