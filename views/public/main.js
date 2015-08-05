
$(function() {
  var socket = io('http://localhost:8080');
  /*socket.on('topicData', function (data) {
    console.log(data);
  });*/

  Highcharts.setOptions({
 		global: {
 			useUTC: false
 		}
 	});

  $('#container').highcharts({
    title: { text: 'Real Time Samples' },
    xAxis: {
			type: 'datetime',
			tickPixelInterval: 100
		},
		yAxis: {
			title: { text: 'Temp' },
			tickInterval: 10,
			min: 0,
			max: 100
		},
		tooltip: {
            formatter: function() {
                return '<b>'+ this.series.name + '</b><br/>'
                    + '[ ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x)
                    + ' , '
                    + this.y + ' ]';
            }
		},chart: {
			type: 'spline',
			renderTo: 'graph_container',
			events: {
				load: function() {
					var series = this.series[0];

				    socket.on('topicData', function (data) {
				    	// when a sample arrives we plot it
              console.log(data);
						series.addPoint([data.time, parseInt(data.payload)], true, true);
				    });
				}
			}
		},
        series: [{
            name: 'Temp',
            data: (function() {
                // generate some points to render before real samples arrive from feed
                var data = [];
                var time = (new Date()).getTime()

               // 20 samples, starting 19 ms ago up to present time when feed starts plotting
               for (var i = -20; i <= 0; i++) {
                   data.push({
                       x: time + (i * 10),
                       y: 0
                   });
               }

                return data;
            })()
        }]
  });
  /*$('#container').highcharts({
      xAxis: {
          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      series: [{
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
      }]
  });*/
});
