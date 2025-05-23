<%@ Page Language="VB" AutoEventWireup="false" CodeFile="WorkOrder.aspx.vb" ValidateRequest="false" Inherits="jq_WorkOrder" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
	<head runat="server">
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
		<title>TP1 Work Order</title>
        <META NAME="ROBOTS" CONTENT="NOINDEX, NOFOLLOW">

    	<link href="appTask/themes/default/theme.css" type="text/css" rel="stylesheet" />	

        <link rel="stylesheet" href="jquery-ui/development-bundle/themes/base/jquery.ui.all.css" />
        <link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/themes/smoothness/jquery-ui-1.8.16.custom.css"  />
    	<link rel="stylesheet" type="text/css" media="screen" href="jqgrid40/css/ui.jqgrid.css"  />
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
        <script type="text/javascript" src="jquery-ui/js/jquery-1.5.1.min.js"></script>
        <script type="text/javascript" src="jquery-ui/js/jquery-ui-1.8.12.custom.min.js"></script>
   	    <script src="jquery/plugins/jquery.cookie.js" type="text/javascript"></script>

        <script type="text/javascript" src="appLib/js/appLib.js"></script>
        <script type="text/javascript" src="appTask/js/appTask.js"></script>
        <script type="text/javascript" src="jform/js/main.js"></script>

        <script src="jqgrid40/js/grid.locale-en.js" type="text/javascript"></script>
        <script src="jqgrid40/js/jquery.jqGrid.min.js" type="text/javascript"></script>
      	<script src="jquery-ui/development-bundle/ui/jquery.ui.core.js" type="text/javascript"></script>
    	<script src="jquery-ui/development-bundle/ui/jquery.ui.widget.js" type="text/javascript"></script>
    	<script type="text/javascript" src="jquery-ui/development-bundle/ui/jquery.ui.tabs.js"></script>
	    <script src="jquery-ui/development-bundle/ui/jquery.ui.mouse.js" type="text/javascript"></script>
	    <script src="jquery-ui/development-bundle/ui/jquery.ui.draggable.js" type="text/javascript"></script>
				
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
        <link href='TOUCHPOINT/css/styles.css' rel='stylesheet' />
        <link href='TOUCHPOINT/css/sectionboxes.css' rel='stylesheet' />
<style type="text/css">
  fieldset { margin-right: 0.5em; width: auto; }
  fieldset legend { }
  fieldset legend div { margin: 0.3em 0.5em; }
  fieldset .field { margin: 0.5em; padding: 0.5em; }
  fieldset .field select { width: 205px; }
  fieldset .field input { width: 200px; }
  fieldset .pfield label { float:left; width: 200px; margin-right: 0.4em; }
  fieldset .pinput { float:left; width: 200px; margin-right: 0.4em; font-weight: bold; }
  fieldset .efield label { float:left; width: 200px; margin-right: 0.4em; margin-left: 10px; }
  fieldset .einput { float:left; width: 200px; margin-right: 0.4em; font-weight: normal; }
  fieldset .field label { float:left; width: 200px; margin-right: 0.4em; }
  .logtable { float:left; margin-top:3px; font-size: x-small; width: 45%; margin-right: 3%; }
  .logtable td { padding-left: 0.4em; padding-right: 0.4em; }
  .logtable th { padding-left: 0.4em; padding-right: 0.4em; background-color: lightgray; }
  .divider { display:block;margin: 0 20px 0 20px;border-top: 1px solid lightgray; margin-bottom: 3px; display:none; }
</style>

	</head>

