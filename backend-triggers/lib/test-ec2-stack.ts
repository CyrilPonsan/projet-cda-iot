import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { readFileSync } from "fs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { addCorsOptions } from "../utils/cors-options";
import * as dotenv from "dotenv";
dotenv.config();

export class CdkStarterStack extends cdk.Stack {
  api: RestApi;
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 👇 create VPC in which we'll launch the Instance
    const vpc = new ec2.Vpc(this, "my-cdk-vpc", {
      cidr: "10.0.0.0/16",
      natGateways: 0,
      subnetConfiguration: [
        {
          name: "public",
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: "private",
          cidrMask: 24,
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // 👇 create Security Group for the Instance
    const webserverSG = new ec2.SecurityGroup(this, "webserver-sg", {
      vpc,
      allowAllOutbound: true,
    });

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(22),
      "allow SSH access from anywhere"
    );

    /*     webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      "allow HTTP traffic from anywhere"
    );

    webserverSG.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(443),
      "allow HTTPS traffic from anywhere"
    ); */

    // 👇 create a Role for the EC2 Instance
    const webserverRole = new iam.Role(this, "webserver-role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
      ],
    });

    // 👇 create the EC2 Instance
    const ec2Instance = new ec2.Instance(this, "ec2-instance", {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      role: webserverRole,
      securityGroup: webserverSG,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: "ec2-key-pair",
    });

    webserverSG.addIngressRule(
      ec2.Peer.ipv4("10.0.0.0/16"),
      ec2.Port.tcp(3306),
      "10.0.0.0/16"
    );

    // 👇 load contents of script
    const userDataScript = readFileSync("./lib/user-data.sh", "utf8");
    // 👇 add the User Data script to the Instance
    ec2Instance.addUserData(userDataScript);

    /*     const lambdaFunction = new lambda.Function(this, "lambda-function", {
      runtime: lambda.Runtime.NODEJS_20_X,
      // 👇 place lambda in the VPC
      vpc,
      // 👇 place lambda in Private Subnets
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS,
      },
      memorySize: 1024,
      timeout: cdk.Duration.seconds(5),
      handler: "index.main",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "/../lambdas/my-lambda")
      ),
    }); */

    //lambdas
    const postHumidity = new NodejsFunction(
      this,
      "plantesPostHumidityLevel",
      this.setProps("../lambdas/post-humidity-level.ts", vpc, webserverSG)
    );
    const createSensor = new NodejsFunction(
      this,
      "plantesCreateSensor",
      this.setProps("../lambdas/create-sensor.ts", vpc, webserverSG)
    );

    //  api gateway pour interagir avec les lambdas et la db
    this.api = new RestApi(this, "apiPlantes", {
      restApiName: "Api capteurs des plantes",
    });

    const lambdaPostHumidityLevel = new LambdaIntegration(postHumidity);
    const v1 = this.api.root.addResource("v1");
    v1.addMethod("POST", lambdaPostHumidityLevel);
    addCorsOptions(v1);

    const lambdaCreateSensor = new LambdaIntegration(createSensor);
    const sensor = v1.addResource("sensor");
    const sensorId = sensor.addResource("{sensorId}");
    sensorId.addMethod("POST", lambdaCreateSensor);
    addCorsOptions(sensor);
  }

  setProps(file: string, vpc: any, webserverSG: any): NodejsFunctionProps {
    return {
      vpc: vpc,
      allowPublicSubnet: true,
      // 👇 place lambda in Private Subnets
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      //role: webserverRole,
      securityGroups: [webserverSG],
      bundling: {
        nodeModules: ["mysql2"],
      },
      environment: {
        HOST: process.env.HOST!,
        USER: process.env.OWNER!,
        PASSWORD: process.env.PASSWORD!,
        DATABASE: process.env.DATABASE!,
        TABLE_1: process.env.TABLE_1!,
        TABLE_2: process.env.TABLE_2!,
        TABLE_3: process.env.TABLE_3!,
        SOCKET_PATH: "",
      },
      memorySize: 128,
      timeout: cdk.Duration.seconds(30),
      entry: join(__dirname, file),
      runtime: lambda.Runtime.NODEJS_20_X,
    };
  }
}
