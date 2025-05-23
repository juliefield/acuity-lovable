<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" ValidateRequest="false" Inherits="app_Default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>TouchPointOne</title>
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />


    <link rel="stylesheet" href="../jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />
    <script type="text/javascript" src="../jquery/ui/js/jquery-1.6.2.min.js"></script>

    <script type="text/javascript" src="../jquery/ui/development-bundle/ui/jquery.ui.core.js"></script>
	<script type="text/javascript" src="../jquery/ui/development-bundle/ui/jquery.ui.widget.js"></script>
	<script type="text/javascript" src="../jquery/ui/development-bundle/ui/jquery.ui.tabs.js"></script>

    <script src="../jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="../jquery/plugins/jquery.hashchange.js" type="text/javascript"></script>

  	<link rel="stylesheet" href="../appMMP/css/styles.css" type="text/css" />
  	<link rel="stylesheet" href="../appMMP/css/app.css" type="text/css" />
    <script type="text/javascript" src="../appLib/js/appLibOLD.js"></script>
    <script type="text/javascript" src="../appMMP/js/appMMP.js"></script>

</head>
<body id="APP_HOME" runat="server" style="position: relative;">
    <div class="header">
        <div class="logo">
            TouchPoint<b>One</b>
        </div>
         <div class="gear" onclick="showmenu('sub_settings',this);"></div>
         <div id="username" onclick="showmenu('sub_user',this);" class="menuheader"></div>
         <div id="sca" onclick="showmenu('sub_sca',this);" class="menuheader" style="margin-right: 20px;">My Project</div>
        <!--Login Name-->
        <!--Gear for Settings-->
    </div>
    <div class="container" onclick="hidemenu('ALL');" style="height: 500px;overflow: hide;">        
        <div id="leftpanel" style="float:left;position:relative; width: 150px;">Left Panel</div>
        <!--Sections-->
        <div id="sections" style="float:left; position:relative;">
            <div id="accountsettings" onclick="hidemenu('ALL');" class="section">
                <div class="sectionheader">Account Settings</div>
                <div id="tabs">
                    <ul>
                        <li><a href="#tabs-1">Nunc tincidunt</a></li>
                        <li><a href="#tabs-2">Proin dolor</a></li>
		                <li><a href="#tabs-3">Aenean lacinia</a></li>
	                </ul>
	                <div id="tabs-1">
    		            <p>Proin elit arcu, rutrum commodo, vehicula tempus, commodo a, risus. Curabitur nec arcu. Donec sollicitudin mi sit amet mauris. Nam elementum quam ullamcorper ante. Etiam aliquet massa et lorem. Mauris dapibus lacus auctor risus. Aenean tempor ullamcorper leo. Vivamus sed magna quis ligula eleifend adipiscing. Duis orci. Aliquam sodales tortor vitae ipsum. Aliquam nulla. Duis aliquam molestie erat. Ut et mauris vel pede varius sollicitudin. Sed ut dolor nec orci tincidunt interdum. Phasellus ipsum. Nunc tristique tempus lectus.</p>
	                </div>
	                <div id="tabs-2">
    		            <p>Morbi tincidunt, dui sit amet facilisis feugiat, odio metus gravida ante, ut pharetra massa metus id nunc. Duis scelerisque molestie turpis. Sed fringilla, massa eget luctus malesuada, metus eros molestie lectus, ut tempus eros massa ut dolor. Aenean aliquet fringilla sem. Suspendisse sed ligula in ligula suscipit aliquam. Praesent in eros vestibulum mi adipiscing adipiscing. Morbi facilisis. Curabitur ornare consequat nunc. Aenean vel metus. Ut posuere viverra nulla. Aliquam erat volutpat. Pellentesque convallis. Maecenas feugiat, tellus pellentesque pretium posuere, felis lorem euismod felis, eu ornare leo nisi vel felis. Mauris consectetur tortor et purus.</p>
	                </div>
	                <div id="tabs-3">
    		            <p>Mauris eleifend est et turpis. Duis id erat. Suspendisse potenti. Aliquam vulputate, pede vel vehicula accumsan, mi neque rutrum erat, eu congue orci lorem eget lorem. Vestibulum non ante. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce sodales. Quisque eu urna vel enim commodo pellentesque. Praesent eu risus hendrerit ligula tempus pretium. Curabitur lorem enim, pretium nec, feugiat nec, luctus a, lacus.</p>
		                <p>Duis cursus. Maecenas ligula eros, blandit nec, pharetra at, semper at, magna. Nullam ac lacus. Nulla facilisi. Praesent viverra justo vitae neque. Praesent blandit adipiscing velit. Suspendisse potenti. Donec mattis, pede vel pharetra blandit, magna ligula faucibus eros, id euismod lacus dolor eget odio. Nam scelerisque. Donec non libero sed nulla mattis commodo. Ut sagittis. Donec nisi lectus, feugiat porttitor, tempor ac, tempor vitae, pede. Aenean vehicula velit eu tellus interdum rutrum. Maecenas commodo. Pellentesque nec elit. Fusce in lacus. Vivamus a libero vitae lectus hendrerit hendrerit.</p>
	                </div>
                </div>
            </div>
            <div id="quiz" onclick="hidemenu('ALL');" class="section">
                Q
                <div>Quiz</div>
            </div>
        </div>
    </div>

  <!-- jquery ui example: <p><a href="#" id="dialog_link" class="ui-state-default ui-corner-all"><span class="ui-icon ui-icon-newwin"></span>Open Dialog</a></p> -->

  <!-- Form is only used for content manager -->
  <form id="form1" runat="server"></form>
  <script type="text/javascript" language="javascript">
      //alert("Useragent=" + navigator.userAgent);
      //alert("width=" + screen.width + ",height=" + screen.height);
  </script>
  <script language="javascript" type="text/javascript">
      $(document).ready(function () {
          // $('#switcher').themeswitcher();
          if (($.cookie("MMP-username") == null) || ($.cookie("MMP-uid") == null)) appMMP.logout();
          $("#username").html("user: <b>" + $.cookie("MMP-username") + "</b>"); // + $.cookie("MMP-uid"));
          if (location.hash != "") changehash();
          sizesections();
      });
      $(window).resize(function () {
          sizesections();
      });

      function sizesections() {
          $("#sections").width($(document).width() - ($("#leftpanel").width() + 10));
      }

      function showmenu(id, me) {          
          hidemenu('ALL');
          var ofs = $(document).width() - ($(me).offset().left + $(me).width() + parseInt($(me).css("padding-right")));
          //alert("ofs=" + ofs);
          $("#" + id).css("right", ofs + "px");
          $("#" + id).css("display", "block");
      }
      function hidemenu(id) {
          if (id == 'ALL') {
              $("#submenus div").each(function () {
                  $(this).css("display", "none");
              });
          }
          else {
              $("#"+id).css("display", "none");
          }
      }

      $(window).hashchange(function () {
          changehash();
      });
      function changehash() {
          scroll(0, 0);
          showsection(location.hash);
          //alert("debug:hash change");
          //var hash = (location.hash.replace(/^#/, '') || 'blank') + '.';
      }

      function showsection(id) {
          hidemenu('ALL');
          hidesection('ALL');
          $(id + "," + id + " div").css("left", "0px");
          if (id == "#accountsettings") {
              $("#tabs").tabs();
          }
      }
      function hidesection(id) {
          if (id == 'ALL') {
              $("#sections div").each(function () {
                  $(this).css("left", "-2000px");
              });
          }
          else {
              $("#" + id).css("left", "-2000px");
          }
      }


  </script>
      <script>
          $(function () {
              $("#tabs").tabs();
          });
	</script>

  <!--Submenus-->
  <div id="submenus">
    <div id="sub_user" class="submenu" style="display:none;">
        <ul><li><a href="#quiz">Make Quiz</a></li></ul>
        <ul><li><a href="#usersettings">User Settings</a></li><li><a onclick="appMMP.logout();" href="#">Log Out</a></li></ul>
    </div>
    <div id="sub_settings" class="submenu" style="display:none;">
        <ul>
            <li><a onclick="appMMP.getclientsettings(); return true;" href="#accountsettings">Account Settings</a></li>
            <li><a href="#">Help</a></li></ul>
    </div>
    <div id="sub_sca" class="submenu" style="display:none;">
        <ul>
            <li><a href="#par1">Change your project...</a></li>
            <li><a href="#par2">Help</a></li></ul>
    </div>
  </div>
  <!--
<script type="text/javascript"
  src="http://jqueryui.com/themeroller/themeswitchertool/">
</script> -->
<div id="switcher"></div>
</body>
</html>