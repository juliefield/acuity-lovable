<%@ Page Language="C#"  AutoEventWireup="true" CodeFile="UserProfile.aspx.cs" EnableTheming="false" StylesheetTheme="AcuityMV" Theme="" ValidateRequest="false" Inherits="_UserProfile" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="head" runat="server">
    <title>Ajax Interface</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />

<asp:PlaceHolder runat="server">

    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="<%=CONFMGR.AppSettings("jslib").ToString()%>modal/css/modal.css"  />

    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js"></script>

    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/knockout-3.2.0.js" type="text/javascript"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko.mapping.js"></script>
    <script src="<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko-postbox.js"></script>

    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>                                
    <script type="text/javascript" src="<%=CONFMGR.AppSettings("jslib").ToString()%>modal/js/modal.js"></script>

    <script type="text/javascript" src="../../appLib/js/appLib-1.1.15.js"></script>
    <script src="/appLib/js/logoanimation-1.0.0.js" type="text/javascript"></script>

    <script type="text/javascript" src="/appLib/js/viewmodels/login.js"></script>

</asp:PlaceHolder>

    <!-- see purecss.io for docs -->
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.6.0/pure-min.css" />
    <link rel="stylesheet" href="http://yui.yahooapis.com/pure/0.5.0/grids-responsive-min.css">

    <link rel="stylesheet" type="text/css" media="screen" href="css/styles.css"  />

</head>
<body>
    <div class="app-header gradient-lightest">
        <div class="app-logo"><h1><span>Acuity &reg;</span></h1></div>
        <div class="app-heading">User Profile</div>
        <div class="app-header-tile">
            <div class="err-icon">
            </div>
        </div>
        <!-- #Include virtual="../../applib/html/views/login.htm" -->
        <div class="err-container"><div class="err-hide">Done with this error</div><div class="err-text">Acuity Error:</div><div class="err-content">&nbsp;</div><div class="err-text">This notice has already been submitted to technical services.  If you would like to add more information, please enter it below and submit.</div><div><input id="errinput" type="text" style="width: 500px;" value="" /><input id="errsubmit" type="button" value="Submit" /></div><div class="err-text">We will work diligently to correct this problem.  You will be notified when we have a solution or work-around for you.</div></div>
    </div>
    <div class="content">
        <div class="auth-hide">
            Please Log In.
        </div>
        <div class="auth-show" style="display:none;" >
            <div class="loading">Loading&#8230;</div>

            <div id="userSelection">
                <div class="pure-form pure-control-group">
                    <fieldset>
                        <label for="userSelect">Select A User</label>
                        <select class="custom-control-combo" data-bind="options: user, optionsText: 'text', optionsValue: 'val', optionsCaption: '- none -', value: selected, event: { change: userChanged }, chosen: {} " id="userSelect"></select>
                    </fieldset>
                </div>
                <div class="pure-menu pure-menu-horizontal pure-menu-scrollable custom-close-top">
                    <ul  class="pure-menu-list" data-bind="foreach: sections">
                        <li class="pure-menu-item" data-bind="css: { customMenuActive: $root.selectedSection() === $data }, visible: $parent.selected()"> 
                            <a class="pure-menu-link" href="#" data-bind="click: $parent.selectedSection" >
                                <span data-bind="text: name" />
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="userProfileGrid" data-bind="if: viewModel()" class="pure-g"> <!-- only used to bind the UserViewModel -->
                <div class="pure-u-1 pure-u-lg-2-3" data-bind="with: viewModel()">
                  <div class="pure-u-1 pure-u-lg-2-2" data-bind="visible: demoVisible || (!recruitmentVisible && !interviewsVisible && !corrVisible)">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                            <!-- <legend>User</legend> -->
                            <div class="pure-control-group">
                                <label for="firstName">First Name:</label>
                                <input id="firstName" type="text" data-bind="value:name.first" />
                            </div>
                            <div class="pure-control-group">
                                <label for="lastName">Last Name:</label>
                                <input id="lastName" type="text" data-bind="value: name.last" />
                            </div>
                             <div class="pure-control-group">
                                <label for="sex">Sex:</label>
                                <input id="sex" type="text" data-bind="value: demographics.sex" />
                            </div>
                            <div class="pure-control-group">
                                <label for="race">Race:</label>
                                <select id="race" data-bind="options: ethnicityList, value: demographics.ethnicity"></select>
                            </div>
                            <div class="pure-control-group">
                                <label for="ageRange">Age Range:</label>
                                <select id="ageRange" data-bind="options: ageRangeList, value:demographics.ageRange"></select>

                            </div>
                            <div class="pure-control-group">
                                <label for="recruitedby">Recruited By:</label>
                                <!-- <input id="recruitedby" type="text" data-bind="value: employment.recruitedBy" /> -->
                                <select id="recruitedby" data-bind="options: recruitedByList, value: employment.recruitedBy"></select>
                            </div>
                             <div class="pure-control-group" >
                                <label for="recruitingoffice">Recruiting Office:</label>
                                <select id="recruitingOffice" data-bind="options: recruitList, optionsText: 'text', optionsValue: 'val', value: employment.recruitingOffice"></select>
                            </div>
                              <div class="pure-control-group">
                                <label for="worklocation">Work Location:</label>
                                <!-- <input id="worklocation" type="text" data-bind="value: employment.workLocation" /> -->
                                <select id="worklocation" data-bind="options: workLocationList, optionsText: 'text', optionsValue: 'val', value: employment.workLocation"></select>
                            </div>

