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
    node[0] = new Object();
    node[0].q = "dog";
    node[0].isq = false;
    var animalcnt = 1;

    //will add trueindex and falseindex at the proper time.

    var newanimal;
    var mode = 0; //0=asking yes or no about current


    $(document).ready(function () {
        fillpage(0); //No need to make it, it already exists.
    });

    function fillpage(ix) {
        makepage(ix);
        $("#page" + ix + "question").html(correctquestion(ix));
        $("#page" + ix + "ui").html(correctui(ix));
        $("#playagainprompt1").html("Hurray, I guessed your animal!");
        $("#playagainprompt2").html("&nbsp;");

    };

    function makepage(ix) {
        if (!document.getElementById("page" + ix)) {
            initnode(ix);
            var bld = "";
            bld = '<div data-role="page" id="page' + ix + '" data-theme="b" data-url="page' + ix + '" >';
            bld += '<div data-role="header" data-theme="b"><h1>Zoo</h1></div>';
            bld += '<div data-role="content">';
            bld += '<h3 id="page' + ix + 'question"></h3>';
            bld += '<div id="page' + ix + 'ui"></div>';
            bld += '</div>';
            bld += '</div>';
            $('#page0').after(bld);
        }
    }

    function correctquestion(ix) {
        if (!node[ix].isq) {
            if (node[ix].q != "") {
                return "Is your animal a " + node[ix].q + "?";
            }
            else {
                return "hmmm.  I give up.  What was your animal?";
            }
        }
        else {
            return node[ix].q + "?";
        }
    }

    function correctui(ix) {
        var yesno = true;
        var bld = "";
        if (!node[ix].isq) {
            if (node[ix].q != "") {
                bld = '<ul data-role="listview">';
                bld += '<li data-theme="c" ><a href="#playagain">Yes</a></li>';
                bld += '<li data-theme="c"><a onclick="appZoo.notan(';
                bld += "" + ix + ");appZoo.fillpage(" + animalcnt + ");";
                bld += '" href="#page' + animalcnt + '">No</a></li>';
                bld += '</ul>';
                $("#playagainprompt1").html("Hurray, I guessed your animal!");
                $("#playagainprompt2").html("&nbsp;");
            }
            else {
                bld = '<div data-role="fieldcontain">';
                bld += '<input type="text" name="name" id="animalname' + ix + '" value=""  />';
                bld += '</div>';
                bld += '<a onclick="appZoo.newanimal(';
                bld += "'" + ix + "'";
                bld += ');" href="#newquestion" data-role="button">Submit</a>';
            }
        }
        else {
            bld = '<ul data-role="listview">';
            bld += '<li data-theme="c"><a onclick="appZoo.fillpage(';
            bld += "" + node[ix].trueindex + ");";
            bld += '" href="#page' + node[ix].trueindex + '">Yes</a></li>';
            bld += '<li data-theme="c"><a onclick="appZoo.fillpage(';
            bld += "" + node[ix].falseindex + ");";
            bld += '" href="#page' + node[ix].falseindex + '">No</a></li>';
            bld += '</ul>';
        }
        return bld;
    };

    var notanix = 0;
    var newanimalix = 0;
    function notan(ix) {
        notanix = ix;
        return true;
    }
    function newanimal(ix) {
        initnode(animalcnt);
        newanimalix = animalcnt++;
        node[newanimalix].q = $("#animalname" + ix).val();
        node[newanimalix].isq = false;
        $("#newquestionprompt1").html("A " + node[newanimalix].q + "! I should have known!");
        $("#newquestionprompt2").html("Hey, so I can get it next time, can you type in a question that is TRUE for a " + node[newanimalix].q + ",  but is NOT TRUE for a " + node[notanix].q + "?");
        $("#newquestionquestion").val("");
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
        $("#playagainprompt2").html("..for teaching me about a " + node[newanimalix].q + ".");
    }

    function initnode(ix) {
        if (!node[ix]) {
            node[ix] = new Object();
            node[ix].q = "";
            node[ix].isq = false;
        }
    }
    // global variables
    window.appZoo = {
        notan: notan,
        newanimal: newanimal,
        newquestion: newquestion,
        fillpage: fillpage
    };
})();

