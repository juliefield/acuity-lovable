<%@ Page Language="C#" AutoEventWireup="true" CodeFile="loginNew.aspx.cs" ValidateRequest="false" Inherits="_loginNew" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
<head id="Head1" runat="server">
  <title>Login</title>
  <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1"/>

  <!-- AngularJS ng- ng -->
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
  <!-- ES5 Compatibility for IE 11 -->
  <script src="../../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
  <script src="../../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>

  <asp:PlaceHolder runat="server">
    <link rel="stylesheet" href="../../../../App_Themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>"/>
    <link href="css/login-styles.css" rel="stylesheet">

    <!-- these are required for main.js for API / legacy functionality -->
    <script type="text/javascript" src="../../../../lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="../../../../lib/jquery/plugins/jquery.cookie.js"></script>
    <script type="text/javascript" src="../../../../appLib/js/appLib.js"></script>

    <script type="text/javascript" src="../../../../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
    <script type="text/javascript" src="../../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
  </asp:PlaceHolder>

</head>
<body id="login">
<ng-legacy-container>
  <section class="acuity-login">
    <h2>Welcome back! Please login.</h2>
    <div class="acuity-login-container">
      <div class="acuity-logo">
        <img src="images/acuity-logo.png" alt="Acuity"/>
        <!--CES LOGO <img src="../App_Themes/data/CEScoreLogoSmall6.jpg" /> -->
      </div>

      <div>
        <ng-login ng-show="!loginMode || loginMode === 'login'"></ng-login>
        <ng-change-password ng-show="loginMode === 'changePassword'"></ng-change-password>
      </div>
    </div>
  </section>
  <section class="acuity-form-copyright">
    <p id="debugdiv" runat="server"></p>
    <p>
      This system is for authorized use only. ©<script>document.write(new Date().getFullYear())</script> TouchPoint One, LLC. All Rights Reserved.
    </p>
  </section>
</ng-legacy-container>

<script type="text/javascript" language="javascript">
  //Added: 10/29/2015
  // var u = appLib.urlprefix();
  // document.title = u.toUpperCase() + "Login";
  // function trylogin() {
  //     $('#loginfv').css('display', 'none');
  //     if (appLib.validateform({ formid: 'loginform', errdiv: 'loginfv' })) { //Matthias: Please don't use form validation (please make your own)
  //        appLib.login({
  //           redirect: false, //Matthias: I will be converting this to a Promise.  For now, the success/failure message will be in id=loginfv.
  //           errdiv: 'loginfv',
  //           uid: 'usernameID',
  //           pid: 'passwordID',
  //           product: 'Acuity',
  //           service: 'JScript'
  //        });
  //     }
  // }
</script>
</body>
</html>