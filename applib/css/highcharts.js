/**
 * - Highcharts Theme Sandbox.
 */

Highcharts.theme = {
    colors: ["#009ad9", "#B1B17B", "#405774", "#F6A03D", "#32ab0a", "#AEBC21", "#D9DB56",
		"#1e3248", "#129793", "#505050", "#F5D769", "#8DB87C", "#53004B", "#FEB729", "#BD2031", "#09A6B8"],
    chart: {
        backgroundColor:
            {
              linearGradient: { x1: 0, y1: 0, x2: 1, y2: .5 },
              stops: [
                [0, '#E5ECF2' ],
                [1, '#E5ECF2'],
                [2, '#E5ECF2']
             ]
            },
        borderWidth: 0,
        plotBorderColor: '#000000',
        plotBorderWidth: 0
    },
    title: {
        style: {
            color: '#868686',
            font: 'normal 16px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    subtitle: {
        style: {
            color: '#868686',
            font: 'normal 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    xAxis: {
        gridLineColor: '#333333',
        gridLineWidth: 0,
        labels: {
            style: {
              color: '#868686'
            }
        },
        lineColor: '#A0A0A0',
        tickColor: '#A0A0A0',
        title: {
            style: {
                color: '#868686',
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
                color: '#868686'
            }
        },
        //lineColor: '#A0A0A0',
        minorTickInterval: null,
        tickColor: '#A0A0A0',
        tickWidth: 0,
        title: {
            style: {
              color: '#868686',
              fontWeight: 'normal',
              fontSize: '14px',
              fontWeight: 'normal',
              fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            }
        },
        plotBands: {  /* plotBand theming does not apply automatically, if you add more, I'll need to hook them up - Jeff */
            color: '#B7C6D3'
        }
    },
    legend: {
        itemStyle: {
          font: '9pt Trebuchet MS, Verdana, sans-serif',
          color: '#868686'
        }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, .8)',
      borderWidth: 0,
      zIndex: '1',
      style: {
          color: '#666',
          lineHeight: '21px',
          padding: '15px',
          zIndex: '1'
      }
    },
    toolbar: {
        itemStyle: {
          color: 'red'
        }
    },

    plotOptions: {
        series: {
            dataLabels: {
                color: '#868686',
                style: {
                    fontWeight: 'bold',
                    backgroundColor: '#FFA500',
                    padding: '2px',
                    zIndex: '100'
                },
                borderColor: '#B7C6D3'
            },
            borderRadiusTopLeft: 5,
            borderRadiusTopRight: 5,
            borderRadiusBottomLeft: 0,
            borderRadiusBottomRight: 0
        },
        area: {
          lineColor: '#333'
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
        },
        column: {
          shadow: false,
          className: 'column-style',
          style: {
            color: '#868686'
          },
          dataLabels: {
            enabled: true,
            y: -6,
            color: '#868686',
          }
        }
    },
    legend: {
      backgroundColor: '#D1DEE9',
      borderColor: '#D1DEE9',
      itemStyle: {
        color: '#868686'
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
        color: '#666'
      }
    },

    navigation: {
      buttonOptions: {
        theme: {
            style: {
                color: '#039',
                textDecoration: 'underline'
            }
        }
      }
    },

    exporting: {
        buttons: {
            exportButton: {
              symbolFill: '#55BE3B',
              symbolStroke: '#55BE3B',
              states: {
                hover: {
                  symbolStroke: '#B7C6D3'
                }
              }
            },
            printButton: {
              symbolFill: '#7797BE',
              symbolStroke: '#7797BE',
              states: {
                hover: {
                  symbolStroke: '#B7C6D3'
                }
              }
            }
        }
    },


};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
