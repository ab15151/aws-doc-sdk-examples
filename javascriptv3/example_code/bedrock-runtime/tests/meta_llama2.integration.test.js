// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {describe, it} from "vitest";
import {FoundationModels} from "../foundation_models.js";
import {expectToBeANonEmptyString} from "./test_tools.js";
import {invokeModel} from "../models/meta_llama2/llama2_chat.js";


const TEXT_PROMPT = "Hello, this is a test prompt";

describe("Invoke Llama2 Chat 13B", () => {
    it("should return a response", async () => {
        const modelId = FoundationModels.LLAMA2_CHAT_13B.modelId;
        const response = await invokeModel(TEXT_PROMPT, modelId);
        expectToBeANonEmptyString(response);
    })
});

describe("Invoke Llama2 Chat 70B", () => {
    it("should return a response", async () => {
        const modelId = FoundationModels.LLAMA2_CHAT_70B.modelId;
        const response = await invokeModel(TEXT_PROMPT, modelId);
        expectToBeANonEmptyString(response);
    })
});
