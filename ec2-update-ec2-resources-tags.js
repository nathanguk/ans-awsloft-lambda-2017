'use strict'
const AWS = require('aws-sdk');


exports.handler = function (event, context, callback) {
    //console.log('Recieved event:', JSON.stringify(event, null, 2));
    
    // Define new EC2 Object
    var ec2region = event.region;
    console.log('Updating Tags For All Instances in ', ec2region);
    var ec2 = new AWS.EC2({apiVersion: '2016-11-15',region: ec2region});

    // Function to apply tags to resources

        if(ec2instance.Tags.Length > 0){
            function applytags(tags,resources){
                var tagparrams = {
                    Resources: resources,
                    Tags: tags
                };
            };
            ec2.createTags(tagparrams, function(err, data) {
                if (err) {
                    console.log('Tag Error: ', err);
                    context.fail('Tag Error: ', err );
                } else {
                    //console.log(data);
                    return data
                };
            });
        } else {
            function applytags(tags,resources){
                var tagparrams = {
                    Resources: resources
                };
            };
            ec2.deleteTags(tagparrams, function(err, data) {
                if (err) {
                    console.log('Tag Error: ', err);
                    context.fail('Tag Error: ', err );
                } else {
                    //console.log(data);
                    return data
                };
            });
        };        
    };

    // Get all EC2 Instance Reseravtions
    var ec2params = {};
    ec2.describeInstances(ec2params, function(err, data) {
        if (err) {
            console.log('Find Instances: ', err);
            context.fail('Find Instances: ', err );
        } else {
            // Loop through EC2 Reservations
            var ec2reservations = data.Reservations;
            ec2reservations.forEach(function(ec2reservation) {

                // Get all EC2 Instances in Reservation
                var ec2instances = ec2reservation.Instances;
                ec2instances.forEach(function(ec2instance){

                    // Log Instance Id
                    console.log(ec2instance.InstanceId);

                    // Get Instance Tags
                        var ec2instanceTags = ec2instance.Tags;
                        
                        // Get Block device mappings
                        var ec2blockmappings = ec2instance.BlockDeviceMappings;

                        // Loop through block devices in block device mappings
                        ec2blockmappings.forEach(function(ec2blockdevice) {

                            //Find EBS Volume for block device
                            var ec2ebsvolume = ec2blockdevice.Ebs;
                            console.log(ec2ebsvolume.VolumeId);
                            
                            // Applying EC2 Instance Tags to EBS Volume
                            applytags(ec2instanceTags,[ec2ebsvolume.VolumeId]);

                            // Get all Snapshots for Volume
                            var ec2snapparams = {
                                Filters: [{Name: "volume-id", Values: [ec2ebsvolume.VolumeId]}]
                            };
                            ec2.describeSnapshots(ec2snapparams, function(err, data) {
                                if (err) {
                                    console.log('Find Snapshots: ', err);
                                    context.fail('Find Snapshots: ', err );
                                } else {
                                    //Loop through volume Snapshots
                                    var ec2ebssnaps = data.Snapshots
                                    ec2ebssnaps.forEach(function(ec2ebssnap) {
                                        console.log(ec2ebssnap.SnapshotId);
                                        // Applying EC2 Instance Tags to Snapshots
                                        applytags(ec2instanceTags,[ec2ebssnap.SnapshotId]);  
                                    });
                                };
                            });
                            
                        });

                        // Loop through Network Interfaces on Instance
                        var ec2enis = ec2instance.NetworkInterfaces;
                        ec2enis.forEach(function(ec2eni) {
                            console.log(ec2eni.NetworkInterfaceId);
                            // Applying EC2 Instance Tags to ENI
                            applytags(ec2instanceTags,[ec2eni.NetworkInterfaceId]);   
                        });
                });
            });
        }
    });        
}