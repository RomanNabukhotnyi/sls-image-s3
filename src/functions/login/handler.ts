import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const cognito = new AWS.CognitoIdentityServiceProvider();

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { email, password } = event.body;
    const clientId = process.env.CLIENT_ID;

    const { AuthenticationResult } = await cognito.initiateAuth({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    }).promise();

    return {
        message: 'Success',
        token: AuthenticationResult.IdToken,
    };
};

export const main = middyfy(login, schema);