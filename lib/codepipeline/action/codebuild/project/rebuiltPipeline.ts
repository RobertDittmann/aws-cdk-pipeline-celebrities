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
                            // `export envName=${props.envName}`,
                            // `export branchName=${props.branchName}`,
                            // `export repo=${props.repo}`,
                            // `export repoOwner=${props.repoOwner}`,
                            // `export repoSecretName=${props.repoSecretName}`,
                            `npm run cdk synth AwsCdkPipelineCelebritiesStack`,
                            `npm run cdk deploy -- --require-approval never AwsCdkPipelineCelebritiesStack`,
                        ],
                    },
                }
            }),
            role: props.role,
            environment: {
                buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
            },
            environmentVariables: {
                ENV_NAME: {value: props.envName},
                BRANCH_NAME: {value: props.branchName},
                REPO: {value: props.repo},
                REPO_OWNER: {value: props.repoOwner},
                REPO_SECRET_NAME: {value: props.repoSecretName},
                TEST_PLACE: {value: 'PROJECT'},
            } // to always rebuilt for the same environment !!
        });
    }
}
