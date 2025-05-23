// Prerequisites:  applib, chosen, ko.postbox

(function ($) {

    var myvar = null; //TODO

    $.fn.TODO: = function (o) {

        var me = this;

        if (o.action == "init") {
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "TODO:", cmd: "TODO:" },
                dataType: "json", cache: false, error: a$.ajaxerror, success: loadedInit
            });
            function loadedInit(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    myvar = json.filters;
                    ko.postbox.publish("TODO:", myvar);
                    loadsel(0);
                }
            }
        }
    };
} (jQuery));