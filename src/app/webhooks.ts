import { App } from "octokit";
import type { webhooks as OpenAPIWebhooks } from "@octokit/openapi-webhooks-types";
import type { WebhookEventDefinition } from "@octokit/webhooks/dist-types/types";
import type { Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
import { BOT_NAME, SONAR_USERNAME, SONAR_PASSWORD, SONAR_URL } from "@/config";
import { makeDecorationComment } from "@/app/decorator";
import { Sonar } from "@/sonarqube/sonar";
import { isNil } from "lodash-es";

interface EmitterWebhookEvent<TEventName extends keyof OpenAPIWebhooks> {
  octokit: Api;
  payload: WebhookEventDefinition<TEventName>;
}

const sonar = new Sonar({
  auth: {
    username: SONAR_USERNAME || "",
    password: SONAR_PASSWORD || "",
  },
  baseURL: SONAR_URL || "",
  transformRequest: (data) => {
    if (isNil(data)) return data;
    Object.keys(data).forEach((key) => {
      if (!data[key]) delete data[key];
    });
    return JSON.stringify(data);
  },
});

async function createOrUpdateComment(octokit: Api, owner: string, repo: string, issue_number: number) {
  const commentBody = await makeDecorationComment(sonar, repo, issue_number);
  const comments = await octokit.rest.issues
    .listComments({
      owner,
      repo,
      issue_number,
    })
    .then((response) => response.data);

  const comment = comments.find((comment) => comment.user?.login === `${BOT_NAME}[bot]`);
  if (comment) {
    await octokit.rest.issues
      .updateComment({
        owner,
        repo,
        comment_id: comment.id,
        body: commentBody,
      })
      .catch((error) => {
        if (error.response) {
          console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
        } else {
          console.error(error);
        }
      });
  } else {
    await octokit.rest.issues
      .createComment({
        owner,
        repo,
        issue_number,
        body: commentBody,
      })
      .catch((error) => {
        if (error.response) {
          console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
        } else {
          console.error(error);
        }
      });
  }
}

async function pullRequestOpenedHandler({ octokit, payload }: EmitterWebhookEvent<"pull-request-opened">) {
  console.log(`Received a pull request opened event for #${payload.pull_request.number}`);

  await createOrUpdateComment(octokit, payload.repository.owner.login, payload.repository.name, payload.pull_request.number);
}

async function pullRequestLabeledHandler({ octokit, payload }: EmitterWebhookEvent<"pull-request-labeled">) {
  console.log(`Received a pull request labeled event for #${payload.pull_request.number}`);

  await createOrUpdateComment(octokit, payload.repository.owner.login, payload.repository.name, payload.pull_request.number);
}

async function checkRunCompletedHandler({ octokit, payload }: EmitterWebhookEvent<"check-run-completed">) {
  console.log(`Received a check run completed event for ${payload.check_run.name}`);

  const pullRequest = payload.check_run.pull_requests[0];
  if (!pullRequest) {
    console.log("No pull request found in the check run event");
    return;
  }
  await createOrUpdateComment(octokit, payload.repository.owner.login, payload.repository.name, pullRequest.number);
}

export async function registerWebhooks(app: App) {
  // Register event handlers
  app.webhooks.on("pull_request.opened", pullRequestOpenedHandler);
  app.webhooks.on("pull_request.labeled", pullRequestLabeledHandler);
  app.webhooks.on("check_run.completed", checkRunCompletedHandler);

  app.webhooks.onError((error) => {
    if (error.name === "AggregateError") {
      // Log Secret verification errors
      console.log(`Error processing request: ${error.event}`);
    } else {
      console.log(error);
    }
  });
}
