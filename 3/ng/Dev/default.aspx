<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld" %>

    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

    <head id="Head1" runat="server">
        <title>Acuity Dev</title>
        <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
        <!-- AngularJS ng- ng -->
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular.min.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-cookies.js"></script>
        <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.6.0-rc.2/angular-sanitize.js"></script>
        
        <!-- ES5 Compatibility for IE 11 -->
        <script src="../../../lib/bluebird/3.3.4/bluebird.min.js"></script>
        <script src="../../../lib/zxcvbn/4.4.2/zxcvbn.js"></script>
        <asp:PlaceHolder runat="server">
            <link rel="stylesheet" href="/App_Themes/Acuity3/app-1.0.16.css?<%=CONFMGR.Bump()%>" />
            <!-- these are required for main.js for API / legacy functionality -->
            <script type="text/javascript" src="../../../lib/jquery/jquery-1.7.2.min.js"></script>
            <script type="text/javascript" src="../../../lib/jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>
            <script type="text/javascript" src="../../../lib/jquery/plugins/jquery.cookie.js"></script>
            <script type="text/javascript" src="../../../appLib/js/appLib.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/modules/mainModule.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../lib/knockout/knockout-3.3.0.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko.mapping.js"></script>
            <script type="text/javascript" src="../../../lib/knockout/ko-postbox.js"></script>
            <script type="text/javascript" src="js/controller.js?<%=CONFMGR.Bump()%>"></script>
            <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>

            <!-- Highcharts -->
            <script type="text/javascript" src="../../../lib/highcharts-6.2.0/code/highcharts.js"></script>
            <script type="text/javascript" src="../../../lib/highcharts-6.2.0/code/highcharts-more.js"></script>
            <script type="text/javascript" src="../../../lib/highcharts-6.2.0/code/modules/exporting.js"></script>
            <!-- Login -->
            <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
            <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
            <!-- <script type="text/javascript" src="../../../appLib/dev/AcuityAdmin1/vm/trophyManager.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/AGameFlex1/vm/agameflexListAll.js?<%=DevBumper%>"></script>
            <script type="text/javascript" src="../../../appLib/dev/USERPERFORMANCE1/vm/userPerformance.js?<%=DevBumper%>"></script> -->
            <!-- <script type="text/javascript" src="../../../appLib/dev/AcuityAdmin1/vm/userOverallStats.js?<%=DevBumper%>"></script> -->
            <!-- <script type="text/javascript" src="../../../appLib/dev/AGAMELEAGUES1/vm/agameWagerWidget.js?<%=DevBumper%>"></script>  -->
            <!-- <script type="text/javascript" src="../../../appLib/dev/DataAnalysis/vm/dataAnalysis.js?<%=DevBumper%>"></script>  -->
            <!-- <script type="text/javascript" src="../../../appLib/dev/AcuityAdmin1/vm/userPromotionManager.js?<%=DevBumper%>"></script> -->
            <!-- <script type="text/javascript" src="../../../appLib/dev/AGAMELEAGUES1/vm/aGameRosterTimer.js?<%=DevBumper%>"></script> -->
            <!-- <script type="text/javascript" src="../../../appLib/dev/AGAMELEAGUES1/vm/xTremeOwnersRanking.js?<%=DevBumper%>"></script> -->
            <!-- <script type="text/javascript" src="../../../3/ng/AgameLeague/js/flipclock.js?<%=DevBumper%>"></script> -->
            <link rel="stylesheet" href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />
            <script src="https://kit.fontawesome.com/550f4bc1b1.js" crossorigin="anonymous"></script>
            <link rel="stylesheet" href="../AcuityAdmin/css/acuity-admin.css?<%=DevBumper%>" />
            <link rel="stylesheet" href="../UserDashboard/css/user-dashboard-styles.css?<%=DevBumper%>" />
            <!-- <link rel="stylesheet" href="./css/trophyManager.css?<%=DevBumper%>" />
            <link rel="stylesheet" href="../AgameFlex/css/agame-flex-styles.css?<%=CONFMGR.Bump()%>" /> -->
        </asp:PlaceHolder>
        <style> 
            DIV.devHolder {
                padding-left:50px;
                padding-right:50px;
                padding-bottom:25px;
                min-width:99%;
                max-width:99%;
                background-color:lightgray;
                overflow:auto;
            }
            .container{
                min-width:99%;
                max-width:99%;
                min-height:60vh;
                max-height:60vh;
            }

        </style>
    </head>

    <body ng-controller="legacyController">
        <ng-legacy-container>
            <ng-embedded-login></ng-embedded-login>
            <section class="acuity-app" ng-show="LOGGED_IN()">
                <ng-embedded-header></ng-embedded-header>
                <!-- <div>
                    <ng-data-analysis></ng-data-analysis>
                </div> -->
                <div class="devHolder">
                    <select id="promptBasis"></select>
                    <button id="btnCheck">Check Length</button>
                    <button id="btnGo">Go</button>
                    <span id="indicator" style="display:none;">Loading...</span>
                    <div style="clear:both;">&nbsp;</div>
                    <div>
                        <h6>Prompt</h6>
                        <textarea id="prompt" rows="5" cols="100"></textarea>
                    </div>
                    <br />
                    <div style="min-width:40vw;max-width:40vw;display:inline-block;min-height:50vh;max-height:50vh;vertical-align: top;border:1px solid black;">
                        <div>
                            <h3>Input</h3>
                            <!-- <button id="btnLoadData" class="button btn"">Load Input</button> -->
                        </div>
                        <div class="container">
                            <textarea id="data" class="text" rows="25" cols="80"></textarea>
                        </div>
                        
                    </div>
                    <div style="min-width:45vw;max-width:45vw;display:inline-block;min-height:50vh;max-height:50vh;vertical-align: top;border:1px solid gray;">
                        <h3>Response</h3>
                        <div class="container">
                            <textarea id="response" class="text" rows="25" cols="80"></textarea>
                        </div>
                        
                    </div>
                    <!-- <div style="min-width:19vw;max-width:19vw;display:inline-block;min-height:80vh;max-height:80vh;vertical-align: top;border:1px solid green;background-color:black;color:lime;">
                        <h3>Dev Info</h3>
                        <div class="container">
                            <textarea id="aiInfo" class="text" rows="50"></textarea>
                        </div>
                        
                    </div> -->
                    <!-- <ng-xtreme-owners-ranking></ng-xtreme-owners-ranking> -->
                    <!-- <ng-agame-roster-timer></ng-agame-roster-timer> -->
                    <!-- <ng-user-promotion-manager></ng-user-promotion-manager> -->
                </div>
                <script>
                    let promptInfo = [
                        {value:"CSATComment",status:"A", text:"CSAT Comments", promptQuery:"Using the following as JSON as Customer Satisfaction Comments, please provide the following: The top 10 areas that are positive, the top 10 areas that need improvements and any other relevant data that we can use to improve our business."},
                        {value:"surveydate", status:"A", text:"Survey Dates", promptQuery:"Using the following as JSON as Customer Satisfaction Comments, please provide the following: The top 10 areas that are positive, the top 10 areas that need improvements and any other relevant data that we can use to improve our business. In the area that needs improvement, can you access which area would be the most important assuming comments are based on a pharmacy fulfilling orders."},
                        {value:"SKTouchComment", status:"I", text:"Sidekick Touch Response Comment", promptQuery:"Using the following JSON as Response Comments, please provide the following: The top 3 positive things said, the top 3 areas that need improvement for the each of the people doing the evalation."},
                    ]
                    let payLoad = [];

                    $(document).ready(function(){                        
                        $("#promptBasis").empty();
                        $(promptInfo).each(function(){
                            if(this.status == "A")
                            {
                                $("#promptBasis").append(`<option value="${this.value}">${this.text}</option>`);
                            }
                        })
                        GetPromptInfo();
                    });
                    $("#promptBasis").on("change", function(){
                        GetPromptInfo();
                    });

                    function GetPromptInfo(){
                        let val = $("#promptBasis").val();
                        if(val == null || val == "")
                        {
                            val = "CSATComment";
                        }
                        let defaultPrompt = promptInfo.find(i => i.value == val).promptQuery;
                        $("#prompt").val(defaultPrompt);

                    }

                    $("#btnGo").on("click", function(){
                        $("#response").val("");
                        //$("#aiInfo").val("");
                        SendRequest();
                    });
                    $("#btnCheck").on("click", function(){
                        alert(`Prompt Length: ${parseInt($("#prompt").val().length)}\nData Length: ${$("#data").val().length}\n`);
                    });
                    $("#btnLoadData").on("click", function(){
                        let dataAreaToLoad = $("#promptBasis").val();
                        if(dataAreaToLoad == null || dataAreaToLoad == "")
                        {
                            dataAreaToLoad = "CSATComment";
                        }
                        GetInputDataForArea(function(dataToProcessList){
                            RenderInputDataForArea(null, dataToProcessList);
                        }, dataAreaToLoad);

                    });
                    function SendRequest()
                    {
                        $("#indicator").show();
                        let data = $("#data").val();
                        let fullPrompt = $("#prompt").val();
                        //let fullPrompt =  promptInfo.find(i => i.value == $("#promptBasis").val()).promptQuery;
                        //let fullPrompt = "Using the following as JSON as Customer Satisfaction Comments, please provide the following: The top 10 areas that are positive, the top 10 areas that need improvements and any other relevant data that we can use to improve our business.";
                        $.post(
                            "https://aitest.acuityapmr.com/request/?ko=rr",
                            {
                                prefix: "www",
                                descPrompt: fullPrompt,
                                gridPrompt: data,
                                gridSignature: new Date(),
                                aiService: {                                    
                                    model:"gpt-4o",
                                    temperature: 0.0,
                                    max_tokens: 4096
                                }
                            },
                            function(data, status) {
                                //console.log("responseData: \n" + JSON.stringify(data));
                                let response = "";
                                if(data?.choices != null)
                                {
                                    response = data.choices[0].message.content;
                                }
                                else
                                {
                                    response = `Invalid response\n${JSON.stringify(data)}`;
                                }
                                //$("#aiInfo").val(`status:\n${status} data: \n${data}`);
                                $("#response").val(response);
                                $("#indicator").hide();
                            }
                        );
                    }
                    function GetInputDataForArea(callback, areaToLoad)
                    {
                        console.log("GetInputDataForArea()");
                    }
                    function RenderInputDataForArea(callback, listToRender, numberOfExampleToDisplay)
                    {
                        if(numberOfExampleToDisplay == null)
                        {
                            numberOfExampleToDisplay = 10;
                        }

                        console.log("RenderInputDataForArea()");
                    }
                    </script>
            </section>

        </ng-legacy-container>
    </body>
</html>
