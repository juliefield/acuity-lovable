//Treasurehunt
//

function TreasureHuntViewModel(o) {

    var self = this;

    self.th = {
        Role: ko.observable(""),
        CSR: ko.observable(""),
        Balance: ko.observable(0)
    };

    ko.postbox.subscribe("Role", function(newValue) {
        th.Role(newValue);
    });

    ko.postbox.subscribe("CSR", function (newValue) {
        th.CSR(newValue);
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "pay",
                cmd: "points.csrledger",
                csr: th.CSR()
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: loaded
        });
        function loaded(json) {
            if (a$.jsonerror(json)) {
            }
            else {
                var bal = 0;
                for (var i in json.ledger) {
                    bal += json.ledger[i].amount;
                }
                th.Balance(bal);
            }
        }

    });

}
