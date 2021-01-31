import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { VehStyles } from './vehStyles.js';
import { VehColors } from './vehColors.js';

export const VehMakesModels = new Mongo.Collection('vehMakesModels');

VehMakesModels.allow({
    insert: function(userId, doc) {
        // if user id exists, allow insert
        return !!userId;
    },
});

Meteor.methods({
    'importData.import' (importData, fileType) {
        check(fileType, String);

        if (!this.userId) {
            throw new Meteor.Error('User is not authorized to add Vehicle information.');
        }

        if (fileType == "makesModels") {
            for (i=0; i < importData.data.length; i++) {
                if (i != 0 && importData.data[i].VEHICLE_MAKE_CODE == importData.data[i-1].VEHICLE_MAKE_CODE) {
                    // add the other three fields to the existing VEHICLE MAKE CODE for this make
                    // console.log("Found Match.");
                    VehMakesModels.update({ make_code: importData.data[i].VEHICLE_MAKE_CODE }, {
                        $addToSet: {
                            make_info: {
                                model_code: importData.data[i].VEHICLE_MODEL_CODE,
                                make_model_desc: importData.data[i].MAKE_MODEL_DESCRIPTION,
                                model_desc: importData.data[i].MODEL_DESCRIPTION,
                                active: true,
                            }
                        },
                    });
                } else {
                    // create a new make code and add these fields to it.
                    // console.log("*** ---- No Match ---- ***");
                    VehMakesModels.insert({
                        make_code: importData.data[i].VEHICLE_MAKE_CODE,
                        active: true,
                        make_info: [
                            {
                                model_code: importData.data[i].VEHICLE_MODEL_CODE,
                                make_model_desc: importData.data[i].MAKE_MODEL_DESCRIPTION,
                                model_desc: importData.data[i].MODEL_DESCRIPTION,
                                active: true,
                            },
                        ]
                    });
                }
            }
        } else if (fileType == "styles") {
            for (j=0; j < importData.data.length; j++) {
                // create a new style code and add these fields to it.
                VehStyles.insert({
                    style_code: importData.data[j].STYLE_CODE,
                    style: importData.data[j].STYLE,
                    vehicle_type: importData.data[j].VEH_TYPE,
                    active: true,
                });
            }
        } else if (fileType == "vehColors") {
            // import veh colors.
            for (k=0; k < importData.data.length; k++) {
                // create a new Color Code for each color after checking to see if it exists.
                var colorCodeExists = VehColors.findOne({ veh_color_code: importData.data[k].VEH_COLOR_CODE });
                if (colorCodeExists) {
                    // console.log("color code exists already");
                } else {
                    VehColors.insert({
                        veh_color_code: importData.data[k].VEH_COLOR_CODE,
                        veh_color_desc: importData.data[k].VEH_COLOR_DESC,
                        active: true,
                    });
                }
            }
        }
    },
});
