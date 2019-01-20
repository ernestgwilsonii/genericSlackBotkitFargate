////////////////////////////////////////////////////////////////////////////////
require('dotenv').config();
const { slackGetUsersInfo } = require('../lib/slackGetUsersInfo');
const { chatOpsLogger } = require('../lib/chatOpsLogger');
let botName = process.env.AWS_SECRETS_MANAGER_ID;
let debug = false;
let chatOpsCommand = "bot uptime"; // Set this value for accurate reporting
////////////////////////////////////////////////////////////////////////////////

module.exports = function (controller) {
    controller.hears(['bot uptime'], 'direct_message,direct_mention', (bot, message) => {
        if (debug) { console.log("DEBUG: message: " + JSON.stringify(message, null, 2)); };

        // Internal helper function to format the uptime results
        function formatUptime(uptime) {
            let unit = 'second';
            if (uptime > 60) {
                uptime = uptime / 60;
                unit = 'minute';
            }
            if (uptime > 60) {
                uptime = uptime / 60;
                unit = 'hour';
            }
            if (uptime !== 1) {
                unit = unit + 's';
            }
            uptime = uptime + ' ' + unit;
            return uptime;
        }

        (async function () {
            try {
                // Get the person's Slack user information
                let personDetails = await slackGetUsersInfo(message);
                if (debug) { console.log("DEBUG: personDetails: " + JSON.stringify(personDetails, null, 2)); };
                let firstName = personDetails.user.profile.first_name;

                // Validate intended command parameters
                let thisRequestArr = message.text.split(" ");
                if (debug) { console.log("DEBUG: thisRequestArr: " + JSON.stringify(thisRequestArr, null, 2)); };
                if (thisRequestArr[2]) {
                    let helpMsg = `*${chatOpsCommand}* does not require additional parameters, for more information please see:\n \`\`\`@${botName} help ${thisRequestArr[0]}\`\`\``;
                    let reply = `Hello ${firstName}, ${helpMsg}`;
                    bot.reply(message, reply);
                    // Log the interaction
                    message.personDetails = personDetails;
                    message.chatOpsCommand = chatOpsCommand;
                    message.reply = reply;
                    return chatOpsLogger(message);
                };

                // Reply to the person
                let reply = `Hello ${firstName}, I have been up for ${formatUptime(process.uptime())}`;
                bot.reply(message, reply);

                // Log the interaction
                message.logLevel = "INFORMATIONAL";
                message.personDetails = personDetails;
                message.chatOpsCommand = chatOpsCommand;
                message.reply = reply;
                chatOpsLogger(message);
            } catch (err) {
                console.error(err);
                let errMsg = ":disappointed: Bummer...\n```" + err + "```";
                bot.reply(message, errMsg);
            }
        })();
    });
};