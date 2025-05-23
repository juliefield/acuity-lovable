<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_PR_CAR.aspx.cs" ValidateRequest="false" Inherits="_Monitor_PR_CAR" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <title>Monitor</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.css" />
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/codemirror.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/htmlmixed/htmlmixed.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/xml/xml.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/javascript/javascript.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.41.0/mode/css/css.js"></script>

    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/lib/pure/grids-responsive-min.css") %>" media="screen" />
    <!-- JULIE CSS -->
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/css/app.css?r=6") %>" media="screen" />
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/print.css") %>" media="print" />

    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/print.css") %>" media="print" />

    <script>
      function resizeTextarea (id) {
        var a = document.getElementById(id);
        a.style.height = 'auto';
        a.style.height = a.scrollHeight+'px';
      }

        function init() {
        var a = document.getElementsByTagName('textarea');
        for(var i=0,inb=a.length;i<inb;i++) {
           if(a[i].getAttribute('data-resizable')=='true')
            resizeTextarea(a[i].id);
        }
      }
      function myFunction() {
        window.print();
      }
    </script>


    <style id="MonitorCSSContent" media="screen" runat="server">
        
      .dispute-finding,.dispute-finding-select
      {
          display:none;
      }
      .add-link,.delete-link 
      {
          cursor:pointer;
          text-decoration:underline;
          color: blue;
      }
      .finding td
      {
          vertical-align: top;
          padding-bottom: 8px;
          border-bottom: 1px solid black;
      }
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
      .page-wrapper {
        width: 910px;
        margin: 0px auto 0 auto;
        position: relative;
        border: 1px solid gray;
      }
      .mon-wrapper {
        position:relative;
      }
      .mon-stats {
        position:absolute;
        top: 70px;
        right: 30px;
        background-color: Green;
        width: 250px;
        z-index: 50;
      }
      .mon-stats ul {
        list-style: none;
        padding: 10px;
        margin: 0;
      }
      .mon-stats ul li {
        color: White;
        font-size: 12px;
      }
      .mon-stats li label {
        font-weight: bold;
        width: 60px;
      }
      .mon-stats li span {
        padding-left: 15px;
        float:right;
      }
      .mon-content {
        position:relative;
        padding: 10px;
        margin-top: 10px;
        width: 100%;
        overflow-y:scroll;
      }
      .mon-content li {
        padding: 5px;
      }
      .mon-answer {
        float:right;
        min-width: 200px;
        /* padding-right: 300px; */
      }
      .multiplier {
        padding-left: 20px;
      }
      .disposition{
        text-align: left !important;
        padding-left: 70px;
      }
      .mp-lt,
      .mp-gt {
        cursor: pointer;
        padding-left: 5px;
        padding-right: 5px;
        font-weight: bold;
      }
      .mp-val {
        color: green;
        font-weight: bold;
      }
      .mon-subtotal {
        width: 40px;
        float:right;
        text-align: right;
        color: Blue;
        font-weight: bold;
        font-size: 20px;
        vertical-align:middle;
      }
      .mon-submit {
        clear:both;
      }
      .mon-comments {
        clear: both;
      }
      .mon-comments label {
        vertical-align:middle;
      }
      .mon-comments textarea {
        margin-left: 10px;
        vertical-align:middle;
      }
      textarea {
        overflow: visible;
      }
      .mon-fields {
        margin-left: 5px;
      }
      .mon-field {
        clear both;
        min-height: 30px;
      }
      .mon-field label {
        color:White;
        float: left;
      }
      .mon-field-input,
      .mon-field select {
        width: 120px;
        padding-right: 5px;
        float: right;
      }
      .sel_time {
        width: 30px;
      }
      .mon-address textarea {
        margin-left: 0px;
      }
      .mon-section {
        font-weight: bold;
      }
      .mon-desc {
        margin-top: 8px;
        margin-left: 25px;
        font-size: 12px;
        width: 60%;
      }
      .highlight-hover {
        background: white;
        color: black;
        border: none;
        margin-left: 12px;
        margin-right: 2px;
      }
      .monitor-table {
        margin-top: 20px;
        border: 1px solid #eee;
        border-spacing: 0;
        border-collapse: collapse;
      }
      .monitor-table td {
        font-size: 11px;
        text-align: center;
        border: 1px solid black;
      }
      .monitor-table th {
        text-align: center;
        border: 1px solid black;
        color: white;
        background: black;
      }
      .highlight-hover {
        background: white !important;
        color: black  !important;
        margin-left: 12px;
        margin-right: 2px;
      }
      .highlight {
        background: green !important;
        color: white !important;
      }
      textarea.qst-comments {
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
      textarea.qst-comments:focus {
        outline: none;
      }
      .parameters-col {
        width: 5%;
      }
      .checklist-col {
        width: 25%;
      }
      .points-col {
        width: 5%;
      }
      .disposition-col {
        width: 5%;
        text-align: center;
        padding: 0;
      }
      .comments-col {
        width: 55%;
      }
      .monitor-review-body {
        height: calc(100% - 25px);
        padding-bottom: 50px;
        overflow-y:scroll;
        background-color:#C8D3DB;
      }
      .monitor-review-title {
        color: white;
        background-color: #0078AA;
        padding: 10px 10px 10px 10px;
        font-weight: bold;
        font-size: 14px;
        display: block;
        position: relative;
      }
      .monitor-review-title a {
        color: white; margin-right: 20px;
        font-weight: normal;
      }
      .monitor-review-title span {
        margin-right: 20px;
      }
      .monitor-view {
        max-width: 1400px;
        margin: 10px auto;
      }
      .monitor-title-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 10px 0;
      }
      .monitor-title-container button {
        float: right;
        margin-top: -5px;
      }
      
      select:disabled 
      {
          background-color: #e0e0e0;
      }

    </style>

  </head>
  <body runat="server" class="monitor-review-body">
    <form id="Form1" method="post" runat="server">
      <div class="monitor-review-title" style="position:relative;">
        <div class="monitor-state" style="position:absolute;top: 20px;right:50%;">State</div>
        <div class="monitor-title-container">
          <button onclick="myFunction()">Print this page</button>
          <a class="mon-close" href="">&#8592; Back</a> <span>|</span> <label id="show_lblSqfname"></label>
        </div>
      </div>
