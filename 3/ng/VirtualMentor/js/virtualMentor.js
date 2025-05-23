$(document).ready(function () {
   LoadCharts();
});

function LoadCharts() {
   // Build the chart
   Highcharts.chart('totalPieContainer', {
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: 'pie'
      },
      title: {
         text: 'All Suggestions',
         align: 'center'
      },
      tooltip: {
         pointFormat: '<b>{point.percentage:.2f}%</b><br><b>{point.totalCount}</b>'
      },
      accessibility: {
         point: {
            valueSuffix: '%'
         }
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}</b>: {point.percentage:.2f} %<br>{point.totalCount}',
               connectorColor: 'silver'
            }
         }
      },
      series: [{
         name: 'All Suggestions',
         data: [
            { name: 'Coach', y: 62.1982, totalCount: 1443 },
            { name: 'Recognize', y: 37.7586, totalCount: 876 }
         ]
      }]
   });

   Highcharts.chart("coachingPieChart", {
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: 'pie'
      },
      title: {
         text: 'Coaching By Date',
         align: 'center'
      },
      tooltip: {
         pointFormat: '<b>{point.percentage:.2f}%</b><br><b>{point.totalCount}</b>'
      },
      accessibility: {
         point: {
            valueSuffix: '%'
         }
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}</b>: {point.percentage:.2f} %<br>{point.totalCount}',
               connectorColor: 'silver'
            }
         }
      },
      series: [{
         name: 'Date',
         data: [
            { name: 'Day 1', y: 3, totalCount: 10 },
            { name: 'Day 2', y: 3, totalCount: 10 },
            { name: 'Day 3', y: 3, totalCount: 10 },
            { name: 'Day 4', y: 3, totalCount: 10 },
            { name: 'Day 5', y: 3, totalCount: 10 },
            { name: 'Day 6', y: 3, totalCount: 10 },
            { name: 'Day 7', y: 3, totalCount: 10 },
            { name: 'Day 8', y: 3, totalCount: 10 },
            { name: 'Day 9', y: 3, totalCount: 10 },
            { name: 'Day 10', y: 3, totalCount: 10 },
            { name: 'Day 11', y: 3, totalCount: 10 },
            { name: 'Day 12', y: 3, totalCount: 10 },
            { name: 'Day 13', y: 3, totalCount: 10 },
            { name: 'Day 14', y: 3, totalCount: 10 },
            { name: 'Day 15', y: 3, totalCount: 10 },
            { name: 'Day 16', y: 3, totalCount: 10 },
            { name: 'Day 17', y: 3, totalCount: 10 },
            { name: 'Day 18', y: 3, totalCount: 10 },
            { name: 'Day 19', y: 3, totalCount: 10 },
            { name: 'Day 20', y: 3, totalCount: 10 },
            { name: 'Day 21', y: 3, totalCount: 10 },
            { name: 'Day 22', y: 3, totalCount: 10 },
            { name: 'Day 23', y: 3, totalCount: 10 },
            { name: 'Day 24', y: 3, totalCount: 10 },
            { name: 'Day 25', y: 3, totalCount: 10 },
            { name: 'Day 26', y: 3, totalCount: 10 },
            { name: 'Day 27', y: 3, totalCount: 10 },
            { name: 'Day 28', y: 3, totalCount: 10 },
            { name: 'Day 29', y: 3, totalCount: 10 },
            { name: 'Day 30', y: 3, totalCount: 10 },
            { name: 'Day 31', y: 3, totalCount: 10 }

         ]
      }]
   });
   Highcharts.chart("recognitionPieChart", {
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: null,
         plotShadow: false,
         type: 'pie'
      },
      title: {
         text: 'Recognition By Date',
         align: 'center'
      },
      tooltip: {
         pointFormat: '<b>{point.percentage:.2f}%</b><br><b>{point.totalCount}</b>'
      },
      accessibility: {
         point: {
            valueSuffix: '%'
         }
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}</b>: {point.percentage:.2f} %<br>{point.totalCount}',
               connectorColor: 'silver'
            }
         }
      },
      series: [{
         name: 'Date',
         data: [
            { name: 'Day 1', y: 1, totalCount: 1 },
            { name: 'Day 2', y: 24, totalCount: 24 },
            { name: 'Day 5', y: 25, totalCount: 25 },
            { name: 'Day 6', y: 50, totalCount: 50 }
         ]
      }]
   });
   Highcharts.chart("mqfCoachPieChart", {
      chart: {
         plotBackgroundColor: null,
         plotBorderWidth: false,
         plotShadow: false,
         type: 'pie'
      },
      title: {
         text: 'Top 10 KPIs for Coaching',
         align: 'center'
      },
      tooltip: {
         pointFormat: '<b>{point.percentage:.2f}%</b><br><b>{point.totalCount}</b>'
      },
      accessibility: {
         point: {
            valueSuffix: '%'
         }
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               format: '<b>{point.name}</b>: {point.percentage:.2f} %<br>{point.totalCount}',
               connectorColor: 'silver'
            }
         }
      },
      series: [{
         name: 'Item',
         data: [
            { name: 'KPI 1', y: 10, totalCount: 5 },
            { name: 'KPI 2', y: 10, totalCount: 5 },
            { name: 'KPI 3', y: 10, totalCount: 5 },
            { name: 'KPI 4', y: 10, totalCount: 5 },
            { name: 'KPI 5', y: 10, totalCount: 5 },
            { name: 'KPI 6', y: 10, totalCount: 5 },
            { name: 'KPI 7', y: 10, totalCount: 5 },
            { name: 'KPI 8', y: 10, totalCount: 5 },
            { name: 'KPI 9', y: 10, totalCount: 5 },
            { name: 'KPI 10', y: 10, totalCount: 5 }
         ]
      }]
   })
   Highcharts.chart('totalActivityContainer', {
      chart: {
         type: 'line'
      },
      title: {
         text: 'Activity By Date'
      },
      xAxis: {
         categories: [
            'date 1', 'date 2', 'date 3', 'date 4', 'date 5',
            'date 6', 'date 7', 'date 8', 'date 9', 'date 10',
            'date 11', 'date 12', 'date 13', 'date 14', 'date 15',
            'date 16', 'date 17', 'date 18', 'date 19', 'date 20',
            'date 21', 'date 22', 'date 23', 'date 24', 'date 25',
            'date 26', 'date 27', 'date 28', 'date 29', 'date 30',
            'date 31'
         ]
      },
      yAxis: {
         title: {
            text: 'Actions'
         }
      },
      legend: {
         layout: 'vertical',
         align: 'right',
         verticalAlign: 'middle'
      },
      plotOptions: {
         line: {
            dataLabels:{
               enabled:true
            }
         },
         series: {
            label: {
               enabled:false,
               connectorAllowed: false
            }
         }
      },
      series: [{
         name: 'No Action Taken',
         data: [
            100, 0, 0, 50, 33,
            62, 0, 19, 50, 33,
            152, 0, 70, 50, 33,
            41, 0, 0, 50, 33,
            32, 0, 54, 50, 33,
            100, 0, 0, 50, 33,
            25
         ]
      }, {
         name: 'Acted',
         data: [
            75, 4, 30, 2, 3,
            32, 4, 13, 2, 3,
            67, 4, 3, 2, 3,
            82, 4, 63, 2, 3,
            0, 0, 0, 0, 3,
            22, 4, 3, 2, 3,
            0
         ]
      }, {
         name: 'Passed',
         data: [
            0, 10, 2, 1, 2,
            0, 2, 75, 1, 2,
            0, 2, 2, 1, 2,
            0, 2, 2, 33, 2,
            0, 2, 2, 1, 22,
            0, 2, 18, 1, 2,
            10
         ]
      }, {
         name: 'Recognized',
         data: [
            0, 0, 3, 10, 3,
            0, 0, 3, 10, 3,
            0, 0, 3, 25, 3,
            0, 0, 3, 4, 3,
            0, 8, 3, 7, 3,
            90, 0, 3, 7, 3,
            8
         ]
      }, {
         name: 'Completed',
         data: [
            0, 12, 24, 36, 48,
            10, 20, 30, 10, 50,
            13, 6, 8, 125, 204,
            60, 120, 30, 15, 8,
            3, 12, 24, 36, 60,
            10, 12, 24, 36, 30,
            5
         ]
      }
      , {
         name: 'Auto Complete',
         data: [
            0, 100, 0, 0, 1,
            10, 20, 30, 20, 15,
            20, 86, 72, 33, 1,
            0, 0, 8, 54, 22,
            1, 154, 33, 102, 80,
            55, 0, 0, 20, 19,
            82
         ]
      }
      ]
   });
}
