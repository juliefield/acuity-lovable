Imports System.Net
Imports System.IO


Partial Class _Default
    Inherits SitePage

    Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
        'mylab.InnerHtml = 
        Dim girle As Integer = 1

        Dim url = "https://km2.acuityapmr.com/"
        'Dim url = "http://localhost:54246/acuity-v2.acuityapmr.com/" 'debug

        Dim Path As String = "Path=LDAP://usflmiadc12-02.km2solutions.net/CN=Jeff Gackenheimer,OU=Clients,DC=km2solutions,DC=net"
        'Dim urlfull As String = url & "adHandler.ashx?ActiveDirectoryLogin=Yes" & "&IP=" & HttpContext.Current.Request.UserHostAddress.ToString & "&" & Path
        Dim urlfull As String = url & "adHandler.ashx??ActiveDirectoryLogin=Yes&IP=192.168.156.89&Path=LDAP://usflmiadc12-02.km2solutions.net/CN=Jeff Gackenheimer,OU=Client Access,OU=Km2-Infrastructure,DC=km2solutions,DC=net&USERNAME=jeff.gackenheimer" 'debug

        Path &= "&USERNAME=" & "jeff.gackenheimer"

        Dim postData As String = Path.Replace("/CN=", "&CN=").Replace(",OU=", "&OU=").Replace(",DC=", "&DC=")
        'If (username.Trim = "jeff.gackenheimer") Then
        'lblFailureMessage.Text = "Debug: " & urlfull
        'Exit Sub
        'End If

        System.Net.ServicePointManager.SecurityProtocol = 3072 ' TLS 1.2
        Dim request As HttpWebRequest = HttpWebRequest.Create(urlfull)
        System.Net.ServicePointManager.SecurityProtocol = 3072 ' TLS 1.2
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
        Dim username As String = ""
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

        Response.Redirect(url & "jq/TouchPointAuthentication.aspx?username=" & username & "&uid=" & uid & "&role=" & role & "&project=" & project & "&boxfilter=" & boxfilter & "&url=dashboardasync.aspx&roleset=")

        'Dim writer As New StreamWriter(request.GetRequestStream)
        'writer.Write(postData)
        'writer.Close()

        'Response.Redirect("NewPage");
    End Sub

End Class
