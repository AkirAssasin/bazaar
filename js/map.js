var map = Raphael('map',340,200);

map.setViewBox(0,0,340,200,true);

var floorPlan = map.path("M240 10L240 130L230 140L190 140L180 130L180 100L160 80L160 50L150 40L50 40L40 50L40 60L30 70L10 70L0 80L0 190L10 200L300 200L310 190L310 80L320 70L330 70L340 60L340 10L330 0L250 0L240 10Z");
floorPlan.attr({"fill":"#162f34","stroke":"none","type":"path"});

var publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1_K2G5oFBR6M5zOgE89kdUHLXUtO2wSwtPRCnJzUyf6A/pubhtml';

function init() {
  Tabletop.init( { key: publicSpreadsheetURL,
                   callback: drawSVGPaths,
                   simpleSheet: true } )
}

var boothPath = "M0 3L1 0L11 0L12 3L11 6L1 6Z";

var boothOriginX = 6;
var boothOriginY = 3;

var bookedOutline = "#255058";
var freeOutline = "#e4d699";
var normalFill = "#255058";
var premiumFill = "#c8ac35";

function drawSVGPaths (data, tabletop) {

  for (var i = 0; i < data.length; i++) {

    var booth = map.path(boothPath);
    booth.attr({"type":"path","stroke":"none"});

    console.log(booth);

    if (data[i].Booked == 'N') {
      booth.attr({"stroke":freeOutline});
      if (data[i].Type == 'Premium') {
        booth.attr({"fill":premiumFill});
      } else {
        booth.attr({"fill":normalFill});
      }
    } else {
      booth.attr({"stroke":bookedOutline,"fill":normalFill});
    }



    booth.transform('t' + (data[i].X - boothOriginX) + ',' + (data[i].Y - boothOriginY)
      + 'r' + data[i].A + ',' + boothOriginX + ',' + boothOriginY);

    console.log('Complete');
  }
}

var svg = document.querySelector("svg");
svg.removeAttribute("width");
svg.removeAttribute("height");

window.addEventListener('DOMContentLoaded', init)
