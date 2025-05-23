/************
appApmScoreEditing
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var ds = null;
    var dsi = -1;
    var tbl = null;

    var destdiv = "";

    var isdirty;

    function btnView(destid) {
        destdiv = destid;
        isdirty = false;

        if (!ds) {
            //alert("Data Sources are not yet initialized - please wait a moment and try again");
            return;
        }

        if ($("#selDataSources").val() == "") {
            $("#" + destid).html("Set filters, then click 'View'");
            return;
        }

        for (var i = 0; i < ds.length; i++) {
            if (ds[i].name == $("#selDataSources").text()) {
                dsi = i;
                break;
            }
        }
        if (dsi < 0) {
            $("#" + destid).html("Data Source not found.");
            return;
        }

        if (ds[dsi].ui == "AttendanceTracker") {
            if (($("#selCSRs").val() == "") || ($("#selCSRs").val() == "each")) {
                $("#" + destid).html("Select CSR, then click 'View'");
                return;
            }
        }

        $("#" + destid).html("Loading: " + $("#selDataSources").text() + " table for " + $("#selCSRs").val() + "...");

        //alert("debug:Call to loadsourcedata with these parameters:" + appApmDashboard.pagecontrolparams());
        var databld = $.extend({ lib: "editor", cmd: "loadsourcedata" /*, bkey: appLib.perfdate("Express") */ }, appApmDashboard.pagecontrolobject());
        a$.showprogress("datasourceprogress");
        a$.ajax({
            type: "GET", service: "JScript", async: true, data: databld, dataType: "json", urlprefix: a$.urlprefix(), cache: false, error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            a$.hideprogress("datasourceprogress");
            if (a$.jsonerror(json)) {
            }
            else {
                tbl = json;
                //TODO: This should be destid, but I think firefox blows since it it's declared in the outer routine.
                var bld = "<table>";
                bld += "<thead>";
                //TODO: Needs to come from a passed "columns" member, not from the first row.
                for (var i = 0; i < tbl.columns.length; i++) {
                    bld += "<th>" + tbl.columns[i] + "</th>";
                }
                bld += "</thead>";
                bld += "<tbody>";
                for (var i = 0; i < tbl.table.length; i++) {
                    bld += "<tr>";
                    for (var key in tbl.table[i]) {
                        var found = false;
                        var editable = false;
                        for (var d = 0; d < ds[dsi].columns.length; d++) {
                            if (ds[dsi].columns[d].name == key) {
                                found = true;
                                if (ds[dsi].columns[d].editable) {
                                    editable = true;
                                    break;
                                }
                            }
                        }
                        if (found) {
                            bld += '<td';
                            if (ds[dsi].ui == "AttendanceTracker") {
                                bld += ' class="AT-' + key + '"';
                            }
                            bld += ">";
                            if (editable) {
                                if ((ds[dsi].ui == "AttendanceTracker") && (key == "Category")) {
                                    bld += '<select>';
                                    var inlist = false;
                                    //alert("debug:category=" + tbl.table[i][key]);
                                    for (var c = 0; c < ds[dsi].categories.length; c++) {
                                        bld += '<option value="' + ds[dsi].categories[c].name + '"';
                                        if (tbl.table[i][key] == ds[dsi].categories[c].name) {
                                            bld += ' selected="selected"';
                                            inlist = true;
                                        }
                                        bld += '">' + ds[dsi].categories[c].name + '</option>';
                                    }
                                    if (!inlist) {
                                        bld += '<option value="' + tbl.table[i][key] + '" selected="selected">' + tbl.table[i][key] + '</option>';
                                    }
                                    bld += '</select><span>' + tbl.table[i][key] + '</span>';
                                }
                                else {
                                    bld += '<input type="text"'
                                    if (key == "Date") {
                                        bld += ' class="tableDate tableDate_' + i + '"';
                                    }
                                    bld += ' value="' + tbl.table[i][key] + '"/><span>' + tbl.table[i][key] + '</span>';
                                }
                            }
                            else {
                                bld += tbl.table[i][key];
                            }
                            bld += "</td>";
                        }
                    }
                    bld += "</tr>";
                }
                bld += "</tbody>";
                bld += "<tfoot><tr>";
                for (var i = 0; i < tbl.columns.length; i++) {
                    bld += "<td";
                    if (ds[dsi].ui == "AttendanceTracker") {
                        bld += ' class="AT-' + tbl.columns[i] + '"';
                    }
                    bld += ">";
                    if ((ds[dsi].ui == "AttendanceTracker") && (tbl.columns[i] == "UserId")) {
                        bld += $("#selCSRs").val();
                    }
                    else if ((ds[dsi].ui == "AttendanceTracker") && (tbl.columns[i] == "Category")) {
                        bld += '<select>';
                        bld += '<option value=""></option>';
                        for (var c = 0; c < ds[dsi].categories.length; c++) {
                            bld += '<option value="' + ds[dsi].categories[c].name + '">' + ds[dsi].categories[c].name + '</option>';
                        }
                        bld += '</select><span></span>';
                    }
                    else if (tbl.columns[i] == "Date") {
                        bld += '<input type="text"'
                        if (tbl.columns[i] == "Date") {
                            bld += ' class="tableDate tableDate_I"';
                        }
                        var date = new Date();
                        var mydate = pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2) + '/' + date.getFullYear();
                        bld += ' value="' + mydate + '"/><span>' + mydate + '</span>';
                    }
                    else {
                        bld += '<input type="text" value="" /><span></span>';
                    }
                    bld += "</td>";
                }
                bld += "</tr></tfoot>";
                bld += "</table>";
                bld += '<br /><input id="btnSESave2" type="button" style="display:none;" value="Save Changes" />';
                bld += '<input id="btnSECancel2" type="button" style="display:none;" value="Cancel" />';

                $("#scoreeditorarea").html(bld);
                $("#scoreeditorarea input,#scoreeditorarea select").unbind();
                for (var i = 0; i < tbl.table.length; i++) {
                    $('.tableDate_' + i).unbind().DatePicker({
                        mode: 'single',
                        position: 'right',
                        onBeforeShow: function (el) {
                            if ($('#inputDate').val())
                                $('#inputDate').DatePickerSetDate($('#inputDate').val(), true);
                        },
                        onChange: function (date, el) {
                            $(el).val(pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2) + '/' + date.getFullYear());
                            //if ($('#closeOnSelect input').attr('checked')) {
                            $(el).DatePickerHide();
                            setsavecancel();
                            //}
                        }
                    });
                }
                //TODO: Datepicker isn't working.
                $('.tableDate_I').unbind().DatePicker({
                    mode: 'single',
                    position: 'right',
                    onBeforeShow: function (el) {
                        if ($('#inputDate').val())
                            $('#inputDate').DatePickerSetDate($('#inputDate').val(), true);
                    },
                    onChange: function (date, el) {
                        $(el).val(pad(date.getMonth() + 1, 2) + '/' + pad(date.getDate(), 2) + '/' + date.getFullYear());
                        //if ($('#closeOnSelect input').attr('checked')) {
                        $(el).DatePickerHide();
                        setsavecancel();
                        //}
                    }
                });
                $("#scoreeditorarea input").bind("keyup", function () {
                    setsavecancel(anydirt());
                });
                $("#scoreeditorarea input,#scoreeditorarea select").bind("change", function () {
                    isdirty = true;
                    if (ds[dsi].ui == "AttendanceTracker") {
                        if ($(this).is("select")) {
                            var mypoints = 0.0;
                            for (var i in ds[dsi].categories) {
                                if (ds[dsi].categories[i].name == $(this).val()) {
                                    mypoints = ds[dsi].categories[i].points;
                                    break;
                                }
                            }
                            var col = 0;
                            $(this).parent().parent().children().each(function () {
                                //while (!ds[dsi].columns[col].display) col += 1;
                                //alert("debug: column = " + tbl.columns[col] + " html=" + $(this).html());
                                if (tbl.columns[col] == "Points") {
                                    $(this).children().first().val(mypoints);
                                }
                                col += 1;
                            });
                        }
                    }
                    //zero based index of the column: $(this).parent().index() == 0
                    //zero based index of the row $(this).parent().parent().parent().index()
                    //is this a new entry or an existing entry
                    var ri = -1; //row index
                    if ($(this).parent().parent().parent().is("tfoot")) {
                        //alert("debug: is the input in the footer");
                        //see if there is an id-less member of the table.
                        for (var i = 0; i < tbl.table.length; i++) {
                            if (!exists(tbl.table[i].id)) {
                                ri = i;
                                break;
                            }
                        }
                        if (ri < 0) {
                            ri = tbl.table.length;
                            tbl.table[ri] = new Object();
                        }
                    }
                    else {
                        //alert("debug: editing an existing input.");
                        ri = $(this).parent().parent().index();
                    }
                    //alert("debug:ri=" + ri);
                    tbl.table[ri].isdirty = true;
                    var col = 0;
                    $(this).parent().parent().children().each(function () {
                        var myval;
                        var f = $(this).children().first();
                        if ($(f).is("input") || $(f).is("select")) {
                            myval = $(f).val();
                        }
                        else {
                            myval = $(this).html();
                        }
                        //alert("debug:harvesting column " + tbl.columns[col] + " as " + myval);
                        tbl.table[ri][tbl.columns[col]] = myval;
                        col += 1;
                    });
                    for (var i = 0; i < tbl.columns.length; i++) {
                        var myval = $(this).parent().parent()

                    }
                    setsavecancel(anydirt());
                });

                $("#btnSECancel,#btnSECancel2").unbind().bind("click", function () {
                    setsavecancel(false);
                    btnView(destid);
                });
                $("#btnSESave,#btnSESave2").unbind().bind("click", function () {
                    savesourcedata(ds[dsi], tbl);
                    setsavecancel(false);
                });
            }
        }
    }

    function savesourcedata(datasource, table) {
        var databld = $.extend({ lib: "editor", cmd: "savesourcedata", ui: datasource.ui, tbl: table/*, uname: "bypass"*/ }, appApmDashboard.pagecontrolobject());
        $(".message-scroll").remove();
        $("body").prepend('<div class="message-scroll" id="mydumper"></div>');
        a$.showprogress("datasourceprogress", "Saving...");
        $("body").css("overflow", "scroll");
        a$.ajax(
        /*$.dump({ object: */
        {
        /* WAS THIS:
        type: "GET", service: "JScript", async: false, data: databld, dataType: "json", urlprefix: a$.urlprefix(), cache: false, error: a$.ajaxerror,
        success: saved
        */
        type: "POST", service: "JScript", async: false, data: databld, dataType: "json", urlprefix: a$.urlprefix(), cache: false, error: a$.ajaxerror,
        success: saved
    }
    /* , targetDiv: "mydumper" });*/
        );
    function saved(json) {
        a$.hideprogress("datasourceprogress");
        if (a$.jsonerror(json)) {
            alert("debug:appending...");
            $("#" + destdiv).append(json.msg);
        }
        else {
            btnView(destdiv);
        }
    }
}

