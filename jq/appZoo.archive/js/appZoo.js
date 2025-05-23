/************
Zoo - Classic Zoo application for mobile.
1. This version relies on building the next page at the time a response is clicked.
2. To work with the ui mechanism, 
See the "anticipatory" version for an example of loading surrounding pages.
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;
    var currentid;

    //logic
    var node = new Array();
    var animalcnt = 0;

    //will add trueindex and falseindex at the proper time.

    var newanimal;
    var mode = 0; //0=asking yes or no about current

    $(document).ready(function () {
        reinit();
        fillpage(0); //No need to make it, it already exists.
    });

    function reinit() {
        var foundstorage = false;
        if (supports_html5_storage()) {
            if (islocal("0.q")) {
                foundstorage = true;
                while (islocal(animalcnt + ".q")) {
                    node[animalcnt] = new Object;
                    node[animalcnt].q = localStorage[animalcnt + ".q"];
                    node[animalcnt].isq = localStorage[animalcnt + ".isq"] == "true";
                    if (islocal(animalcnt + ".trueindex")) {
                        node[animalcnt].trueindex = parseInt(localStorage[animalcnt + ".trueindex"]);
                    }
                    if (islocal(animalcnt + ".falseindex")) {
                        node[animalcnt].falseindex = parseInt(localStorage[animalcnt + ".falseindex"]);
                    }
                    animalcnt += 1;
                }
            }
            //var foo = localStorage["testkey"];
            //alert(foo);
            //localStorage.removeItem("testkey");
            //localStorage["testkey"] = "first attempt";
        }
        if (!foundstorage) {
            node[0] = new Object();
            node[0].q = "German Shepherd";
            node[0].isq = false;
            addlocal(0);
            animalcnt = 1;
        }
    }

    function islocal(str) {
        return (!(typeof localStorage[str] === 'undefined')) && (localStorage[str] != null);
    }

    function addlocal(cnt) {
        addlpart(cnt, "q");
        addlpart(cnt, "isq");
        addlpart(cnt, "trueindex");
        addlpart(cnt, "falseindex");
    }

    function addlpart(cnt, s) {
        if (!(typeof node[cnt][s] === 'undefined')) {
            localStorage[cnt + "." + s] = node[cnt][s];
        }
    }

    function fillpage(ix) {
        makepage(ix);
        $("#page" + ix + "question").html(correctquestion(ix));
        correctui(ix);
        $("#playagainprompt1").html("Hurray, I guessed your animal!");
        $("#playagainprompt2").html("&nbsp;");
    }

    function makepage(ix) {
        if (!document.getElementById("page" + ix)) {
            initnode(ix);
            var bld = "";
            bld = '<div data-role="page" id="page' + ix + '" data-theme="b" data-url="page' + ix + '" data-add-back-btn="true" >';
            bld += '<div data-role="header" data-theme="b"><h1>Zoo</h1><a href="#options" data-icon="gear" onclick="appZoo.optionset(' + ix + ');" class="ui-btn-right">&nbsp;</a></div>';
            bld += '<div data-role="content">';
            bld += '<h3 id="page' + ix + 'question"></h3>';
            bld += '<div id="page' + ix + 'ui">'
            bld += '<ul data-role="listview">';
            bld += '<li data-theme="c" ><a id="page' + ix + 'yes" onclick="" href="">Yes</a></li>';
            bld += '<li data-theme="c"><a id="page' + ix + 'no" onclick="" href="">No</a></li>';
            bld += '</ul>';
            bld += '</div>';
            bld += '</div>';
            bld += '</div>';
            $('#page0').after(bld);
        }
    }

    function correctquestion(ix) {
        if (!node[ix].isq) {
            var bld = "Is your animal a" + anvl(node[ix].q) + "?";
            return bld;
        }
        else {
            return node[ix].q + "?";
        }
    }

    function anvl(an) {
        var bld = "";
        if (an.length > 0) {
            if (/[aeiou]/.test(an.substr(0, 1).toLowerCase())) {
                bld += "n";
            }
        }
        bld += " " + an;
        return bld;
    }

    function correctui(ix) {
        var yesno = true;
        var bld = "";
        if (!node[ix].isq) {
            $("#page" + ix + "yes").attr("href", "#playagain");
            $("#page" + ix + "no").attr("onclick", "appZoo.notan(" + ix + ");");
            $("#page" + ix + "no").attr("href", "#newanimal");
            $("#playagainprompt1").html("Hurray, I guessed your animal!");
            $("#playagainprompt2").html("&nbsp;");
        }
        else {
            $("#page" + ix + "yes").attr("onclick", "appZoo.fillpage(" + node[ix].trueindex + ");");
            $("#page" + ix + "yes").attr("href", "#page" + node[ix].trueindex);
            $("#page" + ix + "no").attr("onclick", "appZoo.fillpage(" + node[ix].falseindex + ");");
            $("#page" + ix + "no").attr("href", "#page" + node[ix].falseindex);
        }
        return bld;
    }

    var notanix = 0;
    var newanimalix = 0;

    function notan(ix) {
        notanix = ix;
        return true;
    }

    function newanimal(ix) {
        initnode(animalcnt);
        newanimalix = animalcnt++;
        node[newanimalix].q = $("#newanimalquestion").val();
        $("#newanimalquestion").val("");
        node[newanimalix].isq = false;
        $("#newquestionprompt1").html("A" + anvl(node[newanimalix].q) + "! I should have known!");
        $("#newquestionprompt2").html("Hey, so I can get it next time, can you type in a question that is TRUE for a" + anvl(node[newanimalix].q) + ",  but is NOT TRUE for a" + anvl(node[notanix].q) + "?");
        $("#newquestionquestion").val("");
        addlocal(newanimalix);
    }

    function newquestion(ix) {
        initnode(animalcnt);
        var nix = animalcnt++;
        node[nix].q = node[notanix].q;
        node[notanix].q = $("#newquestionquestion").val();
        node[notanix].isq = true;
        node[notanix].trueindex = newanimalix; ;
        node[notanix].falseindex = nix;
        fillpage(0);
        $("#playagainprompt1").html("Thank You!");
        $("#playagainprompt2").html("..for teaching me about a" + anvl(node[newanimalix].q) + ".");
        addlocal(nix);
        addlocal(notanix);
    }

    function optionset(ix) {
        if (node[ix].isq) {
            $("#lblqora").html("Edit question:");
        }
        else {
            $("#lblqora").html("Edit animal:");
        }
        $("#editqora").val(node[ix].q);
        $("#editqora").attr("onchange", "appZoo.changeqora(" + ix + ");");

        if (node[ix].trueindex || node[ix].falseindex) {
            $("#showswap").css("display", "block");
            $("#optyes").html(optlst(node[ix].trueindex));
            $("#optno").html(optlst(node[ix].falseindex));
            $("#optswap").attr("onclick", "appZoo.optswap(" + ix + ");");
        }
        else {
            $("#showswap").css("display", "none");
        }
        return true;
    }

    var asllst;
    var aslcnt;

    function optlst(ix) {
        asllst = "";
        aslcnt = 0;
        optr(ix);
        return asllst;
    }

    function optr(ix) {
        if (node[ix].isq) {
            if (node[ix].trueindex) optr(node[ix].trueindex);
            if (node[ix].falseindex) optr(node[ix].falseindex);
        }
        else {
            if (aslcnt > 0) asllst += ",";
            aslcnt++;
            asllst += node[ix].q;
        }
    }

    function optswap(ix) {
        var hold = node[ix].trueindex;
        node[ix].trueindex = node[ix].falseindex;
        node[ix].falseindex = hold;
        addlocal(ix);
        fillpage(ix);
        optionset(ix);
    }
    function changeqora(ix) {
        node[ix].q = $("#editqora").val();
        addlocal(ix);
        $("#page" + ix + "question").html(correctquestion(ix));
    }

    function initnode(ix) {
        if (!node[ix]) {
            node[ix] = new Object();
            node[ix].q = "";
            node[ix].isq = false;
        }
    }

    function supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    // global variables
    window.appZoo = {
        notan: notan,
        newanimal: newanimal,
        newquestion: newquestion,
        fillpage: fillpage,
        optionset: optionset,
        changeqora: changeqora,
        optswap: optswap
    }

})();

