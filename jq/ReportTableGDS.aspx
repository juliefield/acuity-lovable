<%@ Page Language="C#" AutoEventWireup="true" CodeFile="ReportTableGDS.aspx.cs" ValidateRequest="false" Inherits="jq_ReportTableGDS" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Report Table</title>
    <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">
    <asp:PlaceHolder runat="server">
    	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />
        <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />

        <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jqgrid40/css/ui.jqgrid.css"  />
        <link rel="stylesheet" href="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.css" />


        <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <!--<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>-->
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/spinner.js"></script>

 
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jQueryRotate.js" type="text/javascript"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.spin.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery-treeview/jquery.treeview.js" type="text/javascript"></script>

		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>highcharts-2.3.3/js/highcharts.src.js"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>highcharts-2.3.3/js/highcharts-more.js"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>

        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/knockout-3.3.0.js"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko.mapping.js"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko-postbox.js"></script>
                            

        <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>

        <script type="text/javascript" src="appApmClient/js/appApmDashboard-2.10.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmScoreEditing-1.1.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmMessaging-1.2.13.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmNavMenus-2.0.1.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmSettings-1.1.0.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmAdmin-1.3.6.js"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
      	<script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
    	<script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
    	<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/development-bundle/ui/jquery.ui.tabs.js"></script>
	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>

   	    <!-- <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.qtip-1.0.0-rc3.min.js" type="text/javascript"></script> -->
        <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>

		<!-- 1a) Optional: add a theme file -->
			<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>highcharts-2.3.3/js/themes/touchpointasync3.js"></script>
		
		<!-- 1b) Optional: the exporting module -->
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>highcharts-2.3.3/js/modules/exporting.js"></script>
				
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
        <link href='ACUITY/css/styles.css' rel='stylesheet' />
        <link href='ACUITY/css/sectionboxes.css' rel='stylesheet' />

</asp:PlaceHolder>


