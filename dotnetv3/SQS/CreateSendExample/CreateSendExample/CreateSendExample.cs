﻿// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. 
// SPDX-License-Identifier:  Apache-2.0

using Amazon;
using Amazon.SQS;
using Amazon.SQS.Model;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CreateSendExample
{
    class CreateSendExample
    {
        // The following example creates a queue using the Amazon Simple Queue
        // Service (Amazon SQS) and then sends a message to the queue. It was
        // created using AWS SDK for .NET 3.5 and .NET 5.0.

        // Specify your AWS Region (an example Region is shown).
        private static readonly RegionEndpoint _serviceRegion = RegionEndpoint.USWest2;
        private static IAmazonSQS _client;

        private static readonly string _queueName = "Example_Queue";

        static async Task Main()
        {
            _client = new AmazonSQSClient(_serviceRegion);
            var createQueueResponse = await CreateQueue(_client, _queueName);

            string queueUrl = createQueueResponse.QueueUrl;

            Dictionary<string, MessageAttributeValue> messageAttributes = new Dictionary<string, MessageAttributeValue>
            {
                {"Title",   new MessageAttributeValue{DataType = "String", StringValue = "The Whistler"}},
                {"Author",  new MessageAttributeValue{DataType = "String", StringValue = "John Grisham"}},
                {"WeeksOn", new MessageAttributeValue{DataType = "Number", StringValue = "6"}}
            };

            string messageBody = "Information about current NY Times fiction bestseller for week of 12/11/2016.";

            var sendMsgResponse = await SendMessage(_client, queueUrl, messageBody, messageAttributes);
        }

        /// <summary>
        /// Creates a new Amazon SQS queue using the queue name passed to it
        /// in queueName.
        /// </summary>
        /// <param name="client">An SQS client object used to send the message.</param>
        /// <param name="queueName">A string representing the name of the queue
        /// to create.</param>
        /// <returns>A CreateQueueResponse that contains information about the
        /// newly created queue.</returns>
        static async Task<CreateQueueResponse> CreateQueue(IAmazonSQS client, string queueName)
        {
            var request = new CreateQueueRequest
            {
                QueueName = queueName,
                Attributes = new Dictionary<string, string>
                {
                    { "DelaySeconds", "60"},
                    { "MessageRetentionPeriod", "86400"}
                }
            };

            var response = await client.CreateQueueAsync(request);
            Console.WriteLine($"Created a queue with URL : {response.QueueUrl}");

            return response;
        }

        /// <summary>
        /// Sends a message to an SQS queue.
        /// </summary>
        /// <param name="client">An SQS client object used to send the message.</param>
        /// <param name="queueUrl">The URL of the queue to which to send the
        /// message.</param>
        /// <param name="messageBody">A string representing the body of the
        /// message to be sent to the queue.</param>
        /// <param name="messageAttributes">Attributes for the message to be
        /// sent to the queue.</param>
        /// <returns>A SendMessageResponse object that contains information
        /// about the message that was sent.</returns>
        static async Task<SendMessageResponse> SendMessage(
            IAmazonSQS client,
            string queueUrl,
            string messageBody,
            Dictionary<string, MessageAttributeValue> messageAttributes
        )
        {
            var sendMessageRequest = new SendMessageRequest
            {
                DelaySeconds = 10,
                MessageAttributes = messageAttributes,
                MessageBody = messageBody,
                QueueUrl = queueUrl
            };

            var response = await client.SendMessageAsync(sendMessageRequest);
            Console.WriteLine($"Sent a message with id : {response.MessageId}");

            return response;
        }
    }
}
