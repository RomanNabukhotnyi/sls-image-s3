import * as AWS from 'aws-sdk';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';

const S3 = new AWS.S3();

const deleteImage = async (event: APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const result = await S3.listObjects({
        Bucket: process.env.BUCKET_NAME,
        Prefix: email,
    }).promise();
    const images = [];
    for (let image of result.Contents) {
        const key = image.Key;
        const url = S3.getSignedUrl('getObject', {
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        });
        images.push({
            key,
            url,
        });
    }

    return {
        images,
    };
};

export const main = middyfy(deleteImage);