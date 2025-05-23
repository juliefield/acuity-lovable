Imports Microsoft.VisualBasic
Imports System.IO
Imports System.Data
Imports System.Data.Odbc

Partial Class otest
    Inherits System.Web.UI.Page

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        'Using cds As New VirtualStorage
        '    Dim bodyid As String = ""
        '    If (Request.QueryString("cid") IsNot Nothing) Then
        '        bodyid = Request.QueryString("cid").ToString
        '    End If
        '    cds.Register(Me, BodyId:=bodyid, LoadJquery:=False)
        'End Using

        Dim strConn As String = "DSN=XLS3"
        Dim conn As OdbcConnection = Nothing
        conn = New OdbcConnection(strConn)
        conn.Open()
        Dim worksheets As DataTable = conn.GetSchema("Tables")

    End Sub

End Class
