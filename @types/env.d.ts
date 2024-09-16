interface ProcessEnv extends NodeJS.ProcessEnv {
  NODE_ENV: "development" | "production";
  PORT: number;

  // env variables for the GitHub App
  APP_ID: string;
  BOT_NAME: string;
  PRIVATE_KEY_PATH: string;
  WEBHOOK_SECRET: string;
  ENTERPRISE_HOSTNAME: string | undefined;
}
