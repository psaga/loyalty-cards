import * as fs from 'fs';
import 'aws-sdk-client-mock-jest';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';
import * as testFn from 'lambda-tester';
import { handler } from '../handlers/s3-to-sqs';
import { S3EventRecord } from 'aws-lambda';
import { GetQueueUrlCommand, MessageAttributeValue, SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { parseCSV } from '../utils/csv';

const mockS3Client = mockClient(S3Client);
const mockSQSClient = mockClient(SQSClient);
const readStream = fs.createReadStream(`${__dirname}/test.csv`);
const stream = sdkStreamMixin(fs.createReadStream(`${__dirname}/test.csv`));

describe('S3 to SQS Handler', () => {
    beforeEach(() => {
        mockS3Client.reset();
        mockSQSClient.reset();
    })

    it('should a list of loyalty cards', async () => {
        const cardsString = await streamToString(readStream) as string;
        const cards = parseCSV(cardsString);

        const mockedQueue = 'mocked-queue';
        const mockedBucket = 'mocked-bucket';
        const mockedFileKey = '/uploads/cards.csv';
        const mockedS3PutEvent = {
            Records: [
                {
                    eventSource: 'aws:s3',
                    awsRegion: process.env.REGION,
                    eventName: 'ObjectCreated:Put',
                    s3: {
                        bucket: {
                            name: mockedBucket,
                        },
                        object: {
                            key: mockedFileKey,
                        },
                    },
                } as unknown as S3EventRecord
            ]
        }

        mockS3Client.on(GetObjectCommand).resolves({
            Body: stream as any,
        });

        mockSQSClient.on(GetQueueUrlCommand).resolves({
            QueueUrl: mockedQueue
        });

        await testFn(handler).event(mockedS3PutEvent).expectResult();

        expect(mockS3Client).toHaveReceivedNthSpecificCommandWith(1, GetObjectCommand, { Bucket: mockedBucket, Key: mockedFileKey });
        expect(mockSQSClient).toReceiveCommandTimes(GetQueueUrlCommand, 1);

        for (const [index, card] of cards.entries()) {
            const messageAttributes = {
                File: {
                    DataType: 'String',
                    StringValue: mockedFileKey
                },
                Index: {
                    DataType: 'String',
                    StringValue: index.toString()
                }
            } as Record<string, MessageAttributeValue>;

            const cardString = JSON.stringify(card);
            const lastMessagesSent = mockSQSClient.commandCalls(SendMessageCommand)[index];

            const { QueueUrl, MessageAttributes, MessageBody } = lastMessagesSent.args[0].input;
            expect(QueueUrl).toBe(mockedQueue);
            expect(MessageAttributes).toEqual(messageAttributes);
            expect(MessageBody).toBe(cardString);
        }
    });
});

function streamToString(stream: fs.ReadStream) {
    const chunks: any = [];
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        stream.on('error', (err) => reject(err));
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    })
}