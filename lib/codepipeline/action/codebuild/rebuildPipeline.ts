import {Construct} from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as iam from '@aws-cdk/aws-iam';
import {RebuildPipelineProject} from "./project/rebuiltPipeline";

export interface RebuildPipelineProps {
    readonly source: codepipeline.Artifact;
    readonly envName: string;
    readonly role: iam.Role;
    readonly branchName: string;
    readonly repo: string;
    readonly repoOwner: string;
    readonly repoSecretName: string;
}

export class RebuildPipeline extends Construct {
    public readonly action: codepipeline_actions.CodeBuildAction;

    constructor(app: Construct, id: string, props: RebuildPipelineProps) {
        super(app, id);

        const rebuildPipelineProject = new RebuildPipelineProject(this, 'RebuildPipelineProject', {
            role: props.role
        });

        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: 'Pipeline_UPDATE',
            project: rebuildPipelineProject.project,
            input: props.source,
            environmentVariables: {
                ENV_NAME: {value: props.envName},
                BRANCH_NAME: {value: props.branchName},
                REPO: {value: props.repo},
                REPO_OWNER: {value: props.repoOwner},
                REPO_SECRET_NAME: {value: props.repoSecretName},
            } // to always rebuilt for the same environment !!
        })
    }
}
