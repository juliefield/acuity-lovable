// Prerequisites:  applib, chosen, ko.postbox

(function ($) {

    var filters = null;

    $.fn.FilterAction = function (o) {

        var me = this;

        function newline(n) {
            var bld = '<div class="filters-line-wrapper">';
            bld += '<input id="cbNotFilters_' + n + '" name="cbNotFilters_' + n + '" type="checkbox" class="filters-line-notcheckbox" value="Off" />';
            bld += '<label id="labNotFilters_' + n + '" for="cbNotFilters_' + n + '" class="filters-line-notlabel filters-line-not-dim">Not</label>';
            bld += '<div class = "filters-line-select-wrapper">';
            bld += '<select style="width: 140px;" class="chosen" id="selFilters_' + n + '"><option value="">Loading...</option></select>';
            bld += '</div>';
            bld += '</div>';
            $(me).html(bld);
            if (true) { //Always hide it when it's initialized (!o.shownot) {
                $(".filters-line-notcheckbox").hide();
                $(".filters-line-notlabel").hide();
            }
            $("#cbNotFilters_" + n).unbind().bind("change", function () {
                var n = parseInt($(this).attr("id").split("_")[1]);
                if ($(this).is(":checked")) {
                    $("#labNotFilters_" + n).removeClass("filters-line-not-dim");
                    $("#labNotFilters_" + n).addClass("filters-line-not-bright");
                }
                else {
                    $("#labNotFilters_" + n).removeClass("filters-line-not-bright");
                    $("#labNotFilters_" + n).addClass("filters-line-not-dim");
                }
                retrieve();
            });
        }

        function loadsel(n) {
            $("#selFilters_" + n).empty().append('<option value="" selected="selected">(All)</option>');
            for (var i in filters) {
                $("#selFilters_" + n).append('<option value="' + filters[i].id + '">' + filters[i].name + '</option>');
            }
            $("#selFilters_" + n).trigger("liszt:updated");
            $("#selFilters_" + n).unbind().bind("change", function () {
                var n = parseInt($(this).attr("id").split("_")[1]);
                if ($(this).val() != "") {
                    if (o.shownot) {
                        $("#cbNotFilters_" + n).show();
                        $("#labNotFilters_" + n).show();
                    }
                }
                else {
                    $("#cbNotFilters_" + n).hide();
                    $("#labNotFilters_" + n).hide();
                }
                retrieve();
            });
        }

        function retrieve() {
            var arr = [];
            var n = 0;
            while ($("#selFilters_" + n).length) {
                if ($("#selFilters_" + n).val() != "") {
                    arr.push({ text: $("#selFilters_" + n + " option:selected").text(), filter: $("#selFilters_" + n).val(), not: $("#cbNotFilters_" + n).is(":checked") ? "Y" : "" });
                }
                n += 1;
            }
            var bld = "";
            //Filterbuild=Not0=1  - Filterbuild is for the dsp functions (only passing Tier at this time)
            var filterbuild = "Filterbuild=";
            var first = true;
            var firstfilter = true;

            for (var i in arr) {
                if (!first) {
                    bld += "&";
                }
                first = false;
                bld += "Filter" + i + "=" + arr[i].filter + "&Not" + i + "=" + arr[i].not;
                if (true) { //Now works for any single filter.  (arr[i].text.indexOf("Tier") >= 0) {
                    if (!firstfilter) {
                        filterbuild += "~";
                    }
                    firstbuild = false;
                    if (arr[i].not != "Y") {
                        filterbuild += "Filter" + i + "=" + arr[i].filter;
                    }
                    else {
                        filterbuild += "Not" + i + "=" + arr[i].filter;
                    }
                }
            }
            if (!first) {
                bld += "&";
            }
            first = false;
            bld += filterbuild;

            ko.postbox.publish("FILTER_JSON", arr);
            ko.postbox.publish("FILTER_PARAMS", bld);
            if (o.format == "json") {
                return arr;
            }
            else if (o.format == "param") {
                return bld;
            }
        }


        if (o.action == "init") {
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "settings", cmd: "filters.getlist" },
                dataType: "json", cache: false, error: a$.ajaxerror, success: loadedFilters
            });
            function loadedFilters(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    filters = json.filters;
                    ko.postbox.publish("FILTERS", filters);
                    loadsel(0);
                }
            }
            newline(0);
        }
        if (o.action == "retrieve") {
            return retrieve();
        }
    };
} (jQuery));