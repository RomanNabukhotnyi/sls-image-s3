import * as AWS from 'aws-sdk';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';

const S3 = new AWS.S3();

const deleteImage = async (event: APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    await S3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: `${email}/${event.pathParameters.key}`,
    }).promise();

    return {
        message: 'Deleted Successfully',
    };
};

export const main = middyfy(deleteImage);