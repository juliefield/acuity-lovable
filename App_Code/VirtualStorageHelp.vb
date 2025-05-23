Imports Microsoft.VisualBasic
Imports System.IO
Imports System.Data
Imports System.Data.OleDb
Imports jglib

Public Class VirtualStorageHelp
    Inherits VirtualContent
    Private CONFMGR As ConfMgr

    Public Overrides Function GetConnectionString() As String
        CONFMGR = New ConfMgr()
        _strConnectionString = CONFMGR.ConnectionStrings(urlprefix() & "Help", hard:=True).ConnectionString & ";Provider=SQLOLEDB;"
        Return MyBase.GetConnectionString()
    End Function

    Public Overrides Function GetProjectNumber() As String
        CONFMGR = New ConfMgr()
        _strProjectNumber = CONFMGR.AppSettings(urlprefix() & "HelpNumber")
        Return MyBase.GetProjectNumber()
    End Function

    Public Overrides Function GetCrossPlatformUrl() As String
        _strCPurl = "http://" & HttpContext.Current.Request.Url.Host & HttpContext.Current.Request.ApplicationPath & "/CDDH"
        Return MyBase.GetCrossPlatformUrl()
    End Function

    Public Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function
End Class
