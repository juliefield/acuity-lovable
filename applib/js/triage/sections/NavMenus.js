/************
appApmNavMenus - Navigation Menus
2.0.1 - Moved scheme to the right and resized (to look something like Chrome)
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    function init() {
        bindOpen();
        $("#nav3linkhelp").unbind("click").bind("click", function () {
            $(".nav3-linkhelp").css("height", "500px").css("width", "500px").css("right", "500px").css("top", "200px").show().animate({ right: "50px", top: "50px", height: "160px", width: "200px" }, 800);
            $(".nav3linkhelp").hide();
            return false;
        });
    }
    function bindOpen() {
        $(".nav3-icon").unbind("click").bind("click", function () {
            $(".nav3-shadow").show();
            $(".nav3-linkhelp").hide();
            $(".nav3-wrapper").animate({ right: "0px" }, 500);
            $('.qtip.ui-tooltip').qtip('hide');
            bindClose();
        });
    }
    function bindClose() {
        $(".nav3-icon,.nav3-shadow,.nav3-close,.nav3 ul li a").unbind("click").bind("click", function () {
            closeSide();
        });
    }
    $(".nav3-close2").unbind("click").bind("click", function () {
        $(".nav3-linkhelp").hide();
    });

    function closeSide() {
        $(".nav3-shadow").hide();
        $(".nav3-linkhelp").hide();
        $(".nav3-wrapper").animate({ right: "-500px" }, 500);
        bindOpen();
    }

    // global variables
    window.appApmNavMenus = {
        init: init,
        closeSide: closeSide
    };
})();

