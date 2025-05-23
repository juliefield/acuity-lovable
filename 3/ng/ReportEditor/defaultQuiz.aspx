<%@ Page Language="C#" AutoEventWireup="true" CodeFile="defaultQuiz.aspx.cs" ValidateRequest="false" Inherits="_ReportEditorQuiz" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
<head id="Head1" runat="server">
  <title>Report</title>
  <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1"/>

  <!-- AngularJS ng- ng -->
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
  <!-- ES5 Compatibility for IE 11 -->
  <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
  <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/merge/merge.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/htmlmixed/htmlmixed.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/xml/xml.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/javascript/javascript.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/css/css.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/display/autorefresh.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/sql/sql.js"></script>

  <script src="https://gerhobbelt.github.io/google-diff-match-patch/javascript/diff_match_patch.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/merge/merge.js"></script>

  <asp:PlaceHolder runat="server">
    <link href="../../../applib/css/theme.css?<%=CONFMGR.Bump()%>" type="text/css" rel="stylesheet" />
    <link rel="stylesheet" href="../../../lib/jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />

    <!-- these are required for main.js for API / legacy functionality -->
    <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
	<script type="text/javascript" src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
    <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.spin.js"></script>

    <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
    <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>

      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.tabs.js"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
      <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>
      <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>raphael/raphael-2.1.0.js"></script>

    <!-- OLD WAY
    <script type="text/javascript" src="../../../appLib/js/controllers/main.js?<%=CONFMGR.Bump()%>"></script>
    -->

			<script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>

    <!-- NEW WAY -->
    <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>

    <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>

    <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>

         <script type="text/javascript" src="../../../appLib/js/directives/tableeditor.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../appLib/js/directives/dynamicui.js?<%=CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../appLib/js/directives/journalform.js?<%=CONFMGR.Bump()%>"></script>

    <!-- Login -->
    <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet" />
    <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>

      <!-- knockout (for PubSub) Any issues with this? -->
      <script type="text/javascript" src='<%= ResolveUrl("~/lib/knockout/knockout-3.3.0.js") %>'></script>
      <script type="text/javascript" src='<%= ResolveUrl("~/lib/knockout/ko.mapping.js") %>'></script>
      <script type="text/javascript" src='<%= ResolveUrl("~/lib/knockout/ko-postbox.js") %>'></script>

			<!-- Files with separate JulieDev replacements  -->
			<link rel="stylesheet" type="text/css" media="all" href='<%= ResolveUrl("~/applib/css/base.css?r=3") %>' />
			<link rel="stylesheet" type="text/css" media="all" href='<%= ResolveUrl("~/applib/css/fan-2.5.css?r=2") %>' />
			<link rel="stylesheet" type="text/css" media="screen" href='<%= ResolveUrl("~/applib/css/rankpoints-2.1.css") %>' />
			<link rel="stylesheet" type="text/css" media="all" href='<%= ResolveUrl("~/applib/css/rpt.css?r=3") %>' />
			<link rel="stylesheet" type="text/css" media="screen" href='<%= ResolveUrl("~/applib/css/easycom-0.2.css") %>' /> <!-- MADELIVE -->
			<link rel="stylesheet" type="text/css" media="screen" href='<%= ResolveUrl("~/applib/css/grid.css") %>' /> <!-- RESPONSIVE GRID -->
			<link rel="stylesheet" type="text/css" media="screen" href='<%= ResolveUrl("~/applib/css/all.css") %>' /> <!-- FONT AWESOME ICONS -->


  <!-- Pulled from JournalFormTeam  -->
      <!-- see purecss.io for docs -->
      <link rel="stylesheet" href="../../../lib/pure/pure-min.css" />
      <link rel="stylesheet" href="../../../lib/pure/grids-responsive-min.css">
      <!-- JULIE CSS -->
      <link rel="stylesheet" href="../../../App_Themes/AcuityV3/css/app.css?<%=CONFMGR.Bump()%>" />
      <link rel="stylesheet" href="../../../applib/dev/FORMS1/FORMS1-view/forms.css?<%=CONFMGR.Bump()%>" />
      <!-- /JULIE CSS -->
      <link rel="stylesheet" href="../../../applib/css/journal-list.css?<%=CONFMGR.Bump()%>" />


			<!-- Date Range Picker Suite -->
			<link rel="stylesheet" href='<%= ResolveUrl("~/applib/jquery-date-range-picker-0.0.8/daterangepicker.css") %>' />
			<script type="text/javascript" src='<%= ResolveUrl("~/applib/moment/moment.min.js") %>'></script>
			<script type="text/javascript" src='<%= ResolveUrl("~/applib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js") %>'></script>

			<script type="text/javascript" src='<%= ResolveUrl("~/applib/jquery-tablesorter/jquery.tablesorter.js") %>'></script>
			<script type="text/javascript" src='<%= ResolveUrl("~/applib/jquery-tablesorter/jquery.metadata.js") %>'></script>

      <link rel="stylesheet" href="../../../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%=CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../../../applib/dev/REPORT1/REPORT1-view/report.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/REPORT1/REPORT1-vm/report.js?<%=CONFMGR.Bump()%>"></script>

      <link rel="stylesheet" href="../../../applib/dev/REPORTSUPPORT1/REPORTSUPPORT1-view/reportsupport.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/REPORTSUPPORT1/REPORTSUPPORT1-vm/reportsupport.js?<%=CONFMGR.Bump()%>"></script>

      <link rel="stylesheet" href="../../../applib/dev/QA1/QA1-view/qa.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/QA1/QA1-vm/qa.js?<%=CONFMGR.Bump()%>"></script>

