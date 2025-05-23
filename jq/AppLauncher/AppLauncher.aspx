<%@ Page Language="C#" AutoEventWireup="true" CodeFile="AppLauncher.aspx.cs" EnableTheming="false" StylesheetTheme="" Theme="" ValidateRequest="false" Inherits="_AppLauncher" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="head" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">

    <link rel="stylesheet" type="text/css" media="screen" href="css/apl.css"  />
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
        <div class="app-heading">Application Launcher</div>
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
            <div class="apl-wrapper">
                <p><label>Folder:</label><input class="apl-command" data-bind="value: commandFolder, disable: isRunning" /></p>
                <p><label>Command:</label><input class="apl-command" data-bind="value: commandLine, disable: isRunning" /></p>
                <p><label>Arguments:</label><input class="apl-command" data-bind="value: commandArgs, disable: isRunning" />
                    <button class="apl-start" data-bind="click: startApp, disable: isRunning">Start</button>
                    <span class="apl-status" data-bind="html: status"></span>
                </p>
                <p><div class="apl-output" data-bind="html: output"></div></p>
            </div>
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
            
        function aplViewModel() {
            var self = this;
            self.commandFolder = ko.observable("app.logkpis.com\\app.logkpis.com\\bin\\Debug");
            self.commandLine = ko.observable("app.logkpis.com.exe");
            self.commandArgs = ko.observable("-cERS2 -L -Overwrite -iPay_Period");
            self.output = ko.observable("");
            self.status = ko.observable("");
            self.isRunning = ko.observable(false);
            function scrolltobottom() {
                $('.apl-output').scrollTop($('.apl-output')[0].scrollHeight);
            };
            self.startApp = function () {
                self.isRunning(true);
                self.status("..running");
                self.output(self.output() + "<b>" + self.commandFolder() + "&gt;</b>&nbsp;" + self.commandLine() + "&nbsp;" + self.commandArgs() + "<br />");
                scrolltobottom();
                a$.ajax({
                    type: "GET", service: "JScript", async: true, data: { lib: "applauncher", cmd: "start", folder: self.commandFolder(), line: self.commandLine(), args: self.commandArgs() }, dataType: "json", cache: false, error: a$.ajaxerror,
                    success: loaded
                });
                function loaded(json) {
                    if (json.msg != "") {
                        self.output(self.output() + json.msg + "<br /><b>Application Stopped with Error</b><br /><br />");
                        self.isRunning(false);
                        self.status("");
                    }
                    else {
                        self.output(self.output() + "running...<br />");
                    }
                    scrolltobottom();
                }
                //alert("debug:starting app");
            };
        }
        ko.applyBindings(new aplViewModel(), $(".apl-wrapper")[0]);

    }

</script>
<script language="javascript">
    alert("debug:username=" + $.cookie("username"));
</script>

</body>
</html>