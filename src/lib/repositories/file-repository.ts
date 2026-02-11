import fs from 'fs/promises';
import path from 'path';
import { EndpointConfig, GlobalConfig, RequestLog } from '@/types';
import { IRepository, LogFilter } from '../repository';

const DATA_DIR = path.join(process.cwd(), 'data');
const ENDPOINTS_FILE = path.join(DATA_DIR, 'endpoints.json');
const LOGS_FILE = path.join(DATA_DIR, 'logs.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

export class FileRepository implements IRepository {
    private async ensureDataDir() {
        try {
            await fs.access(DATA_DIR);
        } catch {
            await fs.mkdir(DATA_DIR, { recursive: true });
        }
    }

    private async readJson<T>(filePath: string, defaultValue: T): Promise<T> {
        await this.ensureDataDir();
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            return JSON.parse(data) as T;
        } catch {
            return defaultValue;
        }
    }

    private async writeJson<T>(filePath: string, data: T): Promise<void> {
        await this.ensureDataDir();
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    // Global Config
    async getGlobalConfig(): Promise<GlobalConfig> {
        return this.readJson<GlobalConfig>(CONFIG_FILE, {
            logging: { request: true, response: true },
        });
    }

    async saveGlobalConfig(config: GlobalConfig): Promise<void> {
        await this.writeJson(CONFIG_FILE, config);
    }

    // Endpoints
    async getEndpoints(): Promise<EndpointConfig[]> {
        return this.readJson<EndpointConfig[]>(ENDPOINTS_FILE, []);
    }

    async getEndpoint(id: string): Promise<EndpointConfig | null> {
        const endpoints = await this.getEndpoints();
        return endpoints.find((e) => e.id === id) || null;
    }

    async saveEndpoint(config: EndpointConfig): Promise<void> {
        const endpoints = await this.getEndpoints();
        const index = endpoints.findIndex((e) => e.id === config.id);
        if (index >= 0) {
            endpoints[index] = config;
        } else {
            endpoints.push(config);
        }
        await this.writeJson(ENDPOINTS_FILE, endpoints);
    }

    async deleteEndpoint(id: string): Promise<void> {
        const endpoints = await this.getEndpoints();
        const newEndpoints = endpoints.filter((e) => e.id !== id);
        await this.writeJson(ENDPOINTS_FILE, newEndpoints);
    }

    // Logs
    async addLog(log: RequestLog): Promise<void> {
        // In a real file system implementation, appending to a large JSON is inefficient.
        // For this dummy server, we'll just read/write all. 
        // Optimization: separate files or use append-only log file.
        // For now, keep it simple as per requirement "Local operation".
        const logs = await this.readJson<RequestLog[]>(LOGS_FILE, []);
        logs.unshift(log); // Newest first
        // Limit log size if needed? Not specified, but good practice.
        // Let's cap at 1000 for now to prevent explosion.
        if (logs.length > 1000) {
            logs.length = 1000;
        }
        await this.writeJson(LOGS_FILE, logs);
    }

    async getLogs(filter?: LogFilter): Promise<{ logs: RequestLog[]; total: number }> {
        let logs = await this.readJson<RequestLog[]>(LOGS_FILE, []);

        if (filter) {
            if (filter.endpointId) {
                // This is tricky if endpointId is just ID, but filter might be path.
                // Assuming path matching or ID matching.
                // For now, loose check.
                logs = logs.filter(l => l.path.includes(filter.endpointId!) || l.path === filter.endpointId);
            }
            if (filter.method) {
                logs = logs.filter(l => l.method === filter.method);
            }
            if (filter.statusCode) {
                logs = logs.filter(l => l.statusCode === filter.statusCode);
            }
        }

        const total = logs.length;

        if (filter?.offset !== undefined && filter?.limit !== undefined) {
            logs = logs.slice(filter.offset, filter.offset + filter.limit);
        }

        return { logs, total };
    }

    async deleteLogs(filter?: LogFilter): Promise<void> {
        if (!filter) {
            await this.clearLogs();
            return;
        }
        // Implementation for filtering delete
        // TODO: strictly speaking, we need to filter and keep the REST.
        let logs = await this.readJson<RequestLog[]>(LOGS_FILE, []);
        // "Delete logs matching filter" means KEEP logs NOT matching filter.
        logs = logs.filter(l => {
            if (filter.endpointId && (l.path.includes(filter.endpointId) || l.path === filter.endpointId)) return false;
            if (filter.method && l.method === filter.method) return false;
            // ... etc
            return true;
        });
        await this.writeJson(LOGS_FILE, logs);
    }

    async clearLogs(): Promise<void> {
        await this.writeJson(LOGS_FILE, []);
    }
}