<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/annotations.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js"></script>
<script src="https://code.highcharts.com/modules/export-data.js"></script>
<script src="https://code.highcharts.com/modules/accessibility.js"></script>

      <!-- Styled Mode -->
      <link rel="stylesheet" href="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%=CONFMGR.Bump()%>" />
      <script type="text/javascript"
        src="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%=CONFMGR.Bump()%>"
        styled_mode="YES" ></script>
      <script type="text/javascript" src="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appCustomCharts.js?<%=CONFMGR.Bump()%>"></script>
       
        <link rel="stylesheet" type="text/css" media="all" href='<%= ResolveUrl("~/applib/css/cds.css?r=14D") %>' />

      <!-- Fake "Dynamic Dependencies" -->
      <script type="text/javascript" src="../../../appLib/dev/AGAMEFLEX1/vm/chimePerfectAttendance.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="/appLib/dev/MESSAGING1/MESSAGING1-vm/MESSAGING.js?<%=CONFMGR.Bump()%>"></script>

      <link rel="stylesheet" href="/3/ng/AgameFlex/css/chime-pa-styles.css?<%=CONFMGR.Bump()%>" />
      <link rel="stylesheet" href="/applib/dev/MESSAGING1/MESSAGING1-view/messaging.css?<%=CONFMGR.Bump()%>" />
      <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>


  </asp:PlaceHolder>
<style id="CDS_CSSContent" media="screen" runat="server" type="text/css">
.example-class
{
    display: block; /* Comments are helpful */
}
</style>
  <style type="text/css">
     .cds-fiddle
     {
        top: 0px;
     }
  </style>

</head>
<body id="Body1" ng-controller="legacyController" runat="server">
<div id="wholething" 
    style="position: relative;
        height: 90%;
        overflow-y: auto;
        max-width: 1600px;
        margin: 20px auto;
        border: 1px solid #eee;
        padding: 20px;
        width: 90%;">
<ng-legacy-container>
  <div class="form-anchor-report"></div>
  <ng-embedded-login></ng-embedded-login>
  <section class="acuity-app" ng-show="LOGGED_IN()" style="height:100%;">
        <ng-embedded-header iframehide="true" cidreload="true" ></ng-embedded-header>

<!-- TODO: Blow In -->
<div class="cds-fiddle" style="display:none;">&nbsp;</div>
<div class="cds-editors" style="display:none;z-index:999;">
    <div class="cds-css-editor" style="display:none;z-index:999;">
        <h5 style="z-index:999;">CSS <span class="ac-cds-hideshow"></span>  <span class="ac-cds-left">&lt;</span> <span class="ac-cds-date" cid="CDS_HTMLEditor"></span> <span class="ac-cds-right" >&gt;</span></h5>
        <div class="ac-cds" id="CDS_CSSEditor"></div>
    </div>
    <div class="cds-html-editor" style="display:none;">
        <h5>HTML <span class="ac-cds-hideshow"></span> <span class="ac-cds-left">&lt;</span> <span class="ac-cds-date" cid="CDS_HTMLEditor"></span> <span class="ac-cds-right" >&gt;</span></h5>
        <div class="ac-cds" id="CDS_HTMLEditor">
        </div>
    </div>
    <div class="cds-js-editor" style="display:none;">
        <h5>JavaScript <span class="ac-cds-hideshow"></span></h5>
        <div  class="ac-cds" id="CDS_JSEditor"></div>
    </div>
    <input type="button" class="cds-save" value="Save CSS/HTML/JS" />
    &nbsp;&nbsp;&nbsp;<input type="checkbox" class="cds-client-specific" value="On" /> Client-Specific
