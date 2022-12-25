import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";
import * as events from "aws-cdk-lib/aws-events";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as logs from "aws-cdk-lib/aws-logs";

enum DeploymentType {
  SINGLE_REGION = "SINGLE_REGION",
  MULTI_REGION = "MULTI_REGION",
}
export class LambdaStack extends cdk.Stack {
  constructor(
    scope: cdk.App,
    id: string,
    runInMultipleRegions: string = "false",
    mainRegion: string = "us-east-1",
    props?: cdk.StackProps
  ) {
    super(scope, id, props);

    const lambdaRole = new iam.Role(this, "LambdaBasicExecutionRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    });

    // Grant the role permissions to create and write to CloudWatch logs
    lambdaRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        resources: ["arn:aws:logs:*:*:*"],
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
      })
    );

    // defines an AWS Lambda resource
    const lambdaFunction = new lambda.Function(this, "HealthCheckHandler", {
      runtime: lambda.Runtime.NODEJS_16_X,
      code: lambda.Code.fromAsset(`lambda/build`),
      handler: "healthCheck.handler",
      functionName: "healthCheck",
      role: lambdaRole,
      logRetention: logs.RetentionDays.ONE_WEEK,
      environment: {
        RUN_IN_MULTI_REGIONS: runInMultipleRegions,
        MAIN_REGION: mainRegion,
      },
    });

    // add managed roles to lambda (SES & Dynamo)
    lambdaFunction.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );

    lambdaFunction.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSESFullAccess")
    );

    // Run lambda every five minutes
    const rule = new events.Rule(this, "Rule", {
      schedule: events.Schedule.expression("rate(5 minutes)"),
    });

    rule.addTarget(new targets.LambdaFunction(lambdaFunction));
  }
}
