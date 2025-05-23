/************
appChores - Allowance App
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;
    if (!$.jQTouch) { alert("This App requires jQTouch"); return; }

    var jQT = new $.jQTouch({
        //icon: 'needanicon.png',
        //icon4: 'needanicon4.png',
        addGlossToIcon: false,
        startupScreen: 'chores_startup.png',
        statusBar: 'gray',
        preloadImages: [
                    'jqtouch/themes/apple/img/activeButton.png',
                    'jqtouch/themes/apple/img/back_button.png',
                    'jqtouch/themes/apple/img/back_button_clicked.png',
                    'jqtouch/themes/apple/img/button.png',
                    'jqtouch/themes/apple/img/button_clicked.png',
                    'jqtouch/themes/apple/img/grayButton.png',
                    'jqtouch/themes/apple/img/greenButton.png',
                    'jqtouch/themes/apple/img/loading.gif'
                    ]
    });

    var currentid;
    $(document).ready(function () {
        $("#yesno_intro").html("Zoo - A GREAT GAME!  Think of an animal and I will guess what it is!");
        $("#yesno_question").html("Does your animal bark??");
    });
    function clickyes() {
        alert("you clicked yes");
        return true;
    };
    function clickno() {
        alert("you clicked no");
        return true;
    };
    $("#liyes").click(function () {
        alert("liyes clicked");
    });

    // global variables
    window.appZoo = {
        clickyes: clickyes,
        clickno: clickno
    };
})();

