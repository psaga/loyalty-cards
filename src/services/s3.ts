import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { S3EventRecord } from "aws-lambda";

class S3Service {
    constructor(
        private readonly s3Client: S3Client,
    ) { }

    async getObject(record: S3EventRecord): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: record.s3.bucket.name,
            Key: record.s3.object.key,
        });
        const responseS3 = await this.s3Client.send(command);
        const str = await responseS3?.Body?.transformToString();
        return str as string;
    }
}
export default S3Service;