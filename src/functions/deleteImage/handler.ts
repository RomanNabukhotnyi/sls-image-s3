import * as AWS from 'aws-sdk';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';

const S3 = new AWS.S3();

const deleteImage = async (event: APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const result = await S3.deleteObject({
        Bucket: process.env.BUCKET_NAME,
        Key: `${email}/${event.pathParameters.key}`,
    }).promise();
    return {
        message: 'Deleted Successfully',
        result,
    };
};

export const main = middyfy(deleteImage);