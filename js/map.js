var map = Raphael('map',490,270);

map.setViewBox(0,0,490,270,true);

var publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1_K2G5oFBR6M5zOgE89kdUHLXUtO2wSwtPRCnJzUyf6A/pubhtml';

function init() {
  Tabletop.init( { key: publicSpreadsheetURL,
                   callback: drawSVGPaths,
                   simpleSheet: true } )
}

/*
var boothPath = "M0 3L1 0L11 0L12 3L11 6L1 6Z";

var boothOriginX = 6;
var boothOriginY = 3;
*/

var boothRadius = 3;

var floorOutline = "#081214";
var floorFill = "#524E45";

var boothOutline = "#555555";
var electricOutline = "#FFFF00";

var bookedFill = "#333333";
var premiumFill = "#DADBDE";
var normalFill = "#9CB0BD";

var normalPrice = "RM80, RM65 for ACE-Ed";
var premiumPrice = "RM105, RM90 for ACE-Ed";

var $map = $('#map');
var $infobox = $('.booth-info');

var easing = "cubic-bezier(0.215, 0.61, 0.355, 1)";
var planMilliseconds = 3000;
var planAnimation = Raphael.animation({"opacity":"1"},planMilliseconds,easing,function(e){});

var boothMilliseconds = 1000;
var randomMilliseconds = 1000;
var boothAnimation = Raphael.animation({"opacity":"1"},boothMilliseconds,easing,function(e){});

var infoboxIsClosed = true;

function drawSVGPaths (data, tabletop) {

  //var floorPlan = map.path("M240 10L240 130L230 140L190 140L180 130L180 100L160 80L160 50L150 40L50 40L40 50L40 60L30 70L10 70L0 80L0 190L10 200L300 200L310 190L310 80L320 70L330 70L340 60L340 10L330 0L250 0L240 10Z");
  var floorPlan = map.path("M410 0L420 10L420 60L410 70L370 70L370 150L480 150L490 160L490 260L480 270L420 270L410 260L410 220L260 220L250 210L10 210L0 200L0 90L10 80L160 80L170 90L170 120L200 120L210 130L210 160L250 160L260 150L290 150L290 10L300 0L410 0Z");
  floorPlan.attr({"fill":floorFill,"opacity":"0","stroke":floorOutline,"type":"path"});
  floorPlan.animate(planAnimation);

  for (var i = 0; i < data.length; i++) {

    var booth = map.circle(data[i].X,data[i].Y,boothRadius);
    booth.attr({"type":"path","stroke":"none","opacity":"0"});

    if (data[i].Booked == 'Y') {

      booth.attr({"fill":bookedFill});
      booth.attr({"stroke":boothOutline});

    } else {

      if (data[i].Electricity == 'N') {
        booth.attr({"stroke":boothOutline});
      } else {
        booth.attr({"stroke":electricOutline});
      }

      if (data[i].Type == 'Premium') {
        booth.attr({"fill":premiumFill});
      } else {
        booth.attr({"fill":normalFill});
      }

    }

    booth.data({"boothID":data[i].ID,"boothState":data[i].Booked,
      "boothType":data[i].Type,"boothElectricity":data[i].Electricity});

      var delay = planMilliseconds - (Math.random() * randomMilliseconds);
      //console.log(delay);
    booth.animate(boothAnimation.delay(delay));

    /*
    booth.hover(function(e){
      this.node.style.opacity = 1;
    }, function(e){
      this.node.style.opacity = 0.8;
    });*/


    booth.mousedown(function(e) {

      var posx;
      var posy;

      if (typeof e !== 'undefined') {

        posx = e.pageX;
        posy = e.pageY;

        $infobox.find('.booth-number').text(this.data("boothID"));

        if (this.data("boothState") == 'N') {

          if (this.data("boothType") == 'Premium') {
            $infobox.find('.booth-desc').text(premiumPrice);
          } else {
            $infobox.find('.booth-desc').text(normalPrice);
          }

          $infobox.find('.booth-site').removeClass("hidden");

          $infobox.find('.booth-tag').text(this.data("boothType"));

        } else {

          $infobox.find('.booth-desc').text("This booth has been booked by someone else.");

          $infobox.find('.booth-site').addClass("hidden");

          $infobox.find('.booth-tag').text("");

        }


        if (!infoboxIsClosed) {
          $infobox.css({'transition' : 'all 0.5s ease-in-out'});
        }

        infoboxIsClosed = false;

        if (posx < $(window).width()/2) {
          $infobox.css({'left': posx + 'px','max-width': ($(window).width() - posx) + 'px'});
        } else {
          $infobox.css({'left': (posx - $infobox.width() - 55) + 'px','max-width': posx + 'px'});
        }

          //$infobox.css({'top': ($map.offset().top + $map.height()/2  - $infobox.height()/2) + 'px'});


          //console.log(posy,$map.offset().top + $map.height()/2);

          //var exceed = $map.offset().top + $map.height();
          //var currenty = 0;

        if (posy < $map.offset().top + $map.height()/2) {
          $infobox.css({'top': posy + 'px'});
            //currenty = posy + $infobox.height();
        } else {
          $infobox.css({'top': (posy - $infobox.height() - 45) + 'px'});
            //currenty = posy - 45;
        }

          //console.log(exceed,currenty,currenty - exceed + $infobox.height());

          //if (currenty - exceed + $infobox.height() > 0) {
            //$infobox.css({'top': ($infobox.height() + exceed + 45) + 'px'});
          //}

      }
    });

      $infobox.on('click', '.booth-info-close', function(e){

      	$infobox.css({
      		'top' : '-99999px',
      		'left' : '-99999px',
          'transition' : 'none'
      	});

        infoboxIsClosed = true;

      	e.preventDefault();
      	e.stopPropagation();
      });

  }

  $(".hide-after-load").each (function (index) {
    $(this).addClass("hidden");
  });

  $(".hide-before-load").each (function (index) {
    $(this).removeClass("hide-before-load");
  });

  var svg = document.querySelector("svg");
  svg.removeAttribute("width");
  svg.removeAttribute("height");

}

window.addEventListener('DOMContentLoaded', init)
