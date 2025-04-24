export interface AiClient {
  name: string;
  isHealthy(): boolean;
  sendMessage(message: string, system: string): Promise<string>;
}