<body id="ProductMgt" style="position:relative;" runat="server">
 <div id="container">
   <!--#include file="inc_tp1head.aspx"-->
    <div id="contentnosidebar" style="position:relative;width: auto;">
        <div class="workorder">
            <div id="anon" style="display:none; position:relative;">
                <form id="workorderform" action="#">
                    <div id="workorderaddlinks" class="field" style="float:right; margin-right: 20px; display:none;">
                        <a href="#" onclick="appTask.initworkrequest(3); return false;">back to list</a><br />
                    </div>
                    <fieldset id="anonfieldset" class="ui-widget ui-widget-content" style="position:absolute; width:900px; top: 0px; left: -1000px;">
                        <legend class="ui-widget-header ui-corner-all"><div>Work Request</div></legend>
                        <div>
                            <div class="field" style="float:left;">
                                <label id="namelabel">Your Name</label>
                                <input type="text" id="requestor" name="R:requestor" tabindex="1"/>
                            </div>
                            <div class="field" style="float:left;">
                                <label id="emaillabel">Email Address</label>
                                <input type="text" id="email" style="width: 200px;" name="R:email" tabindex="3" />
                            </div>
                        </div>
                        <div style="clear:left;">
                            <div class="field" style="float:left;">
                                <label>Best Time to Contact</label>
                                <input type="text" id="besttime" name="R:besttime" tabindex="2" />
                            </div>
                            <div id="reenter" class="field" style="float:left;">
                                <label >Re-Enter Email Address</label>
                                <input type="text" id="reemail" style="width: 200px;" name="reemail" tabindex="4" />
                            </div>
                            <div id="servicediv" class="field" style="float:left; display:none;">
                                <label >Service Team</label>
                                    <select id="serviceteam" multiple size="4">
                                        <option selected="selected" value="dweathers">dweathers</option>
                                        <option selected="selected" value="jeffgack">jeffgack</option>
                                        <option selected="selected" value="leslie">leslie</option>
                                        <option value="casey">casey</option>
                                    </select>
                            </div>
                            <div id="initialstatusdiv" class="field" style="float:left;">
                                <label>Initial Status</label>
                                <select id="initialstatus" name="initialstatus" tabindex="4">
                                    <option value="new">new</option>
                                    <option value="Awaiting Client Action">Awaiting Client Action</option>
                                    <option value="Awaiting Estimate Approval">Awaiting Estimate Approval</option>
                                    <option value="Awaiting Developer Estimate">Awaiting Developer Estimate</option>
                                    <option value="Awaiting Client Action">Awaiting Client Action</option>
                                    <option value="Approved">Approved</option>
                                    <option value="HOLD">HOLD</option>
                                    <option value="Decline">Decline</option>
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Review">Review</option>
                                    <option value="Complete">Complete</option>
                                    <option value="">none</option>
                                </select>
                            </div>
                        </div>
                        <div style="clear:left;">
                            <div class="field" style="float:left;">
                                <label>Product/Project</label>
                                <select id="product" name="R:product" tabindex="5">
                                    <option value="Acuity">Acuity</option>
                                    <option value="Website">Touchpoint Website</option>
                                </select>
                            </div>
                            <div class="field" style="float:left;">
                                <label>Request Type</label>
                                <select id="requesttype" name="R:requesttype" tabindex="6">
                                    <option value="New Feature">New Feature</option>
                                    <option value="Change">Change</option>
                                    <option value="Repair">Repair</option>
                                    <option value="Review/Validation">Review/Validation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div id="titlediv" class="field" style="clear:left; display:none;">
                            <label>Title</label>
                            <input type="text" id="title" name="title" style="width:600px;" tabindex="6"/>
                        </div>
                        <div class="field" style="clear:left;">
                            <label>Describe Your Request</label><br />
                            <textarea id="descr" name="R:descr" rows="5" cols="103" tabindex="7"></textarea>
                        </div>
                        <div style="clear:left;">
                            <div class="field" style="float:left;">
                                <label>Requested Completion Date</label>
                                <input type="text" id="completiondate" name="R:completiondate" class="date" tabindex="8" />
                            </div>
                            <div class="field" style="float:left;">
                                <label>Priority</label>
                                <select id="priority" name="priority" tabindex="9">
                                    <option value="2-normal">normal</option>
                                    <option value="1-high">high</option>
                                    <option value="3-low">low</option>
                                </select>
                            </div>
                        </div>
                        <div id="wosubmit" style="clear:left;">
                            <div style="color:red; margin-left:20px;" id="workorderformfv"></div>
                            <div class="field">
                                <button onclick="if (appLib.fv(this,'workorderformfv')) if (appLib.fvmatch('workorderformfv','email','reemail','Email addresses must match.')) { appTask.post('workorder'); }; return false;" tabindex="9">Submit</button>
                            </div>
                        </div>
                        <div id="woaddsubmit" style="clear:left;">
                            <div style="color:red; margin-left:20px;" id="workordersformaddfv"></div>
                            <div class="field">
                                <button onclick="if (appLib.fv(this,'workordersformaddfv')) { appTask.post('workorderadd'); }; return false;" tabindex="9">Submit</button>
                            </div>
                        </div>
                        <div id="woupdate" style="clear:left;">
                            <div style="color:red; margin-left:20px;" id="woupdateformfv"></div>
                            <div class="field">
                                <button onclick="appTask.post('workorderupdate'); return false" >Update</button>
                            </div>
                        </div>

                    </fieldset>
                    <div id="anonthankyou" style="display:none; border: 0px solid black;">
                        <h2>Thank You! - Please check your inbox and CONFIRM your request</h2>
                        <p>We just sent you an email containing a link - Please click on that link to confirm your work request.</p>
                        <p>We look forward to serving you.</p>
                    </div>
                </form>
                <div id="fancyexample" style="display:none;">
                <fieldset>
                    <legend>jQuery UI Form EXAMPLE</legend>
                    <table>
                        <tr><td>Enter Name </td><td><input type="text"  /></td></tr>
                        <tr><td>It has a Datepicker</td><td><input type="text" class="date" /></td></tr>

                        <tr><td><input type="checkbox" name="language" value="java" />Java</td></tr>
                        <tr><td><input type="checkbox" name="language" value="php" />PHP</td></tr>
                        <tr><td><input type="checkbox" name="language" value="javascript" />Javascript</td></tr>
                        <tr><td><input type="checkbox" name="language" value="html/css" />HTML/CSS</td></tr>

                        <tr><td><input type="radio" name="choice" /> Web Developer</td></tr>
                        <tr><td><input type="radio" name="choice" /> Web Designer</td></tr>
                        <tr><td><input type="radio" name="choice" /> UI/UE Developer</td></tr>

                        <tr><td><input type="radio" name="choice" /> Tester</td></tr>

                        <tr>
                            <td>Experience 
                                <select> 
                                    <option >Fresher</option>
                                    <option>&lt;1 year</option>
                                    <option>1-2 years</option>
                                    <option>2-3 years</option>
                                    <option>3-4 years</option>
                                    <option>4-5 years</option>
                                    <option>5-6 years</option>
                                </select>
                              </td>
                        </tr>
                        <tr><td>Tell Us about Yourself </td><td><textarea></textarea></td></tr>
                        <tr><td><input type="reset" /></td><td><input type="submit" value="Enter" /></td></tr>

                    </table>
                </fieldset>
                </div>
            </div>
            <div id="nonanon" style="display:none;">
                <div class="workorderlist" style="margin-top: 10px; display:none;">
                    <fieldset class="ui-widget ui-widget-content">
                    <div style="clear:left;">
                        <div class="field" style="float:left;">
                            <label>Group By:</label><select id="chngroup">
                                <option value="due">due</option>
                                <option value="status">status</option>
                                <option value="priority">priority</option>
                                <option value="requestor">requestor</option>
                                <option value="product">product</option>
                                <option value="requesttype">requesttype</option>
                                <option value="handling">handling</option>
                                <option value="verified">verified</option>
                                <option value="clear">remove grouping</option>
                            </select>
                        </div>
                        <div class="field" style="float:right; margin-right: 20px;">
                            <a href="#" onclick="appTask.initworkrequest(2); return false;">add new work order</a>
                        </div>
                    </div>
                    <div id="mytable1" style="clear:left; z-index:1;margin-left:20px;font-size:x-small;">
                        <table id="list1"></table>
                        <div id="pager1"></div>
                    </div>
                    <div class="field">
                        <a href="#" onclick="appTask.initworkrequest(); return false;">refresh</a><br />
                    </div>
                    </fieldset>
                </div>
                <div class="workorderpanel1" style="display:none;">
                     <div id="woblast" style="padding-top:20px;"></div>
                    <div class="divider">&nbsp;</div>
                </div>
                <fieldset id="rolefieldset" class="ui-widget ui-widget-content" style="display:none;">
                    <legend class="ui-widget-header ui-corner-all" style="float:left;"><div>Add to Log</div></legend>
                    <div style="float:right; margin-right: 20px; margin-top:20px;">
                        <a href="#" onclick="appTask.backtolist(); return false;">back to list</a><br />
                        <a href="#" onclick="appTask.editworkorder(); return false;">edit work order</a><br />
                        <a href="#" onclick="appTask.initworkrequest(2); return false;">add new work order</a>
                        <div id="rolediv">
                            Role: <select id="roleselect" onchange="appTask.changerole(this);"></select>
                        </div>
                    </div>
                    <div id="csm" style="display:none;">
                        <form id="csmstatusform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Change Status</label>
                                    <select class="einput" id="csmstatus" name="R:csmstatus">
                                        <option value="Awaiting Client Action">Awaiting Client Action</option>
                                        <option value="Awaiting Developer Estimate">Awaiting Developer Estimate</option>
                                        <option value="Awaiting Executive Decision">Awaiting Executive Decision</option>
                                        <option value="Approved">Approved</option>
                                        <option value="HOLD">HOLD</option>
                                        <option value="Decline">Decline</option>
                                        <option value="Complete">Complete</option>
                                    </select>
                                </div>
                                <div class="efield" style="float:left;">
                                    <label>Notes</label>
                                    <input class="einput" type="text" id="csmstatusnotes" name="csmstatusnotes"/>
                                </div>
                                <div id="csmstatusformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'csmstatusformfv')) { appTask.post('csmstatus'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                        <form id="csmnoteform" action="#">
                            <div style="clear:left;">
                                <div class="field" style="float:left;">
                                    <label>Note</label>
                                    <input type="text" id="csmnotenotes" name="csmnotenotes" style="width: 600px;"/>
                                </div>
                                <div id="csmnoteformfv" style="float:left;"></div>
                                <div class="field" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'csmnoteformfv')) { appTask.post('csmnote'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                        <form id="csmhandlingform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Handling Recommendation</label>
                                    <select class="einput" id="csmhandling" name="R:csmhandling">
                                        <option value="Recommend: Client-Specific Enhancement">Client-Specific Enhancement</option>
                                        <option value="Recommend: Contracted Service">Contracted Service</option>
                                        <option value="Recommend: Product Enhancement">Product Enhancement</option>
                                        <option value="Value">Value</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div class="efield" style="float:left;">
                                    <label>Notes</label>
                                    <input class="einput" type="text" id="csmhandlingnotes" name="csmhandlingnotes"/>
                                </div>
                                <div id="csmhandlingformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'csmhandlingformfv')) { appTask.post('csmhandling'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="dev" style="display:none;">
                        <form id="devstatusform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Change Status</label>
                                    <select class="einput" id="devstatus" name="R:devstatus">
                                        <option value="Awaiting Estimate Approval">Awaiting Estimate Approval</option>
                                        <option value="HOLD">HOLD</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Review">Review</option>
                                    </select>
                                </div>
                                <div class="efield" style="float:left;">
                                    <label>Notes</label>
                                    <input class="einput" type="text" id="devstatusnotes" name="devstatusnotes"/>
                                </div>
                                <div id="devstatusformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'devstatusformfv')) { appTask.post('devstatus'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                        <form id="devhandlingform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Handling Recommendation</label>
                                    <select class="einput" id="devhandling" name="R:devhandling">
                                        <option value="Value">Value</option>
                                    </select>
                                </div>
                                <div class="efield" style="float:left;">
                                    <label>Notes</label>
                                    <input class="einput" type="text" id="devhandlingnotes" name="devhandlingnotes"/>
                                </div>
                                <div id="devhandlingformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'devhandlingformfv')) { appTask.post('devhandling'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                        <form id="devnoteform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Note</label>
                                    <input class="einput" type="text" id="devnotenotes" name="R:devnotenotes" style="width: 600px;"/>
                                </div>
                                <div id="devnoteformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'devnoteformfv')) { appTask.post('devnote'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div id="exec" style="display:none;">
                        <form id="execstatusform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Change Status</label>
                                    <select class="einput" id="execstatus" name="R:execstatus">
                                        <option value="Approved">Approved</option>
                                        <option value="HOLD">HOLD</option>
                                        <option value="Decline">Decline</option>
                                    </select>
                                </div>
                                <div class="efield" style="float:left;">
                                    <label>Notes</label>
                                    <input class="pinput" type="text" id="execstatusnotes" name="execstatusnotes"/>
                                </div>
                                <div id="execstatusformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'execstatusformfv')) { appTask.post('execstatus'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                        <form id="execnoteform" action="#">
                            <div style="clear:left;">
                                <div class="field" style="float:left;">
                                    <label>Note</label>
                                    <input type="text" id="execnotenotes" name="execnotenotes" style="width: 600px;"/>
                                </div>
                                <div id="execnoteformfv" style="float:left;"></div>
                                <div class="field" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'execnoteformfv')) { appTask.post('execnote'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                        <form id="exechandlingform" action="#">
                            <div style="clear:left;">
                                <div class="efield" style="float:left;">
                                    <label>Handling Decision</label>
                                    <select class="einput" id="exechandling" name="R:exechandling">
                                        <option value="Client-Specific Enhancement">Client-Specific Enhancement</option>
                                        <option value="Contracted Service">Contracted Service</option>
                                        <option value="Product Enhancement">Product Enhancement</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div class="efield" style="float:left;">
                                    <label>Notes</label>
                                    <input class="einput" type="text" id="exechandlingnotes" name="exechandlingnotes"/>
                                </div>
                                <div id="exechandlingformfv" style="float:left;"></div>
                                <div class="efield" style="float:left;">
                                    <button onclick="if (appLib.fv(this,'exechandlingformfv')) { appTask.post('exechandling'); }; return false;">Post</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </fieldset>
            </div>
        </div>
    </div>
</div>
<form id="themeform" runat="server">
<div id="NavConfig" style="display:none;" runat="server"></div>
</form>
<noscript>This page requires JavaScript.</noscript>

<script type="text/javascript">
    $(document).ready(function () {
        appTask.initworkrequest();
    });
</script>
<script type="text/javascript">var AllowAnonymous = true;</script>
<script type="text/javascript" src="TOUCHPOINT/js/TouchpointInterface-2.2.js"></script>
<script type="text/javascript">
    $(window).resize(function () {
        if (uiInterface) uiInterface.sizebars();
    });
</script>
</body>
</html>
