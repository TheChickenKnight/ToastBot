import { Collection } from "discord.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("./data.json");

export class Miner {

    constructor(id) {
        if (id.length == 18) {
            this.health = {
                max: 10,
                current: 10
            };
            this.level = 0;
            this.status = 'idle';
            this.location = 'home';
            this.start = undefined;
            this.end = undefined;
            this.defense = 0;
            this.strength = 1;
            this.luck = 1;
            this.id = id;
            this.storage = {
                item: 'back',
                max: 10,
                current: 10,
                totalores: 0,
                totalweight: 0,
                ores: {}
            };
            this.discovered = {
                traps: new Collection(),
                ores: new Collection(),
                items: new Collection()
            };
            this.pickaxe = {
                name: "finger",
                type: "pickaxe",
                description: "The beginnings. The very beginning.",
                color: "#ffe6a1",
                consumable: false,
                level: 0,
                id: 0,
                stats: {
                    skill: {
                        operator: "+",
                        amount: 1
                    }
                },
                unlock: {
                    type: "multiple",
                    types: [
                        {
                            type: "drop",
                            locations: ["generic"]
                        },
                        {
                            type: "start",
                            level: 0
                        }
                    ]
                }
            };
            this.inventory = [
                {
                    name: "finger",
                    type: "pickaxe",
                    description: "The beginnings. The very beginning.",
                    color: "#ffe6a1",
                    consumable: false,
                    level: 0,
                    id: 0,
                    stats: {
                        skill: {
                            operator: "+",
                            amount: 1
                        }
                    },
                    unlock: {
                        type: "multiple",
                        types: [
                            {
                                type: "drop",
                                locations: ["generic"]
                            },
                            {
                                type: "start",
                                level: 0
                            }
                        ]
                    }
                }
            ];
        } else {
            var string = JSON.parse(id);
            this.health = string.health;
            this.level = string.level;
            this.status = string.status;
            this.location = string.location;
            this.start = string.start;
            this.end = string.end;
            this.defense = string.defense;
            this.strength = string.strength;
            this.luck = string.luck;
            this.id = string.id;
            this.storage = string.storage;
            this.discovered = {
                traps: new Collection(string.discovered.traps),
                ores: new Collection(string.discovered.ores),
                items: new Collection(string.discovered.items)
            };
            this.pickaxe = string.pickaxe;
            this.inventory = string.inventory;
        }
    }

    toString() {
        return JSON.stringify(
          {
              health: this.health,
              level: this.level,
              status: this.status, 
              end: this.end,
              defense: this.defense,
              strength: this.strength,
              luck: this.luck,
              id: this.id,
              storage: this.storage,
              discovered: this.discovered,
              pickaxe: this.pickaxe,
              inventory: this.inventory
          }  
        );
    }

    checkMining() {
        const hours = (Date.now() - this.start) / 3600000;
            for (let i = 0; i < hours; i++) {
                const random = Math.floor(Math.random() * 100) + 1;
                if (this.storage > 0) {
                    let ores = [];
                    let weight = this.storage.current;
                    let totalOres = 0;
                    Object.keys(data.mines[interaction.customId.split('_')[3]].ores).forEach(ore => {
                        if (data.mines[interaction.customId.split('_')[3]].ores[ore].min <= random && random <= data.mines[interaction.customId.split('_')[3]].ores[ore].max && this.storage.empty - weight >= 0) {
                            ores.push(ore);
                            weight-=data.ores[ore].weight;
                            totalOres++;
                        }
                    });
                } else 
                    break;
            }
            const random = Math.floor(Math.random() * 7) - 2;
            if (Date.now() - this.start / 7200000 + random > this.storage.current) {
                this.status = 'full';
                this.end = this.storage.totalores * 3600000 + this.start;
            }
    }
    
}