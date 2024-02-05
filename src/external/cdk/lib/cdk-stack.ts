import * as cdk from 'aws-cdk-lib';
import { aws_dynamodb as dynamodb } from 'aws-cdk-lib';
import { AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB
    const table = new dynamodb.Table(this, 'MangaManagerMainTable', {
      tableName   : 'MangaManagerMainTable',
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'dataType',
        type: AttributeType.STRING,
      },

      /**
       * - STANDARD: Read/Writeの頻度が多くメインで利用する場合。
       * - STANDARD_INFREQUENT_ACCESS: Read/Writeの頻度が少ない場合。Read/Writeのコストが25%高く、ストレージのコストがになる。
       */
      tableClass: dynamodb.TableClass.STANDARD,

      /**
       * 25まで無料
       */
      readCapacity: 1,

      /**
       * 25まで無料
       */
      writeCapacity: 1,

      /**
       * テーブルの暗号化
       * - DEFAULT: デフォルトの暗号化。無料
       * - AWS_MANAGED: AWS KMSで管理される。有料
       * - CUSTOMER_MANAGED: ユーザーがKMSで管理する。有料
       */
      encryption: dynamodb.TableEncryption.DEFAULT,

      /**
       * テーブルの削除を防ぐ。削除時はこれをfalseに変更してから削除する。
       */
      deletionProtection: true,

      /**
       * - PROVISIONED: 指定したRCU/WCUの分だけ課金される。
       * - PAY_PER_REQUEST: 使用量に応じて課金される。
       */
      billingMode: dynamodb.BillingMode.PROVISIONED,

      /**
       * Destroy: cdk destroy 時にテーブルを削除する。
       * Retain: cdk destroy 時にテーブルを削除しない。
       */
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // DataValueGSI
    table.addGlobalSecondaryIndex({
      indexName     : 'DataValueGSI',
      partitionKey  : { name: 'dataValue', type: dynamodb.AttributeType.STRING },
      sortKey       : { name: 'dataType', type: dynamodb.AttributeType.STRING },
      readCapacity  : 1,
      writeCapacity : 1,
      projectionType: dynamodb.ProjectionType.ALL,
    });
  }
}
