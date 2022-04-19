class NotFoundError extends Error {
    constructor() {
        super();
        this.status = 404;
        this.message = "User not found";
    }
}

class InputError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

class DuplicateError extends Error {
    constructor() {
        super();
        this.status = 409;
        this.message = "The user already exists.";
    }
}

module.exports = {
    NotFoundError,
    InputError,
    DuplicateError,
};
