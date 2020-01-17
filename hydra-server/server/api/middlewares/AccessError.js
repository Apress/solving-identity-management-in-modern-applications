export class AccessError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        this.message = message;
    }
    toJSON() {
        return {
            code: this.code,
            message: this.message,
            name: this.name
        };
    }
}
