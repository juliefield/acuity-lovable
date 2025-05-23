Imports System
Imports System.Web

Partial Class _Default
    Inherits SitePage

    Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
        'mylab.InnerHtml = 
        Dim pars As String = ""

        Response.AddHeader("X-Frame-Options", "SAMEORIGIN")
        Response.AddHeader("X-XSS-Protection", "1;mode=block")
        Response.AddHeader("X-Content-Type-Options", "nosniff")
        Response.AddHeader("X-Permitted-Cross-Domain-Policies", "none")
        Response.AddHeader("Referrer-Policy", "no-referrer-when-downgrade")
        Response.AddHeader("Feature-Policy", "camera 'self'; fullscreen 'self'; geolocation *; microphone 'self'")
        Response.AddHeader("Expect-CT", "enforce,max-age=31536000")
        Response.AddHeader("Content-Security-Policy", "frame-ancestors 'self' mypurecloud.com *.mypurecloud.com pure.cloud *.pure.cloud;")

        '      <customHeaders>
        '        <!-- Good resource for header specs: https://www.serpworx.com/check-security-headers -->
        '        <add name="X-Frame-Options" value="SAMEORIGIN" />
        '        <add name="X-XSS-Protection" value="1;mode=block" /> <!--TODO: value="0" on acuityapmr (test it too!)-->
        '        <add name="X-Content-Type-Options" value="nosniff" />
        '        <add name="X-Permitted-Cross-Domain-Policies" value="none" />
        '        <add name="Referrer-Policy" value="no-referrer-when-downgrade" />
        '        <add name="Feature-Policy" value="camera 'self'; fullscreen 'self'; geolocation *; microphone 'self'" />
        '        <add name="Expect-CT" value="enforce,max-age=31536000" />
        '        <add name="Content-Security-Policy" value="default-src:; https:; frame-ancestors 'self' mypurecloud.com *.mypurecloud.com pure.cloud *.pure.cloud;" />
        '      </customHeaders>


        If HttpContext.Current.Request.QueryString("prefix") IsNot Nothing Then
            pars = "?prefix=" & HttpContext.Current.Request.QueryString("prefix")
        End If
        If Request.ServerVariables("SERVER_NAME").ToLower.IndexOf("acuitydashboard") >= 0 Then
            Response.Redirect("jq/Login.aspx" & pars)
        ElseIf (Request.ServerVariables("SERVER_NAME").ToLower.IndexOf("acuityapm") >= 0) Or (Request.ServerVariables("SERVER_NAME").ToLower = "localhost") Then
            Response.Redirect("jq/Login.aspx" & pars)
        End If
    End Sub


End Class
