#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DbStack } from "../lib/db-stack";
import { LambdaStack } from "../lib/lambda-stack";

const regions = ["us-east-1", "us-west-1"];

const app = new cdk.App();
// global stack
new DbStack(app, "DbStack");

// regional stack
regions.forEach((region) => {
  new LambdaStack(app, `LambdaStack-${region}`, {
    env: {
      region: region,
    },
  });
});
