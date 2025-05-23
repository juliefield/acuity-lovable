<div class="jgbar">
	<% if (request.ServerVariables("SCRIPT_NAME") <> "/login.asp") then %>
		<% if (request.cookies("Jeffgack")("vercode")=GLOBAL_vercode_printer) then%>
			<b>
			<% if (request.ServerVariables("SCRIPT_NAME") = "/jobview.asp") then %>
			Job View -&nbsp;
			<% elseif (request.ServerVariables("SCRIPT_NAME") = "/billingview.asp") then %>
			Billing View -&nbsp;
			<% end if %>
			Logged in as: <%=request.cookies("Jeffgack")("username")%>
			</b>
			<% if (request.ServerVariables("SCRIPT_NAME") <> "/jobview.asp") then %>
				&nbsp;<a href="jobview.asp">Job View</a>
			<% end if %>
			<% if (request.ServerVariables("SCRIPT_NAME") <> "/billingview.asp") then %>
				&nbsp;<a href="billingview.asp">Billing View</a>
			<% end if %>
			&nbsp;<a href="login.asp?logout=1">Log Out</a>
		<% else %>
			&nbsp;<a href="login.asp">Log In</a>
		<% end if %>
	<% end if %>
	<% if (request.ServerVariables("SCRIPT_NAME") <> "/default.asp") then %>
			&nbsp;<a href="default.asp">Home</a>
	<% end if %>
</div>
<div class="jgheader"><img src="images/jeffgacklogogreen.gif" />&nbsp;Business System Development &amp; New Media Laboratory</div>