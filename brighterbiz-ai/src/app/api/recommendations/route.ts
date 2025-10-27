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
  suggestedTools: string[];
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
  const prompt = `
You are an AI Business Consultant who helps small and medium-sized business owners discover realistic AI solutions to reduce costs, save time, or grow their business.

Business Description: "${businessDescription}"

Your task is to generate exactly 4 practical AI recommendations that would provide measurable business value for THIS business.

Each recommendation should be either:
- An **AI Use Case** (e.g., chatbot, analytics, AI marketing assistant), or
- An **AI Automation Idea** (e.g., automate scheduling, lead follow-up, or inventory tracking)

---

### For Each Recommendation Include:

1. **title** — Short, professional, and clear (max 6 words). Example: "24/7 AI Voice Agent"
2. **description** — Write in a concise, business-friendly tone (2–3 sentences).  
   - Start with a strong action verb like *Implement, Deploy, Utilize, or Leverage*.  
   - Clearly explain what the AI solution does and *how it benefits this specific business*.  
   - Match the tone and length of your UX cards (≈40–60 words). Example style:  
     "Implement a voice agent that can handle customer inquiries, schedule appointments, and take orders even outside business hours. This improves customer service by providing immediate assistance and freeing up staff time."
3. **category** — Choose one from:  
   Customer Service, Marketing, Operations, Analytics, Automation, Content Creation, Sales, Finance, HR & Hiring, Legal & Compliance, Productivity, E-commerce, Customer Insights, IT & Security.
4. **suggestedTools** — 3–6 realistic tools or platforms that could implement this (e.g., ChatGPT, Zapier, Make.com, Salesforce, HubSpot, Google Workspace, Intercom, Notion, Canva, Calendly).
5. **difficulty** — Easy, Medium, or Advanced (based on setup complexity for a small business).
6. **estimatedCost** — Use realistic small business cost ranges like "$20–100/month", "$50–150/month", "$100–300/month".
7. **timeToImplement** — Use short, human-friendly format like "1–2 weeks", "2–3 weeks", or "2–4 weeks".

---

### Style & Quality Rules:

- Write all descriptions in a **natural, confident business tone** (no technical jargon).  
- Avoid marketing fluff like "revolutionize" or "cutting-edge."  
- Keep each recommendation **specific to this business's industry** — not generic.  
- Prefer **Easy** and **Medium** difficulty ideas unless the business is tech-heavy.  
- Always ensure value is **tangible**: cost savings, improved efficiency, or customer growth.  
- If the business involves phone calls, appointments, or customer inquiries, **always include**:  
  (1) a **24/7 AI Voice Agent**, and  
  (2) a **Website Chatbot for Orders or FAQs**.
- Use **consistent formatting and tone** across all 4 items to match a professional dashboard UI.

---

Return ONLY a valid JSON array.  
Each object must include exactly these keys:  
"title", "description", "category", "suggestedTools", "difficulty", "estimatedCost", "timeToImplement".

Do NOT include any extra commentary or text outside the JSON array.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using the more cost-effective model for this use case
      messages: [
        {
          role: "system",
          content: "You are an AI Business Consultant who helps small and medium-sized business owners discover realistic AI solutions to reduce costs, save time, or grow their business. For phone-based businesses, always prioritize chatbot and voice agent recommendations. Always respond with valid JSON only."
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

    // Log the raw OpenAI response for debugging
    console.log('OpenAI raw response:', content);

    // Patch: Strip code fences and extra text before JSON array
    let jsonString = content.trim();
    // Remove code block markers if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
    }
    // Remove leading explanation if present
    const firstBracket = jsonString.indexOf('[');
    if (firstBracket > 0) {
      jsonString = jsonString.slice(firstBracket);
    }

    // Parse the JSON response
    let recommendations: Omit<Recommendation, 'id'>[];
    try {
      recommendations = JSON.parse(jsonString);
    } catch {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Add IDs and validate the structure
    const validatedRecommendations: Recommendation[] = recommendations
      .filter(rec => 
        rec.title && rec.description && rec.category && rec.suggestedTools &&
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
  const prompt = `
You are an AI Business Consultant who helps small and medium-sized business owners discover realistic AI solutions to reduce costs, save time, or grow their business.

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

