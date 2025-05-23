Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports jglib

Partial Class three_PageAuth
    Inherits SitePage
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim jv As String = ""
        Dim R As String = vbCrLf

        Dim username As String = Nothing

        If Request.QueryString("ad") IsNot Nothing Then

        Else
            username = Request.QueryString("username")
        End If

        If username IsNot Nothing AndAlso Request.QueryString("uid") IsNot Nothing Then
            Dim cp As String = ""
            If Request.QueryString("cp") IsNot Nothing Then
                cp = Request.QueryString("cp").ToString
            End If

            'TODO: Verify that SES is authentic and is not expired (must do this again for vulnerability reasons).

            Dim _connection As String = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            Dim _connection20 As String = CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"

            Using db2 As New DbBaseSql(_connection20)
                Using db As New DbBaseSql(_connection)
                    Dim authenticated As Boolean = False
                    Using dses As DataTable = db2.GetDataTable("select username FROM SES where username='" & db2.reap(username) & "' and uid='" & db2.reap(Request.QueryString("uid")) & "' and 1=dbo.ipmatch(ip,'" & db2.reap(Request.UserHostAddress) & "') and client='" & CONFMGR.AppSettings(urlprefix() & "client") & "' and expdate > getdate()")
                        If dses.Rows.Count > 0 Then
                            authenticated = True
                        End If
                    End Using
                    If authenticated Then
                        'Retrieve role, boxfilter (whatever that is), roleset (again, what is this?), project, projectfilter (restriction field)
                        'NOT changepassword
                        Dim role As String = "client"
                        Dim projectfilter As String = ""
                        Dim boxfilter As String = ""
                        Dim project As String = ""
                        Using dt As DataTable = db.GetDataTable("select role,restriction from usr where status<>'2' and user_id='" & db.reap(username) & "'")
                            If dt.Rows.Count > 0 Then
                                role = dt.Rows(0)("role").ToString
                                projectfilter = dt.Rows(0)("restriction").ToString
                                'TODO: Test for multiple project situations.
                                'TODO: Test for "no project" situations.
                                If role = "CSR" Then
                                    boxfilter = "on"
                                    Using dtc As DataTable = db.GetDataTable("select pj.ProjectDesc from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id inner join project pj on pj.ProjectID=tm.project_id where usr.user_id='" & Context.User.Identity.Name & "'")
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
                                    Using dtc As DataTable = db.GetDataTable("select distinct pj.ProjectDesc from team tm inner join project pj on pj.ProjectID=tm.project_id where tm.status in ('A','M') and tm.spvr_user_id='" & Context.User.Identity.Name & "'")
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
                                    Using dtc As DataTable = db.GetDataTable("select distinct pj.ProjectDesc from grp inner join project pj on pj.ProjectID=grp.project_id where grp.spvr_user_id='" & Context.User.Identity.Name & "'")
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
                            End If
                        End Using

                        If Not ClientScript.IsStartupScriptRegistered("authscript") Then
                            jv = "<script type=""text/javascript"">" & R
                            jv &= "$.cookie(""ApmInDallas"",""NO"");" & R 'Can this be removed?

                            jv &= "$.cookie(""TP1Username"",""" & username & """);" & R
                            jv &= "$.cookie(""username"",""" & username & """);" & R
                            jv &= "$.cookie(""uid"",""" & Request.QueryString("uid").ToString & """);" & R
                            jv &= "$.cookie(""TP1Role"",""" & role & """);" & R

                            'jv &= "$.cookie(""TP1ChangePassword"",""" & cp & """);" & R

                            jv &= "$.cookie(""TP1Boxfilter"",""" & boxfilter & """);" & R
                            'jv &= "$.cookie(""TP1Roleset"",""" & Request.QueryString("roleset").ToString & """);" & R
                            jv &= "$.cookie(""ApmProject"",""" & project & """);" & R

                            If projectfilter <> "" Then
                                jv &= "$.cookie(""ApmProjectFilter"",""" & projectfilter & """);" & R
                            End If
                            'jv &= "alert('debug:cookie is ' + $.cookie(""ApmProject""));" & R

                            Dim url As String = Request.QueryString("url")
                            If url Is Nothing Then
                                url = "dashboardasync.aspx"
                            End If
                            If username.ToLower = "adamgack" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-adam.aspx"
                            If username.ToLower = "ansmiley" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-adam.aspx"
                            If username.ToLower = "ckraft" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-chris.aspx"
                            If username.ToLower = "jfield" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-SOCIAL1.aspx"
                            If username.ToLower = "lcampbell" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-SOCIAL1.aspx"
                            If username.ToLower = "mhager" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-SOCIAL1.aspx"
                            'If username.ToLower = "jfield" AndAlso url.ToLower = "dashboardasync.aspx" Then url = "dashboardasync-julie.aspx"
                            jv &= "window.location=""" & url.Replace("|","?") & """;"
                            jv &= "</script>" & R
                            ClientScript.RegisterStartupScript(Me.GetType, "authscript", jv)

                        End If
                        Session("TP1Username") = username
                        Session("TP1Role") = role
                        'Necessary? Session("TP1ChangePassword") = cp
                        'Necessary? Session("LoginSide") = "TP1"
                    Else
                        Response.Redirect("~/applib/dev/LOGIN1/LOGIN1-view/loginNew.aspx")
                    End If
                End Using
            End Using
        Else
            Response.Redirect("~/applib/dev/LOGIN1/LOGIN1-view/loginNew.aspx")
        End If
    End Sub

End Class
