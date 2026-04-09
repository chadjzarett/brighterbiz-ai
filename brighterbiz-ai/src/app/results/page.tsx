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
import Footer from '@/components/Footer';
import {
  ArrowLeft, Clock, DollarSign, BarChart3, Loader2, Lightbulb, Mail, Megaphone,
  MessageCircle, Users, Settings, CalendarCheck, CheckCircle2, ChevronUp, Share2
} from 'lucide-react';

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  suggestedTools: string[];
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

  const getCategoryColor = () => {
    return 'bg-tertiary text-secondary';
  };

  const getDifficultyConfig = (difficulty: string) => {
    const configs = {
      'Easy': {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-700 dark:text-emerald-400',
        icon: '✓',
        label: 'Easy to implement'
      },
      'Medium': {
        bg: 'bg-amber-500/10',
        text: 'text-amber-700 dark:text-amber-400',
        icon: '◆',
        label: 'Moderate difficulty'
      },
      'Advanced': {
        bg: 'bg-red-500/10',
        text: 'text-red-600 dark:text-red-400',
        icon: '★',
        label: 'Advanced implementation'
      },
    };
    return configs[difficulty as keyof typeof configs] || {
      bg: 'bg-tertiary',
      text: 'text-secondary',
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
    // Use the AI-generated suggested tools from the recommendation
    return recommendation.suggestedTools || [];
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConnectClick = () => {
    setShowConsultationModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 relative overflow-hidden">
        {/* Ambient gradient orbs */}
        <div className="absolute top-[10%] left-[8%] w-[24rem] h-[24rem] rounded-full bg-blue-500/[0.05] blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[5%] right-[5%] w-[28rem] h-[28rem] rounded-full bg-violet-500/[0.04] blur-[90px] pointer-events-none" aria-hidden="true" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm sm:max-w-md w-full relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto mb-4 sm:mb-6" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 font-hero tracking-[-0.02em]"
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
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm sm:max-w-md w-full"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <span className="text-red-600 dark:text-red-400 text-2xl sm:text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 font-hero tracking-[-0.02em]">Something went wrong</h2>
          <p className="text-secondary mb-6 sm:mb-8 text-sm sm:text-base">{error}</p>
          <Button
            onClick={() => router.push('/')}
            variant="primary"
            className="px-6 sm:px-8 py-3 rounded-xl shadow-lg w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Floating Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/90 backdrop-blur-lg border border-primary rounded-full shadow-lg px-5 sm:px-6 lg:px-7">
            <div className="flex justify-between items-center py-2">
              <motion.button
                onClick={() => router.push('/')}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4.5 h-4.5 text-white dark:text-black" />
                </div>
                <span className="text-base font-semibold text-primary tracking-[-0.01em]">BrighterBiz.ai</span>
              </motion.button>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button
                  onClick={() => router.push('/')}
                  variant="primary"
                  size="sm"
                  className="rounded-full flex items-center gap-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  New Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center pt-24 md:pt-28 pb-6 sm:pb-8 px-4 relative overflow-hidden"
      >
        {/* Ambient gradient orbs */}
        <div className="absolute top-0 left-[8%] w-[20rem] h-[20rem] rounded-full bg-blue-500/[0.05] blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-16 right-[5%] w-[24rem] h-[24rem] rounded-full bg-violet-500/[0.04] blur-[90px] pointer-events-none" aria-hidden="true" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <div className="relative">
          <p className="text-xs tracking-[0.2em] text-accent uppercase mb-3 font-semibold">Your Results</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary mb-3 sm:mb-4 leading-[1.08] tracking-[-0.035em] font-hero">
            AI Recommendations for Your Business
          </h1>
          <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto leading-relaxed">
            Tailored solutions to help your business grow and improve your results.
          </p>
        </div>
      </motion.section>

      {/* Business Description */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-6 sm:mb-8 px-4"
      >
        <p className="text-xs tracking-[0.2em] text-accent uppercase font-semibold text-center mb-3">Your Business</p>
        <div className="bg-primary p-4 sm:p-5 rounded-2xl border border-primary shadow-sm hover:border-secondary transition-all duration-300">
          {isStructuredData && formData ? (
            <div className="space-y-3">
              <div className="text-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 font-display tracking-[-0.01em]">
                  {formData.businessName}
                </h3>
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                    {formData.businessType}
                  </span>
                  <span className="px-3 py-1 bg-tertiary text-secondary rounded-full text-xs font-medium">
                    {formData.companySize} employees
                  </span>
                  <span className="px-3 py-1 bg-tertiary text-secondary rounded-full text-xs font-medium">
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
              Your Business: <span className="text-accent">"{businessDescription}"</span>
            </p>
          )}
        </div>
      </motion.div>

      {/* Results Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative overflow-hidden">
        {/* Atmospheric background */}
        <div className="absolute top-[15%] right-[3%] w-[22rem] h-[22rem] rounded-full bg-blue-500/[0.04] blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[20%] left-[5%] w-[18rem] h-[18rem] rounded-full bg-violet-500/[0.03] blur-[70px] pointer-events-none" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 0.5px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
          aria-hidden="true"
        />
        {/* Section Label */}
        <div className="text-center mb-8 relative">
          <p className="text-xs tracking-[0.2em] text-accent uppercase font-semibold">Recommendations</p>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {sortRecommendationsByDifficulty(recommendations).map((recommendation, index) => {
            const Icon = getRecommendationIcon(recommendation);
            const difficultyConfig = getDifficultyConfig(recommendation.difficulty);
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="h-full"
              >
                <Card className="bg-primary p-6 rounded-2xl border border-primary hover:border-secondary transition-all duration-300 flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center text-accent flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-primary leading-tight font-display tracking-[-0.01em]">
                        {recommendation.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getCategoryColor()}`}
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
                          className="px-2.5 py-1 bg-tertiary text-secondary text-xs rounded-full font-medium hover:bg-hover transition-colors"
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
                        className={`inline-flex items-center gap-1 font-medium rounded-full px-2 py-0.5 ${difficultyConfig.bg} ${difficultyConfig.text}`}
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

      <Footer />

      {/* Floating Connect Button */}
      <FloatingConnectButton onConnectClick={handleConnectClick} />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          onClick={scrollToTop}
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
      <div className="min-h-screen bg-secondary flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-[10%] left-[8%] w-[24rem] h-[24rem] rounded-full bg-blue-500/[0.05] blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[5%] right-[5%] w-[28rem] h-[28rem] rounded-full bg-violet-500/[0.04] blur-[90px] pointer-events-none" aria-hidden="true" />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm sm:max-w-md w-full relative"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-accent mx-auto mb-4 sm:mb-6" />
          </motion.div>
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4 font-hero tracking-[-0.02em]">
            Analyzing your business...
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            Our AI is generating personalized recommendations for you.
          </p>
        </motion.div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
} 