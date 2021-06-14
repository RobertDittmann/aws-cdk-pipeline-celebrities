import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsCdkPipelineCelebrities from '../../../lib/stacks/pipeline/aws-cdk-pipeline-celebrities-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    // const stack = new AwsCdkPipelineCelebrities.AwsCdkPipelineCelebritiesStack(app, 'MyTestStack', {
    // });
    // THEN
    // expectCDK(stack).to(matchTemplate({
    //   "Resources": {}
    // }, MatchStyle.EXACT))
});
