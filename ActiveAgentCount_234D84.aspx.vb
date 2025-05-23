Imports System.Data
Imports jglib

Partial Class _ActiveAgentCount_234D84
    Inherits System.Web.UI.Page

    Private CONFMGR As New ConfMgr()

    Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
        Using db As New DbBaseSql(CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";")
            Using dt As DataTable = db.exec("select count(*) from usr where status<>'2' and role<>'Admin'")
                mycount.InnerHtml = dt.Rows(0).Item(0).ToString
            End Using
            Using dt2 As DataTable = db.exec("select count(*) from usr where status<>'2' and role='CSR' and convert(varchar(8),isnull(current_logindt,'19000101'),112)=convert(varchar(8),getdate(),112)")
                mycount2.InnerHtml = dt2.Rows(0).Item(0).ToString
            End Using
            Using dt3 As DataTable = db.exec("select count(*) from usr where status<>'2' and role='Team Leader' and convert(varchar(8),isnull(current_logindt,'19000101'),112)=convert(varchar(8),getdate(),112)")
                mycount3.InnerHtml = dt3.Rows(0).Item(0).ToString
            End Using
            Using dt4 As DataTable = db.exec("select count(*) from usr where status<>'2' and role not in ('CSR','Team Leader','Admin') and convert(varchar(8),isnull(current_logindt,'19000101'),112)=convert(varchar(8),getdate(),112)")
                mycount4.InnerHtml = dt4.Rows(0).Item(0).ToString
            End Using
        End Using
    End Sub

    Public Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function

End Class
