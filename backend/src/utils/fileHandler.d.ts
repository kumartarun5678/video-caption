export declare const ensureDirectoryExists: (dirPath: string) => Promise<void>;
export declare const deleteFile: (filePath: string) => Promise<boolean>;
export declare const getFileSize: (filePath: string) => Promise<number>;
export declare const cleanupOldFiles: (directory: string, maxAgeHours?: number) => Promise<void>;