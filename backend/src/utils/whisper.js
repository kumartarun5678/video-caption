import { OpenAI } from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export const transcribeAudioFile = async (filePath, options = {}) => {
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: await fs.readFile(filePath),
            model: 'whisper-1',
            language: options.language,
            temperature: options.temperature,
            prompt: options.prompt,
            response_format: 'verbose_json',
            timestamp_granularities: ['word'],
        });
        return transcription;
    }
    catch (error) {
        console.error('Whisper transcription error:', error);
        throw new Error(`Transcription failed: ${error.message}`);
    }
};
export const detectLanguage = async (audioBuffer) => {
    const transcription = await openai.audio.transcriptions.create({
        file: audioBuffer,
        model: 'whisper-1',
        response_format: 'verbose_json',
    });
    return transcription.language;
};