
Partial Class chat_Default
    Inherits SitePage

    Protected Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
    End Sub

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        Using cds As New VirtualStorage
            Dim bodyid As String = ""
            If (Request.QueryString("cid") IsNot Nothing) Then
                bodyid = Request.QueryString("cid").ToString
            End If
            cds.Register(Me, BodyId:=bodyid)
        End Using
    End Sub

End Class
