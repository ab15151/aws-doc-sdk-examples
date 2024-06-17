# DynamoDB code examples for the SDK for PHP

## Overview

Shows how to use the AWS SDK for PHP to work with Amazon DynamoDB.

<!--custom.overview.start-->
<!--custom.overview.end-->

_DynamoDB is a fully managed NoSQL database service that provides fast and predictable performance with seamless scalability._

## ⚠ Important

* Running this code might result in charges to your AWS account. For more details, see [AWS Pricing](https://aws.amazon.com/pricing/) and [Free Tier](https://aws.amazon.com/free/).
* Running the tests might result in charges to your AWS account.
* We recommend that you grant your code least privilege. At most, grant only the minimum permissions required to perform the task. For more information, see [Grant least privilege](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html#grant-least-privilege).
* This code is not tested in every AWS Region. For more information, see [AWS Regional Services](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services).

<!--custom.important.start-->
<!--custom.important.end-->

## Code examples

### Prerequisites

For prerequisites, see the [README](../../README.md#Prerequisites) in the `php` folder.


<!--custom.prerequisites.start-->
<!--custom.prerequisites.end-->

### Single actions

Code excerpts that show you how to call individual service functions.

- [Create a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L52) (`CreateTable`)
- [Delete a table](DynamoDBService.php#L84) (`DeleteTable`)
- [Delete an item from a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L100) (`DeleteItem`)
- [Get an item from a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L131) (`GetItem`)
- [List tables](DynamoDBService.php#L64) (`ListTables`)
- [Put an item in a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L67) (`PutItem`)
- [Query a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L158) (`Query`)
- [Run a PartiQL statement](DynamoDBService.php#L243) (`ExecuteStatement`)
- [Run batches of PartiQL statements](DynamoDBService.php#L273) (`BatchExecuteStatement`)
- [Scan a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L178) (`Scan`)
- [Update an item in a table](dynamodb_basics/GettingStartedWithDynamoDB.php#L136) (`UpdateItem`)
- [Write a batch of items](DynamoDBService.php#L201) (`BatchWriteItem`)

### Scenarios

Code examples that show you how to accomplish a specific task by calling multiple
functions within the same service.

- [Get started with tables, items, and queries](dynamodb_basics/GettingStartedWithDynamoDB.php)
- [Query a table by using batches of PartiQL statements](DynamoDBService.php)
- [Query a table using PartiQL](DynamoDBService.php)

### Cross-service examples

Sample applications that work across multiple AWS services.

- [Create a serverless application to manage photos](../../applications/photo_asset_manager)


<!--custom.examples.start-->
<!--custom.examples.end-->

## Run the examples

### Instructions


<!--custom.instructions.start-->
<!--custom.instructions.end-->



#### Get started with tables, items, and queries

This example shows you how to do the following:

- Create a table that can hold movie data.
- Put, get, and update a single movie in the table.
- Write movie data to the table from a sample JSON file.
- Query for movies that were released in a given year.
- Scan for movies that were released in a range of years.
- Delete a movie from the table, then delete the table.

<!--custom.scenario_prereqs.dynamodb_Scenario_GettingStartedMovies.start-->
<!--custom.scenario_prereqs.dynamodb_Scenario_GettingStartedMovies.end-->


<!--custom.scenarios.dynamodb_Scenario_GettingStartedMovies.start-->
<!--custom.scenarios.dynamodb_Scenario_GettingStartedMovies.end-->

#### Query a table by using batches of PartiQL statements

This example shows you how to do the following:

- Get a batch of items by running multiple SELECT statements.
- Add a batch of items by running multiple INSERT statements.
- Update a batch of items by running multiple UPDATE statements.
- Delete a batch of items by running multiple DELETE statements.

<!--custom.scenario_prereqs.dynamodb_Scenario_PartiQLBatch.start-->
<!--custom.scenario_prereqs.dynamodb_Scenario_PartiQLBatch.end-->


<!--custom.scenarios.dynamodb_Scenario_PartiQLBatch.start-->
<!--custom.scenarios.dynamodb_Scenario_PartiQLBatch.end-->

#### Query a table using PartiQL

This example shows you how to do the following:

- Get an item by running a SELECT statement.
- Add an item by running an INSERT statement.
- Update an item by running an UPDATE statement.
- Delete an item by running a DELETE statement.

<!--custom.scenario_prereqs.dynamodb_Scenario_PartiQLSingle.start-->
<!--custom.scenario_prereqs.dynamodb_Scenario_PartiQLSingle.end-->


<!--custom.scenarios.dynamodb_Scenario_PartiQLSingle.start-->
<!--custom.scenarios.dynamodb_Scenario_PartiQLSingle.end-->

### Tests

⚠ Running tests might result in charges to your AWS account.


To find instructions for running these tests, see the [README](../../README.md#Tests)
in the `php` folder.



<!--custom.tests.start-->
<!--custom.tests.end-->

## Additional resources

- [DynamoDB Developer Guide](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html)
- [DynamoDB API Reference](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/Welcome.html)
- [SDK for PHP DynamoDB reference](https://docs.aws.amazon.com/aws-sdk-php/v3/api/namespace-Aws.Dynamodb.html)

<!--custom.resources.start-->
<!--custom.resources.end-->

---

Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

SPDX-License-Identifier: Apache-2.0