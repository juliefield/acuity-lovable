<%@ Page Language="VB" AutoEventWireup="false" CodeFile="ReportChart.aspx.vb" ValidateRequest="false" Inherits="jq_ReportChart" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Reports Menu</title>
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">

      	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />

        <link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/themes/redmond/jquery-ui-1.8.2.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/css/ui.jqgrid.css"  />
       	<link href="jquery-treeview/jquery.treeview.css" rel="stylesheet" />
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="jquery-ui/js/jquery-1.5.1.min.js"></script>
   	    <!--  <script src="http://code.jquery.com/jquery-latest.js" type="text/javascript"></script> -->
   	    <script src="jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
   	    <script src="jquery-treeview/jquery.treeview.js"  type="text/javascript"></script>

		<script type="text/javascript" src="highcharts/js/highcharts.src.js"></script>

        <script type="text/javascript" src="appLib/js/appLib.js"></script>
        <script type="text/javascript" src="appApmClient/js/appApmClient.js"></script>

        <script src="jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
        <script src="jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
      	<script src="jquery-ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
    	<script src="jquery-ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
	    <script src="jquery-ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
	    <script src="jquery-ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>

			<script type="text/javascript" src="highcharts/js/themes/ERS.js"></script>

        <link href='ACUITY/css/styles.css' rel='stylesheet' />
        <link href='ACUITY/css/sectionboxes.css' rel='stylesheet' />

</head>
<body id="ReportChart" runat="server" style="position: relative;">
  <form id="form1" runat="server">

  <div id="container">
   <div id="header"><div id="brandingLogo"><h1><span>ERS</span></h1></div></div><div id="nav"><ul id="header_ul"><li><a href="http://acuityapm.com/default.aspx" onclick="return appLib.prefixhref(this);">Dashboard</a></li><li><a href="http://acuityapm.com/admin/admin.aspx" onclick="return appLib.prefixhref(this);">Admin</a></li><li><a href="http://acuityapm.com/monitor/monitor.aspx" onclick="return appLib.prefixhref(this);">Monitor</a></li><li id="header_liActive"><a id="header_active" href="http://acuityapm.com/report/quiz_review.aspx" onclick="return appLib.prefixhref(this);">Reports</a></li><li><a href="http://acuityapm.com/admin/import.aspx" onclick="return appLib.prefixhref(this);">Import</a></li><li><a href="http://acuityapm.com/admin/payroll.aspx" onclick="return appLib.prefixhref(this);">Payroll Admin</a></li></ul></div><div id="header_logout"><span>Welcome</span> <span id="header_userID_lbl"></span><span>&nbsp;| <a href='http://acuityapm.com/logout.aspx' onclick="return appLib.prefixhref(this);" title='Logout'>Logout</a></span><span style="color:gray;">&nbsp;&nbsp;v2</span></div><div id="sidebar"><div class="sidebarNav" id="ReportSidebar" runat = "server"></div></div></div>
    <div id="reportarea" style="position: absolute; top: 96px; left: 152px; display: block; width: 100%;">
      <div id="NavLinks" runat="server"></div>
      <div id="HeaderText" style="position: relative; padding-left: 10px;  padding-top: 3px; padding-bottom: 2px; background-color: Gray; display:block; color:White; font-weight:bold;" runat="server">Chart</div>
      <div id="divMenu" style="position:relative;">
        <div class="filters" style="position: relative;">
          <div style="position:absolute; top: 5px; left: 10px;">
            <dl id="divProject" style="position:absolute; top: 0px; left: 0px;">
                <dt>Project:</dt>
                <dd><select id="selProjects"><option value="">...loading</option></select></dd>
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
                <dd style="width:300px;"><input id="btnPlot" type="button" value="plot" />
                    <input id="btnAdd" type="button" value="add" /></dd>
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
   <div id="mycontainer" style="position:relative;">
        <div id="container1" style="position:relative;width: 800px; height: 400px;"></div>
    </div>
    <div id="set" style="position: relative;">
        <div id="mytable1" style="z-index:1;">
            <table id="list1"></table>
            <div id="pager1"></div>
        </div>
    </div>

    </div>
<div id="TableSQL" style="display:none;" runat="server"></div>
<div id="FilterConfig" style="display:none;" runat="server"></div>
<div id="NavConfig" style="display:none;" runat="server"></div>

