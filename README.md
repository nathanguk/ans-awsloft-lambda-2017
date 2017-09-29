# ans-awsloft-lambda-2017
# ANS - Lambda Functions for AWS Loft (London) 2017

Nathan Gaskill (Chief Engineer - ANS Group)

[www.ans.co.uk](www.ans.co.uk)

This repository contains sample JavaScript Lambda functions used in the ANS - AWS Loft (London - 26th September 2017) Presentation.

## Follow instructions below to install and test this code

** WARNING THIS CODE IS FOR DEMONSTRATION PURPOSES ONLY, PLEASE ENSURE THIS IS CODE IS ONLY RUN IN A TEST ACCOUNT.

1) Create a Free AWS Account [here.](http://aws.amazon.com/free)
2) Create one or more EC2 Instances.
3) Create some EBS volumes and attach to the EC2 instance.
4) Create some EBS Snapshots.
5) Add a new tag snap-retention to your EC2 instance with a numeric value, this represents the retention age of the snapshot, so a value of 1 = 1 Hour.
6) Deploy the cloudFormation template from here. 
    * [Deploy CloudFormation](https://us-west-2.console.aws.amazon.com/cloudformation/home?region=eu-west-2#/stacks/new?stackName=ans-awsloft-lambda-2017&templateURL=https://s3.eu-west-2.amazonaws.com/nathanguk/ans-awsloft-lambda-2017/lambda-demo.template)
    * [Download CloudFormation](https://s3.eu-west-2.amazonaws.com/nathanguk/ans-awsloft-lambda-2017/lambda-demo.template)
7) Configure Test Event, download sample test event [here](https://s3.eu-west-2.amazonaws.com/nathanguk/ans-awsloft-lambda-2017/test-event.json) 
8) Test the ec2-update-resources-tags function, this will copy the tags from the instance onto the EBS Volumes and EBS Snapshots.
9) Test the ec2-snapshots-retention-tags function, this will delete any EBS Snapshots that have a snap-retention tag where the snapshot is older than the value in hours.

