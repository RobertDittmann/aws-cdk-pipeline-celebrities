import * as cdk from "@aws-cdk/core";
import {Construct} from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import {BucketEncryption} from "@aws-cdk/aws-s3";

export interface PipelineS3BucketProps {
    readonly envName: string;
}

export class PipelineS3Bucket extends Construct {
    public readonly pipelineArtifactsBucket: s3.Bucket;

    constructor(scope: Construct, id: string, props?: PipelineS3BucketProps) {
        super(scope, id);

        this.pipelineArtifactsBucket = new s3.Bucket(this, id, { // use same id as construct
            encryption: BucketEncryption.S3_MANAGED,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            bucketName: `${props?.envName}-pipeline-artifacts`, // only small letters
            autoDeleteObjects: true,
            // lifecycleRules: [] // CAN BE IMPORTANT to not have too much objects later on !!!
        });
    }
}
