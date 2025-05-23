<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_Toyota.aspx.cs" ValidateRequest="false" Inherits="_Monitor_Toyota" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<!--
  IndianRed #0091D0
  LightaPink #965BA5
  SkayBlue #18bba2
  Mageanta #e04984
  -->
<html xmlns="http://www.w3.org/1999/xhtml">
  <head id="Head1" runat="server">
    <title>ACT Toyota V1 Scorecard</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>

    <link rel="stylesheet" href="Monitor_Toyota.css?r=2" />

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
                  <div class="heading">ACT Toyota Scorecard</div>
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
                <th class="editable">Call ID</th>
                <th colspan="3" class="mon-sys-Callid">
                  <asp:Label ID="lblCallid" runat="server"></asp:Label>
                </th>
                <th></th>
                <th></th>
              </tr>
              <tr class="mon-table-header">
                <th class="editable">Call Direction</th>
                <th colspan="1">
                  <select  class="qst editable qst-calldirection" qst="CallDirection">
                    <option value="">--Select--</option>
                    <option value="Inbound">Inbound</option>
                    <option value="Outbound">Outbound</option>
                  </select>
                </th>
                <th colspan="3"></th>
                <th></th>
              </tr>
              <tr class="mon-table-header">
                <th class="editable">Language</th>
                <th colspan="1">
                  <select  class="qst editable qst-language" qst="Language">
                    <option value="">--Select--</option>
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                  </select>
                </th>
                <th colspan="3"></th>
                <th></th>
              </tr>
              <tr class="mon-table-header">
                <th class="editable">Toyota Account #</th>
                <th><input type="text" class="qst qst-account-number" qst="AccountNumber" /></th>
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
                <th style="background-color:#EEA900;text-align: left;padding-left: 10px;">Quality Score</th>
                <th style="background-color:#EEA900;" class="mon-sys-score"></th>
                <th class="mon-sys-autofail">&nbsp;AUTO FAIL&nbsp;</th>
                <th style="text-align: left;font-style: italic;padding-bottom: 8px;padding-top: 8px;">
                  <span>
                    Evaluated On:
                    <span class="mon-sys-Entdt">
                        <asp:Label ID="lblCurrentDate" runat="server"></asp:Label>
                    </span>
                  </span>
                </th>
              </tr>
              <!--
              <tr class="mon-table-columnheader">
                <th style="width:10%">Section</th>
                <th style="width:5%">S.No.</th>
                <th style="width:5%">Criteria</th>
                <th style="width:35%">Sub-Criteria</th>
                <th style="width:10%">Points Available</th>
                <th style="width:10%">Scoring</th>
                <th style="width:1%">&nbsp;</th>
                <th  style="width:24%">&nbsp;</th>
              </tr>
              -->
            </thead>
            <tbody>
              <tr>
                <td class="mon-category" colspan="6">2. Adhered to Professionalism Policy</td>
              </tr>
              <tr>
                <td colspan="5">2a. Collections Business</td>
                <td colspan="1">
                  <select  class="qst editable" qst="2a">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">2a. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="2a-flags" multiple="multiple" size="7">
                        <option value="2a-1">2a-1: Accessing, viewing and working on Toyota related activities that do not support the Customer while the Customer is on the line or on hold</option>
                        <option value="2a-2">2a-2: Accessing, viewing and working on Toyota related activities that takes focus away from the caller</option>
                        <option value="2a-3">2a-3: Inappropriate comments before and/or after the call</option>
                        <option value="2a-4">2a-4: Leaving the caller on hold for longer than allowed</option>
                        <option value="2a-5">2a-5: Placing the caller on hold to answer another line which is Toyota related</option>
                        <option value="2a-6">2a-6: Proper transfer etiquette not followed</option>
                        <option value="2a-7">2a-7: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">2b. Partial Gatekeeper</td>
                <td colspan="1">
                  <select  class="qst editable" qst="2b">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">2b. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="2b-flags" multiple="multiple" size="12">
                        <option value="2b-1">2b-1: COL - MA ID not provided or incomplete</option>
                        <option value="2b-2">2b-2: LY - Customer says, "Yes," to getting off of the phone vs. the OCMC</option>
                        <option value="2b-3">2b-3: LY - On Call Marketing Consent (missed opportunity)</option>
                        <option value="2b-4">2b-4: LY - Incentive is proactively offered without an OCMC. No marketing discussion takes place, and no sales lead is submitted</option>
                        <option value="2b-5">2b-5: LY - Incentive is proactively provided prior to OCMC</option>
                        <option value="2b-6">2b-6: LY - Incentive is provided without Offer Consent (OCMC accepted)</option>
                        <option value="2b-7">2b-7: LY - No promot is provided but CLA provides OCMC with or prior to servicing</option>
                        <option value="2b-8">2b-8: LY - Proactively has a marketing discussion and then comes back to provide OCMC</option>
                        <option value="2b-9">2b-9: LY - Provides OCMC that is not valid </option>
                        <option value="2b-10">2b-10: Mulitple accounts discussed; non actionable account not documented</option>
                        <option value="2b-11">2b-11: TFS/LFS Account Number entered into WUSP incorrectly.</option>
                        <option value="2b-12">2b-12: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">2c. Collections Gatekeeper</td>
                <td colspan="1">
                  <select  class="qst editable" qst="2c">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">2c. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="2c-flags" multiple="multiple" size="29">
                        <option value="2c-1">2c-1: Accepting a promise outside of applicable promise guidelines</option>
                        <option value="2c-2">2c-2: Accessing, viewing and/or working on Non-Toyota related activities while the customer is on the line or on hold</option>
                        <option value="2c-3">2c-3: Advising the customer to allow their account to go past due in order to use their debit or ATM card </option>
                        <option value="2c-4">2c-4: Calling a home, work or mobile number marked “DNC”</option>
                        <option value="2c-5">2c-5: Failing to cancel a repossession after accepting a payment or after a Customer provides either a bankruptcy case number or the bankruptcy attorney information</option>
                        <option value="2c-6">2c-6: Failing to create a SCRA case when reviewing the account or Caller inquires about or references military status even if the account is closed.</option>
                        <option value="2c-7">2c-7: Failing to end a call when a customer insists they not be recorded</option>
                        <option value="2c-8">2c-8: Failing to end a call when a customer advises that the call is being recorded or requests permission to record the call</option>
                        <option value="2c-9">2c-9: Failing to update a phone number as "DNC" at the request of the Customer, Third Party or notification the Customer is being represented by an attorney</option>
                        <option value="2c-10">2c-10: Falsely representing or implying that the TM operates or is employed by a consumer reporting agency</option>
                        <option value="2c-11">2c-11: Falsely representing or implying that an individual TM is an attorney or that any communication is from an attorney</option>
                        <option value="2c-12">2c-12: Hang up on caller</option>
                        <option value="2c-13">2c-13: Inappropriate comments towards the dealership, co-workers, or all business partners</option>
                        <option value="2c-14">2c-14: INS: Attempts Loyalty value proposition following 2 denials by the caller</option>
                        <option value="2c-15">2c-15: INS: Clear confirmation statement of cancel request outcome</option>
                        <option value="2c-16">2c-16: Leaving a message with a 3rd party </option>
                        <option value="2c-17">2c-17: Locating an account but not documenting the call</option>
                        <option value="2c-18">2c-18: LY: CLA does not attempt OCMC but has a marketing discussion</option>
                        <option value="2c-19">2c-19: LY: CLA provides OCMC customer declines, and CLA moves forward with marketing discussion</option>
                        <option value="2c-20">2c-20: LY: Customer says no to OCMC and a sales lead is sent (unless customer specifically asks for their information to be shared with dealer</option>
                        <option value="2c-21">2c-21: Making a copy, either electronically or on paper, of the bank account / card information or inputs the bank account / card information in any field other than the designated areas </option>
                        <option value="2c-22">2c-22: Misrepresenting that the TM is vouched for, bonded by, or affiliated with the United States or any State</option>
                        <option value="2c-23">2c-23: Placing the caller on hold to take a personal call</option>
                        <option value="2c-24">2c-24: Updating a DNC number to a callable number without Customer consent</option>
                        <option value="2c-25">2c-25: Using or threatening violence to physically harm a person or his or her reputation or property</option>
                        <option value="2c-26">2c-26: Using inappropriate comments during the call</option>
                        <option value="2c-27">2c-27: Using inappropriate tone and/or behavior</option>
                        <option value="2c-28">2c-28: Using profanity/derogatory remarks</option>
                        <option value="2c-29">2c-29: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td class="mon-category" colspan="6">3. Adhered to Privacy Policy</td>
              </tr>
              <tr>
                <td colspan="5">3a. Privacy</td>
                <td colspan="1">
                  <select  class="qst editable" qst="3a">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">3a. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="3a-flags" multiple="multiple" size="10">
                        <option value="3a-1">3a-1: Account specifics provided to account holder or authorized party prior to authorization/authentication</option>
                        <option value="3a-2">3a-2: Business Accounts: Obtain name of contact and position with company</option>
                        <option value="3a-3">3a-3: City, state, zip code, street direction and/or street suffix provided</option>
                        <option value="3a-4">3a-4: Collateral: Provided prior to authentication being completed or provided to an unauthorized party</option>
                        <option value="3a-5">3a-5: Misinterpreting Privacy guidelines and being too conservative regarding the release of information</option>
                        <option value="3a-6">3a-6: Outbound Call: Do not request the primary or co-x to provide any part of the SSN (Exception: WUSP)</option>
                        <option value="3a-7">3a-7: State Toyota/Lexus Financial after outbound authentication is complete and on all inbound calls</option>
                        <option value="3a-8">3a-8: Stated full company name prior to authentication on outbound calls</option>
                        <option value="3a-9">3a-9: Third Party: Obtain first and last name (and the company they represent, if applicable)</option>
                        <option value="3a-10">3a-10: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">3b. Privacy Technical - 20pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="3b">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">3b. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="3b-flags" multiple="multiple" size="23">
                        <option value="3b-1">3b-1: Asking whether the Caller is a wife, husband, or spouse is not permitted</option>
                        <option value="3b-2">3b-2: Authorization to speak/discuss on behalf of account holder not obtained/verified (NSS: clear affirmative answer required) </option>
                        <option value="3b-3">3b-3: CCS: Outbound Call: Do not request the primary or co-x to provide any part of their SSN (Exception: WUSP, if needed)</option>
                        <option value="3b-4">3b-4: Customer account details should not be updated when speaking with a NSS or Third Party.</option>
                        <option value="3b-5">3b-5: Disclosing account specific information with an unauthorized NSS or unauthorized Third Party.</option>
                        <option value="3b-6">3b-6: Faxing or mailing documentation to an alternate location other than the Customer's system fax number/address without the Customer's specific authorization</option>
                        <option value="3b-7">3b-7: Improper Authentication (Customer / Co Borrower / NSS / Authorized Third Party)</option>
                        <option value="3b-8">3b-8: Identify yourself </option>
                        <option value="3b-9">3b-9: INS: Agreement, application number or full VIN not obtained/verified</option>
                        <option value="3b-19">3b-10: LY- SL sent and Consent statement not delivered</option>
                        <option value="3b-11">3b-11: LY- SL sent by gaining consent from NSS</option>
                        <option value="3b-12">3b-12: LY- SL sent to originating dealer instead of mover dealership</option>
                        <option value="3b-13">3b-13: LY- SL sent without customer's affirmative response to consent</option>
                        <option value="3b-14">3b-14: NSS Relationship not obtained/verified</option>
                        <option value="3b-15">3b-15: PII: Provided to unauthorized NSS or unauthorized Third Party</option>
                        <option value="3b-16">3b-16: PII: Provided to other contract signer </option>
                        <option value="3b-17">3b-17: Providing account number without verifying additional information</option>
                        <option value="3b-18">3b-18: Providing the full Vehicle Identification Number (VIN) to the Customer</option>
                        <option value="3b-19">3b-19: Reciting the Account Holder's name to a Third Party or Non Signing Spouse (NSS)</option>
                        <option value="3b-20">3b-20: Reciting the Account Holder's name to the Customer prior to authentication</option>
                        <option value="3b-21">3b-21: Reciting the street name, number, apt. number, PO Box or more than the last two digits of the telephone number to the Customer, Co-Borrower, or Non Signing Spouse (NSS); unless provided by the Customer</option>
                        <option value="3b-22">3b-22: Reciting the website usernames, email addresses, and/or passwords</option>
                        <option value="3b-23">3b-23: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td class="mon-category" colspan="6">4. Soft Skills</td>
              </tr>
              <tr>
                <td colspan="5">4a. Acknowledge Situation/Emotion - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="4a">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">4a. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="4a-flags" multiple="multiple" size="3">
                        <option value="4a-1">4a-1: Issue</options>
                        <option value="4a-2">4a-2: Emotion</option>
                        <option value="4a-3">4a-3: Delivery of skill</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">4b. Take Ownership of the Situation - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="4b">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">4b. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="4b-flags" multiple="multiple" size="3">
                        <option value="4b-1">4b-1: Provide initial "I Can" statement</options>
                        <option value="4b-2">4b-2: Convey confidence in ablity to assist/demonstrate willingness to help</option>
                        <option value="4b-3">4b-3: Delivery of skill</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">4c. Summarize Contact & Expectations - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="4c">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">4c. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="4c-flags" multiple="multiple" size="5">
                        <option value="4c-1">4c-1: Clear Recap of key information</options>
                        <option value="4c-2">4c-2: Clarification of nect steps for customer</option>
                        <option value="4c-3">4c-3: Clarification of next steps for TFS/LFS</option>
                        <option value="4c-4">4c-4: INS: Clear confirmation statement of cancel request outcome</option>
                        <option value="4c-5">4c-5: Delivery of skill</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">4d. Communication - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="4d">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">4d. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="4d-flags" multiple="multiple" size="11">
                        <option value="4d-1">4d-1: Pitch</options>
                        <option value="4d-2">4d-2: Inflection</option>
                        <option value="4d-3">4d-3: Courtesy</option>
                        <option value="4d-4">4d-4: Tone</option>
                        <option value="4d-5">4d-5: Understandability</option>
                        <option value="4d-6">4d-6: Rule of Speech</options>
                        <option value="4d-7">4d-7: Enunciation</options>
                        <option value="4d-8">4d-8: Professionalism</options>
                        <option value="4d-9">4d-9: Dead Air</options>
                        <option value="4d-10">4d-10: Transfer</options>
                        <option value="4d-11">4d-11: Delivery of Skill</options>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td class="mon-category" colspan="6">5. (CATEGORY NAME?)</td>
              </tr>
              <tr>
                <td colspan="5">5a. Verified Collateral - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="5a">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
              </tr>
              <tr>
                <td colspan="3" class="editable">5a. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="5a-flags" multiple="multiple" size="6">
                        <option value="5a-1">5a-1: Inbound call: Ask the third party to provide the collateral to you</options>
                        <option value="5a-2">5a-2: Model Not Verified</option>
                        <option value="5a-3">5a-3: No attempt was made to verify the collateral</option>
                        <option value="5a-4">5a-4: Verified the incorrect year and/or model</option>
                        <option value="5a-5">5a-5: Year Not Verified</option>
                        <option value="5a-6">5a-6: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">5b. Verified Demographics and Documented VAP - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="5b">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">5b. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="5b-flags" multiple="multiple" size="10">
                        <option value="5b-1">5b-1: Address: Verification incomplete</options>
                        <option value="5b-2">5b-2: No attempt was made to verify demographics</option>
                        <option value="5b-3">5b-3: Phone: Home/primary phone number verification incomplete</option>
                        <option value="5b-4">5b-4: Phone: Mobile number verification incomplete</option>
                        <option value="5b-5">5b-5: Phone: Work/alternate/secondary phone number verification incomplete</option>
                        <option value="5b-6">5b-6: PVAP was notated but there was no prior VAP not within guidelines</option>
                        <option value="5b-7">5b-7: VAP was completed but not notated correctly</option>
                        <option value="5b-8">5b-8: VAP was noted but not completed</option>
                        <option value="5b-9">5b-9: Verify demograpics for the appropriate account holder (customer vs. cosigner)</option>
                        <option value="5b-10">5b-10: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">5c. Updated Demographics - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="5c">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">5c. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="5c-flags" multiple="multiple" size="10">
                        <option value="5c-1">5c-1: Additional Demogrpahics were not documented or were not documeted correctly</options>
                        <option value="5c-2">5c-2: Address: Document the physical address</option>
                        <option value="5c-3">5c-3: Address: Not updated or not updated correctly</option>
                        <option value="5c-4">5c-4: Demographic information should not have been updated</option>
                        <option value="5c-5">5c-5: Document why demographics were not updated if questionable or know that bad information was given</option>
                        <option value="5c-6">5c-6: Phone: Home/primary phone field not updated or not updated correctly</option>
                        <option value="5c-7">5c-7: Phone: Mobile phone field not updated or not updated correctly</option>
                        <option value="5c-8">5c-8: Phone: Work/alternate/secondary phone field not updated or not updated correctly</option>
                        <option value="5c-9">5c-9: Update demographics for the part we are speaking with (customer vs. cosigner)</option>
                        <option value="5c-10">5c-10: Update demographic information based on information provided by authroized party</option>
                        <option value="5c-11">5c-11: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td class="mon-category" colspan="6">6. (CATEGORY NAME?)</td>
              </tr>
              <tr>
                <td colspan="5">6a. Provided Accurate Information - 15pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="6a">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">6a. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="6a-flags" multiple="multiple" size="9">
                        <option value="6a-1">6a-1: Amount/Date: Stated Correctly</options>
                        <option value="6a-2">6a-2: Credit bureau/reporting: Information stated inaccurately</option>
                        <option value="6a-3">6a-3: Discharged Bankruptcy: For retail accounts, must state "lien value" rather than payoff or balance</option>
                        <option value="6a-4">6a-4: Do not refer account holder to Agency team when it can be handled by WAM</option>
                        <option value="6a-5">6a-5: Outbound disclosure guidelines were not followed</option>
                        <option value="6a-6">6a-6: Payment Method: Inaccurate information provided</option>
                        <option value="6a-7">6a-7: Review all applicable systems/sources and provide accurate information</option>
                        <option value="6a-8">6a-8: Talking points were stated inaccurately when they were not required</option>
                        <option value="6a-9">6a-9: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">6b. Provided Accurate Information - 15pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="6b">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">6b. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="6b-flags" multiple="multiple" size="7">
                        <option value="6b-1">6b-1: Mail: Did not confirm/Provide mailing address and/or instructions for payments</options>
                        <option value="6b-2">6b-2: Extended Verbal Authorization: Process not completed or completed incorrectly</option>
                        <option value="6b-3">6b-3: WUQC: One or more talking points were missed or stated incorrectly</option>
                        <option value="6b-4">6b-4: WUSP: Correctly update/enter information in the WUSP system</option>
                        <option value="6b-5">6b-5: WUSP: One or more talking points were missed or stated incorrectly</option>
                        <option value="6b-6">6b-6: WUSP: One or more verification steps not completed or completed incorrectly</option>
                        <option value="6b-7">6b-7: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td class="mon-category" colspan="6">7. (CATEGORY NAME?)</td>
              </tr>
              <tr>
                <td colspan="5">7a. Accurately documented all relevant systems - 5pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="7a">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">7a. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="7a-flags" multiple="multiple" size="17">
                        <option value="7a-1">7a-1: Authorization: Not documented/documented incorrectly</options>
                        <option value="7a-2">7a-2: CID/Number dialed: Was not documented or documented incorrectly</option>
                        <option value="7a-3">7a-3: Fax number was not documented or documented incorrectly</option>
                        <option value="7a-4">7a-4: MAD: Do not note specific details of MAD that were not confirmed during the call</option>
                        <option value="7a-5">7a-5: MAD: Must be documented when all three elements are confirmed and not coded as a promise</option>
                        <option value="7a-6">7a-6: Medical and disability specfic details must not be documented</option>
                        <option value="7a-7">7a-7: Notes: Do not include details not discussed during this call</option>
                        <option value="7a-8">7a-8: Notes: documented a date, amount, or method incorrectly</option>
                        <option value="7a-9">7a-9: Notes: Inaccurate Information documented (excluding date, amount, and method)</option>
                        <option value="7a-10">7a-10: Notes: Should be specific, clear, and complete (including all pertinent details)</option>
                        <option value="7a-11">7a-11: NSS Relationship: document when obtained/do not document when not obtained</option>
                        <option value="7a-12">7a-12: Once it is determained that customer is represent by an attorney doument accoringly </option>
                        <option value="7a-13">7a-13: Who we spoke with: if there are miltiple signers on the acount, document whether you spoke with the customer or cosigner</option>
                        <option value="7a-14">7a-14: Who we spoke with: Remain consistent throughout the note with your documentation of who you spoke with durning the call</option>
                        <option value="7a-15">7a-15: Who we spoke with: The account was not notated correctly with the party we spoke with</option>
                        <option value="7a-16">7a-16: Who we spoke with: The full name of the 3rd party must be documented when obtained </option>
                        <option value="7a-17">7a-17: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td colspan="5">7b. Properly Initiated All Related DM Forms - 9pts</td>
                <td colspan="1">
                  <select  class="qst editable" qst="7b">
                    <option value="Yes" class="sel-green">Yes</option>
                    <option value="No" class="sel-red">No</option>
                    <option value="FYI"  class="sel-yellow">FYI</option>
                    <option value="N/A"  class="sel-yellow">N/A</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td colspan="3" class="editable">7b. Flags</td>
                <td colspan="3">
                    <select  class="qst editable" qst="7b-flags" multiple="multiple" size="4">
                        <option value="7b-1">7b-1: The required form was not submitted</options>
                        <option value="7b-2">7b-2: The wrong form was submitted</option>
                        <option value="7b-3">7b-3: When submitting a form to processing, include all required elements in the Instruction Box as described for each type of form</option>
                        <option value="7b-4">7b-4: Other</option>
                    </select>
                    <a class="mon-clear-select" title="Clear Selections">X</a>
                </td>
              </tr>
              <tr>
                <td>&nbsp;</td>
                <td class="centered" >&nbsp;</td>
                <td></td>
                <td style="color:White;"> <!-- Julie - If I replace the text in here with an &nbsp; it messes up the formatting.  Help! -->
                    (CE) Did the Collector exceed expectations for a Great consumer Experience (i.e could this call be used in training as an example of exceptional consumer service and negotiating skills while still being compliant & adhere to all ACT Policies, etc.)?
                </td>
                <td ></td>
                <td >
                </td>
                <!-- <td style="background-color:#18bba2;"><input class="qst" qst="C-1.1" type="text" /></td> -->
              </tr>

              <tr >
                <td class="mon-category" colspan="6">Acuity Monitor v3.A</td>
              </tr>
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
    <script type="text/javascript" src="./Monitor_Toyota.js?r=10" language="javascript"></script>
  </body>
</html>
