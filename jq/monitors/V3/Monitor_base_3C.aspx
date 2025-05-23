<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_base_3C.aspx.cs" ValidateRequest="false" Inherits="_Monitor_base_3C" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head1" runat="server">
    <title>Monitor</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/htmlmixed/htmlmixed.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/xml/xml.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/javascript/javascript.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/css/css.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/addon/display/autorefresh.js"></script>

    <!--
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    -->

      <link rel="stylesheet" href="../../../lib/jquery/ui/development-bundle/themes/base/jquery.ui.all.css" />
      <link rel="stylesheet" type="text/css" media="screen" href="../../../lib/jquery/jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css" />

      <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
      <!--<script type="text/javascript" src="../applib/BootstrapModalPopover/lib/jquery-1.11.3.min.js"></script> -->
      <script type="text/javascript" src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>


    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/lib/pure/grids-responsive-min.css") %>" />
    <!-- JULIE CSS -->
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/css/app.css?r=6") %>" />
    <link rel="stylesheet" href="<%# ResolveUrl("~/applib/css/monitor-custom-styling.css?r=6") %>" />
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>


    <style id="CDS_CSSContent" media="all" runat="server" type="text/css">
      html input[disabled]:hover {
        background: lightgray;
      }
      html input[type="button"] {
        background-color: white;
      }
      input[type="submit" i]:disabled {
        color: GrayText !important;
        cursor: default;
        background-color: ButtonFace !important;
      }

      textarea.ac-comments {
        display: block;
        width: 95% !important;
        min-height:  40px;
        font-size: 11px;
        resize: none;
        overflow: visible;
        padding: 0 !important;
        max-height: 100%;
        margin: 10px;
        border: 0;
      }
      textarea.ac-comments:focus {
        outline: none;
      }
      
      .ui-review-title {
        color: white;
        background-color: #0078AA;
        padding: 10px 10px 10px 10px;
        font-weight: bold;
        font-size: 14px;
        display: block;
        position: relative;
      }
      .ui-review-title a {
        color: white; margin-right: 20px;
        font-weight: normal;
      }
      .ui-review-title span {
        margin-right: 20px;
      }
      .ui-title-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 10px 0;
      }
      .ui-title-container button {
        float: right;
        margin-top: -5px;
      }
      .ui-review-body {
        height: calc(100% - 25px);
        padding-bottom: 50px;
        overflow-y:scroll;
        background-color:#C8D3DB;
      }

      .ui-draft-banner {
        padding:10px;
        margin-bottom:20px;
        display:block;
        background-color:Yellow;
        color:Red;
        text-align:center;
      }
      
      .ui-section-header
      {
        position:fixed;
        top:60px;
        right:30px;
        width: 300px;
        padding: 5px;
        background-color: lightgray;
        
      }      

      .ui-section-header > dt
      {
          display:inline-block;
          width: 100px;
          margin-top:10px;
      }

      .ui-section-header > dd
      {
          display:inline-block;
          /* margin-inline-start: unset; */
          width: 150px;
          margin-top:10px;
          
      }
      .ui-section-header > dd select
      {
          width: 150px;
      }
      
      .ui-section-acknowledgement
      {
          position:relative;
      }
      
      .ui-section-questions
      {
          position:relative;
      }

      .ui-section-questions
      {
          width: calc(100% - 320px);
      }

      .ui-section-questions > dt
      {
          margin-left: 10px;
          display:block;
          
          font-weight: bold;                      
      }
      .ui-section-questions > dd > dl > dt
      {
          display: inline-block;
          width: calc(100% - 160px);
          border-top: 1px solid black;
          min-height: 20px;
          padding: 5px 5px 10px 5px;
      }

      .ui-section-questions > dd > dl > dd
      {
          display:inline-block;
          text-align: right;
          margin-inline-start: unset;
          border-top: 1px solid black;
          width: 130px;
          height: auto;
          vertical-align:top;
          padding: 5px 0 5px 0;
          /*background-color:Yellow;*/          
      }
      
      
      dt:nth-of-type(even)
      {
          background-color: lightgray;
      }
      dd:nth-of-type(even)
      {
          background-color: lightgray;
      }
      
      select:disabled 
      {
          background-color: #e0e0e0;
      }

      .ui-view {
        max-width: 1400px;
        margin: 10px auto;
      }


      .ui-bfa-highlight-hover
      {
          margin: 0 2px 0 2px;
          background: white !important;
          color: black !important;
      }

      .ui-bfa-highlight
      {
          margin: 0 2px 0 2px;
          background: green !important;
          color: white !important;
      }



    .highlight-hover {
        background: white;
        color: black;
        border: none;
        margin-left: 12px;
        margin-right: 2px;
    }

    .highlight {
        background: green;
        color: white;
    }    
    </style>

    <style>
      .ui-setup-form 
      {
        position:fixed;
        top: 0px;
        left: calc(50% - 300px);
        width: 600px;
        opacity: 0.5;
        z-index: 999;
        padding:10px;
        margin-bottom:20px;
        display:block;
        background-color:Yellow;
        color:Red;
        text-align:center;
      }
      .ui-orphan-qst-list 
      {
          margin: 10px;
          padding: 10px;
          font-weight:bold;
          background-color: White;
          color: Black;
      }
      
      .ac-cds-hideshow 
      {
          color: Blue;
          font-weight: normal;
          text-decoration: underline;
          cursor: pointer;
          margin-right: 20px;
      }
      
      .ac-cds-left,.ac-cds-right
      {
          font-weight:bold;
          font-size:16px;
          cursor:pointer;
      }

     .ac-cds-date
     {
         width:190px;
         text-align:center;
     }
      
    .cds-editors {
        z-index: 1000000;
        position: absolute;
     }

      .cds-editors span 
      {
          display: inline-block;
      }
      
      .ui-state-header
      {
          display:none;
          background-color: orange;
          text-align:left;
          color:black;
          padding:5px;
          font-weight:bold;
      }
      .ui-state-legend
      {
          display:none;
          background-color: orange;
          text-align:left;
          color:black;
          padding:5px;
          margin-top:5px;
          font-weight:normal;
          font-size: 12px;
      }
          
    </style>

  </head>
  <body id="Body1" runat="server" class="ui-review-body">
    <form id="Form1" method="post" runat="server">
      <div class="ui-review-title">
        <div class="ui-title-container">
          <button onclick="printFunction()">Print this page</button>
          <a class="ac-close" href="">&#8592; Back</a> <span>|</span> <label class="display-lblSqfname"></label>
        </div>
        <div class="ui-state-header"></div>
        <div class="ui-state-legend"></div>
      </div>

