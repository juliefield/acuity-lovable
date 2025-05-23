<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ACDMetrics.aspx.vb" ValidateRequest="false" Inherits="jq_ACDMetrics" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>ACD Metrics</title>
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
      	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />

        <link rel="stylesheet" type="text/css" media="screen" href="../lib/jquery/jqgrid40/themes/redmond/jquery-ui-1.8.2.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="../lib/jquery/jqgrid40/css/ui.jqgrid.css"  />
       	<link href="../lib/jquery-treeview/jquery.treeview.css" rel="stylesheet" />
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="../lib/jquery/ui/js/jquery-1.6.2.min.js"></script>
   	    <!--  <script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script> -->
   	    <script src="../lib/jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
   	    <script src="../lib/jquery-treeview/jquery.treeview.js"  type="text/javascript"></script>

		<script type="text/javascript" src="highcharts/js/highcharts.src.js"></script>

        <script type="text/javascript" src="appLib/js/appLib.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmClient.js"></script>

        <script src="../lib/jquery/jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
        <script src="../lib/jquery/jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
      	<script src="../lib/jquery/ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
    	<script src="../lib/jquery/ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
	    <script src="../lib/jquery/ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
	    <script src="../lib/jquery/ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>

        <link href='ACUITY/css/styles.css' rel='stylesheet' />
        <link href='ACUITY/css/sectionboxes.css' rel='stylesheet' />

</head>
<body id="ACDMetrics" runat="server" style="position: relative;">
  <form id="form1" runat="server">

  <div id="container">
   <div id="header"><div id="brandingLogo"><h1><span>ERS</span></h1></div></div><div id="nav"><ul id="header_ul"><li><a href="http://acuityapm.com/default.aspx" onclick="return appLib.prefixhref(this);">Dashboard</a></li><li><a href="http://acuityapm.com/admin/admin.aspx" onclick="return appLib.prefixhref(this);">Admin</a></li><li><a href="http://acuityapm.com/monitor/monitor.aspx" onclick="return appLib.prefixhref(this);">Monitor</a></li><li id="header_liActive"><a id="header_active" href="http://acuityapm.com/report/quiz_review.aspx" onclick="return appLib.prefixhref(this);">Reports</a></li><li><a href="http://acuityapm.com/admin/import.aspx" onclick="return appLib.prefixhref(this);">Import</a></li><li><a href="http://acuityapm.com/admin/payroll.aspx" onclick="return appLib.prefixhref(this);">Payroll Admin</a></li></ul></div><div id="header_logout"><span>Welcome</span> <span id="header_userID_lbl"></span><span>&nbsp;| <a href='http://acuityapm.com/logout.aspx' onclick="return appLib.prefixhref(this);" title='Logout'>Logout</a></span><span style="color:gray;">&nbsp;&nbsp;v2</span></div><div id="sidebar"><div class="sidebarNav" id="ReportSidebar" runat = "server"></div></div></div>
    <div id="reportarea" style="position: absolute; top: 96px; left: 152px; display: block; width: 100%;">
      <div id="NavLinks" runat="server"></div>
      <div id="HeaderText" style="position: relative; padding-left: 10px;  padding-top: 3px; padding-bottom: 2px; background-color: Gray; display:block; color:White; font-weight:bold;" runat="server">ACD Metrics Report Generator</div>
      <div id="divMenu" style="position:relative;">
        <div class="filters" style="position: relative;">
          <div style="position:absolute; top: 5px; left: 10px;">
            <dl id="divProject" style="position:absolute; top: 0px; left: 0px;">
                <dt>Project:</dt>
                <dd><select id="selProjects"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divLocation" style="position:absolute; top: 25px; left: 0px;">
                <dt>Location:</dt>
                <dd><select id="selLocations"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divACDDate" style="position:absolute; top: 50px; left: 0px;">
                <dt>Date:</dt>
                <dd><select id="selACDDates"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divButtons" style="position:absolute; top: 75px; left: 0px;">
                <dt></dt>
                <dd style="width:300px;"><input id="btnTable" type="button" value="table" />
                    <input id="btnClear" type="button" value="clear" /></dd>
            </dl>
            <!--<input id="btnTable" type="button" value="table" />-->
          </div>
        </div>
    </div>
    <div style="position:relative;display:block;border-top: 1px solid gray; height: 4px;">&nbsp;</div>
    <div id="set" style="position: relative;">
        <div id="mytable1" style="z-index:1;">
            <table id="list1"></table>
            <div id="pager1"></div>
        </div>
       </div>
    </div>
