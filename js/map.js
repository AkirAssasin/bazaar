var map = Raphael('map',590,300);

map.setViewBox(0,0,590,300,true);

var publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1_K2G5oFBR6M5zOgE89kdUHLXUtO2wSwtPRCnJzUyf6A/pubhtml';

function init() {
  Tabletop.init( { key: publicSpreadsheetURL,
                   callback: drawSVGPaths,
                   simpleSheet: true } )
}

var boothPath = "M0 3L1 0L11 0L12 3L11 6L1 6Z";

var boothOriginX = 6;
var boothOriginY = 3;

var floorOutline = "#081214";
var floorFill = "#524E45";

var fieldOutline = "#081214";
var fieldFill = "#524E45";

var bookedOutline = "#081214";
var freeOutline = "#081214";
var normalFill = "#9CB0BD";
var premiumFill = "#DADBDE";

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
  var floorPlan = map.path("M240 110L240 240L220 240L210 250L205.77 245.77L200 240L190 240L180 230L180 200L170 190L160 190L160 150L150 140L50 140L40 150L40 170L10 170L0 180L0 280L10 290L210 290L220 300L350 300L360 290L360 270L350 260L310 260L310 180L320 170L330 170L340 160L340 110L330 100L250 100L240 110Z");
  floorPlan.attr({"fill":floorFill,"opacity":"0","stroke":floorOutline,"type":"path"});
  floorPlan.animate(planAnimation);

  var outdoorPlan = map.path("M350 100L360 90L370 90L370 10L380 0L580 0L590 10L590 150L580 160L560 160L550 170L360 170L350 160L350 100Z");
  outdoorPlan.attr({"fill":fieldFill,"opacity":"0","stroke":fieldOutline,"type":"path"});
  outdoorPlan.animate(planAnimation);


  for (var i = 0; i < data.length; i++) {

    var booth = map.path(boothPath);
    booth.attr({"type":"path","stroke":"none","opacity":"0"});

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
      + 'r' + data[i].A + ',' + boothOriginX + ',' + boothOriginY).data({"boothNumber":data[i].N,"boothState":data[i].Booked,
      "boothType":data[i].Type,"boothVendorName":data[i].VendorName,"boothVendorImage":data[i].VendorImageUrl,
      "boothVendorSite":data[i].VendorSite,"boothVendorDesc":data[i].VendorDescription});

      var delay = planMilliseconds - (Math.random() * randomMilliseconds);
      console.log(delay);
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

          $infobox.find('.booth-number').text(this.data("boothNumber"));

          if (this.data("boothState") == 'N') {

            if (this.data("boothType") == 'Premium') {
              $infobox.find('.booth-name').text(premiumPrice);
            } else {
              $infobox.find('.booth-name').text(normalPrice);
            }

            $infobox.find('.booth-desc').text("Email us to book this booth!");

            $infobox.find('.booth-image').attr("src", "");
            $infobox.find('.booth-image').addClass("hidden");

            $infobox.find('.booth-site').attr("href", "#");
            $infobox.find('.booth-site').text("info.dbazaar@gmail.com");

            $infobox.find('.booth-tag').text(this.data("boothType"));

          } else {

            $infobox.find('.booth-name').text(this.data("boothVendorName"));
            $infobox.find('.booth-desc').text(this.data("boothVendorDesc"));

            $infobox.find('.booth-image').attr("src", this.data("boothVendorImage"));
            $infobox.find('.booth-image').removeClass("hidden");

            $infobox.find('.booth-site').attr("href", this.data("boothVendorSite"));
            $infobox.find('.booth-site').text(this.data("boothVendorSite"));

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
