//Fan 1.0 - Initial A-Game with Multiple Themes
//ko.components.register
//standingsSave Enhancements

//function NOTHINGNESS('component-fan', {
//    template: { element: $(".fan-wrapper")[0] },
//    viewmodel: function () {

var finalsoverride = [];
var playerhome_loaded = false;

function FanViewModel(o) {
    var self = this;
    
    var currentwins = 0;
    var activeisland = 0;

    var firsttime = true;

    var firstdraftset = true;

    var incardview = false;
    var dragons_popup_shown = false;

    if (a$.urlprefix() == "walgreens.") {
        $(".bkt-clugue-1").attr("style","margin-top: -350px;margin-left: 430px");
        $(".bkt-clugue-2").attr("style", "margin-top: -320px;margin-left: 400px");
    }
    else {
        $(".bkt-clugue").attr("style","");
    }

    function specialteam() {
        ospecialteam(   /* TODO: (draftteamowner() && ((a$.urlprefix() == "cox.")||(a$.urlprefix() == "cox-mnt-julie."))) || */
        (((CSR == "")||(CSR == "each")) && (Role == "Team Leader") && ((a$.urlprefix() == "cox.")||(a$.urlprefix() == "cox-mnt-julie."))));
        return ospecialteam();
    }

    var testq = "";
    var testdateoffset = 0;
    var message_added_prompt = false;
    var debug = false; //DEBUG: Setting theme to basketball to get a good media view
    var DashboardLinking = false;
    
    var FannameSave = "";

    var PlayerHomeRedirect = false;
    var playerhome_weekid = 1;
    var bTeamInActiveGame_withDelay = false;

    var MapRedirect = false;

    var flip = false;

    var playerhomepositionset = false;

    var bLastPosition = false; //Special flag for player home position play clugue.

    /*
    function resizeIFrameToFitContent( iFrame ) {
        iFrame.width  = iFrame.contentWindow.document.body.scrollWidth + 20;
        iFrame.height = 1000 + iFrame.contentWindow.document.body.scrollHeight;
    }

    window.addEventListener('DOMContentReady', function(e) {
            var iFrame = document.getElementById( 'TeamOwnerGuideIframe' );
            resizeIFrameToFitContent( iFrame );
    } );
    */

    var draftloaded = false;
    var earlyrelease = false;
    var prerelease = true; //To allow for first Deliverable to exclude certain screens.

    var masterLeagues = [];


    $(".agame-select-standings").bind("click", function() {
        selectedSection("Standings");
        return false;
    });

    var DraftSubscriber = false; //Set by call to "getdraftsubscribers"
    var DraftSubscriberLeague;

    var subscriber = {
        subscribed: false,
        leagueid: 0,
        pickmethod: "",
        pickfilter: "",
        roomprefix: "0",
        leaguename: "",
        teamname: "",
        draftdate: "",
        teamid: 0,
        teamsid: 0,
        emptyslots: 0,
        position: 0
    }

    var draftonly = false;

    var you_were_in_room = false;

    var draftRoomLongTimer;

    var positionChanged = "N";
    var positionName = "";

    var refresh_standings = true;
    var return_to_map = false;
    
    var standingsSave = null;

    var playerLoaded = false;
    var player = {
        id: ""
    };

    var prevEventSig = "";
    var prevTop5Sig = "";
    var eventSigs = {};
    var top5Sigs = {};
    var drawEID = null;
    var drawTID = null;
    var eventsplayershowing = false;

    var firstevent = "100 Meter Dash";
    if (o.theme == "football") {
        firstevent = "QB";
    } else if (o.theme == "soccer") { //TODO: Set first position when you know what it is (this is shameful)
        firstevent = "Goalie";
    } else if (o.theme == "basketball") { //TODO: Set first position when you know what it is (this is shameful)
        firstevent = "Center";
    } else if (o.theme == "tiki") { //TODO: Set first position when you know what it is (this is shameful)
        firstevent = "Bartender";
    }
    else if (o.theme == "dragons") { //TODO: Set first position when you know what it is (this is shameful)
        firstevent = "Knight";
    }

    //Game settings
    self.eventsDivision = ko.observable("0");
    self.gametype = ko.observable(""); //team or individual  basketball&football=team, olympics&crit=individual
    self.playerassignment = ko.observable(""); // auto, supervisor  basketball&football&crit=supervisor, olympics=auto
    self.positionmode = ko.observable(""); //fill, auto, unrestricted (lock date is handled server-side)  basketball&football=fill, olympics=auto, crit=unrestricted
    self.draftdate = ko.observable("<Draft Time Not Set>");
    
    self.mapzoomed = ko.observable(false);

    if (a$.gup("mapzoomed")=="1") {
        self.mapzoomed(true);
    }

    self.therearescores = ko.observable(true); //Set to true once there are scores.
    
		self.zoommap = function(tf) {
    	self.mapzoomed(tf);
    	/* full screen fullscreen mode (disabled for now)
			if (tf) {
				$("#AllAgame").appendTo("#AgameOverlay"); 
				$("#AgameOverlay").show();				
				ko.postbox.publish("ResizeWindow", true);
			}
			else {
				$("#AllAgame").appendTo("#tabs-17");
				$("#AgameOverlay").hide();
			}
			*/
    }

    var teamscrollcluge = true; //2016-07-31 CLUGUE because of some scrolling issue on startup.

    //The wreath paths, so they only need to be defined once.

    var inplayoffs = true; //TODO: Sense whether or not we're in playoffs.  This is complex since we want to continue to display for an indeterminant time after the season is over.
    self.theme = ko.observable(""); //TODO: The theme (and gametype) is still hard-coded because it's hard to tell by client what it should be (in many cases).

    if (a$.exists(o)) {
        if (a$.exists(o.test)) {
            if (o.test) {
                testq = "TEST"; //String to insert here FAN<testq>_LEAGUES
            }
        }
        if (a$.exists(o.draftonly)) {
            if (o.draftonly) {
                draftonly = true;
            }
        }
        if (a$.exists(o.testdateoffset)) {
            if (o.testdateoffset) {
                testdateoffset = o.testdateoffset; //String to insert here FAN<testq>_LEAGUES
            }
        }
        if (a$.exists(o.inplayoffs)) {
            inplayoffs = o.inplayoffs;
        }
        if (a$.exists(o.theme)) {
            theme(o.theme);
        }
    }

    if (theme() == "") {
        if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "cthix.") || (a$.urlprefix() == "ces.")) {
            theme("basketball");
        } else if ((a$.urlprefix() == "make40.") || (a$.urlprefix() == "make.")) {
            theme("summer olympics");
        } else {
            theme("football");
        }
    }

    //Always show the island chain by default if the theme is tiki.
    if ((theme() == "tiki") /* ||(theme()=="football") */) { //((a$.urlprefix() == "frost-arnett.") || (a$.urlprefix() == "frost-arnett-mnt.") || (a$.urlprefix() == "ers-mnt-julie.")) {
        MapRedirect = 2; //This is for the first direct to player home.
    }

    //scheduling is also a variable.
    //positionmode based on ability/experience turns it into a TT-type game.
    switch (theme()) {
        case "football":
        case "basketball":
        case "soccer":
        case "tiki":
        case "unicorn":
        case "dragons":
        case "hits":
            gametype("team");
            playerassignment("supervisor");
            positionmode("fill");
            break;
        case "summer olympics":
            gametype("individual");
            playerassignment("auto");
            positionmode("auto");
            //theme("basketball"); //So I get some better looks for a demo.
            break;
        case "crit": //placeholder for a level-based individual game with variable play.
            gametype("individual");
            playerassignment("supervisor"); //could players self-assign?  Not sure we'd want this..
            positionmode("unrestricted");
            break;
        default:
            alert("unrecognized theme");
            return;
    }

    //CONFIG is flexible.  Can be a document var or a pubsub.
    var CONFIG = "";
    if (a$.exists(document.CONFIG)) { //Needs to be set before applyBindings.
        CONFIG = document.CONFIG;
    }
    ko.postbox.subscribe("CONFIG", function(newValue) {
        CONFIG = newValue;
    });

    ko.postbox.subscribe("Fan_PlayerSetup", function(newValue) {
        selectSection("Player Setup");
    });

    var sj = null;
    var canvi = [];
    var colorpickersmade = false;
    var top5timeout;
    var tvstarted = false;
    var scoresstarted = false;
    var statsstarted = false;
    var gameinplay = "UNKNOWN";
    var senttoplayoffs = false;
    var uid = Math.floor(Math.random() * 26) + datenow();

    self.plusColumns = [{
            name: "MVP",
            expand: false
        },
        {
            name: "MIP",
            expand: false
        },
        {
            name: "During Season",
            expand: false
        },
        {
            name: "Prior to Season",
            expand: false
        },
        {
            name: "Details",
            expand: false
        }
    ];

    //self.sections = ko.observableArray([
    //{ name: "Divisions" },
    //{ name: "Standings" }
    //]);
    self.showStartingLineup = ko.observable(false);
    self.showCommunity = ko.observable(false);
    self.showBrackets = ko.observable(false);
    self.fantasyViewable = ko.observable(false); //Is there a fantasy team that is actively playing (post-draft) - see the Roles section for setup.
    self.fantasyViewing = ko.observable("N"); //Am I currently viewing the fantasy leagues.
    //2024-02-06
    //TODO: Use game state to determine if fantasyDraftPending is true.
    self.fantasyDraftPending = ko.observable(true); //If fantasy draft is pending, then make landing page this selection instead of Standings.
    self.fanStatsLoaded = ko.observable(false);

    var mysections = {};

    if (false) { //(a$.urlprefix() == "bgr.") {
        draftonly = true; //dbg
    } else {
        draftonly = false;
    }

    if (draftonly) {
        //PRE-DRAFT MENU
        mysections.list = [
            //{ name: "< Home Division", show: false, sublist: [] },
            //{ name: "Hm", show: CONFIG != "Dashboard", sublist: [] },
            //{ name: "TV", show: (gametype() == "team"), sublist: [] },
            {
                name: "Xtreme",
                show: self.fantasyDraftPending(),
                sublist: [{
                        name: "Owner Home",
                        show: true
                    },
                    {
                        name: "Owner Setup",
                        show: true
                    },
                    {
                        name: "Team Settings",
                        show: true
                    },
                    {
                        name: "Team Owner Guide",
                        show: true
                    }
                ]
            },
            {
                name: "Schedule",
                show: true,
                sublist: []
            }, //SPECIAL SCHEDULE PLACEMENT.
            //{ name: "PLAYOFFS", show: inplayoffs, sublist: [] },
            //{ name: "Player", show: true, sublist: [
            //        { name: "Player Home", show: true },
            //        //{ name: "Events", show: (gametype() == "individual") },  //Uncomment if we get submenu items to be hideable.
            //        { name: "Player Setup", show: true }
            //    ]
            //},
            //{ name: "Team", show: true, sublist: [
            //        { name: "Matchup", show: (gametype() == "team") },
            //        { name: "Roster", show: true },
            //        { name: "Schedule", show: (gametype() == "team") },
            //        {name: "Team Setup", show: true }
            //    ]
            //},
            //{ name: "League", show: true, sublist: [
            //        { name: "Scores", show: true },
            //        { name: "Standings", show: true },
            //        { name: "Divisions", show: (gametype() == "team") }
            //    ]
            //},
            //{ name: "Position Play", show: false, sublist: [] },
            //{ name: "Stats", show: (theme() != "summer olympics"), sublist: [
            //        { name: "Stats", show: (theme() != "summer olympics"), },
            //        { name: "Position Play", show: (gametype() == "team") }
            //    ]
            //},
            {
                name: "Resources",
                show: true,
                sublist: [{
                        name: "Rules",
                        show: true
                    },
                    {
                        name: "FLEX User Guide",
                        show: true
                    }
                    //        { name: "League Admin", show: true }
                    //        { name: "Team Owner Guide", show: true }
                ]
            }
        ];
    } else {
        //POST-DRAFT Menu
        if (!prerelease) { //This is the section that will be FINAL.
            mysections.list = [{
                    name: "< Home Division",
                    show: false,
                    sublist: []
                },
                //{ name: "Hm", show: CONFIG != "Dashboard", sublist: [] },
                //{ name: "TV", show: (gametype() == "team"), sublist: [] },
                {
                    name: "Xtreme",
                    show: self.fantasyDraftPending(),
                    sublist: [{
                            name: "Owner Home",
                            show: true
                        },
                        {
                            name: "Owner Setup",
                            show: true
                        },
                        {
                            name: "Team Settings",
                            show: true
                        },
                        {
                            name: "Team Owner Guide",
                            show: true
                        }
                    ]
                },
                {
                    name: "Player",
                    show: true,
                    sublist: [{
                            name: "Player Home",
                            show: false
                        },
                        //{ name: "Events", show: (gametype() == "individual") },  //Uncomment if we get submenu items to be hideable.
                        {
                            name: "Player Setup",
                            show: true
                        }
                    ]
                },
                {
                    name: "PLAYOFFS",
                    show: inplayoffs,
                    sublist: []
                },
                {
                    name: "Team",
                    show: true,
                    sublist: [{
                            name: "Matchup",
                            show: (gametype() == "team")
                        },
                        {
                            name: "Roster",
                            show: true
                        },
                        {
                            name: "Schedule",
                            show: (gametype() == "team")
                        },
                        {
                            name: "Team Setup",
                            show: true
                        },
                        {
                            name: "Player Setup",
                            show: true
                        }
                    ]
                },
                {
                    name: "League",
                    show: true,
                    sublist: [{
                            name: "Scores",
                            show: true
                        },
                        {
                            name: "Standings",
                            show: true
                        },
                        {
                            name: "Map",
                            show: true
                        },
                        {
                            name: "Stats",
                            show: (theme() != "summer olympics")
                        },
                        {
                            name: "Xtreme Leaderboard",
                            show: true
                        }
                        //{ name: "Divisions", show: (gametype() == "team") }
                    ]
                },
                //{ name: "Position Play", show: (gametype() == "team"), sublist: [] },
                {
                    name: "Stats",
                    show: (theme() != "summer olympics"),
                    sublist: [{
                            name: "Stats",
                            show: (theme() != "summer olympics"),
                        },
                        {
                            name: "Position Play",
                            show: (gametype() == "team")
                        }
                    ]
                },
                {
                    name: "FLEX",
                    show: self.fantasyDraftPending(),
                    sublist: [
                    /*
                        {
                            name: "Flex Game Listing",
                            show: true
                        }
                    */
                    ]
                },
                {
                    name: "Resources",
                    show: true,
                    sublist: [{
                            name: "Rules",
                            show: true
                        },
                        {
                            name: "FLEX User Guide",
                            show: true
                        },
                        {
                            name: "League Admin",
                            show: true
                        }
                        //{ name: "Team Owner Guide", show: true }
                    ]
                }
            ];
        } else { //This is the first DELIVERABLE that will be visible (eliminates screens that aren't complete yet).
            mysections.list = [{
                    name: "< Home Division",
                    show: false,
                    sublist: []
                },
                //{ name: "Hm", show: CONFIG != "Dashboard", sublist: [] },
                //{ name: "TV", show: (gametype() == "team"), sublist: [] },
                {
                    name: "Xtreme",
                    show: self.fantasyDraftPending(),
                    sublist: [{
                            name: "Owner Home",
                            show: true
                        },
                        {
                            name: "Owner Setup",
                            show: true
                        },
                        {
                            name: "Team Settings",
                            show: true
                        },
                        {
                            name: "Team Owner Guide",
                            show: true
                        }
                    ]
                },
                {
                    name: "Player",
                    show: true,
                    sublist: [{
                            name: "Player Home",
                            show: true
                        },
                        //{ name: "Events", show: (gametype() == "individual") },  //Uncomment if we get submenu items to be hideable.
                        {
                            name: "Player Setup",
                            show: true
                        }
                    ]
                },
                {
                    name: "PLAYOFFS",
                    show: inplayoffs,
                    sublist: []
                },
                {
                    name: "Team",
                    show: true,
                    sublist: [{
                            name: "Matchup",
                            show: (gametype() == "team")
                        },
                        {
                            name: "Roster",
                            show: true
                        },
                        {
                            name: "Schedule",
                            show: (gametype() == "team")
                        },
                        {
                            name: "Player Setup",
                            show: true
                        }
                    ]
                },
                {
                    name: "Position Play",
                    show: true /*( $.cookie("TP1Role") == "CSR") || ( $.cookie("TP1Role") == "Team Leader")*/ ,
                    sublist: []
                },
                {
                    name: "League",
                    show: true,
                    sublist: [{
                            name: "Scores",
                            show: true
                        },
                        {
                            name: "Standings",
                            show: true
                        },
                        {
                            name: "Map",
                            show: true
                        },
                        {
                            name: "Stats",
                            show: (theme() != "summer olympics")
                        },
                        {
                            name: "Xtreme Leaderboard",
                            show: true
                        }
                        //{ name: "Divisions", show: (gametype() == "team") }
                    ]
                },
                /*
                { name: "Stats", show: (theme() != "summer olympics"), sublist: [
                        { name: "Stats", show: (theme() != "summer olympics") }
                        //{ name: "Position Play", show: (gametype() == "team") }
                    ]
                },
                */
                {
                    name: "FLEX",
                    show: self.fantasyDraftPending(),
                    sublist: [
                        /*
                        {
                            name: "Flex Game Listing",
                            show: true
                        }
                        */
                    ]
                },
                {
                    name: "Resources",
                    show: true,
                    sublist: [{
                            name: "Rules",
                            show: true
                        },
                        {
                            name: "FLEX User Guide",
                            show: true
                        }
                        //{ name: "League Admin", show: true }
                        //{ name: "Team Owner Guide", show: true }
                    ]
                }
            ];
        }
    }

    //No Hoops Map or map block in player home.
    if (self.theme() == "basketball") {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "League") {
                for (var j in mysections.list[i].sublist) {
                    if (mysections.list[i].sublist[j].name == "Map") {
                        mysections.list[i].sublist.splice(j,1);
                    }
                }
            }
        }
        $(".map-basketball").hide();
    }

    if (a$.urlprefix() == "walgreens.") {
        /*
        for (var i in mysections.list) {
            if (mysections.list[i].name == "FLEX") {
                mysections.list.splice(i, 1);
            }
        }
        */

        if ($.cookie("TP1Role") == "CSR") {
            for (var i in mysections.list) {
                if (mysections.list[i].name == "League") {
                    for (var j in mysections.list[i].sublist) {
                        if (mysections.list[i].sublist[j].name == "Stats") {
                            mysections.list[i].sublist.splice(j,1);
                        }
                    }
                }
            }
            //$(".agame-roster-table1").css("width","1400px!important"); //Couldn't get this to work as a data-bind.  Doesn't work here either.
            $('.agame-roster-table1').attr('style', 'width: 1400px!important'); //This works.
        }
    }

    //No Position Play until later.  HARD CODE POSITION PLAY TURNED OFF UNTIL THIS CAN BE FIGURED OUT

    if (false) { //}(!(a$.urlprefix() == "make40.")) {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "Position Play") {
                mysections.list.splice(i, 1);
            }
        }
        sectionsShowHide("Position Play", false);
    }

    if ($.cookie("TP1Role") != "CSR") {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "Resources") {
                mysections.list[i].sublist.push({
                    name: "Supervisor Guide",
                    show: true
                });
            }
        }
    }
    

    /*
    if (($.cookie("TP1Username").toLowerCase() != "jeffgack") && ($.cookie("TP1Username").toLowerCase() != "jfield") && ($.cookie("TP1Username").toLowerCase() != "gsalvato"))  {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "Player Home") {
                mysections.list.splice(i,1);
            }
        }
    }
    */

    if ((($.cookie("TP1Role") != "Team Leader") && ($.cookie("TP1Role") != "CSR")) || ($.cookie("TP1Username").toLowerCase() == "syanez")) {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "Resources") {
                mysections.list[i].sublist.push({
                    name: "League Admin",
                    show: true
                });
            }
        }
    }
    //TODO: Make a meaning for player setup
    if (($.cookie("TP1Role") == "Team Leader")&&(a$.urlprefix() != "cox.")) { //MAKEDEV
        for (var i in mysections.list) {
            if (mysections.list[i].name == "Player") {
                mysections.list.splice(i, 1);
            }
        }
    }

    //TODO: Need a global setting for when XTreme isn't being used.
    if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "Xtreme") {
                mysections.list.splice(i, 1);
            }
        }
    }

    if (false) { //ALWAYS SHOW FLEX NOW.  ((a$.urlprefix() != "cox.") && (a$.urlprefix() != "chime.") && (a$.urlprefix() != "veyo.") && (a$.urlprefix() != "bgr.") && (a$.urlprefix() != "km2.") && (a$.urlprefix() != "sunpro.") && (a$.urlprefix() != "ers.")) {
        for (var i in mysections.list) {
            if (mysections.list[i].name == "FLEX") {
                mysections.list.splice(i, 1);
            }
        }
    }

    if (prerelease) {
        if ($.cookie("TP1Role") != "CSR") {
            for (var i in mysections.list) {
                if (mysections.list[i].name == "Team") {
                    mysections.list[i].sublist.push({
                        name: "Team Setup",
                        show: true
                    });
                }
            }
        }
    }

    function xtremePresentQueue() {
        var sel = ".headericon-agame-xtreme";
        $(sel).css("cursor", "default").unbind();
        if (subscriber.subscribed || draftteamowner()) {
            if (CSR != "") { //TODO: A couple of tests:  Is the person already in my queue, and is the csr eligible to be in my queue.
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getDraftQueueState",
                        CSR: CSR,
                        leagueid: subscriber.leagueid,
                        region: subscriber.region,
                        locations: subscriber.locations,
                        draftteamowner: draftteamowner()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: gotState //TODO: See if you can hook up this "progress" member, it would be very cool.
                });

                function gotState(json) {
                    if (a$.jsonerror(json)) {} else {
                        if (json.inq) {
                            $(sel).show().html('<div class="fan-xtreme-text fan-xtreme-text-yellow"><i class="far fa-clock"></i> Player Queued</div>');
                        } else if (json.eligible) {
                            if (draftteamowner()) {
                                $(sel).show().html('<div class="fan-xtreme-text fan-xtreme-text-green"><i class="fa fa-plus"></i> ADD TO DRAFT LIST</div>');
                            } else {
                                $(sel).show().html('<div class="fan-xtreme-text fan-xtreme-text-green"><i class="fa fa-plus"></i> ADD PLAYER</div>');
                            }
                            $(sel).css("cursor", "pointer").bind("click", function() {
                                $(this).unbind();
                                $(this).hide();
                                draftqueue({});
                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "fan",
                                        test: testq,
                                        testdateoffset: testdateoffset,
                                        cmd: "draftQueueAdd",
                                        CSR: CSR,
                                        leagueid: subscriber.leagueid
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    success: qadded //TODO: See if you can hook up this "progress" member, it would be very cool.
                                });

                                function qadded(json) {
                                    if (a$.jsonerror(json)) {} else {
                                        draftloaded = true; //Do NOT want to update in this case.
                                        selectSection("Xtreme");
                                        getDraftQueue();
                                    }
                                }
                            });
                        } else if (json.onteam) {
                            $(sel).show().html('<div class="fan-xtreme-text"><i class="fas fa-check-circle"></i> ON XTREME TEAM</div>');
                        } else if (json.unavailable) {
                            $(sel).show().html('<div class="fan-xtreme-text fan-xtreme-text-red"><i class="fas fa-times"></i> NOT AVAILABLE TO DRAFT </div>');
                        }
                    }
                }
            } else {
                $(sel).hide();
            }
        }
    }

    function sectionsConfig() {
        switch (Role) {
            case "CSR":
                self.fantasyViewable(false);
                self.fantasyViewing("N");
                if (gametype() == "team") {
                    sectionsShowHide("Xtreme", false);
                    sectionsShowHide("League Admin", false);
                    sectionsShowHide("Team Setup", false);
                    sectionsShowHide("Divisions", false);
                    sectionsShowHide("Stats", false);
                    sectionsShowHide("Player Setup", true);
                    sectionsShowHide("Player Home", CSR != "" && ((Team == "") || (parseInt(Team + "0", 10) > 0)));
                } else {
                    sectionsShowHide("League Admin", false);
                    sectionsShowHide("Team Setup", false);
                    sectionsShowHide("Player Setup", true);
                }
                break;
            case "Team Leader":
                self.fantasyViewable(false);
                self.fantasyViewing("N");
                if (gametype() == "team") {
                    sectionsShowHide("Xtreme", false);
                    sectionsShowHide("League Admin", false);
                    sectionsShowHide("Divisions", true);
                    sectionsShowHide("Team Setup", Team != "");
                    sectionsShowHide("Player Setup", true);
                    sectionsShowHide("Player Home", specialteam() || (CSR != "" && ((Team == "") || (parseInt(Team + "0", 10) > 0)))); //MAKEDEV
                } else {
                    sectionsShowHide("League Admin", false);
                    sectionsShowHide("Team Setup", Team != "");
                    sectionsShowHide("Player Setup", true);
                }
                break;
            default:
                self.fantasyViewable(true);
                self.fantasyViewing("Y");
                if (gametype() == "team") {
                    sectionsShowHide("Standings", Team != "" || CSR != "" || leagueCrumb() != 0 || (self.fantasyViewing() == "Y"));
                    sectionsShowHide("Matchup", Team != "" || CSR != "");
                    sectionsShowHide("Team", Team != "" || CSR != "");
                    sectionsShowHide("Schedule", Team != "" || CSR != "");
                    sectionsShowHide("Roster", Team != "" || CSR != "");
                    sectionsShowHide("Team Setup", Team != "");
                    sectionsShowHide("Player Setup", true);
                    sectionsShowHide("Player Home", CSR != "" && ((Team == "") || (parseInt(Team + "0", 10) > 0)));
                } else {
                    sectionsShowHide("Roster", Team != "" || CSR != "");
                    sectionsShowHide("Team Setup", Team != "");
                    sectionsShowHide("Player Setup", true);
                }
                break;
        }
        if ((Role == "CorpAdmin") || (Role == "Admin")) {
            adminExcludedAgents(true);
        }

        if (gametype() == "team") {
            //sectionsShowHide("< Home Division", (leagueCrumb() != 0) && (subscriber.teamid >= 0));
            if (leagueCrumb() != 0) {
                //sectionsShowHide("Position Play", (leagueCrumb() != 0) && (subscriber.teamid >= 0));
            } else {
                //sectionsShowHide("Position Play", Team != "" || CSR != "");
            }
        }
        if (false) { //(/* (a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-make40.") || */ (a$.urlprefix() == "bgr.")) {
            sectionsShowHide("Xtreme", false); //They are late with supplying their fantasy owner list.
            self.ComingSoon(true);
        }
        if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-make40.")) {
            if ((Role == "CorpAdmin") || (Role == "Admin") || (oUid().toLowerCase() == "smoore") || (oUid().toLowerCase() == "odean")) {
                sectionsShowHide("Xtreme", true);
            }
        }
        self.sections({});
        self.sections(mysections);

        if (Team == "" && CSR == "") {
            $(".headericon-agame").hide();
            $(".map-scoreboard").hide();
        }
    }
    ko.postbox.subscribe("Team", function(newValue) {
        if (DashboardLinking) return;
        if (typeof newValue == "object") {
            if (newValue.length > 1) {
                newValue = ""; //Multi is the same as all/each.
            }
        }
				FannameSave = "";
        var oldValue = Team;
        Team = newValue;
        self.oTeam(Team);
        savedTeam = newValue;
        if (a$.exists(o.leagueid)) {
            leagueCrumb(o.leagueid);
        } else {
            leagueCrumb(0);
        }
        sectionsConfig();
        if ((Team != oldValue) && (Role != "CSR")) {
            if ((Team != "") && (Team != "each") && (Team.indexOf(",") < 0)) {
                if (gametype() == "team") {
                    a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: false,
                        data: {
                            lib: "fan",
                            test: testq,
                            testdateoffset: testdateoffset,
                            cmd: "getComposite",
                            gametype: gametype(),
                            Team: Team,
                            CSR: CSR
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: loadedComposite1
                    });
                    function loadedComposite1(json) {
                        if (a$.jsonerror(json)) {} else {
                            Teamsid = "";
                            if (json.teams.length == 1) {
                                Teamsid = json.teams[0].teamsid; 
                            }
                            else {
                                if (json.teams.length) Teamsid = json.teams[0].teamsid;
                                if (json.teams.length <= 1) {
                                    //2023-01-30 - Try just not unbinding it:  $(".fan-current-teams-select").unbind();
                                } else {
                                    var bld = "";
                                    for (var i in json.teams) {
                                        bld += '<option value="' + json.teams[i].teamsid + '">' + json.teams[i].fanteamname + "(" + json.teams[i].teamname + ")" + '</option>';
                                    }
                                    $(".fan-current-teams-select").html(bld);
                                    $(".fan-current-teams").show();
                                    $(".fan-current-teams-select").unbind().bind("change", function() {
                                        //Set breadcrumb
                                        //alert("debug:setting breadcrumb");
                                        Teamsid = $(this).val();
                                        self.selectSection("Matchup");
                                    });
                                }
                            }
                            var notyetplaying = false;
                            if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                                if ((a$.urlprefix() == "XXXers.") || (a$.urlprefix() == "XXXmake40.")) {
                                    if ($("#selLocations").val() != "9") {
                                        //alert("debug: Non-Guatemala ERS Team/CSR");
                                        for (var i in mysections.list) {
                                            if (mysections.list[i].name == "Team") {
                                                //No Matchups yet (only do for week 1 //NOTE: WHEN YOU REMOVE THIS, CHANGE IT TO THE DEFAULT PAGE (Matchup)
                                                /*
                                                for (var j in mysections.list[i].sublist) {
                                                    if (mysections.list[i].sublist[j].name == "Matchup") {
                                                        mysections.list[i].sublist.splice(j,1);
                                                    }
                                                }
                                                */
                                                //Display Roster now
                                                /*
                                                for (var j in mysections.list[i].sublist) {
                                                    if (mysections.list[i].sublist[j].name == "Roster") {
                                                        mysections.list[i].sublist.splice(j,1);
                                                    }
                                                }
                                                */
                                            }
                                        }

                                        //No Position Play until later.
                                        /*
                                        for (var i in mysections.list) {
                                            if (mysections.list[i].name == "Position Play") {
                                                mysections.list.splice(i,1);
                                            }
                                        }
                                        sectionsShowHide("Position Play", false);
                                        */
    
                                        //self.ComingSoon(true);
                                        self.selectSection("Roster"); //NOTE: CHANGE TO MATCHUP
                                        notyetplaying = true;
                                    }
                                }
                            }
                            if (!notyetplaying) {
                                if ((CSR != "")&&(CSR != "each")) {
                                    PlayerHomeRedirect = true; //Genuine CSR
                                }
                                if (specialteam()) {
                                    PlayerHomeRedirect = true;
                                }
                                self.selectSection("Matchup");
                            }
                        }
                    }

                } else {
                    if (earlyrelease) {
                        self.selectSection("Schedule");
                    } else {
                        self.selectSection("Matchup");
                    }
                }
            } else {
                self.selectSection(self.selectedSection());
            }
        }
    });
    
    self.resetScrollXtreme = function() {
    	//alert("debug:resetting scroll");
    	$(".fan-draft").eq(0).parent().scrollTop(0);    	
    	return true;
    }

    self.reverseAvatar = function() {
        flip = !flip;
        self.selectSection("Team Settings");
    }

    function getComposite() {
        //Gets the composite teams for a Team/CSR combination.
        //If multiple teams are returned, this makes a combo box visible (not the same as the Xtreme combo box but in the same place - actually I'm not sure yet.
        //If no  composite, return "" (sets Teamsid to "")
        //If a single team returned, return it (string version).

        a$.ajax({
            type: "GET",
            service: "JScript",
            async: false,
              data: {
                lib: "fan",
                test: testq,
                testdateoffset: testdateoffset,
                cmd: "getComposite",
                gametype: gametype(),
                Team: Team,
                CSR: CSR
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: loadedActiveTeams
        });
        function loadedActiveTeams(json) {
            if (a$.jsonerror(json)) {} else {
                if (json.teams.length == 1) {
                    retval = json.teams[0].teamsid;
                }
                else {
                    alert("debug: display a combo for selection, assuming the first one for now");
                    retval = json.teams[0].teamsid;
                }
            }
        }
    }

    ko.postbox.subscribe("CoxEmergencyNavigation", function(newvalue) {
        if (draftteamowner()) {
            self.selectSection("Xtreme");
            sectionsShowHide("Team", true);
            self.sections(mysections);
            self.selectSection("Matchup");
            self.rosterempty(false); //?
        }
        else {
            self.selectSection("Standings");
        }
    });

    ko.postbox.subscribe("CSR", function(newValue) {
        if (firsttime) {
            firsttime = false;
            if ((a$.urlprefix() == "cox.")||(a$.urlprefix() == "cox-mnt-julie.")) {
                if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                }
                else {
                    //DEFAULT to the rules (no Xtreme at this point, can change this).
                    //selectSection("Rules");
                }
            }
            if (MapRedirect) {
                if (a$.urlprefix() == "walgreens.") {
                    self.selectSection("Standings");
                    MapRedirect = 0; //This is for the first direct to player home.
                }
                else {
                    self.selectSection("Map"); //Redirect there now in case there's no other redirect.
                    MapRedirect = 2; //This is for the first direct to player home.
                }
                
            }
        }

				FannameSave = "";
        if (DashboardLinking) return;
        playerhome_loaded = false;
        var oldValue = CSR;
        CSR = newValue;
        self.oCSR(CSR);
        savedCSR = newValue;
        if (a$.exists(o.leagueid)) {
            leagueCrumb(o.leagueid);
        } else {
            leagueCrumb(0);
        }
        sectionsConfig();
        if (CSR != oldValue) {
            xtremePresentQueue();
            if (((CSR == "") || (CSR == "each")) && ((Team != "") && (Team != "each"))) {
                var holdteam = Team;
                Team = "";
                ko.postbox.publish("Team", holdteam);
            }
            else if ((CSR != "") && (CSR != "each")) {
                if (gametype() == "team") {
                    a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: false,
                        data: {
                            lib: "fan",
                            test: testq,
                            testdateoffset: testdateoffset,
                            cmd: "getComposite",
                            gametype: gametype(),
                            Team: Team,
                            CSR: CSR
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: loadedComposite2
                    });
                    function loadedComposite2(json) {
                        if (a$.jsonerror(json)) {} else {
                            Teamsid = "";
                            if (json.teams.length == 1) {
                                Teamsid = json.teams[0].teamsid; 
                            }
                            else {
                                if (json.teams.length > 0) {
                                    Teamsid = json.teams[0].teamsid; //This is an error, but not showing it.
                                }
                                $(".fan-current-teams").hide();
                            }
                            var notyetplaying = false;
                            leagueCrumb(0); //wise?
                            $(".fan-current-teams").hide();

                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "fan",
                                    test: testq,
                                    testdateoffset: testdateoffset,
                                    cmd: "getActiveTeams",
                                    gametype: gametype(),
                                    CSR: CSR
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: loadedActiveTeams
                            });

                            function loadedActiveTeams(json) {
                                if (a$.jsonerror(json)) {} else {
                                    if (json.teams.length <= 1) {
                                        $(".fan-current-teams-select").unbind();
                                    } else {
                                        var bld = "";
                                        for (var i in json.teams) {
                                            bld += '<option value="' + json.teams[i].leagueid + '/' + json.teams[i].teamid + '">' + json.teams[i].fanteamname + '</option>';
                                        }
                                        $(".fan-current-teams-select").html(bld);
                                        $(".fan-current-teams").show();
                                        $(".fan-current-teams-select").unbind().bind("change", function() {
                                            //Set breadcrumb
                                            //alert("debug:setting breadcrumb");
                                            var s = $(this).val();
                                            var sp = s.split("/");
                                            var leagueid = parseInt(sp[0]);
                                            var teamid = sp[1];
                                            var mysec = self.selectedSection();
                                            setTeamJump(leagueid, teamid);
                                            sectionsConfig();
                                            if (mysec == "Roster") {
                                                setTimeout(function() {
                                                    self.selectSection("Roster");
                                                },500);
                                            }
                                        });
                                    }
                                }
                            }

                            if (($.cookie("TP1Role") == "Team Leader") || ($.cookie("TP1Role") == "CSR")) {
                                if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "make40.")) {
                                    if ($("#selLocations").val() != "9") {
                                        for (var i in mysections.list) {
                                            if (mysections.list[i].name == "Team") {
                                                //No Matchups yet (only do for week 1
                                                /*
                                                for (var j in mysections.list[i].sublist) {
                                                    if (mysections.list[i].sublist[j].name == "Matchup") {
                                                        mysections.list[i].sublist.splice(j,1);
                                                    }
                                                }
                                                */
                                                //Display Roster now
                                                /*
                                                for (var j in mysections.list[i].sublist) {
                                                    if (mysections.list[i].sublist[j].name == "Roster") {
                                                        mysections.list[i].sublist.splice(j,1);
                                                    }
                                                }
                                                */
                                            }
                                        }
                                        //No Position Play until later.
                                        /*
                                        for (var i in mysections.list) {
                                            if (mysections.list[i].name == "Position Play") {
                                                mysections.list.splice(i,1);
                                            }
                                        }
                                        sectionsShowHide("Position Play", false);
                                        */
                                        //self.ComingSoon(true);
                                        if (!draftteamowner()) {
                                            self.selectSection("Player Home");
                                            //self.selectSection("Roster");  //NOTE: CHANGE TO MATCHUP
                                        }
                                        notyetplaying = true;
                                    }
                                }
                            }
                            if (!notyetplaying) {
                                if (!draftteamowner()) {
                                    PlayerHomeRedirect = true;
                                    self.selectSection("Matchup");
                                    //self.selectSection("Player Home");
                                }
                            }
                        }
                    }
                } else {
                    playerLoaded = false;
                    if (!draftteamowner()) self.selectSection("Events");
                }
                if (subscriber.subscribed) {}
            } else {
                self.selectSection(self.selectedSection());
            }
        }
    });

    ko.postbox.subscribe("Location", function(newValue) {
        var oldValue = Location;
        Location = newValue;
        self.oLocation(Location);
    });

    var Team = "";
    var Teamsid = ""; //Case is very important here.
    var savedTeam = "";
    var CSR = "";
    var savedCSR = "";
    var Role = "";

    ko.postbox.subscribe("Role", function(newValue) {
        Role = newValue;
        self.oRole(Role);
        sectionsConfig();
    });

    function sectionsShowHide(name, show) {
        for (var i in mysections.list) {
            if (mysections.list[i].name == name) {
                mysections.list[i].show = show;
                break;
            }
            for (var j in mysections.list[i].sublist) {
                if (mysections.list[i].sublist[j].name == name) {
                    mysections.list[i].sublist[j].show == show;
                }
                break;
            }
        }
    }

    ko.postbox.subscribe("ResizeWindow", function() {
        var y = $(window).height() - $(".fan-content:first").offset().top;
        //y += 30; //Move the scroll bar out of view at the bottom.  TODO: This is really bad in a view model, but is set to
        $(".fan-content").css("height", y + "px");
        //$(".fanDebug").html($(".fanDebug").html() + '/' + y);
    });
    
    self.opendraftroom = function() {
    	//alert("in opendraftroom");
    	//alert("debug:leagueid = " + subscriber.leagueid);
      window.open("http://" + a$.urlprefix() + "acuityapmr.com/jq/draft/default.aspx?league=" + subscriber.leagueid);
    }
    
    self.draftsubscribe = function(lid,firstslot) {
                                            a$.ajax({
                                                type: "GET",
                                                service: "JScript",
                                                async: true,
                                                data: {
                                                    lib: "fan",
                                                    test: testq,
                                                    testdateoffset: testdateoffset,
                                                    cmd: "draftsubscribe",
                                                    leagueid: lid,
                                                    position: firstslot,
                                                    Fantasy: self.fantasyViewing()
                                                },
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                success: draftsubscribed
                                            });

                                            function draftsubscribed(json) {
                                                if (a$.jsonerror(json)) {} else {
                                                    draftloaded = false;
                                                    selectSection("Xtreme");
                                                }
                                            }
    	
    }
        
    self.draftunsubscribe = function() {
                                            a$.ajax({
                                                type: "GET",
                                                service: "JScript",
                                                async: true,
                                                data: {
                                                    lib: "fan",
                                                    test: testq,
                                                    testdateoffset: testdateoffset,
                                                    cmd: "draftunsubscribe",
                                                    leagueid: subscriber.leagueid,
                                                    position: subscriber.position,
                                                    Fantasy: self.fantasyViewing()
                                                },
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                success: draftunsubscribed
                                            });

                                            function draftunsubscribed(json) {
                                                if (a$.jsonerror(json)) {} else {
                                                    subscriber.subscribed = false;
                                                    draftloaded = false;
                                                    selectSection("Xtreme");
                                                }
                                            }    	
    }

    self.isV = function(mytype) {
        if (mytype == "avg") {
            return ((self.columnView() == "avg") || (self.columnView() == "all"));
        } else if (mytype == "mvp") {
            return ((self.columnView() == "mvp") || (self.columnView() == "all"));
        } else if (mytype == "new") {
            return ((self.columnView() == "new") || (self.columnView() == "all"));
        }
        return true;
    }

    self.isP = function(mytype) {
        for (var i in plusColumns) {
            if (plusColumns[i].name == mytype) {
                return plusColumns[i].expand;
            }
        }
        return true;
    }

    self.redrawExclusions = function() {
        //$(".fan-exclude-control").hide();
        //$(".fan-exclude-prompt").show();
        //setTimeout(function () {
        //rerank();
        //$(".fan-exclude-control").show();
        //$(".fan-exclude-prompt").hide();
        //}, 500);
        //alert("debug:showExcludedAgents=" + showExcludedAgents());
        if (showExcludedAgents()) {
            alert("Note: When you exclude an agent by clicking the appropriate 'Exclude' checkbox, the browser may take a FULL 10 SECONDS to respond.  Please don't continue clicking until the results are displayed.\n\nAlso, please note that exclusions apply to PLAYERS only (not teams).\n\n(thanks) - Jeff");
        }
        return true;
    }

    self.excludeAgent = function(user_id) {
        var myexclude = "";
        for (var i in sj.playerstats) {
            if (sj.playerstats[i].user_id == user_id) {
                if (sj.playerstats[i].exclude == "Y") {
                    sj.playerstats[i].exclude = "N";
                    myexclude = "N";
                } else {
                    sj.playerstats[i].exclude = "Y";
                    myexclude = "Y";
                }
                //alert("debug: " + sj.playerstats[i].name + " exclusion set to " + sj.playerstats[i].exclude);
            }
        }
        agentExclusion(user_id, myexclude);
    }

    function jqExclusion(me) {
        var uid = $(" span", $(me).parent()).first().html();
        var myexclude = $(me).val()

        //alert("debug: non-knockout selection change = " + $(me).val());
        //alert("debug: user to change = " + $(" span", $(me).parent()).first().html());
        for (var i in sj.playerstats) {
            if (sj.playerstats[i].user_id == uid) {
                sj.playerstats[i].exclude = myexclude;
            }
        }
        agentExclusion(uid, myexclude);
    }

    function bldTop5View(json) {
        var myid;

        function bldloop() {

            top5(json.top5);
            clearAvatars({
                section: "Top5"
            });
            var state = "T5";
            var idx = 0;
            var jdx = 0;
            var INTERVAL = 10;
            if (drawTID != null) {
                clearTimeout(drawTID);
                drawTID = null;
            }

            function drawE() {
                if (state == "T5") {
                    if (idx < json.top5.current[0].top5.length) {
                        var i = idx;
                        if (jdx < json.top5.current[0].top5[i].board.length) {
                            var j = jdx;
                            var ele = $(".fan-events-top5 tbody").eq(i).children("tr").eq(j).children("td").eq(4); //Fifth TD in each TR record.
                            uid++;
                            $(ele).removeAttr("id").attr("id", uid);
                            drawAvatar({
                                theme: debug ? "basketball" : self.theme(),
                                item: "teamicon",
                                id: uid,
                                colors: json.top5.current[0].top5[i].board[j].team.stg.colors,
                                heightInPixels: 40,
                                flip: false,
                                section: name
                            });
                            jdx += 1;
                        } else {
                            idx += 1;
                            jdx = 0;
                        }
                    } else {
                        state = "END";
                    }
                    drawTID = setTimeout(drawE, INTERVAL);
                }
            }
            drawTID = setTimeout(drawE, INTERVAL);

            a$.hideprogress("plotprogress");
            clearTimeout(myid);
        }
        myid = setTimeout(bldloop, 100);
    }

    function bldEventView(json) {
        if (positionChanged == "N") {
            eventselect(json.events);
        }
        optDateOnce = false;
        var myid;

        function bldloop() {
            //TODO: Change this when you get optimized.
            json.events.current[0].active = {
                show: false,
                team: {
                    stg: {
                        colors: ["white", "white"],
                        autoSelectRoster: false,
                        overrideRosterLock: false
                    }
                },
                player: {
                    avatar: "empty_headshot.png",
                    stg: {
                        nickname: "",
                        jersey: "",
                        slogan: ""
                    }
                }
            };

            if (CSR != "") {
                for (var i in json.events.current[0].board) {
                    if (json.events.current[0].board[i].player.id == CSR) {
                        json.events.current[0].active = json.events.current[0].board[i];
                        json.events.current[0].active.show = true;
                        break;
                    }
                }
            }

            $(".events-division").val("" + json.events.current[0].league.id);
            eventsDivision("" + json.events.current[0].league.id);

            events(json.events);
            $(".fan-events-display-all").unbind().bind("click", function() {
                eventsDisplayingAll(true);
                clearTimeout(drawEID);
                getEvents(activePosition());
            });
            if (eventsplayershowing) {
                $(".fan-events-feature").css("margin-left", "400px");
            }
            $(".fan-events-player-prompt").html("");

            if (json.events.current[0].board.length > 0) {
                $(".fan-events-positions").val(json.events.current[0].board[0].position);
                activePosition(json.events.current[0].board[0].position);
            }
            $(".fan-events-positions").unbind().bind('change', function() {
                positionChanged = "Y";
                positionName = $(this).val();
                activePosition(positionName);
                selectSection("Events");
                $(this).unbind();
            });

            $(".fan-events-top5-show").unbind().bind("change", function() {
                if ($(this).is(":checked")) {
                    $(".fan-events-feature").hide();
                    $(".fan-events-player").hide();
                    $(".fan-events-top5").show();
                    selectSection("Top5");
                } else {
                    $(".fan-events-feature").show();
                    if (eventsplayershowing) {
                        if (false) { //DEBUG
                            $(".fan-events-player").show();
                        }
                    }
                    $(".fan-events-top5").hide();
                }
            });
            $(".fan-events-top5-off").unbind().bind("click", function() {
                $(".fan-events-top5-show").prop("checked", false);
                $(".fan-events-top5-show").trigger("change");
            });
            $(".fan-events-top5-on").unbind().bind("click", function() {
                $(".fan-events-top5-show").prop("checked", true);
                $(".fan-events-top5-show").trigger("change");
            });
            $(".fan-events-top5-show").trigger("change");

            //alert("debug: successful return from getevents");
            clearAvatars({
                section: name
            });
            //Manually rifle through the leagues and display the avatar (in black) in the table (2nd column for now)
            /* WAS:
            drawAvatar({ theme: debug ? "basketball" : self.theme(), item: "playerbody", id: "PlayerBodyIdEvents", colors: json.events.current[0].active.team.stg.colors, heightInPixels: 275, flip: false, number: json.events.current[0].active.player.stg.jersey, section: name });

            for (var i in json.events.current[0].board) {
                var ele = $(".fan-events-feature tbody").eq(0).children("tr").eq(i).children("td").eq(4); //Fifth TD in each TR record.
                uid++;
                $(ele).removeAttr("id").attr("id", uid);
                drawAvatar({ theme: debug ? "basketball" : self.theme(), item: "teamicon", id: uid, colors: json.events.current[0].board[i].team.stg.colors, heightInPixels: 20, flip: false, section: name });
            }
            for (var i in json.events.current[0].top5) {
                for (var j in json.events.current[0].top5[i].board) {
                    var ele = $(".fan-events-top5 tbody").eq(i).children("tr").eq(j).children("td").eq(4); //Fifth TD in each TR record.
                    uid++;
                    $(ele).removeAttr("id").attr("id", uid);
                    drawAvatar({ theme: debug ? "basketball" : self.theme(), item: "teamicon", id: uid, colors: json.events.current[0].top5[i].board[j].team.stg.colors, heightInPixels: 20, flip: false, section: name });
                }
            }
            */
            //IS:
            var state = "AV";
            var idx = 0;
            var jdx = 0;
            var INTERVAL = 10;
            if (drawEID != null) {
                clearTimeout(drawEID);
                drawEID = null;
            }

            function drawE() {
                if (state == "AV") {
                    drawAvatar({
                        theme: debug ? "basketball" : self.theme(),
                        item: "playerbody",
                        id: "PlayerBodyIdEvents",
                        colors: json.events.current[0].active.team.stg.colors,
                        heightInPixels: 275,
                        flip: false,
                        number: json.events.current[0].active.player.stg.jersey,
                        section: name
                    });
                    state = "BD";
                    idx = 0;
                    drawEID = setTimeout(drawE, INTERVAL);
                } else if (state == "BD") {
                    if (idx < json.events.current[0].board.length) {
                        var i = idx;
                        var ele = $(".fan-events-feature tbody").eq(0).children("tr").eq(i).children("td").eq(4); //Fifth TD in each TR record.
                        uid++;
                        $(ele).removeAttr("id").attr("id", uid);
                        if (!((json.events.current[0].board[i].team.stg.colors[0] == "white") && (json.events.current[0].board[i].team.stg.colors[1] == "white"))) {
                            drawAvatar({
                                theme: debug ? "basketball" : self.theme(),
                                item: "teamicon",
                                id: uid,
                                colors: json.events.current[0].board[i].team.stg.colors,
                                heightInPixels: 40, //20,
                                flip: false,
                                section: name
                            });
                        }
                        idx += 1;
                    } else {
                        state = "END";
                        idx = 0;
                        jdx = 0;
                    }
                    drawEID = setTimeout(drawE, INTERVAL);
                }
            }
            drawEID = setTimeout(drawE, INTERVAL);

            a$.hideprogress("plotprogress");
            clearTimeout(myid);
        }
        myid = setTimeout(bldloop, 100);

    }

    function getEvents(position) {
        //WAS: role: $.cookie("TP1Role"), Team: Team, CSR: CSR, week: eventsWeek(), positionName: positionName, positionChanged: positionChanged },
        //if ((eventsDivision() == "0") && ((Team == "") || (parseInt(Team, 10) <= 0)) && (CSR == "")) return;
        if (position == "") return;
        var sig = "" + eventsWeek() + position + (eventsDisplayingAll() ? "Y" : "N");
        sig += eventsDivision(); //Added because of the existence of multiple leagues (not perfect, but will handle practical cases). //TODO: Perfect this.

        if ((eventsDivision() != "0")&&(!bLastPosition)) {
            if (sig == prevEventSig) {
                $(".fan-events-player-prompt").html("");
                return;
            }
        }
        if (bLastPosition) {
          //alert("debug: Get Last Position Played during regular season by this player.")
        }
        a$.showprogress("plotprogress");
        prevEventSig = sig;
        if ((eventSigs[sig] == null)||(bLastPosition)) {
            if (drawEID != null) {
                clearTimeout(drawEID);
                drawEID = null;
            }
            $(".events-division").hide();
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "fan",
                    test: testq,
                    testdateoffset: testdateoffset,
                    cmd: "getevents",
                    gametype: gametype(),
                    Teamsid: Teamsid,
                    Team: Team,
                    CSR: CSR,
                    eventsDivision: eventsDivision(),
                    week: eventsWeek(),
                    bLastPosition: bLastPosition,
                    showall: eventsDisplayingAll(),
                    positionName: position,
                    positionChanged: "Y",
                    bkey: a$.perfdate("Normal")
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: loadedEvents,
                progress: "plotprogress" //TODO: See if you can hook up this "progress" member, it would be very cool.
            });

            function loadedEvents(json) {
                $(".events-division").show();
                eventsempty(false);
                if (a$.jsonerror(json)) {
                    a$.hideprogress("plotprogress");
                    eventsempty(true);
                    /* ZEROSTATE */
                } else if (json.gameInPlay == "N") {
                    /*TODO: I'm getting an extra call that resolves here, I don't know where it's coming from.  I'm going to comment this section out and see how it behaves. */
                    eventselect({});
                    $(".events-division").val("0");
                    eventsDivision("0");
                    optDateOnce = false;
                    eventsempty(true);
                    events({});
                    a$.hideprogress("plotprogress");
                    /* ZEROSTATE */
                } else {
                    if (json.events.current[0].board.length == 0) {
                        eventsempty(true);
                    }
                    else {
                        eventsempty(false);
                        eventSigs[sig] = json;
                        bldEventView(json);
                    }
                }
                positionName = "";
                positionChanged = "N";
            }
        } else {
            bldEventView(eventSigs[sig]);
            positionName = "";
            positionChanged = "N";
        }
    }

    function getTop5() {
        //WAS: role: $.cookie("TP1Role"), Team: Team, CSR: CSR, week: eventsWeek(), positionName: positionName, positionChanged: positionChanged },
        var sig = "" + eventsWeek();
        sig += eventsDivision(); //TODO: Not perfect. See the similar line in getEvents
        if (sig == prevTop5Sig) {
            $(".fan-events-player-prompt").html("");
            return;
        }
        a$.showprogress("plotprogress");
        prevTop5Sig = sig;
        if (top5Sigs[sig] == null) {
            if (drawTID != null) {
                clearTimeout(drawTID);
                drawTID = null;
            }
            a$.ajax({
                type: "GET",
                service: "JScript",
                async: true,
                data: {
                    lib: "fan",
                    test: testq,
                    testdateoffset: testdateoffset,
                    cmd: "gettop5",
                    gametype: gametype(),
                    Teamsid: Teamsid,
                    Team: Team,
                    CSR: CSR,
                    eventsDivision: eventsDivision(),
                    week: matchupWeek(),
                    positionName: "",
                    positionChanged: "",
                    bkey: a$.perfdate("Normal")
                },
                dataType: "json",
                cache: false,
                error: a$.ajaxerror,
                success: loadedEvents //TODO: See if you can hook up this "progress" member, it would be very cool.
            });

            function loadedEvents(json) {
                if (a$.jsonerror(json)) {
                    a$.hideprogress("plotprogress");
                } else if (a$.exists(json.empty)) {
                    /*TODO: I'm getting an extra call that resolves here, I don't know where it's coming from.  I'm going to comment this section out and see how it behaves.
                    eventselect({});
                    optDateOnce = false;
                    events({});
                    */
                } else {
                    top5Sigs[sig] = json;
                    bldTop5View(json);
                }
            }
        } else {
            bldTop5View(top5Sigs[sig]);
        }
    }

    function agentExclusion(user_id, myexclude) {
        a$.showprogress("plotprogress");
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: false,
            data: {
                lib: "fan",
                test: testq,
                testdateoffset: testdateoffset,
                cmd: "saveexclusion",
                role: $.cookie("TP1Role"),
                CSR: user_id,
                exclude: myexclude
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: mysaved
        });

        function mysaved(json) {
            if (a$.jsonerror(json)) {}
            rerank();
            stats({});
            stats(sj);
            // tabledownload
            $(".table-download").attr("title", "Download Table").html("&nbsp;&nbsp;&nbsp;").unbind().bind("click", function() {
                $(this).downloadContents();
                return false;
            });

            $(".fan-stats-select-exclusion").unbind().bind("change", function() {
                jqExclusion(this);
            });
            a$.hideprogress("plotprogress");
        }
        return true;
    }

    self.checkedAtlanta = ko.observable(true);
    self.manualpickfilters = ko.observable(false);

    self.clickedManualPickFilter = function() {
        alert("AtlantaChecked = " + checkedAtlanta());
        return true;
    }

    self.setdraftpicktype = function(dpt) {
      draftpicktype(dpt);
      a$.ajax({
          type: "GET",
          service: "JScript",
          async: true,
          data: {
              lib: "fan",
              test: testq,
              testdateoffset: testdateoffset,
              cmd: "setdraftpicktype",
              dpt: dpt
          },
          dataType: "json",
          cache: false,
          error: a$.ajaxerror
      });
    }

    self.setTeam = function(id, nav) {
        Team = "" + id;
        sectionsConfig();
        if (nav) {
            if (gametype() == "team") {
                self.selectSection("Matchup");
            } else {
                if (earlyrelease) {
                    self.selectSection("Schedule");
                } else {
                    self.selectSection("Matchup");
                }
            }
        }
    }

    self.setLeagueCrumb = function(leagueid, nav) {
        leagueCrumb(leagueid);
        if (leagueid == 0) {
            Team = savedTeam;
            CSR = savedCSR;
        } else {
            //If I'm a team leader or csr, then activate a new menu item "< Home Division"
            //Wipe out my team and csr subsciption values for now.
            Team = "";
            CSR = "";
        }
        sectionsConfig();
        if (nav) {
            if (gametype() == "team") {
                selectSection("Standings");
            } else {
                if (earlyrelease) {
                    self.selectSection("Schedule");
                } else {
                    self.selectSection("Matchup");
                }
            }
        }
    }

    function displayexcluded() {
        //Re-arrange the team stats by division
        //if (showExcludedAgents()) {
        //}
        //else {
        //    sj = $.extend(true, {}, sj);
        //    //Splice out all excludes
        //    //TODO: This is gonna make a bunch of garbage.  How do I clean up what has already been used before?
        //    for (var i = sj.playerstats.length - 1; i >= 0; i-- ) {
        //        if (sj.playerstats[i].exclude == "Y") {
        //            sj.playerstats.splice(i, 1);
        //        }
        //    }
        //}

        sj.teamdivisions = [];
        for (var i in sj.teamstats) {
            var found = false;
            for (j in sj.teamdivisions) {
                if (sj.teamstats[i].name == sj.teamdivisions[j].name) {
                    sj.teamdivisions[j].teamstats.push(sj.teamstats[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                sj.teamdivisions.push({
                    name: sj.teamstats[i].name,
                    teamstats: [sj.teamstats[i]]
                });
            }
        }

        for (var i = sj.playerstats.length - 1; i >= 0; i--) {
            sj.playerstats[i].rank = 0;
        }
        //Re-arrange the player stats by division
        sj.playerdivisions = [];
        for (var i in sj.playerstats) {
            var found = false;
            for (j in sj.playerdivisions) {
                if (sj.playerstats[i].league_name == sj.playerdivisions[j].league_name) {
                    sj.playerstats[i].divrank = 0;
                    sj.playerdivisions[j].playerstats.push(sj.playerstats[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                sj.playerstats[i].divrank = 0;
                sj.playerdivisions.push({
                    league_name: sj.playerstats[i].league_name,
                    playerstats: [sj.playerstats[i]]
                });
            }
        }
        //Re-arrange the player stats by team
        sj.playerteams = [];
        for (var i in sj.playerstats) {
            var found = false;
            for (j in sj.playerteams) {
                if (sj.playerstats[i].team_id == sj.playerteams[j].team_id) {
                    sj.playerstats[i].teamrank = 0;
                    sj.playerteams[j].playerstats.push(sj.playerstats[i]);
                    found = true;
                    break;
                }
            }
            if (!found) {
                sj.playerstats[i].teamrank = 0;
                sj.playerteams.push({
                    team_id: sj.playerstats[i].team_id,
                    team_name: sj.playerstats[i].team_name,
                    fan_team_name: sj.playerstats[i].fan_team_name,
                    playerstats: [sj.playerstats[i]]
                });
            }
        }
        rerank();
        stats(sj);
        // tabledownload
        $(".table-download").attr("title", "Download Table").html("&nbsp;&nbsp;&nbsp;").unbind().bind("click", function() {
            $(this).downloadContents();
            return false;
        });

        $(".fan-stats-select-exclusion").unbind().bind("change", function() {
            jqExclusion(this);
        });
    }

    function rerank() {
        var rank = 1;
        for (var i in sj.playerstats) {
            if (sj.playerstats[i].exclude == "N") {
                sj.playerstats[i].rank = rank;
                rank++;
            } else if (sj.playerstats[i].exclude == "A") {
                if (parseInt(sj.playerstats[i].flagCount, 10) == 0) {
                    sj.playerstats[i].rank = rank;
                    rank++;
                } else {
                    sj.playerstats[i].rank = 0;
                }
            } else {
                sj.playerstats[i].rank = 0;
            }
        }
        var srt = [];
        for (var i in sj.playerstats) {
            srt.push({
                index: i,
                key: parseFloat(sj.playerstats[i].avg_improvement)
            });
        }
        srt.sort(function(a, b) {
            if (a.key < b.key) return 1;
            if (a.key > b.key) return -1;
            return 0;
        });
        rank = 1;
        for (var i in srt) {
            if (sj.playerstats[srt[i].index].exclude == "N") {
                sj.playerstats[srt[i].index].miprank = rank;
                rank++;
            } else if (sj.playerstats[srt[i].index].exclude == "A") {
                if (parseInt(sj.playerstats[srt[i].index].flagCount, 10) == 0) {
                    sj.playerstats[srt[i].index].miprank = rank;
                    rank++;
                } else {
                    sj.playerstats[srt[i].index].miprank = 0;
                }
            } else {
                sj.playerstats[srt[i].index].miprank = 0;
            }
        }

        for (var j in sj.playerdivisions) {
            rank = 1;
            for (var i in sj.playerdivisions[j].playerstats) {
                if (sj.playerdivisions[j].playerstats[i].exclude == "N") {
                    sj.playerdivisions[j].playerstats[i].divrank = rank;
                    rank++;
                } else if (sj.playerdivisions[j].playerstats[i].exclude == "A") {
                    if (parseInt(sj.playerdivisions[j].playerstats[i].flagCount, 10) == 0) {
                        sj.playerdivisions[j].playerstats[i].divrank = rank;
                        rank++;
                    } else {
                        sj.playerdivisions[j].playerstats[i].divrank = 0;
                    }
                } else {
                    sj.playerdivisions[j].playerstats[i].divrank = 0;
                }
            }
            var srt = [];
            for (var i in sj.playerdivisions[j].playerstats) {
                srt.push({
                    index: i,
                    key: parseFloat(sj.playerdivisions[j].playerstats[i].avg_improvement)
                });
            }
            srt.sort(function(a, b) {
                if (a.key < b.key) return 1;
                if (a.key > b.key) return -1;
                return 0;
            });
            rank = 1;
            for (var i in srt) {
                if (sj.playerdivisions[j].playerstats[srt[i].index].exclude == "N") {
                    sj.playerdivisions[j].playerstats[srt[i].index].divmiprank = rank;
                    rank++;
                } else if (sj.playerdivisions[j].playerstats[srt[i].index].exclude == "A") {
                    if (parseInt(sj.playerdivisions[j].playerstats[srt[i].index].flagCount, 10) == 0) {
                        sj.playerdivisions[j].playerstats[srt[i].index].divmiprank = rank;
                        rank++;
                    } else {
                        sj.playerdivisions[j].playerstats[srt[i].index].divmiprank = 0;
                    }
                } else {
                    sj.playerdivisions[j].playerstats[srt[i].index].divmiprank = 0;
                }
            }

        }
        for (var j in sj.playerteams) {
            rank = 1;
            for (var i in sj.playerteams[j].playerstats) {
                if (sj.playerteams[j].playerstats[i].exclude == "N") {
                    sj.playerteams[j].playerstats[i].teamrank = rank;
                    rank++;
                } else if (sj.playerteams[j].playerstats[i].exclude == "A") {
                    if (parseInt(sj.playerteams[j].playerstats[i].flagCount, 10) == 0) {
                        sj.playerteams[j].playerstats[i].teamrank = rank;
                        rank++;
                    } else {
                        sj.playerteams[j].playerstats[i].teamrank = 0;
                    }
                } else {
                    sj.playerteams[j].playerstats[i].teamrank = 0;
                }
            }
            var srt = [];
            for (var i in sj.playerteams[j].playerstats) {
                srt.push({
                    index: i,
                    key: parseFloat(sj.playerteams[j].playerstats[i].avg_improvement)
                });
            }
            srt.sort(function(a, b) {
                if (a.key < b.key) return 1;
                if (a.key > b.key) return -1;
                return 0;
            });
            rank = 1;
            for (var i in srt) {
                if (sj.playerteams[j].playerstats[srt[i].index].exclude == "N") {
                    sj.playerteams[j].playerstats[srt[i].index].teammiprank = rank;
                    rank++;
                } else if (sj.playerteams[j].playerstats[srt[i].index].exclude == "A") {
                    if (parseInt(sj.playerteams[j].playerstats[srt[i].index].flagCount, 10) == 0) {
                        sj.playerteams[j].playerstats[srt[i].index].teammiprank = rank;
                        rank++;
                    } else {
                        sj.playerteams[j].playerstats[srt[i].index].teammiprank = 0;
                    }
                } else {
                    sj.playerteams[j].playerstats[srt[i].index].teammiprank = 0;
                }
            }

        }
    }

    self.matchupJump = function(tid) {
        Team = "1000000"; //gawd...
        Teamsid = tid;
        self.selectSection("Matchup");
    }

    self.setTeamJump = function(leagueid, teamid) {
        Teamsid = "";
        self.setLeagueCrumb(leagueid, true);
        self.setTeam(teamid, true);
    }

    self.matchupPrevWeek = function() {
        matchupWeek(matchupWeek() - 1);
        selectSection("Matchup");
    }

    self.matchupNextWeek = function() {
        matchupWeek(matchupWeek() + 1);
        selectSection("Matchup");
    }

    self.matchupCurrentWeek = function() {
        matchupWeek(0);
        selectSection("Matchup");
    }

    var optDateOnce = false;
    var incurrentweek = false;

    self.partnerLocation = function(name) {
        return name.substring(name.indexOf(" "));
    }

    self.partnerImage = function(name) {
        var ns = name.split(" ");
        switch (ns[0].toLowerCase()) {
            case "afni":
                return "afni-logo.png";
            case "valor":
                return "valor-global-logo.png";
            case "ers":
                return "convergent-logo.jpg";
            case "egs":
                return "EGS-logo.png";
            case "iqor":
                return "iqor.jpg";
            case "convergys":
                return "conv-logo.jpg";
        }
        return "";
    }

    self.inCurrentWeek = function(weekEnd) {
        if (optDateOnce) {
            return incurrentweek;
        } else {
            optDateOnce = true;
            var parts = weekEnd.split('/');
            //please put attention to the month (parts[0]), Javascript counts months from 0:
            // January - 0, February - 1, etc
            var mydate = new Date(parts[2], parts[0] - 1, parts[1]);
            mydate.setTime(mydate.getTime() + (4 * 86400000)); //Was 4 days, is now 6 until changed.
            if (mydate < datenow()) {
                incurrentweek = false;
            } else {
                incurrentweek = true;
            }
            return incurrentweek;
        }
    }


    self.rosterPrevWeek = function() {
        matchupWeek(matchupWeek() - 1);
        optDateOnce = false;
        selectSection("Roster");
    }

    self.rosterNextWeek = function() {
        matchupWeek(matchupWeek() + 1);
        optDateOnce = false;
        selectSection("Roster");
    }

    self.rosterCurrentWeek = function() {
        matchupWeek(0);
        optDateOnce = false;
        selectSection("Roster");
    }

    self.eventsPrevWeek = function() {
        matchupWeek(matchupWeek() - 1);
        eventsWeek(matchupWeek()); //MAKEDEV (does this work?)
        selectSection("Events");
    }

    self.eventsNextWeek = function() {
        matchupWeek(matchupWeek() + 1);
        eventsWeek(matchupWeek()); //MAKEDEV (does this work?)
        selectSection("Events");
    }

    self.eventsCurrentWeek = function() {
        matchupWeek(0);
        eventsWeek(matchupWeek()); //MAKEDEV (does this work?)
        selectSection("Events");
    }
    
    $(".2m").bind("click", function() {
    	$(".fan-modal-outside,.fan-modal-dismiss").css("opacity",0.5).show().unbind().bind("click", function() {
    			$(".fan-modal-outside,.fan-modal").animate({ opacity: 0 }, 500, function() { $(this).hide() });
    	});
        //Instantly hide all currently-showing modals.
        $(".fan-modal").hide();
        //Animate in the selected modal.
    	var mc = ".m4-" + $(this).attr("2m");
    	var mt = $(mc).css("margin-top");
    	$(mc).css("margin-top","-100px").css("opacity",0).show().animate({
    		opacity: 1,
    		marginTop: mt
    	}, 500);
    	
    });

    self.selectSection = function(name) {
        if (name != "Top5") { //Special handling of Top5, since for the moment it's a subsection.
            self.selectedSection(name);
            ko.postbox.publish("ResizeWindow", true);
        }
        if (name == "Player Home") { //Added 2017-02-14: Clugue, since this is populated before any fan-content, there's no basis for the offset (see "ResizeWindow")
            var y = $(window).height() - 170;
            $(".fan-content").css("height", y + "px");
        }
        //$(".pure-menu-children").hide();
        //$(".customMenuActive").toggleClass("hovered")

        switch (name) {
            case "Xtreme":
            case "Owner Home":
                //if ((a$.urlprefix() == "ces.") || (a$.urlprefix() == "ces-make40.") || (a$.urlprefix() == "bgr.")) {
                if (false) { //((a$.urlprefix() == "bgr.")) {
                    selectSection("Rules");
                    break;
                }
                if (draftteamowner()) {
                    self.setLeagueCrumb(subscriber.leagueid, false);
                    self.setTeam(subscriber.teamid, false);
                }
                if (draftloaded) break;
                draftloaded = true;
                //TODO: Make the draft view (contains sign-up, member info, a queue, some verbage).
                /*
                var json = {};
                json.subscribers = {
                current: [{
                maxslots: 8,
                leagues: [
                {
                leagueid: 4,
                name: "My Test Fan League",
                draftdate: "10/18 4pm EST",
                slots: [
                { available: true },
                { available: false, drafter: 'ckostecka', name: 'Casey Kostecka', teamname: "Casey's Crushers" },
                { available: true },
                { available: true },
                { available: true },
                { available: true }
                ]
                },
                {
                leagueid: 5,
                name: "My OTHER Test Fan League",
                draftdate: "10/19 2pm EST",
                slots: [
                { available: true },
                { available: true },
                { available: true },
                { available: false, drafter: 'gsalvato', name: 'Greg Salvato', teamname: "Greg's Grizzlies" },
                { available: true },
                { available: true },
                { available: true },
                { available: true }
                ]
                }
                ]
                }]
                };
                */
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getfantasyteam",
                        Fantasy: self.fantasyViewing()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: gotfantasyteam
                });

                function gotfantasyteam(json) {
                    if (json.fantasyteam.current[0].members.length > 0) {
                        subscriber.teamid = json.fantasyteam.current[0].members[0].team_id;
                        subscriber.leagueid = json.fantasyteam.current[0].members[0].xt_league_id;
                    }
                    draftteamowner(json.fantasyteam.current[0].members.length > 0);

                    alert("debug: draftteamowner = " + draftteamowner());
                    /*
                    if (draftteamowner()) {
                        sectionsShowHide("WAGER", false);
                    }
                    */

                    if (draftteamowner()) {
                        fantasyteam(json.fantasyteam);
                        $(".draft-table-action").unbind().bind("change", function() {
                            var action = $(this).val();
                            var uid = $(" span", $(this).parent()).eq(0).html();
                            a$.ajax({
                                type: "POST",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "fan",
                                    test: testq,
                                    testdateoffset: testdateoffset,
                                    cmd: "setdrafteeaction",
                                    leagueid: subscriber.leagueid,
                                    teamsid: -subscriber.teamid,
                                    userid: uid,
                                    myaction: action
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: setdrafteeaction
                            });

                            function setdrafteeaction(json) {
                                if (a$.jsonerror(json)) {}
                            };
                            //alert("debug: action='" + action + "' for league=" + subscriber.leagueid + ",team=" + subscriber.teamid + ",user id='" + uid + "'");
                        });
                        self.setLeagueCrumb(subscriber.leagueid, true);
                        self.setTeam(subscriber.teamid, true);
                        getDraftQueue()
                    } else {
                        a$.ajax({
                            type: "GET",
                            service: "JScript",
                            async: true,
                            data: {
                                lib: "fan",
                                test: testq,
                                testdateoffset: testdateoffset,
                                cmd: "getdraftsubscribers",
                                Fantasy: self.fantasyViewing()
                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: loadedsubscribers
                        });

                        function loadedsubscribers(json) {
                            draftleaguecount(0);
                            if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                                subscribers({});
                            } else {
                                draftleaguecount(json.subscribers.current[0].leagues.length);
                                //Put availableSlots member for each league
                                for (var i in json.subscribers.current[0].leagues) {
                                	var avs = 0;
                                	var ams = false;
                                	var fs = -1;
                                	for (var s in json.subscribers.current[0].leagues[i].slots) {
                                		if (json.subscribers.current[0].leagues[i].slots[s].available) {
                                			avs += 1;
                                			if (fs < 0) fs = parseInt(s,10) + 1;
                                		}
                                    var foundme = false;
                                    for (var d in json.subscribers.current[0].leagues[i].slots[s].drafters) {
	                                		if ($.cookie("TP1Username").toString().toLowerCase() == json.subscribers.current[0].leagues[i].slots[s].drafters[d].toString().toLowerCase()) {
                                    		foundme = true;
                                    	}
                                    }
                                    if (foundme) {
                                			ams = true;
                                			subscriber.position = parseInt(s,10) + 1;
                                		}
                                	}
                                	json.subscribers.current[0].leagues[i].availableSlots = avs;
                                	json.subscribers.current[0].leagues[i].amSubscriber = ams;
                                	json.subscribers.current[0].leagues[i].firstSlot = fs;

                                }
                                subscribers(json.subscribers);

                                function subscribersloop() {
                                    var i = 0;
                                    subscriber.emptyslots = 0;
                                    $(".fan-draft-league").each(function() {
                                        var precells = 2;
                                        var j = -precells;
                                        $(" td", this).each(function() {
                                            if ((j >= 0) && (j < json.subscribers.current[0].leagues[i].slots.length)) {
                                                if (json.subscribers.current[0].leagues[i].slots[j].available) {
                                                    $(this).html('<div class="fan-draft-subscribe">Subscribe</div>');
                                                    if (json.subscribers.current[0].leagues[i].draftdate != "Never") {
                                                        subscriber.emptyslots += 1;
                                                    }
                                                } else {
                                                	  var foundme = false;
                                                	  for (var d in json.subscribers.current[0].leagues[i].slots[j].drafters) {
                                                	  	if (json.subscribers.current[0].leagues[i].slots[j].drafters[d].toString().toLowerCase() == oUid().toString().toLowerCase()) {
                                                	  		foundme = true;
                                                	  	}
                                                	  }
                                                    if (foundme) {
                                                        subscriber.subscribed = true;
                                                        draftleagueidx(i);
                                                        xtremePresentQueue(); //In case there's a CSR showing now (Probably won't be).
                                                        subscriber.leagueid = json.subscribers.current[0].leagues[i].leagueid;

                                                        if ((subscriber.leagueid == 136) || (subscriber.leagueid == 137) || (subscriber.leagueid == 138)) {
                                                            manualpickfilters(true);
                                                        }
                                                        else {
                                                            manualpickfilters(false);
                                                        }

                                                        //ADDED 2017-08-16
                                                        subscriber.pickmethod = json.subscribers.current[0].leagues[i].slots[j].pickmethod;
                                                        subscriber.pickfilter = json.subscribers.current[0].leagues[i].slots[j].pickfilter;
                                                        $(".manual-pick").prop('checked',true);
                                                        if (subscriber.pickfilter != "") {
                                                            $(".manual-pick").prop('checked',false);
                                                            var sp = subscriber.pickfilter.split(",");
                                                            for (var s in sp) {
                                                                switch (sp[s]) {
                                                                    case "1":
                                                                        $(".pick-atlanta").prop('checked',true);
                                                                        break;
                                                                    case "2":
                                                                        $(".pick-montgomery").prop('checked',true);
                                                                        break;
                                                                    case "3":
                                                                        $(".pick-augusta").prop('checked',true);
                                                                        break;
                                                                    case "11":
                                                                        $(".pick-sanantonio").prop('checked',true);
                                                                        break;
                                                                    default:                                                                        
                                                                }
                                                            }
                                                        }
                                                        $(".manual-pick").unbind().bind("change", function() {
                                                            var str = "";
                                                            if ($(".pick-atlanta").eq(0).is(":checked")) {
                                                                if (str != "") str += ",";
                                                                str += "1";
                                                            }
                                                            if ($(".pick-montgomery").eq(0).is(":checked")) {
                                                                if (str != "") str += ",";
                                                                str += "2";
                                                            }
                                                            if ($(".pick-augusta").eq(0).is(":checked")) {
                                                                if (str != "") str += ",";
                                                                str += "3";
                                                            }
                                                            if ($(".pick-sanantonio").eq(0).is(":checked")) {
                                                                if (str != "") str += ",";
                                                                str += "11";
                                                            }
                                                            //alert("debug: pick filter: " + str);
                                                            a$.ajax({
                                                                type: "GET",
                                                                service: "JScript",
                                                                async: true,
                                                                data: {
                                                                    lib: "fan",
                                                                    test: testq,
                                                                    testdateoffset: testdateoffset,
                                                                    cmd: "setdraftpickfilter",
                                                                    dpf: str
                                                                },
                                                                dataType: "json",
                                                                cache: false,
                                                                error: a$.ajaxerror
                                                            });
                                                            return true;
                                                        });
                                                        draftpicktype(subscriber.pickmethod);
                                                        if (subscriber.pickmethod != "") {
                                                          draftstep(3);
                                                          resetScrollXtreme(); 
                                                        }
                                                        else {
                                                          draftstep(2);
                                                          resetScrollXtreme(); 
                                                        }

                                                        //pickfilter(subscriber.pickfilter);

                                                        //Debug - Point to the actual draft league for draft pool harmony
                                                        if (subscriber.leagueid == 65) {
                                                            subscriber.leagueid = 63;
                                                        } else if (subscriber.leagueid == 88) {
                                                            //subscriber.leagueid = 90;
                                                        }

                                                        subscriber.roomprefix = json.subscribers.current[0].leagues[i].roomprefix;
                                                        subscriber.leaguename = json.subscribers.current[0].leagues[i].name;
                                                        subscriber.region = json.subscribers.current[0].leagues[i].region;
                                                        subscriber.draftdate = json.subscribers.current[0].leagues[i].draftdate;
                                                        draftdate(subscriber.draftdate);

                                                        if (subscriber.region == "location") {
                                                            subscriber.locations = [];
                                                            for (var r in json.subscribers.current[0].leagues[i].locations) {
                                                                subscriber.locations.push(json.subscribers.current[0].leagues[i].locations[r]); //overkill, but I just can't stop.
                                                                //alert("debug: subscribed to location: " + json.subscribers.current[0].leagues[i].locations[r].id);
                                                            }
                                                        }
                                                        subscriber.teamname = json.subscribers.current[0].leagues[i].slots[j].teamname;
                                                        subscriber.teamsid = json.subscribers.current[0].leagues[i].slots[j].teamid; //teamid should be teamsid (on the right).
                                                        $(this).html("<b>" + json.subscribers.current[0].leagues[i].slots[j].teamname + '</b><br /><div class="fan-draft-unsubscribe">Unsubscribe</div>');
                                                        //TODO: This could be broken out probably.
                                                        getDraftQueue();
                                                        getDraftRoomStatus();
                                                        if (firstdraftset && (draftstep() == 3) && subscriber.subscribed)  {
                                                            firstdraftset = false;
                                                            selectSection("Xtreme");
                                                        }
                                                    } else {
                                                        $(this).html(json.subscribers.current[0].leagues[i].slots[j].teamname);
                                                    }
                                                }
                                            }
                                            j += 1;
                                        });
                                        i += 1;
                                    });
                                    emptydraftslots(subscriber.emptyslots);
                                    draftsubscribed(subscriber.subscribed);
                                    $(".fan-draft-subscribe").unbind();
                                    $(".fan-draft-unsubscribe").unbind();
                                    $(".fan-draft-mock-button").unbind();
                                    if (subscriber.subscribed) {
                                        $(".fan-draft-mock-button").bind("click", function() {
                                            if (false) { //(testq == "TEST") { //Always call the live pool so there will be no entanglement.
                                                if (a$.urlprefix() == "ces.") {
                                                    window.open("http://ces.acuityapmr.com/jq/draft/default.aspx?league=6");
                                                } else if (a$.urlprefix() == "ers.") {
                                                    window.open("http://ers.acuityapmr.com/jq/draft/default.aspx?league=4");
                                                } else {
                                                    window.open("http://acuity-v2-mnt.acuityapmr.com/jq/draft/default.aspx?league=4");
                                                }
                                            } else {
                                                if (testq == "TEST") {
                                                    alert("Note: You're viewing a test league, but all draftrooms are using LIVE data.  Your live queue will be used (if you have one).");
                                                }
                                                if (a$.urlprefix() == "ces.") {
                                                    window.open("http://ces.acuityapmr.com/jq/draft/default.aspx?league=88");
                                                } else if (a$.urlprefix() == "ers.") {
                                                    window.open("http://ers.acuityapmr.com/jq/draft/default.aspx?league=63");
                                                } else if (a$.urlprefix() == "bgr.") {
                                                    window.open("http://bgr.acuityapmr.com/jq/draft/default.aspx?league=92");
                                                } else {
                                                    window.open("http://acuity-v2-mnt.acuityapmr.com/jq/draft/default.aspx?league=63");
                                                }
                                            }
                                            return false;
                                        });
                                        $(".fan-draft-subscribe").html('<div class="fan-draft-avatar"><img src="avatars/empty_headshot.png" /></div>').toggleClass(".fan-draft-empty");
                                        $(".fan-draft-unsubscribe").bind("click", function() {
                                            var leagueidx = $(this).parent().parent().index(); //I don't think this works.
                                            var slotidx = $(this).parent().index() - 2;
                                            a$.ajax({
                                                type: "GET",
                                                service: "JScript",
                                                async: true,
                                                data: {
                                                    lib: "fan",
                                                    test: testq,
                                                    testdateoffset: testdateoffset,
                                                    cmd: "draftunsubscribe",
                                                    leagueid: json.subscribers.current[0].leagues[leagueidx].leagueid,
                                                    position: slotidx + 1,
                                                    Fantasy: self.fantasyViewing()
                                                },
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                success: draftunsubscribed
                                            });

                                            function draftunsubscribed(json) {
                                                if (a$.jsonerror(json)) {} else {
                                                    subscriber.subscribed = false;
                                                    draftloaded = false;
                                                    selectSection("Xtreme");
                                                }
                                            }
                                            return false;
                                        });
                                    } else {
                                        $(".fan-draft-subscribe").bind("click", function() {
                                            var leagueidx = $(this).parent().parent().index(); //I don't think this works.
                                            var slotidx = $(this).parent().index() - 2;
                                            a$.ajax({
                                                type: "GET",
                                                service: "JScript",
                                                async: true,
                                                data: {
                                                    lib: "fan",
                                                    test: testq,
                                                    testdateoffset: testdateoffset,
                                                    cmd: "draftsubscribe",
                                                    leagueid: json.subscribers.current[0].leagues[leagueidx].leagueid,
                                                    position: slotidx + 1,
                                                    Fantasy: self.fantasyViewing()
                                                },
                                                dataType: "json",
                                                cache: false,
                                                error: a$.ajaxerror,
                                                success: draftsubscribed
                                            });

                                            function draftsubscribed(json) {
                                                if (a$.jsonerror(json)) {} else {
                                                    draftloaded = false;
                                                    selectSection("Xtreme");
                                                }
                                            }
                                            return false;
                                        });
                                    }
                                }
                                setTimeout(subscribersloop, 1); //Wow, remember this.  The dom didn't register as updated right away.  This may be consistent when doing a data-bind.
                                if (draftleaguecount() == 0) {
                                    selectSection("Standings"); //2024-02-07                                    
                                }
                            }
                        }
                    }


                }

                break;
            case "Player": //New page that Julie is designing.
                /*if (prerelease) {
                    selectSection("Player Setup");
                    break;
                }*/
            case "Player Home":
                if (playerhome_loaded) {
                    break;
                }
                playerhome_loaded = true;

                var tm = Team;
                var cs = CSR;
                if (specialteam()) { //Safety switch - Make this false to defeat experimental "Team Leader Player Home"
                    cs = $.cookie("TP1Username");
                }
                else if ((cs == "")||(cs == "each")) { 
                    selectSection("Standings");
                    break;
                }
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getPlayerHome",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: tm,
                        CSR: cs
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedPlayerHome
                });

                function loadedPlayerHome(json) {
                    if (a$.jsonerror(json)) {} else {
                        playerHomeThumbsupReceived(json.playerhome.current[0].thumbsup.received);
                        playerHomeThumbsupGiven(json.playerhome.current[0].thumbsup.given);
                        for (var i in json.playerhome.current[0].scores) {
                            var c = appApmDashboard.perfcolor(json.playerhome.current[0].scores[i].score);
                            json.playerhome.current[0].scores[i].color = c.stops[2][1]
                        }
                        for (var i in json.playerhome.current[0].roster) {
                            if (json.playerhome.current[0].roster[i].playtype == null) {
                                json.playerhome.current[0].roster[i].playtype = 'I';
                            }
                            if (json.playerhome.current[0].roster[i].score == null) {
                                json.playerhome.current[0].roster[i].score = 0;
                            }
                        }
                        formatbrackets(json.playerhome.current[0].brackets);
                        bTeamInActiveGame_withDelay = json.playerhome.current[0].bTeamInActiveGame_withDelay;
                        playerhome_weekid = json.playerhome.current[0].weekid;
                        if (json.playerhome.current[0].standings.length > 0) {
                            positionName = json.playerhome.current[0].standings[0].playedposition;
                            positionChanged = "N";
                            playerhomepositionset = true;
                        }
                        
                        //Added 2018-06-17 - I may not have this otherwise.
                        Team = json.playerhome.current[0].team.Team;
                        var fanname = json.playerhome.current[0].team.fanname;

                        playerhome(json.playerhome);


                        //put in playerhome
                        clearAvatars({
  		                    section: "mapplayerhome"
       				          });
                        var colors=[$(".map-home-score").css("background-color"),$(".map-home-score").css("color")];
                        $(".map-home-score2").css("background-color",colors[0]).css("color",colors[1]).html($(".map-home-score").html());
                        $(".map-home-teamname2").html($(".map-home-teamname").html());
	                      var ics=[".map-home-teamicon2"];
	                      for (var ic in ics) {
		                     	uid++;
    		                   $(ics[ic]).eq(0).html("").removeAttr("id").attr("id", uid);
		                       drawAvatar({
    	                     	theme: debug ? "basketball" : self.theme(),
      	                     item: "teamicon",
        	                   id: uid,
          	                 colors: colors,
            	               heightInPixels: 60,
              	             flip: false,
                	           section: "mapplayerhome"
                  	       });
                  	    }
												colors=[$(".map-visitor-score").css("background-color"),$(".map-visitor-score").css("color")];
                        $(".map-visitor-score2").css("background-color",colors[0]).css("color",colors[1]).html($(".map-visitor-score").html());
                        $(".map-visitor-teamname2").html($(".map-visitor-teamname").html());
	                      var ics=[".map-visitor-teamicon2"];
	                      for (var ic in ics) {
		                     	uid++;
    		                   $(ics[ic]).eq(0).html("").removeAttr("id").attr("id", uid);
		                       drawAvatar({
    	                     	theme: debug ? "basketball" : self.theme(),
      	                     item: "teamicon",
        	                   id: uid,
          	                 colors: colors,
            	               heightInPixels: 60,
              	             flip: false,
                	           section: "mapplayerhome"
                  	       });
                  	    }

			            			var ss = standingsSave;
            						activeisland = 0;
                                    if(ss != null)
                                    {
            						for (var  i in ss.leagues) {
            							for (var j in ss.leagues[i].teams) {
            								var w = finalsoverride_check(ss.leagues[i].teams[j].id,ss.leagues[i].teams[j].wins);
            								
            								var maxisland = 7;
            								if (self.theme() == "tiki") {
            									maxisland = 7;
                                            }
                                            else if (self.theme() == "dragons") {
            									maxisland = 10;
            								}
											else if ((self.theme() == "football") || (self.theme() == "basketball") || (self.theme() == "hits")) {
            									maxisland = 11;
											}
            								if (w > maxisland) w = maxisland;
            								if (ss.leagues[i].teams[j].id == Team) {
				            					if (a$.gup("wins")!="") {
	    			        						w = parseInt(a$.gup("wins"),10);
	          			  					    }
	            								activeisland = w + 1;
  	          							    }
    	        						}            			
      	      					    }
                                }
      	      					if (activeisland == 0) { //safety
      	      						activeisland = 1;
      	      					}
                  	    
                  	    if (self.theme() == "tiki") {
                  	    	$(".player-home_tiki-map").attr("class","player-home_tiki-map").addClass("tikimap-island" + activeisland);
	                  	    var inames =["Kakamora Island",
  	                	    	"Goga Island",
    	              	    	"Wahini Hai",
      	            	    	"Nanganana Island",
        	          	    	"Ni-Kika Island",
          	        	    	"Moko Island",
            	      	    	"Papa Tu Anuku",
              	    	    	"Tiki Island"                  	    
                	  	    	];                  	    	
                  		    $(".map-current-island").html(inames[activeisland-1]);
                  	    }
                  	    else if ((self.theme() == "football") || (self.theme() == "basketball") || (self.theme() == "hits") ) {
                  	    	$(".player-home_tiki-map").attr("class","player-home_tiki-map").addClass("gridiron-city" + activeisland);
	                  	    var inames =["New York",
  	                	    	"Cleveland",
  	                	    	"Indianapolis",
  	                	    	"Atlanta",
  	                	    	"Miami",
  	                	    	"Dallas",
  	                	    	"Los Angeles",
  	                	    	"San Francisco",
  	                	    	"Seattle",
  	                	    	"Denver",
  	                	    	"Chicago"
                	  	    	];                  	    	
                  		    $(".map-current-city").html(inames[activeisland-1]);
                            playerhome_showmap(true);                  	    	
                  	    }
                  	    else if ( (self.theme() == "dragons") ) {
                  	    	$(".player-home_tiki-map").attr("class","player-home_tiki-map").addClass("gridiron-city" + activeisland);
	                  	    var inames =[
                                "Pugslywicke Castle",
                                "Fu Village",
                                "Mount Ogre",
                                "Fort Tito",
                                "Highwood",
                                "Lady Bay",
                                "Prosperos Castle",
                                "Finals Round 1<br />Joust at Wicked River",
                                "Finals Round 2 - Sir Humphrey's Rack",
                                "Final Round! - Raid at Tower Black"
                	  	    	];
	                  	    var rnames =[
  	                	    	"cleveland",
                                "newyork",
  	                	    	"indianapolis",
  	                	    	"atlanta",
  	                	    	"miami",
  	                	    	"denver",
  	                	    	"seattle",
  	                	    	"sf",
  	                	    	"chicago",
  	                	    	"dallas"
                	  	    	];                  	    	

                            $(".player-home_gridiron").attr("class","player-home_gridiron");
                            $(".player-home_gridiron").addClass("player-home_gridiron-" + rnames[activeisland-1]);
                            $(".player-home_gridiron").unbind().bind("click", function() {
                                selectSection("Map");
                                return false;
                            });

                  		    $(".map-current-city").html(inames[activeisland-1]);
                            playerhome_showmap(true);                  	    	
                  	    }

                  	    
                  	    //determine if you're ahead or behind.
                  	    var dif = 0;
                  	    if ($(".map-home-teamname2").html() == fanname) {
                  	    	dif = parseInt($(".map-home-score2").html(),10) - parseInt($(".map-visitor-score2").html(),10);                  	    	
                  	    }
                  	    else {
                  	    	dif = parseInt($(".map-visitor-score2").html(),10) - parseInt($(".map-home-score2").html(),10);                  	    	
                  	    }
                  	    
                  	    if (dif > 0) {
                  	    	$(".map-par1").html("You are ahead by ");
                  	    	$(".map-difscore").html("+" + dif);
                  	    	$(".map-par2").html(", nice work!<br/>Maintain your lead to move to to the next island <b><em>" + inames[activeisland] + "</em></b>");
                  	    }
                  	    else {
                  	    	dif -=1;
                  	    	$(".map-par1").html("You need ");
                  	    	$(".map-difscore").html("+" + (-dif));
                  	    	$(".map-par2").html("to move to the next island <b><em>" + inames[activeisland] + "</em></b>");                  	    	
                  	    }
                  	    

                        lightbrackets();

                        //TODO: This needs to be invisible for the stand-alone version of A-GAME
                        $(".btn-icon-chat").unbind().bind("click", function() {
                            appApmMessaging.clickedchatbubble(this);
                            return false;
                        });

                        $(".fan-positionplay-link").unbind().bind("click", function() {
                            bLastPosition = true;
                            matchupWeek(0);
                            self.selectSection("Position Play");
                            bLastPosition = false;
                            return false;
                        });

                        //TODO: This needs to be invisible for the stand-alone version of A-GAME

                        //MADELIVE: replace this event handler.
                        $(".btn-icon-acuity").unbind().bind("click", function() {                        
                            if ($("#graphsublabel").eq(0).is(":visible")) {
                                $('#graphsublabel').trigger('click');
                            }
                            else {
                                $('#graphlabel').trigger('click');
                            }
                        });

                        $(".fan-playerhome-reg-show").unbind().bind("change", function() {
                            if ($(this).is(":checked")) {
                                showBrackets(true);
                                //alert("debug:showstartinglineup");
                            } else {
                                showBrackets(false);
                                //alert("debug:NOT showstartinglineup");
                            }
                        });
                        $(".fan-playerhome-reg-off").unbind().bind("click", function() {
                            $(".fan-playerhome-reg-show").prop("checked", false);
                            $(".fan-playerhome-reg-show").trigger("change");
                        });
                        $(".fan-playerhome-reg-on").unbind().bind("click", function() {
                            $(".fan-playerhome-reg-show").prop("checked", true);
                            $(".fan-playerhome-reg-show").trigger("change");
                        });
                        $(".fan-playerhome-reg-show").trigger("change");


                        $(".fan-playerhome-top5-show").unbind().bind("change", function() {
                            if ($(this).is(":checked")) {
                                showStartingLineup(true);
                                //alert("debug:showstartinglineup");
                            } else {
                                showStartingLineup(false);
                                //alert("debug:NOT showstartinglineup");
                            }
                        });
                        $(".fan-playerhome-top5-off").unbind().bind("click", function() {
                            $(".fan-playerhome-top5-show").prop("checked", false);
                            $(".fan-playerhome-top5-show").trigger("change");
                        });
                        $(".fan-playerhome-top5-on").unbind().bind("click", function() {
                            $(".fan-playerhome-top5-show").prop("checked", true);
                            $(".fan-playerhome-top5-show").trigger("change");
                        });
                        $(".fan-playerhome-top5-show").trigger("change");

                        $(".fan-playerhome-myteam-show").unbind().bind("change", function() {
                            if ($(this).is(":checked")) {
                                showCommunity(true);
                                //alert("debug:showstartinglineup");
                            } else {
                                showCommunity(false);
                                //alert("debug:NOT showstartinglineup");
                            }
                        });
                        $(".fan-playerhome-myteam-off").unbind().bind("click", function() {
                            $(".fan-playerhome-myteam-show").prop("checked", false);
                            $(".fan-playerhome-myteam-show").trigger("change");
                        });
                        $(".fan-playerhome-myteam-on").unbind().bind("click", function() {
                            $(".fan-playerhome-myteam-show").prop("checked", true);
                            $(".fan-playerhome-myteam-show").trigger("change");
                        });
                        $(".fan-playerhome-myteam-show").trigger("change");

                        $(".fan-playerhome-thumbclick").unbind().bind("click", function() {
                            var uid = $(" span", $(this).parent()).eq(0).html();
                            var up;
                            if ($(this).hasClass("thumbupOn")) {
                                $(this).removeClass("thumbupOn");
                                up = false;
                            } else {
                                $(this).addClass("thumbupOn");
                                up = true;
                            }
                            if (CSR == uid) { //thumbsup for yourself
                                playerHomeThumbsupReceived(playerHomeThumbsupReceived() + (up ? 1 : -1));
                            }
                            if (CSR == $.cookie("TP1Username")) { //your player home
                                playerHomeThumbsupGiven(playerHomeThumbsupGiven() + (up ? 1 : -1));
                            }

                            var tsel = $(" .thumbcount", $(this).parent()).eq(0);
                            var thumbcount = parseInt($(tsel).html().substring(1), 10);
                            //alert("debug: 2 thumbcount=" + thumbcount);
                            thumbcount += up ? 1 : -1;
                            $(tsel).html("+" + thumbcount);

                            var weekid = playerhome_weekid; //$(" span",$(this).parent()).eq(1).html();
                            var context = bTeamInActiveGame_withDelay ? "agame-roster-performance" : 'teammate-performance';
                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "fan",
                                    cmd: "thumbsup",
                                    context: context,
                                    test: testq,
                                    CSR: CSR,
                                    touid: uid,
                                    up: up,
                                    weekid: weekid
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror
                            });
                            //alert("debug: Thumbsup = " + up + " for uid=" + uid +", weekid=" + weekid);
                            return false;
                        });

                        function setthumbitem(me) {
                            var imon = $(me).hasClass("player-profile-thumbsup-item--on");
                            $(".player-profile-thumbsup-item").removeClass("player-profile-thumbsup-item--on");
                            $(".player-thumbsup-list-given,.player-thumbsup-list-received").css("display", "none");
                            if (imon) {
                                return false;
                            } else {
                                $(me).addClass("player-profile-thumbsup-item--on");
                                return true;
                            }
                        }
                        $(".player-profile-thumbsup-item-received").unbind().bind("click", function() {
                            if (setthumbitem(this)) {
                                $(".player-thumbsup-list-received").css("display", "block");
                                /* TODO: Get list of received thumbsup */
                            }
                        });
                        $(".player-profile-thumbsup-item-given,.player-profile-thumbsup-item-received").unbind().bind("click", function() {
                            if (setthumbitem(this)) {
                                var given = false;
                                if ($(this).hasClass("player-profile-thumbsup-item-given")) {
                                    given = true;
                                    $(".player-thumbsup-list-given").css("display", "block");
                                } else {
                                    $(".player-thumbsup-list-received").css("display", "block");
                                }
                                /* TODO: Get list of thumbsup */
                                var weekid = playerhome_weekid; //$(" span",$(this).parent()).eq(1).html();
                                var context = bTeamInActiveGame_withDelay ? "agame-roster-performance" : 'teammate-performance';
                                //alert("debug: weekid=" + weekid);
                                //alert("debug: teamsid=" + Teamsid);
                                var cs = CSR;
                                if (specialteam()) { //Safety switch - Make this false to defeat experimental "Team Leader Player Home"
                                    cs = $.cookie("TP1Username");
                                }
                                a$.ajax({
                                    type: "GET",
                                    service: "JScript",
                                    async: true,
                                    data: {
                                        lib: "fan",
                                        cmd: "getthumblist",
                                        given: given,
                                        context: context,
                                        Teamsid: Teamsid,
                                        test: testq,
                                        CSR: cs,
                                        weekid: weekid
                                    },
                                    dataType: "json",
                                    cache: false,
                                    error: a$.ajaxerror,
                                    success: thumblistcallback
                                });

                                /*
                                thumblistcallback({
                                    given: false,
                                    thumblist: [{
                                        stamp: 0, //(absolute time im milliseconds),
                                        team: {
                                            stg: {
                                                colors: ['red','blue']
                                            }
                                        },
                                        player: {
                                            uid: "",
                                            name: "",
                                            avatarfilename: "",
                                            stg: {
                                                slogan;
                                            }
                                        }
                                    ]
                                });
                                <div class="thumbup-list-row">
                                    <div class="player-photo-avatar avatar-circle" data-bind="visible: avatarfilename != ''">
                                        <img data-bind="attr: { src: 'avatars/' + ((avatarfilename=='') ? 'empty_headshot.png' :  avatarfilename), alt: name, title: name }" width="30" />
                                    </div>
                                    <div class="avatar-number avatar-number-table" data-bind="visible: avatarfilename == '',style: { backgroundColor: $parent.team.stg.colors[0], color: (($parent.team.stg.colors[0]=='white')&&($parent.team.stg.colors[1]=='white')) ? 'lightgray' : $parent.team.stg.colors[1] }, text: (playerstg == null ? '#' : playerstg.jersey=='' ? '#' : playerstg.jersey)">
                                        55
                                    </div>
                                    <div class="avatar-name" style="margin-left: 38px;">
                                        <span>Jessica Kenington</span>
                                        <div class="player-date">
                                            1:30pm
                                        </div>
                                    </div>
                                </div>
                                */

                                function thumblistcallback(json) {
                                    if (a$.jsonerror(json)) {} else {
                                        var rightnow = new Date();
                                        var ml = json.thumblist;
                                        var bld = "";
                                        for (var i in ml) {
                                            bld += '<div class="thumbup-list-row">';
                                            if (ml[i].player.avatarfilename != "") {
                                                bld += '<div class="player-photo-avatar avatar-circle">';
                                                bld += '  <img src="avatars/' + ((ml[i].player.avatarfilename == "") ? "empty_headshot.png" : ml[i].player.avatarfilename) + '" alt="' + ml[i].player.name + '" title="' + ml[i].player.name + '" width="30" />';
                                                bld += '</div>';
                                            } else {
                                                bld += '<div class="avatar-number avatar-number-table" style="background-color:' + ml[i].team.stg.colors[0] + ';color:' + ((ml[i].team.stg.colors[1] == "white") ? "lightgray" : ml[i].team.stg.colors[1]) + '">';
                                                bld += ((ml[i].player.stg.jersey == '') ? "#" : ml[i].player.stg.jersey);
                                                bld += '</div>';
                                            }
                                            bld += '  <div class="avatar-name" style="margin-left: 38px;">';
                                            bld += '    <span>' + ml[i].player.name + '</span>';
                                            bld += '    <div class="player-date">';
                                            //TODO: Date work
                                            var d = new Date()
                                            d.setTime(ml[i].stamp);
                                            var ampm = "AM";
                                            var hours = d.getHours();
                                            if (d.getHours() >= 12) {
                                                ampm = "PM";
                                            }
                                            if (d.getHours() > 12) {
                                                hours -= 12;
                                            }
                                            if (hours == 0) hours = 12;
                                            var datestring = "";
                                            if ((rightnow.getDate() != d.getDate()) || (rightnow.getMonth() != d.getMonth())) {
                                                datestring = (d.getMonth() + 1) + '/' + d.getDate() + ' ';
                                            }
                                            datestring += hours + ":" + zeroPad(d.getMinutes(), 2) + ampm;
                                            bld += datestring;
                                            bld += '    </div>';
                                            bld += '  </div>';
                                            bld += '</div>';
                                        }
                                        var sel = "";
                                        if (json.given) {
                                            sel = ".player-thumbsup-list-given";
                                        } else {
                                            sel = ".player-thumbsup-list-received";
                                        }
                                        $(sel).html(bld);
                                    }
                                }
                            }
                        });
                    }
                }
                break;
            case "Team Owner Guide":
            case "Supervisor Guide":
            case "FLEX User Guide":
                break;
            case "Divisions":
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getleagues",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR,
                        League: leagueCrumb(),
                        Fantasy: self.fantasyViewing()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedLeagues
                });

                function loadedLeagues(json) {
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        leagues({});
                    } else {
                        for (var j in json.leagues) {
                            if (json.leagues[j].activeGames <= 0) {
                                json.leagues[j].seasonWeekNumber = "N/A";
                            }
                        }
                        leagues(json);
                        clearAvatars({
                            section: name
                        });
                        for (var i in json.leagues) {
                            var ele = $(".fan-leaguesetup tbody").children("tr").eq(i).children("td").eq(1); //Second TD in each TR record.
                            //var ele = $(".fan-leaguesetup tbody").children("tr").eq(i).children("td").eq(0).children("span").eq(1); //Second SPAN in first TD of each TR record.
                            uid++;
                            $(ele).removeAttr("id").attr("id", uid);
                            drawAvatar({
                                theme: debug ? "basketball" : self.theme(),
                                item: "teamicon",
                                id: uid,
                                colors: ["black", "black"],
                                heightInPixels: 20,
                                flip: false,
                                section: name
                            });
                        }
                        //drawAvatar({ theme: debug ?"basketball" : self.theme(), item: "teamicon", id: "testid", colors: ["black", "red"], heightInPixels: 320, flip: false, section: name });
                    }
                }
                break;
            case "League Admin":
                //alert("debug: orole2=" + self.oRole());
                //alert("debug: role cookie=" + $.cookie("TP1Role"));
                oRole($.cookie("TP1Role")); //TODO: This wasn't set for Bluegreen (Was undefined).  Not sure why or how because League Admin showed up.
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getleagueadmin",
                        gametype: gametype(),
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedLeagueAdmin
                });

                function loadedLeagueAdmin(json) {
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        leagueadmin({});
                    } else {
                        leagueadmin(json);
                        $(".fan-spytable-setRLock").unbind().bind("change", function() {
                            //I LOVE jquery.  This is almost IMPOSSIBLE to do in knockout (at least at my level of understanding).
                            //alert("debug: rlock changed to " + $(this).is(":checked") + " for teams_id =" + $(" span",$(this).parent()).html() );
                            //Saving Team Setup
                            var teams_id = parseInt($(" span", $(this).parent()).html(), 10);
                            for (var i in json.spytable) {
                                if (json.spytable[i].teams_id == teams_id) {
                                    json.spytable[i].stg.overrideRosterLock = $(this).is(":checked");
                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: false,
                                        data: {
                                            lib: "fan",
                                            test: testq,
                                            testdateoffset: testdateoffset,
                                            cmd: "saveteamstg",
                                            role: $.cookie("TP1Role"),
                                            fanTeamsId: teams_id,
                                            stg: json.spytable[i].stg
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: savedTeamSTG
                                    });

                                    function savedTeamSTG() {
                                        if (a$.jsonerror(json)) {}
                                    }
                                    break;
                                }
                            }
                        });

                    }
                }
                break;
            case "Stats":
                if (statsstarted) {
                    break;
                }
                statsstarted = true;
                $(".fan-source-control").unbind().bind("change", function() {
                    if ($(this).val() != "Overall") {
                        if ($(".fan-groupby-control").val() == "league") {
                            alert("Note: Only completed games show up in the individual game stats view.  When viewing by league, it's possible that some matchups in other divisions have not yet completed their corresponding games.");
                        }
                    }
                });
                a$.showprogress("plotprogress");
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getstats",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedStats
                });

                function loadedStats(json) {
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        stats({});
                    } else {
                        a$.hideprogress("plotprogress");

                        //DEBUG
                        //for (var i in json.stats.playerstats) {
                        //json.stats.playerstats[i].exclude = 'N';
                        //}

                        sj = json.stats;

                        displayexcluded();
                        self.fanStatsLoaded(true);


                        $(".fan-stats-tablesorter").each(function() {
                            //Find the column called "Rank"
                            //$(this).tablesorter({ sortList: [[4, 0]] });
                            $(this).tablesorter({}); //The "Rank" may be in various columns, so not save to sort by column

                        });
                        $(".table-expand").unbind().bind("click", function() {
                            var name = $(this).html();
                            for (var i in plusColumns) {
                                if (plusColumns[i].name == name) {
                                    plusColumns[i].expand = !plusColumns[i].expand;
                                    switch (name) {
                                        case "MVP":
                                            self.showPlusMVP(plusColumns[i].expand);
                                            break;
                                        case "MIP":
                                            self.showPlusMIP(plusColumns[i].expand);
                                            break;
                                        case "During Season":
                                            self.showPlusGAME(plusColumns[i].expand);
                                            break;
                                        case "Prior to Season":
                                            self.showPlusPRIOR(plusColumns[i].expand);
                                            break;
                                        case "Details":
                                            self.showPlusDETAIL(plusColumns[i].expand);
                                            break;
                                    }
                                }
                            }
                        });
                        $(".table-dud").unbind();
                        $('.tool-stats-mvp').qtip({
                            content: '((AVG_SCORE - START *.50) + (AVG_SCORE - NON-START *.25) + (Most Improved Score)) * GAMUT QUOTIENT'
                        });
                        $('.tool-stats-mip').qtip({
                            content: 'Average Game Score (Start/non-Start) less Performance Baseline'
                        });
                        $('.tool-stats-game').qtip({
                            content: 'Average A-GAME balanced score (start/non-Start).'
                        });
                        $('.tool-stats-prior').qtip({
                            content: 'Average balanced score 90 days prior to A-GAME season start.'
                        });
                        $('.tool-stats-gamut').qtip({
                            content: '% of KPI  data provided for Avg Score All calculation'
                        });
                        /*
                        var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
                        if (!is_chrome) {
                            $(".fan-stats-slow").html("Is your Stats view slow to respond?").css("margin-top", "8px").qtip({ content: "Please use the Chrome browser for best performance while in the Stats view." });
                        }
                        */
                    }
                }
                break;
            case "Matchup":
            case "Team":
                if (Team == null) Team = "";
                if ((Team == "") && (CSR == "")) {
                    if (gametype() == "team") {
                        if ((a$.urlprefix() == "km2.") || (a$.urlprefix() == "km2-make40.")) {
                            selectSection("Scores");
                        } else {
                            if (self.fantasyDraftPending()) {
                                selectSection("Xtreme");
                            } else {
                                selectSection("TV");
                            }
                        }
                    } else {
                        selectSection("Standings");
                    }
                    break;
                }
                a$.showprogress("plotprogress");
                //BAND-AID 2018-01-08 bandaid todo:
                var mycsr = CSR;
                if ((Teamsid == "") && (Team != "") && (CSR != "")) {
                    mycsr = "";
                }
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getmatchups",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: mycsr,
                        week: matchupWeek()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedMatchups
                });

                function loadedMatchups(json) {
                    a$.hideprogress("plotprogress");
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        matchups({});
                        //if (earlyrelease) { self.selectSection("Schedule"); }
                        //else { self.selectSection("Roster"); }
                    } else if (a$.exists(json.noGameFound)) {
                        matchups({}); //TODO: Make the roster view invisible, and put up friendly language for the non-participant.
                        if (gametype() == "Team") {
                            selectSection("TV");
                        } else {
                            if (a$.urlprefix() == "walgreens.") {
                                selectSection("Standings");
                            }
                            else {
                                selectSection("Rules");
                            }
                        }
                    } else {
                        doublebye = false;
                        for (var i in json.matchups) {
                            if ((json.matchups[i].home.bye == "Y") && (json.matchups[i].visitor.bye == "Y")) {
                                doublebye = true;
                                break;
                            }
                            var bye = false;
                            if (json.matchups[i].season == 'R') {
                                json.matchups[i].seasonText = 'Regular Season';
                            } else if (json.matchups[i].season == 'P') {
                                json.matchups[i].seasonText = 'Playoffs';
                            }
                            if (json.matchups[i].home.bye == "N") {
                                for (var j in json.matchups[i].home.roster) {
                                    json.matchups[i].home.roster[j].matched = false;
                                }
                            } else { //Home BYE
                                bye = true;
                            }
                            if (json.matchups[i].visitor.bye == "N") {
                                for (var j in json.matchups[i].visitor.roster) {
                                    json.matchups[i].visitor.roster[j].matched = false;
                                }
                            } else {
                                bye = true;
                            }

                            //CLUGUE for Multi-team CSRs.  Simply take one of them out before matching them up.  This situation presents a lot of paradoxes.
                            for (var j = json.matchups[i].home.roster.length - 2; j >= 0; j--) {
                                if (json.matchups[i].home.roster[j].uid == json.matchups[i].home.roster[j + 1].uid) {
                                    json.matchups[i].home.roster.splice(j + 1, 1);
                                }
                            }
                            for (var j = json.matchups[i].visitor.roster.length - 2; j >= 0; j--) {
                                if (json.matchups[i].visitor.roster[j].uid == json.matchups[i].visitor.roster[j + 1].uid) {
                                    json.matchups[i].visitor.roster.splice(j + 1, 1);
                                }
                            }

                            if (!bye) {
                                for (var j in json.matchups[i].home.roster) {
                                    if (!json.matchups[i].home.roster[j].matched) {
                                        for (var k in json.matchups[i].visitor.roster) {
                                            if (!json.matchups[i].visitor.roster[k].matched) {
                                                if (json.matchups[i].home.roster[j].position == json.matchups[i].visitor.roster[k].position) {
                                                    json.matchups[i].home.roster[j].v_uid = json.matchups[i].visitor.roster[k].uid;
                                                    json.matchups[i].home.roster[j].v_name = json.matchups[i].visitor.roster[k].name;
                                                    json.matchups[i].home.roster[j].v_balScore = json.matchups[i].visitor.roster[k].balScore.toFixed(2);
                                                    json.matchups[i].home.roster[j].v_excludeFlag = json.matchups[i].visitor.roster[k].excludeFlag;
                                                    json.matchups[i].home.roster[j].v_requiredKPIPct = json.matchups[i].visitor.roster[k].requiredKPIPct;
                                                    json.matchups[i].home.roster[j].v_position = json.matchups[i].visitor.roster[k].position;
                                                    json.matchups[i].home.roster[j].v_weight = json.matchups[i].visitor.roster[k].weight;
                                                    json.matchups[i].home.roster[j].v_score = json.matchups[i].visitor.roster[k].score.toFixed(2);
                                                    json.matchups[i].home.roster[j].v_project = {};
                                                    json.matchups[i].home.roster[j].v_project.id = json.matchups[i].visitor.roster[k].project.id;
                                                    json.matchups[i].home.roster[j].v_project.name = json.matchups[i].visitor.roster[k].project.name;
                                                    json.matchups[i].home.roster[j].v_location = {};
                                                    json.matchups[i].home.roster[j].v_location.id = json.matchups[i].visitor.roster[k].location.id;
                                                    json.matchups[i].home.roster[j].v_location.name = json.matchups[i].visitor.roster[k].location.name;
                                                    json.matchups[i].home.roster[j].v_group = {};
                                                    json.matchups[i].home.roster[j].v_group.id = json.matchups[i].visitor.roster[k].group.id;
                                                    json.matchups[i].home.roster[j].v_group.name = json.matchups[i].visitor.roster[k].group.name;
                                                    json.matchups[i].home.roster[j].v_team = {};
                                                    json.matchups[i].home.roster[j].v_team.id = json.matchups[i].visitor.roster[k].team.id;
                                                    json.matchups[i].home.roster[j].v_team.name = json.matchups[i].visitor.roster[k].team.name;

                                                    json.matchups[i].home.roster[j].matched = true;
                                                    json.matchups[i].visitor.roster[k].matched = true;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                if (json.matchups[i].home.bye == "N") { //visitor bye
                                } else {
                                    //alert("debug: Home Byes don't display properly at this time.");
                                }
                            }

                            json.matchups[i].home.v_bye = json.matchups[i].visitor.bye;
                            if (json.matchups[i].visitor.bye == "N") {
                                for (var j in json.matchups[i].home.roster) {
                                    if (!json.matchups[i].home.roster[j].matched) {
                                        json.matchups[i].home.roster[j].v_uid = "";
                                        json.matchups[i].home.roster[j].v_name = "No Match Found";
                                        json.matchups[i].home.roster[j].v_balScore = 0.0;
                                        json.matchups[i].home.roster[j].v_excludeFlag = "N";
                                        json.matchups[i].home.roster[j].v_requiredKPIPct = 1.0;
                                        json.matchups[i].home.roster[j].v_position = "";
                                        json.matchups[i].home.roster[j].v_weight = 0;
                                        json.matchups[i].home.roster[j].v_score = 0.0;
                                        json.matchups[i].home.roster[j].v_project = {};
                                        json.matchups[i].home.roster[j].v_project.id = 0;
                                        json.matchups[i].home.roster[j].v_project.name = "";
                                        json.matchups[i].home.roster[j].v_location = {};
                                        json.matchups[i].home.roster[j].v_location.id = 0;
                                        json.matchups[i].home.roster[j].v_location.name = "";
                                        json.matchups[i].home.roster[j].v_group = {};
                                        json.matchups[i].home.roster[j].v_group.id = 0;
                                        json.matchups[i].home.roster[j].v_group.name = "";
                                        json.matchups[i].home.roster[j].v_team = {};
                                        json.matchups[i].home.roster[j].v_team.id = 0;
                                        json.matchups[i].home.roster[j].v_team.name = "";
                                    }
                                }
                            } else {
                                for (var j in json.matchups[i].home.roster) {
                                    if (!json.matchups[i].home.roster[j].matched) {
                                        json.matchups[i].home.roster[j].v_uid = "";
                                        json.matchups[i].home.roster[j].v_name = "";
                                        json.matchups[i].home.roster[j].v_balScore = "";
                                        json.matchups[i].home.roster[j].v_excludeFlag = "";
                                        json.matchups[i].home.roster[j].v_requiredKPIPct = 1.0;
                                        json.matchups[i].home.roster[j].v_position = "";
                                        json.matchups[i].home.roster[j].v_weight = "";
                                        json.matchups[i].home.roster[j].v_score = "";
                                        json.matchups[i].home.roster[j].v_project = {};
                                        json.matchups[i].home.roster[j].v_project.id = 0;
                                        json.matchups[i].home.roster[j].v_project.name = "";
                                        json.matchups[i].home.roster[j].v_location = {};
                                        json.matchups[i].home.roster[j].v_location.id = 0;
                                        json.matchups[i].home.roster[j].v_location.name = "";
                                        json.matchups[i].home.roster[j].v_group = {};
                                        json.matchups[i].home.roster[j].v_group.id = 0;
                                        json.matchups[i].home.roster[j].v_group.name = "";
                                        json.matchups[i].home.roster[j].v_team = {};
                                        json.matchups[i].home.roster[j].v_team.id = 0;
                                        json.matchups[i].home.roster[j].v_team.name = "";
                                    }
                                }
                            }
                            if (json.matchups[i].visitor.bye == "N") {
                                for (var j in json.matchups[i].visitor.roster) {
                                    if (!json.matchups[i].visitor.roster[j].matched) {
                                        if (json.matchups[i].home.bye != "N") {
                                            json.matchups[i].home.roster.push({
                                                position: "",
                                                uid: "",
                                                name: "",
                                                requiredKPIPct: 1.0,
                                                balScore: "",
                                                excludeFlag: "N",
                                                weight: "",
                                                score: "",
                                                project: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                location: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                group: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                team: {
                                                    id: 0,
                                                    name: ""
                                                }
                                            });
                                        } else {
                                            json.matchups[i].home.roster.push({
                                                position: "",
                                                uid: "",
                                                name: "No Match Found",
                                                requiredKPIPct: 1.0,
                                                project: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                location: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                group: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                team: {
                                                    id: 0,
                                                    name: ""
                                                },
                                                balScore: 0.0,
                                                excludeFlag: "N",
                                                weight: 0,
                                                score: 0
                                            });
                                        }
                                        var k = json.matchups[i].home.roster.length - 1;
                                        json.matchups[i].home.roster[k].v_uid = json.matchups[i].visitor.roster[j].uid;
                                        json.matchups[i].home.roster[k].v_name = json.matchups[i].visitor.roster[j].name;
                                        json.matchups[i].home.roster[k].v_balScore = json.matchups[i].visitor.roster[j].balScore.toFixed(2);
                                        json.matchups[i].home.roster[k].v_excludeFlag = json.matchups[i].visitor.roster[j].excludeFlag;
                                        json.matchups[i].home.roster[k].v_requiredKPIPct = json.matchups[i].visitor.roster[j].requiredKPIPct;
                                        json.matchups[i].home.roster[k].v_position = json.matchups[i].visitor.roster[j].position;
                                        json.matchups[i].home.roster[k].v_weight = json.matchups[i].visitor.roster[j].weight;
                                        json.matchups[i].home.roster[k].v_score = json.matchups[i].visitor.roster[j].score.toFixed(2);
                                        json.matchups[i].home.roster[k].v_project = {};
                                        json.matchups[i].home.roster[k].v_project.id = json.matchups[i].visitor.roster[j].project.id;
                                        json.matchups[i].home.roster[k].v_project.name = json.matchups[i].visitor.roster[j].project.name;
                                        json.matchups[i].home.roster[k].v_location = {};
                                        json.matchups[i].home.roster[k].v_location.id = json.matchups[i].visitor.roster[j].location.id;
                                        json.matchups[i].home.roster[k].v_location.name = json.matchups[i].visitor.roster[j].location.name;
                                        json.matchups[i].home.roster[k].v_group = {};
                                        json.matchups[i].home.roster[k].v_group.id = json.matchups[i].visitor.roster[j].group.id;
                                        json.matchups[i].home.roster[k].v_group.name = json.matchups[i].visitor.roster[j].group.name;
                                        json.matchups[i].home.roster[k].v_team = {};
                                        json.matchups[i].home.roster[k].v_team.id = json.matchups[i].visitor.roster[j].team.id;
                                        json.matchups[i].home.roster[k].v_team.name = json.matchups[i].visitor.roster[j].team.name;
                                    }
                                }
                            }
                            for (var j in json.matchups[i].home.roster) {
                                if (json.matchups[i].home.roster[j].balScore != "") {
                                    json.matchups[i].home.roster[j].balScore = json.matchups[i].home.roster[j].balScore.toFixed(2);
                                    json.matchups[i].home.roster[j].score = json.matchups[i].home.roster[j].score.toFixed(2);
                                }
                            }
                            if ((a$.urlprefix() == "XXXers.") && (Role == "CSR")) {} else if (((a$.urlprefix() == "XXXbgr.") || (a$.urlprefix() == "XXXces.")) && ((Role == "CSR"))) { // || (Role == "Team Leader")
                            } else if ((a$.urlprefix() == "XXXkm2.")) { // || (Role == "Team Leader")
                            } else {                            	
                                $(".headericon-agame").addClass("headericon-agame-" + theme());
                                $(".headericon-agame-backdrop").addClass("headericon-" + theme());
                                $(".headericon-agame").show();
                                $(".headericon-agame-gamestatus").html(json.matchups[i].gameStatus).show();
                                $(".headericon-agame-gamescore").html("" + Math.round(json.matchups[i].home.score, 0) + " to " + Math.round(json.matchups[i].visitor.score, 0)).show();
                                $(".map-scoreboard").show();

				                        clearAvatars({
        			                    section: "map"
              				          });
                                                                	
                                var o = json.matchups[i].home.stg;
								            		if (o.colors[0] == "lightgray") o.colors[0] = "orange";
            										if (o.colors[1] == "darkgray") o.colors[1] = "crimson";
                                $(".map-home-score").css("background-color",o.colors[0]).css("color",o.colors[1]).html(json.matchups[i].home.score.toFixed(0));
                                $(".map-home-teamname").html(json.matchups[i].home.fanTeamName);

		                            var ics=[".map-home-teamicon"];
		                            for (var ic in ics) {
		                            	uid++;
    		                        	$(ics[ic]).eq(0).html("").removeAttr("id").attr("id", uid);
		                            	drawAvatar({
    	                            	theme: debug ? "basketball" : self.theme(),
      	                          	item: "teamicon",
        	                        	id: uid,
          	                      	colors: o.colors,
            	                    	heightInPixels: 60,
              	                  	flip: false,
                	                	section: "map"
                  	          		});
                  	          	}

																o = json.matchups[i].visitor.stg;
								            		if (o.colors[0] == "lightgray") o.colors[0] = "orange";
            										if (o.colors[1] == "darkgray") o.colors[1] = "crimson";            										
                                $(".map-visitor-score").css("background-color",o.colors[0]).css("color",o.colors[1]).html(json.matchups[i].visitor.score.toFixed(0));
                                $(".map-visitor-teamname").html(json.matchups[i].visitor.fanTeamName);
                                
                                var ics=[".map-visitor-teamicon"];
		                            for (var ic in ics) {
		                            	uid++;
    		                        	$(ics[ic]).eq(0).html("").removeAttr("id").attr("id", uid);
		                            	drawAvatar({
    	                            	theme: debug ? "basketball" : self.theme(),
      	                          	item: "teamicon",
        	                        	id: uid,
          	                      	colors: o.colors,
            	                    	heightInPixels: 60,
              	                  	flip: false,
                	                	section: "map"
                  	          		});
                  	          	}

                                $(".map-gamestatus").html(json.matchups[i].gameStatus);
                                $(".map-gamedates").html(json.matchups[i].gameDates);
                                                                
                                //Force a reload of Standings here to populate standingsSave
								                a$.ajax({
                    							type: "GET",
                    							service: "JScript",
                    							async: true,
                    							data: {
                        						lib: "fan",
                        							test: testq,
                        							testdateoffset: testdateoffset,
                        							gametype: gametype(),
                        							cmd: "getstandings",
                        							role: $.cookie("TP1Role"),
                        							Teamsid: Teamsid,
                        							Team: Team,
                        							CSR: CSR,
                        							League: leagueCrumb(),
                        							Fantasy: self.fantasyViewing()
                    							},
                    							dataType: "json",
                    							cache: false,
                    							error: a$.ajaxerror,
                    							success: loadedStandingsSave
                								});

								                function loadedStandingsSave(json) {
							                    if (a$.jsonerror(json)) {
							                    }
							                    else {                        
                        						standingsSave = json.standings;
                        						//TODO: duck - load all the island modals with scores of who's on each island.
                        						//Note: You're not competing with others on your island, so what gets displayed?
                        						//I should probably just display the flower and team name for everyone on that island - can do this without asking.
                        						//Could launch out of there with a link to "show current matchup", that would be cool.
                        						//As a CSR, are you allowed to look at the matchups of others?
                        						//NO - CSR's can't view the matchups of other people, and if we open this there are lots of loose ends.
                        						//Perhaps the inset needs designed to:
                        						//  1) List everyone on the island AND their competitor.
                        						//  2) Designate the Island (& # wins) that the competitor is on.
                        					}
                        				}                                
                            }
                        }
                        if (doublebye) {
                        		//doublebye is a symptom of not having scores run. //MADELIVE
                        		var keepgoing = true;
                        		if (json.gameInPlay == "U") { //scores unavailble
															if ($.cookie("TP1Role") == "CSR") {
																if (json.matchups[0].seasonWeekNumber > 1) {
																	keepgoing = false;
																	matchupWeek(-1);
																	selectSection("Matchup");
																}
															}
                        		}
                        		if (keepgoing) {
                            	if (earlyrelease) {
                              	  self.selectSection("Schedule");
                            	} else {
                              	  if (specialteam()) {
                                	    self.selectSection("Player Home"); //No need to go to the roster if it's a double-bye.
                                	}
                                	else if ((CSR != "")&&(CSR != "each")) {
                                    	self.selectSection("Player Home");
                                	} else {
                                    	self.selectSection("Roster");
                                	}
                            	}
                            }
                            return;
                        }
                        if (!json.matchups.length) {
                            self.selectSection("Map");
                        }
                        try {
                            json.matchups[0].prompt = "";
                        } catch (error) {}
                        //json.matchups[0].prompt = "Regular Season Game 1 is in play.  Roster selection must be finalized by Wednesday at 5pm EST.";

                        // "Week 1's games are in review.  Week 2 matchups will play beginning Wednesday evening this week.  Please set up your rosters to be ready for week 2.";
                        matchups({});
                        matchups(json);
                        bindDashboardLinks();
                        /*
                            if (json.matchups[0].prompt != "") {
                            function mafeedloop() {
                            var t = json.matchups[0].prompt.length * 12; //Width of the text?
                            $(".fan-ticker-slide").css("left", "200px");
                            $(".fan-ticker-slide").animate({ left: "-" + t }, t * 20000, "linear", mafeedloop);

                            //$(".fan-tv-gamefeed").animate({ top: "-" + t }, json.tv.gameFeed.length * 7000, "linear", feedloop);
                            }
                            mafeedloop();
                            }
                            */
                        clearAvatars({
                            section: name
                        });

                        //.fan-helmet-home, .fan-helmet-visitor
                        for (var i in json.matchups) {
                            uid++;
                            var ele = $(".fan-helmet-home")[0];
                            $(ele).removeAttr("id").attr("id", uid); //DONE: I need to pass the theme.
                            drawAvatar({
                                theme: debug ? "basketball" : self.theme(),
                                item: "teamicon",
                                id: uid,
                                colors: json.matchups[i].home.stg.colors,
                                heightInPixels: 60,
                                flip: false,
                                section: name
                            });
                            ele = $(".fan-helmet-visitor")[0];
                            uid++;
                            $(ele).removeAttr("id").attr("id", uid); //DONE: I need to pass the theme.
                            drawAvatar({
                                theme: debug ? "basketball" : self.theme(),
                                item: "teamicon",
                                id: uid,
                                colors: json.matchups[i].visitor.stg.colors,
                                heightInPixels: 60,
                                flip: true,
                                section: name
                            });
                            break;
                        }
                        if ($.cookie("TP1Role") != "CSR") { //Added the condition on 2017-12-14.
                            self.selectedSection("Matchup"); //TODO: This may behave weirdly, but is a cheap way to come back to the matchup view if a previous redirection sent you to the home view.
                        }
                        if (json.gameInPlay == "N") {
                            if (inplayoffs) {
                                gameinplay = "N";
                                if (!senttoplayoffs) {
                                    for (var i in mysections.list) {
                                        if (mysections.list[i].name == "PLAYOFFS") {
                                            if (mysections.list[i].show) {
                                                senttoplayoffs = true;
                                                selectSection("PLAYOFFS");
                                                break;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    if (MapRedirect) {
                        MapRedirect -= 1;
                        if (MapRedirect < 0) MapRedirect = 0;
                        if (a$.urlprefix() == "walgreens.") {
                            self.selectSection("Standings");
                        }
                        else {
                            self.selectSection("Map");
                        }
                    }
                    else if (PlayerHomeRedirect) {
                        PlayerHomeRedirect = false;
                        if (specialteam()) {
                            self.selectSection("Player Home"); //TODO: May want them to go to the roster.
                        }
                        else if ((CSR != "") && (CSR != "each")) { //Removed 2017-03-27 }(($.cookie("TP1Role")=="Team Leader") ||  ($.cookie("TP1Role")=="CSR")) { //Added 2017-03-13
                            self.selectSection("Player Home");
                        }
                    }
                }
                break;
            case "Hm":
                break;
            case "Top5":
                getTop5();
                break; //end top5
            case "Position Play":
            case "Events":
                eventsDisplayingAll(true); //was false
                if (((CSR == "") || (CSR == "each")) && ((Team == "") || (Team == "each"))) {
                    $(".headericon-agame").hide();
				            $(".map-scoreboard").hide();
                }
                var curpos = $(".fan-events-positions").eq(0).val();
                if (!a$.exists(curpos)) {
                    curpos = firstevent;
                } else if (curpos == "") {
                    curpos = firstevent;
                }

                if (playerhomepositionset) {
                    curpos = positionName;
                    eventsDivision("0");
                    playerhomepositionset = false;
                }

                function getplayeridx() {
                    var today = new Date();
                    var dd = "" + today.getDate();
                    if (dd.length == 1) dd = "0" + dd;
                    var mm = "" + (today.getMonth() + 1); //January is 0!
                    if (mm.length == 1) mm = "0" + mm;
                    var yyyy = "" + today.getFullYear();

                    var compdt = yyyy + mm + dd;
                    var zeroidx = 0;
                    for (var i in player.weeks) {
                        //Determine the week for each week.
                        var sts = player.weeks[i].start.split("/");
                        var ens = player.weeks[i].end.split("/");
                        var stc = sts[2] + sts[0] + sts[1];
                        var enc = ens[2] + ens[0] + ens[1];
                        if ((compdt >= stc) && (compdt <= enc)) {
                            zeroidx = i;
                            break;
                        }
                    }
                    return zeroidx - matchupWeek();
                }
                $(".fan-events-player").hide();
                eventsplayershowing = false;
                $(".fan-events-feature").css("margin-left", "");

                if (positionChanged == "Y") {
                    if (playerLoaded) {
                        var idx = getplayeridx();
                        if (player.weeks[idx].position == positionName) {
                            if (false) {
                                $(".fan-events-player").show();
                            }
                            eventsplayershowing = true;
                            $(".fan-events-feature").css("margin-left", "400px");
                        }
                    }
                    getEvents(positionName);
                } else if (true) { //Changed 2017-03-27: Player View is no longer in Position Play }((CSR == "") || (CSR == "each")) {
                    getEvents(curpos); //TODO: Should I substitute the name of the first event, or just let it be an extra cache entry?
                } else if (playerLoaded) {
                    //Find the event the player played in for the week you're going to look at.
                    //Then
                    if ((player.id == "") || (player.weeks.length == 0)) {
                        getEvents(curpos);
                    } else {
                        var idx = getplayeridx();
                        if (idx > player.weeks.length) {
                            getEvents(firstevent);
                        } else {
                            $(".fan-events-player-name span").html(player.name);
                            $(".fan-events-player-fanteamname span").html(player.fanTeamName);
                            var jersey = "#";
                            if (player.stg.jersey != "") jersey = player.stg.jersey;
                            $(".fan-events-player-jersey span").html(jersey);
                            if ((player.teamStg.colors[0] == player.teamStg.colors[1]) && (player.teamStg.colors[0] == "white")) {
                                $(".fan-events-player-jersey").css("color", "");
                                $(".fan-events-player-jersey").css("background-color", "");
                                $(".fan-events-player-jersey").css("border-color", "");
                            } else {
                                $(".fan-events-player-jersey").css("color", player.teamStg.colors[1]);
                                $(".fan-events-player-jersey").css("background-color", player.teamStg.colors[0]);
                                $(".fan-events-player-jersey").css("border-color", player.teamStg.colors[1]);
                            }
                            $(".fan-events-player-nickname span").html(player.stg.nickname);
                            var slogan = "";
                            if (!a$.exists(player.stg.slogan)) {
                                player.stg.slogan = "";
                            }
                            if (player.stg.slogan != "") {
                                slogan = '"' + player.stg.slogan + '"';
                            }
                            $(".fan-events-player-slogan span").html(slogan);
                            $(".fan-events-player-avatar").attr("src", "avatars/" + player.avatar);
                            $(".fan-events-player-event span").html(player.weeks[idx].position);
                            $(".fan-events-player-score span").html(player.weeks[idx].score);
                            $(".fan-events-player-rank span").html(player.weeks[idx].rank);

                            if (false) {
                                $(".fan-events-player").show();
                                eventsplayershowing = true;
                                $(".fan-events-feature").css("margin-left", "400px");
                            }

                            $(".fan-events-player-prompt").html("Retrieving Event...");
                            getEvents(player.weeks[idx].position);
                        }
                    }
                    //getEvents(positionName); //Is this necessary?
                } else {
                    //Load Player, set positionChanged to "N", then selectSection("Events");
                    //a$.showprogress("plotprogress");
                    if ($.cookie("TP1Role") == "CSR") { //TODO: FIX THIS!
                        a$.ajax({
                            type: "GET",
                            service: "JScript",
                            async: true,
                            data: {
                                lib: "fan",
                                test: testq,
                                testdateoffset: testdateoffset,
                                cmd: "loadPlayer",
                                gametype: gametype(),
                                CSR: CSR
                            },
                            dataType: "json",
                            cache: false,
                            error: a$.ajaxerror,
                            success: loadedPlayer
                        });

                        function loadedPlayer(json) {
                            //a$.hideprogress("plotprogress");
                            if (a$.jsonerror(json)) {} else {
                                playerLoaded = true;
                                if (a$.exists(json.user)) { //Keep this section for easy compatibility with individual game and ease of replacement in Position Play view.
                                    player = json.user;
                                    if (false) { //TODO: DISABLED FOR NOW
                                        $(".headericon-agame").show();
                                        if (json.user.CSRMedals.display == "Y") {
                                            if (json.user.CSRMedals.gold != null) {

                                                $(".headericon-agame-gamestatus").html("Gold: " + json.user.CSRMedals.gold + "<br />Silver: " + json.user.CSRMedals.silver + "<br />Bronze: " + json.user.CSRMedals.bronze).show();
                                            } else {
                                                $(".headericon-agame-gamestatus").html("");
                                            }
                                        } else {
                                            $(".headericon-agame-gamestatus").html("");
                                        }
                                    }
                                }
                                selectSection("Events");
                            }
                        }
                    }
                }
                break;
            case "< Home Division":
                Team = savedTeam;
                CSR = savedCSR;
                if (a$.exists(o.leagueid)) {
                    leagueCrumb(o.leagueid);
                } else {
                    leagueCrumb(0);
                }
                sectionsConfig();
                selectSection("Matchup");
                break;
            case "League":
            case "Scores": //Julie says "light this up"
                if (scoresstarted) {
                    break;
                }
                scoresempty(false);
                scoresstarted = true;
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getscores",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR,
                        cachekey: a$.perfdate("Express")
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedscores
                });

                function loadedscores(json) {
                    if (a$.jsonerror(json)) { scoresempty(true); } else {
                        if (a$.exists(json.empty)) {
                            scores({});
                            scoresempty(true);
                        } else if (a$.exists(json.scores)) {
                            if (json.scores.leagues.length == 0) {
                                scoresempty(true);
                            }
                            else {
                                scoresempty(false);
                            }
                            scores(json.scores);
                            scoresDivision(json.scores.homeleaguename);

                            //Duplicate leagues - Not sure why, but I'll just bubble them out.  MAKEDEV
                            for (i=0;i<json.scores.leagues.length - 1;i++) {
                                for (j = i+1; j < json.scores.leagues.length;j++) {
                                    if (json.scores.leagues[i].leagueid == json.scores.leagues[j].leagueid) {
                                        json.scores.leagues.splice(j,1);
                                    }
                                }
                            }
                            //Double bubble (they aren't necessarily in order)
                            for (i=0;i<json.scores.leagues.length - 1;i++) {
                                for (j = i+1; j < json.scores.leagues.length;j++) {
                                    if (json.scores.leagues[i].leagueid == json.scores.leagues[j].leagueid) {
                                        json.scores.leagues.splice(j,1);
                                    }
                                }
                            }

                            var dupcheck="";
                            for (var i in json.scores.leagues) {
                                var sel = "";
                                if (json.scores.leagues[i].leagueName == scoresDivision()) {
                                    sel = ' selected="selected" ';
                                }
                                if (json.scores.leagues[i].leagueName != dupcheck) {
                                    $(".scores-division").append('<option' + sel + ' value="' + json.scores.leagues[i].leagueName + '">' + json.scores.leagues[i].leagueName + '</option>');
                                }
                                dupcheck = json.scores.leagues[i].leagueName;
                            }
                            $(".scores-division").unbind().bind("change", function() {
                                scoresDivision($(this).val());
                            });
                            clearAvatars({
                                section: "Scores"
                            });

                            function scores_teamicons() {
                                var at = json.scores.allteams;
                                $(".score-teamicon").each(function() {
                                    var tid = parseInt($(" span", this).eq(0).html(), 10);
                                    for (var i in at) { //TODO: Is there some sort of quicksort/search that can help here (must always work).
                                        if (at[i].teamsid == tid) {
                                            uid++;
                                            $(this).removeAttr("id").attr("id", uid);
                                            drawAvatar({
                                                theme: debug ? "basketball" : self.theme(),
                                                item: "teamicon",
                                                id: uid,
                                                colors: at[i].stg.colors,
                                                heightInPixels: 25,
                                                flip: false,
                                                section: "Scores"
                                            });
                                            break; //The team may be in there multiple times, but only 1 helmet needs displayed.
                                        }
                                    }
                                });
                            }
                            setTimeout(scores_teamicons, 500);
                        }
                    }
                }
                break;
            case "TV":
                if (tvstarted) {
                    break;
                }
                tvstarted = true;
                //TODO: Retrieve all matchups with Team names, current scores, game status, settings info - make
                clearTimeout(top5timeout);
                $(".fan-tv-gamefeed").stop();
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq /*DEBUG: Not sending test to get a good media view*/ ,
                        testdateoffset: testdateoffset,
                        cmd: "gettvstream",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR,
                        cachekey: a$.perfdate("Express")
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedtv
                });

                function loadedtv(json) {
                    /* //Fail Silently in this case.
                    if (a$.jsonerror(json)) {
                    }
                    else
                    */
                    if (a$.exists(json.empty)) {
                        tv({});
                    } else if (a$.exists(json.tv)) {
                        tv(json.tv);
                        if (json.brackets.leagues.length > 0) {
                            formatbrackets(json.brackets);
                            brackets(json.brackets);
                            //Load the PLAYOFFs trees, if there are playoffs
                            self.sections({});
                            self.sections(mysections);
                            if (inplayoffs) {
                                sectionsShowHide("PLAYOFFS", true); //Turn on
                                if (gameinplay == "N") {
                                    selectSection("PLAYOFFS");
                                }
                            }
                        }
                        clearAvatars({
                            section: name
                        });
                        //Manually rifle through the leagues and display the avatar (in black) in the table (2nd column for now)
                        var idx = 0;
                        $(".fan-tv-gamefeed").css("top", "10000px");
                        $(".fan-tv-gamefeed").children().each(function() {
                            $(".fan-tv-home-helmet", this).each(function() {
                                uid++;
                                $(this).removeAttr("id").attr("id", uid);
                                //DONE: Generalize theme

                                drawAvatar({
                                    theme: debug ? "basketball" : self.theme(),
                                    item: "teamicon",
                                    id: uid,
                                    colors: json.tv.gameFeed[idx].home.stg.colors,
                                    heightInPixels: 60,
                                    flip: false,
                                    section: name
                                });
                            });
                            $(".fan-tv-visitor-helmet", this).each(function() {
                                uid++;
                                $(this).removeAttr("id").attr("id", uid);
                                //DONE: Generalize theme
                                drawAvatar({
                                    theme: debug ? "basketball" : self.theme(),
                                    item: "teamicon",
                                    id: uid,
                                    colors: json.tv.gameFeed[idx].visitor.stg.colors,
                                    heightInPixels: 60,
                                    flip: true,
                                    section: name
                                });
                            });
                            idx++;
                        });

                        function feedloop() {
                            var t = json.tv.gameFeed.length * 90; //Height of my feed div
                            $(".fan-tv-gamefeed").css("top", "500px");
                            $(".fan-tv-gamefeed").animate({
                                top: "-" + t
                            }, json.tv.gameFeed.length * 7000, "linear", feedloop);
                        }
                        feedloop();
                        /*
                        $(".fan-tv-gamefeed").children().each(function () {
                        $(".fan-tv-home-helmet", this).each(function () {
                        uid++;
                        $(this).removeAttr("id").attr("id", uid);
                        //TODO: Generalize theme
                        drawAvatar({ theme: debug ?"basketball" : self.theme(), item: "teamicon", id: uid, colors: json.tv.gameFeed[idx].home.stg.colors, heightInPixels: 20, flip: false, section: name });
                        });
                        $(".fan-tv-visitor-helmet", this).each(function () {
                        uid++;
                        $(this).removeAttr("id").attr("id", uid);
                        //TODO: Generalize theme
                        drawAvatar({ theme: debug ?"basketball" : self.theme(), item: "teamicon", id: uid, colors: json.tv.gameFeed[idx].visitor.stg.colors, heightInPixels: 20, flip: true, section: name });
                        });
                        idx++;
                        });
                        function feedloop() {
                        if (json.tv.gameFeed.length > 0) {
                        var t = json.tv.gameFeed.length * 100; //Width of my feed div
                        $(".fan-tv-gamefeed").css("left", "0px");
                        $(".fan-tv-gamefeed").animate({ left: "-" + t }, json.tv.gameFeed.length * 7000, "linear", feedloop);
                        }
                        }
                        feedloop();
                        */

                        /*
                        var lgidx = 0;
                        $(".fan-tv-standings-league").each(function () {
                        var idx = 0;
                        $(".fan-tv-top5-helmet", this).each(function () {
                        uid++;
                        $(this).removeAttr("id").attr("id", uid);
                        //TODO: Generalize theme
                        drawAvatar({ theme: debug ?"basketball" : self.theme(), item: "teamicon", id: uid, colors: json.tv.leagues[lgidx].teams[idx].stg.colors, heightInPixels: 30, flip: false, section: name });
                        idx++;
                        });
                        lgidx++;
                        });
                        */
                        var me = $(".fan-tv-standings").eq(0);
                        var lgcnt = me.children().size();
                        if (lgcnt > 0) {
                            lgidx = 0;

                            function hideloop() {
                                $(".fan-tv-standings-league").hide();
                                var ame = $(me).children().eq(lgidx);
                                lgidx++;
                                if (lgidx >= lgcnt) lgidx = 0;
                                $(ame).css("opacity", 0).show();

                                $(ame).animate({
                                    opacity: 1
                                }, 2000, function() {
                                    $(ame).animate({
                                        opacity: 1
                                    }, 4000, function() {
                                        $(ame).animate({
                                            opacity: 0
                                        }, 2000, hideloop);
                                    })
                                });
                                /*
                                .animate({"opacity","100"}, 1000,
                                function() {
                                $(ame).animate({"opacity","0"}, 1000, hideloop);
                                }
                                )
                                );
                                */
                                //$(ame).show();
                                //top5timeout = setTimeout(hideloop, 10000);
                            }
                            hideloop();
                        }
                    }
                }
                break;
            case "Flex Home - NOT USED":
                //alert("debug: Flex Home or FLEX");
                var myframe= $(".fan-flex-home iframe").eq(0);
                if ($(myframe).attr("src") == "") {
                    $(myframe).attr("src","../../3/ng/AgameFlex/default.aspx?prefix=" + a$.urlprefix().split(".")[0]);                    
                }
                break;
            case "FLEX":
            case "Flex Game Listing":
                //alert("debug: Flex Game Listing");
                var myframe= $(".fan-flex-game-listing iframe").eq(0);
                if ($(myframe).attr("src") == "") {
                    $(myframe).attr("src","../../3/ng/AgameFlex/userGameListing.aspx?prefix=" + a$.urlprefix().split(".")[0]);                    
                }
                break;
            case "Wager":
                var myframe= $(".fan-wager-book iframe").eq(0);
                if ($(myframe).attr("src") == "") {
                    $(myframe).attr("src","../../3/ng/AgameLeague/AGameWager.aspx?prefix=" + a$.urlprefix().split(".")[0]);                    
                }
                break;
            case "Xtreme Leaderboard":
                var myframe= $(".fan-xtreme-leaderboard iframe").eq(0);
                if ($(myframe).attr("src") == "") {
                    $(myframe).attr("src","../../3/ng/AgameLeague/xTremeLeaderboard.aspx?prefix=" + a$.urlprefix().split(".")[0]);
                }
                else {
                    $("#poller_quickpublish").html("aGameXtremeLeaderboardLoad"); //TODO: Rework if we want params to be passed.
                }

                break;
            case "PLAYOFFS":
                function doplayoffs() {
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getplayoffbrackets",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR,
                        cachekey: a$.perfdate("Express")
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedbrackets
                });

                function loadedbrackets(json) {
                    /* //Fail Silently in this case.
                    if (a$.jsonerror(json)) {
                    }
                    else
                    */
                    if (a$.exists(json.empty)) {} else if (json.brackets.leagues.length > 0) {
                        formatbrackets(json.brackets);
                        brackets(json.brackets);
                        lightbrackets();
                    }
                }
                }
                doplayoffs();
                break;
            case "Map":
            		return_to_map = false;
                    if ((a$.urlprefix() == "chime.")||(a$.urlprefix() == "chime-mnt.")) {
                        self.selectSection("PLAYOFFS"); //TEMPORARY: Attempt to bypass Gridiron Map issues.
                        break;
                    }
            		if (refresh_standings || (standingsSave == null)) {
            			return_to_map = true;
            			self.selectSection("Standings");
            		}
            		else {
            			for (var i = 1; i <= 11; i++) {
            				$(".map-island-" + i + " span").attr("class","markers");            			
            			}            			
            			var ss = standingsSave;
            			island=[0,0,0,0,0,0,0,0,0,0,0,0];
            			activeisland = 0;
            			activeleague = -1;
            			for (var  i in ss.leagues) {
            				for (var j in ss.leagues[i].teams) {
            					var w = finalsoverride_check(ss.leagues[i].teams[j].id,ss.leagues[i].teams[j].wins);
     							var maxisland = 7;
       							if (self.theme() == "tiki") {
       								maxisland = 7;
                                }
                                else if (self.theme() == "dragons") {
       		    					maxisland = 10;
       							}
    							else if ((self.theme() == "football") || (self.theme() == "basketball") || (self.theme() == "hits")) {
                					maxisland = 11;
		    					}
            					if (w > maxisland) w = maxisland;
            					if (ss.leagues[i].teams[j].id == Team) {
	            					if (a$.gup("wins")!="") {
	            						w = parseInt(a$.gup("wins"),10);
	            					}
	            					activeisland = w + 1;
	            					activeleague = i;
  	          				}
            					island[w + 1] += 1;
    	        			}            			
      	      		}
      	      		if (activeisland > 0) { //repull for only the current division.
      	      			island=[0,0,0,0,0,0,0,0,0,0,0,0];
      	      			for (var  i in ss.leagues) {
      	      				if (true) { //(i == activeleague) {  //DEBUG: Defeat this for a moment
            						for (var j in ss.leagues[i].teams) {
            							var w = finalsoverride_check(ss.leagues[i].teams[j].id,ss.leagues[i].teams[j].wins);
       										var maxisland = 7;
            				  		if ((self.theme() == "tiki") || (self.theme() == "dragons")) {
            					  		maxisland = 10;
            				  		}
									else if ((self.theme() == "football") || (self.theme() == "basketball") || (self.theme() == "hits")) {
           								maxisland = 11;
									}
            							if (w > maxisland) w = maxisland;
            							if (ss.leagues[i].teams[j].id == Team) {
	            							if (a$.gup("wins")!="") {
	            								w = parseInt(a$.gup("wins"),10);
	            							}
	            							activeisland = w + 1;
  	          						}
            							island[w + 1] += 1;
    	        					}
    	        				}
    	        			}
      	      		    }
      	      		    //Place markers for all teams on the islands (gridiron doesn't do this).

                        //Tiki Island Hard Code Playoffs
                        //Round 1 - lagoon (click2)

                        if ((a$.urlprefix() == "cox.")||(a$.urlprefix() == "cox-mnt.")
                            || (a$.urlprefix() == "chime.")||(a$.urlprefix() == "chime-mnt.")
                            ) {
                            doplayoffs();
                        }

                        if ((a$.urlprefix() == "NOTveyo.")||(a$.urlprefix() == "NOTveyo-mnt.") || (a$.urlprefix() == "ers-mnt-julie.")) {
                            doplayoffs();
                            self.mapzoomed(true);
                            //Puppetmaster!
                            /*
                            $(".tiki-lagoon-pins .markers").addClass("markers-4");
                            $(".map-tiki-click2").qtip({
                                content: { text: 'Tiki Lagoon<br />Playoff Showdown!<br /><br />HOME-run Hitters-Timothy Hilbert Team<br/>VS<br/>The Tiki-Warriors-Aron Felix Team<br /><br/>Dominate-James Kimes Team<br/>VS<br />BeeZee Team-Briana Zavala Team' }
                            });
                            */
                            $(".tiki-bay-pins .markers").addClass("markers-2");
                            $(".map-tiki-click3").qtip({
                                content: { position: { my: 'right center', at: 'left center', target: $(".map-tiki-click3") }, text: 'Tiki Bay - Final Round!<br /><br />HOME-run Hitters-Timothy Hilbert Team<br /><br/>-- Versus -- <br /><br />BeeZee Team-Briana Zavala Team' }
                            });
                            //Round 2 (final game) - beach (click4)
                            /*
                            $(".tiki-beach-pins .markers").addClass("markers-1");
                            $(".map-tiki-click4").qtip({
                                content: { position: { my: 'right center', at: 'left center', target: $(".map-tiki-click4") }, text: 'Tiki Beach Champions!<br /><br />Cristian "Gulf Coast Warriors" Mendoza Team' }
                            });
                            */
                        }

						if (self.theme() == "tiki") {
        	    			for (var i=1;i<=8;i++) {
          	  				    $(".map-island-" + i + " span").addClass("markers-" + island[i] + " bounceInDown").addClass((activeisland==i)? "active":"");
                                $(".map-island-" + i).qtip({
            						content: {
            							text: function(event, api) {
                                            var bld = ""; //Teams here:<br/>";
                                            var foundteam = false;
                                            var foundleague = false;
      	      			                    for (var  mi in ss.leagues) {
      	      				                    if (mi == activeleague) {
                                                    foundleague = true;
            						                for (var j in ss.leagues[mi].teams) {
            							                var w = ss.leagues[mi].teams[j].wins;
                                                        if (w > 7) w=7; //Only 8 islands in chain.
                                                        if ($(this).hasClass("map-island-" + (w+1))) {
                                                            if (foundteam) bld += "<br/>";
                                                            bld += ss.leagues[mi].teams[j].name; // + " (" + ss.leagues[mi].teams[j].realname + ")";
                                                            foundteam = true;
                                                        }
    	        					                }
    	        				                }
    	        			                }
                                            if (!foundleague) { //Do it again, but for all leagues.
                                                bld= "";
      	      			                        for (var  mi in ss.leagues) {
                                                    foundleague = true;
            						                for (var j in ss.leagues[mi].teams) {
            							                var w = ss.leagues[mi].teams[j].wins;
                                                        if (w > 7) w=7; //Only 8 islands in chain.
                                                        if ($(this).hasClass("map-island-" + (w+1))) {
                                                            if (foundteam) bld += "<br/>";
                                                            bld += ss.leagues[mi].teams[j].name; // + " (" + ss.leagues[mi].teams[j].realname + ")";
                                                            foundteam = true;
                                                        }
    	        					                }
    	        			                    }
                                            }
                                            if (!foundteam) {
                                                bld = "No teams on this island";                                          
                                            }
                                            return bld;
            							}
            						},
            						style: {
            							classes: "gridiron-tooltip",
            							width: 400
            						}
            					});
            				}
            			}
						if (self.theme() == "dragons") {
                            if (!dragons_popup_shown) {
                                $(".dragons-scroll-popup").show();
                                dragons_popup_shown = true;
                                $(".dragons-scroll-show").unbind().bind("click", function() {
                                    $(".dragons-scroll-popup").show();
                                });
                                $(".dragons-scroll-hide").unbind().bind("click", function() {
                                    $(".dragons-scroll-popup").hide();
                  	    			for (var i=1;i<=8;i++) {
                                        $(".dragon-pins-" + i + " span").removeClass("markers").removeClass("markers-" + island[i]).removeClass("bounceInDown"); //So they'll bounce down again.
                                    }
                                    setTimeout(function() {
                    	    			for (var i=1;i<=8;i++) {
                                            $(".dragon-pins-" + i + " span").addClass("markers markers-" + island[i] + " bounceInDown").addClass((activeisland==i)? "active":"");
                                        }
                                    }, 200);
                                });
                            }
        	    			for (var i=1;i<=8;i++) {
          	  				    //$(".dragon-pins-" + i + " span").addClass("markers-" + island[i] + " bounceInDown").addClass((activeisland==i)? "active":"");
                                $(".dragon-popup-click-" + i).qtip({
            						content: {
            							text: function(event, api) {
                                            var bld = ""; //Teams here:<br/>";
                                            var foundteam = false;
                                            var foundleague = false;
      	      			                    for (var  mi in ss.leagues) {
      	      				                    if (mi == activeleague) {
                                                    foundleague = true;
            						                for (var j in ss.leagues[mi].teams) {
            							                var w = finalsoverride_check(ss.leagues[mi].teams[j].id,ss.leagues[mi].teams[j].wins);
                                                        if (w > 10) w=10; //Only 11 islands in chain.
                                                        if ($(this).children(":first").hasClass("dragon-pins-" + (w+1))) {
                                                            if (foundteam) bld += "<br/>";
                                                            bld += ss.leagues[mi].teams[j].name; // + " (" + ss.leagues[mi].teams[j].realname + ")";
                                                            foundteam = true;
                                                        }
    	        					                }
    	        				                }
    	        			                }
                                            if (!foundleague) { //Do it again, but for all leagues.
                                                bld= "";
      	      			                        for (var  mi in ss.leagues) {
                                                    foundleague = true;
            						                for (var j in ss.leagues[mi].teams) {
            							                var w = finalsoverride_check(ss.leagues[mi].teams[j].id,ss.leagues[mi].teams[j].wins);
                                                        if (w > 10) w=10; //Only 10 islands in chain.
                                                        if ($(this).children(":first").hasClass("dragon-pins-" + (w+1))) {
                                                            if (foundteam) bld += "<br/>";
                                                            bld += ss.leagues[mi].teams[j].name; // + " (" + ss.leagues[mi].teams[j].realname + ")";
                                                            foundteam = true;
                                                        }
    	        					                }
    	        			                    }
                                            }
                                            if (!foundteam) {
                                                bld = "No teams at this location.";                                          
                                            }
                                            return bld;
            							}
            						},
            						style: {
            							classes: "gridiron-tooltip",
            							width: 400
            						}
            					});
            				}
            			}
            			else if ((self.theme() == "football") || (self.theme() == "basketball") || (self.theme() == "hits")) {
            				$(".gridiron-map_content").removeClass("active");
										$(".gridiron-city-scoreboard").show();
         						$(".gridiron-city-location").show();
            				$(".gridiron-city-about").hide();
            				$(".gridiron-map-" + ((self.theme()=="hits")?"H":"") + activeisland).addClass("active");
            				$(".click-city").unbind().qtip({
            						content: {
            							text: function(event, api) {
	            							var m2 = $(this).attr("2m");
  	          							var tbld = "";
					            			var ss = standingsSave;
					            			for (var  i in ss.leagues) {
          					  				for (var j in ss.leagues[i].teams) {
            										var m2c = "" + (1 + ss.leagues[i].teams[j].wins);
            										if (m2 == m2c) {
            											tbld += "<p>" + ss.leagues[i].teams[j].name + "</p>";
            										}
            									}
            								}
            								if (tbld != "") {
            									bld = "<h1>Teams in " + $(this).attr("title") + "</h1>" + tbld;
            								}
            								else {
            									bld = $(this).attr("title");
            								}
            								return bld;
            							}
            						},
            						style: {
            							classes: "gridiron-tooltip",
            							width: 300
            						}
            					}).bind("click",function() {
	            				$(".gridiron-map_content").removeClass("active");            					
            					if ($(this).attr("2m") == ("" + activeisland)) {
												$(".gridiron-city-scoreboard").show();
		         						$(".gridiron-city-location").show();
        		    				$(".gridiron-city-about").hide();
            					}
            					else {
												$(".gridiron-city-scoreboard").hide();
		         						$(".gridiron-city-location").hide();
        		    				$(".gridiron-city-about").show();
            					}
           						$(".gridiron-map-" + $(this).attr("2m")).addClass("active");
           						return false;
            				});
            			}
            		}
            		break;
            case "Standings":
                if (!refresh_standings) {
                    break;
                }
                refresh_standings = false;
                a$.showprogress("plotprogress");
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        gametype: gametype(),
                        cmd: "getstandings",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR,
                        League: leagueCrumb(),
                        Fantasy: self.fantasyViewing()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedStandings
                });

                function loadedStandings(json) {
                    a$.hideprogress("plotprogress");
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        standings({});
                    } else {
                        //UPDATE 9/20/2016 - Instead of changing the back-end, re-order the vendor standings based on the "score" member (floating point).
                        json.standings.leagues[0].vendors.sort(function(a, b) {
                            return b.score - a.score;
                        });

                        //2017-06-01 - Added to make crumb linking easier.
                        for (var l in json.standings.leagues) {
                            for (var t in json.standings.leagues[l].teams) {
                                json.standings.leagues[l].teams[t].leagueid = json.standings.leagues[l].leagueid;
                            }
                        }
                        
                        standings(json.standings);
                        standingsSave = json.standings;

                        //TODO: When fan-2.5.htm is stable, change the name to perhaps standings-toggle (toggle-switch is too broad).
                        $('.toggle-switch input[type="checkbox"]').unbind().bind("change", function() {
                            try {
                                if ($(this).is(':checked')) {
                                    $(this).closest('.table_topper').siblings(".standings-container").hide();
                                    $(this).closest('.table_topper').siblings(".acuity-table").show();
                                }
                                else {
                                    $(this).closest('.table_topper').siblings(".acuity-table").hide();
                                    $(this).closest('.table_topper').siblings(".standings-container").show();
                                }
                            } catch (error) {
                                console.error('Error occurred:', error);
                            }
                        });

                        $(".fan-standings-team-show").unbind().bind("change", function() {
                            if ($(this).is(":checked")) {
                                $(".fan-standings-vendor-list").hide();
                                $(".fan-standings-team-list").show();
                            } else {
                                $(".fan-standings-vendor-list").show();
                                $(".fan-standings-team-list").hide();
                            }
                        });
                        $(".fan-standings-team-off").unbind().bind("click", function() {
                            $(".fan-standings-team-show").prop("checked", false);
                            $(".fan-standings-team-show").trigger("change");
                        });
                        $(".fan-standings-team-on").unbind().bind("click", function() {
                            $(".fan-standings-team-show").prop("checked", true);
                            $(".fan-standings-team-show").trigger("change");
                            /*
                            if (teamscrollcluge) {
                            teamscrollcluge = false;
                            selectSection('Standings');
                            }
                            */
                        });

                        function scrapeSplash(tr) {
                            var partner = $(" .fan-standings-partner-name span", tr).html();
                            $(".medals-title em").html(partnerLocation(partner));
                            $(".medals-title img").attr("src", "../applib/css/images/" + partnerImage(partner));
                            $(".gold-medal .medal-count").html($(" .fan-standings-partner-gold", tr).html());
                            $(".silver-medal .medal-count").html($(" .fan-standings-partner-silver", tr).html());
                            $(".bronze-medal .medal-count").html($(" .fan-standings-partner-bronze", tr).html());
                            $(".all-medal .medal-count").html($(" .fan-standings-partner-count", tr).html());
                        }

                        $(".fan-standings-partner tbody tr").hover(function() {
                            $(".fan-standings-partner tbody tr td").css("background-color", "");
                            $(" td", this).css("background-color", "yellow");
                            scrapeSplash(this);
                        }, function() {
                            //$(" td", this).css("background-color", "");
                        });

                        if (gametype() == "individual") {
                            $(".fan-standings-team-show").trigger("change");
                            scrapeSplash($(".fan-standings-partner tbody tr").eq(0));
                        }

                        clearAvatars({
                            section: name
                        });
                        $(".agame-click-service").unbind().bind("click",function(event) {
                            var myservice = $(this).attr("service");
                            appApmContentTriggers.process(myservice, this, event);
                        });
                        //Manually rifle through the leagues and display the avatar (in black) in the table (2nd column for now)
                        for (var i in json.standings.leagues) {
                            for (var j in json.standings.leagues[i].teams) {
                                var ele = $(".fan-standings tbody").eq((gametype() == "team") ? 0 : 1).children("tr").eq(j).children("td").eq(1); //Second TD in each TR record.
                                //var ele = $(".fan-standings tbody").children("tr").eq(j).children("td").eq(0).children("span").eq(1); //Second SPAN in first TD of each TR record.
                                uid++;
                                /* 2018-06-14 - I removed the standings avatar draw (I think it was removed long ago)
                                $(ele).removeAttr("id").attr("id", uid);
                                drawAvatar({
                                    theme: debug ? "basketball" : self.theme(),
                                    item: "teamicon",
                                    id: uid,
                                    colors: json.standings.leagues[i].teams[j].stg.colors,
                                    heightInPixels: 20,
                                    flip: false,
                                    section: name
                                });
                                */
                            }
                            break; //If more than 1 league, the "tbody" traverse is insufficient I think
                        }
                        var tblcnt = 1;
                        for (var i in json.standings.otherLeagues) {
                            for (var j in json.standings.otherLeagues[i].teams) {
                                var ele = $(".fan-standings tbody").eq(tblcnt).children("tr").eq(j).children("td").eq(1); //Second TD in each TR record.
                                //var ele = $(".fan-standings tbody").children("tr").eq(j).children("td").eq(0).children("span").eq(1); //Second SPAN in first TD of each TR record.
                                uid++;
                                /* 2018-06-14 - I removed the standings avatar draw (I think it was removed long ago)
                                $(ele).removeAttr("id").attr("id", uid);
                                drawAvatar({
                                    theme: debug ? "basketball" : self.theme(),
                                    item: "teamicon",
                                    id: uid,
                                    colors: json.standings.otherLeagues[i].teams[j].stg.colors,
                                    heightInPixels: 20,
                                    flip: false,
                                    section: name
                                });
                                */
                            }
                            tblcnt++;
                        }
                        if (return_to_map) {
                        	self.selectSection("Map");
                        }
                    }
                    clearAvatars({
                        section: "Standings"
                    });
                    function standings_teamicons() {
                        var at = json.standings.teams;
                        $(".standings-teamicon").each(function() {
                            var tid = parseInt($(" span", this).eq(0).html(), 10);
                            for (var lg in json.standings.leagues) {
                                for (var tm in json.standings.leagues[lg].teams) {
                                if (json.standings.leagues[lg].teams[tm].id == tid) {
                                    uid++;
                                    $(this).removeAttr("id").attr("id", uid);
                                    drawAvatar({
                                        theme: debug ? "basketball" : self.theme(),
                                        item: "teamicon",
                                        id: uid,
                                        colors: json.standings.leagues[lg].teams[tm].stg.colors,
                                        heightInPixels: 34,
                                        flip: false,
                                        section: "Standings"
                                    });
                                    break; //The team may be in there multiple times, but only 1 helmet needs displayed.
                                }
                            }
                            }
                        });
                    }
                    setTimeout(standings_teamicons, 500);
                }
                break;
            case "Roster":
                a$.showprogress("plotprogress");
                rosterempty(false);
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        gametype: gametype(),
                        cmd: "getroster",
                        role: $.cookie("TP1Role"),
                        Teamsid: Teamsid,
                        Team: Team,
                        CSR: CSR,
                        week: matchupWeek()
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedRoster,
                    progress: "plotprogress" //TODO: See if you can hook up this "progress" member, it would be very cool.
                });

                function loadedRoster(json) {
                    a$.hideprogress("plotprogress");
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        roster({});
                        rosterempty(true);
                    } else if (a$.exists(json.noGameFound)) {
                        roster({}); 
                        rosterempty(true); //DONE: Make the roster view invisible, and put up friendly language for the non-participant.
                    } else {
                        //This time I have to build the roster table from the components (I'll be manipulating them).
                        //Load the default positions into the pool.
                        //alert("debug:canedit=" + json.roster.current[0].canEdit);
                        var cp = json.roster.current[0].pool;
                        json.roster.current[0].alert = "";
                        var as = json.roster.current[0].assigned;
                        var kp = json.roster.current[0].kpis;
                        for (var i in cp) {
                            cp[i].position = "";
                            cp[i].weight = "";
                            cp[i].score = "";
                            cp[i].rank = "";
                            for (var j in as) {
                                if (ftrim(cp[i].uid) == ftrim(as[j].uid)) {
                                    cp[i].position = as[j].position;
                                    cp[i].weight = as[j].weight;
                                    if (as[j].score == null) {
                                        cp[i].score = "N/A";
                                    } else {
                                        cp[i].score = as[j].score.toFixed(2)
                                    }
                                    if (as[j].rank == null) {
                                        cp[i].rank = as[j].rank = "N/A";
                                    } else {
                                        cp[i].rank = as[j].rank;
                                    }
                                }
                            }
                            //2024-02-12 - Make a new member called namedkpis which contains only the kpis with names.
                            cp[i].namedkpis = [];
                            for (var k1 in cp[i].kpis) {
                                for (var k2 in kp) {
                                    if (kp[k2].id == cp[i].kpis[k1].id) {
                                        cp[i].kpis[k1].name = kp[k2].name;
                                        cp[i].namedkpis.push({ name: kp[k2].name, score: cp[i].kpis[k1].score });
                                    }
                                }
                            }

                        }

                        if (positionmode() == "fill") {
                            //Get Total Available Positions
                            json.roster.current[0].postotal = 0;
                            for (var i in json.roster.current[0].positions) {
                                json.roster.current[0].postotal += json.roster.current[0].positions[i].qty;
                            }

                            var minstarts;
                            for (var i in cp) {
                                if (i == 0) {
                                    minstarts = cp[i].starts;
                                } else if (minstarts > cp[i].starts) {
                                    minstarts = cp[i].starts;
                                }
                            }

                            //10/14/2015 - Section modified to prevent lockout when too few agents.
                            //TODO: This is a temporary HACK.  There are several rules to employ for determining eligibility.

                            //Assign players to positions (this takes precedence regardless of the start rules)
                            var itselected = 0;
                            var activeselected = 0;
                            var otherselected = 0
                            for (var i in cp) {
                                for (var j in as) {
                                    if (ftrim(cp[i].uid) == ftrim(as[j].uid)) {
                                        if (cp[i].eligible == "N") {} else if (cp[i].status == "Active") {
                                            activeselected += 1;
                                        } else if (cp[i].status == "In-Training") {
                                            itselected += 1;
                                        } else {
                                            otherselected += 1;
                                        }
                                    }
                                }
                            }

                            //Get the # of Active agents.
                            var activecnt = 0;
                            for (var i in cp) {
                                if ((cp[i].eligible == "Y") && (cp[i].status == "Active")) {
                                    activecnt += 1;
                                }
                            }

                            //If 6 or more active agents.
                            //if (activecnt >= json.roster.current[0].postotal) {
                            //DEFEATED for ERS for game starting 11/23 (only active agents are allowed to play
                            if ((a$.urlprefix() == "ers.") || (a$.urlprefix() == "walgreens.") || (a$.urlprefix() == "make.") || (activecnt >= json.roster.current[0].postotal)) {
                                //Get the smallest start differential that contains at least 6 active players (or all existing active players).
                                var startdif = 2; //Start with 2, go up from there.
                                if (json.roster.current[0].season == 'P') {
                                    startdif = 100; //No start differential for playoffs.
                                }
                                var eligcnt = 0;
                                while (true) {
                                    eligcnt = 0;
                                    for (var i in cp) {
                                        if ((cp[i].eligible == "Y") && (cp[i].status == "Active") && (cp[i].starts < (minstarts + startdif))) {
                                            eligcnt += 1;
                                        }
                                    }
                                    if ((eligcnt >= activecnt) || (eligcnt >= json.roster.current[0].postotal)) {
                                        break;
                                    } else {
                                        startdif += 1;
                                    }
                                }
                                for (var i in cp) {
                                    if (cp[i].eligible == "N") {
                                        cp[i].position = "Ineligible";
                                        cp[i].weight = "";
                                    } else if ((cp[i].position == "") && (cp[i].status == "Active")) {
                                        if (cp[i].starts >= (minstarts + startdif)) {
                                            cp[i].position = "Ineligible";
                                            cp[i].weight = "";
                                        }
                                    } else if (cp[i].position == "") { //In Training or termed, and with no position assigned.
                                        if (eligcnt >= json.roster.current[0].postotal) {
                                            cp[i].position = "Ineligible";
                                            cp[i].weight = "";
                                        }
                                    }
                                }
                                //   Do the start rule on active agents.
                                //   Set all in-training agents to be ineligible
                            } else { //Not enough Active agents, need to draw from the In-training agents.
                                //Total # of in-training agents that we need.
                                var ittotal = json.roster.current[0].postotal - activecnt;

                                //Get intrainingcnt and to through the same exercise with this subgroup.
                                var intrainingcnt = 0;
                                for (var i in cp) {
                                    if ((cp[i].eligible == "Y") && cp[i].status == "In-Training") {
                                        intrainingcnt += 1;
                                    }
                                }

                                var startdif = 1; //Start with 1, go up from there SETTING: In-training start differential.
                                if (json.roster.current[0].season == 'P') {
                                    startdif = 100; //No start differential for playoffs.
                                }
                                var eligcnt = 0;
                                while (true) {
                                    eligcnt = 0;
                                    for (var i in cp) {
                                        if ((cp[i].eligible == "Y") && (cp[i].status == "In-Training") && (cp[i].starts < (minstarts + startdif))) {
                                            eligcnt += 1;
                                        }
                                    }
                                    if ((eligcnt >= intrainingcnt) || (eligcnt >= ittotal)) {
                                        break;
                                    } else {
                                        startdif += 1;
                                    }
                                }
                                for (var i in cp) {
                                    if (cp[i].eligible == "N") {
                                        cp[i].position = "Ineligible";
                                        cp[i].weight = "";
                                    } else if ((cp[i].position == "") && (cp[i].status == "Active")) { //ALL Active agents are eligible in this case
                                    } else if ((cp[i].position == "") && (cp[i].status == "In-Training")) { //Enforce starts count on In-Training agents
                                        if ((cp[i].starts >= (minstarts + startdif)) || (itselected >= ittotal)) {
                                            cp[i].position = "Ineligible";
                                            cp[i].weight = "";
                                        }
                                    } else if (cp[i].position == "") { //Termed, and with no position assigned.
                                        if (eligcnt >= json.roster.current[0].postotal) {
                                            cp[i].position = "Ineligible";
                                            cp[i].weight = "";
                                        }
                                    }
                                }

                            }

                            if (false) { //saving this
                                var notmaxed = 0;
                                for (var i in cp) {
                                    cp[i].position = "";
                                    cp[i].weight = "";
                                    var as = json.roster.current[0].assigned
                                    for (var j in as) {
                                        if (ftrim(cp[i].uid) == ftrim(as[j].uid)) {
                                            cp[i].position = as[j].position;
                                            cp[i].weight = as[j].weight;
                                        }
                                    }
                                    if ((cp[i].position == "") && (cp[i].starts >= (minstarts + 2))) {
                                        cp[i].position = "Ineligible";
                                        cp[i].weight = "";
                                    } else {
                                        notmaxed += 1;
                                    }
                                }

                                if (notmaxed < json.roster.current[0].postotal) {
                                    for (var i in cp) {
                                        cp[i].position = "";
                                        cp[i].weight = "";
                                        var as = json.roster.current[0].assigned
                                        for (var j in as) {
                                            if (cp[i].uid == as[j].uid) {
                                                cp[i].position = as[j].position;
                                                cp[i].weight = as[j].weight;
                                            }
                                        }
                                    }
                                }
                            }
                            //END 10/14/2015 change.

                            var poses = [];
                            for (var i in json.roster.current[0].positions) {
                                for (var j = 0; j < json.roster.current[0].positions[i].qty; j++) {
                                    poses.push({
                                        name: json.roster.current[0].positions[i].name,
                                        weight: json.roster.current[0].positions[i].weight,
                                        matched: false
                                    });
                                }
                            }

                            //DONE: Determine if all positions taken. apt = all positions taken.
                            var apt = false;

                            function setapt() {
                                for (var i in poses) {
                                    poses[i].match = false;
                                    poses[i].username = "";
                                    poses[i].avatarfilename = "";
                                }
                                for (var i in cp) {
                                    if (cp[i].position != "") {
                                        for (var j in poses) {
                                            if (!poses[j].match) {
                                                if (cp[i].position == poses[j].name) {
                                                    poses[j].match = true;
                                                    poses[j].username = cp[i].name;
                                                    poses[j].avatarfilename = cp[i].avatarfilename;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                }
                                apt = true; //DONE: Make this search for all positions taken
                                for (var i in poses) {
                                    if (!poses[i].match) {
                                        apt = false;
                                        break;
                                    }
                                }
                                //for (var mp in poses) poses[mp].avatarfilename = "";
                                json.roster.current[0].avatarview = poses;
                            }
                        } else if (positionmode() == "auto") {
                            //TODO: Still have to match the positions (I think), didn't want to untangle it above.
                            //Eligibility is pre-set from the server
                            for (var i in cp) {
                                cp[i].editable = false;
                            }
                        } else if (positionmode() == "unrestricted") {
                            //TODO: Eligibility from the server still comes into play, but there would be no start rules or position rules in this case.
                        }

                        function seteditable(o) {
                            //TODO: Only allow editing if this is a team leader or higher, and if the cutoff has not yet been reached.
                            if (json.roster.current[0].canEdit == "N") {
                                for (var i in cp) {
                                    cp[i].editable = false;
                                }
                            } else {
                                setapt();
                                //ADDED 10/27/2015
                                if (!apt) {
                                    //Get Total # Players
                                    var playercnt = 0;
                                    for (var i in cp) {
                                        if ((cp[i].eligible == "Y") && ((cp[i].status == "Active") || (cp[i].status == "In-Training"))) {
                                            playercnt += 1;
                                        }
                                    }
                                    if (playercnt > json.roster.current[0].postotal) {
                                        if (json.roster.current[0].unlocked || json.roster.current[0].stg.overrideRosterLock) {
                                            json.roster.current[0].alert = "Notice: Please assign eligible players to all " + json.roster.current[0].postotal + " positions.  Positions left open may be automatically assigned.";
                                        }
                                    }
                                }

                                var mw = matchupWeek();
                                if ((Role == "CSR")) { // || (o.opponent == "BYE"))
                                    for (var i in cp) {
                                        cp[i].editable = false;
                                    }
                                } else if (apt) {
                                    for (var i in cp) {
                                        if (mw != 0) {
                                            cp[i].editable = false; //Can't edit previous weeks
                                            //TODO: Make positions uneditable if we're past a threshold date in the current week.
                                        } else {
                                            if (cp[i].position == "Ineligible") {
                                                cp[i].editable = false;
                                            } else if (cp[i].position != "") {
                                                if (json.roster.current[0].unlocked) {
                                                    cp[i].editable = true;
                                                } else {
                                                    cp[i].editable = json.roster.current[0].stg.overrideRosterLock;
                                                }
                                            } else {
                                                cp[i].editable = false;
                                            }
                                        }

                                    }
                                } else {
                                    for (var i in cp) {
                                        if (mw != 0) {
                                            cp[i].editable = false; //Can't edit previous weeks
                                            //TODO: Make positions uneditable if we're past a threshold date in the current week.
                                        } else {
                                            if (cp[i].position == "Ineligible") {
                                                cp[i].editable = false;
                                            } else {
                                                if (json.roster.current[0].unlocked) {
                                                    cp[i].editable = true;
                                                } else {
                                                    cp[i].editable = json.roster.current[0].stg.overrideRosterLock;
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (gametype() == "team") {
                             if (a$.exists(json.roster.current[0].opponent)) {
                                seteditable({
                                    opponent: json.roster.current[0].opponent.fanname
                                });
                             }
                             else {
                                seteditable({
                                    opponent: "Not Available"
                                });
                             }

                        } else {
                            json.roster.current[0].opponent = {};
                            json.roster.current[0].opponent.fanname = "";
                            //TODO: Time to split this out, it's getting complicated.
                        }
                        if (positionmode() == "auto") {
                            json.roster.current[0].rosterStatus = "Should not display";
                            json.roster.current[0].prompt = "";
                        } else {
                            if (json.roster.current[0].stg.overrideRosterLock) {
                                json.roster.current[0].prompt = "Roster is temporarily UNLOCKED to allow team change.";
                            } else {
                                //DEBUG:
                                if (json.roster.current[0].unlocked) {
                                    json.roster.current[0].prompt = "Roster selection must be finalized by " + json.roster.current[0].lockDate + ".";
                                } else {
                                    json.roster.current[0].prompt = "Rosters are now locked.";
                                }
                            }
                        }

                        //if (json.roster.current[0].opponent.fanname == "BYE") {
                        //    json.roster.current[0].prompt = "This week is a 'BYE WEEK', no roster is required."
                        //}

                        //If not, then put an edit icon on each line.
                        //If so (all positions taken), then only an edit icon on lines with a position.
                        setapt(); //2023-12-07 - Added.
                        roster(json.roster);
                        bindDashboardLinks();
                        if (incardview) {
                            setTimeout(function() { $(".roster-toggle-cards").trigger("click"); },0);
                        }
                        // .fan-roster-scores is beyond me in knockout, so I'm using jquery to blast it in.
                        var bld = "";
                        for (var i in cp) {
                            bld += "<tr";
                            if (cp[i].position == "Ineligible") {
                                bld += ' class="customIneligible"';
                            } else if ((('' + cp[i].uid) === CSR) || ((positionmode() != "auto") && (cp[i].position != ""))) {
                                if (theme() == 'soccer') {
                                    bld += ' class="customHighlightSoccer"';
                                } else {
                                    bld += ' class="customHighlightFootball"';
                                }
                            }
                            bld += ">";
                            var kpis = json.roster.current[0].kpis;
                            for (var j in kpis) {
                                var found = false;
                                for (var k in cp[i].kpis) {
                                    if (kpis[j].id == cp[i].kpis[k].id) {
                                        bld += "<td>" + cp[i].kpis[k].score + "</td>";
                                        found = true;
                                        break;
                                    }
                                }
                                if (!found) bld += "<td>N/A</td>";
                            }
                            bld += "</tr>";
                        }
                        $(".fan-roster-scores").html(bld);

                        $(".fan-roster-message-selectall").unbind().bind("click", function() {
                            //alert("debug:checked selectall");
                            var checked = $(this).is(":checked");
                            $(".fan-roster-message-check").each(function() {
                                $(this).prop("checked", checked);
                            });
                        });

                        $(".fan-roster-message-link").unbind().bind("click", function() {
                            var cnt = 0;
                            $(".fan-roster-message-check").each(function() {
                                if ($(this).is(":checked")) {
                                    cnt += 1;
                                }
                            });
                            if (cnt < 1) {
                                alert("No agents selected.  Check the boxes to the right of the agent's name.");
                                return false;
                            }
                            $("#messagediv").show();
                            $(".heading").html("Messaging");
                            $('#messagetab').show();
                            $('#messageslabel').trigger('click');
                            $(".messages-compose input").trigger("click");

                            $(".fan-roster-message-check").each(function() {
                                if ($(this).is(":checked")) {
                                    var csrname = $(" span", $(this).parent().parent()).eq(0).html();
                                    csrname = csrname.replace(/'/g, '');
                                    var csr = $(" span", $(this).parent().parent()).eq(1).html();
                                    var vk = "COMBO/selCSRs/" + csr;
                                    $('#composeto option[value="' + vk + '"]').attr("selected", "selected");
                                    if ($("#composeto option:selected").val() != vk) {
                                        $("#composeto").append($('<option></option>').val(csr).html(csrname).attr("selected", "selected"));
                                    }
                                }
                            });

                            $("#composeto").trigger("liszt:updated");
                            /*
                            if (!message_added_prompt) {
                                alert(name + " will be added to message compose window.\nYou can return to A-GAME to select more names from your roster, or create a message and send.");
                                $(".messages-compose input").trigger("click");
                                //$(".message-to-manual").hide();
                                $(".message-to-auto-wrapper").show();
                                message_added_prompt = true;
                            }
                            else {
                                alert(name + " added.");
                            }
                            $(".message-to-auto").append('<span class="message-to-name"><span>' + name + '</span><span style="display:none;">' + uid + '</span></span>;&nbsp;');
                            */
                            return false;
                        });
                        var incontext = false;
                        $(".fan-position-edit").unbind().bind("click", function() {
                            var off = $(this).offset();
                            incontext = true;
                            var bld = '<div class="fan-roster-contextmenu" style="top:' + off.top + 'px;left:' + off.left + 'px;">';
                            //TODO: Convert these parent traversals to use "closest".
                            var idx = $(this).parent().parent().index();
                            incardview = false;
                            if ($(this).closest("table").length == 0) { //Card view has different markup
                                incardview = true;
                                idx = $(this).parent().parent().parent().parent().index();
                            }
                            bld += '<table>'; //Table index in the roster.
                            setapt();
                            if (cp[idx].position != "") {
                                bld += '<tr><td><a href="#">DE-ASSIGN ' + cp[idx].position + ' Position</a></td></tr>';
                            } else {
                                if (!apt) {
                                    for (var i in poses) {
                                        if (!poses[i].match) {
                                            bld += '<tr><td><a href="#">Assign Position: ' + poses[i].name + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-weight:normal;">(Weight=' + poses[i].weight + ')</span></a></td></tr>';
                                        }
                                    }
                                }
                            }
                            bld += '</table></div>';
                            $("body").append(bld);
                            $(".fan-roster-contextmenu").unbind().bind("mouseleave", function() {
                                incontext = false;
                                $(".fan-roster-contextmenu").remove();
                            });

                            $(".fan-roster-contextmenu a").unbind().bind("click", function() {
                                var htm = $(this).html(); //Just parse the text for now.
                                if (htm.indexOf("DE-ASSIGN") >= 0) {
                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: false,
                                        data: {
                                            lib: "fan",
                                            test: testq,
                                            testdateoffset: testdateoffset,
                                            cmd: "deassignposition",
                                            role: $.cookie("TP1Role"),
                                            CSR: cp[idx].uid,
                                            rosterid: json.roster.current[0].id
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: deassignedposition
                                    });
                                    //TODO: This should work, there must be something else to modify.  Uncomment below, set async to true, eliminate success routine.

                                    //var as = json.roster.current[0].assigned;
                                    //for (var j in as) {
                                    //if (cp[idx].uid == as[j].uid) {
                                    //as.splice(j,1);
                                    //break;
                                    //}
                                    //}
                                    //loadedRoster(json);
                                    //return;

                                    function deassignedposition() {
                                        selectSection('Roster');
                                    }
                                    //json.roster.current[0].pool[idx] = "";
                                } else {
                                    var pposs = htm.split(": ");
                                    var poss = pposs[1].split("&");
                                    var weight = 0;
                                    for (var i in json.roster.current[0].positions) {
                                        if (json.roster.current[0].positions[i].name == poss[0]) {
                                            weight = json.roster.current[0].positions[i].weight;
                                        }
                                    }

                                    //2023-12-19 - make a barebones version of the poses structure for this routine.
                                    var smposes = [];
                                    for (var i in poses) {
                                        smposes.push({ taken: poses[i].taken, name: poses[i].name });
                                    }

                                    a$.ajax({
                                        type: "GET",
                                        service: "JScript",
                                        async: false,
                                        data: {
                                            lib: "fan",
                                            test: testq,
                                            testdateoffset: testdateoffset,
                                            cmd: "assignposition",
                                            role: $.cookie("TP1Role"),
                                            CSR: cp[idx].uid,
                                            Teamsid: Teamsid,
                                            Team: Team,
                                            position: poss[0],
                                            positions: smposes,
                                            title: cp[idx].title,
                                            rosterid: json.roster.current[0].id,
                                            weight: weight
                                        },
                                        dataType: "json",
                                        cache: false,
                                        error: a$.ajaxerror,
                                        success: assignedposition
                                    });
                                    //TODO: This should work, there must be something else to modify.  Uncomment below, set async to true, eliminate success routine.
                                    //json.roster.current[0].assigned.push({ uid: cp[idx].uid, position: poss[0] });
                                    //loadedRoster(json);
                                    //return;
                                    function assignedposition() {
                                        selectSection('Roster');
                                    }

                                    //json.roster.current[0].pool[idx] = poss[0];
                                    //self.selectedSection('Roster');

                                }
                                return false;
                            });

                        }).bind("mouseleave", function() {
                            if (!incontext) {
                                $(".fan-roster-contextmenu").remove();
                            }
                        });

                    }
                }
                break;
            case "Schedule":
                if (1) {
                    a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: true,
                        data: {
                            lib: "fan",
                            test: testq,
                            testdateoffset: testdateoffset,
                            cmd: "getschedule",
                            role: $.cookie("TP1Role"),
                            Teamsid: Teamsid,
                            Team: Team,
                            CSR: CSR
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: loadedSchedule
                    });

                    function loadedSchedule(json) {
                        if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                            schedule({});
                        } else {
                            for (var i in json.schedule.leagues) {
                                for (var j in json.schedule.leagues[i].weeks) {
                                    if (json.schedule.leagues[i].weeks[j].hometeamscore != "") {
                                        var h = parseFloat(json.schedule.leagues[i].weeks[j].hometeamscore);
                                        json.schedule.leagues[i].weeks[j].hometeamscore = h.toFixed(2);
                                    }
                                    if (json.schedule.leagues[i].weeks[j].visitorteamscore != "") {
                                        var h = parseFloat(json.schedule.leagues[i].weeks[j].visitorteamscore);
                                        json.schedule.leagues[i].weeks[j].visitorteamscore = h.toFixed(2);
                                    }
                                }
                            }
                            schedule(json.schedule);
                        }
                    }
                }
                break;
            case "Team Setup":
            case "Team Settings":
                var tm = Team;
                var cs = CSR;
                var teamsid = "";
                if (!draftteamowner()) {
                    if (name == "Team Settings") {
                        if (!subscriber.subscribed) {
                            selectSection("Xtreme");
                            return;
                        } else {
                            teamsid = subscriber.teamsid;
                            tm = "";
                            cs = "";
                        }
                    }
                }
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getteam",
                        role: $.cookie("TP1Role"),
                        teamsid: teamsid,
                        MyTeamsid: Teamsid, //name conflict (did you know the transport is case-insensitive?)
                        Team: tm,
                        CSR: cs
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedTeam
                });

                function loadedTeam(json) {
                    if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
                        //team({});
                        self.teamName("");
                        self.fanTeamName("");
                        self.autoSelectRoster("");
                        self.canEditTeam("");

                    } else {
                        // alert("debug:canedit=" + json.team.canEdit);
                        //team(json.team);
                        //Retrieve:
                        //json.team.colors
                        //json.team.theme
                        //json.team.fanname

                        self.teamName(json.team.teamName);
                        self.fanTeamName(json.team.fanTeamName);
                        self.autoSelectRoster(json.team.stg.autoSelectRoster);
                        self.canEditTeam(json.team.canEdit);


                        var helmetColor = json.team.stg.colors[0];
                        var maskColor = json.team.stg.colors[1];
                        $(".simpleColorContainer").remove();
                        colorpickersmade = false;
                        $(".helmet_color_picker").val(helmetColor);
                        $(".mask_color_picker").val(maskColor);

                        //TODO: Generalize this with labels for helmet and mask, keeping the colors array, I guess.

                        function drawhelmet() {
                            clearAvatars({
                                section: name
                            });

                            drawAvatar({
                                theme: debug ? "basketball" : self.theme(),
                                item: "teamicon",
                                id: "AvatarId",
                                colors: [helmetColor, maskColor],
                                heightInPixels: 320,
                                flip: flip,
                                section: name
                            });
                        }
                        drawhelmet();
                        if (!colorpickersmade) {
                            $('.helmet_color_picker').simpleColor({
                                livePreview: true,
                                onSelect: function(hex, element) {
                                    helmetColor = "#" + hex;
                                    drawhelmet();
                                    //alert("You selected #" + hex + " for input #" + element.attr('class'));
                                }
                            });
                            $('.mask_color_picker').simpleColor({
                                livePreview: true,
                                onSelect: function(hex, element) {
                                    maskColor = "#" + hex;
                                    drawhelmet();
                                    //alert("You selected #" + hex + " for input #" + element.attr('class'));
                                }
                            });
                            colorpickersmade = true;
                        }
                        $(".fan-av-flip").unbind().bind("click", function() {
                            flip = !flip;
                            drawhelmet();
                            return false;
                        });
                        $(".fan-team-save-button").unbind().bind("click", function() {
                            $(this).val("Saving Settings...");
                            //Saving Team Setup
                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: true,
                                data: {
                                    lib: "fan",
                                    test: testq,
                                    testdateoffset: testdateoffset,
                                    cmd: "saveteam",
                                    role: $.cookie("TP1Role"),
                                    fanTeamsId: json.team.fanTeamsId,
                                    colors: [helmetColor, maskColor],
                                    fanTeamName: fanTeamName(),
                                    autoSelectRoster: autoSelectRoster()
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: savedTeam
                            });

                            function savedTeam() {
                                if (a$.jsonerror(json)) {} else {
                                    $(".fan-team-save-button").val("Settings Saved");
                                    setTimeout(function() {
                                        $(".fan-team-save-button").val("Save Team Information");
                                    }, 3000);
                                    draftloaded = false;
                                }
                            }

                        });

                    }
                }
                break;
            case "Player Setup":
            case "Owner Setup":
                var slblank = " What's on your mind?";
                $(".avatar-item").u
                $("#btnUploadFile").hide();
                $("#fileUpload").val("").unbind().bind('change', function() {
                    if ($(this).val() != "") {
                        $("#btnUploadFile").show();
                    } else {
                        $("#btnUploadFile").hide();
                    }
                });
                $('#btnUploadFile').on('click', function() {

                    var data = new FormData();

                    var files = $("#fileUpload").get(0).files;

                    // Add the uploaded image content to the form data collection
                    if (files.length > 0) {
                        data.append("UploadedImage", files[0]);
                    }

                    /*
                    alert("debug: ready to send the file");
                    a$.ajax({ type: "POST", service: "JScript", async: true, data: { lib: "fan", test: testq, testdateoffset: testdateoffset, cmd: "uploadPlayerImage", role: $.cookie("TP1Role"), image: data, CSR: CSR },
                    dataType: "json", cache: false, error: a$.ajaxerror, success: savedPlayerImage
                    });
                    */

                    a$.showprogress("plotprogress");

                    //Special .ajax requirements when sending a document.
                    var loc = window.location.host;
                    if (loc.indexOf("localhost", 0) < 0) {
                        loc = window.location.protocol + '//' + window.location.host + "/";
                    } else {
                        loc = window.location.protocol + '//' + window.location.host;
                        loc += a$.xss(window.location.pathname).substr(0, a$.xss(window.location.pathname).indexOf(".com") + 5);
                    }
                    var cs = CSR;
                    if ((Role != "CSR") && (Role != "Team Leader")) {
                        cs = oUid();
                    }
                    var url = loc + "jshandler.ashx?username=" + a$.xss($.cookie("username")) + "&uid=" + a$.xss($.cookie("uid")) + "&lib=fan&cmd=uploadPlayerImage&role=" + $.cookie("TP1Role") + "&CSR=" + cs;

                    var uploadRequest = $.ajax({
                        type: "POST",
                        url: url,
                        contentType: false,
                        processData: false,
                        data: data,
                        error: function(xhr, status, error) {
                            alert(xhr.responseText);
                        }
                    });
                    uploadRequest.done(function(xhr, textStatus) {
                        a$.hideprogress("plotprogress");
                        selectSection("Player Setup");
                        //TODO: This assumes it's a jpg, you need to call to get the actual name, something like this:
                        //$(".fan-avatar").html('<IMG SRC="avatars/' + json.avatarFilename + '" />');
                    });

                    /*
                    // Make Ajax request with the contentType = false, and procesDate = false
                    var ajaxRequest = $.ajax({
                    type: "POST",
                    url: "/api/fileupload/uploadfile",
                    contentType: false,
                    processData: false,
                    data: data
                    });

                    ajaxRequest.done(function (xhr, textStatus) {
                    // Do other operation
                    });
                    */

                });
                var tm = Team;
                var cs = CSR;
                var teamsid = "";
                if (subscriber.subscribed) {
                    teamsid = subscriber.teamsid;
                    tm = "";
                    cs = oUid();
                } else if ((Role != "CSR") && (Role != "Team Leader")) {
                    tm = "";
                    cs = oUid();
                }
                //Experiment to see if we can make a team leader (who is capable of viewing CSR player setups) to have their own player setup.
                if (specialteam()) { //Safety switch
                    tm = Team;
                    cs = $.cookie("TP1Username");
                }
                a$.ajax({
                    type: "GET",
                    service: "JScript",
                    async: true,
                    data: {
                        lib: "fan",
                        test: testq,
                        testdateoffset: testdateoffset,
                        cmd: "getPlayerSetup",
                        role: $.cookie("TP1Role"),
                        teamsid: teamsid,
                        Team: tm,
                        CSR: cs
                    },
                    dataType: "json",
                    cache: false,
                    error: a$.ajaxerror,
                    success: loadedPlayerSetup
                });

                function loadedPlayerSetup(json) {
                    if (a$.jsonerror(json)) {} else {
                        var pa = false;
                        if (a$.exists(json.player.stg.prebuiltAvatar)) {
                            if (json.player.stg.prebuiltAvatar) {
                                pa = true;
                            }
                        }

                        if ((!pa) && (json.player.avatarFilename == "")) {
                            $(".fan-avatar").html('<IMG SRC="avatars/empty_headshot.png" height="150" />');
                            $(".fan-avatar").removeClass("uploaded-avatar").removeClass("prebuilt-avatar");

                        } else {
                            $(".fan-avatar").html('<IMG SRC="avatars/' + json.player.avatarFilename + '" height="150" />');
                            if (pa) {
                                $(".fan-avatar").removeClass("uploaded-avatar").addClass("prebuilt-avatar");
                            } else {
                                $(".fan-avatar").addClass("uploaded-avatar").removeClass("prebuilt-avatar");
                            }
                        }
                        if (!a$.exists(json.player.stg.jersey)) {
                            json.player.stg.jersey = ""; //was 74
                        }
                        $("#inputJersey").val(json.player.stg.jersey);

                        if (!a$.exists(json.player.stg.nickname)) {
                            if (a$.exists(json.player.name)) {
                                json.player.stg.nickname = json.player.name.last;
                            } else {
                                json.player.stg.nickname = "Player";
                            }
                        }
                        $("#inputNickname").val(json.player.stg.nickname);

                        if (!a$.exists(json.player.stg.slogan)) {
                            json.player.stg.slogan = "";
                        }
                        if (json.player.stg.slogan == "") {
                            $("#inputSlogan").val(slblank).addClass("fan-input-empty");
                        } else {
                            $("#inputSlogan").val(json.player.stg.slogan).removeClass("fan-input-empty");
                        }
                        try {
                            $(".fan-jersey-name").html(json.player.stg.nickname).css("color", json.player.teamstg.colors[1]);

                            clearAvatars({
                                section: name
                            });
                            if (true) { //(!pa) {
                                drawAvatar({
                                    theme: debug ? "basketball" : self.theme(),
                                    item: "playerbody",
                                    id: "PlayerBodyId",
                                    colors: json.player.teamstg.colors,
                                    heightInPixels: 275,
                                    flip: false,
                                    number: json.player.stg.jersey,
                                    section: name
                                });
                            }
                        }
                        catch (e) {
                        }

                        $("#inputSlogan").unbind().bind("click", function() {
                            if ($(this).val() == slblank) {
                                $(this).removeClass("fan-input-empty");
                                $(this).val("");
                            }
                        }).bind("blur", function() {
                            if ($(this).val() == "") {
                                $(this).addClass("fan-input-empty");
                                $(this).val(slblank);
                            }
                        });
                        $("#savePlayerSetup").unbind().bind("click", function() {
                            var stg = {};
                            stg.jersey = $("#inputJersey").val().replace(/"/g, "").replace(/\\/g, "");
                            stg.nickname = $("#inputNickname").val().replace(/"/g, "").replace(/\\/g, "");
                            stg.slogan = $("#inputSlogan").val().replace(/"/g, "").replace(/\\/g, "");
                            stg.prebuiltAvatar = $(".fan-avatar").eq(0).hasClass("prebuilt-avatar");
                            if (stg.prebuiltAvatar) {
                                stg.avatarFilename = $(".fan-avatar img").attr("src");
                            }

                            if (stg.slogan == slblank) stg.slogan = "";
                            var tm = Team;
                            var cs = CSR;
                            if ((Role != "CSR") && (Role != "Team Leader")) {
                                tm = "";
                                cs = oUid();
                            }
                            //Experiment to see if we can make a team leader (who is capable of viewing CSR player setups) to have their own player setup.
                            if (specialteam()) { //Safety switch
                                tm = Team;
                                cs = $.cookie("TP1Username");
                            }
                            playerhome_loaded = false;
                            a$.ajax({
                                type: "GET",
                                service: "JScript",
                                async: false,
                                data: {
                                    lib: "fan",
                                    test: testq,
                                    testdateoffset: testdateoffset,
                                    cmd: "saveplayerstg",
                                    role: $.cookie("TP1Role"),
                                    Team: tm,
                                    CSR: cs,
                                    stg: stg
                                },
                                dataType: "json",
                                cache: false,
                                error: a$.ajaxerror,
                                success: savedPlayerSTG
                            });

                            function savedPlayerSTG() {
                                if (a$.jsonerror(json)) {} else { alert("Player Information Saved"); }
                            }
                            selectSection("Player Setup");
                        });

                    }
                }
                break;
            case "Rules": //All markup
            case "Resources": //All markup
                break;
            default:
                alert("debug:unrecognized menu entry:" + name);
                break;
        }
    }

    function clearAvatars(o) {
        var ln = canvi.length;
        for (var i = 0; i < ln; i++) {
            if (canvi[i].section == o.section) {
                try {
                    canvi[i].canvas.clear();
                    $("#" + canvi[i].id).children().remove();
                    canvi[i].splice(i, 1);
                } catch (error) {}
                ln--;
                i--;
            }
        }
    }

    function lightbrackets() {
        clearAvatars({
            section: "AllBrackets"
        });
        $(".bkt-teamicon").each(function() {
            uid++;
            $(this).removeAttr("id").attr("id", uid).html("");
            var colors = [];
            colors[0] = $(" span", $(this).parent()).eq(2).html();
            colors[1] = $(" span", $(this).parent()).eq(3).html();
            //HARDCODE to FOOTBALL CES FOR NOW, since I'm trying to bridge the gap between 2 games for CES
            if (false) { //(a$.urlprefix() == "ces.") {
                drawAvatar({
                    theme: "football",
                    item: "teamicon",
                    id: uid,
                    colors: colors,
                    heightInPixels: 20,
                    flip: false,
                    section: "AllBrackets"
                });
            } else {
                drawAvatar({
                    theme: debug ? "basketball" : self.theme(),
                    item: "teamicon",
                    id: uid,
                    colors: colors,
                    heightInPixels: 20,
                    flip: false,
                    section: "AllBrackets"
                });
            }
        });
        $(".bkt-game-box").unbind().bind("click", function() {
            var lid = $(" span", $(" .bkt-team", this).eq(0)).eq(0).html();
            var tid = $(" span", $(" .bkt-team", this).eq(0)).eq(1).html();
            var team = Team;
            var csr = CSR;
            //leagueCrumb(0);
            Team = tid;
            CSR = "";
            self.selectSection("Matchup");

            function revertTeamCSR() {
                Team = team;
                CSR = csr;
            }
            setTimeout(revertTeamCSR, 4000);
            return false;
        });
                            $(".finals-scoreboard_group").unbind().bind("click", function() {
                                var lid = $(" span", $(".teamrow",this).eq(0)).eq(0).html();
                                var tid = $(" span", $(".teamrow",this).eq(0)).eq(1).html();
                                var team = Team;
                                var csr = CSR;
                                //leagueCrumb(0);
                                Team = tid;
                                CSR = "";
                                MapRedirect = 0;  //Safe here?
                                self.selectSection("Matchup");    
                                function revertTeamCSR() {
                                    Team = team;
                                    CSR = csr;
                                }
                                setTimeout(revertTeamCSR, 4000);
                                return false;
                            });
    }

    function datenow() {
        //Necessary to make Date.now() compatible with IE 8
        var d = new Date;
        var n = +d;
        return n;
    }

    function getDraftQueue() {
        updatingQueue(true);
        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "fan",
                test: testq,
                testdateoffset: testdateoffset,
                cmd: "getDraftQueue",
                leagueid: subscriber.leagueid
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: loadedDQ
        });

        function loadedDQ(json) {
            if (a$.jsonerror(json)) {} else {
                draftqueue(json.draftqueue);
                activateQ();
                $(".draft-q-save").hide();
                $(".fan-draft-q-save-button").unbind().bind("click", function() {
                    var csrs = [];
                    $(".draft-q-uid").each(function() {
                        csrs.push($(this).html());
                    });
                    $(".draft-q-save").hide();
                    a$.ajax({
                        type: "GET",
                        service: "JScript",
                        async: true,
                        data: {
                            lib: "fan",
                            test: testq,
                            testdateoffset: testdateoffset,
                            cmd: "draftQueueSave",
                            csrs: csrs,
                            leagueid: subscriber.leagueid
                        },
                        dataType: "json",
                        cache: false,
                        error: a$.ajaxerror,
                        success: qadded //TODO: See if you can hook up this "progress" member, it would be very cool.
                    });

                    function qadded(json) {
                        if (a$.jsonerror(json)) {} else {
                            $(".draft-q-saved").show();
                        }
                    }
                });
                $(".fan-draft-q-cancel-button").unbind().bind("click", function() {
                    $(".draft-q-save").hide();
                    $(".draft-q-saved").show();
                    getDraftQueue();
                });
            }
            updatingQueue(false);

        }
    }



    function drawAvatar(o) {
        //        drawAvatar({ theme: json.leagues[i].theme, item: "teamicon", id: uid, colors: ["black", "red"], heightInPixels: 20 });
        if ((o.theme == "football") || ((o.theme == 'soccer') && (o.item == "playerbody"))) {
            if (o.item == "teamicon") { //This is the helmet.
                //var canvaswidth = 400;
                var canvaswidth = 425;
                //var canvasheight = 320;
                var canvasheight = 405;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Helmet and Mask
                var helmetpath = canvi[canvi.length - 1].canvas.path("M205.479,296.037c0.293-2.743,7.647-67.646,48.627-101.175c40.122-32.828,96.714-33.117,116.034-33.119c-0.669-6.615-2.412-18.07-6.843-36.658c-3.146-11.383-8.521-25.143-17.737-38.934c-19.867-29.729-61.921-65.165-149.437-65.165c-116.012,0-172.907,80.744-183.473,146.767c-9.242,57.748,17.122,154.365,18.249,158.45c1.389,5.028,6.498,8.075,11.59,6.934c12.587-2.891,49.028-4.832,72.67,14.869c11.538,9.616,42.121,31.981,76.794,31.984c0.002,0,0.002,0,0.004,0c37.475,0,58.361-26.257,65.551-36.52c0,0,3.453-4.749,9.149-12.671c-17.911-2.816-32.855-5.597-47.365-11.209C210.057,316.021,204.376,306.335,205.479,296.037z M159,305.5c-17.949,0-32.5-14.551-32.5-32.5s14.551-32.5,32.5-32.5s32.5,14.551,32.5,32.5S176.949,305.5,159,305.5z").attr({
                    id: 'helmetpath',
                    parent: 'layer1',
                    fill: o.colors[0],
                    "fill-rule": 'evenodd',
                    stroke: '#000000',
                    "stroke-width": '1',
                    "stroke-linecap": 'butt',
                    "stroke-linejoin": 'miter',
                    "stroke-opacity": '1',
                    "fill-opacity": '1'
                }).data('id', 'helmetpath').transform(xfs);
                var maskpath = canvi[canvi.length - 1].canvas.path("M410.345,304.583c-36.028,0-65.434-2.3-89.17-4.194l0.671-94.849c14.657-3.257,31.692-4.864,51.264-4.864c19.731,0,19.731-29.926,0-29.926c-17.286,0-74.795-0.717-113.938,31.31c-38.438,31.45-45.459,93.221-45.738,95.834c-0.689,6.438,2.705,12.906,8.745,15.241c19.488,7.537,40.822,9.87,68.881,14.363c1.607,7.174-12.166,62.969,39.741,74.002c16.323,3.47,35.392,1.799,51.793-9.099c32.705-21.727,42.066-68.048,42.449-70.052C426.534,314.53,420.41,304.583,410.345,304.583z M291.846,297.382c-6.914-0.854-33.346-4.626-46.589-8.231c5.892-27.762,18.339-58.028,46.589-72.979V297.382z M365.962,367.525c-8.361,5.527-17.828,7.066-28.938,4.705c-9.98-2.121-16.17-6.99-16.181-24.675l0.121-17.166c19.527,1.511,42.478,2.61,69.287,2.981 C385.431,345.561,377.493,359.902,365.962,367.525z").attr({
                    id: 'maskpath',
                    parent: 'layer1',
                    fill: o.colors[1],
                    "fill-rule": 'evenodd',
                    stroke: '#000000',
                    "stroke-width": '1',
                    "stroke-linecap": 'butt',
                    "stroke-linejoin": 'miter',
                    "stroke-opacity": '1',
                    "fill-opacity": '1'
                }).data('id', 'maskpath').transform(xfs);
                if (o.flip) {
                    helmetpath.scale(-1, 1).translate(-48, 0);
                    maskpath.scale(-1, 1).translate(210, 0);
                }
                var rsrGroups = [layer1];
                layer1.push(helmetpath, maskpath);
            } else if (o.item == "playerbody") { //This is the jersey
                if (o.colors[0] == o.colors[1]) { //Can't see the jersey in this case.
                    if (o.colors[0].substring(0, 1) == "#") {
                        var c = parseInt(o.colors[0].substring(1), 16);
                        c = c ^ 0xffffff;
                        o.colors[1] = "#" + c.toString(16);
                    } else if (o.colors[0] != "white") {
                        o.colors[1] = "white";
                    } else {
                        o.colors[1] = "black";
                    }
                }
                var canvaswidth = 190;
                var canvasheight = 170;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Jersey
                var path_a = canvi[canvi.length - 1].canvas.path("m 170.4204,28.445521 c 0,-0.2 -0.1,-0.3 -0.2,-0.5 0.5,-1 0.8,-2.3 0.4,-3.8 -1.1,-4.3 -7.1,-7.8 -18.8,-11 -15.4,-4.2000002 -29.1,-4.2000002 -35.9,-3.9000002 -0.2,0 -0.4,0.1 -0.6,0.1 l -3.7,-3.7 c -0.9,-0.9 -2.2,-1.1 -3.3,-0.6 -2.7,1.1 -8.6,3 -18.4,3 -9.7,0 -15.6,-1.8 -18.3,-2.9 -1.1,-0.5 -2.4,-0.2 -3.3,0.7 l -3.6,3.6 c -0.2,-0.1 -0.4,-0.1 -0.6,-0.1 -6.8,-0.3 -20.5,-0.3 -35.9,3.9000002 -11.7,3.2 -17.7,6.7 -18.8000004,11 -0.4,1.5 -0.1,2.8 0.4,3.8 -0.1,0.2 -0.1,0.3 -0.2,0.5 -0.1,0.5 -0.2,1 -0.3,1.7 0,0.2 -0.1,0.4 -0.1,0.6 l 0,31.6 c 0,1.1 0.6,2.1 1.6000004,2.7 l 0.5,0.3 c -0.9,0.5 -1.4000004,1.5 -1.4000004,2.5 l 0,5.9 c 0,1.1 0.6000004,2.1 1.6000004,2.7 l 27.9,14.4 c 0.2,0.1 0.4,0.2 0.6,0.2 0.5,0.1 0.8,0.2 0.8,0.2 0.2,0.1 0.5,0.1 0.7,0.1 0.5,0 1,-0.1 1.5,-0.4 0.3,4.1 0.7,15.099999 1,24.799999 0.3,9.6 0.6,19.5 1,24.1 0.8,11.4 17.3,12.2 38.3,13.1 1.9,0.1 3.8,0.2 5.8,0.3 0.2,0 0.5,0.1 0.7,0.1 l 0.2,0 0.2,0 c 0,0 0.1,0 0.1,0 0.2,0 0.4,0 0.6,-0.1 1.9,-0.1 3.9,-0.2 5.8,-0.3 20.9,-0.9 37.5,-1.7 38.3,-13.1 0.3,-4.6 0.6,-14.5 1,-24.1 0.3,-9.8 0.7,-20.699999 1,-24.799999 0.4,0.2 0.9,0.4 1.5,0.4 0.2,0 0.5,0 0.7,-0.1 0,0 0.3,-0.1 0.8,-0.2 0.2,-0.1 0.4,-0.1 0.6,-0.2 l 28,-14.5 c 1,-0.5 1.6,-1.5 1.6,-2.7 l 0,-5.9 c 0,-1 -0.5,-2 -1.4,-2.5 l 0.4,-0.2 c 1,-0.5 1.6,-1.5 1.6,-2.7 l 0,-31.6 c 0,-0.2 0,-0.4 -0.1,-0.6 -0.1,-0.8 -0.2,-1.3 -0.3,-1.8 z").attr({
                    parent: 'layer1',
                    fill: o.colors[0],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_a').transform(xfs);
                var path_b = canvi[canvi.length - 1].canvas.path("m 89.9204,10.94552 c -10,0 -16.3,-1.9 -19.4,-3.1 l -5.9,5.9 c 5.8,3.2 15.1,5.2 25.3,5.2 10.3,0 19.6,-2 25.5,-5.3 l -5.9,-5.9 c -2.8,1.2 -9.2,3.2 -19.6,3.2 z");
                path_b.attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_b').transform(xfs);
                var path_c = canvi[canvi.length - 1].canvas.path("m 37.3204,57.34552 c -0.9,-5.9 -1.9,-12 -4.4,-13.7 -0.9,-0.6 -2.4,-1.5 -4.2,-2.5 -1.3,-0.7 -2.7,-1.6 -4.2,-2.5 0,0 0,0 0,0 0,0 0,0 -0.1,0 0,0 -0.1,0 -0.2,-0.1 -0.1,0 -0.1,0 -0.2,-0.1 0,0 -0.1,0 -0.1,-0.1 -0.2,-0.1 -0.4,-0.2 -0.7,-0.3 0,0 0,0 0,0 -0.1,-0.1 -0.3,-0.2 -0.5,-0.2 0,0 -0.1,0 -0.1,0 -0.7,-0.4 -1.6,-0.9 -2.6,-1.6 0,0 0,0 0,0 -0.2,-0.2 -0.5,-0.3 -0.7,-0.5 0,0 0,0 0,0 -0.7,-0.5 -1.5,-1.1 -2.3,-1.8 0,0 -0.1,-0.1 -0.1,-0.1 -0.2,-0.2 -0.4,-0.4 -0.7,-0.6 -0.1,-0.1 -0.2,-0.2 -0.2,-0.2 -0.2,-0.2 -0.4,-0.4 -0.6,-0.6 -0.1,-0.1 -0.2,-0.2 -0.3,-0.3 -0.2,-0.2 -0.4,-0.4 -0.5,-0.6 -0.8,-0.8 -1.4,-1.6 -1.9,-2.4 -0.1,0.4 -0.2,1 -0.3,1.6 l 0,31.6 31.1,16.1 c -0.4,-1.6 -1.1,-3.8 -2.5,-6.8 -2.1,-3.8 -2.9,-9.1 -3.7,-14.3 z m -6.4,4 -0.3,0.2 c -0.5,0.3 -1.1,0.6 -1.6,0.8 l -0.8,0.3 0,-7.2 -7.5,0 0,7.2 -0.8,-0.3 c -0.6,-0.2 -1.1,-0.5 -1.6,-0.8 l -0.3,-0.2 0,-8.7 c 0,-4.1 2.5,-6.7 6.4,-6.7 3.9,0 6.4,2.7 6.4,6.8 l 0,8.6 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_c').transform(xfs);
                var path_d = canvi[canvi.length - 1].canvas.path("m 13.0204,73.64552 27.9,14.4 c 0.5,0.1 0.8,0.2 0.8,0.2 0,0 0.8,-2.8 1.4,-5 l -30.1,-15.6 0,6 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_d').transform(xfs);;
                var path_e = canvi[canvi.length - 1].canvas.path("m 24.5204,48.44552 c -2.4,0 -3.8,1.5 -3.8,4.2 l 0,0.1 7.5,0 0,-0.2 c 0,-1.8 -0.6,-4.1 -3.7,-4.1 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_e').transform(xfs);;
                var path_f = canvi[canvi.length - 1].canvas.path("m 138.4204,88.34552 c 0,0 0.3,-0.1 0.8,-0.2 l 28,-14.5 0,-5.9 -30.2,15.6 c 0.6,2.1 1.4,5 1.4,5 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_f').transform(xfs);;
                var path_g = canvi[canvi.length - 1].canvas.path("m 156.0204,48.44552 c -2.4,0 -3.8,1.5 -3.8,4.2 l 0,0.1 7.5,0 0,-0.2 c 0,-1.8 -0.6,-4.1 -3.7,-4.1 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_g').transform(xfs);;
                var path_h = canvi[canvi.length - 1].canvas.path("m 167.5204,29.14552 c -0.5,0.8 -1.1,1.6 -1.9,2.4 -0.2,0.2 -0.4,0.4 -0.5,0.6 -0.1,0.1 -0.2,0.2 -0.3,0.3 -0.2,0.2 -0.4,0.4 -0.6,0.6 -0.1,0.1 -0.2,0.2 -0.2,0.2 -0.2,0.2 -0.4,0.4 -0.7,0.6 0,0 -0.1,0.1 -0.1,0.1 -0.8,0.7 -1.5,1.3 -2.3,1.8 0,0 0,0 0,0 -0.3,0.2 -0.5,0.4 -0.7,0.5 0,0 0,0 0,0 -1,0.7 -1.9,1.2 -2.6,1.6 0,0 -0.1,0 -0.1,0 -0.2,0.1 -0.3,0.2 -0.5,0.2 0,0 0,0 0,0 -0.3,0.1 -0.5,0.2 -0.7,0.3 0,0 -0.1,0 -0.1,0.1 -0.1,0 -0.1,0.1 -0.2,0.1 -0.1,0 -0.1,0.1 -0.2,0.1 0,0 -0.1,0 -0.1,0 0,0 0,0 0,0 -1.5,0.9 -2.9,1.7 -4.2,2.5 -1.7,1 -3.2,1.9 -4.2,2.5 -2.5,1.7 -3.5,7.8 -4.4,13.7 -0.8,5.1 -1.7,10.4 -3.5,14.2 -1.5,2.9 -2.2,5.2 -2.5,6.8 l 31.1,-16.1 0,-31.6 c -0.3,-0.6 -0.4,-1.1 -0.5,-1.5 z m -5.1,32.2 -0.3,0.2 c -0.5,0.3 -1.1,0.6 -1.6,0.8 l -0.8,0.3 0,-7.2 -7.5,0 0,7.2 -0.8,-0.3 c -0.6,-0.2 -1.1,-0.5 -1.6,-0.8 l -0.3,-0.2 0,-8.7 c 0,-4.1 2.5,-6.7 6.4,-6.7 3.9,0 6.4,2.7 6.4,6.8 l 0,8.6 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_h').transform(xfs);;
                var path_i = canvi[canvi.length - 1].canvas.path("m 36.1204,18.24552 c 9.8,-3 20,-4 26.3,-4.4 l 1.6,-1.6 c -6.7,-0.3 -20,-0.3 -34.9,3.8 -21.6,5.9 -16.2,11.1 -16.2,11.1 3.7,7.3 12.1,10.7 12.1,10.7 -7.7,-6.7 -4.8,-14.9 11.1,-19.6 z").attr({
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_i').transform(xfs);;
                var path_j = canvi[canvi.length - 1].canvas.path("m 151.0204,15.94552 c -15,-4.1 -28.2,-4.1 -35,-3.8 l 1.6,1.6 c 6.3,0.4 16.5,1.5 26.4,4.4 15.9,4.8 18.8,13 11.1,19.6 0,0 8.4,-3.3 12.1,-10.7 0,0.1 5.4,-5.2 -16.2,-11.1 z").attr({
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_j').transform(xfs);;
                var path_k = canvi[canvi.length - 1].canvas.path("m 157.9204,29.345521 c -0.8,-4 -5.9,-7.6 -14.3,-10.1 -10.4,-3.1 -21.3,-4.1 -27.4,-4.5 -0.8,0.5 -1.6,0.9 -2.5,1.3 0.1,0.1 0.1,0.1 0.2,0.2 15.3,2.1 25.6,6 25.6,10.6 0,0.4 -0.1,0.9 -0.3,1.3 -1.8,8.2 -11.4,53.9 -11.4,89.799999 0,18.4 -1.8,25.1 -15.4,27.1 -5.8,0.9 -13.9,1.7 -22,2.2 l 0,0 c -0.1,0 -0.2,0 -0.3,0 -0.1,0 -0.2,0 -0.3,0 l 0,0 c -8.2,-0.5 -16.2,-1.4 -22,-2.2 -13.6,-2 -15.4,-8.8 -15.4,-27.1 0,-34.799999 -9.1,-78.699999 -11.3,-88.899999 -0.5,-0.7 -0.8,-1.4 -0.8,-2.2 0,-4.6 10.5,-8.6 26.1,-10.6 0,0 0,0 0.1,-0.1 -1,-0.4 -1.9,-0.9 -2.7,-1.4 -6.2,0.3 -16.9,1.4 -27.2,4.4 -8.4,2.5 -13.4,6.1 -14.3,10.1 -0.7,3.2 1.6,5.9 3.6,7.6 l 4.7,4 c 1.2,0.7 2.3,1.3 3.1,1.8 5.2,3.4 4.2,20 8.3,28.3 4.1,8.3 3.4,13.1 4.1,18.3 0.7,5.2 1.4,40.299999 2.1,50.299999 0.7,9.7 19.5,9.5 41.6,10.6 l 0,0 c 0.1,0 0.2,0 0.3,0 0.1,0 0.2,0 0.3,0 l 0,0 c 22.1,-1.1 40.9,-0.9 41.6,-10.6 0.7,-10 1.4,-45.099999 2.1,-50.299999 0.7,-5.2 0,-10 4.1,-18.3 4.1,-8.3 3.2,-24.9 8.3,-28.3 0.8,-0.5 1.8,-1.1 3.1,-1.8 l 4.7,-4 c 2.1,-1.6 4.3,-4.3 3.6,-7.5 z").attr({
                    parent: 'layer1',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': '#000000'
                }).data('id', 'path_k').transform(xfs);;
                //Digits
                var dig = [];
                dig[0] = "m 1,28.1 0,-3.1 c 0,-16.8 5.1,-24.6 14.2,-24.6 8.9,0 14,7.8 14,24.6 l 0,3.1 c 0,16.8 -5.2,24.6 -14.1,24.6 -9,0 -14.1,-7.8 -14.1,-24.6 z m 17.5,0.6 0,-4.3 c 0,-11.9 -1.4,-14 -3.4,-14 -2,0 -3.4,2.2 -3.4,14 l 0,4.3 c 0,11.8 1.4,14 3.4,14 2,0 3.4,-2.2 3.4,-14 z";
                dig[1] = "m 8,12.7 -5.2,1.6 0,-10.5 8.3,-2.6 7.7,0 0,50.6 -10.8,0 0,-39.1 z";
                dig[2] = "m 1,42.4 9.4,-18 c 2.5,-5 3.4,-7.1 3.4,-9.1 0,-2.3 -1.3,-4.2 -4.3,-4.2 -2.6,0 -4.9,0.9 -7.4,2.3 l 0,-10.4 c 2.7,-1.2 6,-2.3 10.2,-2.3 7.1,0 12.2,4.3 12.2,12.2 l 0,0.4 c 0,4.4 -1.2,7.9 -4,13.1 l -8.1,14.9 11.9,0 0,10.7 -23.2,0 0,-9.6 z";
                dig[3] = "m 2,51.1 0,-10.2 c 2.2,0.9 4.2,1.4 6.9,1.4 3.5,0 5.8,-2.2 5.8,-5.8 l 0,-0.4 c 0,-4.2 -3.3,-6.2 -9.1,-6.6 l 0,-7.1 8.1,-10.8 -11.1,0 0,-10.3 22.4,0 0,9.5 -8.8,11.6 c 5.1,1.7 9.1,5.1 9.1,13.2 l 0,0.6 c 0,10.2 -6.2,16.2 -14.8,16.2 -3.6,0.2 -6.2,-0.3 -8.5,-1.3 z";
                dig[4] = "m 15,43.2 -14.3,0 0,-7.8 13.8,-34.1 10.7,0 0,32.8 4.1,0 0,9.1 -4.1,0 0,8.6 -10.2,0 0,-8.6 z m 0.1,-9.1 0,-16.1 -5.8,16.1 5.8,0 z";
                dig[5] = "m 1,51.2 0,-10.4 c 1.9,0.9 4,1.5 6.5,1.5 3.7,0 6.1,-2.7 6.1,-7.1 l 0,-0.4 c 0,-4.3 -2,-6 -4.7,-6 -1.3,0 -2.2,0.1 -3.2,0.6 l -5,-2.9 1.3,-25.1 20.4,0 0,10.2 -12.3,0 -0.5,8 c 0.6,-0.1 1.4,-0.1 2.3,-0.1 6.6,0 12.5,4 12.5,15 l 0,0.6 c 0,11.4 -6.4,17.5 -15.6,17.5 -3,0 -5.9,-0.6 -7.8,-1.4 z";
                dig[6] = "m 6,49.5 c -3.5,-3.5 -5.3,-10.4 -5.3,-21.2 l 0,-1.4 c 0,-20.9 7.2,-26.2 16.1,-26.2 2.7,0 4.9,0.4 6.8,1 l 0,9.9 c -1.6,-0.8 -3.7,-1.4 -5.9,-1.4 -4,0 -6.6,2.7 -6.6,10.4 1.5,-1.1 3.5,-1.7 5.6,-1.7 5.1,0 10.4,3.2 10.4,14.5 l 0,1.9 c 0,11.2 -5.6,17.4 -12.8,17.4 -3.5,0 -6.2,-1 -8.3,-3.2 z m 10.8,-13.8 0,-1.9 c 0,-5 -1.4,-6.5 -3.3,-6.5 -1.1,0 -1.9,0.4 -2.5,0.8 l 0,6.6 c 0,6.6 1.2,8.8 3,8.8 1.8,0 2.8,-1.9 2.8,-7.8 z";
                dig[7] = "m 13,11.9 -11.9,0 0,-10.6 22.7,0 0,6.9 -9.3,43.5 -10.4,0 8.9,-39.8 z";
                dig[8] = "m 1,38 0,-0.6 c 0,-5.9 2.5,-10.1 5.7,-12.3 -3.2,-2.3 -5.1,-6 -5.1,-10.7 l 0,-0.5 c 0,-8.1 5.4,-13.5 12.7,-13.5 7.3,0 12.7,5.3 12.7,13.4 l 0,0.5 c 0,4.6 -1.9,8.4 -5.2,10.7 3.2,2.2 5.8,6.3 5.8,12.3 l 0,0.6 c 0,9.1 -5.4,14.8 -13.4,14.8 -7.9,0 -13.2,-5.6 -13.2,-14.7 z m 16.4,-0.8 0,-0.6 c 0,-5.1 -1.2,-7 -3,-7 -1.8,0 -3.1,1.9 -3.1,7 l 0,0.6 c 0,5.3 1.4,6.9 3.1,6.9 1.7,0 3,-1.6 3,-6.9 z m -0.3,-21.7 0,-0.5 c 0,-4.7 -1.2,-6.1 -2.8,-6.1 -1.6,0 -2.8,1.4 -2.8,6.1 l 0,0.5 c 0,4.3 1.1,6.2 2.8,6.2 1.7,0 2.8,-1.9 2.8,-6.2 z";
                dig[9] = "m 17,33.2 c -1.6,1.1 -3.5,1.7 -5.5,1.7 -5.2,0 -10.4,-3.2 -10.4,-14.9 l 0,-1.7 c 0,-11.7 5.6,-17.8 12.8,-17.8 3.3,0 6,0.9 8.1,3.1 3.5,3.5 5.3,10.4 5.3,21.3 l 0,1.4 c 0,20.8 -7.3,26.2 -16.1,26.2 -2.9,0 -5.4,-0.5 -7.5,-1.3 l 0,-9.8 c 1.9,0.9 4.2,1.6 6.6,1.6 4,0 6.4,-2.5 6.7,-9.8 z m 0,-7.6 0,-7.1 c 0,-6.7 -1.2,-8.9 -3,-8.9 -1.8,0 -2.9,1.9 -2.9,8.1 l 0,1.8 c 0,5.5 1.3,6.9 3.3,6.9 1.1,0 1.9,-0.3 2.6,-0.8 z";
                var n = 0;
                if (parseInt(o.number, 10) >= 9) {
                    n = Math.floor(parseInt(o.number, 10) / 10);
                    if (n > 9) n = 0;
                }
                var digit1 = canvi[canvi.length - 1].canvas.path("m 60 60 " + dig[n]).attr({
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).transform(xfs);
                n = parseInt(o.number, 10) % 10;
                var digit2 = canvi[canvi.length - 1].canvas.path("m 90 60 " + dig[n]).attr({
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).transform(xfs);
                var rsrGroups = [layer1];
                layer1.push(path_a, path_b, path_c, path_d, path_e, path_f, path_g, path_h, path_i, path_j, path_k, digit1, digit2);
            } else {
                alert("Unrecognized avatar item in theme: " + o.theme + "=" + o.item);
            }
        } else if (o.theme == "tiki") {
            if (o.item == "teamicon") { //This is the flower.
            		//Default sprucing up
            		if (o.colors[0] == "lightgray") o.colors[0] = "orange";
            		if (o.colors[1] == "darkgray") o.colors[1] = "crimson";
                var canvaswidth = 946;
                //var canvaswidth = 165;
                var canvasheight = 946;
                //var canvasheight = 165;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Helmet and Mask
                //var helmetpath = canvi[canvi.length - 1].canvas.path("M205.479,296.037c0.293-2.743,7.647-67.646,48.627-101.175c40.122-32.828,96.714-33.117,116.034-33.119c-0.669-6.615-2.412-18.07-6.843-36.658c-3.146-11.383-8.521-25.143-17.737-38.934c-19.867-29.729-61.921-65.165-149.437-65.165c-116.012,0-172.907,80.744-183.473,146.767c-9.242,57.748,17.122,154.365,18.249,158.45c1.389,5.028,6.498,8.075,11.59,6.934c12.587-2.891,49.028-4.832,72.67,14.869c11.538,9.616,42.121,31.981,76.794,31.984c0.002,0,0.002,0,0.004,0c37.475,0,58.361-26.257,65.551-36.52c0,0,3.453-4.749,9.149-12.671c-17.911-2.816-32.855-5.597-47.365-11.209C210.057,316.021,204.376,306.335,205.479,296.037z M159,305.5c-17.949,0-32.5-14.551-32.5-32.5s14.551-32.5,32.5-32.5s32.5,14.551,32.5,32.5S176.949,305.5,159,305.5z").attr({ id: 'helmetpath', parent: 'layer1', fill: o.colors[0], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'helmetpath').transform(xfs);
                //var maskpath = canvi[canvi.length - 1].canvas.path("M410.345,304.583c-36.028,0-65.434-2.3-89.17-4.194l0.671-94.849c14.657-3.257,31.692-4.864,51.264-4.864c19.731,0,19.731-29.926,0-29.926c-17.286,0-74.795-0.717-113.938,31.31c-38.438,31.45-45.459,93.221-45.738,95.834c-0.689,6.438,2.705,12.906,8.745,15.241c19.488,7.537,40.822,9.87,68.881,14.363c1.607,7.174-12.166,62.969,39.741,74.002c16.323,3.47,35.392,1.799,51.793-9.099c32.705-21.727,42.066-68.048,42.449-70.052C426.534,314.53,420.41,304.583,410.345,304.583z M291.846,297.382c-6.914-0.854-33.346-4.626-46.589-8.231c5.892-27.762,18.339-58.028,46.589-72.979V297.382z M365.962,367.525c-8.361,5.527-17.828,7.066-28.938,4.705c-9.98-2.121-16.17-6.99-16.181-24.675l0.121-17.166c19.527,1.511,42.478,2.61,69.287,2.981 C385.431,345.561,377.493,359.902,365.962,367.525z").attr({ id: 'maskpath', parent: 'layer1', fill: o.colors[1], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'maskpath').transform(xfs);
                //var rsr = Raphael('rsr', '612', '792');
                var outlinepath = canvi[canvi.length - 1].canvas.path("M418.729441,406.420221 C426.665614,400.258061 435.728279,396.619356 445.289106,394.951007 C452.762847,393.64685 460.344272,393.596351 467.799972,394.51211 C474.154261,395.292587 480.440865,396.795044 486.087934,398.876191 C489.394212,400.094673 492.564654,401.535694 495.601246,403.290137 C500.977198,406.396185 505.725346,410.174002 510.079786,416.153416 C556.728112,480.459004 600.355086,534.710816 651.546686,587.638805 C713.200714,651.384101 774.896054,700.562887 835.289814,731.182632 C842.305623,726.809444 850.187031,723.666345 858.66748,722.052225 C896.251828,714.911051 932.24433,739.899942 939.1987,777.489796 C946.111703,814.914649 921.677805,851.112812 884.268283,858.22934 C855.322192,863.746456 827.324716,850.203766 812.792331,826.50084 C791.438625,818.867551 766.102429,805.534624 736.3688,787.07305 C733.135518,785.065509 729.855031,782.998469 726.530774,780.874543 C725.351912,797.214341 720.260507,811.629898 710.834034,824.132079 C704.070862,833.101967 695.756799,840.151769 685.875747,846.107531 C679.142857,850.165752 672.49551,853.326816 662.924075,857.358619 C661.542355,857.940645 653.631887,861.223048 651.446674,862.151974 C647.505602,863.827311 644.378366,865.237428 641.517822,866.646121 C639.435651,867.6715 637.527429,868.681957 635.733596,869.71251 C633.103524,871.22176 629.03399,875.136381 622.142981,883.287451 C620.553539,885.167532 614.712694,892.200685 614.191467,892.823755 C603.627949,905.451288 595.928437,913.587538 586.135702,921.419004 C572.079091,932.660386 556.571627,940.293529 538.875359,943.577132 C518.997564,947.270606 499.935582,946.167679 480.915433,941.069182 C467.446268,937.458668 456.798374,933.000723 439.501241,924.625986 C427.251835,918.695202 426.106179,918.151746 421.854103,916.345191 C417.552516,914.5176 414.066431,913.297013 411.10679,912.562896 C410.073878,912.307179 408.988769,912.062395 407.842581,911.826381 C403.387898,910.909111 399.916301,910.402582 389.795253,909.104962 C378.650022,907.676031 372.856789,906.777339 365.746503,905.115989 C354.90205,902.582135 345.242866,898.934537 336.203576,893.393232 C314.21273,879.912309 300.575024,857.89061 294.920147,827.999994 C285.222246,776.67208 299.525184,712.248511 329.897524,645.137862 C354.502695,590.770336 387.762062,540.008853 415.824861,514.367004 C406.296212,501.110126 400.109009,489.306862 397.288223,477.792236 L396.631676,475.112174 L396.340162,472.368307 C396.24424,471.465443 396.140761,470.261377 396.049444,468.792736 C395.609433,461.716121 395.737347,454.177575 396.935065,446.308344 C397.813158,440.539111 399.229232,434.979694 401.445293,429.547538 C401.992069,428.207244 402.581734,426.887812 403.217401,425.591509 L388.627344,367.602336 L418.729441,406.420221 Z M442.160534,488.948505 L424.290739,557.925937 C413.333846,600.219555 392.650916,649.984944 367.445584,692.984751 C337.010442,744.906513 301.869362,784.677204 263.057652,805.744887 C238.000503,819.347302 214.712641,824.010033 192.20822,818.358045 C181.587561,815.690665 172.047328,810.916087 163.21497,804.368117 C156.708531,799.544494 150.937429,794.079089 144.590284,787.157119 C141.360982,783.635358 130.81871,771.440544 128.729765,769.130749 C125.18814,765.214694 122.158084,762.140354 119.201025,759.498641 C116.561619,757.140598 110.905307,754.313436 97.6944655,749.132287 C96.77637,748.77222 93.4027079,747.454015 92.711289,747.183147 C90.6456703,746.373927 88.9937512,745.721038 87.3699177,745.069628 C72.9832706,739.298347 62.5600055,734.255721 52.2584189,727.343112 C37.8497091,717.674525 26.2398138,705.623507 17.8886868,690.392856 C7.89098428,672.161465 3.0282647,653.190431 2.19445791,632.938099 C1.61636392,618.896775 2.61820346,608.189141 5.52662517,587.814655 C7.9135549,571.093399 8.47800276,565.08255 8.05719701,559.046032 C7.7206869,554.188792 6.98113875,549.407821 5.1863518,539.86919 C2.77036785,527.029127 2.06355934,522.852692 1.36256903,515.725507 C0.250715471,504.42095 0.563580378,494.013906 2.89527117,483.551348 C8.66155556,457.677384 25.7101259,437.320772 53.2771899,422.355331 C99.5127857,397.253849 165.846446,390.787545 239.776655,398.722127 C302.178201,405.419392 363.726194,422.23439 396.206794,441.878948 L401.783874,445.252016 L525.215452,368.500132 L442.160534,488.948505 Z M66.0252052,197.102539 C66.4696592,189.67899 66.6683732,186.674464 67.0355004,182.426396 C68.2062137,168.87995 70.1280197,157.636015 73.7337654,146.465553 C78.5297016,131.607929 86.0143673,118.351789 96.7996156,106.913344 C117.279591,85.1878945 140.698302,74.0792314 171.139629,67.4696837 C176.879386,66.2234438 180.398234,65.5742864 190.980104,63.7182033 C205.236908,61.2175288 211.339875,59.809018 216.524684,57.7130008 C220.583399,56.0708165 224.800593,53.9659689 231.701261,50.2065106 C232.683796,49.6712292 236.196417,47.7476302 236.828364,47.4026893 C238.990064,46.2227502 240.706576,45.2969754 242.410321,44.3973213 C247.045167,41.9499146 251.1191,39.9496536 255.251414,38.1529529 C291.291706,22.4828893 325.808441,27.4246705 358.53721,58.4529852 C396.063674,94.0246854 422.16731,153.958511 437.096751,225.343695 C449.691131,285.563779 452.57594,348.069835 444.020283,384.404186 L442.691567,390.047006 L554.078616,483.730771 L413.185871,442.013827 L343.63868,446.343417 C300.826911,449.008621 248.110932,444.881408 200.338176,434.478177 C142.602925,421.905464 94.7797276,401.231576 63.2769533,371.375536 C31.1773097,340.949957 22.210314,307.647665 35.6928234,272.849191 C38.2023221,266.372152 41.2830894,260.231745 45.3308726,253.184027 C47.4436958,249.505326 54.8788709,237.214605 54.4974565,237.854485 C58.3052449,231.466348 60.7962178,226.846492 62.7679176,222.387883 C64.2100567,219.125129 65.0694257,213.066571 66.0252052,197.102539 Z M573.946693,8.61303993 C596.702495,2.68010365 609.249942,0.372856088 625.741242,0.786544205 C640.263999,1.15085094 654.185386,4.24539014 667.441404,10.5672561 C684.148329,18.5332648 697.945011,29.4593375 709.595969,43.1388234 C718.299328,53.3575105 724.96762,63.836318 732.737094,78.2300367 C733.663681,79.9466317 734.590043,81.6863558 735.756944,83.895188 C736.019856,84.3928559 737.982163,88.1148272 738.541274,89.1711217 C744.37659,100.195435 747.680978,105.643274 751.086294,109.727588 C753.603127,112.746457 756.643913,115.906138 761.207609,120.29727 C761.937616,120.999675 769.078829,127.781075 771.292116,129.938644 C777.811397,136.293809 782.746822,141.640433 787.29305,147.647407 C793.598104,155.978336 798.417185,164.76433 801.558269,174.531669 C808.6918,196.713699 805.967986,220.251194 794.192759,245.188122 C772.067891,292.033538 723.290286,335.541482 660.203736,371.911821 C606.96448,402.605048 548.548691,424.726876 511.390837,427.807996 L505.778363,428.273381 L451.089456,564.31526 L447.137107,416.346224 L421.523216,351.154887 C405.792382,311.117468 393.433271,259.521566 388.543418,210.709226 C382.634297,151.722182 387.454739,99.7067474 406.0022,60.4280962 C420.415578,29.9041408 440.595493,11.0205105 467.790469,5.19161771 C478.892882,2.81195871 489.821392,2.8759867 501.774195,4.64123546 C508.949004,5.7008467 510.998715,6.15455956 526.696328,9.86031327 C536.275754,12.1217397 541.798312,13.1992316 547.348301,13.7763511 C550.980889,14.1533292 556.706084,13.1080446 573.946693,8.61303993 Z M487.70247,432.784842 L542.257624,388.306072 C575.704318,361.037011 621.270945,333.423558 666.496465,313.771331 C721.106569,290.041141 772.374926,278.649497 815.676623,284.195344 C847.926706,288.321878 871.555467,300.688281 885.924533,323.090776 C892.046176,332.634894 895.791772,342.922973 898.106581,354.511056 C899.589542,361.934851 900.268121,367.959349 901.251176,379.735647 C902.371827,393.160248 902.937615,398.067034 904.254619,404.140765 C904.478621,405.174409 905.085622,406.822395 906.207204,409.116796 C908.347532,413.49523 909.748931,415.770142 918.453759,429.281277 C927.796967,443.783271 933.073675,453.059876 937.716996,464.6945 C944.55349,481.82449 947.302437,499.239218 944.910341,517.499814 C942.375359,536.812975 935.71546,554.024659 925.439645,569.963818 C918.021111,581.470954 910.181852,590.584911 897.745185,603.349917 C897.185287,603.924596 890.854466,610.381687 889.140863,612.156364 C882.373128,619.165304 878.532225,623.700956 876.01329,627.675131 C874.334969,630.324613 872.629771,633.404171 870.640484,637.350796 C869.846096,638.926812 869.019182,640.612849 867.968602,642.790561 C867.580704,643.594621 865.633075,647.652373 865.069794,648.818056 C860.718671,657.822512 857.587264,663.733348 853.582958,669.947902 C847.712523,679.058627 841.04624,686.795571 832.818722,693.294957 C813.438595,708.604424 789.070713,714.033926 760.019738,710.313852 C708.364287,703.699978 651.492791,670.738046 596.965797,621.981487 C550.911295,580.8008 511.447983,532.062011 496.870115,497.66916 L494.602334,492.318898 L346.909802,482.153334 L487.70247,432.784842 Z M785.151018,778.580592 C791.289317,811.300493 769.676526,842.70968 736.974167,848.830906 C704.325854,854.919698 672.836926,833.470209 666.67008,800.756228 C660.549505,768.0484 682.146125,736.620909 714.852473,730.529942 C747.501805,724.435842 778.993167,745.87665 785.151018,778.580592 Z M782.236471,747.223406 C776.595271,717.019665 796.470769,688.139452 826.577454,682.495969 C856.609932,676.911121 885.608718,696.651342 891.214604,726.667376 C896.919775,756.812431 877.019788,785.736587 846.940474,791.372007 C816.898385,797.00174 787.92817,777.27244 782.236471,747.223406 Z M791.365426,703.52162 C794.090952,717.990712 807.971923,727.443567 822.278901,724.763662 C836.704374,722.08628 846.28436,708.159798 843.545134,693.652979 C840.82546,679.204503 826.953832,669.74081 812.590478,672.413129 C798.185816,675.117718 788.620892,689.042486 791.365426,703.52162 Z M762.964659,708.844634 C757.27168,678.694797 777.196003,649.730692 807.248582,644.152962 C837.288865,638.526099 866.283825,658.271486 871.93956,688.29642 C877.65448,718.446494 857.749476,747.399771 827.645193,753.019295 C797.594832,758.642952 768.620723,738.892934 762.964659,708.844634 Z").attr({
                    id: 'treadpath',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': o.colors[1]
                }).data('id', 'outlinepath').transform(xfs);
                var flowerpath = canvi[canvi.length - 1].canvas.path("M522.113606,568.410978 C475.422054,524.783196 441.70254,486.780884 437.110711,468.036753 C437.110711,468.036753 434.82762,446.547271 443.286552,439.28416 C453.179943,430.804977 474.231458,436.574375 476.892326,440.228142 C537.982783,524.442479 680.19138,711.545345 845.192554,780.950263 C848.3626,771.671471 856.109776,764.275092 866.320719,762.331598 C881.459195,759.455228 896.039217,769.578052 898.880761,784.937201 C901.71683,800.290797 891.741314,815.072451 876.591888,817.954374 C861.442462,820.841849 846.87339,810.713473 844.031846,795.36543 C843.856645,794.410342 843.878545,793.471912 843.796419,792.52793 C805.062357,786.664164 721.584029,732.220285 640.2319,668.747262 C662.130685,697.369457 678.646472,727.436475 683.976966,755.617547 C695.129839,814.618839 653.209076,812.388417 615.32719,834.151596 C587.628847,850.046114 572.058278,895.720082 531.385389,903.26708 C485.509311,911.791268 454.769275,881.150567 420.959692,872.7644 C383.785307,863.561148 345.324051,873.863049 335.207359,820.388124 C318.166082,730.194046 400.815442,580.943467 445.850319,542.540455 C469.816183,597.511529 462.886026,665.776803 448.719315,722.575277 C483.865906,688.318421 494.561968,620.610753 476.127974,547.343592 C517.998599,601.337476 527.747614,679.010273 526.226767,745.525438 C553.396159,703.900178 551.543085,636.875572 522.113605,568.410971 Z M146.516191,728.922806 C122.59133,707.548355 73.7456699,706.986016 53.8381261,670.678957 C31.384789,629.733993 51.3818552,590.966006 48.9591553,556.212339 C46.3126493,518.012258 24.4412078,484.661655 72.8392556,458.387616 C154.472495,414.068618 323.988755,446.116376 374.988548,476.961508 C329.444026,516.865309 261.485334,531.564072 202.350193,535.795534 C246.272121,558.528508 314.851875,547.587951 379.75002,507.233165 C340.701468,563.862377 268.859742,597.341037 204.274925,616.610893 C255.962921,630.296332 325.169332,603.760611 384.601015,547.643628 C365.823692,620.12412 310.342184,733.427086 243.496927,769.711874 C190.10241,798.697389 179.242224,758.158869 146.516191,728.922806 Z M100.265791,238.968278 C112.980176,210.211298 98.77544,164.582242 126.633536,135.036949 C158.051005,101.708852 200.228479,108.52447 231.902528,95.7198674 C266.715595,81.6342573 291.232685,51.1418948 330.331192,88.2090018 C396.266933,150.710133 417.492149,318.182728 404.111746,375.006915 C353.161401,344.755426 318.970679,285.982355 297.194088,232.240251 C289.240091,280.020743 320.106184,340.518247 377.312727,388.632676 C312.730859,369.510626 259.858889,312.828773 222.414507,258.588499 C225.236893,310.841569 270.848179,367.17306 341.091197,405.422636 C267.840182,409.982804 145.46764,392.782265 91.4820016,341.618599 C48.3382561,300.724892 82.8674463,278.312732 100.265791,238.968278 Z M543.109851,54.5566839 C574.304031,57.7976824 613.171238,30.1093552 649.795476,47.5756499 C691.096658,67.2684174 697.661843,109.675594 719.59491,135.981973 C743.689086,164.882247 780.171433,178.860767 757.11961,227.678649 C718.225117,310.030721 566.003411,382.138825 508.002755,386.948225 C520.936661,328.917352 566.101643,278.053966 610.317047,240.60974 C562.554369,247.804647 514.75349,296.024782 486.795514,365.571893 C484.989133,297.944155 522.382857,229.894154 562.237843,177.325268 C513.580161,196.195447 474.254537,257.209575 459.683428,336.161614 C432.745976,267.601609 411.238582,145.359481 443.076729,77.9346477 C468.513411,24.066072 500.438875,50.1201902 543.109851,54.5566839 Z M864.185776,412.829137 C870.828727,443.48274 909.525855,471.958495 904.259022,512.164057 C898.306893,557.511302 859.720298,576.795344 841.377572,605.735052 C821.216601,637.562181 819.232558,676.561467 765.226798,669.645848 C674.12662,657.981541 557.377575,535.361673 534.619111,481.668745 C594.289617,476.128608 657.16554,503.436295 706.893725,533.991649 C685.0582,490.773126 623.87341,460.119524 548.457672,454.928716 C612.715241,432.397009 689.645263,447.036069 752.504607,468.787245 C719.19037,428.297853 648.400381,409.668803 568.165463,420.083168 C625.459539,373.371358 735.891701,315.311819 810.472925,324.863778 C870.066059,332.488971 855.089022,370.876932 864.185776,412.829137 Z M722.367127,770.835403 C732.827122,768.878631 742.893884,775.730343 744.853998,786.140369 C746.808063,796.556416 739.911363,806.569067 729.457418,808.525838 C718.997423,810.476589 708.930662,803.612836 706.970547,793.214852 C705.022532,782.804826 711.901082,772.780133 722.367127,770.835403 Z M839.389571,751.073324 C831.544859,752.543822 823.998376,747.397078 822.520199,739.593117 C821.061471,731.782706 826.228608,724.275425 834.07332,722.804926 C841.911548,721.347327 849.470998,726.481172 850.929725,734.291583 C852.407902,742.101993 847.240766,749.602825 839.389571,751.073324 Z M820.112524,712.717196 C812.266934,714.190276 804.722007,709.042959 803.252732,701.237324 C801.777783,693.426045 806.951448,685.908253 814.797038,684.452104 C822.631282,682.984667 830.187555,688.131984 831.656831,695.931975 C833.137452,703.743255 827.96946,711.255403 820.112524,712.717196 Z").attr({
                    id: 'outline',
                    fill: o.colors[0],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'flowerpath').transform(xfs);
                var rsrGroups = [layer1];
                layer1.push(outlinepath);
                layer1.push(flowerpath);
            }        	
        } else if (o.theme == "dragons") {
            if (o.item == "teamicon") { //This is the dragon in a circle.
            		//Default sprucing up
            		if (o.colors[0] == "lightgray") o.colors[0] = "orange";
            		if (o.colors[1] == "darkgray") o.colors[1] = "crimson";
                var canvaswidth = 64;
                //var canvaswidth = 165;
                var canvasheight = 64;
                //var canvasheight = 165;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Helmet and Mask
                //var helmetpath = canvi[canvi.length - 1].canvas.path("M205.479,296.037c0.293-2.743,7.647-67.646,48.627-101.175c40.122-32.828,96.714-33.117,116.034-33.119c-0.669-6.615-2.412-18.07-6.843-36.658c-3.146-11.383-8.521-25.143-17.737-38.934c-19.867-29.729-61.921-65.165-149.437-65.165c-116.012,0-172.907,80.744-183.473,146.767c-9.242,57.748,17.122,154.365,18.249,158.45c1.389,5.028,6.498,8.075,11.59,6.934c12.587-2.891,49.028-4.832,72.67,14.869c11.538,9.616,42.121,31.981,76.794,31.984c0.002,0,0.002,0,0.004,0c37.475,0,58.361-26.257,65.551-36.52c0,0,3.453-4.749,9.149-12.671c-17.911-2.816-32.855-5.597-47.365-11.209C210.057,316.021,204.376,306.335,205.479,296.037z M159,305.5c-17.949,0-32.5-14.551-32.5-32.5s14.551-32.5,32.5-32.5s32.5,14.551,32.5,32.5S176.949,305.5,159,305.5z").attr({ id: 'helmetpath', parent: 'layer1', fill: o.colors[0], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'helmetpath').transform(xfs);
                //var maskpath = canvi[canvi.length - 1].canvas.path("M410.345,304.583c-36.028,0-65.434-2.3-89.17-4.194l0.671-94.849c14.657-3.257,31.692-4.864,51.264-4.864c19.731,0,19.731-29.926,0-29.926c-17.286,0-74.795-0.717-113.938,31.31c-38.438,31.45-45.459,93.221-45.738,95.834c-0.689,6.438,2.705,12.906,8.745,15.241c19.488,7.537,40.822,9.87,68.881,14.363c1.607,7.174-12.166,62.969,39.741,74.002c16.323,3.47,35.392,1.799,51.793-9.099c32.705-21.727,42.066-68.048,42.449-70.052C426.534,314.53,420.41,304.583,410.345,304.583z M291.846,297.382c-6.914-0.854-33.346-4.626-46.589-8.231c5.892-27.762,18.339-58.028,46.589-72.979V297.382z M365.962,367.525c-8.361,5.527-17.828,7.066-28.938,4.705c-9.98-2.121-16.17-6.99-16.181-24.675l0.121-17.166c19.527,1.511,42.478,2.61,69.287,2.981 C385.431,345.561,377.493,359.902,365.962,367.525z").attr({ id: 'maskpath', parent: 'layer1', fill: o.colors[1], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'maskpath').transform(xfs);
                //var rsr = Raphael('rsr', '612', '792');
                var outlinepath = canvi[canvi.length - 1].canvas.circle("").attr({
                    id: 'treadpath',
                    cx: '31.5207876',
                    cy: '31.5207876',
                    r: '30.5',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': o.colors[1]
                }).data('id', 'outlinepath').transform(xfs);
                var flowerpath = canvi[canvi.length - 1].canvas.path("M31.7207868,0 C49.2396937,0 63.4415737,14.20188 63.4415737,31.7207868 C63.4415737,49.2396937 49.2396937,63.4415737 31.7207868,63.4415737 C14.20188,63.4415737 0,49.2396937 0,31.7207868 C0,14.20188 14.20188,0 31.7207868,0 Z M31.7207868,4.04157526 C16.4339804,4.04157526 4.04157526,16.4339804 4.04157526,31.7207868 C4.04157526,47.0075933 16.4339804,59.3999984 31.7207868,59.3999984 C47.0075933,59.3999984 59.3999984,47.0075933 59.3999984,31.7207868 C59.3999984,16.4339804 47.0075933,4.04157526 31.7207868,4.04157526 Z M25.9899841,45.0207876 C25.7179913,44.4224827 25.2903494,44.0805942 24.5136763,44.1602221 C24.4625794,43.8344052 24.1685756,43.252172 24.0207876,43.0826888 C24.9554681,42.7196149 26.2360353,44.0301875 25.9899841,45.0207876 Z M26.7583758,38.0207876 C26.6137362,39.6868691 27.8066063,44.4692678 29.8364357,42.6472553 C30.6839585,42.7847512 31.1056885,44.1919717 31.0065535,45.0207876 C30.6660817,44.2672487 30.3069206,43.9354151 29.9965143,43.7756433 C29.2074974,44.2872202 28.2283363,44.8341312 27.6010231,44.3886138 C25.4184284,42.8400568 24.2239331,39.6730427 24.0207876,38.8910828 C25.121836,38.8065881 25.7987166,38.5454228 26.7583758,38.0207876 Z M24.5212501,11.0207876 C31.4283584,23.9529766 38.5401771,27.0800161 39.2297673,30.5125403 C39.3881564,29.1287399 38.8390244,28.1704904 38.4893731,27.6864262 C39.8371744,26.8755997 39.5540166,25.4006097 39.1909171,24.5707854 C40.6485449,24.7600036 41.2522164,23.3921613 41.1401487,22.2880086 C40.5394656,25.0016557 38.4938558,23.4438353 37.4942116,23.3579652 C36.3862352,23.264496 36.315259,23.7212033 35.3925679,23.7212033 C35.6174505,24.166512 36.0933648,24.7782415 36.8404831,25.1597175 C34.9136651,25.0540897 33.3028781,22.9924474 33.8385619,21.2575674 C34.5438416,23.2948925 35.4598086,23.1307514 36.5222107,22.3845175 C36.201697,20.9520826 34.9017112,20.4908158 33.0129963,20.2750007 C30.7290557,20.0135908 30.7649174,18.0362988 31.2438202,16.8470359 C31.0062366,16.9336659 30.6237121,17.2057145 30.3106695,17.4473667 C30.5258396,17.0263752 31.5097943,15.9632578 32.2374875,15.7170462 C31.8273196,16.4951965 31.7032979,16.9336659 31.7279529,17.9656269 C31.5732994,17.6244263 31.5120357,17.4367279 31.457496,16.9769809 C30.5138857,19.8274123 33.3514408,19.7103858 34.5602782,19.8464101 C36.2173865,20.0333485 37.3530062,20.8943293 37.3530062,21.9764445 C37.7616799,21.902733 38.5790273,21.9308498 38.7568414,21.9308498 C37.4344421,21.0219946 38.1740892,20.3129963 37.2932368,19.6511126 C36.5655436,19.1054955 35.5263021,19.3562666 35.1527429,18.1495257 C34.8867688,18.3577417 34.5333819,18.8212883 34.4624057,19.1434911 C34.3428668,18.6495481 34.3682688,17.7688096 34.8090685,17.2573886 C35.0406752,16.7398883 33.5703465,16.4845577 33.03018,16.7657253 C33.9640778,15.1813079 37.939494,14.157706 36.8404831,15.5445461 C36.70247,15.7189114 36.8069924,15.9316618 37.0135855,16.1364282 L37.034,16.155 L37.0240272,16.1900947 C37.0090064,16.2795931 37.0469068,16.3822722 37.1234597,16.4383699 L37.1648912,16.4622602 C37.3439589,16.5392705 37.7139271,16.6835635 38.0207876,17.0207876 C38.0127414,16.9441016 38.0014767,16.8663131 37.9856998,16.7897437 L37.981,16.771 L37.9924199,16.7763132 C38.0832798,16.8184464 38.1638023,16.8513061 38.22658,16.8724469 L38.2831684,16.889591 C38.8689092,15.8561101 40.9996904,17.6320254 41.6989931,17.9101533 C44.4648249,19.0112664 49.1955777,18.3281051 51.0207876,17.8637987 C48.3931727,19.2939538 45.4375729,19.5287667 42.4319161,19.3023128 C43.5667888,19.8912449 45.3367119,19.9854741 45.9351536,19.9801547 C45.2918848,20.2453641 44.3818948,20.4353422 43.4128824,20.4581396 C44.1921268,20.8061794 45.564583,21.0128756 46.8212359,20.7529856 C46.0113597,21.5030191 44.6471218,21.5964883 44.0367262,21.5463341 C44.2489077,21.7484708 44.6493631,22.3791981 44.7935569,22.8313459 C45.8223388,22.9286147 46.5380781,23.05628 47.2164615,23.5228662 C46.626238,23.3610049 45.8589476,23.3214894 45.2395865,23.6702892 C45.558606,24.1414349 45.9045218,25.2349488 45.9784865,25.5928676 C46.6815248,25.4538036 47.1499679,25.7000152 47.7962252,26.0776917 C46.9497402,26.0298172 46.4671018,26.1225265 46.1749786,26.4401699 C46.2347481,26.9660292 46.2377365,27.7411399 46.2295182,28.2799178 C46.7681905,28.3931447 47.4757115,28.8422529 47.845535,29.3179581 C47.2739896,29.1325395 46.5963533,29.0656672 46.1749786,29.2275285 C46.240725,29.6963944 46.2257827,30.2526503 46.1084851,30.654644 C46.7562366,30.906175 47.1903123,31.3796004 47.5115732,31.669127 C46.9213497,31.4677502 46.2332538,31.5270234 45.9411306,31.6068142 C45.3255051,33.3675312 44.4282161,35.7832927 42.0426675,37.2712011 C43.4076526,35.2065192 42.7374875,33.2330267 42.0374377,32.8530705 C43.0415646,34.0788092 42.5380069,36.0690197 41.243251,38.0835475 C40.0792407,39.8928988 38.7008076,42.9773832 39.3007435,43.1172071 C39.6802796,43.2057912 39.8917293,43.0616249 40.0814668,42.8802385 L40.2219861,42.7402751 C40.316001,42.6463871 40.4137363,42.5554147 40.5334886,42.4917992 C41.2342856,42.120962 41.6967518,43.7502141 41.7191653,44.4827697 C41.5129607,44.2502365 41.1670449,43.0024603 40.700096,44.2958312 C40.5491781,44.7160628 39.575683,44.375622 39.4023516,44.2054016 C38.6993133,44.7593778 37.8984025,44.6567896 37.269329,44.6134746 C37.2501174,43.9837786 37.4374649,41.7229307 37.7229975,39.910764 L37.726,39.885 L37.8283736,39.8557003 C38.0968257,39.7710052 38.3142398,39.673111 38.4485883,39.6151594 L38.5086921,39.5897582 C38.5024087,38.8198544 38.8197195,38.5218083 39.0207876,38.1333569 C38.8006449,38.0593661 38.5520987,38.0282272 38.2960693,38.0284584 L38.123,38.033 L38.152377,37.9430185 C38.1718993,37.8873236 38.1915759,37.8358666 38.2113884,37.7890039 L38.2712146,37.662556 C35.4650384,37.4710581 30.6498612,35.6100326 28.5310338,34.4846024 C27.4320229,37.7643843 23.623214,39.4498699 19.9690586,39.6026123 C20.0131386,42.1445192 21.5245588,44.2418774 22.0699551,43.1628018 C22.580984,42.1543981 23.7009143,43.8649609 23.6912017,45.0207876 C23.4999395,44.6925055 23.3482745,44.3604238 23.0300021,44.1050932 C22.6788565,44.9820321 21.942945,44.6081552 21.7135797,44.3642233 C20.9537605,44.5747191 19.7927387,44.5359635 18.7393019,44.4113379 C18.0355165,42.467482 17.3922477,40.9985714 16.9021381,38.5402548 C18.3141916,38.1002655 19.8151522,36.9664762 20.0176213,36.5097689 C20.0766436,35.0583362 20.799107,32.5696232 22.0258752,31.651649 C20.9186459,32.2033454 20.5391098,33.4002074 18.6982104,34.0552519 C16.0399637,35.0005829 13.2935569,32.7664405 15.2771559,30.2450512 C15.7680126,29.6211631 17.2831684,28.4790148 17.753853,28.139334 C18.4725807,27.6225935 18.1117226,27.0412606 17.1636295,27.2213598 C16.4628326,27.3543445 15.486349,27.6598292 14.8520456,28.2753583 C14.7481962,32.7421233 9.90462853,33.9131483 9.02078763,32.5749426 C10.6868613,33.3188968 11.5759321,31.7975522 11.5385762,30.3635975 C11.4548989,27.1620866 13.5737263,27.2760735 14.1505016,27.4941683 C15.0552618,26.6651039 16.0324925,26.0723723 17.0388608,26.0632533 C19.7688309,26.040456 20.0841148,27.8916025 18.6100505,28.9228036 C18.1998826,29.2092906 16.8931727,30.0824299 16.2917425,30.9608887 C15.3272128,32.3697662 16.8543226,33.1661544 18.2364913,32.588621 C19.145636,32.2082848 19.7962213,31.6178792 20.4190306,31.026521 L20.7053492,30.7542803 C21.8017862,29.7162695 22.9224171,28.7759806 25.3453216,29.0915042 C25.3333677,28.4030236 24.703547,27.6765473 24.0303934,27.4143775 C26.6624911,26.4363703 23.4618364,23.6680095 21.3572043,22.293328 C26.8397398,23.2683161 23.3692905,17.950885 21.9703988,16.183042 L21.8542458,16.0385028 C21.7990485,15.9709463 21.7483712,15.910639 21.7031201,15.8583899 C26.3180695,18.424614 25.5642272,15.0316052 24.5212501,11.0207876 Z M32.0207876,44.0207876 C31.7728202,43.7664277 31.608186,43.6347341 31.2631657,43.656506 C31.2250559,43.422856 31.1213974,43.2168192 31.0207876,43.0229959 C31.3881657,42.9927276 31.9415193,43.2709835 32.0207876,44.0207876 Z M42.9854764,44.0207876 C42.9418746,43.6304157 42.7397623,42.718017 42.2914818,43.1129815 C42.2542387,42.8573262 42.1602224,42.417201 42.0207876,42.1316937 C42.8215156,41.5285307 43.1326323,43.5607611 42.9854764,44.0207876 Z M37.845,39.199 L37.8216628,39.3261792 C37.8046621,39.4198894 37.7879272,39.5156976 37.7714768,39.6132473 L37.726,39.885 L37.6900426,39.896702 C37.2157508,40.0280676 36.6145147,40.0981668 36.0346111,39.8609743 C34.8604043,39.3803677 34.3718715,39.7734852 34.0207876,40.0207876 C34.6247776,38.9423391 36.2042623,39.3290408 36.7941147,39.3879501 C37.1870426,39.4274107 37.5328424,39.3516541 37.7864858,39.2306254 L37.845,39.199 Z M37.983,38.542 L38.0124721,38.5488893 C38.3730316,38.6504482 38.2552389,38.9716589 37.8675586,39.1887017 L37.845,39.199 L37.8734441,39.0516996 C37.908472,38.8733848 37.944489,38.7048888 37.9813465,38.5490645 L37.983,38.542 Z M18.0207876,37.5894031 C16.7543593,37.7706034 16.6019737,38.5957702 16.6914818,38.9608834 C15.8237712,39.1637844 14.8377029,38.8051813 14.1689814,38.5708144 C12.8914571,38.1248663 12.4520538,38.6001103 12.0207876,38.7948735 C12.6273713,37.9789295 13.9478003,37.944751 14.6475907,38.3201721 C15.1417345,38.5854624 16.4066833,38.7286866 16.4325741,38.1340891 C16.4532867,37.6528774 15.5604252,37.8959246 14.9797323,37.9686217 C14.2399961,38.0603069 13.6785364,37.2866792 13.8131683,37.0354943 C14.1874748,37.6252091 15.0707198,37.9778445 15.7409208,37.4602843 C16.7565785,36.6763487 17.9053888,37.0816082 18.0207876,37.5894031 Z M48.0207876,36.0207876 C45.963112,39.1546719 44.2762083,37.1662422 43.0207876,39.0207876 C43.0207876,38.0793473 44.1829732,37.1563248 44.9172895,36.7397959 C46.1727102,36.8559706 46.7169426,36.6427475 48.0207876,36.0207876 Z M34.5588021,38.0207876 C34.7135303,38.3404143 35.690596,38.8962615 36.562415,38.4389854 C36.928478,38.2470094 37.521428,38.0685317 38.102971,38.0343344 L38.123,38.033 L38.0942919,38.1224599 C38.075097,38.1862738 38.056075,38.2539689 38.0372446,38.3251885 L37.983,38.542 L37.9339204,38.5316022 C37.8488671,38.5174356 37.7441239,38.5129186 37.6180229,38.5206418 C37.3156353,38.5387229 36.8687298,38.8262703 35.8649598,38.8641822 C35.3363704,38.8840131 34.5061788,38.4920621 34.5588021,38.0207876 Z M56.0207876,29.1728641 C55.472334,29.0834909 54.7561828,28.8902514 54.2592756,29.3218195 C53.925255,29.7678806 54.8475918,31.4812705 53.6414062,32.4128458 C51.7066983,33.9080362 48.243468,35.3162687 46.0207876,36.0207876 C47.154121,34.7486278 47.9513718,32.4265336 48.0496536,31.8427894 C50.4778323,32.1914256 53.1369388,32.0303927 52.9066983,28.1221245 C54.2056674,27.7557747 55.2235368,28.4466058 56.0207876,29.1728641 Z M26.0207876,27.0207876 C28.7682733,28.1006377 32.984891,29.905387 35.0207876,33.0207876 C33.9262495,29.4146218 28.6624401,27.5190518 26.0207876,27.0207876 Z M25.0207876,22.0207876 C27.7626666,23.6414629 36.1470438,27.6954021 38.0207876,31.0207876 C36.7630171,27.4417964 28.1826829,23.1552603 25.0207876,22.0207876 Z M25.0207876,19.0207876 C29.9492472,23.7711057 37.8248564,28.2084828 39.0207876,31.0207876 C39.0443665,28.4395456 31.4507888,24.0410259 25.0207876,19.0207876 Z M52.0207876,27.2817205 C52.7693453,26.8681366 54.3407396,26.9238113 55.0207876,27.6102628 C54.4352107,27.4053062 53.6051626,27.448133 53.4162203,27.5264447 C53.433528,27.5760014 53.4371338,27.8403035 53.424153,27.9755137 C53.039778,27.9755137 52.7599703,27.9657247 52.4404992,28.0207876 C52.4029992,27.9180035 52.167903,27.4646518 52.0207876,27.2817205 Z M48.0207876,15.0207876 C46.278453,16.649171 44.3521499,17.613326 42.4151153,18.0207876 C41.821817,17.864972 41.2338844,17.4253231 41.0207876,17.2358571 C43.8117425,16.9520239 46.0454263,16.1641673 48.0207876,15.0207876 Z M37.4969948,16.0780193 C37.7510028,16.1818616 37.8863448,16.4144004 37.9584886,16.6760944 L37.981,16.771 L37.8983885,16.7311794 C37.6399125,16.6030626 37.3254841,16.4147967 37.0955681,16.2127508 L37.034,16.155 C37.0800904,16.035461 37.2224769,15.9653411 37.4969948,16.0780193 Z").attr({
                    id: 'outline',
                    fill: o.colors[0],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'flowerpath').transform(xfs);
                var rsrGroups = [layer1];
                layer1.push(outlinepath);
                layer1.push(flowerpath);
            }        	
        } else if (o.theme == "soccer") {
            if (o.item == "teamicon") { //This is the ball.
                var canvaswidth = 800;
                //var canvaswidth = 165;
                var canvasheight = 800;
                //var canvasheight = 165;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Helmet and Mask
                //var helmetpath = canvi[canvi.length - 1].canvas.path("M205.479,296.037c0.293-2.743,7.647-67.646,48.627-101.175c40.122-32.828,96.714-33.117,116.034-33.119c-0.669-6.615-2.412-18.07-6.843-36.658c-3.146-11.383-8.521-25.143-17.737-38.934c-19.867-29.729-61.921-65.165-149.437-65.165c-116.012,0-172.907,80.744-183.473,146.767c-9.242,57.748,17.122,154.365,18.249,158.45c1.389,5.028,6.498,8.075,11.59,6.934c12.587-2.891,49.028-4.832,72.67,14.869c11.538,9.616,42.121,31.981,76.794,31.984c0.002,0,0.002,0,0.004,0c37.475,0,58.361-26.257,65.551-36.52c0,0,3.453-4.749,9.149-12.671c-17.911-2.816-32.855-5.597-47.365-11.209C210.057,316.021,204.376,306.335,205.479,296.037z M159,305.5c-17.949,0-32.5-14.551-32.5-32.5s14.551-32.5,32.5-32.5s32.5,14.551,32.5,32.5S176.949,305.5,159,305.5z").attr({ id: 'helmetpath', parent: 'layer1', fill: o.colors[0], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'helmetpath').transform(xfs);
                //var maskpath = canvi[canvi.length - 1].canvas.path("M410.345,304.583c-36.028,0-65.434-2.3-89.17-4.194l0.671-94.849c14.657-3.257,31.692-4.864,51.264-4.864c19.731,0,19.731-29.926,0-29.926c-17.286,0-74.795-0.717-113.938,31.31c-38.438,31.45-45.459,93.221-45.738,95.834c-0.689,6.438,2.705,12.906,8.745,15.241c19.488,7.537,40.822,9.87,68.881,14.363c1.607,7.174-12.166,62.969,39.741,74.002c16.323,3.47,35.392,1.799,51.793-9.099c32.705-21.727,42.066-68.048,42.449-70.052C426.534,314.53,420.41,304.583,410.345,304.583z M291.846,297.382c-6.914-0.854-33.346-4.626-46.589-8.231c5.892-27.762,18.339-58.028,46.589-72.979V297.382z M365.962,367.525c-8.361,5.527-17.828,7.066-28.938,4.705c-9.98-2.121-16.17-6.99-16.181-24.675l0.121-17.166c19.527,1.511,42.478,2.61,69.287,2.981 C385.431,345.561,377.493,359.902,365.962,367.525z").attr({ id: 'maskpath', parent: 'layer1', fill: o.colors[1], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'maskpath').transform(xfs);
                //var rsr = Raphael('rsr', '612', '792');
                var treadpath = canvi[canvi.length - 1].canvas.path("M742.7,358.3c0-0.2,0-0.3,0-0.5c-0.3-4.2-0.7-8.3-1.1-12.5c0-0.2,0-0.3-0.1-0.5c-0.4-4.2-1-8.3-1.6-12.4c0-0.1,0-0.1,0-0.2c-0.3-2-0.6-4-0.9-6c0-0.1,0-0.3-0.1-0.4c-0.7-4.1-1.4-8.1-2.2-12.1c0-0.2-0.1-0.4-0.1-0.6c-0.8-4-1.7-8-2.6-11.9c0-0.1-0.1-0.3-0.1-0.4c-0.4-1.9-0.9-3.7-1.4-5.6c0-0.1-0.1-0.3-0.1-0.4c-1-3.9-2-7.8-3.2-11.6c-0.1-0.2-0.1-0.5-0.2-0.7c-1.1-3.8-2.3-7.6-3.5-11.4c-0.1-0.2-0.1-0.4-0.2-0.6c-0.6-1.8-1.2-3.5-1.8-5.3c0-0.1-0.1-0.3-0.1-0.4c-0.7-1.9-1.3-3.8-2-5.7c0-0.1,0-0.1-0.1-0.2c-0.7-1.8-1.3-3.5-2-5.3c-0.1-0.3-0.2-0.5-0.3-0.8c-1.4-3.6-2.9-7.2-4.4-10.8c-0.1-0.3-0.2-0.5-0.3-0.8c-0.7-1.7-1.4-3.3-2.2-5c-0.1-0.1-0.1-0.2-0.2-0.4c-0.8-1.8-1.6-3.6-2.5-5.4c-0.1-0.2-0.2-0.3-0.2-0.5c-0.7-1.6-1.5-3.2-2.3-4.7c-0.1-0.3-0.3-0.5-0.4-0.8c-1.7-3.4-3.4-6.9-5.2-10.2c-0.2-0.3-0.3-0.6-0.5-0.9c-0.9-1.6-1.7-3.2-2.6-4.8c0-0.1-0.1-0.2-0.1-0.2c-0.9-1.7-1.9-3.4-2.9-5.1c-0.1-0.2-0.3-0.5-0.4-0.7c-0.8-1.5-1.7-2.9-2.6-4.3c-0.2-0.3-0.3-0.5-0.5-0.8c-1-1.7-2-3.3-3-4.9c0,0,0,0,0-0.1c-1-1.6-2-3.1-3-4.7c-0.2-0.3-0.4-0.6-0.6-0.9c-1-1.6-2-3.1-3.1-4.7c0,0,0,0,0,0l0,0c-47-69.7-117.7-122.2-200.6-145.7l0,0c0,0,0,0,0,0c-1.8-0.5-3.6-1-5.5-1.5c-0.4-0.1-0.8-0.2-1.2-0.3c-1.5-0.4-3-0.8-4.5-1.2c-0.4-0.1-0.8-0.2-1.1-0.3c-1.8-0.5-3.7-0.9-5.5-1.3c-0.1,0-0.2-0.1-0.4-0.1c-1.7-0.4-3.4-0.8-5.1-1.1c-0.4-0.1-0.9-0.2-1.3-0.3c-1.6-0.3-3.2-0.7-4.8-1c-0.3-0.1-0.5-0.1-0.8-0.2c-1.9-0.4-3.7-0.7-5.6-1c-0.4-0.1-0.7-0.1-1.1-0.2c-1.5-0.3-3.1-0.5-4.6-0.8c-0.5-0.1-0.9-0.1-1.4-0.2c-3.7-0.6-7.5-1.1-11.2-1.6c-0.5-0.1-1-0.1-1.4-0.2c-1.5-0.2-3-0.3-4.5-0.5c-0.4,0-0.9-0.1-1.3-0.1c-1.9-0.2-3.8-0.4-5.7-0.5c-0.3,0-0.6,0-0.8-0.1c-1.6-0.1-3.2-0.3-4.9-0.4c-0.5,0-1.1-0.1-1.6-0.1c-1.6-0.1-3.2-0.2-4.7-0.3c-0.3,0-0.7,0-1-0.1c-1.9-0.1-3.8-0.2-5.7-0.2c-0.5,0-0.9,0-1.4,0c-1.5,0-3-0.1-4.5-0.1c-0.5,0-1.1,0-1.6,0c-1.9,0-3.8-0.1-5.8-0.1h0c0,0,0,0,0,0c-1.9,0-3.8,0-5.8,0.1c-0.5,0-1.1,0-1.6,0c-1.5,0-3,0.1-4.5,0.1c-0.5,0-1,0-1.4,0c-1.9,0.1-3.8,0.2-5.7,0.2c-0.3,0-0.7,0-1,0.1c-1.6,0.1-3.2,0.2-4.7,0.3c-0.5,0-1.1,0.1-1.6,0.1c-1.6,0.1-3.2,0.2-4.9,0.4c-0.3,0-0.6,0-0.8,0.1c-1.9,0.2-3.8,0.3-5.7,0.5c-0.4,0-0.9,0.1-1.3,0.1c-1.5,0.2-3,0.3-4.5,0.5c-0.5,0.1-1,0.1-1.4,0.2c-3.8,0.5-7.5,1-11.2,1.6c-0.5,0.1-0.9,0.1-1.4,0.2c-1.5,0.2-3.1,0.5-4.6,0.8c-0.4,0.1-0.7,0.1-1.1,0.2c-1.9,0.3-3.7,0.7-5.6,1c-0.3,0.1-0.5,0.1-0.8,0.2c-1.6,0.3-3.2,0.6-4.8,1c-0.4,0.1-0.9,0.2-1.3,0.3c-1.7,0.4-3.4,0.7-5.1,1.1c-0.1,0-0.2,0.1-0.3,0.1c-1.9,0.4-3.7,0.9-5.5,1.3c-0.4,0.1-0.7,0.2-1.1,0.3c-1.5,0.4-3,0.8-4.5,1.2c-0.4,0.1-0.8,0.2-1.2,0.3c-1.8,0.5-3.7,1-5.5,1.5c0,0,0,0,0,0c-82.9,23.6-153.5,76-200.6,145.7l0,0c0,0,0,0,0,0c-1,1.5-2,3.1-3.1,4.6c-0.2,0.3-0.4,0.6-0.6,0.9c-1,1.5-2,3.1-3,4.6c0,0,0,0.1-0.1,0.1c-1,1.6-2,3.3-3,4.9c-0.2,0.3-0.3,0.5-0.5,0.8c-0.9,1.4-1.7,2.9-2.5,4.3c-0.1,0.2-0.3,0.5-0.4,0.7c-1,1.7-1.9,3.3-2.9,5c-0.1,0.1-0.1,0.2-0.2,0.3c-0.9,1.6-1.7,3.1-2.6,4.7c-0.2,0.3-0.3,0.6-0.5,0.9c-1.8,3.4-3.5,6.8-5.2,10.2c-0.1,0.3-0.3,0.5-0.4,0.8c-0.8,1.6-1.5,3.1-2.3,4.7c-0.1,0.2-0.2,0.4-0.2,0.5c-0.8,1.8-1.7,3.6-2.5,5.4c-0.1,0.1-0.1,0.3-0.2,0.4c-0.7,1.6-1.5,3.3-2.2,4.9c-0.1,0.3-0.2,0.5-0.4,0.8c-1.5,3.6-3,7.2-4.4,10.8c-0.1,0.3-0.2,0.5-0.3,0.8c-0.7,1.7-1.3,3.5-2,5.2c0,0.1-0.1,0.1-0.1,0.2c-0.7,1.9-1.4,3.8-2,5.7c-0.1,0.1-0.1,0.3-0.2,0.4c-0.6,1.7-1.2,3.5-1.8,5.2c-0.1,0.2-0.1,0.4-0.2,0.7c-1.2,3.8-2.4,7.5-3.5,11.4c-0.1,0.2-0.1,0.5-0.2,0.7c-1.1,3.8-2.2,7.7-3.2,11.6c0,0.1-0.1,0.3-0.1,0.4c-0.5,1.8-0.9,3.7-1.4,5.5c0,0.2-0.1,0.3-0.1,0.5c-0.9,3.9-1.8,7.9-2.6,11.9c0,0.2-0.1,0.4-0.1,0.6c-0.8,4-1.5,8-2.2,12.1c0,0.2,0,0.3-0.1,0.5c-0.3,2-0.6,3.9-0.9,5.9c0,0.1,0,0.1,0,0.2c-0.6,4.1-1.1,8.2-1.6,12.4c0,0.2,0,0.4-0.1,0.6c-0.4,4.1-0.8,8.3-1.1,12.4c0,0.2,0,0.3,0,0.5c-0.3,4.2-0.5,8.5-0.7,12.7c0,0,0,0,0,0l0,0c-0.2,4.3-0.2,8.6-0.2,13c0,84,28.7,161.3,76.8,222.6v0c0,0,0,0,0,0c1.2,1.5,2.4,3,3.6,4.5c0.2,0.3,0.4,0.5,0.7,0.8c1.1,1.3,2.2,2.6,3.3,4c0.1,0.2,0.3,0.4,0.4,0.5c1.2,1.5,2.5,2.9,3.8,4.4c0.2,0.2,0.4,0.4,0.5,0.6c1.1,1.3,2.2,2.5,3.4,3.8c0.2,0.2,0.4,0.5,0.7,0.7c1.3,1.4,2.6,2.9,3.9,4.3c0.1,0.1,0.2,0.2,0.2,0.3c1.2,1.3,2.5,2.6,3.7,3.9c0.3,0.3,0.5,0.5,0.8,0.8c2.7,2.7,5.4,5.4,8.1,8.1c0.3,0.3,0.5,0.5,0.8,0.8c1.3,1.2,2.6,2.5,3.9,3.7c0.1,0.1,0.2,0.2,0.3,0.3c1.4,1.3,2.8,2.6,4.2,3.9c0.3,0.2,0.5,0.5,0.8,0.7c1.2,1.1,2.5,2.2,3.7,3.3c0.2,0.2,0.4,0.4,0.7,0.6c1.4,1.3,2.9,2.5,4.4,3.7c0.2,0.2,0.4,0.3,0.6,0.5c1.3,1.1,2.6,2.1,3.8,3.2c0.3,0.2,0.6,0.5,0.9,0.7c1.5,1.2,3,2.4,4.5,3.6c0.1,0.1,0.2,0.1,0.3,0.2c1.4,1.1,2.8,2.2,4.2,3.3c0.3,0.2,0.7,0.5,1,0.7c3,2.3,6.1,4.5,9.2,6.7c0.3,0.2,0.7,0.5,1,0.7c1.4,1,2.8,1.9,4.2,2.9c0.2,0.1,0.4,0.3,0.6,0.4c1.6,1.1,3.2,2.1,4.7,3.2c0.3,0.2,0.6,0.4,0.9,0.6c1.4,0.9,2.7,1.7,4.1,2.6c0.3,0.2,0.6,0.4,0.9,0.6c1.6,1,3.2,2,4.8,3c0.2,0.1,0.5,0.3,0.7,0.4c1.4,0.8,2.8,1.7,4.2,2.5c0.4,0.2,0.7,0.4,1.1,0.6c1.6,1,3.3,1.9,5,2.8c0.1,0,0.2,0.1,0.2,0.1c1.6,0.9,3.2,1.7,4.8,2.6c0.4,0.2,0.8,0.4,1.2,0.6c1.6,0.9,3.2,1.7,4.8,2.5c0.1,0,0.1,0.1,0.2,0.1c1.7,0.9,3.4,1.7,5.1,2.6c0.4,0.2,0.8,0.4,1.2,0.6c1.5,0.7,3,1.4,4.4,2.1c0.3,0.1,0.5,0.3,0.8,0.4c1.7,0.8,3.4,1.6,5.2,2.4c0.3,0.2,0.7,0.3,1,0.5c1.5,0.7,2.9,1.3,4.4,1.9c0.4,0.2,0.7,0.3,1.1,0.5c1.7,0.7,3.5,1.5,5.3,2.2c0.2,0.1,0.5,0.2,0.7,0.3c1.5,0.6,3.1,1.2,4.7,1.8c0.4,0.2,0.8,0.3,1.2,0.5c1.8,0.7,3.6,1.4,5.4,2c0,0,0,0,0,0h0c38.7,14.1,80.4,21.9,124,21.9c43.6,0,85.3-7.7,124-21.9l0,0c0,0,0,0,0,0c1.8-0.7,3.6-1.3,5.4-2c0.4-0.2,0.8-0.3,1.3-0.5c1.5-0.6,3.1-1.2,4.6-1.8c0.3-0.1,0.5-0.2,0.8-0.3c1.8-0.7,3.5-1.4,5.3-2.2c0.4-0.2,0.8-0.3,1.1-0.5c1.5-0.6,2.9-1.3,4.4-1.9c0.4-0.2,0.7-0.3,1.1-0.5c1.7-0.8,3.4-1.6,5.2-2.4c0.3-0.1,0.6-0.3,0.8-0.4c1.5-0.7,2.9-1.4,4.4-2.1c0.4-0.2,0.8-0.4,1.2-0.6c1.7-0.8,3.4-1.7,5.1-2.6c0.1,0,0.2-0.1,0.2-0.1c1.6-0.8,3.2-1.7,4.8-2.5c0.4-0.2,0.8-0.4,1.2-0.6c1.6-0.8,3.1-1.7,4.7-2.6c0.1-0.1,0.2-0.1,0.3-0.2c1.7-0.9,3.3-1.9,4.9-2.8c0.4-0.2,0.8-0.4,1.1-0.7c1.4-0.8,2.8-1.6,4.2-2.5c0.3-0.2,0.5-0.3,0.8-0.5c1.6-1,3.2-2,4.8-3c0.3-0.2,0.6-0.4,0.9-0.6c1.3-0.8,2.7-1.7,4-2.6c0.3-0.2,0.7-0.4,1-0.6c1.6-1,3.1-2.1,4.7-3.1c0.2-0.1,0.4-0.3,0.6-0.4c1.4-0.9,2.7-1.9,4.1-2.8c0.3-0.2,0.7-0.5,1-0.7c3.1-2.2,6.1-4.4,9.2-6.7c0.3-0.3,0.7-0.5,1-0.8c1.4-1.1,2.8-2.1,4.2-3.2c0.1-0.1,0.2-0.2,0.3-0.2c1.5-1.2,3-2.4,4.5-3.6c0.3-0.2,0.6-0.5,0.9-0.7c1.3-1,2.5-2.1,3.8-3.1c0.2-0.2,0.4-0.4,0.7-0.6c1.5-1.2,2.9-2.5,4.3-3.7c0.2-0.2,0.5-0.4,0.7-0.6c1.2-1.1,2.5-2.2,3.7-3.3c0.3-0.2,0.5-0.5,0.8-0.7c1.4-1.3,2.8-2.6,4.2-3.9c0.1-0.1,0.2-0.2,0.3-0.3c1.3-1.2,2.6-2.4,3.8-3.6c0.3-0.3,0.6-0.5,0.8-0.8c2.7-2.7,5.4-5.3,8.1-8.1c0.3-0.3,0.5-0.5,0.8-0.8c1.2-1.3,2.5-2.6,3.7-3.9c0.1-0.1,0.2-0.2,0.3-0.3c1.3-1.4,2.6-2.8,3.9-4.3c0.2-0.2,0.4-0.5,0.7-0.7c1.1-1.3,2.2-2.5,3.4-3.8c0.2-0.2,0.4-0.4,0.5-0.6c1.3-1.5,2.5-2.9,3.8-4.4c0.1-0.2,0.3-0.3,0.4-0.5c1.1-1.3,2.2-2.6,3.3-4c0.2-0.3,0.4-0.5,0.6-0.8c1.2-1.5,2.4-3,3.6-4.6c0,0,0,0,0,0v0c48.1-61.3,76.8-138.6,76.8-222.6C743.6,375.3,743.3,366.8,742.7,358.3z").attr({
                    id: 'treadpath',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': o.colors[0]
                }).data('id', 'treadpath').transform(xfs);
                //var mypath = "m 115.99867,80.488741 -97.500001,0 c -0.2,-2 0.2,-4 0.6,-6.1 0.2,-1.2 0.5,-2.4 0.6,-3.7 0.5,-1.5 1,-3.1 1.5,-4.7 2.2,-7.4 4.5,-15 11.8,-18.4 l 0.1,-0.1 c 3.9,-2.5 8.9,-3.8 14.7,-3.8 5.8,0 11.8,1.4 16.4,3.9 l 15.5,7.6 c 2.4,1.4 4.8,2.9 7.1,4.4 8.7,5.6 17.700001,11.3 28.600001,12.8 0.2,1.1 0.4,3.4 0.6,8.1 z m -28.900001,-29.4 c 2.2,1.3 4.4,2.7 6.5,4.1 6.400001,4.2 12.900001,8.5 20.500001,9.1 -2.4,-9.2 -7.2,-18.4 -14.8,-28.1 -5.300001,-5.5 -11.200001,-9.7 -17.500001,-12.6 -2.9,-1.2 -6,-1.9 -9.2,-1.9 -9.1,0 -18.1,5.1 -26.1,9.6 l -1.9,1.1 c -1.9,1.3 -4.2,3 -5.8,4.8 2.8,-0.6 5.8,-0.9 8.7,-0.9 14.5,0.1 28.2,7.6 39.6,14.8 z m 35.400001,13.8 c 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0.1,0 0.1,0 0.5,0 1.2,-0.2 1.9,-0.5 0.6,-0.2 1.2,-0.4 1.9,-0.5 4.6,-1.4 7.4,-6.2 7.9,-10.2 l 0.1,-0.4 c 1,-2.6 -0.3,-4.4 -2.1,-6.7 -0.7,-1 -1.5,-1.9 -2,-3 -11.3,-12 -23.3,-19.1 -35.600001,-21.1 14.300001,10.1 24.600001,25.7 27.800001,42.4 z M 51.898669,122.98874 c 12.6,-2.1 23.7,-8.7 34.4,-15.1 7.4,-4.5 15.100001,-9.099999 23.400001,-12.199999 2.3,-1 3.7,-1.4 5.1,-1.7 0.2,0 0.3,-0.1 0.5,-0.1 0.3,-1.6 0.5,-3.8 0.6,-6 l -97.300001,0 c 0,0.1 -0.1,0.6 0.1,1.9 0,0.2 0,0.3 0.1,0.4 0.2,0.9 0.4,1.8 0.7,2.7 l 0.1,0.2 c 1.9,7.699999 3.5,14.399999 7.8,21.899999 6.1,5.3 13.4,8.2 20.5,8.2 1.3,0.2 2.6,0.1 4,-0.2 z m 72.800001,-42.499999 19,0 c -0.2,-6.8 -0.9,-14.2 -3.7,-19.9 -3.9,7 -9.5,9.4 -16,11.8 0.3,2.1 0.6,5.2 0.7,8.1 z m -0.3,7.3 c -0.1,1 -0.2,2 -0.2,2.9 -0.1,1.2 -0.2,2.4 -0.3,3.7 1.2,0.3 2.3,0.7 3.7,1.4 5.6,2 9.9,5.499999 12.4,10.199999 2.5,-5.7 3.5,-12.099999 4.1,-18.199999 l -19.7,0 z m 0.9,14.999999 c -0.2,-0.1 -0.5,-0.1 -0.8,-0.2 -0.7,-0.2 -1.3,-0.4 -1.8,-0.4 0,0 -0.1,0 -0.1,0 -3,14.4 -10.9,27.5 -24.3,39.9 l -0.1,0.1 c -1.3,1 -2.800001,1.9 -4.200001,2.6 0,0 -0.1,0 -0.1,0.1 1,-0.1 2.1,-0.2 3.100001,-0.4 14.7,-3.5 29.4,-14 37.4,-26.8 0.6,-6 -2,-13.2 -9.1,-14.9 z m -10.9,-0.7 c -3.8,0.7 -8.1,2.3 -12.3,4.5 -3,1.8 -6.200001,3.9 -9.300001,5.9 -13.9,9 -28.2,18.3 -45,18.3 -3,0 -6,-0.3 -9,-0.9 6.7,6.7 15.2,10.5 22.8,13.3 l 0.1,0 c 3.2,1.5 6.9,2.3 10.7,2.3 6.1,0 12,-2 16.1,-5.5 l 0.1,-0.1 c 15.400001,-10.1 23.600001,-29.9 25.800001,-37.8 z";
                var outlinepath = [];
                outlinepath[0] = canvi[canvi.length - 1].canvas.path("M630.6,165.3l38.9,12.8c-11.2-15.5-23.6-30.2-37.3-44c-32.4-32.4-70.2-57.9-112.2-75.7c-10-4.2-20.2-8-30.5-11.3l24.2,33.1L630.6,165.3z").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[1] = canvi[canvi.length - 1].canvas.path("M620.5,302.2 626.5,167.2 513,84.8 386.5,132.2 386.5,242.2 514.4,335.1").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[2] = canvi[canvi.length - 1].canvas.path("M138.5,167.2 144.5,302.2 250.6,335.1 378.5,242.2 378.5,132.2 252,84.8").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[3] = canvi[canvi.length - 1].canvas.path("M251.4,80.3l24.2-33.1c-10.3,3.3-20.5,7-30.5,11.3c-42,17.8-79.8,43.2-112.2,75.7c-13.7,13.7-26.2,28.4-37.3,44l38.9-12.8L251.4,80.3z").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[4] = canvi[canvi.length - 1].canvas.path("M98,552.2L53.4,414.7l0,0l-23.9-33.2c0,0.7,0,1.5,0,2.2c0,47.7,9.3,93.9,27.7,137.4c10.9,25.7,24.6,49.7,41,72L98,552.2L98,552.2z").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[5] = canvi[canvi.length - 1].canvas.path("M248.2,342.7 142.1,309.8 57.9,415.5 101.2,548.9 231.4,584.9 297,493").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[6] = canvi[canvi.length - 1].canvas.path("M310.2,706.3l-39.1,12.6c35.8,11.9,73.1,17.9,111.4,17.9c38.3,0,75.6-6,111.4-17.9l-39.1-12.6H310.2z").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[7] = canvi[canvi.length - 1].canvas.path("M303.5,497.7 237.9,589.6 312.4,702.3 452.6,702.3 527.1,589.6 461.5,497.7").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[8] = canvi[canvi.length - 1].canvas.path("M622.9,309.8 516.8,342.7 468,493 533.6,584.9 663.8,548.9 707.1,415.5").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                outlinepath[9] = canvi[canvi.length - 1].canvas.path("M735.5,381.6l-23.9,33.2L667,552.2l-0.1,41c16.4-22.2,30.1-46.3,41-72c18.4-43.5,27.7-89.8,27.7-137.4C735.6,383,735.5,382.3,735.5,381.6z").attr({
                    id: 'outline',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                var rsrGroups = [layer1];
                layer1.push(treadpath);
                for (var i = 0; i < 10; i++) {
                    layer1.push(outlinepath[i]);
                }

            }
        } else if (o.theme == "basketball") {
            if (o.item == "teamicon") { //This is the ball.
                //var canvaswidth = 400;
                var canvaswidth = 165;
                //var canvasheight = 320;
                var canvasheight = 165;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Helmet and Mask
                //var helmetpath = canvi[canvi.length - 1].canvas.path("M205.479,296.037c0.293-2.743,7.647-67.646,48.627-101.175c40.122-32.828,96.714-33.117,116.034-33.119c-0.669-6.615-2.412-18.07-6.843-36.658c-3.146-11.383-8.521-25.143-17.737-38.934c-19.867-29.729-61.921-65.165-149.437-65.165c-116.012,0-172.907,80.744-183.473,146.767c-9.242,57.748,17.122,154.365,18.249,158.45c1.389,5.028,6.498,8.075,11.59,6.934c12.587-2.891,49.028-4.832,72.67,14.869c11.538,9.616,42.121,31.981,76.794,31.984c0.002,0,0.002,0,0.004,0c37.475,0,58.361-26.257,65.551-36.52c0,0,3.453-4.749,9.149-12.671c-17.911-2.816-32.855-5.597-47.365-11.209C210.057,316.021,204.376,306.335,205.479,296.037z M159,305.5c-17.949,0-32.5-14.551-32.5-32.5s14.551-32.5,32.5-32.5s32.5,14.551,32.5,32.5S176.949,305.5,159,305.5z").attr({ id: 'helmetpath', parent: 'layer1', fill: o.colors[0], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'helmetpath').transform(xfs);
                //var maskpath = canvi[canvi.length - 1].canvas.path("M410.345,304.583c-36.028,0-65.434-2.3-89.17-4.194l0.671-94.849c14.657-3.257,31.692-4.864,51.264-4.864c19.731,0,19.731-29.926,0-29.926c-17.286,0-74.795-0.717-113.938,31.31c-38.438,31.45-45.459,93.221-45.738,95.834c-0.689,6.438,2.705,12.906,8.745,15.241c19.488,7.537,40.822,9.87,68.881,14.363c1.607,7.174-12.166,62.969,39.741,74.002c16.323,3.47,35.392,1.799,51.793-9.099c32.705-21.727,42.066-68.048,42.449-70.052C426.534,314.53,420.41,304.583,410.345,304.583z M291.846,297.382c-6.914-0.854-33.346-4.626-46.589-8.231c5.892-27.762,18.339-58.028,46.589-72.979V297.382z M365.962,367.525c-8.361,5.527-17.828,7.066-28.938,4.705c-9.98-2.121-16.17-6.99-16.181-24.675l0.121-17.166c19.527,1.511,42.478,2.61,69.287,2.981 C385.431,345.561,377.493,359.902,365.962,367.525z").attr({ id: 'maskpath', parent: 'layer1', fill: o.colors[1], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'maskpath').transform(xfs);
                //var rsr = Raphael('rsr', '612', '792');
                var treadpath = canvi[canvi.length - 1].canvas.path("m 85.298669,4.1887412 c -43.9,0 -79.4000004,35.5999998 -79.4000004,79.3999998 0,43.899999 35.6000004,79.399999 79.4000004,79.399999 43.900001,0 79.400001,-35.6 79.400001,-79.399999 0,-43.9 -35.5,-79.3999998 -79.400001,-79.3999998 z m 0,149.6999988 c -39,0 -70.6,-31.5 -70.6,-70.299999 0,-38.8 31.7,-70.3 70.6,-70.3 39.000001,0 70.600001,31.5 70.600001,70.3 0.1,38.699999 -31.6,70.299999 -70.600001,70.299999 z").attr({
                    id: 'treadpath',
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': o.colors[1]
                }).data('id', 'treadpath').transform(xfs);
                var mypath = "m 115.99867,80.488741 -97.500001,0 c -0.2,-2 0.2,-4 0.6,-6.1 0.2,-1.2 0.5,-2.4 0.6,-3.7 0.5,-1.5 1,-3.1 1.5,-4.7 2.2,-7.4 4.5,-15 11.8,-18.4 l 0.1,-0.1 c 3.9,-2.5 8.9,-3.8 14.7,-3.8 5.8,0 11.8,1.4 16.4,3.9 l 15.5,7.6 c 2.4,1.4 4.8,2.9 7.1,4.4 8.7,5.6 17.700001,11.3 28.600001,12.8 0.2,1.1 0.4,3.4 0.6,8.1 z m -28.900001,-29.4 c 2.2,1.3 4.4,2.7 6.5,4.1 6.400001,4.2 12.900001,8.5 20.500001,9.1 -2.4,-9.2 -7.2,-18.4 -14.8,-28.1 -5.300001,-5.5 -11.200001,-9.7 -17.500001,-12.6 -2.9,-1.2 -6,-1.9 -9.2,-1.9 -9.1,0 -18.1,5.1 -26.1,9.6 l -1.9,1.1 c -1.9,1.3 -4.2,3 -5.8,4.8 2.8,-0.6 5.8,-0.9 8.7,-0.9 14.5,0.1 28.2,7.6 39.6,14.8 z m 35.400001,13.8 c 0,0 0,0 0,0 0,0 0,0 0,0 0,0 0.1,0 0.1,0 0.5,0 1.2,-0.2 1.9,-0.5 0.6,-0.2 1.2,-0.4 1.9,-0.5 4.6,-1.4 7.4,-6.2 7.9,-10.2 l 0.1,-0.4 c 1,-2.6 -0.3,-4.4 -2.1,-6.7 -0.7,-1 -1.5,-1.9 -2,-3 -11.3,-12 -23.3,-19.1 -35.600001,-21.1 14.300001,10.1 24.600001,25.7 27.800001,42.4 z M 51.898669,122.98874 c 12.6,-2.1 23.7,-8.7 34.4,-15.1 7.4,-4.5 15.100001,-9.099999 23.400001,-12.199999 2.3,-1 3.7,-1.4 5.1,-1.7 0.2,0 0.3,-0.1 0.5,-0.1 0.3,-1.6 0.5,-3.8 0.6,-6 l -97.300001,0 c 0,0.1 -0.1,0.6 0.1,1.9 0,0.2 0,0.3 0.1,0.4 0.2,0.9 0.4,1.8 0.7,2.7 l 0.1,0.2 c 1.9,7.699999 3.5,14.399999 7.8,21.899999 6.1,5.3 13.4,8.2 20.5,8.2 1.3,0.2 2.6,0.1 4,-0.2 z m 72.800001,-42.499999 19,0 c -0.2,-6.8 -0.9,-14.2 -3.7,-19.9 -3.9,7 -9.5,9.4 -16,11.8 0.3,2.1 0.6,5.2 0.7,8.1 z m -0.3,7.3 c -0.1,1 -0.2,2 -0.2,2.9 -0.1,1.2 -0.2,2.4 -0.3,3.7 1.2,0.3 2.3,0.7 3.7,1.4 5.6,2 9.9,5.499999 12.4,10.199999 2.5,-5.7 3.5,-12.099999 4.1,-18.199999 l -19.7,0 z m 0.9,14.999999 c -0.2,-0.1 -0.5,-0.1 -0.8,-0.2 -0.7,-0.2 -1.3,-0.4 -1.8,-0.4 0,0 -0.1,0 -0.1,0 -3,14.4 -10.9,27.5 -24.3,39.9 l -0.1,0.1 c -1.3,1 -2.800001,1.9 -4.200001,2.6 0,0 -0.1,0 -0.1,0.1 1,-0.1 2.1,-0.2 3.100001,-0.4 14.7,-3.5 29.4,-14 37.4,-26.8 0.6,-6 -2,-13.2 -9.1,-14.9 z m -10.9,-0.7 c -3.8,0.7 -8.1,2.3 -12.3,4.5 -3,1.8 -6.200001,3.9 -9.300001,5.9 -13.9,9 -28.2,18.3 -45,18.3 -3,0 -6,-0.3 -9,-0.9 6.7,6.7 15.2,10.5 22.8,13.3 l 0.1,0 c 3.2,1.5 6.9,2.3 10.7,2.3 6.1,0 12,-2 16.1,-5.5 l 0.1,-0.1 c 15.400001,-10.1 23.600001,-29.9 25.800001,-37.8 z";
                var outlinepath = canvi[canvi.length - 1].canvas.path(mypath).attr({
                    id: 'outline',
                    fill: o.colors[0],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'outlinepath').transform(xfs);
                var rsrGroups = [layer1];
                layer1.push(treadpath, outlinepath);
            } else if (o.item == "playerbody") { //This is the jersey
                if (o.colors[0] == o.colors[1]) { //Can't see the jersey in this case.
                    if (o.colors[0].substring(0, 1) == "#") {
                        var c = parseInt(o.colors[0].substring(1), 16);
                        c = c ^ 0xffffff;
                        o.colors[1] = "#" + c.toString(16);
                    } else if (o.colors[0] != "white") {
                        o.colors[1] = "white";
                    } else {
                        o.colors[1] = "black";
                    }
                }

                var canvaswidth = 190;
                var canvasheight = 170;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Basketball Jersey
                var path_a = canvi[canvi.length - 1].canvas.path("m 154,51.5 -6,-2.1 0,0 c -2.2,-0.8 -8,-3 -13.5,-7.9 -6.1,-5.5 -12.9,-15.6 -10.7,-32.1 l 1.3,-6.8 c 0.5,0.1 -10.5,-2.8 -10.5,-2.8 0,0 -1.4,2.7 -3.3,6.5 -1.1,2.2 -5.3,12.6 -19.5,12.6 0,0 0,0 0,0 -0.3,0 -0.7,0 -1,0 l -2,0 c -0.3,0 -0.7,0 -1,0 -13.9,0 -17.8,-10.7 -19.2,-13.3 -1.4,-2.7 -2.9,-6.2 -2.9,-6.2 l -11.1,3.4 c 0.1,0.8 0.8,3.4 0.9,4.1 l 0.4,2.5 c 2.2,16.6 -4.6,26.6 -10.7,32.2 -5.2,4.7 -10.8,7 -13.2,7.8 l -2.7,0.9 -3.5,0.9 5.1,92.5 6.8,2.4 c 0.9,0.3 2.2,0.7 4,1.2 8,2.2 24.2,5.6 46.1,5.6 0,0 0,0 0,0 1.1,0 2.3,0 3.4,0 0.5,0 1.1,0 1.6,0 0.6,0 1.2,0 1.9,0 0.7,0 1.4,-0.1 2.1,-0.1 0.5,0 0.9,0 1.4,-0.1 0.8,0 1.6,-0.1 2.4,-0.1 0.3,0 0.7,0 1,-0.1 0.9,-0.1 1.8,-0.1 2.7,-0.2 0.3,0 0.5,0 0.8,-0.1 1,-0.1 1.9,-0.2 2.9,-0.2 0.2,0 0.4,0 0.6,0 1,-0.1 2.1,-0.2 3.1,-0.3 0.1,0 0.2,0 0.4,0 1.1,-0.1 2.2,-0.2 3.3,-0.4 0.1,0 0.1,0 0.2,0 1.1,-0.1 2.3,-0.3 3.4,-0.4 0,0 0,0 0.1,0 8.2,-1.1 16.4,-2.7 24.7,-4.7 l 0,0 6.5,-1.5 0.3,-0.1 3.4,-93.1 z").attr({
                    id: 'path_a',
                    parent: 'layer1',
                    fill: o.colors[0],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_a').transform(xfs);
                var path_b = canvi[canvi.length - 1].canvas.path("m 69,-1.3 c 0,0 -0.1,-0.1 1,-0.1 2.2,0 3.3,1.1 3.9,1.7 2.3,2.3 4,11.7 14.3,11.7 0.3,0 0.6,0 1,0 l 2.2,0 c 0.3,0 0.7,0 1,0 10.4,0 12,-9.4 14.3,-11.7 0.6,-0.7 1.7,-1.6 4,-1.6 0.7,0 0.5,0.1 1.3,0.2 -0.7,1.4 -1.7,3.7 -2.5,5.4 -0.8,1.6 -3.9,11.3 -17,11.3 0,0 0,0 0,0 -0.3,0 -0.7,0 -1,0 l -2.1,0 c -14,0.2 -16.5,-9.3 -18.1,-12.7 -1.8,-3.4 -1.8,-3.4 -2.3,-4.2 z m 82.7,44.4 c -0.1,0 -6.4,-1.8 -12,-6.9 -7.5,-6.8 -10.4,-16.1 -8.6,-27.8 l 0.7,-4.3 -3,-0.8 c 0,0 -0.6,1.1 -1.2,4.5 -2.1,11.6 1.3,23.3 9.7,31 6.3,5.8 13.4,7.7 13.5,7.7 l 4.5,1.2 0.1,-3.6 -3.7,-1 z m -98.9,-35.3 -0.2,-1.1 -0.7,-3.5 -3.3,0.9 0.7,4.3 c 1.8,11.7 -1.1,21 -8.6,27.8 -5.6,5.1 -11.9,6.9 -12,6.9 l -3.8,1 0.2,3.5 3.5,-0.8 1,-0.3 c 0.1,0 7.1,-2 13.5,-7.7 8.5,-7.7 11.7,-18.1 9.7,-31 z m 94,140.6 c -19.6,4.9 -39.1,7.3 -58.1,7.3 0,0 0,0 0,0 -30.5,0 -49.8,-6.5 -52,-7.3 l -4.6,-1.4 0.2,3.6 2.9,1.1 c 0.2,0.1 20.5,7.6 53.5,7.6 l 0,0 c 19.2,0 39.1,-2.5 58.9,-7.4 l 3.5,-0.9 0.1,-3.5 -0.4,0.1 -4,0.8 z").attr({
                    id: 'path_b',
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_b').transform(xfs);

                //Digits
                var dig = [];
                dig[0] = "m 1,28.1 0,-3.1 c 0,-16.8 5.1,-24.6 14.2,-24.6 8.9,0 14,7.8 14,24.6 l 0,3.1 c 0,16.8 -5.2,24.6 -14.1,24.6 -9,0 -14.1,-7.8 -14.1,-24.6 z m 17.5,0.6 0,-4.3 c 0,-11.9 -1.4,-14 -3.4,-14 -2,0 -3.4,2.2 -3.4,14 l 0,4.3 c 0,11.8 1.4,14 3.4,14 2,0 3.4,-2.2 3.4,-14 z";
                dig[1] = "m 8,12.7 -5.2,1.6 0,-10.5 8.3,-2.6 7.7,0 0,50.6 -10.8,0 0,-39.1 z";
                dig[2] = "m 1,42.4 9.4,-18 c 2.5,-5 3.4,-7.1 3.4,-9.1 0,-2.3 -1.3,-4.2 -4.3,-4.2 -2.6,0 -4.9,0.9 -7.4,2.3 l 0,-10.4 c 2.7,-1.2 6,-2.3 10.2,-2.3 7.1,0 12.2,4.3 12.2,12.2 l 0,0.4 c 0,4.4 -1.2,7.9 -4,13.1 l -8.1,14.9 11.9,0 0,10.7 -23.2,0 0,-9.6 z";
                dig[3] = "m 2,51.1 0,-10.2 c 2.2,0.9 4.2,1.4 6.9,1.4 3.5,0 5.8,-2.2 5.8,-5.8 l 0,-0.4 c 0,-4.2 -3.3,-6.2 -9.1,-6.6 l 0,-7.1 8.1,-10.8 -11.1,0 0,-10.3 22.4,0 0,9.5 -8.8,11.6 c 5.1,1.7 9.1,5.1 9.1,13.2 l 0,0.6 c 0,10.2 -6.2,16.2 -14.8,16.2 -3.6,0.2 -6.2,-0.3 -8.5,-1.3 z";
                dig[4] = "m 15,43.2 -14.3,0 0,-7.8 13.8,-34.1 10.7,0 0,32.8 4.1,0 0,9.1 -4.1,0 0,8.6 -10.2,0 0,-8.6 z m 0.1,-9.1 0,-16.1 -5.8,16.1 5.8,0 z";
                dig[5] = "m 1,51.2 0,-10.4 c 1.9,0.9 4,1.5 6.5,1.5 3.7,0 6.1,-2.7 6.1,-7.1 l 0,-0.4 c 0,-4.3 -2,-6 -4.7,-6 -1.3,0 -2.2,0.1 -3.2,0.6 l -5,-2.9 1.3,-25.1 20.4,0 0,10.2 -12.3,0 -0.5,8 c 0.6,-0.1 1.4,-0.1 2.3,-0.1 6.6,0 12.5,4 12.5,15 l 0,0.6 c 0,11.4 -6.4,17.5 -15.6,17.5 -3,0 -5.9,-0.6 -7.8,-1.4 z";
                dig[6] = "m 6,49.5 c -3.5,-3.5 -5.3,-10.4 -5.3,-21.2 l 0,-1.4 c 0,-20.9 7.2,-26.2 16.1,-26.2 2.7,0 4.9,0.4 6.8,1 l 0,9.9 c -1.6,-0.8 -3.7,-1.4 -5.9,-1.4 -4,0 -6.6,2.7 -6.6,10.4 1.5,-1.1 3.5,-1.7 5.6,-1.7 5.1,0 10.4,3.2 10.4,14.5 l 0,1.9 c 0,11.2 -5.6,17.4 -12.8,17.4 -3.5,0 -6.2,-1 -8.3,-3.2 z m 10.8,-13.8 0,-1.9 c 0,-5 -1.4,-6.5 -3.3,-6.5 -1.1,0 -1.9,0.4 -2.5,0.8 l 0,6.6 c 0,6.6 1.2,8.8 3,8.8 1.8,0 2.8,-1.9 2.8,-7.8 z";
                dig[7] = "m 13,11.9 -11.9,0 0,-10.6 22.7,0 0,6.9 -9.3,43.5 -10.4,0 8.9,-39.8 z";
                dig[8] = "m 1,38 0,-0.6 c 0,-5.9 2.5,-10.1 5.7,-12.3 -3.2,-2.3 -5.1,-6 -5.1,-10.7 l 0,-0.5 c 0,-8.1 5.4,-13.5 12.7,-13.5 7.3,0 12.7,5.3 12.7,13.4 l 0,0.5 c 0,4.6 -1.9,8.4 -5.2,10.7 3.2,2.2 5.8,6.3 5.8,12.3 l 0,0.6 c 0,9.1 -5.4,14.8 -13.4,14.8 -7.9,0 -13.2,-5.6 -13.2,-14.7 z m 16.4,-0.8 0,-0.6 c 0,-5.1 -1.2,-7 -3,-7 -1.8,0 -3.1,1.9 -3.1,7 l 0,0.6 c 0,5.3 1.4,6.9 3.1,6.9 1.7,0 3,-1.6 3,-6.9 z m -0.3,-21.7 0,-0.5 c 0,-4.7 -1.2,-6.1 -2.8,-6.1 -1.6,0 -2.8,1.4 -2.8,6.1 l 0,0.5 c 0,4.3 1.1,6.2 2.8,6.2 1.7,0 2.8,-1.9 2.8,-6.2 z";
                dig[9] = "m 17,33.2 c -1.6,1.1 -3.5,1.7 -5.5,1.7 -5.2,0 -10.4,-3.2 -10.4,-14.9 l 0,-1.7 c 0,-11.7 5.6,-17.8 12.8,-17.8 3.3,0 6,0.9 8.1,3.1 3.5,3.5 5.3,10.4 5.3,21.3 l 0,1.4 c 0,20.8 -7.3,26.2 -16.1,26.2 -2.9,0 -5.4,-0.5 -7.5,-1.3 l 0,-9.8 c 1.9,0.9 4.2,1.6 6.6,1.6 4,0 6.4,-2.5 6.7,-9.8 z m 0,-7.6 0,-7.1 c 0,-6.7 -1.2,-8.9 -3,-8.9 -1.8,0 -2.9,1.9 -2.9,8.1 l 0,1.8 c 0,5.5 1.3,6.9 3.3,6.9 1.1,0 1.9,-0.3 2.6,-0.8 z";
                var n = 0;
                if (parseInt(o.number, 10) >= 9) {
                    n = Math.floor(parseInt(o.number, 10) / 10);
                    if (n > 9) n = 0;
                }
                var digit1 = canvi[canvi.length - 1].canvas.path("m 60 60 " + dig[n]).attr({
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).transform(xfs);
                n = parseInt(o.number, 10) % 10;
                var digit2 = canvi[canvi.length - 1].canvas.path("m 90 60 " + dig[n]).attr({
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).transform(xfs);
                var rsrGroups = [layer1];
                layer1.push(path_a, path_b, digit1, digit2);
            } else {
                alert("Unrecognized avatar item in theme: " + o.theme + "=" + o.item);
            }
        } else if (o.theme == "summer olympics") {
            if (o.item == "teamicon") { //This is the star & wreath
                //var canvaswidth = 400;
                //var canvaswidth = 160;
                var canvaswidth = 160;
                //var canvasheight = 320;
                var canvasheight = 140;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Helmet and Mask
                //var helmetpath = canvi[canvi.length - 1].canvas.path("M205.479,296.037c0.293-2.743,7.647-67.646,48.627-101.175c40.122-32.828,96.714-33.117,116.034-33.119c-0.669-6.615-2.412-18.07-6.843-36.658c-3.146-11.383-8.521-25.143-17.737-38.934c-19.867-29.729-61.921-65.165-149.437-65.165c-116.012,0-172.907,80.744-183.473,146.767c-9.242,57.748,17.122,154.365,18.249,158.45c1.389,5.028,6.498,8.075,11.59,6.934c12.587-2.891,49.028-4.832,72.67,14.869c11.538,9.616,42.121,31.981,76.794,31.984c0.002,0,0.002,0,0.004,0c37.475,0,58.361-26.257,65.551-36.52c0,0,3.453-4.749,9.149-12.671c-17.911-2.816-32.855-5.597-47.365-11.209C210.057,316.021,204.376,306.335,205.479,296.037z M159,305.5c-17.949,0-32.5-14.551-32.5-32.5s14.551-32.5,32.5-32.5s32.5,14.551,32.5,32.5S176.949,305.5,159,305.5z").attr({ id: 'helmetpath', parent: 'layer1', fill: o.colors[0], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'helmetpath').transform(xfs);
                //var maskpath = canvi[canvi.length - 1].canvas.path("M410.345,304.583c-36.028,0-65.434-2.3-89.17-4.194l0.671-94.849c14.657-3.257,31.692-4.864,51.264-4.864c19.731,0,19.731-29.926,0-29.926c-17.286,0-74.795-0.717-113.938,31.31c-38.438,31.45-45.459,93.221-45.738,95.834c-0.689,6.438,2.705,12.906,8.745,15.241c19.488,7.537,40.822,9.87,68.881,14.363c1.607,7.174-12.166,62.969,39.741,74.002c16.323,3.47,35.392,1.799,51.793-9.099c32.705-21.727,42.066-68.048,42.449-70.052C426.534,314.53,420.41,304.583,410.345,304.583z M291.846,297.382c-6.914-0.854-33.346-4.626-46.589-8.231c5.892-27.762,18.339-58.028,46.589-72.979V297.382z M365.962,367.525c-8.361,5.527-17.828,7.066-28.938,4.705c-9.98-2.121-16.17-6.99-16.181-24.675l0.121-17.166c19.527,1.511,42.478,2.61,69.287,2.981 C385.431,345.561,377.493,359.902,365.962,367.525z").attr({ id: 'maskpath', parent: 'layer1', fill: o.colors[1], "fill-rule": 'evenodd', stroke: '#000000', "stroke-width": '1', "stroke-linecap": 'butt', "stroke-linejoin": 'miter', "stroke-opacity": '1', "fill-opacity": '1' }).data('id', 'maskpath').transform(xfs);
                //var rsr = Raphael('rsr', '612', '792');
                var starpath = canvi[canvi.length - 1].canvas.path("M141.2,88.1c-0.3-1-1.2-1.7-2.2-1.9l-20.5-3l-9.2-18.6c-0.5-0.9-1.4-1.5-2.5-1.5c-1,0-2,0.6-2.5,1.5l-9.2,18.6l-20.5,3c-1,0.2-1.9,0.9-2.2,1.9c-0.3,1,0,2.1,0.7,2.8L88,105.4l-3.5,20.4c-0.2,1,0.2,2.1,1.1,2.7c0.8,0.6,2,0.7,2.9,0.2l18.3-9.6l18.3,9.6c0.4,0.2,0.8,0.3,1.3,0.3c0.6,0,1.2-0.2,1.6-0.5c0.9-0.6,1.3-1.6,1.1-2.7l-3.5-20.4l14.8-14.4C141.2,90.2,141.5,89.1,141.2,88.1z");
                var wreathpath = canvi[canvi.length - 1].canvas.path("M98.7,164.5c2.5-0.5,3.7-1.4,3.7-1.4c-3,11.7-16.4,6.1-16.4,6.1c5.8-12.1,14.9-7.8,14.9-7.8C100.5,163.1,98.7,164.5,98.7,164.5z M101.9,159.2c1.3-10.2-11.1-9.9-11.1-9.9c0.9,11.4,9.4,10.8,9.4,10.8c0.3-1.5-0.7-3.1-0.7-3.1C101.3,158.2,101.9,159.2,101.9,159.2z M79.9,145c-1.6,11.3,6.8,12.5,6.8,12.5c0.6-1.4,0-3.2,0-3.2c1.5,1.5,1.9,2.7,1.9,2.7C92,147.3,79.9,145,79.9,145z M71.5,139.2c-4.6,9.8,2.7,13.2,2.7,13.2c0.9-1.1,0.9-2.9,0.9-2.9c0.9,1.8,1,3,1,3C81.8,144.7,71.5,139.2,71.5,139.2z M63,131.1c-5.7,9.2,1.1,13.4,1.1,13.4c1.1-1,1.2-2.8,1.2-2.8c0.7,1.9,0.6,3.1,0.6,3.1C72.6,137.8,63,131.1,63,131.1z M57.5,121.7c-8.1,7.1-2.8,13.2-2.8,13.2c1.3-0.6,2-2.3,2-2.3c0.1,2-0.3,3.1-0.3,3.1C64.7,130.9,57.5,121.7,57.5,121.7z M52.6,111.5c-8.3,6.2-3.7,12.4-3.7,12.4c1.3-0.5,2.1-2.1,2.1-2.1c0,1.9-0.5,3-0.5,3C58.9,120.8,52.6,111.5,52.6,111.5z M50.9,100.3c-9.7,3.5-7.2,10.8-7.2,10.8c1.4-0.1,2.6-1.4,2.6-1.4c-0.6,1.8-1.4,2.7-1.4,2.7C54.2,111.1,50.9,100.3,50.9,100.3z M42.9,100.8c9.3,0.1,7.7-11,7.7-11c-10.2,2-8.7,9.6-8.7,9.6c1.4,0.1,2.8-1,2.8-1C43.8,100,42.9,100.8,42.9,100.8z M42.6,85.3c1.3,0.5,2.9-0.1,2.9-0.1c-1.3,1.4-2.4,1.8-2.4,1.8c8.9,2.7,10.6-8.4,10.6-8.4C43.4,77.6,42.6,85.3,42.6,85.3z M58.4,67.4c-10.2-1.8-11.6,5.8-11.6,5.8c1.2,0.6,2.9,0.1,2.9,0.1c-1.4,1.3-2.5,1.7-2.5,1.7C55.8,78.3,58.4,67.4,58.4,67.4z M67.1,58.9c-9.2-4.8-12.8,2-12.8,2c1,0.9,2.7,1,2.7,1c-1.8,0.8-2.9,0.8-2.9,0.8C61.4,68.5,67.1,58.9,67.1,58.9z M88.1,162c0,0-1.3,0.4-3.8,0.2c0,0,2.1-0.8,2.8-2.3c0,0-7-6.6-15.9,2.9C71.3,162.8,82,171.8,88.1,162z M75.3,156.4c0,0-1.4,0.3-3.7-0.3c0,0,2.1-0.5,3.1-1.9c0,0-6.1-7.5-16.1,0.7C58.5,154.9,67.9,165.3,75.3,156.4z M60,148.2c0,0,2.2,0,3.5-1.1c0,0-4.2-8.6-15.9-3.1c0,0,6.7,12.3,16,5.3C63.6,149.3,62.2,149.2,60,148.2z M53.8,139.7c0,0-1.3-0.4-3-1.9c0,0,2,0.6,3.5-0.2c0,0-1.8-9-13.9-6.6C40.3,131.1,43.6,144,53.8,139.7z M45.8,127.2c0,0-1.2-0.6-2.6-2.3c0,0,1.9,0.9,3.4,0.4c0,0-0.3-8.9-12.3-8.6C34.2,116.7,35.3,129.7,45.8,127.2z M38.1,110.9c0,0,1.6,1.2,3.2,1.1c0,0,1.6-8.8-10.3-11c0,0-1.7,12.9,9.1,12.7C40.2,113.7,39.1,112.9,38.1,110.9z M37.4,101c0,0-0.8-1.1-1.2-3.3c0,0,1.2,1.6,2.8,1.9c0,0,4-8-6.8-13.4C32.2,86.2,27,98.2,37.4,101z M38.7,86.2c0,0-0.6-1.2-0.6-3.4c0,0,0.9,1.8,2.4,2.4c0,0,5.2-7.3-4.5-14.3C36,70.8,28.8,81.7,38.7,86.2z M41.9,69.5c0,0,0.3,2,1.5,3c0,0,7.3-5.1,0.5-15c0,0-10.3,8-2.5,15.4C41.4,73,41.2,71.7,41.9,69.5z M50.5,56.3c0,0-0.3,2,0.6,3.3c0,0,8.5-2.9,4.7-14.3c0,0-12.1,4.8-6.7,14.1C49.1,59.5,49.3,58.2,50.5,56.3z M61.8,51.5c0,0-1,1.8-0.7,3.3c0,0,8.9,0.5,9.7-11.5c0,0-13-0.1-11.5,10.6C59.2,53.9,59.9,52.8,61.8,51.5z M115.5,161.4c0.3,1.7,2.1,3.1,2.1,3.1c-2.5-0.5-3.7-1.4-3.7-1.4c3,11.7,16.4,6.1,16.4,6.1C124.5,157,115.5,161.4,115.5,161.4z M116.1,160.1c0,0,8.5,0.6,9.4-10.8c0,0-12.4-0.3-11.1,9.9c0,0,0.7-1,2.5-2.2C116.8,157,115.8,158.7,116.1,160.1z M129.5,157.5c0,0,8.4-1.2,6.8-12.5c0,0-12.2,2.3-8.7,12c0,0,0.4-1.2,1.9-2.7C129.6,154.3,128.9,156.1,129.5,157.5z M140.2,152.5c0,0,0.1-1.2,1-3c0,0-0.1,1.8,0.9,2.9c0,0,7.3-3.4,2.7-13.2C144.8,139.2,134.4,144.7,140.2,152.5z M152.2,144.6c0,0,6.8-4.3,1.1-13.4c0,0-9.6,6.7-2.9,13.7c0,0-0.1-1.2,0.6-3.1C150.9,141.8,151.1,143.6,152.2,144.6z M161.6,134.9c0,0,5.3-6-2.8-13.2c0,0-7.3,9.2,1.1,14c0,0-0.4-1.1-0.3-3.1C159.6,132.6,160.3,134.3,161.6,134.9z M167.3,123.9c0,0,4.6-6.2-3.7-12.4c0,0-6.3,9.3,2.1,13.3c0,0-0.5-1-0.5-3C165.3,121.9,166.1,123.4,167.3,123.9z M165.3,100.3c0,0-3.3,10.7,5.9,12.1c0,0-0.8-0.8-1.4-2.7c0,0,1.2,1.3,2.6,1.4C172.5,111.1,175.1,103.8,165.3,100.3z M165.6,89.7c0,0-1.6,11.1,7.7,11c0,0-0.9-0.7-1.8-2.4c0,0,1.4,1.1,2.8,1C174.3,99.3,175.8,91.7,165.6,89.7z M173.6,85.3c0,0-0.8-7.7-11.1-6.7c0,0,1.7,11.1,10.6,8.4c0,0-1-0.4-2.4-1.8C170.7,85.1,172.3,85.8,173.6,85.3z M169.4,73.2c0,0-1.4-7.6-11.6-5.8c0,0,2.6,10.9,11.2,7.5c0,0-1.1-0.4-2.5-1.7C166.5,73.3,168.2,73.8,169.4,73.2z M162.1,62.6c0,0-1.1,0-2.9-0.8c0,0,1.8,0,2.7-1c0,0-3.6-6.8-12.8-2C149.1,58.9,154.9,68.5,162.1,62.6z M129.1,159.9c0.8,1.5,2.8,2.3,2.8,2.3c-2.4,0.2-3.8-0.2-3.8-0.2c6.1,9.9,16.8,0.8,16.8,0.8C136.1,153.4,129.1,159.9,129.1,159.9z M141.6,154.2c1,1.4,3.1,1.9,3.1,1.9c-2.4,0.5-3.7,0.3-3.7,0.3c7.4,8.9,16.7-1.5,16.7-1.5C147.7,146.8,141.6,154.2,141.6,154.2z M152.7,147.1c1.3,1.1,3.5,1.1,3.5,1.1c-2.2,1.1-3.6,1.1-3.6,1.1c9.2,7,16-5.3,16-5.3C156.9,138.4,152.7,147.1,152.7,147.1z M162.1,137.6c1.4,0.7,3.5,0.2,3.5,0.2c-1.8,1.5-3,1.9-3,1.9c10.2,4.3,13.5-8.7,13.5-8.7C163.9,128.7,162.1,137.6,162.1,137.6z M169.7,125.3c1.5,0.5,3.4-0.4,3.4-0.4c-1.4,1.7-2.6,2.3-2.6,2.3c10.5,2.5,11.6-10.5,11.6-10.5C170,116.4,169.7,125.3,169.7,125.3z M185.2,101c-11.8,2.2-10.3,11-10.3,11c1.6,0.2,3.2-1.1,3.2-1.1c-1,2-2.1,2.8-2.1,2.8C186.9,113.9,185.2,101,185.2,101z M177.2,99.6c1.6-0.3,2.8-1.9,2.8-1.9c-0.4,2.2-1.2,3.3-1.2,3.3c10.4-2.8,5.2-14.8,5.2-14.8C173.3,91.6,177.2,99.6,177.2,99.6z M175.8,85.2c1.5-0.5,2.4-2.4,2.4-2.4c-0.1,2.2-0.6,3.4-0.6,3.4c9.8-4.5,2.7-15.4,2.7-15.4C170.6,77.9,175.8,85.2,175.8,85.2z M172.9,72.6c1.2-1,1.5-3,1.5-3c0.7,2.2,0.5,3.5,0.5,3.5c7.8-7.5-2.5-15.4-2.5-15.4C165.5,67.4,172.9,72.6,172.9,72.6z M165.1,59.7c0.9-1.3,0.6-3.3,0.6-3.3c1.2,1.9,1.5,3.2,1.5,3.2c5.4-9.3-6.7-14.1-6.7-14.1C156.7,56.8,165.1,59.7,165.1,59.7z M155.2,54.8c0.3-1.6-0.7-3.3-0.7-3.3c1.9,1.3,2.6,2.4,2.6,2.4c1.5-10.7-11.5-10.6-11.5-10.6C146.3,55.3,155.2,54.8,155.2,54.8z");

                var xt = -85;
                var yt = -115;
                //xt = -24;
                xt = -31;
                //yt = -30;
                yt = -37;
                starpath.attr({
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': o.colors[0]
                }).transform(xfs).translate(xt, yt);
                wreathpath.attr({
                    'stroke-width': '0',
                    'stroke-opacity': '1',
                    'fill': o.colors[1]
                }).transform(xfs).translate(xt, yt);

                var rsrGroups = [layer1];
                layer1.push(starpath);
            } else if (o.item == "playerbody") { //This is the jersey (same as for basketball for now).
                if (o.colors[0] == o.colors[1]) { //Can't see the jersey in this case.
                    if (o.colors[0].substring(0, 1) == "#") {
                        var c = parseInt(o.colors[0].substring(1), 16);
                        c = c ^ 0xffffff;
                        o.colors[1] = "#" + c.toString(16);
                    } else if (o.colors[0] != "white") {
                        o.colors[1] = "white";
                    } else {
                        o.colors[1] = "black";
                    }
                }

                var canvaswidth = 190;
                var canvasheight = 170;
                var xfx = (canvaswidth / canvasheight) * o.heightInPixels;
                var xfy = o.heightInPixels;
                canvi.push({
                    canvas: Raphael(document.getElementById(o.id), '' + xfx, '' + xfy),
                    id: o.id,
                    section: o.section
                });
                var xfs = "s" + (xfy / canvasheight) + ", " + (xfy / canvasheight) + ", 0, 0";
                canvi[canvi.length - 1].canvas.clear();
                var layer1 = canvi[canvi.length - 1].canvas.set();
                //Basketball Jersey
                var path_a = canvi[canvi.length - 1].canvas.path("m 154,51.5 -6,-2.1 0,0 c -2.2,-0.8 -8,-3 -13.5,-7.9 -6.1,-5.5 -12.9,-15.6 -10.7,-32.1 l 1.3,-6.8 c 0.5,0.1 -10.5,-2.8 -10.5,-2.8 0,0 -1.4,2.7 -3.3,6.5 -1.1,2.2 -5.3,12.6 -19.5,12.6 0,0 0,0 0,0 -0.3,0 -0.7,0 -1,0 l -2,0 c -0.3,0 -0.7,0 -1,0 -13.9,0 -17.8,-10.7 -19.2,-13.3 -1.4,-2.7 -2.9,-6.2 -2.9,-6.2 l -11.1,3.4 c 0.1,0.8 0.8,3.4 0.9,4.1 l 0.4,2.5 c 2.2,16.6 -4.6,26.6 -10.7,32.2 -5.2,4.7 -10.8,7 -13.2,7.8 l -2.7,0.9 -3.5,0.9 5.1,92.5 6.8,2.4 c 0.9,0.3 2.2,0.7 4,1.2 8,2.2 24.2,5.6 46.1,5.6 0,0 0,0 0,0 1.1,0 2.3,0 3.4,0 0.5,0 1.1,0 1.6,0 0.6,0 1.2,0 1.9,0 0.7,0 1.4,-0.1 2.1,-0.1 0.5,0 0.9,0 1.4,-0.1 0.8,0 1.6,-0.1 2.4,-0.1 0.3,0 0.7,0 1,-0.1 0.9,-0.1 1.8,-0.1 2.7,-0.2 0.3,0 0.5,0 0.8,-0.1 1,-0.1 1.9,-0.2 2.9,-0.2 0.2,0 0.4,0 0.6,0 1,-0.1 2.1,-0.2 3.1,-0.3 0.1,0 0.2,0 0.4,0 1.1,-0.1 2.2,-0.2 3.3,-0.4 0.1,0 0.1,0 0.2,0 1.1,-0.1 2.3,-0.3 3.4,-0.4 0,0 0,0 0.1,0 8.2,-1.1 16.4,-2.7 24.7,-4.7 l 0,0 6.5,-1.5 0.3,-0.1 3.4,-93.1 z").attr({
                    id: 'path_a',
                    parent: 'layer1',
                    fill: o.colors[0],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_a').transform(xfs);
                var path_b = canvi[canvi.length - 1].canvas.path("m 69,-1.3 c 0,0 -0.1,-0.1 1,-0.1 2.2,0 3.3,1.1 3.9,1.7 2.3,2.3 4,11.7 14.3,11.7 0.3,0 0.6,0 1,0 l 2.2,0 c 0.3,0 0.7,0 1,0 10.4,0 12,-9.4 14.3,-11.7 0.6,-0.7 1.7,-1.6 4,-1.6 0.7,0 0.5,0.1 1.3,0.2 -0.7,1.4 -1.7,3.7 -2.5,5.4 -0.8,1.6 -3.9,11.3 -17,11.3 0,0 0,0 0,0 -0.3,0 -0.7,0 -1,0 l -2.1,0 c -14,0.2 -16.5,-9.3 -18.1,-12.7 -1.8,-3.4 -1.8,-3.4 -2.3,-4.2 z m 82.7,44.4 c -0.1,0 -6.4,-1.8 -12,-6.9 -7.5,-6.8 -10.4,-16.1 -8.6,-27.8 l 0.7,-4.3 -3,-0.8 c 0,0 -0.6,1.1 -1.2,4.5 -2.1,11.6 1.3,23.3 9.7,31 6.3,5.8 13.4,7.7 13.5,7.7 l 4.5,1.2 0.1,-3.6 -3.7,-1 z m -98.9,-35.3 -0.2,-1.1 -0.7,-3.5 -3.3,0.9 0.7,4.3 c 1.8,11.7 -1.1,21 -8.6,27.8 -5.6,5.1 -11.9,6.9 -12,6.9 l -3.8,1 0.2,3.5 3.5,-0.8 1,-0.3 c 0.1,0 7.1,-2 13.5,-7.7 8.5,-7.7 11.7,-18.1 9.7,-31 z m 94,140.6 c -19.6,4.9 -39.1,7.3 -58.1,7.3 0,0 0,0 0,0 -30.5,0 -49.8,-6.5 -52,-7.3 l -4.6,-1.4 0.2,3.6 2.9,1.1 c 0.2,0.1 20.5,7.6 53.5,7.6 l 0,0 c 19.2,0 39.1,-2.5 58.9,-7.4 l 3.5,-0.9 0.1,-3.5 -0.4,0.1 -4,0.8 z").attr({
                    id: 'path_b',
                    parent: 'layer1',
                    fill: o.colors[1],
                    'stroke-width': '0',
                    'stroke-opacity': '1'
                }).data('id', 'path_b').transform(xfs);

                //Digits
                if (o.number != "") {
                    var dig = [];
                    dig[0] = "m 1,28.1 0,-3.1 c 0,-16.8 5.1,-24.6 14.2,-24.6 8.9,0 14,7.8 14,24.6 l 0,3.1 c 0,16.8 -5.2,24.6 -14.1,24.6 -9,0 -14.1,-7.8 -14.1,-24.6 z m 17.5,0.6 0,-4.3 c 0,-11.9 -1.4,-14 -3.4,-14 -2,0 -3.4,2.2 -3.4,14 l 0,4.3 c 0,11.8 1.4,14 3.4,14 2,0 3.4,-2.2 3.4,-14 z";
                    dig[1] = "m 8,12.7 -5.2,1.6 0,-10.5 8.3,-2.6 7.7,0 0,50.6 -10.8,0 0,-39.1 z";
                    dig[2] = "m 1,42.4 9.4,-18 c 2.5,-5 3.4,-7.1 3.4,-9.1 0,-2.3 -1.3,-4.2 -4.3,-4.2 -2.6,0 -4.9,0.9 -7.4,2.3 l 0,-10.4 c 2.7,-1.2 6,-2.3 10.2,-2.3 7.1,0 12.2,4.3 12.2,12.2 l 0,0.4 c 0,4.4 -1.2,7.9 -4,13.1 l -8.1,14.9 11.9,0 0,10.7 -23.2,0 0,-9.6 z";
                    dig[3] = "m 2,51.1 0,-10.2 c 2.2,0.9 4.2,1.4 6.9,1.4 3.5,0 5.8,-2.2 5.8,-5.8 l 0,-0.4 c 0,-4.2 -3.3,-6.2 -9.1,-6.6 l 0,-7.1 8.1,-10.8 -11.1,0 0,-10.3 22.4,0 0,9.5 -8.8,11.6 c 5.1,1.7 9.1,5.1 9.1,13.2 l 0,0.6 c 0,10.2 -6.2,16.2 -14.8,16.2 -3.6,0.2 -6.2,-0.3 -8.5,-1.3 z";
                    dig[4] = "m 15,43.2 -14.3,0 0,-7.8 13.8,-34.1 10.7,0 0,32.8 4.1,0 0,9.1 -4.1,0 0,8.6 -10.2,0 0,-8.6 z m 0.1,-9.1 0,-16.1 -5.8,16.1 5.8,0 z";
                    dig[5] = "m 1,51.2 0,-10.4 c 1.9,0.9 4,1.5 6.5,1.5 3.7,0 6.1,-2.7 6.1,-7.1 l 0,-0.4 c 0,-4.3 -2,-6 -4.7,-6 -1.3,0 -2.2,0.1 -3.2,0.6 l -5,-2.9 1.3,-25.1 20.4,0 0,10.2 -12.3,0 -0.5,8 c 0.6,-0.1 1.4,-0.1 2.3,-0.1 6.6,0 12.5,4 12.5,15 l 0,0.6 c 0,11.4 -6.4,17.5 -15.6,17.5 -3,0 -5.9,-0.6 -7.8,-1.4 z";
                    dig[6] = "m 6,49.5 c -3.5,-3.5 -5.3,-10.4 -5.3,-21.2 l 0,-1.4 c 0,-20.9 7.2,-26.2 16.1,-26.2 2.7,0 4.9,0.4 6.8,1 l 0,9.9 c -1.6,-0.8 -3.7,-1.4 -5.9,-1.4 -4,0 -6.6,2.7 -6.6,10.4 1.5,-1.1 3.5,-1.7 5.6,-1.7 5.1,0 10.4,3.2 10.4,14.5 l 0,1.9 c 0,11.2 -5.6,17.4 -12.8,17.4 -3.5,0 -6.2,-1 -8.3,-3.2 z m 10.8,-13.8 0,-1.9 c 0,-5 -1.4,-6.5 -3.3,-6.5 -1.1,0 -1.9,0.4 -2.5,0.8 l 0,6.6 c 0,6.6 1.2,8.8 3,8.8 1.8,0 2.8,-1.9 2.8,-7.8 z";
                    dig[7] = "m 13,11.9 -11.9,0 0,-10.6 22.7,0 0,6.9 -9.3,43.5 -10.4,0 8.9,-39.8 z";
                    dig[8] = "m 1,38 0,-0.6 c 0,-5.9 2.5,-10.1 5.7,-12.3 -3.2,-2.3 -5.1,-6 -5.1,-10.7 l 0,-0.5 c 0,-8.1 5.4,-13.5 12.7,-13.5 7.3,0 12.7,5.3 12.7,13.4 l 0,0.5 c 0,4.6 -1.9,8.4 -5.2,10.7 3.2,2.2 5.8,6.3 5.8,12.3 l 0,0.6 c 0,9.1 -5.4,14.8 -13.4,14.8 -7.9,0 -13.2,-5.6 -13.2,-14.7 z m 16.4,-0.8 0,-0.6 c 0,-5.1 -1.2,-7 -3,-7 -1.8,0 -3.1,1.9 -3.1,7 l 0,0.6 c 0,5.3 1.4,6.9 3.1,6.9 1.7,0 3,-1.6 3,-6.9 z m -0.3,-21.7 0,-0.5 c 0,-4.7 -1.2,-6.1 -2.8,-6.1 -1.6,0 -2.8,1.4 -2.8,6.1 l 0,0.5 c 0,4.3 1.1,6.2 2.8,6.2 1.7,0 2.8,-1.9 2.8,-6.2 z";
                    dig[9] = "m 17,33.2 c -1.6,1.1 -3.5,1.7 -5.5,1.7 -5.2,0 -10.4,-3.2 -10.4,-14.9 l 0,-1.7 c 0,-11.7 5.6,-17.8 12.8,-17.8 3.3,0 6,0.9 8.1,3.1 3.5,3.5 5.3,10.4 5.3,21.3 l 0,1.4 c 0,20.8 -7.3,26.2 -16.1,26.2 -2.9,0 -5.4,-0.5 -7.5,-1.3 l 0,-9.8 c 1.9,0.9 4.2,1.6 6.6,1.6 4,0 6.4,-2.5 6.7,-9.8 z m 0,-7.6 0,-7.1 c 0,-6.7 -1.2,-8.9 -3,-8.9 -1.8,0 -2.9,1.9 -2.9,8.1 l 0,1.8 c 0,5.5 1.3,6.9 3.3,6.9 1.1,0 1.9,-0.3 2.6,-0.8 z";
                    var n = 0;
                    if (parseInt(o.number, 10) >= 9) {
                        n = Math.floor(parseInt(o.number, 10) / 10);
                        if (n > 9) n = 0;
                    }
                    var digit1 = canvi[canvi.length - 1].canvas.path("m 60 60 " + dig[n]).attr({
                        parent: 'layer1',
                        fill: o.colors[1],
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    }).transform(xfs);
                    n = parseInt(o.number, 10) % 10;
                    var digit2 = canvi[canvi.length - 1].canvas.path("m 90 60 " + dig[n]).attr({
                        parent: 'layer1',
                        fill: o.colors[1],
                        'stroke-width': '0',
                        'stroke-opacity': '1'
                    }).transform(xfs);
                    var rsrGroups = [layer1];
                    layer1.push(path_a, path_b, digit1, digit2);
                }
            } else {
                alert("Unrecognized avatar item in theme: " + o.theme + "=" + o.item);
            }
        }

    }

    self.downloadTable = function(selector) {
        $(selector).first().downloadContents({
            type: "csv"
        });
    }

    self.divisionTextRemoved = function(name) {
        return name; //CHANGED 2017-01-16, may nee to put it back.
        /*
        ns = name.split("- ");
        return ns[ns.length - 1];
        */
    }

    function getDraftRoomStatus() {
        //DEBUG: Disable the room messages for now.  Investigating whether this polling is what's crashing the system.
        //$(".fan-draft-mock-button").val("Mock Draft");
        //draftRoomStatus("Draft Room<br />Temporarily Closed");
        //return;


        a$.ajax({
            type: "GET",
            service: "JScript",
            async: true,
            data: {
                lib: "draft",
                prefix: subscriber.roomprefix,
                leagueid: subscriber.leagueid,
                cmd: "getRoomStatus"
            },
            dataType: "json",
            cache: false,
            error: a$.ajaxerror,
            success: gotState //TODO: See if you can hook up this "progress" member, it would be very cool.
        });

        function gotState(json) {
            if (a$.jsonerror(json)) {} else {
                if (json.draftmock) {
                    $(".fan-draft-mock-button").val("Mock Draft");
                } else {
                    $(".fan-draft-mock-button").val("REAL Draft");
                }
                var bld = "";
                if (!(json.draftstarted || json.draftfinished)) {
                    bld = (json.draftmock ? "Mock " : "") + " Draft not started (room available).";
                    if (json.draftstarttime == null) {
                        bld += "<br />No start time set.";
                    } else if (json.draftstarttime > 0) {
                        var m = Math.floor(json.draftstarttime / 60000)
                        bld += "<br />Draft Begins in: ";
                        if (m > 0) {
                            bld += m + " Minute";
                            if (m > 1) bld += "s";
                        } else {
                            var s = Math.floor((json.draftstarttime % 60000) / 1000)
                            bld += s + " Second";
                            if (s > 1) bld += "s";
                        }
                    }
                    if (json.youinroom) {
                        bld += "<br />YOU are currently IN the DRAFT ROOM <br />(in another browser window).";
                    } else {
                        //bld += "<br />ROOM abandoned - will need reset."; //  TODO: Do this automatically)
                    }
                } else if (json.draftstarted) {
                    bld = (json.draftmock ? "Mock " : "") + "Draft IN PROGRESS";
                    if (json.youinroom) {
                        bld += "<br />YOU are currently IN the DRAFT ROOM <br />(in another browser window).";
                    } else {
                        bld += "<br />You may enter as an observer (and watch others draft)";
                    }
                } else if (json.draftfinished) {
                    if (json.draftroomclosetime > 0) {
                        bld = (json.draftmock ? "Mock " : "") + "Draft IN PROGRESS (Completed)";
                        if (json.youinroom) {
                            bld += "<br />YOU are currently IN the DRAFT ROOM <br />(in another browser window).";
                        } else {
                            bld += "<br />Room will be available in: " + Math.floor(1 + (json.draftroomclosetime / 60000)) + " Minutes";
                        }
                    } else {
                        bld = (json.draftmock ? "Mock " : "") + "Draft Room CLOSED<br />Resetting, please wait."
                    }
                }
                bld += "<br />Occupants: " + json.numdrafting + " drafting, " + (json.numpinging - json.numdrafting) + " observing.";
                draftRoomStatus(bld);
                if (true) {
                    getDraftQueue();
                }
                else {
                    if (json.youinroom) {
                        $(".fan-draft-button").hide();
                        youDrafting(true);
                        you_were_in_room = true;
                    } else {
                        $(".fan-draft-button").show();
                        youDrafting(false);
                        if (you_were_in_room) {
                            you_were_in_room = false;
                            getDraftQueue();
                        }
                    }
                }
            }
            a$.hideprogress("plotprogress");

            //clearTimeout(draftRoomLongTimer);
            //draftRoomLongTimer = setTimeout(getDraftRoomStatus, 5 * 60 * 1000); //Failsafe
            setTimeout(getDraftRoomStatus, 20000);

            //Just updating the queue now
            //setTimeout(getDraftQueue, 20000); 
        }
    }

    //Nav
    self.selectedSection = ko.observable();
    self.sections = ko.observable(mysections);
    self.oRole = ko.observable();
    self.oCSR = ko.observable("");
    self.oUid = ko.observable("");
    self.scoresDivision = ko.observable("");

    self.oUid($.cookie("username").toLowerCase());
    self.oTeam = ko.observable("0");
    self.oLocation = ko.observable("0");
    self.matchupWeek = ko.observable(0); //Means most recent week, negative #s indicate past weeks.
    self.eventsWeek = ko.observable(0);

    var lid = 0;
    if (a$.exists(o.leagueid)) {
        lid = o.leagueid;
    }
    self.leagueCrumb = ko.observable(lid);
    self.showExcludedAgents = ko.observable(false);
    self.adminExcludedAgents = ko.observable(false);

    //Form vars
    self.teamName = ko.observable();
    self.fanTeamName = ko.observable();
    self.autoSelectRoster = ko.observable();
    self.canEditTeam = ko.observable();

    //Buildouts
    self.leagues = ko.observable({});
    self.playerhome = ko.observable({});
    self.playerhome_showmap = ko.observable(false);
    self.leagueadmin = ko.observable({});
    self.subscribers = ko.observable({});
    self.fantasyteam = ko.observable({});
    self.draftqueue = ko.observable({});
    self.draftRoomStatus = ko.observable("Retrieving Schedule for<br />next Mock Draft...");
    self.stats = ko.observable({});
    self.tv = ko.observable({});
    self.scores = ko.observable({});
    self.brackets = ko.observable({
        leagues: []
    });
    self.matchups = ko.observable({});
    self.standings = ko.observable({});
    self.schedule = ko.observable({});
    self.roster = ko.observable({});

    self.rosterempty = ko.observable(false);
    self.scoresempty = ko.observable(false);
    self.eventsempty = ko.observable(false);
    self.oPrefix = ko.observable(a$.urlprefix());


    self.events = ko.observable({});
    self.top5 = ko.observable({});
    self.eventselect = ko.observable({});
    self.ComingSoon = ko.observable(false);

    //Xtreme States
    self.draftstep = ko.observable(1);
    self.emptydraftslots = ko.observable(0);
    self.draftsubscribed = ko.observable(false);
    self.draftteamowner = ko.observable(false);
    self.ospecialteam = ko.observable(false);
    self.draftleaguecount = ko.observable(0);
    self.youDrafting = ko.observable(false);
    self.draftpicktype = ko.observable("");
    self.draftqueueEmpty = ko.observable(true);
    self.draftleagueidx = ko.observable(0);

    self.playerHomeThumbsupReceived = ko.observable(0);
    self.playerHomeThumbsupGiven = ko.observable(0);

    self.activePosition = ko.observable("(none)");

    self.showSource = ko.observable("Overall");
    self.showStandingsFor = ko.observable("teams");
    self.groupStatsBy = ko.observable("league");
    self.groupLimit = ko.observable("50000");

    self.columnView = ko.observable("brief");
    self.showPlusMVP = ko.observable(false);
    self.showPlusMIP = ko.observable(false);
    self.showPlusGAME = ko.observable(false);
    self.showPlusPRIOR = ko.observable(false);
    self.showPlusDETAIL = ko.observable(false);

    self.eventsDisplayingAll = ko.observable(true); //Was false

    self.updatingQueue = ko.observable(false);

    sectionsConfig(); //Added 5/12/2016, may not be thinking clearly.
    if (gametype() == "team") {
        var myid;

        function setsectionloop() {
            if (teamscrollcluge) {
                PlayerHomeRedirect = true;
                //self.selectSection("Player Home");
                self.selectSection("Matchup");
                teamscrollcluge = false;
            }
            clearTimeout(myid);
        }
        myid = setTimeout(setsectionloop, 1000);
    } else {
        //self.selectSection("Standings"); //DEBUG: This DOESN'T SET THE SCROLLS CORRECTLY (no idea why), but I'm going to try to trigger it.
        //$(".app-table1").css("height","8000px");
        //$("#agamenav li a").eq(0).trigger('click');
        var myid;

        function setsectionloop() {
            if (teamscrollcluge) {
                self.selectSection("Standings");
                teamscrollcluge = false;
            }
            clearTimeout(myid);
        }
        myid = setTimeout(setsectionloop, 1000);
    }
    //TODO: Trying to change the color on the menu after click and mouseout (it turns light gray, which makes the text invisible.
    //$(".custom-menu-link").unbind("click").bind("click", function () {
    //    alert("debug:clicking menu link");
    //});

    //For EVERYONE, get the current leagues (no regard to league type, just by client).
    //TODO: ADDED 2017-01-29: Return LeagueInPlayoffs.

    a$.ajax({
        type: "GET",
        service: "JScript",
        async: true,
        data: {
            lib: "fan",
            test: testq,
            testdateoffset: testdateoffset,
            cmd: "getleagues",
            role: $.cookie("TP1Role"),
            Team: "",
            CSR: "",
            League: ""
        },
        dataType: "json",
        cache: false,
        error: a$.ajaxerror,
        success: loadedLeaguesMaster
    });

    function bindDashboardLinks() {
        $(".fan-dashboard-link").unbind().bind("click", function() {
            DashboardLinking = true;
            var project = $(this).attr("bproject");
            var location = $(this).attr("blocation");
            var group = $(this).attr("bgroup");
            var team = $(this).attr("bteam");
            var csr = $(this).attr("bcsr");
            //alert("debug: Dashboard link activated, project: " + project + ", location: " + location + ", group: " + group + ", team: X" + team + "X, csr: " + csr);
            if (a$.exists(appApmDashboard)) {
                $("#graphtab").show();
                $('#graphlabel').trigger('click');
                $("#selProjects").val(project).trigger("liszt:updated");
                appApmDashboard.refreshboxes({
                    which: 'Location,Group,Team,CSR,KPI,SubKPI,Payperiod,Trendby,DataSource',
                    success: function() {
                        appApmDashboard.setdaterangeslider($("#selTrendbys").val());
                        appApmMessaging.composecontacts();
                        $("#selLocations").val(location).trigger("liszt:updated");
                        appApmDashboard.refreshboxes({
                            which: (($.cookie("ApmGuatModuleLoc") != "") && ((appApmDashboard.getPrev() == $.cookie("ApmGuatModuleLoc")) || ($("#selLocations").val() == $.cookie("ApmGuatModuleLoc")))) ? 'Group,Team,CSR,DataSource,Payperiod' : 'Group,Team,CSR,DataSource',
                            success: function() {
                                appApmMessaging.composecontacts();
                                $("#selGroups").val(group).trigger("liszt:updated");
                                appApmDashboard.refreshboxes({
                                    which: 'Team,CSR',
                                    success: function() {
                                        appApmMessaging.composecontacts();
                                        $("#selTeams").val(team).trigger("liszt:updated");
                                        appApmDashboard.refreshboxes({
                                            which: 'CSR',
                                            success: function() {
                                                $("#selCSRs").val(csr).trigger("liszt:updated");
                                                $('#btnPlot').trigger("click");
                                                DashboardLinking = false;
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                alert("Dashboard isn't included with this implementation of A-GAME");
                DashboardLinking = false;
            }
            return false;
        });
    }

    function loadedLeaguesMaster(json) {
        if (a$.jsonerror(json)) {} else if (a$.exists(json.empty)) {
            //leagues({});
        } else {
            if (a$.exists(json.clientInPlayoffs)) {
                //alert("debug:clientinplayoffs=" + json.clientInPlayoffs);
                inplayoffs = json.clientInPlayoffs;
                sectionsShowHide("PLAYOFFS", inplayoffs);
            }
            if (a$.gup("postseason")!="") {
            	inplayoffs = true;
            }
            if (inplayoffs) {
            	$(".gridiron-map-clickstates_postseason").show();
            	$(".gridiron-map-clickstates").hide();
            }
            else {
            	$(".gridiron-map-clickstates").show();
            	$(".gridiron-map-clickstates_postseason").hide();
            }
            for (var j in json.leagues) {
                if (json.leagues[j].activeGames <= 0) {
                    json.leagues[j].seasonWeekNumber = "N/A";
                }
            }
            var lgs = [];
            for (var j in json.leagues) {
                var found = false;
                for (var l in lgs) {
                  if (lgs[l] == json.leagues[j].leagueid) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  if (json.leagues[j].fantasy_flag == "N") {
                      if (json.leagues[j].region.toLowerCase() != "division") {
                          $(".events-division").append('<option value="' + json.leagues[j].leagueid + '">' + json.leagues[j].name + '</option>');
                      }
                  }
                  lgs.push(json.leagues[j].leagueid);
                }
            }
            $(".events-division").unbind().bind("change", function() {
                eventsDivision($(this).val());
                selectSection("Events");
            });
            masterLeagues = json.leagues;
        }
    }
}

function formatbrackets(br) {
    /* go through and pair them into games */
    for (var i in br.leagues) {
        br.leagues[i].bg8 = {
            games: []
        };
        br.leagues[i].bg4 = {
            games: []
        };
        br.leagues[i].bg2 = {
            games: []
        };
        br.leagues[i].bg1 = {
            games: []
        };

        if (br.leagues[i].b8.length) {
            for (var j in br.leagues[i].b8) {
                if (!(j % 2)) {
                    br.leagues[i].bg8.games[Math.floor(j / 2)] = {
                        teams: []
                    };
                }
                br.leagues[i].bg8.games[Math.floor(j / 2)].teams[j % 2] = br.leagues[i].b8[j];
            }
        }
        /* 2023-04-17 - Temporarily hijack the display for Walgreens first-time situation.
        //SHOULD BE:
        if (br.leagues[i].b4.length) {
            for (var j in br.leagues[i].b4) {
                if (!(j % 2)) {
                    br.leagues[i].bg4.games[Math.floor(j / 2)] = {
                        teams: []
                    };
                }
                br.leagues[i].bg4.games[Math.floor(j / 2)].teams[j % 2] = br.leagues[i].b4[j];
            }
        }
        */
        //TEMPORARY
        if (br.leagues[i].b4.length) {
            for (var j in br.leagues[i].b4) {

                if (theme() == "dragons") {
                    playerhome_loaded = false;
                    var found = false;
                    for (var fo in finalsoverride) {
                        if (finalsoverride[fo].teamId == br.leagues[i].b4[j].teamId) {
                            finalsoverride[fo].wins = 7;
                            found = true;
                            break;
                        }                        
                    }
                    if (!found) {
                        finalsoverride.push({ teamId: br.leagues[i].b4[j].teamId, wins: 7 });
                    }
                }

                if (!(j % 2)) {
                    br.leagues[i].bg2.games[Math.floor(j / 2)] = {
                        teams: []
                    };
                }
                br.leagues[i].bg2.games[Math.floor(j / 2)].teams[j % 2] = br.leagues[i].b4[j];
            }
        }
        if (br.leagues[i].b2.length) {
            for (var j in br.leagues[i].b2) {
                if (!(j % 2)) {
                    br.leagues[i].bg2.games[Math.floor(j / 2)] = {
                        teams: []
                    };
                }
                br.leagues[i].bg2.games[Math.floor(j / 2)].teams[j % 2] = br.leagues[i].b2[j];
                if (j % 2) {
                    if ((br.leagues[i].bg2.games[0].teams[0].gameStatus == "FINAL")) {
                        br.leagues[i].bg1.games[0] = {
                            teams: []
                        };
                        if (br.leagues[i].bg2.games[0].teams[0].score > br.leagues[i].bg2.games[0].teams[1].score) {
                            br.leagues[i].bg1.games[0].teams[0] = br.leagues[i].bg2.games[0].teams[0];
                            br.leagues[i].bg1.games[0].teams[1] = br.leagues[i].bg2.games[0].teams[1];
                        }
                        else if (br.leagues[i].bg2.games[0].teams[0].score == br.leagues[i].bg2.games[0].teams[1].score) {
                          br.leagues[i].bg1.games[0].teams[0] = br.leagues[i].bg2.games[0].teams[0];
                          br.leagues[i].bg1.games[0].teams[1] = br.leagues[i].bg2.games[0].teams[1];
                        } else {
                            br.leagues[i].bg1.games[0].teams[0] = br.leagues[i].bg2.games[0].teams[1]; //json.brackets.leagues[i].bg1.games[0].teams[0] = json.brackets.leagues[i].bg2.games[0].teams[1];
                            br.leagues[i].bg1.games[0].teams[1] = br.leagues[i].bg2.games[0].teams[0];
                        }
                    }
                }
            }
        }
    }
}

function finalsoverride_check(teamid,wins) {
    for (var fo in finalsoverride) {
        if (teamid == finalsoverride[fo].teamId) {
            wins = finalsoverride[fo].wins;                                                    
            break;
        }
    }
    return wins;
}

function activateQ() {

    $(".draft-q-remove").unbind().bind("click", function() {
        $(this).parent().remove();
        showhideArrows();
    });

    $(".draft-q-up").unbind().bind("click", function() {
        var myindex = $(this).parent().index();
        if (myindex > 0) {
            $(this).parent().swapWith($(this).parent().parent().children().eq(myindex - 1));
        }
        showhideArrows();
    });

    $(".draft-q-down").unbind().bind("click", function() {
        var myindex = $(this).parent().index();
        if (myindex < ($(this).parent().parent().children().length - 1)) {
            $(this).parent().swapWith($(this).parent().parent().children().eq(myindex + 1));
        }
        showhideArrows();
    });

    showhideArrows();

    function showhideArrows() {
        var bottomidx = $(".draft-table-q-body tr").length - 1;
        var cnt = 0;
        $(".draft-table-q-body tr").each(function() {
            $(".draft-q-up", this).html("&uarr;");
            $(".draft-q-down", this).html("&darr;");
            if (cnt == 0) {
                $(".draft-q-up", this).html("");
            }
            if (cnt == bottomidx) {
                $(".draft-q-down", this).html("");
            }
            cnt += 1;
        });
        cnt = 1;
        $(".draft-q-index").each(function() {
            $(this).html(cnt);
            cnt++;
        });
        $(".draft-q-save").show();
        //$(".draft-q-save").unbind().bind("click", function() { alert("debug: clicked q-saved"); });

        $(".draft-q-saved").hide();
    }

    jQuery.fn.swapWith = function(to) {
        return this.each(function() {
            var copy_to = $(to).clone(true);
            var copy_from = $(this).clone(true);
            $(to).replaceWith(copy_from);
            $(this).replaceWith(copy_to);
        });
    };

}

function ftrim(s) {
    if (typeof s == "string") {
        return s.trim()
    } else {
        return "" + s;
    }
}

function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
}
