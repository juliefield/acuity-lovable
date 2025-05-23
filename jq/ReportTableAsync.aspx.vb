
Partial Class jq_ReportTableAsync
    Inherits SitePage

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        'If Session("LoginSide") IsNot Nothing AndAlso Session("LoginSide") = "TP1" Then
        'Response.Redirect("TP1ReportTable.aspx?" & Request.QueryString.ToString)
        'End If
        Using cds As New VirtualStorage
            Dim bodyid As String = ""
            If (Request.QueryString("cid") IsNot Nothing) Then
                bodyid = Request.QueryString("cid").ToString
            End If
            cds.Register(Me, BodyId:=bodyid, LoadJquery:=False)
        End Using
    End Sub

End Class
