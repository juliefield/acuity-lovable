<%@ Page Language="C#"  AutoEventWireup="true" CodeFile="helmet.aspx.cs" EnableTheming="false" StylesheetTheme="AcuityMV" Theme="" ValidateRequest="false" Inherits="helmet" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="head" runat="server">
    <title>Helmet</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />

<asp:PlaceHolder runat="server">

    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>modal/css/modal.css"  />

    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js"></script>

    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/knockout-3.2.0.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko.mapping.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko-postbox.js"></script>

    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>                                
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>modal/js/modal.js"></script>

    <script type="text/javascript" src="anothercolorpicker/src/jquery.simple-color.js"></script>


    <script type="text/javascript" src="../../appLib/js/appLib-1.1.15.js"></script>
    <script src="../../appLib/js/logoanimation-1.0.0.js" type="text/javascript"></script>

</asp:PlaceHolder>
    <script src="js/helmet.js" type="text/javascript"></script>


    <!-- see purecss.io for docs -->
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css" />
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.5.0/grids-responsive-min.css">

    <link rel="stylesheet" type="text/css" media="screen" href="css/styles.css"  />

</head>
<body>
    <div class="ava-wrapper" style="position: relative;">
        <div id="helmet"></div>
        <div class="ava-color-wrapper2" style="position: absolute; top: 0px; left: 400px;" >
            <div class="ava-color-wrapper">
                Helmet Color
                <input class='helmet_color_picker' style="height: 50px; width: 20px;" value='#ff00ff'/>
            </div>
            <div class="ava-color-wrapper">
                Mask Color: <input class='mask_color_picker' style="width: 20px;" value='#ff00ff'/>
            </div>
        </div>
        <input type="button" id="flip" value="flip" />
    </div>

</body>
<script language="javascript">
    var rsr = Raphael(document.getElementById('helmet'), '1000', '1020');

    $(document).ready(function () {
        var helmetColor = "green";
        $(".helmet_color_picker").val(helmetColor);
        var maskColor = "blue";
        $(".mask_color_picker").val(maskColor);
        var flip = false;

        var xf = 20 / 320;
        var xfs = "s" + xf + ", " + xf + ", 0, 0";

        function drawhelmet() {
            rsr.clear();
            var layer1 = rsr.set();
            var helmetpath = Raphael('rsr', '612', '792'); var group_a = rsr.set(); group_a.attr({'name': 'group_a'}); var group_b = rsr.set(); group_b.attr({'parent': 'group_a','name': 'group_b'}); var group_c = rsr.set(); var path_n = rsr.path("M 152.9,516.9 154.4,519.3 158.9,515.6 155.5,514.7 z").attr({class: 'st153',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_n'); var path_o = rsr.path("M 139.5,515.6 142.9,514.7 142.9,503.9 139.5,503 z").attr({class: 'st158',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_o'); var path_p = rsr.path("M 139.5,515.6 139.5,503 133.7,501.6 133.8,517.2 z").attr({class: 'st159',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_p'); var path_q = rsr.path("M 143.9,499.1 145.5,501.5 142.9,503.9 139.5,503 z").attr({class: 'st160',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_q'); var path_r = rsr.path("M 139.5,503 133.7,501.6 141.2,495 143.9,499.1 z").attr({class: 'st161',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_r'); var path_s = rsr.path("M 143.9,499.1 145.5,501.5 152.4,501.4 154,498.9 z").attr({class: 'st166',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_s'); var path_t = rsr.path("M 145.5,501.5 142.9,503.9 142.9,514.7 145.8,517 152.9,516.9 155.5,514.7 155.5,503.9 152.4,501.4 z").attr({class: 'st175',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_t'); group_c.attr({'parent': 'group_a','name': 'group_c'}); var group_d = rsr.set(); var path_u = rsr.path("M 158.9,515.6 164.6,517.1 157,523.4 154.4,519.3 z").attr({class: 'st152',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_u'); group_d.attr({'parent': 'group_a','name': 'group_d'}); var group_e = rsr.set(); var path_v = rsr.path("M 144.3,519.5 141.8,523.6 157,523.4 154.4,519.3 z").attr({class: 'st154',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_v'); group_e.attr({'parent': 'group_a','name': 'group_e'}); var group_f = rsr.set(); var path_w = rsr.path("M 144.3,519.5 154.4,519.3 152.9,516.9 145.8,517 z").attr({class: 'st155',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_w'); group_f.attr({'parent': 'group_a','name': 'group_f'}); var group_g = rsr.set(); var path_x = rsr.path("M 139.5,515.6 133.8,517.2 141.8,523.6 144.3,519.5 z").attr({class: 'st156',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_x'); group_g.attr({'parent': 'group_a','name': 'group_g'}); var group_h = rsr.set(); var path_y = rsr.path("M 139.5,515.6 144.3,519.5 145.8,517 142.9,514.7 z").attr({class: 'st157',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_y'); group_h.attr({'parent': 'group_a','name': 'group_h'}); var group_i = rsr.set(); var path_z = rsr.path("M 158.9,515.6 155.5,514.7 155.5,503.9 158.8,503 z").attr({class: 'st162',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_z'); group_i.attr({'parent': 'group_a','name': 'group_i'}); var group_j = rsr.set(); var path_aa = rsr.path("M 158.9,515.6 158.8,503 164.6,501.4 164.6,517.1 z").attr({class: 'st163',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_aa'); group_j.attr({'parent': 'group_a','name': 'group_j'}); var group_k = rsr.set(); var path_ab = rsr.path("M 154,498.9 152.4,501.4 155.5,503.9 158.8,503 z").attr({class: 'st164',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_ab'); group_k.attr({'parent': 'group_a','name': 'group_k'}); var group_l = rsr.set(); var path_ac = rsr.path("M 158.8,503 154,498.9 156.6,494.8 164.6,501.4 z").attr({class: 'st165',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_ac'); group_l.attr({'parent': 'group_a','name': 'group_l'}); var group_m = rsr.set(); var path_ad = rsr.path("M 143.9,499.1 154,498.9 156.6,494.8 141.2,495 z").attr({class: 'st167',parent: 'group_a','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).data('id', 'path_ad'); group_m.attr({'parent': 'group_a','name': 'group_m'}); var rsrGroups = [group_a,group_b,group_c,group_d,group_e,group_f,group_g,group_h,group_i,group_j,group_k,group_l,group_m]; group_a.push( ); group_b.push( ); group_c.push( path_n , path_o , path_p , path_q , path_r , path_s , path_t ); group_d.push( path_u ); group_e.push( path_v ); group_f.push( path_w ); group_g.push( path_x ); group_h.push( path_y ); group_i.push( path_z ); group_j.push( path_aa ); group_k.push( path_ab ); group_l.push( path_ac ); group_m.push( path_ad );
            //rsr.ellipse(171.42857, 135.21935, 171.42857, 131.42857).attr({ id: 'helmetpath', parent: 'layer1', fill: helmetColor, "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'helmetpath');
            
            //helmetpath.transform(xfs);
            layer1.attr({ 'id': 'layer1', 'name': 'layer1' });
            /*
            if (flip) {
                helmetpath.translate(50, 0);
                maskpath.scale(-1, 1);
                maskpath.translate(240, 0);
            }
            */
            var rsrGroups = [layer1]; layer1.push(helmetpath);
        }
        drawhelmet();
    });
</script>

</html>