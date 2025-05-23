<%@ WebHandler Language="VB" Class="Query" %>
Imports System
Imports System.Web
Imports System.Xml
Imports System.Net
Imports System.Data
Imports jglib

Public Class Query : Implements IHttpHandler

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        
        'Note: If using IIS 7, this can likely be replaced with output caching.
        If context.Request.QueryString("cacheme") IsNot Nothing Then
            Dim val As String = context.Cache(context.Request.RawUrl)
            If (val IsNot Nothing) Then
                context.Response.Write(val)
            Else
                Dim qc As New QueryContext(context)
                Dim str As String = qc.ProcessRequest()
                context.Response.Write(str)
                context.Cache(context.Request.RawUrl) = str
            End If

            context.Response.Cache.SetCacheability(HttpCacheability.Public)
            Dim bkey As String = context.Request.QueryString("bkey")
            'This is important so browser cache can clean up pages that will never be requested again.
            If bkey IsNot Nothing Then
                If bkey.IndexOf(":") > 0 Then
                    context.Response.Cache.SetExpires(DateTime.Now.AddHours(1))
                ElseIf bkey.IndexOf("-") > 0 Then
                    context.Response.Cache.SetExpires(DateTime.Now.AddDays(1))
                Else
                    context.Response.Cache.SetExpires(DateTime.Now.AddYears(100))
                End If
            Else
                context.Response.Cache.SetExpires(DateTime.Now.AddYears(100))
            End If

        Else
            Dim qc As New QueryContext(context)
            context.Response.Write(qc.ProcessRequest())
        End If

    End Sub
    
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class