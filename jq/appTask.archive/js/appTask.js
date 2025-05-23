
/************
appTask - The AJAX-enabled Task Manager (Product Manager, etc.)
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    //private vars
    var tsk = new Array();
    tsk[0] = {
        id: 1,
        parent: 0,
        txt: "First Task",
        typ: "goal",  //goal, milestone, activity, note, task, appointment
        priority: 5,
        datedue: "",
        timedue: "",  //If both a date and a time, it's an appointment.
        owner: 'jeffg',
        indent: -1 //Filled in by an initialization task.
    };
    tsk[1] = {
        id: 2,
        parent: 1,
        txt: "First Indented Task",
        typ: "milestone",  //goal, milestone, activity, note, task, appointment
        priority: 5,
        datedue: "",
        timedue: "",  //If both a date and a time, it's an appointment.
        owner: 'jeffg',
        indent: -1 //Filled in by an initialization task.
    };
    tsk[2] = {
        id: 3,
        parent: 1,
        txt: "Second Indented Task",
        typ: "milestone",  //goal, milestone, activity, note, task, appointment
        priority: 5,
        datedue: "",
        timedue: "",  //If both a date and a time, it's an appointment.
        owner: 'jeffg',
        indent: -1 //Filled in by an initialization task.
    };

    //task index by id
    function tskxid(id) {
        for (var i in tsk) {
            if (tsk[i].id == id) return i;
        }
        alert("ERROR: Task Index Not Found (Contact Tech Services)");
    }
    var gridloaded = false;
    var role = "";
    var roleset = "";
    function initworkrequest(flag) {
        // !flag = actual init.
        //alert("debug:here1");
        var backtoworkorder = false;
        var addworkorder = false;
        var rl = $.cookie("TP1Role");
        if (rl) role = rl;
        var r2 = $.cookie("TP1Roleset");
        if (r2) roleset = r2;
        if (flag) {
            if (flag == 1) backtoworkorder = true;
            if (flag == 2) addworkorder = true;
            if (flag == 3) backtolist = true;
        }
        else {
            if (roleset != "") {
                $("#roleselect").html("");
                var rsl = roleset.split(",");
                for (var i in rsl) {
                    $("#roleselect").append('<option value="' + rsl[i] + '">' + rsl[i] + '</option>');
                }
                $("#roleselect").val(role);
                $("#rolediv").css("display", "");
            }
        }
        if (role != "") {
            $("#namelabel").html("Requestor's Name");
            $("#emaillabel").html("Requestor's Email Address");
        }
        if ((role == "") || (addworkorder)) {
            //alert("debug:here5");
            if (addworkorder) {
                $("#woblast").html("");
                $("#nonanon").css("display", "none");
                $("#initialstatus").val("new");
                $("#initialstatusdiv").css("display", "");
                $("#reenter").css("display", "none");
                $("#servicediv").css("display", "");
                $("#workorderaddlinks").css("display", "");
                $("#titlediv").val("");
                $("#titlediv").css("display", "");
                var ln = wovars
                var lns = ln.split(",")
                for (var i in lns) {
                    $("#" + lns[i]).val("");
                }
                var svs = defaultserviceteam.split(",");
                $("#serviceteam").val(svs);

                $("#email").val($.cookie("TP1Email"));
                $("#initialstatus").val("new");
                $("#wosubmit").css("display", "none");
                $("#woaddsubmit").css("display", "");
                $("#woupdate").css("display", "none");
            }
            else {
                $("#initialstatusdiv").css("display", "none");
                $("#titlediv").css("display", "none");
                $("#reenter").css("display", "");
                $("#servicediv").css("display", "none");
                $("#workorderaddlinks").css("display", "none");
                $("#wosubmit").css("display", "");
                $("#woaddsubmit").css("display", "none");
                $("#woupdate").css("display", "none");
            }
            $("#anon").css("display", "");
            $("#anonfieldset").animate({ left: '0px' }, 500, function () {
                //$("#completiondate").focus();
                //$("#completiondate").blur();
                $("#requestor").focus();
            });

            var myDate = new Date();
            myDate.setDate(myDate.getDate() + 7);
            $("#completiondate").val((myDate.getMonth() + 1) + "/" + myDate.getDate() + "/" + myDate.getFullYear());
            $(".date").datepicker();
            //The stupid datepicker border shows on the screen.
            $("#ui-datepicker-div").css("position", "absolute");
            $("#ui-datepicker-div").css("left", "-1000px");

            //$("#fancyexample").css("display", "");
            //$("form").form(); //Make the pretty form.

        }
        else {
            $("#nonanon").css("display", "");
            if (backtoworkorder) {
                rowselected(currentrowid);
            }
            else if (backtolist) {
                $("#anon").css("display", "none");
                $("#rolefieldset").css("display", "none");
                $(".workorderlist").css("display", "");
                makegrid();
                if (appLib.gup("id") != "") {
                    //alert("debug: selecting row");
                    rowselected(appLib.gup("id"));
                }
            }
            else {
                $(".workorderlist").css("display", "");
                makegrid();
            }
        }
    }

    var opt = {
        apmTableType: 'single', //Valid types are 'cascade', 'single'
        apmTableMax: 5,
        apmTableId: 'list1', //if tabletype is 'cascade', this is a prefix.
        apmPagerId: 'pager1',
        apmQid: 'KPITable',
        apmAcuityHeaderOffset: true,
        datatype: "local",
        height: 'auto',
        rowNum: 1000,
        viewrecords: true,
        sortname: 'due',
        grouping: true,
        groupingView: {
            groupField: ['due'],
            groupCollapse: false
        },
        caption: "Grouping Array Data",
        onSelectRow: function (id) { rowselected(id); }
        //        footerrow : true,
        //        userDataOnFooter : true,
    };

    /*
    $(".workorderlist").css("display", "none");
    $(".workorderpanel1").css("display", "");
    $("#" + role).css("display", "");
    if (role == "csm") {
    }
    else if (role == "dev") {
    }
    else if (role == "exec") {
    }
    */
    var currentrowid;

    function rowselected(rowid) {
        //alert("comment: selected a row");
        var id = $('#' + opt.apmTableId).getCell(rowid, 'id');
        currentrowid = id;
        var urlbld = "Task.ashx?woblast=1&id=" + id;
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            dataType: "html",
            cache: false,  //make true for live site
            error: function (request, textStatus, errorThrown) {
                alert('Error Getting Work Order:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadblast
        });
    }

    function loadblast(txt) {
        $(".workorderlist").css("display", "none");
        $(".workorderpanel1").css("display", "");
        $(".workorderpanel2").css("display", "");
        $("#rolefieldset").css("display", "");
        $("#woblast").html(txt);
        showroleareas(true);
    }

    function showroleareas(clear) {
        if (clear) {
            $("#csm").css("display", "none");
            $("#dev").css("display", "none");
            $("#exec").css("display", "none");
        }
        if (role == "csm") {
            $("#csm").css("display", "");
        }
        else if (role == "dev") {
            $("#dev").css("display", "");
        }
        else if (role == "exec") {
            $("#exec").css("display", "");
        }
    }

    var wovars = "requestor,title,besttime,email,product,requesttype,descr,completiondate,priority,initialstatus,serviceteam";
    var defaultserviceteam = "dweathers,jeffgack,leslie";

    function backtolist() {
        $(".workorderlist").css("display", "");
        $(".workorderpanel1").css("display", "none");
        $(".workorderpanel2").css("display", "none");
        $("#rolefieldset").css("display", "none");
        $("#csm").css("display", "none");
        $("#dev").css("display", "none");
        $("#exec").css("display", "none");
    }

    function editworkorder() {
        $("#woblast").html("");
        $("#nonanon").css("display", "none");
        $("#reenter").css("display", "none");
        $("#servicediv").css("display", "");
        $("#workorderaddlinks").css("display", "");
        $("#initialstatusdiv").css("display", "none");
        $("#titlediv").css("display", "");
        $("#wosubmit").css("display", "none");
        $("#woaddsubmit").css("display", "none");
        $("#woupdate").css("display", "");
        $("#anon").css("display", "");
        $("#anonfieldset").animate({ left: '0px' }, 500, function () {
            //$("#completiondate").focus();
            //$("#completiondate").blur();
            $("#requestor").focus();
        });

        var urlbld = "Task.ashx?woget=1" + "&id=" + currentrowid;
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            dataType: "xml",
            timeout: 20 * 60 * 1000, //20 minutes
            cache: false,  //make true for live site
            error: function (request, textStatus, errorThrown) {
                alert('Error Getting Data:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadWorkOrderFromXML
        });

    }

    function loadWorkOrderFromXML(xml) {
        var series = new Array();
        var schemanames = new Array();
        var v;
        $(xml).find('Series0').each(function () {
            $(this).find('Schema').each(function () {
                schemanames.push($(this).find("Name").text());
            });
            $(this).find('Point').each(function () {
                for (n = 0; n < schemanames.length; n++) {
                    v = $(this).find(schemanames[n].replace(/ /ig, "_x0020_")).text(); //Substitution TEST (debug duck)
                    if (schemanames[n] == 'due') {
                        $("#completiondate").val(v);
                    }
                    else if (schemanames[n] == 'serviceteam') {
                        var svs = v.split(",");
                        $("#" + schemanames[n]).val(svs);
                    }
                    else {
                        $("#" + schemanames[n]).val(v);
                    }
                }
            });
        });
    }

    function roletag() {
        if (roleset != "") {
            return "-" + role;
        }
        return "";
    }

    var postingwhat;
    function post(what) {
        postingwhat = what;
        var urlbld = "Task.ashx?";
        var databld = "";
        if ((what == 'workorder') || (what == 'workorderadd') || (what == 'workorderupdate')) {
            if (what == 'workorder') {
                urlbld += "wopost=1&logby=web&verified=No"
            }
            else if (what == 'workorderadd') {
                urlbld += "wopost=1&logby=" + $.cookie("TP1Username") + roletag() + "&verified=Yes"
            }
            else if (what == 'workorderupdate') {
                urlbld += "wopostupdate=1&logby=" + $.cookie("TP1Username") + roletag() + "&id=" + currentrowid
            }
            var ln = wovars
            var lns = ln.split(",")
            var first = true;
            for (var i in lns) {
                if (!((lns[i] == "initialstatus") && (what == 'workorderupdate'))) {
                    if (!first) databld += "&";
                    first = false;
                    if ((lns[i] == 'serviceteam') && (what == 'workorder')) {
                        databld += lns[i] + "=" + defaultserviceteam;
                    }
                    else {
                        databld += lns[i] + "=" + $("#" + lns[i]).val();
                    }
                }
            }
        }
        else if ((what == 'devstatus') || (what == 'csmstatus') || (what == 'execstatus') || (what == 'devnote') || (what == 'csmnote') || (what == 'execnote') || (what == 'devhandling') || (what == 'csmhandling') || (what == 'exechandling')) {
            urlbld += "logpost=1"
            var lni, lno, lnis, lnos;
            databld = "logby=" + $.cookie("TP1Username") + roletag() + "&id=" + currentrowid;
            if (what == 'devstatus') {
                lni = "devstatus,devstatusnotes";
                lno = "logstatus,notes";
                databld += "&logtype=status";
            }
            else if (what == 'csmstatus') {
                lni = "csmstatus,csmstatusnotes";
                lno = "logstatus,notes";
                databld += "&logtype=status";
            }
            else if (what == 'execstatus') {
                lni = "execstatus,execstatusnotes";
                lno = "logstatus,notes";
                databld += "&logtype=status";
            }
            else if (what == 'devnote') {
                lni = "devnotenotes";
                lno = "notes";
                databld += "&logtype=note";
            }
            else if (what == 'csmnote') {
                lni = "csmnotenotes";
                lno = "notes";
                databld += "&logtype=note";
            }
            else if (what == 'execnote') {
                lni = "execnotenotes";
                lno = "notes";
                databld += "&logtype=note";
            }
            else if (what == 'devhandling') {
                lni = "devhandling,devhandlingnotes";
                lno = "logstatus,notes";
                databld += "&logtype=handling";
            }
            else if (what == 'csmhandling') {
                lni = "csmhandling,csmhandlingnotes";
                lno = "logstatus,notes";
                databld += "&logtype=handling";
            }
            else if (what == 'exechandling') {
                lni = "exechandling,exechandlingnotes";
                lno = "logstatus,notes";
                databld += "&logtype=handling";
            }
            var lnis = lni.split(",")
            var lnos = lno.split(",")
            for (var i in lnis) {
                databld += "&" + lnos[i] + "=" + $("#" + lnis[i]).val();
            }
        }
        else if (what == "workorderupdate") {
            alert("debug: update work order!");
        }
        else {
            alert("unrecognized posting type");
            return true;
        }
        $.ajax({
            type: "POST",
            url: urlbld,
            data: databld,
            cache: false,
            error: function (request, textStatus, errorThrown) {
                alert('Error Sending Information:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: postedInput
            //success: loadLoginXML
        });
    }

    function postedInput() {
        //alert("comment: successful post");
        if (postingwhat == 'workorder') {
            $("#anonfieldset").animate({ left: '-1500px' }, 500, function () {
                $("#anonthankyou").css("display", "");
                //$("#anonthankyou").animate({ opacity: 1.0 });
            });
            //$("#anon").css("display", "");
        }
        else if (postingwhat == 'workorderupdate') {
            $("#anonfieldset").animate({ left: '-1500px' }, 500, function () {
                initworkrequest(1);
            });
            //$("#anon").css("display", "");
        }
        else if (postingwhat == 'workorderadd') {
            $("#anonfieldset").animate({ left: '-1500px' }, 500, function () {
                initworkrequest(3);
            });
        }
        else {
            //Re-build the blast.
            rowselected(currentrowid);
        }
    }

    function makegrid() {
        var urlbld = "Task.ashx?wogrid=1";
        $.ajax({
            type: "GET",
            url: urlbld,
            async: false,
            dataType: "xml",
            timeout: 20 * 60 * 1000, //20 minutes
            cache: false,  //make true for live site
            error: function (request, textStatus, errorThrown) {
                alert('Error Getting Grid:' + request.status + ' / ' + textStatus + ' / ' + errorThrown);
            },
            success: loadTableFromXML
        });
    }

    function loadTableFromXML(xml) {
        var foundresults;
        var foundanyresults;
        var foundseries;
        var found;
        var x;
        var y;
        var i;
        var s;
        var n;
        var sb;
        var tbl = new Array();

        var series = new Array();
        var seriesname = "Work Orders";
        var schemanames = new Array();
        var v;
        foundanyresults = false;
        $(xml).find('Communication').each(function () {
            $(this).find('Alert').each(function () {
                alert($(this).find("Message").text()); //TODO: Make this a prompt or something.
                foundanyresults = true; //A message is a result.
            });
        });
        for (s = 0; s >= 0; s++) { //There is only one series for now, but keeping for future possibilities.
            foundseries = false;
            $(xml).find('Series' + s).each(function () {
                foundresults = false;
                foundseries = true;
                $(this).find('Spec').each(function () {
                    seriesname = $(this).find("Name").text();
                });
                $(this).find('Schema').each(function () {
                    schemanames.push($(this).find("Name").text());
                    //alert("debug:found schema");
                });
                opt.colNames = new Array();
                opt.colModel = new Array();
                for (n = 0; n < schemanames.length; n++) {
                    opt.colNames.push(schemanames[n]);
                    opt.colModel[n] = new Object();
                    opt.colModel[n].name = schemanames[n];
                    opt.colModel[n].index = schemanames[n];
                    opt.colModel[n].width = 145;
                    if (schemanames[n] == "status") {
                        opt.colModel[n].searchoptions = { defaultValue: 'Complete'};
                        opt.colModel[n].searchoptions.sopt = ['ne', 'eq', 'lt', 'le', 'gt', 'ge', 'bw', 'bn', 'in', 'ni', 'ew', 'en', 'cn', 'nc'];
                        //TODO: Figure out how to have multiple searches per line (this section is really just populating the default search).
                    }
                    else if (schemanames[n] == "id") {
                        opt.colModel[n].hidden = true;
                    }
                    else if (schemanames[n] == "descr") {
                        opt.colModel[n].width = 300;
                    }
                    else if (schemanames[n] == "number") {
                        opt.colModel[n].width = 65;
                    }
                    else if (schemanames[n] == "priority") {
                        opt.colModel[n].width = 55;
                    }
                    else if (schemanames[n] == "due") {
                        //opt.colModel[n].hidden = true;
                        opt.colModel[n].width = 70;
                    }
                    else if (schemanames[n] == "product") {
                        //opt.colModel[n].hidden = true;
                        opt.colModel[n].width = 50;
                    }
                    else if (schemanames[n] == "verified") {
                        //opt.colModel[n].hidden = true;
                        opt.colModel[n].width = 50;
                    }
                    else {
                        opt.colModel[n].width = 95;
                    }
                }

                $(this).find('Point').each(function () {
                    foundresults = true;
                    tbl[tbl.length] = new Object();
                    for (n = 0; n < schemanames.length; n++) {
                        //alert("debug searchfor:" + schemanames[n].replace(/ /ig, "_x0020_"));
                        v = $(this).find(schemanames[n].replace(/ /ig, "_x0020_")).text(); //Substitution TEST (debug duck)
                        tbl[tbl.length - 1][schemanames[n]] = new Object();
                        tbl[tbl.length - 1][schemanames[n]] = v;
                    }
                });
                //opt.data = new Object();
                opt.data = tbl;
                opt.caption = seriesname;
                try {
                    if (op.apmTouchpointDashboardFormatting) {
                        var tl = document.getElementById('tablelabel');
                        tl.innerHTML = "Table - " + seriesname;
                    }
                }
                catch (err) { }
            });
            if (foundresults) foundanyresults = true;
            if (!foundseries) break;
        }
        if (!foundanyresults) {
            alert("No Table Results Found.");
        }
        if (opt.apmTableType) {
            var tid;
            tid = '#' + opt.apmTableId;
            if (opt.apmPagerId) {
                opt.pager = '#' + opt.apmPagerId;
                //opt.toolbar = [true, "top"];
            }
            if (1) { // 
                //alert("debug:window.height=" + $(window).height());
                /*
                var offset = $(tid).offset();
                //alert("debug:offset.top=" + offset.top);
                var offadd = 0;

                if (opt.apmAcuityHeaderOffset) offadd = 80;
                opt.height = ($(window).height() - (offset.top + offadd));
                if (opt.apmAcuityHeaderOffset) offadd = 10;
                opt.width = ($(window).width() - (offset.left + offadd));

                try {
                if (opt.apmTouchpointDashboardFormatting) {
                opt.height = $(window).height() - 350;
                opt.width = $(window).width() - 350;
                }
                }
                catch (err) { }
                */
                //alert("debug:opt.width=" + opt.width);
                delete opt.rowNum;

                //TODO: This should work (commenting out the next 2 lines), but it doesn't.
                $(tid).GridUnload();
                gridloaded = false;

                if (gridloaded) {
                    $(tid).trigger("reloadGrid");
                }
                else {
                    gridloaded = true;
                    $(tid).jqGrid(opt);
                    $(tid).jqGrid('groupingGroupBy', $("#chngroup").val());
                    $("#chngroup").change(function () {
                        var vl = $(this).val();
                        if (vl) {
                            if (vl == "clear") {
                                jQuery('#' + opt.apmTableId).jqGrid('groupingRemove', true);
                            }
                            else {
                                jQuery('#' + opt.apmTableId).jqGrid('groupingGroupBy', vl);
                            }
                        }
                    });

                    if (opt.apmPagerId) {
                        $(tid).jqGrid('navGrid', opt.pager, { edit: false, add: false, del: false, refresh: false },
                                {}, // edit options  
                                {}, // add options  
                                {}, //del options  
                                {multipleSearch: true });
                        $(tid).jqGrid('navButtonAdd', opt.pager, {
                            caption: "CSV",
                            title: "Download Comma-Delimited File (.CSV)",
                            buttonicon: "ui-icon-arrowthick-1-s",
                            position: "last",
                            onClickButton: function () {
                                appTask.download("csv", tid);
                            }
                        });
                        /*
                        $(tid).jqGrid('navButtonAdd', opt.pager, {
                        caption: "||.TXT",
                        title: "Download Double-Pipe-Delimited Text File (.TXT)",
                        buttonicon: "ui-icon-arrowthick-1-s",
                        position: "last",
                        onClickButton: function () {
                        appTask.download("doublepipe");
                        }
                        });
                        */
                        //$('#t_' + opt.apmTableId).append("<input type='button' value='Download' />");
                        //TODO:  Select the best toolbar option.
                        //TODO:  Install a "Group By" box.
                    }
                    //var oc = '$(' + tid + ').GridUnload();return false;';

                    /*
                    var oc = 'appTask.cleartable("' + tid + '");return false;';
                    var temp = $("<a href='#' onclick='" + oc + "' style='right: 16px;'/>")
                    .addClass('ui-jqgrid-titlebar-close HeaderButton')
                    .hover(
                    function () { $(this).addClass('ui-state-hover'); },
                    function () { $(this).removeClass('ui-state-hover'); }
                    ).append("<span class='ui-icon ui-icon-circle-close'></span>");
                    $('.ui-jqgrid-title').before(temp);
                    */
                    //$('.ui-jqgrid-titlebar-close').remove();
                    try {
                        if (op.apmTouchpointDashboardFormatting) {
                            $(".ui-jqgrid-titlebar").hide();
                        }
                    }
                    catch (err) { }
                }                
                $(tid).jqGrid('filterToolbar', { autosearch: true });
                $(tid)[0].triggerToolbar();
                $(tid)[0].toggleToolbar();
            }
        }
        else alert("Table options need some work");
    }


    function download(downloadtype, tid) {
        var mya = new Array();
        mya = $('#' + opt.apmTableId).getDataIDs();  // Get All IDs
        var data = $('#' + opt.apmTableId).getRowData(mya[0]);     // Get First row to get the labels
        var colNames = new Array();
        var ii = 0;
        for (var i in data) { colNames[ii++] = i; }    // capture col names
        var html = "";
        var first = true;
        for (i = 0; i < colNames.length; i++) {
            if (!first) html += "\t";
            html += colNames[i];
            first = false;
        }
        html = html + "\n";  // output each row with end of line
        for (i = 0; i < opt.data.length; i++) {
            data = opt.data[i];
            first = true;
            for (j = 0; j < colNames.length; j++) {
                if (!first) html += "\t";
                html += data[colNames[j]]; // output each column as tab delimited
                first = false;
            }
            html = html + "\n";  // output each row with end of line
        }
        //Try this instead of:
        var form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", "DownloadGrid.ashx");
        form.setAttribute("target", "_blank");
        var hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadtype");
        hf.setAttribute("value", downloadtype);
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "downloadfilename");
        hf.setAttribute("value", "myfile");
        form.appendChild(hf);
        hf = document.createElement("input");
        hf.setAttribute("type", "hidden");
        hf.setAttribute("name", "csvBuffer");
        hf.setAttribute("value", html);
        form.appendChild(hf);
        document.body.appendChild(form);
        form.submit();
    }



    function inittaskheirarchy() {
        //For a more generalized task system, this isn't really init - this is like "init task heirarchy" which isn't in all task pages.
        //TODO: Read the tasks from the database
        //DONE: Set the proper indentations.
        for (var i in tsk) if (tsk[i].parent == 0) tsk[i].indent = 0;
        var f1;
        do {
            f1 = false;
            for (var i in tsk) {
                if (tsk[i].indent < 0) {
                    if (tsk[tskxid(tsk[i].parent)].indent < 0) {
                        f1 = true;
                    }
                    else {
                        tsk[i].indent = tsk[tskxid(tsk[i].parent)].indent + 1;
                    }
                }
            }
        } while (f1);

        for (var i in tsk) {
            $(".tasklist").append('<div class="task" id="task_' + tsk[i].id + '" style="margin-left:' + (10 + (tsk[i].indent * 20)) + 'px">' + tsk[i].txt + '</div>');
        }
        $(".task").click(function () { taskmenusetup(this); });
        $(".ui-icon-gear").click(function () { edittaskcurrent(); });
        //$('#wysdiv').css("display", "none");
    };

    var currentme = null;
    var editme = null;

    function edittaskcurrent() {
        edittask(currentme);
    };

    function changerole() {
        role = $("#roleselect").val();
        showroleareas(true);
    };

    function edittask(me) {
        var ed;
        try {
            $('#wysiwyg').wysiwyg("removeFormat");
        }
        catch (err) { }
        if (me == editme) {
            //alert("closing...");
            ed = $('#wysiwyg').html();
            $('#wysdiv').css("display", "none");
            $('#wysdiv').appendTo('#wyspark');
            $(editme).html(ed);
            editme = null;
            return;
        }
        var idar = me.id.split("_");
        //alert("here I am editing a task, id=" + idar[1]);
        var id = parseInt(idar[1]);
        var ix = tskxid(id);

        if (editme != null) {
            ed = $('#wysiwyg').html();
        }
        //firefox test
        $('#wysdiv').html('<textarea id="wysiwyg">Empty Text Area</textarea>');
        //
        var w = (($(window).width() - $(me).offset().left) - 5);
        //$('#wysiwyg').css("width", w + 'px');
        //alert("debug: wdth: " + w);
        $('#wysdiv').css("display", "");
        $('#wysdiv').css("width", w + 'px');
        $('#wysiwyg').css("width", w + 'px');
        $('.wysiwyg').css("width", w + 'px');
        $('.wysiwyg frame').css("width", w + 'px');
        var ct = $(me).html();
        //
        //Firefox Test
        //
        $('#wysiwyg').html(ct);
        //
        $('#wysiwyg').wysiwyg(wysiwygOptions);
        //alert("debug: content: " + $(me).html());
        $(".task").unbind('dblclick');
        $(me).html("");
        $('#wysdiv').appendTo(me);
        //
        //WORKS IN IE
        //$('#wysiwyg').wysiwyg("setContent", ct);
        //
        if (editme != null) {
            $(editme).html(ed);
        }
        editme = me;
        $('div.wysiwyg ul.toolbar').addClass('ui-state-highlight');
        taskmenusetup(editme);
    };

    function taskmenusetup(me) {
        $('.ui-state-highlight').removeClass('ui-state-highlight');
        $(me).addClass('ui-state-highlight');
        $(".hangingicons").css("top", ($(me).offset().top - $(".tasklist").offset().top) + 'px');
        currentme = me;
        $(".hangingicons").css("display", "");
        $(".task").unbind('dblclick');
        var setdbl = false;
        if (editme != null) {
            if (currentme != editme) {
                setdbl = true;
            }
        }
        else {
            setdbl = true;
        }
        if (setdbl) $(me).dblclick(function () { edittask(me); });

    };

    // utilities
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }

    function isIE() {
        return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
    }


    // global variables
    window.appTask = {
        dumpObj: dumpObj,
        inittaskheirarchy: inittaskheirarchy,
        initworkrequest: initworkrequest,
        backtolist: backtolist,
        editworkorder: editworkorder,
        changerole: changerole,
        post: post
    };
    function IsObject(obj) {
        return obj ? true : false;
    }
})();

