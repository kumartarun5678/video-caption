export interface TranscriptionOptions {
    language?: string;
    temperature?: number;
    prompt?: string;
}
export declare const transcribeAudioFile: (filePath: string, options?: TranscriptionOptions) => Promise<any>;
export declare const detectLanguage: (audioBuffer: Buffer) => Promise<string>;