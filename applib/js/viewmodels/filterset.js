//Conventions:
//
// Subscription variables are in all caps (e.g. CSR)
//
// 
//
function FilterAttributesViewModel(o) {

    var self = this;

    var filters = null;
    var atr = null;

    ko.postbox.subscribe("ROLE", function (newValue) {
        ROLE = newValue;
        if (ROLE == "CSR") {
            $(".filters-attributes-link").hide();
        }
    });

    ko.postbox.subscribe("FILTERS", function (o) {
        filters = o;
    });

    ko.postbox.subscribe("CSR", function (newValue) {
        CSR = newValue;
        if (ROLE != "CSR") {
            if ((CSR == "") || (CSR == "each")) {
                $(".filters-attributes-modal").hide();
                $(".filters-attributes-link").hide();
            }
            else {
                //Update the viewmodel (if there is one).
                $(".filters-attributes-name").html(CSR); //Sample, should be an observable
                $(".filters-attributes-link").show();
            }
        }
    });

    //User Attributes UI (should be in Knockout).  UserAttributes
    var CSR = "";
    var ROLE = "";
    $('.filters-attributes-link').qtip({ content: 'Agent Attributes' });
    $(".filters-attributes-link").bind("click", function (e) {
        self.Prompt("Loading...");
        try {
            self.allAvailableItems.removeAll();
        } catch (e) { }
        try {
            self.allSelectedItems.removeAll();
        } catch (e) { }
        a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "settings", cmd: "filters.getattributes", role: ROLE, CSR: CSR },
            dataType: "json", cache: false, error: a$.ajaxerror, success: loadedAttributes
        });
        function loadedAttributes(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                atr = json.attributes;
                self.Prompt(json.user.name.first + " " + json.user.name.last);
                for (var i in atr) {
                    self.allSelectedItems.push(atr[i].name);
                }
                if (filters != null) {
                    for (var i in filters) {
                        var found = false;
                        for (var j in atr) {
                            if (filters[i].name == atr[j].name) {
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            self.allAvailableItems.push(filters[i].name);
                        }
                    }
                }
            }
        }
        $(".filters-attributes-modal").css("top", (e.pageY - 50) + "px").show();
    });

    $(".filters-attributes-close").bind("click", function () {
        $(".filters-attributes-modal").hide();
    });

    function saveall() {
        var atn = []; //attributes now
        for (var i = 0; i < self.allSelectedItems().length; i++) {
            var cmp = self.allSelectedItems()[i];
            for (var j in filters) {
                if (filters[j].name == cmp) {
                    atn.push(filters[j]);
                }
            }
        }
        a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "settings", cmd: "filters.saveattributes", role: ROLE, CSR: CSR, attributes: atn },
            dataType: "json", cache: false, error: a$.ajaxerror, success: savedAttributes
        });
        function savedAttributes(json) {
            if (a$.jsonerror(json)) {
            }
            else {
            }
        }
    }

    self.Prompt = ko.observable("Loading...");
    self.itemToAdd = ko.observable("");
    self.allSelectedItems = ko.observableArray(["At-Home Agent"]); // Initial items
    /*
    self.allSelectedItems = ko.observableArray(
    [
       { Name: "Fries", Value: "2" },
       { Name: "Eggs Benedict", Value: "3" },
       { Name: "Ham", Value: "4" },
       { Name: "Cheese", Value: "5" }
    ]);
    */
    self.selectedItems = ko.observableArray();                                // Initial selection//
    self.allAvailableItems = ko.observableArray(["Floor-Walker - A+ Pay","Trainer - A+ Pay","FMLA - B Pay"]); // Initial items
    /*
    self.allAvailableItems = ko.observableArray(
    [
        { Name: "Avocado", Value: "7" },
        { Name: "Omelet", Value: "8" }
    ]);  // Initial items
    */
    self.addItem = function () {
        if ((self.itemToAdd() != "") && (self.allSelectedItems.indexOf(self.itemToAdd()) < 0)) // Prevent blanks and duplicates
            self.allSelectedItems.push(self.itemToAdd());
        self.allSelectedItems.sort();
        self.allAvailableItems.remove(self.itemToAdd());
        saveall();
    };

    self.removeSelected = function () {
        for (var i = 0; i < self.selectedItems().length; i++) {
            self.allAvailableItems.push(self.selectedItems()[i]);
        }
        self.allAvailableItems.sort();
        self.allSelectedItems.removeAll(self.selectedItems());
        self.selectedItems([]); // Clear selection
        saveall();
    };

    self.sortItems = function () {
        self.allSelectedItems.sort();
    };

}
