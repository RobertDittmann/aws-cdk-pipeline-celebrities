import * as cdk from '@aws-cdk/core';
import {StackProps} from "@aws-cdk/core";

export interface AwsCdkPipelineCelebritiesStackProps extends StackProps {
  readonly envName: string;
  readonly branchName: string;
}

export class AwsCdkPipelineCelebritiesStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: AwsCdkPipelineCelebritiesStackProps) {
    const stackName = props?.envName + '-pipeline'; // to generate all stack names using ENV_NAME
    super(scope, id, {
      stackName: stackName, // set STACK NAME for stack
      ...props
    });



  }
}
