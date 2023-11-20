import { SQSClient } from "@aws-sdk/client-sqs";

const createSQSClient = (): SQSClient => {
    const clientSQS = new SQSClient({region: process.env.REGION});
    return clientSQS; 
}

export default createSQSClient;