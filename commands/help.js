export function config() {
    return {
        name: "help",
        description: "Display all commands",
        node_module: []
    }
}
export function main(message, args) {
    var help = global.command.keys();
    var help_res = ``;
    var a = 1
    for (var i of help) {
        help_res += `${a}. ${i}\n`;
        a++;
    }
    message.reply(help_res);
}