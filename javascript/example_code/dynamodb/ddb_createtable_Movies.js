var AWS = require("aws-sdk");

// Set the region
AWS.config.update({region: 'REGION'}); // look in .aws/config or .aws\config
// REGION for Europe 'eu-west-1' and for the USA 'us-east-1' and 'us-west-2'

// Create DynamoDB service object
var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});