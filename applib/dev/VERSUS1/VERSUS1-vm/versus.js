angularApp.directive("ngVersus", ['api', '$timeout', function(api, $timeout) {
    return {
        templateUrl: "../applib/dev/VERSUS1/VERSUS1-view/versus.htm?" + Date.now(), //TODO: Remove for production?
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {
        	scope.identity=legacyContainer.scope.TP1Username.toUpperCase();

            scope.ismaximized = false;

            scope.maximize = function(up) {
                scope.ismaximized = up;
                if (!up) {
                	scope.abort=true;
                }
                //$(".race").empty(); //TODO: Will need to clear the race in another way.
            }
            scope.maximized = function() {
                return scope.ismaximized;
            }

            scope.gamesfound = function() {
            	return scope.games.length;
            }

            scope.games = [];
            api.getJS({
                lib: "flex",
                cmd: "getGamesInPlay",
            }).then(function (json) {
                scope.$apply(function () {
                		scope.games = json.games;
                });
            });

            scope.activegame = {};

            scope.selectgame = function(gameid) {
            	scope.maximize(true);
            	api.getJS({
                lib: "flex",
                cmd: "getGame",
                gameid: gameid //This is passed from a list (a previous call to "getGameList" will provide these ids).
            	}).then(function (json) {
                scope.$apply(function () {
                		for (var i in scope.games) {
                			if (scope.games[i].gameid == gameid) {
                				scope.activegame = scope.games[i];
                				break;
                			}
                		}
                		scope.flex = json;
                		initgame();
                });
            	});
            }


						//scope.flex = {
						//	game: { id: 1, name: "Dellner's Speedrome", positions: 30, theme: "Speed Racer", finish: "FinishLine" },
						//	players: [
						//		{ userid: "ANSMILEY", name: "Andrea Smiley", stg: {}, avatar: "avatars/empty_headshot.png" },
						//		{ userid: "EVANLEON", name: "Evangeline Leon", stg: {}, avatar: "empty_headshot.png" },
						//		{ userid: "CCHAPMAN", name: "Christina Chapman", stg: {}, avatar: "empty_headshot.png" }
						//	],
						//	segments:	[
						//		{ date: '2018-06-01',
						//			players: [
						//				{ userid: 'ANSMILEY', StartPos: 0, Move: 1, EndPos: 1 },
						//				{ userid: 'EVANLEON', StartPos: 0, Move: 2, EndPos: 2 },
						//				{ userid: 'CCHAPMAN', StartPos: 0, Move: 6, EndPos: 6 }
						//			]
						//		},
						//		{ date: '2018-06-02',
						//			players: [
						//				{ userid: 'ANSMILEY', StartPos: 1, Move: 3, EndPos: 4 },
						//				{ userid: 'EVANLEON', StartPos: 2, Move: 1, EndPos: 3 },
						//				{ userid: 'CCHAPMAN', StartPos: 6, Move: 6, EndPos: 12 }
						//			]
						//		},
						//		{ date: '2018-06-03',
						//			players: [
						//				{ userid: 'ANSMILEY', StartPos: 4, Move: 2, EndPos: 6 },
						//				{ userid: 'EVANLEON', StartPos: 3, Move: 1, EndPos: 4 },
						//				{ userid: 'CCHAPMAN', StartPos: 12, Move: 18, EndPos: 30 }
						//			]
						//		}
						//	]
						//};

						function toRadians (angle) {
  						return angle * (Math.PI / 180);
						}

            function initgame() {
            		scope.animlock=false;
                scope.abort=false;

                scope.secondslong=1;
            	scope.spacing=0;
                scope.lbspacing=0;

            	scope.racename = scope.activegame.theme;

            	$(".versus-panel").hide();

            	if (scope.racename == "Drag Strip") {
            		scope.selector = ".versus-theme-dragstrip";
            	}
            	else if (scope.racename == "Oval Track") {
            		scope.selector = ".versus-theme-ovaltrack";
            	}
            	else if (scope.racename == "Board Game") {
            		scope.selector = ".versus-theme-boardgame";
            	}
            	$(scope.selector).show();
            	//scope.selector += " .race";

            	//Make array containing the leader order at each step.

            	for (var p=0; p < scope.flex.players.length; p++) {

            				scope.flex.players[p].points = [];

                        //scope.racename = "candyland"; //The existing way
                        //racename = "fallrise"; //This one will work.
                        //scope.racename = "circular"; //This isn't done yet.
                        if (scope.racename == "Drag Strip") {
			              	scope.count=0;
                            for (var i=0;i<=scope.flex.game.positions;i++){
                                scope.flex.players[p].points.push({ x: scope.count, y: scope.spacing });
                                scope.count+=1072/scope.flex.game.positions;
                            }
                        }
            				else if (scope.racename == "fallrise") {
			              	scope.count=0;
				              var add = 0;
  	  					      for (var i=0;i<=scope.flex.game.positions;i++){
	    	        				scope.flex.players[p].points.push({ x: scope.count, y: scope.spacing + add });
	      	      				if (i < (scope.flex.game.positions/2)) {
	        	    					add += 10;
	          	  				}
	            					else {
	            						add -= 10;
	            					}
                    		scope.count+=1072/scope.flex.game.positions;
            					}
            				}
            				else if (scope.racename == "Oval Track") { //Not done yet.
            					center = { x: 750, y: 500 };
            					radius = 200 + scope.spacing;
            					sweep = 360 / (scope.flex.game.positions);
            					var ang = 270;
  	  					      for (var i=0;i<=scope.flex.game.positions;i++){
	    	        				scope.flex.players[p].points.push({
	    	        					x: center.x + ((Math.cos(toRadians(ang)) * radius)*2),
	    	        					y: center.y - (Math.sin(toRadians(ang)) * radius)
	    	        				});
	    	        				ang += sweep;
            					}
            				}
            				else if (scope.racename == "Board Game") {
                                scope.count=0;
                                scope.flex.players[p].points[0]={ x: -40, y: scope.spacing };
                                scope.flex.players[p].points[1]={ x: 0, y: 0 };
                                scope.flex.players[p].points[2]={ x: 100, y: 0 };
                                scope.flex.players[p].points[3]={ x: 100, y: 100 };
                                scope.flex.players[p].points[4]={ x: 100, y: 200 };
                                scope.flex.players[p].points[5]={ x: 100, y: 300 };
                                scope.flex.players[p].points[6]={ x: 100, y: 400 };
                                scope.flex.players[p].points[7]={ x: 100, y: 500 };
                                scope.flex.players[p].points[8]={ x: 200, y: 500 };
                                scope.flex.players[p].points[9]={ x: 300, y: 500 };
                                scope.flex.players[p].points[10]={ x: 400, y: 500 };
                                scope.flex.players[p].points[11]={ x: 500, y: 500 };
                                scope.flex.players[p].points[12]={ x: 600, y: 500 };
                                scope.flex.players[p].points[13]={ x: 700, y: 500 };
                                scope.flex.players[p].points[14]={ x: 700, y: 400 };
                                scope.flex.players[p].points[15]={ x: 700, y: 300 };
                                scope.flex.players[p].points[16]={ x: 600, y: 300 };
                                scope.flex.players[p].points[17]={ x: 500, y: 300 };
                                scope.flex.players[p].points[18]={ x: 400, y: 300 };
                                scope.flex.players[p].points[19]={ x: 300, y: 300 };
                                scope.flex.players[p].points[20]={ x: 300, y: 200 };
                                scope.flex.players[p].points[21]={ x: 300, y: 100 };
                                scope.flex.players[p].points[22]={ x: 300, y: 0 };
                                scope.flex.players[p].points[23]={ x: 400, y: 0 };
                                scope.flex.players[p].points[24]={ x: 500, y: 0 };
                                scope.flex.players[p].points[25]={ x: 500, y: 100 };
                                scope.flex.players[p].points[26]={ x: 600, y: 100 };
                                scope.flex.players[p].points[27]={ x: 700, y: 100 };
                                scope.flex.players[p].points[28]={ x: 700, y: 0 };
                                scope.flex.players[p].points[29]={ x: 800, y: 0 };
                                scope.flex.players[p].points[30]={ x: 900, y: 0 };
                                for (var i=1;i<=scope.flex.game.positions;i++){
                                    scope.flex.players[p].points[i].x= scope.flex.players[p].points[i].x+Math.floor((Math.random() * 66));
                                    scope.flex.players[p].points[i].y= scope.flex.players[p].points[i].y+Math.floor((Math.random() * 66));
                                }
                            }

                    if(scope.flex.players[p].userid!=scope.identity){
                        if(scope.flex.players[p].stg.prebuiltAvatar==true){
                            $(".gamepiece",scope.selector).append('<div class=ball id=ball'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+scope.flex.players[p].points[0].x +'px><img class=avatar src='+scope.flex.players[p].stg.avatarFilename+' /></div>');
                        }
                        else {
                                $(".gamepiece",scope.selector).append('<div class=ball id=ball'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+scope.flex.players[p].points[0].x +'px><img class=avatar src="../jq/avatars/' + (scope.flex.players[p].avatarfilename || 'empty_headshot.png') + '" /></div>');
                        }
                    }
                    else{
                        if(scope.flex.players[p].stg.prebuiltAvatar==true){
                            $(".gamepiece",scope.selector).append('<div class=ballspecial id=ball'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+scope.flex.players[p].points[0].x +'px><img class=avatarspecial src='+scope.flex.players[p].stg.avatarFilename+' /></div>');
                        }
                        else {
                                $(".gamepiece",scope.selector).append('<div class=ballspecial id=ball'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+scope.flex.players[p].points[0].x +'px><img class=avatarspecial src="../jq/avatars/' + (scope.flex.players[p].avatarfilename || 'empty_headshot.png') + '" /></div>');
                        }
                    }
                    if(scope.flex.players[p].userid!=scope.identity){
                        $(".namelegend",scope.selector).append('<div style=text-align:right><span class=name id=name'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+(scope.flex.players[p].points[0].x-475) +'px>'+scope.flex.players[p].userid+'</span></div>');
                        $(".namelegend",scope.selector).append('<div style=text-align:left><span class=plus id=plus'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+(scope.flex.players[p].points[0].x-475) +'px>'+scope.flex.players[p].userid+'</span></div>');
                    }
                    else{
                        $(".namelegend",scope.selector).append('<div style=text-align:right><span class=namespecial id=name'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+(scope.flex.players[p].points[0].x-475) +'px><b>'+scope.flex.players[p].userid+'</b></span></div>');
                        $(".namelegend",scope.selector).append('<div style=text-align:left><span class=plusspecial id=plus'+p+' style=top:'+scope.flex.players[p].points[0].y+'px;left:'+(scope.flex.players[p].points[0].x-475) +'px><b>'+scope.flex.players[p].userid+'</b></span></div>');
                    }
                    if(scope.racename == "Drag Strip"){
                        $(scope.selector).append('<div class=lane style=top:'+(scope.flex.players[p].points[0].y+33)+'px></div>');
                        scope.spacing+=36;
                    }
                    else if(scope.racename == "Oval Track"){
                        $(scope.selector).append('<div class=circle style=width:'+(876+(scope.spacing*2))+'px;height:'+(438+(scope.spacing*2))+'px;z-index:'+((-1)-p)+';left:'+(296-scope.spacing)+'px;top:'+(296-scope.spacing)+'px></div>');
                        scope.spacing+=38;
                    }
                    else if(scope.racename == "Board Game"){
                        $(".leaderboard-group",scope.selector).append('<div class=leaderboard id=row'+p+' style=top:'+scope.lbspacing+'px>'+(p+1)+'</div>');
                        $(".leaderboard-group",scope.selector).append('<div class=leaderboardname id=lbname'+p+' style=top:'+scope.lbspacing+'px>'+'<img class=avatar src='+scope.flex.players[p].stg.avatarFilename+' />'+scope.flex.players[p].userid+'</div>');
                        $(".leaderboard-group",scope.selector).append('<div class=leaderboardnum id=lbnum'+p+' style=top:'+scope.lbspacing+'px>0</div>');
                        scope.spacing+=36;
                        scope.lbspacing+=40;
                    }

            	}
            	if(scope.racename == "Drag Strip"){
                    $(scope.selector).append('<div class=lane style=top:-3px></div>');
                    $(scope.selector).append('<div class=startline style=height:'+scope.spacing+'px;top:-1px id=startline></div>');
                    $(scope.selector).append('<div class=endline style=height:'+scope.spacing+'px;top:-1px id=endline></div>');
                    $(scope.selector).append('<span class="versus-panel text" id=announcer>Welcome to the race!</span>');
                }
            	else if(scope.racename == "Oval Track"){
                    $(scope.selector).append('<div class=circle style=width:794px;height:359px;z-index:-1;left:336px;top:336px></div>');
                    $(scope.selector).append('<div class=startline style=height:'+(scope.spacing+2)+'px;top:696px;left:535px id=startline></div>');
                    $(scope.selector).append('<div class=endline style=height:'+(scope.spacing+2)+'px;top:696px;left:493px id=endline></div>');
                    $(scope.selector).append('<span class="versus-panel text" id=announcer>Welcome to the race!</span>');
                }
                else if(scope.racename == "Board Game"){
                    $(scope.selector).append('<span class="versus-panel text" id=announcer>Welcome to the race, '+scope.identity+'!</span>');
                    $(".countdown-group",scope.selector).append('<span class=countdown id=go>GO</span>');
                    $(".countdown-group",scope.selector).append('<span class=countdown id=one>1</span>');
                    $(".countdown-group",scope.selector).append('<span class=countdown id=two>2</span>');
                    $(".countdown-group",scope.selector).append('<span class=countdown id=three>3</span>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block0></div>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block1></div>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block2></div>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block3></div>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block4></div>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block5></div>');
                    $(".countdown-group",scope.selector).append('<div class=block id=block6></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box0><span>1</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box1><span>2</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box2><span>3</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box3><span>4</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box4><span>5</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box5><span>6</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box6><span>7</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box7><span>8</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box8><span>9</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box9><span>10</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box10><span>11</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box11><span>12</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box12><span>13</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box13><span>14</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box14><span>15</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box15><span>16</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box16><span>17</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box17><span>18</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box18><span>19</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box19><span>20</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box20><span>21</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box21><span>22</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box22><span>23</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box23><span>24</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box24><span>25</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box25><span>26</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box26><span>27</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box27><span>28</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box28><span>29</span></div>');
                    $(".game-drawing",scope.selector).append('<div class=box id=box29><span>30</span></div>');
                    //set track ^^^
                }

            	//WIP vvv
                function makeannouncements(){
                    var highestnum=[];
                    for (var i=0;i<scope.flex.segments.length;i++) {
                        highestnum.push(0);
                    }
                    var highestwinner=[];
                    for (var i=0;i<scope.flex.segments.length;i++) {
                        highestwinner.push("");
                    }
                    var average=[];
                    for (var i=0;i<scope.flex.segments.length;i++) {
                        average.push(0);
                    }
                    var leader=[];
                    for (var i=0;i<scope.flex.segments.length;i++) {
                        leader.push([""]);
                    }
                    var leadernum=[];
                    for (var i=0;i<scope.flex.segments.length;i++) {
                        leadernum.push(0);
                    }
                    var announcements=[];
                    for(var s=0;s<scope.flex.segments.length;s++){
                        for(var p=0;p<scope.flex.players.length;p++){
                            average[s]=average[s]+scope.flex.segments[s].players[p].Move;
                            if(scope.flex.segments[s].players[p].Move==highestnum[s]){
                                highestwinner[s]=highestwinner[s].concat(scope.flex.segments[s].players[p].userid);
                            }
                            if(scope.flex.segments[s].players[p].EndPos==leadernum[s]){
                                leader[s]=leader[s].concat(" "+scope.flex.segments[s].players[p].userid);
                            }
                            if(scope.flex.segments[s].players[p].Move>highestnum[s]){
                                highestnum[s]=scope.flex.segments[s].players[p].Move;
                                highestwinner[s]=scope.flex.segments[s].players[p].userid;
                            }
                            if(scope.flex.segments[s].players[p].EndPos>leadernum[s]){
                                leadernum[s]=scope.flex.segments[s].players[p].EndPos;
                                leader[s]=scope.flex.segments[s].players[p].userid;
                            }
                            if(highestwinner[s].length==2){
                                highestwinner[s]=highestwinner[s][0]+" and "+highestwinner[s][1];
                            }
                            if(highestwinner[s].length>2){
                                highestwinner[s]=highestwinner[s].length+" players";
                            }
                        }
                    }
                    for(var i=0;i<scope.flex.segments.length;i++){
                        average[i]=average[i]/scope.flex.players.length;
                    }
                    for(var i=0;i<scope.flex.segments.length;i++){
                        leader[i]=leader[i].split(" ");
                        if(leader[i].length>3){
                            leader[i]="Multiple competitors";
                        }
                        if(leader[i].length==3){
                            leader[i]=leader[i][0]+", "+leader[i][1]+", and "+leader[i][2];
                        }
                        if(leader[i].length==2){
                            leader[i]=leader[i][0]+" and "+leader[i][1];
                        }
                    }
                    for(var i=0;i<scope.flex.segments.length;i++){
                        announcements[i]="Day "+(i+1)+" <br> Average point gain: "+average[i]+" points <br> Highest point gain: "+highestnum[i]+" points <br> Current leader(s): "+leader[i]+" at "+leadernum[i]+" points";
                    }


                    return announcements;
                }
                scope.announcements=makeannouncements();

                function findpositions(){
                  function compare(a,b) {
                  	if (a.EndPos > b.EndPos) {
                  		return -1;
                  	}
                  	else if (a.EndPos < b.EndPos) {
                  		return 1;
                  	}
                  	else {
                  		if (a.userid < b.userid) {
                  			return -1;
                  		}
                  		else if (a.userid > b.userid) {
                  			return 1;
                  		}
                  		else {
                  			return 0;
                  		}
                  	}
                  }
				          for(var s=0;s<scope.flex.segments.length;s++) {
				          	scope.flex.segments[s].positions = JSON.parse(JSON.stringify(scope.flex.segments[s].players));
				          	scope.flex.segments[s].positions.sort(compare);
				          	var eh = 1;
      	          }
                }

                findpositions();
            }
            scope.animlock=false;
            scope.startanimation = function() {
            	//Get final destination (highest score) as a divisor.
            	var numpositions = scope.flex.game.positions;
            	//Put all players on the starting line.
            	var numplayers = scope.flex.players.length;
                var numsegments = scope.flex.segments.length;
            	//for (var p in scope.flex.players) {
            	//	alert("debug:placing " + scope.flex.players[p].name);
            	//}
            	//Move each player

                if(!scope.animlock) {
                    scope.animlock=true;
                    for (var p=0; p < scope.flex.players.length; p++) {
                        //Resets the competitors to the start line
                        function resetme(segmentidx,useridx) {
                            document.getElementById("lbnum"+p).innerHTML = 0;
                            $("#name"+useridx).animate({
                                opacity: 1,
                                left: (scope.flex.players[p].points[0].x - 475) + "px",
                                top: (scope.flex.players[p].points[0].y - 0) + "px"
                            },
                            {
                                duration: 2000,
                                easing:"linear"
                            });
                            $("#ball"+useridx).animate({
                                left: (scope.flex.players[p].points[0].x + 0) + "px",
                                top: (scope.flex.players[p].points[0].y + 0) + "px"
                            },
                            {
                                duration: 2000,
                                easing:"linear"
                            });
                            $("#plus"+useridx).animate({
                                left: (scope.flex.players[p].points[0].x + 0) + "px",
                                top: (scope.flex.players[p].points[0].y + 0) + "px",
                                opacity: 0
                            },
                            {
                                duration: 2000
                            });

                            }
                            resetme(0,p);
                        }

                    function countdown(){
                        var countdown=["three","two","one","go"];
                        var index=0;
                            function nextloop(countdown,index){
                                $("#"+countdown[index]).animate({
                                        left: "0px"
                                },
                                {
                                    duration: 1000,
                                    //easing:"linear"
                                    complete: function(){
                                        if(index<countdown.length-1){
                                            index++;
                                            nextloop(countdown,index);
                                        }
                                        if(index==countdown.length-1){
                                            $timeout(function(){
                                                document.getElementById("block2").style.visibility = "visible";
                                            },1000)
                                            $timeout(function(){
                                            for(var i=0;i<countdown.length;i++){
                                                $("#"+countdown[i]).animate({
                                                    left: "-400px"
                                                },
                                                {
                                                    duration: 100,
                                                    easing:"linear"
                                                });
                                            }
                                            },1250)
                                            $timeout(function(){
                                                document.getElementById("block2").style.visibility = "hidden";
                                            },1500)
                                        }
                                    }
                                });
                            }
                            nextloop(countdown,index);
                    }
                    countdown();

                    //Spaces out the reset and the animation
                    $timeout(function(){
                        if(scope.racename=="Drag Strip"){
                            for (var p=0; p < scope.flex.players.length; p++) {
                                //Animates the race
                                function animateme(segmentidx,useridx) {
                                    if(scope.abort) return;
                                    var loopnum=scope.flex.segments[segmentidx].players[useridx].Move;
                                    var loopidx=0;
                                    document.getElementById("announcer").innerHTML = scope.announcements[segmentidx];
                                    document.getElementById("plus"+useridx).innerHTML = "+"+scope.flex.segments[segmentidx].players[useridx].Move;
                                    if(scope.flex.segments[segmentidx].players[useridx].Move>0){
                                        $("#plus"+useridx).animate({
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].EndPos].x)+35)+"px",
                                                top:  ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].EndPos].y)+0)+"px",
                                                opacity: 1
                                            },
                                            {
                                                duration: (scope.secondslong*500),
                                                complete: function(){
                                                    $("#plus"+useridx).animate({
                                                        opacity: 0
                                                    },
                                                    {
                                                        duration: (scope.secondslong*500)
                                                    });
                                                }
                                            });
                                        function loopme(segmentidx,useridx,loopnum,loopidx){
                                            if(scope.abort) return;
                                            loopidx++;
                                            $("#name"+useridx).animate({
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x)-475)+"px",
                                                top: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y)-0)+"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum)//,
                                                //easing:"linear"
                                            });
                                            $("#ball"+useridx).animate({
                                                left: scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x +"px",
                                                top: scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y +"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum),
                                                //easing: "linear",
                                                complete: function() {
                                                    if(loopidx==loopnum){
                                                        if(segmentidx!=scope.flex.segments.length-1){
                                                            animateme(segmentidx+1,useridx);
                                                        }
                                                    }
                                                    else {
                                                        loopme(segmentidx,useridx,loopnum,loopidx);
                                                    }
                                                }
                                            });
                                        }
                                        loopme(segmentidx,useridx,loopnum,loopidx);
                                    }
                                    else {$timeout(function(){
                                            if(segmentidx!=scope.flex.segments.length-1){
                                                animateme(segmentidx+1,useridx);
                                            }
                                        },(scope.secondslong*1000));
                                    }
                                    if(segmentidx==scope.flex.segments.length-1){
                                                $timeout(function(){scope.animlock=false;},2000);
                                    }
                                }
                                animateme(0,p); //p = userid index.  They will always be a record in segments for each user, and in the same order as in the player header.
                        }
                        }
                        if(scope.racename=="Oval Track"){
                            for (var p=0; p < scope.flex.players.length; p++) {
                                //Animates the race
                                function animateme(segmentidx,useridx) {
                                    if(scope.abort) return;
                                    var loopnum=scope.flex.segments[segmentidx].players[useridx].Move;
                                    var loopidx=0;
                                    document.getElementById("announcer").innerHTML = scope.announcements[segmentidx];
                                    document.getElementById("plus"+useridx).innerHTML = "+"+scope.flex.segments[segmentidx].players[useridx].Move;
                                    if(scope.flex.segments[segmentidx].players[useridx].Move>0){
                                        $("#plus"+useridx).animate({
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].EndPos].x)+35)+"px",
                                                top:  ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].EndPos].y)+0)+"px",
                                                opacity: 1
                                            },
                                            {
                                                duration: (scope.secondslong*500),
                                                complete: function(){
                                                    $("#plus"+useridx).animate({
                                                        opacity: 0
                                                    },
                                                    {
                                                        duration: (scope.secondslong*500)
                                                    });
                                                }
                                            });
                                        function loopme(segmentidx,useridx,loopnum,loopidx){
                                            if(scope.abort) return;
                                            loopidx++;
                                            $("#name"+useridx).animate({
                                                opacity: 0,
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x)-475)+"px",
                                                top: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y)-0)+"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum)//,
                                                //easing:"linear"
                                            });
                                            $("#ball"+useridx).animate({
                                                left: scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x +"px",
                                                top: scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y +"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum),
                                                //easing: "linear",
                                                complete: function() {
                                                    if(loopidx==loopnum){
                                                        if(segmentidx!=scope.flex.segments.length-1){
                                                            animateme(segmentidx+1,useridx);
                                                        }
                                                    }
                                                    else {
                                                        loopme(segmentidx,useridx,loopnum,loopidx);
                                                    }
                                                }
                                            });
                                        }
                                        loopme(segmentidx,useridx,loopnum,loopidx);
                                    }
                                    else {$timeout(function(){
                                            if(segmentidx!=scope.flex.segments.length-1){
                                                animateme(segmentidx+1,useridx);
                                            }
                                        },(scope.secondslong*1000));
                                    }
                                    if(segmentidx==scope.flex.segments.length-1){
                                                $timeout(function(){scope.animlock=false;},2000);
                                    }
                                }
                                animateme(0,p); //p = userid index.  They will always be a record in segments for each user, and in the same order as in the player header.
                        }
                        }
                        if(scope.racename=="Board Game"){
                            for (var p=0; p < scope.flex.players.length; p++) {
                                //Animates the race
                                function animateme(segmentidx,useridx) {
                                    if(scope.abort) return;
                                    var loopnum=scope.flex.segments[segmentidx].players[useridx].Move;
                                    var loopidx=0;
                                    document.getElementById("announcer").innerHTML = scope.announcements[segmentidx];
                                    document.getElementById("lbname"+useridx).innerHTML = scope.flex.segments[segmentidx].positions[useridx].userid;
                                    document.getElementById("lbnum"+useridx).innerHTML = scope.flex.segments[segmentidx].positions[useridx].EndPos;
                                    document.getElementById("plus"+useridx).innerHTML = "+"+scope.flex.segments[segmentidx].players[useridx].Move;
                                    if(scope.flex.segments[segmentidx].players[useridx].Move>0){
                                        $("#plus"+useridx).animate({
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].EndPos].x)+35)+"px",
                                                top:  ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].EndPos].y)+0)+"px",
                                                opacity: 1
                                            },
                                            {
                                                duration: (scope.secondslong*500),
                                                complete: function(){
                                                    $("#plus"+useridx).animate({
                                                        opacity: 0
                                                    },
                                                    {
                                                        duration: (scope.secondslong*500)
                                                    });
                                                }
                                            });
                                        function loopme(segmentidx,useridx,loopnum,loopidx){
                                            if(scope.abort) return;
                                            loopidx++;
                                            if(scope.flex.segments[segmentidx].players[useridx].userid!=scope.identity){
                                            $("#name"+useridx).animate({
                                                opacity: 0,
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x)-475)+"px",
                                                top: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y)-0)+"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum)//,
                                                //easing:"linear"
                                            });
                                            }
                                            else{
                                                $("#name"+useridx).animate({
                                                left: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x)-475)+"px",
                                                top: ((scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y)-0)+"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum)//,
                                                //easing:"linear"
                                            });
                                            }
                                            $("#ball"+useridx).animate({
                                                left: scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].x +"px",
                                                top: scope.flex.players[useridx].points[scope.flex.segments[segmentidx].players[useridx].StartPos+loopidx].y +"px"
                                            },
                                            {
                                                duration: ((scope.secondslong*1000)/loopnum),
                                                //easing: "linear",
                                                complete: function() {
                                                    if(loopidx==loopnum){
                                                        if(segmentidx!=scope.flex.segments.length-1){
                                                            animateme(segmentidx+1,useridx);
                                                        }
                                                    }
                                                    else {
                                                        loopme(segmentidx,useridx,loopnum,loopidx);
                                                    }
                                                }
                                            });
                                        }
                                        loopme(segmentidx,useridx,loopnum,loopidx);
                                    }
                                    else {$timeout(function(){
                                            if(segmentidx!=scope.flex.segments.length-1){
                                                animateme(segmentidx+1,useridx);
                                            }
                                        },(scope.secondslong*1000));
                                    }
                                    if(segmentidx==scope.flex.segments.length-1){
                                                $timeout(function(){scope.animlock=false;},2000);
                                    }
                                }
                                animateme(0,p); //p = userid index.  They will always be a record in segments for each user, and in the same order as in the player header.
                            }
                        }
                },3000);
            }
            }




        }
    }

}]);
