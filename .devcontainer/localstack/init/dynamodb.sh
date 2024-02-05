#!/bin/sh

echo "DynamoDB setup start!"
echo "Creating DyanmoDB talbes..."

AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy \
    aws dynamodb list-tables \
    --region=us-east-1 \
    --endpoint-url=http://localstack:4566 \
    > /tmp/dynamotables.txt

if [ $? -ne 0 ]
then
echo -e "date : Error occurs while connecting aws dynamodb.. "
fi

for file in `\find /etc/localstack/init/ready.d/schemas -name '*.json'`;
do
    TABLE_NAME="$(basename -- $file | sed 's/\.[^\.]*$//')"
    echo "Creating $TABLE_NAME"
    if grep -q $TABLE_NAME /tmp/dynamotables.txt; then
        echo "table exists! $TABLE_NAME"
    else
        AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy \
            aws dynamodb create-table \
            --region=us-east-1 \
            --endpoint-url=http://localstack:4566 \
            --cli-input-json file://$file \
        && AWS_ACCESS_KEY_ID=dummy AWS_SECRET_ACCESS_KEY=dummy \
            aws dynamodb batch-write-item \
            --region=us-east-1 \
            --endpoint-url=http://localstack:4566 \
            --request-items file:///etc/localstack/init/ready.d/data/mainTableItems.json \
            --return-consumed-capacity INDEXES \
            --return-item-collection-metrics SIZE \
        && echo "$TABLE_NAME table created! and data inserted!"
    fi
done
echo "DynamoDB setup done!"
