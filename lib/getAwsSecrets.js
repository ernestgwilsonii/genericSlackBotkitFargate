require('dotenv').config();
const AWS = require('aws-sdk'); // https://aws.amazon.com/sdk-for-node-js/
let awsDefaultRegion = process.env.AWS_DEFAULT_REGION;
let awsSecretsManagerId = process.env.AWS_SECRETS_MANAGER_ID;

// https://docs.aws.amazon.com/secretsmanager/latest/userguide/tutorials_basic.html
let secretsManager = new AWS.SecretsManager({ region: awsDefaultRegion });

async function getAwsSecrets() {
    try {
        let results = await secretsManager.getSecretValue({ SecretId: awsSecretsManagerId }).promise();
        return JSON.parse(results.SecretString);
    }
    catch (err) {
        throw new Error(err);
    }
}
module.exports.getAwsSecrets = getAwsSecrets;