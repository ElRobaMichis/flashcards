import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const generateExample = async (term: string, language: string): Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful language learning assistant. Generate a simple, clear example sentence using the word "${term}" in ${language}.`
                }
            ],
            temperature: 0.7,
            max_tokens: 100,
        });

        return response.choices[0].message.content || '';
    } catch (error) {
        console.error('Error generating example:', error);
        throw error;
    }
};
