# Health checker

## setup

```sh
npm install
npm run bundle-lambda
cdk deploy --all
```

## Configuration

update `config.ts` file to define the supported regions and the main region (master region)

```
const regions = ["us-west-1", "us-east-1"];
const mainRegion = "us-east-1";
```

to run the app in one region only:

```
const regions = ["us-east-1"];
const mainRegion = "us-east-1";
```

## Note

Make sure you run bootstrap command in the region you are deploying to (if not run before)

```
cdk bootstrap aws://ACCOUNT-NUMBER-1/REGION-1
```

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `cdk deploy` deploy this stack to your default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits the synthesized CloudFormation template

## License

MIT
