<%@ WebHandler Language="VB" Class="vbHandler" %>
Imports Microsoft.VisualBasic
Imports System
Imports System.Collections.Generic
Imports System.Web
Imports System.Xml
Imports System.Net
Imports System.Text
Imports System.Data
Imports jglib
Imports GScript

Public Class vbHandler
    Implements IHttpHandler

    Dim _connection As String
    Dim _utilities As String
    Dim _connection1 As String
    Dim CONFMGR As New ConfMgr()

    Public ReadOnly Property IsReusable() As Boolean _
        Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

    Sub ProcessRequest(context As HttpContext) Implements IHttpHandler.ProcessRequest

        Dim wh As New WebHandler
        wh.Connection1 = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString ' +";Provider=SQLOLEDB;";
        wh.Connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString ' +";Provider=SQLOLEDB;";
        wh.RootPath = System.Web.HttpContext.Current.Server.MapPath("~")

        Dim q As System.Collections.Specialized.NameValueCollection = context.Request.QueryString
        'If no members in the querystring, assume it's a POST.
        If q.Count = 0 Then q = context.Request.Form

        'TODO: Authenticate with a UNIFIED AUTHENTICATION METHOD.
        '  There is currently one for vc and js, and they are separate
        '  The best one is in WebHandler.js, so maybe use that as a model.

        'wh.qobj = q 'TODO: This is in error (not a member).

        wh.Ip = context.Request.UserHostAddress
        wh.Preclient = CONFMGR.AppSettings(urlprefix() & "ClientID_V2")
        wh.ImporterVersion = CONFMGR.AppSettings(urlprefix() & "ImporterVersion")
        If (context.Request.Files.Count > 0) Then
            wh.File = context.Request.Files.Item(context.Request.Files.Count - 1)
        Else
            wh.File = Nothing
        End If

        'TODO: Install Cache Here (see jshandler.ashx for guidance).

        Dim obj As Object = wh.Process()

        If exists(obj.cmd) Then
            If (obj.cmd = "THROW") Then
                Throw New System.Exception(obj.msg)
            End If
        End If

        If exists(obj.msg) Then
            obj.errormessage = True
        End If
        obj.ServiceMark = "VB"

    End Sub

    Private Function exists(o As Object) As Boolean
        Return o IsNot Nothing
    End Function

    Private Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function

End Class
