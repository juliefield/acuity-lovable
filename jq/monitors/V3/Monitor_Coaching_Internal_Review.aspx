<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_Coaching_Internal_Review.aspx.cs" ValidateRequest="false" Inherits="_Monitor_Coaching_Internal_Review" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head1" runat="server">
    <title>Internal Review</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/lib/pure/grids-responsive-min.css") %>" media="screen" />
    <!-- JULIE CSS -->
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/css/app.css?r=6") %>" media="screen" />
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>
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
    <style media="screen">
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
        min-width: 160px;
        white-space: nowrap;
        /* padding-right: 300px; */
      }
      .multiplier {
        padding-left: 20px;
      }
      .disposition{
        text-align: left !important;
        padding-left: 0px;
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
      textarea.qst-coaching-comments {
        width: 85% !important;
        min-height:  40px;
        font-size: 11px;
        resize: none;
        overflow: visible;
        padding: 0 !important;
        max-height: 100%;
        margin: 10px;
        border: 0;
      }
      .qst-coaching-timestamp {
        text-align:center;
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
        width: 4%;
        text-align: center;
        padding: 0;
      }
      .coaching-col {
        width: 25%;
      }
      .comments-col {
        width: auto;
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

    </style>
  </head>
  <body runat="server" class="monitor-review-body">
    <form id="Form1" method="post" runat="server">
      <div class="monitor-review-title">
        <div class="monitor-title-container">
          <button onclick="myFunction()">Print this page</button>
          <a class="mon-close" href="">&#8592; Back</a> <span>|</span> Performant - Internal Review
        </div>
      </div>
      <div class="monitor-view">
        <div ng-hide="monitoringnow()" style="display:none;">
          Queue:
          <select ng-model="f.Queue" ng-disabled="agentLocked() || readonly()" >
            <option value="">--Select from Queue--</option>
            <option ng-repeat="item in queue" value="{{item.id}}">
              {'Completed: ' + item.completed + '/' + item.required + ', Points: ' + item.points + ', Complaints: ' + item.complaints + ' - ' + item.name}
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
              <td style="width:15%;"></td>
              <td style="width:35%;">
              </td>
              <td style="width:15%;">Work ID</td>
              <td style="width:35%;" class="mon-sys-Workid">
                <asp:Label ID="lblWorkid" runat="server"></asp:Label>
              </td>
            </tr>
            <tr>
              <td style="width:15%;">Project</td>
              <td style="width:35%;">
                <select class="combo-clientdept" style="width: 200px; float: left;" ng-change="clientchange()" ng-model="f.clientselection">
                  <option value="" selected="selected"></option>
                </select>
                <input type="text" class="qst mon-field-clientdept" name="clientdeptfield" qst="Project" style="width: 180px; margin-left: -199px; margin-top: 1px; border: none; float: left;" ng-disabled="readonly()"  ng-model="f.Group" />
              </td>
              <td style="width:15%;">Case Number</td>
              <td style="width:35%;" class="mon-sys-Callid">
                <asp:Label ID="lblCallid" runat="server"></asp:Label>
              </td>
            </tr>
            <tr>
              <td>Reviewer</td>
              <td>
                <span>
                  <asp:Label id="lblSupervisorName" runat="server"></asp:Label>
                  <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label>
                  <asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label>
                  <asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label>
                </span>
              </td>
              <td>&nbsp;</td>
              <td>
                <input class="radio-ghp" type="radio" name="ghp" value="GHP" ng-model="selectedLetterType" /><label for="GHP">GHP</label>
                <input class="radio-nghp" type="radio" name="ghp" value="NGHP" ng-model="selectedLetterType" /><label for="NGHP">NGHP</label>
                <span style="padding-left:20px;font-size:10px;font-weight:bold;color:#0078AA;" class="new-release-message"></span>
              </td>
            </tr>
            <tr>
              <td>Review Date</td>
              <td class="mon-sys-Calldate">
                <asp:Label ID="lblCalldate" runat="server"></asp:Label>
              </td>
              <td>Letter ID and Name</td>
              <td>
                <select class="combo-lettertypes qst" qst="LetterID" style="width: 200px; float: left;" ng-model="f.lettertypeselection">
                  <option value=""></option>
                </select>
              </td>
            </tr>
            <tr>
              <td>User Group</td>
              <td class="mon-sys-GroupName">
                <asp:Label id="lblAgentGroupName" runat="server"></asp:Label>
              </td>
              <td>Supervisor</td>
              <td>
                <select class="combo-supervisor qst" qst="Supervisor" ng-model="f.Supervisor" ng-disabled="readonly()" >
                  <option value=""></option>
                </select>
                <span class="form-box-required">*</span>
              </td>
            </tr>
            <tr>
              <td>User Name/ID</td>
              <td class="mon-sys-AgentName">
                <asp:Label id="lblAgentName" runat="server"></asp:Label>
                <span>
                /
                <asp:Label id="lblAgent" runat="server"></asp:Label>
                </span>
              </td>
              <td>Team Lead</td>
              <td>
                <select class="combo-teamlead qst" qst="TeamLead" ng-model="f.GroupLeader" ng-disabled="readonly()" >
                  <option value=""></option>
                </select>
                <span class="form-box-required">*</span>
              </td>
            </tr>
            <tr>
              <td><span class="mon-show-new mon-show-acknowledgementrequired" style="display:none;">Acknowledgement Required:</span></td>
              <td>
                <span class="mon-show-new" style="text-align: left;display:none;"><input type="checkbox" class="mon-sys-acknowledgementrequired" /><span style="font-size:10px;">&nbsp;&nbsp;&nbsp;(Acknowledgement is always required for scores <= 94%)</span></span>
                <span class="mon-show-acknowledgementrequired" style="display:none;">
                  <span class="mon-show-isagent" style="font-weight:bold;display:none;">
                    <br />Click the button below to acknowledge<br />that you have seen this monitor.<br />
                    <br />
                    <asp:Button id="acknowledgeme" runat="server" class="mon-acknowledge" type="submit" Text="Acknowledge Monitor" />
                  </span>
                  <span class="mon-show-isnotagent" style="color:Red;display:none;">The Case Worker must log in to acknowledge this monitor.</span>
                </span>
                <span class="mon-show-acknowledgementreceived" style="display:none;">
                  This monitor was acknowledged by the Case Worker:
                  <asp:Label ID="lblAcknowledgementDate" runat="server"></asp:Label>
                </span>
              </td>
              <td>Manager</td>
              <td>
                <select class="combo-manager qst" qst="Manager" ng-model="f.Manager" ng-disabled="readonly()">
                  <option value=""></option>
                </select>
              </td>
            </tr>
          </table>
          <table class="monitor-table">
            <thead>
              <tr>
                <th class="parameters-col">Parameters</th>
                <th class="checklist-col">Checklist</th>
                <th class="points-col">Points</th>
                <th class="disposition-col">Disposition</th>
                <th class="coaching-col show-coaching" style="display:none;">Coaching</th>
                <th class="comments-col">Comments</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Information Disclosure</td>
                <td>Inappropriate information shared with incorrect entity. This includes any <b>PHI and/or PII shared.</b></td>
                <td>0 (AF)</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="240" score="0" af="Y">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-240"  id="coaching1" name="coaching1" onkeyup="resizeTextarea('coaching1')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed1"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="date1" qst="coaching-timestamp-240"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-240"  id="comment1" name="comment1" onkeyup="resizeTextarea('comment1')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td rowspan="3">Decision Making</td>
                <td><b>Rationale/Case Level</b> -Case decision was inappropriate for the documentation provided. This category also relates to scenarios where all pertinent documentation was not reviewed to make case decision.</td>
                <td>16 (AF)</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="244" score="16" af="Y">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-244"  id="coaching2" name="coaching2" onkeyup="resizeTextarea('coaching2')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed2"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P1" qst="coaching-timestamp-244"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments"  qst="comments-244" id="comment2" name="comment2" onkeyup="resizeTextarea('comment2')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" >
                  </textarea></td>
              </tr>
              <tr>
                <td>
                  <b>Inappropriate Letter-</b> The incorrect letter was generated, and the letter sent is not concurrent with the decision and or SOP's and Job Aids.
                  <br />Correct Letter (if incorrect):
                  <select class="combo-correctletter qst" qst="CorrectLetter" style="width: 200px;">
                    <option value=""></option>
                  </select>
                </td>
                <td>16 (AF)</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="ir-question cheapscore qst" qst="246" score="16" af="Y">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-246"  id="coaching3" name="coaching3" onkeyup="resizeTextarea('coaching3')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed3"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P2" qst="coaching-timestamp-246"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-246" id="comment3" name="comment3" onkeyup="resizeTextarea('comment3')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td><b>Case Work-</b> Case not processed according to SOP's, Job Aides and Resources. (E.g. incorrect claims removed, claims dispositioned inappropriately, letter was initiated from the incorrect DCN, check wasn't acknowledged, etc.)</td>
                <td>6</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="249" score="6" af="N">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-249"  id="coaching4" name="coaching4" onkeyup="resizeTextarea('coaching4')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed4"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P3" qst="coaching-timestamp-249"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-249" id="comment4" name="comment4" onkeyup="resizeTextarea('comment4')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td rowspan="4">Documentation Match</td>
                <td><b>Outgoing Correspondence</b> provides inaccurate and incomplete information (E.g. Boxes Checked, DOI, Insurer ID, CC Field, Subscriber Name, Check Number)</td>
                <td>6</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="274" score="6" af="N">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-274"  id="coaching5" name="coaching5" onkeyup="resizeTextarea('coaching5')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed5"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P4" qst="coaching-timestamp-274"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-274" id="comment5" name="comment5" onkeyup="resizeTextarea('comment5')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td>The <b>Amounts and Balances</b> on the outgoing correspondence are incorrect. (E.g. Payment Amount, Interest Amount, Total Amount Due)</td>
                <td>6</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="276" score="6" af="N">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-276"  id="coaching6" name="coaching6" onkeyup="resizeTextarea('coaching6')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed6"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P5" qst="coaching-timestamp-276"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-276" id="comment6" name="comment6" onkeyup="resizeTextarea('comment6')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td>The <b>Dates</b> on the outgoing correspondence are inaccurate. (E.g. Next Interest Accrual Date, Demand Date etc.)</td>
                <td>6</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="278" score="6" af="N">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-278"  id="coaching7" name="coaching7" onkeyup="resizeTextarea('coaching7')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed7"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P6" qst="coaching-timestamp-278"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-278" id="comment7" name="comment7" onkeyup="resizeTextarea('comment7')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td>The <b>Claim Summary Form/Enclosure</b> reflects inaccurate information. (E.g.  Incorrect Balance Due)</td>
                <td>6</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="280" score="6" af="N">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-280"  id="coaching8" name="coaching8" onkeyup="resizeTextarea('coaching8')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed8"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P7" qst="coaching-timestamp-280"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-280" id="comment8" name="comment8" onkeyup="resizeTextarea('comment8')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td rowspan="4">System Updates</td>
                <td><b>Notes </b> are incomplete and/or inconsistent with decision and documentation being reviewed. (Notes must be present in both BCRS and every record of HIGLAS where applicable)</td>
                <td>16 (AF)</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="282" score="16" af="Y">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-282"  id="coaching9" name="coaching9" onkeyup="resizeTextarea('coaching9')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed9"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P8" qst="coaching-timestamp-282"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-282" id="comment9" name="comment9" onkeyup="resizeTextarea('comment9')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td><b>HIGLAS Balance</b> is incorrect and/or inconsistent with case decision. (E.g. Adjustment not being made according to the provided documentation and checks not being applied appropriately.)</td>
                <td>16 (AF)</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="284" score="16" af="Y">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-284"  id="coaching10" name="coaching10" onkeyup="resizeTextarea('coaching10')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed10"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P9" qst="coaching-timestamp-284"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-284" id="comment10" name="comment10" onkeyup="resizeTextarea('comment10')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td><b>Case Status and Claims</b> placed in the incorrect status in BCRS, once case decision was made. </td>
                <td>6</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="286" score="6" af="N">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-286"  id="coaching11" name="coaching11" onkeyup="resizeTextarea('coaching11')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed11"/>
                                <input disabled="disabled" class="qst qst-coaching-timestamp" id="P10" qst="coaching-timestamp-286"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" qst="comments-286" id="comment11" name="comment11" onkeyup="resizeTextarea('comment11')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td><b>Task Not Completed</b>- This occurs when a work item/items are closed and caseworker documents that a letter was sent but no letter was initiated or successfully sent. Or in any scenario where the work item is closed, and the case was never worked.</td>
                <td>0 (AF)</td>
                <td class="disposition">
                  <span class="mon-answer">
                    <select class="cheapscore qst" qst="288" score="0" af="Y">
                      <option value="">--select--</option>
                      <option selected="selected" value="Pass">Pass</option>
                      <option value="Fail">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </td>
                <td class="show-coaching" style="display:none;">
                    <table style="width:100%">
                        <tr>
                            <th>Description</th>
                            <th>Completed</th>
                        </tr>
                        <tr>
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-288"  id="coaching12" name="coaching12" onkeyup="resizeTextarea('coaching12')" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="coaching-completed-checkbox" id="completed12"/>
                                <input disabled="disabled" class="qst qst-coaching-timestamp" id="P11" qst="coaching-timestamp-288"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td style="background:white;">
                  <textarea class="qst qst-comments" id="comment12" qst="comments-288" name="comment12" onkeyup="resizeTextarea('comment12')" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" >
                  </textarea>
                </td>
              </tr>                        
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="font-size:16px;text-align: right;font-weight: bold;">Score:&nbsp;</td>
                <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;" class="show-score mon-sys-score"></td>
                <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;" class="show-disp mon-sys-autofail"></td>
                <td colspan="2" rowspan="2" style="text-align: center;vertical-align:middle;">
                  <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Save Monitor" />
                  <asp:Button id="deleteme" runat="server" class="mon-delete" hidden="true" type="submit" Text="Delete"  />
                  <asp:Button id="closeme" runat="server" class="mon-close" hidden="true" type="submit" Text="Close"  />
                  <div style="float:left;margin-left:5px;">
                    <asp:Button id="rebuttalme" runat="server" class="mon-rebuttal" hidden="true" type="submit" Text="Submit Rebuttal" />
                  </div>
                  <div style="float:left;margin-left:5px;">
                    <asp:Button id="coachme" runat="server" class="mon-coaching" hidden="true" type="submit" Text="Submit Coaching" />
                  </div>
                  <table class="monitor-table ui-ecodes">
                    <tfoot class="ecodebase">
                                <tr>
                                    <td>
                                        <tr>
                                            <td>
                                                <div qst="AuditedSelectRowCount" class="mon-show-reviewnotes" style="text-align: center;">
                                                    <br /><b>Review Notes (visible to everyone)</b>
                                                    <textarea class="qst qst-comments mon-field-reviewnotes" qst="ReviewNotes" type="text" style="margin:10px;width: 80%; height:30px; border: none;" ng-disabled="readonly()" ng-modelHOLD="f.Comment"></textarea>
                                                    <div style="margin-top:5px;padding-top:5px; border-width:0px;margin-left:10px;margin-right:10px;margin-bottom:5px"> Tag: <input type="text" class="qst mon-field-trendcategory" qst="TrendCategory" style="width:400px;display:none;" /><a class="select-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;display:none;">select tag</a>
                                                        <select class="qst combo-tags" qst="tag1" style="width:400px;"></select><a class="new-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;">new tag</a></div>
                                            </td>
                                        </tr>
                                        <tr hidden="">
                                            <td>
                                                <div style="margin-top:5px;padding-top:5px; border-width:0px;margin-left:10px;margin-right:10px;margin-bottom:5px"> Tag: <input type="text" class="qst mon-field-trendcategory" qst="TrendCategory2" style="width:400px;display:none;" /><a class="select-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;display:none;">select tag</a>
                                                    <select class="qst combo-tags" qst="tag2" style="width:400px;"></select><a class="new-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;">new tag</a></div>
                                            </td>
                                        </tr>
                                        <tr hidden="">
                                            <td>
                                                <div style="margin-top:5px;padding-top:5px; border-width:0px;margin-left:10px;margin-right:10px;margin-bottom:5px"> Tag: <input type="text" class="qst mon-field-trendcategory" qst="TrendCategory3" style="width:400px;display:none;" /><a class="select-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;display:none;">select tag</a>
                                                    <select class="qst combo-tags" qst="tag3" style="width:400px;"></select><a class="new-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;">new tag</a></div>
                                            </td>
                                        </tr>
                                        <tr hidden="">
                                            <td>
                                                <div style="margin-top:5px;padding-top:5px; border-width:0px;margin-left:10px;margin-right:10px;margin-bottom:5px"> Tag: <input type="text" class="qst mon-field-trendcategory" qst="TrendCategory4" style="width:400px;display:none;" /><a class="select-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;display:none;">select tag</a>
                                                    <select class="qst combo-tags" qst="tag4" style="width:400px;"></select><a class="new-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;">new tag</a></div>
                                            </td>
                                        </tr>
                                        <tr hidden="">
                                            <td>
                                                <div style="margin-top:5px;padding-top:5px; border-width:0px;margin-left:10px;margin-right:10px;margin-bottom:5px"> Tag: <input type="text" class="qst mon-field-trendcategory" qst="TrendCategory5" style="width:400px;display:none;" /><a class="select-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;display:none;">select tag</a>
                                                    <select class="qst combo-tags" qst="tag5" style="width:400px;"></select><a class="new-tag" style="margin-left:20px;text-decoration:underline;cursor:pointer;">new tag</a></div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div>
                                                    <button class="addrow">Add Tag</button>
                                                    <button class="removerow">Remove Tag</button>
                                                </div>
                                            </td>
                                        </tr>
                                    </td>
                                </tr>
                    </tfoot>
                  </table>
                  <div class="mon-show-qanotes" style="display:none;text-align: center;">
                    <br /><b>QA Notes (visible only to QAs and Admins - include the word "Hold" to prevent advancement)</b>
                    <textarea class="qst qst-comments mon-field-qanotes" qst="QANotes" type="text" style="margin:10px;width: 80%; height:30px; border: none;" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                    <br />Release Date Scheduled For: <input id="inputReleaseDate" runat="server" type="text" class="qst mon-field-releasedate" qst="ReleaseDate" value="2020-03-16 09:00" /><input type="text" id="lblNextMonday" runat="server" style="display:none;" value="2020-03-16 09:00" /><input type="text" id="lblToday" runat="server" style="display:none;" value="2020-03-16 09:00" />
                    <span style="display:none;">
                    <br /><br />
                    <input type="checkbox" class="mon-sys-hold" style="display:none;" />
                    <span style="font-size:10px;">&nbsp;&nbsp;&nbsp;Place Monitor on HOLD</span>
                    </span>
                  </div>
                  <div class="mon-show-nonqa" style="display:none;margin:5px;text-align: center;">
                    Monitor Released: <span class="mon-show-release-date">DateHere</span>
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
                    <asp:Button id="rebuttalresponseme" runat="server" class="mon-rebuttalresponse" hidden="true" type="submit" Text="Submit Rebuttal Response" />
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>

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
                    <asp:Label ID="lblCurrentDate" runat="server"></asp:Label>
                  </span>
                </th>
                <asp:Label ID="lblQA" runat="server"></asp:Label>
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
                <asp:Label id="lblAgentTeamLeaderName" runat="server"></asp:Label>
                <asp:Label style="display:none;" id="lblAgentTeamLeader" runat="server"></asp:Label>
              </span>
            </li>
            <li class="mon-field" >
              <label>Assoc&nbsp;Mgr:</label>
              <span>
                <asp:Label id="lblAgentGroupLeaderName" runat="server"></asp:Label>
                <asp:Label style="display:none;" id="lblAgentGroupLeader" runat="server"></asp:Label>
                <asp:Label style="display:none;" id="lblAgentManager" runat="server"></asp:Label>
              </span>
            </li>
            <li class="mon-field" >
              <label>Workgroup:</label>
              <span>
                <asp:Label id="lblAgentGroup" runat="server"></asp:Label>
              </span>
            </li>
            <li class="mon-field" >
              <label>All Mgrs:</label>
              <span>
                <asp:Label id="lblManagers" runat="server"></asp:Label>
              </span>
            </li>
            <li class="mon-field" >
              <label>Letter Types:</label>
              <span>
                <asp:Label id="lblLetterTypes" runat="server"></asp:Label>
                <asp:Label id="lblTags" runat="server"></asp:Label>
              </span>
            </li>
            <li class="mon-field" >
              <label>ClientDepts:</label>
              <span>
                <asp:Label id="lblClientDept" runat="server"></asp:Label>
              </span>
            </li>
          </ul>
          <div style="display:none;">
            <asp:Label ID="lblMode" runat="server"></asp:Label>
            <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
            <asp:Label ID="lblAcknowledgementRequired" runat="server"></asp:Label>
            <input type="text" class="qst" qst="RebuttalTS" />
            <input type="text" class="qst" qst="RebuttalResponseTS" />
          </div>
          <p>Show Coaching: <input type="checkbox" id="coachingCheckBox"/></p>
        </div>
      </div>
    </form>
    <script type="text/javascript" src="./Monitor_Coaching_Internal_Review.js?r=25" language="javascript"></script>
    <script>
                $(document).ready(function() {
                    $(".addrow").bind("click", function() {
                        showrow(tablesize + 1);
                        updatesize(tablesize + 1);
                        return false;
                    });
                    $(".removerow").bind("click", function() {
                        hiderow(tablesize);
                        updatesize(tablesize - 1);
                        return false;
                    });
                });
        
                var tablesize = 1;
        
                function showrow(index) {
                    if (index != 6) {
                        $($(".ecodebase").children()[index]).show();
                    } else {
                        alert("Maximum row amount reached");
                    }
                }
        
                function hiderow(index) {
                    if (!(index <= 1) && !(index > 5)) {
                        $($($($(".ecodebase").children()[index]).children()[1]).children()[0]).val("")
                        $($($($(".ecodebase").children()[index]).children()[2]).children()[0]).val("")
                        $($(".ecodebase").children()[index]).hide();
                    }
                }
        
                function updatesize(size) {
                    if (!(size < 1) && !(size > 5)) {
                        tablesize = size;
                    }
                }
        
                function highlightalert(h) {
                    if (h) {
                        $(".td-alert").css("background-color", "");
                    }
                }
                $(".ac-alert").bind("change", function() {
                    var h = false;
                    if ($(this).val() != null) {
                        h = ($(this).val().length > 0);
                    }
                    highlightalert(h);
                });
                var dvcode = 0;
        
                function cullempty() {
                    for (var i = 5; i > 1; i--) {
                        var ecode1 = $(".ui-ecodes input[qst='AuditedEcode" + i + "']").val();
                        var ecode2 = $(".ui-ecodes input[qst='QAEcode" + i + "']").val();
                        updatesize(i);
                        if (((ecode1 == "") && (ecode2 == "")) || (ecode1 == undefined) && (ecode2 == undefined)) {
                            hiderow(i);
                        } else {
                            break;
                        }
                    }
                };
        
                function resizeTextarea(id) {
                    var a = document.getElementById(id);
                    a.style.height = 'auto';
                    a.style.height = a.scrollHeight + 'px';
                }
        
                function init() {
                    var a = document.getElementsByTagName('textarea');
                    for (var i = 0, inb = a.length; i < inb; i++) {
                        if (a[i].getAttribute('data-resizable') == 'true')
                            resizeTextarea(a[i].id);
                    }
                }
        
                function myFunction() {
                    window.print();
                }
    </script>
  </body>
</html>
