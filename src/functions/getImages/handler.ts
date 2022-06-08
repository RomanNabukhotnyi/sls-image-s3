import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';
import { Dynamo } from '../../libs/db';

const getImages = async (event: APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const files = await Dynamo.getFiles(email);
    if (files && files.length != 0) {
        return {
            files,
        };
    }
    return {
        message: 'Empty',
    };
};

export const main = middyfy(getImages);