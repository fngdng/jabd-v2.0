import loginToRelay from "@badaimweeb/fca_xfrelay";
import fs from "fs";
import { dirname, resolve, join } from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import child_process from 'node:child_process';

//dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

//config data and runbot in same class
class bot {
    constructor() {
        this.start();
    }
    async start() {
        console.log("Starting JABD-Bot v2.0 with fca-xfrelay.")
        console.log("This bot made by f0ng and fca-xfrelay from BadAimWeeb.")
        console.log("All rights reserved.")
        console.log("©Copyright to f0ng - 2024.")
        return this.config()
    }
    async cmd(message, arg) {
        if (global.command.get(arg[0]) != undefined) {
            (await import(global.command.get(arg[0]).url)).main(message, arg);
          } else {
            message.reply("Command not found!");
          }
    }
    async run() {
        //use global
        global.config = JSON.parse(fs.readFileSync("config.json"));
        global.data = fs.readFileSync("data.json");
        const api = await loginToRelay(global.config.login);
        api.on("message", (message) => {
            if (message.isSelf) {
                return;
            } else {
                if(message.content.slice(0, global.config.prefix.length) == global.config.prefix) {
                    var arg = message.content.slice(global.config.prefix.length).trim().split(/ +/);
                    return this.cmd(message, arg);
                }
            }
        });
    }
    async commandmap() {
        global.command = new Map();
        var file = fs.readdirSync(resolve(__dirname, "./commands"))
        for (var i = 0; i < file.length; i++) {
            if(file[i].endsWith(".js")) {
            var command = pathToFileURL(resolve(__dirname, "./commands", file[i]));
            var commandconfig = (await import(command)).config();
            var commandurl = command
            var commandname = commandconfig.name;
            global.command.set(commandname, commandconfig);
            global.command.get(commandname).url = commandurl.href;
            }
        }
        console.log(global.command)
        return this.loadnode_moduleincommand();
    }
    async loadnode_moduleincommand() {
        for (var [key, value] of global.command) {
            if (value.node_module) {
                for (var i = 0; i < value.node_module.length; i++) {
                    if (!fs.existsSync(resolve(__dirname, `./node_modules/${value.node_module[i]}`))) {
                        console.log(`installing ${value.node_module[i]} for ${key}...`);
                        child_process.execSync(`npm install ${value.node_module[i]}`, { stdio: "inherit" });
                    }
                }  
            }
        }
        return this.run();
    }
    async data() {
        if (fs.existsSync("data.json")) {
            return this.commandmap();
        } else { 
            let data = {};
            fs.writeFileSync("data.json", JSON.stringify(data, null, 4))
            return this.commandmap();
        }
    }
    async config() {
        //create config.json file use module, no gen if already exist
        if (fs.existsSync("config.json")) {
            return this.data();
        } else {
            let config = {
                "prefix": "!",
                "login": {
                    "relayAddress": "ws://localhost:3000/!4f5f569bf57553cb0300697973e1e3f0f8cf83872a40603abdd2c771602d2ab0",
                    "accountID": "93ebd050-910f-476b-b09a-f55063f643d5",
                    "encryptionKey": "fbd453817c4b1fe1f937142b980006f65e77c0bc3dd9cfe050a7e4c0ec13c712"
                },
                "owner": "your id"
            }
            fs.writeFileSync("config.json", JSON.stringify(config, null, 4))
            return this.data();
        }
    }
}

new bot();
