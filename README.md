# Vector Cloud Salesforce Inform microervice (vsi)
This service is used to inform salesforce of tasks to fulfill. It
- sends simple emails by way of salesforce to customers,
- unsubscribes salesforce customers from our aws productions according to aws customer identifier

Needs have some vsi queues provided:
- VSI send emails SQS queue
  - must be sent from VPS lambda functions customer subscriptions listener and manage-phase
- VSI unsubscribe SQS queue 
  - must be sent from VPS lambda function customer subscriptions listener 

## Testing
To install the project with all (node) dependencies for local (lambda) testing, run

#### Testing the lambda function 
Ensure that in file '.env' the environment values are set correctly. Then run:

    // 
    node run.js --fn=sf-request-access-code-helper
    
    // 
    node run.js --fn=sf-request-query-helper-sf-customer-id

    // 
    node run.js --fn=sf-request-query-helper-aws-customer-identifier
    
    // 
    node run.js --fn=sf-request-q-access-code-send-email
 
    // 
    node run.js --fn=sf-request-q-access-code-unsubscribe
    
###Negative tests [lambda function ]

    // 
    node run.js --fn=sf-request-q-access-code-send-email-wo-subject

    // 
    node run.js --fn=sf-request-q-access-code-send-email-wo-message

    // 
    node run.js --fn=sf-request-q-access-code-send-email-wo-customer-id
   
## Continuous Integration and Continuous Deployment
For CI and CD of Vector salesforce inform service follow the steps on 
https://alm.actian.com/confluence/pages/viewpage.action?pageId=57776737 to create an aws code pipeline.

#### Setting-up the stack (runtime environment) in AWS with CloudFormation templates

Note: The dependencies of all these templates / stacks are explicitly declared in their template descriptions.

The dependencies are due to the fact that some stacks export output values or store SSM parameters which are needed by the following templates / stacks which import these values or use the SSM parameters as input parameters.

The easiest way is to create the stacks in the order from top to bottom, and to delete them in reverse order. But they may be rearranged as long as the declared dependencies are respected.

CF templates to set-up required stacks for VSI:

    vsi-credentials-cloudformation.json → Set up credentials necessary to access salesforce identity services . Depends on stacks: [lambda]
    vsi-queues-cloudformation.json → Create Queues for Vector Salesforce Inform microervice.
    vsi-code-pipeline-cloudformation.json → Create a code pipeline to deploy VSI for an environment. Depends on stacks: [dist, iam-policies, vsi-queues, vsi-credentials, dist-bucket]

####Performing the steps to create the stacks with AWS cli for each deployment stage environment
    
In a command line console, cd to the directory containing the cloudformation template files, submit these commands after editing them (chose stack-names, change the parameter values e.g. EnvironmentName <env>, provide access keys):

    aws cloudformation create-stack --stack-name <env>-vsi-credentials --template-body file://vsi-credentials-cloudformation.json --parameters ParameterKey=EnvironmentName,ParameterValue=<env> ,ParameterKey=EnvironmentStage,ParameterValue=<stage> ...
    aws cloudformation create-stack --stack-name <env>-<stage>-vsi-queues --template-body file://vsi-queues-cloudformation.json --parameters ParameterKey=EnvironmentName,ParameterValue=<env> ...
    aws cloudformation create-stack --stack-name <env>-vsi-pipeline--template-body file://vsi-pipeline-cloudformation.json --parameters ParameterKey=EnvironmentName,ParameterValue=<env> ...

#### Build and upload distribution

    npm run dist
    aws s3 sync ./dist s3://${bucketNamePrefix}-${awsAccount}-dist-${env}-us-east-1 --region us-east-1
    
    // Concrete example:
    aws s3 sync ./dist s3://actian-dc-vector-273201455850-dist-dev-us-east-1  --region us-east-1 --proflie <aws-profile>