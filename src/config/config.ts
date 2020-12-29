export interface ConfigStructure {
    save?: Function;
    web: {
        port: number;
    }
    modLED: {
        size: {
            x: number;
            y: number;
        },
        modules: {host: string, port: number}[];
    }
}

const configDefaults: ConfigStructure = {
    web: {
        port: 8080
    },
    modLED: {
        size: {
            x: 0,
            y: 0
        },
        modules: []
    }
}


import * as fs from 'fs';

export class ConfigProvider {
    private confFile = './src/config/config.json';
    public conf: ConfigStructure = configDefaults;

    constructor() {
        this.load();
        this.conf.save = () => this.save();
    }

    private initConfigFile() {
        fs.writeFileSync(this.confFile, JSON.stringify(this.conf, null, 4));
    }

    private load() {
        try {
            let data = fs.readFileSync(this.confFile, 'utf8');
            // load data without overwriting nonexistent default values
            Object.assign(this.conf, JSON.parse(data)); 
        }
        catch (e) {
            if(e.code == 'ENOENT') {
                console.log(`[Config] Warning: Config file not found at path ${this.confFile} - Creating...`);
                this.initConfigFile();
            }
            else {
                console.error("Error loading config file");
                console.trace(e);
            }
        }
    }

    async save() {
        try {
            await fs.promises.copyFile(this.confFile, this.confFile + '.bak');
            // pretty print json file, also automatically ignores save function
            await fs.promises.writeFile(this.confFile, JSON.stringify(this.conf, null, 4));
        }
        catch (e) {
            if(e.code == 'EBUSY') {
                console.log('[Config] Warning: Resource Busy, probably too many save() calls at once!');
            }
            else {
                console.trace(e);
            }
        }
    }
}

let configProvider = new ConfigProvider();
export let config = configProvider.conf;