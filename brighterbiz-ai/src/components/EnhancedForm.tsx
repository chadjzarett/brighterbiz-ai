'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, ArrowRight } from 'lucide-react';
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
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { errors, isValid, validateField } = useFormValidation();
  const { isLoading, progress, startLoading, updateProgress, completeLoading } = useLoadingState();

  // Detect mobile device and keyboard state
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Detect virtual keyboard on mobile
    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const currentHeight = window.visualViewport.height;
        const heightDifference = initialViewportHeight - currentHeight;
        setIsKeyboardOpen(heightDifference > 150); // Keyboard likely open if viewport shrunk by more than 150px
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, []);

  // Auto-scroll to keep input visible when keyboard opens on mobile
  useEffect(() => {
    if (isMobile && isKeyboardOpen && isFocused && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }, 300);
    }
  }, [isKeyboardOpen, isFocused, isMobile]);

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
    } catch {
      completeLoading();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (isMobile) {
      // Small delay to ensure keyboard animation starts
      setTimeout(() => setIsKeyboardOpen(true), 100);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isMobile) {
      setTimeout(() => setIsKeyboardOpen(false), 100);
    }
  };

  const isExpanded = isFocused || inputValue.length > 0;

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full ${className} ${isMobile && isKeyboardOpen ? 'mobile-keyboard-active' : ''}`}
      style={{
        // Ensure form stays visible when keyboard is open on mobile
        ...(isMobile && isKeyboardOpen ? {
          position: 'relative',
          zIndex: 1000,
        } : {})
      }}
    >
      <Card 
        className={`
          bg-gray-900 rounded-2xl border border-gray-700 shadow-lg 
          transition-all duration-500 ease-in-out
          ${isExpanded ? 'p-6' : 'p-2'}
          ${isMobile && isKeyboardOpen ? 'mobile-form-keyboard' : ''}
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
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={handleFocus}
              onBlur={handleBlur}
              placeholder={isExpanded ? placeholder : "Tell us about your business..."}
              className={`w-full px-4 py-3 text-base bg-gray-800 !text-white placeholder-gray-300 rounded-xl border-2 transition-all duration-300
                ${isFocused ? 'ring-4 ring-blue-500/30 border-blue-500' : 'border-gray-700'}
                ${errors.business ? 'border-red-500' : ''}
                ${isMobile ? 'text-16px' : ''} // Prevent zoom on iOS
                focus:text-white focus:!text-white
                [&:not(:placeholder-shown)]:!text-white
                [&]:!text-white
                input-white-text
              `}
              disabled={isLoading}
              style={{
                fontSize: isMobile ? '16px' : undefined, // Prevent iOS zoom
                color: 'white', // Force white text
                WebkitTextFillColor: 'white', // Override webkit default
                WebkitTextStroke: 'transparent', // Ensure no stroke
              }}
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
                    }
                    ${isMobile && isKeyboardOpen ? 'mobile-submit-btn' : ''}
                  `}
                >
                  <span>{isMobile ? 'Get Recommendations' : 'Get My Recommendations'}</span>
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
      
      {/* Mobile keyboard spacer */}
      {isMobile && isKeyboardOpen && (
        <div className="h-20" /> // Extra space to ensure button is visible
      )}
    </motion.div>
  );
}; 