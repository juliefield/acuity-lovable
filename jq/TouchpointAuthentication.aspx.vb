Imports System
Imports System.Web
Imports System.Web.UI
Imports System.Data
Imports jglib 'MAKEDEV

Partial Class jq_TouchpointAuthentication
    Inherits SitePage

    Protected Function xss(par As String) As String
        If par.IndexOf("<") >= 0 Then par = ""
        Return par.Replace(";", "").Replace("""", "").Replace("(", "").Replace(")", "")
    End Function
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim jv As String = ""
        Dim R As String = vbCrLf

        Dim username As String = Nothing

        If Request.QueryString("ad") IsNot Nothing Then

        Else
            username = xss(Request.QueryString("username"))
        End If

        Dim up As String = urlprefix()

        Dim sitedown As Boolean = False
        Try

            Dim connection As String = CONFMGR.ConnectionStrings(up & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            Using db As New DbBaseSql(connection)
                Using ds As DataTable = db.GetDataTable("select webready from cln where id='" & CONFMGR.AppSettings(up & "client") & "'")
                    If ds.Rows.Count > 0 Then
                        If ds.Rows(0).Item(0).ToString.ToLower = "down" Then
                            sitedown = True
                        End If
                    End If
                End Using

                If username IsNot Nothing AndAlso Request.QueryString("url") IsNot Nothing Then
                    Dim cp As String = ""
                    If Request.QueryString("cp") IsNot Nothing Then
                        cp = xss(Request.QueryString("cp").ToString)
                    End If
                    If cp <> "Y" Then 'MAKEDEV
                        'CALL EXPLICITLY TO SEE IF PASSWORD NEEDS CHANGED.
                        Dim ul As String = username.ToLower
                        'ADDED: 2018-03-13
                        If up = "ers." Then 'DEBUG: AndAlso (ul = "jeffgack" OrElse ul = "gsalvato" OrElse ul = "dweather" OrElse ul = "gillb" OrElse ul = "jpeck" OrElse ul = "cisaacson") Then
                            Using du As DataTable = db.GetDataTable("select case when datediff(D,lastpasswordupdate,getdate()) > 180 then 'Y' else 'N' end as changepassword from fan_player_stg where client='" & CONFMGR.AppSettings(up & "client") & "' and user_id='" & db.reap(username) & "'")
                                If du.Rows.Count > 0 Then
                                    If du.Rows(0).Item(0) = "Y" Then
                                        cp = "Y"
                                    End If
                                End If
                            End Using
                        End If
                    End If

                    Dim subrole As String = ""
                    If up = "km2." Then 'TODO: Make this a configparam.
                        Dim connection1 As String = CONFMGR.ConnectionStrings(up & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                        Using db1 As New DbBaseSql(connection1)
                            Using dk As DataTable = db1.GetDataTable("select usr.user_id from usr inner join spvr_team st on usr.user_id=st.user_id where usr.status<>'2' and usr.role='CSR' and usr.user_id='" & db.reap(username) & "'")
                                If dk.Rows.Count > 0 Then
                                    subrole = "TeamLead"
                                End If
                            End Using
                        End Using
                    End If

                    If Not ClientScript.IsStartupScriptRegistered("authscript") Then
                        jv = "<script type=""text/javascript"">" & R
                        jv &= "$.cookie(""TP1Username"",""" & username & """);" & R
                        jv &= "$.cookie(""username"",""" & username & """);" & R
                        jv &= "$.cookie(""uid"",""" & xss(Request.QueryString("uid").ToString) & """);" & R
                        jv &= "$.cookie(""TP1Role"",""" & xss(Request.QueryString("role").ToString) & """);" & R
                        jv &= "$.cookie(""TP1Subrole"",""" & subrole & """);" & R

                        jv &= "$.cookie(""TP1ChangePassword"",""" & cp & """);" & R
                        If Request.QueryString("boxfilter") IsNot Nothing Then
                            jv &= "$.cookie(""TP1Boxfilter"",""" & xss(Request.QueryString("boxfilter").ToString) & """);" & R
                        End If
                        jv &= "$.cookie(""TP1Roleset"",""" & xss(Request.QueryString("roleset").ToString) & """);" & R
                        If Request.QueryString("project").ToString.ToLower = "pse" Then
                            jv &= "$.cookie(""ApmProject"",""PSE&G"");" & R 'sorry...
                        Else
                            jv &= "$.cookie(""ApmProject"",""" & xss(Request.QueryString("project").ToString) & """);" & R
                        End If
                        If Request.QueryString("indallas") IsNot Nothing Then
                            jv &= "$.cookie(""ApmInDallas"",""" & xss(Request.QueryString("indallas").ToString) & """);" & R
                        Else
                            jv &= "$.cookie(""ApmInDallas"","""");" & R
                        End If
                        If Request.QueryString("projectfilter") IsNot Nothing Then
                            If Request.QueryString("projectfilter").ToString.ToLower = "pse" Then
                                jv &= "$.cookie(""ApmProjectFilter"",""PSE&G"");" & R 'sorry...
                            Else
                                jv &= "$.cookie(""ApmProjectFilter"",""" & xss(Request.QueryString("projectfilter").ToString) & """);" & R
                            End If
                        End If
                        'jv &= "alert('debug:cookie is ' + $.cookie(""ApmProject""));" & R
                        If Request.QueryString("prefix") IsNot Nothing Then
                            jv &= "window.location=""" & xss(Request.QueryString("url")) & "?prefix=" & xss(Request.QueryString("prefix")) & """;"
                        Else
                            jv &= "window.location=""" & xss(Request.QueryString("url")) & """;"
                        End If
                        jv &= "</script>" & R

                        'Throw New Exception("DEBUGGING: jv=" & jv & ",username=" & username & ",role=" & xss(Request.QueryString("role").ToString))
                        ClientScript.RegisterStartupScript(Me.GetType, "authscript", jv)
                    End If
                    Session("TP1uid") = xss(Request.QueryString("uid").ToString)
                    Session("TP1Username") = username
                    Session("TP1Role") = xss(Request.QueryString("role").ToString)
                    Session("TP1ChangePassword") = cp
                    Session("LoginSide") = "TP1"
                    'Throw New Exception("DEBUGGING: jv=" & jv & ",Session_TP1Username=" & Session("TP1Username").ToString & ",Session_TP1Role=" & Session("TP1Role").ToString)
                End If
            End Using
        Catch ex As Exception
            sitedown = True
        End Try
        If sitedown Then
            Response.Redirect("SiteMaintenance.htm")
        End If
    End Sub
End Class
