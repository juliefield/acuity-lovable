<%@ Page Language="vb" AutoEventWireup="false" Inherits="import3" CodeFile="import3.aspx.vb" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
	"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" >
<head id="Head1" runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=8" />
    <title>Import</title>

    <asp:PlaceHolder runat="server">
    	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />
        <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />

        <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jqgrid40/css/ui.jqgrid.css"  />
        <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib").ToString%>harvesthq-chosen-12a7a11/chosen/chosen.css" />
        <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib").ToString%>datepicker/css/base.css" />
        <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib").ToString%>datepicker/css/clean.css" />

        <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/jquery-1.6.2.min.js"></script>-->
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/spinner.js"></script>

        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>datepicker/js/datepicker.js" type="text/javascript"></script>
 
        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jQueryRotate.js" type="text/javascript"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.spin.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery-treeview/jquery.treeview.js" type="text/javascript"></script>

		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>highcharts-2.3.3/js/highcharts.src.js"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>highcharts-2.3.3/js/highcharts-more.js"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>raphael/raphael-2.1.0.js"></script>        

        <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>

        <script type="text/javascript" src="appApmClient/js/appApmDashboard-2.4.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmScoreEditing-1.1.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmMessaging-1.2.1.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmNavMenus-1.1.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmSettings-1.1.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmAdmin-1.1.0.js"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
      	<script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
    	<script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
    	<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/development-bundle/ui/jquery.ui.tabs.js"></script>
	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
	    <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>

   	    <!-- <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/jquery.qtip-1.0.0-rc3.min.js" type="text/javascript"></script> -->
        <script src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>

		<!-- 1a) Optional: add a theme file -->
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>highcharts-2.3.3/js/themes/touchpointasync3.js"></script>
		
		<!-- 1b) Optional: the exporting module -->
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>highcharts-2.3.3/js/modules/exporting.js"></script>
				
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->

</asp:PlaceHolder>

<style type="text/css">
<!--

