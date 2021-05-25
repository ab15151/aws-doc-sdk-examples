/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

ABOUT THIS NODE.JS EXAMPLE: This example works with AWS SDK for JavaScript version 3 (v3),
which is available at https://github.com/aws/aws-sdk-js-v3. This example is in the 'AWS SDK for JavaScript v3 Developer Guide' at
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/serverless-workflows-using-step-functions.html.

Purpose:
additem.js is part of a tutorial demonstrates how to create an AWS serverless workflow by using the AWS SDK for JavaScript (v3)
and AWS Step Functions. To see the full tutorial, see
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/erverless-workflows-using-step-functions.html.

*/
// snippet-start:[lambda.JavaScript.lambda-step-functions.additem]

"use strict";
// Load the required clients and commands.
// ES Modules import
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
// CommonJS import
// const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");


const REGION = "REGION"; //e.g. "us-east-1"
// Create the client service objects.
    const dbclient = new DynamoDBClient({ region: REGION });
exports.handler = async (event) => {
 try{
        // Helper function to send message using Amazon SNS.
        const val = event;
        //PersistCase adds an item to a DynamoDB table
        const tmp = (Math.random() <= 0.5) ? 1 : 2;
        console.log(tmp);
        if (tmp == 1) {
            const params = {
                TableName: "Case",
                Item: {
                    id: {N: val.Case},
                    empEmail: {S: "brmur@amazon.com"},
                    name: {S: "Tom Blue"}
                },
            }
            console.log('adding item for tom');
            try {
                const data = await dbclient.send(new PutItemCommand(params));
                console.log(data);
            } catch (err) {
                console.error(err);
            }
            var result = { Email: params.Item.empEmail };
            return result;
        } else {
            const params = {
                TableName: "Case",
                Item: {
                    id: {N: val.Case},
                    empEmail: {S: "brmur@amazon.com"},
                    name: {S: "Sarah White"}
                },
            }
            console.log('adding item for sarah');
            try {
                const data = await dbclient.send(new PutItemCommand(params));
                console.log(data);
            } catch (err) {
                console.error(err);
            }
            return params.Item.empEmail;
            var result = { Email: params.Item.empEmail };
        }
    }
    catch(err){
     console.log("Error" , err)
    }
}
// snippet-end:[lambda.JavaScript.lambda-step-functions.additem]

