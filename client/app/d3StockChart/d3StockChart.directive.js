'use strict';

angular.module('publicHtmlApp')
  .directive('d3StockChart', function (d3Service, $window) {
    return {
      //template: '<div></div>',
      restrict: 'EA',
      link:     function (scope, element, attrs) {
        //element.text('this is the d3StockChart directive');

        d3Service.d3().then(function (d3) {

          // setup vars
          var margin = {top: 20, right: 80, bottom: 30, left: 50},
              width  = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          var parseDate = d3.time.format('%Y%m%d').parse;

          var x = d3.time.scale()
            .range([0, width]);

          var y = d3.scale.linear()
            .range([height, 0]);

          var color = d3.scale.category10();

          var xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

          var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

          var line = d3.svg.line()
            .interpolate('basis')
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.temperature); });

          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

          var cities;

          var bisectDate = d3.bisector(function(d) { return d.date; }).left,
              formatValue = d3.format(",.2f"),
              formatCurrency = function(d) { return "$" + formatValue(d); };


          d3.tsv('app/d3StockChart/data.tsv', function (error, data) {
            if (error) throw error;

            color.domain(d3.keys(data[0]).filter(function (key) { return key !== 'date'; }));

            data.forEach(function (d) {
              d.date = parseDate(d.date);
            });

            cities      = color.domain().map(function (name) {
              return {
                name:   name,
                values: data.map(function (d) {
                  return {date: d.date, temperature: +d[name]};
                })
              };
            });
            scope.data = data;
            x.domain(d3.extent(data, function (d) { return d.date; }));

            y.domain([
              d3.min(cities, function (c) { return d3.min(c.values, function (v) { return v.temperature; }); }),
              d3.max(cities, function (c) { return d3.max(c.values, function (v) { return v.temperature; }); })
            ]);
            scope.citiesData  = cities;
          });

          // Browser onresize event
          window.onresize = function () {
            scope.$apply();
          };

          // Watch for resize event
          scope.$watch(function () {
            return angular.element($window)[0].innerWidth;
          }, function () {
            scope.render(scope.data);
          });
          // watch for data changes and re-render
          scope.$watch('citiesData', function (newVals, oldVals) {
            return scope.render(newVals);
          }, true);

          scope.render = function () {
            console.log('cities: ' + cities);
            if (cities === undefined) {
              return;
            }
            // remove all previous items before render
            svg.selectAll('*').remove();

            width = d3.select(element[0]).node().offsetWidth - margin.left - margin.right;
            x     = d3.time.scale().range([0, width]);
            x.domain(d3.extent(scope.data, function (d) { return d.date; }));
            xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');

            console.log('width: ' + width);
            //height = d3.select(element[0]).node().offsetHeight - margin.top - margin.bottom;


            console.log('height: ' + height);

            svg.attr('width', width + margin.left + margin.right)
              .attr('height', 500)
              .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

            svg.select('g')
              .append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + height + ')')
              .call(xAxis);

            svg.select('g')
              .append('g')
              .attr('class', 'y axis')
              .call(yAxis)
              .append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text('Temperature (ºF)');

            var city = svg.select('g').selectAll('.city')
              .data(cities)
              .enter().append('g')
              .attr('class', 'city');

            city.append('path')
              .attr('class', 'line')
              .attr('d', function (d) { return line(d.values); })
              .style('stroke', function (d) { return color(d.name); });

            city.append('text')
              .datum(function (d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
              .attr('transform', function (d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.temperature) + ')'; })
              .attr('x', 3)
              .attr('dy', '.35em')
              .text(function (d) { return d.name; });

            var focus = svg.append("g")
              .attr("class", "focus")
              .style("display", "none");

            focus.append("circle")
              .attr("r", 4.5);

            focus.append("text")
              .attr("x", 9)
              .attr("dy", ".35em");

            svg.select('g').append('rect')
              .attr('class', 'overlay')
              .attr('width', width)
              .attr('height', height)
              .on('mouseover', function () { focus.style('display', null); })
              .on('mouseout', function () { focus.style('display', 'none'); })
              .on('mousemove', mousemove);

            function mousemove() {
              var x0 = x.invert(d3.mouse(this)[0]),
                  i  = bisectDate(scope.data, x0, 1),
                  d0 = scope.data[i - 1],
                  d1 = scope.data[i],
                  d  = x0 - d0.date > d1.date - x0 ? d1 : d0;
              focus.attr('transform', 'translate(' + x(d.date) + ',' + y(d['Austin']) + ')');
              focus.select('text').text(
                'Austin: ' + formatCurrency(d['Austin']) +
                '  San Francisco: ' + formatCurrency(d['San Francisco']) +
                '  New York: ' + formatCurrency(d['New York'])

              );
            }
          };
        });
      }
    };
  });
