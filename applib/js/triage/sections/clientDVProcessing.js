(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    function tabledv(selector, table, dvcode) {
        var dvtext = "";
        switch (dvcode) {
            case "KM2.CL.SALES.UNITS":
                /*
                var count = 0.0;
                for (var i in table) {
                count += parseFloat(table[i]["Count"]);
                }
                dvtext = 'EXAMPLE: client-side Table DV (from clientDVProcessing)';
                dvtext += '<br /><span style="color:red;">Total Count = ' + count + '</span>';
                */
                var hassplits = false;
                for (var i in table) {
                    if (a$.exists(table[i]["Split"])) {
                        hassplits = true;
                        break;
                    }
                }
                if (hassplits) {
                }
                else {
                    //dvtext = "To view totals, select a subkpi from the filters, or click on a Split bar or trend-point in a graph.";
                }
                break;
            default:
                break;
        }
        if (dvtext != "") {
            $("#tabledv_show").show();
        }
        $(selector).html(dvtext);
    }

    // global variables
    window.appDVProcessing = {
        tabledv: tabledv
    };
})();