function setsavecancel(on) {
    //TODO: Disable the filters if save/cancel is active.
    if (on) {
        $("#btnSEView").attr("disabled", "disabled");
        $("#btnSESave").removeAttr("disabled");
        $("#btnSECancel").removeAttr("disabled");
        $("#btnSESave2").show();
        $("#btnSECancel2").show();
        $("#datasourcediv").attr("disabled", "disabled");
        $("#filterdiv").attr("disabled", "disabled");
        $(".navheader").hide();
    }
    else {
        $("#btnSEView").removeAttr("disabled");
        $("#btnSESave").attr("disabled", "disabled");
        $("#btnSECancel").attr("disabled", "disabled");
        $("#btnSESave2").hide();
        $("#btnSECancel2").hide();
        $("#datasourcediv").removeAttr("disabled");
        $("#filterdiv").removeAttr("disabled");
        $(".navheader").show();
    }
}

function exists(me) {
    return (typeof me != 'undefined');
}

function saveAttendanceCategories(datasource) {
    if (!datasource) return;
    var databld = { lib: "editor", cmd: "saveAttendanceCategories", cat: datasource.categories };
    a$.showprogress("datasourceprogress", "Saving...");
    a$.ajax({
        type: "POST", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
        success: saved
    });
    function saved(json) {
        a$.hideprogress("datasourceprogress");
        if (a$.jsonerror(json)) {
        }
        else {
        }
    }
}

