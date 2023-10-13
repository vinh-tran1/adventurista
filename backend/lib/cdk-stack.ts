import {
  CfnOutput,
  CfnResource,
  Stack,
  StackProps,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import { Vpc, GatewayVpcEndpointAwsService } from "aws-cdk-lib/aws-ec2";
import { Cluster, ContainerImage } from "aws-cdk-lib/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "aws-cdk-lib/aws-ecs-patterns";
import { CfnIntegration, CfnRoute } from "aws-cdk-lib/aws-apigatewayv2";
import { HttpApi } from "@aws-cdk/aws-apigatewayv2-alpha";
import path = require("path");
import { Table, AttributeType } from "aws-cdk-lib/aws-dynamodb";
import { PolicyStatement, Effect, AnyPrincipal } from "aws-cdk-lib/aws-iam";
import { BlockPublicAccess, BucketEncryption, Bucket } from "aws-cdk-lib/aws-s3";

export class CdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // S3
    const BUCKET_NAME = "user-profile-picture-bucket";

    const profPicBucket = new Bucket(this, "profPicBucket", {
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      bucketName: BUCKET_NAME,
      encryption: BucketEncryption.KMS_MANAGED,
      enforceSSL: true,
      publicReadAccess: false,
      removalPolicy: RemovalPolicy.DESTROY, // change removal policy to RETAIL in prod
      versioned: false,
      autoDeleteObjects: true,
    });

    // DynamoDB
    const usersTable = new Table(this, "users", {
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING,
      },
      tableName: "users",
      removalPolicy: RemovalPolicy.DESTROY, // change removal policy to RETAIL in prod
    });

    // ECS + Fargate
    const vpc = new Vpc(this, "MyVpc", {
      maxAzs: 3,
    });

    const s3GatewayEndpoint = vpc.addGatewayEndpoint("s3GatewayEndpoint", {
      service: GatewayVpcEndpointAwsService.S3,
    });

    const dynamoGatewayEndpoint = vpc.addGatewayEndpoint(
      "dynamoGatewayEndpoint",
      {
        service: GatewayVpcEndpointAwsService.DYNAMODB,
      }
    );

    const cluster = new Cluster(this, "MyCluster", {
      vpc: vpc,
    });

    const fargate = new ApplicationLoadBalancedFargateService(
      this,
      "MyFargateService",
      {
        assignPublicIp: false,
        cluster: cluster,
        cpu: 512,
        desiredCount: 1,
        memoryLimitMiB: 2048,
        publicLoadBalancer: false,
        taskImageOptions: {
          image: ContainerImage.fromAsset(path.join(__dirname, "../src/")),
          environment: {
            USERS_PRIMARY_KEY: "userId",
            USERS_TABLE_NAME: usersTable.tableName,
          },
        },
      }
    );

    // Add bucket policy to restrict access to VPC
    profPicBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.DENY,
        resources: [profPicBucket.bucketArn],
        actions: ["s3:ListBucket"],
        principals: [new AnyPrincipal()],
        conditions: {
          StringNotEquals: {
            "aws:sourceVpce": [s3GatewayEndpoint.vpcEndpointId],
          },
        },
      })
    );

    profPicBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.DENY,
        resources: [profPicBucket.arnForObjects("*")],
        actions: ["s3:PutObject", "s3:GetObject"], // no permanent delete; we will soft delete
        principals: [new AnyPrincipal()],
        conditions: {
          StringNotEquals: {
            "aws:sourceVpce": [s3GatewayEndpoint.vpcEndpointId],
          },
        },
      })
    );

    // Allow PutItem action from the Fargate Task Definition only
    dynamoGatewayEndpoint.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new AnyPrincipal()],
        actions: [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        resources: [`${usersTable.tableArn}`],
        conditions: {
          ArnEquals: {
            "aws:PrincipalArn": `${fargate.taskDefinition.taskRole.roleArn}`,
          },
        },
      })
    );

    // R/W permissions for Fargate
    profPicBucket.grantReadWrite(fargate.taskDefinition.taskRole);
    usersTable.grantReadWriteData(fargate.taskDefinition.taskRole);

    // API Gateway
    const httpVpcLink = new CfnResource(this, "HttpVpcLink", {
      type: "AWS::ApiGatewayV2::VpcLink",
      properties: {
        Name: "V2 VPC Link",
        SubnetIds: vpc.privateSubnets.map((m) => m.subnetId),
      },
    });

    const api = new HttpApi(this, "HttpApiGateway", {
      apiName: "ApigwFargate",
      description:
        "Integration between apigw and Application Load-Balanced Fargate Service",
    });

    const integration = new CfnIntegration(this, "HttpApiGatewayIntegration", {
      apiId: api.httpApiId,
      connectionId: httpVpcLink.ref,
      connectionType: "VPC_LINK",
      description: "API Integration with AWS Fargate Service",
      integrationMethod: "ANY", // for GET and POST, use ANY
      integrationType: "HTTP_PROXY",
      integrationUri: fargate.listener.listenerArn,
      payloadFormatVersion: "1.0", // supported values for Lambda proxy integrations are 1.0 and 2.0. For all other integrations, 1.0 is the only supported value
    });

    new CfnRoute(this, "Route", {
      apiId: api.httpApiId,
      routeKey: "ANY /{proxy+}", // for something more general use 'ANY /{proxy+}'
      target: `integrations/${integration.ref}`,
    });

    new CfnOutput(this, "APIGatewayUrl", {
      description: "API Gateway URL to access the GET endpoint",
      value: api.url!,
    });
  }
}
