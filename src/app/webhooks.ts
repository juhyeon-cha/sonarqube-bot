import { App } from "octokit";
import type { webhooks as OpenAPIWebhooks } from "@octokit/openapi-webhooks-types";
import type { WebhookEventDefinition } from "@octokit/webhooks/dist-types/types";
import type { Api } from "@octokit/plugin-rest-endpoint-methods/dist-types/types";
import { BOT_NAME } from "@/config";
import { makeDecorationComment } from "@/app/decorator";
import Sonar from "@/sonarqube/sonar";

interface EmitterWebhookEvent<TEventName extends keyof OpenAPIWebhooks> {
  octokit: Api;
  payload: WebhookEventDefinition<TEventName>;
}

async function pullRequestOpenedHandler({ octokit, payload }: EmitterWebhookEvent<"pull-request-opened">) {
  console.log(`Received a pull request event for #${payload.pull_request.number}`);

  await octokit.rest.issues
    .createComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
      body: "",
    })
    .catch((error) => {
      if (error.response) {
        console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
      } else {
        console.error(error);
      }
    });
}

async function pullRequestLabeledHandler({ octokit, payload }: EmitterWebhookEvent<"pull-request-labeled">) {
  console.log(`Received a pull request label event for #${payload.pull_request.number}`);

  // makeDecorationComment(sonar, payload.repository.name, payload.pull_request.number);

  const comments = await octokit.rest.issues
    .listComments({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      issue_number: payload.pull_request.number,
    })
    .then((response) => response.data);

  const comment = comments.find((comment) => comment.user?.login === `${BOT_NAME}[bot]`);
  if (comment) {
    await octokit.rest.issues
      .updateComment({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        comment_id: comment.id,
        body: "",
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
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        issue_number: payload.pull_request.number,
        body: "",
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

async function checkRunCompletedHandler({ octokit, payload }: EmitterWebhookEvent<"check-run-completed">) {
  console.log(`Received a check run completed event for ${payload.check_run.name}`);

  await octokit.rest.issues.listComments({
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    issue_number: payload.check_run.id,
  });

  await octokit.rest.issues
    .updateComment({
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      comment_id: 0,
      body: "",
    })
    .catch((error) => {
      if (error.response) {
        console.error(`Error! Status: ${error.response.status}. Message: ${error.response.data.message}`);
      } else {
        console.error(error);
      }
    });
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
