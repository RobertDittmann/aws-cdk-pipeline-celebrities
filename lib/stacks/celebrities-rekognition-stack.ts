import * as cdk from '@aws-cdk/core';
import {RemovalPolicy, StackProps} from '@aws-cdk/core';
import * as S3 from '@aws-cdk/aws-s3';
import {BucketAccessControl, BucketEncryption} from '@aws-cdk/aws-s3';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import {BillingMode} from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as IAM from '@aws-cdk/aws-iam';
import {Effect} from '@aws-cdk/aws-iam';
import {S3EventSource} from '@aws-cdk/aws-lambda-event-sources';

export interface CelebritiesRekognitionStackProps extends StackProps {
    readonly envName: string;
}

export class CelebritiesRekognitionStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: CelebritiesRekognitionStackProps) {
        const stackName = props.envName + '-celebrities-rekognition';
        super(scope, id, {
            stackName: stackName,
            ...props
        });

        // S3 BUCKET
        const bucket = new S3.Bucket(this, 'ImagesBucket', {
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            bucketName: props.envName + '-images', // it is string so ok
            accessControl: BucketAccessControl.PUBLIC_READ
        });

        // TABLE
        const table = new dynamodb.Table(this, 'RekognitionTable', {
            partitionKey: {name: 'id', type: dynamodb.AttributeType.STRING},
            billingMode: BillingMode.PAY_PER_REQUEST,
            tableName: `${props.stackName}`, // not string so need to point it that this is string
            removalPolicy: RemovalPolicy.DESTROY
        });

        // LAMBDAS
        const generatorFunction = new lambda.Function(this, 'LambdaGenerator', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'generator.handler',
            code: lambda.Code.fromAsset('./functions/generator/src'),
            environment: {
                'TABLE_NAME': table.tableName
            },
            functionName: props.stackName + '-generator'
        });

        const endpointFunction = new lambda.Function(this, 'LambdaEndpoint', {
            runtime: lambda.Runtime.NODEJS_14_X,
            handler: 'endpoint.handler',
            code: lambda.Code.fromAsset('./functions/endpoint/src/zipped'),
            environment: {
                'TABLE_NAME': table.tableName
            },
            functionName: props.stackName + '-endpoint'
        });

        bucket.grantRead(generatorFunction);

        table.grantWriteData(generatorFunction);
        table.grantReadData(endpointFunction);

        generatorFunction.addToRolePolicy(new IAM.PolicyStatement({
            effect: Effect.ALLOW,
            actions: [
                'rekognition:RecognizeCelebrities'
            ],
            resources: ['*']
        }));
        generatorFunction.addEventSource(new S3EventSource(bucket, {
            events: [S3.EventType.OBJECT_CREATED_PUT]
        }));
    }
}
