import AWS from 'aws-sdk';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import * as fs from 'fs';
import {ObjectIdentifier} from "aws-sdk/clients/s3.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../env/bucketPass.env');
dotenv.config({ path: envPath });

const  S3Config = {
    key: process.env.AWS_ACCESS_KEY_ID || '',
    accessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
}

const Bucket: string = process.env.AWS_BUCKET_NAME
const Prefix: string = process.env.AWS_PREFIX_NAME

AWS.config.update({
    accessKeyId: S3Config.key,
    secretAccessKey: S3Config.accessKey
});

const s3 = new AWS.S3();

async function showCase(){
    await listObjects();
    await uploadFile('./TestUpload.txt',"LoremIpsum2")
    await uploadFile('./TestUpload.txt',"LoremIpsum3")
    await listFilteredFiles("Lore")
        .then((key: ObjectIdentifier[]) =>
        {
            console.log(key)
        })
    await  deleteFilteredFiles("Lore")
    await listObjects();
}

showCase();

async function listObjects() {
    console.log("Listing Files")
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
async function uploadFile (filePath: string, s3Key: string)  {
    console.log("Uploading File")
    try {
        const fileContent = fs.readFileSync( filePath, 'utf8');
        const ext = filePath.split(".")
        const params = {
            Bucket: Bucket,
            Key: Prefix + s3Key + `.${ext.pop()}`,
            Body: fileContent
        };
        await s3.upload(params).promise()
            .then(res => {
                console.log(res)
        });
        console.log(`File uploaded successfully: ${s3Key}`);
    } catch (err) {
        console.error('Error uploading file:', err);
    }
};

async function listFilteredFiles( regex: string): Promise<ObjectIdentifier[]> {
    console.log("Filtering item")
    let files = []
    try {
        const params = {
            Bucket: Bucket,
            Prefix: Prefix
        };
        const data = await s3.listObjectsV2(params).promise();
        const pattern = new RegExp(regex);
        data.Contents?.forEach(file => {
            if (pattern.test(file.Key)) {
                files.push({Key: file.Key})
            }
        });
        return files;
    } catch (err) {
        console.error('Error listing filtered files:', err);
        return [];
    }

}

async function deleteFilteredFiles(regex: string)  {
    try {
        const filesToDelete: ObjectIdentifier[] = await listFilteredFiles(regex)
        console.log("Files to delete", filesToDelete)

        if (filesToDelete.length === 0) {
            console.log('No files matching the pattern.');
            return;
        }
        const deleteParams = {
            Bucket: Bucket,
            Delete: { Objects: filesToDelete }
        };

        await s3.deleteObjects(deleteParams).promise();
        console.log('Files deleted successfully.');
    } catch (err) {
        console.error('Error deleting files:', err);
    }
}