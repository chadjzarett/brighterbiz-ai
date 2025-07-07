import { useState } from 'react';

export const useSmoothScroll = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return { scrollToSection };
};

export const useFormValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValid, setIsValid] = useState(false);

  const validateField = (name: string, value: string, rules: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  }) => {
    const newErrors = { ...errors };

    if (rules.required && !value.trim()) {
      newErrors[name] = 'This field is required';
    } else if (rules.minLength && value.length < rules.minLength) {
      newErrors[name] = `Minimum ${rules.minLength} characters required`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      newErrors[name] = `Maximum ${rules.maxLength} characters allowed`;
    } else if (rules.pattern && !rules.pattern.test(value)) {
      newErrors[name] = 'Invalid format';
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(false);
  };

  return { errors, isValid, validateField, clearErrors };
};

export const useLoadingState = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const updateProgress = (newProgress: number) => {
    setProgress(Math.min(100, Math.max(0, newProgress)));
  };

  const completeLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 500);
  };

  return { isLoading, progress, startLoading, updateProgress, completeLoading };
}; 