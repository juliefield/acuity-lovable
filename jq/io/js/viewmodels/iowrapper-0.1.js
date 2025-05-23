function IoWrapperViewModel() {

    var self = this;

    var off = $(".io-jsonform").offset();
    $(".io-jsonform").css("height", $(window).height() - off.top);


    //Nav
    //self.jsonServeData = ko.observable('{ lib: "userprofile", cmd: "getfullprofile", user: "jeffgack" }');
    self.jsonServeData = ko.observable('{ lib: "qa", cmd: "getQaOutlines", formids: [2] }');
    self.jsonServeMember = ko.observable('');
    self.formats = ko.observableArray(['list', 'tree', 'listtable']);
    self.editmodes = ko.observableArray(['readonly', 'add', 'update', 'add/update']);

    self.schemaErrors = ko.observable("");

    self.selectedFormat = ko.observable('list');
    self.selectedEditmode = ko.observable('readonly');

    self.textClassPrefix = ko.observable("jfd");

    self.showTags = ko.observable(false);

    //self.jsonSchema = ko.observable("{}");  //Another issue with knockout, as I want this controllable by jsonForm.
    $(".io-schema").val("{}");

    var ino = {
        "myname": { "first": "Jeff", "last": "Gack" },
        "mytable": [{ "first": "Jeff", "last": "Gackenheimer", "scores": [{ "mytype": "math", score: 95 }, { "mytype": "english", "score": 82}] }, { "first": "Dean", "last": "Weathers"}]
    }

    self.jsonInitData = ko.observable(JSON.stringify(ino,null,4));

    self.jsonOutputData = ko.observable('well-formed json output will show here');

    function testadd() {
        alert("This is the test 'add' callback.");
    }

    function testupdate() {
        alert("This is the test 'update' callback.");
    }

    self.changeShowTags = function () {
        if (showTags()) {
            $(".jf-data").show();
        }
        else {
            $(".jf-data").hide();
        }
        return true;
    }

    function mirrorOutput(data) {
        jsonOutputData(JSON.stringify(data, null, 4));
    }

    self.sendServe = function () {
        var data;
        var schema = null;
        var error = false;
        var myschema = $(".io-schema").eq(0).val();
        $(".io-jsonform").html("");
        try {
            //var data = eval('(' + JSON.minify(jsonServeData()) + ')');
            var data = JSON.parse(JSON.minify(jsonServeData().replace(/(['"])?([a-zA-Z0-9_:]+)(['"])?:/g, '"$2":')));
            if ($('input:radio[name=schemaMode]:checked').val().split("_")[0] == "generate") {
                data.generateSchema = $('input:radio[name=schemaMode]:checked').val().split("_")[1];
            }
        }
        catch (e) {
            $(".io-jsonform").append("<p>Syntax Error in JSON</p>")
            error = true;
        }
        try {
            if ($('input:radio[name=schemaMode]:checked').val().split("_")[0] == "validate") {
                //TODO: Validate Validation is only hooked up for one direction.
                if (myschema != "{}") {
                    data.validateSchema = $('input:radio[name=schemaMode]:checked').val().split("_")[1];
                    schema = JSON.parse(JSON.minify(myschema)); //Assume that schema is already well-formed json
                }
            }
        }
        catch (e) {
            $(".io-jsonform").append("<p>Syntax Error in JSON Schema</p>")
            error = true;
        }
        if (!error) {
            $(".io-validation").html("");
            schemaErrors($(".io-jsonform").jsonForm({ action: "serve", data: data, member: jsonServeMember(), format: selectedFormat(), editmode: selectedEditmode(), classprefix: textClassPrefix(), schema: schema, schemaSelector: ".io-schema", validationSelector: ".io-validation", onAdd: testadd, onUpdate: testupdate, onMirror: mirrorOutput, showtagsCallback: changeShowTags, success: finish }));
        }
        function finish() {
            //changeShowTags();
        }
    }

    self.sendInit = function () {
        var data;
        var schema = null;
        var error = false;
        var myschema = $(".io-schema").eq(0).val();
        $(".io-jsonform").html("");
        try {
            //var data = eval('(' + JSON.minify(jsonServeData()) + ')');
            var data = JSON.parse(JSON.minify(jsonInitData().replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2":')));
            if ($('input:radio[name=schemaMode]:checked').val().split("_")[0] == "generate") {
                data.generateSchema = $('input:radio[name=schemaMode]:checked').val().split("_")[1];
            }
        }
        catch (e) {
            $(".io-jsonform").append("<p>Syntax Error in JSON</p>")
            error = true;
        }
        try {
            //var data = eval('(' + JSON.minify(jsonServeData()) + ')');
            if ($('input:radio[name=schemaMode]:checked').val().split("_")[0] == "validate") {
                if (myschema != "{}") {
                    data.validateSchema = $('input:radio[name=schemaMode]:checked').val().split("_")[1];
                    schema = JSON.parse(JSON.minify(myschema)); //Assume that schema is already well-formed json
                }
            }
        }
        catch (e) {
            $(".io-jsonform").append("<p>Syntax Error in JSON Schema</p>")
            error = true;
        }
        if (!error) {
            //var data = eval('(' + JSON.minify(jsonInitData()) + ')');
            $(".io-validation").html("");
            schemaErrors($(".io-jsonform").jsonForm({ action: "init", data: data, format: selectedFormat(), editmode: selectedEditmode(), classprefix: textClassPrefix(), schema: schema, schemaSelector: ".io-schema", validationSelector: ".io-validation", onAdd: testadd, onUpdate: testupdate, onMirror: mirrorOutput, showtagsCallback: changeShowTags }));
            //changeShowTags();
        }
    }

}