<div id="MonitorHTMLEditor"></div>
<div contenteditable="false" id="MonitorHTMLContent" runat="server">
      <div class="monitor-view" style="display:none;">
        <div class="qst-draft" style="padding:10px;margin-bottom:20px;display:block;background-color:Yellow;color:Red;text-align:center;">Draft Mode</div>
        <div ng-hide="monitoringnow()" style="display:none;">
          Queue:
          <select ng-model="f.Queue" ng-disabled="agentLocked() || readonly()" >
            <option value="">--Select from Queue--</option>
            <option ng-repeat="item in queue" value="{{item.id}}">
              {{'Completed: ' + item.completed + '/' + item.required + ', Points: ' + item.points + ', Complaints: ' + item.complaints + ' - ' + item.name}}
            </option>
          </select>
          <button type="button" class="btn btn-xs btn-success" style="font-size:10px;" ng-show="agentQueued()" ng-click="monitorqueuedagent()">
          Monitor From Queue
          </button>
          <button type="button" class="btn btn-xs btn-success" style="font-size:10px;margin-left:200px;" ng-show="true" ng-click="monitornewagent()">
          Monitor NON-QUEUED Agent
          </button>
        </div>
        <div ng-show="monitoringnow()">
          <table style="width:100%;">
            <tr>
              <td <b>Collector Name/ID</b>></td>
              <td class="mon-sys-AgentName"><b>
                <label id="show_lblAgentName"></label>
                (
                <label  id="show_lblAgent"></label>
                )
                </b>
              </td>
              <td style="border: thin solid black;border-right:none;border-bottom:none;">Previous Points</td>
              <td style="border: thin solid black;border-left:none;border-bottom:none;">
                <span>
                  <label class="show-score mon-sys-previous-points"><label ID="show_lblPrevScore"></label>
                </span>
              </td>
            </tr>
            <tr>
              <td>Extension</td>
              <td>
                <label ID="show_lblAgentExtension"></label>
              </td>
              <td style="border-left: thin solid black;">Form Point Total</td>
              <td style="border-right: thin solid black;">
                <span>
                  <label class="show-score mon-sys-score" style="font-weight: bold;">0</label>
                </span>
              </td>
            </tr>
            <tr>
              <td>Job Focus</td>
              <td>
                <label id="show_lblAgentClient"></label>
              </td>
              <td style="border: thin solid black;border-top:none;border-right:none;">Rolling 90 Day Point Total</td>
              <td style="border: thin solid black;border-left:none;border-top:none;">
                <span>
                  <label class="show-score mon-sys-90-day-points"><label id="show_lbl90Score"></label>
                  </label>
                </span>
              </td>
            </tr>
            <tr>
              <td>Hire Date</td>
              <td class="mon-sys-HireDate">
                <label id="show_lblAgentHireDate"></label>
              </td>
              <td>Office</td>
              <td class="mon-sys-LocationName">
                <label id="show_lblAgentLocationName"></label>
              </td>
           </tr>
            <tr>
              <td style="border-top: thin solid black">Auditor</td>
              <td style="border-top: thin solid black">
                <span>
                  <label id="show_lblSupervisorName"></label>
                </span>
              </td>
               <td>DM</td>
              <td>
                <!-- <label id="show_lblAgentGroupLeaderName"></label> -->
                <select class="combo-groupleader qst" qst="GroupLeader" ng-model="f.GroupLeader" ng-disabled="readonly()" >
                  <option value=""></option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Audit Period</td>
              <td style="font-weight:bold;">
                <span class="date-normal">
                    <span class="mon-sys-Callid"><label ID="show_lblCallid"></label></span>
                    - <span class="mon-sys-Calldate"><label ID="show_lblCalldate"></label></span>
                </span>
                <span class="date-editable" style="display:none;">
                    <input class="mon-sys-Callid-edit"" style="width:100px;" value="" />
                    - <input class="mon-sys-Calldate-edit" style="width:100px;" value = "" />
                </span>
              </td>
              <td>TM</td>
              <td>
                <!-- <label id="show_lblAgentTeamLeaderName"></label> -->
                <select class="combo-teamleader qst" qst="TeamLeader" ng-model="f.GroupLeader" ng-disabled="readonly()" >
                  <option value=""></option>
                </select>
              </td>
            </tr>
            <tr>
              <td>Audit Type</td>
              <td class="audit-types">
                <input type="checkbox" value="Y" class="qst" qst="AuditType_Phone" /> Phone
                <input type="checkbox" value="Y" class="qst" qst="AuditType_Lawsuit" /> Legal
                <input type="checkbox" value="Y" class="qst" qst="AuditType_Complaint" /> Complaint
                <input type="checkbox" value="Y" class="qst" qst="AuditType_Demand" /> Demand
                <input type="checkbox" value="Y" class="qst " qst="AuditType_InternalFinding" /> Internal Finding
                <input type="checkbox" value="Y" class="qst qst-qaaudit" qst="AuditType_QAAudit" /> QA Audit
              </td>
              <td>CAR #</td>
              <td><label id="show_lblMonitorId"></label></td>
            </tr>
            <tr>
              <td><span class="qst-qaauditshow">Audit Category</span></td>
              <td><span class="qst-qaauditshow"><select class="qst qst-QAAuditCategory" qst="QAAuditCategory"></select><span class="qst-qaaudit-other-show" style="display:none;"><br />PLEASE FILL IN - Other Audit Category: <input class="qst qst-QAAuditOther" qst="QAAuditOther" style="width:340px;" /></span></span></td>
              <td>Escalate:</td>
              <td>
                <input type="checkbox" value="Y" class="qst esc-check" qst="Escalated" />
                &nbsp&nbsp;<input type="text" class="qst esc-date" qst="EscalationDate" />
              </td>
            </tr>
            <tr>
               <td colspan="5">
                   Compliance Findings:</br>
                   <textarea class="qst qst-comments" qst="ComplianceFindings"  id="ComplianceFindings" name="ComplianceFindings" onkeyup="resizeTextarea('ComplianceFindings')" data-resizable="true" type="text" ></textarea>
              </td>
            </tr>
          </table>
          <ul class="call-list">
            <li class="add-link call-add">Add Call</li>
          </ul>

      <div class="attachments" style="display:none;margin-right:30px;">
        <div style="display:block;text-align: right;line-height:30px;">
            <span class="attachments-list"></span>
            <input id="fileUpload" name="fileUpload" type="file" accept=".doc,.docx,.xls,.xlsx,.pdf" style="display:none;" />
            <input type="button" value="Attach File..." onclick="document.getElementById('fileUpload').click();return false;" style="margin-left: 30px;" />
        </div>
      </div>
            <span class="mon-show-ismanager1" style="font-weight:bold;display:none;margin-top:10px;">
                <br /><!--Click here to acknowledge this monitor and send comments to QA: --><input type="submit" id="managersubmit1" class="mon-submit" value="Submit Response to Compliance / Complete Dispute Review." />
            </span>
            <span class="mon-show-complianceagree" style="font-weight:bold;display:none;margin-top:10px;">
                <br /><!--Click here to acknowledge this monitor and send comments to QA: --><input type="submit" id="compliancesubmit" class="mon-submit" value="Submit Responses to Agent/Manager" />
            </span>


          <div class="agent-acknowledgement" style="padding:10px;line-spacing:6px;">
            <h5>Agent Review/Acknowledgement of Form</h5>
            <input type="radio" class="qst" id="findings_agree" name="agent_dispute" qst="AgentAgreeAll" value="Yes" /><label for="findings_agree">I agree with ALL observations and point totals on this form.</label><br />
            <input type="radio" id="findings_dispute" name="agent_dispute" value="No" /><label for="findings_dispute" >I disagree with at least one of the findings, or points, assessed above.</label>
            <span class="timestamp-agentagreeall" style="display:none;">
                <br />Acknowledgement Timestamp: <input type="text" disabled="disabled" class="qst qst-timestamp-agentagreeall" qst="Timestamp_AgentAgreeAll"/><br />
            </span>
            <span class="mon-show-isagent" style="font-weight:bold;display:none;margin-top:10px;">
                <br /><br /><!--Click here to acknowledge this monitor and send comments to QA: --><input type="submit" id="acknowledgeme" class="mon-submit" value="Submit Acknowledgment/Dispute to Manager" />
            </span>
          </div>
          <div class="manager-corrective-action">
            Manager Corrective Action Comments:<br />
            <textarea class="qst qst-comments" qst="MgrCorrectiveActionComments"  id="MgrCorrectiveActionComments" name="MgrCorrectiveActionComments" onkeyup="resizeTextarea('MgrCorrectiveActionComments')" data-resizable="true" type="text" ></textarea>
            <div style="margin-left: 15px;margin-top:5px;">Corrective Action with Agent is Complete: <input type="checkbox" class="qst qst-correctiveactioncomplete" qst="MgrCorrectiveActionComplete" />
                <span class="timestamp-correctiveactioncomplete" style="display:none;">
                    <br />Corrective Action Completion Timestamp: <input type="text" disabled="disabled" class="qst qst-timestamp-correctiveactioncomplete" qst="Timestamp_MgrCorrectiveActionComplete"/><br />
                </span>
            </div>

          </div>
          <div class="agent-confirmation" style="padding:10px;line-spacing:6px;">
            <h5>Agent Confirmation of Corrective Action Training</h5>
            <input type="checkbox" class="qst qst-agentconfirm" qst="AgentCorrectiveActionConfirmed" value="Yes" /><label>I have received corrective action training from my manager</label>
                <span class="timestamp-agentcorrectiveactionconfirmed" style="display:none;">
                    <br />Corrective Action Confirmation Timestamp: <input type="text" disabled="disabled" class="qst qst-timestamp-agentcorrectiveactionconfirmed" qst="Timestamp_AgentCorrectiveActionConfirmed"/><br />
                </span>
            <span class="mon-show-confirm-button" style="font-weight:bold;display:none;margin-top:10px;">
                <br /><br /><!--Click here to acknowledge this monitor and send comments to QA: --><input type="submit" id="confirmme" class="mon-submit" value="Confirm Receipt of Training" />
            </span>
          </div>
          <table class="monitor-table">
            <thead>
            <!--
              <tr>
                <th class="parameters-col">&nbsp;</th>
                <th class="checklist-col">&nbsp;</th>
                <th class="points-col">&nbsp;</th>
                <th class="disposition-col">&nbsp;</th>
                <th class="comments-col">&nbsp;</th>
              </tr>
            -->
            </thead>
            <tbody>
                <!--
              <td>
                <span class="mon-show-new mon-show-acknowledgementrequired" style="display:none;">Acknowledgement Required:</span></td>
                -->
                <tr>
              <td>
                <span class="mon-show-new" style="text-align: left;display:none;"><input type="checkbox" class="mon-sys-acknowledgementrequired" /><span style="font-size:10px;">&nbsp;&nbsp;&nbsp;(Acknowledgement is always required for scores <= 94%)</span></span>
                <span class="mon-show-acknowledgementrequired" style="display:none;">
                  <span class="mon-show-isnotagent" style="color:Red;display:none;">The Case Worker must log in to review/acknowledge this monitor.</span>
                </span>
                <span class="mon-show-acknowledgementreceived" style="display:none;">
                  This monitor has been reviewed by the case worker.
                  <label ID="show_lblAcknowledgementDate"></label>
                  <br /><br />Management &amp; Compliance will review all agent disputes &amp; comments.<br />
                </span>
                <span class="mon-show-agentconfirmationrequired" style="display:none;">
                  <span class="mon-show-isnotagent" style="color:Red;display:none;">The Case Worker must log in to confirm receipt of corrective action training.</span>
                </span>
                <span class="mon-show-agentconfirmationreceived" style="display:none;">
                  <br /><br />The agent has confirmed receipt of corrective action training.
                </span>
              </td>
              </tr>
            </tbody>
            <tfoot>
