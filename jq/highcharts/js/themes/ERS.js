/**
 * Dark blue theme for Highcharts JS
 * @author Torstein Hønsi
 */

Highcharts.theme = {
	colors: ["##004098", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", 
		"#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
	chart: {
		backgroundColor: {
			linearGradient: [0, 0, 250, 500],
			stops: [
				[0, 'rgb(200, 200, 200)'],
				[1, 'rgb(200, 200, 200)']
			]
		},
		borderColor: '#000000',
		borderWidth: 2,
		//className: 'light-container',
		plotBackgroundColor: 'rgba(230, 230, 230, .5)',
		plotBorderColor: '#CCCCCC',
		plotBorderWidth: 1
	},
	title: {
		style: {
		    color: '#004098',
			font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
		}
	},
	subtitle: {
		style: { 
			color: '#666666',
			font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
		}
	},
	xAxis: {
		gridLineColor: '#333333',
		gridLineWidth: 1,
		labels: {
			style: {
			    color: '#004098'
			}
		},
		lineColor: '#A0A0A0',
		tickColor: '#A0A0A0',
		title: {
			style: {
			    color: '#004098',
				fontWeight: 'bold',
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
			    color: '#004098'
			}
		},
		//lineColor: '#A0A0A0',
		minorTickInterval: null,
		tickColor: '#A0A0A0',
		tickWidth: 1,
		title: {
			style: {
			    color: '#004098',
				fontWeight: 'bold',
				fontSize: '12px',
				fontFamily: 'Trebuchet MS, Verdana, sans-serif'
			}
        },
        plotBands: [
            { color: 'red', from: 0, to: 0.1 },
            { color: 'yellow', from: 4, to: 4.1 },
            { color: 'green', from: 8, to: 8.1 }
        ]
	},
	legend: {
		itemStyle: {
			font: '9pt Trebuchet MS, Verdana, sans-serif',
			color: '#A0A0A0'
		}
	},
	tooltip: {
		backgroundColor: 'rgba(0, 0, 0, 0.75)',
		style: {
			color: '#F0F0F0'
		}
	},
	toolbar: {
		itemStyle: { 
			color: 'silver'
		}
    },

	plotOptions: {
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
		    color: '#004098'
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
	legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
	legendBackgroundColorSolid: 'rgb(35, 35, 70)',
	dataLabelsColor: '#444',
	textColor: '#C0C0C0',
	maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);