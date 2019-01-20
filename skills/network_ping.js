////////////////////////////////////////////////////////////////////////////////
require('dotenv').config();
const exec = require("child_process").exec;
const moment = require('moment-timezone');
const { slackGetUsersInfo } = require('../lib/slackGetUsersInfo');
const { chatOpsLogger } = require('../lib/chatOpsLogger');
let botName = process.env.AWS_SECRETS_MANAGER_ID;
let debug = false;
let chatOpsCommand = "network ping"; // Set this value for accurate reporting
////////////////////////////////////////////////////////////////////////////////

module.exports = function (controller) {
    controller.hears(['network ping'], 'direct_message,direct_mention', (bot, message) => {
        if (debug) { console.log("DEBUG: message: " + JSON.stringify(message, null, 2)); };
        (async function () {
            try {
                // Get the person's Slack user information
                let personDetails = await slackGetUsersInfo(message);
                if (debug) { console.log("DEBUG: personDetails: " + JSON.stringify(personDetails, null, 2)); };
                let firstName = personDetails.user.profile.first_name;

                // Validate intended command parameters
                let thisRequestArr = message.text.split(" ");
                if (debug) { console.log("DEBUG: thisRequestArr: " + JSON.stringify(thisRequestArr, null, 2)); };
                if (thisRequestArr[3]) {
                    let helpMsg = `Sorry, *${chatOpsCommand}* requires exactly *one* target!, for more information please see:\n \`\`\`@${botName} help ${thisRequestArr[0]}\`\`\``;
                    let reply = `Hello ${firstName}, ${helpMsg}`;
                    bot.reply(message, reply);
                    // Log the interaction
                    message.personDetails = personDetails;
                    message.chatOpsCommand = chatOpsCommand;
                    message.reply = reply;
                    return chatOpsLogger(message);
                };

                // REGEX Validator
                let target = thisRequestArr[2];
                let re = /[\;\$\&\|\?\<\>\!\@\#\%\^\(\)\'\"\:\~\`\+\{\}\[\]']/; // Use regex to look for unsafe characters
                let detector = target.match(re);
                if (detector) {
                    let thisWarning = `*${chatOpsCommand}* requires *valid* characters as the target, for more information please see:\n \`\`\`@${botName} help ${thisRequestArr[0]}\`\`\``;
                    let reply = `Sorry ${firstName}, ${thisWarning}`;
                    bot.reply(message, reply);
                    // Log the interaction
                    message.logLevel = "WARNING";
                    message.personDetails = personDetails;
                    message.chatOpsCommand = chatOpsCommand;
                    message.reply = reply;
                    return chatOpsLogger(message);
                };

                // Reply to the human
                let reply = `Hello ${firstName}, just a moment please while I try to ping ${target}`;
                bot.reply(message, reply);

                // Prepare to execute a native OS command
                let linPingCommand = "ping -c 10 " + target; // Use this command on Linux
                let execThisCommand = linPingCommand;

                // Perform the command via child process exec
                exec(execThisCommand, function (error, stdout, stderr) {
                    if (stderr) {
                        let thisErrMsg = stderr;
                        let reply = `Sorry ${firstName}, network ping FAILED:\n\`\`\`${thisErrMsg}\`\`\``;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "WARNING";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        return chatOpsLogger(message);
                    }
                    let results = stdout;
                    let reply = `${firstName}, here are the *network ping ${target}* results you requested:\n\`\`\`${results}\`\`\``;
                    bot.reply(message, reply);
                    // Log the interaction
                    message.logLevel = "INFORMATIONAL";
                    message.personDetails = personDetails;
                    message.chatOpsCommand = chatOpsCommand;
                    message.reply = reply;
                    return chatOpsLogger(message);
                });
            } catch (err) {
                console.error(err);
                let errMsg = ":disappointed: Bummer...\n```" + err + "```";
                bot.reply(message, errMsg);
            }
        })();
    });
};