<!--   TEMPORARILY REMOVED                 
              <tr>
                <td colspan="2" style="font-size:16px;text-align: right;font-weight: bold;">Score:&nbsp;</td>
                <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;" class="show-score mon-sys-score"></td>
                <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;" class="show-disp mon-sys-autofail"></td>
                <td  rowspan="2" style="text-align: center;vertical-align:middle;">
                  <input type="submit" id="submitme" class="mon-submit" disabled="disabled" value="Save Monitor" />
                  <input type="submit" id="deleteme" class="mon-delete" hidden="true" value="Delete"  />
                  <input type="submit" id="closeme" class="mon-close" hidden="true" value="Close"  />
                  <div style="float:left;margin-left:5px;">
                    <input type="submit" id="rebuttalme" class="mon-rebuttal" hidden="true" value="Submit Rebuttal" />
                  </div>
                  <div class="mon-show-reviewnotes" style="text-align: center;">
                    <br /><b>Review Notes (visible to everyone)</b>
                    <textarea class="qst qst-comments mon-field-reviewnotes" qst="ReviewNotes" type="text" style="margin:10px;width: 80%; height:30px; border: none;" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  </div>
                  <div class="mon-show-qanotes" style="display:none;text-align: center;">
                    <br /><b>QA Notes (visible only to QAs and Admins - include the word "Hold" to prevent advancement)</b>
                    <textarea class="qst qst-comments mon-field-qanotes" qst="QANotes" type="text" style="margin:10px;width: 80%; height:30px; border: none;" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                    <br />Release Date Scheduled For: <input id="show_inputReleaseDate" type="text" class="qst mon-field-releasedate" qst="ReleaseDate" value="2020-03-16 09:00" /><input type="text" id="show_lblNextMonday" style="display:none;" value="2020-03-16 09:00" />
                    <span style="display:none;">
                    <br /><br />
                    <input type="checkbox" class="mon-sys-hold" style="display:none;" />
                    <span style="font-size:10px;">&nbsp;&nbsp;&nbsp;Place Monitor on HOLD</span>
                    </span>
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttal-block">
                <td colspan="2" style="text-align: right;"><b>Rebuttal:</b><br />Please enter notes here for review by QA:</td>
                <td colspan="2">
                  <textarea class="qst qst-comments mon-field-rebuttal" qst="Rebuttal" type="text" id="comment13" name="comment13" onkeyup="resizeTextarea('comment13')" data-resizable="true" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalshow" style="display:none;">Rebuttal Entered By:
                    <input class="qst mon-sys-rebuttalshow mon-sys-rebuttal-stash" qst="RebuttalMgr" style="display:none;" ng-model="f.lettertypeselection" />
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttalresponse-block">
                <td colspan="2" style="text-align: right;"><b>Rebuttal Response:</b><br />As the QA, please enter your response to the rebuttal shown above:</td>
                <td colspan="2" style="background: white;">
                  <textarea class="qst qst-comments mon-field-rebuttalresponse" qst="RebuttalResponse" id="comment14" name="comment14" onkeyup="resizeTextarea('comment14')" data-resizable="true" type="text" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalresponseshow" style="display:none;">Response Entered By:
                    <input class="qst mon-sys-rebuttalresponseshow mon-sys-rebuttalresponse-stash" qst="RebuttalResponseQA" style="display:none;" ng-model="f.lettertypeselection" />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">
                    <input type="checkbox" class="mon-sys-rebuttalresponsesuccess qst" qst="RebuttalResponseSuccess" /> Rebuttal resulted in a change in scoring.<br /><br />
                    <input type="submit" id="rebuttalresponseme" class="mon-rebuttalresponse" hidden="true" value="Submit Rebuttal Response" />
                  </div>
                </td>
              </tr>
