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
          phone: data.phone || ''
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
        <DialogContent className="sm:max-w-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Thanks! We'll Be In Touch Soon
            </h3>
            <p className="text-gray-600 mb-6">
              We&apos;ve received your consultation request and our AI is already analyzing your business needs. 
              Expect a personalized follow-up within 24-48 hours with:
            </p>
            <div className="text-left space-y-2 mb-6">
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Custom implementation roadmap for your selected AI solutions</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Specific tool recommendations based on your budget and timeline</span>
              </div>
              <div className="flex items-start space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">Next steps to get started with the highest-impact recommendations</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Check your email for confirmation details.
            </p>
            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        <div className="p-6 pb-0">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Let&apos;s Discuss Your AI Implementation
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Tell us about your business so we can provide the most relevant guidance
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-6 space-y-6">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <Input
                  {...register('firstName')}
                  placeholder="John"
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <Input
                  {...register('lastName')}
                  placeholder="Doe"
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="john@example.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
                <span className="text-gray-500 font-normal"> (for faster follow-up)</span>
              </label>
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          {/* Business Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business/Company Name
              </label>
              <Input
                {...register('businessName')}
                placeholder="Your Business Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website URL
              </label>
              <Input
                {...register('website')}
                type="url"
                placeholder="https://yourwebsite.com"
                className={errors.website ? 'border-red-500' : ''}
              />
              {errors.website && (
                <p className="text-red-500 text-xs mt-1">{errors.website.message}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Size
                </label>
                <select
                  {...register('companySize')}
                  className="w-full h-9 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select size</option>
                  <option value="1-5">1-5 employees</option>
                  <option value="6-25">6-25 employees</option>
                  <option value="26-100">26-100 employees</option>
                  <option value="100+">100+ employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Implementation Timeline
                </label>
                <select
                  {...register('timeline')}
                  className="w-full h-9 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Budget Range
              </label>
              <select
                {...register('budget')}
                className="w-full h-9 px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select budget</option>
                <option value="<$1K">Less than $1,000</option>
                <option value="$1-5K">$1,000 - $5,000</option>
                <option value="$5-15K">$5,000 - $15,000</option>
                <option value="$15K+">$15,000+</option>
                <option value="Let's discuss">Let's discuss</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Biggest Challenge
                <span className="text-gray-500 font-normal"> (What's your main business challenge?)</span>
              </label>
              <Textarea
                {...register('biggestChallenge')}
                placeholder="Describe your biggest business challenge..."
                className="min-h-20"
              />
            </div>
          </div>

          {/* Selected Recommendations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Selected Recommendations
            </h3>
            <p className="text-sm text-gray-600">
                              Choose which recommendations you&apos;d like to discuss:
            </p>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recommendations.map((rec) => (
                <div key={rec.id} className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id={`rec-${rec.id}`}
                    checked={selectedRecommendations.includes(rec.title)}
                    onChange={() => handleRecommendationToggle(rec.title)}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`rec-${rec.id}`} className="flex-1 cursor-pointer">
                    <div className="text-sm font-medium text-gray-900">{rec.title}</div>
                    <div className="text-xs text-gray-500">{rec.category} • {rec.difficulty}</div>
                  </label>
                </div>
              ))}
            </div>
            {errors.selectedRecommendations && (
              <p className="text-red-500 text-xs">{errors.selectedRecommendations.message}</p>
            )}
          </div>
          </div>

          {/* Sticky Footer with CTA */}
          <div className="border-t bg-white p-6 pt-4">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-800 font-medium">
                💡 Tip: Providing more details helps us prepare a more targeted consultation for you
              </p>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              We respect your privacy. Your information is only used to prepare for our consultation.
            </p>
            
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm font-medium">
                  {submitError}
                </p>
              </div>
            )}
            
            <Button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting Request...
                </>
              ) : !isFormValid ? (
                'Please fill required fields'
              ) : (
                'Request Free Consultation'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 