</head>
<body id="ReportTable" runat="server" style="position: relative;">
  <form id="form1" runat="server">
  <div id="container">
   <div id="header"><div id="brandingLogo"><h1><span>ERS</span></h1></div></div><div id="nav"><ul id="header_ul" style="display:none;"><li><a onclick="return appLib.prefixhref(this);" href="http://acuityapm.com/default.aspx">Dashboard</a></li><li><a onclick="return appLib.prefixhref(this);" href="http://acuityapm.com/admin/admin.aspx">Admin</a></li><li><a onclick="return appLib.prefixhref(this);" href="http://acuityapm.com/monitor/monitor.aspx">Monitor</a></li><li id="header_liActive"><a id="header_active" onclick="return appLib.prefixhref(this);" href="http://acuityapm.com/report/quiz_review.aspx">Reports</a></li><li><a onclick="return appLib.prefixhref(this);" href="http://acuityapm.com/admin/import.aspx">Import</a></li><li><a onclick="return appLib.prefixhref(this);" href="http://acuityapm.com/admin/payroll.aspx">Payroll Admin</a></li></ul></div><div id="header_logout"><span>Welcome</span> <span id="header_userID_lbl"></span><span>&nbsp;| <a onclick="return appLib.prefixhref(this);" href='http://acuityapm.com/logout.aspx' title='Logout'>Logout</a></span><span style="color:gray;">&nbsp;&nbsp;v2</span><div id="loadingprompt" style="color:White;background-color:#EF4521;padding-top:4px;padding-bottom:2px;padding-left:20px;font-weight:bold;font-size:16px;padding-right: 20px;float:right;">Loading...</div></div><div id="sidebar"><div class="sidebarNav" id="ReportSidebar" runat = "server" style="display:none;"></div></div></div>
    <div id="reportarea" style="position: absolute; top: 96px; left: 152px; display: block; width: 100%;">

      <div id="NavLinks" runat="server"></div>
      <div id="HeaderText" style="position: relative; padding-left: 10px;  padding-top: 3px; padding-bottom: 2px; background-color: Gray; display:block; color:White; font-weight:bold;" runat="server">Table</div>
      <div id="divMenu" style="position:relative;">
        <div class="filters" style="position: relative;">
          <div id="comboprogress" style="z-index:20; position:absolute; top: 30px; left:200px;"></div>
          <div style="position:absolute; top: 5px; left: 10px;">
            <dl id="divProject" style="position:absolute; top: 0px; left: 0px;">
                <dt>Project:</dt>
                <dd><select id="selProjects"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divLocation" style="position:absolute; top: 25px; left: 0px;">
                <dt>Location:</dt>
                <dd><select id="selLocations"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divGroup" style="position:absolute; top: 50px; left: 0px;">
                <dt>Group:</dt>
                <dd><select id="selGroups"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divTeam" style="position:absolute; top: 75px; left: 0px;">
                <dt>Team:</dt>
                <dd><select id="selTeams"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divCSR" style="position:absolute; top: 100px; left: 0px;">
                <dt>CSR:</dt>
                <dd><select id="selCSRs"><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divKPI" style="position:absolute; top: 0px; left: 300px;">
                <dt>KPI:</dt>
                <dd><select id="selKPIs" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divXaxis" style="display: none;">
                <dt>X Axis:</dt>
                <dd><select id="selXaxiss" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divPayperiod" style="position:absolute; top: 25px; left: 300px;">
                <dt>Date Range:</dt>
                <dd><select id="selPayperiods"><option value="">..loading</option></select></dd>
                <dt>Date From:</dt>
                <dd><span id="spanDatefrom"></span></dd>
                <dt>Date To:</dt>
                <dd><span id="spanDateto"></span></dd>
            </dl>
            <dl id="divButtons" style="position:absolute; top: 100px; left: 300px;">
                <dt></dt>
                <dd style="width:300px;"><input id="btnTable" type="button" value="table" />
                    <!-- <input id="btnClear" type="button" value="clear" /> --></dd>
            </dl>
            <dl id="divEvaluator" style="display:none;">
                <dt>Evaluator:</dt>
                <dd><select id="selEvaluators" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divQualityform" style="display:none;">
                <dt>Form:</dt>
                <dd><select id="selQualityforms" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divQuizname" style="display:none;">
                <dt>Quiz Name:</dt>
                <dd><select id="selQuiznames" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <dl id="divSkillarea" style="display:none;">
                <dt>Skill Area:</dt>
                <dd><select id="selSkillareas" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <!--<input id="btnTable" type="button" value="table" />-->
          </div>

        </div>

    </div>
    <div style="position:relative;display:block;border-top: 1px solid gray; height: 4px;">&nbsp;</div>
    <div id="SubNavLinks" runat="server"></div>
    <div id="set" style="position: relative;">
        <div id="mytable1" style="z-index:1;">
            <table id="list1"></table>
            <div id="pager1"></div>
        </div>
    </div>
    </div>

    <div id="TableSQL" style="display:none;" runat="server"></div>
    <div id="FilterConfig" style="display:none;" runat="server"></div>

