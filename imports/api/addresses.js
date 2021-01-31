import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Entities } from './entities.js';

export const Addresses = new Mongo.Collection('addresses');

Addresses.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    // *****************************************************************************
    //
    // Insert an address into the system for an agency / entity by manual
    // methods.
    //
    // *****************************************************************************
    'address.insert' (addressType, block, preDirection, streetName, streetType, postDirection, suiteAptType, suiteAptNo, cityName, stateAbbrev, zipCode, landMark, intersectingStreet, intersectingStreet2, latitude, longitude, hazardInfo, danger, directions, waterServiceProvider, waterServiceProviderPhone, waterServiceProviderAddress, gasServiceProvider, gasServiceProviderPhone, gasServiceProviderAddress, garbageServiceProvider, garbageServiceProviderPhone, garbageServiceProviderAddress, sewageServiceProvider, sewageServiceProviderPhone, sewageServiceProviderAddress, electricServiceProvider, electricServiceProviderPhone, electricServiceProviderAddress, cableServiceProvider, cableServiceProviderPhone, cableServiceProviderAddress, phoneServiceProvider, phoneServiceProviderPhone, phoneServiceProviderAddress, mainJurisdiction, mainZone, mainDistrict, mainBeat, policeJurisdiction, policeZone, policeDistrict, policeBeat, fireJurisdiction, fireZone, fireDistrict, fireBeat, emsJurisdiction, emsZone, emsDistrict, emsBeat, wreckerJurisdiction, wreckerZone, wreckerDistrict, wreckerBeat, dispatchJurisdiction, dispatchZone, dispatchDistrict, dispatchBeat) {
        check(addressType, String);
        check(block, String);
        check(preDirection, String);
        check(streetName, String);
        check(streetType, String);
        check(postDirection, String);
        check(suiteAptType, String);
        check(suiteAptNo, String);
        check(cityName, String);
        check(stateAbbrev, String);
        check(zipCode, String);
        check(landMark, String);
        check(intersectingStreet, String);
        check(intersectingStreet2, String);
        check(latitude, String);
        check(longitude, String);
        check(hazardInfo, String);
        check(danger, Boolean);
        check(directions, String);
        check(waterServiceProvider, String);
        check(waterServiceProviderPhone, String);
        check(waterServiceProviderAddress, String);
        check(gasServiceProvider, String);
        check(gasServiceProviderPhone, String);
        check(gasServiceProviderAddress, String);
        check(garbageServiceProvider, String);
        check(garbageServiceProviderPhone, String);
        check(garbageServiceProviderAddress, String);
        check(sewageServiceProvider, String);
        check(sewageServiceProviderPhone, String);
        check(sewageServiceProviderAddress, String);
        check(electricServiceProvider, String);
        check(electricServiceProviderPhone, String);
        check(electricServiceProviderAddress, String);
        check(cableServiceProvider, String);
        check(cableServiceProviderPhone, String);
        check(cableServiceProviderAddress, String);
        check(phoneServiceProvider, String);
        check(phoneServiceProviderPhone, String);
        check(phoneServiceProviderAddress, String);
        check(mainJurisdiction, String);
        check(mainZone, String);
        check(mainDistrict, String);
        check(mainBeat, String);
        check(policeJurisdiction, String);
        check(policeZone, String);
        check(policeDistrict, String);
        check(policeBeat, String);
        check(fireJurisdiction, String);
        check(fireZone, String);
        check(fireDistrict, String);
        check(fireBeat, String);
        check(emsJurisdiction, String);
        check(emsZone, String);
        check(emsDistrict, String);
        check(emsBeat, String);
        check(wreckerJurisdiction, String);
        check(wreckerZone, String);
        check(wreckerDistrict, String);
        check(wreckerBeat, String);
        check(dispatchJurisdiction, String);
        check(dispatchZone, String);
        check(dispatchDistrict, String);
        check(dispatchBeat, String);

        latitude = parseFloat(latitude);
        longitude = parseFloat(longitude);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to create a call priority.');
        }

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        let geoCoded = false;

        if (block != "" && block != null) {
            var myAddressString = block;
        } else {
            var myAddressString = "";
        }

        if (preDirection != "" && preDirection != null) {
            myAddressString = myAddressString + " " + preDirection;
        }

        if (streetName != "" && streetName != null) {
            myAddressString = myAddressString + " " + streetName;
        }

        if (streetType != "" && streetType != null) {
            myAddressString = myAddressString + " " + streetType;
        }

        if (postDirection != "" && postDirection != null) {
            myAddressString = myAddressString + " " + postDirection;
        }

        if (suiteAptType != "" && suiteAptType != null) {
            myAddressString = myAddressString + ", " + suiteAptType;
        }

        if (suiteAptNo != "" && suiteAptNo != null) {
            myAddressString = myAddressString + " " + suiteAptNo;
        }

        if (cityName != "" && cityName != null) {
            myAddressString = myAddressString + ", " + cityName;
        }

        if (stateAbbrev != "" && stateAbbrev != null) {
            myAddressString = myAddressString + ", " + stateAbbrev;
        }

        if (zipCode != "" && zipCode != null) {
            myAddressString = myAddressString + "  " + zipCode;
        }

        if (intersectingStreet != "" && intersectingStreet != null) {
            var intersection1 = streetName + " / " + intersectingStreet;
        } else {
            var intersectingStreet = "";
        }

        if (intersectingStreet2 != "" && intersectingStreet2 != null) {
            var intersection2 = streetName + " / " + intersectingStreet2;
        } else {
            var intersection2 = "";
        }

        if (latitude == 0 || latitude == "" || latitude == null) { 
            latitude = 0;
            longitude = 0;
            geoCaded = false;
        } else {
            geoCoded = true;
        }


        return Addresses.insert({
            foreignPriKey: "",
            addressType: addressType,
            addressEntity: userEntity,
            addressParentEntity: parentEntity,
            addressString: myAddressString,
            intersection1: intersection1,
            intersection2: intersection2,
            block: block,
            preDirection: preDirection,
            streetName: streetName,
            streetType: streetType,
            postDirection: postDirection,
            suiteAptType: suiteAptType,
            suiteAptNo: suiteAptNo,
            cityName: cityName,
            stateAbbrev: stateAbbrev,
            zipCode: zipCode,
            landMark: landMark,
            intersectingStreet: intersectingStreet,
            intersectingStreet2: intersectingStreet2,
            latitude: latitude,
            longitude: longitude,
            hazardInfo: hazardInfo,
            danger: danger,
            alertText: "",
            directions: directions,
            waterServiceProvider: waterServiceProvider,
            waterServiceProviderPhone: waterServiceProviderPhone,
            waterServiceProviderAddress: waterServiceProviderAddress,
            gasServiceProvider: gasServiceProvider,
            gasServiceProviderPhone: gasServiceProviderPhone,
            gasServiceProviderAddress: gasServiceProviderAddress,
            garbageServiceProvider: garbageServiceProvider,
            garbageServiceProviderPhone: garbageServiceProviderPhone,
            garbageServiceProviderAddress: garbageServiceProviderAddress,
            sewageServiceProvider: sewageServiceProvider,
            sewageServiceProviderPhone: sewageServiceProviderPhone,
            sewageServiceProviderAddress: sewageServiceProviderAddress,
            electricServiceProvider: electricServiceProvider,
            electricServiceProviderPhone: electricServiceProviderPhone,
            electricServiceProviderAddress: electricServiceProviderAddress,
            cableServiceProvider: cableServiceProvider,
            cableServiceProviderPhone: cableServiceProviderPhone,
            cableServiceProviderAddress: cableServiceProviderAddress,
            phoneServiceProvider: phoneServiceProvider,
            phoneServiceProviderPhone: phoneServiceProviderPhone,
            phoneServiceProviderAddress: phoneServiceProviderAddress,
            mainJurisdiction: mainJurisdiction,
            mainZone: mainZone,
            mainDistrict: mainDistrict,
            mainBeat: mainBeat,
            policeJurisdiction: policeJurisdiction,
            policeZone: policeZone,
            policeDistrict: policeDistrict,
            policeBeat: policeBeat,
            fireJurisdiction: fireJurisdiction,
            fireZone: fireZone,
            fireDistrict: fireDistrict,
            fireBeat: fireBeat,
            emsJurisdiction: emsJurisdiction,
            emsZone: emsZone,
            emsDistrict: emsDistrict,
            emsBeat: emsBeat,
            wreckerJurisdiction: wreckerJurisdiction,
            wreckerZone: wreckerZone,
            wreckerDistrict: wreckerDistrict,
            wreckerBeat: wreckerBeat,
            dispatchJurisdiction: dispatchJurisdiction,
            dispatchZone: dispatchZone,
            dispatchDistrict: dispatchDistrict,
            dispatchBeat: dispatchBeat,
            geoCoded: geoCoded,
        });
    },
    // *****************************************************************************
    //
    // Update an existing address
    //
    // *****************************************************************************
    'address.update' () {

    },
    // *****************************************************************************
    //
    // Delete an existing address (Note: this is a hard delete.)
    //
    // *****************************************************************************
    'address.delete' (addressId) {
        check(addressId, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to delete address information.');
        }

        return Addresses.remove({ _id: addressId });
    },
    // *****************************************************************************
    //
    // Import addresses from Incode Public Safety
    //
    // *****************************************************************************
    'importAddresses' (results) {
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to import address information..');
        }

        let lastAddress = Addresses.findOne({}, { sort: { addLocalKey: -1 }});
        if (typeof lastAddress == 'undefined' || lastAddress.addLocalKey == "" || lastAddress.addLocalKey == null) {
            var lastAddressKey = 0;
        } else {
            var lastAddressKey = lastAddress.addLocalKey;
        }

        let totalResults = results.data.recordset.length;
        console.log("Address data length: " + totalResults);
        let finalResults = results.data.recordset;

        // console.dir(finalResults[4994]);

        let userEntity = Meteor.users.findOne(this.userId).profile.usersEntity;
        let entityInfo = Entities.findOne({ entityName: userEntity });
        let parentEntity = entityInfo.entityParent;

        for (i = 0; i < totalResults; i++) {
            if (finalResults[i].Intersection_Streets != null) {
                let interStreets = (finalResults[i].Intersection_Streets).split(',');
                var interStreet1 = interStreets[1];
                var interStreet2 = interStreets[2];
            } else {
                var interStreet1 = "";
                var interStreet2 = "";
            }

            let latitude = 0;
            let longitude = 0;
            let geoCoded = false;

            let myAddressString = "";

            if (typeof finalResults[i].Block_Number != 'undefined' && finalResults[i].Block_Number != "" && finalResults[i].Block_Number != null) {
                myAddressString = myAddressString + finalResults[i].Block_Number;
            } else {
                myAddressString = "";
            }

            if (typeof finalResults[i].Direction != 'undefined' && finalResults[i].Direction != "" && finalResults[i].Direction != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].Direction;
                } else {
                    myAddressString = myAddressString + " " + finalResults[i].Direction;
                }
            }

            if (typeof finalResults[i].Street != 'undefined' && finalResults[i].Street != "" && finalResults[i].Street != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].Street;
                } else {
                    myAddressString = myAddressString + " " + finalResults[i].Street;
                }
            }

            if (typeof finalResults[i].Steet_Type != 'undefined' && finalResults[i].Steet_Type != "" && finalResults[i].Steet_Type != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].Steet_Type;
                } else {
                    myAddressString = myAddressString + " " + finalResults[i].Steet_Type;
                }
            }

            if (typeof finalResults[i].Apartment_Number != 'undefined' && finalResults[i].Apartment_Number != "" && finalResults[i].Apartment_Number != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].Apartment_Number;
                } else {
                    myAddressString = myAddressString + " " + finalResults[i].Apartment_Number;
                }
            }

            if (typeof finalResults[i].City != 'undefined' && finalResults[i].City != "" && finalResults[i].City != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].City;
                } else {
                    myAddressString = myAddressString + ", " + finalResults[i].City;
                }
            }

            if (typeof finalResults[i].State != 'undefined' && finalResults[i].State != "" && finalResults[i].State != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].State;
                } else {
                    myAddressString = myAddressString + ", " + finalResults[i].State;
                }
            }

            if (typeof finalResults[i].Zip != 'undefined' && finalResults[i].Zip != "" && finalResults[i].Zip != null) {
                if (myAddressString == "") {
                    myAddressString = myAddressString + finalResults[i].Zip;
                } else {
                    myAddressString = myAddressString + "  " + finalResults[i].Zip;
                }
            }

            let myAddressStringFinal = myAddressString.trim();
            console.log("myAddressString: " + myAddressStringFinal);

            if (typeof finalResults[i].Latitude == 'undefined' || finalResults[i].Latitude == null || finalResults[i].Latitude == "") {
                latitude = 0;
            } else {
                latitude = finalResults[i].Latitude;
                geoCoded = true;
            }
             
            if (typeof finalResults[i].Longitude == 'undefined' || finalResults[i].Longitude == null || finalResults[i].Longitude == "") {
                longitude = 0;
            } else {
                longitude = finalResults[i].Longitude;
                geoCoded = true;
            }

            let lastAddressNow = parseInt(lastAddressKey + i);
            if (typeof myAddressStringFinal != 'undefined' && myAddressStringFinal != null && myAddressStringFinal != "") {
                Addresses.insert({
                    addLocalKey: lastAddressNow,
                    foreignPriKey: finalResults[i].Primary_Key,
                    addressType: finalResults[i].Address_Type,
                    addressEntity: userEntity,
                    addressParentEntity: parentEntity,
                    addressString: myAddressString,
                    intersection1: "",
                    intersection2: "",
                    block: finalResults[i].Block_Number,
                    preDirection: finalResults[i].Direction,
                    streetName: finalResults[i].Street,
                    streetType: finalResults[i].Steet_Type,
                    postDirection: "",
                    suiteAptType: "",
                    suiteAptNo: finalResults[i].Apartment_Number,
                    cityName: finalResults[i].City,
                    stateAbbrev: finalResults[i].State,
                    zipCode: finalResults[i].Zip,
                    landMark: finalResults[i].Landmark,
                    intersectingStreet: interStreet1,
                    intersectingStreet2: interStreet2,
                    latitude: latitude,
                    longitude: longitude,
                    hazardInfo: finalResults[i].Hazard,
                    danger: false,
                    alertText: finalResults[i].Has_Alert,
                    directions: finalResults[i].Notes,
                    waterServiceProvider: finalResults[i].Water_Supplier,
                    gasServiceProvider: finalResults[i].Gas_Supplier,
                    electricServiceProvider: finalResults[i].Electric_Supplier,
                    geoCoded: geoCoded,
                    geoCodable: true,
                });
            } else {
                console.log('Address String was Blank - Not aadded to Address Index.');
            }
        }
    },
    // *****************************************************************************
    //
    // add lat and long to an address after geo-coding it
    //
    // *****************************************************************************
    'address.addLatLong' (loc_id, latitude, longitude) {
        check(loc_id, String);
        check(latitude, Number);
        check(longitude, Number);

        if (latitude == 200 && longitude == 200) {
            Addresses.update({ _id: loc_id }, {
                $set: {
                    latitude: latitude,
                    longitude: longitude,
                    geoCodable: false,
                    geoCoded: true,
                }
            });
        } else if (latitude == 300 && longitude == 300) {
            Addresses.update({ _id: loc_id }, {
                $set: {
                    latitude: latitude,
                    longitude: longitude,
                    geoCodable: false,
                    geoCoded: true,
                }
            });
        } else {
            Addresses.update({ _id: loc_id }, {
                $set: {
                    latitude: latitude,
                    longitude: longitude,
                    geoCodable: true,
                    geoCoded: true,
                }
            });
        }
    },
    'address.trimUp' () {
        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to trim address strings.');
        }

        let allAddresses = Addresses.find({}).fetch();

        let addressCount = allAddresses.length;

        for (t=0; t < addressCount; t++) {
            let updatedAddressString = (allAddresses[t].addressString).trim();

            // write the address back to the db.

            Addresses.update({ _id: allAddresses[t]._id }, {
                    $set:
                    {
                        addressString: updatedAddressString,
                    }
                });
        }

    },
    'address.markUnGeoCodable' () {
        Addresses.update({ $or: [ { block: '' }, { streetName: '' }, { cityName: '' }, { stateAbbrev: '' } ]}, { 
            $set: {
                geoCodable: false,
                geoCoded: true,
            }
        });

        // now mark the rest of the addresses as GeoCodable
        Meteor.call('address.markGeoCodable', function(err, result) {
            if (err) {
                console.log("Error marking addresses as geo-codable:  " + err);
            }
        });
    },
    'address.markGeoCodable' () {
        return Addresses.update({ 
            $and: [
                { block: { $ne: '' }},
                { streeName: { $ne: '' }},
                { cityName: { $ne: '' }},
                { stateAbbrev: { $ne: '' }}
        ]}, {
            $set: {
                geoCodable: true,
            }
        }, {
            multi: true
        });
    }
});
