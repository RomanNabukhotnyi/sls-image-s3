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