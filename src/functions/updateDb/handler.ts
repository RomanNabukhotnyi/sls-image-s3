import { middyfy } from '../../libs/lambda';
import { Dynamo } from '../../libs/db';

const updateDb = async (event) => {
    const key = event.Records[0].s3.object.key;
    const email = decodeURIComponent(key.split('/')[0]);

    const file = {
        key,
        url: `https://${process.env.BUCKET_NAME}.s3.amazonaws.com/${key}`,
    };
    await Dynamo.addFile(email, file);
};

export const main = middyfy(updateDb);