import { useState, useEffect, useCallback } from 'react';

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

// Form Progress Tracking Hook
export const useFormProgress = (formKey: string) => {
  const [savedProgress, setSavedProgress] = useState<Record<string, unknown> | null>(null);
  const [progressStep, setProgressStep] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);

  // Load saved progress on mount
  useEffect(() => {
    const loadProgress = () => {
      try {
        const saved = localStorage.getItem(`form_progress_${formKey}`);
        if (saved) {
          const parsedProgress = JSON.parse(saved);
          setSavedProgress(parsedProgress.data);
          setProgressStep(parsedProgress.step);
          setIsRestoring(true);
        }
      } catch (error) {
        console.error('Failed to load form progress:', error);
      }
    };

    loadProgress();
  }, [formKey]);

  // Save progress to localStorage
  const saveProgress = useCallback((formData: Record<string, unknown>, step: number) => {
    try {
      const progressData = {
        data: formData,
        step: step,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(`form_progress_${formKey}`, JSON.stringify(progressData));
      setSavedProgress(formData);
      setProgressStep(step);
    } catch (error) {
      console.error('Failed to save form progress:', error);
    }
  }, [formKey]);

  // Clear saved progress
  const clearProgress = useCallback(() => {
    try {
      localStorage.removeItem(`form_progress_${formKey}`);
      setSavedProgress(null);
      setProgressStep(0);
      setIsRestoring(false);
    } catch (error) {
      console.error('Failed to clear form progress:', error);
    }
  }, [formKey]);

  // Check if there's saved progress
  const hasSavedProgress = Boolean(savedProgress);

  return {
    savedProgress,
    progressStep,
    isRestoring,
    hasSavedProgress,
    saveProgress,
    clearProgress,
    setIsRestoring,
  };
};

// Form Auto-save Hook
export const useFormAutoSave = (formKey: string, formData: Record<string, unknown>, currentStep: number, debounceMs: number = 2000) => {
  const { saveProgress } = useFormProgress(formKey);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Debounced auto-save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (formData && Object.keys(formData).length > 0) {
        setIsSaving(true);
        saveProgress(formData, currentStep);
        setLastSaved(new Date());
        setTimeout(() => setIsSaving(false), 500);
      }
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [formData, currentStep, saveProgress, debounceMs]);

  return {
    lastSaved,
    isSaving,
  };
};

// Form Session Hook
export const useFormSession = () => {
  const [sessionId, setSessionId] = useState<string>('');
  const [sessionStarted, setSessionStarted] = useState<Date | null>(null);
  const [sessionData, setSessionData] = useState<Record<string, unknown>>({});

  // Initialize session
  useEffect(() => {
    const initSession = () => {
      const id = Math.random().toString(36).substr(2, 9);
      setSessionId(id);
      setSessionStarted(new Date());
      
      // Store session in localStorage
      const sessionInfo = {
        id,
        startTime: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      };
      
      localStorage.setItem('form_session', JSON.stringify(sessionInfo));
    };

    initSession();
  }, []);

  // Update session data
  const updateSession = useCallback((data: Record<string, unknown>) => {
    setSessionData((prevData: Record<string, unknown>) => ({
      ...prevData,
      ...data,
      lastUpdated: new Date().toISOString(),
    }));
  }, []);

  // Get session analytics
  const getSessionDuration = useCallback(() => {
    if (!sessionStarted) return 0;
    return Math.floor((new Date().getTime() - sessionStarted.getTime()) / 1000);
  }, [sessionStarted]);

  return {
    sessionId,
    sessionStarted,
    sessionData,
    updateSession,
    getSessionDuration,
  };
}; 