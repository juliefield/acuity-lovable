<!--#include FILE ="incs/inc_global_top.asp" -->
<% 
strPage = "Job View"
strPageDescription = "Printer Job View on Jeff Gackenheimer's Site" 
strPageKeywords = "Jeff Gackenheimer, Jeffrey Gackenheimer" 
strtitle = "View Jobs"
%>
<!--#include FILE ="incs/inc_functions.asp" -->
<%
if (request.cookies("Jeffgack")("vercode")<>GLOBAL_vercode_printer) then
	response.redirect("default.asp")
end if

Dim db
Dim rs
Dim rt
%>
<!--#include FILE ="incs/inc_global_head.asp" -->

<% function listjobs(strdb55,strlabel55,stridname55) %>
	<h1>
	<% if (request("view")="complete") then %>
		Complete&nbsp;
	<% else %>
		Working&nbsp;
	<% end if %>
	<%=strlabel55%></h1>
	<br>
	<ul>
	<% Set db = Server.CreateObject("adodb.connection")
	   db.Open "DSN="&strdb55&";uid=NEVERFINDUSERNAME;pwd=NEVERFINDPASSWORD"
	   strQuery = "SELECT runs.id,runs.[staging complete],runs.ticketnumber,customers.company,customers.name,customers.salesrep,jobs.status,jobs.mailing,jobs.prodmgr,runs.runname,runs.runstatus,runs.dropdate,runs.droptype,runs.producer,runs.quantity,runs.quantityfinished,runs.proofprepared,runs.proofaccepted,runs.proofacceptedby,runs.priority,runs.runnotes FROM (Customers INNER JOIN Jobs ON Customers.ID = Jobs.Customer) INNER JOIN Runs ON Jobs.ID = Runs.ProductionID"
	   strQuery = strQuery & " WHERE (subcontractor='"&request.cookies("Jeffgack")("username")&"') AND (priority <= 2)"
	   if (request("view")="complete") then
	   	strQuery = strQuery & " AND(runs.runstatus = 'Complete') "
	   else
	   	strQuery = strQuery & " AND(jobs.status<>'Estimate')AND(jobs.status<>'Archive')AND(runs.runstatus<>'Complete') "
	   end if
	   strQuery = strQuery & " ORDER BY runs.priority,runs.dropdate,runs.runstatus,customers.company,customers.name,jobs.mailing,runs.runname"
	   Set rs = db.execute(strQuery)
	   if (rs.EOF) then %>
	   		<li>None Found.</li>
	   <% else
	   		while (NOT rs.EOF) %>
	   			<li><a href="jobview.asp?<%=stridname55%>=<%=rs.Fields("id")%>">Ticket: <%=rs.Fields("ticketnumber")%></a><br /><%=rs.Fields("company")%>/<%=rs.Fields("name")%>/<%=rs.Fields("mailing")%>/<%=rs.Fields("runname")%><br />Status:<b><%=rs.Fields("runstatus")%></b>&nbsp;DropDate: <%=rs.Fields("dropdate")%>(<%=rs.Fields("droptype")%>)<br />&nbsp;</li>
			<%  rs.movenext
			wend
	   end if
	   Set rs=nothing
	   Set db=nothing %>
	</ul>
<%	listjobs=1
end function
%>

