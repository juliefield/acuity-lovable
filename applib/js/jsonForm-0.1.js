// Prerequisites:  applib, chosen, ko.postbox

(function ($) {


    $.fn.jsonForm = function (o) {

        var root = [];

        var msg = "";

        var me = this;
        var foundid = false;
        var addingentry = false;
        var initbuild = false;
        var addbuild = false;

        if (!a$.exists(o.format)) o.format = "list";
        if (!a$.exists(o.editmode)) o.editmode = "readonly";
        if (!a$.exists(o.classprefix)) o.classprefix = "jfd";
        if (!a$.exists(o.idmember)) o.idmember = "id";

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
                                obj = obj[kps[i].split("_NEW")[0]];
                            }
                            catch (e) {
                                //TODO: Figure this out.  I think it's because I don't actually add to the object when I add.  I think I need to do this anyway.
                                return "jsonForm: Insertion is too complex.  Please save & refresh, then continue adding records.";
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
                            bld += list(obj, kp, false);
                            break;
                        case "listtable":
                            bld += listtable(obj, kp);
                            break;
                        default:
                            return "jsonForm: format not found";
                    }
                    addbuild = false;
                    //alert("debug: bld=" + bld);

                    $(this).parent().parent().prepend(bld);

                    o.format = formatsave;
                    o.editmode = editmodesave;
                    if (a$.exists(o.showtagsCallback)) o.showtagsCallback();
                    bindcallbacks(idx);
                    $(this).parent().remove();
                });
            }
        }

        function cliparrays(obj) {
            for (var key in obj) {
                if (typeof obj[key] == "object") {
                    if (Array.isArray(obj)) {
                        obj.length = 1;
                    }
                    cliparrays(obj[key]);
                }
            }
        }

        function classconvert(k) {
            var s = k.split("/");
            var bld = o.classprefix + "-" + s[1]; //Can't be an array index, skip the 0 because it's the root index
            for (var i = 2; i < s.length; i++) {
                var s2 = s[i].split("_");
                if (isNaN(s2[0])) {
                    bld += "-" + s[i];
                }
            }
            return bld;
        }

        function output(k, v, intable, kp) {
            var bld = "";
            if (!a$.exists(kp)) kp = "NOLINK";

            if (k == "ServiceMark") { //Any reserved words that you don't want to infer are editable.
                bld += '<span style="color:gray;">' + v + "</span>";
                return bld;
            }
            if ((o.editmode == "readonly") && (!intable) && (typeof v == "string")) bld += '"';
            if ((o.editmode == "readonly") || (k == o.idmember)) {
                bld += '<span style="color:blue;">' + v + "</span>";
                if (k == o.idmember) {
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

        function list(obj, kp, tableaslist) {
            var bld = "";
            for (var key in obj) {
                bld += "<li>";
                bld += '<div class="' + classconvert(kp + "/" + key) + '">';
                if (typeof obj[key] == "object") {
                    bld += "<label>";
                    var passkey = key;
                    if (Array.isArray(obj)) {
                        if (((o.editmode == "add") && initbuild) || addbuild /*  && (parseInt(key) > 0) */) {
                            passkey = key + "_NEW";
                            obj.length = 1; //Added: 3/18/2016 - Not sure about this.
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
                    var addbreak = false;
                    if (addingentry) {
                        passkey = obj.length + "_NEW";
                        //DONE: Deep Copy in an object
                        obj.push({});
                        $.extend(true, obj[obj.length - 1], obj[0]);
                        cliparrays(obj[obj.length - 1]); //Better to do it this way, there are too many flags in the recursion.
                        addingentry = false;
                        addbuild = true;
                        addbreak = true;
                    }
                    if (tableaslist) {
                        bld += "</label><ul>" + listtable(obj[key], kp + "/" + passkey, false) + "</ul>";
                    }
                    else {
                        bld += "</label><ul>" + list(obj[key], kp + "/" + passkey, false) + "</ul>";
                    }
                    if (addbreak) {
                        break;
                    }
                }
                else {
                    bld += "<label>";
                    bld += key;
                    //bld += "&nbsp; &nbsp;";
                    bld += "</label>";
                    bld += output(key, obj[key], false, kp + "/" + key);
                }
                bld += "</div>";
                bld += "</li>";

            }
            if (((o.editmode == "add") || (o.editmode == "add/update")) && (Array.isArray(obj))) {
                bld += '<li><span class="jf-couple"><a href="#" class="jf-command-addtableentry">add table entry</a><span class="jf-data">' + o.format + "/" + kp + '</span></span></li>';
            }
            return bld;
        }

        function listtablearray(obj, kp) {
            var bld = "";
            if (!addingentry) {
                if (typeof obj[0] == "object") {
                    for (var col in obj[0]) {
                        bld += "<th>" + col + "</th>";
                    }
                }
            }
            bld += "</tr></thead><tbody>";
            for (var row in obj) {
                var passrow = row;
                if (((o.editmode == "add") && initbuild) || addbuild) { //Added: 3/18/2016 - If adding, lop off the higher index members.
                    passrow += "_NEW";
                    obj.length = 1;
                }
                var addbreak = false;
                if (addingentry) {
                    passrow = obj.length + "_NEW";
                    //TODO: Deep Copy in an object
                    obj.push({});
                    $.extend(true, obj[obj.length - 1], obj[0]);
                    cliparrays(obj[obj.length - 1]); //Better to do it this way, there are too many flags in the recursion.
                    addingentry = false;
                    addbuild = true;
                    addbreak = true;
                }
                if (typeof obj[row] == "object") {
                    bld += "<tr>";
                    for (var col in obj[row]) {
                        bld += '<td class="' + classconvert(kp + "/" + col) + '">';
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
                    if (addbreak) {
                        break;
                    }

                    //if (o.editmode == "add") break;
                }
                else {
                    bld += "<tr><td>";
                    bld += output("", obj[row], true, kp + "/" + passrow); //output
                    bld += "</td></tr>";
                }
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
                    bld += '<div class="' + classconvert(kp + "/" + key) + '">';
                    if (typeof obj[key] == "object") {
                        var format_as_list = false;
                        if (a$.exists(obj["jf-format-" + key])) {
                            if (obj["jf-format-" + key] == "list") {
                                format_as_list = true;
                            }
                        }
                        if ((!format_as_list) && Array.isArray(obj[key])) {
                            bld += '<table><thead><tr><th colspan="100%">' + key + "</th></tr><tr>";
                            bld += listtablearray(obj[key], kp + "/" + key);
                        }
                        else {
                            bld += "<label>";
                            bld += key;
                            bld += "</label><ul>";
                            if (format_as_list) {
                                bld += list(obj[key], kp + "/" + key, true);
                            }
                            else {
                                bld += listtable(obj[key], kp + "/" + key);
                            }
                            bld += "</ul>";
                        }
                    }
                    else {
                        bld += "<label>";
                        bld += key; // +"&nbsp;: &nbsp;";
                        bld += "</label>";
                        bld += output(key, obj[key], false, kp + "/" + key); //output
                    }
                    bld += "</div>";
                    bld += "</li>";
                }
            }
            return bld;
        }


        function render(obj, kp, rootformat) {

            var bld = "";
            initbuild = true;

            if ((o.editmode == "update") || (o.editmode == "add/update")) {
                foundid = false;
            }
            switch (o.format) {
                case "list":
                    bld += "<ul>" + list(obj, kp, false) + "</ul>";
                    break;
                case "tree":
                    bld += "<p>TODO: Tree mode will allow expand/collapse of nodes</p><ul>" + list(obj, kp, false) + "</ul>"; //TODO: create tree
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
                    if (true) {
                        var fal = false;
                        if (a$.exists(rootformat)) {
                            if (rootformat == "list") {
                                fal = true;
                            }
                        }
                        if (fal) {
                            bld += "<ul>" + list(obj, kp, true) + "</ul>";
                        }
                        else {
                            bld += "<ul>" + listtable(obj, kp) + "</ul>";
                        }
                    }
                    break;
                default:
                    bld += "<p>jsonForm: Unrecognized Format</p>";
                    break;
            }
            if ((o.editmode == "update") || (o.editmode == "add/update")) {
                if (!foundid) {
                    bld = '<p>WARNING - At least one "' + o.idmember + '" member or equivalent is recommended for update mode.  Only members named "' + o.idmember + '" will not be editable (if no json schema).</p>' + bld;
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

            initbuild = false;

            return bld;
        }

        if (o.action == "init") {
            var idx = root.length;
            if (a$.exists(o.onMirror)) {
                o.onMirror(o.data);
            }

            if (a$.exists(o.schema)) {
                if (o.schema != null) {
                    o.data.schema = o.schema;
                }
                o.data.cmd = "silent";
                var service = "JScript";
                a$.ajax({ type: "POST", service: service, async: true, data: o.data,
                    dataType: "json", cache: false, error: a$.ajaxerror, success: loadedSchemaCheck
                });
                function loadedSchemaCheck(json) {
                    if (o.schema != null) {
                        if ((typeof json.msg != "undefined") && (json.msg != "")) {
                            if (a$.exists(o.validationSelector)) {
                                $(o.validationSelector).html(json.msg);
                            }
                        }
                        else {
                            $(o.validationSelector).html("Validation Successful.");
                        }
                    }
                    else {
                        if (a$.exists(json.schema)) {
                            if (a$.exists(o.schemaSelector)) {
                                $(o.schemaSelector).val(JSON.stringify(json.schema, null, 4));
                            }
                        }
                    }
                }
            }
            root.push({});
            $.extend(true, root[idx], o.data);
            var kp = "" + idx;
            $(me).html(render(root[idx], kp));
            if (a$.exists(o.showtagsCallback)) o.showtagsCallback();
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
                if (a$.exists(o.schema)) {
                    if (o.schema != null) {
                        o.data.schema = o.schema;
                    } 
                }
            }
            a$.ajax({ type: "POST", service: service, async: true, data: o.data,
                dataType: "json", cache: false, error: a$.ajaxerror, success: loadedInit
            });
            function loadedInit(json) {
                if (o.schema != null) {
                    if ((typeof json.msg != "undefined") && (json.msg != "")) {
                        if (a$.exists(o.validationSelector)) {
                            $(o.validationSelector).html(json.msg);
                        }
                    }
                    else {
                        $(o.validationSelector).html("Validation Successful.");
                    }
                }
                if (json.errormessage && (o.schema == null)) {
                    a$.jsonerror(json);
                }
                else {
                    var rootformat = "";

                    //{ me1: { me2: 3 } } //me1.me2 or me1[me2] = 3
                    //{ me1: [ 3] } // me1[0] = 3
                    //{ me1: [{me2: 3}] } //me1[0].me2 = 3

                    //TODO: This only works for the case of a single level member that is also not an array entry.
                    //  e.g. "qaOutlines" will work, but "qaOutlines[0]" or "qaOutlines.that" will not.

                    var idx = root.length;

                    if (member != null) {
                        var memobj = traversetomember(json, member, 1);
                        if (a$.exists(memobj["jf-format-" + lastmembername(member)])) {
                            rootformat = memobj["jf-format-" + lastmembername(member)];
                        }
                        root.push(traversetomember(json, member, 0));
                    }
                    else {
                        root.push(json);
                    }
                    if (a$.exists(o.onMirror)) {
                        o.onMirror(root[idx]);
                    }

                    if (o.schema == null) {
                        if (a$.exists(json.schema)) {
                            if (a$.exists(o.schemaSelector)) {
                                $(o.schemaSelector).val(JSON.stringify(json.schema, null, 4));
                            }
                        }
                    }

                    var kp = "" + idx;
                    $(me).html(render(root[idx], kp, rootformat));
                    bindcallbacks(idx);
                    //ko.postbox.publish("TODO:", myvar);
                    //loadsel(0);
                    if (a$.exists(o.showtagsCallback)) o.showtagsCallback();
                    if (a$.exists(o.success)) {
                        o.success();
                    }
                }
            }

            function traversetomember(json, member, fromend) {
                var separators = ['.', '['];
                var ms = member.split(new RegExp('[' + separators.join('') + ']', 'g'));
                var obj = json;
                var ml = ms.length
                for (var i = 0; i < ml; i++) {
                    if ((ml - i) == fromend) {
                        break;
                    }
                    if (ms[i].substring(ms[i].length - 1) == "]") {
                        obj = obj[ms[i].substring(0, ms[i].length - 1)];
                    }
                    else {
                        obj = obj[ms[i]];
                    }
                }
                return obj;
            }

            function lastmembername(member) {
                var separators = ['.', '['];
                var ms = member.split(new RegExp('[' + separators.join('') + ']', 'g'));
                if (ms[ms.length - 1].substring(ms[ms.length - 1].length - 1) == "]") {
                    return ms[ms.length - 1].substring(0, ms[ms.length - 1].length - 1);
                }
                else {
                    return ms[ms.length - 1];
                }

            }

        }
        return msg;
    };
} (jQuery));