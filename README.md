# genericSlackBotkitFargate
* Based on [Botkit](https://botkit.ai) for [Slack](https://slack.com) 
* Real Time Messaging (RTM via outbound WebSocket, not inbound HTTP ports as with events API)
* Docker / AWS Fargate and Secrets Manager via AWS CLI and CloudFormation

## Before You Begin
Make sure you have the following in place
*   GIT CLI and BASH shell (any OS)
    *   [GIT and GIT BASH including Windows](https://git-scm.com/downloads)
*   An AWS CLI Account (Admin)
    *   [Create Admin  Instructions](https://docs.aws.amazon.com/IAM/latest/UserGuide/getting-started_create-admin-group.html)
*   A working version of the AWS CLI on your local computer
    *   [AWS CLI Instructions](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)
*   Docker running on your local computer
    *   [Docker on MAC Instructions](https://docs.docker.com/docker-for-mac/install/)
    *   [Docker on Windows Instructions](https://docs.docker.com/docker-for-windows/install/)
*   Node.JS running on your local computer
    *   [Download Node.JS](https://nodejs.org/en/download/)

## Prerequisites Verification
* Functional [AWS CLI](https://aws.amazon.com/cli/) (likely an administrative account with API access)
```
# Note: Creating AWS credentials - https://serverless.com/framework/docs/providers/aws/guide/credentials/
pip install awscli
aws --version
aws configure
aws iam get-user
```
* Functional [ECS CLI](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_installation.html)
```
# Note: Creating AWS credentials - https://serverless.com/framework/docs/providers/aws/guide/credentials/
# For macOS:
sudo curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-darwin-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli

# For Linux systems:
sudo curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest
sudo chmod +x /usr/local/bin/ecs-cli

# For Windows systems using Windows PowerShell (as an administrator):
New-Item ‘C:\Program Files\Amazon\ECSCLI’ -type directory
Invoke-WebRequest -OutFile ‘C:\Program Files\Amazon\ECSCLI\ecs-cli.exe’ https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-windows-amd64-latest.exe
# Note: Add C:\Program Files\Amazon\ECSCLI to the Windows PATH and then restart PowerShell


# Verify the CLI version (all OSes):
ecs-cli --version

# REF: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ECS_CLI_Configuration.html
```


## Deployment

### Get Started
Clone this repository:
```
git clone https://github.com/ernestgwilsonii/genericSlackBotkitFargate.git
```

Install:
```
cd genericSlackBotkitFargate
npm install
```

### Choose an AWS region (make sure Fargate is available)
* Set AWS region
```
# This kit assumes and requires BASH shell (on any OS)
bash
export AWS_DEFAULT_REGION=us-east-1
echo $AWS_DEFAULT_REGION
```

### Choose a [name for your Slack bot and get a token](https://my.slack.com/apps/new/A0F7YS25R-bots)
* Set Slack bot name
```
export IMAGE_REPO_NAME=yourbotnamegoeshere
echo $IMAGE_REPO_NAME
```

### Define the AWS_DEFAULT_REGION and AWS_SECRETS_MANAGER_ID for AWS Fargate
* Edit .env
```
vi .env
AWS_DEFAULT_REGION=us-east-1
AWS_SECRETS_MANAGER_ID=yourbotnamegoeshere
```

### Amazon Secrets Manager
*   Edit `aws/secrets.json` file for use with AWS Secrets Manager
```
vi aws/secrets.json
{
    "slackToken": "xoxb-NNNNNNNNNNN-NNNNNNNNNNNN-XXXXXXXXXXXXXXXXXXXXXXXX"
}
```

*   Create a new secret in the AWS Secret Manager
```
aws secretsmanager --region $AWS_DEFAULT_REGION create-secret --name $IMAGE_REPO_NAME \
    --description "Slack Botkit Secrets" \
    --secret-string file://aws/secrets.json

# NOTE: Secrets can be used with ECS Fargate or Lambda and/or other
#       AWS services instead of and/or in addition to environment variables
```

*   Verify that the secret was created successfully
```
aws secretsmanager --region $AWS_DEFAULT_REGION get-secret-value --secret-id $IMAGE_REPO_NAME
```

### Amazon Elastic Container Registry

*   Create an Amazon Elastic Container Registry (ECR) for the Docker container
```
aws ecr create-repository --repository-name $IMAGE_REPO_NAME
aws ecr describe-repositories --repository-name $IMAGE_REPO_NAME
```

* Get (and set) your AWS Account ID value
```
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --output text --query 'Account')
echo $AWS_ACCOUNT_ID
```

* Build Docker Image
```
# Set build tag
export IMAGE_TAG=latest
echo $IMAGE_TAG

# Build container
docker build --no-cache -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG .
#docker images
#docker system prune --all
```

* Log-in to AWS ECR
```
export AWS_ECR_LOGIN=$(aws ecr get-login --no-include-email) && $AWS_ECR_LOGIN
```

* Upload docker container to AWS ECR
```
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG
```


### Amazon Elastic Container Service

* Deploy AWS CloudFormation stack via template

```
# Deploy
aws cloudformation deploy --stack-name=$IMAGE_REPO_NAME --template-file=aws/chatops-stack.yml --parameter-overrides ServiceName=$IMAGE_REPO_NAME ImageTag=$IMAGE_TAG --capabilities=CAPABILITY_IAM

# List
aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE
#aws cloudformation delete-stack --stack-name $IMAGE_REPO_NAME
```

## Testing Locally
```
# Set Slack bot token
export slackToken=xoxb-NNNNNNNNNNN-NNNNNNNNNNNN-XXXXXXXXXXXXXXXXXXXXXXXX
echo $slackToken

# Run the Docker container
docker run -it --rm --name $IMAGE_REPO_NAME -e slackToken=$slackToken $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$IMAGE_REPO_NAME:$IMAGE_TAG

# NOTES:
#/root/.local/bin/aws --version
#/root/.local/bin/aws configure
```