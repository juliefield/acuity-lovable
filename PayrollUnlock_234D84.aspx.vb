Imports System.Data
Imports jglib

Partial Class _PayrollUnlock_234D84
    Inherits System.Web.UI.Page

    Public CONFMGR As New ConfMgr()

    Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
        Using db As New DbBaseSql(CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";")
            db.Update("update abc_paylock set locked='N' where enddate='2014-12-20'")
        End Using
    End Sub

    Public Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function

End Class
