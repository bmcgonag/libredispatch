import { Meteor } from 'meteor/meteor';
import { ErrorLogs } from '../imports/api/errorLogs.js';
import { http } from 'meteor/http';
import { Addresses } from '../imports/api/addresses.js';
import { Calls } from '../imports/api/calls.js';
import { Entities } from '../imports/api/entities.js';
import { log } from 'util';

Meteor.methods({
    'getAddresses' (serverUrl, dbName, dbUser, dbPasswd) {
        try {
            console.log("got: " + serverUrl + " / " + dbName + " / " + dbUser + " / " + dbPasswd);
            let myEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
            let myParentEntity = Entities.findOne({ entityName: myEntity }).entityParent;

            // first find the last address imported and get the local rec no
            let lastAddress = Addresses.findOne({ addressParentEntity: myParentEntity }, { sort: { addLocalKey: -1 }});
            if (typeof lastAddress == 'undefined' || lastAddress.addLocalKey == "" || lastAddress.addLocalKey == null) {
                var lastAddressKey = 0;
                var lastRecNoImported = 0;
                getExternalAddressData(0, serverUrl, dbName, dbUser, dbPasswd);
            } else {
                var lastAddressKey = lastAddress.addLocalKey;
                var lastRecNoImported = lastAddress.foreignPriKey;
                getExternalAddressData(lastRecNoImported, serverUrl, dbName, dbUser, dbPasswd);
            }
        } catch (err) {
            console.log(err);
            Meteor.call("Log.Errors", "/server/dataImportServices.js", "getAddresses", err);
        }
    },
    'getXYCallLocationInfo' (callLocation) {
        console.log("Made it.");
        console.log("Call Location is: ");
        console.log(callLocation);


        let locationInfo = Addresses.findOne({ addressString: callLocation });

        console.log("--------    ********    --------");
        console.log("Location Info:");
        console.log(locationInfo);

        let loc_id = locationInfo._id;

    // *************************************************************
    // create the address building blocks for the web call
    // *************************************************************

        if (locationInfo.block != null && locationInfo.block != "") {
            var block = (locationInfo.block).trim() + '+';
        } else {
            var block = "";
        }

        if (locationInfo.preDirection != null && locationInfo.preDirection != "") {
            var preDirection = (locationInfo.preDirection).trim() + '+'
        } else {
            var preDirection = "";
        }

        if (locationInfo.streetName != null && locationInfo.streetName != "") {
            var streetName = (locationInfo.streetName).trim() + '+';
        } else {
            var streetName = "";
        }

        if (locationInfo.postDirection != null && locationInfo.postDirection != "") {
            var postDirection = (locationInfo.postDirection).trim() + '+'
        } else {
            var postDirection = "";
        }

        if (locationInfo.streetType != null && locationInfo.streetType != "") {
            var streetType = (locationInfo.streetType).trim();
        } else {
            var streetType = "";
        }

        if (locationInfo.cityName != null && locationInfo.cityName != "") {
            var city = (locationInfo.cityName).trim();
        } else {
            var city = "";
        }

        if (locationInfo.stateAbbrev != null && locationInfo.stateAbbrev != "") {
            var state = (locationInfo.stateAbbrev).trim();
        } else {
            var state = "";
        }

        if (locationInfo.zipCode != null && locationInfo.zipCode != "") {
            var zip = (locationInfo.zipCode).trim();
        } else {
            var zip = "";
        }

        let streetInfo = "";
        // let streetInfo = block + preDirection + streetName + postDirection + streetType;
        // instead I need to check if they exist then include them only if they do.
        if (block != "" && block != null) {
            streetInfo = streetInfo + block;
        }
        
        if (preDirection != "" && preDirection != null) {
            streetInfo = streetInfo + preDirection;
        }

        if (streetName != "" && streetName != null) {
            streetInfo = streetInfo + streetName;
        }

        if (postDirection != "" && postDirection != null) {
            streetInfo = streetInfo + postDirection;
        }

        if (streetType != "" && streetType != null) {
            streetInfo = streetInfo + streetType;
        }

        // console.log("");
        // console.log("**** -------------------------------------- ****");
        // console.log("Street Info: " + streetInfo);
        // console.log("**** -------------------------------------- ****");
        // console.log("");

        if (typeof locationInfo == 'undefined') {
            console.log("No Location Info Defined!");
            return;
        }

        streetInfo = streetInfo.trim();

        if (locationInfo.latitude == '' || locationInfo.longitude == '' || locationInfo.latitude == null || locationInfo.longitude == null || locationInfo.latitude == 0 || locationInfo.longitude == 0) {
            let reqString = 'https://geocoding.geo.census.gov/geocoder/geographies/address?street='+ streetInfo + '&city=' + city + '&state=' + state + '&benchmark=Public_AR_Census2010&vintage=Census2010_Census2010&layers=14&format=jsonp';
        // console.log("----------------------------------------");
        // console.log(reqString);
        // console.log("----------------------------------------")

            // const XYresult = HTTP.call('GET', reqString);
            getCoordsFromWebService(loc_id, reqString, function(err, result) {
                return result;
            });

        } else {
            console.log("!!!! ------------    ********    ------------ !!!!");
            console.log("Get Location Info from Local DB.");
            let latitude = locationInfo.latitude;
            let longitude = locationInfo.longitude;

            console.log("Coordinates are: " + latitude + " and " + longitude + " from Address Master Info.");
            let newResult = { latitude, longitude };
            return newResult;
        }
    },
    'geocode' (g) {

        // First we'll get rid of junk that just gums up what we are trying to do...like addresses with no block number.
        Meteor.call("address.markUnGeoCodable", function(err, result) {
            if (err) {
                console.log("Error cleaning up junk addresses: " + err);
            } else {
                // let's first query for all the address strings.
                let addInfo = Addresses.find({ geoCodable: true, geoCoded: false }, { limit: 1000}).fetch(); // <-- the .fecth() turns the returned result into an array
                        
                Meteor.setTimeout(function() {
                    // now let's get the length of the array of addresses (this is a lot of data).
                    let addressInfoSize = addInfo.length;
                    if (addressInfoSize <= 0) {
                        console.log("");
                        console.log("----------------------------------");
                        console.log("Nothing left to Geocode");
                        console.log("----------------------------------");
                        console.log("");
                        return;
                    }
                    console.log('Address Length of Array: ' + addressInfoSize);
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    console.log('');
                    let counter = 0;

                    var runGeoCodeCountUp = function(counter) {
                        if (counter < 1000) {
                            if (g < 1000) {
                                console.log("round " + g);
                                let addString = addInfo[g].addressString;
                                if (typeof addString == 'undefined' || addString == null || addString == "") {
                                    // console.log('No Address String');
                                    // console.log('--------------------------------');
                                    g = g + 1;
                                } else {
                                    if (typeof addInfo[g].latitude != 'undefined' && addInfo[g].latitude != 0 && addInfo[g].latitude != "0" && addInfo[g].latitude != null) {
                                        // console.log('Latitude exists already.');
                                        // console.log('--------------------------------');
                                        g = g + 1; 
                                    } else {
                                        // console.log('GeoCoding this one.');
                                        // console.log('!!!!    ----------------    !!!!');
                                        Meteor.call('getXYCallLocationInfo', addString);
                                        g = g + 1;
                                        Meteor.setTimeout(function() {
                                            // console.log("");
                                            // console.log("---------------------------------");
                                            // console.log("Waiting 1 second.");
                                            // console.log("---------------------------------");
                                            // console.log("");
                                        }, 1000); 
                                    }
                                }   
                            }
                            counter = counter + 1;
                            Meteor.setTimeout(function() {
                                runGeoCodeCountUp(counter);
                            }, 2000)
                        } else {
                            Meteor.call('geocode', 0);
                        }
                    }
                    runGeoCodeCountUp(counter);
                }, 5000);
            }
        });
    },
});