<div id="HeaderSQL" style="display:none;" runat="server"></div>
<div id="TableSQL" style="display:none;" runat="server"></div>
<div id="FilterConfig" style="display:none;" runat="server"></div>
<div id="NavConfig" style="display:none;" runat="server"></div>

<script type="text/javascript">

    function chartclick0(event) { appApmClient.chartclick(event, 0, this); };

    var opt = {
        apmTableType: 'single', //Valid types are 'cascade', 'single'
        apmTableMax: 5,
        apmTableId: 'list1', //if tabletype is 'cascade', this is a prefix.
        apmPagerId: 'pager1',
        apmQid: 'TableSQL',
        apmAcuityHeaderOffset: true,
        datatype: "local",
        height: 'auto',
        width: 600,
        //rowNum: 16,
        columnwidth: 300,
        viewrecords: true,
        caption: "ACD Data"
//        footerrow : true,
//        userDataOnFooter : true
    };
    $(':input').change(function () { appApmClient.change(this); });
    var controlopts = {
        initfunction: function () {
            appApmClient.movefilters();
            appApmClient.refreshboxes('Project'); //This will set the project to the first project.
            appApmClient.refreshboxes('Location,ACDDate');
        },
        pagecontrols: [
                { type: 'select', idtemplate: 'Project', onchange: function () { appApmClient.refreshboxes('Location,ACDDate') }, param: function () { return appApmClient.boxval('Project') } },
                { type: 'select', idtemplate: 'Location', onchange: function () { appApmClient.refreshboxes('ACDDate') }, param: function () { return appApmClient.boxval('Location') } },
                { type: 'select', idtemplate: 'ACDDate', param: function () { return appApmClient.boxval('ACDDate') } },
            ],
        views: [{
            tableoptions: opt,
            filters: [
                { pcid: 'Project', col: 1 },
                { pcid: 'Location', col: 1 },
                { pcid: 'ACDDate', col: 1  },
                { id: 'Buttons', col: 1 }
            ]
        }]
    };

    $('#btnTable').click(function () {
        document.getElementById('btnClear').disabled = '';
        appApmClient.tableme(0, false);
    });

    $('#btnClear').click(function () {
        appApmClient.cleartables(0);
    });
</script>
<script type="text/javascript" src="ACUITY/js/AcuityInterface-3.1.js"></script>
<script type="text/javascript">
    $(window).resize(function () {
        uiInterface.sizebars();
    });
</script>
</form>
<script type="text/javascript">
    $(document).ready(function () {
        if (appLib.gup("cid") != "") {
            opt.apmQid = "TableSQL";
        }
        appApmClient.initcontrols(controlopts);
        document.getElementById('btnClear').disabled = 'disabled';
        $("#set div").draggable({ stack: "#set div" });
        if ((appLib.gup("auto") != "") || (uiInterface.isauto)) {
            document.getElementById('btnClear').disabled = '';
            appApmClient.tableme(0, false);
        }
        //CLUGUE: This partially defeats the content manager, very specific quick fix.
        if ((appLib.gup("import3") != "") || (appLib.gup("cid") == "ImportLogRecords") || (appLib.gup("cid") == "ImportLogHeaders")) {
            $("#header").hide();
            $("#nav").hide();
            $("#header_logout").hide();
            $("#reportarea,#sidebar").css("top", "0px");
            $("#HeaderText").html("Import Logs");
            $("#ReportSidebar").append('<a href="import3.aspx">&lt; Return to Importer</a>');
        }
    });
</script>
</body>
</html>