function initDataSources(force) {
    if (!exists(force)) {
        if (ds != null) return;
    }
    var databld = { lib: "editor", cmd: "loaddatasources" };
    a$.showprogress("datasourceprogress");
    a$.ajax({
        type: "GET", service: "JScript", async: true, data: databld, dataType: "json", cache: false, error: a$.ajaxerror,
        success: loaded
    });
    function loaded(json) {
        a$.hideprogress("datasourceprogress");
        if (a$.jsonerror(json)) {
        }
        else {
            ds = json.datasources;
            if (location.hash == "#AttendanceTracker") btnView(destdiv);
        }
    }
    //TEST
    /*
    ds = [
    {
    name: "Attendance",
    ui: "AttendanceTracker", //Will be "editor" for most (if not special ui).
    //Note: id, userid and date are ALWAYS columns (stored in VH).
    //userid and date are ALWAYS displayed.
    //userid and date are ALWAYS required.
    //userid and date are editable.  TODO: Should the userid/date always be editable?  How can I specify they are not?
    columns: [
    {
    name: "UserId", //special field
    issystemfield: true,
    isid: true,
    required: true,
    display: true, //TODO: Make it so display false actually causes it to not display.
    editable: false
    },
    {
    name: "Date", //special field
    issystemfield: true,
    isid: false,
    required: true,
    display: true,
    editable: true
    },
    {
    name: "Category",
    isid: false,
    required: false,
    display: true,
    editable: true
    },
    {
    name: "Notes",
    isid: false,
    required: false,
    display: true,
    editable: true
    },
    {
    name: "Points",
    isid: false,
    required: true,
    display: true,
    editable: true
    }
    ],
    categories: [
    {
    name: "Late Arrival",
    points: 0.5
    },
    {
    name: "Early Departure",
    points: 0.5
    },
    {
    name: "Absence",
    points: 1.0
    }
    ]
    }
    ];
    */
}

