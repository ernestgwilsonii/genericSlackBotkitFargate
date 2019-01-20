// GLOBAL HELP (CATCH-ALL)
require('dotenv').config();
let botName = process.env.AWS_SECRETS_MANAGER_ID;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// direct_mention
const botHelp_direct_mention = `\n Here are the global *help* commands via direct mention:\n
\`\`\`
@${botName} help            <-- Displays this help message
@${botName} help bot        <-- Displays help menu for bot specific actions
@${botName} help network    <-- Displays help menu for network related actions
\`\`\`
`;
module.exports.botHelp_direct_mention = botHelp_direct_mention;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// direct_message
const botHelp_direct_message = `\n Here are the global *help* commands via direct message:\n
\`\`\`
help            <-- Displays this help message
help bot        <-- Displays help menu for bot specific actions
help network    <-- Displays help menu for network related actions
\`\`\`
`;
module.exports.botHelp_direct_message = botHelp_direct_message;
////////////////////////////////////////////////////////////////////////////////