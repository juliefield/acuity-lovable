Imports System
Imports System.Text
Imports System.Collections
Imports System.DirectoryServices
Imports System.Web.Security
Imports System.Security.Principal
Imports System.Net
Imports System.IO

Partial Class _Default
    Inherits System.Web.UI.Page

    Private Sub Page_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        If IsPostBack Then
            Dim domain As String = txtDomain.Text
            Dim username As String = txtUsername.Text
            Dim domainAndUsername As String = domain & "\" & username
            Dim pwd As String = txtPassword.Text
            Dim entry As DirectoryEntry = New DirectoryEntry("LDAP://usflmiadc12-02.km2solutions.net", domainAndUsername, pwd)

            Try
                Dim obj As Object = entry.NativeObject
                Dim search As DirectorySearcher = New DirectorySearcher(entry)

                search.Filter = "(SAMAccountName=" & username & ")"
                search.PropertiesToLoad.Add("cn")
                Dim result As SearchResult = search.FindOne()

                If (result Is Nothing) Then
                    lblSuccessMessage.Text = ""
                    lblFailureMessage.Text = "Authentication Failed"
                    txtPassword.Text = ""
                Else
                    lblSuccessMessage.Text = "Authenticaton Succeeded, Path=" & result.Path & "<br />(Will redirect to Acuity automatically.)"
                    lblFailureMessage.Text = ""

                    'TODO: Copy Here

                    Dim url = "https://km2.acuityapmr.com/"
                    'Dim url = "http://localhost:60804/acuity-v2-mnt.acuityapmr.com/" 'debug

                    Dim Path As String = "Path=" & result.Path
                    Path &= "&USERNAME=" & username.Trim

                    Dim postData As String = Path.Replace("/CN=", "&CN=").Replace(",OU=", "&OU=").Replace(",DC=", "&DC=")
                    Dim request As HttpWebRequest = HttpWebRequest.Create(url & "adHandler.ashx?ActiveDirectoryLogin=Yes" & "&IP=" & HttpContext.Current.Request.UserHostAddress.ToString & "&" & Path)
                    'request.Method = "POST"
                    'request.ContentType = "application/x-www-form-urlencoded"
                    'request.ContentLength = postData.ToString.Length


                    Dim resp As HttpWebResponse = request.GetResponse()

                    Dim encoding As Encoding = encoding.GetEncoding(resp.CharacterSet)
                    Dim responseStream As Stream = resp.GetResponseStream()
                    Dim reader As StreamReader = New StreamReader(responseStream, encoding)
                    Dim r As String = reader.ReadToEnd()
                    Dim rs As String() = r.Split("&")

                    Dim found As Boolean = False
                    username = ""
                    '        Dim username As String = ""
                    Dim uid As String = ""
                    Dim role As String = ""

                    Dim boxfilter As String = ""
                    Dim project As String = ""

                    For i As Integer = 0 To rs.Length - 1
                        Dim rss As String() = rs(i).Split("=")
                        Select Case rss(0)
                            Case "found"
                                If rss(1) = "1" Then
                                    found = True
                                End If
                            Case "username"
                                username = rss(1)
                            Case "uid"
                                uid = rss(1)
                            Case "role"
                                role = rss(1)
                            Case "boxfilter"
                                boxfilter = rss(1)
                            Case "project"
                                project = rss(1)
                        End Select
                    Next

                    If found Then
                        Response.Redirect(url & "jq/TouchPointAuthentication.aspx?username=" & username & "&uid=" & uid & "&adloginurl=http://acuity.km2solutions.net&role=" & role & "&project=" & project & "&boxfilter=" & boxfilter & "&url=dashboardasync.aspx&roleset=")
                    Else
                        lblSuccessMessage.Text = ""
                        lblFailureMessage.Text = "Your credentials are valid, but are not properly configured in Acuity.<br />Please contact admin to get this corrected."
                    End If

                End If

            Catch ex As Exception
                lblSuccessMessage.Text = ""
                lblFailureMessage.Text = ex.Message
                txtPassword.Text = ""
            End Try
        End If

    End Sub


End Class
