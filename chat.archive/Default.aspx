<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Default.aspx.vb" Inherits="chat_Default" ValidateRequest="false"  %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Chat</title>
</head>
<body id="Chat" runat="server">
    <div style="font-weight: bold; margin: 5px 0px 5px 0px;">Unrecorded Chat</div>
    <div id="login">
        Username: <input type="text" id="username" value="" /><br />
        Password: <input type="password" id="password" value="" /><br />
        <input type="button" style="width: 200px; margin-top: 20px;" onclick="login();" value="submit" />
    </div>
    <div id="out" style="border: 1px solid black;width:600px;height:300px;display:none;overflow-y:scroll;padding-left: 3px;"></div>
    <div id="in" style="display:none;margin-top: 20px;">
       <span id="loginname" style="font-weight:bold;"></span>:&nbsp;<input id="inputline" type="text" onkeypress="checkforenter();" onchange="addinput();" style="width: 500px;border:none;border-color:transparent;" />        
       <input type="text" style="border:none;border-color:transparent;" onfocus="focusback();" />
       <div style="padding-top: 30px;border-top: 1px solid black;width:600px;">
            <div id="uniqueusers"></div><div style="float:right;"><a href="#" onclick="logout();return false;">log out</a></div>
            <input type="checkbox" id="playbeep" style="margin-top: 10px;" /> Play a beep sound whenever someone else enters text.
       </div>
    </div>
    <form id="form1" runat="server">
    </form>
    <script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script>
    <embed src="beep-8.mp3" autostart="false" width="0" height="0" id="beep" enablejavascript="true">

    <script type="text/javascript">
        if (!window.jQuery) { alert("This App requires jQuery"); }
        var $ = window.jQuery;

        function PlaySound(soundObj) {
            var sound = document.getElementById(soundObj);
            sound.Play();
        }

        function focusback() {
            $("#inputline").focus();
        }

        function checkforenter(ev) {
           if (window.event && window.event.keyCode == 13) {
                addinput();
            } else if (ev && ev.keyCode == 13) {
                addinput();
            }
        }

        var lastuser = "";

        function login() {
            var urlbld = "chat.ashx?login=1&username=" + $("#username").val() + "&password=" + $("#password").val();
            $.ajax({
                type: "GET",
                url: urlbld,
                async: false,
                dataType: "xml",
                cache: false,  //make true for live site
                error: function (request, textStatus, errorThrown) {
                    alert('Error loading Login XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                },
                success: loadLoginXML
            });
        }

        function logout() {
            clearInterval(myinterval);
            $("#login").css("display", "block");
            $("#out").css("display", "none");
            $("#in").css("display", "none");
            $("#loginname").html("");
            $("#username").val("");
            $("#password").val("");
        }

        var myinterval;

        var myguid = "FAILURE";
        function loadLoginXML(xml) {
            $(xml).find('Authentication').each(function () {
                $(this).find('AccessKey').each(function () {
                    myguid = $(this).find("UID").text();
                    if (myguid != "FAILURE") {
                        $("#login").css("display", "none");
                        $("#out").css("display", "block");
                        $("#in").css("display", "block");
                        $("#loginname").html($("#username").val());
                        gotchat($("#username").val(), "(logged on)", true);
                        lastuser = "";
                        focusback();
                        retrievemessages();
                        myinterval = setInterval("retrievemessages( );", 3000);
                    }
                    else {
                        alert("Invalid Username/Password");
                    }
                });
            });
        }

        function addinput() {
            var urlbld = "chat.ashx?uid=" + myguid + "&send=" + $("#inputline").val();
            $.ajax({
                type: "POST",
                url: urlbld,
                data: "",
                cache: false,  //make true for live site
                error: function (request, textStatus, errorThrown) {
                    alert('Error loading Login XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                },
                success: saveInput
                //success: loadLoginXML
            });
        }

        function saveInput() {
            gotchat($("#username").val(), $("#inputline").val(), true);
        }

        function retrievemessages() {
            var urlbld = "chat.ashx?uid=" + myguid + "&retrieve=1";
            $.ajax({
                type: "GET",
                url: urlbld,
                async: false,
                dataType: "xml",
                cache: false,
                error: function (request, textStatus, errorThrown) {
                    alert('Error loading Login XML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                },
                success: loadRetrievedXML
            });
        }
        function loadRetrievedXML(xml) {
            $(xml).find('Postings').each(function () {
                $(this).find('Posts').each(function () {
                    var name = $(this).find("User").text();
                    var message = $(this).find("Post").text();
                    gotchat(name, message, false);
                });
            });
            $(xml).find('Users').each(function () {
                var uu = "";
                $(this).find('User').each(function () {
                    if (uu != "") {
                        uu = uu + ", ";
                    }
                    uu = uu + $(this).find("UniqueUser").text();
                });
                if (uu == "") {
                    uu = "No other users logged in.";
                }
                else {
                    uu = "Users Logged In: " + uu;
                }
                $("#uniqueusers").html(uu);
            });
        }

        function gotchat(usr, txt, isme) {
            var bld = "<br />";
            if (lastuser != usr) {
                lastuser = usr;
                bld += "<br /><b>" + lastuser + ":</b>&nbsp;";
            }
            bld += txt;
            $("#out").append(bld);
            var objDiv = document.getElementById("out");
            objDiv.scrollTop = objDiv.scrollHeight;
            if (isme) {
                $("#inputline").val("");
            }
            else {
                if ($("#playbeep").is(":checked")) {
                    PlaySound("beep");
                }
            }
        }
    </script>
</body>
</html>
