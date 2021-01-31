AccountsTemplates.addFields([
    {
        _id: 'username',
        type: 'text',
        displayName: 'Username',
        required: true,
        minLength: 8,
        errStr: 'Usernames must be at least 8 characters in length.',
    },
]);
