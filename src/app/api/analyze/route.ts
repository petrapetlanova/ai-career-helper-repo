import { NextRequest, NextResponse } from 'next/server';
import { analyzeMatch } from '../../../components/libs/openai';

export async function POST(req: NextRequest) {

try {

const { resumeText, jobDescription } = await req.json();

const analysis = await analyzeMatch(resumeText, jobDescription);

return NextResponse.json(analysis);
} catch (error) {

if (error instanceof Error) {
	return NextResponse.json({ error: error.message }, { status: 500 });
} else {
	return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
}
}

}