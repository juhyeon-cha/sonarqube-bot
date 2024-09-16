import fs from "fs";
import { Octokit, App } from "octokit";
import { APP_ID, PRIVATE_KEY_PATH, WEBHOOK_SECRET, ENTERPRISE_HOSTNAME } from "@/config";

const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
// Create an authenticated Octokit client authenticated as a GitHub App
export const app = new App({
  appId: APP_ID,
  privateKey: privateKey,
  webhooks: {
    secret: WEBHOOK_SECRET,
  },
  ...(ENTERPRISE_HOSTNAME && {
    Octokit: Octokit.defaults({
      baseUrl: `https://${ENTERPRISE_HOSTNAME}/api/v3`,
    }),
  }),
});
