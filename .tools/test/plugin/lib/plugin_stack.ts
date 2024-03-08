import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as batch from 'aws-cdk-lib/aws-batch';
import * as subs from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

const toolName = process.env.TOOL_NAME ?? 'defaultToolName';

export class ConsumerStack extends cdk.Stack {
  private awsRegion: string;
  private adminAccountId: string;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const resourceConfig = this.getYamlConfig('../config/resources.yaml');
    const adminTopicName = resourceConfig['topic_name'];
    const adminBucketName = resourceConfig['bucket_name'];
    this.awsRegion = resourceConfig['aws_region'];
    this.adminAccountId = resourceConfig['admin_acct'];
    const snsTopic = this.initGetTopic(adminTopicName);
    const sqsQueue = new sqs.Queue(this, `BatchJobQueue-${toolName}`);
    this.initSubscribeSns(sqsQueue, snsTopic);
    const [jobDefinition, jobQueue] = this.initBatchFargate();
    const batchFunction = this.initBatchLambda(jobQueue, jobDefinition);
    this.initSqsLambdaIntegration(batchFunction, sqsQueue);
    this.initLogFunction(adminBucketName);
  }

  private getYamlConfig(filepath: string): any {
    return yaml.load(fs.readFileSync(filepath, 'utf8'));
  }

  private initGetTopic(topicName: string): sns.ITopic {
    const externalSnsTopicArn = `arn:aws:sns:${this.awsRegion}:${this.adminAccountId}:${topicName}`;
    return sns.Topic.fromTopicArn(this, 'ExternalSNSTopic', externalSnsTopicArn);
  }

  private initBatchFargate(): [batch.CfnJobDefinition, batch.CfnJobQueue] {
    const batchExecutionRole = new iam.Role(this, `BatchExecutionRole-${toolName}`, {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      inlinePolicies: {
        BatchLoggingPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'logs:CreateLogGroup',
                'logs:CreateLogStream',
                'logs:PutLogEvents',
                'logs:DescribeLogStreams',
              ],
              resources: ['arn:aws:logs:*:*:*'],
            }),
          ],
        }),
      },
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonECSTaskExecutionRolePolicy'),
      ],
    });

    const vpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true });

    const fargateEnvironment = new batch.FargateComputeEnvironment(this, `FargateEnv-${toolName}`, {
        vpc,
        spot: true
    });

    const containerImage = ecs.ContainerImage.fromRegistry(`public.ecr.aws/b4v4v1s0/${toolName}:latest`);

    const jobDefinition = new batch.CfnJobDefinition(this, `JobDefinition-${toolName}`, {
      container: {
        image: containerImage,
        executionRole: batchExecutionRole,
        jobRole: batchExecutionRole,
        memoryLimitMiB: 2048,
        vcpus: 1,
      },
      platformCapabilities: [batch.PlatformCapabilities.FARGATE],
    });

    const jobQueue = new batch.JobQueue(this, `JobQueue-${toolName}`, {
      computeEnvironments: [
        {
          computeEnvironment: fargateEnvironment,
          order: 1,
        },
      ],
    });

    return [jobDefinition, jobQueue];
  }

  private initSubscribeSns(sqsQueue: sqs.Queue, snsTopic: sns.ITopic): void {
    snsTopic.addSubscription(new subs.SqsSubscription(sqsQueue, { rawMessageDelivery: true }));
  }

  private initBatchLambda(jobQueue: batch.JobQueue, jobDefinition: batch.JobDefinition): lambda.Function {
    const executionRole = new iam.Role(this, `BatchLambdaExecutionRole-${toolName}`, {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    executionRole.addToPolicy(new iam.PolicyStatement({
      actions: ['batch:SubmitJob', 'batch:DescribeJobs'],
      resources: ['*'],
    }));

    return new lambda.Function(this, `SubmitBatchJob-${toolName}`, {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'submit_job.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        JOB_QUEUE: jobQueue.jobQueueArn,
        JOB_DEFINITION: jobDefinition.jobDefinitionArn,
        JOB_NAME: `job-${toolName}`,
      },
      role: executionRole,
    });
  }

  private initSqsLambdaIntegration(lambdaFunction: lambda.Function, sqsQueue: sqs.Queue): void {
    // Add the SQS queue as an event source for the Lambda function.
    lambdaFunction.addEventSource(new lambda.SqsEventSource(sqsQueue));

    // Grant permissions to allow the function to receive messages from the queue.
    sqsQueue.grantConsumeMessages(lambdaFunction);

    // Add IAM policy to the Lambda function's execution role to allow it to receive messages from the SQS queue.
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: ['sqs:ReceiveMessage'],
      resources: [sqsQueue.queueArn],
    }));

    // Additionally, ensure the Lambda function can create and write to CloudWatch Logs.
    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
      ],
      resources: ['*'], // You might want to restrict this to specific log groups.
    }));
  }

  private initLogFunction(adminBucketName: string): void {
    // S3 Bucket to store logs within this account.
    const bucket = new s3.Bucket(this, 'LogBucket', {
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // Execution role for AWS Lambda function to use.
    const executionRole = new iam.Role(this, 'LogsLambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'Allows Lambda function to get logs from CloudWatch',
      roleName: 'LogsLambdaExecutionRole',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
    });

    // Update bucket permissions to allow Lambda
    const statement = new iam.PolicyStatement({
      actions: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:DeleteObject',
        's3:ListBucket',
        's3:GetObject',
      ],
      resources: [`${bucket.bucketArn}/*`, bucket.bucketArn],
    });
    statement.addArnPrincipal(`arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:role/LogsLambdaExecutionRole`);
    statement.addArnPrincipal(`arn:aws:iam::${cdk.Aws.ACCOUNT_ID}:root`);
    bucket.addToResourcePolicy(statement);

    // Attach custom policy to allow Lambda to get logs from CloudWatch.
    executionRole.addToPolicy(new iam.PolicyStatement({
      actions: ['logs:GetLogEvents', 'logs:DescribeLogStreams'],
      resources: [`arn:aws:logs:${this.region}:${cdk.Aws.ACCOUNT_ID}:*`],
    }));

    // Attach custom policy to allow Lambda to get and put to local logs bucket.
    executionRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:GetObject',
        's3:ListBucket',
        's3:DeleteObject',
      ],
      resources: [`${bucket.bucketArn}/*`, bucket.bucketArn],
    }));

    // Attach custom policy to allow Lambda to get and put to admin logs bucket.
    executionRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        's3:PutObject',
        's3:PutObjectAcl',
        's3:GetObject',
        's3:ListBucket',
        's3:DeleteObject',
      ],
      resources: [`arn:aws:s3:::${adminBucketName}/*`, `arn:aws:s3:::${adminBucketName}`],
    }));

    // Define the Lambda function.
    const lambdaFunction = new lambda.Function(this, 'BatchJobCompleteLambda', {
      runtime: lambda.Runtime.PYTHON_3_8,
      handler: 'export_logs.handler',
      role: executionRole,
      code: lambda.Code.fromAsset('lambda'),
      timeout: cdk.Duration.seconds(60),
      environment: {
        TOOL_NAME: toolName,
        LOCAL_BUCKET_NAME: bucket.bucketName,
        ADMIN_BUCKET_NAME: adminBucketName,
      },
    });

    // CloudWatch Event Rule to trigger the Lambda function.
    const batchRule = new events.Rule(this, 'BatchAllEventsRule', {
      eventPattern: {
        source: ['aws.batch'],
      },
    });

    // Add the Lambda function as a target for the CloudWatch Event Rule.
    batchRule.addTarget(new targets.LambdaFunction(lambdaFunction));
  }
}

