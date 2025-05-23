<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_Prosper_Prototype.aspx.cs" ValidateRequest="false" Inherits="_Monitor_Prosper_Prototype" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Prosper Scorecard</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>
<style type="text/css">
    .page-wrapper {
      width: 910px;
      margin: 0px auto 0 auto;
      position: relative;
      border: 1px solid gray;
    }
    .error-category,.error-anchor
    {
/*        vertical-align: middle;*/
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
        /* overflow-y:scroll; */
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
    
    .mon-table 
    {
        font-weight: normal;
        font-size: 11px;
        width: 100%;
    }
    
    .mon-table tbody 
    {
        display:block;
        overflow-y: scroll;        
    }
    
    .mon-table thead
    {
        display:block;
        overflow-y: scroll;
    }
    
    .mon-table td 
    {
        border: 0px;
        margin: 0px;
    }
    
    .mon-table select
    {
        width: 100%;
        text-align-last:center;
    }
    .mon-table input[type=text], .mon-table textarea
    {
        width: 100%;
    }

    .mon-table-header
    {
        text-align: left;
    }
    .mon-table-columnheader
    {
        background-color: MediumBlue;
        color: White;
        font-weight: bold;
    }
    .sel-red
    {
        background-color: Red;
    }
    .sel-green
    {
        background-color: LightGreen;
    }
    .sel-yellow 
    {
        background-color: LightYellow;
    }
    .sel-autofail
    {
        background-color: Yellow;
        text-align: center;
        font-weight: bold;
        border: 1px solid black;
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
                    <div class="logo" style="margin-left:0px;margin-top:10px;"><h1><span>Acuity &reg;</span></h1></div>
                    <div class="heading" style="margin-left:0px;margin-top:10px;">Prosper Scorecard</div>
                </th>
                <th>Agent Name</th>
                <th colspan="3" class="mon-sys-AgentName"><asp:Label id="lblAgentName" runat="server"></asp:Label><asp:Label style="display:none;" id="lblAgent" runat="server"></asp:Label></th>
                <th><input type="button" onclick="javascript:window.print();" value="Print" /></th>
                <th></th>
            </tr>
            <tr class="mon-table-header">
                <th>CLX System Ref #</th>
                <th colspan="3" class="mon-sys-Callid"><asp:Label ID="lblCallid" runat="server"></asp:Label></th>
                <th></th>
                <th></th>
            </tr>
            <tr class="mon-table-header">
                <th>Spctrm # Cust/Loan #</th>
                <th><input type="text" class="qst qst-spectrum-number" qst="Spctrm # Cust/Loan #" /></th>
                <th></th>
                <th>
                    <div class="mon-show-acknowledgementrequired" style="display:none;border: 2px solid red;padding:8px;text-align: center;">
                        <span class="mon-show-isagent" style="font-weight:bold;display:none;"><br />Click the button below to acknowledge<br />that you have seen this monitor.<br />
                                                        <br /><asp:Button id="acknowledgeme" runat="server" class="mon-acknowledge" type="submit" Text="Acknowledge Monitor" /></span>
                        <span class="mon-show-isnotagent" style="color:Red;display:none;">The agent must log in to acknowledge this monitor.</span>
                    </div>
                    <span class="mon-show-acknowledgementreceived" style="display:none;">
                        This monitor was acknowledged by the Agent: <asp:Label ID="lblAcknowledgementDate" runat="server"></asp:Label>
                    </span>
                </th>
            </tr>
            <tr class="mon-table-header">
                <th>Date & Time</th>
                <th colspan="3" class="mon-sys-Calldate"><asp:Label ID="lblCalldate" runat="server"></asp:Label></th>
                <th></th>
                <th></th>
            </tr>
            <tr>
                <th style="background-color:Orange;">Quality Score</th>
                <th style="background-color:Orange;" class="mon-sys-score"></th>
                <th></th>
                <th style="text-align: left;">Evaluated On: <span class="mon-sys-Entdt"><asp:Label ID="lblCurrentDate" runat="server"></asp:Label></span></th>
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
                <td style="background-color:IndianRed;width:10%">Compliance</td>
                <td style="text-align: center;width:5%">1</td>
                <td style="background-color:Orange;width:39%" colspan="2" >Customer Authenticated / Verified</td>
                <td style="background-color:Orange;text-align: center;width:10%;" >1</td>
                <td style="text-align: center;width:10%;">
                    <select class="qst qst-sec-1" qst="1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td rowspan="14" style="width:1%"><span class="mon-sys-autofail" style="display:none;"><br />A<br />U<br />T<br />O<br /><br />F<br />A<br />I<br />L</span></td>
                <!-- <td style="background-color:SkyBlue;width:24%"><input class="qst" qst="C-1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">1.1</td>
                <td></td>
                <td>Name Verified</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select  class="qst" qst="1.1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-1.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">1.2</td>
                <td></td>
                <td>DOB Verified</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="1.2">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-1.2" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">1.3</td>
                <td></td>
                <td>SSN Verified</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="1.3">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-1.3" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">1.4</td>
                <td></td>
                <td>Did Not Release Info / Discuss Account With Unauthorized 3rd Party</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="1.4">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-1.4" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">2.1</td>
                <td style="background-color:Orange;" colspan="2">Call Recording Disclosure Read</td>
                <td style="background-color:Orange;text-align: center;" >1</td>
                <td style="text-align: center;">
                    <select class="qst" qst="2.1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-2.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">3</td>
                <td style="background-color:Orange;" colspan="2">Collections Related Compliance</td>
                <td style="background-color:Orange;text-align: center;" >1</td>
                <td style="text-align: center;">
                    <select class="qst qst-sec-3" qst="3">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-3" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">3.1</td>
                <td></td>
                <td>FDCPA Adhered to</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="3.1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-3.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">3.2</td>
                <td></td>
                <td>ACH Payment Requirements Adhered to</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="3.2">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-3.2" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">3.3</td>
                <td></td>
                <td>Promise to Pay Adherence</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="3.3">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-3.3" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">3.4</td>
                <td></td>
                <td>Proper Call Escalation Process Followed</td>
                <td style="text-align: center;">0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="3.4">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-3.4" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">4.1</td>
                <td style="background-color:Orange;" colspan="2">Agent Did Not Mislead the Customer</td>
                <td style="background-color:Orange;text-align: center;" >1</td>
                <td style="text-align: center;">
                    <select class="qst" qst="4.1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-4.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">5.1</td>
                <td style="background-color:Orange;" colspan="2">Did the Agent Annotate the Interaction?</td>
                <td style="background-color:Orange;text-align: center;" >1</td>
                <td style="text-align: center;">
                    <select class="qst" qst="5.1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-5.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">6.1</td>
                <td style="background-color:Orange;" colspan="2">Settlement Disclosure Read</td>
                <td style="background-color:Orange;text-align: center;" >1</td>
                <td style="text-align: center;">
                    <select class="qst" qst="6.1">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-6.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:IndianRed;">Compliance</td>
                <td style="text-align: center;">Comp(C)</td>
                <td style="background-color:PeachPuff;" colspan="2">Multiple Compliance Criteria Missed? (Non-scoring)</td>
                <td style="background-color:PeachPuff;text-align: center;" >0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="Comp(C)">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-Comp(C)" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:LightPink;">High Penalty</td>
                <td style="text-align: center;">7</td>
                <td style="background-color:Orange;" colspan="2">High Penalty / Priority Issues (mark 'No' when criteria is met)</td>
                <td style="background-color:Orange;text-align: center;" >1</td>
                <td style="text-align: center;">
                    <select class="qst qst-sec-7" qst="7">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-7" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:LightPink;">High Penalty</td>
                <td style="text-align: center;">7.1</td>
                <td></td>
                <td>Disclosure of Non-PII / Non-Loan Details Prior to IDV</td>
                <td style="text-align: center;">-10%</td>
                <td style="text-align: center;">
                    <select class="qst qst-hp-7_1" qst="7.1">
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-7.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:LightPink;">High Penalty</td>
                <td style="text-align: center;">7.2</td>
                <td></td>
                <td>Complaint Not Captured</td>
                <td style="text-align: center;">-15%</td>
                <td style="text-align: center;">
                    <select class="qst qst-hp-7_2" qst="7.2">
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-7.2" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:LightPink;">High Penalty</td>
                <td style="text-align: center;">Comp(HP)</td>
                <td style="background-color:PeachPuff;" colspan="2">Multiple Compliance Criteria Missed? (Non-scoring)</td>
                <td style="background-color:PeachPuff;text-align: center;" >0</td>
                <td style="text-align: center;">
                    <select class="qst" qst="Comp(HP)">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-Comp(HP)" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:SkyBlue;">Business</td>
                <td style="text-align: center;">8</td>
                <td style="background-color:Orange;" colspan="2">Call Effectiveness</td>
                <td style="background-color:Orange;text-align: center;" >Varied</td>
                <td style="text-align: center;">
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-8" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:SkyBlue;">Business</td>
                <td style="text-align: center;">8.1</td>
                <td></td>
                <td>How Effective Was the Call</td>
                <td style="text-align: center;"></td>
                <td style="text-align: center;">
                    <select class="qst qst-effectiveness" qst="8.1">
                        <option value="">--select--</option>
                        <option value="Best in class" class="sel-green">Best in class</option>
                        <option value="Highly effective" class="sel-green">Highly effective</option>
                        <option value="Effective" class="sel-green">Effective</option>
                        <option value="Ineffective" class="sel-green">Ineffective</option>
                        <option value="Non-Compliant"  class="sel-red">Non-Compliant</option>
                    </select>
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-8.1" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:LightGray;">Non Scoring</td>
                <td style="text-align: center;"></td>
                <td style="background-color:Orange;" colspan="2"></td>
                <td style="background-color:Orange;text-align: center;" ></td>
                <td style="text-align: center;">
                </td>
                <td></td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-" type="text" /></td> -->
            </tr>
            <tr>
                <td style="background-color:LightGray;">Non Scoring</td>
                <td style="text-align: center;">1(NS)</td>
                <td></td>
                <td>Was this a Non-Compliant Call?</td>
                <td style="text-align: center;"></td>
                <td style="text-align: center;">
                    <select  class="qst" qst="1(NS)">
                        <option value="Yes" class="sel-green">Yes</option>
                        <option value="No" class="sel-red">No</option>
                        <option value="N/A"  class="sel-yellow">N/A</option>
                    </select>
                </td>
                <td></td>
                <td style="text-align: center;"><input type="checkbox" class="qst" qst="Client-Scored" value="Yes" /> Client-Scored Monitor</td>
                <!-- <td style="background-color:SkyBlue;"><input class="qst" qst="C-1(NS)" type="text" /></td> -->
            </tr>
            <tr>
                <td colspan="6">Acuity Monitor based on Prosper Rev 6-09-17</td>
            </tr>
            <tr>
                <td style="border: 1px solid gray;vertical-align: middle;padding: 10px;min-height: 50px;">Strengths and Areas of Opportunity</td>
                <td style="border: 1px solid gray;vertical-align: middle;padding: 10px;min-height: 50px;" colspan="5">
                    <textarea class="qst qst-comments" qst="Comments"></textarea>
                </td>
                <td></td>
                <td style="text-align: center;">
                        <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Submit Monitor" />
                        <asp:Button id="deleteme" runat="server" class="mon-delete" hidden="true" type="submit" Text="Delete"  />
                        <asp:Button id="closeme" runat="server" class="mon-close" hidden="true" type="submit" Text="Close"  />
                </td>

            </tr>
                <!--
                LightPink
                SkyBlue
                LightGray
                -->
        </tbody>
    </table>
    <div style="display:none;">
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
        <asp:Label ID="lblAcknowledgementRequired" runat="server"></asp:Label>
    </div>

    <!-- END OF PROSPER HTML - All below here should be eliminatable -->
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
                <li class="mon-field" ><label>Review&nbsp;Type</label><select id="selReviewType" runat="server"><option value="">--select--</option><option value="Recorded">Recorded</option><option value="Live">Live</option><option value="Self-Observation">Self-Observation</option><option value="Calibration">Calibration</option><option value="Diagnostic">Diagnostic</option><option value="QA Team">QA Team</option><option value="QA of QA">QA of QA</option><option value="Targeted">Targeted</option></select></li>
                <li class="mon-field" ><label>Reviewer:</label><span><asp:Label id="lblSupervisorName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label><asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label><asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label></span></li>
                <li class="mon-field" ><label>Call&nbsp;Party&nbsp;Type</label>
                    <select id="selCallpartyType" runat="server"><option value="">--select--</option>
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
                    </select></li>
                <li class="mon-field" ><label>Provided<br />Online&nbsp;Servicing<br />Guidance</label>
                    <select id="selOnlineGuidance" runat="server"><option value="">--select--</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select></li><li>&nbsp;</li><li>&nbsp;</li>
                <li class="mon-field" ><label>Call Date:</label><span>STOLEN</span></li>
                <li class="mon-field" ><label>Assoc&nbsp;Name:</label><span>STOLEN</span></li>
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
                  <span class="mon-question">Sizzle Given</span>
                  <span class="mon-answer"><select id="Q13"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Upgrade Pitch</span>
                  <span class="mon-answer"><select id="Q14"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Add Night Pitch</span>
                  <span class="mon-answer"><select id="Q15"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Tickets Pitch</span>
                  <span class="mon-answer"><select id="Q16"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Proactive Offer Refund based on Recommend status?</span>
                  <span class="mon-answer"><select id="Q17"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Attempt to save reservation or package cancellation<br />based on Recommend status?</span>
                  <span class="mon-answer"><select id="Q18"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
              </li>
              <li>
                  <span class="mon-question">Cruise Pitch</span>
                  <span class="mon-answer"><select id="Q19"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option><option value="N/A">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
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
                    <span><select class="error-category" id="QA1C"><option value=""></option><option value="Qualifications">Qualifications</option><option value="Accomodations">Accomodations</option><option value="Incentives">Incentives</option><option value="Tour">Tour</option><option value="Unapproved Purchase">Unapproved Purchase</option><option value="Updating Concierge">Updating Concierge</option><option value="Payment Details">Payment Details</option><option value="Agent Performance">Agent Performance</option></select></span>
                    <span class="error-anchor error-anchor-QA1C"></span>
                  </div>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA1Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <div style="display:table-cell;vertical-align:middle;">
                    <span><select class="error-category" id="QA2C"><option value=""></option><option value="Qualifications">Qualifications</option><option value="Accomodations">Accomodations</option><option value="Incentives">Incentives</option><option value="Tour">Tour</option><option value="Unapproved Purchase">Unapproved Purchase</option><option value="Updating Concierge">Updating Concierge</option><option value="Payment Details">Payment Details</option><option value="Agent Performance">Agent Performance</option></select></span>
                    <span class="error-anchor error-anchor-QA2C"></span>
                  </div>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA2Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <div style="display:table-cell;vertical-align:middle;">
                    <span><select class="error-category" id="QA3C"><option value=""></option><option value="Qualifications">Qualifications</option><option value="Accomodations">Accomodations</option><option value="Incentives">Incentives</option><option value="Tour">Tour</option><option value="Unapproved Purchase">Unapproved Purchase</option><option value="Updating Concierge">Updating Concierge</option><option value="Payment Details">Payment Details</option><option value="Agent Performance">Agent Performance</option></select></span>
                    <span class="error-anchor error-anchor-QA3C"></span>
                  </div>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA3Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <span class="mon-question">Pass/Fail</span>
                  <span class="mon-answer"><select id="QA4"><option value="">--select--</option><option value="100">Pass</option><option value="0">Fail</option></select><span class="mon-subtotal">&nbsp;</span></span>
                </li>
                <li>
                  <span class="mon-question">Error Sent to BVSC</span>
                  <span class="mon-answer"><select id="QA5"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option></select><span class="mon-subtotal">&nbsp;</span></span>
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
                  <span class="mon-answer"><select id="QA7"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option></select><span class="mon-subtotal">&nbsp;</span></span>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA7Comments" cols="90" rows="1"></textarea></p>
                </li>
            </ol>
            <div class="mon-section">&nbsp;&nbsp;Quality Assurance Supervisor</div>
            <ol start="8">
                <li>
                  <span class="mon-question">Deny Challenge?</span>
                  <span class="mon-answer"><select id="QA8"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option></select><span class="mon-subtotal">&nbsp;</span></span>
                  <p class="mon-comments"><label>Comments:</label><textarea id="QA8Comments" cols="90" rows="1"></textarea></p>
                </li>
                <li>
                  <span class="mon-question">QA Error</span>
                  <span class="mon-answer"><select id="QA9"><option value="">--select--</option><option value="Yes">Yes</option><option value="No">No</option></select><span class="mon-subtotal">&nbsp;</span></span>
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
  <script type="text/javascript" language="javascript">


      $(document).ready(function () {
          var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
          $(".mon-acknowledge").bind("click", function () {
              var data = {
                  lib: "qa",
                  cmd: "acknowledgeComplianceMonitor",
                  monitorid: $("#lblMonitorId").html() //Note the lower case on id
              };
              a$.ajax({
                  type: "POST",
                  service: "JScript",
                  async: true,
                  data: data,
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: monitoracknowledged
              });
              function monitoracknowledged(json) {
                  if (a$.jsonerror(json)) {
                      alert("ERROR:" + json.msg);
                  }
                  else {
                      alert("Monitor Acknowledged, Thank You.");
                      //return_to_v1();
                  }
              }
              return false;
          });
          $(".mon-submit").bind("click", function () {
              //TODO: Gather all of your variables to be passed to saveQaForm
              var mykpi = 88;
              var answers = [];
              $(".qst").each(function () {
                  myval = $(this).val()
                  if ($(this).is("input")) {
                      if ($(this).attr("type") == "checkbox") {
                          if ($(this).is(":checked")) {
                              myval = "Yes";
                              if ($(this).attr("qst") == "Client-Scored") {
                                  mykpi = 84;
                              }
                          }
                          else {
                              myval = "No";
                          }
                      }
                  }
                  answers.push({ friendlyname: $(this).attr("qst"), answertext: myval, score: 0, value: '', version: 0 });
              });
              var data = {
                  lib: "qa",
                  cmd: "saveQaForm",
                  formId: 10,
                  sqfCode: 69,
                  kpi: mykpi,
                  kpiSet: [88, 84],
                  database: "C",
                  examinee: $("#lblAgent").html(),
                  score: $(".mon-sys-score").html().replace("%", ""),
                  value: ($(".mon-sys-autofail").eq(0).css("display") != "none") ? "Auto Fail" : "",
                  answers: answers,
                  callId: $("#lblCallid").html(),
                  callDate: $("#lblCalldate").html(),
                  callTime: "",
                  clientDept: "",
                  acknowledgement: true //Test this soon
              };
              if ($("#lblMode").html() != "new") {
                  data.monitorId = $("#lblMonitorId").html();
              }

              a$.ajax({
                  type: "POST",
                  service: "JScript",
                  async: true,
                  data: data,
                  dataType: "json",
                  cache: false,
                  error: a$.ajaxerror,
                  success: monitorsaved
              });
              function monitorsaved(json) {
                  if (a$.jsonerror(json)) {
                      alert("ERROR:" + json.msg);
                  }
                  else {
                      return_to_v1();
                  }
              }
              return false;
          });

          $(".mon-close").bind("click", function () {
              return_to_v1();
              return false;
          });

          $(".mon-delete").bind("click", function () {
              if (confirm("Are you sure you want to delete this monitor?")) {
                  var data = {
                      lib: "qa",
                      cmd: "deleteQaForm",
                      formId: 10,
                      monitorId: $("#lblMonitorId").html(),
                      database: "C"
                  };
                  a$.ajax({
                      type: "POST",
                      service: "JScript",
                      async: true,
                      data: data,
                      dataType: "json",
                      cache: false,
                      error: a$.ajaxerror,
                      success: monitordeleted
                  });
                  function monitordeleted(json) {
                      if (a$.jsonerror(json)) {
                          alert("ERROR:" + json.msg);
                      }
                      else {
                          return_to_v1();
                      }
                  }
              }
              return false;
          });

          function return_to_v1() {
              if ($("#lblMode").html() == "new") {
                  window.location = "//ces.acuityapm.com/monitor/monitor.aspx";
              }
              else {
                  window.location = "//ces.acuityapm.com/monitor/monitor_review.aspx";
              }
          }

          $(".mon-table select").bind("change", function () {
              var newval = $(this).val();
              var newcolor = "";
              $("option", this).each(function () {
                  if ($(this).val() == newval) {
                      //alert("color = " + $(this).css("background-color"));
                      newcolor = $(this).css("background-color");
                  }
              });
              if (!isIE11) {
                  $(this).css("background-color", "");
                  if (newcolor != "") {
                      $(this).css("background-color", newcolor);
                  }
              }
              if (allsetup) {
                  function cascadeup(sec, qs) {
                      //Force upward cascade of subsections.
                      var any_no = false;
                      var any_yes = false;
                      $(".qst").each(function () {
                          var qst = $(this).attr("qst");
                          var qval = $(this).val();
                          var inset = false;
                          for (var i in qs) {
                              if (qst == qs[i]) {
                                  inset = true;
                                  //alert("debug: inset qst = " + qst + ", qval = " + qval);
                              }
                          }
                          if (inset) {
                              if (!any_no) if (qval == "No") any_no = true;
                              if (!any_yes) if (qval == "Yes") any_yes = true;
                          }
                      });
                      if (any_no) {
                          $(".qst-sec-" + sec).val("No");
                          if (!isIE11) {
                              $(".qst-sec-" + sec).css("background-color", "Red");
                          }
                      }
                      else if (any_yes) {
                          $(".qst-sec-" + sec).val("Yes");
                          if (!isIE11) {
                              $(".qst-sec-" + sec).css("background-color", "LightGreen");
                          }
                      }
                  }
                  cascadeup("1", ["1.1", "1.2", "1.3", "1.4"]);
                  cascadeup("3", ["3.1", "3.2", "3.3", "3.4"]);
                  cascadeup("7", ["7.1", "7.2"]);
              }
              setscore();
          });

          var allsetup = false;
          //Prosper Selects
          function prosperselectsetup() {
              if ($("#lblMode").html() == "new") {
                  $(".mon-table select").each(function () {
                      $(this).val("N/A");
                      $(this).trigger("change");
                  });
                  allsetup = true;
              }
              else {
                  //TODO: Read in the answers from getqaform.
                  var data = {
                      lib: "qa",
                      cmd: "getQaForm",
                      formId: 10,
                      monitorId: $("#lblMonitorId").html(),
                      database: "C"
                  };
                  a$.ajax({
                      type: "POST",
                      service: "JScript",
                      async: true,
                      data: data,
                      dataType: "json",
                      cache: false,
                      error: a$.ajaxerror,
                      success: monitorloaded
                  });
                  function monitorloaded(json) {
                      //alert("debug:monloaded");
                      if (a$.jsonerror(json)) {
                          alert("ERROR:" + json.msg);
                      }
                      else {
                          $(".qst").each(function () {
                              var qst = $(this).attr("qst");
                              for (var i in json.form.answers) {
                                  if (json.form.answers[i].friendlyname == qst) {
                                      if (qst == "Client-Scored") {
                                          if (json.form.answers[i].answertext == "Yes") {
                                              $(this).prop("checked", true);
                                          }
                                      }
                                      else {
                                          $(this).val(json.form.answers[i].answertext);
                                      }
                                      break;
                                  }
                              }
                          });
                          $(".mon-table select").each(function () {
                              $(this).trigger("change");
                          });
                          allsetup = true;
                      }
                  }

              }
              $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
              window.addEventListener("resize", function () {
                  $(".mon-table tbody").css("height", (window.innerHeight - 120) + "px");
              });
          }
          prosperselectsetup();

          $(".mon-table .qst-spectrum-number").bind("change", function () {
              setscore();
          });
          $(".mon-table .qst-comments").bind("change", function () {
              //Eliminate carriage returns right here.
              $(this).val($(this).val().replace(/(?:\r\n|\r|\n)/g, " "));
          });


          function setscore() {

              //Questions where a "No" value make it 60%
              var qs = ["1", "2.1", "3", "4.1", "5.1", "6.1"];
              var score = 100.0;
              var autofail = false;
              var is60percent = false;
              $(".qst").each(function () {
                  var qst = $(this).attr("qst");
                  if ($(this).val() == "No") {
                      for (var i in qs) {
                          if (qst == qs[i]) {
                              is60percent = true;
                          }
                      }
                  }
              });
              var scoreerror = false;
              if (is60percent) {
                  score = 60.0;
                  autofail = true;
              }
              else {
                  var ef = $(".qst-effectiveness").eq(0).val();
                  switch (ef) {
                      case "Best in class":
                          score = 100.0;
                          break;
                      case "Highly effective":
                          score = 95.0;
                          break;
                      case "Effective":
                          score = 87.0;
                          break;
                      case "Ineffective":
                          score = 80.0;
                          break;
                      case "Non-Compliant":
                          score = 60.0;
                          break;
                      default: scoreerror = true;
                  }
              }

              if (autofail) {
                  $(".mon-sys-autofail").parent().addClass("sel-autofail");
                  $(".mon-sys-autofail").show();
              }
              else {
                  $(".mon-sys-autofail").parent().removeClass("sel-autofail");
                  $(".mon-sys-autofail").hide();
              }

              if ($(".qst-hp-7_1").val() == "No") {
                  score -= 10.0;
              }
              if ($(".qst-hp-7_2").val() == "No") {
                  score -= 15.0;
              }

              if (scoreerror) {
                  $(".mon-sys-score").html("Incomplete");
              }
              else {
                  $(".mon-sys-score").html(score + "%");
              }

              //Find CLX System Ref #
              if (($(".qst-spectrum-number").eq(0).val() == "") || scoreerror) {
                  $(".mon-submit").attr("disabled", "disabled");
              }
              else {
                  $(".mon-submit").removeAttr("disabled");
              }


          }
          setscore();

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
              if ($("#lblAcknowledgementDate").html() != "") {
                  $(".mon-show-acknowledgementreceived").show();
              }
              else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                  $(".mon-show-acknowledgementrequired").show();
                  $(".mon-show-isagent").show();
              }
          }
          else {
              $("#submitme").attr("value", "Update");
              $("#submitme").show();
              $("#deleteme").show();
              $("#closeme").show();
              if ($("#lblAcknowledgementDate").html() != "") {
                  $(".mon-show-acknowledgementreceived").show();
              }
              else if ($("#lblAcknowledgementRequired").html() == "Yes") {
                  $(".mon-show-acknowledgementrequired").show();
                  $(".mon-show-isnotagent").show();
              }
          }

          //////////////////////// END OF PROSPER, Move all useful items above this line.

          //                  <select class="error-category" id="QAC1"><option value=""></option><option value="Qualifications">Qualifications</option><option value="Accomodations">Accomodations</option><option value="Incentives">Incentives</option><option value="Tour">Tour</option><option value="Unapproved Purchase">Unapproved Purchase</option><option value="Updating Concierge">Updating Concierge</option><option value="Payment Details">Payment Details</option><option value="Agent Performance">Agent Performance</option></select>
          //                  <div class="error-anchor error-anchor-QAC1"></div>

          $(".error-category").bind("change", function () {
              var opts;
              switch ($(this).val()) {
                  case "Qualifications":
                      opts = ["Bankruptcy", "Spouse Significant Other", "2 Forms ID", "Sole/Shared Ownership", "30/90 Days", "15-Month", "Good Standing", "Group Travel", "Age 25", "Income", "FICO", "CC/Debit"];
                      break;
                  case "Accomodations":
                      opts = ["Arrival date not booked", "Length of Stay", "Based on Availability", "Incidentals", "Incorrect Tax", "Cxl Policy", "Unit Error"];
                      break;
                  case "Incentives":
                      opts = ["Dining Dough", "Activity Menu", "ML38", "Mastercard", "2 or more gifts given", "Gift not confirmed", "Extension", "Free Nights", "Free Upgrade", "Cruise"];
                      break;
                  case "Tour":
                      opts = ["Length of Presentation", "Choose Time", "Presentation Detail"];
                      break;
                  case "Unapproved Purchase":
                      opts = ["Not on Deed", "Transferring Package", "Unauthorized State"];
                      break;
                  case "Updating Concierge":
                      opts = ["Customer Info", "# of guests", "Account #", "Comments", "Tenn Tour Line"];
                      break;
                  case "Payment Details":
                      opts = ["Using Anothers Card", "Incorrect Charge", "Incorrect CC Verification"];
                      break;
                  case "Agent Performance":
                      opts = ["Disposition", "Request to CXL/Refund", "Call Recording Statement", "False Claims", "Another Account", "Incorrect Offer", "Pitch vs. Offer", "Checklist Error", "Missing Genie"];
                      break;
                  default:
                      opts = ["(No Errors Found)"];
                      break;
              }
              var blow = "";
              if ($(this).val() != "") {
                  blow = '<select multiple class="error-category-error" id="' + $(this).attr("id").substr(0, 3) + "E" + '">';
                  for (var i in opts) {
                      blow += '<option value="' + opts[i] + '">' + opts[i] + "</option>";
                  }
                  blow += "</select>";
              }
              $(".error-anchor-" + $(this).attr("id")).html(blow);
          });
          $("NOT.mon-submitANYMORE").bind("click", function () {
              $("#txtTotal").val($("#montotal").html());
              $("#txtAssuranceTotal").val($("#assurancetotal").html()); //new
              $("#txtTotalPoints").val($("#montotalpoints").html());
              $("#txtTotalPossible").val($("#montotalpossible").html());
              $("#txtSuccessRate").val($("#monsuccessrate").html());
              $("#txtComments").val($("#Comments").val());

              for (var i = 1; i <= 19; i++) {
                  $("#txtQ" + i).val($("#Q" + i).val());
                  $("#txtQ" + i + "text").val($("#Q" + i + " option:selected").text());
                  $("#txtQ" + i + "Comments").val($("#Q" + i + "Comments").val());
              }

              for (var i = 1; i <= 3; i++) {
                  $("#txtQA" + i + "C").val($("#QA" + i + "C").val());
                  $("#txtQA" + i + "Ctext").val($("#QA" + i + "Ctext").val());
                  $("#txtQA" + i + "E").val($("#QA" + i + "E").val());
                  $("#txtQA" + i + "Etext").val($("#QA" + i + "Etext").val());
                  $("#txtQA" + i + "Comments").val($("#QA" + i + "Comments").val());
              }
              for (var i = 4; i <= 9; i++) {
                  $("#txtQA" + i).val($("#QA" + i).val());
                  $("#txtQA" + i + "Comments").val($("#QA" + i + "Comments").val());
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

          function buttonsforanswers() {
              $(".mon-answer select").each(function () {
                  if (!$(this).parent().hasClass("mon-answer-special")) {
                      var me = this;
                      $(" option", this).each(function () {
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

          var opts = ["BCT - Busy Can't Talk",
"BK - Booked",
"BSY - Busy Signal",
"Call Back -- General",
"Call Back -- Revenue",
"CB - Callback",
"CS - Customer Service",
"DNA - Date Not Available",
"DNC - Do Not Call",
"Dropped Call",
"IBB -- Inbound Line Booked",
"IBQ -- Inbound Line Questions",
"LC - Lost Connection",
"LM - Left Message",
"Manual OB -- Booked",
"NA -- Not Answered",
"NDM - No Dates in Mind",
"NI - Not Interested",
"NIS -- Not In Service",
"NQ - Not Qualified",
"NT - No Tone",
"PB - Previously Booked",
"PT - Previously Traveled",
"QHU - Quick Hang Up",
"RC - Recommend",
"RD - Refund",
"RQ - Request",
"SC - Spanish Caller",
"Unable to Hear Audio",
"VF - Verify Fail",
"VM - Voicemail",
"VS - Verified Sale",
"WN - Wrong Number"
];
          var blow = '<option value=""></option>';
          for (var i in opts) {
              blow += '<option value="' + opts[i] + '">' + opts[i] + "</option>";
          }
          $("#QA6").html(blow);

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
          for (var i = 1; i <= 3; i++) {
              $("#QA" + i + "C").val($("#txtQA" + i + "C").val());

              if ($("#txtQA" + i + "C").val() != "") {

                  $("#QA" + i + "C").trigger("change");
                  setTimeout(function () {
                      for (var i = 1; i <= 3; i++) {
                          if ($("#txtQA" + i + "E").val() != "") {
                              var sp = $("#txtQA" + i + "E").val().split(",");
                              for (var o in sp) {
                                  $("#QA" + i + "E option[value='" + sp[o] + "']").attr("selected", "selected");
                              }
                          }

                      }
                  }, 100);
              }
              //TODO: Put in the QA#E multi-selects.

              $("#QA" + i + "Comments").val($("#txtQA" + i + "Comments").val());
              $("#QA" + i + "Comments").autogrow();
          }
          for (var i = 4; i <= 9; i++) {
              $("#QA" + i).val($("#txtQA" + i).val());
              $("#QA" + i + "Comments").val($("#txtQA" + i + "Comments").val());
              $("#QA" + i + "Comments").autogrow();
          }

          //Buttons for answers.
          function buttonsforanswers() {
              $(".mon-answer select").each(function () {
                  if (!$(this).parent().hasClass("mon-answer-special")) {
                      var me = this;
                      $(" option", this).each(function () {
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

          $(".highlight-hover").bind("click", function () {
              var text = $(this).val();
              var sel = $(" select", $(this).parent());
              $(" option", sel).each(function () {
                  if (text == $(this).text()) {
                      $(sel).val($(this).val())
                  }
              });
              $(sel).trigger("change");
              $(".highlight-hover", $(this).parent()).removeClass("highlight");
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

          setCategory($(".select-call-type select").val());
      });

      function testblanks(me) {
		      var asstot = -1;
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
                          if ($(this).attr("id") == "QA4") {
                              asstot = parseInt(val, 10);
                          }
                          else {
                              tot += parseInt(val, 10);
                              possible += 1;
                          }
                      }
                  }
                  else {
                      //blanksfound = true;
                  }
              }
          });
          blanksfound = (possible == 0) || ($("#selReviewType").val() == "") || ($("#selCallpartyType").val() == "") || ($("#selOnlineGuidance").val() == "") /* || (asstot < 0) */;
          if ($("#lblAgent").html() == "") blanksfound = true;
          /*
          if (!blanksfound) {
              $(".mon-submit").removeAttr("disabled");
          }
          else {
              $(".mon-submit").attr("disabled", "disabled");
          }
          */
          if (asstot < 0) {
              $(".assurance-total").html('<span style="color:red;">QA Pass/Fail not specified - you may submit with no QA data.</span>');
          }
          else {
              $(".assurance-total").html(asstot);
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
      /*
      $("#submitme").bind("click", function() {
		   	if (asstot < 0) {
    	 		return confirm("Pass/Fail is not selected.\nSubmit Monitor with no Quality Assurance?");
       	}
       	return true;
      })
      */

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
  </form>
</body>
</html>
