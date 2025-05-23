<%@ Page Language="C#" AutoEventWireup="true" CodeFile="default.aspx.cs" ValidateRequest="false" Inherits="_HelloWorld"
  %>
  <!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml" ng-app="angularApp">

  <head id="Head1" runat="server">
    <title>Acuity Quizing</title>
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
      <script type="text/javascript" src="js/controller.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="js/quizingTest.js?<%=DevBumper%>"></script>
      <script type="text/javascript" src="../../../appLib/js/services/mainServices.js?<%=CONFMGR.Bump()%>"></script>
      <script type="text/javascript" src="../../../jq/appApmClient/js/appApmContentTriggers-1.0.js?<%=CONFMGR.Bump()%>"></script>
      <!-- Login -->
      <link href="../../../appLib/dev/LOGIN1/LOGIN1-view/css/login-styles.css" rel="stylesheet">
      <script type="text/javascript" src="../../../appLib/dev/LOGIN1/LOGIN1-vm/login.js?<%=CONFMGR.Bump()%>"></script>
      <!-- HighCharts START -->
      <!-- <script src="../../../lib/highcharts-8.2.0/code/highcharts.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/highcharts-3d.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/modules/data.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/modules/drilldown.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/modules/exporting.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/modules/accessibility.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/modules/series-label.js?<%=CONFMGR.Bump()%>"></script>
      <script src="../../../lib/highcharts-8.2.0/code/modules/coloraxis.js?<%=CONFMGR.Bump()%>"></script> -->
      <!-- HighCharts END -->
      <link rel="stylesheet"
        href="../../../lib/jquery-ui/development-bundle/themes/base/jquery.ui.all.css?<%=CONFMGR.Bump()%>" />
      <!-- <link rel="stylesheet" href="css/acuity-auto-qa-styles.css?<%=DevBumper%>" /> -->
      <script src="https://kit.fontawesome.com/550f4bc1b1.js?<%=CONFMGR.Bump()%>" crossorigin="anonymous"></script>
    </asp:PlaceHolder>
  </head>

  <body ng-controller="legacyController">
    <ng-legacy-container>
      <ng-embedded-login></ng-embedded-login>
      <section class="acuity-app" ng-show="LOGGED_IN()">
        <ng-embedded-header iframehide="true"></ng-embedded-header>
        <div>
            Quizing stuffs here.<br>
            <hr>
            <a href="QuizAdmin.aspx">Quiz Admin</a><br>
            Current Status Information?<br>
            Quiz Dashboard?<br>
            Take Quiz?<br>
            <!-- <button id="btnTest">Test</button> -->
            <button id="btnLoadQuestionTypes">Load QuestionTypes</button>
            <button id="btnLoadQuizes">Load Quizes</button>
            <button id="btnLoadQuestions">Load Question</button>
            <button id="btnLoadResponses">Load Responses</button>
            &nbsp;&nbsp;
            &nbsp;&nbsp;
            &nbsp;&nbsp;
            <button id="btnSaveQuestion">Save Question</button>
            <button id="btnSaveQuiz">Save Quiz</button>
            <hr>
            <div>
              <button id="btnAssignQuestionToQuiz">Assign Question to Quiz</button>
              <button id="btnAssignResponseToQuestion">Assign Response to Question</button>
            </div>
            <hr>
            <div>
              <span>
                Quiz:<select id="quizSelector"></select>&nbsp;
              </span>
              <span>
                Question:
                <select id="questionSelector"></select> &nbsp;
              </span>
              <span>
                Response:
                <select id="responseSelector"></select> &nbsp;
              </span>

            </div>
        </div>
        <script>
          LoadEvents();
        </script>
        </section>
    </ng-legacy-container>
  </body>

  </html>
