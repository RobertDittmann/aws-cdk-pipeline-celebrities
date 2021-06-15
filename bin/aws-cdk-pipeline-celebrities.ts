#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import {AwsCdkPipelineCelebritiesStack} from '../lib/stacks/pipeline/aws-cdk-pipeline-celebrities-stack';
import {CelebritiesRekognitionStack} from "../lib/stacks/celebrities-rekognition-stack";
import {AgwStack} from "../lib/stacks/agw-stack";

const ENV_NAME = process.env.ENV_NAME ? process.env.ENV_NAME.toLowerCase() : '';
const BRANCH_NAME = process.env.BRANCH_NAME ? process.env.BRANCH_NAME : '';
const REPO = process.env.REPO ? process.env.REPO : '';
const REPO_OWNER = process.env.REPO_OWNER ? process.env.REPO_OWNER : '';
const REPO_SECRET_NAME = process.env.REPO_SECRET_NAME ? process.env.REPO_SECRET_NAME : '';


const app = new cdk.App();

if (!ENV_NAME) {
    throw new Error("No ENV_NAME present");
} else if (!BRANCH_NAME) {
    throw new Error("No BRANCH_NAME present");
} else if (!REPO) {
    throw new Error("No REPO present");
} else if (!REPO_OWNER) {
    throw new Error("No REPO_OWNER present");
} else if (!REPO_SECRET_NAME) {
    throw new Error("No REPO_SECRET_NAME present");
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
    branchName: BRANCH_NAME,
    repo: REPO,
    repoOwner: REPO_OWNER,
    repoSecretName: REPO_SECRET_NAME
});

new CelebritiesRekognitionStack(app, 'CelebritiesRekognitionStack', {
    envName: ENV_NAME,
    branchName: BRANCH_NAME,
    repo: REPO,
    repoOwner: REPO_OWNER,
    repoSecretName: REPO_SECRET_NAME
});

new AgwStack(app, 'AgwStack', {
    envName: ENV_NAME,
    branchName: BRANCH_NAME,
    repo: REPO,
    repoOwner: REPO_OWNER,
    repoSecretName: REPO_SECRET_NAME
});

app.synth();
