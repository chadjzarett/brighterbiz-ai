'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { User, CheckCircle, Clock, Sparkles, Camera, Utensils, Lightbulb, Star, Users, ArrowRight } from 'lucide-react';
import { EnhancedForm } from '@/components/EnhancedForm';
import { SmoothNavigation, SectionWrapper } from '@/components/SmoothNavigation';
import { ProgressTracker } from '@/components/ProgressTracker';

export default function Home() {
  const [placeholderText, setPlaceholderText] = useState('');
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const businessSuggestions = useMemo(() => [
    'I run a small bakery in downtown Portland',
    'I own a coffee shop downtown',
    'I have a fitness studio',
    'I operate a dental practice',
    'I run an online boutique',
    'I own a restaurant',
    'I have a photography business',
    'I run a consulting firm'
  ], []);

  const progressSteps = [
    { id: 'input', label: 'Describe', description: 'Tell us about your business' },
    { id: 'analysis', label: 'Analyze', description: 'AI analyzes your needs' },
    { id: 'recommendations', label: 'Recommend', description: 'Get personalized solutions' }
  ];

  const navigationItems = [
    { id: 'hero', label: 'Home', icon: <Star className="w-5 h-5" /> },
    { id: 'features', label: 'Features', icon: <Star className="w-5 h-5" /> },
    { id: 'examples', label: 'Examples', icon: <Users className="w-5 h-5" /> }
  ];

  useEffect(() => {
    const currentSuggestion = businessSuggestions[currentSuggestionIndex];
    let charIndex = 0;
    
    const typeWriter = setInterval(() => {
      if (charIndex <= currentSuggestion.length) {
        setPlaceholderText(currentSuggestion.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeWriter);
        setTimeout(() => {
          setCurrentSuggestionIndex((prev) => (prev + 1) % businessSuggestions.length);
        }, 2000);
      }
    }, 100);

    return () => clearInterval(typeWriter);
  }, [currentSuggestionIndex, businessSuggestions]);

  const handleGetRecommendations = async (businessInput: string) => {
    // Simulate progress through steps
    setCurrentStep(1);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setCurrentStep(2);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const encodedBusiness = encodeURIComponent(businessInput.trim());
    router.push(`/results?business=${encodedBusiness}`);
  };



  const scrollToInputField = () => {
    const inputSection = document.querySelector('#hero-input-section');
    if (inputSection) {
      inputSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Enhanced Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="glass-effect fixed w-full z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-900">BrighterBiz.ai</span>
            </motion.div>
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.slice(1).map((item) => (
                <motion.a
                  key={item.id}
                  href={`#${item.id}`}
                  className="text-gray-600 hover:text-gray-900 transition-colors relative group"
                  whileHover={{ y: -2 }}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
              <Button
                onClick={scrollToInputField}
                className="rounded-full bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 text-sm font-semibold text-white transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:shadow-lg"
              >
                Try For Free
              </Button>
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <SectionWrapper id="hero" className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block mx-auto mb-6 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-1 shadow-sm hover-lift"
          >
            Powered by Advanced AI
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-none font-[family-name:var(--font-inter)]"
          >
            Free AI-powered recommendations <br/>
            <span className="gradient-text">tailored to grow your business</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-600 mb-12 max-w-xl mx-auto"
          >
            Instantly discover how AI can save you time, boost revenue, and simplify operations—no tech skills required.
          </motion.p>
          
          <motion.div 
            id="hero-input-section"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            {/* Form Content */}
            <EnhancedForm
              onSubmit={handleGetRecommendations}
              placeholder={placeholderText || "e.g., I run a small bakery in downtown Portland"}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6"
          >
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-sm font-medium">No account required</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-sm font-medium">No credit card needed</span>
            </div>
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-sm font-medium">100% Free</span>
            </div>
          </motion.div>

          {/* Progress Tracker */}
          <AnimatePresence>
            {currentStep > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-8 max-w-md mx-auto"
              >
                <ProgressTracker steps={progressSteps} currentStep={currentStep} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </SectionWrapper>

      {/* Features Section */}
      <SectionWrapper id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why BrighterBiz.ai?</h2>
            <p className="text-xl text-gray-600">AI recommendations that actually make sense for your business</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                icon: <User className="w-7 h-7 text-white" />,
                title: "Tailored",
                description: "Every recommendation is specifically designed for your industry and business model.",
                gradient: "from-indigo-500 to-purple-600"
              },
              {
                icon: <CheckCircle className="w-7 h-7 text-white" />,
                title: "Easy to Understand",
                description: "No tech jargon. Just clear, actionable advice you can implement today.",
                gradient: "from-cyan-500 to-blue-500"
              },
              {
                icon: <Clock className="w-7 h-7 text-white" />,
                title: "Actionable Insights",
                description: "Get specific tools and next steps, not just vague suggestions.",
                gradient: "from-emerald-500 to-teal-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card className="bg-white p-8 rounded-3xl text-center border border-gray-100 card-hover float-animation flex flex-col h-full">
                  <motion.div 
                    className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-full flex items-center justify-center mx-auto mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 flex-grow">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Examples Section */}
      <SectionWrapper id="examples" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See What's Possible</h2>
            <p className="text-xl text-gray-600">Real AI solutions for real businesses</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Sparkles className="w-5 h-5 text-gray-600" />,
                title: "Small Bakery",
                features: [
                  {
                    title: "Predict inventory needs",
                    description: "Use AI models to forecast sales and avoid waste.",
                    tag: "Analytics",
                    tagColor: "bg-blue-100 text-blue-700"
                  },
                  {
                    title: "Instagram caption generator",
                    description: "Use ChatGPT to write engaging social media captions.",
                    tag: "Marketing",
                    tagColor: "bg-pink-100 text-pink-700"
                  }
                ]
              },
              {
                icon: <Utensils className="w-5 h-5 text-gray-600" />,
                title: "Local Restaurant",
                features: [
                  {
                    title: "Voice assistant for orders",
                    description: "Allow phone-in customers to use an AI assistant.",
                    tag: "Customer Service",
                    tagColor: "bg-green-100 text-green-700"
                  },
                  {
                    title: "Menu optimization",
                    description: "Analyze sales data to optimize your menu offerings.",
                    tag: "Analytics",
                    tagColor: "bg-blue-100 text-blue-700"
                  }
                ]
              },
              {
                icon: <Camera className="w-5 h-5 text-gray-600" />,
                title: "Photography Studio",
                features: [
                  {
                    title: "Automated photo editing",
                    description: "Use AI to enhance and edit photos automatically.",
                    tag: "Automation",
                    tagColor: "bg-purple-100 text-purple-700"
                  },
                  {
                    title: "Client booking chatbot",
                    description: "Automate appointment scheduling with an AI assistant.",
                    tag: "Customer Service",
                    tagColor: "bg-green-100 text-green-700"
                  }
                ]
              }
            ].map((example, index) => (
              <motion.div
                key={example.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
              >
                <Card className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 card-hover">
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {example.icon}
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {example.features.map((feature, featureIndex) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: featureIndex * 0.1 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{feature.title}</h4>
                          <span className={`px-2 py-1 ${feature.tagColor} text-xs rounded-md font-medium`}>
                            {feature.tag}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper id="cta" className="py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center px-4 flex flex-col items-center justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-[2.5rem] md:text-[3.5rem] font-extrabold text-white mb-6 leading-tight"
          >
            Start for free today!<br />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Join thousands of small business owners who are already using AI to save<br />
            time, reduce costs, and grow faster.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              onClick={scrollToInputField}
              className="btn-premium px-7 py-3 text-base text-black font-semibold rounded-xl bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center min-h-[48px] mx-auto hover:-translate-y-1"
            >
              <span>Try For Free</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gray-900 py-8 sm:py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-white font-medium text-sm sm:text-base">BrighterBiz.ai</span>
            </motion.div>
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">© 2025 BrighterBiz.ai. Making AI accessible for small business.</p>
          </div>
        </div>
      </motion.footer>

      {/* Smooth Navigation */}
      <SmoothNavigation items={navigationItems} />
    </div>
  );
}
