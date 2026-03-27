import { createClient } from 'redis';
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-12708.crce217.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 12708
    }
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.on('connect',() => console.log('Connected to Redis'));
redisClient.on('ready', () => console.log('Redis Connected successfully '));

await redisClient.connect();

export default redisClient;



