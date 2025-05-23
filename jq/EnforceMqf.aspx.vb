Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports jglib

Partial Class jq_EnforceMqf
    Inherits SitePage

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        If True Then
            Dim _connection As String = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            Using db As New DbBaseSql(_connection)
                Using dtmqf As DataTable = db.GetDataTable("select mqf_id,weight_factor,status,project_id,mqf# from kpi_mqf where line#=1 order by mqf_id asc")
                    For Each rowmqf As DataRow In dtmqf.Rows
                        For m As Integer = -10 To 10 Step 1
                            Using dtr As DataTable = db.GetDataTable("select mqf_id from kpi_mqf where line#=2 and mqf#='" & rowmqf("mqf#").ToString & "' and level#='" & m.ToString & "'")
                                If dtr.Rows.Count <= 0 Then
                                    Dim sql As String = "insert into kpi_mqf (cat_id,mqf#,line#,level#,weight_factor,score,resp_flag,status,entdt,entby,project_id) values (1,'" & rowmqf("mqf#").ToString & "',2,'" & m.ToString & "','" & rowmqf("weight_factor") & "','" & m.ToString & "','','" & rowmqf("status").ToString & "','" & Now.ToShortDateString & "','jeffgack','" & rowmqf("project_id").ToString & "');select scope_identity()"
                                    Using dtinsmqf As DataTable = db.Insert(Sql)
                                        db.Update("insert into kpi_scoring (mqf_id,mqf#,score,entdt,entby,project_id) values ('" & dtinsmqf.Rows(0).Item(0).ToString & "','" & rowmqf("mqf#") & "','" & m.ToString & "','" & Now.ToShortDateString & "','jeffgack','" & rowmqf("project_id").ToString & "')")
                                    End Using
                                End If
                            End Using

                        Next
                    Next


                End Using


            End Using


        End If
    End Sub

End Class
