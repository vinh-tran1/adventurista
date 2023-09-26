import * as cdk from "aws-cdk-lib";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { Construct } from "constructs";

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new CodePipeline(this, "Pipeline", {
      pipelineName: "AdventuristaPipeline",
      synth: new ShellStep("Synth", {
        input: CodePipelineSource.gitHub("yale-swe/f23-adventurista", "main"),
        commands: ["cd backend", "npm ci", "npm run build", "npx cdk synth"],
      }),
    });
  }
}
