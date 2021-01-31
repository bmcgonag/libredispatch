import { Addresses } from '../../../../imports/api/addresses.js';
import { Jurisdiction } from '../../../../imports/api/jurisdiction.js';
import { ErrorLogs } from '../../../../imports/api/errorLogs.js';
import { UserSettings } from '../../../../imports/api/userSettings.js';

Template.manualAddressEntry.onCreated(function() {
    this.subscribe('entityAddresses');
    this.subscribe('entityJurisdictions');
    this.subscribe('errorLogs');
    this.subscribe('activeUserSettings');
});

Template.manualAddressEntry.onRendered(function() {
    $('ul.tabs').tabs();
    setTimeout(function() {
        $('select').formSelect();
    }, 500);

    $('textarea#directions').characterCounter();
    $('.collapsible').collapsible();
});

Template.manualAddressEntry.helpers({
    userPrefs: function() {
        let myId = Meteor.userId();
        let settings = UserSettings.findOne({ userId: myId });
        if (settings) {
            return settings;
        }
    },
});

Template.manualAddressEntry.events({
    'click .saveAddress' (event) {
        event.preventDefault();

        let addType = $("#addressType").val();
        let block = $("#blockNumber").val();

        let street = $("#streetName").val();
        let sType = $("#streetType").val();
        if (sType == null) {
            sType = "";
        }

        let preDir = $("#preDirection").val();
        if (preDir == null) {
            preDir = "";
        }

        let postDir = $("#postDirection").val();
        if (postDir == null) {
            postDir = "";
        }

        let aptType = $("#suiteAptType").val();
        if (aptType == null) {
            aptType = "";
        }

        let aptNo = $("#suiteAptNo").val();
        let city = $("#cityName").val();
        let state = $("#stateAbbrev").val();
        let zip = $("#zipCode").val();

        // get extended info now
        let landmark = $("#landmark").val();
        let intStreet1 = $("#intersectingStreet").val();
        let intStreet2 = $("#intersectingStreet2").val();
        let latitude = $("#latitude").val();
        let longitude = $("#longitude").val();
        let hazard = $("#hazardInfo").val();
        let danger;
        if ($('input.danger').is(':checked')) {
            danger = true;
        } else {
            danger = false;
        }
        let directions = $("#directions").val();

        // now get zone info
        let mainJuris = $("#mainJurisdiction").val();
        let mainZone = $("#mainZone").val();
        let mainDist = $("#mainDistrict").val();
        let mainBeat = $("#mainBeat").val();

        let policeJuris = $("#policeJurisdiction").val();
        let policeZone = $("#policeZone").val();
        let policeDist = $("#policeDistrict").val();
        let policeBeat = $("#policeBeat").val();

        let fireJuris = $("#fireJurisdiction").val();
        let fireZone = $("#fireZone").val();
        let fireDist = $("#fireDistrict").val();
        let fireBeat = $("#fireBeat").val();

        let EMSJuris = $("#EMSJurisdiction").val();
        let EMSZone = $("#EMSZone").val();
        let EMSDist = $("#EMSDistrict").val();
        let EMSBeat = $("#EMSBeat").val();

        let wreckerJuris = $("#wreckerJurisdiction").val();
        let wreckerZone = $("#wreckerZone").val();
        let wreckerDist = $("#wreckerDistrict").val();
        let wreckerBeat = $("#wreckerBeat").val();

        let dispatchJuris = $("#dispatchJurisdiction").val();
        let dispatchZone = $("#dispatchZone").val();
        let dispatchDist = $("#dispatchDistrict").val();
        let dispatchBeat = $("#dispatchBeat").val();

        // get Service provider info
        let waterSP = $("#waterSP").val();
        let waterPhone = $("#waterSPPhone").val();
        let waterAddress = $("#waterSPAddress").val();

        let gasSP = $("#gasSP").val();
        let gasPhone = $("#gasSPPhone").val();
        let gasAddress = $("#gasSPAddress").val();

        let electricSP = $("#electricSP").val();
        let electricPhone = $("#electricSPPhone").val();
        let electricAddress = $("#electricSPAddress").val();

        let garbageSP = $("#garbageSP").val();
        let garbagePhone = $("#garbageSPPhone").val();
        let garbageAddress = $("#garbageSPAddress").val();

        let sewageSP = $("#sewageSP").val();
        let sewagePhone = $("#sewageSPPhone").val();
        let sewageAddress = $("#sewageSPAddress").val();

        let cableSP = $("#cableSP").val();
        let cablePhone = $("#cableSPPhone").val();
        let cableAddress = $("#cableSPAddress").val();

        let phoneSP = $("#phoneSP").val();
        let phonePhone = $("#phoneSPPhone").val();
        let phoneAddress = $("#phoneSPAddress").val();

        // check for required fields

        if (addType == null || addType == "") {
            showSnackbar("Address Type is Required!", "red");
            return;
        } else {
            // take action
            Meteor.call("address.insert", addType, block, preDir, street, sType, postDir, aptType, aptNo, city, state, zip, landmark, intStreet1, intStreet2, latitude, longitude, hazard, danger, directions, waterSP, waterPhone, waterAddress, gasSP, gasPhone, gasAddress, garbageSP, garbagePhone, garbageAddress, sewageSP, sewagePhone, sewageAddress, electricSP, electricPhone, electricAddress, cableSP, cablePhone, cableAddress, phoneSP, phonePhone, phoneAddress, mainJuris, mainZone, mainDist, mainBeat, policeJuris, policeZone, policeDist, policeBeat, fireJuris, fireZone, fireDist, fireBeat, EMSJuris, EMSZone, EMSDist, EMSBeat, wreckerJuris, wreckerZone, wreckerDist, wreckerBeat, dispatchJuris, dispatchZone, dispatchDist, dispatchBeat, function(err, result) {
                if (err) {
                    console.log("Error Adding Address: " + err);
                    showSnackbar("Error Adding Address!", "red");
                    Meteor.call("Log.Errors", "addressSetup.js", "click .saveAddress", err);
                } else {
                    showSnackbar("Address Added Successfully!", "green");
                }
            });
        }

    },
    'click .cancelAddAddress' (event) {
        event.preventDefault();


    },
});

