import * as cdk from "aws-cdk-lib";
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
} from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "Pipeline", {
      pipelineName: "AdventuristaPipeline",
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.gitHub("yale-swe/f23-adventurista", "main"),
        commands: ["cd backend", "npm ci", "npm run build", "npx cdk synth"],
		primaryOutputDirectory: 'backend/cdk.out',
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
  }
}
