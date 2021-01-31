var adminRoutes = FlowRouter.group({
    prefix: "/admin",
});

var userRoutes = FlowRouter.group({
    prefix: "/user",
});

FlowRouter.route('/', {
    name: 'home',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'homeView' });
    }
});

userRoutes.route('/mainCallSheet', {
    name: 'mainCall',
    action: function() {
        BlazeLayout.render('MainLayout', { main: 'CallSheetMain' });
    }
});

userRoutes.route('/userViewMain', {
    name: 'userViewMain',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'userViewMain' });
    }
});

userRoutes.route('/callSheetDetail', {
    name: 'callSheetDetail',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'callSheetForm' });
    }
});

userRoutes.route('/calls_view', {
    name: 'calls_view',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'CallSheetMain' });
    }
});

userRoutes.route('/omv_dispatch_view', {
    name: 'omv_dispatch_view',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'dispatchSMV' });
    }
});

userRoutes.route('/inServiceUnits', {
    name: 'inServiceUnits',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'inServiceUnits' });
    }
});

userRoutes.route('/universalCodes', {
    name: 'universalCodes',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'universalCodes' });
    }
});

userRoutes.route('/universalPersons', {
    name: 'universalPersons',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'personsForm' });
    }
});

userRoutes.route('/selectAnAgency', {
    name: 'selectAnAgency',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'selectAnAgency' });
    }
});

adminRoutes.route('/admin', {
    name: 'admin',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'adminSetup' });
    }
});

adminRoutes.route('/systemTypeSetup', {
    name: 'systemTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'systemTypeSetup' });
    }
});

adminRoutes.route('/dashboard', {
    name: 'dashboard',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'dashboard' });
    }
});

adminRoutes.route('/userGroupSetup', {
    name: 'userGroupSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'userGroupSetup' });
    }
});

adminRoutes.route('/demo911', {
    name: 'demo911',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'demo911' });
    }
});

adminRoutes.route('/suffixSetup', {
    name: 'suffixSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'suffixSetup' });
    }
});

adminRoutes.route('/titleSetup', {
    name: 'titleSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'titleSetup' });
    }
});

adminRoutes.route('/alertsSetup', {
    name: 'alertsSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'alertsSetup' });
    }
});

adminRoutes.route('/alertSeverity', {
    name: 'alertSeverity',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'alertSeverity' });
    }
});

adminRoutes.route('/alertTypes', {
    name: 'alertTypes',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'alertTypes' });
    }
});

// Below are routes to GlobalEntity Admin pages

adminRoutes.route('/entityTypeSetup', {
    name: 'entityTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'entityTypeSetup' });
    }
});

adminRoutes.route('/globalAdmin', {
    name: 'globalAdmin',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'globalAdminSetup' });
    }
});

adminRoutes.route('/entitySetup', {
    name: 'entitySetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'entitySetup' });
    }
});

adminRoutes.route('/unitTypeSetup', {
    name: 'unitTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'unitTypeSetup' });
    }
});

adminRoutes.route('/personnelSetup', {
    name: 'personnelSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'personnelSetup' });
    }
});

adminRoutes.route('/manageUsersView', {
    name: 'manageUsers',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'manageUsers' });
    }
});

adminRoutes.route('/contextMenuSetup', {
    name: 'contextMenuSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'contextMenuSetup' });
    }
});

adminRoutes.route('/commandSetup', {
    name: 'commandSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'commandSetup' });
    }
});

adminRoutes.route('/exportCollections', {
    name: 'exportCollections',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'exportCollections' });
    }
});

adminRoutes.route('/importCollections', {
    name: 'importCollections',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'importCollections' });
    }
});

// below here are routes to local Admin pages

adminRoutes.route('/callPrioritySetup', {
    name: 'callPrioritySetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'callPrioritySetup'});
    }
});

adminRoutes.route('/callTypeSetup', {
    name: 'callTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'callTypeSetup'});
    }
});

adminRoutes.route('/addressSetup', {
    name: 'addressSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'addressSetup'});
    }
});

adminRoutes.route('/jurisdictionSetup', {
    name: 'jurisdictionSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'jurisdictionSetup'});
    }
});

adminRoutes.route('/vehMakesModelsSetup', {
    name: 'vehMakesModelsSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'vehMakeImport'});
    }
});

adminRoutes.route('/generalCodeSetup', {
    name: 'generalCodeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'importGeneral'});
    }
});

adminRoutes.route('/quickNotesSetup', {
    name: 'quickNotesSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'quickNotesSetup'});
    }
});

adminRoutes.route('/dispositionSetup', {
    name: 'dispositionSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'dispositionSetup'});
    }
});

adminRoutes.route('/startupWizard', {
    name: 'startupWizard',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'startupWizard'});
    }
});

adminRoutes.route('/transTypeSetup', {
    name: 'transTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'transTypeSetup'});
    }
});

adminRoutes.route('/oovTypeSetup', {
    name: 'oovTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'outOfVehicleSetup'});
    }
});

adminRoutes.route('/wreckerRotationSetup', {
    name: 'wreckerRotationSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'wreckerRotationSetup'});
    }
});

adminRoutes.route('/capAndEquipMainSetup', {
    name: 'capAndEquipMainSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'capAndEquipMainSetup'});
    }
});

adminRoutes.route('/unitSubTypeSetup', {
    name: 'unitSubTypeSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'unitSubTypeSetup'});
    }
});

adminRoutes.route('/unitDivisionSetup', {
    name: 'unitDivisionSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'unitDivisionSetup'});
    }
});

adminRoutes.route('/unitSetup', {
    name: 'unitSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'unitServiceSetup'});
    }
});

adminRoutes.route('/unitCapEquipMain', {
    name: 'unitCapEquipMain',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'unitCapEquipMain'});
    }
});

adminRoutes.route('/tenantSetup', {
    name: 'tenantSetup',
    action: function(params) {
        BlazeLayout.render('MainLayout', {main: 'tenantSetup'});
    }
});

userRoutes.route('/userSettings', {
    name: 'userSettings',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'userSettings' });
    }
});

userRoutes.route('/setupMessage', {
    name: 'setupMessage',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'setupMessage' });
    }
});

userRoutes.route('/messaging', {
    name: 'messaging',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'messaging' });
    }
});

userRoutes.route('/unitsDisplayGrid', {
    name: 'unitsDisplayGrid',
    action: function (params) {
        BlazeLayout.render('MainLayout', { main: 'unitsDisplayGrid'});
    }
});

/* --------------------------------- ONLY TESTING BELOW THIS LINE ---------------------------------- */
userRoutes.route('/rightClickMenu', {
    name: 'rightClickMenu',
    action: function(params) {
        BlazeLayout.render('MainLayout', { main: 'rightClickMenu' });
    }
});
