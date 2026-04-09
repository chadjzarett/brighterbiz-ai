'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Sparkles, Camera, Utensils, Lightbulb, Star, Users, ArrowRight, Menu, X, Brain, Fingerprint, Zap, MessageCircle, Wrench } from 'lucide-react';
import { EnhancedForm } from '@/components/EnhancedForm';
import { SectionWrapper } from '@/components/SmoothNavigation';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import HomePageConsultationModal from '@/components/HomePageConsultationModal';
import Footer from '@/components/Footer';

export default function Home() {
  const [placeholderText, setPlaceholderText] = useState('');
  const [currentSuggestionIndex, setCurrentSuggestionIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const router = useRouter();

  const handleMobileNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    // Small delay to allow menu to close first, then scroll
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  };

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
    { id: 'examples', label: 'Examples', icon: <Users className="w-5 h-5" /> },
    { id: 'faq', label: 'FAQ', icon: <Brain className="w-5 h-5" /> }
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
    <div className="bg-primary min-h-screen">
      {/* Enhanced Floating Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      >
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/90 backdrop-blur-lg border border-primary rounded-full shadow-lg px-5 sm:px-6 lg:px-7">
            <div className="flex justify-between items-center py-2">
              {/* Logo */}
              <motion.button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2.5 cursor-pointer"
              >
                <div className="w-8 h-8 bg-black dark:bg-white rounded-full flex items-center justify-center">
                  <Lightbulb className="w-4.5 h-4.5 text-white dark:text-black" />
                </div>
                <span className="text-base font-semibold text-primary tracking-[-0.01em]">BrighterBiz.ai</span>
              </motion.button>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1">
                {navigationItems.slice(1).map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-secondary hover:text-primary transition-colors duration-200 text-sm font-medium px-3 py-1.5 rounded-full hover:bg-tertiary/60"
                  >
                    {item.label}
                  </a>
                ))}
                <div className="ml-1"><ThemeToggle /></div>
                <Button
                  onClick={scrollToInputField}
                  variant="primary"
                  size="sm"
                  className="rounded-full ml-1"
                >
                  Try For Free
                </Button>
              </nav>

              {/* Mobile Menu Button */}
              <div className="flex md:hidden items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-secondary hover:text-primary hover:bg-tertiary rounded-full transition-colors"
                  aria-label="Toggle menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden border-t border-primary overflow-hidden"
                >
                  <nav className="py-3 space-y-1 px-1">
                    {navigationItems.slice(1).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleMobileNavClick(item.id)}
                        className="block w-full text-left px-4 py-2.5 text-secondary hover:text-primary hover:bg-tertiary rounded-full transition-colors text-sm font-medium"
                      >
                        {item.label}
                      </button>
                    ))}
                    <div className="px-3 pt-2">
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          scrollToInputField();
                        }}
                        variant="primary"
                        size="sm"
                        className="w-full rounded-full"
                      >
                        Try For Free
                      </Button>
                    </div>
                  </nav>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <SectionWrapper id="hero" className="pt-24 md:pt-28 pb-8 md:pb-10 px-4 relative overflow-hidden">
        {/* Ambient floating gradient orbs */}
        <div className="absolute top-0 left-[8%] w-[28rem] h-[28rem] rounded-full bg-blue-500/[0.07] blur-[80px] hero-float pointer-events-none" aria-hidden="true" />
        <div className="absolute -bottom-32 right-[3%] w-[36rem] h-[36rem] rounded-full bg-violet-500/[0.05] blur-[100px] hero-float-reverse pointer-events-none" aria-hidden="true" />
        <div className="absolute top-[25%] right-[18%] w-[20rem] h-[20rem] rounded-full bg-amber-400/[0.04] blur-[60px] hero-float-slow pointer-events-none" aria-hidden="true" />

        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 0.5px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />

        <motion.div
          className="max-w-4xl mx-auto relative"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } }
          }}
        >
          {/* Social proof badge */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 8, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } }}
            className="flex justify-center mb-5"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-white/80 dark:bg-neutral-950/80 backdrop-blur-sm border border-primary pl-1.5 pr-5 py-1.5 shadow-sm">
              <div className="flex -space-x-2">
                {[
                  'bg-gradient-to-br from-blue-400 to-blue-600',
                  'bg-gradient-to-br from-violet-400 to-violet-600',
                  'bg-gradient-to-br from-amber-400 to-amber-600',
                  'bg-gradient-to-br from-emerald-400 to-emerald-600',
                ].map((gradient, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full ${gradient} border-2 border-white dark:border-neutral-900 shadow-sm`}
                  />
                ))}
              </div>
              <div className="h-4 w-px bg-tertiary" />
              <span className="text-sm text-secondary">
                Join <span className="text-primary font-semibold">2,400+</span> businesses growing with AI
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.7 }}
            className="text-center mb-4"
          >
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-[1.08] tracking-[-0.035em] font-hero">
              AI tools that could save
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary leading-[1.08] tracking-[-0.035em] font-hero">
              your business{' '}
              <span className="font-accent italic text-accent font-normal">thousands</span>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
            className="text-lg md:text-xl text-secondary text-center max-w-2xl mx-auto mb-8 leading-relaxed"
          >
            Describe your business in one sentence. Get a free, personalized AI roadmap
            with real tools, estimated savings, and step-by-step implementation guides.
          </motion.p>

          {/* Form card with interactive glow */}
          <motion.div
            id="hero-input-section"
            variants={{ hidden: { opacity: 0, y: 10, scale: 0.99 }, visible: { opacity: 1, y: 0, scale: 1 } }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto relative hero-form-wrapper"
          >
            <div
              className="absolute -inset-3 md:-inset-4 rounded-3xl pointer-events-none hero-form-glow"
              style={{
                background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(139,92,246,0.1), rgba(59,130,246,0.15))',
              }}
              aria-hidden="true"
            />
            <div className="relative bg-primary border border-primary rounded-2xl p-5 md:p-6 hero-form-card">
              <EnhancedForm
                onSubmit={handleGetRecommendations}
                placeholder={placeholderText || "e.g., I run a small bakery in downtown Portland"}
              />
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-6"
          >
            {['No signup required', 'No credit card', '100% free'].map((text) => (
              <div key={text} className="flex items-center gap-2 text-secondary">
                <div className="w-4 h-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats strip */}
          <motion.div
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-10 md:mt-12"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center">
              {[
                { value: '12,000+', label: 'Recommendations generated' },
                { value: '< 30s', label: 'To get your roadmap' },
                { value: '$41K', label: 'Avg. annual savings found' },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`text-center px-6 md:px-10 ${index > 0 ? 'mt-6 sm:mt-0 sm:border-l border-primary' : ''}`}
                >
                  <p className="text-2xl md:text-3xl font-extrabold text-primary font-hero tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-tertiary mt-1 font-medium uppercase tracking-[0.1em]">{stat.label}</p>
                </div>
              ))}
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
        </motion.div>
      </SectionWrapper>

      {/* Features Section */}
      <SectionWrapper id="features" className="py-24 bg-secondary relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 md:mb-20"
          >
            <p className="text-xs tracking-[0.2em] text-accent uppercase mb-3 font-semibold">How it works</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5 font-display tracking-[-0.02em]">
              Your AI roadmap in<br className="hidden sm:block" /> three simple steps
            </h2>
            <p className="text-lg text-secondary max-w-lg mx-auto leading-relaxed">
              No signup, no learning curve. Describe your business and get a personalized action plan in seconds.
            </p>
          </motion.div>

          {/* 3-Step Process */}
          <div className="grid md:grid-cols-3 gap-10 md:gap-6 mb-20 md:mb-24 relative">
            <div className="hidden md:block absolute top-[3.25rem] left-[20%] right-[20%] h-px border-t-2 border-dashed border-primary z-0" />

            {[
              {
                title: 'Describe your business',
                description: 'Tell us what you do in plain English. One sentence is all it takes.',
              },
              {
                title: 'AI does the analysis',
                description: 'We match your industry, size, and needs against hundreds of AI solutions.',
              },
              {
                title: 'Get your roadmap',
                description: 'Receive prioritized tools you can start using today, with costs and setup time.',
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="relative text-center group"
              >
                <div className="w-[6.5rem] h-[6.5rem] mx-auto mb-6 relative z-10">
                  <div className="absolute inset-0 rounded-2xl bg-accent/[0.07] rotate-[6deg]" />
                  <div className="relative w-full h-full rounded-2xl bg-primary border-2 border-primary flex items-center justify-center shadow-sm">
                    <span className="text-[2rem] font-extrabold text-accent font-display leading-none">{index + 1}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 font-display tracking-[-0.01em]">{step.title}</h3>
                <p className="text-secondary text-sm leading-relaxed max-w-[26ch] mx-auto">{step.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Bento Grid Section Label */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <p className="text-xs tracking-[0.2em] text-accent uppercase font-semibold">Why BrighterBiz</p>
          </motion.div>

          {/* Bento Grid Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Personalized */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-7 bg-primary rounded-2xl border border-primary p-8 relative overflow-hidden group hover:border-secondary transition-colors duration-300"
            >
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-accent/[0.04] -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <Fingerprint className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3 font-display tracking-[-0.01em]">Personalized, not generic</h3>
                <p className="text-secondary leading-relaxed max-w-[44ch]">
                  Every recommendation is shaped by your specific industry, business size, and goals. A bakery gets completely different advice than a law firm.
                </p>
              </div>
            </motion.div>

            {/* Speed stat */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="md:col-span-5 rounded-2xl p-8 relative overflow-hidden bg-black dark:bg-white text-white dark:text-black"
            >
              <div className="absolute top-4 right-4 w-24 h-24 rounded-full border border-white/10 dark:border-black/10" />
              <div className="absolute top-8 right-8 w-16 h-16 rounded-full border border-white/[0.06] dark:border-black/[0.06]" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white/15 dark:bg-black/10 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5" />
                </div>
                <p className="text-[3.5rem] font-extrabold font-display leading-none mb-2 tracking-tight">&lt; 30s</p>
                <p className="text-sm opacity-70 leading-relaxed">From business description to a complete, personalized AI roadmap.</p>
              </div>
            </motion.div>

            {/* Zero jargon */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="md:col-span-5 bg-primary rounded-2xl border border-primary p-8 group hover:border-secondary transition-colors duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3 font-display tracking-[-0.01em]">Zero jargon guaranteed</h3>
              <p className="text-secondary leading-relaxed max-w-[44ch]">
                Complex AI concepts translated into plain English. No tech background needed—if you can read an email, you can follow our advice.
              </p>
            </motion.div>

            {/* Actionable */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="md:col-span-7 bg-primary rounded-2xl border border-primary p-8 relative overflow-hidden group hover:border-secondary transition-colors duration-300"
            >
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-accent/[0.04] translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
                  <Wrench className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-primary mb-3 font-display tracking-[-0.01em]">Real tools, real steps</h3>
                <p className="text-secondary leading-relaxed max-w-[44ch]">
                  No vague &quot;use AI to improve efficiency.&quot; You get specific tools, estimated costs, setup time, and step-by-step implementation guidance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      {/* Examples Section */}
      <SectionWrapper id="examples" className="py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 25% 40%, rgb(var(--color-accent) / 0.03) 0%, transparent 55%), radial-gradient(ellipse at 75% 70%, rgb(var(--color-accent) / 0.02) 0%, transparent 50%)',
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <p className="text-xs tracking-[0.2em] text-accent uppercase mb-3 font-semibold">Real Results</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5 font-display tracking-[-0.02em]">
              Built for businesses<br className="hidden sm:block" /> like yours
            </h2>
            <p className="text-lg text-secondary max-w-lg mx-auto leading-relaxed">
              See what AI-powered growth looks like — with real tools, measurable savings, and step-by-step plans.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">

            {/* Featured Card — Bakery */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-7 group"
            >
              <div className="example-card h-full rounded-2xl border border-primary p-8 md:p-10 relative overflow-hidden hover:border-secondary transition-colors duration-300">
                <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/[0.04]" />
                <div className="absolute -bottom-20 -left-20 w-56 h-56 rounded-full bg-accent/[0.03]" />

                <div className="relative">
                  <div className="flex items-center gap-3.5 mb-7">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center ring-1 ring-amber-500/20">
                      <Sparkles className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-primary font-display tracking-[-0.01em]">Downtown Bakery</h3>
                      <p className="text-sm text-secondary">Portland, OR &middot; 12 employees</p>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-7">
                    {[
                      { tool: 'Inventory Forecasting AI', tag: 'Analytics', impact: 'Save $2,400/mo', setup: '2 hrs' },
                      { tool: 'Social Caption Generator', tag: 'Marketing', impact: '3x engagement', setup: '15 min' },
                      { tool: 'Smart Staff Scheduling', tag: 'Operations', impact: 'Save 8 hrs/wk', setup: '1 hr' },
                    ].map((rec, i) => (
                      <motion.div
                        key={rec.tool}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + i * 0.08, duration: 0.45 }}
                        className="flex items-center gap-4 bg-secondary/80 rounded-xl p-4 hover:bg-tertiary/80 transition-colors duration-300"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h4 className="font-semibold text-primary text-sm truncate">{rec.tool}</h4>
                            <span className="shrink-0 px-2 py-0.5 bg-accent/10 text-accent text-[11px] rounded-full font-medium">
                              {rec.tag}
                            </span>
                          </div>
                          <p className="text-xs text-tertiary">Setup: {rec.setup}</p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-accent">{rec.impact}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5 pt-5 border-t border-primary">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <p className="text-sm text-secondary">
                      Estimated annual savings: <span className="font-bold text-primary">$41,000+</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column — Stacked */}
            <div className="md:col-span-5 grid grid-cols-1 gap-4 md:gap-5">

              {/* Restaurant Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12, duration: 0.6 }}
                className="group"
              >
                <div className="example-card h-full rounded-2xl border border-primary p-7 relative overflow-hidden hover:border-secondary transition-colors duration-300">
                  <div className="absolute -top-14 -right-14 w-44 h-44 rounded-full bg-rose-500/[0.04]" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-rose-500/10 flex items-center justify-center ring-1 ring-rose-500/20">
                        <Utensils className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary font-display tracking-[-0.01em]">Italian Restaurant</h3>
                        <p className="text-xs text-secondary">Chicago, IL &middot; 8 employees</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { tool: 'AI Phone Ordering', impact: 'Never miss an order' },
                        { tool: 'Menu Optimization Engine', impact: '+22% avg ticket' },
                      ].map((rec) => (
                        <div key={rec.tool} className="flex items-center justify-between bg-secondary/80 rounded-lg px-4 py-3 hover:bg-tertiary/80 transition-colors duration-300">
                          <span className="text-sm font-medium text-primary">{rec.tool}</span>
                          <span className="text-xs font-bold text-accent whitespace-nowrap ml-3">{rec.impact}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-primary">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <p className="text-xs text-secondary">
                        Est. savings: <span className="font-bold text-primary">$28,000+/yr</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Photography Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.24, duration: 0.6 }}
                className="group"
              >
                <div className="example-card h-full rounded-2xl border border-primary p-7 relative overflow-hidden hover:border-secondary transition-colors duration-300">
                  <div className="absolute -bottom-14 -right-14 w-44 h-44 rounded-full bg-violet-500/[0.04]" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center ring-1 ring-violet-500/20">
                        <Camera className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary font-display tracking-[-0.01em]">Photo Studio</h3>
                        <p className="text-xs text-secondary">Austin, TX &middot; Solo owner</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[
                        { tool: 'AI Photo Enhancement', impact: '10x faster edits' },
                        { tool: 'Smart Booking Chatbot', impact: '24/7 bookings' },
                      ].map((rec) => (
                        <div key={rec.tool} className="flex items-center justify-between bg-secondary/80 rounded-lg px-4 py-3 hover:bg-tertiary/80 transition-colors duration-300">
                          <span className="text-sm font-medium text-primary">{rec.tool}</span>
                          <span className="text-xs font-bold text-accent whitespace-nowrap ml-3">{rec.impact}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5 mt-5 pt-4 border-t border-primary">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                      <p className="text-xs text-secondary">
                        Est. savings: <span className="font-bold text-primary">$19,000+/yr</span>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-14 md:mt-16 text-center"
          >
            <p className="text-secondary mb-5 text-base">
              These are just a few examples. <span className="text-primary font-medium">Every business gets a unique roadmap.</span>
            </p>
            <Button
              onClick={scrollToInputField}
              variant="primary"
              size="lg"
              className="rounded-xl group/cta"
            >
              Get Your Free AI Roadmap
              <ArrowRight className="w-4 h-4 ml-1 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
            </Button>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* FAQ Section */}
      <SectionWrapper id="faq" className="py-24 md:py-32 bg-secondary relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(var(--color-text-primary)) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
          aria-hidden="true"
        />
        <div className="absolute top-[10%] left-[5%] w-[24rem] h-[24rem] rounded-full bg-blue-500/[0.04] blur-[80px] pointer-events-none" aria-hidden="true" />
        <div className="absolute bottom-[5%] right-[8%] w-[20rem] h-[20rem] rounded-full bg-violet-500/[0.03] blur-[70px] pointer-events-none" aria-hidden="true" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14 md:mb-16"
          >
            <p className="text-xs tracking-[0.2em] text-accent uppercase mb-3 font-semibold">Support</p>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-5 font-display tracking-[-0.02em]">
              Frequently asked<br className="hidden sm:block" /> questions
            </h2>
            <p className="text-lg text-secondary max-w-lg mx-auto leading-relaxed">
              Everything you need to know about BrighterBiz.ai — and nothing you don&apos;t.
            </p>
          </motion.div>

          <Accordion>
            {[
              {
                question: "How does BrighterBiz.ai work?",
                answer: "Simply describe your business in plain English, and our AI analyzes your needs to provide personalized recommendations. Our system considers your industry, business model, and specific challenges to suggest practical AI solutions that you can implement today — even without technical expertise."
              },
              {
                question: "Is this really free?",
                answer: "Yes, completely free. No credit card, no hidden fees, no account required. We believe every business owner deserves access to AI insights that can help them grow."
              },
              {
                question: "What kind of recommendations will I get?",
                answer: "Tailored suggestions for your specific business — tools for automation, customer service, marketing, inventory management, and more. Each recommendation includes implementation difficulty, estimated cost, and setup time."
              },
              {
                question: "Do I need technical skills?",
                answer: "Not at all. We focus on easy-to-implement solutions that require minimal technical knowledge. Many are ready-to-use tools you can set up in minutes, with step-by-step guidance included."
              },
              {
                question: "Is my business information kept private?",
                answer: "Absolutely. We don't store your business description permanently and never sell your information. Your data is used solely to generate recommendations and is processed securely."
              },
              {
                question: "How fast do I get results?",
                answer: "Typically under 30 seconds. Describe your business, hit submit, and our AI generates your custom roadmap almost instantly."
              },
              {
                question: "Can I get help implementing the recommendations?",
                answer: null
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
              >
                <AccordionItem>
                  <AccordionTrigger
                    isOpen={openFaqIndex === index}
                    onToggle={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-semibold text-primary text-base md:text-lg font-display">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent isOpen={openFaqIndex === index}>
                    {faq.answer ?? (
                      <>
                        Yes! We offer free consultation sessions to discuss your AI solutions. Our team provides implementation guidance, helps you choose the best tools for your budget, and creates a custom roadmap.
                        <button
                          onClick={() => setShowConsultationModal(true)}
                          className="mt-3 inline-flex items-center gap-1.5 text-accent hover:opacity-80 font-medium transition-all duration-200 rounded-lg hover:bg-accent-muted px-2.5 py-1.5 -ml-2.5 text-sm"
                        >
                          Schedule a Free Consultation
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-3 rounded-full bg-primary border border-primary px-5 py-3 shadow-sm">
              <p className="text-secondary text-sm">
                Still have questions?
              </p>
              <button
                onClick={() => setShowConsultationModal(true)}
                className="text-accent hover:opacity-80 font-semibold transition-all duration-200 text-sm"
              >
                Talk to us &rarr;
              </button>
            </div>
          </motion.div>
        </div>
      </SectionWrapper>

      {/* CTA Section */}
      <SectionWrapper id="cta" className="relative overflow-hidden">
        <div className="bg-black dark:bg-white relative">
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-[-20%] left-[10%] w-[30rem] h-[30rem] rounded-full bg-blue-500/[0.08] blur-[100px]" />
            <div className="absolute bottom-[-30%] right-[15%] w-[25rem] h-[25rem] rounded-full bg-violet-500/[0.06] blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 0.5px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
            />
          </div>

          <div className="max-w-3xl mx-auto text-center px-4 py-24 md:py-32 relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } }
              }}
            >
              <motion.p
                variants={{ hidden: { opacity: 0, y: 6 }, visible: { opacity: 1, y: 0 } }}
                className="text-xs tracking-[0.2em] text-blue-400 dark:text-blue-600 uppercase mb-5 font-semibold"
              >
                Get started
              </motion.p>
              <motion.h2
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white dark:text-black mb-6 leading-[1.08] tracking-[-0.03em] font-hero"
              >
                Your AI roadmap is<br />
                <span className="font-accent italic font-normal text-blue-300 dark:text-blue-600">one sentence</span> away
              </motion.h2>
              <motion.p
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="text-base md:text-lg text-gray-400 dark:text-gray-500 mb-10 max-w-xl mx-auto leading-relaxed"
              >
                Join thousands of small business owners who are already using AI to save time, reduce costs, and grow faster.
              </motion.p>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <Button
                  onClick={scrollToInputField}
                  className="px-8 py-3.5 text-base text-black dark:text-white font-semibold rounded-xl bg-white dark:bg-black border border-white/20 dark:border-black/20 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300 shadow-lg shadow-white/10 dark:shadow-black/10 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center min-h-[48px] group/cta"
                >
                  Try For Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/cta:translate-x-0.5 transition-transform duration-200" />
                </Button>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8"
              >
                {['No signup required', 'Free forever', 'Results in 30s'].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                    <span className="text-sm">{text}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </SectionWrapper>

      <Footer />

      {/* Consultation Modal for Home Page */}
      <HomePageConsultationModal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
      />
    </div>
  );
}
