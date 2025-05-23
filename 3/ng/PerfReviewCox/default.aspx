<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_PerfReviewCox" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
<head id="Head1" runat="server">
  <title>Cox Performance Review</title>
  <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1"/>

  <!-- AngularJS ng- ng -->
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
  
  <!-- ES5 Compatibility for IE 11 -->
  <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
  <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>

  <asp:PlaceHolder runat="server">
    <!-- <link rel="stylesheet" href="../../../../App_Themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>"/> -->

    <!-- these are required for main.js for API / legacy functionality -->
    <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
    <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
    <script src="//code.angularjs.org/1.3.0-rc.1/angular-route.min.js"></script>
    <!-- OLD WAY
    <script type="text/javascript" src="../../../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
    -->
    <!-- NEW WAY -->
    <!-- <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script> -->

    <script type="text/javascript" src="scripts.js?<%=CONFMGR.Bump()%>"></script>

    <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>

    <!-- Login -->
    <!-- <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
    <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script> -->

    <link href="styles.css" rel="stylesheet">
  </asp:PlaceHolder>

</head>
<body>
  <section class="acuity-app">
    <ng-view></ng-view>
  </section>
</body>
</html>