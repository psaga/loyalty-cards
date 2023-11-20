import { GetQueueUrlCommand, SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

class SQSService {
    private queueUrl: string;
    constructor(
        private readonly sqsClient: SQSClient,
    ) {
    }

    async sendMessage(key: string, idx: number, cardDataFromCsv: any) {
        const sendMessageParams = {
            QueueUrl: await this.getQueue(),
            DelaySeconds: 10,
            MessageAttributes: {
                File: {
                    DataType: "String",
                    StringValue: key,
                },
                Index: {
                    DataType: "String",
                    StringValue: idx.toString(),
                },
            },
            MessageBody: JSON.stringify(cardDataFromCsv),
        }
        const sendMessageCommand = new SendMessageCommand(sendMessageParams);
        await this.sqsClient.send(sendMessageCommand);
        console.info(`Added card ${idx} to SQS`);
    }

    async getQueue(): Promise<string> {
        if (!this.queueUrl) {
            const getQueueUrlCommand = new GetQueueUrlCommand({ QueueName: process.env.SQS_QUEUE_NAME });
            const getQueueUrlResponse = await this.sqsClient.send(getQueueUrlCommand);
            this.queueUrl = getQueueUrlResponse.QueueUrl as string;
        }
        return this.queueUrl;
    }
}
export default SQSService;