'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressTracker, AnimatedProgressBar } from '@/components/ProgressTracker';
import ConnectWithMeSection from '@/components/ConnectWithMeSection';
import FloatingConnectButton from '@/components/FloatingConnectButton';
import ConsultationModal from '@/components/ConsultationModal';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  ArrowLeft, Clock, DollarSign, BarChart3, Loader2, Lightbulb, Mail, Megaphone,
  MessageCircle, Users, Settings, CalendarCheck, CheckCircle2, ChevronUp, Share2
} from 'lucide-react';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedCost: string;
  timeToImplement: string;
}

interface FormData {
  businessName: string;
  businessType: string;
  businessDescription: string;
  companySize: string;
  monthlyRevenue: string;
  yearsInBusiness: string;
  primaryGoals: string[];
  currentChallenges: string[];
  techComfort: string;
  budget: string;
  timeline: string;
  focusAreas: string[];
  additionalInfo?: string;
}

function ResultsContent() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [businessDescription, setBusinessDescription] = useState('');
  const [isStructuredData, setIsStructuredData] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showConsultationModal, setShowConsultationModal] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const progressSteps = [
    { id: 'analyzing', label: 'Analyzing', description: 'Processing your business' },
    { id: 'generating', label: 'Generating', description: 'Creating recommendations' },
    { id: 'complete', label: 'Complete', description: 'Results ready' }
  ];
  
  useEffect(() => {
    const description = searchParams.get('business');
    const structured = searchParams.get('structured') === 'true';
    const formDataStr = searchParams.get('formData');
    
    if (!description) {
      router.push('/');
      return;
    }
    
    setBusinessDescription(description);
    setIsStructuredData(structured);
    
    if (structured && formDataStr) {
      try {
        const parsedFormData = JSON.parse(formDataStr);
        setFormData(parsedFormData);
        fetchRecommendations(description, structured, parsedFormData);
      } catch (error) {
        console.error('Failed to parse form data:', error);
        fetchRecommendations(description);
      }
    } else {
      fetchRecommendations(description);
    }
  }, [searchParams, router]);

  const fetchRecommendations = async (description: string, structured?: boolean, formData?: FormData) => {
    try {
      setLoading(true);
      setCurrentStep(0);
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          if (newProgress >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return newProgress;
        });
      }, 200);

      // Simulate step progression
      setTimeout(() => setCurrentStep(1), 1000);
      setTimeout(() => setCurrentStep(2), 2000);

      const requestBody = {
        businessDescription: description,
        ...(structured && { structured, formData })
      };

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setProgress(100);
      
      setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      setError('Failed to generate recommendations. Please try again.');
      console.error('Error fetching recommendations:', err);
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    // Minimal color approach - subtle backgrounds with better dark mode support
    const colors = {
      'Customer Service': 'bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400',
      'Marketing': 'bg-pink-500/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
      'Operations': 'bg-blue-500/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
      'Analytics': 'bg-purple-500/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
      'Automation': 'bg-orange-500/10 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
      'Sales': 'bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
      'Content Creation': 'bg-indigo-500/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400',
      'Finance': 'bg-teal-500/10 text-teal-700 dark:bg-teal-500/20 dark:text-teal-400',
      'HR & Hiring': 'bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400',
      'Legal & Compliance': 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400',
      'Productivity': 'bg-cyan-500/10 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
      'E-commerce': 'bg-fuchsia-500/10 text-fuchsia-700 dark:bg-fuchsia-500/20 dark:text-fuchsia-400',
      'Customer Insights': 'bg-lime-500/10 text-lime-700 dark:bg-lime-500/20 dark:text-lime-400',
      'IT & Security': 'bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400';
  };

  const getDifficultyConfig = (difficulty: string) => {
    const configs = {
      'Easy': {
        bg: 'bg-green-500/10 dark:bg-green-500/20',
        text: 'text-green-700 dark:text-green-400',
        icon: '✓',
        label: 'Easy to implement'
      },
      'Medium': {
        bg: 'bg-amber-500/10 dark:bg-amber-500/20',
        text: 'text-amber-700 dark:text-amber-400',
        icon: '◆',
        label: 'Moderate difficulty'
      },
      'Advanced': {
        bg: 'bg-red-500/10 dark:bg-red-500/20',
        text: 'text-red-700 dark:text-red-400',
        icon: '★',
        label: 'Advanced implementation'
      },
    };
    return configs[difficulty as keyof typeof configs] || {
      bg: 'bg-gray-500/10',
      text: 'text-gray-700 dark:text-gray-400',
      icon: '○',
      label: difficulty
    };
  };

  const sortRecommendationsByDifficulty = (recommendations: Recommendation[]) => {
    const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Advanced': 3, 'High': 3 };
    
    return [...recommendations].sort((a, b) => {
      const aOrder = difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 4;
      const bOrder = difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 4;
      return aOrder - bOrder;
    });
  };

  // Map keywords/categories to icons for recommendations
  const getRecommendationIcon = (rec: Recommendation) => {
    const title = rec.title.toLowerCase();
    const category = rec.category.toLowerCase();
    if (title.match(/schedule|appointment|booking|reservation/)) return CalendarCheck;
    if (title.match(/reminder|follow/)) return Mail;
    if (title.match(/marketing|campaign|promotion/)) return Megaphone;
    if (title.match(/analytics|feedback|insight|report/)) return BarChart3;
    if (title.match(/review|sentiment/)) return MessageCircle;
    if (title.match(/customer|client|patient/)) return Users;
    if (title.match(/automation|tool|auto/)) return Settings;
    if (title.match(/social|post|instagram/)) return Share2;
    if (title.match(/payment|invoice|cost|price/)) return DollarSign;
    if (title.match(/complete|done|success/)) return CheckCircle2;
    if (category.match(/analytics/)) return BarChart3;
    if (category.match(/marketing/)) return Megaphone;
    if (category.match(/customer/)) return Users;
    if (category.match(/operations/)) return Settings;
    if (category.match(/automation/)) return Settings;
    return Lightbulb;
  };

  const getSuggestedTools = (recommendation: Recommendation) => {
    const category = recommendation.category.toLowerCase();
    const description = recommendation.description.toLowerCase();

    const tools = new Set<string>();

    // Add ChatGPT for most recommendations as it's versatile
    tools.add('ChatGPT');

    // Add tools based on category and content
    if (category.includes('automation') || description.includes('automate')) {
      tools.add('Make.com');
      tools.add('Zapier');
    }

    if (category.includes('marketing') || description.includes('social') || description.includes('post')) {
      tools.add('Canva');
      tools.add('Buffer');
    }

    if (description.includes('analytics') || description.includes('data') || description.includes('report')) {
      tools.add('Google Analytics');
      tools.add('Tableau');
    }

    if (description.includes('schedule') || description.includes('booking') || description.includes('appointment')) {
      tools.add('Calendly');
      tools.add('Acuity');
    }

    if (description.includes('payment') || description.includes('invoice')) {
      tools.add('Stripe');
      tools.add('Square');
    }

    if (description.includes('email') || description.includes('newsletter')) {
      tools.add('Mailchimp');
      tools.add('ConvertKit');
    }

    if (description.includes('chat') || description.includes('support')) {
      tools.add('Intercom');
      tools.add('Crisp');
    }

    if (description.includes('crm') || description.includes('customer')) {
      tools.add('HubSpot');
      tools.add('Salesforce');
    }

    // Add some common tools based on difficulty
    if (recommendation.difficulty === 'Easy') {
      tools.add('Google Workspace');
    }

    if (recommendation.difficulty === 'Advanced') {
      tools.add('Custom API');
    }

    return Array.from(tools);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConnectClick = () => {
    setShowConsultationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm sm:max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 sm:mb-6" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4"
          >
            Analyzing your business...
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-secondary mb-6 sm:mb-8 text-sm sm:text-base"
          >
            Our AI is generating personalized recommendations for you.
          </motion.p>

          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.7 }}
            className="mb-6 sm:mb-8"
          >
            <ProgressTracker steps={progressSteps} currentStep={currentStep} />
          </motion.div>

          {/* Animated Progress Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <AnimatedProgressBar progress={progress} />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm sm:max-w-md w-full"
        >
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-red-600 text-2xl sm:text-3xl">⚠️</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">Something went wrong</h2>
          <p className="text-secondary mb-6 sm:mb-8 text-sm sm:text-base">{error}</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={() => router.push('/')}
              variant="primary"
              className="px-6 sm:px-8 py-3 rounded-xl shadow-lg w-full sm:w-auto"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Try Again
            </Button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Enhanced Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-primary/80 backdrop-blur-md border-b border-primary sticky top-0 w-full z-50 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center border border-primary">
                <Lightbulb className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-semibold text-primary">BrighterBiz.ai</span>
            </motion.div>
            <div className="flex items-center gap-6">
              <ThemeToggle />
              <Button
                onClick={() => router.push('/')}
                variant="primary"
                size="md"
                className="rounded-lg flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                New Search
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-3 sm:mb-4 leading-tight">
          AI Recommendations for Your Business
        </h1>
        <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto">
          Tailored solutions to help your business grow and improve your results.
        </p>
      </motion.section>

      {/* Business Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-6 sm:mb-8 px-4"
      >
        <div className="bg-primary p-3 sm:p-4 rounded-xl border border-primary shadow-sm hover:shadow-md transition-all duration-300">
          {isStructuredData && formData ? (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
                  {formData.businessName}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {formData.businessType}
                  </span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {formData.companySize} employees
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {formData.monthlyRevenue}/month
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-primary">Primary Goals:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.primaryGoals.map((goal: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-tertiary text-secondary rounded text-xs">
                        {goal}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-primary">Focus Areas:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.focusAreas.map((area: string, index: number) => (
                      <span key={index} className="px-2 py-1 bg-tertiary text-secondary rounded text-xs">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="font-medium text-primary">Budget:</span>
                  <span className="ml-2 text-secondary">{formData.budget}/month</span>
                </div>

                <div>
                  <span className="font-medium text-primary">Timeline:</span>
                  <span className="ml-2 text-secondary">{formData.timeline}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-primary">
                <p className="text-secondary text-sm italic">
                  "{formData.businessDescription}"
                </p>
              </div>
            </div>
          ) : (
            <p className="text-primary text-sm sm:text-base font-semibold text-center break-words">
              Your Business: <span className="text-blue-600">"{businessDescription}"</span>
            </p>
          )}
        </div>
      </motion.div>

      {/* Results Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {sortRecommendationsByDifficulty(recommendations).map((recommendation, index) => {
            const Icon = getRecommendationIcon(recommendation);
            const difficultyConfig = getDifficultyConfig(recommendation.difficulty);
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="h-full"
              >
                <Card className="bg-primary p-6 rounded-xl border border-primary hover:border-secondary hover:shadow-md transition-all duration-200 flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-tertiary rounded-lg flex items-center justify-center text-secondary flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-primary leading-tight">
                        {recommendation.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${getCategoryColor(recommendation.category)}`}
                    >
                      {recommendation.category}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="flex-grow">
                    <p className="text-sm text-secondary mb-4 leading-relaxed">
                      {recommendation.description}
                    </p>
                  </div>

                  {/* Suggested Tools */}
                  <div className="mb-4">
                    <span className="text-xs font-medium text-tertiary block mb-2">Suggested Tools</span>
                    <div className="flex flex-wrap gap-2">
                      {getSuggestedTools(recommendation).map((tool, toolIndex) => (
                        <span
                          key={toolIndex}
                          className="px-2 py-1 bg-tertiary text-secondary text-xs rounded-md font-medium hover:bg-hover transition-colors"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="mt-auto pt-4 border-t border-primary flex items-center gap-4 text-xs text-tertiary">
                    <span className="flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5" />
                      <span
                        className={`inline-flex items-center gap-1 font-medium rounded-md px-2 py-0.5 ${difficultyConfig.bg} ${difficultyConfig.text}`}
                        aria-label={difficultyConfig.label}
                      >
                        <span aria-hidden="true">{difficultyConfig.icon}</span>
                        {recommendation.difficulty}
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-medium text-primary">{recommendation.timeToImplement}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span className="font-medium text-primary">{recommendation.estimatedCost}</span>
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Connect with Me Section */}
        <ConnectWithMeSection onConnectClick={handleConnectClick} />
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-primary border-t border-primary py-12 mt-16 sm:mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            {/* Logo */}
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center border border-primary">
                <Lightbulb className="w-5 h-5 text-white dark:text-black" />
              </div>
              <span className="text-xl font-semibold text-primary">BrighterBiz.ai</span>
            </motion.div>

            {/* Copyright */}
            <p className="text-secondary text-sm">
              © 2025 BrighterBiz.ai. Making AI accessible for small business.
            </p>
          </div>
        </div>
      </motion.footer>

      {/* Floating Connect Button */}
      <FloatingConnectButton onConnectClick={handleConnectClick} />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 bg-black dark:bg-white text-white dark:text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center border border-primary"
          title="Scroll to top"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>
      </AnimatePresence>

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        businessDescription={businessDescription}
        recommendations={recommendations}
      />
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm sm:max-w-md w-full"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-500 mx-auto mb-4 sm:mb-6" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">
            Loading...
          </h2>
        </motion.div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
} 