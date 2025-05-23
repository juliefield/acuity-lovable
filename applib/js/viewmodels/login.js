/* global userProfile, a$ */

//TODO: Put login field validation here.
//TODO: Put actual login code here.
//TODO: Is there a standard way to re-use viewmodels across projects?  Or any kind of javascript for that matter?

// Login view - can probably validate using knockout if we want to here too.
function LoginViewModel(o) {
    var self = this;
    self.newloginusername = ko.observable("");
    self.newloginpassword = ko.observable("");

    $('.err-icon').unbind().bind("click", function() {
        if ($(".err-container").first().is(":visible")) {
            $(".err-container").hide();
        } else {
            $(".err-container").show();
        }
    });
    $('.err-hide').unbind().bind("click", function() {
        $(".err-container").hide();
        $(".err-icon").hide();
    });
    $("#errsubmit").unbind().bind("click", function() {
        a$.submiterror($("#errinput").val());
        $(".err-container").hide();
        $(".err-icon").hide();
    });


    doLogin = function() {
        var product = "Acuity";
        if (a$.validateform({
                formid: 'loginForm',
                errdiv: '.login-validation'
            })) {

            a$.ajax({
                type: "GET",
                async: false,
                data: {
                    cmd: "loginkey",
                    username: self.newloginusername(),
                    product: product
                },
                dataType: "json",
                cache: false,
                service: "JScript",
                success: gotkey,
                error: a$.ajaxerror
            });

            function gotkey(json) {
                if (a$.jsonerror(json)) {
                    $.cookie("uid", "");
                    $.cookie("username", "");
                    $.cookie("TP1Username", "");
                    $(".login-validation").html(json.msg).show();
                } else {
                    //REFERENCE:,testobject:{id:1,val:"a"},testarray:[{ id: 1, name: "amit" }, { id: 2, name: "ankit" }]
                    var psw = self.newloginpassword();
                    var cypher = a$.encypher(psw, json.pkey);

                    a$.ajax({
                        type: "GET",
                        async: false,
                        data: {
                            cmd: "login",
                            username: self.newloginusername(),
                            pcypher: cypher,
                            product: product
                        },
                        dataType: "json",
                        cache: false,
                        service: "JScript",
                        error: a$.ajaxerror,
                        success: loaded
                    });

                    function loaded(json) {
                        if (a$.jsonerror(json)) {
                            $.cookie("uid", "");
                            $.cookie("username", "");
                            $.cookie("TP1Username", "");
                            $(".login-validation").html(json.msg).show();
                        } else {
                            var myguid = json.uid;
                            $.cookie("uid", myguid);
                            $.cookie("username", self.newloginusername());
                            if (a$.exists(json.role)) {
                                $.cookie("role", json.role);
                                $.cookie("TP1Role", json.role);
                            } else {
                                $.cookie("role", "");
                                $.cookie("TP1Role", "");
                            }
                            if (o.reload) {
                                location.reload(true); //This makes the most sense.  Otherwise, you have to explicitly clean up in every app for the possibility of login change.
                            }
                        }
                        if (showCredentials(true)) {
                            o.launch();
                        }
                    }
                }
            }

        }
    };
    closeLogin = function() {
        $.cookie("uid", "");
        $.cookie("username", "");
        showCredentials(false);
    };
    //Complete bypass test
    //$.cookie("username", "");
    //$.cookie("username", "jeffgack");

    showCredentials = function(modal_if_not_logged_in) {
        $(".login-welcome").show();
        if (($.cookie("username") !== null) && ($.cookie("username") !== "")) {
            $(".login-form,.auth-hide,.login-notloggedin").hide();
            $(".login-username").html($.cookie("username"));
            $(".login-loggedin,.auth-show").show();
            $("#loginModal").modal("hide");
            return true;
        } else {
            $(".login-notloggedin,.auth-hide").show();
            $(".login-loggedin,.auth-show").hide();
            if (modal_if_not_logged_in) {
                $("#loginModal").modal("show");
            }
            return false;
        }
    }
    if (showCredentials(true)) {
        o.launch();
    }
}
