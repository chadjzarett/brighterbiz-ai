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
import { CheckCircle2, Loader2, X } from 'lucide-react';

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-primary border border-primary rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-primary">
            Schedule Your Free Consultation
          </DialogTitle>
          <DialogDescription className="text-secondary">
            Get personalized help implementing AI in your business
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
            <h3 className="text-2xl font-semibold text-primary mb-2">
              Thanks! We'll Be In Touch Soon
            </h3>
            <p className="text-secondary max-w-md">
              We've received your consultation request and will reach out within 24-48 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-primary pb-2">
                Contact Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-primary mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="firstName"
                    {...register('firstName')}
                    className="bg-tertiary border-primary"
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-primary mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="lastName"
                    {...register('lastName')}
                    className="bg-tertiary border-primary"
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-primary mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="bg-tertiary border-primary"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-primary mb-1">
                  Phone (Optional)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="bg-tertiary border-primary"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-primary pb-2">
                Business Information
              </h3>

              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-primary mb-1">
                  Business Name (Optional)
                </label>
                <Input
                  id="businessName"
                  {...register('businessName')}
                  className="bg-tertiary border-primary"
                  placeholder="Acme Inc."
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-primary mb-1">
                  Tell us about your business or what you'd like help with
                </label>
                <Textarea
                  id="message"
                  {...register('message')}
                  className="bg-tertiary border-primary min-h-[100px]"
                  placeholder="Describe your business and what you'd like to learn about..."
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4 border-t border-primary">
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
                  'Request Consultation'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
