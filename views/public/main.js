var socket = null;

$(function() {
  // global highcharts
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  });

  socket = io(ioProtocol+'://'+ioHost+':'+ioPort);
  socket.on('panelsCfg', function(data) {
    for (panelIdx in data.panels) {
      var panel = data.panels[panelIdx];

      createChart(panel);

    }
  });
});

var createChart = function(panel) {
  console.log(panel)
  var panelDivName = panel.name + '_container';
  $('div.chart').append('<div id="' + panelDivName + '"></div>');

  $('#' + panelDivName).highcharts({
    title: {
      text: (panel.title !== undefined) ? panel.title : panel.name
    },
    xAxis: {
      type: 'datetime',
      tickPixelInterval: 100,
      maxZoom: 20 * 1000
    },
    yAxis: {
      title: {
        text: 'Temp'
      },
      tickInterval: 10,
      min: 1
    },
    tooltip: {
      formatter: function() {
        return '<b>' + this.series.name + '</b><br/>' + '[ ' + Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ' , ' + this.y + ' ]';
      }
    },
    chart: {
      type: 'spline',
      renderTo: panelDivName,
      events: {
        load: function() {
          var series = this.series[0];

          socket.on('topicData_' + panel.topic, function(data) {
            // when a sample arrives we plot it
            console.log(data);
            series.addPoint([data.time, parseFloat(data.payload)], true, true);
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

}
