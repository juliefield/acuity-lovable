<%@ WebHandler Language="VB" Class="chat" %>
Imports System
Imports System.Web
Imports System.Xml
Imports System.Net
Imports System.Data
Imports System.Threading

Module Mod1
    Public modUsers As New ArrayList
    Public modPostcnt As Integer = 0
    Public modPosts As New ArrayList
End Module

Public Class chatPost
    Public _guid As String
    Public _message As String
    Public _postnumber As Integer
    Public Sub New(guid As String, message As String, postnumber As Integer)
        _message = message
        _guid = guid
        _postnumber = postnumber
    End Sub
End Class

Public Class chatUser
    Public _guid As String
    Public _name As String
    Public _poststart As Integer
    Public _logintime As DateTime
    Public _lastretrievetime As DateTime
    Public Sub New(name As String, poststart As Integer)
        _name = name
        _guid = System.Guid.NewGuid.ToString()
        _poststart = poststart
        _lastretrievetime = DateTime.Now
    End Sub
End Class

Public Class chat : Implements IHttpHandler

    Private _context As HttpContext       

    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest

        Dim valid As Boolean = False
        Dim mutexFile As Mutex
        mutexFile = New Mutex(False, "M1")
        mutexFile.WaitOne()

        
        _context = context
        context.Response.ContentType = "text/xml"
        Dim sbXML As New StringBuilder
        Dim writer As XmlWriter = XmlWriter.Create(sbXML)
        writer.WriteStartElement("Chat")

        If context.Request.QueryString("login") IsNot Nothing Then
            If context.Request.QueryString("username") IsNot Nothing Then
                valid = False
                Dim username As String = context.Request.QueryString("username")
                If context.Request.QueryString("password") IsNot Nothing Then
                    Dim password As String = context.Request.QueryString("password")
                    Select Case username
                        Case "dweather"
                            If password = "hudhotas" Then valid = True
                        Case "jeffgack"
                            If password = "jeffgack" Then valid = True
                        Case "leslie"
                            If password = "Leslie12" Then valid = True
                    End Select
                End If
                
                Dim outguid As String = ""
                
                If valid Then
                
                    Dim usecnt As Integer = 1
                    For Each cu As chatUser In modUsers 'semaphore
                        If cu._name = username Then
                            usecnt += 1
                        End If
                    Next
                    'Leave this ambiguous for now.
                    'If usecnt > 1 Then
                    'username = username & "(" & usecnt.ToString & ")"
                    'End If
                    Dim mycu As New chatUser(username, modPostcnt + 1)
                    modUsers.Add(mycu)
                    outguid = mycu._guid
                
                Else
                    outguid = "FAILURE"
                End If
                
                'Send back the guid
                Dim ds As New DataSet("Authentication")
                Dim dtmsg As New DataTable()
                dtmsg.Columns.Add("UID")
                Dim dr As DataRow = dtmsg.NewRow()
                dr("UID") = outguid
                dtmsg.Rows.Add(dr)
                dtmsg.TableName = "AccessKey"
                ds.Tables.Add(dtmsg)
                ds.WriteXml(writer)
                
            End If
        End If
        
        If context.Request.QueryString("send") IsNot Nothing Then
            If context.Request.QueryString("uid") IsNot Nothing Then
                Dim uid As String = context.Request.QueryString("uid")
                For Each cu As chatUser In modUsers
                    If cu._guid = uid Then
                        valid = True
                        Exit For
                    End If
                Next
                If valid Then
                    modPostcnt += 1
                    Dim po As New chatPost(uid, context.Request.QueryString("send"), modPostcnt)
                    modPosts.Add(po) 'semaphore

                End If
            End If
            
        End If
        
        If context.Request.QueryString("retrieve") IsNot Nothing Then
            If context.Request.QueryString("uid") IsNot Nothing Then
                Dim uid As String = context.Request.QueryString("uid")
                Dim mycu As chatUser = Nothing
                For Each cu As chatUser In modUsers
                    If cu._guid = uid Then
                        mycu = cu
                        Exit For
                    End If
                Next
                Dim rightnow As DateTime = DateTime.Now
                If mycu IsNot Nothing Then
                    mycu._lastretrievetime = rightnow

                    Dim ds As New DataSet("Postings")
                    Dim dtmsg As New DataTable()
                    dtmsg.Columns.Add("User")
                    dtmsg.Columns.Add("Post")
                    For Each po As chatPost In modPosts
                        If po._postnumber >= mycu._poststart AndAlso po._guid <> mycu._guid Then
                            Dim name As String = ""
                            For Each pocu As chatUser In modUsers
                                If pocu._guid = po._guid Then
                                    name = pocu._name
                                End If
                            Next
                            Dim dr As DataRow = dtmsg.NewRow()
                            dr("User") = name
                            dr("Post") = po._message
                            dtmsg.Rows.Add(dr)

                        End If
                    Next
                    dtmsg.TableName = "Posts"
                    ds.Tables.Add(dtmsg)
                    ds.WriteXml(writer)

                    Dim du As New DataSet("Users")
                    Dim dtusers As New DataTable()
                    dtusers.Columns.Add("UniqueUser")
                    For Each cu As chatUser In modUsers
                        If mycu._name <> cu._name AndAlso DateDiff(DateInterval.Second, cu._lastretrievetime, rightnow) < 30 Then
                            Dim addit As Boolean = True
                            For Each dtr As DataRow In dtusers.Rows
                                If dtr.Item("UniqueUser") = cu._name Then
                                    addit = False
                                    Exit For
                                End If
                            Next
                            If addit Then
                                Dim dr As DataRow = dtusers.NewRow()
                                dr("UniqueUser") = cu._name
                                dtusers.Rows.Add(dr)
                            End If
                        End If
                    Next
                    dtusers.TableName = "User"
                    du.Tables.Add(dtusers)
                    du.WriteXml(writer)

                    
                    mycu._poststart = modPostcnt + 1
                End If
            End If
        End If

        'dtout.TableName = "Point"
        'ds.Tables.Add(dtout)
        'ds.WriteXml(writer)
        writer.WriteEndElement()
        writer.WriteEndDocument()
        writer.Close()
        sbXML = sbXML.Replace("encoding=""utf-16""", "")
        context.Response.Write(sbXML)

        mutexFile.ReleaseMutex()
    End Sub

    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

End Class