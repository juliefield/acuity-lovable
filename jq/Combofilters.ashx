<%@ WebHandler Language="VB" Class="Combofilters" %>
Imports System
Imports System.Web
Imports System.Xml
Imports System.Net
Imports System.Data
Imports jglib

Public Class Combofilters : Implements IHttpHandler

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        
        'For filters, if there is no "cachme" (meaning it's an old call),
        'then REMOVE THE TIME STAMP and still make it 30-minute cache.
        'note this is ONLY for the filters.
        
        Dim mykey As String
        If False Then 'TAKE OUT FOR NOW:  context.Request.QueryString("cacheme") Is Nothing Then
            mykey = context.Request.RawUrl & Now.Date.Month.ToString & "-" & Now.Date.Day.ToString & ":" & ((Now.Hour * 2) + Convert.ToInt32(Now.Minute / 30)).ToString
        Else
            mykey = context.Request.RawUrl
        End If

        'Note: If using IIS 7, this can likely be replaced with output caching.
        If False Then 'Caching is on. Turn off to debug.
            'If context.Request.QueryString("cacheme") IsNot Nothing Then 'TODO: Force this path.
            Dim val As String = context.Cache(mykey)
            If (val IsNot Nothing) Then
                context.Response.Write(val)
            Else
                Dim qc As New FilterContext(context)
                Dim str As String = qc.ProcessRequest()
                context.Response.Write(str)
                context.Cache(mykey) = str
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
            Dim qc As New FilterContext(context)
            context.Response.Write(qc.ProcessRequest())
        End If
        
    End Sub
    
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class