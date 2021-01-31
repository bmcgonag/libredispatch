import { Random } from 'meteor/random';
import { _ } from 'meteor/underscore';

export const TestData = {
    async fakeSeverity(parameters) {
        let params = {};

        if (!_.isUndefined(parameters)) {
            params = parameters;
        }

        const Severity = {};

        const faker = await import('faker');

        Severity.severityName = 'Fake Severity Name';
        Severity.severityColor = '#ffee33';
        Severity.textColor = '#ffe321';

        return Severity;
    },
}