'use strict';

angular.module('publicHtmlApp')
  .directive('d3StockChart', function (d3Service, $window) {
    return {
      //template: '<div></div>',
      restrict: 'EA',
      scope:    {
        data:    '=',
      },
      link:     function (scope, element, attrs) {
        //element.text('this is the d3StockChart directive');

        d3Service.d3().then(function (d3) {

          // setup vars
          var margin = {top: 20, right: 80, bottom: 30, left: 50},
              width  = 960 - margin.left - margin.right,
              height = 500 - margin.top - margin.bottom;

          var parseDate = d3.time.format('%Y%m%d').parse;

          var x     = d3.time.scale().range([0, width]);
          var y     = d3.scale.linear().range([height, 0]);
          var color = d3.scale.category10();

          var xAxis = d3.svg.axis().scale(x).orient('bottom');
          var yAxis = d3.svg.axis().scale(y).orient('left');

          var line = d3.svg.line()
            .interpolate('basis')
            .x(function (d) { return x(d.date); })
            .y(function (d) { return y(d.close); });

          var svg = d3.select(element[0])
            .append('svg')
            .style('width', '100%');

          var bisectDate     = d3.bisector(function (d) { return d.date; }).left,
              formatValue    = d3.format(',.2f'),
              formatCurrency = function (d) { return '$' + formatValue(d); };

          // temp function to setup scope.data
          d3.tsv('app/d3StockChart/data.tsv', function (error, data) {
            if (error) throw error;
            data.forEach(function (d) {
              d.date = parseDate(d.date);
            });

          });

          scope.render = function () {
            if (scope.data === undefined) {
              return;
            }

            color.domain(d3.keys(scope.data[0]).filter(function (key) { return key !== 'date'; }));
            var stocks = color.domain().map(function (name) {
              return {
                name:   name,
                values: scope.data.map(function (d) {
                  return {date: d.date, close: +d[name]};
                })
              };
            });

            y.domain([
              d3.min(stocks, function (c) { return d3.min(c.values, function (v) { return v.close; }); }),
              d3.max(stocks, function (c) { return d3.max(c.values, function (v) { return v.close; }); })
            ]);


            // remove all previous items before render
            svg.selectAll('*').remove();

            width = d3.select(element[0]).node().offsetWidth - margin.left - margin.right;
            x     = d3.time.scale().range([0, width]);

            x.domain(d3.extent(scope.data, function (ele) {
              return ele.date;
            }));
            xAxis = d3.svg.axis()
              .scale(x)
              .orient('bottom');

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
              .text('close (ºF)');

            var city = svg.select('g').selectAll('.city')
              .data(stocks)
              .enter().append('g')
              .attr('class', 'city');

            city.append('path')
              .attr('class', 'line')
              .attr('d', function (d) {
                console.log(d);
                return line(d.values); })
              .style('stroke', function (d) { return color(d.name); });

            city.append('text')
              .datum(function (d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
              .attr('transform', function (d) { return 'translate(' + x(d.value.date) + ',' + y(d.value.close) + ')'; })
              .attr('x', 3)
              .attr('dy', '.35em')
              .text(function (d) { return d.name; });

            var focus = svg.append('g')
              .attr('class', 'focus')
              .style('display', 'none')
              .style('pointer-events', 'none');

            var bisector = svg.select('g').append('line')
              .attr('class', 'bisector')
              .style('display', 'none')
              .style('pointer-events', 'none')
              .style('stroke-width', 2)
              .style('stroke', 'red')
              .style('fill', 'none');

            svg.select('g').append('rect')
              .attr('class', 'overlay')
              .attr('width', width)
              .attr('height', height)
              .on('mouseover', function () {
                focus.style('display', null);
                bisector.style('display', null);
              })
              .on('mouseout', function () {
                focus.style('display', 'none');
                bisector.style('display', 'none');
              })
              .on('mousemove', mousemove);

            function mousemove() {
              focus.selectAll('*').remove();

              var x0 = x.invert(d3.mouse(this)[0]),
                  i  = bisectDate(scope.data, x0, 1),
                  d0 = scope.data[i - 1],
                  d1 = scope.data[i],
                  d  = x0 - d0.date > d1.date - x0 ? d1 : d0;

              var date       = d.date.toUTCString().split(' ', 4).join(' ');
              var dy         = 0.35;

              focus.append('circle').attr('r', 4.5);
              focus.append('text')
                .attr('x', 9)
                .attr('dy', dy + 'em')
                .text(date);

              var keys = Object.keys(d);

              keys.forEach(function(key){
                if (key === 'date') { return; }
                dy = dy + 1;

                focus.append('text')
                  .attr('x', 9)
                  .attr('dy', dy + 'em')
                  .text(key + ': ' + formatCurrency(d[key]));
              });

              bisector
                .attr('x1', d3.mouse(this)[0])  //<<== change your code here
                .attr('y1', 0)
                .attr('x2', d3.mouse(this)[0])  //<<== and here
                .attr('y2', height);


              var focusWidth = focus.node().getBBox().width;
              focus.attr('transform', 'translate(' + (d3.mouse(this)[0] + focusWidth / 2) + ',' + d3.mouse(this)[1] + ')');
            }
          }; // end of render


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
          scope.$watch('data', function (newVals, oldVals) {
            return scope.render(newVals);
          }, true);


        }); // end of d3Service.d3().then(...{
      } // end of link
    }; // end of return
  }); // end of directive
