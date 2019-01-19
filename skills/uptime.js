module.exports = (controller) => {
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

    controller.hears(['uptime'], 'direct_message,direct_mention', (bot, message) => {
        bot.reply(message, 'I have been up for ' + formatUptime(process.uptime()));
    });
};