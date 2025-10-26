'use client';

import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface ProgressStep {
  id: string;
  label: string;
  description?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export const ProgressTracker = ({ steps, currentStep, className = '' }: ProgressTrackerProps) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  transition: { delay: index * 0.1 }
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  index < currentStep
                    ? 'bg-green-500 border-green-500 text-white'
                    : index === currentStep
                    ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                    : 'bg-tertiary border-primary text-tertiary'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-semibold">{index + 1}</span>
                )}
              </motion.div>
              <div className="mt-2 text-center">
                <p className={`text-xs font-medium ${
                  index <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ 
                  scaleX: index < currentStep ? 1 : 0,
                  transition: { delay: index * 0.1 + 0.2 }
                }}
                className={`w-16 h-0.5 mx-4 transform origin-left ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const AnimatedProgressBar = ({ 
  progress, 
  className = '',
  showPercentage = true 
}: { 
  progress: number; 
  className?: string;
  showPercentage?: boolean;
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-tertiary rounded-full h-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-black dark:bg-white rounded-full relative"
        >
          <motion.div
            animate={{ 
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-white opacity-30 rounded-full"
          />
        </motion.div>
      </div>
      {showPercentage && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-600 mt-2 text-center"
        >
          {Math.round(progress)}% Complete
        </motion.p>
      )}
    </div>
  );
}; 