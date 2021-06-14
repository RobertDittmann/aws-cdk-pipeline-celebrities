import * as cdk from '@aws-cdk/core';
import {StackProps} from "@aws-cdk/core";
import {PipelineRoles} from "../../roles/pipelineRoles";
import {PipelineS3Bucket} from "../../s3/pipelineS3Bucket";



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

    const pipelineRoles = new PipelineRoles(this, 'PipelineRoles');
    const pipelineArtifactsBucket = new PipelineS3Bucket(this,  'PipelineArtifactsBucket', {
      envName: `${props?.envName}` // only props?envName will not work cause thinks undefined
    });

  }
}
