import { Schema } from 'joi';
import { ParameterError } from '../defaults';

export class Validation {
    private schema: Schema;

    constructor(schema: Schema) {
        this.schema = schema;
    }

    validate(request: any) {
        const { value, error } = this.schema.validate(request, {
            abortEarly: false,
            errors: {
                wrap: {
                    label: '',
                },
            },
        });

        if (error) {
            throw new ParameterError(error);
        }

        return value;
    }
}
