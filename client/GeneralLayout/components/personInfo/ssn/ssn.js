Template.ssn.onRendered(function() {
    $('input.ssn').characterCounter();
});

Template.ssn.events({
    'focusout .ssn' (event) {
        // when we focus out of the field, let's check it, and mask the SSN
        // if it's not 9 digits, let's turn it red to tell the user to fix it.
        let eventid = event.currentTarget.id;
        let ssnVal = $("#"+eventid).val();
        let lenCheck = ssnVal.length;

        if (lenCheck == 0 || lenCheck == 15 || lenCheck == null) {
            let ssnEl = document.getElementById(eventid);
            ssnEl.style.background = 'none';
            return;
        } else if (lenCheck != 9) {
            let ssnEl = document.getElementById(eventid);
            ssnEl.style.background = 'red';
            return;
        } else {
            let ssn1 = ssnVal.slice(0,3);
            let ssn2 = ssnVal.slice(3,5);
            let ssn3 = ssnVal.slice(5,9);
            let ssnMask = ssn1 + ' - ' + ssn2 + ' - ' + ssn3;
            let ssnEl = document.getElementById(eventid);
            ssnEl.style.background = 'none';
            $("#"+eventid).val(ssnMask);
        }
    },
});