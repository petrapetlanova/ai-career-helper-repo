import OpenAI from 'openai';

const openai = new OpenAI({

apiKey: process.env.OPENAI_API_KEY

});

export interface MatchAnalysisResult {

matchPercentage: number;

skillsAnalysis: {

matching: string[];

missing: string[];

additional: string[];
};

recommendations: string[];

}

export interface CoverLetterRequest {

resumeText: string;

jobDescription: string;

highlights?: string[];

}

export async function analyzeMatch(resumeText: string, jobDescription: string): Promise<MatchAnalysisResult> {

const prompt = `

Resume: ${resumeText}

Job Description: ${jobDescription}

Analyze the match between the resume and job description. Focus on:

1. Key skills and requirements

2. Experience alignment

3. Technical expertise match

Provide output in JSON format with matchPercentage, skillsAnalysis (matching, missing, additional skills), and recommendations.
`;

const response = await openai.chat.completions.create({

model: "gpt-4-turbo-preview",

messages: [

  { role: "system", content: "You are a professional job application analyzer." },

  { role: "user", content: prompt }

],

response_format: { type: "json_object" }
});

const content = response.choices[0].message.content;
if (content === null) {
  throw new OpenAIError('Received null content from OpenAI API');
}
return JSON.parse(content) as MatchAnalysisResult;

}

export async function generateCoverLetter({ resumeText, jobDescription, highlights }: CoverLetterRequest): Promise<string> {

const prompt = `

Resume: ${resumeText}

Job Description: ${jobDescription}

${highlights ? `Key Highlights to Include: ${highlights.join(', ')}` : ''}

Generate a professional cover letter that:

1. Matches the job requirements

2. Highlights relevant experience

3. Shows enthusiasm and cultural fit

4. Maintains professional tone
`;

const response = await openai.chat.completions.create({

model: "gpt-4-turbo-preview",

messages: [

  { role: "system", content: "You are a professional cover letter writer." },

  { role: "user", content: prompt }

]
});

if (response.choices[0].message.content === null) {
  throw new OpenAIError('Received null content from OpenAI API');
}
return response.choices[0].message.content;

}

// Error handling middleware

export class OpenAIError extends Error {

constructor(message: string, public statusCode: number = 500) {

super(message);

this.name = 'OpenAIError';
}

}

export function handleOpenAIError(error: any): never {

if (error.response) {

throw new OpenAIError(`OpenAI API Error: ${error.response.data.error.message}`, error.response.status);
}

throw new OpenAIError('Failed to connect to OpenAI API');

}