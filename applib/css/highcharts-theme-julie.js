/**
 * - Highcharts Theme Sandbox.
 */

Highcharts.theme = {
    colors: ["#009ad9", "#B1B17B", "#405774", "#F6A03D", "#32ab0a", "#AEBC21", "#D9DB56",
		"#1e3248", "#129793", "#505050", "#F5D769", "#8DB87C", "#53004B", "#FEB729", "#BD2031", "#09A6B8"],
    chart: {
        backgroundColor:
            {
              linearGradient: { x1: 0, y1: 0, x2: 0, y2: 0 },
              stops: [
                [0, '#fff' ],
                [1, '#fff'],
                [2, '#fff']
             ]
            },
        borderWidth: 0,
        width: null,
        plotBorderColor: '#000000',
        plotBorderWidth: 0,
        reflow: true,
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
              color: '#000',
              fontSize: '14px',
              fontWeight: 'bold'
            }
        },
        lineColor: '#A0A0A0',
        tickColor: '#A0A0A0',
        title: {
            style: {
                color: '#000',
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
                color: '#000',
                fontSize: '14px',
                fontWeight: 'bold'
            }
        },
        //lineColor: '#A0A0A0',
        minorTickInterval: null,
        tickColor: '#A0A0A0',
        tickWidth: 0,
        title: {
            style: {
              color: '#000',
              fontWeight: 'normal',
              fontSize: '16px',
              fontWeight: 'normal',
              fontFamily: 'Trebuchet MS, Verdana, sans-serif'
            }
        },
        plotBands: {  /* plotBand theming does not apply automatically, if you add more, I'll need to hook them up - Jeff */
          color: '#e2e9ef',
          style: {
              height: '1px'
          }
        }
    },
    legend: {
        itemStyle: {
          font: '9pt Trebuchet MS, Verdana, sans-serif',
          color: '#868686'
        }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 1)',
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
            className: 'barchart-style',
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
          className: 'area-style',
          lineColor: '#B7C6D3'
        },
        line: {
            className: 'linechart-style',
            dataLabels: {
                color: '#CCC',
            },
            marker: {
                lineColor: '#333'
            }

        },
        spline: {
            className: 'spline-style',
            marker: {
                lineColor: '#333'
            }
        },
        scatter: {
            className: 'scatter-style',
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
      backgroundColor: '#fff',
      borderColor: '#fff',
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
        backgroundColor: '#0092CE',
        borderColor: '#0092CE',
        states: {
          hover: {
            symbolFill: '#eee',
            backgroundColor: '#eee',
          }
        }
      }
    },

    exporting: {
        buttons: {
            exportButton: {
              symbolFill: '#fff',
              symbolStroke: '#fff',
              padding: '10',
              states: {
                hover: {
                  symbolStroke: '#0092CE',
                  symbolFill: '#0092CE',
                }
              }
            },
            printButton: {
              symbolFill: '#fff',
              symbolStroke: '#0092CE',
              padding: '10',
              states: {
                hover: {
                  symbolStroke: '#00699C',
                  symbolFill: '#0092CE',
                }
              }
            }
        }
    },


};

// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
