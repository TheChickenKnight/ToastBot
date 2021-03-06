import { Collection } from "discord.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const data = require("../data.json");

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
                current: 0,
                totalweight: 0,
                ores: new Collection()
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
        const hours = (Date.now() - this.start) / 3600000,
            mine = data.mines[this.location];
        let ores = [];
        for (let i = 0; i < hours; i++) {
            const random = Math.floor(Math.random() * 100) + 1;
            ores.push(Object.keys(mine.ores).filter(ores => ores.chance.min < random && ores.chance.max > random)[0]);
        }
        if (this.storage.current + ores.length > this.storage.max)
            return 'full';
        
    }
    
}