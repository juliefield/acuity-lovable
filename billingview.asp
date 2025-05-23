<!--#include FILE ="incs/inc_global_top.asp" -->
<% 
strPage = "Billing View"
strPageDescription = "Printer Billing View on Jeff Gackenheimer's Site" 
strPageKeywords = "Jeff Gackenheimer, Jeffrey Gackenheimer" 
strtitle = "View Billing"
%>
<!--#include FILE ="incs/inc_functions.asp" -->
<%
if (request.cookies("Jeffgack")("vercode")<>GLOBAL_vercode_printer) then
	response.redirect("default.asp")
end if

Dim db
Dim rs
Dim rt
Dim ru
%>
<!--#include FILE ="incs/inc_global_head.asp" -->

<% function listbills(strdb55,strlabel55,stridname55) %>
	<h1>
	<% if (request("view")="complete") then %>
		Recorded&nbsp;
	<% else %>
		Unrecorded&nbsp;
	<% end if %>
	<%=strlabel55%></h1>
	<br>
	<ul>
	<% Set db = Server.CreateObject("adodb.connection")
	   db.Open "DSN="&strdb55&";uid=NEVERFINDUSERNAME;pwd=NEVERFINDPASSWORD"
	   strQuery = "SELECT runs.id,runs.[staging complete],runs.ticketnumber,customers.company,customers.name,customers.salesrep,jobs.status,jobs.mailing,jobs.prodmgr,runs.runname,runs.runstatus,runs.dropdate,runs.droptype,runs.producer,runs.quantity,runs.quantityfinished,runs.proofprepared,runs.proofaccepted,runs.proofacceptedby,runs.priority,runs.runnotes FROM (Customers INNER JOIN Jobs ON Customers.ID = Jobs.Customer) INNER JOIN Runs ON Jobs.ID = Runs.ProductionID"
	   strQuery = strQuery & " WHERE (subcontractor='"&request.cookies("Jeffgack")("username")&"') AND (priority <= 2) AND (jobs.status<>'Estimate') AND (jobs.status<>'Archive')"
	   if (request("view")="complete") then
	   	strQuery = strQuery & " AND (runs.subpmtresolvedq = '1') "
	   else
	   	strQuery = strQuery & " AND (runs.subpmtresolvedq = '0') "
	   end if
	   strQuery = strQuery & " ORDER BY runs.ticketnumber"
	   Set rs = db.execute(strQuery)
	   if (rs.EOF) then %>
	   		<li>None Found.</li>
	   <% else
	   		while (NOT rs.EOF) %>
	   			<li><a href="billingview.asp?<%=stridname55%>=<%=rs.Fields("id")%>">Ticket: <%=rs.Fields("ticketnumber")%></a><br /><%=rs.Fields("company")%>/<%=rs.Fields("name")%>/<%=rs.Fields("mailing")%>/<%=rs.Fields("runname")%><br />Status:<b><%=rs.Fields("runstatus")%></b>&nbsp;DropDate: <%=rs.Fields("dropdate")%>(<%=rs.Fields("droptype")%>)<br />&nbsp;</li>
			<%  rs.movenext
			wend
	   end if
	   Set rs=nothing
	   Set db=nothing %>
	</ul>
	<% listbills=1
end function %>

