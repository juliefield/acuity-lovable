Imports Microsoft.VisualBasic
Imports System.IO
Imports System.Data
Imports System.Data.OleDb
Imports System.Collections.Generic
Imports jglib

Partial Class jq_Help
    Inherits SitePage

    Protected Overrides Sub OnPreInit(ByVal e As System.EventArgs)
        Page.Theme = "Acuity3"
    End Sub

    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load

        Using cds As New VirtualStorageHelp
            Dim bodyid As String = ""
            If (Request.QueryString("cid") IsNot Nothing) Then
                bodyid = Request.QueryString("cid").ToString
            End If
            cds.Register(Me, BodyId:=bodyid, LoadJquery:=False, VerticalOffset:="110px")

            If (bodyid = "") Then
                bodyid = "HelpRoot" 'CLUGUE to avoid having to traverse controls.
            End If

            Using db As New DbBaseSql(cds._strConnectionString)
                'Title
                Dim rootid As String = bodyid
                Dim bld As String = ""
                Using dt As DataTable = db.GetDataTable("select * from CDH where projectnumber='" & cds._strProjectNumber & "' and bodyid='" & bodyid & "' order by moddate desc")
                    If (dt.Rows.Count > 0) Then
                        pagetitle.InnerHtml = dt.Rows(0).Item("linktext")
                        'Navigation (Parents)
                        Dim navs As New List(Of String)()
                        Dim titles As New List(Of String)()
                        navs.Add(dt.Rows(0).Item("bodyid"))
                        titles.Add(dt.Rows(0).Item("linktext"))
                        Dim foundroot As Boolean = False
                        Dim parentid As String = dt.Rows(0).Item("parentid")
                        While Not foundroot
                            Using dtn As DataTable = db.GetDataTable("select * from CDH where projectnumber='" & cds._strProjectNumber & "' and bodyid='" & parentid & "' order by moddate desc")
                                If (dtn.Rows.Count <= 0) Then
                                    'navs.Add("(parent not found)")
                                    foundroot = True
                                Else
                                    parentid = dtn.Rows(0).Item("parentid")
                                    'look for a loop
                                    For Each nav As String In navs
                                        If nav = parentid Then
                                            navs.Add("(circular navigation for id " & parentid & ")")
                                            titles.Add("(circular navigation for id " & parentid & ")")
                                            foundroot = True
                                            Exit For
                                        End If
                                    Next
                                    If Not foundroot Then
                                        navs.Add(dtn.Rows(0).Item("bodyid"))
                                        titles.Add(dtn.Rows(0).Item("linktext"))
                                    End If
                                End If
                            End Using
                        End While
                        bld = ""
                        Dim i As Integer
                        For i = 0 To navs.Count - 1
                            If i = 0 Then
                                bld = titles(i)
                            Else
                                bld = "<a href=""" & System.IO.Path.GetFileName(System.Web.HttpContext.Current.Request.Url.AbsolutePath) & "?cid=" & navs(i) & """>" & titles(i) & "</a> &gt; " & bld
                            End If
                        Next
                        rootid = navs(navs.Count - 1)

                        pagenav.InnerHtml = bld

                        'Children
                        navs.Clear()
                        titles.Clear()

                        Using dtc As DataTable = db.GetDataTable("select * from CDH where projectnumber='" & cds._strProjectNumber & "' and parentid='" & dt.Rows(0).Item("bodyid") & "' and moddate in (select max(moddate) as moddate from cdh where projectnumber='" & cds._strProjectNumber & "' and parentid='" & dt.Rows(0).Item("bodyid") & "' group by projectnumber,bodyid) order by [order] asc")
                            Dim dup As String = ""
                            bld = ""
                            For Each row As DataRow In dtc.Rows
                                If (row("bodyid") <> dup) Then
                                    dup = row("bodyid")
                                    bld &= "<a href=""" & System.IO.Path.GetFileName(System.Web.HttpContext.Current.Request.Url.AbsolutePath) & "?cid=" & row("bodyid") & """>" & row("linktext") & "</a><br />"
                                End If
                            Next
                            pagechildren.InnerHtml = bld
                        End Using

                        'Siblings (Previous and Next Page)
                        Dim ltitle As String = ""
                        Dim lnav As String = ""
                        Dim lpos As Integer = -2147483646
                        Dim rtitle As String = ""
                        Dim rnav As String = ""
                        Dim rpos As Integer = 2147483646
                        Dim foundself As Boolean = False
                        Dim myposition As Integer
                        Using dto As DataTable = db.GetDataTable("select * from CDH where projectnumber='" & cds._strProjectNumber & "' and parentid='" & dt.Rows(0).Item("parentid") & "' and moddate in (select max(moddate) as moddate from cdh where projectnumber='" & cds._strProjectNumber & "' and parentid='" & dt.Rows(0).Item("parentid") & "' group by projectnumber,bodyid) order by [order] asc")
                            'WAS: "select * from CDH where projectnumber='" & cds._strProjectNumber & "' and parentid='" & dt.Rows(0).Item("parentid") & "' order by moddate desc")
                            For Each row As DataRow In dto.Rows
                                If Not foundself Then
                                    If (row("bodyid") = dt.Rows(0).Item("bodyid")) Then
                                        myposition = row("order")
                                        Exit For
                                    End If
                                End If
                            Next
                            Dim dup As String = ""
                            For Each row As DataRow In dto.Rows
                                If (row("bodyid") <> dup) Then
                                    dup = row("bodyid")
                                    If (row("bodyid") <> dt.Rows(0).Item("bodyid")) Then
                                        If (row("order") < myposition) Then
                                            If (row("order") > lpos) Then
                                                lpos = row("order")
                                                ltitle = row("linktext")
                                                lnav = row("bodyid")
                                            End If
                                        End If
                                        If (row("order") > myposition) Then
                                            If (row("order") < rpos) Then
                                                rpos = row("order")
                                                rtitle = row("linktext")
                                                rnav = row("bodyid")
                                            End If
                                        End If
                                    End If
                                End If
                            Next
                        End Using
                        If lnav = "" Then
                            pageleft.InnerHtml = ""
                        Else
                            pageleft.InnerHtml = "<a href=""" & System.IO.Path.GetFileName(System.Web.HttpContext.Current.Request.Url.AbsolutePath) & "?cid=" & lnav & """>&lt;" & ltitle & "</a>"
                        End If
                        If rnav = "" Then
                            pageright.InnerHtml = ""
                        Else
                            pageright.InnerHtml = "<a href=""" & System.IO.Path.GetFileName(System.Web.HttpContext.Current.Request.Url.AbsolutePath) & "?cid=" & rnav & """>" & rtitle & "&gt;</a>"
                        End If
                    Else
                        pagetitle.InnerHtml = "Help Page"
                        topicslabel.InnerHtml = ""
                        pageleft.InnerHtml = ""
                        pageright.InnerHtml = ""
                        pagechildren.InnerHtml = ""

                    End If
                End Using
                'Root's Children and Grandchildren for Topics Bar
                Using dtc As DataTable = db.GetDataTable("select * from CDH where projectnumber='" & cds._strProjectNumber & "' and parentid='" & rootid & "' and moddate in (select max(moddate) as moddate from cdh where projectnumber='" & cds._strProjectNumber & "' and parentid='" & rootid & "' group by projectnumber,bodyid) order by [order] asc")
                    bld = "<ul>"
                    For Each rowc As DataRow In dtc.Rows
                        bld &= "<li class=""help-topic""><a href=""#"">" & rowc("linktext") & "</a></li>"
                        Using dtg As DataTable = db.GetDataTable("select * from CDH where projectnumber='" & cds._strProjectNumber & "' and parentid='" & rowc("bodyid") & "' and moddate in (select max(moddate) as moddate from cdh where projectnumber='" & cds._strProjectNumber & "' and parentid='" & rowc("bodyid") & "' group by projectnumber,bodyid) order by [order] asc")
                            For Each rowg As DataRow In dtg.Rows
                                bld &= "<li class=""help-subtopic""><a href=""" & System.IO.Path.GetFileName(System.Web.HttpContext.Current.Request.Url.AbsolutePath) & "?cid=" & rowg("bodyid") & """>" & rowg("linktext") & "</a></li>"
                            Next
                        End Using
                    Next
                    bld &= "</ul>"
                    pagehierarchy.InnerHtml = bld
                    '<li class="help-topic"><a href="#">Topic 1</a></li>
                    '<li class="help-subtopic"><a href="#">Topic 1A</a></li>


                End Using


            End Using

        End Using
    End Sub
End Class
