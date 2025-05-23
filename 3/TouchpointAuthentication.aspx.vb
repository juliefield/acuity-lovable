Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports jglib


Partial Class three_TouchpointAuthentication
    Inherits SitePage
    Private _connection As String = ""
    Private _connection2 As String = ""
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim jv As String = ""
        Dim R As String = vbCrLf

        Dim username As String = Nothing
        Dim uid As String = Nothing
        Dim url As String = Nothing
        Dim role As String = Nothing

        'LBA - Link-Based Access
        '
        'if there's an lba parameter, see if there's a match in the lba table and get theusername & url (subject to lba rules).
        '
        If Request.QueryString("lba") IsNot Nothing Then
            _connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            _connection2 = CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            Dim clientid As String = CONFMGR.AppSettings(urlprefix() & "ClientID_V2").ToString
            Using db2 As New DbBaseSql(_connection2)
                Using dtlba As DataTable = db2.GetDataTable("select username,url from lba where uid='" & Request.QueryString("lba") & "' and ((expiration is null) or (getdate() > expiration))")
                    If (dtlba.Rows.Count = 1) Then
                        username = dtlba.Rows(0).Item("username")
                        url = dtlba.Rows(0).Item("url")
                    Else
                        Throw New Exception("Link-based Access denied for:" & Request.QueryString("lba"))
                    End If
                End Using
                Using db As New DbBaseSql(_connection)
                    Using dtu As DataTable = db.GetDataTable("select role from usr where status in (1,7) and user_id='" & username & "'")
                        If (dtu.Rows.Count = 1) Then
                            role = dtu.Rows(0).Item("role")
                        Else
                            Throw New Exception("User Not Found or access denied for: " & username)
                        End If

                    End Using
                End Using

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

            Dim redirect = "TouchpointAuthentication.aspx?username=" & username & "&uid=" & uid & "&url=" & url & "&role=" & role
            'Throw New Exception("Prepared for Redirect to: " & redirect)
            Response.Redirect(redirect) 'NO LONGER NEEDED? -> & "&roleset=" & roleset & "&project=" & project & "&boxfilter=" & boxfilter)

            If Not ClientScript.IsStartupScriptRegistered("authscript") Then
                jv = "<script type=""text/javascript"">" & R
                jv &= "$.cookie(""TP1Username"",""" & username & """);" & R
                jv &= "$.cookie(""username"",""" & username & """);" & R
                jv &= "$.cookie(""uid"",""" & Request.QueryString("uid").ToString & """);" & R
                jv &= "$.cookie(""TP1Role"",""" & Request.QueryString("role").ToString & """);" & R
                jv &= "window.location=""" & Request.QueryString("url").Replace("^", "#").Replace("|", "?").Replace("~", "&") & """;"
                jv &= "</script>" & R
                ClientScript.RegisterStartupScript(Me.GetType, "authscript", jv)
            End If
            Session("TP1Username") = username
            Session("TP1Role") = Request.QueryString("role").ToString
            Session("TP1ChangePassword") = "" 'LBA access is password-less (they may have no concept of it).
            Session("LoginSide") = "TP1" 'TODO: I don't think we use this for anything.
        Else
            If Request.QueryString("ad") IsNot Nothing Then

            Else
                username = Request.QueryString("username")
            End If

            If username IsNot Nothing AndAlso Request.QueryString("url") IsNot Nothing Then
                Dim cp As String = ""
                If Request.QueryString("cp") IsNot Nothing Then
                    cp = Request.QueryString("cp").ToString
                End If
                If Not ClientScript.IsStartupScriptRegistered("authscript") Then
                    jv = "<script type=""text/javascript"">" & R
                    jv &= "$.cookie(""TP1Username"",""" & username & """);" & R
                    jv &= "$.cookie(""username"",""" & username & """);" & R
                    jv &= "$.cookie(""uid"",""" & Request.QueryString("uid").ToString & """);" & R
                    jv &= "$.cookie(""TP1Role"",""" & Request.QueryString("role").ToString & """);" & R

                    'ADDED: 2018-03-22.  Not sure if this is where to go with this or now.
                    If Request.QueryString("CSR") IsNot Nothing Then
                        jv &= "$.cookie(""CSR"",""" & Request.QueryString("CSR").ToString & """);" & R
                    End If
                    If Request.QueryString("Team") IsNot Nothing Then
                        jv &= "$.cookie(""Team"",""" & Request.QueryString("Team").ToString & """);" & R
                    End If

                    jv &= "$.cookie(""TP1ChangePassword"",""" & cp & """);" & R
                    If Request.QueryString("boxfilter") IsNot Nothing Then
                        jv &= "$.cookie(""TP1Boxfilter"",""" & Request.QueryString("boxfilter").ToString & """);" & R
                    End If
                    If Request.QueryString("TP1Roleset") IsNot Nothing Then
                        jv &= "$.cookie(""TP1Roleset"",""" & Request.QueryString("roleset").ToString & """);" & R
                    End If
                    If Request.QueryString("project") IsNot Nothing Then
                        If Request.QueryString("project").ToString.ToLower = "pse" Then
                            jv &= "$.cookie(""ApmProject"",""PSE&G"");" & R 'sorry...
                        Else
                            jv &= "$.cookie(""ApmProject"",""" & Request.QueryString("project").ToString & """);" & R
                        End If
                    End If
                    If Request.QueryString("indallas") IsNot Nothing Then
                        jv &= "$.cookie(""ApmInDallas"",""" & Request.QueryString("indallas").ToString & """);" & R
                    Else
                        jv &= "$.cookie(""ApmInDallas"","""");" & R
                    End If
                    If Request.QueryString("projectfilter") IsNot Nothing Then
                        If Request.QueryString("projectfilter").ToString.ToLower = "pse" Then
                            jv &= "$.cookie(""ApmProjectFilter"",""PSE&G"");" & R 'sorry...
                        Else
                            jv &= "$.cookie(""ApmProjectFilter"",""" & Request.QueryString("projectfilter").ToString & """);" & R
                        End If
                    End If
                    'jv &= "alert('debug:cookie is ' + $.cookie(""ApmProject""));" & R
                    jv &= "window.location=""" & Request.QueryString("url").Replace("^", "#").Replace("|", "?").Replace("~", "&") & """;"
                    jv &= "</script>" & R
                    ClientScript.RegisterStartupScript(Me.GetType, "authscript", jv)
                End If
                Session("TP1Username") = username
                Session("TP1Role") = Request.QueryString("role").ToString
                Session("TP1ChangePassword") = cp
                Session("LoginSide") = "TP1"
            End If
        End If
    End Sub
End Class
