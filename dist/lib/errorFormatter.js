"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorFormatter = exports.ValidationError = void 0;
const type_graphql_1 = require("type-graphql");
const errors_1 = require("@apollo/server/errors");
const graphql_1 = require("graphql");
function formatValidationErrors(validationError) {
    return Object.assign(Object.assign(Object.assign({ property: validationError.property }, (validationError.value && { value: validationError.value })), (validationError.constraints && {
        constraints: validationError.constraints
    })), (validationError.children &&
        validationError.children.length !== 0 && {
        children: validationError.children.map((child) => formatValidationErrors(child))
    }));
}
class ValidationError extends graphql_1.GraphQLError {
    constructor(validationErrors) {
        super('Validation Error', {
            extensions: {
                code: 'BAD_USER_INPUT',
                validationErrors: validationErrors.map((validationError) => formatValidationErrors(validationError))
            }
        });
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
function errorFormatter(formattedError, error) {
    const originalError = (0, errors_1.unwrapResolverError)(error);
    if (originalError instanceof type_graphql_1.ArgumentValidationError) {
        return new ValidationError(originalError.validationErrors);
    }
    return formattedError;
}
exports.errorFormatter = errorFormatter;
//# sourceMappingURL=errorFormatter.js.map