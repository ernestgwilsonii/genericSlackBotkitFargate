////////////////////////////////////////////////////////////////////////////////
const Botkit = require('botkit');
const { getAwsSecrets } = require('./lib/getAwsSecrets');
const { slackGetUsersInfo } = require('./lib/slackGetUsersInfo');
const { chatOpsLogger } = require('./lib/chatOpsLogger');
let debug = false;
////////////////////////////////////////////////////////////////////////////////
(async function () {
    try {
        // Try to get a Slack token via environment variable (dev)
        if (process.env.slackToken) {
            console.log("INFORMATIONAL: Slack environment variable slackToken found");
        } else {
            // Try to get Slack token via AWS Secrets Manager (prod)
            console.log("NOTICE: Attempting to get Slack token via AWS Secrets Manager");
            let secrets = await getAwsSecrets();
            let keys = Object.keys(secrets);

            keys.forEach(key => {
                process.env[key] = secrets[key]
            });

            if (!process.env.slackToken) {
                // Failed to get a Slack token via environment variable and AWS Secrets Manager
                console.error("ERROR: Specify a Slack bot token!");
                devUsageTip();
                process.exit(1);
            }
        }

        // Create the Botkit controller
        let controller = Botkit.slackbot({
            debug: false,
            retry: 10,
            studio_token: process.env.studio_token
        });

        // Spawn a single instance of the bot and connect Slack
        let bot = controller.spawn({
            token: process.env.slackToken,
        }).startRTM();

        // Load the skills
        let normalizedPath = require("path").join(__dirname, "skills");
        require("fs").readdirSync(normalizedPath).forEach(function (file) {
            require("./skills/" + file)(controller);
        });

        // Display CLI help
        function devUsageTip() {
            console.log("Launch your bot like this:");
            console.log("npm install");
            console.log("export slackToken=YourSlackToken node index.js");
            console.log("Get a Slack token here: https://my.slack.com/apps/new/A0F7YS25R-bots");
        };
        ////////////////////////////////////////////////////////////////////////////////


        ////////////////////////////////////////////////////////////////////////////////
        // HELP MENU SECTIONS //
        ////////////////////////

        //////////////
        // help bot //
        //////////////
        controller.hears(['help bot'], 'direct_message,direct_mention', (bot, message) => {
            let chatOpsCommand = "help bot"; // Set this value for accurate reporting
            (async function () {
                try {
                    let personDetails = await slackGetUsersInfo(message);
                    if (debug) { console.log("personDetails: " + JSON.stringify(personDetails, null, 2)); };
                    let firstName = personDetails.user.profile.first_name;
                    // direct_mention
                    if (message.type === "direct_mention") {
                        const { botHelp_bot_direct_mention } = require('./help/botHelp_bot');
                        let reply = `Hello ${firstName} ${botHelp_bot_direct_mention}`;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "INFORMATIONAL";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        chatOpsLogger(message);
                    }
                    // direct_message
                    if (message.type === "direct_message") {
                        const { botHelp_bot_direct_message } = require('./help/botHelp_bot');
                        let reply = `Hello ${firstName} ${botHelp_bot_direct_message}`;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "INFORMATIONAL";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        chatOpsLogger(message);
                    }
                } catch (err) {
                    console.error(err);
                    let errMsg = ":disappointed: Bummer...\n```" + err + "```";
                    bot.reply(message, errMsg);
                }
            })();
        });

        //////////////////
        // help network //
        //////////////////
        controller.hears(['help network'], 'direct_message,direct_mention', (bot, message) => {
            let chatOpsCommand = "help network"; // Set this value for accurate reporting
            (async function () {
                try {
                    let personDetails = await slackGetUsersInfo(message);
                    if (debug) { console.log("personDetails: " + JSON.stringify(personDetails, null, 2)); };
                    let firstName = personDetails.user.profile.first_name;
                    // direct_mention
                    if (message.type === "direct_mention") {
                        const { botHelp_network_direct_mention } = require('./help/botHelp_network');
                        let reply = `Hello ${firstName} ${botHelp_network_direct_mention}`;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "INFORMATIONAL";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        chatOpsLogger(message);
                    }
                    // direct_message
                    if (message.type === "direct_message") {
                        const { botHelp_network_direct_message } = require('./help/botHelp_network');
                        let reply = `Hello ${firstName} ${botHelp_network_direct_message}`;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "INFORMATIONAL";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        chatOpsLogger(message);
                    }
                } catch (err) {
                    console.error(err);
                    let errMsg = ":disappointed: Bummer...\n```" + err + "```";
                    bot.reply(message, errMsg);
                }
            })();
        });

        ///////////////////////////////////////////////////
        // BOT HELP GLOBAL CATCH ALL AND UNKNOWN SECTION //
        ///////////////////////////////////////////////////
        // Catch "all" HELP function  - For "help" or anything unknown sent to the bot!
        controller.on('direct_message,direct_mention', (bot, message) => {
            let chatOpsCommand = "help"; // Set this value for accurate reporting
            (async function () {
                try {
                    let personDetails = await slackGetUsersInfo(message);
                    if (debug) { console.log("personDetails: " + JSON.stringify(personDetails, null, 2)); };
                    let firstName = personDetails.user.profile.first_name;
                    // direct_mention
                    if (message.type === "direct_mention") {
                        const { botHelp_direct_mention } = require('./help/botHelp');
                        let reply = `Hello ${firstName} ${botHelp_direct_mention}`;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "INFORMATIONAL";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        chatOpsLogger(message);
                    }
                    // direct_message
                    if (message.type === "direct_message") {
                        const { botHelp_direct_message } = require('./help/botHelp');
                        let reply = `Hello ${firstName} ${botHelp_direct_message}`;
                        bot.reply(message, reply);
                        // Log the interaction
                        message.logLevel = "INFORMATIONAL";
                        message.personDetails = personDetails;
                        message.chatOpsCommand = chatOpsCommand;
                        message.reply = reply;
                        chatOpsLogger(message);
                    }
                } catch (err) {
                    console.error(err);
                    let errMsg = ":disappointed: Bummer...\n```" + err + "```";
                    bot.reply(message, errMsg);
                }
            })();
        });

    } catch (err) {
        console.error(err);
    }
})();
////////////////////////////////////////////////////////////////////////////////
