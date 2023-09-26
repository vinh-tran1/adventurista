import * as cdk from "aws-cdk-lib";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";
import { PipelineAppStage } from "./stage";
import * as awsProps from "../aws-properties.json";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: "AdventuristaPipeline",
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.gitHub("yale-swe/f23-adventurista", "main"),
        commands: ["cd backend", "npm ci", "npm run build", "npx cdk synth"],
        primaryOutputDirectory: "backend/cdk.out",
        rolePolicyStatements: [
          new cdk.aws_iam.PolicyStatement({
            actions: ["sts:AssumeRole"],
            resources: ["*"],
            conditions: {
              StringEquals: {
                "iam:ResourceTag/aws-cdk:bootstrap-role": "lookup",
              },
            },
          }),
        ],
      }),
    });

    const devStage = pipeline.addStage(
      new PipelineAppStage(this, "dev", {
        env: { account: awsProps.awsAccountIdDEV, region: awsProps.awsRegion },
      })
    );

	// add post to automatically run unit tests HERE
	//
	// add post to automatically run integration tests on DEV stage HERE

    devStage.addPost(
      new ManualApprovalStep("Manual approval before deployment to production")
    );

    const prodStage = pipeline.addStage(
      new PipelineAppStage(this, "dev", {
        env: { account: awsProps.awsAccountIdPROD, region: awsProps.awsRegion },
      })
    );
  }
}
