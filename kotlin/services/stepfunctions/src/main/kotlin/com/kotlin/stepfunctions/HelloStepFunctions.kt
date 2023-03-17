// snippet-sourcedescription:[HelloStepFunctions.kt demonstrates how to list existing state machines for AWS Step Functions.]
// snippet-keyword:[AWS SDK for Kotlin]
// snippet-service:[AWS Step Functions]

/*
   Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
   SPDX-License-Identifier: Apache-2.0
*/
package com.kotlin.stepfunctions

// snippet-start:[stepfunctions.kotlin.list_machines.import]
import aws.sdk.kotlin.services.sfn.SfnClient
import aws.sdk.kotlin.services.sfn.model.ListStateMachinesRequest
// snippet-end:[stepfunctions.kotlin.list_machines.import]

// snippet-start:[stepfunctions.kotlin.list_machines.main]
/**
 Before running this Kotlin code example, set up your development environment,
 including your credentials.

 For more information, see the following documentation topic:
 https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/setup.html
 */

suspend fun main() {
    listMachines()
}

suspend fun listMachines() {
    SfnClient { region = "us-east-1" }.use { sfnClient ->
        val response = sfnClient.listStateMachines(ListStateMachinesRequest {})
        response.stateMachines?.forEach { machine ->
            println("The name of the state machine is ${machine.name}")
            println("The ARN value is ${machine.stateMachineArn}")
        }
    }
}
// snippet-end:[stepfunctions.kotlin.list_machines.main]
