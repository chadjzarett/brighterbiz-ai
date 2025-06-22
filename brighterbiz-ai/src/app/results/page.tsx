'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ProgressTracker, AnimatedProgressBar } from '@/components/ProgressTracker';
import {
  ArrowLeft, Clock, DollarSign, BarChart3, Loader2, Lightbulb, Calendar, Mail, Megaphone,
  MessageCircle, Users, Settings, CalendarCheck, Instagram, FileText, CheckCircle2, Star, ChevronUp
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
    const title = recommendation.title.toLowerCase();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-6" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Analyzing your business...
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 mb-8"
          >
            Our AI is generating personalized recommendations for you.
          </motion.p>

          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ delay: 0.7 }}
            className="mb-8"
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div 
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-red-600 text-3xl">⚠️</span>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={() => router.push('/')} 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">BrighterBiz.ai</span>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                onClick={() => router.push('/')}
                className="flex items-center space-x-2 btn-premium"
              >
                <ArrowLeft className="w-4 h-4" />
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
        className="max-w-4xl mx-auto text-center pt-12 pb-8 px-4"
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 whitespace-nowrap">
          AI Recommendations for Your Business
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tailored solutions to help your business grow and improve your results.
        </p>
      </motion.section>

      {/* Business Description */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto mb-8 px-4"
      >
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-800 text-base font-semibold text-center">
            Your Business: <span className="text-blue-600">"{businessDescription}"</span>
          </p>
        </div>
      </motion.div>

      {/* Results Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
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
                <Card className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 card-hover flex flex-col h-full">
                  {/* Card Header */}
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start mr-4 flex-1">
                        <motion.div 
                          className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0"
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="w-5 h-5 text-blue-600" />
                        </motion.div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {recommendation.title}
                        </h3>
                      </div>
                      <motion.span 
                        className={`px-3 py-1 rounded-full text-xs font-medium ml-2 whitespace-nowrap ${getCategoryColor(recommendation.category)}`}
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
                    <div className="min-h-[85px]">
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
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium hover:bg-gray-200 transition-colors"
                          >
                            {tool}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500 block text-xs">Difficulty</span>
                          <span className={`font-medium rounded-full px-2 py-1 text-xs ${getDifficultyColor(recommendation.difficulty)}`}>
                            {recommendation.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500 block text-xs">Est. Cost</span>
                          <span className="font-medium text-gray-900">{recommendation.estimatedCost}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <div>
                          <span className="text-gray-500 block text-xs">Timeline</span>
                          <span className="font-medium text-gray-900">{recommendation.timeToImplement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="bg-white p-10 rounded-3xl shadow-lg border border-gray-200 card-hover">
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg"
            >
              These recommendations are tailored specifically for your business. Consider starting with the "Easy" difficulty options to build momentum.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => router.push('/')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl shadow-lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Try Another Business
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline"
                  className="px-8 py-3 rounded-xl border-2 hover:bg-gray-50"
                  onClick={() => window.print()}
                >
                  <FileText className="w-5 h-5 mr-2" />
                  Save These Results
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </main>

      {/* Enhanced Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="bg-gray-900 py-12 mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-medium">BrighterBiz.ai</span>
            </motion.div>
            <p className="text-gray-400 text-sm">© 2025 BrighterBiz.ai. Making AI accessible for small business.</p>
          </div>
        </div>
      </motion.footer>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
          title="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </motion.button>
      </AnimatePresence>
    </div>
  );
} 