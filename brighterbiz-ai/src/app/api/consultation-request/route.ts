import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for the consultation request payload
const consultationRequestSchema = z.object({
  contactInfo: z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    preferredContactMethod: z.enum(['email', 'phone']),
  }),
  businessInfo: z.object({
    businessName: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    businessDescription: z.string().min(1, 'Business description is required'),
    companySize: z.string().optional(),
    industry: z.string().optional(),
  }),
  projectDetails: z.object({
    selectedRecommendations: z.array(z.string()).min(1, 'At least one recommendation must be selected'),
    timeline: z.string().optional(),
    budget: z.string().optional(),
    biggestChallenge: z.string().optional(),
  }),
  metadata: z.object({
    source: z.string(),
    timestamp: z.string(),
    sessionId: z.string(),
    originalRecommendations: z.array(z.any()),
  }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    console.log('Received consultation request:', body);

    // Validate the payload
    const validationResult = consultationRequestSchema.safeParse(body);
    
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validationResult.error.errors 
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;
    console.log('Validated payload:', payload);

    // Call n8n webhook
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!n8nWebhookUrl) {
      throw new Error('N8N_WEBHOOK_URL environment variable is not set');
    }

    console.log('Calling n8n webhook with payload:', payload);
    
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!n8nResponse.ok) {
      throw new Error(`n8n webhook failed: ${n8nResponse.status} ${n8nResponse.statusText}`);
    }

    const n8nResult = await n8nResponse.json();
    console.log('n8n webhook response:', n8nResult);

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Consultation request submitted successfully',
      data: {
        submissionId: payload.metadata.sessionId,
        timestamp: payload.metadata.timestamp,
        email: payload.contactInfo.email,
        selectedRecommendations: payload.projectDetails.selectedRecommendations,
      }
    });

  } catch (error) {
    console.error('Error processing consultation request:', error);
    
    // Return error response
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: 'Failed to process consultation request. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
} 