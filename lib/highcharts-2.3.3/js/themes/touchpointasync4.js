/**
 * Dark blue theme for Highcharts JS
 * @author Torstein Hønsi
 */

Highcharts.theme = {
    //colors: ["#004098", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", 
    //	"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
    colors: ["#CD6607", "#B1B17B", "#405774", "#F6A03D", "#757116", "#AEBC21", "#D9DB56",
		"#4C88BE", "#129793", "#505050", "#F5D769", "#8DB87C", "#53004B", "#FEB729", "#BD2031", "#A25F08"],
    chart: {
        backgroundColor:
        // /*
            {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: .5 },
            stops: [
                    [0, '#0065CB'],
                    [1, '#0005CC'],
                    [2, '#0005CC']
               ]
        }
        // */
        // '#0005CC'
        ,
        borderColor: '#000000',
        borderWidth: 0,
        width: null,
        //className: 'light-container',
        /*
        plotBackgroundColor:
        // /*
        {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: .5 },
        stops: [
        [0, '#0065CB'],
        [1, '#0005CC'],
        [2, '#0005CC']
        ]
        }
        // 
        //'transparent'
        ,
        */
        plotBorderColor: '#000000',
        plotBorderWidth: 0
    },
    title: {
        style: {
            color: 'white',
            font: 'normal 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: 'white',
            font: 'normal 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    xAxis: {
        gridLineColor: '#333333',
        gridLineWidth: 0,
        labels: {
            style: {
                color: 'white'
            }
        },
        lineColor: '#A0A0A0',
        tickColor: '#A0A0A0',
        title: {
            style: {
                color: 'white',
                fontWeight: 'normal',
                fontSize: '12px',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'

            }
        }
    },
    yAxis: {
        //gridLineColor: '#333333',
        gridLineWidth: 0,
        labels: {
            style: {
                color: 'white'
            }
        },
        //lineColor: '#A0A0A0',
        minorTickInterval: null,
        tickColor: '#A0A0A0',
        tickWidth: 0,
        title: {
            style: {
                color: 'white',
                fontWeight: 'normal',
                fontSize: '14px',
                fontWeight: 'bold',
                fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            }
        },
        plotBands: {  /* plotBand theming does not apply automatically */
            color: '#00246d'
        }
    },
    legend: {
        itemStyle: {
            font: '9pt Trebuchet MS, Verdana, sans-serif',
            color: 'white'
        }
    },
    tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        style: {
            color: 'black'
        }
    },
    toolbar: {
        itemStyle: {
            color: 'silver'
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                color: 'white',
                style: {
                    fontWeight: 'bold',
                    backgroundColor: '#FFA500',
                    padding: '2px'
                },
                borderColor: '#AAA'
            }
        },
        line: {
            dataLabels: {
                color: '#CCC'
            },
            marker: {
                lineColor: '#333'
            }
        },
        spline: {
            marker: {
                lineColor: '#333'
            }
        },
        scatter: {
            marker: {
                lineColor: '#333'
            }
        }
    },
    legend: {
        itemStyle: {
            color: 'white'
        },
        itemHoverStyle: {
            color: 'gray'
        },
        itemHiddenStyle: {
            color: '#444'
        }
    },
    credits: {
        style: {
            color: '#666'
        }
    },
    labels: {
        style: {
            color: '#004098'
        }
    },

    navigation: {
        buttonOptions: {
            backgroundColor: {
                linearGradient: [0, 0, 0, 20],
                stops: [
					[0.4, '#606060'],
					[0.6, '#333333']
				]
            },
            borderColor: '#000000',
            symbolStroke: '#C0C0C0',
            hoverSymbolStroke: '#FFFFFF'
        }
    },

    exporting: {
        buttons: {
            exportButton: {
                symbolFill: '#55BE3B'
            },
            printButton: {
                symbolFill: '#7797BE'
            }
        }
    },

    // special colors for some of the
    legendBackgroundColor: 'rgba(0, 0, 0, 0.0)',
    legendBackgroundColorSolid: 'rgb(0, 0, 0)',
    dataLabelsColor: '#444',
    textColor: '#C0C0C0',
    maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);