// HELP BOT
require('dotenv').config();
let botName = process.env.AWS_SECRETS_MANAGER_ID;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// direct_mention
const botHelp_bot_direct_mention = `\n Here are the *help bot* commands via direct mention:\n
\`\`\`
@${botName} help bot      <-- Displays this help menu
@${botName} hello         <-- Bot says hello back
@${botName} bot uptime    <-- Displays the bot uptime
\`\`\`
`;
module.exports.botHelp_bot_direct_mention = botHelp_bot_direct_mention;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// direct_message
const botHelp_bot_direct_message = `\n Here are the *help bot* commands via direct message:\n
\`\`\`
help bot      <-- Displays this help menu
hello         <-- Bot says hello back
bot uptime    <-- Displays the bot uptime
\`\`\`
`;
module.exports.botHelp_bot_direct_message = botHelp_bot_direct_message;
////////////////////////////////////////////////////////////////////////////////