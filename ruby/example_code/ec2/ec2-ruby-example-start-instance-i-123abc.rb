# snippet-comment:[These are tags for the AWS doc team's sample catalog. Do not remove.]
# snippet-sourceauthor:[Doug-AWS]
# snippet-sourcedescription:[Starts an EC2 instance.]
# snippet-keyword:[Amazon Elastic Compute Cloud]
# snippet-keyword:[instance method]
# snippet-keyword:[Instance.start]
# snippet-keyword:[Ruby]
# snippet-service:[ec2]
# snippet-keyword:[Code Sample]
# snippet-sourcetype:[full-example]
# snippet-sourcedate:[2018-03-16]
# Copyright 2010-2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#
# This file is licensed under the Apache License, Version 2.0 (the "License").
# You may not use this file except in compliance with the License. A copy of the
# License is located at
#
# http://aws.amazon.com/apache2.0/
#
# This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS
# OF ANY KIND, either express or implied. See the License for the specific
# language governing permissions and limitations under the License.

require 'aws-sdk-ec2'  # v2: require 'aws-sdk'

ec2 = Aws::EC2::Resource.new(region: 'us-west-2')
      
i = ec2.instance('i-123abc')
    
if i.exists?
  case i.state.code
  when 0  # pending
    puts "#{id} is pending, so it will be running in a bit"
  when 16  # started
    puts "#{id} is already started"
  when 48  # terminated
    puts "#{id} is terminated, so you cannot start it"
  else
    i.start
  end
end
