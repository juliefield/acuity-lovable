/************
appApmSettings - Settings
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var KILLPROP = false;

    function init(o) {
        //appApmSettings.init({ id: "AdvancedNotifications", shadow: "StgNotifications", ui: "slider" });
        if (o.shadow) {
            //Note: the clone reverts to the selected entry from the original html!
            var value = $("#" + o.shadow + " select").val();
            $("#" + o.id).append($("#" + o.shadow + " select").clone().hide());
            $("#" + o.id + " select").val(value);
        }
        else {
            o.shadow = o.id;
        }
        if (o.ui == "slider") {
            var n = $("#" + o.id + " select option").length;
            if ((!o.textabove) || (o.textabove != "none")) {
                var tbclass = ""
                if (o.textabove) tbclass = "stg-textabove-" + o.textabove;
                $("#" + o.id + " select").parent().append('<div class="stg-steps ' + tbclass + '"></div>');
            }
            $("#" + o.id + " select").parent().append('<div class="' + o.shadow + ' stg-slider"></div>');
            if ((!o.textbelow) || (o.textbelow != "none")) {
                var tbclass = ""
                if (o.textbelow) tbclass = "stg-textbelow-" + o.textbelow;
                $("#" + o.id + " select").parent().append('<div class="stg-label ' + tbclass + '"></div>');
            }

            var marpx = ((100 / n) / 2.0) + "%";
            $("#" + o.id + " ." + o.shadow).css("margin-left", marpx).css("margin-right", marpx).slider({ min: 0, max: n - 1, value: $("#" + o.id + " select option:selected").index() });
            if ($("#" + o.id + " .stg-label").hasClass("stg-textbelow-value"))
                $("#" + o.id + " .stg-label").html($("#" + o.id + " select option:selected").val());
            else
                $("#" + o.id + " .stg-label").html($("#" + o.id + " select option:selected").text());
            $("#" + o.id + " select option").each(function () {
                var mv;
                if ($("#" + o.id + " .stg-steps").hasClass("stg-textabove-label"))
                    mv = $(this).text();
                else
                    mv = $(this).val();
                $("#" + o.id + " .stg-steps").append('<span style="width:' + ((100 / n) - 1) + '%;display:inline-block;text-align:center;">' + mv + '</span>');
            });
            $("#" + o.id + " ." + o.shadow).bind("slidechange", function (event, ui) {
                if (!KILLPROP) stgsettingchange(this, true);
            });
        }
        else if (o.ui == "combo") {
            $("#" + o.id + " select").show().attr("class", o.shadow + " stg-combo " + $("#" + o.id + " select").attr("class"));
            $("#" + o.id + " ." + o.shadow).bind("change", function (event, ui) {
                if (!KILLPROP) stgsettingchange(this, true);
            });
        }
        else if (o.ui == "iphoneswitch") {
            $("#" + o.id + " select").parent().append('<div class="jtoggle-wrapper"><div class="' + o.shadow + ' stg-iphoneswitch"><div class="jtoggle-shell"></div></div></div>');
            //<div class="jtoggle-wrapper"><div class="jtoggle-slider"><div class="jtoggle-shell"></div></div></div>
            stgsettingchange($("#" + o.id + " ." + o.shadow), true);
            var jtogpos = true;
            $("#" + o.id + " ." + o.shadow).bind("click", function () {
                if (!KILLPROP) {
                    var sel = $(" select", $(this).parent().parent());
                    if ($(sel).val() == "On") $(sel).val("Off");
                    else if ($(sel).val() == "Off") $(sel).val("On");
                    stgsettingchange(this, true);
                }
            });
        }
        else {
            alert("error: unknown ui type in setting " + o.id);
        }
    }

    function stgsettingchange(me, propagate) {
        var sel = me;
        var cl = $(sel).attr("class").split(" ")[0];
        while (!$(me).hasClass("stg")) me = $(me).parent();
        var id = $(me).attr("id");
        if ($(sel).hasClass("stg-slider")) {
            $("#" + id + " select :nth-child(" + ($("#" + id + " ." + cl).slider("value") + 1) + ")").attr('selected', 'selected') // To select via index
            $("#" + id + " select").trigger("change");
            if ($("#" + id + " .stg-label").hasClass("stg-textbelow-value"))
                $("#" + id + " .stg-label").html($("#" + id + " select option:selected").val());
            else
                $("#" + id + " .stg-label").html($("#" + id + " select option:selected").text());
        }
        else if ($(sel).hasClass("stg-iphoneswitch")) {
            if ($("#" + id + " select").val() == "Off") {
                if (appLib.isFirefox()) {
                    $("#" + id + " ." + cl).css({ "background-position": "-53px -28px" });
                }
                else {
                    //$("#" + id + " ." + cl).css({ "background-position": "0px -28px" }).animate({ "background-position-x": "-53" });
                    $("#" + id + " ." + cl).animate({ "background-position-x": "-53" });
                }
            }
            else {
                if (appLib.isFirefox()) {
                    $("#" + id + " ." + cl).css({ "background-position": "0px -28px" });
                }
                else {
                    //$("#" + id + " ." + cl).css({ "background-position": "-53px -28px" }).animate({ "background-position-x": "0" });
                    $("#" + id + " ." + cl).animate({ "background-position-x": "0" });
                }
            }
            $("#" + id + " select").trigger("change");
        }

        if (propagate) {
            $("." + cl).each(function () {
                var me = this;
                while (!$(me).hasClass("stg")) me = $(me).parent();
                if ($(me).attr("id") != id) {
                    KILLPROP = true;
                    if ($(this).hasClass("stg-slider")) {
                        $(this).slider("value", $("#" + id + " select option:selected").index());
                    }
                    else if ($(this).hasClass("stg-combo")) {
                        $(this).val($("#" + id + " select").val());
                    }
                    else if ($(this).hasClass("stg-iphoneswitch")) {
                        $(" select", $(this).parent().parent()).val($("#" + id + " select").val());
                    }
                    KILLPROP = false;
                    stgsettingchange(this, false)
                }
            });
        }
    }
    // global variables
    window.appApmSettings = {
        init: init
    };
})();

