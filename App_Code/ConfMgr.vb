Imports Microsoft.VisualBasic
Imports System.IO
Imports System.Data
Imports System.Data.OleDb
Imports jglib
Imports tposecureVB

Public Class myconnectionstring
    Public ConnectionString As String
End Class

Public Class ConfMgr
    Private BUMPVALUE As String = ""   'Run this in GoldenCRM to increment the #:  update bump set value = value + 1

    Public Sub New()
        Dim sp = (New ConfigMgrSafe_VB)
        sp.SetDebuggingPrefixVB(System.Configuration.ConfigurationManager.AppSettings("debugprefix").ToString)
    End Sub

    Public Function Bump() As String
        If BUMPVALUE = "" Then
            Dim _connection2 As String = ConnectionStrings("ers.Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            Using db2 As New DbBaseSql(_connection2)
                Using dt As DataTable = db2.GetDataTable("select value from bump")
                    If (dt.Rows.Count > 0) Then
                        BUMPVALUE = dt.Rows(0).Item("value").ToString
                    End If
                End Using
            End Using
        End If

        Return "Bump=" & BUMPVALUE
    End Function

    Public Function ConnectionStrings(vs As String, Optional ByVal hard As Boolean = False) As myconnectionstring
        Dim mc As New myconnectionstring
        Dim vss As String() = vs.Split(".")

        If vss.Length < 2 Then
            mc.ConnectionString = System.Configuration.ConfigurationManager.ConnectionStrings(vs).ConnectionString
            Return mc
        Else
            mc.ConnectionString = (New ConfigMgrSafe_VB).ConnectionStringsVB(vs, hard)
            Return mc
        End If
    End Function

    Public Function AppSettings(vs As String) As String
        Dim vss As String() = vs.Split(".")
        If vss.Length < 2 Then
            Return System.Configuration.ConfigurationManager.AppSettings(vs)
        Else
            Return (New ConfigMgrSafe_VB).AppSettingsVB(vs)
        End If
    End Function

    Public Function minified(fn As String) As String

        Return fn 'minified function moved to Sitepage.  This "return" is left as a stub in case of old markup.

    End Function

    Public Function PasswordAccepted(prefix As String, user_id As String, password As String) As Boolean
        Return (New ConfigMgrSafe_VB).PasswordAcceptedVB(prefix, user_id, password, False)
    End Function

    Public Function UsingMasterPasswordByPrefix(prefix As String, password As String) As Boolean
        Return (New ConfigMgrSafe_VB).UsingMasterPasswordbyPrefixVB(prefix, password)
    End Function

    'Usage: Password(urlprefix(),"jeffgack") = "mypassword"
    'Public Sub SetPassword(prefix As String, user_id As String, password As String)
    '    ConfigMgrSafe_VB.SetPasswordVB(prefix, user_id, password)
    'End Sub

End Class
