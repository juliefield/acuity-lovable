//collapseList Plugin - Author: Jeff Gack
//Notes - This needs called after the page has rendered, so be sure to delay by a second or two.
(function ($) {
    $.fn.collapseList = function (options) {
        var settings = $.extend({
            delay: 500,
            renderWait: 1000 //Wait a full second before running to allow time to render (by default).
        }, options);

        var me = this;

        setTimeout(function () { init(); }, settings.renderWait );

        function init() {
            if ($(" .collapse_list_minus", me).length <= 0) {
                var ffwc = false; //found first with children
                $(" > ul > li", me).each(function () {
                    if ($(this).children().length > 0) {
                        if (!ffwc) {
                            $(this).addClass("collapse_list_minus");
                            ffwc = true;
                        }
                        else {
                            $(this).addClass("collapse_list_plus");
                            $(" > ul", this).each(function () { easeclosed(this, 1) });
                        }
                    }
                });
                bind();
            }
        }
        function bind() {
            $(".collapse_list_minus").unbind().bind("click", function () {
                $(" > ul", this).each(function () { easeclosed(this, settings.delay) });
                $(this).removeClass("collapse_list_minus").addClass("collapse_list_plus");
                bind();
            });
            $(".collapse_list_plus").unbind().bind("click", function () {
                $(" > li", $(this).parent()).each(function () {
                    if ($(this).hasClass("collapse_list_minus")) {
                        $(" > ul", this).each(function () { easeclosed(this, settings.delay) });
                        $(this).removeClass("collapse_list_minus").addClass("collapse_list_plus");
                    }
                });
                $(" > ul", this).each(function () { easeopen(this, settings.delay) });

                $(this).removeClass("collapse_list_plus").addClass("collapse_list_minus");
                bind();
            });
        }
        function easeclosed(t, speed) {
            var h = $(t).height();
            $(" .collapse_height", t).remove();
            $(t).prepend('<span class="collapse_height">' + h + '</span>');
            $(t).animate({ height: "0px" }, speed, function () { $(t).hide(); });
        }

        function easeopen(t, speed) {
            var h = $(" .collapse_height", t).html();
            $(" .collapse_height", t).remove();
            $(t).show().animate({ height: h + "px" }, speed);
            $(t).show();
        }
    }
})(jQuery);