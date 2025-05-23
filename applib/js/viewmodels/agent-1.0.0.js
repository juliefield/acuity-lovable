//Fan 1.0 - Initial A-Game with Multiple Themes
//ko.components.register

//function NOTHINGNESS('component-fan', {
//    template: { element: $(".fan-wrapper")[0] },
//    viewmodel: function () {

function AgentViewModel(o) {
    var self = this;
    self.oRole = ko.observable($.cookie("role"));
    self.oKBRole = ko.observable($.cookie("role"));
    self.oCSR = ko.observable("");
    self.oTeam = ko.observable("0");
    self.oUid = ko.observable("");
    self.oUid($.cookie("username"));
    self.allow_found = ko.observable(false);
    self.outline = ko.observable(false);

    ko.postbox.subscribe("CSR", function(newValue) {});
    ko.postbox.subscribe("Location", function(newValue) {});
    ko.postbox.subscribe("Role", function(newValue) {
        oRole(newValue);
        oKBRole(newValue);
    });
    ko.postbox.subscribe("ResizeWindow", function() {
        var y = $(window).height() - $(".agent-wrapper:first").offset().top;
        //y += 30; //Move the scroll bar out of view at the bottom.  TODO: This is really bad in a view model, but is set to
        $(".agent-wrapper").css("height", y + "px");
        //$(".fanDebug").html($(".fanDebug").html() + '/' + y);
    });
    self.servicingapp = ko.observable("");
    self.nodeid = ko.observable(0);
    self.nodeparent = ko.observable(0);
    self.subject = ko.observable("");
    self.body = ko.observable("");
    self.children = ko.observable({});
    self.addingChild = ko.observable("");
    self.childSubject = ko.observable("");

    self.editing = ko.observable(false);
    self.editSubject = ko.observable("");
    self.editBody = ko.observable("");
    self.showdeleted = ko.observable(false);

    self.bodyid = ko.observable("");

    self.helpContent = ko.observable("");

    self.hideCodaHeader = ko.observable(false);

    var otree = {
        name: "Root",
        id: 0,
        children: [{
            name: "General Acuity",
            id: 1,
            children: [{
                name: "GettingStarted",
                id: 2
            }, {
                name: "Logging In",
                id: 3
            }, {
                name: "DashboardFilters",
                id: 4
            }]
        }, {
            name: "Acuity User Guides",
            id: 5,
            children: [{
                    name: "Supervisor Guide",
                    id: 6,
                    children: [{
                        name: "Processing Attrition",
                        id: 7
                    }]
                },
                {
                    name: "CSR Guide",
                    id: 8,
                    children: [{
                        name: "An item in the CSR Guide",
                        id: 9
                    }]
                }
            ]
        }]
    }

    var savedparent = -1;
    var helpEditor = null;
    var delay;

    function bind(json) {
        nodeid(json.node.id);
        if (savedparent >= 0) {
            nodeparent(savedparent);
        } else {
            nodeparent(json.node.parent);
        }
        allow_found(json.node.allow_found);
        subject(json.node.subject);
        body(json.node.body);
        addingChild(false);
        childSubject("");
        children(json.node.children);
        bodyid(json.node.bodyid);
        servicingapp(json.node.servicingapp);
        helpContent(json.node.helpContent);
        hideCodaHeader(json.node.hideCodaHeader);
    }

    self.cancelEdit = function() {
        editing(false);
        if (servicingapp() == "Help") {}
    }

    var spacer = '<li class="o-sep">------</li>';

    function make_ul(id, children, root) {
        var bld = '<ul pid="' + id + '"';
        if (root) bld += ' class="o-root"';
        bld += '>';
        if (a$.exists(children)) {
            for (var i in children) {
                if (editing()) bld += spacer;
                bld += '<li class="o-drag" nid="' + children[i].id + '">' + children[i].name + '</li>';
                if (a$.exists(children[i].children)) {
                    bld += make_ul(children[i].id, children[i].children, false);
                }
            }
            if (children.length) {
                if (editing()) bld += spacer;
            }
        }
        bld += '</ul>';
        return bld;
    }

    function makeoutlinetree(t) {
        var bld = "<p>" + t.name + "</p>" + make_ul(t.id, t.children, true);
        $(".agent-outline").html(bld);

        if (editing()) {
            $(".o-drag").each(function() {
                $(this).draggable({
                    revert: "invalid"
                })
            });
            var dropallowed = false;
            $(".agent-outline li").each(function() {
                $(this).droppable({
                    /*hoverClass: "o-drop-hover",*/
                    over: function(event, ui) {
                        //$(this).html("---------------------OVER");
                        var pdrag = $(ui.draggable).parent().attr("pid");
                        var pdrop = $(this).parent().attr("pid");
                        dropallowed = false;

                        if (pdrag != pdrop) { //Not dropping among siblings.
                            dropallowed = true;
                            //Don't allow grabbing your own parent if you're the top child.


                            if ($(ui.draggable).index() < 2) {
                                if (pdrag == $(this).attr("nid")) dropallowed = false;
                            }
                            //Don't drop among your children or grandchildren
                            if (dropallowed) {
                                var nid = $(ui.draggable).attr("nid");
                                var ul = $(this).parent();
                                while (true) {
                                    if ($(ul).hasClass("o-root")) break;
                                    var pid = $(ul).attr("pid");
                                    if (pid == nid) {
                                        dropallowed = false;
                                        break;
                                    } else ul = $(ul).parent();
                                }
                            }
                        } else {
                            //Don't allow dropping next to yourself.
                            var ul = $(this).parent(); //Same parent for both.
                            var idrag = 0;
                            var idrop = 0;
                            var i = 0;
                            var dropsel = this;
                            $(" > li", ul).each(function() {
                                var idx = $(this).index();
                                if (idx == $(ui.draggable).index()) idrag = i;
                                if (idx == $(dropsel).index()) idrop = i;
                                i++;
                            });
                            if (Math.abs(idrag - idrop) > 1) dropallowed = true;
                        }
                        if (dropallowed) $(this).addClass("o-drop-hover");
                    },
                    out: function(event, ui) {
                        $(this).removeClass("o-drop-hover")
                    },
                    drop: function(event, ui) {
                        if (!dropallowed) {
                            //ui.draggable("cancel");
                            event.stopPropagation();
                            makeoutlinetree(otree);
                        } else {
                            var nid = $(ui.draggable).attr("nid");
                            var source = $(ui.draggable).html(); //drag li

                            var parentid = 0;

                            var parent = "";

                            var afterid = 0;
                            var after = "";

                            if ($(this).hasClass("o-sep")) {
                                if ($(this).index() != 0) {
                                    var asel = $(this).parent().children().eq($(this).index() - 1);
                                    afterid = $(asel).attr("nid");
                                    var after = $(asel).html();
                                }
                                parentid = $(this).parent().attr("pid");
                                parent = $(this).parent().parent().children().eq($(this).parent().index() - 1).html();
                            } else {
                                parentid = $(this).attr("nid");
                                parent = $(this).html();
                            }
                            if (afterid != 0) {
                                alert("debug: changing parent of " + source + "(" + nid + ") to " + parent + "(" + parentid + ") and after " + after + "(" + afterid + ")")
                            } else {
                                alert("debug: changing parent of " + source + "(" + nid + ") to " + parent + "(" + parentid + "), top (order=0)")
                            }
                            makeoutlinetree(otree);
                        }
                        //TODO: Color the moved item red.
                        //TODO: Redraw the tree.
                    }
                });
            });
        }

    }
    self.viewOutline = function(id) {
        //Testing
        $(".agent-outline").html("..loading..");
        if (false) {
            makeoutlinetree(otree);
            outline(true);
            return;
        }

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "kb",
                cmd: "getnodetree",
                nodeid: id,
                role: oKBRole(),
                showdeleted: showdeleted()
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: gotOutline //TODO: See if you can hook up this "progress" member, it would be very cool.
        });

        function gotOutline(json) {
            if (a$.jsonerror(json)) {} else {
                otree = json.otree;
                makeoutlinetree(json.otree);
                outline(true);
            }
        }
    }

    self.saveOutline = function() {
        alert("debug:saving outline...");
        outline(false);
    }

    self.saveNode = function () {
        //Rebuild the things that need to be saved.

        var data = {
            lib: "kb",
            cmd: "savenode",
            nodeid: nodeid(),
            subject: editSubject(),
            body: editBody(),
        };

        if (servicingapp() == "Help") {
            helpEditor.toTextArea();
            data.helpContent = helpContent();
        }

        data.hideCodaHeader = hideCodaHeader(); //Is there a way to detect whether this setting is relevant?

        a$.ajax({
            type: "POST",
            service: "JScript",
            async: true,
            data: data,
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: savedNode //TODO: See if you can hook up this "progress" member, it would be very cool.
        });

        function savedNode(json) {
            if (a$.jsonerror(json)) { } else {
                jumpToNode(nodeid(), false, false);
            }
        }
    }

    //TODO: This kind of expander box should be a control (this is ridiculous).
    $(".agent-settings-collapsed").unbind().bind("click", function() {
        $(this).removeClass("agent-settings-collapsed");
        $(this).addClass("agent-settings-expanded");
        $(".agent-settings").show();
        $(".agent-settings-bar").hide();
    });
    $(".agent-settings-collapse").unbind().bind("click", function(event) {
        event.stopPropagation();
        $(this).parent().parent().addClass("agent-settings-collapsed");
        $(this).parent().parent().removeClass("agent-settings-expanded");
        $(".agent-settings").hide();
        $(".agent-settings-bar").show();
    });
    $(".agent-settings-showdeleted").unbind().bind("click", function() {
        showdeleted($(this).is(":checked"));
        jumpToNode(nodeid(), false, false);
    });

    self.addChild = function(id) {
        if (id != nodeid) {
            jumpToNode(id, true, false);
        } else {
            addingChild(true);
            childSubject("");
        }
    }

    self.setNodeState = function(id, parent, active) {
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "kb",
                cmd: "setnodestate",
                nodeid: id,
                active: active
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: addedNode //TODO: See if you can hook up this "progress" member, it would be very cool.
        });

        function addedNode(json) {
            if (a$.jsonerror(json)) {} else {
                jumpToNode(parent, false, false);
            }
        }
    }

    self.addNode = function(parent) {
        if (childSubject() != "") {
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "kb",
                    cmd: "addnode",
                    subject: childSubject(),
                    parent: parent
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: addedNode //TODO: See if you can hook up this "progress" member, it would be very cool.
            });

            function addedNode(json) {
                if (a$.jsonerror(json)) {} else {
                    jumpToNode(nodeid(), false, false);
                }
            }

        } else {
            addingChild(false);
            childSubject("");
        }

    }

    self.jumpToNode = function(id, addchild, saveparent) {
        //alert("debug:jumping to node: " + id);
        if (false) {
            if (saveparent) {
                savedparent = nodeid();
            } else {
                savedparent = -1;
            }
        }
        editing(false);
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "kb",
                cmd: "getnode",
                nodeid: id,
                role: oKBRole(),
                showdeleted: showdeleted()
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: gotNode //TODO: See if you can hook up this "progress" member, it would be very cool.
        });

        function gotNode(json) {
            if (a$.jsonerror(json)) {} else {
                bind(json);
                addingChild(addchild);
            }
        }
    }

    self.editNode = function(id) {
        editing(true);
        editSubject(subject());
        editBody(body());
        if (servicingapp() == "Help") {
            // Initialize CodeMirror editor with a nice html5 canvas demo.
            if (helpEditor != null) {
                clearTimeout(delay);
                $(" .CodeMirror", $("#helpCode").parent()).eq(0).remove();
                //helpEditor.setOption("mode", "text/x-csrc");
                //helpEditor.getWrapperElement().parentNode.removeChild(helpEditor.getWrapperElement());
                helpEditor = null;
            }

            helpEditor = CodeMirror.fromTextArea(document.getElementById('helpCode'), {
                lineNumbers: true,
                mode: "htmlmixed",
                autoCloseTags: true
            });
            helpEditor.setValue(helpContent()); //Experimental.
            //TODO: Maybe eliminate the entire fromTextArea/toTextArea thing and replace with getValue and setValue?
            //But if I do that, I fear it won't know where to put the editor in all cases.
            //For now, I'm doing both.  CodeMirror has some problems, I think.
            helpEditor.on("change", function() {
                clearTimeout(delay);
                delay = setTimeout(updatePreview, 300);
            });

            CodeMirror.commands["selectAll"](helpEditor);
            helpEditor.autoFormatRange(helpEditor.getCursor(true), helpEditor.getCursor(false));
            CodeMirror.commands["goDocStart"](helpEditor);

            function updatePreview() {
                var previewFrame = document.getElementById('htmlPreview');
                var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
                preview.open();
                preview.write(helpEditor.getValue());
                preview.close();
            }
            setTimeout(updatePreview, 300);
        }
    }

    /* //TEST
    bind({
    node: {
    id: 1,
    subject: "Acuity Wiki",
    body: "This is the Acuity Wiki, it contains like, everything you need to run our business from a procedural standpoint.  It's an attempt at generalization in written form (will be very useful to help drive UIs and give non-developers more control).",
    servicingapp: "",
    parent: 0,
    children: [
    { id: 2, subject: "General Acuity" },
    { id: 3, subject: "Acuity User Guides" },
    { id: 7, subject: "Back-end Processes" }
    ]
    }
    });
    */

    self.hideHeader = function(){
        var checked = document.getElementById("headercheck").checked;
        hideCodaHeader(checked);
    }

    jumpToNode(1, false, false); //Root
    ko.postbox.publish("ResizeWindow", "");

}
