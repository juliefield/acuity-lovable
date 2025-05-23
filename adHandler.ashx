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
        
        Dim q As System.Collections.Specialized.NameValueCollection = context.Request.QueryString
        
        If q("ActiveDirectoryLogin") = "Yes" Then
            Dim CN As String = context.Request.QueryString("CN")
            Dim OU As String = context.Request.QueryString("OU")
            Dim loginname As String = context.Request.QueryString("USERNAME")
            Dim ip As String = context.Request.QueryString("IP")
            
            If (loginname <> "") Then                
                Dim clientid As String = CONFMGR.AppSettings(urlprefix() & "ClientID_V2").ToString
                Using db As New DbBaseSql(CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";")
                    Using db2 As New DbBaseSql(CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";")
                        Using dtuser As DataTable = db.GetDataTable("select user_id,firstnm,lastnm,role from usr where login_user_id='" & db.reap(loginname) & "' or user_id='" & db.reap(loginname) & "'")
                            If dtuser.Rows.Count = 1 Then
                                Dim myuid As String = ""
                                Dim username As String = dtuser.Rows(0).Item("user_id").Trim
                                'Dim pwd As String = dtuser.Rows(0).Item("user_pwrd").Trim
                                Dim role As String = dtuser.Rows(0).Item("role").Trim
                                Using dtses As DataTable = db2.GetDataTable("select * FROM SES where username='" & username & "' and 1=dbo.ipmatch(ip,'" & ip & "') and client='" & clientid & "'")
                                    If dtses.Rows.Count > 0 Then
                                        myuid = dtses.Rows(0).Item("uid")
                                        db2.Update("update SES set expdate='" + DateTime.Now.AddHours(12.0).ToString & "',pkey='IMPLICIT',entby='migrator' where username='" & username & "' and 1=dbo.ipmatch(ip,'" & ip & "') and client='" & clientid & "'")
                                    Else
                                        Dim uid As String = System.Guid.NewGuid.ToString
                                        myuid = uid
                                        db2.Update("insert into SES (username,pkey,uid,ip,expdate,adHop,client,entby) values('" & username & "','IMPLICIT','" & uid & "','" & ip & "','" & DateTime.Now.AddHours(12.0).ToString & "','Y','" & clientid & "','migrator')")
                                        Using dt2 As DataTable = db2.GetDataTable("select username from usr where client='" & clientid & "' and username='" & username & "'")
                                            If dt2.Rows.Count <= 0 Then 'set up a new user.
                                                Using dtusr As DataTable = db2.Insert("insert into usr (username,client,entby) values ('" & username & "','" & clientid & "','migrator');select scope_identity()")
                                                    Using dtfirstname As DataTable = db2.GetDataTable("select id from kdd where client='" & clientid & "' and idkdg=0 and name='First Name'")
                                                        Using dtlastname As DataTable = db2.GetDataTable("select id from kdd where client='" & clientid & "' and idkdg=0 and name='Last Name'")
                                                            db2.Update("insert into VRT (tbl,idtbl,client,idkdd,val,entby) values ('USR','" & dtusr.Rows(0).Item(0).ToString & "','" & clientid & "','" & dtfirstname.Rows(0).Item("id") & "','" & dtuser.Rows(0).Item("firstnm").Trim & "','migrator')")
                                                            db2.Update("insert into VRT (tbl,idtbl,client,idkdd,val,entby) values ('USR','" & dtusr.Rows(0).Item(0).ToString & "','" & clientid & "','" & dtlastname.Rows(0).Item("id") & "','" & dtuser.Rows(0).Item("lastnm").Trim & "','migrator')")
                                                            Using dtgrp As DataTable = db2.Insert("insert into GRP (role,client,entby) values ('" & role & "','" & clientid & "','migrator');select scope_identity()")
                                                                db2.Update("insert into usr_grp (idusr,idgrp) values ('" & dtusr.Rows(0).Item(0).ToString & "','" & dtgrp.Rows(0).Item(0).ToString & "')")
                                                            End Using
                                                        End Using
                                                    End Using
                                                End Using
                                            End If
                                        End Using
                                    End If
                                End Using
                                'Added 4/19/2016 per Charle's request.
                                db.Update("update usr set previous_logindt=current_logindt,current_logindt=getdate() where user_id='" & db.reap(username) & "'")
                                'TODO: Test for multiple project situations.
                                'TODO: Test for "no project" situations.
                                Dim boxfilter As String = ""
                                Dim project As String = ""
                                If role = "CSR" Then
                                    boxfilter = "on"
                                    Using dtc As DataTable = db.GetDataTable("select pj.ProjectDesc from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id inner join project pj on pj.ProjectID=tm.project_id where usr.user_id='" & db.reap(username) & "'")
                                        project = ""
                                        Dim first As Boolean = True
                                        For Each row As DataRow In dtc.Rows
                                            If Not first Then project &= ","
                                            project &= row("ProjectDesc").ToString.Trim
                                            first = False
                                        Next
                                        If project = "" Then project = "none"
                                    End Using
                                ElseIf role = "Team Leader" Then
                                    boxfilter = "on"
                                    Using dtc As DataTable = db.GetDataTable("select distinct pj.ProjectDesc from team tm inner join project pj on pj.ProjectID=tm.project_id where tm.status in ('A','M') and tm.spvr_user_id='" & db.reap(username) & "'")
                                        project = ""
                                        Dim first As Boolean = True
                                        For Each row As DataRow In dtc.Rows
                                            If Not first Then project &= ","
                                            project &= row("ProjectDesc").ToString.Trim
                                            first = False
                                        Next
                                        If project = "" Then project = "none"
                                    End Using
                                ElseIf role = "Group Leader" Then
                                    boxfilter = "on"
                                    Using dtc As DataTable = db.GetDataTable("select distinct pj.ProjectDesc from grp inner join project pj on pj.ProjectID=grp.project_id where grp.spvr_user_id='" & db.reap(username) & "'")
                                        project = ""
                                        Dim first As Boolean = True
                                        For Each row As DataRow In dtc.Rows
                                            If Not first Then project &= ","
                                            project &= row("ProjectDesc").ToString.Trim
                                            first = False
                                        Next
                                        If project = "" Then project = "none"
                                    End Using
                                Else
                                    'Can I tell what project a manager is on?  Or 
                                End If

                                context.Response.Write("found=1&username=" & username & "&uid=" & myuid & "&role=" & role & "&boxfilter=" & boxfilter & "&project=" & project)
                                Exit Sub
                            End If
                        End Using
                    End Using
                End Using
            End If
        End If

        context.Response.Write("found=0")
    End Sub
    
    Private Function exists(o As Object) As Boolean
        Return o IsNot Nothing        
    End Function

    Private Function urlprefix() As String
        Dim sp As New SitePage
        Return "km2." 'Debug
        Return sp.urlprefix()
    End Function

End Class
    