<% function showbill(strdb77,strid77,stridname77,strdir77,strlabel77)

	Set db = Server.CreateObject("adodb.connection")
	db.Open "DSN="&strdb77&";uid=NEVERFINDUSERNAME;pwd=NEVERFINDPASSWORD"
	
	if (request("update")<>"") then
		if (request("CRunsubpmtresolvedq")="ON") then
			strCheck="1"
		else
			strCheck="0"
		end if
		strQuery="UPDATE runs SET subpmtresolvedq='"&strCheck&"' WHERE id='"&strid77&"'"
		db.execute(strQuery)
	end if
	'client contact information - list view
	'salesorder records (invoicing) - ledger view
	'customer payment records - ledger view with balance
	'subcontractor payment records - ledger view with balance
	'all the runs, with the selected run resolved modifiable - list view

	'parameter id is the id of the RUN.  Get the id of the job.
	strQuery = "SELECT productionid,subpmtresolvedq from runs WHERE id="&strid77	
    Set ru = db.execute(strQuery)
    jobid = ru(0)
    %>
	<p><a href="billingview.asp">&lt; back to billing list</a></p>
	<%
	strQuery="SELECT salesorders.id,item,salesorders.quantity,description,unitprice,extended"
	strQuery=strQuery&",jobs.mailing,invoicedate,subjobpercentage,invoicefrozen,invoicenototal,schedule,invoicesubtotal,invoicetax,invoicetotal,invoicebalance,qbinvoicenumber,taxexempt,InvoicePrintedOnSite,InvoicePrintedOnSiteDate"
	strQuery=strQuery&",company,name,address,city,state,zip,phone,fax,phone2,homephone,email,salesrep"
	strQuery=strQuery&" FROM ((Customers INNER JOIN Jobs ON Customers.ID = Jobs.Customer) INNER JOIN Salesorders ON Jobs.ID = SalesOrders.ProductionID)"
	strQuery=strQuery&" WHERE (salesorders.productionid = "&jobid&")"
	strQuery=strQuery&" ORDER BY salesorders.[order]"
    Set rs = db.execute(strQuery)
    if (rs.EOF) then %>
    	<br /><b>No Invoice!  Contact Steve.</b>
    <% else %>
		<div style="float: left;">
			<p><br /></p>
			<h1><%=rs.Fields("company")%>/<%=rs.Fields("name")%>/<%=rs.Fields("mailing")%></h1>
			<ul>
				<li>
					<p>
						<%=rs.Fields("address")%>
						&nbsp;&bull;&nbsp;<%=rs.Fields("city")%>
						&nbsp;&bull;&nbsp;<%=rs.Fields("state")%>
						&nbsp;&bull;&nbsp;<%=rs.Fields("zip")%>
					</p>
				</li>
				<li>
					<p>Phone: <%=rs.Fields("phone")%>
					&nbsp;&bull;&nbsp;Fax: <%=rs.Fields("fax")%>
					&nbsp;&bull;&nbsp;2: <%=rs.Fields("phone2")%>
					&nbsp;&bull;&nbsp;Home: <%=rs.Fields("homephone")%>
					&nbsp;&bull;&nbsp;<%=rs.Fields("email")%>
					&nbsp;&bull;&nbsp;Salesrep: <%=rs.Fields("salesrep")%></p>
				</li>
			</ul>
			<div class="cleaner">&nbsp;</div>
			<table class="jgtable" style="margin-left: 20px;">
				<caption><%
				strQuery="SELECT ticketnumber FROM runs WHERE productionid='"&jobid&"' ORDER BY ticketnumber"
				Set rt = db.execute(strQuery)
				while (NOT rt.EOF)
				  %>Job Ticket #&nbsp;<b><%=rt.Fields("ticketnumber")%></b><br /><%
				  rt.MoveNext
				wend
				Set rt=nothing
				if strdir77="sub" then %>
					<%=strlabel77%>&nbsp;Invoice #&nbsp;<b><%=rs.Fields("qbinvoicenumber")%></b><br />
				<% end if
				if rs.Fields("invoicefrozen")<>"True" then %>
					<em>This invoice is NOT FROZEN.  The values/totals may not be correct!</em>
				<% end if %>
				</caption>
				<tr><th>Type</th><th>Qty</th><th>Description</th><th>Unit</th><th>Extended</th><th>
				<% if strdir77="sub" then %>
					Contractor
				<% else %>
					Commission
				<% end if %>
				</th></tr>
		<%
	    strclass="spec"
	    ct = 0.0
		while (NOT rs.EOF)
			cl = rs.Fields("extended")
			cc = cl
			if (rs.Fields("item")=1) then
				stritem="Mail Production"
			elseif (rs.Fields("item")=2) then
				stritem="Mailing Lists"
				if (strdir77="sub") then
					cl = 0.0
				end if
			elseif (rs.Fields("item")=3) then
				stritem="Billable Materials"
			elseif (rs.Fields("item")=4) then
				stritem="Billable Service"
			elseif (rs.Fields("item")=34) then
				stritem="Shipping"
				cl = 0.0
			elseif (rs.Fields("item")=35) then
				stritem="Printed Product"
			elseif (rs.Fields("item")=36) then
				stritem="Offer"
				if (strdir77="sub") then
					cl = 0.0
				end if
			elseif (rs.Fields("item")=38) then
				stritem="Design"
				if (strdir77="sub") then
					cl = 0.0
				end if
			elseif (rs.Fields("item")=39) then
				stritem="Consultative"
				if (strdir77="sub") then
					cl = 0.0
				end if
			elseif (rs.Fields("item")=40) then
				stritem="Interest"
				cl = 0.0
			else
				stritem="Postage"
				cl = 0.0
				cc = 0.0
			end if
			
			if (stritem="Billable Materials")OR(stritem="Billable Service") then
				cl = cl
			else
				if strdir77="sub" then
					cl = cl * (0.01 * rs.Fields("subjobpercentage"))
				else
					cl = cl * (1.0 - (0.01 * rs.Fields("subjobpercentage")))
				end if
			end if
			ct = ct + cl
			cct = cct + cc %>
				<tr>
					<td class="<%=strclass%>"><%=stritem%></td>
					<td class="<%=strclass%>" style="text-align: right;"><%=rs.Fields("quantity")%></td>
					<td class="<%=strclass%>"><%=rs.Fields("description")%></td>
					<td class="<%=strclass%>" style="text-align: right;"><%=formatnumber(rs.Fields("unitprice"),2)%></td>
					<td class="<%=strclass%>" style="text-align: right;"><%=formatnumber(rs.Fields("extended"),2)%></td>
					<td class="<%=strclass%>" style="text-align: right;">
					<%if (cl = 0.0) then %>
						&nbsp;
					<% else %>
						<%=formatnumber(cl,2)%>
					<% end if %>
					</td>
				</tr>
			<%
			if (strclass="spec") then
				strclass="specalt"
			else
				strclass="spec"
			end if
			rs.MoveNext
		wend
		rs.MoveFirst
		%>
			<tr>
				<td colspan=4 class="spec" style="text-align: right;">
				<% if strdir77="sub" then %>
					This invoice sent to <%=rs.Fields("company")%>/<%=rs.Fields("name")%> by <%=strlabel77%>&nbsp;for:&nbsp;
				<% else 'house %>
					Invoice Subtotal:&nbsp;
				<% end if %>
				</td>
				<td class="spec" style="border-top: 2px solid black; text-align: right;"><%=formatnumber(rs.Fields("invoicesubtotal"),2)%></td>
				<td class="spec" style="border-top: 2px solid black; text-align: right;">&nbsp;</td>
			</tr>
			<% if strdir77="house" then %>
				<tr>
					<td colspan=4 class="spec" style="text-align: right;">Sales Tax:&nbsp;</td>
					<td class="spec" style="text-align: right;"><%=formatnumber(rs.Fields("invoicetax"),2)%></td>
					<td class="spec" style="text-align: right;">&nbsp;</td>
				</tr>
				<tr>
					<td colspan=4 class="spec" style="text-align: right;">Total Invoice (to be billed by <b><%=strlabel77%></b>):&nbsp;</td>
					<td class="spec" style="font-size: 12pt; border-top: 2px solid black; text-align: right;"><%=formatnumber(rs.Fields("invoicesubtotal") - (-rs.Fields("invoicetax")),2)%></td>
					<td class="spec" style="text-align: right;">&nbsp;</td>
				</tr>
			<% end if %>
			<tr>
				<td colspan=4 class="spec" style="text-align: right;">
				<% if strdir77="sub" then %>
					<b><%=request.cookies("Jeffgack")("username")%></b> should invoice ClearMarket for the following amount:&nbsp;
				<% else %>
					<b>Commission to be paid on project:&nbsp;
				<% end if %>
				</td>
				<td class="spec" style="text-align: right;">&nbsp;</td>
				<td class="spec" style="font-size: 12pt; text-align: right;"><b><%=formatnumber(ct,2)%></b></td>
			</tr>
			</table>
		</div>
		<div class="cleaner">&nbsp;</div>
		<form name=psview language="JavaScript" action="billingview.asp?<%=stridname77%>=<%=strid77%>" method=post>
			<% if (ru.Fields("subpmtresolvedq") = "True") then
				strCheck="checked"
			else
				strCheck=""
			end if %>
			<input type="checkbox" name="CRunsubpmtresolvedq" value="ON" <%=strCheck%>> Billing Info Recorded
			<br /><input name="update" type="submit" value="Update"/>
		</form>
	<% end if
	
	Set rs = Nothing
	Set ru = Nothing%>	
