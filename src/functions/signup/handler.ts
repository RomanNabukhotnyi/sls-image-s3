import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const cognito = new AWS.CognitoIdentityServiceProvider();

const signup: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { email, password } = event.body;
    const userPoolId = process.env.USER_POOL_ID;

    const { User } = await cognito.adminCreateUser({
        UserPoolId: userPoolId,
        Username: email,
        UserAttributes: [
            {
                Name: 'email',
                Value: email,
            },
            {
                Name: 'email_verified',
                Value: 'true',
            },
        ],
        MessageAction: 'SUPPRESS',
    }).promise();

    if (User) {
        await cognito.adminSetUserPassword({
            Password: password,
            UserPoolId: userPoolId,
            Username: email,
            Permanent: true,
        }).promise();
    }
    return {
        message: 'User registration successful',
    };
};

export const main = middyfy(signup, schema);