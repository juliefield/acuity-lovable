<%@ Page Language="C#"  AutoEventWireup="true" CodeFile="default.aspx.cs" EnableTheming="false" StylesheetTheme="AcuityMV" Theme="" ValidateRequest="false" Inherits="agent_default" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "//www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="//www.w3.org/1999/xhtml" >
<head id="head" runat="server">
    <title>Acuity KB</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />

<asp:PlaceHolder runat="server">

<!-- see purecss.io for docs -->
<link rel="stylesheet" href="//yui.yahooapis.com/pure/0.6.0/pure-min.css" />
<link rel="stylesheet" href="//yui.yahooapis.com/pure/0.5.0/grids-responsive-min.css">

    <link rel="stylesheet" type="text/css" media="screen" href="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="../<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="../<%=CONFMGR.AppSettings("jslib").ToString()%>modal/css/modal.css"  />


    <script type="text/javascript" src="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/jquery-1.7.2.min.js"></script>
    <script type="text/javascript" src="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/ui/js/jquery-ui-1.8.16.custom.min.js"></script>

    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/jquery.cookie.js" type="text/javascript"></script>
    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>jquery/plugins/qtip2dev/dist/jquery.qtip.min.js" type="text/javascript"></script>
    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>harvesthq-chosen-12a7a11/chosen/chosen.jquery.js"></script>

    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/knockout-3.2.0.js" type="text/javascript"></script>
    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko.mapping.js"></script>
    <script src="../<%=CONFMGR.AppSettings("jslib").ToString()%>knockout/ko-postbox.js"></script>

    <script type="text/javascript" src="../<%=CONFMGR.AppSettings("jslib").ToString()%>raphael/raphael-2.1.0.js"></script>
    <script type="text/javascript" src="../<%=CONFMGR.AppSettings("jslib").ToString()%>modal/js/modal.js"></script>

    <script type="text/javascript" src="../../appLib/js/applib-1.1.15.js"></script>
    <script src="../../appLib/js/logoanimation-1.0.0.js" type="text/javascript"></script>

    <script type="text/javascript" src="../../applib/anothercolorpicker/src/jquery.simple-color.js"></script>
    <script type="text/javascript" src="../../appLib/js/viewmodels/agent-1.0.0.js"></script>
    <script type="text/javascript" src="../../appLib/js/viewmodels/login.js"></script>

</asp:PlaceHolder>

<!-- START CodeMirror Includes
<link rel=stylesheet href="../../applib/codemirror-5.24.2/doc/docs.css"> -->

<link rel=stylesheet href="../../applib/codemirror-5.24.2/lib/codemirror.css">
<script src="../../applib/codemirror-5.24.2/lib/codemirror.js"></script>
<script src="../../applib/codemirror-5.24.2/addon/edit/closetag.js"></script>
<script src="../../applib/codemirror-5.24.2/addon/fold/xml-fold.js"></script>
<script src="../../applib/codemirror-5.24.2/addon/FORMAT/formatting.js"></script>
<script src="../../applib/codemirror-5.24.2/mode/xml/xml.js"></script>
<script src="../../applib/codemirror-5.24.2/mode/javascript/javascript.js"></script>
<script src="../../applib/codemirror-5.24.2/mode/css/css.js"></script>
<script src="../../applib/codemirror-5.24.2/mode/htmlmixed/htmlmixed.js"></script>

<style type=text/css>
      .CodeMirror {
        /*float: left;*/
        width: 100%;
        border: 1px solid black;
      }
      iframe {
        width: 100%;
        height: 1000px;
        border-width: 0px;
        /*float: left;
        height: 300px;
        border: 1px solid black;
        border-left: 0px; */
      }
    </style>
<!-- END CodeMirror Includes -->

    <link rel="stylesheet" type="text/css" media="screen" href="css/styles.css"  />
    <link rel="stylesheet" type="text/css" media="screen" href="../../applib/css/agent-0.1.css" />

<style type=text/css>
    #codadiv header
    {
        display:none;
    }
</style>
</head>
<body>
    <div class="app-header gradient-lightest">
        <div class="app-logo"><h1><span>Acuity &reg;</span></h1></div>
        <div class="app-heading" style="height:25px;">&nbsp;</div>
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
        <div class="auth-show" style="display:none;padding-top: 8px;" >
          <!-- #Include virtual="../../applib/html/views/agent.htm" -->
        </div>
    </div>

<script src="js/init.js"></script>

</body>
</html>
