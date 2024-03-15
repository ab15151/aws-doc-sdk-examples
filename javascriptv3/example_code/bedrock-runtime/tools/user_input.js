// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as readline from "readline";

function askAgain(askQuestion, newQuestion) {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    askQuestion(newQuestion);
}

function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
}
/**
 * @typedef {Object} FoundationModel
 * @property {string} modelName - The name of the model
 */

/**
 * @param {FoundationModel[]} models - An array of models to choose from
 * @returns {Promise<FoundationModel>} - A Promise that resolves with the selected model
 */
export const selectModel = (models) => {
    return new Promise(resolve => {
        const rl = createInterface();

        const printOptions = () => {
            models.forEach((model, index) => {
                console.log(`${index + 1}. ${model.modelName}`);
            });
        };

        const askForModel = (question) => {
            rl.question(question, answer => {
                if (answer === "q") {
                    rl.close();
                    resolve(null);
                }
                else {
                    const selectedIndex = parseInt(answer, 10) - 1;
                    if (selectedIndex >= 0 && selectedIndex < models.length) {
                        rl.close();
                        resolve(models[selectedIndex]);
                    } else {
                        askAgain(askForModel, "Invalid input. Please enter a valid number (q to quit): ");
                    }
                }
            });
        };

        printOptions();
        askForModel("Select a model: (q to quit): ");
    });
};

export const askForPrompt = () => {
    return new Promise(resolve => {
        const rl = createInterface();

        const askForPrompt = (question) => {
            rl.question(question, answer => {
                if (answer.trim() === "") {
                    askAgain(askForPrompt, "Invalid input. Please enter a prompt: ");
                } else {
                    rl.close();
                    resolve(answer);
                }
            });
        };
        askForPrompt("Now, enter your prompt: ");
    });
};

export const askForChoice = () => {
    return new Promise((resolve) => {
        const rl = createInterface();

        const askForChoice = (question) => {
            rl.question(question, (answer) => {
                if (["1", "2", "q"].includes(answer)) {
                    rl.close();
                    resolve(answer);
                } else {
                    askAgain(askForChoice, "Invalid input. Please enter 1, 2, or q: ");
                }
            });
        };

        askForChoice(
            "Enter 1 for a new prompt to the same model, 2 for a different model, or q to quit: "
        );
    });
};
