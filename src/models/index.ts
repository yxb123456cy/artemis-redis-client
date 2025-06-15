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


export interface redisKey {
    key: string,
    type: string,
    size: string,
    ttl: number
}