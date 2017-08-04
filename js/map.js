var map = Raphael('map',490,270);

map.setViewBox(0,0,490,270,true);

var publicSpreadsheetURL = 'https://docs.google.com/spreadsheets/d/1XnCIlpLgPObMJ07GRdOljArDCaLAlERJg8AMLJgE6jE/pubhtml';

function init() {
  Tabletop.init( { key: publicSpreadsheetURL,
                   callback: drawSVGPaths,
                   simpleSheet: true } )
}

var arrowPath = "M 0 2 L 2 0 1 0 1 -2 -1 -2 -1 0 2 0 0 2 Z";

var boothRadius = 4.5;

var floorOutline = "#081214";
var floorFill = "#999999";

var boothOutline = "#888888";
var electricOutline = "#FFFF00";

var bookedFill = "#333333";
var premiumFill = "#FF6913";
var normalFill = "#FF9300";

var normalPrice = 80;
var premiumPrice = 105;

var electricityFee = 8;

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
  floorPlan.attr({"fill":floorFill,"opacity":"0","stroke":floorOutline,"stroke-width":0,"type":"path"});
  floorPlan.animate(planAnimation);

  var entrance = map.text(335, 10, "Entrance");
  entrance.attr({"font-family":"Bebas Neue","font-size":19,"opacity":"0"});
  entrance.animate(planAnimation);

  var ctl = map.image("img/toilet.png", 20, 85, 15, 15);
  var htl = map.image("img/toilet.png", 465, 250, 15, 15);

  /*
  var arrow = map.path(arrowPath);
  arrow.attr({"fill":"#000"})
  */

  for (var i = 0; i < data.length; i++) {

    var booth = map.circle(data[i].X,data[i].Y,boothRadius);

    booth.attr({"stroke":"none","opacity":"0"});

    var boothPrice = 0;

    if (data[i].Verified == 'Y') {

      booth.attr({"fill":bookedFill});
      booth.attr({"stroke":boothOutline});

    } else {

      if (data[i].Electricity == 'N') {
        booth.attr({"stroke":boothOutline});
      } else {
        booth.attr({"stroke":electricOutline});
        boothPrice += electricityFee;
      }

      if (data[i].Type == 'Premium') {
        booth.attr({"fill":premiumFill});
        boothPrice += premiumPrice;
      } else {
        booth.attr({"fill":normalFill});
        boothPrice += normalPrice;
      }

    }

    booth.data({"boothID":data[i].ID,"boothState":data[i].Verified,"boothElectricity":data[i].Electricity,"boothPrice":boothPrice});

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

      if ((typeof e !== 'undefined') && (this.data("boothState") == 'N')) {

        posx = e.pageX;
        posy = e.pageY;

        $infobox.find('.booth-number').text(this.data("boothID"));

        $infobox.find('.booth-price').text(this.data("boothPrice"));

        if (this.data("boothElectricity") == 'Y') {
          $infobox.find('.booth-electricity').removeClass('hidden');
          $infobox.find('.booth-no-electricity').addClass('hidden');
        } else {
          $infobox.find('.booth-electricity').addClass('hidden');
          $infobox.find('.booth-no-electricity').removeClass('hidden');
        }

        $infobox.find('.booth-site').attr("href",
        "https://docs.google.com/forms/d/e/1FAIpQLSelGFxRpTTWzvzDblYdionpJyE-PrV4ZF8xG15YpOv_CwXkSg/viewform?usp=pp_url&entry.32327792&entry.1063218980&entry.338191277="
         + this.data("boothID") + "&entry.527225325");

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

  console.log(map.canvas.offsetLeft);
  console.log(map.canvas.offsetTop);

  $(".map-caption").each (function (index) {
    var mapos = $("#map").position();

    $(this).css({
      'top' : mapos.top,
      'left' : mapos.left
    });
  });

}

$(window).resize(function () {

  $(".map-caption").each (function (index) {
    var mapos = $("#map").position();

    $(this).css({
      'top' : mapos.top,
      'left' : mapos.left
    });
  });

  //console.log("h");

});

window.addEventListener('DOMContentLoaded', init)