-->
            </tfoot>
          </table>
        <div class="qst-draft" style="margin-top:20px;margin-bottom:20px;display:block;background-color:Yellow;color:Red;text-align:center;padding:10px;">This Monitor is in Draft, not visible to DM/TM/CSRs</div>
          <div style="position:relative;">            <br />
                  <input type="submit" id="draftme" class="mon-submit" style="display:none;" disabled="disabled" value="Save as Draft" />
                  <input type="submit" id="submitme" class="mon-submit" disabled="disabled" value="Save Monitor" />
                  <input type="submit" id="deleteme" class="mon-delete" hidden="true" value="Delete"  />
                  <input type="submit" id="closeme" class="mon-close" hidden="true" value="Close"  />
                  <input type="checkbox" style="display:none;" class="qst-islive qst" qst="IsLive" />
                  <div class="qst-live-timestamp" style="display:none;position:absolute;right:10px;top:10px;font-style:italic;">
                    Monitor Release Date: <input type="text" disabled="disabled" class="qst qst-timestamp-islive" qst="Timestamp_IsLive"/>
                  </div>
          </div>
          <div style="padding:50px;>&nbsp;</div>
          <div style="margin: 0 auto 0 auto">
            <div class="form-box-group" style="display:none;">
              <div class="form-box-item"><label>Directory:</label><input type="text" ng-disabled="readonly()" ng-model="f.Directory" ng-change="refreshCallID()" /><span class="form-box-required">*</span></div>
              <div class="form-box-item"><label>Account#:</label><input type="text" ng-disabled="readonly()"  ng-model="f.AccountNumber" ng-change="refreshCallID()" /><span class="form-box-required">*</span></div>
              <div class="form-box-item"><label>Name on account:</label><input type="text" ng-disabled="readonly()"  ng-model="f.NameOnAccount" /></div>
              <div class="form-box-item">
                <label style="float:left;">Client:</label>
                <select style="width: 200px; float: left;" ng-change="clientchange()" ng-model="f.clientselection">
                  <option value="" selected="selected"></option>
                  <option ng-repeat="item in clientlist" ng-if="f.Project==item.projectid" value="{{item.clientname}}">
                    {{item.clientname}}
                  </option>
                </select>
                <input type="text" style="width: 180px; margin-left: -199px; margin-top: 1px; border: none; float: left;" ng-disabled="readonly()"  ng-model="f.Group" />
              </div>
              <div class="form-box-item">
                <label>PERFORMANT Client ACCT #:</label>
                <input type="text"ng-disabled="readonly()"   ng-model="f.GroupAccountNumber" />
                <span class="form-box-required">*</span>
              </div>
              <div class="form-box-item">
                <label>&nbsp;</label>
                <label style="font-size: 10px;">* - Required Field</label>
              </div>
            </div>
            <div class="form-box-group" style="display:none;">
              <div class="form-box-item">
                <label>Stage:</label>
                <!--
                  <select ng-model="f.Project" ng-disabled="agentLocked() || readonly()">
                      <option value="select" selected="selected">--Select--</option>
                      <option ng-repeat="item in projectlist" value="{{item.projectid}}">
                          {{item.projectdesc}}
                      </option>
                      <option value="0">Non-CSR</option>
                  </select><span class="form-box-required">*</span>
                  -->
              </div>
              <div class="form-box-item">
                <label>Agent:</label>
                <!--
                  <select ng-change="changeAgent()" ng-model="f.Agent" ng-disabled="agentLocked() || readonly()" >
                      <option ng-repeat="item in userlist" ng-if="f.Project==item.projectid" value="{{item.user_id}}">
                          {{item.name + ' (' + item.CLOCKID + ')'}}
                      </option>
                  </select><span class="form-box-required">*</span>
                  -->
              </div>
              <div class="form-box-item">
                <label>Supervisor:</label>
                <!--
                  <select ng-model="f.Supervisor" ng-disabled="readonly()" >
                      <option ng-repeat="item in userlist" ng-if="item.role != 'CSR'" value="{{item.user_id}}">
                          {{item.name + ' (' + item.CLOCKID + ')'}}
                      </option>
                  </select><span class="form-box-required">*</span>
                  -->
              </div>
              <div class="form-box-item">
                <label>Manager:</label>
                <!--
                  <select ng-model="f.Manager" ng-disabled="readonly()">
                      <option ng-repeat="item in userlist" ng-if="item.role != 'CSR'" value="{{item.user_id}}">
                          {{item.name + ' (' + item.CLOCKID + ')'}}
                      </option>
                  </select>
                  -->
              </div>
              <div class="form-box-item">
                <label>Audit Date:</label>
                <!--
                  <input type="text" style="text-align: center;" ng-disabled="true || readonly()" ng-model="f.AuditDate" /><span class="form-box-required">*</span>
                  -->
              </div>
            </div>
            <div class="form-box-group" style="display:none;">
              <div class="form-box-item">
                <label>Call ID:</label>
                <input type="text" ng-disabled="readonly()" ng-model="f.CallID"  ng-disabled="agentLocked()" />
              </div>
              <div class="form-box-item">
                <label>Date/Time of Call:</label>
                <input ng-disabled="readonly()" dynamic-ui ng-model="f.CallDate" type="text" />
                <span class="bad-ng-calltime">
                <input style="width: 85px;" ng-disabled="readonly()" dynamic-ui ng-model="f.CallTime" type="text" />
                </span>
                *
              </div>
              <div class="form-box-item">
                <label>Call Duration:</label>
                <input type="text" onkeypress="return event.charCode >= 48 && event.charCode <= 57" ng-disabled="readonly()" ng-model="f.CallDuration" />
                <span class="form-box-required">*</span>
              </div>
              <div class="form-box-item">
                <label>Agent Alias:</label>
                <input type="text" ng-disabled="readonly()" ng-model="f.CallReceivedBy" />
              </div>
            </div>
          </div>
          <table style="display:none;">
            <thead>
              <tr>
                <th>Garden:</th>
              </tr>
              <tr>
                <th style="background-color:Orange;">Quality Score</th>
              </tr>
              <tr>
                <th></th>
                <th style="text-align: left;">
                  Evaluated On:
                  <span class="mon-sys-Entdt">
                    <label ID="show_lblCurrentDate"></label>
                  </span>
                </th>
                <label ID="show_lblQA"></label>
              </tr>
              <tr></tr>
              <tr></tr>
              <tr></tr>
            </thead>
          </table>
          <ul style="display:none;">
            <li class="mon-field" ><label>Reviewer:</label></li>
            <li class="mon-field" >
              <label>Assoc&nbsp;Sup:</label>
              <span>
                <label style="display:none;" id="show_lblAgentTeamLeader"></label>
              </span>
            </li>
            <li class="mon-field" >
              <label>Assoc&nbsp;Mgr:</label>
              <span>
                
                <label style="display:none;" id="show_lblAgentGroupLeader"></label>
                <label style="display:none;" id="show_lblAgentManager"></label>
              </span>
            </li>
            <li class="mon-field" >
              <label>Workgroup:</label>
              <span>
                <label id="show_lblAgentGroup"></label>
              </span>
            </li>
            <li class="mon-field" >
              <label>All Mgrs:</label>
              <span>
                <label id="show_lblManagers"></label>
              </span>
            </li>
            <li class="mon-field" >
              <label>Letter Types:</label>
              <span>
                <label id="show_lblLetterTypes"></label>
              </span>
            </li>
            <li class="mon-field" >
              <label>ClientDepts:</label>
              <span>
                <label id="show_lblClientDept"></label>
              </span>
            </li>
          </ul>
          <div style="display:none;">
            <!--
            <input type="text" class="qst" qst="RebuttalTS" />
            <input type="text" class="qst" qst="RebuttalResponseTS" />
            -->
          </div>
        </div>
      </div>
