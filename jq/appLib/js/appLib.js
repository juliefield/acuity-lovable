/************
appLib - Common JS Library Functions
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    //private vars

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

    function gup(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) return "";
        else return results[1];
    }

    function getallparams() {
        var results = window.location.href.split("?");
        if (results.length < 2) return "";
        else return results[1];
    }

    //TODO:  Clean this up - it's a mess.
    //Field Validator
    function fv(me, aldiv, msgdiv) {
        var i, j;
        //alert("radcnt="+radcnt);
        //alert("restcnt="+restcnt);

        for (i = 0; i < radcnt; i++) {
            if (!radsel[i]) {
                var x = document.getElementsByName(radnm[i]);
                for (j = 0; j < x.length; j++) {
                    x[j].parentNode.style.borderWidth = "1px";
                    x[j].parentNode.style.borderStyle = "solid";
                    x[j].parentNode.style.borderColor = "black";
                }
            }
        }
        for (i = 0; i < restcnt; i++) {
            //alert("changing...");
            restnd[i].style.borderWidth = "1px";
            restnd[i].style.borderStyle = "solid";
            restnd[i].style.borderColor = "black";
        }

        radcnt = 0;
        restcnt = 0;
        invalid = false;

        rfdrec(document.forms[$(me).parents("form")[0].id], me);

        for (i = 0; i < radcnt; i++) {
            if (!radsel[i]) {
                var x = document.getElementsByName(radnm[i]);
                //alert("bad="+radnm[i]);
                for (j = 0; j < x.length; j++) {
                    x[j].parentNode.style.borderWidth = "3px";
                    x[j].parentNode.style.borderStyle = "solid";
                    x[j].parentNode.style.borderColor = "red";
                    invalid = true;
                }
            }
        }
        if (invalid) {
            outputerror(aldiv, "Red fields are required.", msgdiv);
            return false;
        }
        else {
            if (aldiv) {
                if (msgdiv) {
                    $('#' + aldiv).css("display", "none");
                }
                else {
                    $('#' + aldiv).html("");
                }
            }
            else {
                alert(msg);
            }
            return true;
        }
    }
    var radnm = new Array();
    var radsel = new Array();
    var radcnt = 0;
    var restnd = new Array();
    var restcnt = 0;
    var invalid = false;

    function rfdrec(node, me) {
        var i, j;

        var radfnd;

        for (i = 0; i < node.childNodes.length; i++) {
            if (typeof node.childNodes[i].name != "undefined") {
                if ((node.childNodes[i].name.substring(0, 2) == "R:") || (node.childNodes[i].name == "S:SPAM")) {
                    if (node.childNodes[i].tagName == "INPUT") {
                        //alert('name='+node.childNodes[i].name+',type='+node.childNodes[i].type);
                        if ((node.childNodes[i].type == "text") || (node.childNodes[i].type == "password")) {
                            if (node.childNodes[i].value.trim() == "") {
                                invalid = true;
                                restnd[restcnt] = node.childNodes[i];
                                restcnt++;
                                node.childNodes[i].style.borderWidth = "3px";
                                node.childNodes[i].style.borderStyle = "solid";
                                node.childNodes[i].style.borderColor = "red";
                            }
                        }
                        else if ((node.childNodes[i].type == "radio") || (node.childNodes[i].type == "checkbox")) {
                            radfnd = false;
                            for (j = 0; j < radcnt; j++) {
                                if (radnm[j] == node.childNodes[i].name) {
                                    radfnd = true;
                                    if (!radsel[j]) {
                                        radsel[j] = node.childNodes[i].checked;
                                    }
                                    break;
                                }
                            }
                            if (!radfnd) {
                                radnm[radcnt] = node.childNodes[i].name;
                                radsel[radcnt] = node.childNodes[i].checked;
                                radcnt++;
                            }
                            //alert(node.childNodes[i].checked);
                        }
                    }
                    else if (node.childNodes[i].tagName == "SELECT") {
                        var sb = node.childNodes[i];
                        if (sb.options[sb.selectedIndex].value.trim() == "") {
                            invalid = true;
                            restnd[restcnt] = node.childNodes[i];
                            restcnt++;
                            node.childNodes[i].style.borderWidth = "3px";
                            node.childNodes[i].style.borderStyle = "solid";
                            node.childNodes[i].style.borderColor = "red";
                        }
                    }
                    else if (node.childNodes[i].tagName == "TEXTAREA") {
                        if (node.childNodes[i].value.trim() == "") {
                            invalid = true;
                            restnd[restcnt] = node.childNodes[i];
                            restcnt++;
                            node.childNodes[i].style.borderWidth = "3px";
                            node.childNodes[i].style.borderStyle = "solid";
                            node.childNodes[i].style.borderColor = "red";
                        }
                    }
                }
            }
            rfdrec(node.childNodes[i], me);
        }
    }

    function fvmatch(aldiv, id1, id2, msg) {
        if ($("#" + id1).val() != $("#" + id2).val()) {
            $("#" + id1).css("border", "3px solid red");
            $("#" + id2).css("border", "3px solid red");
            outputerror(aldiv, msg);
            return false;
        }
        else {
            $("#" + id1).css("border-width", "1px");
            $("#" + id1).css("border-style", "solid");
            $("#" + id1).css("border-color", "black");
            //$("#" + id1).css("border", "1px solid black");
            $("#" + id2).css("border", "1px solid black");
            return true;
        }
    }

    function outputerror(aldiv, msg, msgdiv) {
        if (aldiv) {
            $('#' + aldiv).css("display", "block");
            if (msgdiv) {
                $('#' + msgdiv).html(msg);
            }
            else {
                $('#' + aldiv).html(msg);
            }
        }
        else {
            alert(msg);
        }
    }


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
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }
    function IsObject(obj) {
        return obj ? true : false;
    }
    String.prototype.trim = function () { return this.replace(/^\s+|\s+$/, ''); };
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }
    function IsObject(obj) {
        return obj ? true : false;
    }

    function xss(str) {
        if (str == null) return "";
        if (str.toString().indexOf("<") >= 0) return ""; //Markup refusal
        return str.toString().replace(/\;\"\(\)/g, ""); //XSS refusal.
    }

    function urlprefix() {
        var par = gup("prefix");
        if (par != "") {
            return par + ".";
        }
        var p = window.location.hostname + xss(window.location.pathname);
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
            if (href.indexOf("://" + up) < 0) {
                var url = $(me).attr('href').replace('://', '://' + up);
                $(me).attr('href', url);
                window.location = url;
            }
        }
        return false;
    }

    // global variables
    window.appLib = {
        urlprefix: urlprefix,
        prefixhref: prefixhref,
        addOption: addOption,
        setOption: setOption,
        gup: gup,
        fv: fv,
        xss: xss,
        fvmatch: fvmatch,
        getallparams: getallparams,
        ExampleOfExtend: ExampleOfExtend,
        dumpObj: dumpObj
    };
})();