<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
<head id="Head1" runat="server">
  <title>Hello World 3</title>
  <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1"/>

  <!-- AngularJS ng- ng -->
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
  <!-- ES5 Compatibility for IE 11 -->
  <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
  <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>

  <asp:PlaceHolder runat="server">
    <link rel="stylesheet" href="../../../../App_Themes/Acuity3/css/app.css?<%=CONFMGR.Bump()%>"/>

    <!-- these are required for main.js for API / legacy functionality -->
    <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
    <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>

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

  </asp:PlaceHolder>

</head>
<body ng-controller="legacyController">
<ng-legacy-container>
  <ng-embedded-login></ng-embedded-login>

  <section class="acuity-app" ng-show="LOGGED_IN()">
        <ng-embedded-header></ng-embedded-header>

        <!--
        <p>You are logged in!</p>
        <p>User ID: {{me.person.uid}}</p>
        <p>Name: {{me.person.firstnm}} {{me.person.lastnm}}</p>
        <p>Role: {{me.person.role}}</p>
        <br /><br /> ...Put the app here.
        -->
        
        <header>
			<nav class="navbar navbar-default">
			<div class="container">
				<div class="navbar-header">
					<a class="navbar-brand" href="/"></a>
				</div>
                
			</div>
			</nav>
		</header>

        <div class="container">
            <div>
                <a>
                    <h2>Projects:</h2>
                    <select ng-model="selectedprojectid">
                        <option ng-repeat="project in json.projects" value="{{ project.id }}">{{ project.desc }}</option>
                    </select> 
                    
                    <hr>
                    
                    <div><h2>Filter:</h2><input type="text" ng-model="filter"> <span><b>Enter text to limit results returned.</b></span></div>
                    
                    <hr>
                    
                    <ul style="height:512px;width:512px;border:1px solid black;overflow:auto;overflow-x:hidden;list-style-type:none;margin:0;padding:0">
                    
                        <li style="width:auto;position:relative" ng-repeat="client in json.clientdept" ng-show="selectedprojectid==client.idproject&&filterchecked(client.desc)&&client.desc!=''">
                            <p style="position:relative;left:10px">{{ client.desc }}</p>
                            <div style="position:absolute;top:-5px;right:10px"><button ng-click="removeclient($index)">DELETE</button></div>
                            <hr>
                        </li>
                    </ul>
                    <hr />
                    <h2>Add client:</h2>
                    <input type="text" style="width:300px" ng-model="newclient"><button ng-click="addclient(newclient)">ADD CLIENT</button>
                </a>
            </div>

		</div>

  </section>
</ng-legacy-container>


</body>
</html>