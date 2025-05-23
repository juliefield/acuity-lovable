<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_IQA.aspx.cs" ValidateRequest="false" Inherits="_Monitor_IQA" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
  IndianRed #0091D0
  LightaPink #965BA5
  SkayBlue #18bba2
  Mageanta #e04984
  -->
<html xmlns="http://www.w3.org/1999/xhtml">
  <head runat="server">
    <title>QA Scorecard</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>

    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/print.css") %>" media="print" />

    <style type="text/css">
      .page-wrapper {
        width: 100%;
        margin: 0px auto 0 auto;
        position: relative;
        border: 1px solid gray;
      }
      .error-category,
      .error-anchor {
      /*        vertical-align: middle;*/
      }
      .emergency 
      {
          display:block;
          margin-top: 75px;
          margin-left: 300px;
          font-weight: normal;
      }
      .mon-category {
        font-size: 14px;
        font-weight: bold;
        border-bottom: 2px;
        padding: 5px;
        background-color: #15323E;
        color: White;
        border-left: 0px !important;
        border-right: 0px !important;
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        border-color: #15323E !important;
      }
      .mon-wrapper {
        position: relative;
      }
      .mon-stats {
        position: absolute;
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
        float: right;
      }
      .mon-content {
        position: relative;
        padding: 10px;
        margin-top: 10px;
        width: 100%;
        /* overflow-y:scroll; */
      }
      .mon-content li {
        padding: 5px;
      }
      .mon-answer {
        float: right;
        padding-right: 300px;
      }
      .mon-subtotal {
        width: 40px;
        float: right;
        text-align: right;
        color: Blue;
        font-weight: bold;
        font-size: 20px;
        vertical-align: middle;
      }
      .mon-submit {
        clear: both;
      }
      .mon-comments {
        clear: both;
      }
      .mon-comments label {
        vertical-align: middle;
      }
      .mon-comments textarea {
        margin-left: 10px;
        vertical-align: middle;
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
        color: White;
        float: left;
      }
      .mon-field-input,
      .mon-field select {
        width: 120px;
        padding-right: 5px;
        float: right;
      }
      .mon-table tbody td:first-child {
        border-color: #fff;
      }
      input.qst {
        width: 80%;
        margin: 0 auto;
      }
      .sel_time {
        width: 30px;
      }
      .mon-address textarea {
        margin-left: 0px;
      }
      .mon-question {
      /* font-weight: bold; */
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
      .highlight {
        background: green;
        color: white;
      }
      .mon-table {
        font-weight: normal;
        font-size: 13px;
        width: 100%;
        border-spacing: 0;
      }
      .mon-table tbody {
        display: block;
        overflow-y: scroll;
      }
      .mon-table tbody td {
        min-height: 14px;
        border-bottom: 1px solid #ddd;
        padding: 5px;
      }
      .mon-table thead {
        display: block;
        overflow-y: scroll;
        font-size: 12px;
      }
      .mon-table tbody tr:nth-child(odd) {
        background: #F8FAFC;
      }
      .mon-table tbody tr.last-row {
        background: #0091D0;
        color: White;
        font-weight: bold;
        border-color: #0091D0;
        font-size: 16px;
      }
      .mon-table tbody tr.last-row td {
        background: #0091D0;
        color: White;
        font-weight: bold;
        border-color: #0091D0;
        padding: 20px 10px 100px 30px;
      }
      .mon-table td {
        border: 0px;
        margin: 0px;
        padding: 1px 0 1px 0;
      }
      .mon-table tbody td:last-child {
        border-left: 1px solid #ddd;
        border-right: 1px solid #ddd;
        text-align: center;
      }
      .mon-table select {
        width: 80%;
        margin: 0 auto;
      }
      .mon-table input[type=text],
      .mon-table textarea {
        width: 98%;
      }
      .mon-table textarea {
        font-size: 13px;
        padding: 8px;
        border: none;
        height: 60px;
      }
      .mon-table-header {
        text-align: left;
      }
      .mon-table-header thead {
        padding: 15px;
      }
      .mon-table-columnheader {
        background-color: #15323E;
        color: White;
        font-weight: normal;
      }
      .mon-table-columnheader th {
        padding: 10px 5px;
        font-size: 14px;
      }
      .sel-red {
        background-color: #C42020;
        color: white !important;
      }
      .sel-green {
        background-color: #7ED321;
      }
      .sel-yellow {
        background-color: #eee;
      }
      .sel-autofail {
        background-color: #FFDE05;

        font-weight: bold;
        border: 1px solid black;
      }
      .centered {
        text-align: center;
      }
      .mon-close {
        background: none;
        color: white;
        border: none;
        font-size: 12px;
        text-decoration: underline;
        position: relative;
        margin-left: 15px;
      }
      .mon-close:hover,
      .mon-submit:hover {
        cursor: pointer;
      }
      .logo {
        left: 14px !important;
        top: 10px !important;
      }
      input:disabled 
      {
          background-color: #d0d0d0;
      }

    </style>
  </head>
  <body runat="server">
    <form id="Form1" method="post" runat="server">
      <div class="page-wrapper2">
        <div class="page-wrapper">
          <table class="mon-table">
            <thead>
              <tr class="mon-table-header">
                <th rowspan="5" colspan="4" style="width: 55%;">
                  <div class="logo">
                    <h1><span>Acuity &reg;</span></h1>
                  </div>
                  <div class="heading"><label class="display-lblSqfname"></label></div>
                </th>
                <th style="padding-top: 8px;">Agent Name</th>
                <th colspan="3" class="mon-sys-AgentName">
                  <asp:Label id="lblAgentName" runat="server"></asp:Label>
                  <asp:Label style="display:none;" id="lblAgent" runat="server"></asp:Label>
                </th>
                <th></th>
                <th></th>
              </tr>
              <tr class="mon-table-header">
                <th>Call ID</th>
                <th colspan="3" class="mon-sys-Callid">
                  <asp:Label ID="lblCallid" runat="server"></asp:Label>
                </th>
                <th></th>
                <th></th>
              </tr>
              <tr class="mon-table-header">
                <th>Account ID</th>
                <th><input type="text" class="qst qst-spectrum-number" qst="Account ID" /></th>
                <th></th>
                <th>
                  <div class="mon-show-acknowledgementrequired" style="display:none;border: 2px solid red;padding:8px;">
                    <span class="mon-show-isagent" style="font-weight:bold;display:none;">
                      <br />Click the button below to acknowledge<br />that you have seen this monitor.<br />
                      <br />
                      <asp:Button id="acknowledgeme" runat="server" class="mon-acknowledge" type="submit" Text="Acknowledge Monitor" />
                    </span>
                    <span class="mon-show-isnotagent" style="color:Red;display:none;">The agent must log in to acknowledge this monitor.</span>
                  </div>
                  <span class="mon-show-acknowledgementreceived" style="display:none;">
                    This monitor was acknowledged by the Agent:
                    <asp:Label ID="lblAcknowledgementDate" runat="server"></asp:Label>
                  </span>
                </th>
              </tr>
              <tr class="mon-table-header">
                <th style="padding-bottom: 10px;">Date & Time</th>
                <th colspan="3" class="mon-sys-Calldate">
                  <asp:Label ID="lblCalldate" runat="server"></asp:Label>
                </th>
                <th></th>
                <th></th>
              </tr>
              <tr>
                <th style="background-color:#EEA900;text-align: left;padding-left: 10px;">Quality Score</th>
                <th style="background-color:#EEA900;" class="mon-sys-score"></th>
                <th></th>
                <th style="text-align: left;font-style: italic;padding-bottom: 8px;padding-top: 8px;">
                  <span>
                    Evaluated On:
                    <span class="mon-sys-Entdt">
                        <asp:Label ID="lblCurrentDate" runat="server"></asp:Label>
                    </span>
                  </span>
                </th>
              </tr>
              <tr class="mon-table-columnheader">
                <th style="width:10%">Section</th>
                <th style="width:5%">S.No.</th>
                <th style="width:5%">Criteria</th>
                <th style="width:35%">Sub-Criteria</th>
                <th style="width:10%">Points Available</th>
                <th style="width:10%">Scoring</th>
                <th style="width:1%">&nbsp;</th>
                <!-- <th  style="width:24%">Comments</th> -->
                <th  style="width:24%">&nbsp;</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="background-color:#0091D0;color:#fff;width:10%">Compliance</td>
                <td class="centered" style="width:5%">C</td>
                <td style="background-color:#0091D0;color:#fff;width:39%" colspan="2" >Compliance:  1 or more issues: 0</td>
                <td class="centered" style="background-color:#0091D0;color:#fff;width:10%;" >20</td>
                <td style="width:10%;text-align:center;">
                  <input class="qst qst-Compliance-Score" qst="Compliance-Score" />
                </td>
                <!-- <td rowspan="14" style="width:1%"><span class="mon-sys-autofail" style="display:none;"><br />A<br />U<br />T<br />O<br /><br />F<br />A<br />I<br />L</span></td> -->
                <!-- <td style="background-color:#18bba2;width:24%"><input class="qst" qst="C-1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;width:10%">Policy</td>
                <td class="centered" style="width:5%">P</td>
                <td style="background-color:#965BA5;color:#fff;width:39%" colspan="2" >Policy-  1 or more issues: 0</td>
                <td class="centered" style="background-color:#965BA5;color:#fff;width:10%;" >20</td>
                <td style="width:10%;">
                  <input class="qst qst-Policy-Score" qst="Policy-Score" />
                </td>
                <!-- <td style="background-color:#18bba2;width:24%"><input class="qst" qst="C-1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;width:10%">Negotiation</td>
                <td class="centered" style="width:5%">N</td>
                <td style="background-color:#18bba2;width:39%" colspan="2" >Negotiation-  1 or more issues: 0</td>
                <td class="centered" style="background-color:#18bba2;width:10%;" >20</td>
                <td style="width:10%;">
                  <input class="qst qst-Negotiation-Score"  qst="Negotiation-Score" />
                </td>
                <!-- <td style="background-color:#18bba2;width:24%"><input class="qst" qst="C-1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#f5f542;width:10%">Client Specifics</td>
                <td class="centered" style="width:5%">CS</td>
                <td style="background-color:#f5f542;width:39%" colspan="2" >Client Specifics: 1 or more issues: 0</td>
                <td class="centered" style="background-color:#f5f542;width:10%;" >20</td>
                <td style="width:10%;">
                  <input class="qst qst-ClientSpecifics-Score"  qst="ClientSpecifics-Score" />
                </td>
                <!-- <td style="background-color:#18bba2;width:24%"><input class="qst" qst="C-1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;width:10%">Customer Experience</td>
                <td class="centered" style="width:5%">CE</td>
                <td style="background-color:#e04984;color:#fff;width:39%" colspan="2" >Customer Experience- No issues: 20, Up to 2 issues: 10, More than 2 issues: 0</td>
                <td class="centered" style="background-color:#e04984;color:#fff;width:10%;" >20</td>
                <td style="width:10%;">
                  <input class="qst qst-CustEx-Score"  qst="CustEx-Score" />
                </td>
                <!-- <td style="background-color:#18bba2;width:24%"><input class="qst" qst="C-1" type="text" /></td> --> 
              </tr>
              <tr>
                <td class="mon-category" colspan="6"></td>
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-1</td>
                <td></td>
                <td>Did the agent state his/her first and last name at the beginning of the call?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-1">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-2</td>
                <td></td>
                <td>Did the agent provide the Call Quality Monitoring (CQM) Statement at the beginning of the call?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-2">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-3</td>
                <td></td>
                <td>Did the agent confirm the first name, last name, and any suffixes (junior, senior, etc.) of the consumer?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-3">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#0091D0;color:#fff;">Compliance</td>
                <td class="centered" >1-4</td>
                <td></td>
                <td>Did agent avoid disclosing any confidential information to a 3rd party?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-4">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-5</td>
                <td></td>
                <td>Did the agent state the company name?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-5">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td class="mon-category" colspan="6"></td>
              </tr>
              <tr>
                <td style="background-color:#f5f542;color:#0;">Client Specifics</td>
                <td class="centered" >1-6</td>
                <td></td>
                <td>Did the agent state the client name?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-6">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#f5f542;color:#0;">Client Specifics</td>
                <td class="centered" >1-7</td>
                <td></td>
                <td>Did the agent properly verify the consumer's identity (SSN, address, DOB, etc.) according to the client requirements?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-7">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#0091D0;color:#fff;">Compliance</td>
                <td class="centered" >1-8</td>
                <td></td>
                <td>Did the agent state the full Mini Miranda and notify Consumer they are a Debt Collector?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-8">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-9</td>
                <td></td>
                <td>Did the Agent ask what is the best number to call Consumer? Did the Agent obtain a valid email address, mailing address (if return address or no address is on file) & update if provided? (Do not ask for email address on NY Accounts)</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-9">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#0091D0;color:#fff;">Compliance</td>
                <td class="centered" >1-10</td>
                <td></td>
                <td>Did the agent ask if the number is a cell phone and if we have permission to dial the number via an automated dialing system regarding the account? (TCPA-Only if applicable)</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-10">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="No (High Risk)" class="sel-red">No (High Risk)</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td class="mon-category" colspan="6"></td>
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-11</td>
                <td></td>
                <td>Did agent request or state the balance in full (BIF)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-11">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-12</td>
                <td></td>
                <td>Did agent reasonably attempt to follow the negotiation hierarchy? (I.E. If consumer refuses to pay the entire balance today, then the agent should attempt to break the entire balance into multiple payments and/or attempt to offer a settlement.)</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-12">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-13</td>
                <td></td>
                <td>Did the agent obtain a complete financial profile of the consumer (consumer's employment status other expenses that might prevent them from paying the bill, if the consumer may be able to defer another bill to take advantage of a settlement)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-13">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-14</td>
                <td></td>
                <td>Did the Agent explore alternative sources of funds? (i.e., probing tax refund related questions during tax season)</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-14">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-15</td>
                <td></td>
                <td>Did the agent maximize the settlement by not initially offering the lowest settlement rate?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-15">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-16</td>
                <td></td>
                <td>Did the agent establish a timeline for a payment arrangement?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-16">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#18bba2;">Negotiation</td>
                <td class="centered" >1-17</td>
                <td></td>
                <td>Did the agent obtain assistance from another team member if they were unable to overcome consumer objections and/or the agent was unable to provide a satisfactory solution to the consumer?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-17">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td class="mon-category" colspan="6"></td>
              </tr>
              <tr>
                <td style="background-color:#0091D0;color:#fff;">Compliance</td>
                <td class="centered" >1-18</td>
                <td></td>
                <td>Did the agent avoid false or misleading information (FDCPA & UDAAP)? (i.e., telling consumer they can't pay client, explaining credit score impact, incorrect information about number of payments or how/when consumer can pay, etc.)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-18">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="No (High Risk)" class="sel-red">No (High Risk)</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#0091D0;color:#fff;">Compliance</td>
                <td class="centered" >1-19</td>
                <td></td>
                <td>Did agent follow single/multi payment verification script (obtain consumer info & consent, post date disclosure, right to cancel payments, ACH disclosure, confirm on recording, Reg E disclosure, obtain CVV code, etc.)</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-19">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="No (High Risk)" class="sel-red">No (High Risk)</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#0091D0;color:#fff;">Compliance</td>
                <td class="centered" >1-20</td>
                <td></td>
                <td>Did the agent adhere to all applicable state & Federal laws, and regulations (Inconvenient time, HIPAA,speaking to spouses, solicitation of post dates- MA & RI, etc.)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-20">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="No (High Risk)" class="sel-red">No (High Risk)</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#f5f542;color:#0;">Client Specifics</td>
                <td class="centered" >1-21</td>
                <td></td>
                <td>Did the agent adhere to all client specific requirements (cell phone disclosure, 1099C requirements/ disclosure, settlement (SIF) disclosure, settlement parameters, payment verification (CCV code), statute of limitation disclosure)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-21">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td class="mon-category" colspan="6"></td>
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;">Customer Experience</td>
                <td class="centered" >1-22</td>
                <td></td>
                <td>Did the agent control the call and communicate confidently by appropriately responding to consumer questions/concerns/objections (consumer refusing to verify, credit/statute of limitations questions, receipt/letter questions, fraud questions, etc.).</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-22">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-23</td>
                <td></td>
                <td>Did the agent note the account in W8 correctly, including at minimum: who they spoke to and where, how consumer verified, if disclosures were provided, if payments arrangements were agreed to, if/why consumer was upset/disputing/complaining, etc.)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-23">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#965BA5;color:#fff;">Policy</td>
                <td class="centered" >1-24</td>
                <td></td>
                <td>Did agent use the appropriate disposition (i.e., 3COM, 3DSP, etc.), update the appropriate windows (W 222, W 220, etc.), and use the correct wait date and due date?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-24">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="No (High Risk)" class="sel-red">No (High Risk)</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;">Customer Experience</td>
                <td class="centered" >1-25</td>
                <td></td>
                <td>Did the agent exceed expectations for a Great consumer Experience (i.e., could this call be used in training as an example of exceptional consumer service and negotiating skills while still being compliant & adhere to all COI Policies, etc.)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-25">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#f5f542;color:#0;">Client Specifics</td>
                <td class="centered" >1-26</td>
                <td></td>
                <td>DId the agent protect the Clients Brand?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-26">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;">Customer Experience</td>
                <td class="centered" >1-27</td>
                <td></td>
                <td>Did the agent effectively listen to consumer's needs (acknowledge what consumer is saying to show empathy) and recommend solutions that address the consumer's needs?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-27">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;">Customer Experience</td>
                <td class="centered" >1-28</td>
                <td></td>
                <td>Was the agent respectful, energetic, and friendly at all times on the call?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-28">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;">Customer Experience</td>
                <td class="centered" >1-29</td>
                <td></td>
                <td>Did the agent avoid raising their voice in a way that would be considered confrontational or harassment by the consumer (i.e., did the consumer make a comment indicating that they thought the agent was being rude or unprofessional)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-29">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="No (High Risk)" class="sel-red">No (High Risk)</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td style="background-color:#e04984;color:#fff;">Customer Experience</td>
                <td class="centered" >1-30</td>
                <td></td>
                <td>Did the agent summarize the call (payment terms, future actions, future communication, closing statement)?</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="1-30">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>
              <tr>
                <td class="mon-category" colspan="6">Non-Scoring</td>
              </tr>
              <tr>
                <td style="background-color:#dddddd;color:#fff;">Non-Scoring</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td>High Risk Call (Sent to Compliance for Review)</td>
                <td ></td>
                <td >
                  <select  class="qst" qst="SentToCompliance">
                    <option value="No" class="sel-green">No</option>
                    <option value="YES" class="sel-red">Yes</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style="background-color:#dddddd;color:#fff;">Non-Scoring</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td>Reason Call was Selected</td>
                <td ></td>
                <td >
                  <select  class="qst qst-reasontograde" qst="ReasonToGrade" style="width:200px;">
                    <option value="">Select One</option>
                    <option value="Random Call Monitoring">Random Call Monitoring</option>
                    <option value="Random Call Monitoring - *Live*">Random Call Monitoring - *Live*</option>
                    <option value="Client Deliverables">Client Deliverables</option>
                    <option value="Internal Call Calibration">Internal Call Calibration</option>
                    <option value="Client Call Calibration">Client Call Calibration</option>
                    <option value="Client Audit">Client Audit</option>
                    <option value="Client Call Selection">Client Call Selection</option>
                    <option value="Compliance Request">Compliance Request</option>
                    <option value="Validating Speech Analytics Risk Report">Validating Speech Analytics Risk Report</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style="background-color:#dddddd;color:#fff;">Non-Scoring</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td>Call type</td>
                <td ></td>
                <td >
                  <select  class="qst qst-calltype" qst="CallType" style="width:200px;">
                    <option value="">Select One</option>
                    <option value="Dispute">Dispute</option>
                    <option value="Fraud">Fraud</option>
                    <option value="Non-RPC">Non-RPC</option>
                    <option value="Payment">Payment</option>
                    <option value="Non-Payment">Non-Payment</option>
                    <option value="Other">Other</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style="background-color:#dddddd;color:#fff;">Non-Scoring</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td>Objection/Reason for Non-Payment</td>
                <td ></td>
                <td >
                  <select  class="qst qst-objection" qst="Objection" style="width:200px;">
                    <option value="">Select One</option>
                    <option value="Dispute - Incorrect Amount">Dispute - Incorrect Amount</option>
                    <option value="Dispute - Needs POD">Dispute - Needs POD</option>
                    <option value="Dispute - Already Paid">Dispute - Already Paid</option>
                    <option value="Disputes - Other">Disputes - Other</option>
                    <option value="Fraud - Not My Bill">Fraud - Not My Bill</option>
                    <option value="Hardship - Unemployment">Hardship - Unemployment</option>
                    <option value="Hardship - Fixed Income">Hardship - Fixed Income</option>
                    <option value="Hard Ship - Medical Related">Hard Ship - Medical Related</option>
                    <option value="Hardship - Other (Provide info in notes)">Hardship - Other (Provide info in notes)</option>
                    <option value="Hardship - Coronavirus">Hardship - Coronavirus</option>
                    <option value="Hardship - Other Bills">Hardship - Other Bills</option>
                    <option value="Hardship - Just Started New Job">Hardship - Just Started New Job</option>
                    <option value="New Provider Will Pay">New Provider Will Pay</option>
                    <option value="No time">No time</option>
                    <option value="Non-committal">Non-committal</option>
                    <option value="Other party responsible">Other party responsible</option>
                    <option value="Partner Pays Bills">Partner Pays Bills</option>
                    <option value="Consumer Passed Away">Consumer Passed Away</option>
                    <option value="Consumer is Incarcerated">Consumer is Incarcerated</option>
                    <option value="Attorney Involved">Attorney Involved</option>
                    <option value="Cease and Desist">Cease and Desist</option>
                    <option value="Bankruptcy">Bankruptcy</option>
                    <option value="Debt Settlement">Debt Settlement</option>
                    <option value="Other">Other</option>
                    <option value="N/A ">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td style="background-color:#dddddd;color:#fff;">Non-Scoring</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td>Client</td>
                <td ></td>
                <td >
                  <select  class="qst combo-clientdept" qst="Client" style="width:200px;">
                  </select>
                </td>
              </tr>
              <tr>
                <td style="background-color:#dddddd;color:#fff;">Non-Scoring</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td>State</td>
                <td ></td>
                <td >
                  <select  class="qst qst-state" qst="State" style="width:200px;">
                    <option value="">Select One</option>
	<option value="AL">Alabama</option>
	<option value="AK">Alaska</option>
	<option value="AZ">Arizona</option>
	<option value="AR">Arkansas</option>
	<option value="CA">California</option>
	<option value="CO">Colorado</option>
	<option value="CT">Connecticut</option>
	<option value="DE">Delaware</option>
	<option value="DC">District Of Columbia</option>
	<option value="FL">Florida</option>
	<option value="GA">Georgia</option>
	<option value="HI">Hawaii</option>
	<option value="ID">Idaho</option>
	<option value="IL">Illinois</option>
	<option value="IN">Indiana</option>
	<option value="IA">Iowa</option>
	<option value="KS">Kansas</option>
	<option value="KY">Kentucky</option>
	<option value="LA">Louisiana</option>
	<option value="ME">Maine</option>
	<option value="MD">Maryland</option>
	<option value="MA">Massachusetts</option>
	<option value="MI">Michigan</option>
	<option value="MN">Minnesota</option>
	<option value="MS">Mississippi</option>
	<option value="MO">Missouri</option>
	<option value="MT">Montana</option>
	<option value="NE">Nebraska</option>
	<option value="NV">Nevada</option>
	<option value="NH">New Hampshire</option>
	<option value="NJ">New Jersey</option>
	<option value="NM">New Mexico</option>
	<option value="NY">New York</option>
	<option value="NC">North Carolina</option>
	<option value="ND">North Dakota</option>
	<option value="OH">Ohio</option>
	<option value="OK">Oklahoma</option>
	<option value="OR">Oregon</option>
	<option value="PA">Pennsylvania</option>
	<option value="PR">Puerto Rico</option>
	<option value="RI">Rhode Island</option>
	<option value="SC">South Carolina</option>
	<option value="SD">South Dakota</option>
	<option value="TN">Tennessee</option>
	<option value="TX">Texas</option>
	<option value="UST">US Territory</option>
	<option value="UT">Utah</option>
	<option value="VT">Vermont</option>
	<option value="VA">Virginia</option>
	<option value="WA">Washington</option>
	<option value="WV">West Virginia</option>
	<option value="WI">Wisconsin</option>
	<option value="WY">Wyoming</option>
                      </select>
                </td>
              </tr>
♠
              <tr class="last-row">
                <td style="vertical-align: middle;min-height: 50px;" colspan="4">
                  <div style="margin-bottom:8px;">Strengths and Areas of Opportunity:</div>
                  <textarea class="qst qst-comments" qst="Comments"></textarea>
                </td>
                <td style="text-align: left;padding-top: 50px;" colspan="3">
                  <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Submit Monitor" />
                  <asp:Button id="deleteme" runat="server" class="mon-delete" hidden="true" type="submit" Text="Delete"  />
                  <asp:Button id="closeme" runat="server" class="mon-close" hidden="true" type="submit" Text="Close"  />
                </td>
                <td></td>
                <td></td>

              </tr>
              <!--
                #965BA5
                #18bba2
                LightGray
                -->
            </tbody>
          </table>
          <div style="display:none;">
            <asp:Label ID="lblMode" runat="server"></asp:Label>
            <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
            <asp:Label ID="lblAcknowledgementRequired" runat="server"></asp:Label>
            <asp:Label id="lblClientDept" runat="server"></asp:Label>
            <asp:Label id="lblSqfcode" runat="server"></asp:Label>
            <asp:Label id="lblSqfname" runat="server"></asp:Label>
            <asp:Label ID="lblFormId" runat="server"></asp:Label>
            <asp:Label ID="lblClient" runat="server"></asp:Label>
            <asp:Label ID="lblKPI" runat="server"></asp:Label>

          </div>
          <!-- END OF ACT QA HTML - All below here should be eliminatable -->
          <!--
            <div class="header NOTgradient-lightest">
                <div class="logo" style="margin-left:0px;margin-top:10px;"><h1><span>Acuity &reg;</span></h1></div>
                <div class="heading" style="margin-left:0px;margin-top:10px;">Sales & Marketing Quality Form</div>
            </div>
            -->
          <div class="mon-wrapper" style="display:none;">
            <div class="mon-stats">
              <ul class="mon-fields">
                <li class="mon-field" ><label>Account&nbsp;#:</label><span><input id="inpReviewName" style="width:120px;" runat="server" /></span></li>
                <li style="padding-bottom:10px;"><label>EUREKA ID or<br />VERINT Phone#:</label><span>STOLEN</span></li>
                <li class="mon-field" >
                  <label>Review&nbsp;Type</label>
                  <select id="selReviewType" runat="server">
                    <option value="">--select--</option>
                    <option value="Recorded">Recorded</option>
                    <option value="Live">Live</option>
                    <option value="Self-Observation">Self-Observation</option>
                    <option value="Calibration">Calibration</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="QA Team">QA Team</option>
                    <option value="QA of QA">QA of QA</option>
                    <option value="Targeted">Targeted</option>
                  </select>
                </li>
                <li class="mon-field" >
                  <label>Reviewer:</label>
                  <span>
                    <asp:Label id="lblSupervisorName" runat="server"></asp:Label>
                    <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label>
                    <asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label>
                    <asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label>
                  </span>
                </li>
                <li class="mon-field" >
                  <label>Call&nbsp;Party&nbsp;Type</label>
                  <select id="selCallpartyType" runat="server">
                    <option value="">--select--</option>
                    <option value="New Owner">New Owner</option>
                    <option value="Premier">Premier</option>
                    <option value="Foundation">Foundation</option>
                    <option value="Legacy">Legacy</option>
                    <option value="Internal Caller">Internal Caller</option>
                    <option value="Sampler">Sampler</option>
                    <option value="Non-Owner">Non-Owner</option>
                    <option value="Resort/Sales Site">Resort/Sales Site</option>
                    <option value="NICC">NICC</option>
                    <option value="BVSC">BVSC</option>
                    <option value="MH Marketing">MH Marketing</option>
                    <option value="Monster Reservations">Monster Reservations</option>
                    <option value="Paradise Productions">Paradise Productions</option>
                    <option value="Platinum Peaks Travel">Platinum Peaks Travel</option>
                    <option value="Schumer - Delray">Schumer - Delray</option>
                    <option value="Schumer - Ft.Laud">Schumer - Ft.Laud</option>
                    <option value="Schumer - Pompano">Schumer - Pompano</option>
                    <option value="Schumer - Tampa">Schumer - Tampa</option>
                    <option value="Snap Marketing">Snap Marketing</option>
                    <option value="Veritas Promations">Veritas Promations</option>
                    <option value="CTA Tech">CTA Tech</option>
                    <option value="Gold Mtn">Gold Mtn</option>
                    <option value="Grand Incentives">Grand Incentives</option>
                    <option value="NCAA - Day">NCAA - Day</option>
                    <option value="NCAA - Night">NCAA - Night</option>
                    <option value="CT AM Team">CT AM Team</option>
                    <option value="CT Mid Team">CT Mid Team</option>
                    <option value="CT PM Team">CT PM Team</option>
                    <option value="CT Late Team">CT Late Team</option>
                    <option value="CT AM2 Team">CT AM2 Team</option>
                    <option value="CT PM2 Team">CT PM2 Team</option>
                    <option value="CT Day Training">CT Day Training</option>
                    <option value="CT Night Training">CT Night Training</option>
                    <option value="Vacations on Demand">Vacations on Demand</option>
                    <option value="Vacation Resort Consultants (VRC)">Vacations Resort Consultants (VRC)</option>
                  </select>
                </li>
                <li class="mon-field" >
                  <label>Provided<br />Online&nbsp;Servicing<br />Guidance</label>
                  <select id="selOnlineGuidance" runat="server">
                    <option value="">--select--</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </li>
                <li>&nbsp;</li>
                <li>&nbsp;</li>
                <li class="mon-field" ><label>Call Date:</label><span>STOLEN</span></li>
                <li class="mon-field" ><label>Assoc&nbsp;Name:</label><span>STOLEN</span></li>
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
                  </span>
                </li>
                <li class="mon-field" >
                  <label>Workgroup:</label>
                  <span>
                    <asp:Label id="lblAgentGroupName" runat="server"></asp:Label>
                    <asp:Label style="display:none;" id="lblAgentGroup" runat="server"></asp:Label>
                  </span>
                </li>
              </ul>
              <ul class="mon-fields" style="display:none;">
                <li class="mon-field" style="height: 40px;"><label>Call&nbsp;Length (hh:mm:ss):</label><span style="float: right;padding-top: 8px;"><input type="text" class="sel_time" id="inpCalllength_HH" value="" maxlength="2" runat="server" />:<input class="sel_time" type="text" id="inpCalllength_MM" maxlength="2" runat="server" />:<input type="text" class="sel_time" id="inpCalllength_SS" maxlength="2" runat="server" /></span><span id="errmsg"></span></li>
                <li class="mon-field">
                  <label>Site&nbsp;Location:</label>
                  <select id="selSitelocation" runat="server">
                    <option selected="selected" value="San Antonio">San Antonio</option>
                  </select>
                </li>
                <li class="mon-field">
                  <label>Jurisdiction:</label>
                  <select id="selJurisdiction" runat="server">
                    <option selected="selected" value="MECO">MECO</option>
                    <option value="NANT">NANT</option>
                    <option value="RI">RI</option>
                  </select>
                </li>
              </ul>
              <ul class="mon-fields" style="display:none;">
                <li class="mon-field select-call-type">
                  <label>Call Type:</label>
                  <select id="selCalltype" runat="server">
                    <option selected="selected" value="Collections">Collections</option>
                    <option value="Move">Move</option>
                  </select>
                </li>
                <li class="mon-field">
                  <label>Category:</label>
                  <select id="selCategory_collections" runat="server">
                    <option selected="selected" value="Payment Agreement">Payment Agreement</option>
                    <option value="DPA Reinstate">DPA Reinstate</option>
                    <option value="Collection Arrangement">Collection Arrangement</option>
                    <option value="Notice Response - Credit Bureau">Notice Response - Credit Bureau</option>
                    <option value="Notice Response - Disconnect Notice">Notice Response - Disconnect Notice</option>
                    <option value="Field Activity Check">Field Activity Check</option>
                    <option value="Medical">Medical</option>
                    <option value="Outbound Call Response">Outbound Call Response</option>
                    <option value="Payment Inquiry">Payment Inquiry</option>
                    <option value="Making a Payment">Making a Payment</option>
                    <option value="Status of Work">Status of Work</option>
                    <option value="Service Orders">Service Orders</option>
                  </select>
                  <select id="selCategory_move" style="display:none;" runat="server">
                    <option selected="selected" value="Start">Start</option>
                    <option value="Stop">Stop</option>
                    <option value="Transfer">Transfer</option>
                    <option value="Start with AI">Start with AI</option>
                    <option value="Stop with AI">Stop with AI</option>
                  </select>
                </li>
                <li class="mon-field">
                  <label>Language:</label>
                  <select id="selLanguage" runat="server">
                    <option selected="selected" value="English">English</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </li>
                <li class="mon-field">
                  <label>Eligible:</label>
                  <select id="selEligible" runat="server">
                    <option selected="selected" value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </li>
                <li class="mon-field">
                  <label>Valid&nbspXfr:</label>
                  <select id="selValidtransfer" runat="server">
                    <option selected="selected" value="Yes">Yes</option>
                    <option value="No">No</option>
                    <option value="N/A">N/A</option>
                  </select>
                </li>
              </ul>
            </div>
            <div class="mon-content" style="display:none;">
              <ul style="list-style:none;">
                <li style="border-bottom: 1px solid gray;padding-top:16px;">
                  <span class="mon-question">&nbsp;</span>
                  <span class="mon-answer" style="padding-right: 290px;"><span style="display:none;">Answer</span><span class="mon-subtotal" style="width: 100px;font-weight:normal;color:Black;font-size:14px;">Points</span></span>
                </li>
              </ul>
              <div class="mon-section">Customer Service Skills</div>
              <ol>
                <li>
                  <span class="mon-question">Greeting</span>
                  <span class="mon-answer">
                    <select id="Q1">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Showed Appreciation</span>
                  <span class="mon-answer">
                    <select id="Q2">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Showed Empathy</span>
                  <span class="mon-answer">
                    <select id="Q3">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Understood Needs</span>
                  <span class="mon-answer">
                    <select id="Q4">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Directed Pace and Flow</span>
                  <span class="mon-answer">
                    <select id="Q5">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Took Ownership</span>
                  <span class="mon-answer">
                    <select id="Q6">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Knowledgeable</span>
                  <span class="mon-answer">
                    <select id="Q7">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Provided Guidance</span>
                  <span class="mon-answer">
                    <select id="Q8">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Offered Alternatives</span>
                  <span class="mon-answer">
                    <select id="Q9">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Friendly and Courteous</span>
                  <span class="mon-answer">
                    <select id="Q10">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Re-Cap</span>
                  <span class="mon-answer">
                    <select id="Q11">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Warm Close</span>
                  <span class="mon-answer">
                    <select id="Q12">
                      <option value="">--select--</option>
                      <option value="1">Achieved</option>
                      <option value="0">Needs Coaching</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
              </ol>
              <div class="mon-section">Knowledge Skill</div>
              <ol start="13">
                <li>
                  <span class="mon-question">Sizzle Given</span>
                  <span class="mon-answer">
                    <select id="Q13">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Upgrade Pitch</span>
                  <span class="mon-answer">
                    <select id="Q14">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Add Night Pitch</span>
                  <span class="mon-answer">
                    <select id="Q15">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Tickets Pitch</span>
                  <span class="mon-answer">
                    <select id="Q16">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Proactive Offer Refund based on Recommend status?</span>
                  <span class="mon-answer">
                    <select id="Q17">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Attempt to save reservation or package cancellation<br />based on Recommend status?</span>
                  <span class="mon-answer">
                    <select id="Q18">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Cruise Pitch</span>
                  <span class="mon-answer">
                    <select id="Q19">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="N/A">N/A</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
              </ol>
              <div class="mon-section">Comments</div>
              <ul style="list-style:none;">
                <li>
                  <p class="mon-comments"><textarea id="Comments" cols="90" rows="10"></textarea></p>
                </li>
              </ul>
              <ol style="list-style:none;padding-top: 10px;">
                <li style="height:25px;">
                  <span class="mon-question" style="font-weight: bold;font-size:20px;">Monitor Total&nbsp;&nbsp;&nbsp;<span class="mon-total" id="montotal">0</span>
                  <span class="mon-answer" style="font-weight: bold;font-size:20px;" >
                  Success Rate&nbsp;&nbsp;&nbsp;
                  <span class="mon-subtotal mon-success-rate" id="monsuccessrate">X</span>
                  </span>
                  <span class="mon-total-points" style="display:none;" id="montotalpoints"></span>
                  <span class="mon-total-possible" style="display:none;" id="montotalpossible"></span>
                </li>
              </ol>
              <div class="mon-section" style="font-size:20px;border-top: 2px solid black;padding-top:10px;">Quality Assurance</div>
              <ol>
                <li>
                  <div style="display:table-cell;vertical-align:middle;">
                    <span>
                      <select class="error-category" id="QA1C">
                        <option value=""></option>
                        <option value="Qualifications">Qualifications</option>
                        <option value="Accomodations">Accomodations</option>
                        <option value="Incentives">Incentives</option>
                        <option value="Tour">Tour</option>
                        <option value="Unapproved Purchase">Unapproved Purchase</option>
                        <option value="Updating Concierge">Updating Concierge</option>
                        <option value="Payment Details">Payment Details</option>
                        <option value="Agent Performance">Agent Performance</option>
                      </select>
                    </span>
                    <span class="error-anchor error-anchor-QA1C"></span>
                  </div>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA1Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <div style="display:table-cell;vertical-align:middle;">
                    <span>
                      <select class="error-category" id="QA2C">
                        <option value=""></option>
                        <option value="Qualifications">Qualifications</option>
                        <option value="Accomodations">Accomodations</option>
                        <option value="Incentives">Incentives</option>
                        <option value="Tour">Tour</option>
                        <option value="Unapproved Purchase">Unapproved Purchase</option>
                        <option value="Updating Concierge">Updating Concierge</option>
                        <option value="Payment Details">Payment Details</option>
                        <option value="Agent Performance">Agent Performance</option>
                      </select>
                    </span>
                    <span class="error-anchor error-anchor-QA2C"></span>
                  </div>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA2Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <div style="display:table-cell;vertical-align:middle;">
                    <span>
                      <select class="error-category" id="QA3C">
                        <option value=""></option>
                        <option value="Qualifications">Qualifications</option>
                        <option value="Accomodations">Accomodations</option>
                        <option value="Incentives">Incentives</option>
                        <option value="Tour">Tour</option>
                        <option value="Unapproved Purchase">Unapproved Purchase</option>
                        <option value="Updating Concierge">Updating Concierge</option>
                        <option value="Payment Details">Payment Details</option>
                        <option value="Agent Performance">Agent Performance</option>
                      </select>
                    </span>
                    <span class="error-anchor error-anchor-QA3C"></span>
                  </div>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA3Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <span class="mon-question">Pass/Fail</span>
                  <span class="mon-answer">
                    <select id="QA4">
                      <option value="">--select--</option>
                      <option value="100">Pass</option>
                      <option value="0">Fail</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Error Sent to BVSC</span>
                  <span class="mon-answer">
                    <select id="QA5">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                </li>
                <li>
                  <span class="mon-question">Correct Disposition</span>
                  <span><select id="QA6"></select><span class="mon-subtotal">&nbsp;</span></span>
                </li>
              </ol>
              <div class="mon-section">Quality Assurance Challenge</div>
              <div class="mon-section">&nbsp;&nbsp;Operations Supervisor</div>
              <ol start="7">
                <li>
                  <span class="mon-question">Quality Error Challenge</span>
                  <span class="mon-answer">
                    <select id="QA7">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA7Comments" cols="90" rows="1"></textarea></p>
                </li>
              </ol>
              <div class="mon-section">&nbsp;&nbsp;Quality Assurance Supervisor</div>
              <ol start="8">
                <li>
                  <span class="mon-question">Deny Challenge?</span>
                  <span class="mon-answer">
                    <select id="QA8">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA8Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <span class="mon-question">QA Error</span>
                  <span class="mon-answer">
                    <select id="QA9">
                      <option value="">--select--</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <span class="mon-subtotal">&nbsp;</span>
                  </span>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA9Comments" cols="90" rows="1"></textarea></p>
                </li>
              </ol>
              <ol style="list-style:none;padding-top: 10px;">
                <li style="height:25px;">
                  <span class="mon-question" style="font-weight: bold;font-size:20px;">Assurance Total&nbsp;&nbsp;&nbsp;<span class="assurance-total" id="assurancetotal">0</span>
                </li>
              </ol>
              <ol style="list-style:none;padding-top: 10px;">
                <li>
                  <input type="hidden" id="txtQ1" runat="server" value="" /><input type="hidden" id="txtQ1text" runat="server" value="" /><input type="hidden" id="txtQ1Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ2" runat="server" value="" /><input type="hidden" id="txtQ2text" runat="server" value="" /><input type="hidden" id="txtQ2Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ3" runat="server" value="" /><input type="hidden" id="txtQ3text" runat="server" value="" /><input type="hidden" id="txtQ3Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ4" runat="server" value="" /><input type="hidden" id="txtQ4text" runat="server" value="" /><input type="hidden" id="txtQ4Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ5" runat="server" value="" /><input type="hidden" id="txtQ5text" runat="server" value="" /><input type="hidden" id="txtQ5Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ6" runat="server" value="" /><input type="hidden" id="txtQ6text" runat="server" value="" /><input type="hidden" id="txtQ6Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ7" runat="server" value="" /><input type="hidden" id="txtQ7text" runat="server" value="" /><input type="hidden" id="txtQ7Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ8" runat="server" value="" /><input type="hidden" id="txtQ8text" runat="server" value="" /><input type="hidden" id="txtQ8Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ9" runat="server" value="" /><input type="hidden" id="txtQ9text" runat="server" value="" /><input type="hidden" id="txtQ9Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ10" runat="server" value="" /><input type="hidden" id="txtQ10text" runat="server" value="" /><input type="hidden" id="txtQ10Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ11" runat="server" value="" /><input type="hidden" id="txtQ11text" runat="server" value="" /><input type="hidden" id="txtQ11Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ12" runat="server" value="" /><input type="hidden" id="txtQ12text" runat="server" value="" /><input type="hidden" id="txtQ12Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ13" runat="server" value="" /><input type="hidden" id="txtQ13text" runat="server" value="" /><input type="hidden" id="txtQ13Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ14" runat="server" value="" /><input type="hidden" id="txtQ14text" runat="server" value="" /><input type="hidden" id="txtQ14Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ15" runat="server" value="" /><input type="hidden" id="txtQ15text" runat="server" value="" /><input type="hidden" id="txtQ15Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ16" runat="server" value="" /><input type="hidden" id="txtQ16text" runat="server" value="" /><input type="hidden" id="txtQ16Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ17" runat="server" value="" /><input type="hidden" id="txtQ17text" runat="server" value="" /><input type="hidden" id="txtQ17Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ18" runat="server" value="" /><input type="hidden" id="txtQ18text" runat="server" value="" /><input type="hidden" id="txtQ18Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ19" runat="server" value="" /><input type="hidden" id="txtQ19text" runat="server" value="" /><input type="hidden" id="txtQ19Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ20" runat="server" value="" /><input type="hidden" id="txtQ20text" runat="server" value="" /><input type="hidden" id="txtQ20Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ21" runat="server" value="" /><input type="hidden" id="txtQ21text" runat="server" value="" /><input type="hidden" id="txtQ21Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ22" runat="server" value="" /><input type="hidden" id="txtQ22text" runat="server" value="" /><input type="hidden" id="txtQ22Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ23" runat="server" value="" /><input type="hidden" id="txtQ23text" runat="server" value="" /><input type="hidden" id="txtQ23Comments" runat="server" value="" />
                  <input type="hidden" id="txtQ24" runat="server" value="" /><input type="hidden" id="txtQ24text" runat="server" value="" /><input type="hidden" id="txtQ24Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA1C" runat="server" value="" /><input type="hidden" id="txtQA1Ctext" runat="server" value="" /><input type="hidden" id="txtQA1E" runat="server" value="" /><input type="hidden" id="txtQA1Etext" runat="server" value="" /><input type="hidden" id="txtQA1Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA2C" runat="server" value="" /><input type="hidden" id="txtQA2Ctext" runat="server" value="" /><input type="hidden" id="txtQA2E" runat="server" value="" /><input type="hidden" id="txtQA2Etext" runat="server" value="" /><input type="hidden" id="txtQA2Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA3C" runat="server" value="" /><input type="hidden" id="txtQA3Ctext" runat="server" value="" /><input type="hidden" id="txtQA3E" runat="server" value="" /><input type="hidden" id="txtQA3Etext" runat="server" value="" /><input type="hidden" id="txtQA3Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA4" runat="server" value="" /><input type="hidden" id="txtQA4text" runat="server" value="" /><input type="hidden" id="txtQA4Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA5" runat="server" value="" /><input type="hidden" id="txtQA5text" runat="server" value="" /><input type="hidden" id="txtQA5Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA6" runat="server" value="" /><input type="hidden" id="txtQA6text" runat="server" value="" /><input type="hidden" id="txtQA6Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA7" runat="server" value="" /><input type="hidden" id="txtQA7text" runat="server" value="" /><input type="hidden" id="txtQA7Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA8" runat="server" value="" /><input type="hidden" id="txtQA8text" runat="server" value="" /><input type="hidden" id="txtQA8Comments" runat="server" value="" />
                  <input type="hidden" id="txtQA9" runat="server" value="" /><input type="hidden" id="txtQA9text" runat="server" value="" /><input type="hidden" id="txtQA9Comments" runat="server" value="" />
                  <input type="hidden" id="txtComments" runat="server" value="" />
                  <input type="hidden" id="txtTotal" runat="server" value="" />
                  <input type="hidden" id="txtAssuranceTotal" runat="server" value="" />
                  <input type="hidden" id="txtTotalPoints" runat="server" value="" />
                  <input type="hidden" id="txtTotalPossible" runat="server" value="" />
                  <input type="hidden" id="txtSuccessRate" runat="server" value="" />
                  <input type="hidden" id="txtCalllength_HH" runat="server" value="" />
                  <input type="hidden" id="txtCalllength_MM" runat="server" value="" />
                  <input type="hidden" id="txtCalllength_SS" runat="server" value="" />
                  <input type="hidden" id="txtSitelocation" runat="server" value="" />
                  <input type="hidden" id="txtJurisdiction" runat="server" value="" />
                  <input type="hidden" id="txtCalltype" runat="server" value="" />
                  <input type="hidden" id="txtCategory_collections" runat="server" value="" />
                  <input type="hidden" id="txtCategory_move" runat="server" value="" />
                  <input type="hidden" id="txtLanguage" runat="server" value="" />
                  <input type="hidden" id="txtEligible" runat="server" value="" />
                  <input type="hidden" id="txtValidtransfer" runat="server" value="" />
                  <input type="hidden" id="txtReviewType" runat="server" value="" />
                  <input type="hidden" id="txtCallpartyType" runat="server" value="" />
                  <input type="hidden" id="txtOnlineGuidance" runat="server" value="" />
                  <input type="hidden" id="txtReviewName" runat="server" value="" />
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </form>
    <script type="text/javascript" src="./Monitor_IQA.js?r=12" language="javascript"></script>
  </body>
</html>
