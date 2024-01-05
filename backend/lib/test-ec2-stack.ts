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
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
dotenv.config();

export class CdkStarterStack extends cdk.Stack {
  api: RestApi;
  db: Table; // Table dynamo db utilisée dans la v1 de l'API
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Créer une table dynamodb
    this.db = new Table(this, "DynamoCapteursDouze", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "capteurs-plantes-douze",
      // removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    // 👇 creation du VPC dans lequel se lancera l'application
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

    // 👇 creation d'un rôle pour l'instance EC2
    const webserverRole = new iam.Role(this, "webserver-role", {
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3ReadOnlyAccess"),
      ],
    });

    // 👇 creation de l'instance EC2
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

    // 👇 chargement du script user
    const userDataScript = readFileSync("./lib/user-data.sh", "utf8");
    // 👇 ajout des données utilisateur
    ec2Instance.addUserData(userDataScript);

    // lambdas V1

    const plantesGet = new NodejsFunction(
      this,
      "plantesGetDouze",
      this.setPropsV1("../lambdas/get-capteur.ts", this.db.tableName)
    );
    const plantesPost = new NodejsFunction(
      this,
      "plantesPostDouze",
      this.setPropsV1("../lambdas/post-capteurs.ts", this.db.tableName)
    );
    /*     const plantesDelete = new NodejsFunction(
      this,
      "plantesDeleteDouze",
      this.setPropsV1("../lambdas/delete-capteurs.ts", this.db.tableName)
    ); */
    const plantesUpdate = new NodejsFunction(
      this,
      "plantesUpdateDouze",
      this.setPropsV1("../lambdas/update-capteurs.ts", this.db.tableName)
    );
    const planteOneCapteur = new NodejsFunction(
      this,
      "planteOneCapteurDouze",
      this.setPropsV1("../lambdas/get-one-capteur.ts", this.db.tableName)
    );
    const planteStats = new NodejsFunction(
      this,
      "planteGetStats",
      this.setPropsV1("../lambdas/get-stats.ts", this.db.tableName)
    );
    const planteAlertes = new NodejsFunction(
      this,
      "planteGetAlertes",
      this.setPropsV1("../lambdas/get-alertes.ts", this.db.tableName)
    );
    const planteAlertesCount = new NodejsFunction(
      this,
      "planteGetAlerteCount",
      this.setPropsV1("../lambdas/get-alertes-count.ts", this.db.tableName)
    );
    const planteAlertesUpdate = new NodejsFunction(
      this,
      "plantePutAlerteUpdate",
      this.setPropsV1("../lambdas/update-alertes.ts", this.db.tableName)
    );
    const planteAlertesDelete = new NodejsFunction(
      this,
      "planteDeleteAlerte",
      this.setPropsV1("../lambdas/delete-alertes.ts", this.db.tableName)
    );
    const planteCheckCapteur = new NodejsFunction(
      this,
      "planteCheckCapteur",
      this.setPropsV1("../lambdas/get-check-capteur..ts", this.db.tableName)
    );
    const scheduledDeleteData = new NodejsFunction(
      this,
      "scheduledDeleteData",
      this.setPropsV1(
        "../lambdas/delete-datas-on-schedule.ts",
        this.db.tableName
      )
    );
    const scheduledDeleteAlerte = new NodejsFunction(
      this,
      "scheduledDeleteAlerte",
      this.setPropsV1(
        "../lambdas/delete-alertes-on-schedule.ts",
        this.db.tableName
      )
    );

    //  attribution des autorisations
    this.db.grantReadData(plantesGet);
    this.db.grantReadWriteData(plantesPost);
    //this.db.grantWriteData(plantesDelete);
    this.db.grantWriteData(plantesUpdate);
    this.db.grantReadData(planteOneCapteur);
    this.db.grantReadData(planteStats);
    this.db.grantReadData(planteAlertes);
    this.db.grantReadData(planteAlertesCount);
    this.db.grantReadWriteData(planteAlertesUpdate);
    this.db.grantWriteData(planteAlertesDelete);
    this.db.grantReadData(planteCheckCapteur);
    this.db.grantReadWriteData(scheduledDeleteData);
    this.db.grantReadWriteData(scheduledDeleteAlerte);

    //  api gateway pour interagir avec les lambdas et la db
    this.api = new RestApi(this, "apiPlantes", {
      restApiName: "Api capteurs des plantes",
    });

    const lambdaGetIntegration = new LambdaIntegration(plantesGet);
    const v1 = this.api.root.addResource("v1");
    const capteurs = v1.addResource("humidite");
    const capteursGet = capteurs.addResource("get"); // route pour la future méthode GET
    capteursGet.addMethod("GET", lambdaGetIntegration); // on créé une méthode GET pour les requêtes HTTP
    addCorsOptions(capteursGet);