Template.zoneAddressInfo.helpers({
    mainJurisList: function() {
        return Jurisdiction.find({ jurisCategory: "Main", jurisType: "Jurisdiction" });
    },
    mainZoneList: function() {
        return Jurisdiction.find({ jurisCategory: "Main", jurisType: "Zone" });
    },
    mainDistList: function() {
        return Jurisdiction.find({ jurisCategory: "Main", jurisType: "District" });
    },
    mainBeatList: function() {
        return Jurisdiction.find({ jurisCategory: "Main", jurisType: "Beat" });
    },
    policeJurisList: function() {
        return Jurisdiction.find({ jurisCategory: "Police", jurisType: "Jurisdiction" });
    },
    policeZoneList: function() {
        return Jurisdiction.find({ jurisCategory: "Police", jurisType: "Zone" });
    },
    policeDistList: function() {
        return Jurisdiction.find({ jurisCategory: "Police", jurisType: "District" });
    },
    policeBeatList: function() {
        return Jurisdiction.find({ jurisCategory: "Police", jurisType: "Beat" });
    },
    fireJurisList: function() {
        return Jurisdiction.find({ jurisCategory: "Fire", jurisType: "Jurisdiction" });
    },
    fireZoneList: function() {
        return Jurisdiction.find({ jurisCategory: "Fire", jurisType: "Zone" });
    },
    fireDistList: function() {
        return Jurisdiction.find({ jurisCategory: "Fire", jurisType: "District" });
    },
    fireBeatList: function() {
        return Jurisdiction.find({ jurisCategory: "Fire", jurisType: "Beat" });
    },
    EMSJurisList: function() {
        return Jurisdiction.find({ jurisCategory: "EMS", jurisType: "Jurisdiction" });
    },
    EMSZoneList: function() {
        return Jurisdiction.find({ jurisCategory: "EMS", jurisType: "Zone" });
    },
    EMSDistList: function() {
        return Jurisdiction.find({ jurisCategory: "EMS", jurisType: "District" });
    },
    EMSBeatList: function() {
        return Jurisdiction.find({ jurisCategory: "EMS", jurisType: "Beat" });
    },
    wreckerJurisList: function() {
        return Jurisdiction.find({ jurisCategory: "Wrecker", jurisType: "Jurisdiction" });
    },
    wreckerZoneList: function() {
        return Jurisdiction.find({ jurisCategory: "Wrecker", jurisType: "Zone" });
    },
    wreckerDistList: function() {
        return Jurisdiction.find({ jurisCategory: "Wrecker", jurisType: "District" });
    },
    wreckerBeatList: function() {
        return Jurisdiction.find({ jurisCategory: "Wrecker", jurisType: "Beat" });
    },
    dispatchJurisList: function() {
        return Jurisdiction.find({ jurisCategory: "Dispatch", jurisType: "Jurisdiction" });
    },
    dispatchZoneList: function() {
        return Jurisdiction.find({ jurisCategory: "Dispatch", jurisType: "Zone" });
    },
    dispatchDistList: function() {
        return Jurisdiction.find({ jurisCategory: "Dispatch", jurisType: "District" });
    },
    dispatchBeatList: function() {
        return Jurisdiction.find({ jurisCategory: "Dispatch", jurisType: "Beat" });
    },
});
