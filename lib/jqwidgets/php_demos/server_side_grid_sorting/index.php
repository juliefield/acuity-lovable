﻿<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="../../jqwidgets/styles/jqx.base.css" type="text/css" />
    <link rel="stylesheet" href="../../jqwidgets/styles/jqx.classic.css" type="text/css" />
    <script type="text/javascript" src="../../scripts/jquery-1.7.1.min.js"></script>
    <script type="text/javascript" src="../../jqwidgets/jqxcore.js"></script>
    <script type="text/javascript" src="../../jqwidgets/jqxbuttons.js"></script>
    <script type="text/javascript" src="../../jqwidgets/jqxscrollbar.js"></script>
    <script type="text/javascript" src="../../jqwidgets/jqxmenu.js"></script>
    <script type="text/javascript" src="../../jqwidgets/jqxgrid.js"></script>
    <script type="text/javascript" src="../../jqwidgets/jqxgrid.selection.js"></script>	
	<script type="text/javascript" src="../../jqwidgets/jqxgrid.sort.js"></script>		
    <script type="text/javascript" src="../../jqwidgets/jqxdata.js"></script>	
    <script type="text/javascript">
        $(document).ready(function () {
            // prepare the data
            var theme = 'classic';
      
            var source =
            {
                 datatype: "json",
                 datafields: [
					 { name: 'ShippedDate'},
					 { name: 'ShipName'},
					 { name: 'ShipAddress'},
					 { name: 'ShipCity'},
					 { name: 'ShipCountry'}
                ],
			    url: 'data.php',
				sort: function()
				{
					// update the grid and send a request to the server.
					$("#jqxgrid").jqxGrid('updatebounddata');
				}
            };		
			
            // initialize jqxGrid
            $("#jqxgrid").jqxGrid(
            {		
                source: source,
                theme: theme,
				sortable: true,
				sorttogglestates: 1,
                columns: [
                      { text: 'Shipped Date', datafield: 'ShippedDate', cellsformat: 'd', width: 200 },
                      { text: 'Ship Name', datafield: 'ShipName', width: 200 },
                      { text: 'Address', datafield: 'ShipAddress', width: 180 },
                      { text: 'City', datafield: 'ShipCity', width: 100 },
                      { text: 'Country', datafield: 'ShipCountry', width: 140 }
                  ]
            });
        });
    </script>
</head>
<body class='default'>
    <div id='jqxWidget'">
        <div id="jqxgrid"></div>
    </div>
</body>
</html>
