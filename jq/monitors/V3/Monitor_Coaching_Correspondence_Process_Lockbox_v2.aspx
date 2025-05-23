<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_Coaching_Correspondence_Process_Lockbox_v2.aspx.cs" ValidateRequest="false" Inherits="_Monitor_Coaching_Correspondence_Process_Lockbox_v2" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head1" runat="server">
    <title>Performant - Internal Review v2</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/lib/pure/grids-responsive-min.css") %>" media="screen" />
    <!-- JULIE CSS -->
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/css/app.css?r=6") %>" media="screen" />
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/print.css") %>" media="print" />    
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
        width:10%;
        text-align: center !important;
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
        clear: both;
        min-height: 30px;
      }
      .mon-field label {
        color:White;
        float: left;
      }
      .mon-field-input,
      .mon-field select {
        width: 150px;
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
        margin-top: 10px;
        border: 1px solid #eee;
        border-spacing: 0;
        border-collapse: collapse;
      }
      .monitor-table td {
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        border: 1px solid black;
        color: black;
        background: lightgray;
      }
      .monitor-table th {
        text-align: center;
        border: 1px solid black;
        color: black;
        background: lightgray;
      }

      .monitor-table td:hover {
        color: black;
        background: darkgray;
      }
      .monitor-table div:hover {
        color: black;
        background: darkgray;
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
        width: 93% !important;
        min-height:  50px;
        font-size: 12px;
        resize: vertical;
        overflow: visible;
        padding: 0 !important;
        max-height: 400px;
        margin: 5px;
        border: 0;
      }
      textarea.qst-coaching-comments {
        width: 85% !important;
        min-height:  40px;
        font-size: 12px;
        resize: vertical;
        overflow: visible;
        padding: 0 !important;
        max-height: 300px;
        margin: 10px;
        border: 0;
      }
      .qst-coaching-timestamp {
        text-align:center;
      }
      textarea.qst-comments:focus {
        outline: none;
      }

      .monitor-review-body {
        height: calc(100% - 25px);
        padding-bottom: 50px;
        overflow-y:scroll;
        background-color:#0078AA;
        scrollbar-width: thin;
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
        color: white;
        margin-right: 20px;
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
        margin: 10px auto;
        padding: 10px 0;
      }
      .monitor-title-container button {
        float: right;
        margin-top: -5px;
      } 
      .header-table {
        color:white;
        font-weight: bold;
      }
      .tbl-resize-sm {
        scrollbar-width: thin;
        height:350px;
        overflow:auto;
        display:block;
        min-height: 350px;
        max-height: 560px;
        resize: vertical;
      }
      .tbl-resize-lg {
        scrollbar-width: thin;
        height:350px;
        overflow:auto;
        display:block;
        min-height: 350px;
        max-height: 1250px;
        resize: vertical;
      }
    </style>
  </head>
  <body runat="server" class="monitor-review-body">
    <form id="Form1" method="post" runat="server">
      <div class="monitor-review-title">
        <div class="monitor-title-container">
          <button onclick="myFunction()">Print this page</button>
          <a class="mon-close" href="">&#8592; Back</a> <span>|</span> Performant - Internal Review v2
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
          <table class="header-table" style="width:100%;display:none;">
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
                  <option value=""></option>
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
                <input class="cb-cplb qst" type="checkbox" name="cplb" value="CPLB" qst="CPLB" ng-model="selectedLetterType" /><label for="CPLB">CPLB</label>
                <span style="padding-left:20px;font-size:10px;font-weight:bold;color:#0078AA;" class="new-release-message"></span>
              </td>
            </tr>
            <tr>
              <td>Review Date</td>
              <td class="mon-sys-Calldate">
                <asp:Label ID="lblCalldate" runat="server"></asp:Label>
              </td>
              <td class="lid">Letter ID and Name</td>
              <td class="lid">
                <select class="combo-lettertypes qst" qst="LetterID" style="width: 200px; float: left;" ng-model="f.lettertypeselection">
                  <option value="N/A-CPN" selected>N/A-CPN</option>
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
              <td>Manager</td>
              <td>
                <select class="combo-manager qst" qst="Manager" ng-model="f.Manager" defaultoption="dduree" ng-disabled="readonly()">
                </select>
              </td>
              <td class="show-original">Original User Name/ID</td>
              <td class="show-original">
                <input type="text" disabled="disabled" class="qst-original-username qst" qst="Original_Username" />
                /
                <input type="text" disabled="disabled" class="qst-original-userid qst" qst="Original_Userid" />
              </td>
            </tr>

            <tr>
              <td><span class="mon-show-new mon-show-acknowledgementrequired" style="display:none;">Acknowledgement Required:</span></td>
              <td>
                <span class="mon-show-new" style="text-align:left;display:none;"><input type="checkbox" class="mon-sys-acknowledgementrequired" /><span style="font-size:10px;">&nbsp;&nbsp;&nbsp;(Acknowledgement is always required for scores <= 94%)</span></span>
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
              <td class="show-original">Original Release Date</td>
              <td class="show-original">
                <input type="text" disabled="disabled" class="qst-original-date qst" qst="Original_Date" />
              </td>
            </tr>

          </table>
          <table class="monitor-table" style="display:none;">
            <tbody class="tbl-Rationale">            
              <tr>
                <th rowspan="2" style="background-color: #03b815;width:150px">Rationale
                  <br /><br />
                  <span>Score=</span><span class="qst" qst="RationaleScore" id="RationaleScore">100%</span>
                  <br /><br />
                  <span class="qst" qst="RationaleFindings" id="RationaleFindings">Findings=0</span>
                </th>
                <tr>
                  <th colspan="5" style="background:#03b815;">
                    <table class="tbl-resize-lg">
                      <tr style="position:sticky;top:0;">
                        <td style="background-color: #03b815;">Checklist</td>
                        <td style="background-color: #03b815;">Points</td>
                        <td style="background-color: #03b815;">Disposition</td>
                        <td class="coaching-col show-coaching" style="display:none;background-color: #03b815;">Coaching</td>
                        <td style="background-color: #03b815;">Comments</td>                        
                      </tr>
                      <tr>
                        <td style="width:40%;">1.1 - Incorrect case decision made based on all documentation received
                            This pertains to all open, closed, and pending work items, for the case in question, also known as a "case level" review. This does not pertain to letters, only rationale.
                        </td>
                        <td style="width:5%;">16</td>
                        <td class="disposition" style="width:15%;">
                          <span class="mon-answer" style="width:10%;">
                            <select class="cheapscore qst" qst="Q1" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-1"  id="coaching1" name="coaching1" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)"></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb1" id="completed1"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P1" qst="coaching-timestamp-1"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-1" id="comment1" name="comment1" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>                        
                      </tr>                   
                      <tr>
                        <td>1.2 - No open defense(s)/appeal at the time of processing, and check(s) was received, but the payment was not acknowledged
                            This would include situations where a payment was received, including excess fund application, but not acknowledged</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q4" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-4"  id="coaching2" name="coaching2" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb2" id="completed2"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P2" qst="coaching-timestamp-4"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-4" id="comment2" name="comment2" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>1.3 - Defense(s) or appeal type(s) information was acknowledged, deemed invalid, however is valid</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q5" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-5"  id="coaching3" name="coaching3" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb3" id="completed3"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P3" qst="coaching-timestamp-5"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-5" id="comment3" name="comment3" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>1.4 - Defense(s) or appeal type(s) information was acknowledged, deemed valid, however is invalid</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q6" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-6"  id="coaching4" name="coaching4" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb4" id="completed4"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P4" qst="coaching-timestamp-6"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-6" id="comment4" name="comment4" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>1.5 - Not properly researching for unknown beneficiary or case</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q7" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-7"  id="coaching5" name="coaching5" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb5" id="completed5"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P5" qst="coaching-timestamp-7"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-7" id="comment5" name="comment5" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>1.6 - ECRS request not submitted</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q28" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-28"  id="coaching6" name="coaching6" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb6" id="completed6"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P6" qst="coaching-timestamp-28"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-28" id="comment6" name="comment6" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.7 - Refund request was not completed or was initiated when a Refund Request was not due, or when the Refund Request contains incorrect information within the Refund Request Work Item.
                            <br />a.	The caseworker does not address a refund opportunity when a refund is due to a valid defense or favorable appeal. For example, the debtor paid in protest.
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q29" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-29"  id="coaching7" name="coaching7" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb7" id="completed7"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P7" qst="coaching-timestamp-29"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-29" id="comment7" name="comment7" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.8 - Multiple letters are required but only one was initiated.
                            CRC decision letter was issued, however accompanying letter(s) were not. 
                            For example, GHP: CRC decision letter is issued but the Excess Funds Applied to Other Medicare Debt was not. 
                            For example, NGHP: Fully Favorable Redetermination Decision letter is issued but the OCR was not.  Decision letter but not payment acknowledgement.  
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q30" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-30"  id="coaching8" name="coaching8" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb8" id="completed8"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P8" qst="coaching-timestamp-30"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-30" id="comment8" name="comment8" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>1.9 - Correspondence/Letter response processed/sent under the incorrect case/beneficiary</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q32" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-32"  id="coaching9" name="coaching9" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb9" id="completed9"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P9" qst="coaching-timestamp-32"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-32" id="comment9" name="comment9" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.10 - Incorrect Letter sent based on decision
                            For example, 
                            NGHP: A Valid Dispute was issued instead of an OCR.
                            GHP: A Valid Defense with Partial Payment (530) was issued; however, a Partial Payment with Unacceptable Defense (430) was required. 
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q33" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-33"  id="coaching10" name="coaching10" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb10" id="completed10"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P10" qst="coaching-timestamp-33"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-33" id="comment10" name="comment10" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.11 - Work item type that does not require CRC decision letter response closed with no notes
                            A case worker shall note each work item they close. It is not acceptable to place a period with no context to why the work item is being closed. Case worker shall not note "case to be worked at later time". Case worker shall not close a work item as "no action taken" without context.
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q34" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-34"  id="coaching11" name="coaching11" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb11" id="completed11"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P11" qst="coaching-timestamp-34"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-34" id="comment11" name="comment11" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.12 - Work item was processed and closed with the incorrect Work Type
                            For example, the work item was processed and closed as an Incoming Status Letter (ISL) however it was an Authorization. 
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q35" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-35"  id="coaching12" name="coaching12" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb12" id="completed12"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P12" qst="coaching-timestamp-35"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-35" id="comment12" name="comment12" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.13 - Authorization not acknowledged, processed, or added</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q36" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-36"  id="coaching13" name="coaching13" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb13" id="completed13"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P13" qst="coaching-timestamp-36"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-36" id="comment13" name="comment13" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.14 - Notes missing major required elements
                          <br />a.  Notes inconsistent with the actions and or correspondence on the case. 
                          b.  Notes do not align with notes requirement per SOP/Job Aid (what is needed to resolve the debt, what supporting documents were provided, information on the case such as S-111 updates)
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q37" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-37"  id="coaching14" name="coaching14" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb14" id="completed14"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P14" qst="coaching-timestamp-37"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-37" id="comment14" name="comment14" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.15 - HIGLAS adjustment is incorrect or was not completed</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q38" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-38"  id="coaching15" name="coaching15" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb15" id="completed15"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P15" qst="coaching-timestamp-38"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-38" id="comment15" name="comment15" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.16 - BCRS, no notes
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q39" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-39"  id="coaching16" name="coaching16" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb16" id="completed16"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P16" qst="coaching-timestamp-39"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-39" id="comment16" name="comment16" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.17 - Payment was not handled correctly
                          <br />a. This includes errors made by the auto application process. 
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q41" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-41"  id="coaching17" name="coaching17" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb17" id="completed17"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P17" qst="coaching-timestamp-41"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-41" id="comment17" name="comment17" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>                 
                      <tr class="hide-ghp" style="display:none;">
                        <td>1.18 - GHP: Defense(s) not acknowledged in Claims Summary Status Report</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q2" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-2"  id="coaching18" name="coaching18" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb18" id="completed18"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P18" qst="coaching-timestamp-2"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-244" id="comment18" name="comment18" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr class="hide-nghp" style="display:none;">
                        <td>1.19 - NGHP: Appeal type(s) not acknowledged on Interview Page
                          <br />a. NGHP - Incorrect appeal type or not all Appeal type(s) acknowledged on Interview Page  
                        </td>
                          <td>16</td>
                          <td class="disposition">
                            <span class="mon-answer">
                              <select class="cheapscore qst" qst="Q3" score="16">
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
                                  <tr class="coaching-row">
                                      <td>
                                          <textarea class="qst qst-coaching-comments" qst="coaching-desc-3"  id="coaching19" name="coaching19" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                      </td>
                                      <td style="width:30%">
                                          <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb19" id="completed19"/>
                                          <input disabled="disabled"class="qst qst-coaching-timestamp" id="P19" qst="coaching-timestamp-3"/>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <textarea class="qst qst-comments"  qst="comments-3" id="comment19" name="comment19" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()" ng-modelHOLD="f.Comment" ></textarea>
                          </td>
                      </tr>                      
                      <tr class="hide-nghp" style="display:none;">
                        <td>1.20 - NGHP: Disassociating claim lines that the debtor is taking responsibility for</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q8" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-8"  id="coaching20" name="coaching20" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb20" id="completed20"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P20" qst="coaching-timestamp-8"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-8" id="comment20" name="comment20" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>                      
                      <tr class="hide-nghp" style="display:none;">
                        <td>1.21 - NGHP: Duplicate letters<br />
                        NGHP: More than one Redetermination Decision Letter that was issued (not pertaining to a reopening). 
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q31" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-31"  id="coaching21" name="coaching21" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb21" id="completed21"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P21" qst="coaching-timestamp-31"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-31" id="comment21" name="comment21" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>                       
                      <tr class="hide-nghp" style="display:none;">
                        <td>1.22 - NGHP: 
                          <br />a. Additional claims were added by the system prior to demand resulting in 150% or more requiring a new CPN or less than 150%, requiring a Demand
                          <br />b. Claims added were outside the RAC Lookback range
                        </td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q40" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-40"  id="coaching22" name="coaching22" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb22" id="completed22"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P22" qst="coaching-timestamp-40"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-40" id="comment22" name="comment22" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr>
                        <td>1.23 - Portal or Paper Appeal/Dispute/Defense that deemed valid was not disassociated/dispositioned</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q45" score="16">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-45"  id="coaching46" name="coaching46" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb46" id="completed46"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P46" qst="coaching-timestamp-45"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-45" id="comment46" name="comment46" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>                                           
                      <tr>
                        <td>1.24 - Other</td>
                        <td>16</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q42" score="16" id="setHold1">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-42"  id="coaching23" name="coaching23" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb23" id="completed23"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P23" qst="coaching-timestamp-42"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-42" id="comment23" name="comment23" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                    </table>
                  </th>
                </tr>  
              </tr>
            </tbody>
            <tbody class="tbl-CaseLevel">
              <tr>
                <th rowspan="2" style="background-color: #0094b5;width:150px">Case Level
                  <br /><br />
                  <span>Score=</span><span class="qst" qst="CaseLevelScore" id="CaseLevelScore">100%</span>
                  <br /><br />
                  <span class="qst" qst="CaseLevelFindings" id="CaseLevelFindings">Findings=0</span>
                </th>  
                <tr>
                  <th colspan="5" style="background:#0094b5;">
                    <table class="tbl-resize-sm">  
                      <tr style="position:sticky;top:0;">
                        <td style="background-color: #0094b5;">Checklist</td>
                        <td style="background-color: #0094b5;">Points</td>
                        <td style="background-color: #0094b5;">Disposition</td>
                        <td class="coaching-col show-coaching" style="display:none;background-color: #0094b5;">Coaching</td>
                        <td style="background-color: #0094b5;">Comments</td>                        
                      </tr>            
                      <tr>
                        <td style="width:40%;">2.1 - Notes missing minor required elements
                          <br />a.  Minor note requirements mising (such as DCN#, receipt date, case type)</td>
                        <td style="width:5%;">6</td>
                        <td class="disposition" style="width:15%;">
                          <span class="mon-answer" style="width:10%;">
                            <select class="cheapscore qst" qst="Q9" score="6" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-9"  id="coaching24" name="coaching24" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb24" id="completed24"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P24" qst="coaching-timestamp-9"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-9" id="comment24" name="comment24" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.2 - HIGLAS, no notes or placed on incorrect record that does not support cascade feature.
                        </td>
                        <td>6</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q11" score="6" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-11" id="coaching25" name="coaching25" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb25" id="completed25"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P25" qst="coaching-timestamp-11"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-11" id="comment25" name="comment25" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.3 - Incorrect closure of the work item disposition code(s) such as, work-sub type, letter type, closure code, etc.
                        For example, the wrong closure code which resulted in an erroneous alert, however, decision letter was still mailed. 
                        </td>
                        <td>6</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q12" score="6" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-12"  id="coaching26" name="coaching26" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb26" id="completed26"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P26" qst="coaching-timestamp-12"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-12" id="comment26" name="comment26" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.4 - Other</td>
                        <td>6</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q43" score="6" id="setHold2">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-43" id="coaching27" name="coaching27" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb27" id="completed27"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P27" qst="coaching-timestamp-43"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-43" id="comment27" name="comment27" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.5 - Incorrect spelling or grammar in manual letter</td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q15" score="12" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-15" id="coaching28" name="coaching28" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb28" id="completed28"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P28" qst="coaching-timestamp-15"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-15" id="comment28" name="comment28" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.6 - Wrong information included in manual letter
                            For example, (Essential dates such as demand date, letter date, DOI, next interest accrual date, check number, balance due, check receipt date, etc.)
                        </td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q16" score="12" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-16" id="coaching29" name="coaching29" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb29" id="completed29"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P29" qst="coaching-timestamp-16"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-16" id="comment29" name="comment29" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.7 - Not including required attachments/enclosure
                            For example, claim summary form, payment summary form, or other required attachments.
                        </td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q17" score="12" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-17" id="coaching30" name="coaching30" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb30" id="completed30"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P30" qst="coaching-timestamp-17"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-17" id="comment30" name="comment30" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.8 - Incorrect claim(s) disposition code used.
                          <br />a. Valid for DCC but positioned as valid DPP
                          <br />b. Missing insured paid information
                          <br />c. Incorrect Adjustment type use
                          <br />d. Incorrect/No adjustment reason and or comments entered
                          <br />e. Missing/Incorrect disposition code (code to tell the debtor what is needed to make the claim line valid)
                          <br />f. Claims disassociated with the incorrect codes
                          <br />g. Incorrect case status or status not updated
                        </td>
                        <td>6</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q10" score="6" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-10" id="coaching31" name="coaching31" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb31" id="completed31"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P31" qst="coaching-timestamp-10"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-10" id="comment31" name="comment31" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr> 
                      <tr class="hide-ghp" style="display:none;">
                        <td>2.9 - GHP: If wrong information was entered for the DPP</td>
                        <td>6</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q14" score="6" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-14" id="coaching32" name="coaching32" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb32" id="completed32"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P32" qst="coaching-timestamp-14"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-14" id="comment32" name="comment32" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr class="hide-ghp" style="display:none;">
                        <td>2.10 - GHP: If the DPP information was entered but not sent to CWF or No DPP info entered</td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q18" score="12" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-18" id="coaching33" name="coaching33" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb33" id="completed33"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P33" qst="coaching-timestamp-18"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-18" id="comment33" name="comment33" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>                    
                      <tr class="hide-nghp" style="display:none;">
                        <td>2.11 - NGHP: Updating Decision Tab
                          <br />a.	When the previous decision is being updated. For example, from unfavorable to favorable. Especially when a Reopening or QIC decision has been exercised. 
                        </td>
                        <td>6</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q13" score="6" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-13" id="coaching34" name="coaching34" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb34" id="completed34"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P34" qst="coaching-timestamp-13"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-13" id="comment34" name="comment34" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr class="hide-nghp" style="display:none;">
                        <td>2.12 - NGHP: Entity that does have access to the beneficiary data but is not customarily copied on the response letter. For example, a beneficiary attorney, or an entity that was authorized pre-demand, but not post-demand. They do get copied on certain letters</td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q19" score="12" af="N">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-19" id="coaching35" name="coaching35" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb35" id="completed35"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P35" qst="coaching-timestamp-19"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-19" id="comment35" name="comment35" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr class="hide-nghp" style="display:none;">
                        <td>2.13 - NGHP: Not closing parent/child cases in the event of Benefits Exhaustion, deletion, etc..:</td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q46" score="12">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-46" id="coaching47" name="coaching47" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb47" id="completed47"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P47" qst="coaching-timestamp-46"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-46" id="comment47" name="comment47" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                      <tr>
                        <td>2.14 - Other</td>
                        <td>12</td>
                        <td class="disposition">
                          <span class="mon-answer">
                            <select class="cheapscore qst" qst="Q44" score="12" id="setHold3">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-44" id="coaching36" name="coaching36" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb36" id="completed36"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P36" qst="coaching-timestamp-44"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments"  qst="comments-44" id="comment36" name="comment36" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>  
                    </table>
                  </th>
                </tr>  
              </tr>
            </tbody>
            <tbody class="tbl-CRCResponse">  
              <tr>
                <th rowspan="2" style="background-color: rgb(255, 166, 49);">CRC Response Letter Not Sent</th>  
                  <tr>
                    <th colspan="5" style="background:rgb(255, 166, 49);">
                      <table style="height:auto;overflow-y:scroll;display:block;overflow: hidden;">
                        <tr style="position:sticky;top:0;">
                          <td style="background:rgb(255, 166, 49);">Checklist</td>
                          <td style="background:rgb(255, 166, 49);">Points</td>
                          <td style="background:rgb(255, 166, 49);">Disposition</td>
                          <td class="coaching-col show-coaching" style="display:none;background:rgb(255, 166, 49);">Coaching</td>
                          <td style="background:rgb(255, 166, 49);">Comments</td>                        
                        </tr>                        
                        <tr>                      
                          <td style="width:40%;">3.1 - Not sending a CRC decision letter (this does not include the accompanying letter such as: OCR, Excess Funds, payment acknowledgments, QIC and ALJ Responses.)</td>
                          <td style="width:5%;">AF</td>
                          <td class="disposition" style="width:15%;">
                            <span class="mon-answer" style="width:10%;">
                              <select class="cheapscore qst" qst="Q22" score="0" af="Y">
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
                                  <tr class="coaching-row">
                                      <td>
                                          <textarea class="qst qst-coaching-comments" qst="coaching-desc-22" id="coaching37" name="coaching37" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                      </td>
                                      <td style="width:30%">
                                          <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb37" id="completed37"/>
                                          <input disabled="disabled"class="qst qst-coaching-timestamp" id="P37" qst="coaching-timestamp-22"/>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <textarea class="qst qst-comments" qst="comments-22" id="comment37" name="comment37" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                          </td>
                        </tr>
                        <tr>
                          <td>3.2 - HIGLAS alert not addressed and outbound response letter not generated.</td>
                          <td>AF</td>
                          <td class="disposition">
                            <span class="mon-answer">
                              <select class="cheapscore qst" qst="Q25" score="0" af="Y">
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
                                  <tr class="coaching-row">
                                      <td>
                                          <textarea class="qst qst-coaching-comments" qst="coaching-desc-25" id="coaching38" name="coaching38" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                      </td>
                                      <td style="width:30%">
                                          <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb38" id="completed38"/>
                                          <input disabled="disabled"class="qst qst-coaching-timestamp" id="P38" qst="coaching-timestamp-25"/>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <textarea class="qst qst-comments" qst="comments-25" id="comment38" name="comment38" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                          </td>
                        </tr>
                        <tr>
                          <td>3.3 - Did not generate letter based on sender's request.
                          For example, the sender requested a demand, and the demand was not issued, the work item was noted and closed with no action taken.
                          There may be times when a case worker exercises a best judgment when issuing a CRC response letter. If the case worker issues a letter other than what is being requested from the sender, a note must be present in BCRS explaining in detail why. 
                          </td>
                          <td>AF</td>
                          <td class="disposition">
                            <span class="mon-answer">
                              <select class="cheapscore qst" qst="Q26" score="0" af="Y">
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
                                  <tr class="coaching-row">
                                      <td>
                                          <textarea class="qst qst-coaching-comments" qst="coaching-desc-26" id="coaching39" name="coaching39" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                      </td>
                                      <td style="width:30%">
                                          <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb39" id="completed39"/>
                                          <input disabled="disabled"class="qst qst-coaching-timestamp" id="P39" qst="coaching-timestamp-26"/>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <textarea class="qst qst-comments" qst="comments-26" id="comment39" name="comment39" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                          </td>
                        </tr>
                        <tr class="hide-nghp" style="display:none;">
                          <td>3.4 - NGHP: When a demand needs to be generated and it was not when there is a remaining overpayment amount that relates to the original CPN amount.</td>
                          <td>AF</td>
                          <td class="disposition">
                            <span class="mon-answer">
                              <select class="cheapscore qst" qst="Q23" score="0" af="Y">
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
                                  <tr class="coaching-row">
                                      <td>
                                          <textarea class="qst qst-coaching-comments" qst="coaching-desc-23" id="coaching40" name="coaching40" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                      </td>
                                      <td style="width:30%">
                                          <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb40" id="completed40"/>
                                          <input disabled="disabled"class="qst qst-coaching-timestamp" id="P40" qst="coaching-timestamp-23"/>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <textarea class="qst qst-comments" qst="comments-23" id="comment40" name="comment40" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                          </td>
                        </tr>
                        <tr class="hide-nghp" style="display:none;">
                          <td>3.5 - NGHP: Incorrect Case Status code when a CP is required</td>
                          <td>AF</td>
                          <td class="disposition">
                            <span class="mon-answer">
                              <select class="cheapscore qst" qst="Q24" score="0" af="Y">
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
                                  <tr class="coaching-row">
                                      <td>
                                          <textarea class="qst qst-coaching-comments" qst="coaching-desc-24" id="coaching41" name="coaching41" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                      </td>
                                      <td style="width:30%">
                                          <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb41" id="completed41"/>
                                          <input disabled="disabled"class="qst qst-coaching-timestamp" id="P41" qst="coaching-timestamp-24"/>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                          <td>
                            <textarea class="qst qst-comments" qst="comments-24" id="comment41" name="comment41" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                          </td>
                        </tr>
                      </table>
                    </th>
                  </tr>
                </th> 
              </tr>
            </tbody>
            <tbody class="tbl-PHI">
              <tr>
                <th rowspan="2" style="background-color: #e8f000;">PHI Violation</th>  
                <tr>
                  <th colspan="5" style="background:#e8f000;">
                    <table style="height:auto;overflow-y:scroll;display:block;overflow: hidden;">
                      <tr style="position:sticky;top:0;">
                        <td style="background:#e8f000;">Checklist</td>
                        <td style="background:#e8f000;">Points</td>
                        <td style="background:#e8f000;">Disposition</td>
                        <td class="coaching-col show-coaching" style="display:none;background:#e8f000;">Coaching</td>
                        <td style="background:#e8f000;">Comments</td>                        
                      </tr>                        
                      <tr>
                        <td style="width:40%;">4.1 - Example, this would be a situation where the CRC provides information to an entity that should not have access to the beneficiary data</td>
                        <td style="width:5%">AF</td>
                        <td class="disposition" style="width:15%">
                          <span class="mon-answer" style="width:10%">
                            <select class="cheapscore qst" qst="Q27" score="0" af="Y">
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
                                <tr class="coaching-row">
                                    <td>
                                        <textarea class="qst qst-coaching-comments" qst="coaching-desc-27" id="coaching42" name="coaching42" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                                    </td>
                                    <td style="width:30%">
                                        <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb42" id="completed42"/>
                                        <input disabled="disabled"class="qst qst-coaching-timestamp" id="P42" qst="coaching-timestamp-27"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td>
                          <textarea class="qst qst-comments" qst="comments-27" id="comment42" name="comment42" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                        </td>
                      </tr>
                    </table>
                  </th>
                </tr> 
              </tr>                                                  
            </tbody>
            <tbody class="tbl-cplb" style="display:none;">
              <tr>
                <td rowspan="4">Checklist</td>
                <td>Correspondence index to the incorrect Beneficiary</td>
                <td>AF</td>
                <td class="disposition">
                  <span class="mon-answer-cplb">
                    <select class="cheapscore qst" qst="CorrIndex" score="0" af="Y">
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
                        <tr class="coaching-row">
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-CorrIndex" id="coaching43" name="coaching43" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb43" id="completed43"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P43" qst="coaching-timestamp-CorrIndex"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                  <textarea class="qst qst-comments" qst="comments-CorrIndex" id="comment43" name="comment43" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td>Incorrect work Type</td>
                <td>50</td>
                <td class="disposition">
                  <span class="mon-answer-cplb">
                    <select class="cheapscore qst" qst="IncWorkType" score="50" af="N">
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
                        <tr class="coaching-row">
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-IncWorkType" id="coaching44" name="coaching44" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb44" id="completed44"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P44" qst="coaching-timestamp-IncWorkType"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                  <textarea class="qst qst-comments" qst="comments-IncWorkType" id="comment44" name="comment44" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>
              <tr>
                <td>Incorrect Case ID/DOI</td>
                <td>50</td>
                <td class="disposition">
                  <span class="mon-answer-cplb">
                    <select class="cheapscore qst" qst="IncCaseID" score="50" af="N">
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
                        <tr class="coaching-row">
                            <td>
                                <textarea class="qst qst-coaching-comments" qst="coaching-desc-IncCaseID" id="coaching45" name="coaching45" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                            </td>
                            <td style="width:30%">
                                <input type="checkbox" class="qst coaching-completed-checkbox" qst="coachcb45" id="completed45"/>
                                <input disabled="disabled"class="qst qst-coaching-timestamp" id="P45" qst="coaching-timestamp-IncCaseID"/>
                            </td>
                        </tr>
                    </table>
                </td>
                <td>
                  <textarea class="qst qst-comments" qst="comments-IncCaseID" id="comment45" name="comment45" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" type="text"  ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                </td>
              </tr>                                                    
            </tbody>            
            <tfoot>
              <tr>
                <td>
                  <td class="ac-score" qst="ac-score" style="display:none;"></td>
                  <td style="font-size:16px;text-align: center;font-weight: bold;">Score: &nbsp; </td>
                  <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;display:none;" onMouseOver="this.style.color='#000000'" class="show-score mon-sys-score"></td>
                  <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;display:none;" class="show-scorecplb mon-sys-score-cplb"></td>
                  <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;display:none;" onMouseOver="this.style.color='#000000'" class="show-disp mon-sys-autofail"></td>
                  <td style="font-size:16px;text-align: center;background-color:White;font-weight: bold;display:none;" class="show-dispcplb mon-sys-autofail"></td>
                  <td></td>
                </td>
              </tr>
              <tr>
                <td colspan="5" style="text-align: center;vertical-align:middle;padding:20px;">
                  <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Save Monitor" style="margin-right:10px;" />
                  <asp:Button id="deleteme" runat="server" class="mon-delete" hidden="true" type="submit" Text="Delete"  style="margin-right:10px;" />
                  <asp:Button id="closeme" runat="server" class="mon-close" hidden="true" type="submit" Text="Close" />

                  <div style="float:left;margin-left:40px;">
                    <asp:Button id="coachme" runat="server" class="mon-coaching" hidden="true" type="submit" Text="Submit Coaching" />
                  </div>
                  <table class="monitor-table ui-ecodes" style="display:none;">
                    <tfoot class="ecodebase">
                      <tr>
                        <td>
                          <div qst="AuditedSelectRowCount" class="mon-show-reviewnotes" style="text-align:center;width:1200px;">
                            <br /><b>Review Notes (visible to everyone)</b>
                            <textarea class="qst qst-comments mon-field-reviewnotes" qst="ReviewNotes" type="text" style="margin:10px;width:100%;height:50px;" ng-disabled="readonly()" ng-modelHOLD="f.Comment" placeholder="Review Notes"></textarea>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <div class="mon-show-qanotes" style="display:none;text-align:center;width:1200px;border:1px;">
                    <br />
                    <span style="display:none"><b>QA Notes (visible only to QAs and Admins)</b></span>
                    <textarea class="qst qst-comments mon-field-qanotes" qst="QANotes" type="text" style="display:none;margin:10px;width:100%;height:30px;border:1px;" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" placeholder="QA Notes"></textarea>
                    <input type="checkbox" class="mon-sys-hold qst" qst="holdBtn" value="hold" style="display:none;" />
                    <span style="font-size:12px;"><b>Place Monitor on HOLD</b></span>
                    <textarea class="qst qst-comments mon-field-reasonnotes" qst="ReasonNotes" disabled="disabled" type="text" style="margin:10px;width:100%;height:30px;border:1px;" placeholder="Hold/Release Notes"></textarea>
                    <br /><br />

                    <div>
                      <span><strong>Entered Date: </strong></span>
                      <input id="inputEnteredDate" type="text" class="qst mon-field-entereddate" qst="EnteredDate" value="" disabled />
                    </div>

                    <div style="display:none;">
                      <span><strong>Release Date: </strong></span>
                      <input id="inputReleaseDate" runat="server" type="text" class="qst mon-field-releasedate" qst="ReleaseDate" value="2020-03-16 09:00" disabled />
                      <input type="text" id="lblNextMonday" runat="server" style="display:none;" value="2020-03-16 09:00" />
                      <input type="text" id="lblToday" runat="server" style="display:none;" value="2020-03-16 09:00" />
                    </div>
                  </div>
                  <div class="mon-show-nonqa" style="display:none;margin:5px;text-align: center;">
                    Monitor Released: <span class="mon-show-release-date">DateHere</span>
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttal-block">
                <td colspan="2" style="text-align: right;"><b>Rebuttal:</b><br />Please enter notes here for review by QA:</td>
                <td colspan="2">
                  <textarea class="qst qst-comments mon-field-rebuttal" qst="Rebuttal" type="text" id="commentRebuttal-a" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalshow" style="display:none;">Rebuttal Entered By:
                    <input class="qst mon-sys-rebuttal-stash" qst="RebuttalMgr" ng-model="f.lettertypeselection" disabled/>                    
                    <input type="text" class="qst qst-rebuttal-timestamp" qst="RebuttalTS" disabled />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">
                    <asp:Button id="rebuttalme" runat="server" class="mon-rebuttal" hidden="true" type="submit" Text="Submit Rebuttal" />
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttalresponse-block">
                <td colspan="2" style="text-align: right;"><b>Rebuttal Response:</b><br />As the QA, please enter your response to the rebuttal shown above:</td>
                <td colspan="2" style="background: white;">
                  <textarea class="qst qst-comments mon-field-rebuttalresponse" qst="RebuttalResponse" id="commentRebuttalResponse-a" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalresponseshow" style="display:none;">Response Entered By:
                    <input class="qst mon-sys-rebuttalresponseshow mon-sys-rebuttalresponse-stash" qst="RebuttalResponseQA" style="display:none;" ng-model="f.lettertypeselection" />
                    <input type="text" class="qst qst-rebuttal-response-timestamp" qst="RebuttalResponseTS" disabled />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">

                    <select class="mon-sys-rebuttalresponsesuccess qst" qst="RebuttalResponseSuccess">
                      <option selected="selected" value="">--Select Outcome--</option>
                      <option value="Approved1">Approved 1</option>
                      <option value="Denied1">Denied 1</option>
                      <option value="Dismissed">Dismissed</option>
                      <option value="PartiallyApproved1">Partially Approved 1</option>
                      <option value="Yes">Yes</option>
                    </select>

                    <%-- <input type="checkbox" class="mon-sys-rebuttalresponsesuccess qst" qst="RebuttalResponseSuccess" /> Rebuttal resulted in a change in scoring. --%>
                    
                    <br /><br />
                    <asp:Button id="rebuttalresponseme" runat="server" class="mon-rebuttalresponse" hidden="true" type="submit" Text="Submit Rebuttal Response" />
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttal-block-b" style="display:none;" disabled>
                <td colspan="2" style="text-align: right;"><b>Rebuttal - level 2:</b><br />Please enter notes here for review by QA:</td>
                <td colspan="2">
                  <textarea class="qst qst-comments mon-field-rebuttal-b" qst="Rebuttal-b" type="text" id="commentRebuttal-b" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalshow-b" style="display:none;">Rebuttal - level 2 Entered By:
                    <input class="qst mon-sys-rebuttalshow-b mon-sys-rebuttal-stash-b" qst="RebuttalMgr-b" style="display:none;" ng-model="f.lettertypeselection" />
                    <input type="text" class="qst qst-rebuttal-timestamp-b" qst="RebuttalTS-b" disabled />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">
                    <asp:Button id="rebuttalmeb" runat="server" class="mon-rebuttal-b" hidden="true" type="submit" Text="Submit Rebuttal - level 2" />
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttalresponse-block-b" style="display:none;">
                <td colspan="2" style="text-align: right;"><b>Rebuttal Response - level 2:</b><br />As the QA, please enter your response to the rebuttal shown above:</td>
                <td colspan="2" style="background: white;">
                  <textarea class="qst qst-comments mon-field-rebuttalresponse-b" qst="RebuttalResponse-b" id="commentRebuttalResponse-b" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalresponseshow-b" style="display:none;">Response - level 2 Entered By:
                    <input class="qst mon-sys-rebuttalresponseshow-b mon-sys-rebuttalresponse-stash-b" qst="RebuttalResponseQA-b" style="display:none;" ng-model="f.lettertypeselection" />
                    <input type="text" class="qst qst-rebuttal-response-timestamp-b" qst="RebuttalResponseTS-b" disabled />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">

                    <select class="mon-sys-rebuttalresponsesuccess-b qst" qst="RebuttalResponseSuccess-b">
                      <option selected="selected" value="">--Select Outcome--</option>
                      <option value="Approved2">Approved 2</option>
                      <option value="Denied2">Denied 2</option>
                      <option value="Dismissed">Dismissed</option>
                      <option value="PartiallyApproved2">Partially Approved 2</option>
                      <option value="Yes">Yes</option>
                    </select>

                    <%-- <input type="checkbox" class="mon-sys-rebuttalresponsesuccess-b qst" qst="RebuttalResponseSuccess-b" /> Rebuttal resulted in a change in scoring. --%>
                    
                    <br /><br />
                    <asp:Button id="rebuttalresponsemeb" runat="server" class="mon-rebuttalresponse-b" hidden="true" type="submit" Text="Submit Rebuttal Response - level 2" />
                  </div>
                </td>
              </tr>
              <tr class="mon-rebuttal-block-c" style="display:none;">
                <td colspan="2" style="text-align: right;"><b>Rebuttal - level 3:</b><br />Please enter notes here for review by QA:</td>
                <td colspan="2">
                  <textarea class="qst qst-comments mon-field-rebuttal-c" qst="Rebuttal-c" type="text" id="commentRebuttalResponse-c" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalshow-c" style="display:none;">Rebuttal - level 3 Entered By:
                    <input class="qst mon-sys-rebuttalshow-c mon-sys-rebuttal-stash-c" qst="RebuttalMgr-c" style="display:none;" ng-model="f.lettertypeselection" />
                    <input type="text" class="qst qst-rebuttal-timestamp-c" qst="RebuttalTS-c" disabled />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">
                    <asp:Button id="rebuttalmec" runat="server" class="mon-rebuttal-c" hidden="true" type="submit" Text="Submit Rebuttal - level 3" />
                  </div>  
                </td>
              </tr>
              <tr class="mon-rebuttalresponse-block-c" style="display:none;">
                <td colspan="2" style="text-align: right;"><b>Rebuttal Response - level 3:</b><br />As the QA, please enter your response to the rebuttal shown above:</td>
                <td colspan="2" style="background: white;">
                  <textarea class="qst qst-comments mon-field-rebuttalresponse-c" qst="RebuttalResponse-c" id="commentRebuttal-c" onpaste="handlePaste(event)" onkeyup="this.value = replaceSpecialChars(this.value)" data-resizable="true" type="text" ng-disabled="readonly()"  ng-modelHOLD="f.Comment" ></textarea>
                  <div class="mon-sys-rebuttalresponseshow-c" style="display:none;">Response - level 3 Entered By:
                    <input class="qst mon-sys-rebuttalresponseshow-c mon-sys-rebuttalresponse-stash-c" qst="RebuttalResponseQA-c" style="display:none;" ng-model="f.lettertypeselection" />
                    <input type="text" class="qst qst-rebuttal-response-timestamp-c" qst="RebuttalResponseTS-c" disabled />
                  </div>
                </td>
                <td>
                  <div style="float:left;margin-left:5px;">

                    <select class="mon-sys-rebuttalresponsesuccess-c qst" qst="RebuttalResponseSuccess-c">
                      <option selected="selected" value="">--Select Outcome--</option>
                      <option value="Approved3">Approved 3</option>
                      <option value="Denied3">Denied 3</option>
                      <option value="Dismissed">Dismissed</option>
                      <option value="PartiallyApproved3">Partially Approved 3</option>
                      <option value="Yes">Yes</option>
                    </select>

                    <%-- <input type="checkbox" class="mon-sys-rebuttalresponsesuccess-c qst" qst="RebuttalResponseSuccess-c" /> Rebuttal resulted in a change in scoring. --%>
                    
                    <br /><br />
                    <asp:Button id="rebuttalresponsemec" runat="server" class="mon-rebuttalresponse-c" hidden="true" type="submit" Text="Submit Rebuttal Response - level 3" />
                  </div>
                </td>
              </tr>              
              <tr>
                <td colspan="5"><p><b>Show Coaching: </b><br /><input class="qst" qst="CoachCb" type="checkbox" id="coachingCheckBox"/></p></td>
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
            <tr>
              <td>
                <input type="text" class="qst-monitortype qst" qst="monitortype" value="" hidden />
              </td>
            </tr>
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
          </div>
          <div style="display:none;">
            <asp:Label ID="lblModeb" runat="server"></asp:Label>
            <asp:Label ID="lblMonitorIdb" runat="server"></asp:Label>
            <asp:Label ID="lblAcknowledgementRequiredb" runat="server"></asp:Label>
          </div>
          <div style="display:none;">
            <asp:Label ID="lblModec" runat="server"></asp:Label>
            <asp:Label ID="lblMonitorIdc" runat="server"></asp:Label>
            <asp:Label ID="lblAcknowledgementRequiredc" runat="server"></asp:Label>
          </div>
          
        </div>
      </div>
    </form>
    <script type="text/javascript" src="./Monitor_Coaching_Correspondence_Process_Lockbox_v2.js?r=36W55" language="javascript"></script>
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

      function replaceSpecialChars(input) {
        return input.replace(/[#+=\t@&*<>`'";:^{}\[\]|~\b\t\n\v\f\r\u0085\u2026]|\.{3}/g, ' ');
      }
      
      function handlePaste(event) {
        event.preventDefault();
        let pastedData = event.clipboardData.getData('text');
        let sanitizedData = replaceSpecialChars(pastedData);
      
        let textarea = event.target;
        let startPos = textarea.selectionStart;
        let endPos = textarea.selectionEnd;
      
        textarea.value = textarea.value.slice(0, startPos) + sanitizedData + textarea.value.slice(endPos);
      
        textarea.selectionStart = textarea.selectionEnd = startPos + sanitizedData.length;
      }

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
