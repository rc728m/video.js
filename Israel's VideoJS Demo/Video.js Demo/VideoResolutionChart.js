var dataToggle = 0; 
var pauseResolutionInterval = false;
var timeChart = 0 ;
var interval = 1000;
var videoElement;
var chartElement;
var resolutionInterval;




function inititializeMyResolutionChart(myChartElement , video){
    videoElement = video;
    var ctx = myChartElement.getContext('2d');
    var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [ ],
                datasets: [{
                    fill: false,
                    borderColor: 'rgb(255,0,0)',
                    label: 'Width',
                    data: [],
                    steppedLine: true
                },
                {
                    label: 'Height',
                    borderColor: 'rgb(0, 0, 255)',
                    fill: false,
                    data: [],
                    steppedLine: true

                }
                ]},
            options: {
              tooltips: {
              mode: 'index',
              intersect: false,
            },
              hover: {
                mode: 'nearest',
                intersect: true
              },
              scales: {
                  xAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Seconds'
                    }
                  }],
                  yAxes: [{
                    display: true,
                    scaleLabel: {
                      display: true,
                      labelString: 'Pixels'
                    }
                  }]
                }
            }
        });
    chartElement = myChart;

    initializeInterval();
}


function initializeInterval(){
    resolutionInterval = window.setInterval(function(){
        if(pauseResolutionInterval){
          clearInterval(resolutionInterval);
        }else{
          addDataToMyChart(chartElement, timeChart, [videoElement.videoWidth,videoElement.videoHeight]);
          timeChart += interval / 1000;
        }
    }, interval);

}

function clearResolutionInterval(){
    pauseResolutionInterval = true;
}
function resumeResolutionInterval(){
  if(pauseResolutionInterval){
      pauseResolutionInterval = false;
      clearInterval(resolutionInterval);
          resolutionInterval = window.setInterval(function(){
              if(pauseResolutionInterval){
                clearInterval(resolutionInterval);
              }else{
                addDataToMyChart(chartElement, timeChart, [videoElement.videoWidth,videoElement.videoHeight]);
                timeChart += interval / 1000;
              }
          }, interval);  
    }

}
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function addDataToMyChart(chart, label, data) {
    chart.data.labels.push(label);
     chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data[dataToggle]);
        if(dataToggle == 1){
          dataToggle = 0 ;
        }else{
          dataToggle++;
        }
    });
  
    chart.update();
}

function removeDataToMyChart(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}


function variableResets(){
  chartElement.clear();
  timeChart = 0 ;
}