</div>
      <div style="display:none;">
        <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label>
        <asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label>
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
        <asp:Label ID="lblAcknowledgementRequired" runat="server"></asp:Label>
        <asp:Label ID="lblSqfcode" runat="server"></asp:Label>
        <asp:Label ID="lblFormId" runat="server"></asp:Label>
        <asp:Label ID="lblClient" runat="server"></asp:Label>
        <asp:Label ID="lblSqfname" runat="server"></asp:Label>
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
        <asp:Label ID="lblDMs" runat="server"></asp:Label>
        <asp:Label ID="lblTMs" runat="server"></asp:Label>
        <asp:Label ID="lblLetterTypes" runat="server"></asp:Label>
        <asp:Label ID="lblClientDept" runat="server"></asp:Label>
        <asp:Label ID="lblAuthorized_QA" runat="server"></asp:Label>

        <asp:Label ID="lblAgentExtension" runat="server"></asp:Label>
        <asp:Label ID="lblAgentClient" runat="server"></asp:Label>
        <asp:Label ID="lblPrevScore" runat="server"></asp:Label>
        <asp:Label ID="lbl90Score" runat="server"></asp:Label>

        <asp:Label ID="lblCSRAuth" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorAuth" runat="server"></asp:Label>
        <asp:Label ID="lblSpecialAuth" runat="server"></asp:Label>



        <input ID="lblNextMonday" runat="server" />

        <input ID="inputReleaseDate" runat="server" />

      </div>
    </form>
    <script type="text/javascript" src="./Monitor_PR_CAR.js?r=21" language="javascript"></script>
  </body>
</html>
