Imports System
Imports System.Data
Imports System.Configuration
Imports System.Web
Imports System.Web.UI
Imports jglib

Partial Class import3
    Inherits SitePage

    Dim _im As New AcuityImport3()
    Dim client As String = ""

    Private Sub Page_PreInit(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.PreInit

    End Sub
    Protected Overrides Sub OnPreInit(e As System.EventArgs)
        MyBase.Page.Theme = "Acuity3-Leg1"

    End Sub

    Private Sub Page_Init(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Init
        'CODEGEN: This method call is required by the Web Form Designer
        'Do not modify it using the code editor.
        'Dim iver As String = ""
        'Try
        '    iver = CONFMGR.AppSettings(urlprefix() & "ImporterVersion").ToString.Trim
        'Catch ex As Exception
        '    '..just continue if not specified.
        'End Try
        'Select Case iver
        '    Case "2"
        '    Case "", "1"
        '        Response.Redirect("Import.aspx")
        '    Case Else
        '        Throw New ApplicationException("ImporterVersion '" & iver & "' NOT RECOGNIZED")
        'End Select

        _im._connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection", hard:=True).ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        _im._connection2 = CONFMGR.ConnectionStrings(urlprefix() & "Connection20", hard:=True).ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        client = CONFMGR.AppSettings(urlprefix() & "ClientID_V2").ToString
    End Sub


    Private LEVELINGUTILIZATION As Boolean = True

    Private Sub Page_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load

        'Added 2016-06-08
        If (Session("TP1Role") Is Nothing) OrElse (Session("TP1Username") Is Nothing) Then
            Response.Redirect("login.aspx?url=import3.aspx")
        End If

        If (Session("TP1Role") = "CSR") Then
            Response.Redirect("http://www.google.com")
        End If

        If Request.Form("SubmitErrors") IsNot Nothing AndAlso Request.Form("SubmitErrors") <> "" Then
            Response.Redirect("import.aspx")
        End If

        If cbThrow.Checked Then
            Throw New ApplicationException("This is a TEST ERROR (testing error system)")
        End If

        If ddlFileType.SelectedValue IsNot Nothing AndAlso ddlFileType.SelectedValue <> "" Then
            Session("filetype") = ddlFileType.SelectedItem.Text
        Else
            Session("filetype") = "unknown"
        End If

        If ddlFileType.SelectedValue IsNot Nothing AndAlso ddlFileType.SelectedValue = "0" Then
            _im._labelline = "ID/R,Value/R"
            If tbDate.Text.Trim = "" Then
                _im._labelline &= ",Date/R"
            End If
            'DONE:2012-10-15 - Field name should be Weight, not Calls  Was:
            'If ddlSubKPI.Items.Count > 0 Then
            '    If _im._labelline.IndexOf(",Calls") < 0 Then
            '        _im._labelline &= ",Calls/R"
            '    End If
            'End If
            'Is:
            If ddlSubKPI.Items.Count > 0 Then
                If _im._labelline.IndexOf(",Weight") < 0 Then
                    _im._labelline &= ",Weight/R"
                End If
            End If
            If ddlKPI.SelectedValue IsNot Nothing AndAlso ddlKPI.SelectedValue = "#FIELD#" Then
                If _im._labelline.IndexOf(",KPI") < 0 Then
                    _im._labelline &= ",KPI/R"
                End If
            End If
            If ddlSubKPI.Items.Count > 0 Then
                'DONE:2012-10-15 - Leave as VALUE (generalized importer): was: _im._labelline = _im._labelline.Replace("Value", "AHT")
                'DONE:2012-10-15 - Field name should be SubKPI  Was:
                'If ddlSubKPI.SelectedValue = "#FIELD#" Then
                '    If _im._labelline.IndexOf(",Split~Skill") < 0 Then
                '        _im._labelline &= ",Split~Skill/R"
                '    End If
                'End If
                'Is:
                If ddlSubKPI.SelectedValue = "#FIELD#" Then
                    If _im._labelline.IndexOf(",SubKPI") < 0 Then
                        _im._labelline &= ",SubKPI/R"
                    End If
                End If
            End If
        Else
            'DONE: Build _labelline according to filetype specs in DAS tables.
            Using db2 As New DbBaseSql(_im._connection2)
                'TODO: The packaging structures may make the choice of file types differ with selections of
                'Project, Location, Group, or Team
                Using dt As DataTable = db2.exec("SELECT DSC.[name],required,mapped,isid,persistent from DSC inner join DAS on DAS.id=DSC.iddas where DAS.filetype='" & ddlFileType.SelectedValue & "' and DSC.client='" & client & "' order by [order] asc")
                    Dim bld As String = ""
                    For Each row As DataRow In dt.Rows
                        If row("mapped") = "Y" Then
                            If bld <> "" Then bld &= ","
                            bld &= row("name")
                            If row("required") = "Y" Then
                                bld &= "/R"
                            End If
                            If row("isid") = "Y" Then
                                bld &= "/U"
                            End If
                            If row("persistent") = "Y" Then
                                bld &= "/P"
                            End If
                        End If
                    Next
                    _im._labelline = bld
                End Using
            End Using

        End If

        'ElseIf ddlFileType.SelectedValue = "CMS" Then
        'Throw New Exception("CMS is not yet built out in generalized importer")
        'Select Case ddlProjectI.SelectedValue
        '    Case "2" 'Your Project
        '        _im._labelline = "Agent Name/R"
        '        _im._labelline &= ",Calls/R"
        '        _im._labelline &= ",Split~Skill/R"
        '        _im._labelline &= ",Staffed Time"
        '        _im._labelline &= ",Avail Time/R"
        '        _im._labelline &= ",Avg ACD"
        '        _im._labelline &= ",Avg Hold Time"
        '        _im._labelline &= ",Avg ACW"
        '        _im._labelline &= ",AHT/R"
        '        _im._labelline &= ",Int. Xfers"
        '        _im._labelline &= ",Ext. Xfers/R"
        '        _im._labelline &= ",Ext Xfer Rate/R"
        '        _im._labelline &= ",Total AUX"
        '        _im._labelline &= ",AUX 0/R"
        '        _im._labelline &= ",Break/R"
        '        _im._labelline &= ",Lunch/R" 'made required 10/4/2011
        '        _im._labelline &= ",PTO"
        '        _im._labelline &= ",Training/R"
        '        _im._labelline &= ",Meeting/R"
        '        _im._labelline &= ",MISC"
        '    Case Else
        'End Select

        ''Decision Template
        'Select Case ddlProjectI.SelectedValue
        '    Case "2" 'Entergy
        'End Select

        'If tbDate.Text.Trim = "" Then
        '    _im._labelline &= ",Date/R"
        'End If
        'ElseIf ddlFileType.SelectedValue = "KRONOS" Then
        'Throw New Exception("KRONOS is not yet built out in generalized importer")
        '_im._labelline = "Person ID/R,PSID"
        'If tbDate.Text.Trim = "" Then
        '    _im._labelline &= ",Date/R"
        'End If
        '_im._labelline &= ",Division"
        '_im._labelline &= ",Department"
        '_im._labelline &= ",Account"
        '_im._labelline &= ",Location"
        '_im._labelline &= ",Supervisor"
        '_im._labelline &= ",Regular/R"
        '_im._labelline &= ",Overtime/R"
        '_im._labelline &= ",Vacation/R"
        '_im._labelline &= ",Sick/R"
        '_im._labelline &= ",Floating Holiday/R"
        '_im._labelline &= ",Holiday/R"
        '_im._labelline &= ",Holiday II/R"
        '_im._labelline &= ",Bereavement/R"
        '_im._labelline &= ",FMLA/R"
        '_im._labelline &= ",Total Hours"
        'End If

        'Put user code to initialize the page here
        If Not IsPostBack Then
            Using db2 As New DbBaseSql(_im._connection2)
                'TODO: The packaging structures may make the choice of file types differ with selections of
                'Project, Location, Group, or Team
                Using dt As DataTable = db2.exec("SELECT [name],filetype from DAS where datalevel='raw' and client='" & client & "' order by name")
                    ddlFileType.Items.Clear()
                    Dim li As New ListItem
                    li.Value = ""
                    li.Text = "-select-"
                    ddlFileType.Items.Add(li)
                    'Dim li2 As New ListItem
                    'li2.Value = "0"
                    'li2.Text = "ID/Value"
                    'ddlFileType.Items.Add(li2)
                    ddlFileType.AppendDataBoundItems = True
                    ddlFileType.DataValueField = "filetype"
                    ddlFileType.DataTextField = "name"
                    ddlFileType.DataSource = dt
                    ddlFileType.DataBind()
                    'ddlFileType_SelectedIndexChanged(Nothing, Nothing)
                End Using
            End Using
            Using db As New DbBaseSql(_im._connection)
                ddlProjectI.DataValueField = "ProjectID"
                ddlProjectI.DataTextField = "Pd"
                Using dt As DataTable = db.exec("SELECT ProjectID,ProjectDesc+' ('+convert(varchar(10),ProjectId)+')' As Pd FROM dbo.PROJECT ORDER BY ProjectDesc ASC")
                    ddlProjectI.Items.Clear()
                    Dim li As New ListItem
                    li.Value = ""
                    li.Text = "-select-"
                    ddlProjectI.Items.Add(li)
                    ddlProjectI.AppendDataBoundItems = True
                    ddlProjectI.DataSource = dt
                    ddlProjectI.DataBind()
                    ddlProjectI_SelectedIndexChanged(Nothing, Nothing)
                End Using

                ddlIdType.DataValueField = "IDT"
                ddlIdType.DataTextField = "TYPE_DESC"
                Using dt As DataTable = db.exec("SELECT convert(varchar(10),IDTYPE) AS IDT, TYPE_DESC FROM dbo.ID_TYPE ORDER BY TYPE_DESC ASC")
                    ddlIdType.DataSource = dt
                    ddlIdType.DataBind()
                End Using

                ddlLocation.DataValueField = "LDT"
                ddlLocation.DataTextField = "LOC_NAME"
                Using dt As DataTable = db.exec("SELECT convert(varchar(10),LOC_ID) AS LDT, LOC_NAME FROM dbo.LOC ORDER BY LOC_NAME ASC")
                    ddlLocation.Items.Clear()
                    Dim li As New ListItem
                    li.Value = ""
                    li.Text = "-select-"
                    ddlLocation.Items.Add(li)
                    ddlLocation.AppendDataBoundItems = True
                    ddlLocation.DataSource = dt
                    ddlLocation.DataBind()
                End Using
            End Using
        End If

        If _im._wizard Is Nothing Then _im._wizard = New jgWizard_UploadListFile(Me.Page, _im._labelline, OuterDiv:=encdiv, _
        ConnectionString:=CONFMGR.ConnectionStrings(urlprefix() & "Utilities", hard:=True).ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";", _
        ServerPath:=CONFMGR.AppSettings("tempfolder") & "\")
        'If _im._wizard Is Nothing Then _im._wizard = New jgWizard_UploadListFile(Me.Page, _im._labelline, OuterDiv:=encdiv, _
        '    ServerPath:=Server.MapPath(".\importtmp\"))

        If Not IsPostBack Then
            'encdiv.InnerHtml = ""
            '_im._wizard.Start()
        Else
            If _im._wizard.Process() Then
                btndiv.Style.Add("display", "block")
                lblFilename.Text = _im._wizard.filename()
                btnSave_Click(Nothing, Nothing)
            Else
                ImportMsgdiv.InnerHtml = ""
                ImportMsgdiv.Style.Add("display", "none")
            End If
        End If

        'Experimental:
        If Session("pushdate") IsNot Nothing Then
            tbDate.Text = Session("pushdate")
            Session("pushdate") = Nothing
            'tbDate.Enabled = False
        End If
        If Session("pushfiletype") IsNot Nothing Then
            For i As Integer = 0 To ddlFileType.Items.Count - 1
                If ddlFileType.Items(i).Value = Session("pushfiletype") Then
                    ddlFileType.SelectedIndex = i
                    'ddlFileType.Enabled = False
                    ddlFileType_SelectedIndexChanged(Nothing, Nothing)
                    Session("pushfiletype") = Nothing
                    Exit For
                End If
            Next
        End If

    End Sub

    Private Sub cbScoreUpdate_CheckChanged(ByVal sender As Object, ByVal e As System.EventArgs) Handles cbScoreUpdate.CheckedChanged
        Using db As New DbBaseSql(_im._connection)
            Dim str As String = "N"
            If cbScoreUpdate.Checked Then str = "Y"
            db.Update("UPDATE GlobalFlags SET ScoreUpdate='" & str & "'")
        End Using
    End Sub
    Private Sub btnDelete_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnDelete.Click
        Dim msg As String = ""
        Using db As New DbBaseSql(_im._connection)
            Dim dt As DataTable = db.exec("select count(*) from kpi_resp where kpi_id in (select kpi_id from kpi_hstry inner join team on team.team_id=kpi_hstry.team_id inner join grp on grp.group_id=team.group_id where respdt='" & rightdate() & "' and grp.loc_id='" & ddlLocation.SelectedValue & "') AND kpi_resp.PROJECT_ID='" & ddlProjectI.SelectedValue & "' AND MQF#='" & ddlKPI.SelectedValue & "'")
            msg &= dt.Rows(0).Item(0).ToString & " kpi records"
            db.Update("delete from kpi_resp where kpi_id in (select kpi_id from kpi_hstry inner join team on team.team_id=kpi_hstry.team_id inner join grp on grp.group_id=team.group_id where respdt='" & rightdate() & "' and grp.loc_id='" & ddlLocation.SelectedValue & "') AND kpi_resp.PROJECT_ID='" & ddlProjectI.SelectedValue & "' AND MQF#='" & ddlKPI.SelectedValue & "'")
            db.Update("delete from kpi_hstry where kpi_id in (select kpi_hstry.kpi_id from kpi_hstry left outer join kpi_resp on kpi_resp.kpi_id=kpi_hstry.kpi_id where respdt='" & rightdate() & "' and mqf# Is Null)")
            If ddlKPI.SelectedItem.Text.Trim = "AHT" Then '"AHT" was "Productivity"
                Dim dt2 As DataTable = db.exec("select count(*) from subkpi_resp where kpi_id in (select kpi_id from subkpi_hstry inner join team on team.team_id=subkpi_hstry.team_id inner join grp on grp.group_id=team.group_id where respdt='" & rightdate() & "' and grp.loc_id='" & ddlLocation.SelectedValue & "') AND subkpi_resp.PROJECT_ID='" & ddlProjectI.SelectedValue & "' AND MQF#='" & ddlKPI.SelectedValue & "'")
                msg &= ", " & dt2.Rows(0).Item(0).ToString & " subkpi records"
                db.Update("delete from subkpi_resp where kpi_id in (select kpi_id from subkpi_hstry inner join team on team.team_id=subkpi_hstry.team_id inner join grp on grp.group_id=team.group_id where respdt='" & rightdate() & "' and grp.loc_id='" & ddlLocation.SelectedValue & "') AND subkpi_resp.PROJECT_ID='" & ddlProjectI.SelectedValue & "' AND MQF#='" & ddlKPI.SelectedValue & "'")
                db.Update("delete from subkpi_hstry where kpi_id in (select subkpi_hstry.kpi_id from subkpi_hstry left outer join subkpi_resp on subkpi_resp.kpi_id=subkpi_hstry.kpi_id where respdt='" & rightdate() & "' and mqf# Is Null)")
            End If
            msg &= " deleted."
        End Using
        ImportMsgdiv.InnerHtml = msg
        ImportMsgdiv.Style.Add("display", "inline")
    End Sub

    Private Sub btnDeleteCms_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnDeleteCMS.Click
        Dim msg As String = ""
        Using db As New DbBaseSql(_im._connection)
            Dim sql As String = "delete from verticalrecords" & locp() & " where id in (select id from verticalheader" & locp() & " where filetype='CMS' and recdate='" & rightdate() & "' and location='" & ddlLocation.SelectedValue & "' and project='" & ddlProjectI.SelectedValue & "')"
            db.Update(sql)
            Dim dt As DataTable = db.exec("select count(*) from verticalheader" & locp() & " where filetype='CMS' and recdate='" & rightdate() & "' and location='" & ddlLocation.SelectedValue & "' and project='" & ddlProjectI.SelectedValue & "'")
            sql = "delete  from verticalheader" & locp() & " where filetype='CMS' and recdate='" & rightdate() & "' and location='" & ddlLocation.SelectedValue & "' and project='" & ddlProjectI.SelectedValue & "'"
            db.Update(sql)
            msg &= dt.Rows(0).Item(0).ToString & " CMS records"
            msg &= " deleted."
        End Using
        ImportMsgdiv.InnerHtml = msg
        ImportMsgdiv.Style.Add("display", "inline")
    End Sub

    Private Sub btnDeleteKronos_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnDeleteKronos.Click
        Dim msg As String = ""
        Using db As New DbBaseSql(_im._connection)
            Dim sql As String = "delete from verticalrecords" & locp() & " where id in (select id from verticalheader" & locp() & " where filetype='KRONOS' and recdate='" & rightdate() & "' and location='" & ddlLocation.SelectedValue & "')"
            db.Update(sql)
            Dim dt As DataTable = db.exec("select count(*) from verticalheader" & locp() & " where filetype='KRONOS' and recdate='" & rightdate() & "' and location='" & ddlLocation.SelectedValue & "'")
            sql = "delete  from verticalheader" & locp() & " where filetype='KRONOS' and recdate='" & rightdate() & "' and location='" & ddlLocation.SelectedValue & "'"
            db.Update(sql)
            msg &= dt.Rows(0).Item(0).ToString & " KRONOS records"
            msg &= " deleted."
        End Using
        ImportMsgdiv.InnerHtml = msg
        ImportMsgdiv.Style.Add("display", "inline")
    End Sub

    Private Sub btnDeleteKronosPayperiod_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnDeleteKronosPayperiod.Click
        _im.setrollingdate()
        Dim msg As String = ""
        Using db As New DbBaseSql(_im._connection)
            Dim sql As String = "delete from verticalrecords" & locp() & " where id in (select id from verticalheader" & locp() & " where filetype='KRONOS' and recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and location='" & ddlLocation.SelectedValue & "')"
            db.Update(sql)
            Dim dt As DataTable = db.exec("select count(*) from verticalheader" & locp() & " where filetype='KRONOS' and recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and location='" & ddlLocation.SelectedValue & "'")
            sql = "delete  from verticalheader" & locp() & " where filetype='KRONOS' and recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and location='" & ddlLocation.SelectedValue & "'"
            db.Update(sql)
            msg &= dt.Rows(0).Item(0).ToString & " KRONOS records deleted (dates " & _im.rightpaystartdate() & " through " & _im.rightpayenddate() & ")."
        End Using
        ImportMsgdiv.InnerHtml = msg
        ImportMsgdiv.Style.Add("display", "inline")
    End Sub

    Private Sub btnDeleteCmsPayperiod_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnDeleteCMSPayperiod.Click
        _im.setrollingdate()
        Dim msg As String = ""
        Using db As New DbBaseSql(_im._connection)
            Dim sql As String = "delete from verticalrecords" & locp() & " where id in (select id from verticalheader" & locp() & " where filetype='CMS' and recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and location='" & ddlLocation.SelectedValue & "' and project='" & ddlProjectI.SelectedValue & "')"
            db.Update(sql)
            Dim dt As DataTable = db.exec("select count(*) from verticalheader" & locp() & " where filetype='CMS' and recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and location='" & ddlLocation.SelectedValue & "' and project='" & ddlProjectI.SelectedValue & "'")
            sql = "delete  from verticalheader" & locp() & " where filetype='CMS' and recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and location='" & ddlLocation.SelectedValue & "' and project='" & ddlProjectI.SelectedValue & "'"
            db.Update(sql)
            msg &= dt.Rows(0).Item(0).ToString & " CMS records deleted (dates " & _im.rightpaystartdate() & " through " & _im.rightpayenddate() & ")."
        End Using
        ImportMsgdiv.InnerHtml = msg
        ImportMsgdiv.Style.Add("display", "inline")
    End Sub

    Private Sub btnSkip_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnSkip.Click
        btnSave_Click(sender, e)
    End Sub

    Private Sub btnSave_Click(ByVal sender As Object, ByVal e As System.EventArgs) Handles btnSave.Click
        If True Then
            Dim iq As New ImportQueue()

            'TODO: Loose Ends
            Dim idfield As String = ""
            Using db2 As New DbBaseSql(_im._connection2)
                'TODO: The packaging structures may make the choice of file types differ with selections of
                'Project, Location, Group, or Team

                Using dt As DataTable = db2.exec("SELECT DSC.[name],mapped,isid from DSC inner join DAS on DAS.id=DSC.iddas where DAS.filetype='" & ddlFileType.SelectedValue & "' and DSC.client='" & client & "' order by [order] asc")
                    For Each row As DataRow In dt.Rows
                        If row("mapped") = "Y" Then
                            If row("isid") = "Y" Then
                                idfield = row("name")
                            End If
                        End If
                    Next
                End Using

                Dim _queue As Boolean = False
                Dim _startqueue As Boolean = False

                'Added 2016-06-08
                'Changed 2016-06-08
                Dim _username As String = Session("TP1Username").ToString
                If _queue Then
                    'iq.StoreInQueue(_urlprefix, _username, _filename, _worksheet, _client, _labelline, _connection, _connection2, usedate, False, False, False, False, True, _SubKPI, _Project, _Location, _KPI, _SubType, _IdType, kvFileType)
                    'TODO: Store it all in the queue then exit.
                ElseIf _startqueue Then
                    Console.WriteLine("Queue Starting not finished - Exiting")
                    Exit Sub
                Else 'Run this one (not queued, but I should have everything to call it).
                    'DONE: filename property will save a safe version of the file in importtmp
                    Dim filename As String = ""
                    If (Not cbSkipUpload.Checked) Then
                        filename = _im._wizard.QueueCopy()
                    End If
                    'TODO: worksheet property will return session worsheet variable from wizard
                    'TODO: This is only going to work for spreadsheets - expand to allow for .txt and .csv files (most machinery is already in the wizard).
                    'MODIFICATION: duck 09/23/2015 - If there are persistent fields, they need to be PUT BACK ON, as the download wizard would otherwise have to carry it in Javascript.
                    ' The wizard doesn't do this for other qualifiers (because it was never necessary), so am bypassing the need to do this - This decision is also influenced by the need to re-write this feature anyway.
                    Dim lablin As String = _im._wizard.LabelLine
                    'See if there are any "pesistent" fields to deal with (if none, then bypass).  This is mostly for safety since the importer must always work.
                    Dim somepersistent As Boolean = False
                    Using dtsp As DataTable = db2.exec("SELECT sum(case when persistent='Y' then 1 else 0 end) as somepersistent from DSC inner join DAS on DAS.id=DSC.iddas where DAS.filetype='" & ddlFileType.SelectedValue & "' and DSC.client='" & client & "'")
                        If dtsp.Rows(0).Item(0) > 0 Then
                            somepersistent = True
                        End If
                    End Using

                    If somepersistent Then
                        Using dt As DataTable = db2.exec("SELECT DSC.[name],mapped,persistent from DSC inner join DAS on DAS.id=DSC.iddas where DAS.filetype='" & ddlFileType.SelectedValue & "' and DSC.client='" & client & "' order by [order] asc")
                            Dim bld As String = ""
                            Dim slab() As String = lablin.Split(",")
                            Dim first As Boolean = True
                            For Each sl As String In slab
                                Dim rewritten As Boolean = False
                                For Each row As DataRow In dt.Rows
                                    If row("mapped") = "Y" Then
                                        If sl = row("name") Then
                                            If Not first Then
                                                bld &= ","
                                            End If
                                            first = False
                                            rewritten = True
                                            bld &= sl
                                            If row("persistent") = "Y" Then
                                                bld &= "/P"
                                            End If
                                            Exit For
                                        End If
                                    End If
                                Next
                                If Not rewritten Then
                                    If Not first Then
                                        bld &= ","
                                    End If
                                    first = False
                                    bld &= sl
                                End If
                            Next
                            lablin = bld
                        End Using
                    End If

                    Dim logid As String = iq.ImportFromQueue(_username, filename, _im._wizard.WorkSheet, client, lablin, _im._connection, _im._connection2, _
                              usedate:=tbDate.Text, _
                               bReplaceDuplicateDates:=rbReplaceDuplicateDates.Checked, _
                               bAllowDuplicateDates:=rbAllowDuplicateDates.Checked, _
                               bProgressKronos:=cbProgressKronos.Checked, _
                               bMult100:=cbMult100.Checked, _
                               bIgnoreWarnings:=cbIgnoreWarnings.Checked, _
                               SubKPI:=ddlSubKPI.SelectedValue, _
                               Project:=ddlProjectI.SelectedValue, _
                               Location:=ddlLocation.SelectedValue, _
                               KPI:=ddlKPI.SelectedValue, _
                               SubType:=ddlSubtype.SelectedValue, _
                               IdType:=ddlIdType.SelectedValue, _
                               kvFileType:=New KV(_im.ddltext(ddlFileType), ddlFileType.SelectedValue), _
                               idfield:=idfield, _
                               bSkipUpload:=cbSkipUpload.Checked, _
                               bNoCalc:=cbNoCalc.Checked _
                               )
                    Using db As New DbBaseSql(_im._connection)
                        Dim bld As String = ""
                        Using dth As DataTable = db.exec("select disposition,filetype,loc.loc_name,pj.projectdesc,ih.filedate,ih.entdt from importlogheader ih left outer join loc on loc.loc_id=ih.location left outer join project pj on pj.projectid = ih.project where id=" & logid)
                            For Each rowh As DataRow In dth.Rows
                                bld &= "<b>" & rowh("filetype") & " Import - " & rowh("disposition") & "(" & rowh("filedate") & "/" & rowh("projectdesc") & "/" & rowh("loc_name") & ") Imported: " & rowh("entdt") & "</b><br/>"
                                Using dtr As DataTable = db.exec("select errortype,errormsg from importlogrecords where hdrid=" & logid)
                                    For Each rowr As DataRow In dtr.Rows
                                        bld &= rowr("errortype") & " - " & rowr("errormsg") & "<br />"
                                    Next
                                End Using
                            Next
                        End Using
                        sparediv.InnerHtml = ""
                        Try
                            encdiv.InnerHtml &= bld
                        Catch ex As Exception
                            sparediv.InnerHtml = bld
                            sparediv.Style.Add("display", "block")
                        End Try
                        btndiv.Style.Add("display", "none")
                    End Using
                End If
            End Using
        Else
            _im._justloaded = New ArrayList
            _im._errorlist = New ArrayList
            Dim dotheupload As Boolean = True
            If (cbSkipUpload.Checked) Then 'Note: It should be possible to skip upload for ANY type once we're storing everything vertically.  (ddlFileType.SelectedValue = "CMS" Or ddlFileType.SelectedValue = "KRONOS" Or ddlFileType.SelectedValue = "$PC") And 
                dotheupload = False
            End If
            If dotheupload Then
                upload()
            End If
            If (_im._justloaded.Count > 0) Or (Not dotheupload) Then
                _im.verticalsurrogate(txtDate:=tbDate.Text, _
                           bReplaceDuplicateDates:=rbReplaceDuplicateDates.Checked, _
                           bAllowDuplicateDates:=rbAllowDuplicateDates.Checked, _
                           bProgressKronos:=cbProgressKronos.Checked, _
                           bMult100:=cbMult100.Checked, _
                           bIgnoreWarnings:=cbIgnoreWarnings.Checked, _
                           kvSubKPI:=New KV(_im.ddltext(ddlSubKPI), ddlSubKPI.SelectedValue), _
                           kvProject:=New KV(_im.ddltext(ddlProjectI), ddlProjectI.SelectedValue), _
                           kvLocation:=New KV(_im.ddltext(ddlLocation), ddlLocation.SelectedValue), _
                           kvKPI:=New KV(_im.ddltext(ddlKPI), ddlKPI.SelectedValue), _
                           kvSubType:=New KV(_im.ddltext(ddlSubtype), ddlSubtype.SelectedValue), _
                           kvIdType:=New KV(_im.ddltext(ddlIdType), ddlIdType.SelectedValue), _
                           username:=Context.User.Identity.Name.Trim, _
                           kvFileType:=New KV(_im.ddltext(ddlFileType), ddlFileType.SelectedValue), _
                           client:=client)

                If ddlFileType.SelectedValue = "CMS" Then
                    'cbIsPercentage.Checked = False
                    If (Not _im._errorsfound) And ((Not _im._warningsfound) Or cbIgnoreWarnings.Checked) Then
                        'TRANSFER RATE
                        Dim bypass As Boolean = False

                        Select Case ddlProjectI.SelectedValue
                            Case "2" 'Entergy
                            Case "3", "4" 'Ace or Pepco
                                bypass = True
                            Case "7" 'Qwest (Century Link) DISABLED 8/30/2012
                                bypass = True
                            Case "10", "11" 'Dallas
                                bypass = True
                            Case Else 'Duke, Qwest, Sprint (Progress and PSE&G are not yet defined.)
                                If True Then
                                    Select Case ddlProjectI.SelectedValue
                                        Case "6" 'Sprint
                                        Case Else
                                    End Select
                                End If
                        End Select
                        If Not bypass Then
                            Using db As New DbBaseSql(_im._connection)
                                Dim trislevel As Boolean = False
                                Dim datelist As New ArrayList
                                _im.setrollingdate()
                                Dim rd As Date = _im.rightpaystartdate()
                                While rd <= _im.rightpayenddate()
                                    datelist.Add(_im.day2string(rd))
                                    rd = rd.AddDays(1)
                                End While
                                'NEWCMS - Calls is called 'ACD Calls'
                                Dim sql As String = ""
                                Dim callsfield As String = ""
                                Dim xfrfield As String = ""
                                Select Case ddlProjectI.SelectedValue
                                    Case "2" 'Entergy
                                        callsfield = "Calls"
                                        xfrfield = "Ext. Xfers"
                                End Select
                                trislevel = True
                                sql = "SELECT D.emp_id AS ID,SUM(" & vv(xfrfield, "CAST({0} AS DECIMAL)") & ")/SUM(" & vv(callsfield, "CAST({0} AS DECIMAL)") & ") * 100.0 AS VALUE,A.user_id AS CSR FROM verticalheader" & locp() & " A " & _
                                    vj(callsfield, extra:=" AND dbo.qfloat( .val ) > 0 ") & _
                                    vj(xfrfield) & _
                                    " inner join user_id D on D.user_id=A.user_id AND IDTYPE='1' AND LOC_ID='" & ddlLocation.SelectedValue & "'" & _
                                    " WHERE filetype='CMS' AND recdate in (" & listofdates(datelist) & ") AND location='" & ddlLocation.SelectedValue & "' AND project='" & ddlProjectI.SelectedValue & "'" & _
                                    " GROUP BY D.emp_id,A.user_id"
                                Using dtsurrogate As DataTable = db.exec(sql)
                                    _im._labelline = "ID/R,Value/R"
                                    _im._wizard.InstallTableSurrogate(dtsurrogate, _im._labelline)
                                    For i As Integer = 0 To ddlIdType.Items.Count - 1
                                        If ddlIdType.Items(i).Text = "KRONOS" Then
                                            ddlIdType.SelectedIndex = i
                                            Exit For
                                        End If
                                    Next
                                    For i As Integer = 0 To ddlFileType.Items.Count - 1
                                        If ddlFileType.Items(i).Text = "0" Then
                                            ddlFileType.SelectedIndex = i
                                            Exit For
                                        End If
                                    Next
                                    cbIgnoreWarnings.Checked = True
                                    rbNormal.Checked = False
                                    rbAllowDuplicateDates.Checked = False
                                    rbReplaceDuplicateDates.Checked = True

                                    Dim foundkpi As Boolean = False

                                    For i As Integer = 0 To ddlKPI.Items.Count - 1
                                        If ddlKPI.Items(i).Text = "Transfer Rate" Then
                                            ddlKPI.SelectedIndex = i
                                            foundkpi = True
                                            Exit For
                                        End If
                                    Next
                                    If foundkpi Then
                                        _im._errcnt = 0
                                        _im.recorderror("Updating TRANSFER RATES...", errortype:=ImportErrorType.Info)
                                        _im._errcnt = 0
                                        Dim datehold As String = ""
                                        If trislevel Then
                                            datehold = tbDate.Text
                                            tbDate.Text = _im.day2string(Convert.ToDateTime(_im.rightpaystartdate()).AddDays(1)) 'This new value is to be stored on the FIRST MONDAY of the pay period.
                                        End If
                                        upload()
                                        If trislevel Then
                                            tbDate.Text = datehold
                                        End If
                                        _im._errcnt = 0
                                        _im.recorderror("...TRANSFER RATES Updated.", errortype:=ImportErrorType.Info)
                                        _im._wizard.ClearLabels()
                                    End If
                                End Using
                            End Using
                        End If

                        'PRODUCTIVITY
                        Using db As New DbBaseSql(_im._connection)
                            Dim doit As Boolean = True
                            Dim sql As String = ""
                            Dim trislevel As Boolean = False
                            Dim datelist As New ArrayList
                            _im.setrollingdate()
                            Dim rd As Date = _im.rightpaystartdate()
                            While rd <= _im.rightpayenddate()
                                datelist.Add(_im.day2string(rd))
                                rd = rd.AddDays(1)
                            End While

                            Select Case ddlProjectI.SelectedValue
                                Case "2" 'Entergy
                                    'IS
                                    trislevel = True
                                    'DONE: Entergy AHT
                                    sql = "SELECT E.emp_id AS ID,comp.aht AS AHT,comp.split AS SPLITSKILL,comp.calls AS CALLS FROM ("
                                    sql &= "Select final.UserID as UserID, final.split as split, final.tot_calls as calls, cast(case when final.tot_calls >0 then (final.tot_talk + final.tot_acw + final.tot_hold) / (final.tot_calls) else 0 end as decimal(7,2)) as AHT from ( select vh.user_id as UserID, split.val as Split, sum(dbo.qfloat(calls.val)) as tot_calls, sum(dbo.qfloat(avghold.val)*dbo.qfloat(calls.val)) as tot_hold, sum(dbo.qfloat(talk.val)*dbo.qfloat(calls.val)) as tot_talk, sum(dbo.qfloat(acw.val)*dbo.qfloat(calls.val)) as tot_acw from verticalheader" & locp() & " vh inner join verticalrecords" & locp() & " calls on vh.id=calls.id and vh.filetype='CMS' and calls.field='Calls' inner join verticalrecords" & locp() & " avghold on vh.id=avghold.id and vh.filetype='CMS' and avghold.field='Avg Hold Time' inner join verticalrecords" & locp() & " talk on vh.id=talk.id and vh.filetype='CMS' and talk.field='Avg ACD' inner join verticalrecords" & locp() & " acw on vh.id=acw.id and vh.filetype='CMS' and acw.field='Avg ACW' inner join verticalrecords" & locp() & " split on vh.id=split.id and vh.filetype='CMS' and split.field='Split~Skill' inner join usr us on vh.user_id=us.user_id where vh.project='" & ddlProjectI.SelectedValue & "' and convert(varchar(10),vh.recdate,101) in (" & listofdates(datelist) & ") group by vh.user_id, split.val) Final where final.tot_calls>0"
                                    sql &= ") COMP inner join user_id E on E.user_id=comp.UserID AND IDTYPE='1' AND LOC_ID='" & ddlLocation.SelectedValue & "'"
                            End Select

                            If doit Then
                                Using dtsurrogate As DataTable = db.exec(sql)
                                    _im._labelline = "ID/R,AHT/R,Split~Skill/R,Calls/R"
                                    _im._wizard.InstallTableSurrogate(dtsurrogate, _im._labelline)
                                    For i As Integer = 0 To ddlIdType.Items.Count - 1
                                        If ddlIdType.Items(i).Text = "KRONOS" Then
                                            ddlIdType.SelectedIndex = i
                                            Exit For
                                        End If
                                    Next
                                    For i As Integer = 0 To ddlFileType.Items.Count - 1
                                        If ddlFileType.Items(i).Text = "0" Then
                                            ddlFileType.SelectedIndex = i
                                            Exit For
                                        End If
                                    Next
                                    cbIgnoreWarnings.Checked = True
                                    rbNormal.Checked = False
                                    rbAllowDuplicateDates.Checked = True 'Changed to this since I'm using the wipeoutkpi routine below
                                    rbReplaceDuplicateDates.Checked = False

                                    Dim foundkpi As Boolean = False

                                    For i As Integer = 0 To ddlKPI.Items.Count - 1
                                        If ddlKPI.Items(i).Text = "AHT" Then '"AHT" was "Productivity"
                                            ddlKPI.SelectedIndex = i
                                            foundkpi = True
                                            Exit For
                                        End If
                                    Next
                                    If foundkpi Then
                                        ddlSubKPI.Items.Clear()
                                        Dim liU As New ListItem
                                        liU.Value = "#FIELD#"
                                        liU.Text = "<Map to field in import file.>"
                                        ddlSubKPI.Items.Add(liU)
                                        ddlSubKPI.SelectedIndex = 0
                                        _im._errcnt = 0
                                        _im.recorderror("Updating PRODUCTIVITY...", errortype:=ImportErrorType.Info)
                                        _im._errcnt = 0
                                        'TOOK OUT: _im._errorsfound = False
                                        Dim datehold As String = ""
                                        If trislevel Then
                                            datehold = tbDate.Text
                                            tbDate.Text = _im.day2string(Convert.ToDateTime(_im.rightpaystartdate()).AddDays(1)) 'This new value is to be stored on the FIRST MONDAY of the pay period.
                                        End If
                                        wipeoutkpi(ddlKPI.SelectedValue, ddlProjectI.SelectedValue, ddlLocation.SelectedValue, rightdate(), "SUB")
                                        wipeoutkpi(ddlKPI.SelectedValue, ddlProjectI.SelectedValue, ddlLocation.SelectedValue, rightdate(), "")
                                        upload()
                                        If trislevel Then
                                            tbDate.Text = datehold
                                        End If
                                        _im._errcnt = 0
                                        _im.recorderror("...PRODUCTIVITY Updated.", errortype:=ImportErrorType.Info)
                                        _im._wizard.ClearLabels()
                                    End If

                                End Using
                            End If
                        End Using
                        'UTILIZATION
                        _im._errcnt = 0
                        'TOOK OUT: _im._errorsfound = False
                        pumputilization(ddlProjectI.SelectedValue)
                    End If
                ElseIf ddlFileType.SelectedValue = "KRONOS" Then
                    If (Not _im._errorsfound) And ((Not _im._warningsfound) Or cbIgnoreWarnings.Checked) Then
                        Dim dtprojects As DataTable = Nothing
                        Using db As New DbBaseSql(_im._connection)
                            dtprojects = db.exec("SELECT DISTINCT project from verticalheader" & locp() & " where filetype='CMS' AND location='" & ddlLocation.SelectedValue & "'")
                        End Using
                        For Each row As DataRow In dtprojects.Rows
                            _im._errcnt = 0
                            pumputilization(row.Item(0).ToString.Trim)
                        Next
                    End If
                End If
            End If
            Using db As New DbBaseSql(_im._connection)
                Dim prj As String = "0"
                If ddlProjectI.SelectedValue IsNot Nothing AndAlso ddlProjectI.SelectedValue <> "" Then
                    prj = ddlProjectI.SelectedValue
                End If
                If prj.IndexOf(",") >= 0 Then prj = "0"
                Dim loc As String = "0"
                If ddlLocation.SelectedValue IsNot Nothing AndAlso ddlLocation.SelectedValue <> "" Then
                    loc = ddlLocation.SelectedValue
                End If
                If loc.IndexOf(",") >= 0 Then loc = "0"

                Dim kpi As String = ""
                If ddlKPI.SelectedValue IsNot Nothing AndAlso Session("filetype") = "0" Then
                    kpi = ddlKPI.SelectedItem.Text & " - "
                End If
                Dim disposition As String
                If _im._errorsfound Then
                    disposition = "FAILED"
                ElseIf _im._warningsfound Then
                    disposition = "Succeeded w/Warnings"
                Else
                    disposition = "Success"
                End If

                Dim dtnum As DataTable = db.Insert("INSERT INTO ImportLogHeader (disposition,location,project,filetype,filedate,filename,entdt,entby)" & _
              " VALUES ('" & disposition & "','" & loc & "','" & prj & "','" & kpi & Session("filetype") & "','" & rightdate() & "','" & db.reap(lblFilename.Text) & "','" & _im._rightnowtime.ToString & "','" & Context.User.Identity.Name & "'); SELECT SCOPE_IDENTITY();")
                Dim myid As Integer = dtnum.Rows(0).Item(0)

                If _im._errorsfound Or _im._warningsfound Then
                    Dim bli As String = ""
                    If (Not _im._errorsfound) And (_im._warningsfound And (cbIgnoreWarnings.Checked)) Then
                        bli &= "<p>"
                        If ddlFileType.SelectedValue = "RC5" Then
                            bli &= "<br /><a href=""RC5output.ashx?date=" & tbDate.Text & """>DOWNLOAD RC5 FILE for " & tbDate.Text & "</a> &lt;- click to download your file (it may take a few minutes to process).<br /><br />"
                        End If
                        If ddlFileType.SelectedValue = "TC5" Then
                            bli &= "<br /><a href=""RC5output.ashx?date=" & tbDate.Text & "&type=TC5"">DOWNLOAD TC5 FILE for " & tbDate.Text & "</a> &lt;- click to download your file (it may take a few minutes to process).<br /><br />"
                        End If

                        bli &= "File&nbsp;" & lblFilename.Text & "&nbsp;was imported,<br />but the following Warnings were found."
                    Else
                        bli &= "File&nbsp;" & lblFilename.Text & "&nbsp;was NOT IMPORTED,<br />the following Errors/Warnings were found."
                    End If
                    bli &= "<input type=""hidden"" id=""erocnt"" name=""erocnt"" value=""" & _im._errorlist.Count.ToString & """/>"
                    bli &= " If you've fixed the problem, please select 'Ignore'.</p>"
                    bli &= "<table><tr><td style=""color:black;font-weight:bold;"">Ignore</td><td style=""color:black;font-weight:bold;"">Save</td><td>&nbsp;</td></tr>"
                    bli &= "<tr><td><input type=""button"" value=""All"" onclick=""var ln=parseInt(document.getElementById('erocnt').value);var i;for(i=0;i<ln;i++)document.getElementById('eroi'+i).checked=true;""/></td><td><input type=""button"" value=""All"" onclick=""var ln=parseInt(document.getElementById('erocnt').value);var i;for(i=0;i<ln;i++)document.getElementById('eros'+i).checked=true;""/></td></tr>"
                    Dim cnt As Integer = 0
                    Session("errorlist") = _im._errorlist


                    For Each el As error_line In _im._errorlist
                        bli &= "<tr><td><input id=""eroi" & cnt.ToString & """ name=""ero" & cnt.ToString & """ type=""radio"" value=""ignore""/></td><td><input id=""eros" & cnt.ToString & """ name=""ero" & cnt.ToString & """ type=""radio"" value=""save""/></td><td>" & el._text & _
                            "</td></tr>"

                        db.Update("INSERT INTO ImportLogRecords (hdrid,errortype,errormsg)" & _
                                          " VALUES ('" & myid.ToString & "','" & el._errortype.ToString & "','" & db.reap(el._text) & "')")
                        cnt += 1
                    Next

                    bli &= "<tr><td colspan=""3""><input type=""submit"" name=""SubmitErrors"" value=""Submit Errors"" onclick=""var i;var ln=parseInt(document.getElementById('erocnt').value);for(i=0;i<ln;i++){if(!(document.getElementById('eroi'+i).checked||document.getElementById('eros'+i).checked)){alert('Please choose to Ignore or Save each Warning/Error before continuing');return false;}}return true;""/></td></tr>"
                    bli &= "</table>"
                    ImportMsgdiv.InnerHtml = ""
                    If _im._errbuf <> "" Then ImportMsgdiv.InnerHtml &= "<p style=""margin-top:20px;font-weight:bold;"">Processing:</p><ul>" & _im._errbuf & "</ul>"
                    ImportMsgdiv.InnerHtml &= bli
                    ImportMsgdiv.Style.Add("display", "inline")
                    btndiv.Style.Add("display", "none")
                    importwrapper.Style.Add("display", "none")
                    encdiv.InnerHtml = ""
                    '_im._wizard.Start()
                Else
                    Dim bli As String = ""
                    bli = "<p style=""color:black;font-weight:bold;margin-top:30px;"">" & lblFilename.Text & " successfully imported.<br /><br />"
                    If ddlFileType.SelectedValue <> "RC5" AndAlso ddlFileType.SelectedValue <> "TC5" Then
                        bli &= "<a href=""import.aspx"">Import Another File</a>"
                    ElseIf ddlFileType.SelectedValue = "RC5" Then
                        bli &= "<a href=""RC5output.ashx?date=" & tbDate.Text & """>DOWNLOAD RC5 FILE for " & tbDate.Text & "</a> &lt;- click to download your file (it may take a few minutes to process)."
                    ElseIf ddlFileType.SelectedValue = "TC5" Then
                        bli &= "<a href=""RC5output.ashx?date=" & tbDate.Text & "&type=TC5"">DOWNLOAD TC5 FILE for " & tbDate.Text & "</a> &lt;- click to download your file (it may take a few minutes to process)."
                    End If
                    bli &= "</p>"
                    ImportMsgdiv.InnerHtml = bli
                    If _im._errbuf <> "" Then ImportMsgdiv.InnerHtml &= "<p style=""margin-top:20px;font-weight:bold;"">Processing:</p><ul>" & _im._errbuf & "</ul>"
                    ImportMsgdiv.Style.Add("display", "inline")
                    btndiv.Style.Add("display", "none")
                    importwrapper.Style.Add("display", "none")
                End If
            End Using
        End If
    End Sub

    Private Sub ddlFileType_PreRender(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlFileType.PreRender
        ddlFileType.Attributes.Add("onchange", "if (this.options[this.selectedIndex].value == 'DELETE'){alert('The DELETE KPI filetype allows you to remove all records of a given Date/Location/Project/KPI.\nEnter all 4 of these values and a button will appear.\n(For expert use only).');} else if (this.options[this.selectedIndex].value == 'DELETECMS'){alert('The DELETE CMS filetype allows you to remove the CMS Import records for a given Date/Location/Project.\nEnter all 3 of these values and a button will appear.\n(For expert use only).');} else if (this.options[this.selectedIndex].value == 'DELETEKRONOS'){alert('The DELETE KRONOS filetype allows you to remove the KRONOS Import records for a given Date/Location OR Pay Period/Location.\nEnter both of these values and buttons will appear.\n(For expert use only).');};")
    End Sub

    Private Sub ddlProjectI_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlProjectI.SelectedIndexChanged
        ddlProjectISelectedIndexChanged()
        wizardstartcheck()
    End Sub

    Private Sub ddlSubtype_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlSubtype.SelectedIndexChanged
        wizardstartcheck()
    End Sub

    Private Sub tbDate_TextChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles tbDate.TextChanged
        wizardstartcheck()
    End Sub

    Private Sub cbSkipUpload_CheckedChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles cbSkipUpload.CheckedChanged
        wizardstartcheck()
    End Sub

    Private Sub ddlProjectISelectedIndexChanged()
        Using db As New DbBaseSql(_im._connection)
            ddlKPI.DataValueField = "MQF#"
            ddlKPI.DataTextField = "TXT"
            ddlKPI.Items.Clear()
            Dim li As New ListItem
            li.Value = ""
            If ddlProjectI.SelectedValue <> "" Then
                li.Text = "-select-"
            Else
                li.Text = ""
            End If
            ddlKPI.Items.Add(li)
            ddlKPI.SelectedIndex = 0

            ddlKPI.AppendDataBoundItems = True
            If (ddlProjectI.SelectedValue <> "") Then
                Using dt As DataTable = db.exec("SELECT MQF#,TXT FROM dbo.KPI_MQF WHERE LINE#='1' AND LEVEL#='1' AND PROJECT_ID in (" & ddlProjectI.SelectedValue & ") ORDER BY TXT ASC")
                    ddlKPI.DataSource = dt
                    ddlKPI.DataBind()
                End Using
            End If
            If ddlKPI.Items.Count > 1 Then
                Dim liU As New ListItem
                liU.Value = "#FIELD#"
                liU.Text = "<Map to field in import file.>"
                ddlKPI.Items.Add(liU)
            End If
        End Using
    End Sub


    Private Sub wizardstartcheck() 'And Delete button display check
        encdiv.InnerHtml = ""

        ddDELETE.Style.Add("display", "none")
        dtDELETE.Style.Add("display", "none")
        ddDELETECMS.Style.Add("display", "none")
        dtDELETECMS.Style.Add("display", "none")
        ddDELETEKRONOS.Style.Add("display", "none")
        dtDELETEKRONOS.Style.Add("display", "none")
        ddSubtype.Style.Add("display", "none")
        dtSubtype.Style.Add("display", "none")
        btnDelete.Visible = False
        btnDeleteCMS.Visible = False
        btnDeleteCMSPayperiod.Visible = False
        btnDeleteKronos.Visible = False
        btnDeleteKronosPayperiod.Visible = False
        ddSkip.Style.Add("display", "none")
        dtSkip.Style.Add("display", "none")
        setskipdisplay(False)
        dlControls.Style.Add("display", "inline")
        cbMult100.Visible = False
        'cbSplitWarn.Visible = False
        cbCalcUtilization.Visible = True
        'divHistories.Style.Add("display", "inline")

        If ddlKPI.SelectedValue IsNot Nothing AndAlso ddlKPI.SelectedItem.Text.Trim = "AHT" Then '"AHT" was "Productivity"
            ddSubKPI.Style.Add("display", "inline")
            dtSubKPI.Style.Add("display", "inline")
        End If

        If ddlFileType.SelectedValue = "0" Then
            cbMult100.Visible = True
        Else
            cbMult100.Checked = False
        End If

        Try
            If True Then 'Note: Should be available always now.  ddlFileType.SelectedValue = "CMS" Or ddlFileType.SelectedValue = "KRONOS" Or ddlFileType.SelectedValue = "$PC" Then
                cbSkipUpload.Visible = True
            Else
                cbSkipUpload.Visible = False
                cbSkipUpload.Checked = False
            End If
            If ddlFileType.SelectedValue = "CMS" Then
                cbCalcUtilization.Visible = True
                cbCalcUtilization.Checked = False
            ElseIf ddlFileType.SelectedValue = "KRONOS" Then
                cbCalcUtilization.Visible = True
                cbCalcUtilization.Checked = True
            Else
                cbCalcUtilization.Visible = False
            End If
            If ddlFileType.SelectedValue = "KRONOS" And ddlLocation.SelectedValue = "1" Then
                cbProgressKronos.Visible = True
            Else
                cbProgressKronos.Visible = False
                cbProgressKronos.Checked = False
            End If
        Catch ex As Exception
            cbSkipUpload.Visible = False
            cbSkipUpload.Checked = False
        End Try
        If ddlFileType.SelectedValue = "CMS" Then
            If ddlProjectI.SelectedValue = "1" Then 'Progress finds by KRONOS
                For i As Integer = 0 To ddlIdType.Items.Count - 1
                    If ddlIdType.Items(i).Text = "KRONOS" Then 'Clue
                        ddlIdType.SelectedIndex = i
                        Exit For
                    End If
                Next
            Else
                For i As Integer = 0 To ddlIdType.Items.Count - 1
                    If ddlIdType.Items(i).Text = "Name" Then 'Clue
                        ddlIdType.SelectedIndex = i
                        Exit For
                    End If
                Next
            End If
        End If

        If ddlFileType.SelectedValue = "CMS" AndAlso ddlProjectI.SelectedValue = "10-OLD" Then
            ddSubtype.Style.Add("display", "block")
            dtSubtype.Style.Add("display", "block")
            If ddlSubtype.Items.Count = 0 Then
                Using db As New DbBaseSql(_im._connection)
                    Using dt As DataTable = db.exec("SELECT SubTypeID,SubTypeDesc FROM dbo.SubType WHERE Project_ID='" & ddlProjectI.SelectedValue.Trim & "' ORDER BY SubTypeDesc ASC")
                        Dim li As New ListItem
                        li.Value = ""
                        li.Text = "-select-"
                        ddlSubtype.Items.Add(li)
                        ddlSubtype.AppendDataBoundItems = True
                        ddlSubtype.AppendDataBoundItems = True
                        ddlSubtype.DataValueField = "SubTypeID"
                        ddlSubtype.DataTextField = "SubTypeDesc"
                        ddlSubtype.DataSource = dt
                        ddlSubtype.DataBind()
                    End Using
                End Using
            End If

        End If

        Using db As New DbBaseSql(_im._connection)
            Dim str As String = "N"
            If cbScoreUpdate.Checked Then str = "Y"
            Using dt As DataTable = db.GetDataTable("Select * from GlobalFlags")
                If dt.Rows(0).Item("ScoreUpdate").ToString.Trim = "N" Then
                    cbScoreUpdate.Checked = False
                Else
                    cbScoreUpdate.Checked = True
                End If
            End Using
        End Using
        cbSkipUpload.Enabled = True
        Using db2 As New DbBaseSql(_im._connection2)
            Using dt As DataTable = db2.exec("SELECT verticals from DAS where filetype='" & ddlFileType.SelectedValue & "' and client='" & client & "'")
                If dt.Rows.Count > 0 Then
                    If dt.Rows(0).Item("verticals") = "none" Then
                        cbSkipUpload.Checked = True
                        cbSkipUpload.Enabled = False
                    End If
                End If
            End Using
        End Using
        'ADDED this first condition 4/22/2013
        If (ddlFileType.SelectedValue <> "" And ddlFileType.SelectedValue <> "0") AndAlso cbSkipUpload.Checked Then
            If ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso ddlProjectI IsNot Nothing _
                AndAlso ddlProjectI.SelectedIndex > 0 _
                AndAlso tbDate.Text.Trim <> "" Then
                ddSkip.Style.Add("display", "inline")
                dtSkip.Style.Add("display", "inline")
                setskipdisplay(True)
            End If
        ElseIf (ddlFileType.SelectedValue = "CMS" Or ddlFileType.SelectedValue = "KRONOS" Or ddlFileType.SelectedValue = "$PC") AndAlso cbSkipUpload.Checked Then
            If ddlFileType.SelectedValue = "CMS" AndAlso ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso ddlProjectI IsNot Nothing _
                AndAlso ddlProjectI.SelectedIndex > 0 _
                AndAlso tbDate.Text.Trim <> "" Then
                ddSkip.Style.Add("display", "inline")
                dtSkip.Style.Add("display", "inline")
                setskipdisplay(True)
            End If
            If ddlFileType.SelectedValue = "KRONOS" AndAlso ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso tbDate.Text.Trim <> "" Then
                ddSkip.Style.Add("display", "inline")
                dtSkip.Style.Add("display", "inline")
                setskipdisplay(True)
            End If
            If ddlFileType.SelectedValue = "$PC" AndAlso tbDate.Text.Trim <> "" Then
                ddSkip.Style.Add("display", "inline")
                dtSkip.Style.Add("display", "inline")
                setskipdisplay(True)
            End If
            ddKPI.Style.Add("display", "none")
            dtKPI.Style.Add("display", "none")
            dlControls.Style.Add("display", "none")
            ddSubKPI.Style.Add("display", "none")
            dtSubKPI.Style.Add("display", "none")
        ElseIf ddlFileType.SelectedValue = "DELETE" Then
            If ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso ddlProjectI IsNot Nothing _
                AndAlso ddlProjectI.SelectedIndex > 0 AndAlso ddlKPI IsNot Nothing AndAlso ddlKPI.SelectedIndex > 0 _
                AndAlso tbDate.Text.Trim <> "" Then
                ddDELETE.Style.Add("display", "inline")
                dtDELETE.Style.Add("display", "inline")
                btnDelete.Visible = True
            End If
            dlControls.Style.Add("display", "none")
            ddSubKPI.Style.Add("display", "none")
            dtSubKPI.Style.Add("display", "none")
        ElseIf ddlFileType.SelectedValue = "DELETECMS" Then
            If ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso ddlProjectI IsNot Nothing _
                AndAlso ddlProjectI.SelectedIndex > 0 _
                AndAlso tbDate.Text.Trim <> "" Then
                ddDELETECMS.Style.Add("display", "inline")
                dtDELETECMS.Style.Add("display", "inline")
                btnDeleteCMS.Visible = True
                btnDeleteCMSPayperiod.Visible = True
            End If
            ddKPI.Style.Add("display", "none")
            dtKPI.Style.Add("display", "none")
            dlControls.Style.Add("display", "none")
            ddSubKPI.Style.Add("display", "none")
            dtSubKPI.Style.Add("display", "none")
        ElseIf ddlFileType.SelectedValue = "DELETEKRONOS" Then
            If ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso tbDate.Text.Trim <> "" Then
                ddDELETEKRONOS.Style.Add("display", "inline")
                dtDELETEKRONOS.Style.Add("display", "inline")
                btnDeleteKronos.Visible = True
                btnDeleteKronosPayperiod.Visible = True
            End If
            ddProject.Style.Add("display", "none")
            dtProject.Style.Add("display", "none")
            dtKPI.Style.Add("display", "none")
            ddKPI.Style.Add("display", "none")
            dtKPI.Style.Add("display", "none")
            dlControls.Style.Add("display", "none")
            ddSubKPI.Style.Add("display", "none")
            dtSubKPI.Style.Add("display", "none")
        ElseIf ddlFileType.SelectedValue = "RC5" OrElse ddlFileType.SelectedValue = "TC5" Then
            dlControls.Style.Add("display", "none")
        End If
        If ddlFileType.SelectedValue = "CMS" Then
            If ddlProjectI.SelectedValue = "10-OLD" Then
                cbSkipUpload.Checked = False 'SPECIAL CASE - BECAUSE OF THE SPLIT SPEC, YOU HAVE TO RE-UPLOAD (NO FAKES).
                cbSkipUpload.Visible = False
                setskipdisplay(False)
            Else
                cbSkipUpload.Visible = True
            End If
        End If
        'If tbDate.Text.Trim <> "" AndAlso (ddlLocation IsNot Nothing AndAlso ((ddlFileType.SelectedValue = "$PC") OrElse (ddlLocation.SelectedIndex > 0)) _
        '        AndAlso ddlIdType IsNot Nothing AndAlso ddlIdType.SelectedIndex > 0 AndAlso _
        '        (((ddlFileType.SelectedValue = "KRONOS") OrElse (ddlFileType.SelectedValue = "RC5") OrElse (ddlFileType.SelectedValue = "TC5")) OrElse _
        '        (((ddlFileType.SelectedValue = "CMS") OrElse (ddlFileType.SelectedValue = "$PC")) AndAlso ddlProjectI.SelectedIndex > 0 AndAlso (ddlProjectI.SelectedValue <> "10-OLD" OrElse ddlSubtype.SelectedIndex > 0)) OrElse _
        '        (ddlProjectI IsNot Nothing _
        '        AndAlso ddlProjectI.SelectedIndex > 0 AndAlso ddlKPI IsNot Nothing AndAlso ddlKPI.SelectedIndex > 0 _
        '        AndAlso ((ddlSubKPI.Items.Count = 0) OrElse (ddlSubKPI.SelectedIndex > 0))))) Then
        If tbDate.Text.Trim <> "" _
                AndAlso ddlFileType IsNot Nothing AndAlso ddlFileType.SelectedIndex > 0 _
                AndAlso ddlIdType IsNot Nothing AndAlso ddlIdType.SelectedIndex > 0 _
                AndAlso ddlProjectI IsNot Nothing AndAlso ddlProjectI.SelectedIndex > 0 _
                AndAlso ddlLocation IsNot Nothing AndAlso ddlLocation.SelectedIndex > 0 _
                AndAlso (ddlFileType.SelectedValue <> "0" OrElse (ddlKPI IsNot Nothing AndAlso ddlKPI.SelectedIndex > 0)) _
                Then
            If _im._wizard Is Nothing Then _im._wizard = New jgWizard_UploadListFile(Me.Page, _im._labelline, OuterDiv:=encdiv)
            _im._wizard.Start()
        End If
    End Sub

    Private Sub ddlLocation_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlLocation.SelectedIndexChanged
        If ddlLocation.SelectedValue = "6" Then 'Dallas has multiple splits in the same file.
            'cbSplitWarn.Checked = True
        End If
        wizardstartcheck()
    End Sub

    Private Sub ddlFileType_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlFileType.SelectedIndexChanged
        Select Case ddlFileType.SelectedValue
            '    Case "RC5", "TC5"
            '        ddlProjectI.SelectedIndex = 0
            '        ddlKPI.SelectedIndex = 0
            '        ddlSubKPI.Items.Clear()
            '        dtProject.Style.Add("display", "none")
            '        ddProject.Style.Add("display", "none")
            '        ddIdType.Style.Add("display", "block")
            '        dtIdType.Style.Add("display", "block")
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "none")
            '        ddKPI.Style.Add("display", "none")
            '        dtSubKPI.Style.Add("display", "none")
            '        ddSubKPI.Style.Add("display", "none")
            '        For i As Integer = 0 To ddlIdType.Items.Count - 1
            '            If ddlIdType.Items(i).Text = "KRONOS" Then
            '                ddlIdType.SelectedIndex = i
            '                ddIdType.Style.Add("display", "none")
            '                dtIdType.Style.Add("display", "none")
            '                Exit For
            '            End If
            '        Next
            '        'By convention, always set the location to "1" so the RC5 will go in the verticalheader1 table.
            '        For i As Integer = 0 To ddlLocation.Items.Count - 1
            '            If ddlLocation.Items(i).Value = "1" Then
            '                ddlLocation.SelectedIndex = i
            '                ddLocation.Style.Add("display", "none")
            '                dtLocation.Style.Add("display", "none")
            '                Exit For
            '            End If
            '        Next
            '    Case "$PC"
            '        ddlKPI.SelectedIndex = 0
            '        ddlSubKPI.Items.Clear()
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtProject.Style.Add("display", "block")
            '        ddProject.Style.Add("display", "block")
            '        ddIdType.Style.Add("display", "block")
            '        dtIdType.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "none")
            '        ddKPI.Style.Add("display", "none")
            '        dtSubKPI.Style.Add("display", "none")
            '        ddSubKPI.Style.Add("display", "none")

            '        For i As Integer = 0 To ddlLocation.Items.Count - 1
            '            If ddlLocation.Items(i).Value = "" Then
            '                ddlLocation.SelectedIndex = i
            '                ddLocation.Style.Add("display", "none")
            '                dtLocation.Style.Add("display", "none")
            '                Exit For
            '            End If
            '        Next
            '        For i As Integer = 0 To ddlIdType.Items.Count - 1
            '            If ddlIdType.Items(i).Text = "Name" Then
            '                ddlIdType.SelectedIndex = i
            '                ddIdType.Style.Add("display", "block")
            '                dtIdType.Style.Add("display", "block")
            '                Exit For
            '            End If
            '        Next
            '        For i As Integer = 0 To ddlProjectI.Items.Count - 1
            '            If ddlProjectI.Items(i).Value = "6" Then
            '                ddlProjectI.SelectedIndex = i
            '                ddProject.Style.Add("display", "block")
            '                dtProject.Style.Add("display", "block")
            '                ddlProjectI_SelectedIndexChanged(Nothing, Nothing)
            '                Exit For
            '            End If
            '        Next
            '    Case "KRONOS"
            '        ddlProjectI.SelectedIndex = 0
            '        ddlKPI.SelectedIndex = 0
            '        ddlSubKPI.Items.Clear()
            '        dtProject.Style.Add("display", "none")
            '        ddProject.Style.Add("display", "none")
            '        ddIdType.Style.Add("display", "block")
            '        dtIdType.Style.Add("display", "block")
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "none")
            '        ddKPI.Style.Add("display", "none")
            '        dtSubKPI.Style.Add("display", "none")
            '        ddSubKPI.Style.Add("display", "none")
            '        For i As Integer = 0 To ddlIdType.Items.Count - 1
            '            If ddlIdType.Items(i).Text = "KRONOS" Then
            '                ddlIdType.SelectedIndex = i
            '                ddIdType.Style.Add("display", "none")
            '                dtIdType.Style.Add("display", "none")
            '                Exit For
            '            End If
            '        Next
            '    Case "CMS"
            '        ddlKPI.SelectedIndex = 0
            '        ddlSubKPI.Items.Clear()
            '        dtProject.Style.Add("display", "block")
            '        ddProject.Style.Add("display", "block")
            '        ddIdType.Style.Add("display", "block")
            '        dtIdType.Style.Add("display", "block")
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "none")
            '        ddKPI.Style.Add("display", "none")
            '        dtSubKPI.Style.Add("display", "none")
            '        ddSubKPI.Style.Add("display", "none")

            '        ddIdType.Style.Add("display", "none")
            '        dtIdType.Style.Add("display", "none")
            '    Case "DELETE"
            '        dtProject.Style.Add("display", "block")
            '        ddProject.Style.Add("display", "block")
            '        ddIdType.Style.Add("display", "none")
            '        dtIdType.Style.Add("display", "none")
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "block")
            '        ddKPI.Style.Add("display", "block")
            '        ddlKPIchangeindex()
            '    Case "DELETECMS"
            '        dtProject.Style.Add("display", "block")
            '        ddProject.Style.Add("display", "block")
            '        ddIdType.Style.Add("display", "none")
            '        dtIdType.Style.Add("display", "none")
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "none")
            '        ddKPI.Style.Add("display", "none")
            '        dtSubKPI.Style.Add("display", "none")
            '        ddSubKPI.Style.Add("display", "none")
            '    Case "DELETEKRONOS"
            '        dtProject.Style.Add("display", "none")
            '        ddProject.Style.Add("display", "none")
            '        ddIdType.Style.Add("display", "none")
            '        dtIdType.Style.Add("display", "none")
            '        ddLocation.Style.Add("display", "block")
            '        dtLocation.Style.Add("display", "block")
            '        dtKPI.Style.Add("display", "none")
            '        ddKPI.Style.Add("display", "none")
            '        dtSubKPI.Style.Add("display", "none")
            '        ddSubKPI.Style.Add("display", "none")
            Case "0"
                dtProject.Style.Add("display", "block")
                ddProject.Style.Add("display", "block")
                ddIdType.Style.Add("display", "block")
                dtIdType.Style.Add("display", "block")
                ddLocation.Style.Add("display", "block")
                dtLocation.Style.Add("display", "block")
                dtKPI.Style.Add("display", "block")
                ddKPI.Style.Add("display", "block")
                ddlKPIchangeindex()
            Case Else
                dtProject.Style.Add("display", "block")
                ddProject.Style.Add("display", "block")
                ddIdType.Style.Add("display", "block")
                dtIdType.Style.Add("display", "block")
                ddLocation.Style.Add("display", "block")
                dtLocation.Style.Add("display", "block")
                dtKPI.Style.Add("display", "none")
                ddKPI.Style.Add("display", "none")
                dtSubKPI.Style.Add("display", "none")
                ddSubKPI.Style.Add("display", "none")
                ddlKPIchangeindex()
                Using db2 As New DbBaseSql(_im._connection2)
                    Using dt As DataTable = db2.exec("SELECT id,defempid from DAS where filetype='" & ddlFileType.SelectedValue & "' and client='" & client & "'")
                        For Each row As DataRow In dt.Rows
                            ddlIdType.SelectedValue = row("defempid").ToString
                            Using dtkd As DataTable = db2.exec("SELECT idkpi from kpi_das where iddas='" & row("id") & "'")
                                Dim kpilst As String = ""
                                For Each rowkd As DataRow In dtkd.Rows
                                    If (kpilst <> "") Then kpilst &= ","
                                    kpilst &= rowkd("idkpi").ToString
                                Next
                                Dim sql As String = "SELECT pj.projectid as [id],pj.projectdesc as [desc] from kpi_mqf mq inner join project pj on pj.projectid=mq.project_id where line#=1 and level#=1 and mqf# in (" & kpilst & ") group by pj.projectid,pj.projectdesc order by projectdesc asc"
                                combine_ddl_values(sql, ddlProjectI)
                                If (ddlProjectI.SelectedValue.ToString.Trim <> "") Then
                                    sql = "SELECT lc.loc_id as [id],lc.LOC_NAME as [desc] from GRP gp inner join LOC lc on lc.LOC_ID = gp.LOC_ID inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID  where lc.STATUS='A' and pj.ProjectID in (" & ddlProjectI.SelectedValue.ToString & ") group by lc.loc_id,lc.loc_name order by lc.loc_name asc"
                                    combine_ddl_values(sql, ddlLocation)
                                End If
                            End Using
                        Next
                    End Using
                End Using
        End Select
        wizardstartcheck()
    End Sub

    Private Sub ddlIdType_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlIdType.SelectedIndexChanged
        wizardstartcheck()
    End Sub

    Private Sub ddlKPI_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlKPI.SelectedIndexChanged
        ddlKPIchangeindex()
        wizardstartcheck()
    End Sub

    Private Sub combine_ddl_values(sql As String, ByRef ddl As DropDownList)
        Using db As New DbBaseSql(_im._connection)
            Dim prtext As String = ""
            Dim prval As String = ""
            Try
                Using dtp As DataTable = db.exec(sql)
                    For Each rowp As DataRow In dtp.Rows
                        If (prval <> "") Then
                            prval &= ","
                            prtext &= "/"
                        End If
                        prval &= rowp("id")
                        prtext &= rowp("desc")
                    Next
                End Using
            Catch ex As Exception

            End Try

            'Added 11/23/2014 (Initialize and trap errors to allow for N/A situations (of which Roster for Nexxlinx is one).
            'Modified 12/11/2014 to not include "N/A" if there is another project.
            If prval = "" Then
                prtext = "N/A"
                prval = "0"
            End If

            Dim found As Boolean = False
            For i As Integer = 0 To ddl.Items.Count - 1
                If ddl.Items(i).Text = prtext Then
                    ddl.SelectedIndex = i
                    found = True
                    Exit For
                End If
            Next
            If Not found Then
                Dim li As New ListItem
                li.Value = prval
                li.Text = prtext
                ddl.Items.Add(li)
                ddl.SelectedIndex = ddl.Items.Count - 1
            End If
        End Using
    End Sub

    Private Sub ddlKPIchangeindex()
        'DONE: HERE IT IS!  It flags on the NAME "AHT" to know that it's a subkpi.
        Using db As New DbBaseSql(_im._connection)
            Dim issubkpi As Boolean = False
            If ddlKPI.SelectedValue IsNot Nothing AndAlso ddlKPI.SelectedValue.Trim <> "" AndAlso ddlKPI.SelectedValue.Trim <> "#FIELD#" Then
                Using dts As DataTable = db.exec("SELECT count(*) FROM kpi_mqf k inner join subtype s on s.kpi_id=k.mqf# where k.line#=1 and k.level#=1 and k.mqf#='" & ddlKPI.SelectedValue.Trim & "' and s.project_id='" & ddlProjectI.SelectedValue.Trim & "'")
                    If dts.Rows(0).Item(0) > 0 Then
                        issubkpi = True
                    End If
                End Using
            End If
            If issubkpi Then 'ddlKPI.SelectedValue IsNot Nothing AndAlso (ddlKPI.SelectedItem.Text.Trim = "AHT") Then '"AHT" was "Productivity"
                'TODO: When subranges are implemented, you'll need this: ((ddlKPI.SelectedItem.Text.Trim = "AHT") OrElse (ddlProjectI.SelectedValue = "10" AndAlso (ddlKPI.SelectedItem.Text.Trim = "ACW" OrElse ddlKPI.SelectedItem.Text.Trim = "Collections"))) 
                dtSubKPI.Style.Add("display", "block")
                ddSubKPI.Style.Add("display", "block")
                ddlSubKPI.Items.Clear()
                Dim li As New ListItem
                li.Value = ""
                li.Text = "-select-"
                ddlSubKPI.Items.Add(li)
                Using dt As DataTable = db.exec("SELECT SubTypeID,SubTypeDesc FROM dbo.SubType WHERE Project_ID='" & ddlProjectI.SelectedValue.Trim & "' AND KPI_ID='" & ddlKPI.SelectedValue.Trim & "' ORDER BY SubTypeDesc ASC")
                    ddlSubKPI.AppendDataBoundItems = True
                    ddlSubKPI.DataValueField = "SubTypeID"
                    ddlSubKPI.DataTextField = "SubTypeDesc"
                    ddlSubKPI.DataSource = dt
                    ddlSubKPI.DataBind()
                End Using
                If ddlSubKPI.Items.Count > 1 Then
                    Dim liU As New ListItem
                    liU.Value = "#FIELD#"
                    liU.Text = "<Map to field in import file.>"
                    ddlSubKPI.Items.Add(liU)
                End If
            Else
                dtSubKPI.Style.Add("display", "none")
                ddSubKPI.Style.Add("display", "none")
                ddlSubKPI.Items.Clear()
            End If
        End Using
    End Sub


    Private Sub ddlSubKPI_SelectedIndexChanged(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles ddlSubKPI.SelectedIndexChanged
        wizardstartcheck()
    End Sub

    Private Sub pumputilization(ByVal project As String)

        For i As Integer = 0 To ddlProjectI.Items.Count - 1
            If ddlProjectI.Items(i).Value = project Then
                ddlProjectI.SelectedIndex = i
                Exit For
            End If
        Next
        Using db As New DbBaseSql(_im._connection)
            _im.setrollingdate()

            Dim sql As String = ""
            Dim densql As String = ""
            Dim bypass As Boolean = False
            'New utilization which doesn't include days where not both a cms and a kronos
            Dim datelist As New ArrayList
            If False Then 'This section adds ONLY MATCHING dates with CMS/KRONOS.
                Using dtcms As DataTable = db.exec("select distinct recdate from verticalheader" & locp() & " where recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and filetype='CMS' and project='" & ddlProjectI.SelectedValue & "' order by recdate asc")
                    Using dtkronos As DataTable = db.exec("select distinct recdate from verticalheader" & locp() & " where recdate>='" & _im.rightpaystartdate() & "' and recdate<='" & _im.rightpayenddate() & "' and filetype='KRONOS' order by recdate asc")
                        For Each rowcms As DataRow In dtcms.Rows
                            For Each rowkronos As DataRow In dtkronos.Rows
                                If rowcms("recdate") = rowkronos("recdate") Then
                                    Dim d As Date = rowcms("recdate")
                                    datelist.Add(_im.day2string(d))
                                    Exit For
                                End If
                            Next
                        Next
                    End Using
                End Using
            Else 'This section adds ALL DATES FOR THE PAYPERIOD.
                Dim rd As Date = _im.rightpaystartdate()
                While rd <= _im.rightpayenddate()
                    datelist.Add(_im.day2string(rd))
                    rd = rd.AddDays(1)
                End While
            End If

            If datelist.Count <= 0 Then bypass = True

            Select Case ddlProjectI.SelectedValue
                Case "2" 'Entergy as of 8/8/11
                    'Utilization MORPH 12/08/2011
                    sql = "select emp_id,UTILIZATION from ( Select final.emp_id," & _
                        " cast(case when final.kronos_secs>0" & _
                        " then ((final.kronos_Secs - (case when final.kronos_secs >= (final.staffed - final.lunch)" & _
                        " then final.kronos_secs - (final.staffed - final.lunch)" & _
                        " else 0 end)" & _
                        " - final.breakaux" & _
                        " - final.meet_coach" & _
                        " )" & _
                        " / final.kronos_secs)*100" & _
                        " else 0 end as decimal(7,2)) as UTILIZATION" & _
                        " from (" & _
                        " select ui.emp_id as emp_id," & _
                        " sum(dbo.qfloat(regular.val))+sum(dbo.qfloat(overtime.val)) as KRONOS_Hrs," & _
                        " (sum(dbo.qfloat(regular.val))+sum(dbo.qfloat(overtime.val)))*3600 as KRONOS_Secs," & _
                        " sum(dbo.qfloat(staffed.val)) as staffed," & _
                        " sum(dbo.qfloat(lunch.val)) as lunch," & _
                        " sum(dbo.qfloat(breakaux.val)) as breakaux," & _
                        " sum(dbo.qfloat(meetcoach.val)) as meet_coach" & _
                        " from verticalheader" & locp() & " vh left outer join verticalrecords" & locp() & " regular on vh.id=regular.id and vh.filetype='KRONOS' and regular.field='Regular'" & _
                        " left outer join verticalrecords" & locp() & " overtime on vh.id=overtime.id and vh.filetype='KRONOS' and overtime.field='Overtime'" & _
                        " left outer join verticalrecords" & locp() & " staffed on vh.id=staffed.id and vh.filetype='CMS' and staffed.field='Staffed Time'" & _
                        " left outer join verticalrecords" & locp() & " breakaux on vh.id=breakaux.id and vh.filetype='CMS' and breakaux.field='Break'" & _
                        " left outer join verticalrecords" & locp() & " meetcoach on vh.id=meetcoach.id and vh.filetype='CMS' and meetcoach.field='Meeting'" & _
                        " left outer join verticalrecords" & locp() & " lunch on vh.id=lunch.id and vh.filetype='CMS' and lunch.field='Lunch'" & _
                        " left outer join usr us on vh.user_id=us.user_id" & _
                        " left outer join usr_team ut on us.user_id=ut.user_id" & _
                                                                " left outer join team tm on ut.team_id=tm.team_id" & _
                        " left outer join grp gp on tm.group_id=gp.group_id" & _
                                                                " left outer join loc lc on gp.loc_id=lc.loc_id" & _
                        " left outer join project pj on tm.project_id=pj.projectid" & _
                        " left outer join user_id ui on ui.user_id=us.user_id and ui.idtype='1'" & _
                        " where pj.projectid='" & ddlProjectI.SelectedValue & "' and lc.loc_id='" & ddlLocation.SelectedValue & "'" & _
                        " and vh.recdate in (" & listofdates(datelist) & ")" & _
                        " group by  ui.emp_id" & _
                        " ) Final ) nozero where UTILIZATION > 0"
            End Select

            If Not bypass Then
                If cbCalcUtilization.Checked Then
                    Using dtsurrogate As DataTable = db.exec(sql)
                        _im._labelline = "ID/R,Value/R"
                        _im._wizard.InstallTableSurrogate(dtsurrogate, _im._labelline)
                        For i As Integer = 0 To ddlIdType.Items.Count - 1
                            If ddlIdType.Items(i).Text = "KRONOS" Then
                                ddlIdType.SelectedIndex = i
                                Exit For
                            End If
                        Next
                        For i As Integer = 0 To ddlFileType.Items.Count - 1
                            If ddlFileType.Items(i).Text = "0" Then
                                ddlFileType.SelectedIndex = i
                                Exit For
                            End If
                        Next
                        cbIgnoreWarnings.Checked = True
                        rbNormal.Checked = False
                        rbAllowDuplicateDates.Checked = False
                        rbReplaceDuplicateDates.Checked = True

                        Dim foundkpi As Boolean = False

                        'The ddlKPI needs filled in based on the project.
                        ddlProjectISelectedIndexChanged()

                        For i As Integer = 0 To ddlKPI.Items.Count - 1
                            If ddlKPI.Items(i).Text.Trim = "Utilization" OrElse ddlKPI.Items(i).Text.Trim = "Productivity" Then
                                ddlKPI.SelectedIndex = i
                                foundkpi = True
                                Exit For
                            End If
                        Next
                        ddlSubKPI.Items.Clear()
                        If foundkpi And cbCalcUtilization.Checked Then
                            _im._errcnt = 0
                            _im.recorderror("Updating UTILIZATION for Project " & ddlProjectI.SelectedItem.Text & "...", errortype:=ImportErrorType.Info)
                            _im._errcnt = 0
                            Dim datehold As String = ""
                            If LEVELINGUTILIZATION Then
                                datehold = tbDate.Text
                                tbDate.Text = _im.day2string(Convert.ToDateTime(_im.rightpaystartdate()).AddDays(1)) 'This new value is to be stored on the FIRST MONDAY of the pay period.
                            End If
                            upload()
                            If LEVELINGUTILIZATION Then
                                tbDate.Text = datehold
                            End If
                            _im._errcnt = 0
                            _im.recorderror("...UTILIZATION Updated.", errortype:=ImportErrorType.Info)
                            _im._wizard.ClearLabels()
                        End If
                    End Using
                End If
            End If
        End Using
    End Sub

    Private Function vj(ByVal nm As String, _
            Optional ByVal rootname As String = "A", _
            Optional ByVal extra As String = "", _
            Optional ByVal outer As Boolean = False) As String
        Dim bld As String
        Dim vn As String = vname(nm)
        If outer Then
            bld = " outer"
        Else
            bld = " inner"
        End If
        bld &= " join verticalrecords" & locp() & " " & vn & " ON " & vn & ".id=" & rootname & ".id AND " & vn & ".field='" & nm & "'"
        If extra <> "" Then
            bld &= (" " & extra).Replace(" .", vn & ".")
        End If
        Return bld
    End Function

    Private Function vv(ByVal nm As String, Optional ByVal template As String = "") As String
        Dim vn As String = vname(nm)
        Dim bld As String = vn & ".val"
        If template <> "" Then
            bld = String.Format(template, bld)
        End If
        Return bld
    End Function

    Private Function listofdates(datelist As ArrayList) As String
        Dim bld As String = ""
        Dim first As Boolean = True
        For Each str As String In datelist
            If Not first Then
                bld &= ","
            End If
            bld &= "'" & str.Trim & "'"
            first = False
        Next
        Return bld
    End Function

    Private Sub wipeoutkpi(mqf As String, project As String, location As String, mydate As String, prefix As String)
        Dim bld As String = ""
        Dim first As Boolean = True
        Using db As New DbBaseSql(_im._connection)
            Using dt As DataTable = db.exec("select kpi_id from " & prefix & "KPI_RESP where MQF#='" & mqf & "' and kpi_id in (select KPI_ID from " & prefix & "KPI_HSTRY inner join TEAM on TEAM.TEAM_ID=" & prefix & "KPI_HSTRY.TEAM_ID inner join GRP on GRP.GROUP_ID=TEAM.GROUP_ID where respdt='" & mydate & "' and " & prefix & "kpi_hstry.PROJECT_ID='" & project & "' and GRP.LOC_ID='" & location & "')")
                For Each row As DataRow In dt.Rows
                    If Not first Then
                        bld &= ","
                    End If
                    bld &= "'" & row.Item(0).ToString & "'"
                    first = False
                Next
            End Using
            If bld <> "" Then
                db.Update("delete from " & prefix & "kpi_resp where kpi_id in (" & bld & ")")
                db.Update("delete from " & prefix & "kpi_hstry where kpi_id in (" & bld & ")")
            End If
        End Using
    End Sub

    Private Function vname(ByVal nm As String) As String
        Return nm.Replace("~", "").Replace(" ", "").Replace("%", "").Replace("/", "").Replace("~", "").Replace("+", "").Replace(".", "").ToUpper()
    End Function

    Private Function rightdate() As String
        If tbDate.Text.Trim = "" Then
            Return _im._wizard.labelvalue("Date")
        Else
            Return tbDate.Text.Trim
        End If
    End Function

    Private Function locp() As String
        Dim str As String = ddlLocation.SelectedValue
        If ddlLocation.SelectedValue = "1" Then
            If ddlProjectI.SelectedValue = "1" Then 'Progress
                str &= "p"
            ElseIf cbProgressKronos.Checked Then
                str &= "p"
            End If
        End If
        Return str
    End Function

    Private Sub upload()
        _im.upload(txtDate:=tbDate.Text, _
                   bReplaceDuplicateDates:=rbReplaceDuplicateDates.Checked, _
                   bAllowDuplicateDates:=rbAllowDuplicateDates.Checked, _
                   bProgressKronos:=cbProgressKronos.Checked, _
                   bMult100:=cbMult100.Checked, _
                   bIgnoreWarnings:=cbIgnoreWarnings.Checked, _
                   kvSubKPI:=New KV(_im.ddltext(ddlSubKPI), ddlSubKPI.SelectedValue), _
                   kvProject:=New KV(_im.ddltext(ddlProjectI), ddlProjectI.SelectedValue), _
                   kvLocation:=New KV(_im.ddltext(ddlLocation), ddlLocation.SelectedValue), _
                   kvKPI:=New KV(_im.ddltext(ddlKPI), ddlKPI.SelectedValue), _
                   kvSubType:=New KV(_im.ddltext(ddlSubtype), ddlSubtype.SelectedValue), _
                   kvIdType:=New KV(_im.ddltext(ddlIdType), ddlIdType.SelectedValue), _
                   username:=Context.User.Identity.Name.Trim, _
                   kvFileType:=New KV(_im.ddltext(ddlFileType), ddlFileType.SelectedValue))




        'Optional ByRef tbDate As TextBox = Nothing, &
        '                      Optional ByRef rbReplaceDuplicateDates As RadioButton = Nothing, &
        '                      Optional ByRef rbAllowDuplicateDates As RadioButton = Nothing, &
        '                      Optional ByRef cbProgressKronos As CheckBox = Nothing, &
        '                      Optional ByRef cbMult100 As CheckBox = Nothing, &
        '                      Optional ByRef cbIgnoreWarnings As CheckBox = Nothing, &
        '                      Optional ByRef ddlSubKPI As DropDownList = Nothing, &
        '                      Optional ByRef ddlProjectI As DropDownList = Nothing, &
        '                      Optional ByRef ddlLocation As DropDownList = Nothing, &
        '                      Optional ByRef ddlKPI As DropDownList = Nothing, &
        '                      Optional ByRef ddlSubTYpe As DropDownList = Nothing, &
        '                      Optional ByRef ddlIdType As DropDownList = Nothing, &
        'username = Context.User.Identity.Name.Trim
        '                      Optional ByRef ddlFileType As DropDownList = Nothing)
    End Sub
    Private Sub setskipdisplay(display As Boolean)
        btnSkip.Visible = display
        If display Then
            sparediv.Style.Add("display", "block")
            sparedivclear.Style.Add("display", "inline")
        Else
            sparediv.Style.Add("display", "none")
            sparedivclear.Style.Add("display", "none")
        End If
    End Sub
End Class