    const lambdaPostIntegration = new LambdaIntegration(plantesPost);
    const capteursPost = capteurs.addResource("add");
    capteursPost.addMethod("POST", lambdaPostIntegration);
    addCorsOptions(capteursPost);

    const lambdaUpdateIntegration = new LambdaIntegration(plantesUpdate);
    const capteursUpdate = capteurs.addResource("update");
    capteursUpdate.addMethod("PUT", lambdaUpdateIntegration);
    addCorsOptions(capteursUpdate);

    /*     const lambdaDeleteIntegration = new LambdaIntegration(plantesDelete);
    const capteursDelete = capteurs.addResource("delete");
    capteursDelete.addMethod("POST", lambdaDeleteIntegration);
    addCorsOptions(capteursDelete); */

    const lambdaOneCapteurIntegration = new LambdaIntegration(planteOneCapteur);
    const capteursOneCapteur = capteurs.addResource("one-capteur");
    capteursOneCapteur.addMethod("GET", lambdaOneCapteurIntegration);
    addCorsOptions(capteursOneCapteur);

    const lambdaStatsIntegration = new LambdaIntegration(planteStats);
    const capteursStats = capteurs.addResource("stats");
    capteursStats.addMethod("GET", lambdaStatsIntegration);
    addCorsOptions(capteursStats);

    const lambdaAlertesIntegration = new LambdaIntegration(planteAlertes);
    const alertes = v1.addResource("alertes");
    const alertesGet = alertes.addResource("get");
    alertesGet.addMethod("GET", lambdaAlertesIntegration);
    addCorsOptions(alertesGet);

    const lambdaAlerteCountIntegration = new LambdaIntegration(
      planteAlertesCount
    );
    const alertesCount = alertes.addResource("count");
    alertesCount.addMethod("GET", lambdaAlerteCountIntegration);
    addCorsOptions(alertesCount);

    const lambdaUpdateAlerteIntegration = new LambdaIntegration(
      planteAlertesUpdate
    );
    const alertesUpdate = alertes.addResource("update");
    alertesUpdate.addMethod("PUT", lambdaUpdateAlerteIntegration);
    addCorsOptions(alertesUpdate);

    const lambdaAlertesDeleteIntegration = new LambdaIntegration(
      planteAlertesDelete
    );
    const alertesDelete = alertes.addResource("delete");
    alertesDelete.addMethod("POST", lambdaAlertesDeleteIntegration);
    addCorsOptions(alertesDelete);

    const lambdaCheckIntegration = new LambdaIntegration(planteCheckCapteur);
    const checkCapteur = capteurs.addResource("check-capteur");
    checkCapteur.addMethod("GET", lambdaCheckIntegration);
    addCorsOptions(checkCapteur);

    /*      new cdk.aws_events.Rule(this, "scheduledDatasDeleteRule", {
       description: "efface les relevés toutes les 24h",
       targets: [new cdk.aws_events_targets.LambdaFunction(scheduledDeleteData)],
       schedule: cdk.aws_events.Schedule.rate(cdk.Duration.days(1)),
     });
 */
    /*     new cdk.aws_events.Rule(this, "scheduledDatasAlertesRule", {
      description: "efface les alertes tous les 3 jours",
      targets: [
        new cdk.aws_events_targets.LambdaFunction(scheduledDeleteAlerte),
      ],
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.days(1)),
    }); */

    //lambdas V2
    const postHumidity = new NodejsFunction(
      this,
      "plantesPostHumidityLevel",
      this.setPropsV2(
        "../lambdas/scheduled-humidity-level.ts",
        vpc,
        webserverSG
      )
    );
    const createSensor = new NodejsFunction(
      this,
      "plantesCreateSensor",
      this.setPropsV2("../lambdas/create-sensor.ts", vpc, webserverSG)
    );
    const readAllSensors = new NodejsFunction(
      this,
      "plantesReadAllSensors",
      this.setPropsV2("../lambdas/read-all-sensors.ts", vpc, webserverSG)
    );
    const readSensorDetails = new NodejsFunction(
      this,
      "plantesReadSensorDetails",
      this.setPropsV2("../lambdas/read-sensor-details.ts", vpc, webserverSG)
    );
    const updateSensor = new NodejsFunction(
      this,
      "plantesUpdateSensor",
      this.setPropsV2("../lambdas/update-sensor.ts", vpc, webserverSG)
    );
    const deleteSensor = new NodejsFunction(
      this,
      "plantesDeleteSensor",
      this.setPropsV2("../lambdas/delete-sensor.ts", vpc, webserverSG)
    );
    const readAlertsCount = new NodejsFunction(
      this,
      "plantesReadAlertsCount",
      this.setPropsV2("../lambdas/read-alerts-count.ts", vpc, webserverSG)
    );
    const readAllAlerts = new NodejsFunction(
      this,
      "plantesReadAllAlerts",
      this.setPropsV2("../lambdas/read-all-alerts.ts", vpc, webserverSG)
    );
    const updateManyAlerts = new NodejsFunction(
      this,
      "plantesUpdateManyAlerts",
      this.setPropsV2("../lambdas/update-many-alerts.ts", vpc, webserverSG)
    );
    const deleteManyAlerts = new NodejsFunction(
      this,
      "plantesDeleteManyAlerts",
      this.setPropsV2("../lambdas/delete-many-alerts.ts", vpc, webserverSG)
    );

