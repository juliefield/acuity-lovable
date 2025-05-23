<%@ Page Language="VB" AutoEventWireup="false" CodeFile="Dashboard.aspx.vb" ValidateRequest="false" Inherits="jq_Dashboard" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>Acuity&trade; Charts</title>
    <meta name="ROBOTS" content="NOINDEX, NOFOLLOW">
		<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />
  	<link rel="stylesheet" href="jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />
		<link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />
  	<link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/css/ui.jqgrid.css"  />
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
    <script type="text/javascript" src="jquery-ui/js/jquery-1.5.1.min.js"></script>
 	  <script src="jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
		<script type="text/javascript" src="highcharts/js/highcharts.src.js"></script>
    <script type="text/javascript" src="appLib/js/appLib.js"></script>
    <script type="text/javascript" src="appApmClient/js/appApmClient.js"></script>
    <script type="text/javascript" src="appApmClient/js/spin.min.js"></script>
    <script src="jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
    <script src="jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
  	<script src="jquery-ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
  	<script src="jquery-ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
  	<script type="text/javascript" src="jquery-ui/development-bundle/ui/jquery.ui.tabs.js"></script>
    <script src="jquery-ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
    <script src="jquery-ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>
		<!-- 1a) Optional: add a theme file -->
		<script type="text/javascript" src="highcharts/js/themes/touchpoint.js"></script>
		<!-- 1b) Optional: the exporting module -->
		<script type="text/javascript" src="highcharts/js/modules/exporting.js"></script>
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
    <link href='ACUITY/css/styles.css' rel='stylesheet' />
    <link href='ACUITY/css/sectionboxes.css' rel='stylesheet' />
	</head>
	<body id="Dashboard" style="position:relative;" runat="server">
		<div class="filters-tab" id="filterstab">
			<i class="fas fa-chevron-up"></i> FILTERS
		</div>
		<script>
			$(function() {
			  $("#filterstab").click(function() {
			    $(".leftpanel").addClass('active');
					$(".filters-tab").addClass('closed');
					$(".leftpanelOverlay").addClass('active');
			  });
				$("#leftpanelclose").click(function() {
			    $(".leftpanel").removeClass('active');
					$(".filters-tab").removeClass('closed');
					$(".leftpanelOverlay").removeClass('active');
			  });
				$("#leftpanelOverlay").click(function() {
			    $(".leftpanel").removeClass('active');
					$(".filters-tab").removeClass('closed');
					$(".leftpanelOverlay").removeClass('active');
			  });
				$(".nav3-icon").click(function() {
			    $(".leftpanel").removeClass('active');
					$(".filters-tab").removeClass('closed');
					$(".leftpanelOverlay").removeClass('active');
			  });
			});
		</script>
    <div id="AgameOverlay" style="display:none;position:absolute; top:0px;left:0px;width:100%;height:100%;z-index:2000"></div>
		<form id="form1" runat="server">
 			<div id="container">
			  <!--#include file="inc_tp1head.aspx"-->
			  <script type="text/javascript" language="javascript">
			    $("#chartsnav").css("background-color", "#9966FF"); //hack!
			  </script>
    		<div id="contentwhhatever" style="position:relative;">
					<!-- 3. Add the container -->
        	<div class="filters" style="z-index:1; width: 270px; height: 350px; position:absolute; top: 0px; left:0px;">
            <dl>
              <dt>Project:</dt>
              <dd><select id="selProjects"><option value="">..loading</option></select></dd>
              <dt>Location:</dt>
              <dd><select id="selLocations"><option value="">..loading</option></select></dd>
              <dt>Group:</dt>
              <dd><select id="selGroups"><option value="">..loading</option></select></dd>
              <dt>Team:</dt>
              <dd><select id="selTeams"><option value="">..loading</option></select></dd>
              <dt>CSR:</dt>
              <dd><select id="selCSRs"><option value="">..loading</option></select></dd>
              <dt>KPI:</dt>
              <dd><select id="selKPIs" onchange=""><option value="">..loading</option></select></dd>
              <dt>X Axis:</dt>
              <dd><select id="selXaxiss" onchange=""><option value="">..loading</option></select></dd>
            </dl>
            <dl id="datedl">
              <dt>Date Range:</dt>
              <dd><select id="selPayperiods"><option value="">..loading</option></select></dd>
              <dt>Date From:</dt>
              <dd><span id="spanDatefrom"></span></dd>
              <dt>Date To:</dt>
              <dd><span id="spanDateto"></span></dd>
            </dl>
            <dl id="trenddl" style="display:none;">
              <dt>Trend By:</dt>
							<dd><input type="radio" id="rdoPayperiod" name="trendtype" checked="checked" value="base" />Pay Period</dd>
              <dt></dt>
							<dd><input type="radio" id="rdoMonth" name="trendtype" value="base" />Month</dd>
            </dl>
            <div style="position:absolute; top: 280px; left: 150px;">
              <input type="radio" id="rdoBase" name="plottype" checked="checked" value="base" />base
              <input type="radio" id="rdoTrend" name="plottype" value="trend" />trend
              <br /><input id="btnPlot" type="button" value="Submit" />
              <input id="btnAdd" type="button" value="add" />
              <!-- <input id="debug" type="button" value="debug" onclick="alert('debug1');var i; for (i=0;i<100000000;i++) { var j = 0; j = j+i; }; alert('debug2');" /> -->
            </div>
        	</div>
        	<div id="comboprogress" style="z-index:2; position:absolute; top: 90px; left:90px;">
        	</div>
	        <div id="comboprogress2" style="z-index:3; position:absolute; top: 90px; left:90px;">
	        </div>
          <div id="tabs" style="position:absolute;top:0px;left:280px;">
            <ul>
              <li><a href="#tabs-1">Graph</a></li>
              <li><a id="tablelabel" href="#tabs-2">Table</a></li>
          	</ul>
            <div id="tabs-1">
              <div id="mycontainer">
                <div id="Div1"></div>
              </div>
            </div>
            <div id="tabs-2">
              <div id="mytable1">
                <table id="list1"></table>
                <div id="pager1"></div>
                <div id="tablemessage" style="margin-top: 20px;">
									Select a bar or point from the graph, and the results will display here.
								</div>
              </div>
            </div>
          </div>
        	<div id="plotprogress" class="progressindicator" style="z-index:10; position:absolute; top: 50px; left:280px;display:none;">
					</div>
		      <div id="set">
		        <div id="mytable2" style="position:absolute;top: 375px; left:85px; z-index:1;">
		          <table id="list2"></table>
		        </div>
		        <div id="mytable3" style="position:absolute;top: 410px; left:140px; z-index:1;">
		          <table id="list3"></table>
		        </div>
		        <div id="mytable4" style="position:absolute;top: 445px; left:195px; z-index:1;">
		          <table id="list4"></table>
		        </div>
		        <div id="mytable5" style="position:absolute;top: 480px; left:250px; z-index:1;">
		          <table id="list5"></table>
		        </div>
		      </div>
      	</div>
			</div>
			<div id="NavConfig" style="display:none;" runat="server"></div>
		</form>

		<script type="text/javascript">
		    function chartclick0(event) { appApmClient.chartclick(event, 0, this); };
		    var op = {
		        apmClickFunction: chartclick0,
		        apmShowInLegend: true,
		        apmQid: 'KPIChart',
		        apmTouchpointDashboardFormatting: true,
		        chart: {
		            renderTo: 'mycontainer',
		            defaultSeriesType: 'column'
		        },
		        title: {
		            text: ''
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
		                return this.series.name + '<br/>' + '<b>' + this.x + '</b><br/>' + 'Score: ' + this.point.y;
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
		        apmAcuityHeaderOffset: true,
		        apmTouchpointDashboardFormatting: true,
		        apmQid: 'KPITable',
		        datatype: "local",
		        height: 'auto',
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
		        pager: "#plist48",
		        viewrecords: true,
		        //sortname: 'Name',
		        //grouping: true,
		        //groupingView: {
		        //    groupField: ['Name'],
		        //    groupCollapse: true
		        //},
		        caption: "Grouping Array Data"
		    };

		    $(':input').change(function () { appApmClient.change(this); });
		    var controlopts = {
		        initfunction: function () {
		            appApmClient.refreshboxes('Project,Xaxis'); //This will set the project to the first project.
		            appApmClient.refreshboxes('Location,Group,Team,CSR,KPI,Payperiod');
		        },
		        pagecontrols: [
		                { type: 'select', idtemplate: 'Project', onchange: function () { appApmClient.refreshboxes('Location,Group,Team,CSR,KPI') }, param: function () { return appApmClient.boxval('Project') } },
		                { type: 'select', idtemplate: 'Location', onchange: function () { appApmClient.refreshboxes('Group,Team,CSR') }, param: function () { return appApmClient.boxval('Location') } },
		                { type: 'select', idtemplate: 'Group', onchange: function () { appApmClient.refreshboxes('Team,CSR') }, param: function () { return appApmClient.boxval('Group') } },
		                { type: 'select', idtemplate: 'Team', onchange: function () { appApmClient.refreshboxes('CSR') }, param: function () { return appApmClient.boxval('Team') } },
		                { type: 'select', idtemplate: 'CSR', param: function () { return appApmClient.boxval('CSR') } },
		                { type: 'select', idtemplate: 'Payperiod', onchange: function () { appApmClient.splitdates(document.getElementById('selPayperiods'), document.getElementById('spanDatefrom'), document.getElementById('spanDateto')) }, param: function () { return appApmClient.splitdateval('Payperiod') } },
		                { type: 'select', idtemplate: 'KPI', onrefresh: function () {
		                    }, param: function () { return appApmClient.boxval('KPI') } },
		                { type: 'select', idtemplate: 'Xaxis', param: function () { return appApmClient.boxval('Xaxis') } }
		            ],
		        views: [{
		            chartoptions: op,
		            tableoptions: opt,
		            filters: [
		                { pcid: 'Project' },
		                { pcid: 'Location' },
		                { pcid: 'Group' },
		                { pcid: 'Team' },
		                { pcid: 'CSR' },
		                { pcid: 'Payperiod' },
		                { pcid: 'KPI' },
		                { pcid: 'Xaxis' }
		            ]
		        }]
		    };

		    $(document).ready(function () {
		        //alert("debug:enter ready");
		        appApmClient.showprogress("comboprogress");
		        appApmClient.initcontrols(controlopts);
		        document.getElementById('btnAdd').disabled = 'disabled';
		        $("#mycontainer").draggable();
		        $("#set div").draggable({ stack: "#set div" });
		        //Auto
		        appApmClient.plotme(0, true);
		        appApmClient.hideprogress("comboprogress");
		    });

		    $('#btnPlot').click(function () {
		        var plottingok = true;
		        if (document.getElementById("rdoTrend").checked) {
		            if (document.getElementById("rdoPayperiod").checked) appLib.setOption(document.getElementById("selXaxiss"), "Payperiod");
		            else appLib.setOption(document.getElementById("selXaxiss"), "Month");
		            var sb = document.getElementById('selKPIs');
		            for (var i = 0; i < sb.options.length; i++) {
		                if (sb.options[i].selected) {
		                    if ((sb.options[i].text.indexOf('(All)') >= 0)||(sb.options[i].text.indexOf('(Each)') >= 0)) {
		                        alert("KPI can't be (All) or (Each) for a Trend report");
		                        plottingok = false;
		                        break;
		                    }
		                }
		            }
		        }

		        if (plottingok) {
		            document.getElementById('btnAdd').disabled = '';
		            appApmClient.plotme(0, true);
		        }
		    });

		    $('#btnAdd').click(function () {
		        appApmClient.plotme(0, false);
		    });

		    var XaxisHOLD = "";
		    var PayPeriodHOLD = "";
		    $('#rdoBase').click(function () {
		        document.getElementById('btnAdd').disabled = 'disabled';
		        appLib.setOption(document.getElementById("selXaxiss"), "KPI");
		        if (PayPeriodHOLD != "") appLib.setOption(document.getElementById("selPayperiods"), PayPeriodHOLD);
		        appApmClient.setSeriesType('column');
		        document.getElementById("datedl").style.display = 'inline';
		        document.getElementById("trenddl").style.display = 'none';
		    });

		    $('#rdoTrend').click(function () {
		        document.getElementById('btnAdd').disabled = 'disabled';
		        var sb = document.getElementById('selPayperiods');
		        PayPeriodHOLD = sb.options[sb.selectedIndex].value;
		        appLib.setOption(document.getElementById("selPayperiods"), "each");
		        appApmClient.setSeriesType('line');
		        document.getElementById("datedl").style.display = 'none';
		        document.getElementById("trenddl").style.display = 'inline';
		        if ($('#rdoMonth').attr('checked')) {
		            appLib.setOption(document.getElementById("selXaxiss"), "Month");
		        }
		        else if ($('#rdoMonth').attr('checked')) {
		            appLib.setOption(document.getElementById("selXaxiss"), "Payperiod");
		        }
		    });
		    $('#rdoPayperiod').click(function () {
		        appLib.setOption(document.getElementById("selXaxiss"), "Payperiod");
		    });
		    $('#rdoMonth').click(function () {
		        appLib.setOption(document.getElementById("selXaxiss"), "Month");
		    });

		    $('#comboprogress').ajaxStart(function () {
		        //appApmClient.showprogress("comboprogress");

		    });
		    $('#comboprogress').ajaxStop(function () {
		        //appApmClient.hideprogress("comboprogress");
		    });
		</script>
		<script type="text/javascript" src="TOUCHPOINT/js/TouchpointInterface-2.2.js"></script>
		<script type="text/javascript">
		    $(window).resize(function () {
		        if (uiInterface) uiInterface.sizebars();
		    });
		</script>
		<script type="text/javascript">
		    $(function () {
		        $("#tabs").tabs();
		    });
		    var tabsdiv = document.getElementById("tabs");
		    if (tabsdiv) {
		        tabsdiv.style.width = ($(window).width() - 300) + 'px';
		    }
		    var chartdiv = document.getElementById(op.chart.renderTo);
		    if (chartdiv) {
		        chartdiv.style.width = ($(window).width() - 340) + 'px';
		        chartdiv.style.height = ($(window).height() - 200) + 'px';
		    }
		    var pgdiv = document.getElementById('mytable1');
		    if (pgdiv) {
		        pgdiv.style.width = ($(window).width() - 300) + 'px';
		        pgdiv.style.height = ($(window).height() - 200) + 'px';
		    }
		</script>
	</body>
</html>
