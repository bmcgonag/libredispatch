Template.hgt.onRendered(function() {
    $('input.hgt').characterCounter();
});

Template.hgt.events({
    'focusout .hgt' (event) {
        let eventid = event.currentTarget.id;
        let hgtVal = $("#"+eventid).val();
        let hgtLen = hgtVal.length;
        if (hgtLen == 0 || hgtLen == 6 || hgtLen == null) {
            let hgtEl = document.getElementById(eventid);
            hgtEl.style.background = 'none';
            return;
        } else if (hgtLen != 3) {
            let hgtEl = document.getElementById(eventid);
            hgtEl.style.background = 'red';
            return;
        } else {
            let hgtFt = hgtVal.slice(0,1);
            let hgtIn = hgtVal.slice(1,3);

            let newHgt = hgtFt + "' " + hgtIn + '"';
            let hgtEl = document.getElementById(eventid);
            hgtEl.style.background = 'none';
            $("#"+eventid).val(newHgt); 
            return;
        }
    },
});