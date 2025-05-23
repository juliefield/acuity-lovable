<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Monitor_Vectren_Prototype.aspx.cs" ValidateRequest="false" Inherits="_Monitor_Vectren_Prototype" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Monitor Prototype</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/appLib-1.1.15.js"></script>
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
        margin-top: 30px;
        position:relative;
        padding: 10px;
        width: 100%;
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
</style>
</head>
<body runat="server" style="overflow-y: scroll">
    <div class="header gradient-lightest">
        <div class="logo" style="margin-left:0px;"><h1><span>Acuity &reg;</span></h1></div>
        <div class="heading" style="margin-left:0px;">Vectren Monitor Prototype</div>
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
                    <span class="mon-question">Policy and Procedure</span>
                    <span class="mon-answer"><select id="Q1"><option value="">--select--</option><option value="20">Mastered All Areas</option><option value="18">Minor Opportunities Present</option><option value="8">One Training Opportunity Present</option><option value="2">Multiple Training Opportunities Present</option><option value="0">Unsatisfactory</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Comments:</label><textarea id="Q1Comments" cols="30" rows="3"></textarea></p>
                </li>
                <li>
                    <span class="mon-question">System Use and Data Entry</span>
                    <span class="mon-answer"><select id="Q2"><option value="">--select--</option><option value="20">Mastered All Areas</option><option value="18">Minor Opportunities Present</option><option value="8">One Training Opportunity Present</option><option value="2">Multiple Training Opportunities Present</option><option value="0">Unsatisfactory</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Comments:</label><textarea id="Q2Comments" cols="30" rows="3"></textarea></p>
                </li>
                <li>
                    <span class="mon-question">Call Handling Skills</span>
                    <span class="mon-answer"><select id="Q3"><option value="">--select--</option><option value="20">Mastered All Areas</option><option value="18">Minor Opportunities Present</option><option value="8">One Training Opportunity Present</option><option value="2">Multiple Training Opportunities Present</option><option value="0">Unsatisfactory</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Comments:</label><textarea id="Q3Comments" cols="30" rows="3"></textarea></p>
                </li>
                <li>
                    <span class="mon-question">Communication Skills</span>
                    <span class="mon-answer"><select id="Q4"><option value="">--select--</option><option value="20">Mastered All Areas</option><option value="18">Minor Opportunities Present</option><option value="8">One Training Opportunity Present</option><option value="2">Multiple Training Opportunities Present</option><option value="0">Unsatisfactory</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Comments:</label><textarea id="Q4Comments" cols="30" rows="3"></textarea></p>
                </li>
                <li>
                    <span class="mon-question">First Call Resolution</span>
                    <span class="mon-answer"><select id="Q5"><option value="">--select--</option><option value="20">Yes</option><option value="10">Internal Delay</option><option value="0">No</option></select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Comments:</label><textarea id="Q5Comments" cols="30" rows="3"></textarea></p>
                </li>
            </ol>
            <ul style="list-style:none;padding-top: 40px;">
                <li>
                    <span class="mon-question"></span>
                    <span class="mon-answer" style="font-weight: bold;font-size:20px;" >Monitor Total<span class="mon-subtotal mon-total" id="montotal">0</span></span>
                  	<form method="post" runat="server">
                        <input type="hidden" id="txtQ1" runat="server" value="" />
                        <input type="hidden" id="txtQ1Comments" runat="server" value="" />
                        <input type="hidden" id="txtQ2" runat="server" value="" />
                        <input type="hidden" id="txtQ2Comments" runat="server" value="" />
                        <input type="hidden" id="txtQ3" runat="server" value="" />
                        <input type="hidden" id="txtQ3Comments" runat="server" value="" />
                        <input type="hidden" id="txtQ4" runat="server" value="" />
                        <input type="hidden" id="txtQ4Comments" runat="server" value="" />
                        <input type="hidden" id="txtQ5" runat="server" value="" />
                        <input type="hidden" id="txtQ5Comments" runat="server" value="" />
                        <input type="hidden" id="txtAddress" runat="server" value="" />
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
          $("#txtQ1").val($("#Q1").val());
          $("#txtQ1Comments").val($("#Q1Comments").val());
          $("#txtQ2").val($("#Q2").val());
          $("#txtQ2Comments").val($("#Q2Comments").val());
          $("#txtQ3").val($("#Q3").val());
          $("#txtQ3Comments").val($("#Q3Comments").val());
          $("#txtQ4").val($("#Q4").val());
          $("#txtQ4Comments").val($("#Q4Comments").val());
          $("#txtQ5").val($("#Q5").val());
          $("#txtQ5Comments").val($("#Q5Comments").val());

          $("#txtAddress").val($("#Address").val());
          $("#txtTotal").val($("#montotal").html());
      });

      $(document).ready(function () {
          var colors = ["#eeeeee", "#dddddd"];
          var tgl = 0;
          $(".mon-content ol li").each(function () {
              $(this).css("background", colors[tgl]);
              if (!tgl) tgl = 1; else tgl = 0;
          });

          $("#Q1").val($("#txtQ1").val());
          $("#Q1Comments").val($("#txtQ1Comments").val());
          $("#Q2").val($("#txtQ2").val());
          $("#Q2Comments").val($("#txtQ2Comments").val());
          $("#Q3").val($("#txtQ3").val());
          $("#Q3Comments").val($("#txtQ3Comments").val());
          $("#Q4").val($("#txtQ4").val());
          $("#Q4Comments").val($("#txtQ4Comments").val());
          $("#Q5").val($("#txtQ5").val());
          $("#Q5Comments").val($("#txtQ5Comments").val());

          for (var i = 1; i <= 5; i++) {
              if ($("#Q" + i + "Comments").val() != "") {
                  $("#Q" + i + "Comments").height($("#Q" + i + "Comments")[0].scrollHeight);
              }
          }

          $("#Q1Comments").autogrow();
          $("#Q2Comments").autogrow();
          $("#Q3Comments").autogrow();
          $("#Q4Comments").autogrow();
          $("#Q5Comments").autogrow();

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