import {Construct} from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as codebuild from "@aws-cdk/aws-codebuild";

export interface RebuildPipelineProjectProps {
    readonly envName: string;
    readonly role: iam.Role;
    readonly branchName: string;
    readonly repo: string;
    readonly repoOwner: string;
    readonly repoSecretName: string;
}

export class RebuildPipelineProject extends Construct {
    public readonly project: codebuild.PipelineProject;

    constructor(app: Construct, id: string, props: RebuildPipelineProjectProps) {
        super(app, id);

        this.project = new codebuild.PipelineProject(this, `PipelineBuild`, {
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    install: {
                        commands: 'npm install',
                    },
                    build: {
                        commands: [
                            'npm run build',
                            `cdk synth AwsCdkPipelineCelebritiesStack -- --parameters envName=${props.envName} -- --parameters branchName=${props.branchName} -- --parameters repo=${props.repo} -- --parameters repoOwner=${props.repoOwner} -- --parameters repoSecretName=${props.repoSecretName}`,
                            `npm run cdk deploy -- --require-approval never AwsCdkPipelineCelebritiesStack --parameters envName=${props.envName} --parameters branchName=${props.branchName} --parameters repo=${props.repo} --parameters repoOwner=${props.repoOwner} --parameters repoSecretName=${props.repoSecretName}`,
                        ],
                    },
                }
            }),
            role: props.role,
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            }
        });
    }
}
