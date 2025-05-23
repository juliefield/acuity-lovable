<!--#include FILE ="incs/inc_global_top.asp" -->
<% 
strPage = "login"
strPageDescription = "Log In to Jeff Gackenheimer's Site" 
strPageKeywords = "Jeff Gackenheimer, Jeffrey Gackenheimer" 
strtitle = "Log In"

if (request("logout")<>"") then
	response.cookies("Jeffgack")("vercode")=""
	response.redirect("default.asp")
end if

%>
<!--#include FILE ="incs/inc_global_head.asp" -->

<body>
<!--#include FILE ="incs/inc_global_frame.asp" -->
<!--#include FILE ="incs/inc_benefits.asp" -->
<div class="jgcolumn" style="float:right;">
	<h1>
<% if (request("submitlogin")<>"") then
	if (request("username")="corpdig") AND (request("password")="corpdig") then
		response.cookies("Jeffgack")("username")=request("username")
		response.cookies("Jeffgack")("vercode")=GLOBAL_vercode_printer
		response.redirect("jobview.asp")
	else %>
		Invalid login!  Please Try Again...<br />
	<% end if
end if%>

		Log In:
	</h1>
	<br>
	<p>
		<form name=loginlanguage="JavaScript" action="login.asp" method=post>
			Username: <input name="username" type="text" size="15"><br />
			Password: <input name="password" type="password" size="15"><br />
			<input name="submitlogin" type="submit" value="Submit"/>
		</form>
	</p>
</div>
<!--#include FILE ="incs/inc_global_footer.asp" -->