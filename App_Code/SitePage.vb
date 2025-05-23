Imports System
Imports System.Web
Imports System.Web.UI
Imports System.Data
Imports System.IO
Imports jglib

'IMPORTANT NOTE:  This was translated from dev2.acuityapmr.com/app_code/SitePage.cs.  Please make sure any changes get reflected in the master copy.

Public Class SitePage
    Inherits Page

    'ADDED: 2017-11-04
    Public CONFMGR As New ConfMgr()

    Protected Overrides Sub OnPreInit(e As System.EventArgs)
        Dim host As String = HttpContext.Current.Request.Url.host
        MyBase.OnPreInit(e)
        If Request.QueryString("theme") IsNot Nothing Then
            Page.Theme = Request.QueryString("theme")
            Session("theme") = Page.Theme
        ElseIf Session("theme") IsNot Nothing Then
            Page.Theme = Session("theme").ToString
        Else
            Page.Theme = CONFMGR.AppSettings(urlprefix() & "theme").ToString
            'ElseIf HttpContext.Current.Request.Url.Host.ToString.ToLower.IndexOf("acuity") >= 0 Then
            'Page.Theme = "Acuity"
            'Session("theme") = Page.Theme
        End If
        If urlprefix() = "km2." Then
            'TODO: Control by IP.
            If (HttpContext.Current.Request.UserHostAddress.ToString <> "45.31.98.131") AndAlso
               (HttpContext.Current.Request.UserHostAddress.ToString <> "75.103.166.84") Then 'Done: Dean's IP   
                'Response.Redirect("sitemaintenanceKM2.htm") 'Scoring Logic Changes
            End If
        End If
    End Sub

    Protected Overrides Sub OnLoad(e As System.EventArgs)
        MyBase.OnLoad(e)
        Dim shuttingdown As Boolean = True
        Dim up As String = urlprefix()
        Dim connection As String = CONFMGR.ConnectionStrings(up & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        Using db As New DbBaseSql(connection)
            If False Then 'disable for now
                Using cds As New VirtualStorage
                    Dim bodyid As String = ""
                    If (Request.QueryString("cid") IsNot Nothing) Then
                        bodyid = Request.QueryString("cid").ToString
                    End If
                    cds.Register(Me, BodyId:=bodyid, LoadJquery:=False)
                End Using
            End If
            Dim R As String = Chr(13)
            Dim jv As String
            If Not Page.ClientScript.IsClientScriptBlockRegistered("themevar") Then
                jv = "<script type=""text/javascript"">" & R
                jv &= "var pageTheme='" & Page.Theme & "';" & R
                jv &= "</script>" & R
                Page.ClientScript.RegisterClientScriptBlock(Me.GetType, "themevar", jv)
            End If
            Dim myname = Path.GetFileName(Request.Path).ToLower
            If urlprefix(True) = "km2." Then
                'db.Update("insert into test (testval) values('" & db.reap(Request.Path) & "')")
                If myname <> "touchpointauthentication.aspx" AndAlso myname <> "login.aspx" AndAlso myname <> "reportsmenu.aspx" AndAlso myname <> "reporttable.aspx" AndAlso (Request.Path.ToLower.IndexOf("reporteditor") < 0) Then
                    If Not Page.ClientScript.IsClientScriptBlockRegistered("credentials") Then
                        jv = "<script type=""text/javascript"">" & R

                        Try 'If there's an error then use the client-side timer.

                            If Session("username").ToString.ToLower = "jeffgack2" Then
                                jv &= "var credSeconds=60;" & R '20 second logout, for testing.
                            Else
                                Dim client As String = CONFMGR.AppSettings(urlprefix() & "client")
                                Dim uid As String = Session("TP1uid")
                                Dim mycount As Integer = 0
                                Dim maxseconds As Integer = 14 * 60 * 60 'Fourteen Hours (all I'm really looking for is overnight).
                                'maxseconds = 30 'Debug
                                Dim mysql As String = "select case when datediff(ss,getdate(),expdate) > " & maxseconds.ToString & " then " & maxseconds.ToString & " else datediff(ss,getdate(),expdate) end as delta from ses where uid='" & db.reap(uid) & "' and username='" & db.reap(Session("username")) & "'"
                                Try
                                    Using du As DataTable = db.GetDataTable(mysql)
                                        If (du.Rows.Count > 0) Then
                                            mycount = du.Rows(0).Item(0)
                                            If (mycount < 0) Then mycount = 0
                                        End If
                                    End Using
                                Catch ex As Exception

                                End Try
                                'jv &= "alert('debug:mycount=" & mycount.ToString & "');" & R
                                'jv &= "alert('debug:mysql=" & mysql.Replace("'", "") & "');" & R

                                'TODO: SSO TEST:
                                If mycount > 0 AndAlso mycount < 2 * 60 * 60 Then mycount = 2 * 60 * 60 'UNTL PROVEN, don't run out within 2 hrs of the page being displayed.

                                If mycount = 0 Then
                                    Response.Redirect("https://" & urlprefix(True) & "acuityapm.com/login.aspx?prefix=" & urlprefix().Replace(".", ""))
                                Else
                                    jv &= "var credSeconds=" & mycount.ToString & ";" & R 'elongated logout, for testing.
                                    'jv &= "alert('debug:Retrieved tok=" & uid & ",seconds = ' + " & mycount.ToString & ");" & R
                                End If
                            End If
                            'jv &= "alert('debug:file name: ' + '" & Path.GetFileName(Request.Path) & "');" & R
                            Dim pColl As NameValueCollection = Request.Params
                            Dim i As Integer
                            Dim paramInfo As String = ""
                            For i = 0 To pColl.Count - 1
                                If pColl.GetKey(i) = "prefix" OrElse pColl.GetKey(i) = "uid" Then
                                    If (i > 0) Then paramInfo &= "&"
                                    paramInfo &= pColl.GetKey(i) & "="
                                    Try
                                        paramInfo &= pColl.GetValues(i)(0)
                                    Catch ex As Exception

                                    End Try
                                End If
                            Next
                            'With return url (too fancy):  jv &= "setTimeout(function() { /* alert('debug: cred timeout'); */ window.location='https://" & urlprefix(True) & "acuityapm.com/login.aspx?prefix=" & urlprefix().Replace(".", "") & "&ReturnUrl=" & Server.UrlEncode("https://" & urlprefix(True) & "acuityapmr.com/" & Request.Path & "?" & paramInfo) & "'; },credSeconds * 1000);" & R
                            jv &= "setTimeout(function() { /* alert('debug: cred timeout'); */ window.location='https://" & urlprefix(True) & "acuityapm.com/login.aspx?prefix=" & urlprefix().Replace(".", "") & "'; },credSeconds * 1000);" & R
                        Catch ex As Exception
                            'jv &= "alert('debug: install client-side timer with ' + $.cookie('TP1Username') + ' and ' + $.cookie('uid'));"
                            jv &= "a$.ajax({ type: 'POST', service: 'JScript', async: true, data: { lib: 'login', cmd: 'getDelta' }, dataType: 'json', cache: false, error: a$.ajaxerror, success: function(json) {" & R
                            'jv &= " alert('debug: client-side delta=' + json.delta);" & R
                            jv &= "setTimeout(function() { /* alert('debug: cred timeout'); */ window.location='https://" & urlprefix(True) & "acuityapm.com/login.aspx?prefix=" & urlprefix().Replace(".", "") & "'; },json.delta * 1000);" & R
                            jv &= "}});" & R
                        End Try
                        jv &= "</script>" & R
                        'If (myname.IndexOf("monitor") <> 0) Then 'No Timer on Monitor Pages (throw-outs were handled above)
                        Page.ClientScript.RegisterClientScriptBlock(Me.GetType, "credentials", jv)
                        'End If
                    End If
                End If
            End If
            'Log Page Visit
            If Session("username") Is Nothing Then Session("username") = ""
            If Request.QueryString("username") IsNot Nothing Then Session("username") = Request.QueryString("username")
            If Session("uid") Is Nothing Then Session("uid") = ""
            If Request.QueryString("uid") IsNot Nothing Then Session("uid") = Request.QueryString("uid")
            Dim cid As String = ""
            If Request.QueryString("cid") IsNot Nothing Then cid = Request.QueryString("cid")

            If Session("username").ToString = "bgill" Then
                Response.Redirect("http://www.google.com")
            End If

            If (up = "XXXchime.") Then ' OrElse up = "chime-make40.") AndAlso (Session("username") <> "") Then 'whitelist white-list
                Dim connection1 As String = CONFMGR.ConnectionStrings(up & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                Using db1 As New DbBaseSql(connection1)
                    Using du As DataTable = db1.GetDataTable("select role from usr where user_id='" & db1.reap(Session("username")) & "'")
                        If du.Rows.Count > 0 Then
                            If du.Rows(0).Item(0) = "CSR" Then
                                If Request.UserHostAddress.ToString.Trim <> "40.139.173.30" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "162.119.240.100" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "165.125.176.19" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "165.125.176.20" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "199.116.173.196" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "204.152.235.219" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.246.33" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.246.34" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.246.35" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.246.36" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.246.37" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.247.33" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.247.34" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.247.35" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.247.36" _
                                    AndAlso Request.UserHostAddress.ToString.Trim <> "153.2.247.37" _
                                    Then
                                    Try
                                        db.Update("insert into PLG (entdt,prefix,page,cid,username,uid,ip) values ('" & db.reap(Date.Now.ToString) & "','" & db.reap(up) & "','" & db.reap(HttpContext.Current.Request.Url.AbsolutePath) & "','" & db.reap(cid) & "','" & db.reap(Session("username").ToString) & "-BLOCKED','" & db.reap(Session("uid").ToString) & "','" & db.reap(Request.UserHostAddress) & "')")
                                    Catch ex As Exception

                                    End Try
                                    Response.Redirect("http://www.touchpointone.com")
                                End If
                            End If
                        End If
                    End Using
                End Using

            End If

            Try
                db.Update("insert into PLG (entdt,prefix,page,cid,username,uid,ip) values ('" & db.reap(Date.Now.ToString) & "','" & db.reap(up) & "','" & db.reap(HttpContext.Current.Request.Url.AbsolutePath) & "','" & db.reap(cid) & "','" & db.reap(Session("username").ToString) & "','" & db.reap(Session("uid").ToString) & "','" & db.reap(Request.UserHostAddress) & "')")
            Catch ex As Exception
            End Try
        End Using
    End Sub

    Public Function urlprefix(Optional BypassParam As Boolean = False) As String

        Dim p As String = HttpContext.Current.Request.Url.Host & HttpContext.Current.Request.RawUrl
        Dim e As Integer = p.ToLower.IndexOf("." & CONFMGR.AppSettings("urlsuffix").ToString)
        If e >= 0 Then
            p = p.ToLower.Substring(0, e)
            Dim s() As String = p.Split("/")
            p = s(s.Length - 1)
            p = p & "."
        Else
            p = ""
        End If

        'ADDED: 2017-11-06 - Parameter prefix takes precedent.
        Dim foundpar As Boolean = False
        Dim par As String = HttpContext.Current.Request.QueryString("prefix")
        If (Not BypassParam) Then
            If par IsNot Nothing Then
                If (par <> "") Then
                    par = par.ToLower & "."
                    foundpar = True
                End If
            End If
            If Not foundpar Then
                par = HttpContext.Current.Request.Form("prefix")
                If par IsNot Nothing Then
                    If (par <> "") Then
                        par = par.ToLower & "."
                        foundpar = True
                    End If
                End If
            End If
        End If

        If p = "km2-ext." OrElse p = "km2-history" Then
            par = "km2."
            foundpar = True
        End If

        If (foundpar) Then
            'Put Lockout Here
            If p = "alpha." Then
                If False Then 'par <> "bgr." Then
                    Throw New Exception("Alpha Access is not allowed for Prefix " & par)
                End If
            ElseIf p = "km2-ext." OrElse p = "km2-history." Then 'Special case for getting around KM2 SSO
            ElseIf par = "genesys-wizard." Then 'SPECIAL cross-domain access.

            ElseIf p.IndexOf("mnt") <> 0 AndAlso p <> "acuity-v2-mnt-master." AndAlso p <> "jeff-v2-mnt." Then
                If (p <> par) Then










                    Throw New Exception("Subdomain/Prefix Mismatch is not allowed (" & p & "/" & par & ")")







                End If
            End If
            p = par
        End If

        Return p
    End Function

    Public Sub MakeOrAssignControl(anchor As HtmlGenericControl, tag As String, id As String, val As String)
        Dim mc As HtmlGenericControl
        mc = DirectCast(FindControl(id), HtmlGenericControl)
        If mc Is Nothing Then
            mc = New HtmlGenericControl(tag)
            mc.ID = id
            anchor.Controls.Add(mc)
        Else
            mc.ID = id
        End If
        mc.InnerHtml = val
    End Sub

End Class