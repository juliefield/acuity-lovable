// Prerequisites:  applib, chosen, ko.postbox

(function ($) {

    var root = [];

    $.fn.jsonForm = function (o) {

        { name: [{ first: "Jeff", last: "Gack" }, { first: "Jim", last: "Bo"}] }

        var me = this;
        var foundid = false;
        var addingentry = false;
        if (!a$.exists(o.format)) o.format = "list";
        if (!a$.exists(o.editmode)) o.editmode = "readonly";

        function bindcallbacks(idx) {
            if (o.editmode == "add") {
                $(".jf-command-add", me).unbind().bind("click", function () {
                    if (a$.exists(o.data.onAdd)) {
                        o.data.onAdd();
                    }
                    else if (a$.exists(o.onAdd)) {
                        o.onAdd();
                    }
                });


            }
            if ((o.editmode == "update") || (o.editmode == "add/update")) {
                $(".jf-command-update", me).unbind().bind("click", function () {
                    if (a$.exists(o.data.onUpdate)) {
                        o.data.onUpdate();
                    }
                    else if (a$.exists(o.onUpdate)) {
                        o.onUpdate();
                    }
                });
            }

            if ((o.editmode == "add") || (o.editmode == "add/update")) {
                $(".jf-command-addtableentry", me).unbind().bind("click", function () {
                    var kp = $(" .jf-data", $(this).parent()).html();
                    var kps = kp.split("/");
                    kp = ""; //need to reconstruct it.
                    var idx = 0;
                    var obj = null;
                    var format = "";
                    for (var i = 0; i < kps.length; i++) {
                        if (i == 0) {
                            format = kps[i];
                        }
                        else if (i == 1) {
                            obj = root[idx];
                            //idx = parseInt(kps[i]);
                            idx = obj.length;
                            kp = kps[i];
                        }
                        else {
                            try {
                                obj = obj[kps[i]];
                            }
                            catch (e) {
                                alert("jsonForm: Insertion is too complex.  Please save & refresh, then continue adding records.");
                                //TODO: Figure this out.  I think it's because I don't actually add to the object when I add.  I think I need to do this anyway.
                                return;
                            }
                            kp += "/" + kps[i];
                        }
                    }
                    var editmodesave = o.editmode;
                    o.editmode = "add"; //So we fill in blanks
                    var formatsave = o.format;
                    o.format = format;
                    var bld = "";
                    addingentry = true;
                    switch (o.format) {
                        case "list":
                        case "tree":
                            bld += list(obj, kp);
                            break;
                        case "listtable":
                            bld += listtable(obj, kp);
                            break;
                        default:
                            alert("jsonForm: format not found");
                            return;
                    }
                    //alert("debug: bld=" + bld);
                    $(this).parent().parent().prepend(bld);

                    o.format = formatsave;
                    o.editmode = editmodesave;
                    bindcallbacks(idx);
                    $(this).parent().remove();
                });
            }

        }

        function output(k, v, intable, kp) {
            var bld = "";
            if (!a$.exists(kp)) kp = "NOLINK";

            if (k == "ServiceMark") { //Any reserved words that you don't want to infer are editable.
                bld += '<span style="color:gray;">' + v + "</span>";
                return bld;
            }
            if ((o.editmode == "readonly") && (!intable) && (typeof v == "string")) bld += '"';
            if ((o.editmode == "readonly") || (k == "id")) {
                bld += '<span style="color:blue;">' + v + "</span>";
                if (k == "id") {
                    foundid = true;
                }
            }
            else if ((o.editmode == "update") || (o.editmode == "add/update")) {
                bld += '<span class="jf-couple"><input type="text" value="' + v + '" /><span class="jf-data">' + kp + '</span></span>';
            }
            else if ((o.editmode == "add")) {
                bld += '<span class="jf-couple"><input type="text" value="" /><span class="jf-data">' + kp + '</span></span>';
            }
            if ((o.editmode == "readonly") && (!intable) && (typeof v == "string")) bld += '"';
            return bld;
        }

        function list(obj, kp) {
            var bld = "";
            var makenew = false;
            for (var key in obj) {
                bld += "<li>";
                if (typeof obj[key] == "object") {
                    bld += "<label>";
                    var passkey = key;
                    if (Array.isArray(obj)) {
                        if ((o.editmode == "add")/*  && (parseInt(key) > 0) */) {
                            if ((!addingentry) && (!makenew)) {
                                passkey = key + "_NEW";
                                obj.length = 1; //Added: 3/18/2016 - Not sure about this.
                            }
                            //break;
                        }
                        if (addingentry) {
                            bld += "[" + obj.length + "]";
                        }
                        else {
                            bld += "[" + key + "]";
                        }
                    }
                    else {
                        bld += key;
                    }
                    if (addingentry) {
                        passkey = obj.length + "_NEW";
                        makenew = true;
                        //addingentry = false;
                    }
                    bld += "</label><ul>" + list(obj[key], kp + "/" + passkey) + "</ul>";
                }
                else {
                    bld += "<label>";
                    bld += key;
                    bld += "&nbsp; &nbsp;";
                    bld += output(key, obj[key], false, kp + "/" + key);
                }
                bld += "</li>";
            }
            if (makenew) {
                obj.push(obj[0]); //Added 3/18/2016 - Duplicate the last instance of the object.
            }
            if (((o.editmode == "add") || (o.editmode == "add/update")) && (Array.isArray(obj))) {
                bld += '<li><span class="jf-couple"><a href="#" class="jf-command-addtableentry">add table entry</a><span class="jf-data">' + o.format + "/" + kp + '</span></span></li>';
            }
            return bld;
        }

        function listtablearray(obj, kp) {
            var bld = "";
            if (!addingentry) {
                for (var col in obj[0]) {
                    bld += "<th>" + col + "</th>";
                }
            }
            bld += "</tr></thead><tbody>";
            for (var row in obj) {
                var passrow = row;
                if (o.editmode == "add") { //Added: 3/18/2016 - If adding, lop off the higher index members.
                    if (!addingentry) {
                        obj.length = 1;
                    }
                    else {
                    } //duck
                }
                if (addingentry) {
                    passrow = obj.length; //duck
                    addingentry = false;
                }
                bld += "<tr>";
                for (var col in obj[row]) {
                    bld += "<td>";
                    if (typeof obj[row][col] == "object") {
                        if (Array.isArray(obj[row][col])) {
                            bld += listtable(obj[row][col], kp + "/" + passrow + "/" + col);
                        }
                        else {
                            bld += "<ul>" + listtable(obj[row][col], kp + "/" + passrow + "/" + col) + "</ul>";
                        }

                    }
                    else {
                        bld += output(col, obj[row][col], true, kp + "/" + passrow + "/" + col); //output
                    }
                    bld += "</td>";
                }
                bld += "</tr>";
                //if (o.editmode == "add") break;
            }
            if ((o.editmode == "add") || (o.editmode == "add/update")) {
                bld += '<tr><td colspan="100%"><span class="jf-couple"><a href="#" class="jf-command-addtableentry">add table entry</a><span class="jf-data">' + o.format + "/" + kp + '</span></span></td></tr>';
            }
            bld += '</table>';
            return bld;
        }

        function listtable(obj, kp) {
            var bld = "";
            if (Array.isArray(obj)) {
                bld += "<table><thead><tr>";
                bld += listtablearray(obj, kp);
            }
            else {
                for (var key in obj) {
                    bld += "<li>";
                    if (typeof obj[key] == "object") {
                        if (Array.isArray(obj[key])) {
                            bld += '<table><thead><tr><th colspan="100%">' + key + "</th></tr><tr>";
                            bld += listtablearray(obj[key], kp + "/" + key);
                        }
                        else {
                            bld += "<label>";
                            bld += key;
                            bld += "</label><ul>" + listtable(obj[key], kp + "/" + key) + "</ul>";
                        }
                    }
                    else {
                        bld += "<label>";
                        bld += key + "&nbsp;: &nbsp;";
                        bld += output(key, obj[key], false, kp + "/" + key); //output
                    }
                    bld += "</li>";
                }
            }
            return bld;
        }


        function render(obj, kp) {


            var bld = "";

            if ((o.editmode == "update") || (o.editmode == "add/update")) {
                foundid = false;
            }
            switch (o.format) {
                case "list":
                    bld += "<ul>" + list(obj, kp) + "</ul>";
                    break;
                case "tree":
                    bld += "<p>TODO: Tree mode will allow expand/collapse of nodes</p><ul>" + list(obj, kp) + "</ul>"; //TODO: create tree
                case "table":
                    bld += "<p>table format is not currently supported, please use listtable</p>";
                    /*
                    bld = "<table>";
                    bld += table(obj);
                    bld += "</table>";
                    return bld;
                    */
                    break;
                case "listtable":
                    bld += "<ul>" + listtable(obj, kp) + "</ul>";
                    break;
                default:
                    bld += "<p>jsonForm: Unrecognized Format</p>";
                    break;
            }
            if ((o.editmode == "update") || (o.editmode == "add/update")) {
                if (!foundid) {
                    bld = '<p>WARNING - At least one "id" member or equivalent is recommended for update mode.  Only members named "id" will not be editable (if no json schema).</p>' + bld;
                }
                if ((!a$.exists(o.data.cmdUpdate)) && (!a$.exists(o.data.onUpdate)) && (!a$.exists(o.onUpdate))) {
                    bld = "<p>ERROR - No update command or callback provided (please provide member cmdUpdate or onUpdate to process updates).</p>" + bld;
                }
            }
            if ((o.editmode == "add") || (o.editmode == "add/update")) {
                if ((!a$.exists(o.data.cmdAdd)) && (!a$.exists(o.data.onAdd)) && (!a$.exists(o.onAdd))) {
                    bld = "<p>ERROR - No add command or callback provided (please provide member cmdAdd or onAdd to process additions).</p>" + bld;
                }
            }

            if (o.editmode == "add") {
                bld += '<input class="jf-command-add" type="button" value="add" />';
            }
            if ((o.editmode == "update") || (o.editmode == "add/update")) {
                bld += '<input class="jf-command-update" type="button" value="update" />';
            }

            return bld;
        }

        if (o.action == "init") {
            var idx = root.length;
            root.push(o.data);
            var kp = "" + idx;
            $(me).html(render(root[idx], kp));
            bindcallbacks(idx);
        }

        if (o.action == "serve") {
            var service = "JScript";
            var member = null;
            if (a$.exists(o.service)) service = o.service;
            if (!a$.exists(o.data)) {
                alert("jsonForm requires member: data");
            }
            else {
                var memberfound = false;
                if (a$.exists(o.member)) {
                    if (o.member != "") {
                        member = o.member;
                        memberfound = true;
                    }
                }
                if (!memberfound) {
                    if (a$.exists(o.data.member)) {
                        member = o.data.member;
                    }
                }
            }
            a$.ajax({ type: "GET", service: service, async: true, data: o.data,
                dataType: "json", cache: false, error: a$.ajaxerror, success: loadedInit
            });
            function loadedInit(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    var idx = root.length;
                    if (member != null) {
                        root.push(json[member]);
                    }
                    else {
                        root.push(json);
                    }
                    var kp = "" + idx;
                    $(me).html(render(root[idx], kp));
                    bindcallbacks(idx);
                    //ko.postbox.publish("TODO:", myvar);
                    //loadsel(0);
                    if (a$.exists(o.success)) {
                        o.success();
                    }
                }
            }
        }
    };
} (jQuery));