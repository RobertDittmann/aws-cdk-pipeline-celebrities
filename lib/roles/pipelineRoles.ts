import {Construct} from "@aws-cdk/core";
import * as iam from '@aws-cdk/aws-iam';

export class PipelineRoles extends Construct {
    public readonly adminRoleForCodeBuild: iam.Role;
    public readonly adminRoleForCodePipeline: iam.Role;

    constructor(scope: Construct, id: string) {
        super(scope, id);

        // for now it can be too much
        this.adminRoleForCodeBuild = new iam.Role(this, `AdminCodeBuildRole`, {
            assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com')
        })
        this.adminRoleForCodeBuild.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

        // for now it can be too much
        this.adminRoleForCodePipeline = new iam.Role(this, `AdminCodePipelineRole`, {
            assumedBy: new iam.ServicePrincipal('codepipeline.amazonaws.com')
        })
        this.adminRoleForCodePipeline.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
    }
}
