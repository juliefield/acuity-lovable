angularApp.directive("ngVersus", ['api', '$timeout', function(api, $timeout) {
    return {
        templateUrl: "../applib/dev/VERSUS1/VERSUS1-view/versus.htm?" + Date.now(), //TODO: Remove for production?
        scope: {
            who: "@"
        },
        require: '^ngLegacyContainer',
        link: function(scope, element, attrs, legacyContainer) {

            scope.ismaximized = false;

            scope.maximize = function(up) {
                scope.ismaximized = up;
            }
            scope.maximized = function() {
                return scope.ismaximized;
            }

            api.getJS({
                lib: "flex",
                cmd: "getGame",
                gameid: 1 //This is passed from a list (a previous call to "getGameList" will provide these ids).
            }).then(function (json) {
                scope.$apply(function () {
                		scope.flex = json;
                		initgame();
                });
            });
            
            
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
						
            function initgame() {
                scope.secondslong=1;
            	scope.spacing=0;

            	for (var p=0; p < scope.flex.players.length; p++) {

            				scope.flex.players[p].points = [];
			              scope.count=0;
			              var add = 0;
    					      for (var i=0;i<=scope.flex.game.positions;i++){
    					      	add = 0; //ADAM: Comment this line out to demo y movement.
	            				scope.flex.players[p].points.push({ x: scope.count, y: scope.spacing + add });
	            				if (i < (scope.flex.game.positions/2)) {
	            					add -= 10;
	            				}
	            				else {
	            					add += 10;
	            				}
                  	  //scope.points[i]=scope.count;
                    	scope.count+=1072/scope.flex.game.positions;
            				}

                    if(scope.flex.players[p].stg.prebuiltAvatar==true){
                        $(".race").append('<div class=ball id=ball'+p+' style=top:'+scope.spacing+'px><img class=avatar src='+scope.flex.players[p].stg.avatarFilename+' /></div>');
                    }
                    else {
                    		$(".race").append('<div class=ball id=ball'+p+' style=top:'+scope.spacing+'px><img class=avatar src="../jq/avatars/' + (scope.flex.players[p].avatarfilename || 'empty_headshot.png') + '" /></div>');
                    }
                    $(".race").append('<div style=text-align:right><span class=name id=name'+p+' style=top:'+scope.spacing+'px>'+scope.flex.players[p].userid+'</span></div>');
                    $(".race").append('<div style=text-align:left><span class=plus id=plus'+p+' style=top:'+scope.spacing+'px>'+scope.flex.players[p].userid+'</span></div>');
                    $(".race").append('<div class=lane style=top:'+(scope.spacing+33)+'px></div>');
                    scope.spacing+=36;
            	}
            	$(".race").append('<span class="versus-panel text" id=announcer>Welcome to the race!</span>');
            	$(".race").append('<div class=lane style=top:-3px></div>');
                $(".race").append('<div class=startline style=height:'+scope.spacing+'px;top:-1px id=startline></div>');
                $(".race").append('<div class=endline style=height:'+scope.spacing+'px;top:-1px id=endline></div>');
            	
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
                            $("#name"+useridx).animate({	            			
                                left: "-475px"
                            },
                            {
                                duration: 2000,
                                easing:"linear"
                            });  
                            $("#ball"+useridx).animate({	            			
                                left: "0px"
                            },
                            {
                                duration: 2000,
                                easing:"linear"
                            });
                            $("#plus"+useridx).animate({	            			
                                left: "0px",
                                opacity: 0
                            },
                            {
                                duration: 2000
                            });
                                    
                            }
                            resetme(0,p);
                        }
                    
                    //vvv this is stupid but I couldn't get it to work with normal timeouts for some reason
                    function countdown(){    
                        var countdown=["3","2","1"];
                        var index=0;
                            function nextone(countdown,index){
                                if(index==0){
                                    document.getElementById("announcer").innerHTML = countdown[index];
                                    index++;
                                }
                                $("#announcer").animate({	            			
                                        left: "32px"
                                },
                                {
                                    duration: 1000,
                                    //easing:"linear"
                                    complete: function(){
                                        document.getElementById("announcer").innerHTML = countdown[index]
                                        if(index<countdown.length-1){
                                            index++;
                                            nextone(countdown,index);
                                        }
                                    }
                                });
                            }
                            nextone(countdown,index);
                    }
                    countdown();
                    
                    //Spaces out the reset and the animation
                    $timeout(function(){
                    for (var p=0; p < scope.flex.players.length; p++) {
                        //Animates the race
                        function animateme(segmentidx,useridx) {
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
                    },3000);
                }
            }
            /*

            function equalize(lowstart, highstart) {
                var result = 0;
                result = highstart - lowstart;
                return result;
            }

            function seperatescores(a, b, c) {
                var list = [];
                for (var i = 0; i < daynum; i++) {
                    list[i] = versus[a].scores[b].days[i].score;
                    list[i] = ((list[i] * (versus[a].scores[b].weight)) / c) * 100;
                }
                return list;
            }

            function sortbyday(a) {
                var list = [];
                for (var i = 0; list.length < a.length; i++) {
                    list[list.length] = a[i];
                    if (kpinum > 1) {
                        for (var j = daynum; j < a.length; j += daynum) {
                            list[list.length] = a[i + j];
                        }
                    }
                }
                return list;
            }

            function mergedays(a) {
                var list = [];
                var groupmin = 0;
                var groupmax = kpinum - 1;
                var sum = [];
                for (var i = 0; i < a.length / kpinum; i++) {
                    var cut = [];
                    cut = cut.concat(a.slice(groupmin, groupmax));
                    var count = 0;
                    for (var j = 0; j < cut.length; j++) {
                        count += cut[j];
                    }
                    sum[i] = count;
                    groupmin += kpinum;
                    groupmax += kpinum;
                }
                list = list.concat(sum);
                return list;
            }

            function mergedays(a) {
                var list = [];
                var sum = 0;
                var n = 0;
                for (var i = 0; i < (a.length / kpinum); i++) {
                    sum = 0;
                    for (var j = 0; j < kpinum; j++) {
                        sum += a[n];
                        n++;
                    }
                    list = list.concat(sum);
                }
                return list;
            }
            var scorelist1 = [];
            var scorelist2 = [];
            var kpinum = 0;
            for (kpi in versus[0].scores) {
                kpinum++;
            }
            var daynum = 0;
            for (var i = 0; i < versus[0].scores[0].days.length; i++) {
                daynum++;
            }
            var totalscore1 = 0;
            var totalscore2 = 0;
            for (var i in versus[0].scores) {
                totalscore1 += (daynum * 10) * (versus[0].scores[i].weight);
            }
            for (var i in versus[0].scores) {
                totalscore2 += (daynum * 10) * (versus[0].scores[i].weight);
            }
            for (var i = 0; i < kpinum; i++) {
                scorelist1 = scorelist1.concat(seperatescores(0, i, totalscore1))
                scorelist2 = scorelist2.concat(seperatescores(1, i, totalscore2))
            }
            scorelist1 = sortbyday(scorelist1);
            scorelist2 = sortbyday(scorelist2);
            scorelist1 = mergedays(scorelist1);
            scorelist2 = mergedays(scorelist2);

            var announcements = [];
            var winner = "";
            if (scorelist1[scorelist1.length - 1] > scorelist2[scorelist2.length - 1]) winner = versus[0].person.firstnm + " " + versus[0].person.lastnm + " wins!";
            else if (scorelist2[scorelist2.length - 1] > scorelist1[scorelist1.length - 1]) winner = versus[1].person.firstnm + " " + versus[1].person.lastnm + " wins!";
            else winner = "It's a tie!";
            var pullsahead = [" pulls ahead of ", " pushes past ", " overtakes "]
            var fallsbehind = [" falls behind ", " gets overtaken by ", " trails behind "]
            var staysahead = [" stays at the front!", " keeps their lead!", " pushes their advantage!"]
            for (var i = 0; i < scorelist1.length; i++) {
                if (scorelist1[i] > scorelist2[i]) {
                    if (scorelist1[i - 1] > scorelist2[i - 1]) {
                        announcements[i] = versus[0].person.firstnm + " " + versus[0].person.lastnm + staysahead[Math.floor((Math.random() * (staysahead.length - 1)))];
                    } else if (Math.floor((Math.random() * 2)) == 0) {
                        announcements[i] = versus[0].person.firstnm + " " + versus[0].person.lastnm + pullsahead[Math.floor((Math.random() * (pullsahead.length - 1)))] + versus[1].person.firstnm + " " + versus[1].person.lastnm + "!";
                    } else {
                        announcements[i] = versus[1].person.firstnm + " " + versus[1].person.lastnm + fallsbehind[Math.floor((Math.random() * (fallsbehind.length - 1)))] + versus[0].person.firstnm + " " + versus[0].person.lastnm + "!";
                    }
                }
                if (scorelist2[i] > scorelist1[i]) {
                    if (scorelist2[i - 1] > scorelist1[i - 1]) {
                        announcements[i] = versus[1].person.firstnm + " " + versus[1].person.lastnm + staysahead[Math.floor((Math.random() * (staysahead.length - 1)))];
                    } else if (Math.floor((Math.random() * 2)) == 0) {
                        announcements[i] = versus[1].person.firstnm + " " + versus[1].person.lastnm + pullsahead[Math.floor((Math.random() * (pullsahead.length - 1)))] + versus[0].person.firstnm + " " + versus[0].person.lastnm + "!";
                    } else {
                        announcements[i] = versus[0].person.firstnm + " " + versus[0].person.lastnm + fallsbehind[Math.floor((Math.random() * (fallsbehind.length - 1)))] + versus[1].person.firstnm + " " + versus[1].person.lastnm + "!";
                    }
                }
                if (scorelist1[i] == scorelist2[i]) {
                    announcements[i] = "The competitors are neck and neck!";
                }
            }
            announcements[announcements.length] = winner;

            var secondslong = 5;
            var colorlist = ["#f44242", "#f47d41", "#f4a041", "#f4be41", "#f4df41", "#d9f441", "#9af441", "#41f44c", "#41f49d", "#41f4d0", "#41d9f4", "#418bf4", "#4941f4", "#7c41f4", "#ac41f4", "#f441f1"];
            var realdist1 = [];
            var realdist2 = [];
            var start1 = [];
            var start2 = [];
            var total1 = 0;
            var total2 = 0;
            var adjustment1 = 0;
            var adjustment2 = 0;
            var barnum = 0;
            var endpoint = 0;
            for (var i = 0; i < scorelist1.length; i++) {
                start1[i] = total1;
                start2[i] = total2;
                if (total1 < total2) {
                    adjustment1 = equalize(start1[i], start2[i]);
                    realdist1[i] = scorelist1[i] + adjustment1;
                } else {
                    adjustment1 = 0;
                    realdist1[i] = scorelist1[i];
                }
                if (total2 < total1) {
                    adjustment2 = equalize(start2[i], start1[i]);
                    realdist2[i] = scorelist2[i] + adjustment2;
                } else {
                    adjustment2 = 0;
                    realdist2[i] = scorelist2[i];
                }
                total1 += realdist1[i];
                total2 += realdist2[i];
                if (scorelist1[scorelist1.length - 1] > scorelist2[scorelist1.length - 1]) endpoint += realdist1[i];
                else endpoint += realdist2[i];
            }

            for (var i = 0; i < scorelist1.length; i++) {
                realdist1[i] = realdist1[i] / endpoint;
                realdist2[i] = realdist2[i] / endpoint;
                start1[i] = start1[i] / endpoint;
                start2[i] = start2[i] / endpoint;
            }
            */




        }
    }

    //Ready

    var index = 0;
    document.getElementById("versusname1").innerHTML = versus[0].person.firstnm + " " + versus[0].person.lastnm;
    document.getElementById("versusname2").innerHTML = versus[1].person.firstnm + " " + versus[1].person.lastnm;

    function bars() {
        lock = true;
        setTimeout(function() {
            $(".track").append("<div class=bar1 style=left:" + start1[index] * 100 + "%;background-color:" + colorlist[index] + " id=barA" + barnum + "></div>");
            $("#barA" + barnum).animate({
                width: realdist1[index] * 100 + "%"
            }, {
                duration: (secondslong * 1000) / daynum,
                easing: "linear"
            });
            $(".track").append("<div class=bar2 style=left:" + start2[index] * 100 + "%;background-color:" + colorlist[index] + " id=barB" + barnum + "></div>")
            $("#barB" + barnum).animate({
                width: realdist2[index] * 100 + "%"
            }, {
                duration: (secondslong * 1000) / daynum,
                easing: "linear"
            });
            document.getElementById("announcer").innerHTML = announcements[index];
            index++;
            barnum++;
            if (index == scorelist1.length) {
                setTimeout(function() {
                    document.getElementById("announcer").innerHTML = announcements[index];
                    $("#start-button").remove();
                    $("#barA" + 1).remove();
                    $(".board").append('<button class=versus-button id=reset-button onclick="reset();return(false);">Reset</button>');
                }, firstcheck)
            }
            if (index != 0) firstcheck = (secondslong * 1000) / daynum;
            if (index < scorelist1.length) {
                bars();
            }
        }, firstcheck)
    }

    function reset() {
        lock = false;
        for (var i = 0; i < scorelist.length; i++) {
            $("#barA" + i).remove();
            $("#barB" + i).remove();
        }



        $("#reset-button").remove();
        $(".board").append("<button class=versus-button id=start-button>Animate</button>");
    }


}]);
