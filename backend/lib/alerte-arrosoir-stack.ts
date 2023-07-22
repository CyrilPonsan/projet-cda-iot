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
      this.setProps("../lambdas/get-capteurs.ts", this.db.tableName)
    );
    const plantesPost = new NodejsFunction(
      this,
      "plantesPostDouze",
      this.setProps("../lambdas/post-capteurs.ts", this.db.tableName)
    );
    const plantesDelete = new NodejsFunction(
      this,
      "plantesDeleteDouze",
      this.setProps("../lambdas/delete-capteurs.ts", this.db.tableName)
    );
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

    //  attribution des autorisations
    this.db.grantReadData(plantesGet);
    this.db.grantReadWriteData(plantesPost);
    this.db.grantWriteData(plantesDelete);
    this.db.grantWriteData(plantesUpdate);
    this.db.grantReadData(planteOneCapteur);
    this.db.grantReadData(planteStats);
    this.db.grantReadData(planteAlertes);

    //  api gateway pour interagir avec les lambdas et la db
    this.api = new RestApi(this, "apiPlantes", {
      restApiName: "Api humidite des plantes",
    });
    const lambdaGetIntegration = new LambdaIntegration(plantesGet);
    const humidite = this.api.root.addResource("humidite");
    const humiditeGet = humidite.addResource("get"); // route pour la future méthode GET
    humiditeGet.addMethod("POST", lambdaGetIntegration); // on créé une méthode GET pour les requêtes HTTP
    addCorsOptions(humiditeGet);

    const lambdaPostIntegration = new LambdaIntegration(plantesPost);
    const humiditePost = humidite.addResource("add");
    humiditePost.addMethod("POST", lambdaPostIntegration);
    addCorsOptions(humiditePost);

    const lambdaUpdateIntegration = new LambdaIntegration(plantesUpdate);
    const humiditeUpdate = humidite.addResource("update");
    humiditeUpdate.addMethod("PUT", lambdaUpdateIntegration);
    addCorsOptions(humiditeUpdate);

    const lambdaDeleteIntegration = new LambdaIntegration(plantesDelete);
    const humiditeDelete = humidite.addResource("delete");
    humiditeDelete.addMethod("DELETE", lambdaDeleteIntegration);
    addCorsOptions(humiditeDelete);

    const lambdaOneCapteurIntegration = new LambdaIntegration(planteOneCapteur);
    const humiditeOneCapteur = humidite.addResource("one-capteur");
    humiditeOneCapteur.addMethod("GET", lambdaOneCapteurIntegration);
    addCorsOptions(humiditeOneCapteur);

    const lambdaStatsIntegration = new LambdaIntegration(planteStats);
    const humiditeStats = humidite.addResource("stats");
    humiditeStats.addMethod("GET", lambdaStatsIntegration);
    addCorsOptions(humiditeStats);

    const lambdaAlertesIntegration = new LambdaIntegration(planteAlertes);
    const humiditeAlertes = humidite.addResource("alertes");
    humiditeAlertes.addMethod("GET", lambdaAlertesIntegration);
    addCorsOptions(humiditeAlertes);
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
