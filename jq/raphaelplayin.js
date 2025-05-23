function radialpoint(o) {
    var rad = o.angle * (Math.PI / 180.0);
    return [o.origin[0] + (o.radius * Math.cos(rad)), o.origin[1] + (o.radius * Math.sin(rad))];
}
function piepath(o) {
    var s = radialpoint({ origin: o.origin, radius: o.radius, angle: o.sweep[0] });
    var e = radialpoint({ origin: o.origin, radius: o.radius, angle: o.sweep[1] });
    return "M " + o.origin[0] + "," + o.origin[1] + "L" + s[0] + "," + s[1] + " A" + o.radius + "," + o.radius + " 0 0 0 " + e[0] + "," + e[1] + "z";
}
function bandpath(o) { //TODO: Build out bandpath.
    var so = radialpoint({ origin: o.origin, radius: o.radii[0], angle: o.sweep[0] });
    var eo = radialpoint({ origin: o.origin, radius: o.radii[0], angle: o.sweep[1] });
    var si = radialpoint({ origin: o.origin, radius: o.radii[1], angle: o.sweep[0] });
    var ei = radialpoint({ origin: o.origin, radius: o.radii[1], angle: o.sweep[1] });
    return "M " + si[0] + "," + si[1] + "L" + so[0] + "," + so[1] + " A" + o.radii[0] + "," + o.radii[0] + " 0 0 0 " + eo[0] + "," + eo[1] + " L" + ei[0] + "," + ei[1] + " A" + o.radii[1] + "," + o.radii[1] + " 0 0 1 " + si[0] + "," + si[1] + "z";
}
function logoslice(o) {
    //var red = paper.path(piepath(o.origin[0], o.origin[1], o.radii[0], o.sweep[0], o.sweep[1]));
    //red.attr({ fill: o.color, stroke: "white", "stroke-width": 1, "opacity": "50%" });
    //var redout = paper.path(piepath(o.origin[0], o.origin[1], o.radii[1], o.sweep[0], o.sweep[1]));
    //redout.attr({ fill: "white", stroke: "white", "stroke-width": 1, "opacity": "50%" });

    /*
    var red = paper.path(piepath({ origin: o.origin, radius: o.radii[0], sweep: o.sweep }));
    var redout = paper.path(piepath({ origin: o.origin, radius: o.radii[1], sweep: o.sweep }));
    red.attr({ fill: o.color, stroke: "white", "stroke-width": 1, "opacity": "50%" });
    redout.attr({ fill: "white", stroke: "white", "stroke-width": 1, "opacity": "50%" });
    */
    var slice = paper.path(bandpath(o));  //just passing the input object.
    slice.attr({ fill: o.color, stroke: "white", "stroke-width": 2, "stroke-opacity": 1, "fill-opacity": o.opacity });
    return slice;
}

var paper = Raphael(0, 0, 400, 70);
//var circle = paper.circle(50, 40, 10);
//circle.attr("fill", "#ff0000");
//var red = paper.path("M100,100 l-20,-50 a30,30 0 0 0 -30 30 z");
//var red = paper.path("M100,100 l-20,-50 c0,0 -50,50 50,50 z");
//var red = paper.path("M 200 175 A 25 25 0 0 0 182.322 217.678 z");

/*
var red = paper.path("M 100 100 l 0 -25 A 25 25 0 0 0 75 100 z");
red.attr({ fill: "#D3344A", stroke: "white", "stroke-width": 2 });
var redout = paper.path("M 100 100 l 0 -15 A 15 15 0 0 0 85 100 z");
redout.attr({ fill: "white", stroke: "white", "stroke-width": 2 });
*/
/*
var red = paper.path(piepath(100, 100, 25, 245, 180));
red.attr({ fill: "#D3344A", stroke: "white", "stroke-width": 2 });
var redout = paper.path(piepath(100, 100, 10, 245, 180));
redout.attr({ fill: "white", stroke: "white", "stroke-width": 2 });
*/
//logoslice({ origin: [219, 66], radii: [43, 20], color: "#D3344A", sweep: [240, 179] });
var lof = [0, 0]; //logo offset
var red = logoslice({ origin: [0 + lof[0], 66 + lof[1]], radii: [83, 18], color: "#D3344A", sweep: [240, 179], opacity: 1.0 }); //red
var redfinal = bandpath({ origin: [219 + lof[0], 66 + lof[1]], radii: [43, 18], color: "#D3344A", sweep: [240, 179], opacity: 1.0 });
red.animate({ path: redfinal }, 3000);

//var blue = logoslice({ origin: [196 + lof[0], 60 + lof[1]], radii: [5, 0], color: "#0076BF", sweep: [0, 297], opacity: 1.0 }); //blue
var blue = logoslice({ origin: [196 + lof[0], 60 + lof[1]], radii: [61, 23], color: "#0076BF", sweep: [71, 10], opacity: 1.0 }); //blue
var bluefinal = bandpath({ origin: [196 + lof[0], 60 + lof[1]], radii: [61, 23], color: "#0076BF", sweep: [0, 297], opacity: 1.0 }); //blue
blue.animate({ path: bluefinal }, 3500);

var yellow = logoslice({ origin: [219 + lof[0], 66 + lof[1]], radii: [153, 123], color: "#FAD148", sweep: [275, 213], opacity: 0.8 }); //yellow
var yellowfinal = bandpath({ origin: [219 + lof[0], 66 + lof[1]], radii: [53, 23], color: "#FAD148", sweep: [275, 213], opacity: 0.8 }); //yellow
yellow.animate({ path: yellowfinal }, 5000);

paper.text(265, 55, "TM");
/*
var param = { stroke: "#f00", "stroke-width": 30 };
var sec = paper.path().attr(param).attr({ arc: [0, 60, 200] });
sec.attr("fill", "#ff0000");
sec.animate({ arc: [18, 60, 200] }, 900, ">");
var paper = Raphael(10, 50, 320, 200);

// Creates circle at x = 50, y = 40, with radius 10
var circle = paper.circle(50, 40, 10);
// Sets the fill attribute of the circle to red (#f00)
circle.attr("fill", "#ff0000");

// Sets the stroke attribute of the circle to white
circle.attr("stroke", "#ff0000");

var anim = Raphael.animation({ cx: 10, cy: 20 }, 2e3);
circle.animate(anim.repeat(5));
*/
