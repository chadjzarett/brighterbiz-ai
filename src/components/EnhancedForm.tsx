'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { useFormValidation, useLoadingState } from '@/lib/hooks';
import { AnimatedProgressBar } from './ProgressTracker';

interface EnhancedFormProps {
  onSubmit: (data: string) => void;
  placeholder?: string;
  className?: string;
}

export const EnhancedForm = ({ 
  onSubmit, 
  placeholder = "e.g., I own a coffee shop downtown",
  className = ''
}: EnhancedFormProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const { errors, isValid, validateField } = useFormValidation();
  const { isLoading, progress, startLoading, updateProgress, completeLoading } = useLoadingState();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    validateField('business', value, { 
      required: true, 
      minLength: 10,
      maxLength: 500 
    });
  };

  const handleSubmit = async () => {
    if (!isValid || isLoading) return;

    startLoading();
    
    // Simulate progress updates
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 90) {
        clearInterval(progressInterval);
        updateProgress(90);
      } else {
        updateProgress(currentProgress);
      }
    }, 200);

    try {
      await onSubmit(inputValue);
      updateProgress(100);
      setTimeout(() => {
        completeLoading();
      }, 500);
    } catch (error) {
      completeLoading();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleSubmit();
    }
  };

  const isExpanded = isFocused || inputValue.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full ${className}`}
    >
      <Card 
        className={`
          bg-gray-900 rounded-2xl border border-gray-700 shadow-lg 
          transition-all duration-500 ease-in-out
          ${isExpanded ? 'p-6' : 'p-2'}
        `}
      >
        <div className="space-y-4">
          <AnimatePresence>
            {isExpanded && (
              <motion.label 
                key="label"
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
                exit={{ opacity: 0, height: 0, y: -20, transition: { duration: 0.2, ease: 'easeIn' } }}
                className="block text-lg font-medium text-white text-center"
              >
                Tell us about your business to get personalized AI recommendations
              </motion.label>
            )}
          </AnimatePresence>
          
          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isExpanded ? placeholder : "Tell us about your business..."}
              className={`w-full px-4 py-3 text-base bg-gray-800 text-white placeholder-gray-300 rounded-xl border-2 transition-all duration-300
                ${isFocused ? 'ring-4 ring-blue-500/30 border-blue-500' : 'border-gray-700'}
                ${errors.business ? 'border-red-500' : ''}
              `}
              disabled={isLoading}
            />
          </div>

          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 pt-2"
              >
                <AnimatedProgressBar progress={progress} showPercentage={false} />
                <p className="text-sm text-gray-300 text-center">
                  Analyzing your business...
                </p>
              </motion.div>
            ) : isExpanded ? (
              <motion.div
                key="button"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="space-y-2 pt-2"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!isValid || isLoading}
                  className={`w-full py-3 text-base font-semibold rounded-xl transition-all duration-300 flex items-center justify-center space-x-2
                    ${isValid
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }`}
                >
                  <span>Get My Recommendations</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
                
                {errors.business && (
                  <p className="text-sm text-red-500 flex items-center justify-center pt-1">
                    <AlertCircle className="w-4 h-4 mr-1.5" />
                    {errors.business}
                  </p>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </Card>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-md text-gray-800 mt-5 text-center"
      >
        No signup required • Get instant results
      </motion.p>
    </motion.div>
  );
}; 