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

export async function POST(request: NextRequest) {
  try {
    const { businessDescription } = await request.json();

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

    // Generate AI recommendations
    const recommendations = await generateRecommendations(businessDescription.trim());

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
  const prompt = `You are an AI business consultant specializing in practical AI implementations for small businesses.

Business Description: "${businessDescription}"

Based on this business description, provide exactly 3-4 specific, actionable AI use case recommendations that would genuinely benefit this particular business.

For each recommendation, provide:
1. A clear, descriptive title (max 6 words)
2. A practical description of how it works and benefits THIS specific business (2-3 sentences)
3. A category: Customer Service, Marketing, Operations, Analytics, Automation, or Content Creation
4. Difficulty level: Easy, Medium, or Advanced
5. Monthly cost estimate in format "$X-Y/month" (be realistic for small businesses)
6. Time to implement in format "X-Y weeks"

Focus on:
- Solutions that are actually implementable with current technology
- Clear, measurable business value for THIS specific business type
- Appropriate for small business budgets ($20-500/month range)
- Industry-specific recommendations, not generic suggestions
- Prioritize Easy and Medium difficulty solutions

Return ONLY a valid JSON array with no additional text or formatting. Each object should have exactly these fields: title, description, category, difficulty, estimatedCost, timeToImplement.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model for this use case
      messages: [
        {
          role: "system",
          content: "You are a helpful AI business consultant focused on practical, implementable AI solutions for small businesses. Always respond with valid JSON only."
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
    } catch (parseError) {
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