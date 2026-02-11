import { IRepository } from './repository';
import { FileRepository } from './repositories/file-repository';

// Singleton instance
// In a serverless environment (like Vercel functions), this might be re-instantiated per request.
// For local file system persistence, that's fine as long as file locking isn't an issue.
// Node.js fs.writeFile is atomic enough for low concurrency.
// For AWS/Vercel (production), we'd use a different implementation (S3/DynamoDB).

// Factory function to get repository based on environment
function getRepository(): IRepository {
    // Check env var if implemented, e.g. process.env.STORAGE_TYPE === 's3'
    return new FileRepository();
}

export const repository = getRepository();
