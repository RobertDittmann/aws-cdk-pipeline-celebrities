import * as cdk from '@aws-cdk/core';
import {StackProps} from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as ssm from '@aws-cdk/aws-ssm';
import * as agw from '@aws-cdk/aws-apigateway';
import {LambdaIntegration} from '@aws-cdk/aws-apigateway';
import * as iam from '@aws-cdk/aws-iam';

export interface AgwStackProps extends StackProps {
    readonly envName: string;
    readonly branchName: string;
    readonly repo: string;
    readonly repoOwner: string;
    readonly repoSecretName: string;
}

export class AgwStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props: AgwStackProps) {
        const stackName = props.envName + '-agw-celebrities-rekognition';
        super(scope, id, {
            stackName: stackName,
            ...props
        });

        const lambdaArn = ssm.StringParameter.fromStringParameterAttributes(this, 'EndpointLambdaArn', {
            parameterName: props.envName + '-endpoint-lambda', // will take latest
        }).stringValue;
        const endpointLambda = lambda.Function.fromFunctionArn(this, 'AgwEndpointLambda', lambdaArn);

        const api = new agw.RestApi(this, `${props.envName}-api`);
        const metadata = api.root.addResource('metadata');
        const metadataItem = metadata.addResource('{id}');
        metadataItem.addMethod('GET', new LambdaIntegration(endpointLambda));

        new ssm.StringParameter(this, 'ParameterLambdaEndpoint', {
            allowedPattern: '.*',
            description: 'ARN of api GW',
            parameterName: props.envName + '-agw',
            stringValue: api.arnForExecuteApi(),
            tier: ssm.ParameterTier.ADVANCED,
        });

        endpointLambda.addPermission('AgwPermissionForEndpointLambda',{
            action: "lambda:InvokeFunction",
            sourceArn: api.arnForExecuteApi(),
            principal: new iam.ServicePrincipal('apigateway.amazonaws.com')
        });
    }
}
