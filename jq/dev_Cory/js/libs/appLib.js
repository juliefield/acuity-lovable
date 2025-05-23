//appLib - Common JS Library Functions
/**
* jQuery.browser.mobile (http://detectmobilebrowser.com/)
*
* jQuery.browser.mobile will be true if the browser is a mobile device
*
**/
(function (a) { jQuery.browser.mobile = /android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|meego.+mobile|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)) })(navigator.userAgent || navigator.vendor || window.opera);

var ua = navigator.userAgent.toLowerCase();
var isAndroid = ua.indexOf("android") > -1; //&& ua.indexOf("mobile");

//alert("debug:ua=" + ua);
//alert("debug:isandroid=" + isAndroid + " SETTING TO TRUE");
isAndroid = false;

function setmobiledivs(disallowmobile) {
    //TODO: Automatic Mobile is defeated for now (the site is going live and mobile is not complete).
    if (disallowmobile) jQuery.browser.mobile = false;

    var mobilesim = false;
    if (appLib.gup("mobile") != "") {
        mobilesim = true;
    }
    var mobclass = (jQuery.browser.mobile || mobilesim) ? ".mobile-show" : ".mobile-hide";
    var ss = document.styleSheets;
    for (var i = 0; i < ss.length; i++) {
        var rules = ss[i].cssRules || ss[i].rules;
        for (var j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === mobclass) {
                rules[j].style.display = "block";
                return;
            }
        }
    }
}

