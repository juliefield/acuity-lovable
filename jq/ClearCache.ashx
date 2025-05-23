<%@ WebHandler Language="VB" Class="Query" %>
Imports System
Imports System.Web
Imports System.Xml
Imports System.Net
Imports System.Data

Public Class Query : Implements IHttpHandler

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        
        'Note: If using IIS 7, this can likely be replaced with output caching.
        context.Response.ContentType = "text/html"
        If context.Request.QueryString("all") IsNot Nothing Then
            Dim enumerator As IDictionaryEnumerator = context.Cache.GetEnumerator()
            While enumerator.MoveNext()
                context.Cache.Remove(enumerator.Key)
            End While
            context.Response.Write("<p>All Cache Cleared</p>")            
        Else
            context.Response.Write("<p>No Param Specified</p>")
        End If
    End Sub
    
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class