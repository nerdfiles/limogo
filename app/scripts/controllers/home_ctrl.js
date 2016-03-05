define([
  "interface",
  "angular",
  "leaflet",
  "d3",
  "directives/ngShowAuth",
  "directives/ngHideAuth",
  "services/amort",
  "filters/reverse"
], function (__interface__, angular, L, d3) {
  Number.prototype.round = function () {
    var self = this;
    return Math.round( self * 100 ) / 100;
  };
  __interface__.directive('loanTotalReturn', [
    function () {
      return {
        restrict: 'A',
        scope: {
          'loanData': '=loanData'
        },
        link: function ($scope, element, attr) {
          console.log($scope);
          var height = 210;
          var width = 210;
          var radius = Math.min(width, height) / 2;
          var canvas = d3.select('#wrapper')
            .append('svg')
            .attr({
              'width': width,
              'height': height
            });

          var data = $scope.loanData;

          var colors = ['#A4B9B3', '#768F61'];

          var bgArc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(90);

          var arc = d3.svg.arc()
            /*
             *.innerRadius(0)
             *.outerRadius(100);
             */
            .outerRadius(radius - 10)
            .innerRadius(radius - 40)

          var arcOver = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius - 60)

          var pie = d3.layout.pie()
            .value(function(d) {
              return d.value;
            });

          $scope.$watch('loanData', function (newVal, oldVal) {
            if (!newVal)
              return;
            var colorscale = d3.scale.linear().domain([0, newVal.length]).range(colors);
            var canvasContext = canvas.append('g')
               .attr('transform', 'translate(100,110)')
               .selectAll('.arc')
               .data(pie(newVal))
               .enter()
               .append('g')
               .attr('class', "arc");

            canvasContext.append('path')
              .attr('d', bgArc)
              .attr('fill', '#ffffff');

            canvasContext.append('path')
              .attr('d', arc)
              .attr('fill', function(d, i) {
                 return colorscale(i);
              })
              /*
               *.on("mouseover", function(d) {
               *   d3.select(this).transition()
               *     .duration(1000)
               *     .attr("d", arcOver);
               *})
               */
              .on("mouseout", function(d) {
                 d3.select(this).transition()
                   .duration(1000)
                   .attr("d", arc);
              });

            canvasContext.append('text')
              /*
               *.attr('transform', function(d) {
               *   var c = arc.centroid(d);
               *   console.log(c);
               *   return "translate(" + c[0] + "," + c[1] + ")";
               *})
               */
              .text(function(d) {
                 if (d.data.label === 'Principal')
                    return;
                 return d.value;
              });

          });

        }
      };
    }
  ]);

  return ['$scope', '$rootScope', 'leafletData', '$http', '$q', '$anchorScroll', '$location', '$routeParams', 'Ref', '$firebaseArray', '$timeout', 'amortizationService', function ($scope, $rootScope, leafletData, $http, $q, $anchorScroll, $location, $routeParams, Ref, $firebaseArray, $timeout, amortizationService) {
    $scope.message = 'Safe and Secure Returns';

    try {
      $rootScope.scrollTo($routeParams.section);
    } catch (e) {
      console.log(e);
    }

    angular.extend($scope, {
      center: {
        lat: 29.737463,
        lng: -95.397503,
        zoom: 18
      },
      defaults: {
        tileLayer: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        tileLayerOptions: {
          subdomains: 'abcd',
          format: 'png',
          detectRetina: true,
          reuseTiles: true
        },
        scrollWheelZoom: true,
        attributionControl: false,
        zoomControl: false
      }
    });

    leafletData.getMap('index').then(function(map) {
      new OSMBuildings(map).load();
      //L.Control.geocoder().addTo(map)
      //map.fitBounds();
      var bookIdeas = $http.get('api/v1/book/ideas');
      bookIdeas.then(function (data) {
        bookIdeasConstruct = data.data.ItemSearchResponse.Items[0];
        $scope.bookIdeas = bookIdeasConstruct.Item;
        $scope.bookIdeasTotalPages = bookIdeasConstruct.TotalPages;
        $scope.bookIdeasTotalResults = bookIdeasConstruct.TotalResults;
        $scope.bookIdeasMoreSearchResultsUrl = bookIdeasConstruct.MoreSearchResultsUrl;
      })

      $scope.rides = [];
    });
  }];
});
