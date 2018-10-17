# Copyright 2010-2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License"). You
# may not use this file except in compliance with the License. A copy of
# the License is located at
#
# http://aws.amazon.com/apache2.0/
#
# or in the "license" file accompanying this file. This file is
# distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
# ANY KIND, either express or implied. See the License for the specific
# language governing permissions and limitations under the License.

import boto3


# Create CloudWatchLogs client
cloudwatch_logs = boto3.client('logs')

# List subscription filters through the pagination interface
paginator = cloudwatch_logs.get_paginator('describe_subscription_filters')
for response in paginator.paginate(logGroupName='GROUP_NAME'):
    print(response['subscriptionFilters'])
 

#snippet-sourcedescription:[describe_subscription_filters.py demonstrates how to list the subscription filters for the specified log group.]
#snippet-keyword:[Python]
#snippet-keyword:[Code Sample]
<<<<<<< HEAD
#snippet-service:[Amazon Cloudwatch]
=======
#snippet-keyword:[Amazon Cloudwatch Logs]
#snippet-service:[cloudwatch]
>>>>>>> 75816ee5... adding descriptions for ec2 and cloudwatch PHP and Python Samples
#snippet-sourcetype:[full-example]
#snippet-sourcedate:[]
#snippet-sourceauthor:[AWS]

