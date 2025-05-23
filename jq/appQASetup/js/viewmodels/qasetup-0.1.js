function QASetupViewModel() {

    var self = this;

    //Model
    /*
    var tags = {
        formtype: [
            { id: 7, name: "Compliance" },
            { id: 1, name: "Knowledge" },
            { id: 2, name: "Monitor" },
            { id: 3, name: "Survey" }
        ],
        scope: [
            { id: 4, name: "Global" },
            { id: 5, name: "Convergent" },
            { id: 6, name: "Project: Duke" },
            { id: 7, name: "Project: Sprint" }
        ],
        topic: [
            { id: 10, name: "FCA Regulations" },
            { id: 11, name: "Employee Satisfaction" }
        ],
        form: [
            { id: 0, name: " Unused Questions" },
            { id: 10, name: "A-Game CSR Survey" },
            { id: 11, name: "A-Game Manager Survey" }
        ]
    };

    for (var key in tags) {
        for (var i in tags[key]) {
            tags[key][i].checked = false;
        }
    }
    tags.formtype.push({ id: 0, name: "uncategorized", checked: true });

    */
    var data = { lib: "qa", cmd: "getQaOutlines", formids: [2] };
    function testadd() { alert("debug:add"); }
    function testupdate() { alert("debug:update"); }
    $(".qasetup-outline-settings-jsonform").jsonForm({ action: "serve", data: data, member: "qaOutlines[0]", idmember: "formId", format: "listtable", editmode: "add", classprefix: "jfd",
        onAdd: testadd, onUpdate: testupdate, success: finish
    });
    function finish() {
    }

    $("#qasetuplibtabs").tabs({
        activate: function (event, ui) {
            var active = $('#qasetuplibtabs').tabs('option', 'active');
            //$("#tabid").html('the tab id is ' + $("#tabs ul>li a").eq(active).attr("href"));

        }
    });

    $("#qasetupoutlinetabs").tabs({
        activate: function (event, ui) {
            var active = $('#qasetupoutlinetabs').tabs('option', 'active');
            //$("#tabid").html('the tab id is ' + $("#tabs ul>li a").eq(active).attr("href"));

        }
    });

    var tags = { formtype: [], scope: [], topic: [], section: [], form: [] };
    var formslist = null;
    var sectionslist = null;
    self.formTypes = ko.observableArray();
    self.scopes = ko.observableArray();
    self.topics = ko.observableArray();
    self.sections = ko.observableArray();
    self.forms = ko.observableArray();
    self.formTypeValue = ko.observable("0");
    self.questions = ko.observable({});

    self.sectionLookup = function(id) {
        if (sectionslist == null) {
            return "NOT LOADED";
        }
        else {
            for (var i in sectionslist) {
                if (sectionslist[i].id == id) return sectionslist[i].name;
            }
            return "None";
        }
    }
    self.formLookup = function(id) {
        if (formslist == null) {
            return "NOT LOADED";
        }
        else {
            for (var i in formslist) {
                if (formslist[i].id == id) return formslist[i].name;
            }
            return "Sections/Questions Not Found in Forms";
        }
    }

    a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "qa", cmd: "initSetupFilters", role: $.cookie("TP1Role") },
        dataType: "json", cache: false, error: a$.ajaxerror, success: initloaded
    });
    function initloaded(json) {
        if (a$.jsonerror(json)) {
        }
        else {
            tags = json.tags;
            formslist = json.forms;
            sectionslist = json.sections;
            updatefilters(true);
            //reloadboxes();
        }
    }

    self.radioCheck = function (item, elem) {
        //alert("selected radio button, value=" + formTypeValue());
        //alert("selected radio button");
        var value = $(elem.srcElement).context.value; //ko sucks
        for (var i in tags.formtype) {
            if (tags.formtype[i].id != value) {
                tags.formtype[i].checked = false;
            }
            else {
                tags.formtype[i].checked = true;
            }
        }
        updatefilters(false);
        return true;
    }

    self.boxCheck = function (item, elem) {
        item.checked = $(elem.srcElement).is(':checked');
        //get parent element from tags.
        var broken = false;
        for (var key in tags) {
            for (var i in tags[key]) {
                if (item.id == tags[key][i].id) {
                    //alert("debug: found tag parent = " + key);
                    //TODO: Do any inter-tag operations.
                    broken = true;
                    break;
                }
            }
            if (broken) break;
        }
        updatefilters(false);
        return true;
    }

    function updatefilters(initial) {
        a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "qa", cmd: "updateSetupFilters", tags: tags, role: $.cookie("TP1Role") },
            dataType: "json", cache: false, error: a$.ajaxerror, success: updateloaded
        });
        function updateloaded(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                tags = json.tags;
                reloadboxes(initial);
            }
        }
    }

    function cleartext(key) {
        var foundunchecked = false;
        for (var i in tags[key]) {
            if (!tags[key][i].checked) {
                foundunchecked = true;
                break;
            }
        }
        if (foundunchecked) {
            return "All";
        }
        else {
            if (tags[key].length > 0) {
                return "Clear";
            }
            else {
                return "";
            }
        }
    }

    $(".qasetup-boxclear").unbind().bind("click", function () {
        //Knockout is stupid
        var key = "";
        if ($(this).hasClass("qasetup-boxclear-formtype")) {
            key = "formtype";
            //push({ id: 100, name: "TEST ADDITION", checked: true });
        }
        else if ($(this).hasClass("qasetup-boxclear-scope")) {
            key = "scope";
        }
        else if ($(this).hasClass("qasetup-boxclear-topic")) {
            key = "topic";
        }
        else if ($(this).hasClass("qasetup-boxclear-section")) {
            key = "section";
        }
        else if ($(this).hasClass("qasetup-boxclear-form")) {
            key = "form";
        }
        if (key != "") {
            clearbox(key);
            $(".qasetup-boxclear-" + key).html(cleartext(key));
        }
    });

    function reloadboxes(initial) {
        //Knockout is not very good
        if (initial) {
            formTypes([]);
            for (var i in tags.formtype) formTypes.push(tags.formtype[i]);
        }
        scopes([]);
        for (var i in tags.scope) scopes.push(tags.scope[i]);
        topics([]);
        for (var i in tags.topic) topics.push(tags.topic[i]);
        sections([]);
        for (var i in tags.section) sections.push(tags.section[i]);
        forms([]);
        for (var i in tags.form) forms.push(tags.form[i]);
        for (var key in tags) {
            $(".qasetup-boxclear-" + key).html(cleartext(key));
        }
        if (true) { //(!initial) { //You may wish to not display questions on initial load (when there are more questions).
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "qa", cmd: "getQuestions", tags: tags, role: $.cookie("TP1Role") },
                dataType: "json", cache: false, error: a$.ajaxerror, success: gotquestions
            });
            function gotquestions(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    //Only the qstTable is sent.  Before binding, rifle through the other organizations.
                    json.questions = [];
                    var idqst = -1;
                    var q = null;
                    function qst_new(ar, v) { //_new
                        for (var i in ar) {
                            if (ar[i].id == v) return false;
                        }
                        return true;
                    }
                    for (var i in json.qstTable) {
                        if (json.qstTable[i].idqst != idqst) {
                            if (idqst != -1) json.questions.push(q);
                            idqst = json.qstTable[i].idqst;
                            q = { idqst: json.qstTable[i].idqst, text: json.qstTable[i].text, version: json.qstTable[i].version, previousversions:[], forms:[], sections:[] };
                        }
                        if (json.qstTable[i].version != q.version) {
                            if (qst_new(q.previousversions,json.qstTable[i].version)) {
                                q.previousversions.push({ id: json.qstTable[i].version, text: json.qstTable[i].text });
                            }
                        }
                        if (json.qstTable[i].idform) {
                            if (qst_new(q.forms, json.qstTable[i].idform)) {
                                q.forms.push({ id: json.qstTable[i].idform });
                            }
                        }
                        if (json.qstTable[i].idsec) {
                            if (qst_new(q.sections, json.qstTable[i].idsec)) {
                                q.sections.push({ id: json.qstTable[i].idsec });
                            }
                        }
                    }
                    if (idqst != -1) json.questions.push(q);

                    json.sections = [];
                    var s;
                    for (var i in json.qstTable) {
                        if (qst_new(json.sections, json.qstTable[i].idsec)) {
                            json.sections.push({ id: json.qstTable[i].idsec, questions: [], forms: [] });
                            s = json.sections.length - 1;
                        }
                        else {
                            for (var j in json.sections) {
                                if (json.sections[j].id == json.qstTable[i].idsec) {
                                    s = j;
                                    break;
                                }
                            }
                        }
                        if (qst_new(json.sections[s].questions, json.qstTable[i].idqst)) {
                            json.sections[s].questions.push({ id: json.qstTable[i].idqst, text: json.qstTable[i].text });
                        }
                        if (json.qstTable[i].idform) {
                            if (qst_new(json.sections[s].forms, json.qstTable[i].idform)) {
                                json.sections[s].forms.push({ id: json.qstTable[i].idform });
                            }
                        }
                        //TODO: For each list of questions in a section, sort them into order by qsseq
                    }

                    json.forms = [];
                    var f;
                    for (var i in json.qstTable) {
                        if (true) { // To eliminate: Form: none, use this: (json.qstTable[i].idform) {
                            if (qst_new(json.forms, json.qstTable[i].idform)) {
                                json.forms.push({ id: json.qstTable[i].idform, sections: [] });
                                f = json.forms.length - 1;
                            }
                            else {
                                for (var j in json.forms) {
                                    if (json.forms[j].id == json.qstTable[i].idform) {
                                        f = j;
                                        break;
                                    }
                                }
                            }
                            if (qst_new(json.forms[f].sections, json.qstTable[i].idsec)) {
                                json.forms[f].sections.push({ id: json.qstTable[i].idsec, questions: [] });
                                s = json.forms[f].sections.length - 1;
                            }
                            else {
                                for (var j in json.forms[f].sections) {
                                    if (json.forms[f].sections[j].id == json.qstTable[i].idsec) {
                                        s = j;
                                        break;
                                    }
                                }
                            }
                            if (qst_new(json.forms[f].sections[s].questions, json.qstTable[i].idqst)) {
                                json.forms[f].sections[s].questions.push({ id: json.qstTable[i].idqst, text: json.qstTable[i].text, version: json.qstTable[i].version, formquestion: [] });
                            }
                            else {
                                if (json.qstTable[i].version == json.qstTable[i].formversion) {
                                    for (var k in json.forms[f].sections[s].questions) {
                                        if (json.forms[f].sections[s].questions[k].id == json.qstTable[i].idqst) {
                                            if (json.forms[f].sections[s].questions[k].formquestion.length == 0) {
                                                if (json.forms[f].sections[s].questions[k].version != json.qstTable[i].formversion) {
                                                    json.forms[f].sections[s].questions[k].formquestion.push({ id: json.qstTable[i].idqst, text: json.qstTable[i].text, version: json.qstTable[i].formversion });
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //TODO: Order questions within a section by qsseq, also order the sections within the form by scseq
                    }

                    questions(json);
                    $(".qasetup-expand-link").unbind().bind("click", function () {
                        if ($(this).html() != "-") {
                            $(" ul", $(this).parent()).show();
                            $(this).html("-");
                        }
                        else {
                            $(" ul", $(this).parent()).hide();
                            $(this).html("+");
                        }
                    });
                    $(".qasetup-newform-link").unbind().bind("click", function () {
                        var formids = [];
                        formids.push(parseInt($(" span", $(this)).html()));
                        //alert("debug: new form based on id=" + formid);
                        var data = { lib: "qa", cmd: "getQaOutlines", formids: formids };
                        $(".qasetup-outline-settings-jsonform").jsonForm({ action: "serve", data: data, member: "qaOutlines[0]", idmember: "formId", format: "listtable", editmode: "update", classprefix: "jfd",
                            onAdd: testadd, onUpdate: testupdate, success: finish
                        });
                        function finish() {
                        }

                    });

                    $(".draggable").draggable({ revert: true });
                    $(".droppable").droppable({
                        drop: function (event, ui) {
                            if ($(ui.draggable).hasClass("qasetup-drag-question")) {
                                $(" .qasetup-expand-link", ui.draggable).hide();
                                $(" ul", ui.draggable).hide();
                                $(".qasetup-outline-droptarget").append("<li>" + ui.draggable.context.innerHTML + "</li>");
                                //$(ui.draggable).hide();
                                $(ui.draggable).css("color", "blue");
                            }
                            else if ($(ui.draggable).hasClass("qasetup-drag-section")) {
                                $(" .qasetup-expand-link", ui.draggable).hide();
                                $(" .qasetup-draggable-lop", ui.draggable).hide();
                                $(".qasetup-outline-droptarget").append("<li>" + ui.draggable.context.innerHTML + "</li>");
                                //$(ui.draggable).hide();
                                $(ui.draggable).css("color", "blue");

                            }
                            else {
                                alert("unrecognized draggable element");
                            }
                            //$(this).html("dropped!");
                        }
                    });

                }
            }
        }
    }

    function clearbox(key) {
        var dest = (cleartext(key) == "All") ? true : false;
        for (var i in tags[key]) {
            tags[key][i].checked = dest;
        }

        //DONE: Make changes to box contents based on the new values
        updatefilters();

        //reloadboxes();
        //Knockout has some real problems.  This should happen automatically.
        /*
        $(" input", $(".qasetup-boxclear-" + key).parent()).each(function () {
            if (dest) {
                $(this).attr("checked", "checked");
            }
            else {
                $(this).removeAttr("checked");
            }
        });
        */

    }

}