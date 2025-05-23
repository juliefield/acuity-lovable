// Common
// var cox_flag = (window.location.toString().toLowerCase().indexOf("cox-") >= 0) ? true : false; // ES6
// var cox_flag = false;
// if ((window.location.toString().toLowerCase().indexOf("cox-") >= 0)) {
//     cox_flag = true;
// }

// Capitalize the first letter of name, and lowercase remaining letters
function toTitleCase(str) {
    return str.replace(
        /\w\S*/g,
        function (txt) {
            tempText = txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase();
            return tempText;
        }
    );
}

// Generic compare function
var compare_vals = function(a,b) {
    // return a === b ? true : false; // ES6
    if (a === b) {
        return true;
    } else {
        return false;
    }
}

// CONTROLLERS
angularApp.controller('sideperfController', ['$scope', '$interval', '$filter', '$http', 'legacy', 'hashtagnav', '$rootScope', 'api', '$log', function ($scope, $interval, $filter, $http, legacy, hashtagnav, $rootScope, api, $log) {

    //Services
    legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).
    hashtagnav.init(); //Uses <.. class="nv" nv="hashtag1/sub1;default:hashtag">  to show/hide divs.    // Create Review Tabs

    //
    // Vars and Objects
    //

    // this regex also allows for decimal numbers without a leading zero
    $scope.only_numbers = /^(?:(?:0|[1-9][0-9]*)(?:\.[0-9]*)?|\.[0-9]+)$/;

    // hardcode for now
    $scope.agentRoleLabel = "CSR";
    $scope.supervisorRoleLabel = "Team Leader";

    // Set general flags
    $scope.agentFlag = false;
    $scope.supervisorFlag = false
    $scope.self_eval_toggle = false;
    $scope.showPeerRecognition = false;
    $scope.from_journal = false;
    $scope.user_flag = "";
    $scope.one_on_one_modal = false;
    // $scope.cox_flag = cox_flag;

    // Set variables from URL string
    $scope.url = ({
        csr: a$.gup("CSR"),
        username: a$.gup("username"),
        team: a$.gup("Team"),
        from_journal: a$.gup("FromJournal"),
        project: a$.gup("project"),
        role: a$.gup("role"),
        roleset: a$.gup("roleset"),
        uid: a$.gup("uid"),
        review_id: a$.gup("reviewID")
    });

    // Create/Init Objects
    $scope.me = {};
    $scope.agentId = '';
    $scope.supervisorId = '';

    $scope.teammates = {};
    $scope.peer_teammates = {};

    $scope.review = {};
    $scope.review.selected = ({
        agent_id: "",
        date_entered: "",
        review_id: "",
        sup_eval_id: "",
        supervisor_id: "",
        evaluation: ({
            self: ({
                id: "",
                ques: "",
                ans: ""
            }),
            supervisor: ({
                id: "",
                ques: "",
                ans: ""
            }),
            goals: ({
                id: "",
                user_id: "",
                supervisor_eval_id: "",
                goal: "",
                from_x: "",
                to_x: "",
                when_date: "",
                how: "",
                celebrate: "",
                notes: "",
                goal_score: ""
            })
        })
    });
    $scope.review.profile = ({
        agent_full_name: '',
        project_name: '',
        team_name: '',
        location_name: '',
        hire_date: '',
        score: '',
        avatarpath: '',
        agent_role: ''
    });
    $scope.review.selected_user = angular.copy($scope.review.selected);
    $scope.last_review_goals = angular.copy($scope.review.selected.evaluation.goals);

    $scope.reviews_complete = {};

    $scope.questionsSupervisor = {};
    $scope.superEvalAnswer = {};
    $scope.questionsSelf = {};
    $scope.selfEvalAnswer = {};
    $scope.peerRecognition = {};
    // Peer Recognition Column Headers - Hardcoded for now
    $scope.peerRecognitionHead = ["Peer", "Recognition Type", "Recognition Value"];
    $scope.recognitionType = ["Professionalism", "Attendance", "Courtesy", "Position Knowledge"]
    $scope.recognitionValue = ["Excellent", "Good", "Acceptable", "Needs Improvement"];

    // Agent List Sorting
    $scope.propertyName = 'lastnm';
    $scope.reverse = false;
    $scope.sortBy = function (propertyName) {
        // $scope.reverse = $scope.propertyName === propertyName ? !$scope.reverse : false; // ES6
        if ($scope.propertyName === propertyName) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.reverse = false;
        }
        $scope.propertyName = propertyName;
    };

    //
    // end Vars and Objects
    //



    //
    // Functions
    //

    // convert number to decimal number w/ places
    $scope.decimalNumber = function (num, places) {
        var myNum = Number(num).toFixed(places);
        return myNum;
    }

    // generic today's date
    var d = new Date();
    $scope.date_today = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();

    $scope.back_to_journal = function () {
        var g = "https://chime-v3-dev.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/JournalForm.aspx|CSR=" + $.cookie("CSR") + "~Team=" + $.cookie("Team") + "&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
        window.location = g;
    }

    $scope.load_self_eval = function (csr) {
        var g = "https://chime-v3-dev-chris.acuityapm.com/3/Touchpointauthentication.aspx?url=../3/Supperfmgt.aspx|CSR=" + csr + "~Team=" + $.cookie("Team") + "^self-evaluation&username=" + $.cookie("TP1Username") + "&uid=" + $.cookie("uid") + "&role=" + $.cookie("TP1Role") + "&roleset=&project=1";
        window.location = g;
    }

    // return number of days for Create a Review header
    $scope.daysBetween = function (date1, date2) {
        var date1 = new Date(date1);
        var date2 = new Date(date2);
        var timeDiff = Math.abs(date2.getTime() - date1.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Convert back to days and return
        return diffDays;
    }

    $scope.setAgentId = function (id) {
        if (id) {
            $scope.agentId = id;
        } else {
            $scope.agentId = $scope.url.csr;
        }
    }

    // Set Flags
    // $scope.from_journal = $scope.url.from_journal == 1 ? true : false; // ES6
    if ($scope.url.from_journal == 1) {
        $scope.from_journal = true;
    } else {
        $scope.from_journal = false;
    }

    // Set User
    // Flag Other
    // Set Agent/CSR
    // From URL
    // From List
    // Set Supervisor

    // Set Review Mode: List or Selected Review

    // Set Edit Mode: New, Update, View
    // New
    // Create blank arrays
    // Update
    // Get IDs
    // Populate user arrays
    // Save DB arrays from user array copies
    // View
    // Get IDs
    // Populate user arrays


    // Cox
    // if ($scope.cox_flag) {
        $scope.cmx_options = ["Strongly Connected", "Connected", "Disconnected"]; // Hardcoded for now.
        $scope.cmx_values = [];
        $scope.cmx_observations = "";
        $scope.add_row = function () {
            $scope.cmx_values.push("");
        }
        $scope.remove_row = function (i) {
            $scope.cmx_values.splice(i, 1);
        }
        // $scope.goal_values = ["IB Retention", "IB Dollars per Hour", "IB Cure Rate"]; // Hardcoded for now.
        $scope.cmx_string = "";
        $scope.cmx_to_string = function () {
            arr = $scope.cmx_values;
            $scope.cmx_string = arr.toString();
        }
    // }
    // end Cox

    //
    // end Functions
    //


    // if (true) {
    //
    // getClient
    //
    api.getClient({
        who: "ME",
        members: ["perf", "colors", "supervisors"]
    }).then(function (json) {
        $scope.$apply(function () {
            $scope.perf = json.client.perf;


            // Agent Eval Self Answers
            $scope.questionsSelf = $scope.perf.questions.self;
            // Agent Eval Supervisor Answers
            $scope.questionsSupervisor = $scope.perf.questions.supervisor;
            // Score Colors
            if (json.client.colors) {
                $scope.colours = json.client.colors;
                $scope.getColor = function (num) {
                    for (var i = 0; i < $scope.colours.length; i++) {
                        pieLow = $scope.colours[i].pie.low;
                        pieHigh = $scope.colours[i].pie.high;
                        pieThreshold = $scope.colours[i].threshold;

                        if (num == pieThreshold) {
                            return $scope.colours[i].color;
                        } else if ((num > pieThreshold) && (num <= pieHigh)) {
                            // if (num == pieHigh) {
                            return $scope.colours[i].color;
                            // }
                        }
                    }
                }
            }
        });
    });
    //
    // end getClient
    //

    /*
    $scope.getProjectInfo = function (id) {
            
    api.getMe({
    who: "OTHER",
    userid: id,
    members: ["person","project"]
    // avatarfolderroot: "../jq/"
    }).then(function (json) {
    $scope.$apply(function () {
    $scope.project = json.me.person.project[0];
    });
    });
            
    }
    */

    //
    // getME: person, teams, csrs, evaluation
    //
    api.getMe({
        who: "ME",
        members: ["person", "teams", "csrs", "evaluation", "project"],
        avatarfolderroot: "../jq/"
    }).then(function (json) {
        //
        // Vars
        //

        //
        // end Vars
        //

        //
        // Functions
        //

        // Create full name string based on role and desired format
        $scope.getUserName = function (id, role, format) {
            if (role === "sup") {
                person = $filter('filter')(json.me.supervisors, {
                    user_id: id
                })[0];
                first_name = toTitleCase(person.first_name);
                last_name = toTitleCase(person.last_name);
            } else if (role === "agent") {
                person = $filter('filter')(json.me.csrs, {
                    uid: id
                })[0];
                first_name = toTitleCase(person.firstnm);
                last_name = toTitleCase(person.lastnm);
            }
            if (format === "last") {
                return last_name + ", " + first_name;
            } else {
                return first_name + " " + last_name;
            }
        }

        // Get Peer Recognition
        $scope.getPeerRecognition = function (id) {
            peerRec = json.me.evaluation.peer_recognition;
            if (id && peerRec) {
                $scope.peerRecognition = peerRec.filter(function (val) {
                    return val.id_self_eval === id;
                });
            }
        }
        // Add row to Peer Recognition
        $scope.addRow = function () {
            // create a blank array
            var newrow = {
                from_user_id: $scope.review.selected.agent_id,
                to_user_id: "",
                rec_type: "",
                rec_val: ""
            }
            // add the new row at the end of the array 
            $scope.peerRecognition.push(newrow);
        }
        // end add row

        // Remove row from Peer Recognition
        $scope.deleteRow = function (index) {
            // remove the row specified in index
            $scope.peerRecognition.splice(index, 1);
            // if no rows left in the array create a blank array
            if ($scope.peerRecognition.length === 0) {
                $scope.peerRecognition = [];
            }
            return false;
        }
        // end remove row

        //
        // end Functions
        //

        //
        // getMe: Agent KPIs
        //
        $scope.concatKPI = function (kpi, subkpi) {
            // return subkpi ? kpi + " - " + subkpi : kpi; // ES6
            if (subkpi) {
                return kpi + " - " + subkpi;
            } else {
                return kpi;
            }
        }
        $scope.convertKPI = function (idx) {
            var kpi = $scope.agent_kpis[idx].kpiname;
            var subkpi = $scope.agent_kpis[idx].subkpiname;
            return $scope.concatKPI(kpi, subkpi);
        }

        $scope.get_agent_kpis = function (agent_id) {
            api.getJS({
                who: "ME",
                lib: "spine",
                cmd: "getMe",
                agentid: agent_id,
                members: ["kpisAgent"],
                lookback: 30
            }).then(function (json) {
                $scope.get_agent_kpis_loaded = false;
                $scope.$evalAsync(function () {
                    if (a$.exists(json.me.kpisAgent) && agent_id) {
                        $scope.kpis_loaded = false;
                        $scope.agent_kpis = angular.copy(json.me.kpisAgent);

                        // KPI Hack
                        var kpi_splice = function (i, cur_name) {
                            $scope.agent_kpis.splice(i, 0,
                                    {
                                        "kpiname": cur_name,
                                        "subkpiname": "",
                                        "weight": 0,
                                        "kpi_score": 0,
                                        "kpi_raw_score": 0
                                    }
                                );
                        }

                        var kpi_match = false;

                        // $scope.agent_kpis.forEach(function(v1,i1){
                        for (i = $scope.agent_kpis.length - 1; i > 0; i--) {
                            var i_next = i - 1;
                            var next_name = $scope.agent_kpis[i_next].kpiname;
                            var cur_name = $scope.agent_kpis[i].kpiname;
                            var subkpi_name = $scope.agent_kpis[i].subkpiname;

                            if (i > 0) {
                                kpi_match = compare_vals(next_name, cur_name);
                            }

                            if (subkpi_name && !kpi_match) {
                                kpi_splice(i, cur_name);
                            }
                            if ($scope.agent_kpis[0].subkpiname) {
                                kpi_splice(0, cur_name);
                            }
                        };

                        // Sort before applying index id
                        $scope.agent_kpis.sort(function (a, b) {
                            var textA = a.kpiname.toUpperCase();
                            var textB = b.kpiname.toUpperCase();
                            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                        });

                        $scope.agent_kpis.forEach(function (item, index) {
                            var kpi_label = $scope.concatKPI(item.kpiname, item.subkpiname);
                            $scope.agent_kpis[index].label = kpi_label;
                            $scope.agent_kpis[index].id = index;
                        });

                        agent_kpis_temp = $filter('filter')($scope.agent_kpis, {
                            label: $scope.review.selected.evaluation.goals.goal
                        })[0];




                        // $scope.review.selected.evaluation.goals.goal = $scope.review.selected.evaluation.goals.goal ? agent_kpis_temp.id : ""; // ES6
                        if ($scope.review.selected.evaluation.goals.goal) {
                            $scope.review.selected.evaluation.goals.goal = agent_kpis_temp.id;
                        } else {
                            $scope.review.selected.evaluation.goals.goal = "";
                        }

                        // end KPI Hack

                        $scope.goal_score_flag = true;
                        if ($scope.review.selected.evaluation.goals.goal != "") {
                            $scope.goal_score_flag = false;
                        }

                        $scope.get_agent_kpis_loaded = true;
                        $scope.kpis_loaded = json.me.kpis_loaded;
                    }
                });
            });

        }

        $scope.review.selected.evaluation.goal_increase = "";

        $scope.get_goal_kpi = function (val) {
            $scope.goal_score_flag = false;
            selected_kpis = $scope.agent_kpis[val];
            // $scope.selected_goal_score ? $scope.get_goal_score($scope.selected_goal_score) : $scope.get_goal_score(); // ES6
            if ($scope.selected_goal_score) {
                $scope.get_goal_score($scope.selected_goal_score);
            } else {
                $scope.get_goal_score();
            }
        }

        $scope.get_goal_score = function (val) {
            $scope.selected_goal_score = val;
            // if (!$scope.review.selected.evaluation.goals.from_x) {
            switch (val) {
                case "kpi_score":
                    $scope.review.selected.evaluation.goals.from_x = selected_kpis.kpi_score;
                    break;

                case "kpi_raw_score":
                    $scope.review.selected.evaluation.goals.from_x = selected_kpis.kpi_raw_score.toFixed(2);
                    break;

                default:
                    $scope.review.selected.evaluation.goals.from_x = "0";
                    break;
            }
            // }
        }
        
        $scope.get_goal_score_title = function (val) {
            if (val === "kpi_raw_score") {
                return "Standard";
            } else if (val === "kpi_score") {
                return "Scored";
            } else {
                return "Not Selected";
            }
        }

        $scope.kpi_change = function () {
            if ($scope.review.selected.evaluation.goals.from_x && $scope.review.selected.evaluation.goal_increase) {
                var num_current = Number($scope.review.selected.evaluation.goals.from_x);
                var num_increase = Number($scope.review.selected.evaluation.goal_increase);
                var num_percent = Number(num_increase / 100);
                var num_goal = (Number((num_percent * num_current) + num_current)).toFixed(2);
                $scope.review.selected.evaluation.goals.to_x = num_goal;
            }
        }
        //
        // end getMe: Agent KPIs
        //


        $scope.$evalAsync(function () {
            $scope.me = json.me;
            // $scope.currentEval = {};

            // Set the logged-in user flag
            $scope.me.role = $scope.me.person.role;
            if ($scope.me.role == $scope.agentRoleLabel) {
                $scope.user_flag = "agent";
            } else if ($scope.me.role == $scope.supervisorRoleLabel) {
                $scope.user_flag = "supervisor";
            } else {
                $scope.user_flag = "other";
            }

            // Get the agent id from the URL
            if ($scope.url.csr) {
                $scope.agentId = $scope.url.csr;
                $scope.self_eval_toggle = true;
            } else {
                $scope.self_eval_toggle = false;
            }

            $scope.sup_ans_reset = function () {
                $scope.review.selected_user.evaluation.supervisor = angular.copy($scope.review.selected.evaluation.supervisor);
            }
            $scope.sup_ans_save = function (user) {
                $scope.review.selected.evaluation.supervisor = angular.copy(user);
            }

            switch ($scope.user_flag) {
                case "agent":


                    $scope.agentFlag = true;
                    $scope.showPeerRecognition = true;

                    $scope.agentId = $scope.me.person.uid;
                    $scope.agentRole = $scope.me.person.role;
                    $scope.agentFirstName = toTitleCase($scope.me.person.firstnm);
                    $scope.agentLastName = toTitleCase($scope.me.person.lastnm);
                    $scope.agentAvatar = $scope.me.person.avatarpath;


                    $scope.supervisorId = $scope.me.supervisor.uid;
                    $scope.supervisorFirstName = $scope.me.supervisor.firstnm;
                    $scope.supervisorLastName = $scope.me.supervisor.lastnm;
                    $scope.supervisorAvatar = $scope.me.supervisor.avatarpath;

                    // $scope.loadAgentEvaluation($scope.agentId);
                    break;
                case "supervisor":

                    $scope.agentFlag = false;
                    $scope.supervisorFlag = true;

                    $scope.supervisorId = $scope.me.person.uid;
                    $scope.supervisorFirstName = $scope.me.person.firstnm;
                    $scope.supervisorLastName = $scope.me.person.lastnm;
                    $scope.supervisorAvatar = $scope.me.person.avatarpath;

                    // filter out the agent based on the agent id
                    if ((a$.exists(json.me.csrs)) && ($scope.agentId)) {
                        $scope.agent = $filter('filter')(json.me.csrs, {
                            uid: $scope.agentId
                        })[0];
                        $scope.agentFirstName = toTitleCase($scope.agent.firstnm);
                        $scope.agentLastName = toTitleCase($scope.agent.lastnm);
                        $scope.agentAvatar = $scope.agent.avatarpath;
                    };

                    if (!$scope.agentId) {
                        $scope.self_eval_toggle = false;
                    }

                    break;
                case "other":


                    $scope.agentFlag = false;
                    $scope.supervisorFlag = false;
                    $scope.otherFlag = true;
                    $scope.viewFlag = true;

                    if ((a$.exists(json.me.csrs)) && ($scope.agentId)) {
                        $scope.agent = $filter('filter')(json.me.csrs, {
                            uid: $scope.agentId
                        })[0];
                        $scope.agentFirstName = toTitleCase($scope.agent.firstnm);
                        $scope.agentLastName = toTitleCase($scope.agent.lastnm);
                        $scope.agentAvatar = $scope.agent.avatarpath;
                    };

                    if ((a$.exists(json.me.supervisors)) && (a$.gup("Team"))) {
                        var teamID = parseInt(a$.gup("Team"));
                        $scope.supervisor = $filter('filter')(json.me.supervisors, {
                            team_id: teamID
                        })[0];

                        $scope.supervisorId = $scope.supervisor.user_id;
                        $scope.supervisorFirstName = $scope.supervisor.first_name;
                        $scope.supervisorLastName = $scope.supervisor.last_name;
                        $scope.supervisorAvatar = $scope.supervisor.avatarfilename;
                    }

                    break;
            }
            $scope.agentFullName = $scope.getUserName($scope.agentId, "agent");
            $scope.supervisorFullName = $scope.getUserName($scope.supervisorId, "sup");

            if (a$.gup("Team")) {
                $scope.team = $filter('filter')(json.me.teams, {
                    id: a$.gup("Team")
                })[0];
            } else {
                if (a$.exists(json.me.teams)) {
                    $scope.team = $filter('filter')(json.me.teams, {
                        mine: 'Y'
                    })[0];
                }
            }

            if (a$.exists(json.me.csrs) && a$.gup("Team")) {
                $scope.teammates = $filter('filter')(json.me.csrs, {
                    teamid: a$.gup("Team")
                });
                $scope.peer_teammates = angular.copy($scope.teammates);
                if ($scope.agentId) {
                    $scope.teammates = $filter('filter')($scope.teammates, {
                        uid: $scope.agentId
                    }, true);
                }


                // If Me is an agent/CSR
                // Remove Me from Teammates array for Peer Recognition
                if ($scope.agentFlag) {
                    for (var i = 0; i < $scope.peer_teammates.length; i++) {
                        if ($scope.peer_teammates[i]['uid'] === $scope.agentId) {
                            $scope.peer_teammates.splice(i, 1);
                        }
                    }
                }
                // Normalize title case of names
                for (var i = 0; i < $scope.teammates.length; i++) {
                    $scope.teammates[i]['firstnm'] = toTitleCase($scope.teammates[i]['firstnm']);
                    $scope.teammates[i]['lastnm'] = toTitleCase($scope.teammates[i]['lastnm']);

                    // id = $scope.teammates[i].uid;
                    $scope.teammates[i]['fullnm'] = $scope.getUserName($scope.teammates[i].uid, "agent", "last");
                }

            }

            // Completed Reviews
            $scope.reviews_complete = json.me.evaluation.reviews_complete;
            var max_date = function (all_dates) {
                var max_dt = all_dates[0],
                        max_dtObj = new Date(all_dates[0]);
                all_dates.forEach(function (dt, index) {
                    if (new Date(dt) > max_dtObj) {
                        max_dt = dt;
                        max_dtObj = new Date(dt);
                    }
                });
                return max_dt;
            }

            $scope.getLastReviewDate = function (agentId) {
                if (agentId) {
                    var result = $scope.reviews_complete.filter(function (reviewComp) {
                        return reviewComp.agent_id === agentId;
                    }).map(function (reviewComp) {
                        return reviewComp.dateEntered;
                    });
                    if (result.length > 0) {
                        return max_date(result);
                    } else {
                        return "N/A";
                    }
                }
            };

            // $scope.getLastReview = function (agentId) {
            //     if (agentId && $scope.last_review_flag) {
            //         reviews_complete_agent = $scope.reviews_complete.filter(function (review) {
            //             return review.agent_id === agentId;
            //         });
            //         // $log.log(`reviews_complete_agent: ${JSON.stringify(reviews_complete_agent,null,2)}`);
            //         // create a temp array of supervisor eval ids
            //         tempSupEvalIds = [];
            //         $.each(reviews_complete_agent, function (index) {
            //             tempSupEvalIds.push(reviews_complete_agent[index].supEvalId);
            //         });

            //         // find the highest numbered supevisor eval id
            //         // highestSupEvalId = Math.max(...tempSupEvalIds);
            //         // $log.log(`highestSupEvalId: ${JSON.stringify(highestSupEvalId,null,2)}`);
            //         // filter goals based on supervisor_eval_id
            //         if (highestSupEvalId) {
            //             supervisor_goals = $filter('filter')(json.me.evaluation.goals, {
            //                 supervisor_eval_id: highestSupEvalId
            //             });
            //         }
            //         $log.log(`supervisor_goals: ${JSON.stringify(supervisor_goals,null,2)}`);
            //         if (supervisor_goals) {
            //             $scope.toggle_goals_last = true;
            //             $scope.review.last = [];
            //             $scope.review.last.goals = angular.copy(supervisor_goals);
            //             // $scope.review.last.goals = ({
            //             //     id: supervisor_goals.id,
            //             //     user_id: supervisor_goals.user_id,
            //             //     supervisor_eval_id: supervisor_goals.supervisor_eval_id,
            //             //     goal: supervisor_goals.goal,
            //             //     from_x: supervisor_goals.from_x,
            //             //     to_x: supervisor_goals.to_x,
            //             //     when_date: supervisor_goals.when_date,
            //             //     how: supervisor_goals.how,
            //             //     celebrate: supervisor_goals.celebrate,
            //             //     notes: supervisor_goals.notes,
            //             //     goal_score: supervisor_goals.goal_score
            //             // });
            //             $log.log(`$scope.review.last.goals: ${JSON.stringify($scope.review.last.goals,null,2)}`);
            //         }
            //     }
            // }

            // Current Reviews (from SK_SUPEVAL)
            $scope.reviews_current = json.me.evaluation.reviews_current;
            if (a$.exists(json.me.evaluation.reviews_current)) {

                $.each($scope.teammates, function (index) {
                    var agentId = $scope.teammates[index].uid.toLowerCase();

                    $.each($scope.reviews_current, function (index2) {
                        var reviewId = $scope.reviews_current[index2].agentId.toLowerCase();
                        var reviewDate = $scope.reviews_current[index2].dateEntered;
                        var currentReviewId = $scope.reviews_current[index2].id;
                        if (agentId === reviewId) {
                            $scope.teammates[index].review_date = reviewDate;
                            $scope.teammates[index].current_review_id = currentReviewId;
                        }
                    });
                    $scope.teammates[index].reviews_complete = [];
                    $.each($scope.reviews_complete, function (index3) {
                        var reviewAgentId = $scope.reviews_complete[index3].agent_id.toLowerCase();
                        if (reviewAgentId === agentId) {
                            $scope.teammates[index].reviews_complete.push({
                                supervisor_id: $scope.reviews_complete[index3].supervisor_id,
                                review_date: $scope.reviews_complete[index3].dateEntered,
                                review_score: $scope.reviews_complete[index3].score,
                                self_eval_id: $scope.reviews_complete[index3].selfEvalId,
                                sup_eval_id: $scope.reviews_complete[index3].supEvalId
                            });
                        }
                    });
                });
            }


            // load correct avatar file paths
            for (var i = 0; i < $scope.teammates.length; i++) {
                $scope.teammates[i]['avatarfilename'] =
                        $scope.teammates[i]['stg']['avatarFilename'] ? $scope.teammates[i]['stg']['avatarFilename'] :
                            $scope.teammates[i]['avatarfilename'] ? '../jq/avatars/' + $scope.teammates[i]['avatarfilename'] : '../jq/avatars/' + 'empty_headshot.png';
            }

            $scope.page_reload = function () {
                location.reload();
            }

            // Create Performance Review

            $scope.init_review = function () {
                $scope.new_review = ({
                    agent_id: '',
                    agent_full_name: '',
                    date_today: $scope.date_today,
                    date_last_review: '',
                    days_since_last_review: ''
                });
                $scope.peerRecognition = {};
                $scope.viewFlag = false;
                $scope.editFlag = false;
                $scope.createFlag = false;
                $scope.last_review_flag = false;

                $scope.tab_select(0);
            }

            $scope.init_review();
            $scope.goals_reset = function () {
                $scope.review.selected_user.evaluation.goals = angular.copy($scope.review.selected.evaluation.goals);
            }
            $scope.goals_save = function (user) {

                $scope.review.selected.evaluation.goals = angular.copy(user);
            }
            $scope.get_review = function (id, bool) {

                $scope.viewFlag = bool;

                if ($scope.viewFlag) {
                    $scope.createFlag = false;
                }

                // Completed Reviews
                if ((a$.exists($scope.reviews_complete)) && (id) && ($scope.viewFlag)) {

                    var review = $filter('filter')($scope.reviews_complete, {
                        selfEvalId: id
                    })[0];

                    if (review) {
                        $scope.review.selected = ({
                            agent_id: review.agent_id,
                            date_entered: review.dateEntered,
                            review_id: review.selfEvalId,
                            sup_eval_id: review.supEvalId,
                            supervisor_id: review.supervisor_id,
                            evaluation: ({
                                self: [],
                                supervisor: []
                            })
                        });
                        $scope.getPeerRecognition(review.selfEvalId);
                    }
                }
                // Current Review
                else if (!$scope.createFlag) {
                    if ($scope.otherFlag) {
                        $scope.viewFlag = true;
                    }
                    var review = $filter('filter')($scope.reviews_current, {
                        agentId: id
                    })[0];
                    // if (!review || review == '') {
                    //     $scope.no_review_flag = true;
                    // }

                    if (review) {
                        // if this exists, it's the current review
                        $scope.review.selected = ({
                            agent_id: review.agentId,
                            date_entered: review.dateEntered,
                            review_id: review.selfevalid,
                            sup_eval_id: review.supevalid,
                            supervisor_id: review.supervisorId,
                            evaluation: ({
                                self: [],
                                supervisor: []
                            })
                        });
                        $scope.getPeerRecognition(review.selfevalid);
                    } else {
                        $scope.createFlag = true;
                    }
                }

                if (!$scope.createFlag) {

                    // true is needed for exact match | e.g. id of 37 returns only 37, and not 137,237,etc
                    self_answers = $filter('filter')(json.me.evaluation.answers_self, {
                        id_eval: $scope.review.selected.review_id
                    }, true);
                    if (self_answers.length > 0) {
                        $.each(self_answers, function (index, value) {
                            ansNum = Number(self_answers[index].id_question);
                            $.each($scope.questionsSelf, function (index2, value2) {
                                quesNum = Number($scope.questionsSelf[index2].id);
                                if (ansNum == quesNum) {
                                    // id = ansNum;
                                    // ans = self_answers[index].answer;
                                    // ques = $scope.questionsSelf[index2].text;
                                    $scope.review.selected.evaluation.self.push({
                                        id: ansNum,
                                        ques: $scope.questionsSelf[index2].text,
                                        ans: self_answers[index].answer
                                    });
                                }
                            });
                        });
                    } else {
                        $.each($scope.questionsSelf, function (index) {
                            $scope.review.selected.evaluation.self.push({
                                id: $scope.questionsSelf[index].id,
                                ques: $scope.questionsSelf[index].text,
                                ans: ''
                            });
                        });
                    }

                    supervisor_answers = $filter('filter')(json.me.evaluation.answers_supervisor, {
                        id_eval: $scope.review.selected.sup_eval_id
                    }, true);
                    $scope.answers_supervisor = supervisor_answers;

                    $.each(supervisor_answers, function (index, value) {
                        ansNum = Number(supervisor_answers[index].id_question);
                        $.each($scope.questionsSupervisor, function (index2, value2) {
                            quesNum = Number($scope.questionsSupervisor[index2].id);
                            if (ansNum == quesNum) {

                                var question = api.stripNG($scope.questionsSupervisor[index2].text);

                                var answer = api.stripNG(supervisor_answers[index].answer);

                                $scope.review.selected.evaluation.supervisor.push({
                                    id: ansNum,
                                    ques: question,
                                    ans: answer
                                });
                            }
                        });
                    });
                    // if ($scope.cox_flag && $scope.review.selected.evaluation.supervisor[4].ans) {
                        var str = $scope.review.selected.evaluation.supervisor[4].ans;
                        $scope.cmx_values = str.split(",");
                    // }
                    // use this as an init for now
                    $scope.sup_ans_reset();

                    supervisor_goals = $filter('filter')(json.me.evaluation.goals, {
                        supervisor_eval_id: $scope.review.selected.sup_eval_id
                    })[0];

                }

                if (!$scope.createFlag) {
                    // Supervisor Targets & Goals
                    if (supervisor_goals) {
                        $scope.review.selected.evaluation.goals_user = {};
                        $scope.review.selected.evaluation.goals = ({
                            id: supervisor_goals.id,
                            user_id: supervisor_goals.user_id,
                            supervisor_eval_id: supervisor_goals.supervisor_eval_id,
                            goal: supervisor_goals.goal,
                            from_x: supervisor_goals.from_x,
                            to_x: supervisor_goals.to_x,
                            when_date: supervisor_goals.when_date,
                            how: supervisor_goals.how,
                            celebrate: supervisor_goals.celebrate,
                            notes: supervisor_goals.notes,
                            goal_score: supervisor_goals.goal_score
                        });

                        // use this as an init for now
                        $scope.goals_reset();
                    }

                    else {
                        $scope.last_review_goals = false;
                        $scope.review.selected.evaluation.goals = ({
                            id: '',
                            user_id: $scope.agentId,
                            supervisor_eval_id: $scope.supervisorId,
                            goal: '',
                            from_x: '',
                            to_x: '',
                            when_date: '',
                            how: '',
                            celebrate: '',
                            notes: '',
                            goal_score: ''
                        });
                    }
                }

                // Populate percentage increase under Goal Setting if there are existing values
                if ($scope.review.selected.evaluation.goals.from_x && $scope.review.selected.evaluation.goals.to_x) {
                    $scope.review.selected.evaluation.goal_increase = Number((($scope.review.selected.evaluation.goals.to_x - $scope.review.selected.evaluation.goals.from_x) / $scope.review.selected.evaluation.goals.from_x) * 100).toFixed(2);
                }



                // get KPIs
                $scope.get_agent_kpis($scope.agentId);
                // end get KPIs

                // Word Counter and Limiter
                // var wordLen = 500, len; // Maximum word length
                // $('.createReview textarea').each(function (index, element) {
                //     var thisId = "#comment_body" + index;
                //     $(element).attr("id",thisId);
                //     $(element).after('<span id="words-left' + index + '" class="counter-text">' + wordLen + ' Words Left</span>');
                //     $(element).bind("keydown keyup blur focus", function (event) {
                //         len = $(element).val().split(/[\s]+/);
                //         if (len.length > wordLen) {
                //             if (event.keyCode == 46 || event.keyCode == 8) {// Allow backspace and delete buttons
                //             } else if (event.keyCode < 48 || event.keyCode > 57) {//all other buttons
                //                 event.preventDefault();
                //             }
                //         }
                //         wordsLeft = (wordLen) - len.length;
                //         var wordsLeftId = "#words-left" + index;
                //         $(wordsLeftId).html(wordsLeft + ' words left');
                //         if (wordsLeft <= 0) {
                //             $(wordsLeftId).addClass("error");
                //         } else if ($(wordsLeftId).hasClass("error")) {
                //             $(wordsLeftId).removeClass("error");
                //         }
                //     });
                // });
            }
            // end Word Counter and Limiter

            // end Selected Review


            // Select Review for Self/Agent Evaluation
            if ($scope.self_eval_toggle && !$scope.createFlag) {
                if ($scope.viewFlag) {
                    // Supervisor and Other roles
                    $scope.get_review($scope.agentId, true);
                } else {
                    // Self/Agent Role
                    $scope.get_review($scope.agentId, false);
                }
            }
            // end Select Review for Self/Agent Evaluation

            // Create Self/Agent Evaluation
            $scope.create_evaluation = function () {
                if ($scope.createFlag) {
                    // Create Object
                    $scope.review.selected = ({
                        agent_id: $scope.agentId,
                        review_id: '',
                        sup_eval_id: '',
                        supervisor_id: $scope.supervisorId,
                        evaluation: ({
                            self: [],
                            supervisor: [],
                            goals: ({
                                id: '',
                                user_id: $scope.agentId,
                                supervisor_eval_id: $scope.supervisorId,
                                goal: '',
                                from_x: '',
                                to_x: '',
                                when_date: '',
                                how: '',
                                celebrate: '',
                                notes: '',
                                goal_score: ''
                            })
                        })
                    });
                    // $scope.getLastReview($scope.agentId);
                    $scope.get_agent_kpis($scope.agentId);
                    // Add questions to object
                    $.each($scope.questionsSelf, function (index) {
                        $scope.review.selected.evaluation.self.push({
                            id: $scope.questionsSelf[index].id,
                            ques: $scope.questionsSelf[index].text,
                            ans: ''
                        });
                    });
                    $.each($scope.questionsSupervisor, function (index) {
                        var question = api.stripNG($scope.questionsSupervisor[index].text);

                        $scope.review.selected.evaluation.supervisor.push({
                            id: $scope.questionsSupervisor[index].id,
                            ques: question,
                            ans: ''
                        });
                    });
                    $scope.review.selected_user.evaluation.supervisor = angular.copy($scope.review.selected.evaluation.supervisor);
                    $scope.review.selected_user.evaluation.goals = angular.copy($scope.review.selected.evaluation.goals);
                }
            }
            $scope.create_evaluation();
            // end Create Self/Agent Evaluation



            $scope.get_agent = function (id) {
                $scope.agentId = id;
                // Header Data
                $.cookie("CSR", id);
                $scope.new_review.agent_id = id;
                $scope.new_review.date_last_review = $scope.getLastReviewDate(id);

                if ($scope.new_review.date_last_review === 'N/A') {
                    $scope.last_review_flag = false;
                    $scope.new_review.days_since_last_review = 'N/A';
                } else {
                    $scope.last_review_flag = true;
                    $scope.new_review.days_since_last_review = $scope.daysBetween($scope.new_review.date_last_review, $scope.date_today);
                }
                $scope.new_review.agent_full_name = $scope.getUserName(id, "agent");
                // end Header Data

                // Performance Review: Profile Information
                $scope.review.profile = ({
                    agent_full_name: '',
                    project_name: '',
                    team_name: '',
                    location_name: '',
                    hire_date: '',
                    score: '',
                    avatarpath: '',
                    agent_role: $scope.agentRoleLabel
                });
                $scope.review.profile.agent_full_name = $scope.new_review.agent_full_name;
                if ((a$.exists(json.me.csrs)) && (id)) {
                    var agent = $filter('filter')(json.me.csrs, {
                        uid: id
                    })[0];
                    var team = $filter('filter')(json.me.project, {
                        team_id: agent.teamid
                    })[0];

                    $scope.review.profile.project_name = team.project_name;
                    $scope.review.profile.team_name = team.team_name;
                    $scope.review.profile.location_name = team.location_name;
                    $scope.review.profile.hire_date = agent.hire_date;
                    $scope.review.profile.score = agent.score;
                    $scope.review.profile.avatarpath = agent.avatarpath;
                };
                // end Performance Review: Profile Information

                // Performance Review: Performance
                $scope.review.performance = [];
                var supervisor_object = $filter('filter')(json.me.supervisors, {
                    team_id: agent.teamid
                })[0];
                $scope.review.performance.supervisor_full_name = $scope.getUserName(supervisor_object.user_id, "sup");
                // end Performance Review: Performance
            }
            // Cox only
            // if ($scope.cox_flag && $scope.user_flag === 'agent') {
            if ($scope.user_flag === 'agent') {
                $scope.get_agent($scope.agentId);
                // $scope.get_review($scope.agentId, false);
                // $scope.getLastReview($scope.agentId);
                $scope.showCreateReview = true;
            }

            // Update Eval
            $scope.test_save = function () {
                if ($scope.review.selected.evaluation.goals.goal) {
                    $scope.review.selected.evaluation.goals.goal = $scope.agent_kpis[$scope.review.selected.evaluation.goals.goal].label;
                }
                // Hardcode hack for Cox
                // if ($scope.cox_flag) {
                    // $scope.review.selected.evaluation.supervisor[4].ans = $scope.cmx_values.length > 0 ? $scope.cmx_values.toString() : ""; // ES6

                    if ($scope.cmx_values.length > 0) {
                        $scope.review.selected.evaluation.supervisor[4].ans = $scope.cmx_values.toString();
                    } else {
                        $scope.review.selected.evaluation.supervisor[4].ans = "0;"
                    }
                // }
                var ev = angular.copy($scope.review.selected.evaluation);


                api.postJS({
                    lib: 'perf',
                    cmd: 'create_new_eval',
                    agentId: $scope.agentId,
                    supervisorId: $scope.supervisorId,
                    username: $scope.me.person.uid,
                    recognition: $scope.peerRecognition,
                    ev: ev
                }).then(function (json) {
                });
            }
            $scope.send_message = function () {
                $scope.$parent.messageSent = true;
                api.postJS({
                    lib: "perf",
                    cmd: "send_message_test",
                    messageto: $scope.agentId,
                    subject: "You Have a New Review",
                    body: "<p><span class='message-service' service='LaunchReview' params='CSR=" + $scope.agentId + "&Team=" + a$.gup("Team") + "'>View Review</span></p>"
                }).then(function (json) {
                    if (true) {
                        $("html, body").animate({ scrollTop: 0 }, "fast");
                        setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.$parent.messageSent = false;
                            });
                        }, 3000);
                        return false;
                    }
                });
            }
            $scope.save_evaluation = function () {
                if ($scope.review.selected.evaluation.goals.goal) {
                    // hold the original value in a temp var to retrieve after the save
                    $scope.review.selected.evaluation.goals.goal_orig = $scope.review.selected.evaluation.goals.goal;
                    // changes the KPI from a number to a label before it's save to the DB
                    $scope.review.selected.evaluation.goals.goal = $scope.agent_kpis[$scope.review.selected.evaluation.goals.goal].label;
                }

                // Hardcode hack for Cox
                // if ($scope.cox_flag) {
                    // $scope.review.selected.evaluation.supervisor[4].ans = $scope.cmx_values.length > 0 ? $scope.cmx_values.toString() : ""; // ES6

                    if ($scope.cmx_values.length > 0) {
                        $scope.review.selected.evaluation.supervisor[4].ans = $scope.cmx_values.toString();
                    } else {
                        $scope.review.selected.evaluation.supervisor[4].ans = "";
                    }
                // }

                if ($scope.createFlag) {
                    // Save as new evaluation
                    var ev = angular.copy($scope.review.selected.evaluation);
                    api.postJS({
                        lib: 'perf',
                        cmd: 'create_new_eval',
                        agentId: $scope.agentId,
                        supervisorId: $scope.supervisorId,
                        username: $scope.me.person.uid,
                        recognition: $scope.peerRecognition,
                        ev: ev
                    }).then(function (json) {
                        if (json.saved) {
                            $scope.$apply(function () {
                                $scope.evalSaved = true;
                                $("html, body").animate({ scrollTop: 0 }, "fast");
                                setTimeout(function () {
                                    $scope.$apply(function () {
                                        $scope.evalSaved = false;
                                        $scope.editFlag = true;
                                        $scope.createFlag = false;
                                    });
                                }, 3000);
                                return false;
                            });

                            // $scope.get_review(json.idselfeval,false);

                        } else {

                            $scope.evalSaved = false;
                        }
                    });
                    // api.postJS({
                    //     lib: "perf",
                    //     cmd: "send_message_test",
                    //     messageto: $scope.agentId,
                    //     subject: "You Have a New Review",
                    //     body: "<p><span class='message-service' service='LaunchReview' params='CSR=" + $scope.agentId + "&Team=" + a$.gup("Team") + "'>View Review</span></p>"
                    // }).then(function (json) {
                    //     if (true) {

                    //     }
                    // });
                } else {
                    // Save as updated evaluation
                    var ev = angular.copy($scope.review.selected.evaluation);
                    api.postJS({
                        lib: 'perf',
                        cmd: 'update_selected_eval',
                        agentId: $scope.review.selected.agent_id,
                        review_id: $scope.review.selected.review_id,
                        supervisorId: $scope.supervisorId,
                        sup_eval_id: $scope.review.selected.sup_eval_id,
                        username: $scope.me.person.uid,
                        recognition: $scope.peerRecognition,
                        ev: ev
                    }).then(function (json) {

                        if (json.saved) {
                            $scope.$apply(function () {
                                $scope.evalSaved = true;

                                $("html, body").animate({ scrollTop: 0 }, "fast");

                                setTimeout(function () {
                                    $scope.$apply(function () {
                                        $scope.evalSaved = false;
                                        $scope.editFlag = true;
                                        $scope.createFlag = false;
                                    });
                                }, 3000);
                                return false;
                            });

                        } else {

                            $scope.evalSaved = false;
                        }
                    });
                }
                // Hack to undo KPI going from number => label string at beginning of save function
                $scope.review.selected.evaluation.goals.goal = $scope.review.selected.evaluation.goals.goal_orig;

            }
            // end Update Eval

            // Move/Save Current Eval to Complete
            $scope.complete_evaluation_saved = false;
            $scope.complete_test = function () {

                // Build body content with Review details
                var msg_body = "";
                msg_body += '<p>Your performance review from ' + $scope.review.selected.date_entered + ' was recently completed. Please let us know how it went.</p>';
                // msg_body += '<p>[Add review details here.]</p>';
                msg_body += '<p><span class="message-service" service="SidekickRating" deliveredby="' + $scope.supervisorId + '" category="coaching" journalid="' + $scope.review.selected.review_id + '">Rate Your Interaction</span></p>';
                // end Build Body
                $scope.editFlag = false;
                $scope.createFlag = false;
                $scope.viewFlag = true;
                // api.postJS({
                //     lib: "perf",
                //     cmd: "send_message_test",
                //     messageto: $scope.agentId,
                //     subject: "Please Acknowledge and Rate Your Review",
                //     body: msg_body
                // }).then(function (json) {
                //     if (true) {
                    // $scope.evalSaved = true;
                        $scope.complete_evaluation_saved = true;
                        $("html, body").animate({ scrollTop: 0 }, "fast");
                        setTimeout(function () {
                            $scope.$apply(function () {
                                // $scope.evalSaved = false;
                                $scope.complete_evaluation_saved = false;
                            });
                        }, 3000);
                        // $log.log('Rating message sent for review id: ${$scope.review.selected.review_id}.')
                //     }
                // });
            }
            $scope.complete_evaluation = function () {
                api.postJS({
                    lib: 'perf',
                    cmd: 'create_complete_eval',
                    review_id: $scope.review.selected.review_id,
                    sup_eval_id: $scope.review.selected.sup_eval_id,
                    score: $scope.review.profile.score
                }).then(function (json) {

                    if (json.saved) {
                        $scope.$apply(function () {
                            $scope.editFlag = false;
                            $scope.createFlag = false;
                            $scope.viewFlag = true;
                            $scope.complete_evaluation_saved = true;

                            $("html, body").animate({ scrollTop: 0 }, "fast");
                            setTimeout(function () {
                                $scope.$apply(function () {
                                    // $scope.evalSaved = false;
                                    $scope.complete_evaluation_saved = false;
                                });
                            }, 3000);
                        });


                        // Build body content with Review details
                        var msg_body = "";
                        msg_body += '<p>Your performance review from ' + $scope.review.selected.date_entered + ' was recently completed. Please let us know how it went.</p>';
                        msg_body += '<p><span class="message-service" service="SidekickRating" deliveredby="' + $scope.supervisorId + '" category="coaching" journalid="' + $scope.review.selected.review_id + '">Rate Your Interaction</span></p>';
                        // end Build Body

                        // Rating Message
                        api.postJS({
                            lib: "perf",
                            cmd: "send_message_test",
                            messageto: $scope.agentId,
                            subject: "Please Acknowledge and Rate Your Review",
                            body: msg_body
                        }).then(function (json) {
                            if (true) {
                                $log.log('Rating message sent for review id: ${$scope.review.selected.review_id}.')
                            }
                        });
                        // end Rating Message
                    } else {

                    }
                });
            }
            // end Move/Save Current Eval to Complete

            // Current Evaluation Original
            api.getJS({
                lib: "perf",
                cmd: "loadCurrentEval",
                agent: $scope.agentId,
                supervisor: $scope.supervisorId
            }).then(function (json) {

                if (json.loaded) {
                    // $scope.currentEval = json.ev;

                    // $scope.$watch(function(){
                    // $scope.agentAnswers = $scope.currentEval.agent.answers;
                    // $scope.peerRecognition = $scope.currentEval.agent.recognition;
                    // $scope.supervisorAnswers = $scope.currentEval.supervisor.answers;
                    // $scope.evalSaved = false;
                    // });
                    // $scope.apply(function () {
                    //     if ($scope.agentAnswers == "") {
                    //         for (i in $scope.questionsSelf) {
                    //             var newquestion = {
                    //                 "idquestion": $scope.questionsSelf[i].id,
                    //                 "answer": ""
                    //             };
                    //             $scope.agentAnswers.push(newquestion);
                    //         }
                    //     }

                    //     if ($scope.supervisorAnswers == "") {
                    //         for (i in $scope.questionsSupervisor) {
                    //             var newquestion = {
                    //                 "idquestion": $scope.questionsSupervisor[i].id,
                    //                 "answer": ""
                    //             };
                    //             $scope.supervisorAnswers.push(newquestion);
                    //         }
                    //     }
                    // });

                }
            });
            // end Current Evaluation Original

            $(document).ready(function () {
                $("#new-when-date").datepicker({
                    dateFormat: 'mm/dd/yy',
                    changeDay: true,
                    changeMonth: true,
                    changeYear: true,
                    onSelect: function (date) {
                        $scope.review.selected.evaluation.goals.when_date = date;
                        $scope.$apply();
                        // $log.log($scope);
                    }
                });
                $("#new-when-date").click(function () {
                    if ($("#Body1").length > 0) {
                        var y_coord = $("#new-when-date").offset().top - $("#Body1").scrollTop();
                        var win_height = $(window).height();
                        var win_height_center = win_height/2;
                        if (y_coord < win_height_center) {
                            $("#ui-datepicker-div").css("top", (y_coord + 30) + "px");
                        } else {
                            $("#ui-datepicker-div").css("top", (y_coord - 215) + "px");
                        }
                    }
                });
            });

        });

        // 
        // Sidekick: One on One
        //

        $rootScope.$on('scheduleOneOnOne', function (event, result) {
            agent_id = result.filterkey.split("=")[1];

            $scope.$apply(function () {

                if (agent_id) {
                    person = $filter('filter')(json.me.csrs, {
                        uid: agent_id
                    })[0];
                    if (person) {
                        $scope.agentName = $scope.getUserName(agent_id, "agent");
                        $scope.one_on_one_agent_avatar = person.avatarpath;
                        $scope.one_on_one_modal = !$scope.one_on_one_modal;
                        $scope.modal_underlay = !$scope.modal_underlay;
                    }
                }

                $scope.meetingDate = "";
                $scope.startTime = "";
                $scope.endTime = "";
                $scope.meetingLocation = "";

                // Date Picker
                $("#datepicker").dateRangePicker({
                    format: 'MMMM D, YYYY',
                    singleDate: true,
                    inline: true,
                    container: '#datepicker',
                    alwaysOpen: true,
                    hoveringTooltip: false
                }).bind('datepicker-change', function (event, obj) {
                    var dateString = moment(obj.value).format("MMMM D, YYYY");
                    $scope.meetingDate = dateString;
                    $("#ooo-date").val(dateString);

                });

                // Inits timepicker() for both time inputs; Hacks the vertical placement of the select dropdown
                $(".timepicker").timepicker({
                    timeFormat: 'hh:mm p',
                    interval: 30,
                    minTime: '8',
                    maxTime: '17',
                    dynamic: true,
                    dropdown: true,
                    scrollbar: true,
                    zindex: 9992
                }).click(function () {
                    var rect = this.getBoundingClientRect();
                    var thisTopPos = rect.top;
                    var thisHeight = $(this).outerHeight();
                    var newTopPos = thisTopPos + thisHeight + "px";
                    $(".ui-timepicker-container").css("top", newTopPos);
                })

                // Resets all the inputs after a cancel or save
                $("#ooo-cancel, .confirmation-message .btn-modal-close").click(function (evt) {
                    evt.stopPropagation();
                    $('#datepicker').data('dateRangePicker').clear();
                    $("#ooo-date, #start-time, #end-time, #ooo-location").val("");
                    $("#datepicker .day").removeClass("hovering");
                    $scope.agentId = "";
                    $scope.meetingDate = "";
                    $scope.startTime = "";
                    $scope.endTime = "";
                    $scope.meetingLocation = "";
                    $scope.one_on_one_agent_avatar = "";
                    return false;
                });
                $("#ooo-submit").click(function () {
                    $scope.meetingDate = $("#ooo-date").val();
                    $scope.startTime = $("#start-time").val();
                    $scope.endTime = $("#end-time").val();
                    $scope.meetingLocation = $("#ooo-location").val();

                    if (($scope.meetingDate != "") && ($scope.startTime != "") && ($scope.endTime != "") && ($scope.meetingLocation != "")) {
                        api.postJS({
                            lib: "perf",
                            cmd: "addOneOnOneMeeting",
                            agent: result.filterkey.split("=")[1],
                            location: $scope.meetingLocation,
                            meetingDate: $scope.meetingDate,
                            meetingStartTime: $scope.startTime,
                            meetingEndTime: $scope.endTime
                        }).then(function (json) {
                            if (json.saved) {
                                $scope.$apply(function () {

                                });
                            }
                        });
                    }
                });

            });

        });
        // 
        // end Sidekick: One on One
        //
    });
    //
    // end getME: person, teams, csrs, evaluation, project
    //
    // }
    // end Agent Evaluation  

    //
    // Performance Review
    //    

    // Agents Filter and Search
    $('.tab_contents').hide();

    $('.tab').click(function (e) {
        var target = $(this.rel);
        $('.tab_contents').not(target).hide();
        target.toggle();

        $('.tab').not($(this)).removeClass('active');
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
        }

        e.stopPropagation();
        return false;
    });

    $(function () {
        $("#createReview").tabs();
        $(".observations-table").load("../applib/dev/PerfReview1/PerfReview1-view/observations-table.htm");
    });

    $scope.tab_select = function (num) {
        // Create New Review or Cancel Review always sets panels back to first tab
        $tabs.tabs('select', num);
    }

    // Next Button Functionality
    var $tabs = $('#createReview').tabs();
    $('#createReview .btn-next').each(function (i) {
        var $j = i + 1;
        $(this).click(function () {
            $tabs.tabs('select', $j);
        });
    });

} ]);



