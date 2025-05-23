<%@ Page Language="VB" AutoEventWireup="true" CodeFile="Help.aspx.vb" ValidateRequest="false" Inherits="jq_Help" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1" />
    <title>Acuity Help</title>

    <!--[if IE 8]>    <html lang="en-us" class="isie8"> <![endif]-->
    <!--[if gt IE 8]>    <html lang="en-us" class="isgtie8"> <![endif]-->

    <asp:PlaceHolder runat="server">
    	<link href="appApmClient/themes/default/theme.css" type="text/css" rel="stylesheet" />
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
   	    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
		<script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString%>raphael/raphael-2.1.0.js"></script>
</asp:PlaceHolder>

    <!--[if lt IE 9]>
      <script type="text/javascript">
      (function(){
        var html5elements = "address|article|aside|audio|canvas|command|datalist|details|dialog|figure|figcaption|footer|header|hgroup|keygen|mark|meter|menu|nav|progress|ruby|section|time|video".split('|');
        for(var i = 0; i < html5elements.length; i++){
          document.createElement(html5elements[i]);
        }
      })();
      </script>
    <![endif]-->
    <!--[if IE 7]>
        <style>
            .messages-box-unread { margin-top: -18px; }
            .messages-box-incomplete  { margin-top: -18px; }
        </style>
    <![endif]-->
	</head>
<body id="HelpRoot" style="overflow:visible;" runat="server">
    <div style="position: relative;">
    <div class="header gradient-lightest">
        <div class="logo"><h1><span>Acuity &reg;</span></h1></div>
    </div>
    <div id="pagenav" class="help-navlist" runat="server"><a href="help.aspx">Acuity 2.0 Help</a></div>
    <div class="help-content">
        <div class="help-sidebar">
            <div class="help-topics help-sidebox">
                <div id="topicslabel" runat="server"><h1>Topics</h1></div>
                <div id="pagehierarchy" class="help-pagehierarchy" runat="server">
                    <ul>
                        <li class="help-topic"><a href="#">Topic 1</a></li>
                        <li class="help-subtopic"><a href="#">Topic 1A</a></li>
                        <li class="help-subtopic"><a href="#">Topic 1B</a></li>
                        <li class="help-subtopic"><a href="#">Topic 1C</a></li>
                        <li class="help-topic"><a href="#">Topic 2 with a very verbose description that takes multiple lines.</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2A</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2B</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2C</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2D</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2E</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2F</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2G</a></li>
                        <li class="help-subtopic"><a href="#">Topic 2H with a very long description that takes multiple lines.C</a></li>
                        <li class="help-topic"><a href="#">Topic 3</a></li>
                        <li class="help-subtopic"><a href="#">Topic 3A</a></li>
                        <li class="help-subtopic"><a href="#">Topic 3B</a></li>
                        <li class="help-subtopic"><a href="#">Topic 3C</a></li>
                    </ul>
                </div>
            </div>
            <div class="help-sidebox">
                <h1>Resources</h1>
                <div id="Resources" runat="server">
                <ul>
                    <li><a href="#">Topic 1</a>
                        <ul>
                            <li><a href="#">Topic 1A</a></li>
                            <li><a href="#">Topic 1B</a></li>
                            <li><a href="#">Topic 1C</a></li>
                        </ul>
                    </li>
                    <li><a href="#">Topic 2</a>
                        <ul>
                            <li><a href="#">Topic 2A</a></li>
                            <li><a href="#">Topic 2B</a></li>
                            <li><a href="#">Topic 2C</a></li>
                        </ul>
                    </li>
                    <li><a href="#">Topic 3</a>
                        <ul>
                            <li><a href="#">Topic 3A</a></li>
                            <li><a href="#">Topic 3B</a></li>
                            <li><a href="#">Topic 3C</a></li>
                        </ul>
                    </li>
                </ul>
                </div>
            </div>
        </div>
        <div class="help-panel">
            <div id="pageleft" class="help-pageleft" runat="server"><a href="#">Previous Page</a></div>
            <div id="pagetitle" class="help-pagetitle" runat="server">Help Page Title</div>
            <div id="pageright" class="help-pageright" runat="server"><a href="#">Next Page</a></div>
            <div id="Content" class="help-body" runat="server">
                <div style="display:block;text-align:center;"><img style="width:300px;" src="images/under-construction-logo.gif" /><br /><br /><a href="help.aspx">Click for Acuity 2.0 Help Home Page</a></div>
            </div>
            <div id="pagechildren" class="help-pagechildren" runat="server"><a href="#">Chidren</a></div>
        </div>
    </div>

<form id="form1" runat="server">
</form>

