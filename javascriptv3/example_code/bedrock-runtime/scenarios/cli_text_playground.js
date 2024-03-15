// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "url";
import {
  selectNextStep,
  askForPrompt,
  selectModel,
} from "../tools/user_input.js";
import { FoundationModels } from "../tools/foundation_models.js";

/**
 * @typedef {Object} ModelConfig
 * @property {Function} module
 * @property {Function} invoker
 * @property {string} modelId
 * @property {string} modelName
 */

const invokeModel = async (prompt, /** @type {ModelConfig} */ model) => {
  try {
    const modelModule = await model.module();
    const invoker = model.invoker(modelModule);
    return await invoker(prompt, model.modelId);
  } catch (err) {
    console.error("Error invoking model", model.modelId, ":", err);
    throw err;
  }
};

const runDemo = async () => {
  console.log("=".repeat(50));
  console.log("Welcome to the Amazon Bedrock Runtime client demo!");

  let shouldContinue = true;
  /** @type ModelConfig */
  let currentModel;

  while (shouldContinue) {
    if (!currentModel) {
      console.log("=".repeat(50));
      currentModel = await selectModel(Object.values(FoundationModels));
      shouldContinue = currentModel !== null;
    }

    if (shouldContinue) {
      const prompt = await askForPrompt();
      console.log("-".repeat(84));
      console.log(`Invoking ${currentModel.modelName} with prompt '${prompt}'`);

      const response = await invokeModel(prompt, currentModel);
      if (Array.isArray(response)) response.forEach((str) => console.log(str));
      else console.log(response);

      console.log("=".repeat(84));

      const choice = await selectNextStep(currentModel.modelName);
      if (!choice) shouldContinue = false;
      else if (choice === "2") currentModel = null;
    }
  }

  console.log("=".repeat(84));
  console.log(
    "Good bye, and thanks for checking out the Amazon Bedrock Runtime client demo!",
  );
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runDemo();
}
