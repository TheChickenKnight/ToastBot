export class Economier {
    constructor(obj) {
        if (typeof obj == 'string')
            obj = JSON.parse(obj);
        this.exp = obj.exp || 0;
        this.commands = obj.commands || 0;
    }

    toString() {
        return JSON.stringify(this);
    }
}