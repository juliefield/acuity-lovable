<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserProfile_Start.aspx.cs" EnableTheming="false" StylesheetTheme="" Theme="" ValidateRequest="false" Inherits="_UserProfile_Start" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="head" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">

    <link rel="stylesheet" type="text/css" media="screen" href="css/app.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="css/err.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="css/login.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="css/styles.css"  />

    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/knockout-3.2.0.js" type="text/javascript"></script>

    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>appLib/js/logoanimation-1.0.0.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>

    <script type="text/javascript" src="../../appLib/js/applib-1.1.15.js"></script>

</asp:PlaceHolder>
</head>
<body>
    <div class="app-header gradient-lightest">
        <div class="app-logo"><h1><span>Acuity &reg;</span></h1></div>
        <div class="app-heading">User Profile</div>
        <div class="header-tile">
            <div class="err-icon">
            </div>
        </div>
        <div class="login-form">
            <form id="loginForm" action="#">
                <div><label>Username:</label><input class="login-field" type="text" id="usernameId" name="F:username/R:nonblank:0" /></div>
                <div><label>Password:</label><input class="login-field" type="password" id="passwordId" name="F:password/R:nonblank:1" /></div>
                <div><input id="loginbutton" type="button" value="log in" /></div>
                <div><span class="login-validation"></span></div>
            </form>
        </div>
        <div class="login-welcome">Welcome <span class="login-username"></span> <a href='#' onclick="$.cookie('username','');location.reload();" title='Log Out'>Log Out</a><span class="login-lock"></span>
        </div>
        <div class="err-container"><div class="err-hide">Done with this error</div><div class="err-text">Acuity Error:</div><div class="err-content">&nbsp;</div><div class="err-text">This notice has already been submitted to technical services.  If you would like to add more information, please enter it below and submit.</div><div><input id="errinput" type="text" style="width: 500px;" value="" /><input id="errsubmit" type="button" value="Submit" /></div><div class="err-text">We will work diligently to correct this problem.  You will be notified when we have a solution or work-around for you.</div></div>
    </div>
    <div class="content">
        <div class="auth-hide">
            Please Log In.
        </div>
        <div class="auth-show" style="display:none;">
            <p>First name: <strong data-bind="text: firstName"></strong></p>
            <p>Last name: <strong data-bind="text: lastName"></strong></p>
            <p>First name: <input data-bind="value: firstName" /></p>
            <p>Last name: <input data-bind="value: lastName" /></p>
            <p>Full name: <strong data-bind="text: fullName"></strong></p>
            <button data-bind="click: capitalizeLastName">Go caps</button>
        </div>
    </div>

<script type="text/javascript" language="javascript">

    $(document).ready(function () {
        $.AcuityLogoAnimate({ canvas: Raphael(0, 0, 500, 70), offset: [4, 1] });
        function loginfmt() {
            if (($.cookie("username") != null) && ($.cookie("username") != "")) {
                $(".login-form,.auth-hide").hide();
                $(".login-username").html($.cookie("username"));
                $(".login-welcome,.auth-show").show();
                launchApp();
            }
        }
        $("#loginbutton").unbind().bind("click", function () {
            $('.login-validation').css('display', 'none');
            if (appLib.validateform({ formid: 'loginForm', errdiv: '.login-validation' })) {
                appLib.login({ redirect: false, errdiv: '.login-validation', uid: 'usernameId', pid: 'passwordId', product: 'Acuity', service: "JScript" });
            }
            loginfmt();
        });
        loginfmt();
        $('.err-icon').qtip({ content: 'Error (Click for details)' }).bind("click", function () {
            if ($(".err-container").first().is(":visible")) $(".err-container").hide();
            else $(".err-container").show();
        });
        $('.err-hide').bind("click", function () { $(".err-container,.err-icon").hide(); });
        $("#errsubmit").bind("click", function () {
            a$.submiterror($("#errinput").val());
            $(".err-container,.err-icon").hide();
        });
    });

    function launchApp() {
        //I have: $.cookie("username") and $.cookie("role")

        var user;

        function AppViewModel() {
            var self = this;

            self.firstName = ko.observable(user.name.first);
            self.lastName = ko.observable(user.name.last);

            //Knockout Example:
            self.fullName = ko.computed(function () {
                return self.firstName() + " " + self.lastName();
            }, self);

            self.capitalizeLastName = function () {
                var currentVal = self.lastName();        // Read the current value
                self.lastName(currentVal.toUpperCase()); // Write back a modified value
            };
        }

        var u = a$.gup("userid"); // i.e. ?userid=jeffgack
        if (u=="") u=$.cookie("username");

        a$.ajax({
            type: "GET", service: "JScript", async: true, data: { lib: "userprofile", cmd: "getname", user: u }, dataType: "json", cache: false, error: a$.ajaxerror,
            success: loaded });
        function loaded(json) {
            if (!a$.jsonerror(json)) {
                user = json;
                ko.applyBindings(new AppViewModel());
            }
        }
    }

</script>

</body>
</html>