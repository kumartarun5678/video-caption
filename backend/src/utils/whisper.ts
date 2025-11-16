import fs from 'fs/promises';
import fsSync from 'fs';
import { AssemblyAI } from 'assemblyai';

// Lazy initialization of AssemblyAI client to ensure env vars are loaded
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

export interface TranscriptionOptions {
  language?: string;
  temperature?: number;
  prompt?: string;
}

export const transcribeAudioFile = async (
  filePath: string,
  options: TranscriptionOptions = {}
): Promise<any> => {
  try {
    const client = getAssemblyAIClient();
    
    const transcriptResult = await client.transcripts.transcribe({
      audio: filePath,
      language_code: options.language,
    });
    
    if (transcriptResult.status === 'error') {
      throw new Error(`Transcription failed: ${transcriptResult.error || 'Unknown error'}`);
    }

    return transcriptResult;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('AssemblyAI transcription error:', error);
    throw new Error(`Transcription failed: ${errorMessage}`);
  }
};

export const detectLanguage = async (audioBuffer: Buffer): Promise<string> => {
  try {
    const client = getAssemblyAIClient();
    
    const transcriptResult = await client.transcripts.transcribe({
      audio: audioBuffer,
    });
    
    if (transcriptResult.status === 'error') {
      console.error('Language detection error:', transcriptResult.error);
      return 'en';
    }

    return transcriptResult.language_code || 'en';
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en';
  }
};