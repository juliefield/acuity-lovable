/************
RankPoints
1.0.3 - Add TH Guatemala management page (actually, I changed nothing in this code for this, see the TODO).
1.0.4 - Fix the $NaN problem on the total.
************/

(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;

    var prizeinitq = false;

    function csrinit(pointsbalance) {
        if (!prizeinitq) {
            prizetableinit(".CEPointsPrizes");
            prizeinitq = true;
        }
        function getledger() {
            var csr = $("#selCSRs option:selected").val();
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "pay", cmd: "points.csrledger", csr: csr }, dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
            function loaded(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    var inj = "<tr><td>Date</td><td>Description</td><td>Amount</td><td>Balance</td></tr>";
                    var pb = 0;
                    for (var i in json.ledger) {
                        pb += json.ledger[i].amount;
                        inj += "<tr><td>" + json.ledger[i].date + "</td><td>" + json.ledger[i].desc + "</td><td>" + json.ledger[i].amount + "</td><td>" + pb + "</td></tr>";
                    }
                    $(".headericon-points-balance").html(pb);
                    $(".CEPointsRegister table").empty().append(inj);
                    var sp = $("#selCSRs option:selected").text().split(",");
                    $(".CEPointsName").html(sp[1] + "&nbsp;" + sp[0]);
                    $(".CEPointsBalance").html(pb);
                    var cepointsthreshold = 500; //TODO: Make the threshold for redemption a setting stg
                    if (pb < cepointsthreshold) {
                        $(".CEPointsInstructions").html(", when you reach a <br />minimum of 500 points you are eligible to redeem.");
                        $("#CEPointsRedeem,#CEPointsRedeemAmount").prop("disabled", true);
                    }
                    else {
                        $(".CEPointsInstructions").html("!<br />You may redeem your points, or save them for a future purchase.");
                        $("#CEPointsRedeem,#CEPointsRedeemAmount").prop("disabled", false);
                        $("#CEPointsRedeem").unbind().bind("click", function () {
                            //TODO: Load the redemption types as settings stg
                            if ($("#CEPointsRedemptionType option:selected").val() == "") {
                                alert("Please select a redemption type.");
                            }
                            else if (!$.isNumeric($("#CEPointsRedeemAmount").val())) {
                                alert("Points to Redeem must be a number.");
                            }
                            else if (parseInt($("#CEPointsRedeemAmount").val()) < cepointsthreshold) {
                                alert("You must redeem at least " + cepointsthreshold + " points.");
                            }
                            else if (parseInt($("#CEPointsRedeemAmount").val()) > pb) {
                                alert("You can't redeem more than your current balance of " + pb + " points.");
                            }
                            else {
                                a$.ajax({ type: "GET", service: "JScript", async: false, data: { lib: "pay", cmd: "points.redeem", csr: $("#selCSRs option:selected").val(), amount: "" + (-parseInt($("#CEPointsRedeemAmount").val())), redeemtype: $("#CEPointsRedemptionType option:selected").val(), redeemtext: $("#CEPointsRedemptionType option:selected").text() }, dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
                                function loaded(json) {
                                    if (a$.jsonerror(json)) {
                                    }
                                    else {
                                        getledger();
                                    }
                                }
                            }
                        });
                    }
                    $(".headericon-points").show();
                }
            }
        }
        getledger();
    }

    var mgrledger;

    function mgrinit() {
        if (!prizeinitq) {
            prizetableinit(".CEPointsPrizes");
            prizeinitq = true;
        }
        function getmgrledger() {
            //TODO: The ledger needs to work by location (based on the username).  I'm going to do that server-side for now (since we pass the user), but this needs to be a setting I think.
            //     Actually, this is so specific I'm not sure a setting would be worth it.  syanez => location 9, all others are all locations except 9.
            a$.ajax({ type: "GET", service: "JScript", async: true, data: { lib: "pay", cmd: "points.mgrledger" }, dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
            function loaded(json) {
                if (a$.jsonerror(json)) {
                }
                else {
                    mgrledger = json.ledger;
                    var inj = "<tr><td></td><td>Requested</td><td>Fulfilled</td><td>Name</td><td>Status</td><td>Project</td><td>Kronos</td><td>Supervisor</td><td>Temp?</td><td>Request</td><td>Points</td><td>$ Value</td><td>Total</td></tr>";
                    var bal = 0;
                    for (var i in mgrledger) {
                        inj += '<tr><td>';
                        if (typeof mgrledger[i].fulfdt == "object") {
                            inj += '<input type="button" value="Fulfill" class="RankPoints-Fulfill" /><span style="display:none;">' + i + '</span>';
                        }
                        inj += '</td>';
                        inj += '<td>' + mgrledger[i].date + '</td>';
                        inj += '<td>' + (typeof mgrledger[i].fulfdt == "object" ? "" : mgrledger[i].fulfdt) + '</td>';
                        inj += '<td>' + mgrledger[i].csrname + '(' + mgrledger[i].csr + ')&nbsp;<span class="CEPoints-message">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="display:none;">' + mgrledger[i].csr + "/" + mgrledger[i].csrname + '</span></span>' + '</td>';
                        inj += '<td>' + mgrledger[i].status + '</td>';
                        inj += '<td>' + mgrledger[i].project + '</td>';
                        inj += '<td>' + mgrledger[i].kronos + '</td>';
                        inj += '<td>' + mgrledger[i].supervisor + '</td>';
                        inj += '<td>' + mgrledger[i].temp + '</td>';
                        inj += '<td>' + mgrledger[i].redeemtype + '</td>';
                        inj += '<td>' + mgrledger[i].points + '</td>';
                        var dlr = 0;
                        for (var n in prizes.table) {
                            if (prizes.table[n].points <= mgrledger[i].points) {
                                dlr = prizes.table[n][mgrledger[i].redeemtype];
                            }
                        }
                        inj += '<td>$' + numberWithCommas(dlr) + '</td>';
                        bal += dlr;
                        inj += '<td>$' + numberWithCommas(bal) + '</td>';
                        inj += "</tr>";
                    }
                    $(".CEPointsMgrLedger table").html(inj);
                    $(".RankPoints-Fulfill").unbind().bind("click", function () {
                        var idx = parseInt($(this).parent().children().last().html());
                        if (confirm("NOTICE: As the " + stgRankPointsLabel + " Manager, it is your responsibility to carry out the fulfillment of this request.  Acuity will now guide you through notifying the CSR of your intent (using the messaging system), but the actual fulfillment is NOT MANAGED within the Acuity system.")) {
                            $("#messagediv").show();
                            $(".heading").html("Messaging");
                            $('#messagetab').show();
                            $('#messageslabel').trigger('click');
                            $(".messages-compose input").trigger("click");
                            var vk = "COMBO/selCSRs/" + mgrledger[idx].csr;
                            alert('Please compose a message for ' + mgrledger[i].csrname);
                            $('#composeto option[value="' + vk + '"]').attr("selected", "selected");
                            if ($("#composeto option:selected").val() != vk) {
                                $("#composeto").append($('<option></option>').val(mgrledger[idx].csr).html(mgrledger[idx].csrname.replace(/'/g,'')).attr("selected", "selected"));
                            }
                            $("#composeto").trigger("liszt:updated");
                            $("#composesubject").val(stgRankPointsLabel + " Rewards");
                            var reward = "Gerbil";
                            for (var n in prizes.categories) {
                                if (prizes.categories[n].name == mgrledger[idx].redeemtype) {
                                    reward = prizes.categories[n].desc;
                                }
                            }
                            var buf = "Congratulations!  We are processing your " + stgRankPointsLabel + " redemption request!\r\n\r\nYou have asked to exchange " + mgrledger[idx].points + " " + stgRankPointsLabel + " for ";
                            var dlr = 0;
                            for (var n in prizes.table) {
                                if (prizes.table[n].points <= mgrledger[idx].points) {
                                    dlr = prizes.table[n][mgrledger[idx].redeemtype];
                                }
                            }
                            if (mgrledger[idx].redeemtype == "Cash") {
                                buf += "$" + numberWithCommas(dlr) + " in Cash.";
                            }
                            else {
                                buf += "a " + reward + " valued at $" + numberWithCommas(dlr)
                            }
                            buf += '\r\nIf this is incorrect or not your intention, please let me know immediately.\r\n\r\nAll awards are subject to the <a target="_blank" href="../help.aspx?cid=CEPointsTC">' + stgRankPointsLabel + ' Terms &amp; Conditions</a>\r\n\r\nYour reward will usually be delivered at the same time as your next payroll check.\r\nIf you have any questions, please feel free to message me (the ' + stgRankPointsLabel + ' Administrator).\r\nAgain, congratulations on your redemption, you\'ve earned it!';
                            $("#composebody").val(buf);
                            a$.ajax({ type: "GET", service: "JScript", async: false, data: { lib: "pay", cmd: "points.fulfill", id: mgrledger[idx].id }, dataType: "json", cache: false, error: a$.ajaxerror, success: loaded });
                            function loaded(json) {
                                if (a$.jsonerror(json)) {
                                }
                                else {
                                    getmgrledger();
                                }
                            }

                        }
                    });
                    $(".CEPoints-message").unbind().bind("click", function () {
                        var spl = $(this).children().last().html().split("/");
                        var csr = spl[0];
                        var csrname = spl[1];
                        $("#messagediv").show();
                        $(".heading").html("Messaging");
                        $('#messagetab').show();
                        $('#messageslabel').trigger('click');
                        $(".messages-compose input").trigger("click");
                        var vk = "COMBO/selCSRs/" + csr;
                        $('#composeto option[value="' + vk + '"]').attr("selected", "selected");
                        if ($("#composeto option:selected").val() != vk) {
                            $("#composeto").append($('<option></option>').val(csr).html(csrname.replace(/'/g,'')).attr("selected", "selected"));
                        }
                        $("#composeto").trigger("liszt:updated");

                    });
                }
            }
        }
        getmgrledger();
    }

    var prizes = {
        categories: [{ name: "Cash", desc: "Cash" },
                      { name: "GiftCert", desc: "Gift Certificate" }
                    ],
        table: [{ points: 500, Cash: 200, GiftCert: 225 },
                 { points: 1000, Cash: 450, GiftCert: 470 },
                 { points: 1500, Cash: 700, GiftCert: 750 },
                 { points: 2000, Cash: 950, GiftCert: 1080 },
                 { points: 2500, Cash: 1200, GiftCert: 1475 },
                 { points: 3000, Cash: 1475, GiftCert: 1950 },
                 { points: 3500, Cash: 1750, GiftCert: 2520 },
                 { points: 4000, Cash: 2050, GiftCert: 3200 },
                 { points: 4500, Cash: 2350, GiftCert: 4005 },
                 { points: 5000, Cash: 2650, GiftCert: 4950 },
                 { points: 5500, Cash: 2970, GiftCert: 6050 },
                 { points: 6000, Cash: 3300, GiftCert: 7300 }
               ]
    };

    function prizetableinit(id) {
        var buf = "<table><tr><td>POINTS</td>";
        for (var i in prizes.categories) {
            buf += "<td>" + prizes.categories[i].desc + "</td>";
        }
        buf += "</tr>";
        for (var i in prizes.table) {
            buf += "<tr><td>" + numberWithCommas(prizes.table[i].points) + "</td>";
            for (var c in prizes.categories) {
                buf += "<td>$" + numberWithCommas(prizes.table[i][prizes.categories[c].name]) + "</td>";
            }
            buf += "</tr>";
        }
        buf += "</table>";
        $(id).html(buf);
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // global variables
    window.appApmRankPoints = {
        //filter-related (could be split out at some point)
        csrinit: csrinit,
        mgrinit: mgrinit
    };
    function IsObject(obj) {
        return obj ? true : false;
    }
})();

