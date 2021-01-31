// This is called to display the snackbar notification

showSnackbar = function(snackbarText, snackbarColor) {
    // console.log("Snackbar got Called!");
    var snackbarNotification = document.getElementById("snackbar")
    snackbarNotification.innerHTML = snackbarText;
    snackbarNotification.style.backgroundColor = snackbarColor;
    snackbarNotification.className = "show";
    setTimeout(function() {
        snackbarNotification.className = snackbarNotification.className.replace("show", "");
    }, 7000);
}