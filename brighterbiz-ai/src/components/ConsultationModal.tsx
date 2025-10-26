'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle2, Loader2 } from 'lucide-react';

// Form validation schema
const consultationFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  preferredContactMethod: z.enum(['email', 'phone']),
  businessName: z.string().optional(),
  website: z.string().url('Please enter a valid website URL').optional().or(z.literal('')),
  companySize: z.string().optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  biggestChallenge: z.string().optional(),
  selectedRecommendations: z.array(z.string()).min(1, 'Please select at least one recommendation'),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedCost: string;
  timeToImplement: string;
}

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessDescription: string;
  recommendations: Recommendation[];
}

export default function ConsultationModal({
  isOpen,
  onClose,
  businessDescription,
  recommendations
}: ConsultationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
    defaultValues: {
      selectedRecommendations: recommendations.map(r => r.title), // Default: all recommendations selected
      preferredContactMethod: 'email' as const, // Default to email
    }
  });

  const selectedRecommendations = watch('selectedRecommendations') || [];
  const firstName = watch('firstName');
  const lastName = watch('lastName');
  const email = watch('email');

  // Check if all required fields are filled
  const isFormValid = firstName && lastName && email && selectedRecommendations.length > 0;

  const handleRecommendationToggle = (title: string) => {
    const current = selectedRecommendations;
    const updated = current.includes(title)
      ? current.filter((t: string) => t !== title)
      : [...current, title];
    setValue('selectedRecommendations', updated);
  };

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    setSubmitError(null); // Clear any previous errors
    
    try {
      // Prepare the payload as specified in the MVP
      const payload = {
        contactInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          preferredContactMethod: data.preferredContactMethod
        },
        businessInfo: {
          businessName: data.businessName || '',
          website: data.website || '',
          businessDescription: businessDescription,
          companySize: data.companySize || '',
          industry: '' // Will be inferred by AI
        },
        projectDetails: {
          selectedRecommendations: data.selectedRecommendations,
          timeline: data.timeline || '',
          budget: data.budget || '',
          biggestChallenge: data.biggestChallenge || ''
        },
        metadata: {
          source: 'results-page',
          timestamp: new Date().toISOString(),
          sessionId: Math.random().toString(36).substr(2, 9),
          originalRecommendations: recommendations.filter(r => 
            data.selectedRecommendations.includes(r.title)
          )
        }
      };

      // Call the API endpoint
      const response = await fetch('/api/consultation-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit consultation request');
      }

      const result = await response.json();
      console.log('Consultation request submitted successfully:', result);
      
      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Reset form after successful submission
      setTimeout(() => {
        reset();
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit consultation request. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setShowSuccess(false);
      setSubmitError(null);
      onClose();
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md bg-primary border border-primary rounded-2xl shadow-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-accent-success" />
            </motion.div>
            <h3 className="text-2xl font-semibold text-primary mb-3">
              Thanks! We'll Be In Touch Soon
            </h3>
            <p className="text-secondary mb-6 leading-relaxed">
              We&apos;ve received your consultation request and our AI is already analyzing your business needs.
              Expect a personalized follow-up within 24-48 hours with:
            </p>
            <div className="text-left space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary">Custom implementation roadmap for your selected AI solutions</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary">Specific tool recommendations based on your budget and timeline</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-accent-success mt-0.5 flex-shrink-0" />
                <span className="text-sm text-primary">Next steps to get started with the highest-impact recommendations</span>
              </div>
            </div>
            <p className="text-sm text-secondary mb-6">
              Check your email for confirmation details.
            </p>
            <Button
              onClick={handleClose}
              variant="primary"
              className="w-full"
            >
              Continue Exploring
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-primary border border-primary rounded-2xl shadow-xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-primary border-b border-primary px-6 py-4 rounded-t-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-primary">
              Schedule Your Free Consultation
            </DialogTitle>
            <DialogDescription className="text-sm text-secondary mt-1">
              Get personalized help implementing AI in your business
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-secondary mb-2">
                  First Name <span className="text-accent-error">*</span>
                </label>
                <Input
                  id="firstName"
                  {...register('firstName')}
                  placeholder="John"
                  className="bg-tertiary border-primary"
                  aria-invalid={!!errors.firstName}
                  aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                />
                {errors.firstName && (
                  <p id="firstName-error" role="alert" className="text-accent-error text-xs mt-2">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-secondary mb-2">
                  Last Name <span className="text-accent-error">*</span>
                </label>
                <Input
                  id="lastName"
                  {...register('lastName')}
                  placeholder="Doe"
                  className="bg-tertiary border-primary"
                  aria-invalid={!!errors.lastName}
                  aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                />
                {errors.lastName && (
                  <p id="lastName-error" role="alert" className="text-accent-error text-xs mt-2">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">
                Email Address <span className="text-accent-error">*</span>
              </label>
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className="bg-tertiary border-primary"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" role="alert" className="text-accent-error text-xs mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-secondary mb-2">
                Phone Number
                <span className="text-tertiary font-normal"> (optional)</span>
              </label>
              <Input
                id="phone"
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="bg-tertiary border-primary"
              />
            </div>
            <div>
              <label htmlFor="preferredContactMethod" className="block text-sm font-medium text-secondary mb-2">
                Preferred Contact Method
              </label>
              <select
                id="preferredContactMethod"
                {...register('preferredContactMethod')}
                className="w-full h-10 px-3 py-2 text-sm border border-primary bg-tertiary text-primary rounded-lg focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">Business Information</h3>
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-secondary mb-2">
                Business/Company Name
              </label>
              <Input
                id="businessName"
                {...register('businessName')}
                placeholder="Your Business Name"
                className="bg-tertiary border-primary"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-secondary mb-2">
                Website URL
              </label>
              <Input
                id="website"
                {...register('website')}
                type="url"
                placeholder="https://yourwebsite.com"
                className="bg-tertiary border-primary"
                aria-invalid={!!errors.website}
                aria-describedby={errors.website ? 'website-error' : undefined}
              />
              {errors.website && (
                <p id="website-error" role="alert" className="text-accent-error text-xs mt-2">
                  {errors.website.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="companySize" className="block text-sm font-medium text-secondary mb-2">
                  Company Size
                </label>
                <select
                  id="companySize"
                  {...register('companySize')}
                  className="w-full h-10 px-3 py-2 text-sm border border-primary bg-tertiary text-primary rounded-lg focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                >
                  <option value="">Select size</option>
                  <option value="1-5">1-5 employees</option>
                  <option value="6-25">6-25 employees</option>
                  <option value="26-100">26-100 employees</option>
                  <option value="100+">100+ employees</option>
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-secondary mb-2">
                  Implementation Timeline
                </label>
                <select
                  id="timeline"
                  {...register('timeline')}
                  className="w-full h-10 px-3 py-2 text-sm border border-primary bg-tertiary text-primary rounded-lg focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                >
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="6+ months">6+ months</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-secondary mb-2">
                Budget Range
              </label>
              <select
                id="budget"
                {...register('budget')}
                className="w-full h-10 px-3 py-2 text-sm border border-primary bg-tertiary text-primary rounded-lg focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              >
                <option value="">Select budget</option>
                <option value="<$250">Less than $250</option>
                <option value="$250-500">$250 - $500</option>
                <option value="$500-1000">$500 - $1,000</option>
                <option value="$1000+">$1,000 or more</option>
                <option value="Let's discuss">Let's discuss</option>
              </select>
            </div>
            <div>
              <label htmlFor="biggestChallenge" className="block text-sm font-medium text-secondary mb-2">
                Biggest Challenge
                <span className="text-tertiary font-normal"> (optional)</span>
              </label>
              <Textarea
                id="biggestChallenge"
                {...register('biggestChallenge')}
                placeholder="Describe your biggest business challenge..."
                className="min-h-20 bg-tertiary border-primary resize-none"
              />
            </div>
          </div>

          {/* Selected Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">
              Selected Recommendations
            </h3>
            <p className="text-sm text-secondary">
              Choose which recommendations you&apos;d like to discuss:
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start space-x-3 p-3 bg-tertiary border border-primary rounded-lg hover:border-secondary transition-colors duration-200">
                  <input
                    type="checkbox"
                    id={`rec-${rec.id}`}
                    checked={selectedRecommendations.includes(rec.title)}
                    onChange={() => handleRecommendationToggle(rec.title)}
                    className="mt-1 h-4 w-4 text-accent-primary border-primary rounded focus:ring-2 focus:ring-blue-500/50"
                  />
                  <label htmlFor={`rec-${rec.id}`} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium text-primary">{rec.title}</div>
                    <div className="text-xs text-secondary mt-1">{rec.category} • {rec.difficulty}</div>
                  </label>
                </div>
              ))}
            </div>
            {errors.selectedRecommendations && (
              <p role="alert" className="text-accent-error text-xs mt-2">
                {errors.selectedRecommendations.message}
              </p>
            )}
          </div>
          </div>

          {/* Sticky Footer with CTA */}
          <div className="sticky bottom-0 z-10 bg-primary border-t border-primary px-6 py-4 rounded-b-2xl">
            <p className="text-xs text-secondary mb-3">
              We respect your privacy. Your information is only used to prepare for our consultation.
            </p>

            {/* Error Message */}
            {submitError && (
              <div className="bg-error-bg border border-accent-error/20 rounded-lg p-3 mb-3">
                <p className="text-error-text text-sm font-medium">
                  {submitError}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isFormValid}
                variant="primary"
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Schedule Consultation'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 