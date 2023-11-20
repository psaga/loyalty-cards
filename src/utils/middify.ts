import { Handler } from "aws-lambda";
import * as MiddyTypes from '@middy/core';
import * as MiddyJsonTypes from '@middy/http-json-body-parser';

const middy = require('@middy/core') as typeof MiddyTypes.default;
const middyJsonBodyParser = require('@middy/http-json-body-parser') as typeof MiddyJsonTypes.default;

const middify = (handler: Handler) => {
    return middy(handler).use(middyJsonBodyParser());
};

export default middify;