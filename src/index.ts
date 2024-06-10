import AWS from 'aws-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../env/bucketPass.env');
dotenv.config({ path: envPath });

const  S3Config = {
    key: process.env.AWS_ACCESS_KEY_ID || '',
    accessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
}

//TODO na ENV !!!!!
AWS.config.update({
    accessKeyId: S3Config.key,
    secretAccessKey: S3Config.accessKey
});

const s3 = new AWS.S3();

const params = {
    Bucket: 'developer-task',
    Prefix: 'x-wing/'
};
async function listObjects() {
    try {
        const data = await s3.listObjectsV2(params).promise();
        console.log('Success', data);
    } catch (err) {
        console.error('Error', err);
    }
}

// Call the function to list objects
listObjects();