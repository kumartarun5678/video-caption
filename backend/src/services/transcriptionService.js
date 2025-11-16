import fs from 'fs/promises';
import path from 'path';
import { OpenAI } from 'openai';
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
export const transcribeAudio = async (videoId, language = 'auto') => {
    const audioPath = path.join(UPLOADS_DIR, `${videoId}.wav`);
    if (!await fileExists(audioPath)) {
        throw new Error('Audio file not found. Please extract audio first.');
    }
    try {
        const transcription = await openai.audio.transcriptions.create({
            file: await fs.readFile(audioPath),
            model: 'whisper-1',
            language: language === 'auto' ? undefined : language,
            response_format: 'verbose_json',
            timestamp_granularities: ['word'],
        });
        const captions = processTranscriptionResult(transcription);
        const result = {
            id: videoId,
            videoId,
            captions,
            language: transcription.language,
            confidence: calculateAverageConfidence(captions),
            processedAt: new Date(),
            status: 'completed',
        };
        return result;
    }
    catch (error) {
        console.error('Transcription error:', error);
        throw new Error(`Transcription failed: ${error.message}`);
    }
};
export const generateCaptions = async (videoId, transcription, style = 'standard') => {
    const processedCaptions = processCaptionsForStyle(transcription.captions, style);
    const captionsPath = path.join(UPLOADS_DIR, `${videoId}-captions.json`);
    await fs.writeFile(captionsPath, JSON.stringify(processedCaptions, null, 2));
    return processedCaptions;
};
export const updateCaptions = async (videoId, captions) => {
    const captionsPath = path.join(UPLOADS_DIR, `${videoId}-captions.json`);
    await fs.writeFile(captionsPath, JSON.stringify(captions, null, 2));
    return captions;
};

const processTranscriptionResult = (transcription) => {
    const words = transcription.words || [];
    const captions = [];
    let currentCaption = null;
    const wordsPerCaption = 5;
    words.forEach((word, index) => {
        if (index % wordsPerCaption === 0) {
            if (currentCaption) {
                captions.push(currentCaption);
            }
            currentCaption = {
                id: `caption-${captions.length + 1}`,
                start: word.start,
                end: word.end,
                text: word.word,
                words: [word],
            };
        }
        else if (currentCaption) {
            currentCaption.text += ` ${word.word}`;
            currentCaption.end = word.end;
            currentCaption.words.push(word);
        }
    });
    if (currentCaption) {
        captions.push(currentCaption);
    }
    return captions;
};
const processCaptionsForStyle = (captions, style) => {
    switch (style) {
        case 'karaoke':
            return captions.map(caption => ({
                ...caption,
            }));
        case 'news':
            return captions.map(caption => ({
                ...caption,
            }));
        default:
            return captions;
    }
};
const calculateAverageConfidence = (captions) => {
    if (captions.length === 0)
        return 0;
    const totalConfidence = captions.reduce((sum, caption) => {
        const wordsConfidence = caption.words?.reduce((wordSum, word) => wordSum + (word.confidence || 0.5), 0) || 0;
        return sum + (wordsConfidence / (caption.words?.length || 1));
    }, 0);
    return totalConfidence / captions.length;
};
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
};