<body>
<!--#include FILE ="incs/inc_global_frame.asp" -->
<div class="jgcolumn" style="width: 100%; float: none;">
<% if (request("clearmarketid")<>"")OR(request("corpdigid")<>"") then

	Set db = Server.CreateObject("adodb.connection")
	if (request("clearmarketid")<>"") then
		strmyid=request("clearmarketid")
		db.Open "DSN=CMSQL2;uid=NEVERFINDUSERNAME;pwd=NEVERFINDPASSWORD"
	else
		strmyid=request("corpdigid")
		db.Open "DSN=CDSQL;uid=NEVERFINDUSERNAME;pwd=NEVERFINDPASSWORD"
	end if
	strtest=request("TRunrunnotes")
	strtest=noap(strtest)
	if (request("update")<>"") then
		strQuery="UPDATE runs SET ticketnumber='"&request("TRunticketnumber")&"',runstatus='"&request("TRunrunstatus")&"',dropdate='"&request("TRundropdate")&"',runnotes='"&strtest&"' WHERE id='"&strmyid&"'"
		db.execute(strQuery)
	end if
    strQuery = "SELECT runs.id,runs.[staging complete],runs.ticketnumber,customers.company,customers.name,customers.salesrep,runs.postalprepped,runs.includenonautomatable,runs.listname,runs.stdlistname,runs.autoqty,runs.nonautoqty,customers.rootfolder,jobs.status,jobs.mailing,jobs.prodmgr,runs.runname,runs.runstatus,runs.mailingclass,runs.cardrateq,runs.nonprofitq,runs.dropdate,runs.droptype,runs.producer,runs.quantity,runs.quantityfinished,runs.proofprepared,runs.proofaccepted,runs.proofacceptedby,runs.priority,runs.runnotes,customers.address,customers.city,customers.state,customers.zip,customers.phone,customers.fax,customers.email,customers.phone2,customers.homephone FROM (Customers INNER JOIN Jobs ON Customers.ID = Jobs.Customer) INNER JOIN Runs ON Jobs.ID = Runs.ProductionID"
    strQuery = strQuery & " WHERE (runs.id = "&strmyid&") AND (subcontractor='"&request.cookies("Jeffgack")("username")&"') AND (priority <= 2) ORDER BY runs.priority,runs.dropdate,runs.runstatus,customers.company,customers.name,jobs.mailing,runs.runname"
    Set rs = db.execute(strQuery)
    strrunnotes= rs.Fields("runnotes")
	%>
	<p><a href="jobview.asp">&lt; back to job list</a></p>
	<h1><%=rs.Fields("company")%>/<%=rs.Fields("name")%>/<%=rs.Fields("mailing")%>/<%=rs.Fields("runname")%>
	<% if (rs.Fields("ticketnumber")<>"UNASSIGNED") then %>
		&nbsp;-&nbsp;Ticket #: <%=rs.Fields("ticketnumber")%>
	<% end if %>
	</h1>
	<br>
	<% if (request("clearmarketid")<>"") then %>
		<form name=clearmarket psviewlanguage="JavaScript" action="jobview.asp?clearmarketid=<%=strmyid%>" method=post>
	<% else %>
		<form name=corpdig psviewlanguage="JavaScript" action="jobview.asp?corpdigid=<%=strmyid%>" method=post>
	<% end if %>
	<div style="float: left; margin-left: 20px; padding: 20px; border: 2px solid #008000;">
		<h1>Mailing Lists</h1>
		<% if (rs.Fields("postalprepped")<>"True") then %>
			<p style="align: center;"><br />Lists are not yet<br />finalized.</p>
		<% else
			ct = 0
			cta = 0
			cts = 0
			cta = rs.Fields("autoqty")
			cts = rs.Fields("nonautoqty")
			ct = cta
			if (rs.Fields("includenonautomatable")="True") then
				ct = ct + cts
			end if %>
			<p><br /><small>Lists have been CASS-Certified,<br />Barcoded, and Sorted for Maximum<br />Postal Discounts.  Please maintain the<br />provided sequence when preparing the mailing.</small><br /><br />Total Quantity: <b><%=formatnumber(ct,0)%></b><br />(Auto: <%=formatnumber(cta,0)%>
			<% if (rs.Fields("includenonautomatable")="True") then %>
				, Std: <%=formatnumber(cts,0)%>
			<% end if %>
			)<br /><br />
			<% Response.Write "<a target=_blank href=""http://www.clearmarket.com/shopgrab/clients/"&rs.Fields("rootfolder")&"/"&rs.Fields("mailing")&"/"&rs.Fields("runname")&"/"&rs.Fields("listname")&""">"&rs.Fields("listname")&"</a><br />" %>
			<% if (rs.Fields("includenonautomatable")="True") then %>
				<% Response.Write "<a target=_blank href=""http://www.clearmarket.com/shopgrab/clients/"&rs.Fields("rootfolder")&"/"&rs.Fields("mailing")&"/"&rs.Fields("runname")&"/"&rs.Fields("stdlistname")&""">"&rs.Fields("stdlistname")&"</a><br />" %>
			<% end if %>
		<% end if %>
	</div>
	<div style="float: left; margin-left: 10px; padding: 20px; border: 2px solid #008000;">
		<h1>Mailing Paperwork</h1>
		<% if (rs.Fields("postalprepped")<>"True") then %>
			<p style="align: center;">Mailing Statements are<br/>not yet prepared.</p>
		<% else %>
			<p><br />(Class: <%=rs.Fields("mailingclass")%>
			<% if (rs.Fields("cardrateq")="True") then %>
				, Card Rate
			<% end if %>
			<% if (rs.Fields("nonprofitq")="True") then %>
				, <b>NON-PROFIT!</b>
			<% end if %>
			)<br /><br />
			<p>
			<% 
			if (rs.Fields("mailingclass")="First Class Metered") OR (rs.Fields("mailingclass")="First Class Stamped") then %>
				<br /><b>No Paperwork for this type of mailing.</b>
			<% else
				folderspec = "c:/clientapps/cmserver/shop0/clients/"&rs.Fields("rootfolder")&"/"&rs.Fields("mailing")&"/"&rs.Fields("runname")&"/PostalForms"
				Dim fsrf, frf, f1rf, fcrf
				Set fsrf = CreateObject("Scripting.FileSystemObject")
				If fsrf.FolderExists(folderspec) = true Then
					Set frf = fsrf.GetFolder(folderspec) 
					Set fcrf = frf.Files
					For Each f1rf in fcrf
						Response.Write "<a target=_blank href=""http://www.clearmarket.com/shopgrab/clients/"&rs.Fields("rootfolder")&"/"&rs.Fields("mailing")&"/"&rs.Fields("runname")&"/PostalForms/"&f1rf.name&""">"&f1rf.name&"</a><br />"
					Next
				else
					response.write "(no paperwork found)<br />"
				end if
			end if %>
			</p>
			<% if (rs.Fields("mailingclass")="First Class Presort") AND ((rs.Fields("includenonautomatable")="True") AND (cts > 0)) then %>
				<p>
					<br /><b>First Class has no Non-Automatable Class</b><br />Please meter or place stamps on the <%=cts%> Std mailers.
				</p>
			<% end if %>
		<% end if %>
	</div>
	<div class="cleaner">&nbsp;</div>
	<div style="float: left; margin-left: 20px; margin-top: 10px; padding: 20px; border: 2px solid #008000;">
	<h1>Pieces</h1>
	<ul>
		<% strQuery = "SELECT piecename,finishedsize,side1printing,side2printing,side1addressq,side2addressq,side1imagesource,side2imagesource,side1imagepage,side2imagepage,addresslayoutfile,piecenotes FROM pieces WHERE runid='"&rs.Fields("id")&"'"
		set rt=db.execute(strQuery)
		if (rt.EOF) then %>
			No Pieces Found
		<% else
			while (NOT rt.EOF) %>
				<li>
					<b><%=rt.Fields("piecename")%></b> - Size: <%=rt.Fields("finishedsize")%><br />
					<% if (rt.Fields("side1printing")<>"None") then %>
						SIDE 1: <a target=_blank href="http://www.clearmarket.com/shopgrab/clients/<%=rs.Fields("rootfolder")%>/<%=rs.Fields("mailing")%>/<%=rs.Fields("runname")%>/<%=rt.Fields("side1imagesource")%>"><%=rt.Fields("side1imagesource")%></a>
						-<%=rt.Fields("side1printing")%>, Page <%=rt.Fields("side1imagepage")%>
						<% if rt.Fields("Side1AddressQ")="True" then %>
							- <b>Address (or Variable Data) on this side.</b>
						<% end if %>
						<br />
					<% end if %>
					<% if (rt.Fields("side2printing")<>"None") then %>
						SIDE 2: <a target=_blank href="http://www.clearmarket.com/shopgrab/clients/<%=rs.Fields("rootfolder")%>/<%=rs.Fields("mailing")%>/<%=rs.Fields("runname")%>/<%=rt.Fields("side2imagesource")%>"><%=rt.Fields("side2imagesource")%></a>
						-<%=rt.Fields("side2printing")%>, Page <%=rt.Fields("side2imagepage")%>
						<% if rt.Fields("Side2AddressQ")="True" then %>
							- <b>Address (or Variable Data) on this side.</b>
						<% end if %>
						<br />
					<% end if %>
					<% if (rt.Fields("addresslayoutfile")<>"") then %>
						ADDRESS LAYOUT FILE: <a target=_blank href="http://www.clearmarket.com/shopgrab/clients/<%=rs.Fields("rootfolder")%>/<%=rs.Fields("mailing")%>/<%=rs.Fields("runname")%>/<%=rt.Fields("addresslayoutfile")%>"><%=rt.Fields("addresslayoutfile")%></a>
						<br />
					<% end if %>
					<i><small>Unless otherwise noted, Paper Stock is 70# Text and Card Stock is 80# Cover</small></i>
					<br /><i><small>Proofing is never guaranteed - please proof to Rep or Client as appropriate.</small></i>
					<br />Notes (this field is readonly, communicate using the note box at the bottom):<br />
					<textarea rows="5" cols=50 readonly><%=rt.Fields("piecenotes")%></textarea>
				</li>
				<% rt.MoveNext
			wend %>
		<% end if%>
		</ul>
	</div>
	<div style="float: left; margin-left: 10px; margin-top: 10px; padding: 20px; border: 2px solid #008000;">
	<h1>Client Contact</h1>
	<p><br /></p>
	<p><%=rs.Fields("company")%></p>
	<p><%=rs.Fields("name")%></p>
	<p><%=rs.Fields("address")%></p>
	<p><%=rs.Fields("city")%>, <%=rs.Fields("state")%>&nbsp;&nbsp;<%=rs.Fields("zip")%></p>
	<p>Phone: <%=rs.Fields("phone")%> Fax: <%=rs.Fields("fax")%> 2: <%=rs.Fields("phone2")%> Home: <%=rs.Fields("homephone")%></p>
	<p><%=rs.Fields("email")%></p>
	</div>

	<div class="cleaner">&nbsp;</div>
	<ul>
		<li>The ClearMarket Rep for this project is: <b><%=rs.Fields("salesrep")%></b></li>
		<li>
			Ticket # <input type="text" name="TRunticketnumber" size=25 value="<%=rs.Fields("ticketnumber")%>">
			<% if (rs.Fields("ticketnumber")="UNASSIGNED") then %>
				<small><b>&nbsp;&lt;--Please ASSIGN YOUR PROJECT a TICKET NUMBER for your internal tracking purposes.</b></small>
			<% end if %>
		</li>
		<li>
			Status: <select name="TRunrunstatus">
				<option value="NEEDS REVIEW">NEEDS REVIEW</option>
				<option value="JobPrep">JobPrep</option>
				<option value="Ready To Go">Ready To Go</option>
				<option value="In Production">In Production</option>
				<option value="Out-Staged">Out-Staged</option>
				<option value="Complete">Complete</option>
				<option selected value="<%=rs.Fields("runstatus")%>"><%=rs.Fields("runstatus")%></option>
			</select> - <i><small>if anything is unclear or you leave a question in the note box, change the status to "NEEDS REVIEW"</small></i>
		</li>
		<li>
			Drop Date: <input type="text" name="TRundropdate" size=15 value="<%=rs.Fields("dropdate")%>"> (<%=rs.Fields("droptype")%>)
		</li>
		<br />
		<li>
			<b>Note Box</b> (Use this area for communication with ClearMarket)<br />
			<%
				strit = strrunnotes
				strit2 = withap(strit)
			%>
			<textarea rows="5" name="TRunrunnotes" cols=80><%=strit2%></textarea>
		</li>
	</ul>
	<input name="update" type="submit" value="Update"/>
	<% Set rs=nothing
	Set db=nothing %>
<% else %>
	<% if (request("view")="complete") then %>
		<p><a href="jobview.asp">view working jobs &gt;</a></p>
	<% else %>
		<p><a href="jobview.asp?view=complete">view complete jobs &gt;</a></p>
	<% end if

	i=listjobs("CMSQL2","Jobs from ClearMarket Corp.","clearmarketid")
	i=listjobs("CDSQL","In-House Jobs","corpdigid")

end if %>
</div>
<!--#include FILE ="incs/inc_global_footer.asp" -->