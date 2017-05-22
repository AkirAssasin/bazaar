var map = Raphael('map',340,200);

map.setViewBox(0,0,340,200,true);

var floorPlan = map.path("M240 10L240 130L230 140L190 140L180 130L180 100L160 80L160 50L150 40L50 40L40 50L40 60L30 70L10 70L0 80L0 190L10 200L300 200L310 190L310 80L320 70L330 70L340 60L340 10L330 0L250 0L240 10Z");
floorPlan.attr({"fill":"#f9f6e9","type":"path"});

var publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1_K2G5oFBR6M5zOgE89kdUHLXUtO2wSwtPRCnJzUyf6A/pubhtml';

function init() {
  Tabletop.init( { key: publicSpreadsheetURL,
                   callback: drawSVGPaths,
                   simpleSheet: true } )
}

var boothPath = "M0 0L10 0 L10 10L 0 10Z";

function drawSVGPaths (data, tabletop) {

  for (var i = 0; i < data.length; i++) {

    var booth = map.path(boothPath);
    booth.attr({"type":"path"});

    console.log(booth);

    if (data[i].Booked == 'Y') {
      booth.attr({"fill":"#F00"});
    } else {
      booth.attr({"fill":"#0FF"});
    }

    booth.transform('t' + (data[i].X - 5) + ',' + (data[i].Y - 5) + 'r' + data[i].A + ',5,5');
  }
}

var svg = document.querySelector("svg");
svg.removeAttribute("width");
svg.removeAttribute("height");

window.addEventListener('DOMContentLoaded', init)