    const lambdaPostHumidityLevel = new LambdaIntegration(postHumidity);
    const v2 = this.api.root.addResource("v2");
    v2.addMethod("POST", lambdaPostHumidityLevel);
    const lambdaReadAllSensors = new LambdaIntegration(readAllSensors);
    v2.addMethod("GET", lambdaReadAllSensors);

    addCorsOptions(v2);

    const sensor = v2.addResource("sensor");

    const lambdaCreateSensor = new LambdaIntegration(createSensor);
    sensor.addMethod("POST", lambdaCreateSensor);

    addCorsOptions(sensor);

    const sensorDetails = sensor.addResource("{sensorId}");

    const lambdaReadSensorDetails = new LambdaIntegration(readSensorDetails);
    const lambdaUpdateSensor = new LambdaIntegration(updateSensor);
    const lambdaDeleteSensor = new LambdaIntegration(deleteSensor);
    sensorDetails.addMethod("GET", lambdaReadSensorDetails);
    sensorDetails.addMethod("PUT", lambdaUpdateSensor);
    sensorDetails.addMethod("DELETE", lambdaDeleteSensor);

    addCorsOptions(sensorDetails);

    const alert = v2.addResource("alert");
    const lambdaReadAllAlerts = new LambdaIntegration(readAllAlerts);
    alert.addMethod("GET", lambdaReadAllAlerts);
    const lambdaUpdateManyAlerts = new LambdaIntegration(updateManyAlerts);
    alert.addMethod("PUT", lambdaUpdateManyAlerts);
    const lambdaDeleteManyAlerts = new LambdaIntegration(deleteManyAlerts);
    alert.addMethod("DELETE", lambdaDeleteManyAlerts);

    const count = alert.addResource("count");

    const lambdaReadAlertsCount = new LambdaIntegration(readAlertsCount);
    count.addMethod("GET", lambdaReadAlertsCount);

    addCorsOptions(alert);
    addCorsOptions(count);

    const scheduleLambdaFixtures = new NodejsFunction(
      this,
      "scheduleFixtures",
      this.setPropsV2("../lambdas/scheduled-fixtures.ts", vpc, webserverSG)
    );

    new cdk.aws_events.Rule(this, "scheduledFixtures", {
      description: "enregistre des fixtures",
      targets: [
        new cdk.aws_events_targets.LambdaFunction(scheduleLambdaFixtures),
      ],
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.hours(6)),
    });

    const scheduleLambdaDeleteAlerts = new NodejsFunction(
      this,
      "scheduleDeleteAlerts",
      this.setPropsV2("../lambdas/scheduled-delete-alerts.ts", vpc, webserverSG)
    );

    new cdk.aws_events.Rule(this, "scheduledDeleteAlerts", {
      description: "supprime les vieilles alertes",
      targets: [
        new cdk.aws_events_targets.LambdaFunction(scheduleLambdaDeleteAlerts),
      ],
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.days(1)),
    });

    const scheduleLambdaDeleteLevels = new NodejsFunction(
      this,
      "scheduleDeleteLevels",
      this.setPropsV2("../lambdas/scheduled-delete-levels.ts", vpc, webserverSG)
    );

    new cdk.aws_events.Rule(this, "scheduledDeleteLevels", {
      description: "supprimes les vieux relevés d'humidité",
      targets: [
        new cdk.aws_events_targets.LambdaFunction(scheduleLambdaDeleteLevels),
      ],
      schedule: cdk.aws_events.Schedule.rate(cdk.Duration.days(1)),
    });
  }

  setPropsV1(file: string, table: string): NodejsFunctionProps {
    return {
      memorySize: 128,
      entry: join(__dirname, file),
      environment: {
        TABLE: table,
        CLE: "id",
      },
      runtime: lambda.Runtime.NODEJS_16_X,
    };
  }

  setPropsV2(file: string, vpc: any, webserverSG: any): NodejsFunctionProps {
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
