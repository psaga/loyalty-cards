import { S3Client } from "@aws-sdk/client-s3";

const createS3Client = (): S3Client => {
    const clientS3 = new S3Client({region: process.env.REGION});
    return clientS3; 
}

export default createS3Client;