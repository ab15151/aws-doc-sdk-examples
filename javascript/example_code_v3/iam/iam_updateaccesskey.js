/*
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

This file is licensed under the Apache License, Version 2.0 (the "License").
You may not use this file except in compliance with the License. A copy of
the License is located at http://aws.amazon.com/apache2.0/

This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.

ABOUT THIS NODE.JS SAMPLE: This sample is part of the SDK for JavaScript Developer Guide topic at
https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/iam-examples-managing-access-keys.html

Purpose:
iam_updateaccesskey.js demonstrates how to update the status of an IAM user's access key.

Inputs (in command line below):
- REGION
- ACCESS_KEY_ID
- USER_NAME

Running the code:
node iam_updateaccesskey.js REGION ACCESS_KEY_ID USER_NAME
 */

// snippet-start:[iam.JavaScript.keys.updateAccessKey]
async function run() {
  // Load the AWS SDK for Node.js
  const {IAMClient, UpdateAccessKeyCommand} = require("@aws-sdk/client-iam");
  // Create IAM service object
  const region = process.argv[2];
  const iam = new IAMClient(region);
  var params = {
    AccessKeyId: process.argv[3],
    Status: 'Active',
    UserName: process.argv[4]
  };
  try {
    const data = await iam.send(new UpdateAccessKeyCommand(params));
    console.log("Success", data);
  } catch(err) {
    console.log("Error", err);
  }
};
run();
// snippet-end:[iam.JavaScript.keys.updateAccessKey]
exports.run = run;
