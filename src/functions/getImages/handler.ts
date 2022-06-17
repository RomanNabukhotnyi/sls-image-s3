import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';
import { Dynamo } from '../../libs/db';

const getImages = async (event: APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const files = await Dynamo.getFiles(email);
    return {
        files: files ?? [],
    };
};

export const main = middyfy(getImages);