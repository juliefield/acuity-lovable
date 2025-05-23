<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>Acuity Prize Catalog</title>
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
            <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
            <!-- Login -->
            <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
            <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/PrizeCatalog/vm/prizeCatalogUserHeader.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/PrizeCatalog/vm/prizeCatalogView.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/PrizeCatalog/vm/UserLedger.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/PrizeCatalog/vm/userRedeemedPrizes.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/PrizeCatalog/vm/prizeCatalogAdmin.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/PrizeCatalog/vm/tangoCardSelector.js?<%=DevBumper%>"></script>

            <script type="text/javascript" src="js/acuityPrizeCatalogPage.js?<%=DevBumper%>"></script>
            <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
            <link rel="stylesheet" href="css/acuity-prize-catalog.css?<%=DevBumper%>" />
            <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
        </asp:PlaceHolder>
    </head>

    <body ng-controller="legacyController">
        <ng-legacy-container>
            <ng-embedded-login></ng-embedded-login>
            <section class="acuity-app prize-catalog-bg " ng-show="LOGGED_IN()">
                <ng-embedded-header iframehide="true"></ng-embedded-header>
                <div class="user-prize-catalog-page-holder" >
                  <div class="user-prize-catalog-page-header-holder">
                      <ng-prize-catalog-user-header></ng-prize-catalog-user-header>
                  </div>
                  <div class="user-prize-catalog-page-body-holder">
                     <div class="user-prize-catalog-tab-holder ">
                        <div class="user-prize-catalog-tab" id="userPrizeCatalogTab_fullCatalog">Prize Catalog</div> 
                        <div class="user-prize-catalog-tab" id="userPrizeCatalogTab_userPrizes">Redeemed Prizes</div>
                        <div class="user-prize-catalog-tab" id="userPrizeCatalogTab_userLedger">Ledger</div>
                        <div class="user-prize-catalog-tab" id="userPrizeCatalogTab_catalogAdmin">Catalog Admin</div>
                        <div class="user-prize-catalog-tab" id="userPrizeCatalogTab_tangoCard">Tango Card</div>
                     </div>
                     <div id="userPrizeCatalogDisplayHolder_LoadingMessage">
                        <img id="userMessageImageHolder" src="/applib/css/images/acuity-loading.gif" class="user-prize-catalog-loading-image" height="75">
                        <div class="user-prize-catalog-loading-message-holder user-message" id="userMessageTextHolder"></div>
                     </div>
                     <div class="user-prize-catalog-tab-contents" id="userPrizeCatalogDisplayHolder_Content">
                        <ng-prize-catalog-view></ng-prize-catalog-view>
                     </div>
                     <div class="user-prize-catalog-tab-contents" id="userPrizeEarnedDisplayHolder_Content">
                        <ng-user-redeemed-prizes></ng-user-redeemed-prizes>
                     </div>
                     <div class="user-prize-catalog-tab-contents" id="userPrizeRedeemLedgerHolder_Content">
                        <ng-user-ledger></ng-user-ledger>
                     </div>
                     <div class="user-prize-catalog-tab-contents" id="userPrizeCatalogAdminHolder_Content">
                        <ng-prize-catalog-admin></ng-prize-catalog-admin>
                     </div>
                     <div class="user-prize-catalog-tab-contents" id="userTangoCardHolder_Content">
                        <ng-tango-card-selector></ng-tango-card-selector>
                     </div>
                  </div>
                  <div class="user-prize-catalog-page-footer-holder">
                     &nbsp;
                  </div>
               </div>
               <div id="userThemeBackgroundHolder" class="user-prize-catalog-theme-background-holder">&nbsp;</div>
            </section>
        </ng-legacy-container>
   </body>

    </html>