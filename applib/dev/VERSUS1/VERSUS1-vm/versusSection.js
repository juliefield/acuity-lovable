(function () {
    if (!window.jQuery) { alert("This App requires jQuery"); return; }
    var $ = window.jQuery;
    
    
    	function ready() {
        var index=0;
        var lock=false;
        document.getElementById("versusname1").innerHTML=versus[0].person.firstnm+" "+versus[0].person.lastnm;
        document.getElementById("versusname2").innerHTML=versus[1].person.firstnm+" "+versus[1].person.lastnm;
        $("#start-button").on("click",function(){
            if(!lock)bars();
            return false;
        });
        function bars(){
            if(index<scorelist1.length) {
                $(".track").append("<div class=bar1 style=left:"+start1[index]*100+"%;background-color:"+colorlist[index]+" id=barA"+barnum+"></div>");
                $("#barA"+barnum).animate({
                width: realdist1[index]*100+"%"
                }, {duration: (secondslong*1000)/daynum,
                    easing: "linear"
                });
                $(".track").append("<div class=bar2 style=left:"+start2[index]*100+"%;background-color:"+colorlist[index]+" id=barB"+barnum+"></div>")
                $("#barB"+barnum).animate({ 
                width: realdist2[index]*100+"%"
                }, {duration: (secondslong*1000)/daynum,
                    easing: "linear",
                    complete: function() {
							bars();
						} 
                });
                document.getElementById("announcer").innerHTML=announcements[index];
                index++;
                barnum++;
            }
            if(index==scorelist1.length){
                end();
            }
        }
        function reset() {
            lock=false;
            for(var i=0;i<scorelist.length;i++){
                $("#barA"+i).remove();
                $("#barB"+i).remove();
            }
            $("#reset-button").remove();
            $(".board").append("<button class=versus-button id=start-button>Animate</button>");
        }
        function end() {
                document.getElementById("announcer").innerHTML=announcements[index];
                $("#start-button").remove();
                $(".board").append("<button class=versus-button id=reset-button onclick=reset();>Reset</button>");
        }
        }
	var versus = [
		{
			person: {
				agentid: "jsmith",
				firstnm: "Jimmy",
				lastnm: "Smith"
			},
			scores: [
				{
					kpi: "Attendance",
					weight: 0.40,
					days: [
						{ date: "2018-05-01", score: 10.0 },
						{ date: "2018-05-02", score: 3.0 },
						{ date: "2018-05-03", score: 5.0 },
						{ date: "2018-05-04", score: 9.0 },
                        { date: "2018-05-05", score: 4.0 },
                        { date: "2018-05-06", score: 5.0 },
                        { date: "2018-05-07", score: 9.0 }
					]					
				},
				{
					kpi: "Utilization",
					weight: 0.25,
					days: [
						{ date: "2018-05-01", score: 4.0 },
						{ date: "2018-05-02", score: 6.0 },
						{ date: "2018-05-03", score: 8.0 },
						{ date: "2018-05-04", score: 7.0 },
						{ date: "2018-05-05", score: 4.0 },
                        { date: "2018-05-06", score: 8.0 },
                        { date: "2018-05-07", score: 8.0 }
					]					
				}
			]
		},
		{
			person: {
				agentid: "bjones",
				firstnm: "Brian",
				lastnm: "Jones"
			},
			scores: [
				{
					kpi: "Attendance",
					weight: 0.40,
					days: [
						{ date: "2018-05-01", score: 6.0 },
						{ date: "2018-05-02", score: 8.0 },
						{ date: "2018-05-03", score: 7.0 },
						{ date: "2018-05-04", score: 8.0 },
                        { date: "2018-05-05", score: 7.0 },
                        { date: "2018-05-06", score: 5.0 },
                        { date: "2018-05-07", score: 7.0 }
					]					
				},
				{
					kpi: "Utilization",
					weight: 0.25,
					days: [
						{ date: "2018-05-01", score: 3.0 },
						{ date: "2018-05-02", score: 5.0 },
						{ date: "2018-05-03", score: 7.0 },
						{ date: "2018-05-04", score: 5.0 },
                        { date: "2018-05-05", score: 6.0 },
                        { date: "2018-05-06", score: 8.0 },
                        { date: "2018-05-07", score: 5.0 }
					]					
				}
			]
		}
	
	];
	function equalize(lowstart,highstart){
        var result=0;
        result=highstart-lowstart;
        return result;
	}
	function seperatescores(a,b,c){
        var list=[];
        for (var i = 0; i < daynum; i++) {
            list[i] = versus[a].scores[b].days[i].score;
            list[i] = ((list[i]*(versus[a].scores[b].weight))/c)*100;
        }
        return list;
    }
    function sortbyday(a){
        var list=[];
        for (var i=0;list.length<a.length;i++){
            list[list.length]=a[i];
            if(kpinum>1){
            for(var j=daynum;j<a.length;j+=daynum){
                list[list.length]=a[i+j];
            }
            }
        }
        return list;
    }
    function mergedays(a){
        var list=[];
        var groupmin=0;
        var groupmax=kpinum-1;
        var sum=[];
        for (var i=0;i<a.length/kpinum;i++){
            var cut=[];
            cut=cut.concat(a.slice(groupmin,groupmax));
            var count=0;
                for(var j=0;j<cut.length;j++){
                    count+=cut[j];
                }
            sum[i]=count;
            groupmin+=kpinum;
            groupmax+=kpinum;
            }
        list=list.concat(sum);
        return list;
        }
    function mergedays(a){
        var list=[];
        var sum=0;
        var n=0;
        for (var i=0;i<(a.length/kpinum);i++){
            sum=0;
            for(var j=0;j<kpinum;j++){
                sum+=a[n];
                n++;
            }
            list=list.concat(sum);
        }
        return list;
        }
	var scorelist1=[];
	var scorelist2=[];
	var kpinum=0;
	for(kpi in versus[0].scores){
        kpinum++;
    }
    var daynum=0;
    for(var i=0;i<versus[0].scores[0].days.length;i++){
        daynum++;
    }
	var totalscore1=0;
	var totalscore2=0;
	for(var i in versus[0].scores){
        totalscore1+=(daynum*10)*(versus[0].scores[i].weight);
	}
	for(var i in versus[0].scores){
        totalscore2+=(daynum*10)*(versus[0].scores[i].weight);
	}
    for(var i=0;i<kpinum;i++){
        scorelist1=scorelist1.concat(seperatescores(0,i,totalscore1))
        scorelist2=scorelist2.concat(seperatescores(1,i,totalscore2))
	}
    scorelist1=sortbyday(scorelist1);
    scorelist2=sortbyday(scorelist2);
    scorelist1=mergedays(scorelist1);
    scorelist2=mergedays(scorelist2);
    
    var announcements=[];
    var winner="";
    if(scorelist1[scorelist1.length-1]>scorelist2[scorelist2.length-1])winner=versus[0].person.firstnm+" "+versus[0].person.lastnm+" wins!";
    else if(scorelist2[scorelist2.length-1]>scorelist1[scorelist1.length-1])winner=versus[1].person.firstnm+" "+versus[1].person.lastnm+" wins!";
    else winner="It's a tie!";
    var pullsahead=[" pulls ahead of "," pushes past "," overtakes "]
    var fallsbehind=[" falls behind "," gets overtaken by "," trails behind "]
    var staysahead=[" stays at the front!"," keeps their lead!"," pushes their advantage!"]
    for(var i=0;i<scorelist1.length;i++){
        if (scorelist1[i]>scorelist2[i]){
            if (scorelist1[i-1]>scorelist2[i-1]){
                announcements[i]=versus[0].person.firstnm+" "+versus[0].person.lastnm+staysahead[Math.floor((Math.random()*(staysahead.length-1)))];
            }
            else if(Math.floor((Math.random()*2))==0){
                announcements[i]=versus[0].person.firstnm+" "+versus[0].person.lastnm+pullsahead[Math.floor((Math.random()*(pullsahead.length-1)))]+versus[1].person.firstnm+" "+versus[1].person.lastnm+"!";
            }
            else{
                announcements[i]=versus[1].person.firstnm+" "+versus[1].person.lastnm+fallsbehind[Math.floor((Math.random()*(fallsbehind.length-1)))]+versus[0].person.firstnm+" "+versus[0].person.lastnm+"!";
            }
        }
        if (scorelist2[i]>scorelist1[i]){
            if (scorelist2[i-1]>scorelist1[i-1]){
                announcements[i]=versus[1].person.firstnm+" "+versus[1].person.lastnm+staysahead[Math.floor((Math.random()*(staysahead.length-1)))];
            }
            else if(Math.floor((Math.random()*2))==0){
                announcements[i]=versus[1].person.firstnm+" "+versus[1].person.lastnm+pullsahead[Math.floor((Math.random()*(pullsahead.length-1)))]+versus[0].person.firstnm+" "+versus[0].person.lastnm+"!";
            }
            else{
                announcements[i]=versus[0].person.firstnm+" "+versus[0].person.lastnm+fallsbehind[Math.floor((Math.random()*(fallsbehind.length-1)))]+versus[1].person.firstnm+" "+versus[1].person.lastnm+"!";
            }
        }
        if(scorelist1[i]==scorelist2[i]){
            announcements[i]="The competitors are neck and neck!";
        }
    }
    announcements[announcements.length]=winner;
    
    var secondslong=5;
    var colorlist=["#f44242","#f47d41","#f4a041","#f4be41","#f4df41","#d9f441","#9af441","#41f44c","#41f49d","#41f4d0","#41d9f4","#418bf4","#4941f4","#7c41f4","#ac41f4","#f441f1"];
    var realdist1=[];
    var realdist2=[];
    var start1=[];
    var start2=[];
    var total1=0;
    var total2=0;
    var adjustment1=0;
    var adjustment2=0;
    var barnum=0;
    var endpoint=0;
    for(var i=0;i<scorelist1.length;i++){
        start1[i]=total1;
        start2[i]=total2;
        if(total1<total2){ 
            adjustment1=equalize(start1[i],start2[i]);
            realdist1[i]=scorelist1[i]+adjustment1;
        }
        else {adjustment1=0;realdist1[i]=scorelist1[i];}
        if(total2<total1){ 
            adjustment2=equalize(start2[i],start1[i]);
            realdist2[i]=scorelist2[i]+adjustment2;
        }
        else {adjustment2=0;realdist2[i]=scorelist2[i];}
        total1+=realdist1[i];
        total2+=realdist2[i];
        if(scorelist1[scorelist1.length-1]>scorelist2[scorelist1.length-1])endpoint+=realdist1[i];
        else endpoint+=realdist2[i];
    }
    
    for(var i=0;i<scorelist1.length;i++){
        realdist1[i]=realdist1[i]/endpoint;
        realdist2[i]=realdist2[i]/endpoint;
        start1[i]=start1[i]/endpoint;
        start2[i]=start2[i]/endpoint;
    }
    
    // global variables
    window.appVersus = {
        ready: ready
    };
    
})();


