<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>
    <!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>Flex Settings v1.0</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1, initial-scale=1" />

        <!-- ES5 Compatibility for IE 11 -->
        <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
        <asp:PlaceHolder runat="server">
            <!-- these are required for main.js for API / legacy functionality -->
            <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
            <script type="text/javascript" src="../../../lib/jquery-ui/js/jquery-ui-1.8.16.custom.min.js"></script>
            <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.css">
            <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
            <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>

            <!-- AngularJS ng- ng -->
            <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
            <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
            <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>

            <!-- OLD WAY
    <script type="text/javascript" src="../../../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
    -->
            <!-- NEW WAY -->
            <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
            <!-- Login -->
            <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
            <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>

            <!-- Project Specific -->
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/pure/1.0.0/pure-min.css" integrity="sha256-Q0zCrUs2IfXWYx0uMKJfG93CvF6oVII21waYsAV4/8Q=" crossorigin="anonymous" />
            <link rel="stylesheet" href="css/styles.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="css/styles-ui.css?<%=CONFMGR.Bump()%>" />

            <!-- Date Range Picker Suite -->
            <script type="text/javascript" src="../../../lib/ace-builds/src-noconflict/ace.js"></script>
            <script type="text/javascript" src="../../../lib/moment/moment.min.js"></script>
            <link rel="stylesheet" href="../../../lib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
            <script type="text/javascript" src="../../../lib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
            <link rel="stylesheet" href="../../../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.css" />
            <script type="text/javascript" src="../../../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.js"></script>
            <script type="text/javascript" src="../../../lib/jquery-tablesorter/jquery.tablesorter.js"></script>

        </asp:PlaceHolder>
    </head>

    <body ng-controller="legacyController">
        <ng-legacy-container>
            <ng-embedded-login></ng-embedded-login>
            <section class="acuity-app" ng-show="LOGGED_IN()">
                <ng-embedded-header></ng-embedded-header>
                <div class="pure-g">
                    <div class="pure-u-1-1" ng-if="flex_list_show" ng-include="'flex-list.htm'"></div>
                    <div class="pure-u-1-1" ng-if="flex_form_show" ng-include="'flex-settings.htm'"></div>
                </div>
            </section>
        </ng-legacy-container>
    </body>

    </html>