Your task is to generate exactly 4 practical AI recommendations that would provide measurable business value for THIS business, considering their specific profile above.

Each recommendation should be either:
- An **AI Use Case** (e.g., chatbot, analytics, AI marketing assistant), or
- An **AI Automation Idea** (e.g., automate scheduling, lead follow-up, or inventory tracking)

---

### For Each Recommendation Include:

1. **title** — Short, professional, and clear (max 6 words). Example: "24/7 AI Voice Agent"
2. **description** — Write in a concise, business-friendly tone (2–3 sentences).  
   - Start with a strong action verb like *Implement, Deploy, Utilize, or Leverage*.  
   - Clearly explain what the AI solution does and *how it benefits this specific business*.  
   - Match the tone and length of your UX cards (≈40–60 words). Example style:  
     "Implement a voice agent that can handle customer inquiries, schedule appointments, and take orders even outside business hours. This improves customer service by providing immediate assistance and freeing up staff time."
3. **category** — Choose one from:  
   Customer Service, Marketing, Operations, Analytics, Automation, Content Creation, Sales, Finance, HR & Hiring, Legal & Compliance, Productivity, E-commerce, Customer Insights, IT & Security.
4. **suggestedTools** — 3–6 realistic tools or platforms that could implement this (e.g., ChatGPT, Zapier, Make.com, Salesforce, HubSpot, Google Workspace, Intercom, Notion, Canva, Calendly).
5. **difficulty** — Easy, Medium, or Advanced (match their tech comfort: ${formData.techComfort}).
6. **estimatedCost** — Use realistic cost ranges within their budget (${formData.budget}/month) like "$20–100/month", "$50–150/month", "$100–300/month".
7. **timeToImplement** — Use short, human-friendly format that aligns with their timeline (${formData.timeline}) like "1–2 weeks", "2–3 weeks", or "2–4 weeks".

---

### Style & Quality Rules:

- Write all descriptions in a **natural, confident business tone** (no technical jargon).  
- Avoid marketing fluff like "revolutionize" or "cutting-edge."  
- Keep each recommendation **specific to this business's industry and profile** — not generic.  
- Match difficulty to their technical comfort level (${formData.techComfort}).  
- Always ensure value is **tangible**: cost savings, improved efficiency, or customer growth.  
- Focus on their stated goals: ${formData.primaryGoals.join(', ')}
- Address their current challenges: ${formData.currentChallenges.join(', ')}
- Prioritize their focus areas: ${formData.focusAreas.join(', ')}
- If the business involves phone calls, appointments, or customer inquiries, **always include**:  
  (1) a **24/7 AI Voice Agent**, and  
  (2) a **Website Chatbot for Orders or FAQs**.
- Use **consistent formatting and tone** across all 4 items to match a professional dashboard UI.

---

Return ONLY a valid JSON array.  
Each object must include exactly these keys:  
"title", "description", "category", "suggestedTools", "difficulty", "estimatedCost", "timeToImplement".

Do NOT include any extra commentary or text outside the JSON array.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI Business Consultant who helps small and medium-sized business owners discover realistic AI solutions to reduce costs, save time, or grow their business.. For phone-based businesses, always prioritize chatbot and voice agent recommendations. Always respond with valid JSON only.  AI use cases are specific AI implementations that would benefit the business, while AI automation ideas are ideas for automating business processes."
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

    // Log the raw OpenAI response for debugging
    console.log('OpenAI raw response:', content);

    // Patch: Strip code fences and extra text before JSON array
    let jsonString = content.trim();
    // Remove code block markers if present
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```/, '').replace(/```$/, '').trim();
    }
    // Remove leading explanation if present
    const firstBracket = jsonString.indexOf('[');
    if (firstBracket > 0) {
      jsonString = jsonString.slice(firstBracket);
    }

    // Parse the JSON response
    let recommendations: Omit<Recommendation, 'id'>[];
    try {
      recommendations = JSON.parse(jsonString);
    } catch {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Add IDs and validate the structure
    const validatedRecommendations: Recommendation[] = recommendations
      .filter(rec => 
        rec.title && rec.description && rec.category && rec.suggestedTools &&
        rec.difficulty && rec.estimatedCost && rec.timeToImplement
      )
      .slice(0, 4) // Ensure max 4 recommendations for advanced form
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