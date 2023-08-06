import * as aws_events from "aws-cdk-lib/aws-events";
import * as aws_events_targets from "aws-cdk-lib/aws-events-targets";
import { Duration } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import { addCorsOptions } from "../utils/cors-options";

export class AlerteArrosoirStack extends cdk.Stack {
  db: Table; // Table de l'application
  api: RestApi;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
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

    // Créer des lambdas
    const plantesGet = new NodejsFunction(
      this,
      "plantesGetDouze",
      this.setProps("../lambdas/get-capteur.ts", this.db.tableName)
    );
    const plantesPost = new NodejsFunction(
      this,
      "plantesPostDouze",
      this.setProps("../lambdas/post-capteurs.ts", this.db.tableName)
    );
    /*     const plantesDelete = new NodejsFunction(
      this,
      "plantesDeleteDouze",
      this.setProps("../lambdas/delete-capteurs.ts", this.db.tableName)
    ); */
    const plantesUpdate = new NodejsFunction(
      this,
      "plantesUpdateDouze",
      this.setProps("../lambdas/update-capteurs.ts", this.db.tableName)
    );
    const planteOneCapteur = new NodejsFunction(
      this,
      "planteOneCapteurDouze",
      this.setProps("../lambdas/get-one-capteur.ts", this.db.tableName)
    );
    const planteStats = new NodejsFunction(
      this,
      "planteGetStats",
      this.setProps("../lambdas/get-stats.ts", this.db.tableName)
    );
    const planteAlertes = new NodejsFunction(
      this,
      "planteGetAlertes",
      this.setProps("../lambdas/get-alertes.ts", this.db.tableName)
    );
    const planteAlertesCount = new NodejsFunction(
      this,
      "planteGetAlerteCount",
      this.setProps("../lambdas/get-alertes-count.ts", this.db.tableName)
    );
    const planteAlertesUpdate = new NodejsFunction(
      this,
      "plantePutAlerteUpdate",
      this.setProps("../lambdas/update-alertes.ts", this.db.tableName)
    );
    const planteAlertesDelete = new NodejsFunction(
      this,
      "planteDeleteAlerte",
      this.setProps("../lambdas/delete-alertes.ts", this.db.tableName)
    );
    const planteCheckCapteur = new NodejsFunction(
      this,
      "planteCheckCapteur",
      this.setProps("../lambdas/get-check-capteur..ts", this.db.tableName)
    );
    const scheduledDeleteData = new NodejsFunction(
      this,
      "scheduledDeleteData",
      this.setProps("../lambdas/delete-datas-on-schedule.ts", this.db.tableName)
    );
    const scheduledDeleteAlerte = new NodejsFunction(
      this,
      "scheduledDeleteAlerte",
      this.setProps(
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
    const capteurs = this.api.root.addResource("humidite");
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
    const alertes = this.api.root.addResource("alertes");
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

    new aws_events.Rule(this, "scheduledDatasDeleteRule", {
      description: "efface les relevés toutes les 24h",
      targets: [new aws_events_targets.LambdaFunction(scheduledDeleteData)],
      schedule: aws_events.Schedule.rate(Duration.days(1)),
    });

    new aws_events.Rule(this, "scheduledDatasAlertesRule", {
      description: "efface les alertes tous les 3 jours",
      targets: [new aws_events_targets.LambdaFunction(scheduledDeleteAlerte)],
      schedule: aws_events.Schedule.rate(Duration.minutes(2)),
    });
  }

  // Etablir une lambda pour faire un get
  setProps(file: string, table: string): NodejsFunctionProps {
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
}
