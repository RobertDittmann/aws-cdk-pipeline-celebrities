#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {AwsCdkPipelineCelebritiesStack} from '../lib/stacks/pipeline/aws-cdk-pipeline-celebrities-stack';

const ENV_NAME = process.env.ENV_NAME ? process.env.ENV_NAME.toLowerCase() : '';
const BRANCH_NAME = process.env.BRANCH_NAME ? process.env.BRANCH_NAME : '';


const app = new cdk.App();

if (!ENV_NAME) {
    console.error("No ENV_NAME present");
    throw new Error("No ENV_NAME present");
} else if (!BRANCH_NAME) {
    console.error("No BRANCH_NAME present");
    throw new Error("No BRANCH_NAME present");
}

new AwsCdkPipelineCelebritiesStack(app, 'AwsCdkPipelineCelebritiesStack', {
    /* If you don't specify 'env', this stack will be environment-agnostic.
     * Account/Region-dependent features and context lookups will not work,
     * but a single synthesized template can be deployed anywhere. */

    /* Uncomment the next line to specialize this stack for the AWS Account
     * and Region that are implied by the current CLI configuration. */
    // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },

    /* Uncomment the next line if you know exactly what Account and Region you
     * want to deploy the stack to. */
    // env: { account: '123456789012', region: 'us-east-1' },

    /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */

    envName: ENV_NAME,
    branchName: BRANCH_NAME
});
