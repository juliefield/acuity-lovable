<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_ClubCall_Prototype.aspx.cs" ValidateRequest="false" Inherits="_Monitor_ClubCall_Prototype" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Club Call QA</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/appLib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
    .page-wrapper {
      width: 910px;
      margin: 0px auto 0 auto;
      position: relative;
      border: 1px solid gray;
    }
    .mon-wrapper
    {
        position:relative;
    }
    .mon-stats
    {
        position:absolute;
        top: 70px;
        right: 30px;
        background-color: Green;
        width: 250px;
        z-index: 50;
    }
    .mon-stats ul
    {
        list-style: none;
        padding: 10px;
        margin: 0;
    }
    .mon-stats ul li
    {
        color: White;
        font-size: 12px;
    }
    .mon-stats li label
    {
        font-weight: bold;
        width: 60px;
    }
    .mon-stats li span
    {
        padding-left: 15px;
        float:right;
    }
    .mon-content
    {
        position:relative;
        padding: 10px;
        margin-top: 10px;
        width: 100%;
        overflow-y:scroll;
    }
    .mon-content li
    {
        padding: 5px;
    }
    .mon-answer
    {
        float:right;
        padding-right: 300px;
    }
    .mon-subtotal
    {
        width: 40px;
        float:right;
        text-align: right;
        color: Blue;
        font-weight: bold;
        font-size: 20px;
        vertical-align:middle;
    }
    .mon-submit
    {
        clear:both;
    }
    .mon-comments
    {
        clear: both;
    }
    .mon-comments label
    {
        vertical-align:middle;
    }
    .mon-comments textarea
    {
        margin-left: 10px;
        vertical-align:middle;
    }
    textarea
    {
        overflow: visible;
    }
    .mon-fields
    {
        margin-left: 5px;
    }

    .mon-field
    {
        clear both;
        min-height: 30px;
    }

    .mon-field label
    {
        color:White;
        float: left;
    }

    .mon-field-input, .mon-field select
    {
        width: 120px;
        padding-right: 5px;
        float: right;
    }

    .sel_time
    {
        width: 30px;
    }

    .mon-address textarea
    {
        margin-left: 0px;
    }

    .mon-question
    {
        /* font-weight: bold; */
    }
    .mon-section
    {
        font-weight: bold;
    }
    .mon-desc
    {
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
    </style>
</head>
<body runat="server" style="overflow-y:scroll;">

<div class="page-wrapper2">
  <div class="page-wrapper">


    <div class="header gradient-lightest">
        <div class="logo" style="margin-left:0px;margin-top:10px;"><h1><span>Acuity &reg;</span></h1></div>
        <div class="heading" style="margin-left:0px;margin-top:10px;">Club Call Quality Form</div>
    </div>
    <div style="display:none;">
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
    </div>

    <div class="mon-wrapper">
        <div class="mon-stats">
            <ul class="mon-fields">
                <li class="mon-field" ><label>Review&nbsp;Name:</label><span><input id="inpReviewName" style="width:120px;" runat="server" /></span></li>
                <li style="padding-bottom:10px;"><label>EUREKA ID or<br />VERINT Phone#:</label><span><asp:Label ID="lblCallid" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Review&nbsp;Type</label><select id="selReviewType" runat="server"><option value="">--select--</option><option value="Recorded">Recorded</option><option value="Live">Live</option><option value="Self-Observation">Self-Observation</option><option value="Calibration">Calibration</option><option value="Diagnostic">Diagnostic</option><option value="QA Team">QA Team</option><option value="QA of QA">QA of QA</option></select></li>
                <li class="mon-field" ><label>Reviewer:</label><span><asp:Label id="lblSupervisorName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label><asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label><asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Call&nbsp;Party&nbsp;Type</label>
                    <select id="selCallpartyType" runat="server"><option value="">--select--</option>
                        <option value="New Owner"></option>
                        <option value="Premier">Premier</option>
                        <option value="Foundation">Foundation</option>
                        <option value="Legacy">Legacy</option>
                        <option value="Internal Caller">Internal Caller</option>
                        <option value="Sampler">Sampler</option>
                        <option value="Non-Owner">Non-Owner</option>
                        <option value="Resort/Sales Site">Resort/Sales Site</option>
                        <option value="Outbound">Outbound</option>
                    </select></li>
                <li class="mon-field" ><label>Provided<br />Online&nbsp;Servicing<br />Guidance</label>
                    <select id="selOnlineGuidance" runat="server"><option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select></li><li>&nbsp;</li><li>&nbsp;</li>
                <li class="mon-field" ><label>Call Date:</label><span><asp:Label ID="lblCalldate" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Assoc&nbsp;Name:</label><span><asp:Label id="lblAgentName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblAgent" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Assoc&nbsp;Sup:</label><span><asp:Label id="lblAgentTeamLeaderName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblAgentTeamLeader" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Assoc&nbsp;Mgr:</label><span><asp:Label id="lblAgentGroupLeaderName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblAgentGroupLeader" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Workgroup:</label><span><asp:Label id="lblAgentGroupName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblAgentGroup" runat="server"></asp:Label></span></li>

            </ul>
            <ul class="mon-fields" style="display:none;">
                <li class="mon-field" style="height: 40px;"><label>Call&nbsp;Length (hh:mm:ss):</label><span style="float: right;padding-top: 8px;"><input type="text" class="sel_time" id="inpCalllength_HH" value="" maxlength="2" runat="server" />:<input class="sel_time" type="text" id="inpCalllength_MM" maxlength="2" runat="server" />:<input type="text" class="sel_time" id="inpCalllength_SS" maxlength="2" runat="server" /></span><span id="errmsg"></span></li>
                <li class="mon-field"><label>Site&nbsp;Location:</label><select id="selSitelocation" runat="server"><option selected="selected" value="San Antonio">San Antonio</option></select></li>
                <li class="mon-field"><label>Jurisdiction:</label><select id="selJurisdiction" runat="server"><option selected="selected" value="MECO">MECO</option><option value="NANT">NANT</option><option value="RI">RI</option></select></li>
            </ul>
            <ul class="mon-fields" style="display:none;">
                <li class="mon-field select-call-type"><label>Call Type:</label><select id="selCalltype" runat="server"><option selected="selected" value="Collections">Collections</option><option value="Move">Move</option></select></li>
                <li class="mon-field"><label>Category:</label>
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
                <li class="mon-field"><label>Language:</label><select id="selLanguage" runat="server"><option selected="selected" value="English">English</option><option value="Spanish">Spanish</option></select></li>
                <li class="mon-field"><label>Eligible:</label><select id="selEligible" runat="server"><option selected="selected" value="Yes">Yes</option><option value="No">No</option></select></li>
                <li class="mon-field"><label>Valid&nbspXfr:</label><select id="selValidtransfer" runat="server"><option selected="selected" value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select></li>
            </ul>
        </div>
        <div class="mon-content">
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
                 <span class="mon-answer"><select id="Q1"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
             </li>
              <li>
                  <span class="mon-question">Showed Appreciation</span>
                  <span class="mon-answer"><select id="Q2"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Showed Empathy</span>
                  <span class="mon-answer"><select id="Q3"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Understood Needs</span>
                  <span class="mon-answer"><select id="Q4"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Directed Pace and Flow</span>
                  <span class="mon-answer"><select id="Q5"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Took Ownership</span>
                  <span class="mon-answer"><select id="Q6"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Knowledgeable</span>
                  <span class="mon-answer"><select id="Q7"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Provided Guidance</span>
                  <span class="mon-answer"><select id="Q8"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Offered Alternatives</span>
                  <span class="mon-answer"><select id="Q9"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Friendly and Courteous</span>
                  <span class="mon-answer"><select id="Q10"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Re-Cap</span>
                  <span class="mon-answer"><select id="Q11"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Warm Close</span>
                  <span class="mon-answer"><select id="Q12"><option value="">--select--</option><option value="1">Achieved</option><option value="0">Needs Coaching</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
          </ol>

          <div class="mon-section">Knowledge Skill</div>
          <ol start="13">
              <li>
                  <span class="mon-question">PPP Eligible Call?</span>
                  <span class="mon-answer"><select id="Q13"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Quality PPP Offered?</span>
                  <span class="mon-answer"><select id="Q14"><option value="">--select--</option><option value="1">Yes</option><option value="0">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Rebuttal Needed?</span>
                  <span class="mon-answer"><select id="Q15"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Rebuttal Offered?</span>
                  <span class="mon-answer"><select id="Q16"><option value="">--select--</option><option value="1">Yes</option><option value="0">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">PPP Accepted?</span>
                  <span class="mon-answer"><select id="Q17"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Fees Associated with Transaction?</span>
                  <span class="mon-answer"><select id="Q18"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Fees Discounted?</span>
                  <span class="mon-answer"><select id="Q19"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Fees Waived?</span>
                  <span class="mon-answer"><select id="Q20"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">If Fees Were Discounted/Waived: What was the reason?</span>
                  <span class="mon-answer mon-answer-special"><select id="Q21"><option value="Not Waived">--select--</option>
                      <option value="Website / System Issue">Website / System Issue</option>
                      <option value="Avoiding Conflict">Avoiding Conflict</option>
                      <option value="Associate Error">Associate Error</option>
                      <option value="Allowed Exception">Allowed Exception</option>
                      <option value="Online Action Not Supported">Online Action Not Supported</option>
                      <option value="Negotiation">Negotiation</option>
                      <option value="Resort Issue">Resort Issue</option>
                      <option value="Life Event">Life Event</option>
                    </select>
              </li>
              <li>
                  <span class="mon-question">KRP reviewed with the owner?</span>
                  <span class="mon-answer"><select id="Q22"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Did the agent advise the owner of the post-call survey?</span>
                  <span class="mon-answer"><select id="Q23"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li style="height:20px;">
                  <span class="mon-question">Date of Feedback Delivery</span>
                  <span class="mon-answer mon-answer-special"><textarea id="Q24Comments" cols="30" rows="1"></textarea></span>
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
                    <span class="mon-question"></span>
                    <span class="mon-answer" style="font-weight: bold;font-size:20px;" >
                      Monitor Total&nbsp;&nbsp;&nbsp;<span class="mon-subtotal mon-total" id="montotal">0</span>
                      <span class="mon-total-points" style="display:none;" id="montotalpoints"></span>
                      <span class="mon-total-possible" style="display:none;" id="montotalpossible"></span>
                    </span>
                  </li>
                  <li>
                    <span class="mon-question"></span>
                    <span class="mon-answer" style="font-weight: bold;font-size:20px;" >
                      Success Rate&nbsp;&nbsp;&nbsp;
                      <span class="mon-subtotal mon-success-rate" id="monsuccessrate">X</span>
                    </span>
                  	<form method="post" runat="server">
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
                        <input type="hidden" id="txtComments" runat="server" value="" />
                        <input type="hidden" id="txtTotal" runat="server" value="" />
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

                        <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Submit Monitor" OnClick="submitme_click" />
                        <asp:Button id="deleteme" runat="server" class="mon-delete" hidden="true" type="submit" Text="Delete" OnClientClick="return confirm('Are you sure you want to delete this monitor?');" OnClick="deleteme_click" />
                        <asp:Button id="closeme" runat="server" class="mon-close" hidden="true" type="submit" Text="Close" OnClick="closeme_click" />
                    </form>
                </li>
            </ol>
        </div>
    </div>
  </div>
  <script type="text/javascript" language="javascript">

      $(".mon-submit").bind("click", function () {
          $("#txtTotal").val($("#montotal").html());
          $("#txtTotalPoints").val($("#montotalpoints").html());
          $("#txtTotalPossible").val($("#montotalpossible").html());
          $("#txtSuccessRate").val($("#monsuccessrate").html());
          $("#txtComments").val($("#Comments").val());

          for (var i = 1; i <= 24; i++) {
              $("#txtQ" + i).val($("#Q" + i).val());
              $("#txtQ" + i + "text").val($("#Q" + i + " option:selected").text());
              $("#txtQ" + i + "Comments").val($("#Q" + i + "Comments").val());
          }
          $("#txtCalllength_HH").val($("#inpCalllength_HH").val());
          $("#txtCalllength_MM").val($("#inpCalllength_MM").val());
          $("#txtCalllength_SS").val($("#inpCalllength_SS").val());
          $("#txtSitelocation").val($("#selSitelocation").val());
          $("#txtJurisdiction").val($("#selJurisdiction").val());
          $("#txtCalltype").val($("#selCalltype").val());
          $("#txtCategory_collections").val($("#selCategory_collections").val());
          $("#txtCategory_move").val($("#selCategory_move").val());
          $("#txtLanguage").val($("#selLanguage").val());
          $("#txtEligible").val($("#selEligible").val());
          $("#txtValidtransfer").val($("#selValidtransfer").val());

          $("#txtReviewType").val($("#selReviewType").val());
          $("#txtCallpartyType").val($("#selCallpartyType").val());
          $("#txtOnlineGuidance").val($("#selOnlineGuidance").val());
          $("#txtReviewName").val($("#inpReviewName").val());

      });

      $(document).ready(function () {
          var colors = ["#eeeeee", "#dddddd"];
          var tgl = 0;
          $(".mon-content ol li").each(function () {
              $(this).css("background", colors[tgl]);
              if (!tgl) tgl = 1; else tgl = 0;
          });

          $("#Comments").val($("#txtComments").val());
          $("#Comments").autogrow();

          for (var i = 1; i <= 24; i++) {
              $("#Q" + i).val($("#txtQ" + i).val());
              $("#Q" + i + "Comments").val($("#txtQ" + i + "Comments").val());
              $("#Q" + i + "Comments").autogrow();
          }
          for (var i = 1; i <= 24; i++) {
              if ($("#Q" + i).val() == "") {
                  $("#Q" + i + " option[value='N/A']").attr('selected', 'selected')
              }
              else {
                  if ($("#txtQ" + i + "text").val() != "") {
                    $("#Q" + i + ' option:contains("' + $("#txtQ" + i + "text").val() + '")').attr('selected', 'selected');
                  }
              }
          }

          //Buttons for answers.
          function buttonsforanswers() {
            $(".mon-answer select").each(function() {
                if (!$(this).parent().hasClass("mon-answer-special")) {
                  var me = this;
                  $(" option",this).each(function() {
                    if ($(this).val() != "") {
                      var bld = '<input type="button" value="' + $(this).text() + '" class="highlight-hover';
                      if ($(me).val() == $(this).val()) {
                        bld += ' highlight';
                      }
                      bld += '">';
                      $(me).parent().append(bld);
                    }
                  })
                  $(me).hide();
                }
              });
          }
          buttonsforanswers();

          $(".highlight-hover").bind("click", function() {
            var text = $(this).val();
            var sel = $(" select",$(this).parent());
            $(" option", sel).each(function() {
                if (text == $(this).text()) {
                  $(sel).val($(this).val())
                }
            });
            $(sel).trigger("change");
            $(".highlight-hover",$(this).parent()).removeClass("highlight");
            $(this).addClass("highlight");

          });

          $(".sel_time").keypress(function (e) {
              if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
                  //display error message
                  $("#errmsg").html("Digits Only").show().fadeOut("slow");
                  return false;
              }
          });

          $("#Address").val($("#txtAddress").val());

          $(".mon-answer select").each(function () {
              $(this).trigger("change");
          });

          if ($("#lblRole").html() == "NEW") {
              $("#submitme").show();
              $("#closeme").show();
          }
          else if ($("#lblRole").html() == "CSR") {
              $("#submitme").hide();
              $("select").attr("disabled", "disabled");
              $("textarea").attr("disabled", "disabled");
              $("#closeme").show();
              $("#deleteme").hide();
          }
          else {
              $("#submitme").attr("value", "Update");
              $("#submitme").show();
              $("#deleteme").show();
              $("#closeme").show();
          }
          setCategory($(".select-call-type select").val());
      });

      function testblanks(me) {

          var tot = 0;
          var possible = 0;
          var p;
          var v;
          var blanksfound = false;
          if (me != null) {
              p = $(me).parent();
              v = $(me).val();
              if (v == "") {
                v = "&nbsp;"
              }
              else {
                if (isNaN(v)) {
                  v = "&nbsp;"
                }
              }
              $("span", p).html(v);
          }
          $(".mon-answer select").each(function () {
              if (!$(this).hasClass("mon-answer-special")) {
                var val = $(this).val()
                if (val != "") {
                  if (!isNaN(val)) {
                    tot += parseInt(val,10);
                    possible += 1;
                  }
                }
                else {
                  //blanksfound = true;
                }
              }
          });
          blanksfound = (possible == 0) || ($("#selReviewType").val() == "") || ($("#selCallpartyType").val() == "") || ($("#selOnlineGuidance").val() == "");
          if ($("#lblAgent").html() == "") blanksfound = true;
          if (!blanksfound) {
              $(".mon-submit").removeAttr("disabled");
          }
          else {
              $(".mon-submit").attr("disabled", "disabled");
          }
          $(".mon-total").html(tot + "/" + possible);
          var sr = "";
          if (possible == 0) {
            sr = "100%";
          }
          else {
            sr = ((tot/possible) * 100).toFixed() + '%';
          }
          $(".mon-total-points").html(tot);
          $(".mon-total-possible").html(possible);
          $(".mon-success-rate").html(sr);
      }
      $(".mon-answer select").bind("change", function () {
          testblanks(this);
      });
      $("#selReviewType").bind("change", function () {
          testblanks(this);
      });
      $("#selCallpartyType").bind("change", function () {
          testblanks(this);
      });
      $("#selOnlineGuidance").bind("change", function () {
          testblanks(this);
      });

      function setCategory(cat) {
        if (cat == "Collections") {
            $("#selCategory_collections").show();
            $("#selCategory_move").hide();
        }
        else {
            $("#selCategory_collections").hide();
            $("#selCategory_move").show();
        }
      }

      $(".select-call-type select").bind("change", function () {
          setCategory($(this).val());
      });

    function exists(me) {
        return (typeof me != 'undefined');
    }
  </script>
  </div>
</body>
</html>
