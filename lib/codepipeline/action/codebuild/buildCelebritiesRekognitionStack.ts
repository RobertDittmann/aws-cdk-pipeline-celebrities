import {Construct} from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from "@aws-cdk/aws-codepipeline-actions";
import * as iam from '@aws-cdk/aws-iam';
import {BuildCelebritiesRekognitionProject} from "./project/buildCelebritiesRekognitionProject";

export interface BuildCelebritiesRecognitionStackProps {
    readonly source: codepipeline.Artifact;
    readonly envName: string;
    readonly role: iam.Role;
    readonly branchName: string;
    readonly repo: string;
    readonly repoOwner: string;
    readonly repoSecretName: string;
}

export class BuildCelebritiesRekognitionStack extends Construct {
    public readonly action: codepipeline_actions.CodeBuildAction;

    constructor(app: Construct, id: string, props: BuildCelebritiesRecognitionStackProps) {
        super(app, id);

        const buildCelebritiesRekognitionProject = new BuildCelebritiesRekognitionProject(this, 'BuildCelebritiesRekognitionProject', {
            role: props.role,
            envName: `${props.envName}`
        });

        this.action = new codepipeline_actions.CodeBuildAction({
            actionName: 'Deploy_Celebrities_Stack',
            project: buildCelebritiesRekognitionProject.project,
            input: props.source,
            environmentVariables: {
                ENV_NAME: {value: props.envName},
                BRANCH_NAME: {value: props.branchName},
                REPO: {value: props.repo},
                REPO_OWNER: {value: props.repoOwner},
                REPO_SECRET_NAME: {value: props.repoSecretName},
            } // to always rebuilt for the same environment !!
        });
    }
}
