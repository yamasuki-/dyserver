export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface ResponseSet {
  id: string;
  name: string;
  statusCode: number;
  headers: Record<string, string>;
  body: string; // JSON string or raw text
  isNoResponse: boolean; // 応答なし設定
}

export type ResponseMode = 'default' | 'random' | 'conditional';

export interface ResponseCondition {
  target: 'header' | 'body' | 'query';
  key: string;
  value: string;
  responseSetId: string;
}

export interface EndpointConfig {
  id: string;
  path: string; // e.g., "api/users/[id]"
  description?: string;
  methods: {
    [key in HttpMethod]: {
      enabled: boolean;
      responseSets: ResponseSet[];
      activeResponseSetId?: string; // For default mode
      mode: ResponseMode;
      conditions: ResponseCondition[];
    };
  };
}

export interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode?: number; // 応答なしの場合はundefined
  request: {
    headers: Record<string, string>;
    query: Record<string, string>;
    body?: string;
  };
  response?: {
    headers: Record<string, string>;
    body?: string;
    responseSetId?: string;
    responseSetName?: string;
  };
  durationMs: number;
}

export interface GlobalConfig {
  logging: {
    request: boolean;
    response: boolean;
  };
}