.encdiv h1
{
    display: none;
}
.CKTable tr th
{
    padding-right: 10px;
    border-bottom: 1px solid black;
}
.CKTable tr td
{
    padding-right: 10px;
    text-align: center;
}
-->
</style>
</head>

	<body>
		<form method="post" runat="server">
 	      <div id="importwrapper" runat="server">
            <div class="filters leftpanel" style="width: 280px; background-color:#c0c0c0;margin-top: 5px;">
              <h1>Manual Import</h1>
			  <dl style="margin-bottom: 0px; padding-bottom: 0px;">
  				<dt>Date:</dt>
				<dd><asp:TextBox ID="tbDate" AutoPostback="True" onchange="checkdate(this);" Text="" Width="80" runat="server" /><span style="display:inline-block; width:125px;text-align:center;"><span style="font-size:12px;font-weight:bold;">MM/DD/YYYY</span><br /><span style="font-size:10px;font-weight:normal;">Leave blank to map field.</span></span><span style="margin-left: 25px">
                <asp:CheckBox ID="cbScoreUpdate" Visible="false" Text="Display 'Scores are being updated' on dashboard." AutoPostBack="true" runat="server" /></span></dd>
				<dt id="dtLocation" runat="server">Location:</dt>
				<dd id="ddLocation" runat="server"><asp:DropDownList ID="ddlLocation" AutoPostBack="true" runat="server" /></dd>
				<dt>File Type:</dt>
				<dd><asp:DropDownList ID="ddlFileType" AutoPostBack="true" runat="server">
				            </asp:DropDownList>
	    	                <asp:CheckBox ID="cbSkipUpload" Visible="false" Checked="false" AutoPostBack="True" Text="skip file upload (calculate<br />based on previously uploaded files)" runat="server" />
                            <asp:CheckBox ID="cbProgressKronos" Visible="false" Checked="false" AutoPostBack="True" Text="Special importing for project: PROGRESS" runat="server" />
				        </dd>
				        <dt ID="dtIdType" runat="server">ID Type:</dt>
				        <dd ID="ddIdType" runat="server"><asp:DropDownList ID="ddlIdType" AutoPostBack="true" AppendDataBoundItems="true" runat="server">
    		                <asp:ListItem Selected="True" Text="-select-" Value="" />
    		                <asp:ListItem Text="UserId" Value="0" />
                        </asp:DropDownList>

				        </dd>
				        <dt ID="dtProject" runat="server"><%=CONFMGR.AppSettings(urlprefix() & "scaname")%>:</dt>
				        <dd ID="ddProject" runat="server"><asp:DropDownList ID="ddlProjectI" AutoPostBack="true" runat="server" /></dd>
				        <dt ID="dtSubtype" runat="server">Split:</dt>
				        <dd ID="ddSubtype" runat="server"><asp:DropDownList ID="ddlSubtype" AutoPostBack="true" runat="server" /></dd>
				        <dt ID="dtKPI" runat="server">KPI:</dt>
				        <dd ID="ddKPI" runat="server"><asp:DropDownList ID="ddlKPI" AutoPostBack="true" runat="server" /></dd>
				        <dd ID="ddDELETE" style="display:none;" runat="server"></dd>
				        <dt ID="dtDELETE" style="display:none;" runat="server">
				                <asp:Button ID="btnDelete" Visible="false" Text="DELETE All Records for this Date/Location/KPI"
				                    OnClientClick="javascript:return true;alert('This button is not hooked up yet, coming soon (nothing deleted).');return false;" runat="server" /><br /><br /></dt>
				        <dd ID="ddDELETECMS" style="display:none;" runat="server"></dd>
				        <dt ID="dtDELETECMS" style="display:none;" runat="server">
				                <asp:Button ID="btnDeleteCMS" Visible="false" Text="DELETE All CMS Records for this Date/Location/Project"
				                    OnClientClick="javascript:return true;alert('This button is not hooked up yet, coming soon (nothing deleted).');return false;" runat="server" /><br /><br />
				                <asp:Button ID="btnDeleteCMSPayperiod" Visible="false" Text="DELETE All CMS Records for the PAY PERIOD for this Date/Location"
				                    OnClientClick="javascript:return true;alert('This button is not hooked up yet, coming soon (nothing deleted).');return false;" runat="server" /><br /><br /></dt>
				        <dd ID="ddDELETEKRONOS" style="display:none;" runat="server"></dd>
				        <dt ID="dtDELETEKRONOS" style="display:none;" runat="server">
				                <asp:Button ID="btnDeleteKronos" Visible="false" Text="DELETE All KRONOS Records for this Date/Location"
				                    OnClientClick="javascript:return true;alert('This button is not hooked up yet, coming soon (nothing deleted).');return false;" runat="server" /><br /><br />
				                <asp:Button ID="btnDeleteKronosPayperiod" Visible="false" Text="DELETE All KRONOS Records for the PAY PERIOD for this Date/Location"
				                    OnClientClick="javascript:return true;alert('This button is not hooked up yet, coming soon (nothing deleted).');return false;" runat="server" /><br /><br /></dt>
				        <dt ID="dtSubKPI" style="display:none;" runat="server">SubKPI:</dt>
				        <dd ID="ddSubKPI" style="display:none;" runat="server"><asp:DropDownList ID="ddlSubKPI" AutoPostBack="true" runat="server" /></dd>
				        <dd ID="ddSkip" style="display:none;" runat="server"></dd>
				        <dt ID="dtSkip" style="display:none;" runat="server">
				                <asp:Button ID="btnSkip" Visible="false" Text="Import WITHOUT uploading."
				                    OnClientClick="javascript:return true;alert('This button is not hooked up yet, coming soon (nothing deleted).');return false;" runat="server" /><br /><br />
                           <div id="sparediv" runat="server" style="margin-top: 10px;width:260px;height:150px;background-color:White;color:black;overflow-y:scroll;">Fake Import Log:</div>
                           <input id="sparedivclear" runat="server" style="margin-top: 10px;" type="button" value="clear errors" onclick="document.getElementById('sparediv').innerHTML='Fake Import Log:';return false;"/>
                        </dt>
				        <dt>&nbsp;</dt>
				        <dd>
                            <br /><br /><asp:CheckBox ID="cbCalcUtilization" Visible="false" Checked="false" AutoPostBack="True" Text="Calculate Utilization (check ONLY if CMS/KRONOS days are matched)." runat="server" /><br />
                        </dd>
				    </dl>
                    <div style="margin-left:-50px;margin-top: 180px;">
				    <dl id="dlControls" runat="server">
				        <dt>&nbsp;</dt>
				        <dd>
                            <asp:CheckBox ID="cbMult100" Visible="false" Checked="false" AutoPostBack="True" Text="Multiply Values X 100" runat="server" /><br />
                            <asp:CheckBox ID="cbNoCalc" Text="Don't Calculate Scores!" AutoPostBack="true" runat="server" /><br />
                            <asp:CheckBox ID="cbIgnoreWarnings" Checked="true" runat="server" />Ignore Warnings (errors cannot be ignored).<br />
                            <!-- <asp:CheckBox ID="cbSplitWarn" Visible="false" Checked="false" AutoPostBack="True" Text="Treat Invalid Splits as Warnings (instead of as Errors)." runat="server" /><br /> -->
				           	<br />
                            <asp:CheckBox ID="cbThrow" Visible="false" Checked="false" AutoPostBack="True" Text="Throw Exception (tester only)" runat="server" />
				        </dd>
				        <dd><asp:RadioButton ID="rbNormal" GroupName="importoptions" Checked="true" runat="server" />New records are unique for this Date/Agent/KPI.</dd>				        
				        <dt>&nbsp;</dt>
				        <dd><asp:RadioButton ID="rbAllowDuplicateDates" GroupName="importoptions" Checked="false" runat="server" />Allow Duplicate Dates for this Agent/KPI.</dd>				        
				        <dt>&nbsp;</dt>
				        <dd><asp:RadioButton ID="rbReplaceDuplicateDates" GroupName="importoptions" Checked="false" runat="server" />Replace any existing records for this Date/Agent/KPI.</dd>
                    </dl>
                    </div>
                    <a href='http://acuityapmr.com/jq/Report.aspx?cid=ImportLogHeaders&import3=1' onclick="return appLib.prefixhref(this);" title='Import Logs'>Import Logs</a>
				  </div>
 				 <div style="float:left;display:none;width:300px;">
				    <div><a id="historyclick" onclick="this.innerHTML='Please Wait...';this.disabled='disabled';gethistory(); return false;" href="#">Show Loaded KPIs</a></div>
				    <div id="historytree">&nbsp;</div>
				 </div>
 				 <div style="float:left;display:none;width:300px;">
				    <div><a id="CKloadedClick" onclick="this.innerHTML='Please Wait...';this.disabled='disabled';getCK(); return false;" href="#">Show Loaded CMS/KRONOS</a></div>
				    <div id="CKTable">&nbsp;</div>
				 </div>
                 <div style="clear:left;">&nbsp;</div>
                 </div>
                 <div style="position:absolute;top:5px;left:300px;">
    			   <div class="sectionbox" id="uploadbox">
    			   <div id="ImportMsgdiv" runat="server" style="color:red; padding-top: 20px; padding-bottom: 10px;display:none;"></div>
        		   <div class="sectionheader">Upload File</div>
                    <div id="encdiv" runat="server" class="encdiv">
                    </div>
                    <div id="btndiv" style="display:none" runat="server">
                        File <asp:Label ID="lblFilename" Text="" runat="server"/> is ready..<br />
                        <asp:Button ID="btnSave" runat="server" Text="Attempt Import" />
                        <span style="padding-left: 20px;"><a href="import.aspx">Start Over</a></span>
                    </div>
                   </div>
				</div>
			</div>
            <div id="logs" runat="server"></div>
		</form>
	    	    
	    <script type="text/javascript">
	        $(document).ready(function () {
	            function pad(number, length) {
	                var str = '' + number;
	                while (str.length < length) {
	                    str = '0' + str;
	                }
	                return str;
	            }
	            resizedivs();
	            if ($("#cbSkipUpload").is(":checked")) $("#uploadbox").hide();
	            else $("#uploadbox").show();
	        });

	        $(window).resize(function () {
	            resizedivs();
	        });

	        function resizedivs() {
	            $(".leftpanel").height(($(window).height() - 70) + 'px'); //was 96
	            $("#uploadbox").width(($(window).width() - 315) + 'px');
	            //alert("debug:" + ($(window).width() - 315) + 'px');
	        }

            function boxval(ids)
            {
                return boxget(1,ids);
            }
            function boxtxt(ids)
            {
                var rt =boxget(2,ids);
                if (rt != "-select-")
                {
                    return rt;
                }
                return "";
            }
	        function boxget(typ,ids)
            {
               var ws = document.getElementById(ids)
               if (ws != null)
               {
                   for (i = 0; i < ws.options.length; i++)
                   {          
                       if (ws.options[i].selected)
                       {
                           if (typ==1)
                           {
                             return ws.options[i].value;
                           }
                           else if (typ==2)
                           {
                             return ws.options[i].text;
                           }
                       }
                   }
                }
                return "";
            }
            var PARAMchar = "?";
            function paramadd(nm,val)
            {
	            if (val != "")
	            {                
	                var rt = PARAMchar + nm + "=" + val;
	                PARAMchar = "&";
	                return rt;
	            }
	            return "";
	        }

	        var PARAMlimitdate = "02/01/2011"; //TODO: Make equal to end of last payperiod.

	        function getCK() {
	            var sb = document.getElementById('ddlLocation');
	            var sb2 = document.getElementById('ddlProjectI');
	            var cb = document.getElementById('cbProgressKronos');
	            if (sb.options[sb.selectedIndex].value == "") {
	                document.getElementById("CKTable").innerHTML = "<p>Select a <b>Location</b> First.</p>";
                    document.getElementById("CKloadedClick").disabled='';
                    document.getElementById("CKloadedClick").innerHTML="Show Loaded CMS/KRONOS";
	            }
                else {
                    var murl = "CKLoaded.ashx?location=";
                    murl += sb.options[sb.selectedIndex].value;
                    murl += "&project="
                    murl += sb2.options[sb2.selectedIndex].value;
                    if (cb != null) {
                        if (cb.checked) {
                            murl += "&progresscheck=1";
                        }
                    }
                    $.ajax({
                        type: "GET",
                        url: murl,
                        async: false,
                        cache: false,
                        dataType: "html",
                        error: function (request, textStatus, errorThrown) {
                            alert('Error loading Values HTML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                        },
                        success: renderCK
                    });
	                document.getElementById("CKloadedClick").disabled = "";
	                document.getElementById("CKloadedClick").innerHTML = "refresh";
	            }

	        }
	        function renderCK(txt) {
                /* test
	            var hd = '<table class="CKTable"><tr><th>Date</th><th>CMS</th><th>KRONOS</th></tr>'
	            hd += '<tr><td>4/30/2011</td><td>Yes</td><td>Yes</td></tr>'
	            hd += '<tr><td>4/29/2011</td><td>Yes</td><td>Yes</td></tr>'
	            hd += '<tr><td>4/28/2011</td><td>Yes</td><td><b><font color="red">NO</font></b></td></tr>'
	            hd += '<tr><td>4/27/2011</td><td>Yes</td><td>Yes</td></tr>'
	            hd += '<tr><td>4/26/2011</td><td><b><font color="red">NO</font></b></td><td>Yes</td></tr>'
	            hd += '<tr><td>4/25/2011</td><td>Yes</td><td>Yes</td></tr>'
	            hd += '</table>'
                */
	            document.getElementById("CKTable").innerHTML = txt;
	        }
            
	        function gethistory()
	        {
	            var murl = "History.ashx";
	            PARAMchar = "?";
	            var txdt = document.getElementById("tbDate").value;
	            if (txdt=="")
	            {
	                txdt=PARAMlimitdate;
	            }
                murl += paramadd("date",txdt);
                murl += paramadd("project",boxval("ddlProjectI"));
                murl += paramadd("location",boxval("ddlLocation"));
                murl += paramadd("kpi",boxval("ddlKPI"));
	            $.ajax({
                    type: "GET",
                    url: murl,
                    async: false,
                    cache: false,
                    dataType: "html",
                    error: function(request,textStatus, errorThrown){
                           alert('Error loading Values HTML Document:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                    },
                    success: rendertext
                });
                document.getElementById("historyclick").disabled = "";
                document.getElementById("historyclick").innerHTML="refresh";

            };
            function checkdate(me) {
                var now = new Date();
                str = me.value;
                date = new Date(Date.parse(str));
                if (isNaN(date)) {
                    alert("date is invalid, please use the form MM/DD/YYYY (example: 01/25/2012)");
                }
                else {
                    var dif = (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
                    if (dif < 0) dif = -dif;
                    if (dif > 30) {
                        alert("WARNING! - The date you entered (" + str + "), is more than 30 days from the current date - please check your date (did you enter the right year?).");
                    }
                }
            };
   	        function rendertext(txt)
   	        {
   	            var hd = '<ul id="history" class="treeview-red"><li><span>Loaded KPIs (';
   	            var tx;
   	            var first = true;
   	            tx=boxtxt("ddlLocation");
   	            if (tx != "")
   	            {
   	                hd += tx;
   	                first=false;   	                
   	            }
   	            tx=boxtxt("ddlProjectI");
   	            if (tx != "")
   	            {
   	                if (!first) hd += ", ";
   	                hd += tx;
   	                first=false;
   	            }
   	            tx=boxtxt("ddlKPI");
   	            if (tx != "")
   	            {
   	                if (!first) hd += ", ";
   	                hd += tx;
   	                first=false;
   	            }
                tx=document.getElementById("tbDate").value
                if (tx=="") tx=PARAMlimitdate;
   	            if (tx != "")
   	            {
   	                if (!first) hd += ", ";
   	                hd += "date >=" + tx;
   	                first=false;   	                
   	            }
   	            hd+= ")</span>";
   	            hd+=txt;
   	            hd+="</li></ul>";

    	        document.getElementById("historytree").innerHTML=hd;
    	        $("#historytree").treeview({
    	            collapsed: true,
    	            unique: true,
    	            persist: "cookie",
    	            cookieId: "treeview-red"
    	        });
    	    }
	    </script>
	</body>

</HTML>
