<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Survey_EmpSat_Prototype.aspx.cs" ValidateRequest="false" Inherits="_Survey_EmpSat_Prototype" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Survey Prototype</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>jquery/ui/js/jquery-1.6.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib")%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib")%>appLib/js/appLib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
    .mon-wrapper 
    {
        position:relative;
    }
    .mon-category
    {
        font-size: 16px;
        text-decoration: underline;
        font-weight: bold;
        line-height: 16px;
        display:none;
    }
    .mon-question
    {
        font-size: 14px;
        line-height: 16px;
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
    
    .heading
    {
        font-size: 16px;
    }
    
    .display-thanks, .display-pastsubmission
    {
        margin-top: 20px;
        border-top: 1px solid black;
        padding-top: 10px;
        font-size: 16px;
    }
</style>
</head>
<body runat="server">
    <div class="header gradient-lightest">
        <div class="logo" style="margin-left:0px;"><h1><span>Convergent</span></h1></div>
        <div class="heading" style="margin-left:0px;">Employee Satisfaction Survey</div>
    </div>
<div class="display-survey">
    <div style="display:none;">
        <asp:Label ID="lblMode" runat="server"></asp:Label>
        <asp:Label ID="lblMonitorId" runat="server"></asp:Label>
    </div>
    <div class="mon-wrapper">
        <div class="mon-stats">
            <ul>
                <li><label>Agent:</label><span><asp:Label id="lblAgentName" runat="server"></asp:Label><asp:Label style="display:none;" id="lblAgent" runat="server"></asp:Label></span></li><br />
                <li><label>Project:</label><span><asp:Label id="lblProjectName" runat="server"></asp:Label><asp:Label style="display:none;" id="lblProject" runat="server"></asp:Label></span></li>
            </ul>
            <p class="mon-address">
                <label>Answers will be kept confidential.</label>
           </p>
        </div>
        <div class="mon-content">            
            <ul style="list-style:none;">
                <li style="border-bottom: 1px solid gray;">
                    <span class="mon-question">Question</span>
                    <span class="mon-answer" style="padding-right: 290px;">Grade<span class="mon-subtotal" style="width: 100px;font-weight:normal;color:Black;font-size:14px;">SubTotal</span></span>
                </li>
            </ul>
            <ol>
                <li>
                    <span class="mon-category">COMPENSATION<br /><br /></span>
                    <span class="mon-question">How satisfied are you with CEScore? (0-10)</span>
                    <span class="mon-answer"><select id="Q1"><option value="">--select--</option>
                        <option value="10">10-Extremely Satisfied</option>
                        <option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                        <option value="0">0-Extremely Dissatisfied</option>
                    </select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Why?:</label><textarea class="mon-why" id="Q1Comments" cols="90" rows="2"></textarea></p>
                </li>
                <li>
                    <span class="mon-category">WORK ENGAGEMENT<br /><br /></span>
                    <span class="mon-question">How satisfied are you with the training and tools you have been provided to perform your job at a high level? (0-10)</span>
                    <span class="mon-answer"><select id="Q2"><option value="">--select--</option>
                        <option value="10">10-Extremely Satisfied</option>
                        <option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                        <option value="0">0-Extremely Dissatisfied</option>
                    </select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Why?:</label><textarea class="mon-why" id="Q2Comments" cols="90" rows="2"></textarea></p>
                </li>
                <li>
                    <span class="mon-category">WORK ENVIRONMENT<br /><br /></span>
                    <span class="mon-question">How satisfied are you with your work environment? (0-10)</span>
                    <span class="mon-answer"><select id="Q3"><option value="">--select--</option>
                        <option value="10">10-Extremely Satisfied</option>
                        <option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                        <option value="0">0-Extremely Dissatisfied</option>
                    </select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Why?:</label><textarea class="mon-why" id="Q3Comments" cols="90" rows="2"></textarea></p>
                </li>
                <li>
                    <span class="mon-category">RELATIONSHIP MANAGEMENT<br /><br /></span>
                    <span class="mon-question">How satisfied are you with the leadership and coaching you receive from your supervisor? (0-10)</span>
                    <span class="mon-answer"><select id="Q4"><option value="">--select--</option>
                        <option value="10">10-Extremely Satisfied</option>
                        <option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                        <option value="0">0-Extremely Dissatisfied</option>
                    </select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Why?:</label><textarea class="mon-why" id="Q4Comments" cols="90" rows="2"></textarea></p>
                </li>
                <li>
                    <span class="mon-category">PROMOTERS<br /><br /></span>
                    <span class="mon-question">How likely are you to recommend working on the <span><b><asp:Label id="lblProjectName2" runat="server"></asp:Label></b></span> program to friends or family? (0-10)</span>
                    <span class="mon-answer"><select id="Q5"><option value="">--select--</option>
                        <option value="10">10-Extremely Likely</option>
                        <option value="9">9</option><option value="8">8</option><option value="7">7</option><option value="6">6</option><option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
                        <option value="0">0-Extremely Unlikely</option>
                    </select><span class="mon-subtotal">&nbsp;</span></span>
                    <p class="mon-comments"><label>Why?:</label><textarea class="mon-why" id="Q5Comments" cols="90" rows="2"></textarea></p>
                </li>
            </ol>
            <ul style="list-style:none;padding-top: 10px;">
                <li>
                    <span class="mon-question"></span>
                    <span class="mon-answer" style="font-weight: bold;font-size:20px;display:none;" >Satisfaction Total<span class="mon-subtotal mon-total" id="montotal">0</span></span>
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
                        <asp:Button id="submitme" runat="server" class="mon-submit" disabled="disabled" type="submit" Text="Submit Survey" OnClick="submitme_click" />
                    </form>
                    <p>Please score all questions, and provide a comment in each box (must be non-blank).  If you have no comment on a section, please type "no comment".</p>
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="display-thanks" style="display:none;">
Thank you for submitting this survey.
</div>
<div class="display-pastsubmission" style="display:none;">
Thank you for submitting this survey.<br /><br />
Our records indicate that you have already taken this survey.  If this message is in error, please notify your supervisor.
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
          if (a$.gup("thanks") != "") {
              $(".display-survey").hide();
              $(".display-thanks").show();
          }
          else if (a$.gup("pastsubmission") != "") {
              $(".display-survey").hide();
              $(".display-pastsubmission").show();
          }

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

          $("#Address").val($("#txtAddress").val());

          $(".mon-answer select").each(function () {
              $(this).trigger("change");
          });

      });

      $(".mon-answer select,.mon-why").bind("change", function () {
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
              for (var i = 1; i <= 5; i++) {
                  if ($("#Q" + i + "Comments").val() == "") {
                      blanksfound = true;
                  }
              }
          }
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