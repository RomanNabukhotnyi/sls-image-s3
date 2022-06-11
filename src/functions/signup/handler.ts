import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const cognito = new AWS.CognitoIdentityServiceProvider();

const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { email, password } = event.body;

    let result = await  cognito.signUp({
        ClientId: process.env.CLIENT_ID,
        Password: password,
        Username: email,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
        ],
    }).promise();

    return {
        message: 'User registration successful',
        result,
    };
};

export const main = middyfy(signup, schema);