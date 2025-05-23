<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_base_2.aspx.cs" ValidateRequest="false" Inherits="_Monitor_base_2" %>
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

    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <link rel="stylesheet" href="<%# ResolveUrl("~/lib/pure/grids-responsive-min.css") %>" />
    <!-- JULIE CSS -->
    <link rel="stylesheet" href="<%# ResolveUrl("~/App_Themes/Acuity3/css/app.css?r=6") %>" />
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>

    <style id="CDS_CSSContent" runat="server">
        
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
      .ui-setup-form {
        padding:10px;
        margin-bottom:20px;
        width: 600px;
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
          
    </style>

  </head>
  <body id="Body1" runat="server" class="ui-review-body">
    <form id="Form1" method="post" runat="server">
      <div class="ui-review-title">
        <div class="ui-title-container">
          <button onclick="printFunction()">Print this page</button>
          <a class="ac-close" href="">&#8592; Back</a> <span>|</span> <label class="display-lblSqfname"></label>
        </div>
      </div>

<div class="ui-setup-form" style="display:none;">
    <div class="ui-setup-form-new" style="display:none;">
        Form has not been set up from markup.
    </div>
    <div class="ui-setup-orphan-qsts">
        Questions have been added to the form.  When ready, please update the data set.
        <div class="ui-orphan-qst-list"></div>
    </div>
    <input type="submit" class="ac-setup-form" value="Set Up Form" />
    <div class="ui-setup-form-new" style="display:none;">
        <br />To add questions and fields, use the controls below.
    </div>
</div>

<div id="CDS_HTMLEditor"></div>
<div contenteditable="false" id="CDS_HTMLContent" runat="server">

  <div class="ui-view ac-view" style="display:none;">

    <div class="ui-draft-banner ac-draft">Draft Mode</div>

    <!-- Header -->

      <div style="position:relative;">        

        <!-- Acknowledgement -->
        <div class="ui-section-acknowledgement">
            <div class="ac-show-acknowledgementrequired" style="display:none;border: 2px solid red;padding:8px;width:500px;">
                <span class="ac-show-isagent" style="font-weight:bold;display:none;">
                    <br />Click the button below to acknowledge that you have seen this monitor.<br />
                    <br />
                    <input type="submit" class="ac-acknowledge" value="Acknowledge Monitor" />
                </span>
                <span class="ac-show-isnotagent" style="color:Red;display:none;">The agent must log in to acknowledge this monitor.</span>
            </div>
        </div>

        <div class="ac-show-acknowledgementreceived" style="display:none;">
            This monitor was acknowledged by the Agent:
            <span class="display-lblAcknowledgementDate" /></span>
        </div>

        <!------- Header ----->
        <dl class="ui-section-header">
            <dt>Monitor ID:</dt><dd class="display-lblMonitorId"></dd>
            <dt>Agent Name:</dt>
            <dd>
                <span class="display-lblAgentName"></span> (<span  class="display-lblAgent"></span>)
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
        <!-------- ui-Specific Fields ------>
            <dt>Source:</dt>
            <dd>
                <select class="qst ac-required" qst="Source">
                    <option value=""></option>
                    <option value="6+">6+</option>
                    <option value="IRT">IRT</option>
                    <option value="FCI">FCI</option>
                    <option value="Random Call Monitors">Random Call Monitors</option>
                    <option value="Call Review">Call Review</option>
                    <option value="Other">Other</option>
                </select>
            </dd>
            <dt>Eligibility Code:</dt>
            <dd>
                <select class="qst ac-required" qst="EligibilityCode">
                    <option value=""></option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                    <option value="E">E</option>
                    <option value="F">F</option>
                    <option value="G">G</option>
                    <option value="H">H</option>
                    <option value="I">I</option>
                    <option value="J">J</option>
                    <option value="L">L</option>
                    <option value="M">M</option>
                    <option value="N">N</option>
                    <option value="P">P</option>
                    <option value="Q">Q</option>
                    <option value="S">S</option>
                    <option value="T">T</option>
                    <option value="U">U</option>
                    <option value="V">V</option>
                    <option value="Other">Other</option>
                </select>
            </dd>
            <dt>ELID:</dt>
            <dd>
                <input type="text" class="qst ac-required" qst="ELID" />
            </dd>
            <dt>AHA/IO:</dt>
            <dd>
                <select class="qst ac-required" qst="AHA_IO">
                    <option value=""></option>
                    <option value="AHA">AHA</option>
                    <option value="IO">IO</option>
                </select>
            </dd>
        </dl>

        <!------- Questions --------->
        <dl class="ui-section-questions">
            <dt>CT - Establish consultative tone</dt>
            <dd>
                <dl>
                    <dt>CT-1 Professional – Address customer appropriately, be polite, and use a friendly tone</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-2 Express understanding/empathy </dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-3 Control the call</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-3"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-4 Do not use Sprint jargon - (i.e. terms like debt age, MRC, aging buckets, eligibility code, IVR, etc.)</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-4"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-5 Speak Clearly, with Confidence and Be Concise</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-5"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-6 Active Listening displayed so customer does not have to repeat themselves</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-6"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-7 Do not interrupt or speak over the customer</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-7"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT-8 Authenticate the account properly (Ask for the Account holder's name &amp; either PIN or security question)</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CT-8"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CT - Comments<br />
                        <textarea class="qst ac-comments" qst="CT-Comments"  data-resizable="true" type="text" ></textarea>
                    </dt>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions">
            <dt>PI - Probe for Information</dt>
            <dd>
                <dl>
                    <dt>PI-1 Ask clarifying questions to identify reason for call (i.e. Delinquent Account and/or Customer Care issues), and ask for PTN</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PI-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PI-2 Review UAI  Alerts on account and follow instructions</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PI-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PI - Comments<br />
                        <textarea class="qst ac-comments" qst="PI-Comments"  data-resizable="true" type="text" ></textarea>
                    </dt>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions">
            <dt>DS - Determine Strategy</dt>
            <dd>
                <dl>
                    <dt>DS-1 Repeat call acknowledgment and followed proper Repeat Call Handling Process</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="DS-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>DS-2 Triage Account by using account indicators; debt age, account balances, due date, eligibility code, DCK indicators, follow UAI (reviewing alerts same follow UAI), review notes , etc.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="DS-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>DS-3 Addresses and resolves both service and payment issues</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="DS-3"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>DS-4 Use systems and tools to resolve (CST, Call Flows, iCare, Glance), follow policy/procedures</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="DS-4"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>DS-5 Review Offers in NBA and selects appropriately?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="DS-5"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>DS - Comments<br />
                        <textarea class="qst ac-comments" qst="DS-Comments"  data-resizable="true" type="text" ></textarea>
                    </dt>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions">
            <dt>PS - Position Solution</dt>
            <dd>
                <dl>
                    <dt>PS-1 Negotiation – Ask for a payment on every call – Use negotiation matrix process and Use LAMA (Listen, Acknowledge, Make a Statement, Ask a Question) to guide the conversation.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS-2 Have the right financial conversation with the customer and identify why behind on payments</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS-3 Education: Provide the customer postive benefits on getting account current (service restoral, prevent service interruption, inability or reduced OPP of attaining PA, late fees, reconnection fees, support fee )</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-3"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS-4 Did the agent advise client of support Fee for PA and was it applied accordingly?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-4"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS-5 Provide accurate information and avoided false and misleading information</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-5"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS-6 Confirm the customer agrees with resolution</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-6"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS-7 Payment Terms & Conditions stated by agent and accepted by customer</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="PS-7"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>PS - Comments<br />
                        <textarea class="qst ac-comments" qst="PS-Comments"  data-resizable="true" type="text" ></textarea>
                    </dt>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions">
            <dt>CI - Complete the Interaction</dt>
            <dd>
                <dl>
                    <dt>CI-1 Use system tools to implement agreed solution for primary and secondary reasons</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CI-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CI-2 Notation: Follow policy in recording detail interaction notes in i-Care (NOTES templates, peach area selection)</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CI-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CI-3 Self-Service: Educate customer on self-service option always–  Correct CES tool usage?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CI-3"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CI-4 Summarize resolution of account with customer – payment arrangement dates/amounts, changes to account, resolution of issues/concerns - support fee?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CI-4"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CI-5 Follow closing process?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="CI-5"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>CI - Comments<br />
                        <textarea class="qst ac-comments" qst="CI-Comments"  data-resizable="true" type="text" ></textarea>
                    </dt>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions">
            <dt>ZT - CFS Zero Tolerance</dt>
            <dd>
                <dl>
                    <dt>ZT-1 Did the Agent authenticate properly?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZT-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZT-2 Did the Agent refrain from using fraudulent practices/Slamming  (i.e. Change of a customer's account or phone service WITHOUT customer's knowledge/permission)</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZT-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZT-3 No Call Avoidance observed (Hanging up on the customer or NOT answering the call when the call is delivered to the specialist - i.e. remain silent, excessive hold or use mute button)</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZT-3"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZT-4 Did the Agent ask for the customer's full debit card or credit card number when this is not required?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZT-4"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZT-5 Did the Agent avoid being rude or disrespectful (i.e. Use of profanity or verbal abusiveness)?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZT-5"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZT-6 Did the Agent refrain from intentionally manipulating processes to impact metrics for personal gain.  Example: Avoiding setting up an agreed upon PA to avoid non-compliance.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZT-6"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-1 Did the Agent complete a promised customer call back and follow the CST Callback Process</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-1"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-2 Did the Agent transfer the call to the correct department if needed, and/or avoid Intentionally transferring inappropriately.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-2"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-3 Did the Agent escalate upon customer request outside our documented process policies.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-3"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-4 Did the Agent avoid long wrap times?</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-4"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-5 Not Dialing out to move to end of queue.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-5"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-6 Did not place self in an unavailable status to avoid calls.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-6"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-7 Did the Agent avoid needlessly extending dead air calls.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-7"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-8 Did the agent avoid using desk phone to make personal calls, and not being available for customers.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-8"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-9 There was no failure by a supervisor or senior specialist to take an escalated call when requested by a customer.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-9"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-10 Did the Agent avoid dialing numbers that are not a direct result of customer issue resolution.</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-10"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZTD-11 Did the Agent refrain from calling, text messaging, or e-mailing outside business needs (for example: harassing or retaliation to customer).</dt>
                    <dd>
                        <select class="qst ac-bfa" qst="ZTD-11"><option value="Yes">Yes</option><option value="No">No</option><option selected="selected" value="N/A">N/A</option></select>
                    </dd>
                    <dt>ZT - Comments<br />
                        <textarea class="qst ac-comments" qst="ZT-Comments"  data-resizable="true" type="text" ></textarea>
                    </dt>
                </dl>
            </dd>
        </dl>
        <dl class="ui-section-questions" style="display:none;">
            <dt>Strengths &amp; Opportunities</dt>
            <dd>
                <textarea class="qst ac-comments" qst="Comments"  data-resizable="true" type="text" ></textarea>
            </dd>
        </dl>
    </div>

      <div class="attachments" style="display:none;margin-right:30px;margin-bottom:10px;">
        <div style="display:block;text-align: right;line-height:30px;">
            <span class="attachments-list"></span>
            <input id="fileUpload" name="fileUpload" type="file" accept=".doc,.docx,.xls,.xlsx,.pdf" style="display:none;" />
            <input type="button" value="Attach File..." onclick="document.getElementById('fileUpload').click();return false;" style="margin-left: 30px;" />
        </div>
      </div>

          <div class="ui-draft-banner ac-draft">This Monitor is a Draft, not visible to non-QA's</div>
          <div>            <br />
                  <input type="submit" class="ac-submit ac-draft" style="display:none;" disabled="disabled" value="Save as Draft" />
                  <input type="submit" class="ac-submit ac-save" disabled="disabled" value="Save Monitor" />
                  <input type="submit" class="ac-delete" value="Delete"  />
                  <input type="submit" class="ac-close" value="Close"  />
                  <input type="checkbox" style="display:none;" class="ac-islive qst" qst="IsLive" />
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

      </div>
    </form>
    <script type="text/javascript" src="./Monitor_base_2.js?r=3" language="javascript"></script>
  </body>
</html>
