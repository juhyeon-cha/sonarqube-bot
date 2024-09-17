import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// get typed env variables
const env = process.env as ProcessEnv;

// GitHub App
export const APP_ID = env.APP_ID;
export const PORT = env.PORT || 3000;
export const BOT_NAME = env.BOT_NAME || "sonarqube-bot";
export const PRIVATE_KEY_PATH = env.PRIVATE_KEY_PATH || "./private-key.pem";
export const WEBHOOK_SECRET = env.WEBHOOK_SECRET;
export const ENTERPRISE_HOSTNAME = env.ENTERPRISE_HOSTNAME;

// SonarQube
export const SONAR_USERNAME = env.SONAR_USERNAME;
export const SONAR_PASSWORD = env.SONAR_PASSWORD;
export const SONAR_URL = env.SONAR_URL;
