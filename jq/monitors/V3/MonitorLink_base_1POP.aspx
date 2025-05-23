<%@ Page Language="C#" AutoEventWireup="true" CodeFile="MonitorLink_base_1POP.aspx.cs" ValidateRequest="false" Inherits="_MonitorLink_base_1POP" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">
  <head id="Head1" runat="server">
    <title>Monitor</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <meta HTTP-EQUIV="PRAGMA" CONTENT="NO-CACHE">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/htmlmixed/htmlmixed.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/xml/xml.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/javascript/javascript.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/css/css.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/display/autorefresh.js"></script>

    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/jquery-1.7.2.min.js") %>'></script>
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery-ui/js/jquery-ui-1.8.16.custom.min.js") %>'></script>

    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/lib/pure/grids-responsive-min.css") %>" media="screen" />
    <!-- JULIE CSS -->
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/css/app.css?r=6") %>" media="screen" />
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/print.css") %>" media="print" />

    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/print.css") %>" media="print" />

    <link rel="stylesheet" href="<%# ResolveUrl("~/applib/css/cds.css") %>" />

         <!-- knockout (for PubSub) Any issues with this? -->
		 <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
		 <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
		 <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>

         <script type="text/javascript" src="../../../lib/moment/moment.min.js"></script>
         <link rel="stylesheet" href="../../../lib/jquery-date-range-picker-0.0.8/daterangepicker.css" />
         <script type="text/javascript" src="../../../lib/jquery-date-range-picker-0.0.8/jquery.daterangepicker.js"></script>
		     <link rel="stylesheet" href="../../../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.css" />
	       <script type="text/javascript" src="../../../lib/jquery-timepicker-1.3.5/jquery.timepicker.min.js"></script>
         <script type="text/javascript" src="../../../lib/jquery-tablesorter/jquery.tablesorter.js"></script>
         <script type="text/javascript" src="../../../lib/jquery-tablesorter/jquery.metadata.js"></script>


         <!-- Files with separate JulieDev replacements  -->
         <link rel="stylesheet" type="text/css" media="screen" href="../../../applib/css/base.css?<%#CONFMGR.Bump()%>" />
         <link rel="stylesheet" type="text/css" media="screen" href="../../../applib/css/rpt.css?<%#CONFMGR.Bump()%>" />
         <!-- AngularJS ng- ng -->
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
  		<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
         <!-- ES5 Compatibility for IE 11 -->
         <script src="/lib/bluebird/3.3.4/bluebird.min.js"></script>
         <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%#CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../appLib/js/controllers/legacyController.js?<%#CONFMGR.Bump()%>"></script>
         <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%#CONFMGR.Bump()%>"></script>
      <!-- NEW -->
      <link rel="stylesheet" href="../../../applib/dev/POSTNOTE1/POSTNOTE1-view/postnote.css?<%#CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/POSTNOTE1/POSTNOTE1-vm/postnote.js?<%#CONFMGR.Bump()%>"></script>
      <link rel="stylesheet" href="../../../applib/dev/REPORT1/REPORT1-view/report.css?<%#CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/REPORT1/REPORT1-vm/report.js?<%#CONFMGR.Bump()%>"></script>

      <link rel="stylesheet" href="../../../applib/dev/GOALTASK1/goalTaskStyles.css?<%#CONFMGR.Bump()%>" />
      <script type="text/javascript" src="../../../appLib/dev/GOALTASK1/vm/userGoalManager.js?<%#DateTime.Now.Day.ToString() + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Hour.ToString() +  DateTime.Now.Minute.ToString() +  DateTime.Now.Second.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>            
      <script type="text/javascript" src="../../../appLib/dev/GOALTASK1/vm/userTaskManager.js?<%#DateTime.Now.Day.ToString() + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Hour.ToString() +  DateTime.Now.Minute.ToString() +  DateTime.Now.Second.ToString() + DateTime.Now.Millisecond.ToString()%>"></script>            


      <script type="text/javascript" src="../../../lib/highcharts-6.2.0/code/highcharts.js"></script>
      <script type="text/javascript" src="../../../lib/highcharts-6.2.0/js/modules/exporting.js?<%#CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../lib/highcharts-6.2.0/js/modules/export-data.js?<%#CONFMGR.Bump()%>"></script>

      <!-- Styled Mode -->
	  <link rel="stylesheet" href="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/highcharts.css?<%#CONFMGR.Bump()%>" />
	  <script type="text/javascript"
		src="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appChartDefinitions.js?<%#CONFMGR.Bump()%>"
		styled_mode="YES" >
      </script>
	  <script type="text/javascript" src="../../../appLib/dev/CHARTSANDBOX1/CHARTSANDBOX1-vm/appCustomCharts.js?<%#CONFMGR.Bump()%>"></script>

    <style id="CDS_CSSContent" media="all" runat="server" type="text/css">
        /* Styles Here */
    </style>

  </head>
  <body id="Body1" runat="server" class="ui-review-body">
    <form id="Form1" method="post" runat="server">

<div class="ui-setup-form" style="display:none;">
    <div class="ui-setup-form-new" style="display:none;">
        Form has not been set up from markup.
    </div>
    <div class="ui-setup-orphan-qsts" style="display:none;">
        Questions have been added to the form.  When ready, please update the data set.
        <div class="ui-orphan-qst-list"></div>
    </div>
    <div class="ui-setup-duplicate-stags" style="display:none;">
        There exist duplicate section tags, please modify the following section tags so that there are no duplicates.
        <div class="ui-duplicate-stag-list"></div>
    </div>
    <div class="ui-setup-duplicate-qsts" style="display:none;">
        There exist duplicate question IDs, please modify the following question names so that there are no duplicates.
        <div class="ui-duplicate-qst-list"></div>
    </div>
    <input type="submit" class="ac-setup-form" style="z-index:999;" value="Set Up Form" />
    <div class="ui-setup-form-new" style="display:none;">
        <br />To add questions and fields, use the controls below.
    </div>
