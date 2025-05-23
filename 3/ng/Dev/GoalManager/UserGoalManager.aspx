<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserGoalManager.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>Acuity Dev</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
        <!-- AngularJS ng- ng -->
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
        <!-- ES5 Compatibility for IE 11 -->
        <script src="../../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="../../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
        <asp:PlaceHolder runat="server">
            <link rel="stylesheet" href="../../../../App_Themes/Acuity3/app-1.0.16.css?<%=CONFMGR.Bump()%>" />
            <!-- these are required for main.js for API / legacy functionality -->
            <script type="text/javascript" src="../../../../lib/jquery/jquery-1.7.2.min.js"></script>
            <script type="text/javascript" src="../../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
            <script type="text/javascript" src="../../../../lib/jquery/plugins/jquery.cookie.js"></script>
            <script type="text/javascript" src="../../../../appLib/js/appLib-1.1.15.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../../lib/knockout/knockout-3.3.0.js"></script>
            <script type="text/javascript" src="../../../../lib/knockout/ko.mapping.js"></script>
            <script type="text/javascript" src="../../../../lib/knockout/ko-postbox.js"></script>
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
            <!-- Login -->
            <link href="../../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
            <script type="text/javascript" src="../../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>            
            <script type="text/javascript" src="../../../../appLib/dev/GOALTASK1/vm/userGoalManager.js?<%=DateTime.Now.Day.ToString() + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Hour.ToString() +  DateTime.Now.Minute.ToString() +  DateTime.Now.Second.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>            
            <script type="text/javascript" src="../../../../appLib/dev/GOALTASK1/vm/userTaskManager.js?<%=DateTime.Now.Day.ToString() + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Hour.ToString() +  DateTime.Now.Minute.ToString() +  DateTime.Now.Second.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>            
            <link rel="stylesheet" href="../../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />                                    
            <link rel="stylesheet" href="../../../../appLib/dev/GOALTASK1/goalTaskStyles.css?<%=CONFMGR.Bump()%>" />
            <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
        </asp:PlaceHolder>
    </head>
 
    <body ng-controller="legacyController">
        <ng-legacy-container>
            <ng-embedded-login></ng-embedded-login>
            <section class="acuity-app" ng-show="LOGGED_IN()">
                <ng-embedded-header></ng-embedded-header>
                <div class="widget-display">                    
                    <div class="widget-display-container">                        
                        <div class="widget">
                            <ng-user-goal-manager displaylimiteddata="false"></ng-user-goal-manager>
                        </div>
                        <div class="widget">
                            <ng-user-task-manager displaylimiteddata="false"></ng-user-task-manager>
                        </div>
                    </div>
                </div>
            </section>            
        </ng-legacy-container>
    </body>

    </html>