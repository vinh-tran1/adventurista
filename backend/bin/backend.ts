#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { BackendStack } from "../lib/backend-stack";
import * as awsProps from "../aws-properties.json";

const app = new cdk.App();
new BackendStack(app, "BackendStack", {
  env: {
    account: awsProps.awsAccountIdPROD,
    region: awsProps.awsRegion,
  },
});

app.synth();
