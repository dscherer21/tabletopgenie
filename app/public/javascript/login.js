

var dispNewUserForm = function () {
    $("#newUserForm").css("display", "block");
    $("#loginForm").css("display", "none");
};

var dispCurrentUserForm = function () {
    $("#newUserForm").css("display", "none");
    $("#loginForm").css("display", "block");
};

var checkLogin = function () {
    //check the login
};


$(document).ready(function () {
    dispCurrentUserForm();
});
$(document.body).on("click", ".bttn-register", dispNewUserForm);
$(document.body).on("click", ".bttn-existing", dispCurrentUserForm);
