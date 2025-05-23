
/************
appTask - The AJAX-enabled Task Manager (Product Manager, etc.)
************/
(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    //private vars
    var tsk = new Array();
    tsk[0] = {
        id: 1,
        parent: 0,
        txt: "First Task",
        typ: "goal",  //goal, milestone, activity, note, task, appointment
        priority: 5,
        datedue: "",
        timedue: "",  //If both a date and a time, it's an appointment.
        owner: 'jeffg',
        indent: -1 //Filled in by an initialization task.
    };
    tsk[1] = {
        id: 2,
        parent: 1,
        txt: "First Indented Task",
        typ: "milestone",  //goal, milestone, activity, note, task, appointment
        priority: 5,
        datedue: "",
        timedue: "",  //If both a date and a time, it's an appointment.
        owner: 'jeffg',
        indent: -1 //Filled in by an initialization task.
    };
    tsk[2] = {
        id: 3,
        parent: 1,
        txt: "Second Indented Task",
        typ: "milestone",  //goal, milestone, activity, note, task, appointment
        priority: 5,
        datedue: "",
        timedue: "",  //If both a date and a time, it's an appointment.
        owner: 'jeffg',
        indent: -1 //Filled in by an initialization task.
    };

    //task index by id
    function tskxid(id) {
        for (var i in tsk) {
            if (tsk[i].id == id) return i;
        }
        alert("ERROR: Task Index Not Found (Contact Tech Services)");
    }

    var wysiwygOptions = {
        autoGrow: true,
        controls: {
            bold: { visible: true },
            italic: { visible: true },
            underline: { visible: true },
            strikeThrough: { visible: true },

            justifyLeft: { visible: false },
            justifyCenter: { visible: false },
            justifyRight: { visible: false },
            justifyFull: { visible: false },

            indent: { visible: false },
            outdent: { visible: false },

            subscript: { visible: false },
            superscript: { visible: false },

            undo: { visible: true },
            redo: { visible: true },

            insertOrderedList: { visible: true },
            insertUnorderedList: { visible: true },
            insertHorizontalRule: { visible: true },

            h1: { visible: false },
            h2: { visible: false },
            h3: { visible: false },
            /*
            h4: {
            visible: true,
            className: 'h4',
            command: ($.browser.msie || $.browser.safari) ? 'formatBlock' : 'heading',
            arguments: ($.browser.msie || $.browser.safari) ? '<h4>' : 'h4',
            tags: ['h4'],
            tooltip: 'Header 4'
            },
            h5: {
            visible: true,
            className: 'h5',
            command: ($.browser.msie || $.browser.safari) ? 'formatBlock' : 'heading',
            arguments: ($.browser.msie || $.browser.safari) ? '<h5>' : 'h5',
            tags: ['h5'],
            tooltip: 'Header 5'
            },
            h6: {
            visible: true,
            className: 'h6',
            command: ($.browser.msie || $.browser.safari) ? 'formatBlock' : 'heading',
            arguments: ($.browser.msie || $.browser.safari) ? '<h6>' : 'h6',
            tags: ['h6'],
            tooltip: 'Header 6'
            },
            */

            cut: { visible: false },
            copy: { visible: false },
            paste: { visible: false },
            html: { visible: true },
            increaseFontSize: { visible: true },
            decreaseFontSize: { visible: true },
            exam_html: {
                exec: function () {
                    this.insertHtml('<abbr title="exam">Jam</abbr>');
                    return true;
                },
                visible: true
            }
        },
        events: {
            click: function (event) {
                if ($("#click-inform:checked").length > 0) {
                    event.preventDefault();
                    taskmenusetup(editme);
                    //alert("You have clicked jWysiwyg content!");
                }
            }
        }
    }

    function init() {
        //TODO: Read the tasks from the database
        //DONE: Set the proper indentations.
        for (var i in tsk) if (tsk[i].parent == 0) tsk[i].indent = 0;
        var f1;
        do {
            f1 = false;
            for (var i in tsk) {
                if (tsk[i].indent < 0) {
                    if (tsk[tskxid(tsk[i].parent)].indent < 0) {
                        f1 = true;
                    }
                    else {
                        tsk[i].indent = tsk[tskxid(tsk[i].parent)].indent + 1;
                    }
                }
            }
        } while (f1);

        for (var i in tsk) {
            $(".tasklist").append('<div class="task" id="task_' + tsk[i].id + '" style="margin-left:' + (10 + (tsk[i].indent * 20)) + 'px">' + tsk[i].txt + '</div>');
        }
        $(".task").click(function () { taskmenusetup(this); });
        $(".ui-icon-gear").click(function () { edittaskcurrent(); });
        $('#wysdiv').css("display", "none");
    };

    var currentme = null;
    var editme = null;

    function edittaskcurrent() {
        edittask(currentme);
    };

    function edittask(me) {
        var ed;
        try {
            $('#wysiwyg').wysiwyg("removeFormat"); 
        }
        catch (err) { }
        if (me == editme) {
            //alert("closing...");
            ed = $('#wysiwyg').html();
            $('#wysdiv').css("display", "none");
            $('#wysdiv').appendTo('#wyspark');
            $(editme).html(ed);
            editme = null;
            return;
        }
        var idar = me.id.split("_");
        //alert("here I am editing a task, id=" + idar[1]);
        var id = parseInt(idar[1]);
        var ix = tskxid(id);

        if (editme != null) {
            ed = $('#wysiwyg').html();
        }
        //firefox test
        $('#wysdiv').html('<textarea id="wysiwyg">Empty Text Area</textarea>');
        //
        var w = (($(window).width() - $(me).offset().left) - 5);
        //$('#wysiwyg').css("width", w + 'px');
        //alert("debug: wdth: " + w);
        $('#wysdiv').css("display", "");
        $('#wysdiv').css("width", w + 'px');
        $('#wysiwyg').css("width", w + 'px');
        $('.wysiwyg').css("width", w + 'px');
        $('.wysiwyg frame').css("width", w + 'px');
        var ct = $(me).html();
        //
        //Firefox Test
        //
        $('#wysiwyg').html(ct);
        //
        $('#wysiwyg').wysiwyg(wysiwygOptions);
        //alert("debug: content: " + $(me).html());
        $(".task").unbind('dblclick');
        $(me).html("");
        $('#wysdiv').appendTo(me);
        //
        //WORKS IN IE
        //$('#wysiwyg').wysiwyg("setContent", ct);
        //
        if (editme != null) {
            $(editme).html(ed);
        }
        editme = me;
        $('div.wysiwyg ul.toolbar').addClass('ui-state-highlight');
        taskmenusetup(editme);
    };

    function taskmenusetup(me) {
        $('.ui-state-highlight').removeClass('ui-state-highlight');
        $(me).addClass('ui-state-highlight');
        $(".hangingicons").css("top", ($(me).offset().top - $(".tasklist").offset().top) + 'px');
        currentme = me;
        $(".hangingicons").css("display", "");
        $(".task").unbind('dblclick');
        var setdbl = false;
        if (editme != null) {
            if (currentme != editme) {
                setdbl = true;
            }
        }
        else {
            setdbl = true;
        }
        if (setdbl) $(me).dblclick(function () { edittask(me); });

    };

    // utilities
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } }

    function isIE() {
        return /msie/i.test(navigator.userAgent) && !/opera/i.test(navigator.userAgent);
    }


    // global variables
    window.appTask = {
        dumpObj: dumpObj,
        init: init
    };
    function IsObject(obj) {
        return obj ? true : false;
    }
})();