<script type="text/javascript">
    $(window).resize(function () {
        //if (uiInterface) uiInterface.sizebars();
        $(".help-panel").css("width", ($(window).width() - 240) + 'px');
    });

    $(document).ready(function () {
        $(".help-topic").each(function () {
            var hx = $(this).index();
            var inchain = false;
            var lx;
            var cs = 0, cf = -1;
            $(".help-subtopic").each(function () {
                var sx = $(this).index();
                if (!inchain) {
                    if (sx == (hx + 1)) {
                        inchain = true;
                        cs = sx;
                        cf = cs;
                        lx = cs;
                    }
                }
                else {
                    if (sx == (lx + 1)) {
                        cf = sx;
                        lx = cf;
                    }
                }
            });
            $(this).append('<span class="help-subtopic-count">' + ((cf - cs) + 1) + '</span><span class="help-subtopic-ix">' + cs + ',' + cf + '</span>');
        });

        $(".help-subtopic").each(function () {
            $(this).append('<span class="help-subtopic-height">' + $(this).height() + '</span>');
        });

        $(".help-subtopic").animate({ height: '0px', padding: '0px', margin: '0px' }, 500);

        $(".help-topic").unbind().bind("click", function () {
            var c = $(" .help-subtopic-ix", this).html().split(',');
            var allexpand = -1;
            var lx = $(this).index();
            $(".help-subtopic").each(function () {
                var ix = $(this).index();
                if ( (ix==(lx+1))/*(ix >= parseInt(c[0]))*/ && (ix <= parseInt(c[1])) ) {
                    lx = ix;
                    if (allexpand < 0) {
                        if ($(this).height() == '0') allexpand = 1;
                        else allexpand = 0;
                    }
                    if (allexpand == 1) {
                        var oh = $(" .help-subtopic-height", this).html();
                        $(this).animate({ height: oh + 'px', padding: '4px 0 4px 4px', margin: '4px 0 4px 0' }, 500);
                    }
                    else {
                        $(this).animate({ height: '0px', padding: '0px', margin: '0px' }, 500);
                    }
                }
            });
        });


        $(".help-panel").css("width", ($(window).width() - 240) + 'px');
        $("#container").show();
        var paper = Raphael(0, 0, 400, 70);
        function animatelogo() {
            if (true || a$.preview()) {
                paper.clear();
                if (pageTheme == "Acuity3") {
                    $(".logo").css("width", "175px");
                    function radialpoint(o) {
                        var rad = o.angle * (Math.PI / 180.0);
                        return [o.origin[0] + (o.radius * Math.cos(rad)), o.origin[1] + (o.radius * Math.sin(rad))];
                    }
                    function bandpath(o) {
                        var so = radialpoint({ origin: o.origin, radius: o.radii[0], angle: o.sweep[0] });
                        var eo = radialpoint({ origin: o.origin, radius: o.radii[0], angle: o.sweep[1] });
                        var si = radialpoint({ origin: o.origin, radius: o.radii[1], angle: o.sweep[0] });
                        var ei = radialpoint({ origin: o.origin, radius: o.radii[1], angle: o.sweep[1] });
                        return "M " + si[0] + "," + si[1] + "L" + so[0] + "," + so[1] + " A" + o.radii[0] + "," + o.radii[0] + " 0 0 0 " + eo[0] + "," + eo[1] + " L" + ei[0] + "," + ei[1] + " A" + o.radii[1] + "," + o.radii[1] + " 0 0 1 " + si[0] + "," + si[1] + "z";
                    }
                    function logoslice(o) {
                        var slice = paper.path(bandpath(o));  //just passing the input object.
                        slice.attr({ fill: o.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 1, "fill-opacity": o.opacity });
                        return slice;
                    }
                    var lof = [4, -4]; //logo offset
                    var red = logoslice({ origin: [0 + lof[0], 66 + lof[1]], radii: [83, 18], color: "#D3344A", sweep: [240, 179], opacity: 1.0 }); //red
                    var redfinal = bandpath({ origin: [219 + lof[0], 66 + lof[1]], radii: [43, 18], color: "#D3344A", sweep: [240, 179], opacity: 1.0 });
                    red.animate({ path: redfinal }, 3000, ">");

                    var blue = logoslice({ origin: [196 + lof[0], 60 + lof[1]], radii: [61, 23], color: "#0076BF", sweep: [71, 10], opacity: 1.0 }); //blue
                    var bluefinal = bandpath({ origin: [196 + lof[0], 60 + lof[1]], radii: [61, 23], color: "#0076BF", sweep: [0, 297], opacity: 1.0 }); //blue
                    blue.animate({ path: bluefinal }, 3500, ">");

                    var yellow = logoslice({ origin: [219 + lof[0], 66 + lof[1]], radii: [153, 123], color: "#FAD148", sweep: [275, 213], opacity: 0.8 }); //yellow
                    var yellowfinal = bandpath({ origin: [219 + lof[0], 66 + lof[1]], radii: [53, 23], color: "#FAD148", sweep: [275, 213], opacity: 1.0 }); //yellow
                    yellow.animate({ path: yellowfinal }, 5000, "bounce");

                    paper.text(265 + lof[0], 55 + lof[1], "TM");
                }
            }

        }

        animatelogo();
    });
</script>
	</body>
</html>
