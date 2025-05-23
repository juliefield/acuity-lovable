<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="IntegrationDefault" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

<head id="Head1" runat="server">
   <title>Acuity - Integrations</title>
   <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
   <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
   <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
   <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossorigin="anonymous"></script>
   <script src="//sdk-cdn.mypurecloud.com/client-apps/1.3.0/purecloud-client-app-sdk.js"></script>
   <script src="//sdk-cdn.mypurecloud.com/javascript/latest/purecloud-platform-client-v2.min.js"></script>
   <asp:PlaceHolder runat="server">
      <script type="text/javascript" src="../lib/jquery/jquery-1.7.2.min.js"></script>
      <script type="text/javascript" src="../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
      <script type="text/javascript" src="../lib/jquery/plugins/jquery.cookie.js"></script>
      <script type="text/javascript" src="../appLib/js/appLib-1.1.15.js?<%=DevBumper%>"></script> 
      <script type="text/javascript" src="../appLib/js/modules/mainModule.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../appLib/js/services/mainServices.js?<%=DevBumper%>"></script>
   </asp:PlaceHolder>
   <script type="text/javascript" src="./js/integration.js"></script>
   <style>
      :root  {
         --table-topper: #1F2B39;
         --background-gray: #EBF0F5;
         --brand-blue: #009ad9;
         --brand-blue-hover: #006d99;
         --teal: #1BB895;
         --slate: #405362;
         --light-blue: #EBF0F5;
         --border-color-gray: #d6d6d6;
         --red: #BB0000;
         --red-hover: #800303;
         --green: #32AB0A;
         --yellow: #FFCC00;
         --gray: #d7d7d7;
         --light-gray: #eee;
         --lighter-gray: #f4f4f4;
         --dark-gray: #353535;
         --font-color: #000;
         --error-bg:#ffcbcb;
      }
      body
      {
         font-size: 25px;
      }
      .acuity-loading-full-page-holder
      {
         width:100%;
         height:100%;
         min-height:100%;
         min-width:100%;
         padding:10% 5%;
         background-color: var(--lighter-gray);
      }
      .acuity-loading-holder {
         position: absolute;
         top: 15vh;
         left: 0;
         right: 0;
         max-width: 900px;
         margin: 0 auto;
         z-index: 9999;
         padding:15px;
         background-color:#fff;
         border:1px solid #eee;
         -webkit-border-radius: 15px;
         -moz-border-radius: 15px;
         border-radius: 15px;
      }
      .acuity-loading-image-holder
      {
         text-align:center;
      }
      .acuity-loading-message-text
      {
         font-weight:bold;
         text-align:center;
      }
      .acuity-loading-message-holder
      {
      }
      
   </style>
</head>
<body>
   <div class="acuity-loading-full-page-holder">
      <div class="acuity-loading-holder">
         <div class="acuity-loading-image-holder">
            <img src="../applib/css/images/acuity-loading.gif" alt="Loading Acuity">
         </div>
         <div class="acuity-loading-message-holder">
            <p class="acuity-loading-message-text">Loading Acuity...</p>
         </div>
      </div>
   </div>

</body>

</html>