<script type="text/javascript">

    window.appApmClient = appApmDashboard;

    function chartclick0(event) { appApmClient.chartclick(event, 0, this); };

    var opt = {
        apmTableType: 'single', //Valid types are 'cascade', 'single'
        apmTableMax: 5,
        apmTableId: 'list1', //if tabletype is 'cascade', this is a prefix.
        apmPagerId: 'pager1',
        apmQid: 'KPITable',
        apmAcuityHeaderOffset: true,
        datatype: "local",
        height: 'auto',
        rowNum: 1000,
        /* rowList: [10, 20, 30], */
        /*colNames: ['Inv No', 'Date', 'Client', 'Amount', 'Tax', 'Total', 'Notes'],
        colModel: [{ name: 'id', index: 'id', width: 60, sorttype: "int" },
        { name: 'invdate', index: 'invdate', width: 90, sorttype: "date", formatter: "date" },
        { name: 'name', index: 'name', width: 100, editable: true },
        { name: 'amount', index: 'amount', width: 80, align: "right", sorttype: "float", formatter: "number", editable: true },
        { name: 'tax', index: 'tax', width: 80, align: "right", sorttype: "float", editable: true },
        { name: 'total', index: 'total', width: 80, align: "right", sorttype: "float" },
        { name: 'note', index: 'note', width: 150, sortable: false }
        ],*/
        viewrecords: true,
        //sortname: 'Name',
        //grouping: true,
        //groupingView: {
        //groupField: ['Name'],
        //groupCollapse: true
        //},
        caption: "Grouping Array Data"
        //        footerrow : true,
        //        userDataOnFooter : true,
    };
    $(':input').change(function () { appApmClient.change(this); });

    var controlopts = {
        initfunction: function () {
            appApmClient.movefilters(0);
            appApmClient.refreshboxes('Project,Xaxis'); //This will set the project to the first project.
            appApmClient.refreshboxes('Location,Group,Team,CSR,KPI,Payperiod');
        },
        pagecontrols: [
                { type: 'select', idtemplate: 'Project', onchange: function () { appApmClient.refreshboxes('Location,Group,Team,CSR,KPI,Payperiod,Evaluator,Qualityform,Skillarea,Quizname') }, param: function () { return appApmClient.boxval('Project') } },
                { type: 'select', idtemplate: 'Location', onchange: function () { appApmClient.refreshboxes('Group,Team,CSR,Evaluator') }, param: function () { return appApmClient.boxval('Location') } },
                { type: 'select', idtemplate: 'Group', onchange: function () { appApmClient.refreshboxes('Team,CSR,Evaluator') }, param: function () { return appApmClient.boxval('Group') } },
                { type: 'select', idtemplate: 'Team', onchange: function () { appApmClient.refreshboxes('CSR,Evaluator') }, param: function () { return appApmClient.boxval('Team') } },
                { type: 'select', idtemplate: 'CSR', param: function () { return appApmClient.boxval('CSR') } },
                { type: 'select', idtemplate: 'Evaluator', param: function () { return appApmClient.boxval('Evaluator') } },
                { type: 'select', idtemplate: 'Qualityform', onchange: function () { appApmClient.refreshboxes('Skillarea') }, param: function () { return appApmClient.boxval('Qualityform') } },
                { type: 'select', idtemplate: 'Skillarea', param: function () { return appApmClient.boxval('Skillarea') } },
                { type: 'select', idtemplate: 'Quizname', param: function () { return appApmClient.boxval('Quizname') } },
                { type: 'select', idtemplate: 'Payperiod', onchange: function () { appApmClient.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto')); appApmClient.refreshboxes('Evaluator'); }, param: function () { return appApmClient.splitdateval('Payperiod'); } },
                { type: 'select', idtemplate: 'KPI', param: function () { return appApmClient.boxval('KPI') } },
                { type: 'select', idtemplate: 'Xaxis', param: function () { return appApmClient.boxval('Xaxis') } }
            ],
        views: [{
            tableoptions: opt,
            filters: [
                { pcid: 'Project', col: 1 },
                { pcid: 'Location', col: 1 },
                { pcid: 'Group', col: 1 },
                { pcid: 'Team', col: 1 },
                { pcid: 'CSR', col: 1 },
                { pcid: 'KPI', col: 2 },
                { pcid: 'Payperiod', col: 2, rows: 3 },
                { pcid: 'Xaxis', hidden: true },
                { id: 'Buttons', col: 2 }
            ]
        }]
    };

    $('#btnTable').click(function () {
        //document.getElementById('btnClear').disabled = '';
        appApmClient.tableme(0, false);
    });
    /*
    $('#btnClear').click(function () {
    appApmClient.cleartables(0);
    });
    */
</script>
<script type="text/javascript" src="ACUITY/js/AcuityInterface-3.1.js"></script>    
<script type="text/javascript">
    $(window).resize(function () {
        if (uiInterface) uiInterface.sizebars();
    });
</script>
<div id="NavConfig" style="display:none;" runat="server"></div>
<script type="text/javascript">
    $(document).ready(function () {
        if (appLib.gup("cid") != "") {
            opt.apmQid = "TableSQL";
        }
        appApmClient.initcontrols(controlopts);
        //document.getElementById('btnClear').disabled='disabled';
        $("#set div").draggable({ stack: "#set div" });
        if ((appLib.gup("auto") != "") || (uiInterface.isauto)) {
            //document.getElementById('btnClear').disabled = '';
            appApmClient.tableme(0, false);
        }
        if (appLib.gup("drp") != "") {
            

        }
        $(".sidebarNav").show();
        $("#header_ul").show();
    });
</script>

</form>
</body>
</html>