</div>
<button class="cds-edit" style="display:none; /*disabled for now*/">Edit</button>
<button class="cds-edit-save" style="display:none;">Save</button>
<div class="cds-fiddle" style="display:none;">&nbsp;</div>
<div class="cds-editors" style="display:none;">
    <div class="cds-css-editor" style="display:none;">
        <h5>CSS <span class="ac-cds-hideshow"></span>  <span class="ac-cds-left">&lt;</span> <span class="ac-cds-date" cid="CDS_HTMLEditor"></span> <span class="ac-cds-right" >&gt;</span></h5>
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
</div>

<div ng-legacy-container class="content" style="width:100%;height:100%; position:relative;">
<ng-acuity-report-editor></ng-acuity-report-editor>

<div contenteditable="false" id="CDS_HTMLContent" runat="server">
<div class="ui-view ac-view" style="display:none;">

    <input type="text" class="qst" qst="TestValue" value="test field" />
    <br /><textarea class="qst qst-comment" qst="TestCommentBox">Text Comment Box</textarea>
        
</div>
</div>
</div>
      <div style="display:none;">
        <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label>
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblAcknowledgementRequired" runat="server"></asp:Label>
        <asp:Label ID="lblSqfcode" runat="server"></asp:Label>
        <asp:Label ID="lblSqfname" runat="server"></asp:Label>
        <asp:Label ID="lblKPI" runat="server"></asp:Label>
        <asp:Label ID="lblQAId" runat="server"></asp:Label>
        <asp:Label ID="lblFormId" runat="server"></asp:Label>
        <asp:Label ID="lblClient" runat="server"></asp:Label>
        <asp:Label ID="lblMasterId" runat="server"></asp:Label>
        <asp:Label ID="lblBodyId" runat="server"></asp:Label>
        <asp:Label ID="lblCallid" runat="server"></asp:Label>
        <asp:Label ID="lblCalldate" runat="server"></asp:Label>
        <asp:Label ID="lblSupervisorName" runat="server"></asp:Label>
        <asp:Label ID="lblAgentGroupName" runat="server"></asp:Label>
        <asp:Label ID="lblAgentName" runat="server"></asp:Label>
        <asp:Label ID="lblAgent" runat="server"></asp:Label>
        <asp:Label ID="lblAcknowledgementDate" runat="server"></asp:Label>
        <asp:Label ID="lblCurrentDate" runat="server"></asp:Label>
        <asp:Label ID="lblQA" runat="server"></asp:Label>
        <asp:Label ID="lblAgentTeamLeaderName" runat="server"></asp:Label>
        <asp:Label ID="lblAgentTeamLeader" runat="server"></asp:Label>
        <asp:Label ID="lblAgentGroupLeaderName" runat="server"></asp:Label>
        <asp:Label ID="lblAgentGroupLeader" runat="server"></asp:Label>
        <asp:Label ID="lblAgentManager" runat="server"></asp:Label>
        <asp:Label ID="lblAgentGroup" runat="server"></asp:Label>
        <asp:Label ID="lblAgentLocationName" runat="server"></asp:Label>
        <asp:Label ID="lblAgentHireDate" runat="server"></asp:Label>
        <asp:Label ID="lblManagers" runat="server"></asp:Label>
        <asp:Label ID="lblLetterTypes" runat="server"></asp:Label>
        <asp:Label ID="lblClientDept" runat="server"></asp:Label>
        <asp:Label ID="lblAuthorized_QA" runat="server"></asp:Label>

        <asp:Label ID="lblAgentExtension" runat="server"></asp:Label>
        <asp:Label ID="lblAgentClient" runat="server"></asp:Label>
        <asp:Label ID="lblPrevScore" runat="server"></asp:Label>
        <asp:Label ID="lbl90Score" runat="server"></asp:Label>

        <input ID="lblNextMonday" runat="server" />

        <input ID="inputReleaseDate" runat="server" />

        </div>
    </form>
    <div ID="CDS_JSContent" runat="server">
<script type="text/javascript">
  (function () {
    window.userFunctions = {
      client_setscore: function () {
        var score = 0;
        var autofail = false;
        var scoreerror = false;

        $(".ui-section-questions select").each(function () {
          if ($(this).hasClass("qst")) {
            if (($(this).val() == "Yes")||($(this).val() == "N/A")) {
              var s = $(this).attr("score");
              if (s != null) {
                score += parseInt(s,10);
              }
            }
          }
        });

        if (score < 0) score = 0;

        if (autofail) {
          $(".ac-autofail").parent().addClass("sel-autofail");
          $(".ac-autofail").show();
        }
        else {
          $(".ac-autofail").parent().removeClass("sel-autofail");
          $(".ac-autofail").hide();
        }

        if (scoreerror) {
          $(".ac-score").html("Incomplete");
        }
        else {
          $(".ac-score").html(score);
        }

        //CUSTOM: Put in your form validations.

        $(".ac-required").each(function () {
          if ($(this).val().trim() == "") {
            scoreerror = true;
          }
        });


        if (scoreerror) {
          $(".ac-submit").attr("disabled", "disabled");
        }
        else {
          $(".ac-submit").removeAttr("disabled");
        }
      }
    };
  })();
</script>
    </div>
    <script type="text/javascript" src="./MonitorLink_base_1POP.js?r=17" language="javascript"></script>
  </body>
</html>
