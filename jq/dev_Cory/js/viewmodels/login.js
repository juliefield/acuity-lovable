/* global userProfile, appLib */

// Login view - can probably validate using knockout if we want to here too.    
function LoginViewModel() {
}

LoginViewModel.prototype.doLogin = function() {
	$('.login-validation').css('display', 'none');
    if (appLib.validateform({ formid: 'loginForm', errdiv: '.login-validation' })) {
    	appLib.login({ redirect: false, errdiv: '.login-validation', uid: 'usernameId', pid: 'passwordId', product: 'Acuity', service: "JScript" });
    }
    userProfile.loginfmt();
};