var ATdestid;
function AttendanceTrackerCategoriesWidget(destid, editing) {
    $(".AT-admin").remove();
    ATdestid = destid;
    var bld = '<div class="AT-admin"><h1>Attendance Tracker Categories</h1>';
    if (!ds) {
        alert("Data sources are not yet loaded");
        return;
    }
    dsi = -1;
    for (var i = 0; i < ds.length; i++) {
        if (ds[i].ui == "AttendanceTracker") {
            dsi = i;
            break;
        }
    }
    if (dsi < 0) return; //Silently - no Attendance Tracker found.
    bld += '<table>';
    bld += '<thead><tr>';
    if (editing == "On") {
        bld += '<th></th>';
    }
    bld += '<th>Category</th><th>Points</th></tr></thead><tbody>';
    for (var i in ds[dsi].categories) {
        bld += '<tr>';
        if (editing == "On") {
            bld += '<td class="AT-delete"></td>';
        }
        bld += '<td class="AT-category">';
        bld += ds[dsi].categories[i].name;
        bld += '</td>';
        bld += '<td>';
        bld += ds[dsi].categories[i].points;
        bld += '</td>';
        bld += '</tr>';
    }
    bld += '</tbody>';
    if (editing == "On") {
        bld += '<tfoot><tr><td class="AT-add"></td><td class="AT-add-Category"><input type="text" value=""/></td><td class="AT-add-Points"><input type="text" value=""/></td></tr></tfoot>';
    }
    bld += '</table>';
    bld += "</div>";
    $(destid).append(bld);
    if (editing == "On") {
        $(".AT-add").unbind().bind("click", function () {
            if (($(".AT-add-Category input").first().val() != "") && ($(".AT-add-Category input").first().val() != "")) {
                var nc = ds[dsi].categories.length
                ds[dsi].categories[nc] = new Object();
                ds[dsi].categories[nc].name = $(".AT-add-Category input").first().val();
                ds[dsi].categories[nc].points = $(".AT-add-Points input").first().val();
                saveAttendanceCategories(ds[dsi]);
                $(".AT-admin").remove();
                AttendanceTrackerCategoriesWidget(ATdestid, editing);
            }
            else {
                alert("Please fill in both a Category and a Point value");
            }
        });
        $(".AT-delete").unbind().bind("click", function () {
            if (confirm("Are you sure you want to delete category " + $(" .AT-category", $(this).parent()).html() + " (you can re-add it)")) {
                ds[dsi].categories.splice($(this).parent().index(), 1);
                saveAttendanceCategories(ds[dsi]);
                AttendanceTrackerCategoriesWidget(ATdestid, editing);
            }
        });
    }
}

function anydirt() {
    var dirty = false;
    $("#scoreeditorarea input[type=text]").each(function () {
        if ($(" span", $(this).parent()).html() != $(this).val()) {
            //alert("debug:dirt found, input:" + $(this).val());
            //alert("debug:dirt found, span:" + $(" span", $(this).parent()).html());
            dirty = true;
        }
    });
    $("#scoreeditorarea select").each(function () {
        if ($(" span", $(this).parent()).html() != $(this).val()) {
            //alert("debug:dirt found, select:" + $(this).val());
            //alert("debug:dirt found, span:" + $(" span", $(this).parent()).html());
            //alert("debug:dirt found, parent:" + $(this).parent().html());
            dirty = true;
        }
    });
    return dirty;
}

function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}

// global variables
window.appApmScoreEditing = {
    btnView: btnView,
    initDataSources: initDataSources,
    AttendanceTrackerCategoriesWidget: AttendanceTrackerCategoriesWidget
};
})();

