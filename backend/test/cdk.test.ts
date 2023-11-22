//import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import { Capture, Match, Template } from "aws-cdk-lib/assertions";

import * as cdk from "aws-cdk-lib";
import { CdkStack } from '../lib/cdk-stack';

test('Validate EC2 + ELB resources', () => {
  const app = new cdk.App();
  const stack = new CdkStack(app, 'MyTestStack');

  Template.fromStack(stack).hasResource('AWS::EC2::VPC', {});
  Template.fromStack(stack).hasResource('AWS::EC2::VPCEndpoint', {});
  Template.fromStack(stack).hasResource('AWS::EC2::Route', {});
  Template.fromStack(stack).hasResource('AWS::EC2::RouteTable', {});
  Template.fromStack(stack).hasResource('AWS::EC2::Subnet', {});
  Template.fromStack(stack).hasResource('AWS::EC2::SubnetRouteTableAssociation', {});
  Template.fromStack(stack).hasResource('AWS::EC2::NatGateway', {});
  Template.fromStack(stack).hasResource('AWS::EC2::SecurityGroup', {});
  Template.fromStack(stack).hasResource('AWS::EC2::SecurityGroupEgress', {});

  Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::Listener', {});
  Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::TargetGroup', {});
  Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::LoadBalancer', {});
});

test('Validate ECS resources', () => {
  const app = new cdk.App();
  const stack = new CdkStack(app, 'MyTestStack');

  Template.fromStack(stack).hasResource('AWS::ECS::Cluster', {});
  Template.fromStack(stack).hasResource('AWS::ECS::Service', {});
  Template.fromStack(stack).hasResource('AWS::ECS::TaskDefinition', {});

});

test('Validate APIGW resources', () => {
  const app = new cdk.App();
  const stack = new CdkStack(app, 'MyTestStack');

  Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Api', {});
  Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Integration', {});
  Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::Route', {});
  Template.fromStack(stack).hasResource('AWS::ApiGatewayV2::VpcLink', {});

});

test('Validate DynamoDB + S3 resources', () => {
  const app = new cdk.App();
  const stack = new CdkStack(app, 'MyTestStack');

  Template.fromStack(stack).hasResource('AWS::DynamoDB::Table', {});
  Template.fromStack(stack).hasResource('AWS::S3::Bucket', {});
  Template.fromStack(stack).hasResource('AWS::S3::BucketPolicy', {});

});

test('Validate IAM resources', () => {
  const app = new cdk.App();
  const stack = new CdkStack(app, 'MyTestStack');

  Template.fromStack(stack).hasResource('AWS::IAM::Policy', {});
  Template.fromStack(stack).hasResource('AWS::IAM::Role', {});
});
