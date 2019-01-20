// help network
require('dotenv').config();
let botName = process.env.AWS_SECRETS_MANAGER_ID;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// direct_mention
const botHelp_network_direct_mention = `\n Here are the *help network* commands via direct mention:\n
\`\`\`
@${botName} help network                     <-- Displays this help menu
@${botName} network mtr SomeTarget           <-- Performs an MTR
@${botName} network ping SomeTarget          <-- Pings a name or IP address
@${botName} network traceroute SomeTarget    <-- Performs a traceroute to a name or IP address
\`\`\`
`;
module.exports.botHelp_network_direct_mention = botHelp_network_direct_mention;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// direct_message
const botHelp_network_direct_message = `\n Here are the *help network* commands via direct message:\n
\`\`\`
help network                     <-- Displays this help menu
network mtr SomeTarget           <-- Performs an MTR
network ping SomeTarget          <-- Pings a name or IP address
network traceroute SomeTarget    <-- Performs a traceroute to a name or IP address
\`\`\`
`;
module.exports.botHelp_network_direct_message = botHelp_network_direct_message;
////////////////////////////////////////////////////////////////////////////////