<!--                        
                            <div class="pure-controls">
                                <button data-bind="click: save" class="pure-button">save</button>     
                            </div>    -->
                        </fieldset>
                    </form> 
                </div>
                
                <div class="pure-u-1" data-bind="visible: recruitmentVisible ">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                        <!-- <legend>CV</legend> -->
                           <div class="pure-control-group">
                                <label for="adrespondedto">Ad Responded To:</label>
                                <input type="text" id="adrespondedto" data-bind="value: employment.recruitment.adResponse" />
                            </div>

                            <div class="pure-control-group">
                                <label for="workExperienceYears">Total Work Experience (Years):</label>
                                <input type="text" id="workExperienceYears" data-bind="value: employment.recruitment.resume.workExperienceYears" />                            
                            </div>
                            <div class="pure-control-group">
                                <label for="csrYears">Customer Service Experience (Years):</label>
                                <input type="text" id="csrYears" data-bind="value: employment.recruitment.resume.customerServiceExperienceYrs" />                            
                            </div>
                            <div class="pure-control-group">
                                <label for="retailYears">Retail Experience (Years):</label>
                                <input type="text" id="retailYears" data-bind="value: employment.recruitment.resume.retailExperienceYrs" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="salesYears">Sales Experience (Years):</label>
                                <input type="text" id="salesYears" data-bind="value: employment.recruitment.resume.salesExperienceYrs" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="otherYears">Other Experience (Years):</label>
                                <input type="text" id="otherYears" data-bind="value: employment.recruitment.resume.otherExperienceYrs" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="currentlyEmployed">Currently Employed</label>
                                <input type="text" id="currentlyEmployed" data-bind="value: employment.recruitment.resume.currentlyEmployed" />                            
                            </div>

                            <div class="pure-control-group">
                                <label for="education">Education:</label>
                                <!-- <input type="text" id="education" data-bind="value: employment.recruitment.resume.education" />                             -->
                                <select id="education" data-bind="options: educationList, value: employment.recruitment.resume.education"></select>
                            </div>
                        </fieldset>
                    </form>
                </div>
                <div class="pure-u-1 " data-bind="visible: corrVisible">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                        <!-- <legend>CV</legend> -->
                              <div data-bind="foreach: employment.correctiveAction">
                                    <strong>Corrective Action <span data-bind="text: $index() + 1"></span></strong>
                                   <div class="pure-control-group">
                                       <label for="givenBy">Given By:</label>
                                        <input type="text" id="givenBy" data-bind="value: givenBy.name" />
                                        <label for="givenRole">Role:</label>
                                        <!-- <input type="text" id="givenBy" data-bind="value: givenBy.role" /> -->
                                        <select id="givenRole" data-bind="options: $parent.correctiveRoleList, value: givenBy.role"></select>
                                    </div>
                                    <div class="pure-control-group">
                                       <label for="witnessedBy">Witnessed By:</label>
                                        <input type="text" id="witnessedBy" data-bind="value: witnessedBy.name" />
                                       <label for="witnessedbyRole">Role:</label>
                                        <!-- <input type="text" id="witnessedBy" data-bind="value: witnessedBy.role" /> -->

                                        <select id="witnessedbyRole" data-bind="options: $parent.correctiveRoleList, value: witnessedBy.role"></select>
                                    </div>
                                    <div class="pure-control-group">
                                        <label for="dateofCI">Date:</label>
                                        <input type="text" id="dateofCI" data-bind="value: date" />
                                    </div>
                                    <div class="pure-control-group">
                                        <label for="dateofCI">Disposition:</label>
                                        <textarea id="dateofCI" data-bind="value: disposition" ></textarea>
                                    </div>
                                    <div class="pure-control-group">
                                        <label for="dateofCI">Notes:</label>
                                        <textarea id="dateofCI" data-bind="value: notes" ></textarea>
                                    </div>
                                    <span> CES Scores</span>
                                    <div data-bind="foreach: scores">
                                        <div class="pure-control-group" >
                                            <label data-bind="text: type"></label>
                                            <span data-bind="text: score"></span>
                                        </div>
                                    </div>
                            </div>

                        </fieldset>
                    </form>
                </div>
                <!-- interviews -->
                  <div class="pure-u-1" data-bind="visible: interviewsVisible">
                    <form class="pure-form pure-form-aligned" >
                        <fieldset>
                              <div data-bind="foreach: employment.recruitment.interviews">
                                    <strong><span data-bind="text: type"></span> Interview</strong>
                                   <div class="pure-control-group">
                                       <label for="givenBy">Date:</label>
                                        <input type="text" id="givenBy" data-bind="value: date" />
                                        <label for="givenBy">Notes:</label>
                                        <input type="text" id="givenBy" data-bind="value: notes" />
                                    </div>
                                    <strong><span data-bind="text: type"></span> Results</strong>
                                    <div data-bind="foreach: results">
                                        <div class="pure-control-group" >
                                            <label data-bind="text: section"></label>
                                            <input type="text" data-bind="value: score" />
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
                                            <label for="interviewtype">Type:</label>
                                            <!-- <input id="projectname" type="text" data-bind="value: newinterviewtype" /> -->
                                            <select id="interviewtype" data-bind="options: interviewTypeList, optionsText: 'text', optionsValue: 'val', value: newinterviewtype"></select>
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="projectsupervisor">Date:</label>
                                            <input id="projectsupervisor" type="text" data-bind="value: newinterviewdate" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="startdate">Notes:</label>
                                            <input id="startdate" type="text" data-bind="value: newinterviewnotes" />
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
                <div class="pure-u-1 pure-u-lg-1-3" data-bind="with: viewModel()">
                    <form class="pure-form pure-form-aligned"  >
                        <fieldset>
                            <div class="pure-controls">
                                <button data-bind="click: save" class="pure-button pure-button-primary">Update All</button>
                            </div>
                        </fieldset>
                    </form>
                    <form class="pure-form pure-form-aligned">
                        <fieldset>
                        <!-- <legend>Projects</legend> -->
                            <div class="pure-control-group">
                                <label>
                                    Current User:
                                </label>
                                <strong data-bind="text:name.full"></strong>
                            </div>
                            <div data-bind="foreach: employment.project">
                               <div class="pure-control-group">
                                    <label>
                                    <!-- ko if: $index() == 0 -->
                                    Current Project:
                                    <!-- /ko -->
                                     <!-- ko if: $index() > 0 -->
                                    Previous Project <span data-bind="text: $index"></span>:
                                    <!-- /ko -->
                                    </label>
                                    <strong data-bind="text: name"></strong>
                               </div> 
                               <div class="pure-control-group">
                                   <label>
                                    <!-- ko if: $index() == 0 -->
                                    Current Supervisor:
                                    <!-- /ko -->
                                     <!-- ko if: $index() > 0 -->
                                    Previous Supervisor <span data-bind="text: $index"></span>:
                                    <!-- /ko -->
                                    </label>
                                    <strong data-bind="text: supervisor"></strong>
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
                                            <input id="projectname" type="text" data-bind="value: newprojectname" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="projectsupervisor">Supervisor:</label>
                                            <input id="projectsupervisor" type="text" data-bind="value: newprojectsuper" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="startdate">Start Date:</label>
                                            <input id="startdate" type="text" data-bind="value: newprojectstart" />
                                        </div>
                                        <div class="pure-control-group">
                                            <label for="enddate">End Date:</label>
                                            <input id="enddate" type="text" data-bind="value: newprojectend" />
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
<script src="js/viewmodels/init.js"></script>
<script src="js/viewmodels/user.js"></script>

<script src="js/init.js"></script>
<script language="javascript">
</script>
</body>
</html>