<script type="text/javascript">

    function chartclick0(event) { appApmClient.chartclick(event, 0, this); };
    var op = {
        apmClickFunction: chartclick0,
        apmShowInLegend: true,
        apmQid: 'KPIChart',
        chart: {
            renderTo: 'container1',
            defaultSeriesType: 'column'
        },
        title: {
            text: 'Project Average'
        },
        xAxis: {
            categories: ["Select Criteria and 'plot'"
            ]
        },
        yAxis: {
            min: 0,
            max: 10,
            tickInterval: 2,
            title: {
                text: 'Score'
            }
        },
        tooltip: {
            formatter: function () {
                return this.series.name + '<br/>' + '<b>' + this.x/*appLib.dumpObj(this,"this","",0)*/ + '</b><br/>' + 'Score: ' + this.point.y;
            }
        },
        plotOptions: {
            column: {
                stacking: null
            }
        },
        /* colors: ['blue'], */
        credits: {
            enabled: false
        },
        series: [{ type: 'column', name: '(selection)', data: [0], showInLegend: false }
        ]
    };


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
        caption: "Grouping Array Data",
//        footerrow : true,
//        userDataOnFooter : true,
    };
    $(':input').change(function () { appApmClient.change(this); });
    var controlopts = {
        initfunction: function () {
            appApmClient.refreshboxes('Project,Xaxis'); //This will set the project to the first project.
            appApmClient.refreshboxes('Location,Group,Team,CSR,KPI,Payperiod');
        },
        pagecontrols: [
                { type: 'select', idtemplate: 'Project', onchange: function () { appApmClient.refreshboxes('Location,Group,Team,CSR,Evaluator,Qualityform,Skillarea,Quizname,KPI') }, param: function () { return appApmClient.boxval('Project') } },
                { type: 'select', idtemplate: 'Location', onchange: function () { appApmClient.refreshboxes('Group,Team,CSR,Evaluator') }, param: function () { return appApmClient.boxval('Location') } },
                { type: 'select', idtemplate: 'Group', onchange: function () { appApmClient.refreshboxes('Team,CSR,Evaluator') }, param: function () { return appApmClient.boxval('Group') } },
                { type: 'select', idtemplate: 'Team', onchange: function () { appApmClient.refreshboxes('CSR,Evaluator') }, param: function () { return appApmClient.boxval('Team') } },
                { type: 'select', idtemplate: 'CSR', param: function () { return appApmClient.boxval('CSR') } },
                { type: 'select', idtemplate: 'Evaluator', param: function () { return appApmClient.boxval('Evaluator') } },
                { type: 'select', idtemplate: 'Qualityform', onchange: function () { appApmClient.refreshboxes('Skillarea') }, param: function () { return appApmClient.boxval('Qualityform') } },
                { type: 'select', idtemplate: 'Skillarea', param: function () { return appApmClient.boxval('Skillarea') } },
                { type: 'select', idtemplate: 'Quizname', param: function () { return appApmClient.boxval('Quizname') } },
                {type: 'select', idtemplate: 'Payperiod', onchange: function () { appApmClient.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto')); appApmClient.refreshboxes('Evaluator'); }, param: function () { return appApmClient.splitdateval('Payperiod') } },
                { type: 'select', idtemplate: 'KPI', param: function () { return appApmClient.boxval('KPI') } },
                { type: 'select', idtemplate: 'Xaxis', param: function () { return appApmClient.boxval('Xaxis') } }
            ],
        views: [{
            chartoptions: op,
            tableoptions: opt,
            filters: [
                { pcid: 'Project', col: 1 },
                { pcid: 'Location', col: 1 },
                { pcid: 'Group', col: 1  },
                { pcid: 'Team', col: 1  },
                { pcid: 'CSR', col: 1  },
                { pcid: 'KPI', col: 2  },
                { pcid: 'Payperiod', col: 2, rows: 3 },
                { pcid: 'Xaxis', hidden: true },
                { id: 'Buttons', col: 2 }
            ]
        }]
    };

    $(document).ready(function () {
        if (appLib.gup("cid")!="") {
            op.apmQid = "TableSQL";
        }

        appApmClient.initcontrols(controlopts);
        document.getElementById('btnAdd').disabled='disabled';
        $("#set div").draggable({ stack: "#set div" });
        if (appLib.gup("auto")!="") {
        document.getElementById('btnAdd').disabled = '';
        appApmClient.plotme(0, true);
        }
    });

    $('#btnPlot').click(function () {
        document.getElementById('btnAdd').disabled = '';
        appApmClient.plotme(0, true);
    });
    $('#btnAdd').click(function () {
        appApmClient.plotme(0,false);
    });
</script>
<script type="text/javascript" src="ACUITY/js/AcuityInterface-3.1.js"></script>    
<script type="text/javascript">
    $(window).resize(function () {
        if (uiInterface) uiInterface.sizebars();
    });
</script>
</form>

</body>
</html>
