export default {
    type: 'object',
    properties: {
        email:{
            type: 'string',
            format: 'email',
        },
        password:{
            type: 'string',
            minLength: 6,
            maxLength: 12,
        },
    },
    required: ['email', 'password'],
} as const;

// import joi from 'joi';

// export default joi.object({
//     email: joi.string().email().max(100).required(),
//     password: joi.string().min(6).max(15).disallow(' ', '\"', '\'').required(),
// });