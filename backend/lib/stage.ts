import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { EcsFargateStack } from "./ecs-fargate-stack";

export class PipelineAppStage extends cdk.Stage {
  constructor(scope: Construct, stageName: string, props?: cdk.StageProps) {
    super(scope, stageName, props);

    // ADD ALL STACKS HERE... ECS FARGATE stack, DDB stack, etc.
    const ecsFargateStack = new EcsFargateStack(
      this,
      "EcsFargateStack",
      stageName
    );
  }
}
