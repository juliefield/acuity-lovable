<%@ Page Language="C#" AutoEventWireup="true" CodeFile="EntityManager.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>Entity Manager</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
        <!-- AngularJS ng- ng -->
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
        <!-- ES5 Compatibility for IE 11 -->
        <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
        <asp:PlaceHolder runat="server">
            <link rel="stylesheet" href="/App_Themes/Acuity3/app-1.0.16.css?<%=CONFMGR.Bump()%>" />
            <!-- these are required for main.js for API / legacy functionality -->
            <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
            <script type="text/javascript" src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
            <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
            <script type="text/javascript" src="../../../appLib/js/appLib-1.1.15.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
            <!-- Login -->
            <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
            <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/base.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/projectManager.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/groupManager.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/teamManager.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/locationManager.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/themeManager.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/DEVAREA1/vm/userManager.js?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>
            <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>" />
            <link rel="stylesheet" href="css/styles.css?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>" />
            <link rel="stylesheet" href="css/entityManagerStyles.css?<%=DateTime.Now.Minute.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Millisecond.ToString()%>" />
            <script src="https://kit.fontawesome.com/550f4bc1b1.js" crossorigin="anonymous"></script>
        </asp:PlaceHolder>
    </head>

    <body ng-controller="legacyController">
        <ng-legacy-container>            
            <ng-embedded-login></ng-embedded-login>
            <section class="acuity-app" ng-show="LOGGED_IN()">
                <ng-embedded-header iframehide="true"></ng-embedded-header>
                <div>
                    <div class="tab-holder">
                        <span class="tab-holder-item project-tab" onclick="DisplayTab('project')">Project</span>
                        <span class="tab-holder-item location-tab" onclick="DisplayTab('location')">Location</span>
                        <span class="tab-holder-item group-tab" onclick="DisplayTab('group')">Group</span>
                        <span class="tab-holder-item team-tab" onclick="DisplayTab('team')">Team</span>
                        <span class="tab-holder-item user-tab" onclick="DisplayTab('user')">User</span>
                    </div>                    
                </div>
                <div class="page-entity-manager-holder project-holder">
                    <ng-project-manager intabdisplay="true"></ng-project-manager>
                </div>
                <div class="page-entity-manager-holder group-holder">
                    <ng-group-manager intabdisplay="true"></ng-group-manager>
                </div>
                <div class="page-entity-manager-holder team-holder">
                    <ng-team-manager intabdisplay="true"></ng-team-manager>
                </div>
                <div class="page-entity-manager-holder location-holder">
                    <ng-location-manager intabdisplay="true"></ng-location-manager>
                </div>
                <div class="page-entity-manager-holder user-holder">
                    <ng-user-manager intabdisplay="true"></ng-user-manager>
                </div>
            </section>
        </ng-legacy-container>
        <script>
            $(document).ready(function(){
                DisplayTab(a$.gup("entityMode"));
            });
            function HideAllTabs()
            {
                $(".tab-holder-item").removeClass("active-tab");

                $(".page-entity-manager-holder", document).each(function(){                                        
                    $(this).hide();
                });
            }
            function DisplayTab(tabName)
            {
                HideAllTabs();
                $("." + tabName + "-tab", document).addClass("active-tab");
                $("." + tabName + "-holder", document).show();                
            }
            
        </script>
    </body>

    </html>