<%'
'	<form name=psviewlanguage="JavaScript" action="billingview.asp?clearmarketid=<$=request("clearmarketid")$>" method=post>
'	<div style="float: left; margin-left: 20px; padding: 20px; border: 2px solid #008000;">
'	</div>
'	<div style="float: left; margin-left: 10px; padding: 20px; border: 2px solid #008000;">
'	</div>
'	<div class="cleaner">&nbsp;</div>
'	<div style="float: left; margin-left: 20px; margin-top: 10px; padding: 20px; border: 2px solid #008000;">
'	</div>
'	<input name="update" type="submit" value="Update"/>
'	</form>
%>
	<% Set rs=nothing
	Set db=nothing
	showbill=1
end function %>

<body>
<!--#include FILE ="incs/inc_global_frame.asp" -->
<div class="jgcolumn" style="width: 100%; float: none;">
<% if (request("clearmarketid")<>"") then
    i=showbill("CMSQL2",request("clearmarketid"),"clearmarketid","sub","ClearMarket")
elseif (request("corpdigid")<>"") then
    i=showbill("CDSQL",request("corpdigid"),"corpdigid","house","Corporate Digital")
else
	if (request("view")="complete") then %>
		<p><a href="billingview.asp">view outstanding billing records &gt;</a></p>
	<% else %>
		<p><a href="billingview.asp?view=complete">view recorded billing records &gt;</a></p>
	<% end if
	
	i=listbills("CMSQL2","Billing Records from ClearMarket Corp.","clearmarketid")
	i=listbills("CDSQL","In-House Billing Records","corpdigid")
	%>
<% end if %></div><!--#include FILE ="incs/inc_global_footer.asp" -->