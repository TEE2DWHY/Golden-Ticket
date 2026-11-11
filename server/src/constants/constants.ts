import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const MONGODB_URL = process.env.MONGODB_URL as string;
export const CLIENT_URL = process.env.CLIENT_URL as string;