(function() {
    var $ = window.jQuery;
    var myguid = "FAILURE";

    var timediff = 0;

    var ajaxTrace = { active: false, outdiv: '', indiv: '', defeatCallback: false };

    function settimediff(td) {
        timediff = td;
    }

    function xss(str) {
        if (str.toString().indexOf("<") >= 0) return ""; //Markup refusal
        return str.toString().replace(/\;\"\(\)/g,""); //XSS refusal.
    }

    function ajax(a, xd) {
        if (exists(xd)) {
            a.url = xd + "/";
            //a.crossDomain = true;
        }
        else {
            var loc = window.location.host;
            if (loc.indexOf("localhost",0) < 0) {
                loc =  window.location.protocol + '//' +  window.location.host + "/";
            }
            else {
                loc = window.location.protocol + '//' + window.location.host;
                loc += xss(window.location.pathname).substr(0,.xss(window.location.pathname).indexOf(".com")+5);
            }
            a.url = loc;
        }
        if (!a.service) {
            //alert("debug: No Service Specified - calling C#");
            a.service="C#";
        }
        if (a.service == "C#") {
            a.url +="ajaxjson.ashx";
        }
        else if (a.service == "JScript") {
            a.url +="jshandler.ashx";
        }
        else {
            alert("Invalid Service: " + a.service);
            a.url +="ajaxjson.ashx";
        }
        if (exists(a.params)) {
            a.url += "?" + a.params;
        }
        if (!a.data.uname) {
            if (!a.data.auth) a.data.auth=secobj();
        }
        var continuesuccess;
        var poptrace = "";
        if (!a.data.trace) {} else poptrace=a.data.trace;

        if (ajaxTrace.active || (poptrace!="")) {
            continuesuccess = a.success;
            var outdiv = ajaxTrace.outdiv;
            if ((poptrace=="out") || (poptrace=="both")) outdiv="";
            if (ajaxTrace.active || (poptrace=="out") || (poptrace=="both")) {
                $.dump({object: a,targetDiv: outdiv});
                $("#" + outdiv).append(a.url + "?");
            }
            var indiv = ajaxTrace.indiv;
            if ((poptrace=="in") || (poptrace=="both")) indiv="";
            if ((poptrace!="in") && (poptrace!="both") && ajaxTrace.active && ajaxTrace.defeatCallback) {
                a.success = function(json) {
                    $.dump({object: json,targetDiv: indiv});
                };
            }
            else {
                a.success = function(json) {
                    $.dump({object: json,targetDiv: indiv});
                    continuesuccess(json);
                };
            }
        }
        a.error = function(xhr, status, error) {
            if (ajaxTrace.active || (poptrace!="")) {
                var indiv = ajaxTrace.indiv;
                $("#" + indiv).append(xhr.responseText);
            }
            else {
                //TODO: Add a robust error handling system.
                alert(xhr.responseText);
            }
        }
        $.ajax(a);
    }
    function login(a,xd) {
        /* {
            uid: //ID of username-containing form element
            errdiv: //error div (optional)
            pid: //ID of password-containing form element
            product: //product name i.e. "Acuity" or "Fetch"
            service: 'C#' or 'JScript'.  C# by default for now.
            version: //product version - if blank, defaults to 1.0
            redirect: //url for redirect if successful
        } */
        if (!a.product) alert("Login functionality has changed");
        var cbhold = appLib.ajaxTrace.defeatCallback; //Can't defeat this callback, or the user won't be logged in :)
        appLib.ajaxTrace.defeatCallback = false;
        var databld = {cmd:'loginkey',username:$("#" + a.uid).val(),product:a.product};
        ajax({
            type: "GET", async: false, data: databld, dataType: "json", cache: false, service: a.service, error: ajaxerror,
            success: gotkey
        },xd);
        function gotkey(json) {
            if (a.errdiv && json.errormessage) {
                $.cookie("uid", "");
                $(normselect(a.errdiv)).css("display", "inline");
                $(normselect(a.errdiv)).html(json.msg);
            }
            else if (jsonerror(json)) {
                $.cookie("uid", "");
            }
            else
            {

                function loaded(json) {
                    if (a.errdiv && json.errormessage) {
                        $.cookie("uid", "");
                        $(normselect(a.errdiv)).css("display", "inline");
                        $(normselect(a.errdiv)).html(json.msg);
                    }
                    else if (jsonerror(json)) {
                        $.cookie("uid", "");
                    }
                    else
                    {
                        myguid = json.uid;
                        $.cookie("uid", myguid);
                        $.cookie("username", $("#" + a.uid).val());
                        if (exists(json.role)) {
                            $.cookie("role", json.role);
                        }
                        if (a.redirect) {
                            if (jQuery.browser.mobile) {
                                window.location = a.redirect + "m/"; //this isn't very good.
                            }
                            else {
                                window.location = a.redirect + "/";
                            }
                        }
                    }
                }

                var key=json.pkey;
                var databld = {cmd:'login',username:$("#" + a.uid).val(),pcypher:encypher($("#" + a.pid).val(),key),product:a.product};
                //REFERENCE:,testobject:{id:1,val:"a"},testarray:[{ id: 1, name: "amit" }, { id: 2, name: "ankit" }]
                ajax({
                    type: "GET", async: false, data: databld, dataType: "json", cache: false, service: a.service, error: ajaxerror,
                    success: loaded
                },xd);
                appLib.ajaxTrace.defeatCallback=cbhold;

            }
        }
    }

    function cdtest() {
        var urlbld = "http://demo.goldendatasolutions.com/ajaxjson.ashx?callback=?"; //TODO:  Make this json like everything else, then push it down into the library server-side.
        //var urlbld = "ajaxjson.ashx?callback=?"; //TODO:  Make this json like everything else, then push it down into the library server-side.
        var databld = "ping=1";
        $.ajax({
            type: "GET", url: urlbld, async: false, data: databld, dataType: "jsonp", jsonp: 'callback', jsonpCallback: 'jsonpCallback',
                 cache: false, error: ajaxerror,
            success: function() { alert("success"); }
        });
        function jsonpCallback(json) {
            alert(json);
            if (jsonerror(json)) {
            }
        }
    }

    function setmobiledivs() {
        var mobilesim = false;
        if (gup("mobile") != "") {
            mobilesim = true;
        }
        var mobclass = (jQuery.browser.mobile || mobilesim) ? ".mobile-show" : ".mobile-hide";
        var ss = document.styleSheets;
        for (var i = 0; i < ss.length; i++) {
            var rules = ss[i].cssRules || ss[i].rules;
            for (var j = 0; j < rules.length; j++) {
                if (rules[j].selectorText === mobclass) {
                    rules[j].style.display = "block";
                    return;
                }
            }
        }
    }

    function validateclass(classname,errdiv) {
        return validate('class',classname,errdiv);
    }

    function validatepiers(me,errdiv) {
        for (var i=0;i<10;i++)
        {
            me = $(me).parent();
            if ($(me).is("form")) {
                var id;
                if ($(me).attr('id')) {
                    id = $(me).attr('id');
                }
                else {
                    var newDate = new Date;
                    id = newDate.getTime(); //unique id
                    $(me).attr('id',id);
                }
                return validate('form',id,errdiv);
            }
        }
        alert("No form found in validatepiers function (appLib)");
    }

    function validateform(a) {
        return validate('form',a.formid,a.errdiv);
    }

    function validate(type,id,errdiv) {
        var r = new Array();
        var valid = true;
        var selector;
        if (type=='form') {
            selector = "#" + id + " :input";
        }
        else if (type=='class') {
            selector = "." + id;
        }
        else {
            alert("invalid validation type");
        }
        //expecting like:  /R:nonblank:0    a simple /R is valid and means the same is /R:nonblank:0
        //If group is zero, they are compared individually.
        //If greater than zero, they are checked as a group for a single match.
        $(selector).each(function (index) {
            var required = false;
            if ($(this).attr("name")) {
                var nspl = $(this).attr("name").split("/");
                for (var i in nspl) {
                    var vspl = nspl[i].split(":");
                    if (vspl[0]=="R") {
                        var n = 0;
                        if (vspl.length > 2) n = parseInt(vspl[2]);
                        if (r[n]) {
                            r[n].count += 1;
                        }
                        else {
                            r[n] = new Object();
                            r[n].count = 1;
                            r[n].nonblankcount = 0;
                        }
                        if ($(this).val()!="") {
                            r[n].nonblankcount += 1;
                        }
                    }
                }
            }
        });

        $(selector).each(function (index) {
            if ($(this).attr("name")) {
                var required = false;
                var nspl = $(this).attr("name").split("/");
                for (var i in nspl) {
                    var vspl = nspl[i].split(":");
                    if (vspl[0]=="R") {
                        var n = 0;
                        if (vspl.length > 2) n = parseInt(vspl[2]);
                        var color = "";
                        if ((r[n].count==1)&&(r[n].nonblankcount==0)) {
                            valid=false;
                            color="Red";
                        }
                        else if ((r[n].count>1)&&(r[n].nonblankcount==0)) {
                            valid = false;
                            color="Green";
                        }
                        if (color != "") {
                            //TODO:  If radio buttons or checkbox, draw a border around the parent?                            
                            $(this).css("border","3px solid " + color);
                        }
                        else
                        {
                            $(this).removeAttr("style");
                        }
                    }
                }
            }
        });
        if (!valid) {
            $(normselect(errdiv)).css("display","block");
        }
        return valid;
        //    if ($(this).attr("type") == "checkbox") {
        //        databld += "&" + this.name + "=";
        //        databld += ($(this).attr('checked')) ? "YES" : "no";
        //    }
        //    else {
        //        databld += "&" + this.name + "=" + $(this).val(); //TODO: Will need to watch out for "&"s
        //    }
    }
    function ajaxerror (request, textStatus, errorThrown) {
        alert('Communication Error:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
    }
    function jsonerror(json)
    {
       if (json.errormessage) {
         //alert(json.msg);
         $(".err-content").html(json.msg);
         $(".err-icon").show();
         return true;
       }
    }

    function gup(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) return "";
        else {
        //alert("debug:results[1]="+results[1]);
        return decodeURI(results[1]);
        }
    }
    function addOption(elSel, text, val) {
        elSel.options[elSel.options.length] = new Option(text, val);
    }

    function setOption(sb, val) {
        for (i = 0; i < sb.options.length; i++) {
            if (sb.options[i].value == val) {
                sb.options[i].selected = true;
                return;
            }
        }
        return "";
    }

    function submitform(formid, otherfields) {
        //TODO: Add callback function (default to loadSubmitFormJSON).
        //TODO: Allow overridable path to the web service.
        var databld = { cmd: "submitform", formid: formid };

        if (otherfields) {
            for (var key in otherfields) {
                databld[key] = encodeURIComponent(otherfields[key]);
            }
        }
        $("#" + formid + " :input").each(function (index) {
            if ($(this).attr("type") == "checkbox") {
                databld[this.name] = ($(this).attr('checked')) ? "YES" : "no";
            }
            else if ($(this).attr("type") == "button") {
            }
            else {
                databld[this.name] = encodeURIComponent($(this).val());
            }
        });
        ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: ajaxerror,
            success: loadSubmitFormJSON
        });
        function loadSubmitFormJSON(json) {
            if (json.errormessage) {
                alert(json.msg);
            }
        }
    }
    function getallparams() {
        var results = window.location.href.split("?");
        if (results.length < 2) return "";
        else return results[1];
    }
    function fv(me, aldiv, msgdiv) {
        alert("fv deprecated");
    }

    //
    // examples
    var EXAMPLEdefaultOptions = {
        chartxy: {
            renderTo: 'containersmother',
            anotherthing: 'to add',
            defaultSeriesType: 'column'
        }
    }

    function ExampleOfExtend(options) {
        alert("we are in the extend example function");
        var opts = $.extend({}, EXAMPLEdefaultOptions, options);
        alert(dumpObj(opts, "DUMP", "", 0));
    }

    // utilities
    String.prototype.trim = function () { return this.replace(/^\s+|\s+$/, ''); };
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }
    function IsObject(obj) {
        return obj ? true : false;
    }

    //Tests
    function setcookie(val) {
        $.cookie("testcookie", val);
    }
    function getcookie(val) {
        alert($.cookie("testcookie"));
    }

    function logout(redirect) {
        $.cookie("uid", null);
        $.cookie("username", null);
        if (redirect) {
            window.location = redirect; //"../"; //TODO: mobile is different
        }
    }

    /*
    function secparams() {
        return "username=" + $.cookie("username") + "&uid=" + $.cookie("uid");
    }
    */

    function secobj() {
        return { username: xss($.cookie("username")), uid: xss($.cookie("uid")) };
    }

    function changehash() {
        scroll(0, 0);
        showsection(location.hash);

        $("#leftpanel ul li a").each(function () {
            if ($(this).attr("href") == location.hash) {
                $(this).addClass("menu-active");
                $(this).removeClass("menu-inactive");
            }
            else {
                $(this).removeClass("menu-active");
                $(this).addClass("menu-inactive");
            }
        });
        //var hash = (location.hash.replace(/^#/, '') || 'blank') + '.';
    }

    function showsection(id) {
        hidemenu('ALL');
        hidesection('ALL');
        if (id != "#") {
            $(id + "," + id + " div").css("display", "");
        }
        else {
            $("#home,#home div").css("display", "");
        }
    }

    function hidemenu(id) {
          if (id == 'ALL') {
              $("#submenus div").each(function () {
                  $(this).css("display", "none");
              });
          }
          else {
              $("#"+id).css("display", "none");
          }
      }

     function showmenu(id, me) {          
          hidemenu('ALL');
          var ofs = $(window).width() - ($(me).offset().left + $(me).width() + parseInt($(me).css("padding-right")));
          //alert("ofs=" + ofs);
          $("#" + id).css("right", ofs + "px");
          $("#" + id).css("display", "block");
      }

    function hidesection(id) {
      if (id == 'ALL') {
        $("#sections div").each(function () {
          $(this).css("display", "none");
          });
      }
      else {
          $("#" + id).css("display", "none");
      }
    }

      function encypher(val, key) {
          var bld = "";
          if (!key.length) key="1";
          while (key.length < val.length) key += key;
          for (var i = 0; i < val.length; i++) {
            var a=val.charCodeAt(i) + key.charCodeAt(i);
            if (a > 256) a -= 256;
            bld += String.fromCharCode(a);
          }          
          return bld;
      }
      function decypher(val, key) {
          var bld = "";
          if (!key.length) key = "1";
          while (key.length < val.length) key += key;
          for (var i = 0; i < val.length; i++) {
              var a = val.charCodeAt(i) - key.charCodeAt(i);
              if (a < 0) a += 256;
              bld += String.fromCharCode(a);
          }
          return bld;
      }

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

    function isIE() {
        return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
    }

    function isFirefox() {
        return navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    }

    function urlprefix() {
       var par = gup("prefix");
       if (par != "") {
            return par + ".";
       }
       var p = window.location.hostname + a$.xss(window.location.pathname);
       var ix = p.indexOf(".acuityapm");
        if (ix >= 0) {
            p = p.substr(0, ix);
            var ps = p.split("/");
            p = ps[ps.length - 1];
            return p + ".";
        }
        return "";
     }

     function prefixhref(me) {
        var up = urlprefix();
        if (up != "") {
            var href = $(me).attr("href");
            if (href.indexOf("://" + up) < 0)
            {
                var url= $(me).attr('href').replace('://','://' + up);
                $(me).attr('href',url);
                //window.open(url, '_blank');
                //window.focus();
            }
            return true;
        }         
         return false;
     }

     function preview() {
        if (gup("preview")=="false") return false;
        if (gup("preview")=="true") return true;
        var up = urlprefix();
        if ((up=="dev.")||(up=="demo.")) return true;
        return false;
     }

    function showprogress(id,label) {
        //if (!a$.isIE()) {
        //$("#" + id).html('<img src="./ajax-loader.gif" />');
        $("#" + id).spin("large", "#EF4521");
        $("#" + id).show();
        //}
        $("#loadingprompt").html(exists(label) ? label : "Loading...");
        $("#loadingprompt").show();
    }

    function hideprogress(id) {
        //if (!a$.isIE()) {
        $("#" + id).spin(false);
        $("#" + id).hide();
        //}
        $("#loadingprompt").hide();
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

    var currenttablabel = "";
    function settablabel(lab) {
        currenttablabel = lab;
    }
    function gettablabel() {
        return currenttablabel;
    }

    function perfdate(perflevel) {
        var d = new Date();
        var akey = "110";

        d.setTime(d.getTime() - timediff);

        if (perflevel == "Normal") {
            return akey + "/" + d.getMonth() + "-" + d.getDate() + ":" + ((parseInt(d.getHours()) * 2) + parseInt(d.getMinutes() / 30));
        }
        else if (perflevel == "Express") {
            return akey + "/" + d.getMonth() + "-" + d.getDate();
        }
        else if (perflevel == "Minimum") {
            return akey;
        }
        else {
            return "";
        }
    }

    function generatechart(op) {
        //TRY: Create a clone, then send the clone only to create the chart (leaving the originals intact).

        //CHANGED: To make it work with jquery 2.3.3.
        var opchart = $.extend(true, {}, op);

        var parentEL = $("#" + opchart.renderTo).parent();
        $("#" + opchart.renderTo).remove();
        parentEL.html('<div id="' + opchart.renderTo + '"></div>');
        opchart.mychart = new Highcharts.Chart(opchart);
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }

    function guid() {
        var tguid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        return tguid;
    }

    function normselect(sel) {
         if (sel.length > 0) if ((sel.substring(0,1)!="#")&&(sel.substring(0,1)!=".")) sel = "#" + sel;
         return sel;
    }

    window.appLib = {
        preview: preview,
        urlprefix: urlprefix,
        prefixhref: prefixhref,
        validateform: validateform,
        validateclass: validateclass,
        validatepiers: validatepiers,
        validate: validate,
        submitform: submitform,
        setmobiledivs: setmobiledivs,
        showprogress: showprogress,
        hideprogress: hideprogress,

        gettablabel: gettablabel,
        settablabel: settablabel,

        changehash: changehash,
        showsection: showsection,
        hidemenu: hidemenu,
        hidesection: hidesection,
        showmenu: showmenu,
        addCommas: addCommas,

        gup: gup,
        getallparams: getallparams,
        setmobiledivs: setmobiledivs,

        login: login,
        logout: logout,
        /* secobj: secobj, //Do not expose */
        ajaxerror: ajaxerror,
        jsonerror: jsonerror,
        settimediff: settimediff,
        perfdate: perfdate,

        addOption: addOption,
        setOption: setOption,
        fv: fv,
        setcookie: setcookie,
        getcookie: getcookie,

        cdtest: cdtest,
        ajax: ajax,
        xss: xss,
        ajaxTrace: ajaxTrace,
        isIE: isIE,
        isFirefox: isFirefox,
        isAndroid: isAndroid,
        dumpObj: dumpObj,
        generatechart: generatechart,
        guid: guid
    };    
 })();
 var a$ = appLib;