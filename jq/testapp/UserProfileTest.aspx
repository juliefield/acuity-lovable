<%@ Page Language="C#" AutoEventWireup="true" CodeFile="UserProfile.aspx.cs" EnableTheming="false" StylesheetTheme="" Theme="" ValidateRequest="false" Inherits="_UserProfile" %>

<!DOCTYPE html>

<html ng-app="userprofileapp" >
<head id="head" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <!-- see purecss.io for docs -->
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.5.0/pure-min.css" />
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.5.0/grids-responsive-min.css">
    <link rel="stylesheet" type="text/css" media="screen" href="css/app.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="css/err.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="css/login.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="css/styles.css"  />
<asp:PlaceHolder runat="server">

    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.css"  />
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>


    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>appLib/js/logoanimation-1.0.0.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.14/angular.js"></script>


</asp:PlaceHolder>
</head>
<body>
    <div class="app-header gradient-lightest">
        <div class="app-logo"><h1><span>Acuity &reg;</span></h1></div>
        <div class="app-heading">User Profile</div>
        <div class="header-tile">
            <div class="err-icon">
            </div>
        </div>
        <div class="login-form" ng-controller="UserLoginController">
            <form id="loginForm" action="#">
                <div><label>Username:</label><input class="login-field" type="text" id="usernameId" name="F:username/R:nonblank:0" /></div>
                <div><label>Password:</label><input class="login-field" type="password" id="passwordId" name="F:password/R:nonblank:1" /></div>
                <div><button id="loginbutton" type="button" value="log in" ng-click="doLogin()" >Log In</button></div>
                <div><span class="login-validation"></span></div>
            </form>
        </div>
        <div class="login-welcome">Welcome <span class="login-username"></span> <a href='#' onclick="$.cookie('username','');location.reload();" title='Log Out'>Log Out</a><span class="login-lock"></span>
        </div>
        <div class="err-container"><div class="err-hide">Done with this error</div><div class="err-text">Acuity Error:</div><div class="err-content">&nbsp;</div><div class="err-text">This notice has already been submitted to technical services.  If you would like to add more information, please enter it below and submit.</div><div><input id="errinput" type="text" style="width: 500px;" value="" /><input id="errsubmit" type="button" value="Submit" /></div><div class="err-text">We will work diligently to correct this problem.  You will be notified when we have a solution or work-around for you.</div></div>
    </div>
    <div class="content">
        <div class="auth-hide"  >
            Please Log In.
        </div>
        <div class="auth-show" style="display:none;">
            <div class="loading" style="display:none;">Loading&#8230;</div>

            <div class="pure-menu pure-menu-open pure-menu-horizontal"ng-controller="userlistController as users" id="userSelection" >

                <ul ng-repeat="section in sections" >
                    <li> 
                        <a href="#" ng-click="chooseSection( section.value )" >
                            <span>{{ section.name }}</span>
                        </a>
                    </li>
                </ul>
                <div class="pure-menu-heading" >
                    <label for="userSelect">Select A User</label>
                    <select ng-options="user.text for user in users.list track by user.val" ng-model="selectedUser" ng-change="userChanged()" id="userSelect">
                        <option value="">- none -</option>
                    </select>
                </div>


            </div>
            <div id="userProfileGrid" ng-controller="userController" class="pure-g"> <!-- only used to bind the UserViewModel -->
                <div class="pure-u-1 pure-u-lg-2-3">
                  <div class="pure-u-1 pure-u-lg-2-2" ng-show="demo">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                            <!-- <legend>User</legend> -->
                            <div class="pure-control-group">
                                <label for="firstName">First Name:</label>
                                <input id="firstName" type="text" ng-model="user.name.first" />
                            </div>
                            <div class="pure-control-group">
                                <label for="lastName">Last Name:</label>
                                <input id="lastName" type="text" ng-model="user.name.last" />
                            </div>
                             <div class="pure-control-group">
                                <label for="sex">Sex:</label>
                                <input id="sex" type="text" ng-model="user.demographics.sex" />
                            </div>
                            <div class="pure-control-group">
                                <label for="race">Race:</label>
                                <input id="race" type="text" ng-model="user.demographics.ethnicity" />
                            </div>
                            <div class="pure-control-group">
                                <label for="recruitedby">Recruited By:</label>
                                <input id="recruitedby" type="text" ng-model="user.employment.recruitedBy" />
                            </div>
                             <div class="pure-control-group">
                                <label for="recruitingoffice">Recruiting Office:</label>
                                <input id="recruitingoffice" type="text" ng-model="user.employment.recruitingOffice" />
                            </div>
                              <div class="pure-control-group">
                                <label for="worklocation">Work Location:</label>
                                <input id="worklocation" type="text" ng-model="user.employment.workLocation" />
                            </div>

