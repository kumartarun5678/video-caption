import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import { AssemblyAI } from 'assemblyai';
import type { Caption, TranscriptionResult } from '../../../shared/types/Caption.js';

let assemblyaiClient: AssemblyAI | null = null;

const getAssemblyAIClient = (): AssemblyAI => {
  if (!assemblyaiClient) {
    const apiKey = process.env.ASSEMBLYAI_API_KEY;
    if (!apiKey) {
      throw new Error('ASSEMBLYAI_API_KEY environment variable is not set. Please add it to your .env file.');
    }
    assemblyaiClient = new AssemblyAI({
      apiKey: apiKey,
    });
  }
  return assemblyaiClient;
};

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

export const transcribeAudio = async (
  videoId: string, 
  language: string = 'auto'
): Promise<TranscriptionResult> => {
  const audioPath = path.join(UPLOADS_DIR, `${videoId}.wav`);
  
  if (!await fileExists(audioPath)) {
    throw new Error('Audio file not found. Please extract audio first.');
  }

  try {
    const client = getAssemblyAIClient();
    
    const stats = await fs.stat(audioPath);
    if (stats.size === 0) {
      throw new Error('Audio file is empty');
    }
    
    const transcriptResult = await client.transcripts.transcribe({
      audio: audioPath,
      language_code: language === 'auto' ? undefined : language,
    });
    
    if (transcriptResult.status === 'error') {
      throw new Error(`Transcription failed: ${transcriptResult.error || 'Unknown error'}`);
    }

    const captions: Caption[] = processTranscriptionResult(transcriptResult);

    const result: TranscriptionResult = {
      id: videoId,
      videoId,
      captions,
      language: transcriptResult.language_code || 'en',
      confidence: calculateAverageConfidence(captions),
      processedAt: new Date(),
      status: 'completed',
    };

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Transcription error:', error);
    throw new Error(`Transcription failed: ${errorMessage}`);
  }
};

export const generateCaptions = async (
  videoId: string,
  transcription: TranscriptionResult,
  style: string = 'standard'
): Promise<Caption[]> => {
  const processedCaptions = processCaptionsForStyle(transcription.captions, style);
  
  const captionsPath = path.join(UPLOADS_DIR, `${videoId}-captions.json`);
  await fs.writeFile(captionsPath, JSON.stringify(processedCaptions, null, 2));
  
  return processedCaptions;
};

export const updateCaptions = async (
  videoId: string,
  captions: Caption[]
): Promise<Caption[]> => {
  const captionsPath = path.join(UPLOADS_DIR, `${videoId}-captions.json`);
  await fs.writeFile(captionsPath, JSON.stringify(captions, null, 2));
  return captions;
};

const processTranscriptionResult = (transcription: any): Caption[] => {
  const words = transcription.words || [];
  const captions: Caption[] = [];
  
  let currentCaption: Caption | null = null;
  const wordsPerCaption = 5;

  words.forEach((word: any, index: number) => {
    const wordText = word.text || word.word;
    const wordStart = word.start / 1000;
    const wordEnd = word.end / 1000;
    
    if (index % wordsPerCaption === 0) {
      if (currentCaption) {
        captions.push(currentCaption);
      }
      currentCaption = {
        id: `caption-${captions.length + 1}`,
        start: wordStart,
        end: wordEnd,
        text: wordText,
        words: [{
          word: wordText,
          start: wordStart,
          end: wordEnd,
          confidence: word.confidence || 0.5,
        }],
      };
    } else if (currentCaption) {
      currentCaption.text += ` ${wordText}`;
      currentCaption.end = wordEnd;
      currentCaption.words!.push({
        word: wordText,
        start: wordStart,
        end: wordEnd,
        confidence: word.confidence || 0.5,
      });
    }
  });

  if (currentCaption) {
    captions.push(currentCaption);
  }

  return captions;
};

const processCaptionsForStyle = (captions: Caption[], style: string): Caption[] => {
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

const calculateAverageConfidence = (captions: Caption[]): number => {
  if (captions.length === 0) return 0;
  
  const totalConfidence = captions.reduce((sum, caption) => {
    const wordsConfidence = caption.words?.reduce((wordSum, word) => 
      wordSum + (word.confidence || 0.5), 0) || 0;
    return sum + (wordsConfidence / (caption.words?.length || 1));
  }, 0);
  
  return totalConfidence / captions.length;
};

const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};