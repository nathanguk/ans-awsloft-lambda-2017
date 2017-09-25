'use strict'
const AWS = require('aws-sdk');


exports.handler = function (event, context, callback) {
    //console.log('Recieved event:', JSON.stringify(event, null, 2));
    var awsaccount = context.invokedFunctionArn.split(":")[4];

    var currentdate = new Date();
    var oneDay = 24 * 60 * 60 * 1000;
    var oneHour = 60 * 60 * 1000;

    // Define new EC2 Object
    var ec2region = "eu-west-2"    //event.region;
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15',region: ec2region});

    // Get all EC2 SnapShots
    var ec2snapparams = {
        Filters: [{Name: "owner-id", Values: [awsaccount]}]
    };
    ec2.describeSnapshots(ec2snapparams, function(err, data) {
        if (err) {
            console.log('Find Snapshots: ', err);
            context.fail('Find Snapshots: ', err );
        } else {
            //Loop through volume Snapshots
            var ec2ebssnaps = data.Snapshots
            ec2ebssnaps.forEach(function(ec2ebssnap) {              
                // Loop through tags and find snap-retention tag
                var snapTags = ec2ebssnap.Tags;
                snapTags.forEach(function(snapTag) {
                    if(snapTag.Key = "snap-retention"){
                        //Gets current age of the snapshot
                        var datediff = currentdate - ec2ebssnap.StartTime;
                        // Checks id the the current age is equal or greater than the snap-retention tag value
                        if(Math.floor(datediff/oneHour) >= snapTag.Value){
                            console.log("Deleting Snapshot " + ec2ebssnap.SnapshotId)
                            var params = { 
                                SnapshotId: ec2ebssnap.SnapshotId
                            };
                            // Trys to delete snapshot
                            ec2.deleteSnapshot(params, function(err, data) {
                                if (err) console.log(err, err.stack); // an error occurred
                                else     console.log(data);           // successful response
                            });
                        };                      
                    };
                });
            });
        };
    });      
}