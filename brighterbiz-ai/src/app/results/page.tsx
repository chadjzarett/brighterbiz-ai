'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressTracker, AnimatedProgressBar } from '@/components/ProgressTracker';
import ConnectWithMeSection from '@/components/ConnectWithMeSection';
import FloatingConnectButton from '@/components/FloatingConnectButton';
import ConsultationModal from '@/components/ConsultationModal';
import {
  ArrowLeft, Clock, DollarSign, BarChart3, Loader2, Lightbulb, Mail, Megaphone,
  MessageCircle, Users, Settings, CalendarCheck, Instagram, CheckCircle2, ChevronUp
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

export default function ResultsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [businessDescription, setBusinessDescription] = useState('');
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
    if (!description) {
      router.push('/');
      return;
    }
    
    setBusinessDescription(description);
    fetchRecommendations(description);
  }, [searchParams, router]);

  const fetchRecommendations = async (description: string) => {
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

      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessDescription: description }),
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
    const colors = {
      'Customer Service': 'bg-green-100 text-green-700',
      'Marketing': 'bg-pink-100 text-pink-700',
      'Operations': 'bg-blue-100 text-blue-700',
      'Analytics': 'bg-purple-100 text-purple-700',
      'Automation': 'bg-orange-100 text-orange-700',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Easy': 'text-green-600 bg-green-100',
      'Medium': 'text-orange-600 bg-orange-100',
      'Advanced': 'text-red-600 bg-red-100',
    };
    return colors[difficulty as keyof typeof colors] || 'text-gray-600 bg-gray-100';
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
    if (title.match(/social|post|instagram/)) return Instagram;
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4"
          >
            Analyzing your business...
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">{error}</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 sm:px-8 py-3 rounded-xl shadow-lg w-full sm:w-auto"
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
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-effect border-b border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-semibold text-gray-900">BrighterBiz.ai</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="flex items-center space-x-1 sm:space-x-2 btn-premium text-xs sm:text-sm px-3 sm:px-4 py-2"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>New Search</span>
              </Button>
            </motion.div>
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
          AI Recommendations for Your Business
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
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
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-800 text-sm sm:text-base font-semibold text-center break-words">
            Your Business: <span className="text-blue-600">"{businessDescription}"</span>
          </p>
        </div>
      </motion.div>

      {/* Results Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          {sortRecommendationsByDifficulty(recommendations).map((recommendation, index) => {
            const Icon = getRecommendationIcon(recommendation);
            return (
              <motion.div
                key={recommendation.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Card className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border border-gray-200 card-hover flex flex-col h-full">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start mr-3 sm:mr-4 flex-1">
                        <motion.div 
                          className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </motion.div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                          {recommendation.title}
                        </h3>
                      </div>
                      <motion.span 
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getCategoryColor(recommendation.category)}`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {recommendation.category}
                      </motion.span>
                    </div>
                  </div>

                  {/* Card Body (flexible) */}
                  <div className="flex-grow">
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {recommendation.description}
                    </p>
                  </div>
                  
                  {/* Card Footer */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="min-h-[85px] sm:min-h-[85px]">
                      <div className="flex items-center text-sm mb-3">
                        <span className="text-gray-500 font-medium">Suggested Tools:</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {getSuggestedTools(recommendation).map((tool, toolIndex) => (
                          <motion.span
                            key={toolIndex}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: toolIndex * 0.05 }}
                            className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium hover:bg-gray-200 transition-colors"
                          >
                            {tool}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 text-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <BarChart3 className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-500 block text-xs font-medium mb-1">Difficulty</span>
                          <span className={`inline-flex items-center font-medium rounded-full px-3 py-1 text-xs ${getDifficultyColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <DollarSign className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-500 block text-xs font-medium mb-1">Est. Cost</span>
                          <span className="font-semibold text-gray-900 text-sm">{recommendation.estimatedCost}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-gray-500 block text-xs font-medium mb-1">Timeline</span>
                          <span className="font-semibold text-gray-900 text-sm">{recommendation.timeToImplement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Connect with Me Section */}
        <ConnectWithMeSection onConnectClick={handleConnectClick} />
      </main>

      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-900 py-8 sm:py-12 mt-16 sm:mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">BrighterBiz.ai</span>
            </motion.div>
            <p className="text-gray-400 text-xs sm:text-sm text-center">
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
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
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