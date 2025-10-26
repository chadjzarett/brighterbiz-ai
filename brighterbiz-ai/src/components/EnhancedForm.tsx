'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Send } from 'lucide-react';
import { useFormValidation, useLoadingState } from '@/lib/hooks';
import { AnimatedProgressBar } from './ProgressTracker';

interface EnhancedFormProps {
  onSubmit: (data: string) => void;
  placeholder?: string;
  className?: string;
}

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export const EnhancedForm = ({
  onSubmit,
  placeholder = "e.g., I run a small bakery in downtown Portland...",
  className = ''
}: EnhancedFormProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    if (isMobile && isKeyboardOpen && isFocused && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }, 300);
    }
  }, [isKeyboardOpen, isFocused, isMobile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Enforce max length
    if (value.length <= MAX_LENGTH) {
      setInputValue(value);
      validateField('business', value, {
        required: true,
        minLength: MIN_LENGTH,
        maxLength: MAX_LENGTH
      });
    }
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
    // Allow Ctrl/Cmd + Enter to submit
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && isValid && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (isMobile) {
      setTimeout(() => setIsKeyboardOpen(true), 100);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isMobile) {
      setTimeout(() => setIsKeyboardOpen(false), 100);
    }
  };

  const characterCount = inputValue.length;
  const isNearLimit = characterCount > MAX_LENGTH * 0.9;
  const isAtLimit = characterCount >= MAX_LENGTH;

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`w-full max-w-3xl mx-auto ${className}`}
    >
      <div className="space-y-3">
        {/* Label */}
        <label
          htmlFor="business-input"
          className="block text-sm font-medium text-secondary"
        >
          Describe your business
        </label>

        {/* Textarea with send button */}
        <div className="relative">
          <Textarea
            ref={textareaRef}
            id="business-input"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={3}
            disabled={isLoading}
            aria-invalid={!!errors.business}
            aria-describedby={errors.business ? "business-error" : "business-hint"}
            className={`
              w-full px-4 py-3.5 pr-14
              bg-tertiary text-primary
              border border-primary
              rounded-lg
              resize-none
              transition-all duration-200
              placeholder:text-tertiary
              focus:outline-none
              focus:border-blue-500
              focus:ring-4 focus:ring-blue-500/10
              disabled:opacity-50 disabled:cursor-not-allowed
              ${errors.business ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
              ${isMobile ? 'text-base' : 'text-base'}
            `}
            style={{
              fontSize: isMobile ? '16px' : undefined, // Prevent iOS zoom
            }}
          />

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={`
              absolute bottom-3 right-3
              p-2 rounded-lg
              transition-all duration-200
              disabled:opacity-30 disabled:cursor-not-allowed
              ${isValid && !isLoading 
                ? 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80 cursor-pointer' 
                : 'bg-tertiary text-secondary cursor-not-allowed'
              }
            `}
            aria-label="Send message"
            title="Send (Ctrl+Enter)"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Character counter */}
        <div className="flex items-center justify-between">
          {!errors.business ? (
            <p id="business-hint" className="text-sm text-secondary">
              Be as specific as possible for better recommendations
            </p>
          ) : (
            <p
              id="business-error"
              role="alert"
              className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {errors.business}
            </p>
          )}
          <div
            className={`
              text-xs font-medium
              ${isAtLimit ? 'text-red-600' : isNearLimit ? 'text-amber-600' : 'text-tertiary'}
            `}
            aria-live="polite"
            aria-atomic="true"
          >
            {characterCount}/{MAX_LENGTH}
          </div>
        </div>

        {/* Loading State */}
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <AnimatedProgressBar progress={progress} showPercentage={false} />
              <p className="text-sm text-secondary text-center">
                Analyzing your business...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile keyboard spacer */}
      {isMobile && isKeyboardOpen && (
        <div className="h-20" aria-hidden="true" />
      )}
    </motion.div>
  );
}; 