<div class="ui-setup-form" style="display:none;">
    <div class="ui-setup-form-new" style="display:none;">
        Form has not been set up from markup.
    </div>
    <div class="ui-setup-orphan-qsts" style="display:none;">
        Questions have been added to the form.  When ready, please update the data set.
        <div class="ui-orphan-qst-list"></div>
    </div>
    <input type="submit" class="ac-setup-form" value="Set Up Form" />
    <div class="ui-setup-form-new" style="display:none;">
        <br />To add questions and fields, use the controls below.
    </div>
</div>

<div class="cds-fiddle" style="display:none;position:absolute;cursor:pointer;z-index:999;top:60px;right:20px;background-image: url(images/violin-svgrepo-com.svg); height:20px;width:20px;">&nbsp;</div>
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
        <div contenteditable="false" id="CDS_HTMLContent" runat="server">
  <div class="ui-view ac-view" style="display:none;">

    <div class="ui-draft-banner ac-draft">Draft Mode</div>

    <!-- Header -->

      <div style="position:relative;">        

        <!-- Acknowledgement -->
        <div class="ui-section-acknowledgement">
            <div class="ac-show-acknowledgementrequired" style="display:none;border: 2px solid red;padding:8px;width:500px;">
                <span class="ac-show-isagent" style="font-weight:bold;display:none;">
                    <br>Click the button below to acknowledge that you have seen this monitor.<br>
                    <br>
                    <input type="submit" class="ac-acknowledge" value="Acknowledge Monitor">
                </span>
                <span class="ac-show-isnotagent" style="color:Red;display:none;">The agent must log in to acknowledge this monitor.</span>
            </div>
        </div>

        <div class="ac-show-acknowledgementreceived" style="display:none;">
            This monitor was acknowledged by the Agent:
            <span class="display-lblAcknowledgementDate"></span>
        </div>

        <!------- Header ----->
        <dl class="ui-section-header">
            <dt>Monitor ID:</dt><dd class="display-lblMonitorId"></dd>
            <dt>Agent Name:</dt>
            <dd>
                <span class="display-lblAgentName"></span> (<span class="display-lblAgent"></span>)
            </dd>
            <dt>Hire Date:</dt><dd class="display-lblAgentHireDate"></dd>
            <dt>Location:</dt><dd class="display-lblAgentLocationName"></dd>
            <dt>Group Leader</dt>
            <dd>
                <select class="combo-groupleader qst" qst="GroupLeader" disabled="disabled">
                  <option value=""></option>
                </select>
            </dd>
            <dt>Team Leader</dt>
            <dd>
                <select class="combo-teamleader qst" qst="TeamLeader" disabled="disabled">
                  <option value=""></option>
                </select>
            </dd>
            <dt>Call ID:</dt><dd class="display-lblCallid"></dd>
            <dt>Call Date:</dt><dd class="display-lblCalldate"></dd>
            <dt>Auditor:</dt><dd class="display-lblSupervisorName"></dd>
            <dt>Score</dt><dd class="ac-score" style="font-weight: bold;">0</dd>
            <dt></dt><dd><span class="ac-autofail">AUTO FAIL</span></dd>
        </dl>

        <!------- Questions --------->
        <dl class="ui-section-questions">
            <dt>Test Header</dt>
            <dd>
                <dl>
                    <dt>Test Question</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="TestQuestion" score="35"><option selected="selected" value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select>
                    </dd>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions" style="display:none;">
            <dt>Strengths &amp; Opportunities</dt>
            <dd>
                <textarea class="qst ac-comments" qst="Comments" data-resizable="true" type="text"></textarea>
            </dd>
        </dl>
    </div>

      <div class="attachments" style="display:none;margin-right:30px;margin-bottom:10px;">
        <div style="display:block;text-align: right;line-height:30px;">
            <span class="attachments-list"></span>
            <input id="fileUpload" name="fileUpload" type="file" accept=".doc,.docx,.xls,.xlsx,.pdf" style="display:none;">
            <input type="button" value="Attach File..." onclick="document.getElementById('fileUpload').click();return false;" style="margin-left: 30px;">
        </div>
      </div>

          <div class="ui-draft-banner ac-draft">This Monitor is a Draft, not visible to non-QA's</div>
          <div>            <br>
                  <input type="submit" class="ac-submit ac-draft" style="display:none;" disabled="disabled" value="Save as Draft">
                  <input type="submit" class="ac-submit ac-save" disabled="disabled" value="Save Monitor">
                  <input type="submit" class="ac-delete" value="Delete">
                  <input type="submit" class="ac-close" value="Close">
                  <input type="checkbox" style="display:none;" class="ac-islive qst" qst="IsLive">
          </div>
