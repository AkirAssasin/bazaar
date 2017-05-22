var map = Raphael('map',340,200);

map.setViewBox(0,0,340,200,true);

var floorPlan = map.path("M240 10L240 130L230 140L190 140L180 130L180 100L160 80L160 50L150 40L50 40L40 50L40 60L30 70L10 70L0 80L0 190L10 200L300 200L310 190L310 80L320 70L330 70L340 60L340 10L330 0L250 0L240 10Z");
floorPlan.attr({"fill":"#FFF","type":"path"});

var svg = document.querySelector("svg");
svg.removeAttribute("width");
svg.removeAttribute("height");
