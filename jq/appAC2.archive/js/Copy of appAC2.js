/************
appAC2 - Acuity 2.0
************/
/*
*/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    window.onload = function () {
        appLib.setmobiledivs();
    }

    var client;
    function getclientsettings() {
        var urlbld = "../ajaxjson.ashx";
        var databld = "clientsettings=1&" + appLib.secparams();
        $.ajax({
            type: "GET", url: urlbld, async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loadClientSettingsJSON
        });
        function loadClientSettingsJSON(json) {
            client = json;
            if (appLibOLD.jsonerror(json)) {
                window.location = "../"; //TODO: mobile is different
            }
            else {
                var bld = "";
                if (client.vrt) {
                    for (var key in client.vrt) {
                        bld += "<dt>" + key + "</dt>";
                        bld += "<dd>" + client.vrt[key] + "</dd>";
                    }
                }
                if (client.permissions) {
                    bld += "<dt>PERMISSIONS:</dt>";
                    for (var key in client.permissions) {
                        bld += "<dt>" + key + "</dt>";
                        bld += "<dd>" + client.permissions[key] + "</dd>";
                    }
                }
                var bl = "<ul>";
                var scalabel = "SCA";
                var firstitem = "";
                if (client.settings.SCALabel) scalabel = client.settings.SCALabel;
                if (client.sca) {
                    if (client.permissions.SeeAllSCAs) {
                        if (client.permissions.SeeAllSCAs == "Y") {
                            if (firstitem == "") firstitem = "All " + scalabel + "s";
                            else bl += "<li>All " + scalabel + "s</li>";
                        }
                    }
                    for (var i in client.sca) {
                        if (firstitem == "") firstitem = client.sca[i].name;
                        else bl += "<li>" + client.sca[i].name + "</li>";
                    }
                }
                if (firstitem == "") firstitem = "Add New " + scalabel;
                bl += "<li>Add New " + scalabel + "</li>";
                bl += "</ul>";
                //Note: there may be other settings
                $("#sub_sca").append(bl);
                $("#sca").html(firstitem);
                $("#accountsettingslist").html(bld);
                $("#company").html(client.vrt["Company Name"]);
                setComboDefs(client, "appLib.loadComboValues");
                //setViewFields();
                if (client.settings.SCALabel) $(".SCALabel").html(client.settings.SCALabel);
                if (client.settings.ASMLabel) $(".ASMLabel").html(client.settings.ASMLabel);
                refreshmenu();
                getAssessmentSystem(); //I could call this earlier, but let's see how it works here.
            }
        }
    }

    function getAssessmentSystem() {
        var urlbld = "../ajaxjson.ashx";
        var databld = "asm=1&" + appLib.secparams();
        $.ajax({
            type: "GET", url: urlbld, async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loadASMJSON
        });
        function loadASMJSON(json) {
            if (appLibOLD.jsonerror(json)) { }
            else {
                client.assess = json;
                var bld = "";
                for (var i in client.assess.asd) {
                    bld += '<div>' + client.assess.asd[i].plural + '</div>';
                    bld += "<div>";
                    bld += '<dl class="asmlist">';
                    for (var j in client.assess.asm) {
                        if (client.assess.asm[j].Type == client.assess.asd[i].Name) {
                            bld += "<dt><span>" + i + "/" + j + "</span>" + client.assess.asm[j].Name + "</dt>";
                        }
                    }
                    bld += '<dt><span>' + i + '/' + 'new</span>Create New ' + client.assess.asd[i].Name + '</dt>';
                    bld += "</dl>";
                    bld += "</div>";
                    //alert("debug:" + client.assess.asd[i].Help);
                }
                bld += '<div>';
                bld += '<a href="#" onclick="';
                bld += "appAC2.newAssessmentType(); return false;";
                bld += '">New Assessment Type</a>';
                bld += "</div>";
                bld += "<div>&nbsp;</div>";

                $("#asmTree").html(bld);
                $('#asmTree').jqxNavigationBar({ width: 300, expandMode: 'multiple', /*expandedIndexes: [0],*/theme: 'energyblue' });
                $(".asmlist dt").live('click', function (e) {
                    var spl = $(this).children().first().html().split('/');

                    if (spl.length == 2) {
                        if (spl[1] == "new") {
                            wizLoad("wizCreateNewASM", parseInt(spl[0]));
                        }
                    }
                    else {
                        alert("debug:errorclick");
                    }
                });
                $(".asmlist dt").live("mouseover mouseout", function (e) {
                    if (e.type == "mouseover") {
                        $(this).addClass("asmlist-hover");
                    }
                    else {
                        $(this).removeClass("asmlist-hover");
                    }
                });


                /*
                asd:[{name:x,help:x},...]
                asm:[{name:x,type:x,kpi:x},...]

                cat:
                qst
                ans
                */
            }
        }
    }

    //TODO: Wizard should be pushed down into a library.
    function wizLoad(id, idx) {
        for (var i = 0; i <= 1; i++) $("#wiztab" + i).css("display", "");
        for (var i = 2; i <= 4; i++) $("#wiztab" + i).css("display", "none");
        for (var i = 1; i <= 4; i++) $('#wiztab').jqxTabs('disableAt', i);

        $("#" + id).children().first().click();
        var ist = true;
        var tabi = 0;
        $("#" + id + " dl").children().each(function (index) {
            if (ist) {
                $("#wiztab" + tabi).html(objectsub(client.assess.asd[idx], $(this).html()));
                ist = false;
            }
            else {
                $("#wiztab" + tabi + "content").html(objectsub(client.assess.asd[idx], $(this).html()));
                tabi += 1;
                ist = true;
            }
        });
        $('#wiz').jqxWindow('setTitle', 'New ' + client.assess.asd[idx].Name);
        $('#wiz').jqxWindow('show');
        //jqxBUG
        alert("debug:setting left to 0px");
        $(".jqx-tabs-title-container").css("left", "0px");
    }

    function wizTab(cmd, idx) {
        $('#wiztab').jqxTabs(cmd, idx);
        $('#wiztab').jqxTabs('next');

    }
    function wizNext() {
    }

    var clientstats;
    function getclientstats() {
        var urlbld = "../ajaxjson.ashx";
        var databld = "clientstats=1&" + appLib.secparams();
        $.ajax({
            type: "GET", url: urlbld, async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loadClientStatsJSON
        });
        function loadClientStatsJSON(json) {
            if (appLibOLD.jsonerror(json)) { }
            else {
                clientstats = json;
                outputclientstats();
            }
        }
    }

    function outputclientstats() {
        var bld = "";
        if (clientstats["CO Count"]) {
            //TODO:Removed for now: bld += "<dt><b>" + clientstats["CO Count"] + "</b> contacts ready to view.</dt>"
        }
        if (clientstats["PCO Count"]) {
            bld += "<dt>Data Entries ready to process: <b>" + clientstats["PCO Count"] + "</b></dt>"
        }
        $("#clientstatslist").html(bld);
    }

    //TODO: This whole system should be a plugin (generalized for Fetch and Acuity 2.0).
    function setComboDefs() {
        $("form :input").each(function (index) {
            var field = "";
            var group = "";
            var sspl = this.name.split("/");
            for (var i in sspl) {
                var cspl = sspl[i].split(":");
                if (cspl[0] == "F") field = cspl[1];
                if (cspl[0] == "G") group = cspl[1];
            }
            // client.combodefs = {"F:List Name/G:":"vrt",...};
            if (client.combodefs["F:" + field + "/G:" + group]) {
                var name = "F:" + field;
                if (group != "") name += "/G:" + group;
                //alert("Debug: for " + field + " css=" + $(this).css("width"));
                var myid = this.id;
                this.id = "old" + this.id;
                $(this).before('<select id="' + myid + '" name="' + name + '" onfocus="appAC2.loadComboValues(this);"><option value=""></option></select>');
                $("#" + myid).css("width", (parseInt($(this).css("width").split("p")[0]) + 6) + "px");
                $(this).remove();
                //
            }
        });
    }

    function loadComboValues(me) {
        $(me).children().remove().end().append('<option selected value="">Loading..</option>');
        var urlbld = "../ajaxjson.ashx";
        var databld = "loadcombovalues=1&" + appLib.secparams();
        databld += "&P:loadid=" + me.id;
        databld += "&field=" + me.name;
        $.ajax({
            type: "GET", url: urlbld, async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: saveComboValuesJSON
        });
        function saveComboValuesJSON(json) {
            if (appLibOLD.jsonerror(json)) { }
            else {
                var bld = "";
                for (var i in json.value) {
                    bld += '<option value="' + json.value[i] + '">' + json.value[i] + '</option>';
                }
                bld += '<option value=""></option>';
                //alert("debug:loadid=" + json.loadid);
                $("#" + json.loadid).children().remove().end().append(bld);
                $("#" + json.loadid).attr("name", $("#" + json.loadid).attr("name") + "/V:" + json.getvals);
                //alert("debug:name=" + $("#" + json.loadid).attr("name"));
                var addplus = false;
                if (json.getvals == "kdv") {
                    if (client.permissions.AddKeyDataValues) {
                        if (client.permissions.AddKeyDataValues == "Y") {
                            addplus = true;
                        }
                    }
                }
                else {
                    addplus = true;
                }
                if (addplus) {
                    var bld = '<a id="plus' + json.loadid + '" class="formbutton" onclick="appAC2.addComboValue(';
                    bld += "'" + json.loadid + "'";
                    bld += ');return false;" href="#">+</a>'
                    $("#" + json.loadid).parent().append(bld);
                }
                $(me).prop("onfocus", null);
            }
        }
    }
    function addComboValue(id) {
        var name = $("#" + id).attr("name");
        var getval = "";
        var field = "";
        var sspl = name.split("/");
        for (var i in sspl) {
            var cspl = sspl[i].split(":");
            if (cspl[0] == "V") getval = cspl[1];
            if (cspl[0] == "F") field = cspl[1];
        }
        var ok = true;
        if (getval == "kdv") {
            ok = confirm("Values added to this box become Key Data Values for " + field + ".\nAre you sure you want to do this?");
        }
        if (ok) {
            $("#" + id).val(""); // in case they don't enter anything.
            $("#" + id).css("display", "none"); // in case they don't enter anything.
            $("#plus" + id).css("display", "none"); // in case they don't enter anything.
            var bld = '<input type="text" id="input' + id + '" name="ADD:' + id + '" onblur="appAC2.addComboValueOnBlur(this);" />';
            $("#" + id).parent().append(bld);
            $("#input" + id).css("width", (parseInt($("#" + id).css("width").split("p")[0]) - 6) + "px");
            $("#input" + id).focus();
        }
    }

    function newAssessmentType() {
        alert("debug:Create New Assessment Type");
    }

    function addComboValueOnBlur(me) {
        var newval = $(me).val().trim().trim();
        var nspl = $(me).attr("name").split(":");
        var cid = nspl[1];
        var getval = "";
        var field = "";
        var sspl = $("#" + cid).attr("name").split("/");
        for (var i in sspl) {
            var cspl = sspl[i].split(":");
            if (cspl[0] == "V") getval = cspl[1];
            if (cspl[0] == "F") field = cspl[1];
        }
        var compval = newval.toLowerCase();
        //$("#" + cid).val(newval); //This doesn't work if the casing is different.
        var done = false;
        $("#" + cid + " option").each(function () {
            if (!done) {
                if (compval == $(this).val().toLowerCase()) {
                    $("#" + cid).val($(this).val());
                    done = true;
                }
            }
        });
        if ($("#" + cid).val().toLowerCase() != compval) {
            var kdvpost = false;
            if (getval == "kdv") {
                kdvpost = true;
            }
            else if (getval == "both") {
                kdvpost = confirm("Click OK to add '" + newval + "' as a Key Data Value for " + field + ", Cancel otherwise.");
            }
            if (kdvpost) {
                var databld = "savedataentry=1&" + appLib.secparams();
                databld += "&postkdv=1&field=" + $("#" + cid).attr("name") + "&val=" + newval;
                $.ajax({
                    type: "GET",
                    url: "../ajaxjson.ashx",
                    async: true,
                    data: databld,
                    dataType: "json",
                    cache: false,
                    error: function (request, textStatus, errorThrown) {
                        alert('Communication Error:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
                    },
                    success: kdvposted
                });
                function kdvposted(json) {
                }
            }
            done = false;
            $("#" + cid + " option").each(function () {
                if (!done) {
                    if ((compval < $(this).val().toLowerCase()) || ($(this).val() == "")) {
                        $(this).before('<option value="' + newval + '">' + newval + '</option>');
                        done = true;
                    }
                }
            });
            //$("#" + cid).children().end().prepend('<option value="' + newval + '">' + newval + '</option>');
            $("#" + cid).val(newval);
        }
        $(me).prop("onblur", null);
        $(me).remove();
        $("#" + cid).css("display", "");
        $("#plus" + cid).css("display", "");

    }
    //End of plugin

    function refreshmenu() {
        $("#jqxMenu").jqxMenu({ width: 'auto', height: '30px', lineheight: '60px', showTopLevelArrows: true, theme: 'energyblue' });
        $("#jqxMenu").css('visibility', 'visible');
    }

    function ExampleOfExtend(options) {
        alert("we are in the extend example function");
        var opts = $.extend({}, EXAMPLEdefaultOptions, options);
        alert(dumpObj(opts, "DUMP", "", 0));
    }

    function objectsub(obj, str) {
        var loop = true;
        while (loop) {
            loop = false;
            var pos = str.indexOf("{{");
            if (pos >= 0) {
                var pose = str.indexOf("}}")
                if (pose >= 0) {
                    if (obj[str.substring(pos + 2, pose)]) {
                        str = str.substring(0, pos) + obj[str.substring(pos + 2, pose)] + str.substring(pose + 2);
                        loop = true;
                    }
                }
            }
        }
        return str;
    }

    function submitclass(classname) {
        alert("debug:submit class");
    }

    // global variables
    window.appAC2 = {
        ExampleOfExtend: ExampleOfExtend,

        loadComboValues: loadComboValues,
        addComboValue: addComboValue,
        addComboValueOnBlur: addComboValueOnBlur,

        getclientsettings: getclientsettings,
        getclientstats: getclientstats,

        newAssessmentType: newAssessmentType,

        submitclass: submitclass,
        wizTab: wizTab,
        wizNext: wizNext
    };
})();