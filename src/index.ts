import AWS from 'aws-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../env/bucketPass.env');
dotenv.config({ path: envPath });

const  S3Config = {
    key: process.env.AWS_ACCESS_KEY_ID || '',
    accessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
}

const Bucket = process.env.AWS_BUCKET_NAME
const Prefix = process.env.AWS_PREFIX_NAME

AWS.config.update({
    accessKeyId: S3Config.key,
    secretAccessKey: S3Config.accessKey
});

const s3 = new AWS.S3();

async function listObjects() {
    const params = {
        Bucket: Bucket,
        Prefix: Prefix
    };
    try {
        const data = await s3.listObjectsV2(params).promise();
        console.log('Success', data);
    } catch (err) {
        console.error('Error', err);
    }
}

listObjects();

const uploadFile = async (filePath: string, s3Key: string) => {
    try {
        const fileContent = fs.readFileSync( filePath, 'utf8');
        const params = {
            Bucket: Bucket,
            Key: Prefix,
            Body: fileContent
        };
        await s3.upload(params).promise();
        console.log(`File uploaded successfully: ${s3Key}`);
    } catch (err) {
        console.error('Error uploading file:', err);
    }
};

uploadFile('./TestUpload.txt',"LoremIpsum")
listObjects();
