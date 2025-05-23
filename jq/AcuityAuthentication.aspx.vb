
Partial Class jq_AcuityAuthentication
    Inherits SitePage
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Dim jv As String = ""

        Dim R As String = vbCrLf
        If Request.QueryString("username") IsNot Nothing AndAlso Request.QueryString("url") IsNot Nothing Then
            If Not ClientScript.IsStartupScriptRegistered("authscript") Then
                jv = "<script type=""text/javascript"">" & R
                jv &= "$.cookie(""ERSUsername"",""" & Request.QueryString("username") & """);" & R
                jv &= "$.cookie(""ERSRole"",""" & Request.QueryString("role").ToString & """);" & R
                'jv &= "alert('debug:cookie is ' + $.cookie(""ERSUsername""));" & R
                jv &= "window.location=""" & Request.QueryString("url") & """;"
                jv &= "</script>" & R
                ClientScript.RegisterStartupScript(Me.GetType, "authscript", jv)
            End If
            Session("LoginSide") = "ACUITY"
        End If

    End Sub

End Class
