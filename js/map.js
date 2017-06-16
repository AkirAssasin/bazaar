var map = Raphael('map',360,200);

map.setViewBox(0,0,360,200,true);

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

var normalPrice = "RM1";
var premiumPrice = "RM10";

var $map = $('#map');
var $infobox = $('.booth-info');

function drawSVGPaths (data, tabletop) {

  //var floorPlan = map.path("M240 10L240 130L230 140L190 140L180 130L180 100L160 80L160 50L150 40L50 40L40 50L40 60L30 70L10 70L0 80L0 190L10 200L300 200L310 190L310 80L320 70L330 70L340 60L340 10L330 0L250 0L240 10Z");
  var floorPlan = map.path("M240 10L240 140L220 140L210 150L200 140L190 140L180 130L180 100L170 90L160 90L160 50L150 40L50 40L40 50L40 70L10 70L0 80L0 180L10 190L210 190L220 200L350 200L360 190L360 170L350 160L310 160L310 80L320 70L330 70L340 60L340 10L330 0L250 0L240 10Z");
  floorPlan.attr({"fill":"#162f34","stroke":"none","type":"path"});

  for (var i = 0; i < data.length; i++) {



    var booth = map.path(boothPath);
    booth.attr({"type":"path","stroke":"none"});

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

            $infobox.find('.booth-name').text("");
            $infobox.find('.booth-desc').text("");

            $infobox.find('.booth-image').attr("src", "");
            $infobox.find('.booth-image').addClass("hide");

            $infobox.find('.booth-site').attr("href", "#");
            $infobox.find('.booth-site').text("");

            if (this.data("boothType") == 'Premium') {
              $infobox.find('.booth-tag').text(premiumPrice);
            } else {
              $infobox.find('.booth-tag').text(normalPrice);
            }

          } else {

            $infobox.find('.booth-name').text(this.data("boothVendorName"));
            $infobox.find('.booth-desc').text(this.data("boothVendorDesc"));

            $infobox.find('.booth-image').attr("src", this.data("boothVendorImage"));
            $infobox.find('.booth-image').removeClass("hide");

            $infobox.find('.booth-site').attr("href", this.data("boothVendorSite"));
            $infobox.find('.booth-site').text(this.data("boothVendorSite"));

            $infobox.find('.booth-tag').text("");

          }

          if (posx < $(window).width()/2) {
            $infobox.css({'left': posx + 'px'});
          } else {
            $infobox.css({'left': (posx - $infobox.width() - 55) + 'px'});
          }

          //$infobox.css({'top': ($map.offset().top + $map.height()/2  - $infobox.height()/2) + 'px'});


          console.log(posy,$map.offset().top + $map.height()/2);

          if (posy < $map.offset().top + $map.height()/2) {
            $infobox.css({'top': posy + 'px'});
          } else {
            $infobox.css({'top': (posy - $infobox.height() - 45) + 'px'});
          }


        }
      });

      $infobox.on('click', '.booth-info-close', function(e){

      	$infobox.css({
      		'top' : '-99999px',
      		'left' : '-99999px'
      	});

      	e.preventDefault();
      	e.stopPropagation();
      });

  }

  $(".spinner").each (function (index) {
    $(this).addClass("hide");
  });

  var svg = document.querySelector("svg");
  svg.removeAttribute("width");
  svg.removeAttribute("height");

  $map.removeClass("hide");

}

window.addEventListener('DOMContentLoaded', init)
