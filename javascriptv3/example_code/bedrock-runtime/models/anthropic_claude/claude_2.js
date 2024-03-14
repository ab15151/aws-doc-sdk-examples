// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "url";

import { FoundationModels } from "../../foundation_models.js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

/**
 * @typedef {Object} ResponseContent
 * @property {string} text
 */

/**
 * @typedef {Object} MessagesResponseBody
 * @property {ResponseContent[]} content
 */

/**
 * @typedef {Object} TextCompletionsResponseBody
 * @property {completion} text
 */

/**
 * Invokes Anthropic Claude 2.x using the Messages API.
 *
 * To learn more about the Anthropic Messages API, go to:
 * https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html
 *
 * @param {string} prompt - The input text prompt for the model to complete.
 * @param {string} [modelId] - The ID of the model to use. Defaults to "anthropic.claude-v2".
 * @returns {Promise<string[]>} The inference response from the model.
 */
export const invokeMessagesApi = async (prompt, modelId) => {
  // Create a new Bedrock Runtime client instance.
  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentialDefaultProvider: defaultProvider,
  });

  // Use the provided model ID or fallback to Claude 2.0 if not provided.
  modelId = modelId || "anthropic.claude-v2";

  // Prepare the payload for the Messages API request.
  const payload = {
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
  };

  // Invoke Claude with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response(s)
  const decodedResponseBody = new TextDecoder().decode(apiResponse.body);
  /** @type {MessagesResponseBody} */
  const responseBody = JSON.parse(decodedResponseBody);
  return responseBody.content.map((content) => content.text);
};

/**
 * Invokes Anthropic Claude 2.x using the Text Completions API.
 *
 * To learn more about the Anthropic Text Completions API, go to:
 * https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-text-completion.html
 *
 * @param {string} prompt - The input text prompt for the model to complete.
 * @param {string} [modelId] - The ID of the model to use. Defaults to "anthropic.claude-v2".
 * @returns {Promise<string>} The inference response from the model.
 */
export const invokeTextCompletionsApi = async (prompt, modelId) => {
  // Create a new Bedrock Runtime client instance.
  const client = new BedrockRuntimeClient({
    region: "us-east-1",
    credentialDefaultProvider: defaultProvider,
  });

  // Use the provided model ID or fallback to Claude 2.0 if not provided.
  modelId = modelId || "anthropic.claude-v2";

  // Prepare the payload for the Text Completions API, using the required prompt template.
  const enclosedPrompt = `Human: ${prompt}\n\nAssistant:`;
  const payload = {
    prompt: enclosedPrompt,
    max_tokens_to_sample: 500,
    temperature: 0.5,
    stop_sequences: ["\n\nHuman:"],
  };

  // Invoke Claude with the payload and wait for the response.
  const command = new InvokeModelCommand({
    contentType: "application/json",
    body: JSON.stringify(payload),
    modelId,
  });
  const apiResponse = await client.send(command);

  // Decode and return the response.
  const decoded = new TextDecoder().decode(apiResponse.body);
  /** @type {TextCompletionsResponseBody} */
  const responseBody = JSON.parse(decoded);
  return responseBody.completion;
};

// Invoke the function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const prompt =
    'Complete the following in one sentence: "Once upon a time..."';
  const modelId = FoundationModels.CLAUDE_2.modelId;
  console.log(`Prompt: ${prompt}`);
  console.log(`Model ID: ${modelId}`);

  try {
    console.log("-".repeat(53));
    console.log("Using the Messages API:");
    const responses = await invokeMessagesApi(prompt, modelId);
    responses.forEach((response) => console.log(response));
  } catch (err) {
    console.log(err);
  }

  try {
    console.log("-".repeat(53));
    console.log("Using the Text Completions API:");
    const response = await invokeTextCompletionsApi(prompt, modelId);
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
