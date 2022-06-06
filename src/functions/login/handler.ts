import * as AWS from 'aws-sdk';

import type { ValidatedEventAPIGatewayProxyEvent } from '../../libs/api-gateway';
import { middyfy } from '../../libs/lambda';

import schema from './schema';

const cognito = new AWS.CognitoIdentityServiceProvider();

const login: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    const { email, password } = event.body;
    const userPoolId = process.env.USER_POOL_ID;
    const clientId = process.env.CLIENT_ID;

    const { AuthenticationResult } = await cognito.adminInitiateAuth({
        AuthFlow: 'ADMIN_NO_SRP_AUTH',
        UserPoolId: userPoolId,
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