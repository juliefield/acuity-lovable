//treasurehunt

function HelloWorldViewModel(o) {

    var self = this;

    self.hw = {
        Role: ko.observable(""),
        CSR: ko.observable("")
    }

    ko.postbox.subscribe("Role", function(newValue) {
        hw.Role(newValue);
    });

    ko.postbox.subscribe("CSR", function (newValue) {
        hw.CSR(newValue);
    });

}
