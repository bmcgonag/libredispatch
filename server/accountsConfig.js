var postSignUp = function(userId, info) {
    let countOfUsers = Meteor.users.find().count();

    if (countOfUsers == 1) {
        // if no user exists in the system yet, set this first user to GlobalAdmin role
        // and take him / her to the global admin settings view.
        Roles.addUsersToRoles(userId, 'GlobalAdmin');
        Meteor.call("AddEntityToUser", "Global", function(err, result) {
            if (err) {
                console.log('"Unable to set Global Entity for user.');
            } else {
                Meteor.call('setDefaultUserSettings', userId, function(err, result) {
                    if (err) {
                        console.log("Couldn't set default user settings for admin: " + err);
                    } else {
                        // console.log("Default User Settings set for admin.");
                        FlowRouter.go('/admin/startupWizard');
                    }
                });
            }
        });
    } else {
        // if a user already exists, set new sign ups to the 'allUsers' role, and let
        // a global admin or local admin re-assign them to the appropriate role.

        Roles.addUsersToRoles(userId, 'allUsers');
        Meteor.call('setDefaultUserSettings', userId, function(err, result) {
            if (err) {
                console.log("Couldn't set defaults: " + err);
            } else {
                // console.log("Completed adding default settings for user.");
                FlowRouter.go('/users/selectAnAgency');
            }
        });
    }
}

AccountsTemplates.configure({
    postSignUpHook: postSignUp,
});
