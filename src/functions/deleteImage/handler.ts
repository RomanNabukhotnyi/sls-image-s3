import * as AWS from 'aws-sdk';
import type { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '../../libs/lambda';
import { Dynamo } from '../../libs/db';

const S3 = new AWS.S3();

const deleteImage = async (event: APIGatewayProxyEvent) => {
    const email = event.requestContext.authorizer.claims.email;
    const key = `${email}/${event.pathParameters.key}`;
    const files = await Dynamo.getFiles(email);
    const index = files.findIndex(file => file.key === key);
    if (index != -1) {
        await S3.deleteObject({
            Bucket: process.env.BUCKET_NAME,
            Key: key,
        }).promise();
        await Dynamo.removeFile(email, index);
        return {
            message: 'Deleted Successfully',
        };
    }
    return {
        message: 'File not found',
    };
};

export const main = middyfy(deleteImage);