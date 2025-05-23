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
        //OLD:
        //var databld = "clientsettings=1&" + appLib.secparams();
        //NEW:
        /*
        var urlbld = "ajaxjson.ashx";
        var databld = { username: a$.xss($.cookie("username")), uid: a$.xss($.cookie("uid")) }; //was: appLib.secobj();
        $.ajax({
        type: "GET", url: urlbld, async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
        success: loaded
        });
        */
        //NEWER:
        var databld = { cmd: "clientsettings" };
        appLib.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            client = json;
            if (appLib.jsonerror(json)) {
                window.location = "../"; //FUTURE: mobile is different
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
        var databld = { cmd: "asm" };
        appLib.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (appLib.jsonerror(json)) { }
            else {
                client.assess = json;
                $("#asmSplitter").jqxSplitter({ theme: 'energy-blue', roundedcorners: true, width: 1200, height: 600, panels: [{ size: 300, max: 300, min: 50 }, { size: 900}] });
                $("#buildlabelSplitter").jqxSplitter({ disabled: true, theme: 'energy-blue', orientation: 'horizontal', width: 600, height: 35, panels: [{ size: 50 }, { size: 550}] });
                $("#buildSplitter").jqxSplitter({ theme: 'energy-blue', width: 900, height: 580, panels: [{ size: 300, min: 50 }, { size: 300, min: 50 }, { size: 300, min: 50}] });
                buildAssessmentList(false);
            }
        }
    }

    function buildAssessmentList(destroy) {
        var id = "asmTree";
        $("#" + id).remove();
        $("#asmTreeHolder").html('<div id="' + id + '"></div>');

        var bld = "";
        for (var i in client.assess.asd) {
            var asmcnt = 0;
            for (var j in client.assess.asm) if (client.assess.asm[j].Type == client.assess.asd[i].Name) asmcnt++;
            bld += '<div>' + client.assess.asd[i].plural + '</div>';
            bld += '<div>';
            bld += '  <div style="position:relative;height:22px;">';
            bld += '    <div style="position:absolute;top:0px;left:0px;width:295px;">';
            bld += '      <a href="#" class="new-asm" style="position:absolute;top:5px;left:0px;text-decoration:underline;font-size:10px;"><span class="dl-link">' + i + '/new</span>New ' + client.assess.asd[i].Name + '</a>';
            if (asmcnt > 0) {
                bld += '      <div style="font-size:10px;position:absolute;top:0px;right:0px;">Search:<input type="text" style="width:100px;border:none;border-bottom:1px solid black;" /></div>';
            }
            bld += "    </div>";
            bld += "  </div>";
            if (asmcnt > 0) {
                bld += '  <div style="positon:relative; max-height: 300px; overflow-y: scroll;">'
                bld += '    <dl class="asmlist">';
                for (var j in client.assess.asm) {
                    if (client.assess.asm[j].Type == client.assess.asd[i].Name) {
                        bld += '<dt><span class="dl-link">' + i + "/" + j + "</span>" + client.assess.asm[j].Name + "</dt>";
                    }
                }
                bld += "    </dl>";
                bld += "  </div>";
            }
            bld += "</div>";
            //alert("debug:" + client.assess.asd[i].Help);
        }
        bld += '<div>';
        bld += '<a href="#" onclick="';
        bld += "appAC2.newAssessmentType(); return false;";
        bld += '">New Assessment Type</a>';
        bld += "</div>";
        bld += "<div>&nbsp;</div>";

        $("#" + id).html(bld);
        $("#" + id).jqxNavigationBar({ width: 300, /*expandMode: 'multiple',*/ /*expandedIndexes: [0],*/theme: 'energyblue' });

        $(".new-asm").live('click', function (e) {
            var spl = $(this).children().first().html().split('/');
            var idx = parseInt(spl[0]);
            wizLoad("wizCreateNewASM", client.assess.asd[idx], 'New ' + client.assess.asd[idx].Name);
            return false;
        });

        $(".asmlist dt").live('click', function (e) {
            $(".asmlist dt").css("background-color", "");
            $(".asmlist dt").css("color", "");
            $(this).css("background-color", "blue");
            $(this).css("color", "white");
            var spl = $(this).children().first().html().split('/');

            if (spl.length == 2) {
                var idx = parseInt(spl[0]);
                if (spl[1] == "new") {
                    alert("debug:error 123");
                }
                else {
                    var jdx = parseInt(spl[1]);
                    asmbuild(idx, jdx);
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

    function asmbuild(idx, jdx) {
        //TODO: Open the assessment tree and highlight the correct asm.
        //$("#asmBuild").css("display", "");
        $("#asmBuildLabel").html("Build " + client.assess.asd[idx].Name + ": " + client.assess.asm[jdx].Name);

        var id = "asmComp";
        $("#" + id).remove();
        $("#asmCompHolder").html('<div id="' + id + '"></div>');

        var bld = "";

        //Test:
        /*
        client.assess.cat = [];
        client.assess.qst = [{ Question: "What is the secret of the universe", Type: "Monitor"}];
        client.assess.ans = [];
        */

        bld += '<ul>';
        bld += '<li item-expanded="false">';
        bld += 'Create New Category'; //  <span>cat/new</span>
        bld += '</li>';
        bld += '</ul>';

        //TEST
        bld = '<ul><li item-expanded="false"><span class="compcat">Birds</span><ul><li>Chicken</li><li>goose</li></ul></li><li item-expanded="false"><span class="compcat">Mammals</span><ul><li>Rabbit</li><li>Dog</li></ul></li></ul>';

        $("#" + id).html(bld);
        $("#" + id).jqxTree({ width: '300px', theme: 'energyblue' });

        //Display the build tree

        id = "asmBlue";

        //was bluecat
        bld = '<ul><li item-expanded="false"><span class="bluecat">(drag category here)</span></ul>';
        $("#" + id).remove();
        $("#asmBlueHolder").html('<div id="' + id + '"></div>');

        $("#" + id).html(bld);
        $("#" + id).jqxTree({ width: '300px', theme: 'energyblue' });

        //was bluecat
        $(".compcat").jqxDragDrop({ theme: 'energyblue', /* dropTarget: '.bluecat',*/feedback: 'clone', dropAction: 'none' });

        var targetHandle = [];
        var dragme;
        var elheight, elwidth;

        $('.compcat').bind('dragStart', function (event) {
            //alert("debug:dragstart");
            elheight = $(this).height();
            elwidth = $(this).width();
            var me = this;
            //            alert("debug: my own html is:" + $(me).html());
            //targets are all other .compcats under #asmBlue and all .bluecats
            function addtarget(ths) {
                var el = $(ths);
                //                    alert("debug: I am " + $(this).html());
                if (el.attr("unselectable") != "on") {
                    var parid = el.parent().parent().parent().parent().attr("id");
                    if (parid == "asmBlue") {
                        targetHandle.push({
                            bounds: { width: el.width(), height: el.height(), left: el.offset().left, top: el.offset().top },
                            entered: false,
                            el: el
                        });
                    }
                }
                else {
                    dragme = el;
                }
            };
            $(".compcat").each(function (index) {
                if (this != me) addtarget(this);
            });
            $(".bluecat").each(function (index) {
                addtarget(this);
            });

            var text = $(this).html();
            var branch = $(this).parent().parent();
            $(this).jqxDragDrop('data', { text: text, branch: branch });

            //Set all the backgrounds to red for testing purposes.            
            //alert("debug:elwidth=" + elwidth + ",elheight=" + elheight);
            for (var i in targetHandle) {
                //$(targetHandle[i].el).css("background-color", "red");
                var b = targetHandle[i].bounds;
                //alert("debug:b.left="+b.left+",b.top="+b.top+",b.width="+b.width+",b.height="+b.height);
            }

            $(document).mousemove(function (event) {
                var offset = dragme.offset();
                //$("#debwindow").html("offset.left=" + offset.left + ", offset.top=" + offset.top);
                $.each(targetHandle, function (idx, el) {
                    var b = el.bounds;
                    if (((offset.left + elwidth) > b.left) &&
                         (offset.left < (b.left + b.width)) &&
                         ((offset.top + elheight) > b.top) &&
                         (offset.top < (b.top + b.height))) {
                        if (!el.entered) {
                            fireEvent('dropTargetEnter', { target: el.el });
                            $("#debwindow").html("Enter Drop Target!");
                            el.entered = true;
                        }
                    }
                    else {
                        if (el.entered) {
                            fireEvent('dropTargetLeave', { target: el.el });
                            el.entered = false;
                        }
                    }
                });
            });
            function fireEvent(name, args) {
                var e = $.Event(name);
                e.args = args;
                return $('.compcat').trigger(e);
            };
        });




        var target = null;
        $('.compcat').bind('dropTargetEnter', function (event) {
            /*
            if (this == event.args.target) alert("debug:same");
            else alert("debug:different");
            */
            //$(event.args.target).addClass('asmtarget-hover');
            target = event.args.target;
        });

        $('.compcat').bind('dropTargetLeave', function (event) {
            $(event.args.target).removeClass('asmtarget-hover');
            target = null;
            $("#debwindow").html("leave drop target");
        });


        $('.compcat').bind('dragEnd', function (event) {
            if (target != null) {
                //$(target).removeClass('asmtarget-hover');
                //alert("debug:dropping=" + $(event.args.branch).parent().html());



                //TODO: prepend moves it, I think I want to copy it.
                //I don't want to prepend, I want to append right before the (drag category here) branch.

                //$(target).parent().parent().prepend(event.args.branch);
                $(target).parent().parent().before(event.args.branch);
                //$(event.args.branch).clone().insertBefore($(target).parent().parent());
                //$(event.args.branch).clone(false).find("*").removeAttr("id").insertBefore($(target).parent().parent());

            }
            //alert("debug:target=" + event.args.target);
            //$('.compcat').removeAttr('style');
            $("#debwindow").html("");
        });

        $('#asmComp').bind('select', function (event) {
            var me = this;
            //alert("debug:selected comp");
            //alert($(this).parent().parent().html());
            $(".compcat").each(function (index) {
                if (this != me) {
                    $(this).removeClass("compcat");
                    $(this).addClass("bluecat");
                }
            });
        });

        $('#asmBlue').bind('select', function (event) {
            var me = this;
            //alert("debug:selected");
            $(".compcat").each(function (index) {
                if (this != me) {
                    $(this).removeClass("compcat");
                    $(this).addClass("bluecat");
                }
            });
        });

        /*
        $(".asmcomplist dt").live('click', function (e) {
        var spl = $(this).children().first().html().split('/');

        if (spl.length == 2) {
        if (spl[1] == "new") {
        wizLoad("wizCreateNew" + spl[0], client.assess.asd[idx], 'New Category');
        }
        else {
        var jdx = parseInt(spl[1]);
        alert("debug: selected a " + spl[0]);
        }
        }
        else {
        alert("debug:errorclick");
        }
        });
        $(".asmcomplist dt").live("mouseover mouseout", function (e) {
        if (e.type == "mouseover") {
        $(this).addClass("asmlist-hover");
        }
        else {
        $(this).removeClass("asmlist-hover");
        }
        });
        */
    }

    function wizclose() {
        $(".wizard").each(function (index) { $(this).remove(); });
        $(".jqx-window-modal").each(function (index) { $(this).remove(); }); //this pisses me off.
    }

    //FUTURE: Wizard should be pushed down into a library.
    function wizLoad(id, obj, title) {
        /*
        var newDate = new Date;
        var wizid = newDate.getTime(); //unique id
        */
        wizclose();
        var wizid = "wizard";

        var ist = true;
        var tabi = 0;
        var ulbld = "<ul>", cnbld = "";
        $("#" + id + " dl").children().each(function (index) {
            if (ist) {
                ulbld += "<li>" + objectsub(obj, $(this).html()) + "</li>";
                ist = false;
            }
            else {
                cnbld += "<div>" + objectsub(obj, $(this).html()) + "</div>";
                tabi += 1;
                ist = true;
            }
        });
        ulbld += "</ul>";
        var bld = '<div id="' + wizid + '" class="wizard"><div></div><div style="overflow: hidden;"><div class="wiztab">' + ulbld + cnbld + '</div></div></div>';
        $("#wizards").html(bld);
        $('#' + wizid + ' .wiztab').jqxTabs({ height: 258, theme: 'energyblue' });
        for (var i = 1; i < tabi; i++) $('#' + wizid + ' .wiztab').jqxTabs('disableAt', i);
        $('#' + wizid).jqxWindow({ title: title, showCollapseButton: false, isModal: true, maxHeight: 400, maxWidth: 700, minHeight: 200, minWidth: 200, height: 300, width: 500, theme: 'energyblue' });

        $("#" + id).children().first().click(); //Special empty span with executable javascript.
    }

    var clientstats;
    function getclientstats() {
        var databld = { cmd: "clientstats" };
        appLib.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loadClientStatsJSON
        });
        function loadClientStatsJSON(json) {
            if (appLib.jsonerror(json)) { }
            else {
                clientstats = json;
                outputclientstats();
            }
        }
    }

    function postsave(databld) {
        appLib.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (json.errormessage) {
                alert(json.msg);
            }
        }
    }

    function newasm(me) {
        var databld = { cmd: "saveentry", tbl: "asm" };
        var wf = wizardfields(me);
        postsave($.extend(databld,wf));
        //DONE: Insert the new assessment DIRECTLY instead of re-reading the assessments.
        //asm:[{name:x,type:x,kpi:x},...]
        client.assess.asm.push(wf);
        var idx;
        for (var i in client.assess.asd) {
            if (wf.Type == client.assess.asd[i].Name) {
                idx = i;
                break;
            }
        }
        buildAssessmentList(true);
        asmbuild(idx, client.assess.asm.length - 1);
    }

    function newcqa(tbl, me) {
        var wf = wizardfields(me);
        var databld = { cmd: "saveentry", tbl: tbl };
        postsave(databld);
        //DONE: Insert the new assessment DIRECTLY instead of re-reading the assessments.
        //asm:[{name:x,type:x,kpi:x},...]
        client.assess[tbl].push(wf);
        buildAssessmentList(true);
        //asmbuild(idx, client.assess.asm.length - 1);
    }

    function wizardfields(me) {
        var databld = new Object();
        //TODO: Generalize this for all wizard data gatherings.
        //Find the encompassing parent with the id.
        var cnt = 50; //Loop out
        var found = false;
        var formid = 0;
        while (cnt > 0) {
            me = $(me).parent();
            if ($(me).attr('id')) {
                formid = $(me).attr('id');
                found = true;
                break;
            }
            cnt--;
        }
        if (!found) {
            alert("Error: No parent found with an id in newasm.");
        }
        var first = true;
        $("#" + formid + " :input").each(function (index) {
            //Normalize the name to contain the F: and G: only.
            var sspl = this.name.split("/");
            var field = "", group = "";
            for (var i in sspl) {
                var cspl = sspl[i].split(":");
                if (cspl[0] == "F") field = cspl[1];
                if (cspl[0] == "G") group = cspl[1];
            }
            var nm = "";
            if (field != "") nm += "F:" + field;
            if (group != "") nm += "/G:" + group;

            if ($(this).attr("type") == "checkbox") {
                databld[nm] = ($(this).attr('checked')) ? "YES" : "no";
            }
            else if ($(this).attr("type") == "button") {
            }
            else {
                databld[nm] = $(this).val();
            }
            databld[field] = databld[nm]; //test
        });
        return databld;
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
        var databld = { cmd: "loadcombovalues" };
        databld["P:loadid"] = me.id;
        databld["field"] = me.name;
        appLib.ajax({
            type: "GET", async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
            success: saveComboValuesJSON
        });
        function saveComboValuesJSON(json) {
            if (appLib.jsonerror(json)) { }
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
                var databld = { cmd: "savedataentry", postkdv: 1, field: $("#" + cid).attr("name"), val: newval };
                appLib.ajax({
                    type: "GET",
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
        newasm: newasm,
        newcqa: newcqa,

        wizclose: wizclose,

        submitclass: submitclass
    };
})();