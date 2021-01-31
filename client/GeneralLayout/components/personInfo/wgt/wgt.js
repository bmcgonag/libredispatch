Template.wgt.onRendered(function() {
    $('input.wgt').characterCounter();
});

Template.wgt.events({
    'focusout .wgt' (event) {
        let eventid = event.currentTarget.id;
        let wgtVal = $("#"+eventid).val();
        let wgtLen = wgtVal.length;

        if (wgtLen == 0 || wgtLen == 7 || wgtLen == null) {
            let wgtEl = document.getElementById(eventid);
            wgtEl.style.background = 'none';
            return;
        } else if (wgtLen != 3) {
            let wgtEl = document.getElementById(eventid);
            wgtEl.style.background = 'red';
            return;
        } else {
            let wgtEl = document.getElementById(eventid);
            wgtEl.style.background = 'none';
            newWgt = wgtVal + " lbs";
            $("#"+eventid).val(newWgt);
            return;
        }
    },
});