import { CoreMessage, generateText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export async function POST(req: Request) {
    const { imageUrl } = await req.json();
    const system_prompt = `<system>You are a route analysis model which will be presented with an image url which 
  is divided into 3 equal sections. Each section shows a different route to the same 
  destination. You must use your vision and select the most efficient route. The left 
  most box will be 1, the middle box will be 2 and the right most will be 3, Reply with 
  just one number answer. Will be 1, 2 or 3. You shall not send another response besides these 
  3 numbers.</system>`;
    const prompt = [];
    prompt.push({ role: 'user', content: [{ type: "text", text: "" }, { type: "image", image: imageUrl }] } as CoreMessage);
    const google = createGoogleGenerativeAI({
        apiKey: process.env.GOOGLE_API_KEY,
    });
    try {
        const { text } = await generateText({
            model: google("gemini-2.0-flash-001"),
            system: system_prompt,
            messages: prompt,
        });
        return new Response(text, {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process image' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}