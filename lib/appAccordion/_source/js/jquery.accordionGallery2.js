
	
(function($) {

	$.accordionGallery2 = function(wrapper, settings) {



	
	
	var componentInited=false;
	
	var _body = $('body');
	var _window = $(window);
	var _doc = $(document);
	
	var isMobile = jQuery.browser.mobile;
	var isIEbelow9 = false;
	if ($.browser.msie  && parseInt($.browser.version, 10) < 9) {
	    isIEbelow9 = true;
		//console.log(isIEbelow9);
	} 
	//var isSafari = false;
	//if($.browser.webkit && !window.chrome) isSafari = true;
	
	var componentWrapper = $(wrapper);
	var componentPlaylist = componentWrapper.find('.componentPlaylist');
	var componentScrollWrapper = componentWrapper.find('.componentScrollWrapper');
	var mediaPreloader = componentWrapper.find('.mediaPreloader');

	var useControls=settings.useControls;
	var alignSlides = settings.alignSlides;
	var sameSizeSlides=settings.sameSizeSlides;
	var transitionTime=800;//slide transition
	var transitionEase='easeOutQuint';
	var slideshowOn=settings.slideshowOn;
	var slideshowTimeout = settings.slideshowDelay;
	var playlistArr = [];
	var transitionOn=false;
	var playlistLength;
	var slideContentStartTimeoutID; 
	var detailOpened=false;//pp opened
	var useKeyboardNavigation=settings.useKeyboardNavigation;
	var useGlobalDelay = settings.useGlobalDelay;
	var componentOrientation = settings.componentOrientation;
	var scrollOrientation = componentOrientation == 'horizontal' ? 'horizontal' : 'vertical';
	var counter;
	var slideshowDirection=settings.slideshowDirection;
	var componentWidth = parseInt(componentPlaylist.css('width'),10);//
	var componentHeight = parseInt(componentPlaylist.css('height'),10);//
	//console.log(componentWidth,componentHeight);
	var componentSize = componentOrientation == 'horizontal' ? componentWidth : componentHeight;
	var animProp = componentOrientation == 'horizontal' ? 'left' : 'top';
	var visibleItems = settings.visibleItems;
	var totalItems;
	var allSlidesVisible=false;
	var lastHitDiv=null;//for restoring hit on last opened slide
	//scroll
	var scrollContentSize;
	var scrollPaneApi;
	var contentFactorMoveValue;
	var openOnRollover = isMobile ? false : settings.openOnRollover;
	var keepSelection = settings.keepSelection;
	var resetAllTimeoutID;//if keepSelection = false, set playlist size and reinitialize scroll api after timeout so it doesnt execute every slide rollout
	
	//controls
	var componentControls=componentWrapper.find('.componentControls');
	var controls_previous = componentControls.find('.controls_previous');
	var controls_toggle = componentControls.find('.controls_toggle');
	var controls_pause = componentControls.find('.controls_pause');
	var controls_pause2 = componentControls.find('.controls_pause2');
	var controls_play = componentControls.find('.controls_play');
	var controls_play2 = componentControls.find('.controls_play2');
	var controls_next = componentControls.find('.controls_next');
	var controlsToggleSrc = controls_toggle.children('img');
	var toggleBtnHeight = controls_pause2.height();
	//console.log(toggleBtnHeight);
			
	controls_previous.css('cursor', 'pointer');
	controls_toggle.css('cursor', 'pointer');
	controls_next.css('cursor', 'pointer');
	controls_previous.bind('click touchstart MozTouchDown', toggleControls);
	controls_toggle.bind('click touchstart MozTouchDown', toggleControls);
	controls_next.bind('click touchstart MozTouchDown', toggleControls);
	
	controls_play.css('display', 'none');
	controls_pause.css('display', 'none');
	
	if(!slideshowOn){
		controls_play.css('display', 'block');
	}else{
		controls_pause.css('display', 'block');
	}

	var componentHit=false;
	componentWrapper.mouseenter(function(e){       
		//console.log("enter");
		componentHit=true;
		if(slideshowOn) pauseSlideshow();
	}).mouseleave(function(){
		//console.log("leave");
		componentHit=false;
		if(slideshowOn && !detailOpened) resumeSlideshow();
	});
	
	if(useKeyboardNavigation){
		_doc.keyup(function(e){
			if (!e) var e = window.event;
			if(e.cancelBubble) e.cancelBubble = true;
			else if (e.stopPropagation) e.stopPropagation();

			//console.log(event.keyCode);
			var key = e.keyCode;
			if(key == 37) {//left arrow
			    previousSlide();
			} 
			else if(key == 39) {//right arrow
				if(slideshowDirection == 'forward'){
					nextSlide();
				}else{
					forcedNextSlide();
				}
			}
			else if(key == 32) {//space
				toggleSlideshow();
			}
			return false;
		});
	}
	
	setup();
		
	function setup(){	
		//console.log('setup');
	
		var j, div,divSize, i = 0,playlist = componentPlaylist.find("div[class=slide]"), dw, dh, ct, fontMeasure = componentWrapper.find('.fontMeasure'), linkDiv, hitDiv, slide_content;
		playlistLength = playlist.length;
		
		totalItems = playlistLength;
		if(visibleItems > totalItems) visibleItems = totalItems;
		if(visibleItems == totalItems) allSlidesVisible =true;
		
		//get playlist
		playlist.each(function() { 
			//console.log($(this));
			playlistArr.push($(this));
		});
		
		for(i; i <playlistLength; i++){
			
			div = $(playlistArr[i]);
			div.attr('data-id', i);
			
			//set slide dimensions
			if(sameSizeSlides){
				if(componentOrientation == 'horizontal'){
					dw = parseInt(div.css('width'),10);
					div.data('itemSize', dw);
				}else{
					dh = parseInt(div.css('height'),10);
					div.data('itemSize', dh);
				}
			}else{
				if(componentOrientation == 'horizontal'){
					if(div.attr('data-width') != undefined && !isEmpty(div.attr('data-width'))){
						dw = parseInt(div.attr('data-width'),10);
						div.css('width', dw+'px');//different width, height is the same for all
						div.data('itemSize', dw);
					}else{
						alert("Slides are missing 'data-width' attributtes!");
						return; 
					}
				}else{
					if(div.attr('data-height') != undefined && !isEmpty(div.attr('data-height'))){
						dh = parseInt(div.attr('data-height'),10);
						div.css('height', dh+'px');//different height, width is the same for all
						div.data('itemSize', dh);
					}else{
						alert("Slides are missing 'data-height' attributtes!");
						return; 
					}
				}
			}
			
		
			
			
			//attach click to detect pp open
			div.find('a[class=pp_content]').bind('click', function(){
				detailOpened=true;
				if(slideshowOn) pauseSlideshow();
				detailActivated2();
				return false;
			});
			
			
			dw = parseInt(div.css('width'),10);
			dh = parseInt(div.css('height'),10);
			
			//check slide link
			if(div.attr('data-link') != undefined && !isEmpty(div.attr('data-link'))){
				//console.log(div.attr('data-link'));
				linkDiv = $("<div />");
				linkDiv.css({
					position: 'absolute',
					left: 0+'px',	
					top: 0+'px',
					width: dw+'px',	
					height: dh+'px',		
					background: '#00ff00',
					opacity:0,
					cursor: 'pointer'
				});
				var link = div.attr('data-link'),target;
				if(div.attr('data-target') != undefined && !isEmpty(div.attr('data-target'))){
					target = div.attr('data-target');
				}else{
					target = '_blank';
				}
				var a = $("<a href="+link+" target="+target+" ></a>"); 
				a.append(linkDiv);
				div.append(a);
			}
			
			if(openOnRollover){
				div.bind('mouseenter', overCategoryItem);
				div.bind('mouseleave', outCategoryItem);
			}else{
				
				//check slide hit on top, only for open on click, not needed for open on rollover 
				if(div.attr('data-preventDefaultOnOpen') != undefined && div.attr('data-preventDefaultOnOpen') == 'true'){
					//console.log(div.attr('data-preventDefaultOnOpen'));
					hitDiv = $("<div />");
					hitDiv.css({
						position: 'absolute',
						left: 0+'px',	
						top: 0+'px',
						width: dw+'px',	
						height: dh+'px',		
						background: '#ff0000',
						opacity:0,
						cursor: 'pointer'
					});
					div.append(hitDiv);
					div.data('preventDefaultOnOpen', hitDiv);
					hitDiv.bind('click touchstart MozTouchDown', openSlideOnClick);
					hitDiv.attr('data-id', i);
				}else{
					div.bind('click touchstart MozTouchDown', openSlideOnClick);
				}
				//console.log(div.data('preventDefaultOnOpen'));
			}
			
			
			//check for slide_content
			if(div.find("div[class=slide_content]").length>0){
				//console.log(i);
				slide_content = div.find("div[class=slide_content]");
				div.data('slideContent', slide_content);
			}
		}
		
		componentScrollWrapper.animate({'opacity': 1},  {duration: 1000, easing: "easeOutSine"});//show playlist
		
		distributeSpace();//counter resets here
		counter=settings.activeItem;
		if(counter > playlistLength-1) counter = playlistLength-1;
	
		if(useControls){
			componentControls.css('opacity', 0);
			componentControls.css('display', 'block');
			componentControls.stop().animate({'opacity': 1}, {duration: 1000, easing: "easeOutSine"});
		}
		
		scrollPaneApi = componentScrollWrapper.jScrollPane().data().jsp;//after componentScrollWrapper size set
		setPlaylistSize();
		componentScrollWrapper.bind('jsp-initialised',function(event, isScrollable){
			//console.log('Handle jsp-initialised', this,'isScrollable=', isScrollable);
		});
		if(scrollOrientation == 'horizontal'){
			componentPlaylist.bind('mousewheel', horizontalMouseWheel);
			componentScrollWrapper.jScrollPane({
				enableKeyboardNavigation:false,
				/*
				//enableKeyboardNavigation: if true (which is default), causes weird glitch when keys are used to change slides.
				to replicate: start with slide 0, slideshow off. Use keys to move 2 slides forward one by one, then click on first slide with mouse to come back, then use keyboard to move forward again (without clicking on body again! (non component)), and glitch happens.
				edit:
				only happens in horizontal?
				*/
				maintainPosition:true,
				/*stickToRight:true,*/
				horizontalDragMinWidth: 60,
				horizontalDragMaxWidth: 70
			});
		}else{
			componentScrollWrapper.jScrollPane({
				enableKeyboardNavigation:false,
				maintainPosition:true,
				/*stickToBottom:true,*/
				verticalDragMinHeight: 60,
				verticalDragMaxHeight: 70
			});
		}
		
		mediaPreloader.css('display','none');
		componentInited=true;
		accordionGalleryReady2();
		
		if(slideshowOn){
			if(counter==-1) counter=0;
			openSlide(counter);
		}else{
			if(counter!=-1) openSlide(counter);
		}
	}
	
	function setPlaylistSize(reinitialise){
		//console.log('setPlaylistSize, reinitialise = ', reinitialise);
		if(componentOrientation == 'horizontal'){
			componentPlaylist.css('width',scrollContentSize+'px');
			
			if(counter != -1){
				if(reinitialise) scrollPaneApi.reinitialise();
				
				if(!alignSlides) return;
				if(!contentFactorMoveValue) return;//
				//console.log(contentFactorMoveValue);
				
				var deduct = Math.floor((visibleItems-1)/2);
				//console.log('deduct = ', deduct);
				var x = Math.abs((counter-deduct)*contentFactorMoveValue);
				//console.log('x = ', x);
				
				if(counter < Math.ceil(visibleItems/2)){///align dragger/content to left
					x=0;	
				}/*else if(counter > totalItems - Math.ceil(visibleItems/2)){
				}*/
				//console.log('x = ', x);
				scrollPaneApi.scrollToX(x,true);
			}
		}else{
			componentPlaylist.css('height',scrollContentSize+'px');
			if(counter != -1){
				if(reinitialise) scrollPaneApi.reinitialise();
				
				if(!alignSlides) return;
				if(!contentFactorMoveValue) return;//
				
				var deduct = Math.floor((visibleItems-1)/2);
				//console.log('deduct = ', deduct);
				var y = Math.abs((counter-deduct)*contentFactorMoveValue);
				//console.log('x = ', x);
				
				if(counter < Math.ceil(visibleItems/2)){///align dragger/content to left
					y=0;	
				}/*else if(counter > totalItems - Math.ceil(visibleItems/2)){
				}*/
				//console.log('y = ', y);
				scrollPaneApi.scrollToY(y,true);
			}
		}
	}
	
	function horizontalMouseWheel(event, delta, deltaX, deltaY){
		if(!componentInited || !scrollPaneApi) return;
		var d = delta > 0 ? -1 : 1;//normalize
		if(scrollPaneApi) scrollPaneApi.scrollByX(d * 20);
		return false;
	}
	
	
	
	
	
	
	
	 function openSlideOnClick(e) {
		overCategoryItem(e);
	 }
	
	 function overCategoryItem(e) {
		if(!componentInited) return;
		componentHit = true;
		if(slideshowOn) pauseSlideshow();
		 
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('data-id');
		//console.log(id);
		
	    if(currentTarget.opened) return;
	 	//console.log('overCategoryItem', id);
	 
		hidePreviousSlideData(counter);
		counter=id;
		openSlide(counter);
		
		return false;
	}
	
	 function outCategoryItem(e) {
		if(!componentInited) return; 
		 
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var id = $(currentTarget).attr('data-id');
		//console.log('outCategoryItem', id);
		
		if(slideshowOn){
			resumeSlideshow();
		}else{
			if(!keepSelection){
				hidePreviousSlideData(id);
				distributeSpace('tween');
				if(resetAllTimeoutID) clearTimeout(resetAllTimeoutID);
				resetAllTimeoutID = setTimeout(resetAll, transitionTime);
			}
		}
		componentHit = false;
		return false;
	}
	
	function hidePreviousSlideData(id) {
		if(id == -1) return;
		
		beforeSlideChange2(id);
		
		if(slideContentStartTimeoutID) clearTimeout(slideContentStartTimeoutID);
		removeSlideContent(id);
	}
	
	function openSlide(j) {
		//console.log('openSlide ', j);
		if(!componentInited) return;
		transitionOn=true;
		resetTimer();

		var item,itemToMove = playlistArr[j],i = 0,newPos,id,size,itemSize,z = 0,p = 0,activeX = 0,prop = {};
		
		//check for hit
		if(lastHitDiv){
			lastHitDiv.css('display','block');
			lastHitDiv=null;	
		}
		if(itemToMove.data('preventDefaultOnOpen')){
			lastHitDiv=itemToMove.data('preventDefaultOnOpen');
			lastHitDiv.css('display','none');	
		}
		
		itemSize = parseInt(itemToMove.data('itemSize'), 10);
		contentFactorMoveValue =( componentSize - itemSize) / (visibleItems - 1);
		scrollContentSize = parseInt((itemSize + (contentFactorMoveValue * (totalItems-1))), 10);
		//console.log('contentFactorMoveValue = ', contentFactorMoveValue );
		
		for(i; i< playlistLength; i++) {
				
			item = $(playlistArr[i]);
			id = item.attr('data-id');
			
			if(i < j){//before
				
				newPos = p * contentFactorMoveValue;
				//console.log('before ', i, ' ', newPos);
				prop[animProp] = newPos + 'px';
				
				item.stop().animate(prop,  {duration: transitionTime, easing: transitionEase});
				
				p++;
				
				if(item.attr('data-id') != j){
					item[0].opened = false;
				}else{
					item[0].opened = true;
				}
				
			}
			else if(i == j)	{//active
				
				activeX = j * contentFactorMoveValue;
				//console.log('active ', i, ' ', newPos);
				prop[animProp] = activeX + 'px';
				
				item.stop().animate(prop,  {duration: transitionTime, easing: transitionEase});
				
				if(item.attr('data-id') != j){
					item[0].opened = false;
				}else{
					item[0].opened = true;
				}
				
			}
			else if(i > j)	{//after
				
				newPos = activeX + itemToMove.data('itemSize') + z * contentFactorMoveValue;
				//console.log('after ', i, ' ', newPos);
				prop[animProp] = newPos + 'px';
				
				item.stop().animate(prop,  {duration: transitionTime, easing: transitionEase});
				
				z++;
				
				if(item.attr('data-id') != j){
					item[0].opened = false;
				}else{
					item[0].opened = true;
				}
			}
		}
		
		setPlaylistSize(true);
		
		afterSlideChange2(j);
		
		if(slideContentStartTimeoutID) clearTimeout(slideContentStartTimeoutID);
		slideContentStartTimeoutID = setTimeout(function(){checkSlideContent(j)},transitionTime/3);
	}
		
	function distributeSpace(tween) {
		
		var item,i = 0,newPos, prop = {};
		
		scrollContentSize = parseInt((totalItems * (componentSize / visibleItems)), 10);
		var factor = scrollContentSize / totalItems;

		for(i; i< playlistLength; i++) {
			item = $(playlistArr[i]);
			newPos= i * factor;
			//console.log(newPos);
			prop[animProp] = newPos + 'px';
			
			item.stop().animate(prop,  {duration: tween ? transitionTime : 0, easing: transitionEase});
			item[0].opened = false;
		}
		
		/*if(!keepSelection){//fires on every slide change
			if(componentOrientation == 'horizontal'){
				componentPlaylist.css('width',scrollContentSize+'px');
			}else{
				componentPlaylist.css('height',scrollContentSize+'px');
			}
			if(scrollPaneApi) scrollPaneApi.reinitialise();
		}*/
		
		counter=-1;//reset
	}
	
	function resetAll() {//fires on component rollout and distributeSpace finish
		//console.log('resetAll');
		if(resetAllTimeoutID) clearTimeout(resetAllTimeoutID);
		if(componentOrientation == 'horizontal'){
			componentPlaylist.css('width',scrollContentSize+'px');
		}else{
			componentPlaylist.css('height',scrollContentSize+'px');
		}
		if(scrollPaneApi) scrollPaneApi.reinitialise();
	}
	
	//********
	
	function toggleControls(e){
		if(!componentInited) return;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = e.currentTarget;
		var c = $(currentTarget).attr('class');
		
		if(c == 'controls_previous'){
			previousSlide();
		}
		else if(c == 'controls_toggle'){
			toggleSlideshow();
		}
		else if(c == 'controls_next'){
			if(slideshowDirection == 'forward'){
				nextSlide();
			}else{
				forcedNextSlide();
			}
		}
		return false;
	}
	
	function forcedNextSlide(){//if direction backward make 'next slide' forward
		hidePreviousSlideData(counter);
		counter++;
		if(counter>playlistLength - 1) counter=0;//loop
		openSlide(counter);
	}
	
	function nextSlide(){
		hidePreviousSlideData(counter);
		if(slideshowDirection == 'forward'){
			counter++;
			if(counter>playlistLength - 1) counter=0;//loop
		}else{
			counter--;
			if(counter<0) counter=playlistLength - 1;//loop
		}
		openSlide(counter);
	}
	
	function previousSlide(){
		hidePreviousSlideData(counter);
		counter--;
		if(counter<0) counter=playlistLength - 1;//loop
		openSlide(counter);
	}
	
	//find new delay for slide
	function getSlideshowDelay(){
		var nextDelay,reserve= 3000;
		if(useGlobalDelay){
			//console.log('useGlobalDelay');
			nextDelay = slideshowTimeout > 0 ? slideshowTimeout : reserve;
		}else{
			var slide = $(dataArr[counter]);
			if(slide.attr('data-delay') != undefined && !isEmpty(slide.attr('data-width'))){
				nextDelay = slide.attr('data-delay');
				//console.log('nextDelay = ', nextDelay);
			}else{
				alert("You are missing 'data-delay' attribbute in slides, since you are not using global slideshow delay!");
				nextDelay = slideshowTimeout > 0 ? slideshowTimeout : reserve;
			}
		}
		return nextDelay;
	}
	
	$.accordionGallery2.checkSlideshow2 = function(){//called after prettyphoto detail close (public function)
		detailOpened=false;
		if(slideshowOn){
			controls_play.css('display', 'none');
			controls_pause.css('display', 'block');
			if(!transitionOn){
				resumeSlideshow();
			}
		}	
		detailClosed2();
	}
	
	function checkSlideshow(){
		if(slideshowOn && !componentHit){
			var d = getSlideshowDelay();
			controls_pause2.stop().animate( {height: 0+'px'}, {duration: d, easing: 'linear'});
			controls_play2.stop().animate( {height: 0+'px'}, {duration: d, easing: 'linear',complete: nextSlide});
		}
	}
	
	function pauseSlideshow(){
		controls_pause2.stop();
		controls_play2.stop();
		controls_play.css('display', 'block');
		controls_pause.css('display', 'none');
	}
	
	function resumeSlideshow(){
		//console.log('resumeSlideshow');
		//calculate new time
		controls_play.css('display', 'none');
		controls_pause.css('display', 'block');
			
		var h=controls_pause2.height();
		var d = getSlideshowDelay();
		var newTime=h/toggleBtnHeight * d;
		if(newTime < 0) newTime=0;
		//console.log(newTime);
		controls_pause2.stop().animate( {height: 0+'px'}, {duration: newTime, easing: 'linear'});
		controls_play2.stop().animate( {height: 0+'px'}, {duration: newTime, easing: 'linear', complete: nextSlide});
	}
	
	function resetTimer(){
		controls_pause2.stop();
		controls_play2.stop();
		controls_pause2.animate( {height: toggleBtnHeight+'px'}, {duration: 500, easing: 'easeOutExpo' } );
		controls_play2.animate( {height: toggleBtnHeight+'px'}, {duration: 500, easing: 'easeOutExpo' } );
	}
	
	function toggleSlideshow(){
		if(slideshowOn){
			pauseSlideshow();
			slideshowOn = false;
		}else{
			slideshowOn=true;
			controls_play.css('display', 'none');
			controls_pause.css('display', 'block');
			if(!transitionOn){
				resumeSlideshow();
			}
		}	
	}
	
	function toggleSlideshow2(state){
		if(state){//start
			slideshowOn=true;
			controls_play.css('display', 'none');
			controls_pause.css('display', 'block');
			if(!transitionOn){
				resumeSlideshow();
			}
		}else{//stop
			pauseSlideshow();
			slideshowOn = false;
		}
	}
	
	//************** slide content
	
	function removeSlideContent(id){
		if(playlistArr[id].data('slideContent') == undefined) return;
		var slideContent = playlistArr[id].data('slideContent');
		if(slideContent) slideContent.stop().animate({opacity: 0}, {duration: 500, easing: "easeOutSine"});
	}
	
	function checkSlideContent(id){
		//console.log('checkSlideContent');
		if(playlistArr[id].data('slideContent') != undefined){
			
			var slideContent = playlistArr[id].data('slideContent');

			slideContent.stop().animate({opacity: 1}, {
			duration: 500, 
			easing: "easeOutSine",
			complete: function(){
				transitionOn=false;
				checkSlideshow(); 
			}});
			
		}else{
			transitionOn=false;
			checkSlideshow();
		}
	}
	
	//**********  HELPER FUNCTIONS 
	
	function isEmpty(str) {
	    return str.replace(/^\s+|\s+$/g, '').length == 0;
	}
	
	// ******************************** PUBLIC FUNCTIONS **************** //
	
	$.accordionGallery2.toggleSlideshow = function(state) {
		if(!componentInited) return;
		if(state == undefined){
			toggleSlideshow();
		}else{
			toggleSlideshow2(state);
		}
	}
	
	$.accordionGallery2.toggleDirection = function(dir) {
		if(!componentInited) return;
		if(!dir || !isEmpty(dir)){
			if(slideshowDirection == 'forward'){
				slideshowDirection = 'backward';	
			}else{
				slideshowDirection = 'forward';	
			}
		}else{
			slideshowDirection = dir;
		}
	}
	
	$.accordionGallery2.setSlideshowDelay = function(num) {
		if(!componentInited) return;
		slideshowTimeout = num;
	}
	
	$.accordionGallery2.nextMedia = function() {
		if(!componentInited) return;
		if(slideshowDirection == 'forward'){
			nextSlide();
		}else{
			forcedNextSlide();
		}
	}
	
	$.accordionGallery2.previousMedia = function() {
		if(!componentInited) return;
		previousSlide();
	}
	
	$.accordionGallery2.openMedia = function(num) {
		if(!componentInited) return;
		if(num<0)num=0;
		else if(num>playlistLength-1)num=playlistLength-1;
		hidePreviousSlideData(num);
		counter=num;
		openSlide(counter);
	}

	
	}
	
})(jQuery);



/**
 * jQuery.browser.mobile (http://detectmobilebrowser.com/)
 *
 * jQuery.browser.mobile will be true if the browser is a mobile device
 *
 **/
(function(a){jQuery.browser.mobile=/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iPad|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))})(navigator.userAgent||navigator.vendor||window.opera);