</div>
        </div>

      <div style="display:none;">
        <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblActingSupervisor" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label>
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
        <asp:Label ID="lblMonitordate" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorComplete" runat="server"></asp:Label>
        <asp:Label ID="lblAcknowledgementRequired" runat="server"></asp:Label>
        <asp:Label ID="lblSqfcode" runat="server"></asp:Label>
        <asp:Label ID="lblSqfname" runat="server"></asp:Label>
        <asp:Label ID="lblKPI" runat="server"></asp:Label>
        <asp:Label ID="lblFormId" runat="server"></asp:Label>
        <asp:Label ID="lblClient" runat="server"></asp:Label>
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
        <asp:Label ID="lblDocAuditors" runat="server"></asp:Label>
        <asp:Label ID="lblLetterTypes" runat="server"></asp:Label>
        <asp:Label ID="lblClientDept" runat="server"></asp:Label>
        <asp:Label ID="lblAuthorized_QA" runat="server"></asp:Label>

        <asp:Label ID="lblAgentCenter" runat="server"></asp:Label>
        <asp:Label ID="lblAgentEMP_ID" runat="server"></asp:Label>
        <asp:Label ID="lblAgentLOB" runat="server"></asp:Label>
        <asp:Label ID="lblAgentExtension" runat="server"></asp:Label>
        <asp:Label ID="lblAgentClient" runat="server"></asp:Label>
        <asp:Label ID="lblPrevScore" runat="server"></asp:Label>
        <asp:Label ID="lbl90Score" runat="server"></asp:Label>

        <asp:Label ID="lblComplianceAllowed" runat="server"></asp:Label>
        <asp:Label ID="lblDisputeReviewer" runat="server"></asp:Label>
        <asp:Label ID="lblHumanResources" runat="server"></asp:Label>

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

    <script type="text/javascript" src="./Monitor_base_3.js?r=16" language="javascript"></script>
  </body>
</html>
