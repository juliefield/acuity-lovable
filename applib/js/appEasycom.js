(function () {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    function init() {
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "editor",
                cmd: "loadEasycomMessages",
                role: $.cookie("TP1Role")
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) { } else {
                $(".ec-dismiss").unbind().bind("click", function () {
                    $(this).parent().hide();
                });
                for (var i in json.messages) {
                    var ms = json.messages[i];
                    //alert("debug:message - position: " + ms.position + ", bgcolor: " + ms.backgroundColor + ", textcolor: " + ms.textColor + ", message: " + ms.message);
                    var sel = $(".ec-loc-" + ms.position).eq(0);
                    if (!($(sel).hasClass("ec-message-override"))) {
                        $(".ec-loc-" + ms.position + " .ec-message").html(ms.message);
                    }
                    if (ms.position == "notification") {
                        $(".ec-loc-" + ms.position).css("background-color", ms.backgroundColor).css("color", ms.textColor).show();
                        $(".ec-loc-" + ms.position).css("right", "0px").css("bottom", "-300px").animate({
                            right: "0px",
                            bottom: "0px"
                        }, 3500, function () { }
                        );
                        //MAKEDEV
                        $(document).bind("mouseup", function (e) {
                            var container = $(".ec-loc-notification");
                            if (!container.is(e.target) && container.has(e.target).length === 0) {
                                $(".ec")
                                container.animate({ bottom: "-500px" }, 3500, function () { container.hide(); });
                                $(document).unbind("mouseup");
                            }
                        });
                    }
                    else {
                        //This might be messing up Julie's panel on notifications, so bypassing for that panel for now.
                        $(".ec-loc-" + ms.position).css("background-color", ms.backgroundColor).css("color", ms.textColor).show();
                    }
                }
            }
        }
    }

    // global variables
    window.appEasycom = {
        init: init
    };

})();