(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var mytestvar,
    mytestvar2;

    // examples
    var EXAMPLEdefaultOptions = {
        chartxy: {
            renderTo: 'containersmother',
            anotherthing: 'to add',
            defaultSeriesType: 'column'
        }
    };
    function ExampleOfExtend(options) {
        alert("we are in the extend example function");
        var opts = $.extend({}, EXAMPLEdefaultOptions, options);
        alert(dumpObj(opts, "DUMP:", "", 0));
    }

    // utilities
    function dumpObj(obj, name, indent, depth) { if (depth > 20) { return indent + name + ": <Maximum Depth Reached>\n"; } if (typeof obj == "object") { var child = null; var output = indent + name + "\n"; indent += "  "; for (var item in obj) { try { child = obj[item]; } catch (e) { child = "<Unable to Evaluate>"; } if (typeof child == "object") { output += dumpObj(child, item, indent, depth + 1); } else { output += indent + item + ": " + child + "\n"; } } return output; } else { return obj; } };

    // global variables
    window.appExample = {
        ExampleOfExtend: ExampleOfExtend
    };
})();