</div>
<!-- End Blow In -->

<div contenteditable="false" id="CDS_HTMLContent" style="height:100%;" runat="server">
<div thistag="test"></div>
<div style="height:20px;padding:5px;display:block;position:relative;">
  <ng-acuity-report-title override=""></ng-acuity-report-title>
  <ng-acuity-report-search></ng-acuity-report-search>
  <div style="position:absolute;top:5px;right: 40px;">
    <ng-acuity-report-refresh></ng-acuity-report-refresh>
  </div>
</div>
<div style="height: calc(100% - 30px);width:100%;overflow:scroll;">
    <ng-acuity-report text="My Report" details="My Details" hidetopper="false"
        servercacheminutes="0"
        filters="cid={cid}~Project={Project}~Location={Location}~Group={Group}~Team={Team}~CSR={CSR}~StartDate={StartDate}~EndDate={EndDate}~InTraining={InTraining}~Filterbuild={Filterbuild}"
        cid="DashboardGrid" cidclient="all">
    </ng-acuity-report>
</div>

</div>
</div>
  </section>
</ng-legacy-container>

<div ID="CDS_JSContent" runat="server">
<script type="text/javascript">
  (function () {
      window.userFunctions = {
          reportDisplay: function (o) {
            //alert("debug: reportDisplay: " + JSON.stringify(o));
          },
          getHighchartsDefinition: function (o) {
              var chartDefinition = {
                  customLoad: false, /* SET TO TRUE TO BYPASS AUTO-CONNECTION TO CHART DATA */
                  /* If customLoad is false, replace below as desired. */
                  chart: {
                      renderTo: o.renderTo, //Leave this.
                      type: 'column'
                  },
                  title: {
                      text: null
                  },
                  subtitle: {
                      text: null
                  },
                  xAxis: {
                      categories: [],
                      title: {
                          text: null
                      }
                  },
                  yAxis: {
                      title: {
                          text: '',
                          align: 'high'
                      },
                      labels: {
                          formatter: function () {
                              return this.value;
                          },
                          overflow: 'justify'
                      }
                  },

                  tooltip: {
                      useHTML: true,
                      formatter: function () {
                          var me = this;
                          var tt = "";
                          if (o.idx.tooltip >= 0) {
                              $(" tbody tr", $(o.tableSelector)).each(function () {
                                  if ($(" td:nth-child(" + (o.idx.x + 1) + ")", this).html() == me.x) {
                                      if ($(" td:nth-child(" + (o.idx.seriesname + 1) + ")", this).html() == me.series.name) {
                                          tt = me.series.name + '<br>' + $(" td:nth-child(" + (o.idx.tooltip + 1) + ")", this).html();
                                      }
                                  }
                              });
                              if (tt != "") {
                                  return tt;
                              } else {
                                  return '<div style="z-index:1000;">' + this.series.name + '<br/>' + '<b>' + this.y.toFixed(2) + '%' + '</b><br/></div>';
                              }
                          }
                          else {
                              var bld = this.series.name;
                              var finalparams = appChartDefinitions.getFinalParamsFromMyTable(o, this);
                              a$.ajax({
                                  type: "POST",
                                  service: "JScript",
                                  async: false,
                                  data: {
                                      lib: "editor",
                                      cmd: "gettooltip",
                                  },
                                  dataType: "json",
                                  cache: false,
                                  error: a$.ajaxerror,
                                  params: finalparams,
                                  success: loaded
                              });
                              var tooltip;

                              function loaded(json) {
                                  if (a$.jsonerror(json)) { } else {
                                      tooltip = json.tooltip;
                                  }
                              }

                              switch (tooltip.placement) {
                                  case "P":
                                      bld = tooltip.html + bld;
                                      break;
                                  case "A":
                                      bld += tooltip.html;
                                      break;
                                  case "R":
                                      bld = tooltip.html;
                                      break;
                                  default:
                                      break;
                              }
                              return bld;
                          }

                      }
                  },
                  plotOptions: {
                      series: {
                          dataLabels: {
                              enabled: true, //TESTING
                              formatter: function () {
                                  if (o.idx.datalabel >= 0) {
                                      return this.point.formy;
                                  }
                                  else {
                                      var bld = "";
                                      //Get Parameters
                                      var finalparams = appChartDefinitions.getFinalParamsFromMyTable(o, this);
                                      //alert("debug: got my parameters = " + finalparams);
                                      a$.ajax({
                                          type: "GET",
                                          service: "JScript",
                                          async: false,
                                          data: {
                                              lib: "editor",
                                              cmd: "gettooltip",
                                              datalabel: true   //IMPORTANT
                                          },
                                          dataType: "json",
                                          cache: false,
                                          error: a$.ajaxerror,
                                          params: finalparams,
                                          success: loaded
                                      });
                                      var tooltip;
                                      function loaded(json) {
                                          if (a$.jsonerror(json)) { } else {
                                              tooltip = json.tooltip;
                                          }
                                      }
                                      return tooltip.raw;
                                  }
                              }
                          }
                      }
                  },
                  legend: {
                      enabled: true,
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom',
                      x: 0,
                      y: 0,
                      borderWidth: 1,
                      backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
                      shadow: true
                  },
                  credits: {
                      enabled: false
                  },
                  exporting: {
                      enabled: false
                  },
                  series: [{
                      name: 'Indianapolis',
                      data: [107, 31, 635, 203, 2]
                  }]

                  /* End of Chart Definition */

              }
              return (chartDefinition);
          }
      }
  })();
