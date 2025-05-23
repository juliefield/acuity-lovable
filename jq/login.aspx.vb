Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports jglib

Partial Class jq_Dashboard
    Inherits SitePage
    Private _connection As String = ""
    Private _connection2 As String = ""

    Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
        Response.AddHeader("X-Frame-Options", "SAMEORIGIN")
        Response.AddHeader("X-XSS-Protection", "1;mode=block")
        Response.AddHeader("X-Content-Type-Options", "nosniff")
        Response.AddHeader("X-Permitted-Cross-Domain-Policies", "none")
        Response.AddHeader("Referrer-Policy", "no-referrer-when-downgrade")
        Response.AddHeader("Feature-Policy", "camera 'self'; fullscreen 'self'; geolocation *; microphone 'self'")
        Response.AddHeader("Expect-CT", "enforce,max-age=31536000")
        Response.AddHeader("Content-Security-Policy", "frame-ancestors 'self' mypurecloud.com *.mypurecloud.com pure.cloud *.pure.cloud;")
    End Sub



    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim url As String = "dashboardasync.aspx" 'Changed 5/14/2015 - was "dashboard.aspx", but this control used to be scoped to the web page and a work order system, both of which are no longer used.
        If Request.QueryString("url") IsNot Nothing AndAlso Request.QueryString("url").ToString.Trim <> "" Then
            url = Request.QueryString("url")
        End If
        Dim inframe As Boolean = False
        If (Request.QueryString("inframe") IsNot Nothing) Then
            If (Request.QueryString("inframe").ToString.Trim <> "") Then
                inframe = True
            End If
        End If

        If (urlprefix() = "km2.DISABLED") Then
            Response.Redirect("http://acuity.km2solutions.net")
        End If
        If IsPostBack Then
            Dim isdrone As Boolean = False
            'Dim drone_username As String = "wer342s3432"
            'Dim drone_password As String = "23432sdrw83"
            'If Request.QueryString("drone") IsNot Nothing Then
            '_connection2 = CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            'Using db As New DbBaseSql(_connection2)
            'Using dt As DataTable = db.GetDataTable("select top 1 username,password from usr where marked='N' and username like 'drone%'")
            'If (dt.Rows.Count > 0) Then
            'drone_username = dt.Rows(0).Item("username")
            'drone_password = dt.Rows(0).Item("password")
            'db.Update("update usr set marked='Y' where username='" & drone_username & "' and password='" & drone_password & "'")
            'isdrone = True
            'End If
            'End Using
            'End Using
            'End If
            If (Request.Form("username") IsNot Nothing AndAlso Request.Form("username").ToString.Trim <> "") OrElse isdrone Then
                'TODO: Put real authentication in here.
                Dim password As String = Request.Form("password").ToString.Trim
                Dim username As String = Request.Form("username").ToString.Trim
                'If isdrone Then
                'username = drone_username
                'password = drone_password
                'End If
                Dim okay As Boolean = False
                Dim role As String = "client"
                Dim boxfilter As String = "off"
                Dim roleset As String = ""
                Dim project As String = "" 'for Project Restriction
                'Changed 6/13/2016 - This "TP1 password" thing is obsolete.  I'm going to disable it here (no one is using it currently).
                'TODO: All authentication needs to be in a single spot.  I know there's more than 1 place this is written out.
                'Select Case username
                '    Case "superclient"
                'role = "client"
                'If password = "superclient1" Then okay = True
                '    Case "leslie"
                'role = "exec"
                'If password = "leslie1" Then okay = True
                '    Case "jeffgack"
                'role = "dev"
                'roleset = "dev,csm"
                'If password = "jeffgack1" Then okay = True
                '    Case "dweathers"
                'role = "csm"
                'roleset = "csm,dev"
                'If password = "dweathers1" Then okay = True
                '    Case "casey"
                'role = "exec"
                'If password = "casey1" Then okay = True
                'End Select
                If Not okay Then
                    'This is a mess, but for now attempt to log in using the Acuity Du Jour
                    _connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                    _connection2 = CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                    If isdrone Then
                        project = "none"
                        okay = True
                    Else
                        Using db As New DbBaseSql(_connection)
                            'PASSWORD_UPDATE - Done?
                            If CONFMGR.PasswordAccepted(urlprefix(), username, password) Then
                                Using dt As DataTable = db.GetDataTable("select role from usr where status<>'2' and user_id='" & db.reap(username) & "'")
                                    If dt.Rows.Count > 0 Then
                                        role = dt.Rows(0)("role").ToString
                                        'Added 4/19/2016 per Charle's request.
                                        If urlprefix() <> "walgreens." OrElse Not CONFMGR.UsingMasterPasswordByPrefix(urlprefix(), password) Then
                                            db.Update("update usr set previous_logindt=current_logindt,current_logindt=getdate() where user_id='" & db.reap(username) & "'")
                                        End If
                                        'TODO: Test for multiple project situations.
                                        'TODO: Test for "no project" situations.
                                        If role = "CSR" Then
                                            boxfilter = "on"
                                            Using dtc As DataTable = db.GetDataTable("select 0 as seq,pj.ProjectDesc from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id inner join project pj on pj.ProjectID=tm.project_id where usr.user_id='" & db.reap(username) & "' UNION select 1 as seq,pj.ProjectDesc from usr inner join spvr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id inner join project pj on pj.ProjectID=tm.project_id where usr.user_id='" & db.reap(username) & "' order by seq asc,ProjectDesc asc")
                                                project = ""
                                                Dim first As Boolean = True
                                                For Each row As DataRow In dtc.Rows
                                                    If Not first Then project &= ","
                                                    project &= row("ProjectDesc").ToString.Trim
                                                    first = False
                                                Next
                                                If project = "" Then project = "none"
                                            End Using
                                        ElseIf role = "Team Leader" Then
                                            boxfilter = "on"
                                            Using dtc As DataTable = db.GetDataTable("select distinct pj.ProjectDesc from team tm inner join project pj on pj.ProjectID=tm.project_id where tm.status in ('A','M') and tm.spvr_user_id='" & db.reap(username) & "' UNION select pj.ProjectDesc from spvr_team st inner join team tm on tm.team_id=st.team_id inner join project pj on pj.ProjectID=tm.project_id where st.user_id='" & db.reap(username) & "'")
                                                project = ""
                                                Dim first As Boolean = True
                                                For Each row As DataRow In dtc.Rows
                                                    If Not first Then project &= ","
                                                    project &= row("ProjectDesc").ToString.Trim
                                                    first = False
                                                Next
                                                If project = "" Then project = "none"
                                            End Using
                                        ElseIf role = "Group Leader" Then
                                            boxfilter = "on"
                                            Using dtc As DataTable = db.GetDataTable("select distinct pj.ProjectDesc from grp inner join project pj on pj.ProjectID=grp.project_id where grp.spvr_user_id='" & db.reap(username) & "'")
                                                project = ""
                                                Dim first As Boolean = True
                                                For Each row As DataRow In dtc.Rows
                                                    If Not first Then project &= ","
                                                    project &= row("ProjectDesc").ToString.Trim
                                                    first = False
                                                Next
                                                If project = "" Then project = "none"
                                            End Using
                                        Else
                                            'Can I tell what project a manager is on?  Or 
                                        End If
                                        okay = True
                                    End If
                                End Using
                            End If
                        End Using
                    End If
                End If
                Dim uid As String = ""
                Using db2 As New DbBaseSql(_connection2)
                    Dim clientid As String = CONFMGR.AppSettings(urlprefix() & "ClientID_V2").ToString
                    Using dtses As DataTable = db2.GetDataTable("select * FROM SES where username='" & db2.reap(username) & "' and 1=dbo.ipmatch(ip,'" & db2.reap(Request.UserHostAddress) & "') and client='" & clientid & "'")
                        If dtses.Rows.Count > 0 Then
                            uid = dtses.Rows(0).Item("uid")
                            'DEBUG: TODO:
                            db2.Update("update SES set expdate='" + DateTime.Now.AddHours(12.0).ToString & "',pkey='IMPLICIT',entby='tp1logger' where username='" & db2.reap(username) & "' and 1=dbo.ipmatch(ip,'" & db2.reap(Request.UserHostAddress) & "') and client='" & clientid & "'")
                            'db2.Update("update SES set expdate='" + DateTime.Now.AddHours(12.0).ToString & "',pkey='IMPLICIT',entby='tp1logger' where username='" & db.reap(username) & "' and ip='" & Request.UserHostAddress & "' and client='" & clientid & "'")
                        Else
                            uid = System.Guid.NewGuid.ToString
                            db2.Update("insert into SES (username,pkey,uid,ip,expdate,client,entby) values('" & db2.reap(username) & "','IMPLICIT','" & uid & "','" & Request.UserHostAddress & "','" & DateTime.Now.AddHours(12.0).ToString & "','" & clientid & "','tp1logger')")
                            'db2.Update("insert into SES (username,pkey,uid,ip,expdate,client,entby) values('" & db2.reap(username) & "','IMPLICIT','" & uid & "','" & Request.UserHostAddress & "','" & DateTime.Now.AddHours(12.0).ToString & "','" & clientid & "','tp1logger')")
                        End If
                    End Using
                End Using

                If okay Then
                    'Throw New Exception("debug:redirect 1")
                    If inframe Then
                        Response.Redirect("DashboardAsync.aspx?inframe=" & Request.QueryString("inframe").ToString.Trim & "&username=" & username & "&uid=" & uid & "&url=" & url & "&role=" & role & "&roleset=" & roleset & "&project=" & project & "&boxfilter=" & boxfilter)
                    Else
                        Response.Redirect("TouchpointAuthentication.aspx?username=" & username & "&uid=" & uid & "&url=" & url & "&role=" & role & "&roleset=" & roleset & "&project=" & project & "&boxfilter=" & boxfilter)
                    End If
                Else
                    divServerSideError.Style.Add("display", "block")
                End If
            End If
        ElseIf Request.QueryString("stayanon") IsNot Nothing AndAlso Request.QueryString("stayanon").ToString.Trim = "1" Then
            'Throw New Exception("debug:redirect 2")
            If inframe Then
                Response.Redirect("DashboardAsync.aspx?inframe=" & Request.QueryString("inframe").ToString.Trim & "&username=&url=" & url & "&role=&roleset=")
            Else
                Response.Redirect("TouchpointAuthentication.aspx?username=&url=" & url & "&role=&roleset=")
            End If
        End If

        'EXPERIMENT: ADDED: 2017-10-28.  Test thoroughly to be sure nobody hangs up.
        'If Request.QueryString("burp") IsNot Nothing AndAlso Request.QueryString("burp").ToString.Trim = "login" Then
        If urlprefix() = "application." Then 'Trying 2024-09-06
            'PEN TESTING ONLY
            Response.Redirect("TouchpointAuthentication.aspx?username=jeffgack&uid=123456&url=" & url & "&role=Admin&roleset=&project=1&boxfilter=off")
        Else
            If Not inframe Then
                If urlprefix().IndexOf("v3") < 0 Then
                    If urlprefix().IndexOf("-import") < 0 Then
                        If urlprefix().IndexOf("make40") < 0 Then
                            If urlprefix().IndexOf("-mnt") < 0 Then
                                'Throw New Exception("debug: redirect 3")
                                Response.Redirect("//" & urlprefix() & "acuityapm.com/login.aspx")
                            End If
                        End If
                    End If
                End If
            End If
        End If

        'Using cds As New VirtualStorage
        '    Dim bodyid As String = ""
        '    If (Request.QueryString("cid") IsNot Nothing) Then
        '        bodyid = Request.QueryString("cid").ToString
        '    End If
        '    cds.Register(Me, BodyId:=bodyid, LoadJquery:=False)
        'End Using

    End Sub

End Class
