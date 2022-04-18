class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}

class InputError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}

class DuplicateError extends Error {
    constructor(message) {
        super(message);
        this.status = 409;
    }
}

module.exports = {
    NotFoundError,
    InputError,
    DuplicateError,
};
