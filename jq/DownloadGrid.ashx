<%@ WebHandler Language="VB" Class="DownloadGrid" %>
Imports System
Imports System.Web
Imports System.Xml
Imports System.Net
Imports System.Data

Public Class DownloadGrid : Implements IHttpHandler
  

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        
        If context.Request.Form("downloadtype") = "csv" Then
            context.Response.ContentType = "text/csv"
            context.Response.ContentType = "application/force-download"
            context.Response.AddHeader("content-disposition", "attachment; filename=" & context.Request.Form("downloadfilename") & ".csv")
            Dim str As String = context.Request.Form("csvBuffer")
            str = str.Replace(Chr(9), ",")
            context.Response.Write(str)
        ElseIf context.Request.Form("downloadtype") = "doublepipe" Then
            context.Response.ContentType = "text/plain"
            context.Response.ContentType = "application/force-download"
            context.Response.AddHeader("content-disposition", "attachment; filename=" & context.Request.Form("downloadfilename") & ".txt")
            Dim str As String = context.Request.Form("csvBuffer")
            str = str.Replace(Chr(9), "||")
            context.Response.Write(str)
        ElseIf context.Request.Form("downloadtype") = "ics" Then
            context.Response.ContentType = "text/plain"
            context.Response.ContentType = "application/force-download"
            context.Response.AddHeader("content-disposition", "attachment; filename=" & context.Request.Form("downloadfilename") & ".ics")
            Dim str As String = context.Request.Form("csvBuffer")
            context.Response.Write(str)
        Else
            context.Response.ContentType = "html"
            context.Response.Write("<p>Invalid Download Specs, downloadType = " & context.Request.Form("downloadtype") & "</p>")
        End If
        
    End Sub


    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class