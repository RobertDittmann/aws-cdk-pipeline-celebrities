import * as cdk from '@aws-cdk/core';
import {StackProps} from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import {HttpApi, HttpMethod} from '@aws-cdk/aws-apigatewayv2';
import * as integration from "@aws-cdk/aws-apigatewayv2-integrations";
import * as ssm from '@aws-cdk/aws-ssm';
import {ApiEventSource} from "@aws-cdk/aws-lambda-event-sources";
import * as agw from '@aws-cdk/aws-apigateway';
import {LambdaIntegration} from "@aws-cdk/aws-apigateway";

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

        // const httpApi = new HttpApi(this, `${props.envName}-agw2`);
        //

        //
        // httpApi.addRoutes({
        //     path: `/${props.envName}-metadata-api/{id}`,
        //     methods: [HttpMethod.GET],
        //     integration: new integration.LambdaProxyIntegration({
        //         handler: endpointLambda
        //     })
        // });
        //
        // httpApi.addStage(`${props.envName}-stage`, {
        //     stageName: `${props.envName}-metadata-api`,
        //     autoDeploy: true
        // });


        const api = new agw.RestApi(this, `${props.envName}-api`);

        const metadata = api.root.addResource('metadata');
        const metadataItem = metadata.addResource('{id}');
        metadataItem.addMethod('GET', new LambdaIntegration(endpointLambda));
    }
}
