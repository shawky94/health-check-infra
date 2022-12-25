#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DbStack } from "../lib/db-stack";
import { LambdaStack } from "../lib/lambda-stack";
import { regions, mainRegion } from "../configs";

const runInMultipleRegions = regions.length > 1 ? "true" : "false";

const app = new cdk.App();
// global stack
new DbStack(app, "DbStack");

// regional stack
regions.forEach((region) => {
  new LambdaStack(
    app,
    `LambdaStack-${region}`,
    runInMultipleRegions,
    mainRegion,
    {
      env: {
        region,
      },
    }
  );
});
