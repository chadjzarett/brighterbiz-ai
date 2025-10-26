'use client';

import { useState } from 'react';
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

// Simplified form validation schema for home page
const consultationFormSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  businessName: z.string().optional(),
  message: z.string().optional(),
});

type ConsultationFormData = z.infer<typeof consultationFormSchema>;

interface HomePageConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HomePageConsultationModal({
  isOpen,
  onClose,
}: HomePageConsultationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ConsultationFormData>({
    resolver: zodResolver(consultationFormSchema),
  });

  const onSubmit = async (data: ConsultationFormData) => {
    setIsSubmitting(true);
    
    try {
      // Prepare simplified payload for home page
      const payload = {
        contactInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone || '',
          preferredContactMethod: 'email' as const,
        },
        businessInfo: {
          businessName: data.businessName || '',
          businessDescription: data.message || '',
          website: '',
          companySize: '',
          industry: '',
        },
        projectDetails: {
          selectedRecommendations: [],
          timeline: '',
          budget: '',
          biggestChallenge: data.message || '',
        },
        metadata: {
          source: 'home-page',
          timestamp: new Date().toISOString(),
          sessionId: Math.random().toString(36).substr(2, 9),
        },
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
        throw new Error('Failed to submit consultation request');
      }

      setShowSuccess(true);
      setIsSubmitting(false);
      
      // Reset form and close modal after 3 seconds
      setTimeout(() => {
        reset();
        setShowSuccess(false);
        onClose();
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="w-16 h-16 bg-success-bg rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-accent-success" />
            </div>
            <h3 className="text-2xl font-semibold text-primary mb-3">
              Thanks! We'll Be In Touch Soon
            </h3>
            <p className="text-secondary max-w-md leading-relaxed">
              We've received your consultation request and will reach out within 24-48 hours.
            </p>
          </div>
        ) : (
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
                    className="bg-tertiary border-primary"
                    placeholder="John"
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
                    className="bg-tertiary border-primary"
                    placeholder="Doe"
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
                  type="email"
                  {...register('email')}
                  className="bg-tertiary border-primary"
                  placeholder="john@example.com"
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
                  type="tel"
                  {...register('phone')}
                  className="bg-tertiary border-primary"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary">Business Information</h3>

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-secondary mb-2">
                  Business Name
                  <span className="text-tertiary font-normal"> (optional)</span>
                </label>
                <Input
                  id="businessName"
                  {...register('businessName')}
                  className="bg-tertiary border-primary"
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">
                  Tell us about your business or what you'd like help with
                </label>
                <Textarea
                  id="message"
                  {...register('message')}
                  className="bg-tertiary border-primary min-h-[100px] resize-none"
                  placeholder="Describe your business and what you'd like to learn about..."
                />
              </div>
            </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-10 bg-primary border-t border-primary px-6 py-4 rounded-b-2xl">
              <p className="text-xs text-secondary mb-3">
                We respect your privacy. Your information is only used to prepare for our consultation.
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
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
        )}
      </DialogContent>
    </Dialog>
  );
}