// this function imports address data from an Incode Public Safety database only.
// Do not use this unless the data in the view you are calling is formatted exactly the same.

var getExternalAddressData = function(lastRecNoImported, serverUrl, dbName, dbUser, dbPasswd) {
    // console.log("About to call for Addresses from DB");
    let webServiceUrl = 'http://localhost:22021/getAllAddresses/' + lastRecNoImported + '/' + serverUrl + '/' + dbName + '/' + dbUser + '/' + dbPasswd;
    const result = HTTP.call('GET', webServiceUrl);
    // console.log("Made Web Call for Addresses.");
    Meteor.call('importAddresses', result, function(err, results) {
        if (err) {
            console.log("Error importing addresses: " + err);
            Meteor.call("Log.Errors", "/server/dataImportServices.js", "importAddresses", err);
        } else {
            console.log("");
            console.log("----------------------");
            console.log("Addresses Imported!");
            return "Addresses Imported";
        }
    });
}

// this function attempts to get the coordinates of an address from geocoding.geo.census.gov
// You should only use this if the string is formatted as required by census.gov

async function getCoordsFromWebService(loc_id, reqString) {
    let XYresult = await HTTP.call('GET', reqString);
    // console.log("response received.");
    // console.log(XYresult.data.result);
    // console.log("Response is: ", XYresult.statusCode);

    if(XYresult.statusCode==200) {
        // console.log("-------- Response OK! ---------");
        // console.log(XYresult.data.result);
        // console.log(XYresult.data.result.addressMatches[0].coordinates);
        // console.log("--------------   **********    ---------------");
        // console.dir(XYresult.data.result.addressMatches[0].coordinates);

        if (XYresult.data != null) {
            if (XYresult.data.result != null) {
                if (typeof XYresult.data.result.addressMatches == 'undefined' || XYresult.data.result.addressMatches == null || XYresult.data.result.addressMatches == "") {
                    Meteor.call('address.addLatLong', loc_id, 200, 200, function (err, result) {
                        if (err) {
                            console.log("Error adding lat long to Address: " + err);
                            Meteor.call('Log.Errors', "dataImportServices.js", "call.addLatLong", err);
                        } else {
                            // console.log("Lat Long Not found - Added to Address with Location ID: " + loc_id);
                        }
                    });
                } else {
                    let latitude = XYresult.data.result.addressMatches[0].coordinates.y;
                    let longitude = XYresult.data.result.addressMatches[0].coordinates.x;
        
                    // console.log("-------------------------------------------");
                    // console.log("Coordinates are: " + latitude + " and " + longitude);
    
                    let newResult = { latitude, longitude };
                    // console.log("Adding lat and lon to Address.");
                    Meteor.call('address.addLatLong', loc_id, latitude, longitude, function(err, result) {
                        if (err) {
                            console.log("Error adding lat long to Address: " + err);
                            Meteor.call('Log.Errors', "dataImportServices.js", "call.addLatLong", err);
                        } else {
                            // console.log("Lat Long Added to Address with Location ID: " + loc_id);
                            // console.log('=========================================================');
                        }
                    });
                    return newResult;
                }
            } else {
                // console.log("No result data included in return.");
                return;
            }
        } else {
            Meteor.call('address.addLatLong', loc_id, 300, 300, function (err, result) {
                if (err) {
                    console.log("Error adding lat long to Address: " + err);
                    Meteor.call('Log.Errors', "dataImportServices.js", "call.addLatLong", err);
                } else {
                    // console.log("XYresult null - Added to Address with Location ID: " + loc_id);
                }
            });
        }
    } else {
        // console.log("Response issue: ", XYresult.statusCode);
        Meteor.call('address.addLatLong', loc_id, 300, 300, function (err, result) {
            if (err) {
                console.log("Error adding lat long to Address: " + err);
                Meteor.call('Log.Errors', "dataImportServices.js", "call.addLatLong", err);
            } else {
                // console.log("Lat Long Not found - Added to Address with Location ID: " + loc_id);
            }
        });
        throw new Meteor.Error(result.statusCode, errorJson.error);
        return;
    }
};
