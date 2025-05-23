(function ($) {
    $.fn.sideNav = function (options) {
        return;
        var settings = $.extend(true, {
            hideInChildren: true, //When you mouse over internal divs, the navs hide.
            peakPx: 3, //Pixels to remain showing when navs are slid off the screen.
            width: 30, //TODO: Get this from an element (either stylesheet or place one hidden).
            autoShowTag: false, //TODO: Put this in, it will look better in some instances.
            navSelector: null,
            delay: 100,
            prev: {
                class: "",
                text: "",
                link: ""
            },
            next: {
                class: "",
                text: "",
                link: ""
            }
        }, options);
        var mousein = false;
        var mouseinsub = false;
        var offpx = settings.width - settings.peakPx;

        if (settings.navSelector != null) {
            parseNavSelector();
        }

        function parseNavSelector() {
            var curl = window.location.href.split('/').pop();
            settings.prev.text = ""; settings.prev.link = ""; settings.next.text = ""; settings.next.link = "";
            var prev = { text: "", link: "" };
            var found = false, done = false;
            $(settings.navSelector).children().each(function () {
                if (!done) {
                    if (found) {
                        settings.next.text = $(this).children().first().html();
                        settings.next.link = $(this).children().first().attr("href");
                        done = true;
                    }
                    else {
                        if ($(this).children().first().attr("href") == curl) {
                            settings.prev.text = prev.text;
                            settings.prev.link = prev.link;
                            found = true;
                        }
                        prev.text = $(this).children().first().html();
                        prev.link = $(this).children().first().attr("href");
                    }
                }
            });
            if (!found) {
                settings.next.text = $(settings.navSelector).children().first().children().first().html();
                settings.next.link = $(settings.navSelector).children().first().children().first().attr("href");
            }
        }

        $(this).off().on("mouseenter mousemove", function () {
            if (!mouseinsub) {
                if (!mousein) {
                    navIn();
                }
                mousein = true;
            }
        }).on("mouseleave", function () {
            navOut();
            mousein = false;
        });
        if (settings.hideInChildren) {
            $(this).children().each(function () {
                $(this).off().on("mouseenter", function () {
                    navOut();
                    mouseinsub = true;
                    mousein = false;
                }).on("mouseleave", function () {
                    navOut();
                    mouseinsub = false;
                    mousein = false;
                });
            });
        }
        $(this).append('<div class="sideNav_nav sideNav_nav-prev"></div><div class="sideNav_nav sideNav_nav-next"></div><div class="sideNav_tag sideNav_tag-prev ' + settings.prev.class + '">' + settings.prev.text + '</div><div class="sideNav_tag sideNav_tag-next ' + settings.next.class + '">' + settings.next.text + '</div>');
        bindnavs();
        navOut();

        function bindnavs() {
            $(".sideNav_nav-prev").off().on("click", function () {
                gotoPrev();
            }).on("mouseenter mousemove", function () {
                if (!settings.autoShowTag) {
                    $(".sideNav_tag-prev").show().off().on("click", function () {
                        gotoPrev();
                    });
                }
            });
            $(".sideNav_nav-next").off().on("click", function () {
                gotoNext();
            }).on("mouseenter mousemove", function () {
                if (!settings.autoShowTag) {
                    $(".sideNav_tag-next").show().off().on("click", function () {
                        gotoNext();
                    });
                }
            });
        }
        function navIn() {
            if (settings.prev.text != "") {
                $(".sideNav_nav-prev").css("left", "-" + offpx + "px").animate({ left: "0px" }, settings.delay, function () {
                    if (settings.autoShowTag) {
                        $(".sideNav_tag-prev").show().off().on("click", function () {
                            gotoPrev();
                        });
                    }
                });
            }
            if (settings.next.text != "") {
                $(".sideNav_nav-next").css("right", "-" + offpx + "px").animate({ right: "0px" }, settings.delay, function () {
                    if (settings.autoShowTag) {
                        $(".sideNav_tag-next").show().off().on("click", function () {
                            gotoNext();
                        });
                    }
                });
            }
        }
        function navOut() {
            $(".sideNav_tag-next,.sideNav_tag-prev").hide();
            var pxp = offpx;
            var pxn = offpx;
            if (settings.prev.text == "") { pxp = settings.width };
            $(".sideNav_nav-prev").animate({ left: "-" + pxp + "px" }, settings.delay, function () {
                $(".sideNav_tag-prev").hide();
            });
            if (settings.next.text == "") { pxn = settings.width; }
            $(".sideNav_nav-next").animate({ right: "-" + pxn + "px" }, settings.delay, function () {
                $(".sideNav_tag-next").hide();
            });
        }
        function gotoPrev() {
            window.location = settings.prev.link;
            if (settings.navSelector != null) {
                parseNavSelector();
                $(".sideNav_tag-prev").html(settings.prev.text);
                $(".sideNav_tag-next").html(settings.next.text);
            }
            navOut();
        }
        function gotoNext() {
            window.location = settings.next.link;
            if (settings.navSelector != null) {
                parseNavSelector();
                $(".sideNav_tag-prev").html(settings.prev.text);
                $(".sideNav_tag-next").html(settings.next.text);
            }
            navOut();
        }
    };
} (jQuery));