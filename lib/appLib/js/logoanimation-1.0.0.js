
(function ($) {

    $.AcuityLogoAnimate = function (options) {
        options.canvas.clear();

        var lof; //logo offset
        var red_start_rad, red_final_rad;
        var blue_rad;
        var lofnb;
        var loft;
        var yellow_start_rad, yellow_final_rad;
        $(".logo").css("width", "175px")
        lof = [4, -4];
        if (options) if (options.offset) lof = options.offset;
        red_start_rad = [83, 18];
        red_final_rad = [43, 18];
        blue_rad = [61, 23];
        lofnb = [0, 0];
        yellow_start_rad = [153, 123];
        yellow_final_rad = [53, 23];
        loft = [0, 0];
        function radialpoint(o) {
            var rad = o.angle * (Math.PI / 180.0);
            return [o.origin[0] + (o.radius * Math.cos(rad)), o.origin[1] + (o.radius * Math.sin(rad))];
        }
        function bandpath(o) {
            var so = radialpoint({ origin: o.origin, radius: o.radii[0], angle: o.sweep[0] });
            var eo = radialpoint({ origin: o.origin, radius: o.radii[0], angle: o.sweep[1] });
            var si = radialpoint({ origin: o.origin, radius: o.radii[1], angle: o.sweep[0] });
            var ei = radialpoint({ origin: o.origin, radius: o.radii[1], angle: o.sweep[1] });
            return "M " + si[0] + "," + si[1] + "L" + so[0] + "," + so[1] + " A" + o.radii[0] + "," + o.radii[0] + " 0 0 0 " + eo[0] + "," + eo[1] + " L" + ei[0] + "," + ei[1] + " A" + o.radii[1] + "," + o.radii[1] + " 0 0 1 " + si[0] + "," + si[1] + "z";
        }
        function logoslice(o) {
            var slice = options.canvas.path(bandpath(o));  //just passing the input object.
            slice.attr({ fill: o.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 1, "fill-opacity": o.opacity });
            return slice;
        }
        var red = logoslice({ origin: [0 + lof[0], 66 + lof[1]], radii: red_start_rad, color: "#D3344A", sweep: [240, 179], opacity: 1.0 }); //red
        var redfinal = bandpath({ origin: [219 + lof[0], 66 + lof[1]], radii: red_final_rad, color: "#D3344A", sweep: [240, 179], opacity: 1.0 });
        red.animate({ path: redfinal }, 3000, ">");

        var blue = logoslice({ origin: [196 + lof[0] + lofnb[0], 60 + lof[1] + lofnb[1]], radii: blue_rad, color: "#0076BF", sweep: [71, 10], opacity: 1.0 }); //blue
        var bluefinal = bandpath({ origin: [196 + lof[0] + lofnb[0], 60 + lof[1] + lofnb[1]], radii: blue_rad, color: "#0076BF", sweep: [0, 297], opacity: 1.0 }); //blue
        blue.animate({ path: bluefinal }, 3500, ">");

        var yellow = logoslice({ origin: [219 + lof[0], 66 + lof[1]], radii: yellow_start_rad, color: "#FAD148", sweep: [275, 213], opacity: 0.8 }); //yellow
        var yellowfinal = bandpath({ origin: [219 + lof[0], 66 + lof[1]], radii: yellow_final_rad, color: "#FAD148", sweep: [275, 213], opacity: 1.0 }); //yellow
        yellow.animate({ path: yellowfinal }, 5000, "bounce");

        options.canvas.text(265 + lof[0] + loft[0], 55 + lof[1] + loft[1], "TM");
    };
} (jQuery));