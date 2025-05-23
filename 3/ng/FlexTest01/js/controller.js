// CONTROLLERS
angularApp.controller('legacyController', ['$scope', '$interval', '$http', 'legacy', 'hashtagnav', '$rootScope', 'api', '$log', function ($scope, $interval, $http, legacy, hashtagnav, $rootScope, api, $log) {

    legacy.init($scope); //Sets TPO cookies, enforces authentication, calls legacy .ready if present (only for dashboard).

    //$scope.LOGGED_IN - is shared with the embedded login directive.
    //$scope.LOG_OUT - logs you out.

    window.onload = function (e) { //Fires once all directives are loaded.
        setTimeout(function () {
            if ($scope.LOGGED_IN()) {

                $scope.Heading = "Flex Settings v1.0";

                /* WRITE THE APPLICATION HERE */
                api.getMe({
                    who: "ME",
                    members: ["person"]
                })
                    .then(function (json) {
                        $scope.$apply(function () {
                            //List and Form flags
                            $scope.init = function () {
                                $scope.overlay_show = true;
                                $scope.overlay_buttons = false;
                                $scope.overlay_message = "Loading";
                                $scope.flex_list_show = true;
                                $scope.flex_form_show = false;

                                $scope.flex_game_create = false;
                                $scope.flex_game_update = false;

                                $scope.me = json.me;
                                $scope.flex_settings_loaders = {};
                                $scope.flex_settings_loaders.game_list = false;
                                $scope.flex_settings_loaders.game = false;
                                $scope.flex_settings_loaders.theme = false;
                                $scope.flex_settings_loaders.date = false;
                                $scope.flex_settings_loaders.kpi = false;
                                $scope.flex_settings_loaders.kpi_range = false;
                                $scope.flex_settings_loaders.players = false;


                                // Objects and Arrays
                                $scope.flex = {};
                                $scope.flex.selected = {}; // Object for holding form data

                                $scope.flex.selected.theme = [{
                                    id: "",
                                    name: "",
                                    type: ""
                                }];

                                $scope.flex.selected.game_kpi = [{
                                    id: "",
                                    client: "",
                                    kpi: ""
                                }];

                                $scope.flex.kpi_ranges = [{
                                    master: {},
                                    value: {},
                                    values_modal: {}
                                }];
                                $scope.flex.kpi_ranges.header = ["Score", "Low", "High"];
                                $scope.flex.kpi_ranges.master = {};
                                $scope.flex.kpi_ranges.changed = false;
                                $scope.flex.kpi_ranges.saved = false;

                                // KPI
                                // Add KPI
                                $scope.add_flex_kpi = function () {
                                    api.postJS({
                                        lib: "ckraft",
                                        cmd: "add_flex_kpi",
                                        client_num: $scope.flex.selected.game_kpi.client,
                                        kpi_title: $scope.flex.kpi_new
                                    })
                                        .then(function (json) {
                                            if (true) {
                                                $scope.$evalAsync(function () {
                                                    $scope.flex.selected.game_kpi.added_success = true;
                                                    $scope.flex.kpi_new = "";
                                                    $scope.get_kpi();
                                                });
                                            }
                                        });
                                }

                                // Close Add KPI
                                $scope.close_add_flex_kpi = function () {
                                    // Automatically selected recently added
                                    let i = $scope.flex_kpi.length - 1;
                                    $scope.flex.selected.game_kpi.id = $scope.flex_kpi[i]["id"];
                                    $scope.flex.selected.game_kpi.client = $scope.flex_kpi[i]["client"];
                                    $scope.flex.selected.game_kpi.kpi = $scope.flex_kpi[i]["kpi_name"];

                                    $scope.flex.selected.game_kpi.added_success = false;
                                    $scope.flex.selected.game_kpi.modal_show = false;
                                    $scope.flex.kpi_new = '';
                                }

                                // Cancel Add KPI
                                $scope.cancel_add_flex_kpi = function () {
                                    $scope.flex.selected.game_kpi.added_success = false;
                                    $scope.flex.selected.game_kpi.modal_show = false;
                                    $scope.flex.kpi_new = '';
                                }
                                // Load Last Ranges
                                $scope.flex.kpi_ranges.load_last = function () {
                                    $scope.flex.kpi_ranges.values = angular.copy($scope.flex.kpi_ranges.master);
                                    $scope.flex.kpi_ranges.values_modal = angular.copy($scope.flex.kpi_ranges.master);
                                    $scope.flex.kpi_ranges.changed = false;
                                }

                                // Add Range Values
                                $scope.flex.kpi_ranges.add = function (i) {
                                    $scope.flex.kpi_ranges.values_modal.push({
                                        Score: "",
                                        Low: "",
                                        High: ""
                                    });
                                }

                                // Remove Range Values
                                $scope.flex.kpi_ranges.remove = function (i) {
                                    $scope.flex.kpi_ranges.values_modal.splice(i, 1);
                                }

                                // Save
                                $scope.flex.kpi_ranges.save_edit = function () {
                                    $scope.flex.kpi_ranges.values_modal.sort(function (a, b) {
                                        var textA = a.Score;
                                        var textB = b.Score;
                                        return (textB < textA) ? -1 : (textB > textA) ? 1 : 0;
                                    });
                                    $scope.flex.kpi_ranges.values = angular.copy($scope.flex.kpi_ranges.values_modal);
                                    $scope.flex.kpi_ranges.saved = true;
                                }

                                // Cancel
                                $scope.flex.kpi_ranges.cancel_edit = function () {
                                    $scope.flex.kpi_ranges.values_modal = angular.copy($scope.flex.kpi_ranges.values);
                                    $scope.flex.kpi_ranges.modal_show = false;
                                    $scope.flex.kpi_ranges.changed = false;
                                }

                                // Close
                                $scope.flex.kpi_ranges.close = function () {
                                    $scope.flex.kpi_ranges.modal_show = false;
                                    $scope.flex.kpi_ranges.saved = false;
                                    $scope.flex.kpi_ranges.changed = true;
                                }

                                // end KPI
                            }
                            $scope.init();
                            //
                            // Game List
                            //
                            $scope.get_game_list = function () {
                                if ($scope.me.person.uid) {
                                    api.getJS({ lib: "ckraft", cmd: "flex_game_list", admin_id: $scope.me.person.uid })
                                        .then(function (json) {
                                            $scope.$evalAsync(function () {
                                                if (true) {
                                                    $scope.flex.game_list = {};
                                                    $scope.flex.game_list.values = json.client.game_list;

                                                    $scope.flex.game_list.headers = [
                                                        "Name",
                                                        "Theme",
                                                        "Date Start",
                                                        "Date End",
                                                        "KPI Type"
                                                    ];

                                                    $scope.flex_settings_loaders.game_list = true;
                                                    $scope.overlay_show = false;
                                                    // $log.log(`flex_game_list: ${JSON.stringify(json.message)}`);
                                                }
                                            });
                                        });
                                }
                            }
                            $scope.get_game_list();
                            //
                            // end Game List
                            //

                            ///////////////////////
                            ///////////////////////
                            ///////////////////////

                            //
                            // Game
                            //

                            //
                            // Shared
                            //

                            // Close Overlay
                            $scope.overlay_close = function () {
                                $scope.overlay_show = false;
                                $scope.overlay_buttons = false;
                            }

                            // Get Theme
                            $scope.get_theme = function () {
                                api.getJS({ lib: "ckraft", cmd: "flex_theme" })
                                    .then(function (json) {
                                        $scope.$evalAsync(function () {
                                            $scope.flex_theme = json.client.theme;

                                            $scope.flex_settings_loaders.theme = true;
                                            // $log.log(JSON.stringify(json.message));
                                        });
                                    });
                            }



                            // Users/Players
                            $scope.get_players = function () {
                                if ($scope.me.person.uid) {
                                    api.getJS({
                                        lib: "ckraft",
                                        cmd: "flex_team_list",
                                        agent_id: $scope.me.person.uid
                                    })
                                        .then(function (json) {
                                            $scope.$evalAsync(function () {
                                                $scope.flex.players = {};
                                                $scope.flex.players.header = ['User ID', "Name"];
                                                $scope.flex.players.master = json.client.team_list;

                                                $scope.flex.players.modal_selected = [];

                                                $scope.flex.players.modal_available = angular.copy($scope.flex.players.master);

                                                $scope.flex.selected.players = [];

                                                $scope.addPlayer = function (num, id, ln, fn) {
                                                    $scope.flex.players.modal_selected.push({
                                                        user_id: id,
                                                        last_name: ln,
                                                        first_name: fn
                                                    });
                                                    $scope.flex.players.modal_available.sort(function (a, b) {
                                                        var textA = a.last_name.toUpperCase();
                                                        var textB = b.last_name.toUpperCase();
                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                    });
                                                    $scope.flex.players.modal_available.splice(num, 1);
                                                }

                                                $scope.removePlayer = function (num, id, ln, fn) {
                                                    $scope.flex.players.modal_available.push({
                                                        user_id: id,
                                                        last_name: ln,
                                                        first_name: fn
                                                    });
                                                    $scope.flex.players.modal_available.sort(function (a, b) {
                                                        var textA = a.last_name.toUpperCase();
                                                        var textB = b.last_name.toUpperCase();
                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                    });
                                                    // $log.log(`$scope.flex.players.modal_available: ${JSON.stringify($scope.flex.players.modal_available)}`);
                                                    $scope.flex.selected.players.splice(num, 1);
                                                };

                                                $scope.addAllPlayers = function() {
                                                    $scope.flex.selected.players = angular.copy($scope.flex.players.master);
                                                    $scope.flex.players.modal_available = [];
                                                }
                                                $scope.removeAllPlayers = function() {
                                                    $scope.flex.players.modal_available = angular.copy($scope.flex.players.master);
                                                    $scope.flex.selected.players = [];
                                                }

                                                $scope.flex.players.cancel = function () {
                                                    $scope.flex.players.modal_available = $scope.flex.players.modal_available.concat($scope.flex.players.modal_selected);
                                                    $scope.flex.players.modal_available.sort(function (a, b) {
                                                        var textA = a.last_name.toUpperCase();
                                                        var textB = b.last_name.toUpperCase();
                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                    });
                                                    $scope.flex.players.modal_selected = [];
                                                    $scope.flex.players.modal_show = false;
                                                }

                                                $scope.flex.players.save = function () {
                                                    $scope.flex.selected.players = $scope.flex.selected.players.concat($scope.flex.players.modal_selected);
                                                    $scope.flex.selected.players.sort(function (a, b) {
                                                        var textA = a.last_name.toUpperCase();
                                                        var textB = b.last_name.toUpperCase();
                                                        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                    });
                                                    $scope.flex.players.modal_selected = [];
                                                    $scope.flex.players.modal_show = false;
                                                }

                                                // Flags
                                                $scope.flex.players.modal_show = false;
                                                $scope.flex_settings_loaders.players = true;
                                                // $scope.overlay_show = !$scope.flex_settings_loaders.players;
                                                // $log.log(`flex_team_list: ${JSON.stringify(json.message)}`);
                                            });

                                        });
                                }
                            }
                            $scope.get_players();
                            // end Users/Players


                            //
                            // end Shared
                            //


                            // Get KPI 
                            $scope.get_kpi = function () {
                                api.getJS({
                                    lib: "ckraft",
                                    cmd: "flex_kpi",
                                    // only brings back KPI titles with associated client number
                                    client_num: $scope.me.person.client
                                })
                                    .then(function (json) {
                                        if (true) {
                                            $scope.$evalAsync(function () {
                                                // $log.log(`json.client.kpi: ${JSON.stringify(json.client.kpi)}`);
                                                $scope.flex_kpi = json.client.kpi;
                                                $scope.flex_settings_loaders.kpi = true;
                                                // $log.log(JSON.stringify(json.message));
                                            });
                                        }
                                    });
                            }
                            $scope.get_kpi();
                            //
                            // Cancel Create or Update
                            //
                            $scope.cancel_create_update = function () {
                                // $scope.overlay_show = true;

                                // $scope.flex.selected.theme = {};
                                // $scope.flex.selected.game_kpi = {};
                                // $scope.flex.kpi_ranges = {};
                                // $scope.flex.selected.players = [];
                                // $scope.flex.selected.game = {};
                                // $scope.flex.selected.date_start = "";
                                // $scope.flex.selected.date_end = "";
                                // $scope.flex.selected.player_list = {};

                                // $scope.flex.to_save = {};

                                $scope.init();
                                $scope.get_game_list();
                                $scope.get_players();
                                $scope.get_kpi();

                            }
                            //
                            // end Cancel Create or Update
                            //

                            //
                            // Create New Game
                            //
                            $scope.create_game = function () {
                                $scope.flex_game_create = true;

                                $scope.flex_list_show = !$scope.flex_list_show;
                                $scope.flex_form_show = !$scope.flex_form_show;
                                $scope.page_title = "Create Game";

                                $scope.get_theme();

                                // Default Filler KPI Range
                                $scope.flex.kpi_ranges.values = [{
                                    Score: 0,
                                    Low: 0,
                                    High: 0.9999
                                },
                                {
                                    Score: 1,
                                    Low: 1,
                                    High: 1.9999
                                },
                                {
                                    Score: 2,
                                    Low: 2,
                                    High: 2.9999
                                }
                                ];
                                $scope.flex_settings_loaders.kpi_range = true;
                                $scope.flex.kpi_ranges.values_modal = angular.copy($scope.flex.kpi_ranges.values);
                                $scope.flex.kpi_ranges.master = angular.copy($scope.flex.kpi_ranges.values);
                            }

                            //
                            // end Create New Game
                            //

                            //
                            // Load Existing Game
                            //
                            $scope.load_game = function (game_id) {
                                $scope.flex_game_update = true;

                                $scope.flex_list_show = !$scope.flex_list_show;
                                $scope.flex_form_show = !$scope.flex_form_show;
                                $scope.overlay_show = true;
                                $scope.overlay_message = "Loading";

                                // set form page title
                                $scope.page_title = "Edit Game";

                                api.getJS({
                                    lib: "ckraft",
                                    cmd: "flex_game",
                                    game_id: game_id
                                })
                                    .then(function (json) {
                                        $scope.$evalAsync(function () {

                                            $scope.flex.selected.game = angular.copy(json.client.game);
                                            $scope.selected = $scope.flex.selected.game[0];

                                            //
                                            // Theme
                                            //
                                            $scope.get_theme();

                                            $scope.flex.selected.theme.id = $scope.flex.selected.game[0]["theme_id"];
                                            $scope.flex.selected.theme.name = $scope.flex.selected.game[0]["name"] ? $scope.flex.selected.game[0]["name"] : $scope.flex.selected.theme.name;
                                            $scope.flex.selected.theme.type = $scope.flex.selected.game[0]["game_finish_type"];
                                            $scope.flex_settings_loaders.theme = true;
                                            //
                                            // end Theme
                                            //


                                            //
                                            // Date
                                            //
                                            $scope.flex.selected.date_start = $scope.flex.selected.game[0]["game_startdate"];
                                            $scope.flex.selected.date_end = $scope.flex.selected.game[0]["game_enddate"];
                                            $scope.flex_settings_loaders.date = true;
                                            //
                                            // end Date
                                            //

                                            //
                                            // KPI
                                            //

                                            $scope.flex.selected.game_kpi.id = $scope.flex.selected.game[0]["kpi_acuity_mqf"];
                                            $scope.flex.selected.game_kpi.client = $scope.flex.selected.game[0]["client"];
                                            $scope.flex.selected.game_kpi.kpi = $scope.flex.selected.game[0]["game_kpi_name"];
                                            $scope.flex_settings_loaders.kpi = true;
                                            $scope.flex.selected.game_kpi.added_success = false;

                                            // $scope.get_flex_kpi();
                                            //
                                            // end KPI
                                            //


                                            //
                                            // KPI Range
                                            //
                                            api.getJS({
                                                lib: "ckraft",
                                                cmd: "flex_kpi_range",
                                                game_id: game_id
                                            })
                                                .then(function (json) {
                                                    if (true) {
                                                        $scope.$evalAsync(function () {
                                                            // $scope.flex.kpi_ranges = {};
                                                            // $scope.flex.kpi_ranges.header = ["Score", "Low", "High"];
                                                            $scope.flex.kpi_ranges.master = json.client.kpi_range;
                                                            $scope.flex.kpi_ranges.values_modal = angular.copy($scope.flex.kpi_ranges.master);
                                                            $scope.flex.kpi_ranges.values = angular.copy($scope.flex.kpi_ranges.master);

                                                            $scope.flex.kpi_ranges.changed = false;
                                                            $scope.flex.kpi_ranges.saved = false;

                                                            $scope.flex_settings_loaders.kpi_range = true;
                                                            $scope.overlay_show = !$scope.flex_settings_loaders.kpi_range;
                                                            // $log.log(`flex_kpi_range: ${JSON.stringify(json.message)}`);
                                                        });
                                                    }
                                                });
                                            //
                                            // end KPI Range
                                            //

                                            // Selected Player List
                                            api.getJS({
                                                lib: "ckraft",
                                                cmd: "flex_player_list",
                                                game_id: game_id
                                            })
                                                .then(function (json) {
                                                    if (true) {
                                                        $scope.$evalAsync(function () {
                                                            $scope.flex.selected.player_list = json.client.player_list;
                                                            if ($scope.flex.selected.player_list.length > 0) {

                                                                var playerList = $scope.flex.selected.player_list.map(function (pl) {
                                                                    return pl.user_id;
                                                                });
                                                                $scope.flex.players.modal_selected = $scope.flex.players.master.filter(function (ml) {
                                                                    return playerList.indexOf(ml.user_id) >= 0;
                                                                });
                                                                $scope.flex.players.modal_available = $scope.flex.players.master.filter(function (ml) {
                                                                    return playerList.indexOf(ml.user_id) < 0;
                                                                });
                                                                
                                                                $scope.flex.players.modal_available.sort(function (a, b) {
                                                                    var textA = a.last_name.toUpperCase();
                                                                    var textB = b.last_name.toUpperCase();
                                                                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                                                                });
                                                                $scope.flex.selected.players = $scope.flex.players.modal_selected;
                                                                $scope.flex.players.modal_selected = [];
                                                            } else {
                                                                $scope.flex.players.modal_selected = [];
                                                            }
                                                            // $log.log(`flex_player_list: ${JSON.stringify(json.message)}`);
                                                        });
                                                    } else {
                                                        // $log.log("No players returned.");
                                                    }
                                                });


                                        });

                                        // $log.log(`flex_game: ${JSON.stringify(json.message)}`);
                                    });
                                $scope.flex_settings_loaders.game = true;

                            };
                            //
                            // end Load Existing Game
                            //
                            // Create
                            $scope.save_create = function () {
                                $scope.overlay_message = "Saving";
                                $scope.flex_settings_loaders.saving = true;
                                $scope.overlay_show = true;

                                $scope.flex.to_save = {
                                    name: $scope.flex.selected.theme.name,
                                    theme_id: $scope.flex.selected.theme.id,
                                    game_finish_type: $scope.flex.selected.theme.type,
                                    admin_user_id: $scope.me.person.uid,
                                    game_kpi_name: $scope.flex.selected.game_kpi.kpi,
                                    kpi_acuity_mqf: $scope.flex.selected.game_kpi.id,
                                    game_startdate: $scope.flex.selected.date_start ? $scope.flex.selected.date_start : "empty",
                                    game_enddate: $scope.flex.selected.date_end ? $scope.flex.selected.date_end : "empty",
                                    client: $scope.me.person.client,
                                    entby: $scope.me.person.uid,
                                    kpi_ranges: angular.copy($scope.flex.kpi_ranges.values),
                                    players: angular.copy($scope.flex.selected.players)
                                };

                                api.postJS({
                                    lib: "ckraft",
                                    cmd: "flex_save_add",
                                    save_data: $scope.flex.to_save
                                })
                                    .then(function (json) {
                                        $scope.$evalAsync(function () {
                                            if (true) {
                                                $scope.flex_settings_loaders.saving = false;
                                                $scope.overlay_message = "Game Created";
                                                $scope.overlay_buttons = true;
                                                // $log.log(JSON.stringify(json.message));
                                            }
                                        });
                                    });
                                $scope.flex_game_create = false;
                                $scope.flex_game_update = true;
                            };
                            // Update
                            $scope.save_update = function () {
                                $scope.overlay_message = "Saving";
                                $scope.flex_settings_loaders.saving = true;
                                $scope.overlay_show = true;

                                $scope.flex.to_save = {
                                    id: $scope.flex.selected.game[0].id,
                                    name: $scope.flex.selected.theme.name,
                                    theme_id: $scope.flex.selected.theme.id,
                                    game_finish_type: $scope.flex.selected.theme.type,
                                    admin_user_id: $scope.me.person.uid,
                                    game_kpi_name: $scope.flex.selected.game_kpi.kpi,
                                    kpi_acuity_mqf: $scope.flex.selected.game_kpi.id,
                                    game_startdate: $scope.flex.selected.date_start ? $scope.flex.selected.date_start : "empty",
                                    game_enddate: $scope.flex.selected.date_end ? $scope.flex.selected.date_end : "empty",
                                    kpi_ranges: angular.copy($scope.flex.kpi_ranges.values),
                                    players: angular.copy($scope.flex.selected.players)
                                };

                                api.postJS({
                                    lib: "ckraft",
                                    cmd: "flex_save_update",
                                    save_data: $scope.flex.to_save
                                })
                                    .then(function (json) {
                                        $scope.$evalAsync(function () {
                                            if (true) {
                                                $scope.flex_settings_loaders.saving = false;
                                                $scope.overlay_message = "Game Saved";
                                                $scope.overlay_buttons = true;
                                            }
                                        });
                                    });
                            };
                            // Delete
                            $scope.delete_game = function (game_id) {
                                $scope.overlay_message = "Deleting";
                                $scope.flex_settings_loaders.deleting = true;
                                $scope.overlay_show = true;

                                api.getJS({
                                        lib: "ckraft",
                                        cmd: "flex_delete_game",
                                        game_id: game_id
                                    })
                                    .then(function(json) {
                                        $scope.$evalAsync(function() {
                                            if (true) {
                                                $scope.flex_settings_loaders.deleting = false;
                                                $scope.overlay_show = false;
                                                // $log.log(JSON.stringify(json.message));
                                            }
                                        });
                                    });
                            }
                        });
                    });
            }
        }, 1000);
    };

}]);
angularApp.directive('datepicker', function () {
    return function (scope, element, attrs) {
        element.datepicker({
            inline: true,
            dateFormat: 'm/d/yy',
            minDate: 0
        });
    }
});
angularApp.directive('flexSet', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attr) {
            // element.prepend(`<h2>${attr.title}</h2>`);
            element.prepend("<h2>" + attr.title + "</h2>");
        }
    };
});