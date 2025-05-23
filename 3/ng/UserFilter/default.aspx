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

  <section class="acuity-app" ng-show="LOGGED_IN()" style="height:100%">
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

        <div class="container" style="overflow-y:scroll;height:calc(100% - 75px)">
            <div >
                <a>
                    <div><h2>Name / UserID:</h2><input type="text" ng-model="filter"></div>
                
                    <hr>
                    
                    <h2>Roles:</h2>
                    <select ng-model="selectedrole">
                        <option value="">Any</option>
                        <option ng-repeat="role in json.roles" value="{{ role.role }}">{{ role.role }}</option>
                    </select> 
                    
                    <hr>
                    
                    <h2>Users:</h2>
                    <ul style="height:512px;width:512px;border:1px solid black;overflow:auto;overflow-x:hidden;list-style-type:none;margin:0;padding:0">
                    
                        <li style="width:auto;position:relative" ng-repeat="user in json.users" ng-show="selectedrole==user.role||selectedrole==''&&(filterchecked(user.lastnm + ', ' + user.firstnm)||filterchecked(user.user_id)||filterchecked(user.firstnm)||filterchecked(user.lastnm))">
                            <p style="position:relative;left:10px">{{ user.lastnm + ", " + user.firstnm + " (" + user.user_id + ")" }}</p>
                            <p style="position:relative;left:10px"><b>{{ user.role }}</b></p>
                            <div style="position:absolute;top:-5px;right:10px"><button ng-click="selectuser(user)">SELECT</button></div>
                            <hr>
                        </li>
                    </ul>
                    <hr />

                    <h2>Selected User: {{ showselecteduser() }}</h2>

                    <h2>Attributes:</h2>
                    <ul style="height:128px;width:256px;border:1px solid black;overflow:auto;overflow-x:hidden;list-style-type:none;margin:0;padding:0">
                    
                        <li style="width:auto;position:relative" ng-repeat="filter in selecteduser.filters" ng-show="hasfilter(selecteduser, filter)">
                            <p style="position:relative;left:10px">{{ filter.name }}</p>
                            <div style="position:absolute;top:-5px;right:10px"><button ng-click="deleteattribute(filter)">DELETE</button></div>
                            <hr />
                        </li>
                    </ul>
                    <select ng-model="selectedattr" style="width:256px">
                        <option ng-repeat="filter in json.filters" ng-show="checkattribute(filter)" ng-value="{{ filter }}">{{ filter.filter_name }}</option>
                    </select> <button ng-click="addattribute()">ADD ATTRIBUTE</button>
                </a>
            </div>

		</div>

  </section>
</ng-legacy-container>


</body>
</html>