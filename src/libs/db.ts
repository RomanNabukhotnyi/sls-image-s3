import * as AWS from 'aws-sdk';

const documentClient = new AWS.DynamoDB.DocumentClient();

export const Dynamo = {
    addFile: async (email: string, file: { key: string, url: string }) => {
        const user = await documentClient.get({
            TableName: process.env.TABLE_NAME,
            Key: {
                email,
            },
        }).promise();
        if (user.Item) {
            await documentClient.update({
                TableName: process.env.TABLE_NAME,
                Key: {
                    email, 
                },
                UpdateExpression: 'set files = list_append(files, :file)',
                ExpressionAttributeValues: {
                    ':file': [file],
                },
            }).promise();
        } else {
            await documentClient.put({
                TableName: process.env.TABLE_NAME,
                Item: {
                    email,
                    files: [file],
                },
            }).promise();
        }
    },
    getFiles: async (email: string) => {
        const user = await documentClient.get({
            TableName: process.env.TABLE_NAME,
            Key: {
                email,
            },
        }).promise();
        return user.Item?.files;
    },
    removeFile: async (email: string, index: number) => {
        await documentClient.update({
            TableName: process.env.TABLE_NAME,
            Key: {
                email, 
            },
            UpdateExpression: 'remove files[:index]',
            ExpressionAttributeValues: {
                ':index': index,
            },
        }).promise();
    },
};