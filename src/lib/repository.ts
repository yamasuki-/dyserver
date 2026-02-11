import { EndpointConfig, GlobalConfig, RequestLog } from '@/types';

export interface LogFilter {
    endpointId?: string; // or path
    method?: string;
    statusCode?: number;
    limit?: number;
    offset?: number;
}

export interface IRepository {
    // Global Config
    getGlobalConfig(): Promise<GlobalConfig>;
    saveGlobalConfig(config: GlobalConfig): Promise<void>;

    // Endpoints
    getEndpoints(): Promise<EndpointConfig[]>;
    getEndpoint(id: string): Promise<EndpointConfig | null>;
    saveEndpoint(config: EndpointConfig): Promise<void>;
    deleteEndpoint(id: string): Promise<void>;

    // Logs
    addLog(log: RequestLog): Promise<void>;
    getLogs(filter?: LogFilter): Promise<{ logs: RequestLog[]; total: number }>;
    deleteLogs(filter?: LogFilter): Promise<void>; // Clear all if filter is empty
    clearLogs(): Promise<void>;
}
