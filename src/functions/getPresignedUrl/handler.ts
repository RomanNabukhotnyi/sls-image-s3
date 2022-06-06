import * as AWS from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';

const S3 = new AWS.S3();

const getPresignedUrl = async (event:  APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const key = `${email}/${event.queryStringParameters?.key ?? uuid()}`;
    const url = S3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Conditions: [
            ['starts-with', '$Content-Type', 'image/'],
        ],
        Fields: {
            key,
        },
    });

    return {
        url,
    };
};

export const main = middyfy(getPresignedUrl);