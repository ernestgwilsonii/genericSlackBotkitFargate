////////////////////////////////////////////////////////////////////////////////
const Slack = require('slack'); // https://www.npmjs.com/package/slack
const { getAwsSecrets } = require('./getAwsSecrets');
let debug = false;
////////////////////////////////////////////////////////////////////////////////

async function slackGetUsersInfo(message) {
    if (debug) { console.log("slackGetUsersInfo message: " + JSON.stringify(message, null, 2)); };

    // Try to get a Slack token via environment variable (dev)
    if (process.env.slackToken) {
        if (debug) { console.log("INFORMATIONAL: Slack environment variable slackToken found"); };
        let slackToken = process.env.slackToken;
        let slack = new Slack({ slackToken });
        let user = message.user;
        let res = await slack.users.info({ slackToken, user }); // https://api.slack.com/methods/users.info
        if (debug) { console.log("slackGetUsersInfo res: " + JSON.stringify(res, null, 2)); };
        return (res);
    } else {
        // Try to get Slack token via AWS Secrets Manager (prod)
        if (debug) { console.log("NOTICE: Attempting to get Slack token via AWS Secrets Manager"); };
        let secrets = await getAwsSecrets();
        let keys = Object.keys(secrets);

        keys.forEach(key => {
            process.env[key] = secrets[key]
        });

        let slackToken = process.env.slackToken;
        let slack = new Slack({ slackToken });
        let user = message.user;
        let res = await slack.users.info({ slackToken, user }); // https://api.slack.com/methods/users.info
        if (debug) { console.log("slackGetUsersInfo res: " + JSON.stringify(res, null, 2)); };
        return (res);

        if (!process.env.slackToken) {
            // Failed to get a Slack token via environment variable and AWS Secrets Manager
            console.error("ERROR slackToken: Specify a Slack bot token!");
        }
    }
}
module.exports.slackGetUsersInfo = slackGetUsersInfo;
////////////////////////////////////////////////////////////////////////////////