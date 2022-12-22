#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { DbStack } from "../lib/db-stack";

const app = new cdk.App();
new DbStack(app, "DbStack");
