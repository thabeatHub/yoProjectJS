(function(){
	// body...
	angular
		.module('yoProjectJS')
		.controller('dynamoDBController', dynamoDBController);

		dynamoDBController.$inject = ['$scope', '$http', '$routeParams','loginService', 'customAWSService'];

		function dynamoDBController($scope, $http, $routeParams, loginService, customAWSService){

			var vm = this;
            vm.queriedItem = "";

            vm.newItem = "";

            vm.dynamodb = new customAWSService.AWS.DynamoDB(
                {
                    apiVersion: '2012-08-10',
                    region: 'us-west-2'
                });

            vm.docClient = new customAWSService.AWS.DynamoDB.DocumentClient({service: vm.dynamodb});
            console.log("DynamoDB Ready");

            vm.dynamodb.scan(params={TableName: "JStable"}, function(err, data) {
                if (err) console.log(err, err.stack); // an error occurred
                //else console.log(data);           // successful response
            }).promise().then(function(result){
                    console.log("Success!" + JSON.stringify(result));
                    vm.fullDynDBData = result.Items;
                }).catch(function(failure){
                    console.log("Failure: " + JSON.stringify(failure));
                    vm.queriedItem = "There was an error on your query!!";
                });

            vm.queryAction = function(){

                placeholderKey = vm.key;

                vm.params = {
                    TableName: "JStable",
                    KeyConditionExpression: "FileName = :itemname",
                    ExpressionAttributeValues: {
                        ":itemname": placeholderKey
                    }
                }

                vm.docClient.query(vm.params, function(err, data){
                        if(err) console.log("There was an error");
                        //else console.log(data);
                }).promise().then(function(result){
                    console.log("Success!" + JSON.stringify(result));
                    vm.queriedItem = result.Items;
                }).catch(function(failure){
                    console.log("Failure: " + JSON.stringify(failure));
                    vm.queriedItem = "There was an error on your query!!";
                });
            }

            vm.deleteAction = function(){

                placeholderKey = vm.key;

                vm.params = {
                    TableName: "JStable",
                    KeyConditionExpression: "FileName = :itemname",
                    ExpressionAttributeValues: {
                        ":itemname": placeholderKey
                    }
                }

                vm.dynamodb.deleteItem(vm.params, function(err, data){
                        if(err) console.log("There was an error");
                        //else console.log(data);
                }).promise().then(function(result){
                    console.log("Success!" + JSON.stringify(result));
                    vm.queriedItem = result.Items;
                }).catch(function(failure){
                    console.log("Failure: " + JSON.stringify(failure));
                    vm.queriedItem = "There was an error on your query!!";
                });

                vm.dynamodb.scan(params={TableName: "JStable"}, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    //else console.log(data);           // successful response
                }).promise().then(function(result){
                        console.log("Success!" + JSON.stringify(result));
                        vm.fullDynDBData = result.Items;
                    }).catch(function(failure){
                        console.log("Failure: " + JSON.stringify(failure));
                        vm.queriedItem = "There was an error on your query!!";
                    });
            }

            vm.populate = function(){

                vm.dynamodb.updateItem(
                    params={
                        TableName: "JStable",
                        Key: {
                            FileName: {S: vm.newItem.FileName}
                        },
                        AttributeUpdates:{
                            FileDescription: {
                                Action: "PUT",
                                Value: {S: vm.newItem.FileDescription}
                            },
                            FileDate: {
                                Action: "PUT",
                                Value: {S: JSON.stringify(vm.newItem.FileDate)}
                            },
                            FileType: {
                                Action: "PUT",
                                Value: {S: vm.newItem.FileType}
                            },
                            FileTags: {
                                Action: "PUT",
                                Value: {S: vm.newItem.FileTags}
                            }

                        }

                    },function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    //else console.log(data);           // successful response
                })

                vm.dynamodb.scan(params={TableName: "JStable"}, function(err, data) {
                    if (err) console.log(err, err.stack); // an error occurred
                    //else console.log(data);           // successful response
                }).promise().then(function(result){
                        console.log("Success!" + JSON.stringify(result));
                        vm.fullDynDBData = result.Items;
                    }).catch(function(failure){
                        console.log("Failure: " + JSON.stringify(failure));
                        vm.queriedItem = "There was an error on your query!!";
                    });

                console.log(JSON.stringify(vm.newItem,null,"    "));

            }
        }

})();