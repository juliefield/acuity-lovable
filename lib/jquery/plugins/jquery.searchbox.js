/************
Searchbox
************/
(function ($) {

    var sbt = null;
    var sbcnt = 0;
    var sbval = ""; //TODO: slight flaw if there are multiple boxes.
    var boxset;

    var methods = {
        init: function (json) {
            var id = this.attr('id');
            var resultsid = id + '-results';
            var tbl = "PCO";
            var fr = false;
            if (json) { if (json.resultsid) resultsid = json.resultsid; };
            if (json) { if (json.tbl) tbl = json.tbl; };
            var rclass = $("#" + resultsid).attr('class');
            if (typeof rclass === "undefined") {
                alert("plugin Searchbox: results div (id " + resultsid + ") was not found.");
                return;
            }
            if (rclass == "") {
                alert("plugin Searchbox: results div must have a class.");
                return;
            }
            if (rclass.split(" ").length > 1) {
                alert("plugin Searchbox: results div has multiple classes, please specify a 'resultsclass' on init.");
                return;
            }
            $("#" + id + " input").live('keyup', function (e) {
                if (($(this).val().trim() != "")) {
                    if ($(this).val().trim() != sbval) {
                        sbval = $(this).val().trim();
                        if (sbt != null) clearTimeout(sbt);
                        sbt = setTimeout("$('#" + id + "').Searchbox('pause','" + tbl + "','" + resultsid + "','" + rclass + "')", 1000);
                        $("#" + resultsid).html("Searching...");
                        $("#" + resultsid).css("display", "block");
                    }
                }
                else {
                    $("#" + resultsid).css("display", "none");
                }
            });
            $("#" + resultsid + " ." + rclass + "-record").live("mouseover mouseout", function (e) {
                if (e.type == "mouseover") {
                    $(this).addClass(rclass + "-hover");
                }
                else {
                    $(this).removeClass(rclass + "-hover");
                }
            });

            $("#" + resultsid + " ." + rclass + "-record").live("click", function (e) {
                var currentbox = boxset.box[parseInt($(this).children(":first").html())];
                var ff = false;
                if (json) {
                    if (json.SelectFunction) {
                        ff = true;
                        json.SelectFunction(currentbox.tbl, currentbox.idtbl);
                    }
                }
                if (!ff) {
                    alert("No SelectFunction(tbl,id) specified on init.");
                }
            });
        },
        pause: function (tbl, resultsid, rclass) {
            var id = this.attr("id");
            var urlbld = "../ajaxjson.ashx";
            sbcnt += 1;
            var databld = "searchbox=1&" + appLib.secparams();
            databld += "&tbl=" + tbl + "&sbid=" + id + "&P:sbcnt=" + sbcnt + "&sbstr=" + encodeURIComponent($("#" + id + " input").val());
            $("#debugarea").html(urlbld + "?" + databld);
            $.ajax({
                type: "GET", url: urlbld, async: true, data: databld, dataType: "json", cache: false, error: appLib.ajaxerror,
                success: searchboxJSON
            });
            function searchboxJSON(json) {
                if (json.errormessage) {
                    alert(json.msg);
                }
                else if (json.sbcnt == sbcnt) { //Returned before the next search.
                    boxset = json;
                    var bld = "";
                    var found = false;
                    if (boxset.box) {
                        for (var b in boxset.box) {
                            found = true;
                            bld += "<div class=\"" + rclass + "-record\"><span>" + b + "</span>"
                            bld += "<div class=\"" + rclass + "-hdr\">"
                            for (var hkey in boxset.box[b].header) {
                                bld += boxset.box[b].header[hkey] + " ";
                            }
                            bld += "</div>";
                            bld += "<div class=\"" + rclass + "-matches\">"
                            for (var mkey in boxset.box[b].matches) {
                                bld += mkey + " : " + boxset.box[b].matches[mkey] + "<br />";
                            }
                            bld += "</div>";
                            bld += "</div>";
                        }
                    }
                    if (!found) bld += "<div class=\"" + rclass + "-matches\">..no matches found</div>";
                    $("#" + resultsid).html(bld);
                    $("#" + resultsid).css("display", "block");
                }
            }
        }
    };

    $.fn.Searchbox = function (method) {
        // Method calling logic
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.Searchbox');
        }
    };    //Searchbox
})(jQuery);