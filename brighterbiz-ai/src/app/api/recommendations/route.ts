import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Recommendation {
  id: number;
  title: string;
  description: string;
  category: string;
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

export async function POST(request: NextRequest) {
  try {
    const { businessDescription, structured, formData } = await request.json();

    if (!businessDescription || businessDescription.trim().length === 0) {
      return NextResponse.json(
        { error: 'Business description is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    // Generate AI recommendations based on data type
    const recommendations = structured && formData 
      ? await generateAdvancedRecommendations(businessDescription.trim(), formData)
      : await generateRecommendations(businessDescription.trim());

    return NextResponse.json({
      recommendations,
      businessDescription: businessDescription.trim()
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'Invalid OpenAI API key. Please check your configuration.' },
          { status: 401 }
        );
      }
      if (error.message.includes('quota')) {
        return NextResponse.json(
          { error: 'OpenAI API quota exceeded. Please check your usage limits.' },
          { status: 429 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    );
  }
}

async function generateRecommendations(businessDescription: string): Promise<Recommendation[]> {
  const prompt = `You are an AI business consultant specializing in practical AI implementations for small businesses like data entry, lead generation, marketing, social media, customer service, etc.

Business Description: "${businessDescription}"

Based on this business description, provide exactly 3-4 specific, actionable AI use case or AI automation ideas that would genuinely benefit this particular business.  AI use cases are specific AI implementations that would benefit the business, while AI automation ideas are ideas for automating business processes.

For each recommendation, provide:
1. A clear, descriptive title (max 6 words)
2. A practical description of how it works and benefits THIS specific business (2-3 sentences)
3. A category from: Customer Service, Marketing, Operations, Analytics, Automation, Content Creation, Sales, Finance, HR & Hiring, Legal & Compliance, Productivity, E-commerce, Customer Insights, or IT & Security.  AI use cases are in the category of Customer Service, Marketing, Operations, Analytics, Content Creation, Sales, Finance, HR & Hiring, Legal & Compliance, Productivity, E-commerce, Customer Insights, or IT & Security.  AI automation ideas are in the category of Automation like data entry, customer service, etc.
4. Difficulty level: Easy, Medium, or Advanced
5. Monthly cost estimate in format "$X-Y/month" (be realistic for small businesses)
6. Time to implement in format "X-Y weeks"

Focus on:
- Solutions that are actually implementable with current technology and are not too complex for small businesses to implement.
- Clear, measurable business value for THIS specific business type. 
- Appropriate for small business budgets ($20-500/month range)
- Industry-specific recommendations, not generic suggestions. 
- Prioritize Easy and Medium difficulty solutions
- IMPORTANT: If the business takes phone calls, customer service calls, appointments, or handles phone-based interactions, ALWAYS prioritize recommending both: (1) A chatbot for website/messaging support, and (2) A voice agent/AI phone system that can handle calls 24/7 outside business hours

Return ONLY a valid JSON array with no additional text or formatting. Each object should have exactly these fields: title, description, category, difficulty, estimatedCost, timeToImplement.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model for this use case
      messages: [
        {
          role: "system",
          content: "You are a helpful AI business consultant focused on practical, implementable AI solutions and automation ideas for small businesses. For phone-based businesses, always prioritize chatbot and voice agent recommendations. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    let recommendations: Omit<Recommendation, 'id'>[];
    try {
      recommendations = JSON.parse(content);
    } catch {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Add IDs and validate the structure
    const validatedRecommendations: Recommendation[] = recommendations
      .filter(rec => 
        rec.title && rec.description && rec.category && 
        rec.difficulty && rec.estimatedCost && rec.timeToImplement
      )
      .slice(0, 4) // Ensure max 4 recommendations
      .map((rec, index) => ({
        id: index + 1,
        ...rec
      }));

    if (validatedRecommendations.length === 0) {
      throw new Error('No valid recommendations generated');
    }

    return validatedRecommendations;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

async function generateAdvancedRecommendations(businessDescription: string, formData: FormData): Promise<Recommendation[]> {
  const prompt = `You are an AI business consultant specializing in practical AI implementations for small businesses.

Business Information:
- Business Name: ${formData.businessName}
- Type: ${formData.businessType}
- Description: ${formData.businessDescription}
- Company Size: ${formData.companySize} employees
- Monthly Revenue: ${formData.monthlyRevenue}
- Years in Business: ${formData.yearsInBusiness}
- Primary Goals: ${formData.primaryGoals.join(', ')}
- Current Challenges: ${formData.currentChallenges.join(', ')}
- Technical Comfort Level: ${formData.techComfort}
- Budget: ${formData.budget}/month for AI tools
- Implementation Timeline: ${formData.timeline}
- Focus Areas: ${formData.focusAreas.join(', ')}
${formData.additionalInfo ? `- Additional Info: ${formData.additionalInfo}` : ''}

Based on this detailed business profile, provide exactly 4-5 highly specific, actionable AI use case recommendations or automation ideas that would genuinely benefit this particular business.  AI use cases are specific AI implementations that would benefit the business like chatbots, customer service, etc., while AI automation ideas are ideas for automating business processes like data entry, customer service, etc.

Focus on:
- Solutions that directly address their stated goals and challenges.
- Match their technical comfort level (${formData.techComfort})
- Stay within their budget range (${formData.budget}/month)
- Align with their timeline (${formData.timeline})
- Prioritize their selected focus areas: ${formData.focusAreas.join(', ')}
- Consider their business type (${formData.businessType}) and size (${formData.companySize})
- IMPORTANT: If the business takes phone calls, customer service calls, appointments, or handles phone-based interactions, ALWAYS prioritize recommending both: (1) A chatbot for website/messaging support, and (2) A voice agent/AI phone system that can handle calls 24/7 outside business hours

For each recommendation, provide:
1. A clear, descriptive title (max 6 words)
2. A practical description of how it works and benefits THIS specific business (2-3 sentences)
3. A category from: Customer Service, Marketing, Operations, Analytics, Automation, Content Creation, Sales, Finance, HR & Hiring, Legal & Compliance, Productivity, E-commerce, Customer Insights, or IT & Security.  AI use cases are in the category of Customer Service, Marketing, Operations, Analytics, Content Creation, Sales, Finance, HR & Hiring, Legal & Compliance, Productivity, E-commerce, Customer Insights, or IT & Security.  AI automation ideas are in the category of Automation.
4. Difficulty level: Easy, Medium, or Advanced (match their tech comfort: ${formData.techComfort})
5. Monthly cost estimate in format "$X-Y/month" (stay within their budget: ${formData.budget})
6. Time to implement in format "X-Y weeks" (align with their timeline: ${formData.timeline})

Return ONLY a valid JSON array with no additional text or formatting. Each object should have exactly these fields: title, description, category, difficulty, estimatedCost, timeToImplement.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI business consultant focused on practical, implementable AI solutions and automation ideas for small businesses. For phone-based businesses, always prioritize chatbot and voice agent recommendations. Always respond with valid JSON only.  AI use cases are specific AI implementations that would benefit the business, while AI automation ideas are ideas for automating business processes."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('Empty response from OpenAI');
    }

    // Parse the JSON response
    let recommendations: Omit<Recommendation, 'id'>[];
    try {
      recommendations = JSON.parse(content);
    } catch {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Add IDs and validate the structure
    const validatedRecommendations: Recommendation[] = recommendations
      .filter(rec => 
        rec.title && rec.description && rec.category && 
        rec.difficulty && rec.estimatedCost && rec.timeToImplement
      )
      .slice(0, 5) // Ensure max 5 recommendations for advanced form
      .map((rec, index) => ({
        id: index + 1,
        ...rec
      }));

    if (validatedRecommendations.length === 0) {
      throw new Error('No valid recommendations generated');
    }

    return validatedRecommendations;

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
} 