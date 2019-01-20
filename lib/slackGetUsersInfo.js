////////////////////////////////////////////////////////////////////////////////
const Slack = require('slack'); // https://www.npmjs.com/package/slack
const { getAwsSecrets } = require('./getAwsSecrets');
let debug = false;
////////////////////////////////////////////////////////////////////////////////

async function slackGetUsersInfo(message) {
    if (debug) { console.log("slackGetUsersInfo message: " + JSON.stringify(message, null, 2)); };

    // Try to get a slackToken via environment variable (dev)
    if (process.env.slackToken) {
        if (debug) { console.log("DEBUG: Slack environment variable slackToken found"); };
        let token = process.env.slackToken;
        let slack = new Slack({ token });
        let user = message.user;
        let res = await slack.users.info({ token, user }); // https://api.slack.com/methods/users.info
        if (debug) { console.log("slackGetUsersInfo res: " + JSON.stringify(res, null, 2)); };
        return (res);
    } else {
        // Try to get slackToken via AWS Secrets Manager (prod)
        if (debug) { console.log("DEBUG: Environment variable not found, attempting to get slackToken via AWS Secrets Manager"); };
        let secrets = await getAwsSecrets();
        let keys = Object.keys(secrets);

        keys.forEach(key => {
            process.env[key] = secrets[key]
        });

        let token = process.env.slackToken;
        let slack = new Slack({ token });
        let user = message.user;
        let res = await slack.users.info({ token, user }); // https://api.slack.com/methods/users.info
        if (debug) { console.log("slackGetUsersInfo res: " + JSON.stringify(res, null, 2)); };
        return (res);

        if (!process.env.slackToken) {
            // Failed to get a slackToken via environment variable and AWS Secrets Manager
            console.error("ERROR NOT FOUND: slackToken - Neither environment nor secret value found!");
        }
    }
}
module.exports.slackGetUsersInfo = slackGetUsersInfo;
////////////////////////////////////////////////////////////////////////////////