</script>
</div>

</div> <!-- wholething -->

<div style="display:none;">
  <asp:Label style="display:none;" id="lblPanelcid" runat="server"></asp:Label>
  <asp:Label style="display:none;" id="lblViewparams" runat="server"></asp:Label>
  <asp:Label style="display:none;" id="lblCreator" runat="server"></asp:Label>
  <asp:Label style="display:none;" id="lblTitle" runat="server"></asp:Label>
</div>

<script type="text/javascript">
    //BLOW-IN
    if (
        ((window.self != window.top) && ((a$.urlprefix(true).indexOf("mnt") == 0) /* || ($.cookie("TP1Role") == "Admin") */))
        ||
        ((window.self === window.top) && ((a$.gup("fiddle") != "") || (a$.gup("fiddles") != "")) && ((a$.urlprefix(true).indexOf("mnt") == 0) /* || ($.cookie("TP1Role") == "Admin") */ ))
        )
    {
        var projectnumber = "ACUITY";
        var cid = $("#lblPanelcid").html();
        if ((cid == null) || (cid == "")) {
            cid = a$.gup("panelcid");
        }
        if (cid == "") {
            //alert("CID not found");
        }

        //var viewparams = $("#lblPanelcid").html(); //Not used here

        //alert("debug: panelcid=" + cid);

        $(".cds-edit-save").unbind().bind("click", function () {
            removeeditbuttons();
            var data = {
                lib: "qa",
                cmd: "saveCDS",
                bodyid: cid,
                tagid: "CDS_HTMLContent",
                content: $("#CDS_HTMLContent").html()
            };
            a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: data,
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: htmleditsaved
            });
            function htmleditsaved(json) {
                if (a$.jsonerror(json)) {
                    alert("ERROR:" + json.msg);
                }
                else {
                    alert("success");

                }
            }
            window.location.href = window.location.href.replace("&editmode=true", "");
            $(".cds-edit-save").hide();
            $(".cds-edit").show();
            return false;
        });

        $(".cds-edit").unbind().bind("click", function () {
            window.location.href = window.location.href + "&editmode=true";
            return false;
        });

        $(".cds-editors").hide();
        var cssEditor = CodeMirror(document.getElementById("CDS_CSSEditor"), {
            lineNumbers: true,
            mode: "css",
            autoRefresh: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            value: document.getElementById("CDS_CSSContent").innerHTML
        });
        $(".cds-css-editor").show();

        var htmlEditor = CodeMirror(document.getElementById("CDS_HTMLEditor"), {
            lineNumbers: true,
            mode: "text/html",
            autoRefresh: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            value: document.getElementById("CDS_HTMLContent").innerHTML
        });
        $(".cds-html-editor").show();


        function leftright(me, mylist, myidx) {
            function arrows() {
                $(".ac-cds-date", me).html(mylist[myidx]);
                if (myidx <= 0) {
                    $(".ac-cds-right", me).css("color", "#F0F0F0");
                }
                else {
                    $(".ac-cds-right", me).css("color", "black");
                }
                if (myidx >= (mylist.length - 1)) {
                    $(".ac-cds-left", me).css("color", "#F0F0F0");
                }
                else {
                    $(".ac-cds-left", me).css("color", "black");
                }
            }
            $(".ac-cds-left", me).unbind().bind("click", function () {
                myidx += 1;
                if (myidx >= mylist.length) myidx = mylist.length - 1;
                arrows();
            });
            $(".ac-cds-right", me).unbind().bind("click", function () {
                myidx -= 1;
                if (myidx < 0) myidx = 0;
                arrows();
            });
            $(".ac-cds-right", me).trigger("click");
        }

        var htmlList = [
                "2020-06-08 15:59:07.000 (Current)",
                "2020-06-08 15:53:43.000",
                "2020-06-08 15:23:45.000",
                "2020-06-08 15:23:05.000"
            ];
        var htmlIdx = 1;
        leftright($(".cds-html-editor").eq(0), htmlList, htmlIdx);

        var cssList = [
                "last",
                "Next",
                "2020-06-08 15:23:45.000",
                "First"
            ];
        var cssIdx = 1;
        leftright($(".cds-css-editor").eq(0), cssList, cssIdx);

        var jsEditor = CodeMirror(document.getElementById("CDS_JSEditor"), {
            lineNumbers: true,
            mode: "javascript",
            autoRefresh: true,
            extraKeys: { "Ctrl-Space": "autocomplete" },
            value: document.getElementById("CDS_JSContent").innerHTML
        });
        $(".cds-js-editor").show();

        $(".ac-cds-hideshow").unbind().bind("click", function () {
            if ($(this).html() == "show") {
                $(".ac-cds", $(this).parent().parent()).show();
                $(this).html("hide");
            }
            else {
                $(".ac-cds", $(this).parent().parent()).hide();
                $(this).html("show");
            }
        });
        $(".ac-cds-hideshow").html("hide").each(function () { $(this).trigger("click"); });

        $(".cds-fiddle").show().unbind().bind("click", function () {
            var attr = $("#CDS_HTMLContent").attr("clientspecific");
            if (typeof attr !== 'undefined' && attr !== false) {
                $(".cds-client-specific").prop("checked",true).attr("disabled", "disabled");
            }
            if ($(".cds-editors").eq(0).css("display") == "none") {
                $(".cds-editors").show();
            }
            else {
                $(".cds-editors").hide();
            }
        });
        $(".cds-save").unbind().bind("click", function () {
            var csadd = "";
            var cspr = "";
            if ($(".cds-client-specific").is(":checked")) {
                //alert("debug: client specific add");
                csadd = "-" + a$.urlprefix();
                cspr = "*";
            }

            var data = {
                lib: "qa",
                cmd: "saveCDS",
                projectnumber: cspr + projectnumber + csadd,
                bodyid: cid,
                tagid: "CDS_HTMLContent",
                content: htmlEditor.getValue()
            };
            a$.ajax({
                type: "POST",
                service: "JScript",
                async: true,
                data: data,
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: htmlsaved
            });
            function htmlsaved(json) {
                if (a$.jsonerror(json)) {
                    alert("ERROR:" + json.msg);
                }
                else {
                    var data = {
                        lib: "qa",
                        cmd: "saveCDS",
                        projectnumber: cspr + projectnumber + csadd,
                        bodyid: cid,
                        tagid: "CDS_CSSContent",
                        content: cssEditor.getValue()
                    };
                    a$.ajax({
                        type: "POST",
                        service: "JScript",
                        async: true,
                        data: data,
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: csssaved
                    });
                    function csssaved(json) {
                        if (a$.jsonerror(json)) {
                            alert("ERROR:" + json.msg);
                        }
                        else {
                            var data = {
                                lib: "qa",
                                cmd: "saveCDS",
                                projectnumber: cspr + projectnumber + csadd,
                                bodyid: cid,
                                tagid: "CDS_JSContent",
                                content: jsEditor.getValue()
                            };
                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: true,
                                data: data,
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: jssaved
                            });
                            function jssaved(json) {
                                if (a$.jsonerror(json)) {
                                    alert("ERROR:" + json.msg);
                                }
                                else {
                                    location.reload();
                                }
                            }
                        }
                    }
                }
            }
            //*********************************** End Content Management Section ************************
            return false;
        });
    }
    //END BLOW-IN
</script>

<script type="text/javascript">

    $(document).ready(function () {
        //Does this mess things up?
        /*
        function resizebody() {
        var rect = window.document.getElementById("wholething").getBoundingClientRect();
        $("#wholething").css("height", (rect.bottom) + "px");
        //alert("rect.top=" + rect.top + ", rect.bottom=" + rect.bottom);
        }
        $(window).resize(function () {
        resizebody();
        });
        */
        /*
        var position = {
        top: rect.top + window.pageYOffset,
        left: rect.left + window.pageXOffset
        };
        $("body").height(($(window).height() - 70) + 'px'); //was 96
        */
    });



</script>

<form id="form1" runat="server"></form>
</body>
</html>