<head>

<title><%=strtitle%></title>

<META NAME="keywords" CONTENT="commercial avoidance,advertising filter">
<META NAME="description" CONTENT="AdGriller helps you reduce the advertisement that reaches your eyes and ears.  YOU get to receive only the messages you want, and block the ones you don't.">
<META NAME="revisit-after" CONTENT="1 days">
<META NAME="robots" CONTENT="FOLLOW,INDEX">
<meta name="classification" content="business" />
<meta http-equiv="reply-to" content="service@adgriller.com" />
<meta http-equiv="Content-Type" content="text/html; charset=windows-1252" />
<meta name="GOOGLEBOT" content="index, follow" />
<meta http-equiv="expires" content="0" />
<meta name="rating" content="GENERAL" />
<meta name="distribution" content="GLOBAL" />
<meta http-equiv="Content-Language" content="en-us" />
<meta name="htdig-keywords" content="home clearmarket homepage" />

<link rel="stylesheet" type="text/css" href="<%=siteRoot%>/incs/jg.css" media="screen"/>

<script language="javascript">

</script>

</head>

<%
if (BI_browser = "IE") OR (BI_browser = "Opera") OR (BI_browser = "Netscape") then
	'Perfect in IE, Crap in Firefox
	dsst ="<span style=""display: inline-block;""><div style=""float:left; width: 2.5in;"">"
	dmid="</div><div style=""float: right;"">"
	dend="</div></span>"

else
	'IE/Firefox displays well, but right text is not aligned right (needs padding on the left)
	dsst="<div style=""display: block;""><div style=""display: inline; text-align:left; width: 2.5in;"">"
	dmid="</div><div style=""display: inline; text-align: right;"">"
	dend="</div></div>"
end if

if (request("r_f")<>"") then
	response.cookies("cmcmslogin")("r_f") = request("r_f")
end if

if (request("develop")="1") then
	response.cookies("cmcmslogin")("develop")="YES"
	response.write "Development Parameter Set<br />"
elseif (request("develop")="0") then
	response.cookies("cmcmslogin")("develop")=""
	response.write "Development Parameter Cleared<br />"
end if

%>


