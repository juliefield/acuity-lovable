<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_Carepayment_Prototype.aspx.cs" ValidateRequest="false" Inherits="_Monitor_Carepayment_Prototype" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Monitor Prototype</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
    .mon-wrapper 
    {
        position:relative;
    }
    .mon-stats 
    {
        position:absolute;
        top: 60px;
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
    .mon-address 
    {
        display:none;
        margin-left: 5px;
    }
    .mon-address label 
    {
        color:White;
        font-size: 14px;
    }
    
    .mon-address textarea
    {
        margin-left: 0px;
    }
    
    .mon-question
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
</style>
</head>
<body runat="server" style="overflow-y:scroll;">


    <div class="header gradient-lightest">
        <div class="logo" style="margin-left:0px;"><h1><span>Acuity &reg;</span></h1></div>
        <div class="heading" style="margin-left:0px;">Carepayment Monitor Prototype</div>
    </div>
    <div style="display:none;">
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
    </div>
    <div class="mon-wrapper">
        <div class="mon-stats">
            <ul>
                <li><label>Agent:</label><span><asp:Label id="lblAgentName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblAgent" runat="server"></asp:Label></span></li>
                <li><label>Call ID:</label><span><asp:Label ID="lblCallid" runat="server"></asp:Label></span></li>
                <li><label>Call Date:</label><span><asp:Label ID="lblCalldate" runat="server"></asp:Label></span></li>
                <li><label>Supervisor:</label><span><asp:Label id="lblSupervisorName" runat="server"></asp:Label> <asp:Label style="display:none;" id="lblSupervisor" runat="server"></asp:Label><asp:Label style="display:none;" id="lblViewer" runat="server"></asp:Label><asp:Label style="display:none;" id="lblRole" runat="server"></asp:Label></span></li>
            </ul>
            <p class="mon-address">
                <label>Premises Address:</label>
                <textarea id="Address" cols="21" rows="3"></textarea>
            </p>
        </div>
        <div class="mon-content">
            
            <ul style="list-style:none;">
                <li style="border-bottom: 1px solid gray;">
                    <span class="mon-question">Question</span>
                    <span class="mon-answer" style="padding-right: 290px;">Answer<span class="mon-subtotal" style="width: 100px;font-weight:normal;color:Black;font-size:14px;">Points</span></span>
                </li>
            </ul>

            <ol>
                <li>
                    <span class="mon-question">CP Greeting 1</span>
                    <span class="mon-answer"><select id="Q1"><option value="">--select--</option><option value="5">Yes</option><option value="0">Partial</option><option value="0">No</option><option value="5">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Ready to answer the call; no ring time or immediately asking caller to hold</p>
                </li>
                <li>
                    <span class="mon-question">CP Greeting 2</span>
                    <span class="mon-answer"><select id="Q2"><option value="">--select--</option><option value="5">Yes</option><option value="0">No</option><option value="5">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Greeted caller with your name; tone upbeat and friendly (not dry or monotone). OUTBOUND / "Hello, this is [Rep name] with CarePayment, is this [Guarantor Name]?</p>
                </li>
                <li>
                    <span class="mon-question">CP Greeting 3</span>
                    <span class="mon-answer"><select id="Q3"><option value="">--select--</option><option value="15">Yes</option><option value="0">No</option><option value="15">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Identity of the caller verified in accordance with the CP Customer ID Policy,correct mini-Miranda read.If unauthorized third party,advised of policy & procedure to add authorization to account if appropriate.Tone upbeat & friendly;not dry or monotone</p>
                </li>
                <li>
                    <span class="mon-question">CP Call Handling 1</span>
                    <span class="mon-answer"><select id="Q4"><option value="">--select--</option><option value="15">Yes</option><option value="0">No</option><option value="15">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">OUTBOUND/Effective Demand Statement (including total balance,minimum payment due,due date,and name of assigning Provider)If applicable,advised of how minimum payment due is caculated each month and if Non-Enrolled,explained the benefits of enrollment
                    <p class="mon-desc">INBOUND/ Listen to the purpose of the call and respond appropriately. Use preferred language to describe the CarePayment program and account offer,ask how you can be of assistance and/or acknowledge the customers concerns. Tone upbeat and friendly (not dry or monotone</p>
                </li>
                <li>
                    <span class="mon-question">CP Call Handling 2</span>
                    <span class="mon-answer"><select id="Q5"><option value="">--select--</option><option value="10">Yes</option><option value="0">No</option><option value="10">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">LISTEN AND ACKNOWLEDGE the purpose of the customer's call, express empathy and compassion. Depending on the caller's concerns, educate the caller and look for ways to help. This could mean educating the caller on the status of their account, educating on the CarePayment program or Provider-specific processess, or noting a complaint or dispute to be reviewed internally or through recon.</p>
                    <p class="mon-desc">If the purpose of the call is to make a payment, inquire about the CarePayment option, an outbound call, etc... Provide information necessary for Consumer to pay. Customer advised of Automatic Payment option and other payment options if applicable.</p>
                    <p class="mon-desc">Customer advised of paperless statement option if applicable. If non-enrolled,customer is encouraged to enroll by making their first payment, and is explained the benefits of enrollment if applicable.</p>
                </li>
                <li>
                    <span class="mon-question">CP Call Handling 3</span>
                    <span class="mon-answer"><select id="Q6"><option value="">--select--</option><option value="15">Yes</option><option value="0">No</option><option value="15">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Account handled according to Provider-specific policies regarding closure, charity application, fee reversals, etc (See Provider Quick Reference Guide).</p>
                    <p class="mon-desc">If provider is listed on the Provider Issue Awareness and Call Handling document, call is handled according to that guide.</p>
                </li>
                <li>
                    <span class="mon-question">CP Call Handling 4</span>
                    <span class="mon-answer"><select id="Q7"><option value="">--select--</option><option value="10">Yes</option><option value="0">No</option><option value="10">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Listening skills,professionalism,open ended questions,clear and concise information provided,account noted and/or referred appropriately etc. Notes on account tell a clear story of the customer interaction (any promises made, information provided, questions asked, answers given, etc.). </p>
                </li>
                <li>
                    <span class="mon-question">CP Call Handling 5</span>
                    <span class="mon-answer"><select id="Q8"><option value="">--select--</option><option value="10">Yes</option><option value="0">No</option><option value="10">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Tone/Spoke Clearly/ Pace/ Grammer/ No jargon-slang/ Acknowledgement. Does not sound robotic, tired, distracted or disinterested. Sounds engaged, helpful, compassionate, and professional.</p>
                </li>
                <li>
                    <span class="mon-question">CP Call Handling 6</span>
                    <span class="mon-answer"><select id="Q9"><option value="">--select--</option><option value="5">Yes</option><option value="0">No</option><option value="5">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">Proper use of hold; Thanked Patient for holding (no mute)</p>
                </li>
                <li>
                    <span class="mon-question">CP Close 1</span>
                    <span class="mon-answer"><select id="Q10"><option value="">--select--</option><option value="5">Yes</option><option value="0">No</option><option value="5">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">If Applicable: Recapped call for action items, payment arrangments/due dates, next statement date etc. If the caller seems to be in a hurry to get off the phone, recap should be abbreviated or skipped altogether.</p>
                    <p class="mon-desc">If the the purpose of the call was simply informational (ie. caller calling to get information about CarePayment based on a welcome kit she/he received), recap may not be applicable.</p>                </li>
                <li>
                    <span class="mon-question">CP Close 2</span>
                    <span class="mon-answer"><select id="Q11"><option value="">--select--</option><option value="5">Yes</option><option value="0">No</option><option value="5">N/A</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-desc">If Enrolled, thanked Patient for using CarePayment. If non-enrolled, thanked patient for calling CarePayment. Offered further assistance.</p>
                </li>
                <li>
                    <span class="mon-question">Coaching Notes</span>
                    <p class="mon-comments"><textarea id="Comments" cols="70" rows="10"></textarea></p>
                </li>
            </ol>
            <ul style="list-style:none;padding-top: 40px;">
                <li>
                    <span class="mon-question"></span>
                    <span class="mon-answer" style="font-weight: bold;font-size:20px;" >Monitor Total<span class="mon-subtotal mon-total" id="montotal">0</span></span>
                  	<form method="post" runat="server">
                        <input type="hidden" id="txtQ1" runat="server" value="" /><input type="hidden" id="txtQ1text" runat="server" value="" />
                        <input type="hidden" id="txtQ2" runat="server" value="" /><input type="hidden" id="txtQ2text" runat="server" value="" />
                        <input type="hidden" id="txtQ3" runat="server" value="" /><input type="hidden" id="txtQ3text" runat="server" value="" />
                        <input type="hidden" id="txtQ4" runat="server" value="" /><input type="hidden" id="txtQ4text" runat="server" value="" />
                        <input type="hidden" id="txtQ5" runat="server" value="" /><input type="hidden" id="txtQ5text" runat="server" value="" />
                        <input type="hidden" id="txtQ6" runat="server" value="" /><input type="hidden" id="txtQ6text" runat="server" value="" />
                        <input type="hidden" id="txtQ7" runat="server" value="" /><input type="hidden" id="txtQ7text" runat="server" value="" />
                        <input type="hidden" id="txtQ8" runat="server" value="" /><input type="hidden" id="txtQ8text" runat="server" value="" />
                        <input type="hidden" id="txtQ9" runat="server" value="" /><input type="hidden" id="txtQ9text" runat="server" value="" />
                        <input type="hidden" id="txtQ10" runat="server" value="" /><input type="hidden" id="txtQ10text" runat="server" value="" />
                        <input type="hidden" id="txtQ11" runat="server" value="" /><input type="hidden" id="txtQ11text" runat="server" value="" />
                        <input type="hidden" id="txtComments" runat="server" value="" />
                        <input type="hidden" id="txtTotal" runat="server" value="" />
                        <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Submit Monitor" OnClick="submitme_click" />
                        <asp:Button id="deleteme" runat="server" class="mon-delete" hidden="true" type="submit" Text="Delete" OnClientClick="return confirm('Are you sure you want to delete this monitor?');" OnClick="deleteme_click" />
                        <asp:Button id="closeme" runat="server" class="mon-close" hidden="true" type="submit" Text="Close" OnClick="closeme_click" />
                    </form>
                </li>
            </ul>
        </div>
    </div>
  <script type="text/javascript" language="javascript">

      $(".mon-submit").bind("click", function () {
          $("#txtTotal").val($("#montotal").html());
          $("#txtComments").val($("#Comments").val());

          for (var i = 1; i <= 11; i++) {
              $("#txtQ" + i).val($("#Q" + i).val());
              $("#txtQ" + i + "text").val($("#Q" + i + " option:selected").text());
          }
      });

      $(document).ready(function () {
          var colors = ["#eeeeee", "#dddddd"];
          var tgl = 0;
          $(".mon-content ol li").each(function () {
              $(this).css("background", colors[tgl]);
              if (!tgl) tgl = 1; else tgl = 0;
          });

          $("#Comments").val($("#txtComments").val());
          for (var i = 1; i <= 11; i++) {
              $("#Q" + i).val($("#txtQ" + i).val());
          }
          for (var i = 1; i <= 11; i++) {
              if ($("#Q" + i).val() == "") {
                  $("#Q" + i + " option:eq(1)").attr('selected', 'selected')
              }
              else {
                  $("#Q" + i + ' option:contains("' + $("#txtQ" + i + "text").val() + '")').attr('selected', 'selected');
              }
          }

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
      });

      $(".mon-answer select").bind("change", function () {
          var tot = 0;
          var p = $(this).parent();
          var v = $(this).val();
          if (v == "") v = "&nbsp;"
          var blanksfound = false;
          $("span", p).html(v);
          $(".mon-answer select").each(function () {
              var val = $(this).val()
              if (val != "") {
                  tot += parseInt(val);
              }
              else {
                  blanksfound = true;
              }
          });
          if ($("#lblAgent").html() == "") blanksfound = true;
          if (!blanksfound) {
              $(".mon-submit").removeAttr("disabled");
          }
          else {
              $(".mon-submit").attr("disabled", "disabled");
          }
          $(".mon-total").html(tot);
      });

    function exists(me) {
        return (typeof me != 'undefined');
    }
  </script>
</body>
</html>