import http from "http";
import { createNodeMiddleware } from "@octokit/webhooks";
import { app } from "@/app/app";
import { registerWebhooks } from "@/app/webhooks";
import { env } from "@/config";

async function start(port: number) {
  // Optional: Get & log the authenticated app's name
  const { data } = await app.octokit.request("/app");

  registerWebhooks(app);

  // Read more about custom logging: https://github.com/octokit/core.js#logging
  app.octokit.log.debug(`Authenticated as '${data.name}'`);

  // Launch a web server to listen for GitHub webhooks
  const path = "/api/webhook";
  const localWebhookUrl = `http://localhost:${port}${path}`;

  // See https://github.com/octokit/webhooks.js/#createnodemiddleware for all options
  const middleware = createNodeMiddleware(app.webhooks, { path });

  http.createServer(middleware).listen(port, () => {
    console.log(`Server is listening for events at: ${localWebhookUrl}`);
    console.log("Press Ctrl + C to quit.");
  });
}

await start(env.PORT);
