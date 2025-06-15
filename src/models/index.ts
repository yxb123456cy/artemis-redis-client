export interface RedisConnection {
    id: string;
    name: string;
    host: string;
    port: number;
    password?: string;
    username?: string;
    db?: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}