<!--                        
                            <div class="pure-controls">
                                <button data-bind="click: save" class="pure-button">save</button>     
                            </div>    -->
                        </fieldset>
                    </form> 
                </div>
                
                <div class="pure-u-1" ng-show="recruit">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                        <!-- <legend>CV</legend> -->
                           <div class="pure-control-group">
                                <label for="adrespondedto">Ad Responded To:</label>
                                <input type="text" id="adrespondedto" ng-model="user.employment.recruitment.adResponse" />
                            </div>

                            <div class="pure-control-group">
                                <label for="workExperienceYears">Total Work Experience (Years):</label>
                                <input type="text" id="workExperienceYears" ng-model="user.employment.recruitment.resume.workExperienceYears" />                            
                            </div>
                            <div class="pure-control-group">
                                <label for="csrYears">Customer Service Experience (Years):</label>
                                <input type="text" id="csrYears" ng-model="user.employment.recruitment.resume.customerServiceExperienceYrs" />                            
                            </div>
                            <div class="pure-control-group">
                                <label for="retailYears">Retail Experience (Years):</label>
                                <input type="text" id="retailYears" ng-model="user.employment.recruitment.resume.retailExperienceYrs" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="salesYears">Sales Experience (Years):</label>
                                <input type="text" id="salesYears" ng-model="user.employment.recruitment.resume.salesExperienceYrs" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="otherYears">Other Experience (Years):</label>
                                <input type="text" id="otherYears" ng-model="user.employment.recruitment.resume.otherExperienceYrs" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="currentlyEmployed">Currently Employed</label>
                                <input type="text" id="currentlyEmployed" ng-model="user.employment.recruitment.resume.currentlyEmployed" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="education">Education:</label>
                                <input type="text" id="education" ng-model="user.employment.recruitment.resume.education" />                            
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="pure-u-1 " ng-show="corrective">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                        <!-- <legend>CV</legend> -->
                              <div ng-repeat="ca in user.employment.correctiveAction">
                                    <strong>Corrective Action <span data-bind="text: $index() + 1"></span></strong>
                                   <div class="pure-control-group">
                                       <label for="givenBy">Given By:</label>
                                        <input type="text" id="givenBy" ng-model="ca.givenBy.name" />
                                        <label for="givenBy">Role:</label>
                                        <input type="text" id="givenBy" ng-model="ca.givenBy.role" />
                                    </div>
                                    <div class="pure-control-group">
                                       <label for="witnessedBy">Witnessed By:</label>
                                        <input type="text" id="witnessedBy" ng-model="ca.witnessedBy.name" />
                                       <label for="witnessedBy">Role:</label>
                                        <input type="text" id="witnessedBy" ng-model="ca.witnessedBy.role" />
                                    </div>
                                    <div class="pure-control-group">
                                        <label for="dateofCI">Date:</label>
                                        <input type="text" id="dateofCI" ng-model="ca.date" />
                                    </div>
                                    <div class="pure-control-group">
                                        <label for="dateofCI">Disposition:</label>
                                        <textarea id="dateofCI" ng-model="ca.disposition" ></textarea>
                                    </div>
                                    <div class="pure-control-group">
                                        <label for="dateofCI">Notes:</label>
                                        <textarea id="dateofCI" ng-model="ca.notes" ></textarea>
                                    </div>
                                    <span> CES Scores</span>
                                    <div ng-repeat="sc in ca.scores">
                                        <div class="pure-control-group" >
                                            <label>{{ sc.type }}</label>
                                            <span> {{ sc.score }}</span>
                                        </div>
                                    </div>
                            </div>

                        </fieldset>
                    </form>
                </div>
                <!-- interviews -->
                  <div class="pure-u-1" ng-show="interview">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                              <div ng-repeat="interview in user.employment.recruitment.interviews">
                                    <strong><span data-bind="text: type"></span> Interview</strong>
                                   <div class="pure-control-group">
                                       <label for="givenBy">Date:</label>
                                        <input type="text" id="givenBy" ng-model="interview.date" />
                                        <label for="givenBy">Notes:</label>
                                        <input type="text" id="givenBy" ng-model="interview.notes" />
                                    </div>
                                    <strong><span data-bind="text: type"></span> Results</strong>
                                    <div ng-repeat="result in interview.results">
                                        <div class="pure-control-group" >
                                            <label>{{ result.section }}</label>
                                            <input type="text" ng-model="result.score" />
                                        </div>
                                    </div>
                            </div>
                            <div class="pure-controls">
                                <a href="#interviewModal" role="button" class="pure-button-primary pure-button" data-toggle="modal">
                                    Add New Interview
                                </a>
                            </div>
                        </fieldset>
                    </form>
                      <!-- Add interview Modal -->
                  <div class="modal fade" id="interviewModal" tabindex="-1" role="dialog" aria-labelledby="interviewModal" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                            <div class="modal-header">
                              <h4 class="modal-title" id="interviewModal">Add Interview</h4>
                            </div>
                            <div class="modal-body">
                                 <form class="pure-form pure-form-aligned">
                                    <fieldset>
                                        <div class="pure-control-group">
                                            <label for="projectname">Type:</label>
                                            <input id="projectname" type="text" ng-model="user.newinterviewtype" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="projectsupervisor">Date:</label>
                                            <input id="projectsupervisor" type="text" ng-model="user.newinterviewdate" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="startdate">Notes:</label>
                                            <input id="startdate" type="text" ng-model="user.newinterviewnotes" />
                                        </div>
                                       <div class="pure-control-group">
                                            <label for="secOntime">On Time:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewontime" id="interviewOnTime"></select>
                                        </div>

                                        <div class="pure-control-group">
                                            <label for="secOntime">Appearance:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewappearance" id="interviewAppearance"></select>
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="secOntime">Articulate:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewarticulate" id="newinterviewarticulate"></select>
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="secOntime">Professionalism:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewprofessional" id="newinterviewprofessional"></select>
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="secOntime">Enthusiasm:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewenthusiasm" id="newinterviewenthusiasm"></select>
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="secOntime">Other 1:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewother1" id="newinterviewother1"></select>
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="secOntime">Other 2:</label>
                                            <select data-bind="options: newinterviewscores, value: newinterviewother2" id="newinterviewother2"></select>
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="pure-button pure-button-default" data-dismiss="modal">Close</button>
                              <button type="button" data-bind="click: addInterview" class="pure-button pure-button-primary" data-dismiss="modal">Save changes</button>
                            </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
                <div class="pure-u-1 pure-u-lg-1-3">
                    <form class="pure-form pure-form-aligned"  >
                        <fieldset>
                            <div class="pure-controls">
                                <button data-bind="click: save" class="pure-button pure-button-primary">Update All</button>
                            </div>
                        </fieldset>
                    </form>
                    <form class="pure-form pure-form-aligned"  >
                        <fieldset>
                        <!-- <legend>Projects</legend> -->
                            <div class="pure-control-group">
                                <label>
                                    Current User:
                                </label>
                                <strong >{{ user.name.first }}&nbsp;{{ user.name.last }}</strong>
                            </div>
                            <div ng-repeat="proj in user.employment.project">
                               <div class="pure-control-group">
                                    <label ng-show="$index == 0">Current Project:</label>
                                    <label ng-show="$index > 0">Previous Project {{$index}}:</label>
                                    <strong >{{ proj.name }}</strong>
                               </div> 
                               <div class="pure-control-group">
                                    <label ng-show="$index == 0">Current Supervisor:</label>
                                    <label ng-show="$index > 0">Previous Supervisor {{$index}}:</label>
                                    <strong>{{ proj.supervisor }}</strong>
                                </div>
                            </div>
                            <div class="pure-control-group">
                                <label>Total Tenure (Mo's):</label><strong>28</strong>
                            </div>

                            <div class="pure-control-group">
                                <label>Total Average CEScore:</label><strong>5.8</strong>
                            </div>

                            <div class="pure-controls">
                                <a href="#projectModal" role="button" class="pure-button-primary pure-button" data-toggle="modal">
                                    Add New Project
                                </a>
 
                            </div>   


                        </fieldset>
                    </form>

              
                  <!-- Add project Modal -->
                  <div class="modal fade" id="projectModal" tabindex="-1" role="dialog" aria-labelledby="projectModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                            <div class="modal-header">
                              <h4 class="modal-title" id="projectModalLabel">Add Project</h4>
                            </div>
                            <div class="modal-body">
                                 <form class="pure-form pure-form-aligned">
                                    <fieldset>
                                        <div class="pure-control-group">
                                            <label for="projectname">Name:</label>
                                            <input id="projectname" type="text" ng-model="user.newprojectname" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="projectsupervisor">Supervisor:</label>
                                            <input id="projectsupervisor" type="text" ng-model="user.newprojectsuper" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="startdate">Start Date:</label>
                                            <input id="startdate" type="text" ng-model="user.newprojectstart" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="enddate">End Date:</label>
                                            <input id="enddate" type="text" ng-model="user.newprojectend" />
                                        </div>
                                    </fieldset>
                                </form>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="pure-button pure-button-default" data-dismiss="modal">Close</button>
                              <button type="button" data-bind="click: addProject" class="pure-button pure-button-primary" data-dismiss="modal">Save changes</button>
                            </div>
                      </div>
                    </div>
                  </div>

                </div>

              
                <div class="pure-u-1 pure-u-lg-1-2">
                                             
                </div>
               
                
            </div>
        </div>
    </div>
<!-- Concat and minify when on production -->
<script type="text/javascript" src="js/libs/appLib.js"></script>
<script type="text/javascript" src="js/libs/modal.js"></script>
<script src="js/services/dataservice.js"></script>
<script src="js/controllers/userlist.js"></script>
<script src="js/controllers/userlogin.js"></script>
<script src="js/controllers/user.js"></script>
<!-- 
<script src="js/libs/ko-postbox.js"></script>
<script src="js/viewmodels/init.js"></script>
<script src="js/viewmodels/user.js"></script>
<script src="js/viewmodels/login.js"></script>
<script src="js/init.js"></script> -->
<script>
    // $(".loading").show();
    // a$.ajax({
    //     type: "GET", 
    //     service: "JScript", 
    //     async: true, 
    //     data: { lib: "userprofile", cmd: "getlistuser" }, 
    //     dataType: "json", 
    //     cache: false, 
    //     error: function() {
    //         a$.ajaxerror;
    //         $(".loading").hide();
    //     },
    //     success: function(json) { 
    //         $(".loading").hide();
    //     }
    // });
</script>

</body>
</html>