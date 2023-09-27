import * as cdk from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { NetworkLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { Construct } from "constructs";

export class EcsFargateStack extends cdk.Stack {
  constructor(
    scope: Construct,
    id: string,
    stageName: string,
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    // VPC
    const vpc = new Vpc(this, "AdventuristaVPC", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Fargate cluster
    const cluster = new Cluster(this, "AdventuristaCluster", {
      vpc: vpc as any,
    });

    // Fargate service
    const backendService = new NetworkLoadBalancedFargateService (
      this,
      "backendService",
      {
        cluster: cluster,
        memoryLimitMiB: 1024,
        desiredCount: 2,
        taskImageOptions: {
          image: ContainerImage.fromAsset("../server"),
          environment: {
            stageName: stageName,
          },
        },
      }
    );

    // Health check
    backendService.targetGroup.configureHealthCheck({ path: "/health" });

    // Load balancer url
    new cdk.CfnOutput(this, "loadBalancerUrl", {
      value: backendService.loadBalancer.loadBalancerDnsName,
      exportName: "loadBalancerUrl",
    });
  }
}
