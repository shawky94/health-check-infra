import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class DbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new dynamodb.Table(this, "healthCheck-global", {
      partitionKey: { name: "checkUrl", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "checkTimestamp", type: dynamodb.AttributeType.NUMBER },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      tableName: "healthCheck",
      replicationRegions: ["us-east-1", "us-west-1"],
    });

    new dynamodb.Table(this, "checkUrl-global", {
      partitionKey: { name: "url", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      tableName: "checkUrl",
      replicationRegions: ["us-east-1", "us-west-1"],
    });

    new dynamodb.Table(this, "admin-global", {
      partitionKey: { name: "adminEmail", type: dynamodb.AttributeType.STRING },
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      tableName: "admin",
      replicationRegions: ["us-east-1", "us-west-1"],
    });
  }
}
