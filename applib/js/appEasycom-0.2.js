(function () {
    if (!window.jQuery) {
        alert("This App requires jQuery");
        return;
    }
    function init() {
        //if ((a$.urlprefix() != "cox.") && (a$.urlprefix() != "ers.")) { //Allow for Cox and ERS
        //    return true; //EASYCOM DISABLED EASYCOM DISABLED EASYCOM DISABLED EASYCOM DISABLED EASYCOM DISABLED EASYCOM DISABLED
        //}

        /*
        recognition_banner({ avatar: "../applib/css/images/avatars/avatar106.png",
        to: "Pamela Dilling",
        phrase: "Great Job, Pamela! Keep up the great work you have displayed this month!",
        from: "Jeff Gack, Supervisor"
        });
        */

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "spine",
                cmd: "loadPublicRecognition",
                role: $.cookie("TP1Role")
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: pubrecloaded
        });
        function pubrecloaded(json) {
            if (a$.jsonerror(json)) { } else {
                for (var i in json.records) {
                    if (json.records[i].DisplayType == "Banner") {
                        $(".ticker-recognition").hide();
                        recognition_banner({ to: json.records[i].to, phrase: json.records[i].Phrase, from: json.records[i].from, theme: json.records[i].Theme, signature: json.records[i].Signature });
                    }
                    break; //Only do the first one for now.
                }
            }
        }

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

        function recognition_banner(o) {
            if (a$.exists(o.avatar)) $(".easycom-recognition_avatar img").attr("src", o.avatar);
            function renderrecognition() {
                if (a$.exists(o.phrase)) $(".easycom-recognition_phrase").html(o.phrase);
                var usedsignature = false;
                if (a$.exists(o.signature)) {
                    if (o.signature != "") {
                        $(".easycom-recognition_from").html(o.signature); //replace
                        usedsignature = true;
                    }
                }
                if (!usedsignature) {
                    $(".easycom-recognition_from").html("");
                    /*
                    if (a$.exists(o.from)) {
                    if (o.from != "") {
                    //o.from.split(",")[0] contains user_id of supervisor
                    $(".easycom-recognition_from").html(o.from); //TODO: Retrieve my actual name.
                    }
                    }
                    */
                }
                if (a$.exists(o.theme)) {
                    $(".easycom-recognition").attr("class", "easycom-recognition"); //Wipe out pre-existing theme class.
                    $(".easycom-recognition").addClass("ecr-theme-" + o.theme);
                }
                $(".easycom-recognition").css("right", "0px").css("bottom", "-300px").show().animate({
                    right: "0px",
                    bottom: "0px"
                }, 3500, function () { });
            }

            if (a$.exists(o.to)) {
                if (o.to == "_Team") {
                    $(".easycom-recognition_avatar-box").hide();
                    $(".easycom-recognition_avatar img").hide();
                    $(".easycom-recognition_message").css("margin-left", "100px");
                    renderrecognition();
                }
                else {
                    $(".easycom-recognition_message").css("margin-left", "");
                    a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: true,
                        data: {
                            lib: "spine",
                            cmd: "getNamesFromUserids",
                            useridlist: o.to
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: function (json) {
                            if (a$.jsonerror(json)) { } else {
                                if (o.to.toString().indexOf(",") >= 0) {
                                    $(".easycom-recognition_avatar-box").show();
                                    $(".easycom-recognition_avatar").hide();
                                }
                                else {
                                    //$(".easycom-recognition_avatar img").show().attr("src","../applib/css/images/avatars/avatar106.png"); //TODO: Retrieve their actual avatar as well.
                                    if (json.avatarfilename != "") {
                                        $(".easycom-recognition_avatar img").show().attr("src", json.avatarfilename); //TODO: Retrieve their actual avatar as well.
                                        $(".easycom-recognition_avatar").show();
                                    }
                                    else {
                                        $(".easycom-recognition_avatar").hide();

                                    }
                                    $(".easycom-recognition_avatar-box").show();
                                }
                                var bld = "";
                                for (var n in json.namelist) {
                                    if (bld != "") bld += "<br />";
                                    bld += json.namelist[n];
                                }
                                $(".easycom-recognition_to").html(bld);

                                renderrecognition();
                            }
                        }
                    });

                }

            }

        }

        function recognition_ticker(o) {
            $(".ticker-recognition").hide();

            var bld = o.to + " : " + o.phrase + " - " + o.from;

            var screensize = document.documentElement.clientWidth;

            $(".ticker-content").html(bld);
            $(".ticker-content").css("left", screensize);
            $(".ticker-recognition").show();
            $(".ticker-content").animate({
                left: -200
            }, 15000, "linear", function () {
                $(".ticker-recognition").hide();
            }
            );

        }

        function recognition_prevcheck() {
            if ($("#ecr-preview").html() == "Yes") {
                $("#ecr-preview").html("");
                switch ($("#ecr-deliverytype").html()) {
                    case "Ticker":
                        $(".easycom-recognition").hide();
                        recognition_ticker({ to: $("#ecr-to").html(), phrase: $("#ecr-phrase").html(), from: $("#ecr-from").html() });
                        break;
                    case "Banner":
                        $(".ticker-recognition").hide();
                        recognition_banner({ to: $("#ecr-to").html(), phrase: $("#ecr-phrase").html(), from: $("#ecr-from").html(), theme: $("#ecr-theme").html(), signature: $("#ecr-signature").html() });
                        break;
                    default:
                        alert("Unknown Preview Type: " + $("#ecr-deliverytype").html());
                        break;
                }
            }
            setTimeout(recognition_prevcheck, 1000);
        }
        setTimeout(recognition_prevcheck, 1000);

        /* TEST
        setTimeout(function () {
        a$.WindowTop().document.getElementById('ecr-to').innerHTML = "Tammy Spring";
        a$.WindowTop().document.getElementById('ecr-phrase').innerHTML = "Nice work this month, Tammy!";
        a$.WindowTop().document.getElementById('ecr-from').innerHTML = "Brian Gill, Supervisor";
        a$.WindowTop().document.getElementById('ecr-preview').innerHTML = "Yes";
        }, 10000);
        */
        //
    }

    // global variables
    window.appEasycom = {
        init: init
    };

})();