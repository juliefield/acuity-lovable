<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Cleanup.aspx.cs" ValidateRequest="false" Inherits="_Cleanup" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
<asp:PlaceHolder runat="server">
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-1.6.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.dump.js" type="text/javascript"></script>
    <script type="text/javascript" src="../appLib/js/applib-1.1.15.js"></script>
</asp:PlaceHolder>
<style type="text/css">
</style>
</head>
<body>
  <div>Hard Stop = <span id="hardstop"></span></div>
  <input id="getstats" type="button" value="Get Stats" />
  <div class="stats"></div>
  <div class="buttons"></div>
  <div class="prompt"></div>
  <script type="text/javascript" language="javascript">

    var hardstop = new Date("01/01/2012");
    //hardstop.setTime(hardstop.getTime() + (-120 * 24 * 60 * 60 * 1000)); 

    $(document).ready(function () {
        $("#hardstop").html(fmtdate(hardstop));
    });
    $("#getstats").click(function () {
        a$.ajax({ type: 'GET', async: true, data: { lib: "cleanup", cmd: "getstats" }, service: "JScript", dataType: "json", cache: false, error: a$.ajaxerror, success: showstats });
    });
    var timeloop;
    var st;
    var curindex = 0;
    function showstats(json) {
        if (a$.jsonerror(json)) {
        }
        else {
            st = json;
            showgrid();
            var bld = '<input type="button" value="Crowd" id="crowd"/><input type="button" value="STOP" id="stop"/>';
            $(".buttons").html(bld);
            $("#crowd").unbind().bind("click", function () {
                $(this).attr('disabled', 'disabled');
                $("#getstats").attr('disabled', 'disabled');
                //Convert all dates in the table to js dates, store in dt.
                for (i = 0; i < st.stats.length; i++) {
                    st.stats[i].dt = new Date(st.stats[i].date);
                }
                curindex = pickoldest();
                timeloop = setTimeout("trydelete()", 100);
                /*                a$.ajax({ type: 'GET', async: true, data: { lib: "cleanup", cmd: "delete" }, service: "JScript", dataType: "json", cache: false, error: a$.ajaxerror, success: deleteattempt });
                */
            });
            $("#stop").unbind().bind("click", function () {
                $(".prompt").html("All deleting has been STOPPED (you must reload the page to continue).");
                snuff();
            });
        }
    }

    function trydelete() {
        a$.ajax({ type: 'GET', async: true, data: { lib: "cleanup", cmd: "delete", stat: st.stats[curindex] }, service: "JScript", dataType: "json", cache: false, error: a$.ajaxerror, success: deleteattempt });

        function deleteattempt(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                if (json.deletestatus == "Wait") {
                    timeloop=setTimeout("trydelete()", 5 * 1000);
                }
                else {
                    var bld = "Deleting " + st.stats[curindex].tbl;
                    if (exists(st.stats[curindex].sub)) bld += "(" + st.stats[curindex].sub + ")";
                    bld += " for " + fmtdate(st.stats[curindex].dt) + "...";
                    $(".prompt").html(bld);
                    st.stats[curindex].dt.setTime(st.stats[curindex].dt.getTime() + (24 * 60 * 60 * 1000)); //Add 1 day
                    st.stats[curindex].date = fmtdate(st.stats[curindex].dt);
                    showgrid();
                    curindex = pickoldest();

                }
                if (curindex >= 0) timeloop=setTimeout("trydelete()", 5 * 1000);
            }            
        }
    }

    function pickoldest() {
        var mindate = new Date();
        var cur = -100;
        for (var i = 0; i < st.stats.length; i++) {
            if ((st.stats[i].dt < mindate) && (st.stats[i].dt < hardstop)) {
                cur = i;
                mindate = st.stats[i].dt;
            }
        }
        if (cur <= 0) {
            $(".prompt").html("All data has been cleared up until the hard stop");
            snuff();
        }
        return cur;
    }

    function showgrid() {
        var bld = "<table>";
        for (var i = 0; i < st.stats.length; i++) {
            bld += "<tr><td>" + st.stats[i].tbl + "</td><td>";
            if (exists(st.stats[i].sub)) {
                bld += st.stats[i].sub;
            }
            bld += "</td><td>" + st.stats[i].date + "</td></tr>";
        }
        bld += '</table>';
        $(".stats").html(bld);
    }

    function fmtdate(d) {
        var dd = d.getDate();
        var mm = d.getMonth() + 1;
        var y = d.getFullYear();
        return mm + "/" + dd + "/" + y;
    }

    function snuff() {
        curindex = -100;
        clearTimeout(myloop);
        st = {};
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }
  </script>
</body>
</html>