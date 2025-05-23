Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports jglib


Public Class FilterContext
    Private debug As Boolean = False
    Private _connection As String = ""
    Private _connection2 As String = ""
    Private _earliestdate As Date = Convert.ToDateTime("2011-01-01")
    Private CONFMGR As ConfMgr = New ConfMgr()

    Private months() As String = {"", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"}

    Private _periodrestrict As String = ""

    Private _peerevaluate As Boolean = False

    Private _context As HttpContext

    Public Sub New(ByRef context As HttpContext)
        _context = context
    End Sub

    Public Function ProcessRequestIOStream(Optional reloadoverride As String = "", Optional periodinterval As String = "") As IO.Stream

        Dim sw As IO.StreamWriter = New IO.StreamWriter(New IO.MemoryStream)
        sw.Write(ProcessRequest(reloadoverride, periodinterval))
        sw.Flush()
        sw.BaseStream.Position = 0
        Return sw.BaseStream 'caller must close this stream when done

    End Function

    Public Function ProcessRequest(Optional reloadoverride As String = "", Optional periodinterval As String = "") As String
        _context.Response.ContentType = "text/xml"
        _connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        If qt("Connection") <> "" Then
            _connection = CONFMGR.ConnectionStrings(urlprefix() & qt("Connection").Split(",")(0)).ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        End If

        If (urlprefix() = "km2.") Or (urlprefix() = "km2-make40.") Then
            _peerevaluate = True
        End If

        Dim sql As String = ""
        Dim isguat As Boolean = False
        Dim groupstick As String = ""

        Dim boxrole As String = qt("role")
        If (boxrole <> "CSR") AndAlso (boxrole <> "Team Leader") AndAlso (boxrole <> "Group Leader") Then
            boxrole = ""
        End If

        Dim whichsplit() As String = Nothing
        Dim reloadall As Boolean = True
        If reloadoverride = "" Then
            If _context.Request.QueryString("reload") IsNot Nothing AndAlso _context.Request.QueryString("reload") <> "" Then
                If _context.Request.QueryString("reload") <> "All" Then
                    whichsplit = _context.Request.QueryString("reload").Split(",")
                    reloadall = False
                Else
                    whichsplit = reloadoverride.Split(",")
                End If
            End If
        Else
            whichsplit = reloadoverride.Split(",")
            reloadall = False
        End If

        Using db As New DbBaseSql(_connection)
            Dim sbXML As New StringBuilder
            Dim writer As XmlWriter = XmlWriter.Create(sbXML)
            writer.WriteStartElement("Combofilters")

            If (urlprefix() = "apptrana-make40.") Or (urlprefix() = "acunetix-make40.") Then
                writer.WriteEndElement()
                writer.WriteEndDocument()
                writer.Close()
                sbXML = sbXML.Replace("encoding=""utf-16""", "")
                Return sbXML.ToString
            End If

            'Added 10/9/2014 - For Supervisor model, find the appropriate CSR model project for display of the hierarchy.
            Dim hiproject As String = qt("Project")
            If (qt("Project") <> "") Then
                If (qt("model") = "2") OrElse (qt("model") = "4") Then
                    sql = "select projectid from project where model_id=1 and projectdesc=(select projectdesc from project where projectid='" & qt("project") & "')"
                    Using dt As DataTable = db.GetDataTable(sql)
                        If dt.Rows.Count > 0 Then
                            hiproject = dt.Rows(0).Item(0).ToString
                        End If
                    End Using
                End If
            End If
            'RETRY 2021-09-10 - Since Team Leaders work properly across projects, treat SPVR_TEAM members as Team Leaders (Role Substitution).
            'Special case required for group leaders, but that's better than the gymnastics being performed for CSRs.
            'UPDATE 2021-09-10 - If the user is in SPVR_TEAM, then display CSRs as if you're a team leader.
            Dim spvr_team_ids As String = "0" '..So you can do an IN clause without an error.
            Dim spvr_team_ids_subset As String = "0"
            Dim spvr_substitution As Boolean = False
            If boxrole <> "" Then
                sql = "select team_id from spvr_team where user_id='" & qt("username") & "'"
                Dim first As Boolean = True
                Using dt As DataTable = db.GetDataTable(sql)
                    For Each row As DataRow In dt.Rows
                        If (Not first) Then
                            spvr_team_ids &= ","
                        Else
                            spvr_team_ids = ""
                        End If
                        first = False
                        spvr_team_ids &= row("team_id").ToString
                    Next
                End Using
                spvr_team_ids_subset = spvr_team_ids  'Used for the case where a CSR is not a Supervisor for his own team.
                sql = "select team_id from usr_team where user_id='" & qt("username") & "'"
                Using dt As DataTable = db.GetDataTable(sql)
                    For Each row As DataRow In dt.Rows
                        If (Not first) Then
                            spvr_team_ids &= ","
                        Else
                            spvr_team_ids = ""
                        End If
                        first = False
                        spvr_team_ids &= row("team_id").ToString
                    Next
                End Using
            End If

            If reloadall OrElse ismember(whichsplit, "DataSource") Then
                'TODO: Data Sources need to come from the DAS table (not the DataSource table - DAS will be in V2).
                _connection2 = CONFMGR.ConnectionStrings(urlprefix() & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                Dim clientid As String = CONFMGR.AppSettings(urlprefix() & "ClientID_V2").ToString
                'Change 03-25-2013
                'WAS:
                'sql = "select ds.id as [key],ds.name as [desc]" & _
                '    " from datasources ds where project_id is null and loc_id is null"
                'If (qt("Project") <> "") Then
                '    sql &= " UNION select ds.id as [key],ds.name as [desc]" & _
                '        " from datasources ds where project_id='" & qt("Project") & "'"
                'End If
                'If (qt("Location") <> "") Then
                '    sql &= " UNION select ds.id as [key],ds.name as [desc]" & _
                '        " from datasources ds where loc_id='" & qt("Location") & "'"
                'End If
                'sql = substituteparams(sql)
                'Using dt As DataTable = db.GetDataTable(sql)
                '    dt.DataSet.DataSetName = "DataSources"
                '    dt.TableName = "DataSource"
                '    dt.WriteXml(writer)
                'End Using
                'IS:
                Using db2 As New DbBaseSql(_connection2)
                    sql = "select das.id as [key], das.name as [desc] from das"
                    Dim sqlwhere As String = ""
                    If ((qt("Project") <> "") AndAlso (qt("Project") <> "each")) Then
                        sql &= " left outer join das_pki dppj on dppj.iddas=das.id left outer join pki ppj on ppj.id=dppj.idpki and ppj.name='Project'"
                        If (sqlwhere <> "") Then sqlwhere &= " and"
                        sqlwhere &= " ((dppj.selid=0) or (dppj.selid is null) or (dppj.selid='" & qt("Project") & "'))"
                    End If
                    If ((qt("Location") <> "") AndAlso (qt("Location") <> "each")) Then
                        sql &= " left outer join das_pki dplc on dplc.iddas=das.id left outer join pki plc on plc.id=dplc.idpki and plc.name='Project'"
                        If (sqlwhere <> "") Then sqlwhere &= " and"
                        sqlwhere &= " ((dplc.selid=0) or (dplc.selid is null) or (dplc.selid='" & qt("Location") & "'))"
                    End If
                    If ((qt("Group") <> "") AndAlso (qt("Group") <> "each")) Then
                        sql &= " left outer join das_pki dpgp on dpgp.iddas=das.id left outer join pki pgp on pgp.id=dpgp.idpki and pgp.name='Project'"
                        If (sqlwhere <> "") Then sqlwhere &= " and"
                        sqlwhere &= " ((dpgp.selid=0) or (dpgp.selid is null) or (dpgp.selid='" & qt("Group") & "'))"
                    End If
                    If ((qt("Team") <> "") AndAlso (qt("Team") <> "each")) Then
                        sql &= " left outer join das_pki dptm on dptm.iddas=das.id left outer join pki ptm on ptm.id=dptm.idpki and ptm.name='Project'"
                        If (sqlwhere <> "") Then sqlwhere &= " and"
                        sqlwhere &= " ((dptm.selid=0) or (dptm.selid is null) or (dptm.selid='" & qt("Team") & "'))"
                    End If
                    'TODO: 3/30/2014 - I removed the "CSR" search for datasources because the value in CSR is not numeric (and selid requires a numeric).
                    '      Review and fix this if data sources even make sense in this context anymore.
                    'If (qt("CSR") <> "") Then
                    'sql &= " left outer join das_pki dpcs on dpcs.iddas=das.id left outer join pki pcs on pcs.id=dpcs.idpki and pcs.name='Project'"
                    'If (sqlwhere <> "") Then sqlwhere &= " and"
                    'sqlwhere &= " ((dpcs.selid=0) or (dpcs.selid is null) or (dpcs.selid='" & qt("CSR") & "'))"
                    'End If
                    If (sqlwhere <> "") Then sqlwhere &= " and"
                    sqlwhere &= " (das.client='" & clientid & "')"
                    sql &= " where " & sqlwhere & " group by das.id,das.name"
                    sql = substituteparams(sql)

                    'Added 8/10/2017 - DataSource doesn't make sense in all contexts, so its return will be optional for now.
                    Try
                        Using dt As DataTable = db2.GetDataTable(sql)
                            dt.DataSet.DataSetName = "DataSources"
                            dt.TableName = "DataSource"
                            dt.WriteXml(writer)
                        End Using
                    Catch ex As Exception
                    End Try
                End Using
            End If

            'TODO:MODEL3 - Add "Agency" and Agencyoffice" as parts of the query.
            If True Then 'Changed 2017-04-20, it now always populates these so they're at the ready.  qt("Model") = "3" Then
                If reloadall OrElse ismember(whichsplit, "Agency") Then
                    sql = "select tsc_id as [key], tsc_name as [desc] from TSC where TSC.Status='A' order by tsc_name asc"
                    sql = substituteparams(sql)
                    Using dt As DataTable = db.GetDataTable(sql)
                        dt.DataSet.DataSetName = "Agencys"
                        dt.TableName = "Agency"
                        dt.WriteXml(writer)
                    End Using
                End If
                If reloadall OrElse ismember(whichsplit, "Agencyoffice") Then
                    sql = "select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                        " from LOC lc" & _
                        " inner join TSC_LOC tl on tl.LOC_ID=lc.LOC_ID" & _
                        " inner join TSC on TSC.TSC_ID=tl.TSC_ID" & _
                        " where lc.STATUS='A' and TSC.STATUS='A'" & _
                            " /**ANDBLOCK(EQUAL(TSC.tsc_id,Agency))**/" & _
                        " order by [desc];"
                    sql = substituteparams(sql)
                    Using dt As DataTable = db.GetDataTable(sql)
                        dt.DataSet.DataSetName = "Agencyoffices"
                        dt.TableName = "Agencyoffice"
                        dt.WriteXml(writer)
                    End Using
                End If
            End If

            If reloadall OrElse ismember(whichsplit, "Project") Then
                Dim modelsql As String = ""
                'DONE:MODEL3 - If Model 3, then the projects are from Model 1, and you have the ability to specify ALL (which is controlled in dashboard code).
                'DONE:MODEL3 - Be sure that "Project" is truly optional if we're in model 3 (this was done in the dashboard).
                If (qt("Model") = "") OrElse (qt("Model") = "3") Then
                    modelsql = " and pj.model_id='1'"
                Else
                    modelsql = " and pj.model_id='" & db.reap(qt("Model")) & "'"
                End If
                sql = ""
                If qt("StartDate") <> "" Then
                    sql = "select pj.projectID as [key],pj.ProjectDesc as [desc]" & _
                          " from KPI_HSTRY kh" & _
                          " inner join PROJECT pj on pj.projectID=kh.project_id" & modelsql & _
                          " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))**/" & _
                          " UNION"
                End If
                'TODONOW: DONE - Substitute "GLOBAL" for projectid=0
                sql &= " select pj.projectID as [key],case when pj.projectID = 0 then 'GLOBAL' else ProjectDesc end as [desc]" & _
                      " from PROJECT pj" & _
                      " where pj.Status='A'" & modelsql & _
                      " order by [desc];"
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "Projects"
                    dt.TableName = "Project"
                    dt.WriteXml(writer)
                End Using
            End If

            Dim checkloc As Boolean = False
            If qt("loccheck") <> "" Then
                Using dc As DataTable = db.GetDataTable("select * from usr_loc where user_id='" & qt("username") & "'")
                    If dc.Rows.Count > 0 Then
                        checkloc = True
                    End If
                End Using
            End If


            If reloadall OrElse ismember(whichsplit, "Location") Then
                'Allow ALL SUPS to have access to their entire project
                If (qt("model") = "3") Then 'TODO:MODEL3 - This location should be reverted to as it was (subset of the Project hierarchy).
                    If boxrole = "" Then 'Hierarchy-based roles aren't allowed to see the Source view at this time.
                        sql = "select lc.loc_id as [key],lc.LOC_NAME as [desc] from LOC lc where lc.status='A' order by lc.LOC_NAME"
                    End If
                Else
                    If qt("loccheck") <> "" Then
                        sql = " select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                " from GRP gp" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID"
                        If checkloc Then
                            sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                        End If
                        sql &= " where lc.STATUS='A'" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/"
                        sql &= " order by lc.LOC_NAME;"
                    Else
                        If boxrole = "" Then
                            sql = ""
                            If qt("StartDate") <> "" Then
                                sql = "select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from KPI_HSTRY kh" & _
                                    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                    " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                    " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                                    " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                    "EQUAL(pj.ProjectID,Project)**/" & _
                                    " UNION"
                            End If
                            sql &= " select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A'" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/" & _
                                    " order by lc.LOC_NAME;"
                        ElseIf boxrole = "Group Leader" Then
                            If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "L" OrElse qt("suprestrict") = "T" Then
                                sql = "select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A' and gp.status in ('A','M')" & _
                                        " /**ANDBLOCK(EQUAL(gp.SPVR_USER_ID,username))**/" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/" & _
                                    " order by lc.LOC_NAME;"
                            Else
                                sql = "select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A' and gp.status in ('A','M')" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/" & _
                                    " order by [desc];"
                            End If
                        ElseIf boxrole = "Team Leader" OrElse spvr_team_ids <> "0" Then 'Nochange duckduck
                            If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "L" OrElse qt("suprestrict") = "T" _
                                OrElse urlprefix() = "collective-solution." Then
                                sql = "select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from TEAM tm" & _
                                    " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A' and gp.status in ('A','M') and tm.status in ('A','M')" & _
                                        " AND (( 1=1 " & _
                                        " /**ANDBLOCK(EQUAL(tm.SPVR_USER_ID,username))**/" & _
                                        " ) OR tm.team_id in (" & spvr_team_ids & ") ) " & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/" & _
                                    " order by lc.LOC_NAME;"
                            Else
                                sql = "select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from TEAM tm" & _
                                    " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A' and gp.status in ('A','M') and tm.status in ('A','M')" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/" & _
                                    " order by [desc];"
                            End If
                        ElseIf boxrole = "CSR" Then
                            'TODO: Too rich for now, maybe this can be a setting.
                            '    "select lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                            '    " from KPI_HSTRY kh" & _
                            '    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                            '    " inner join TEAM tm on tm.team_id=kh.team_id" & _
                            '    " inner join GRP gp on gp.group_id=tm.group_id" & _
                            '    " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                            '    " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                            '    "EQUAL(pj.ProjectID,Project)," & _
                            '    "EQUAL(kh.user_id,username)**/" & _
                            '    " UNION" & _
                            If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "L" OrElse qt("suprestrict") = "T" Then 'CSRsuprestrict
                                sql = " select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from USR_TEAM ut" & _
                                    " inner join TEAM tm on ut.TEAM_ID=tm.TEAM_ID" & _
                                    " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A' and gp.status in ('A','M') and tm.status in ('A','M')" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))," & _
                                        "EQUAL(ut.user_id,username)**/" & _
                                    " order by lc.LOC_NAME;"
                            Else
                                sql = " select distinct lc.loc_id as [key],lc.LOC_NAME as [desc]" & _
                                    " from USR_TEAM ut" & _
                                    " inner join TEAM tm on ut.TEAM_ID=tm.TEAM_ID" & _
                                    " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where lc.STATUS='A' and gp.status in ('A','M') and tm.status in ('A','M')" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))**/" & _
                                    " order by lc.LOC_NAME;"
                            End If
                        End If
                    End If
                End If
                sql = substituteparams(sql, hiproject:=hiproject)
                Using dt As DataTable = db.GetDataTable(sql)
                    'For Each row As DataRow In dt.Rows
                    '    If row("desc") Then
                    'Next
                    If (qt("ApmGuatModuleLoc") <> "") Then
                        If boxrole = "Group Leader" Or boxrole = "Team Leader" Or boxrole = "CSR" Then 'Nochange
                            If dt.Rows.Count >= 1 Then
                                If dt.Rows(0)("key").ToString = qt("ApmGuatModuleLoc") Then
                                    isguat = True
                                End If
                            End If
                        End If
                    ElseIf CONFMGR.AppSettings(urlprefix() & "client") = "29" Then
                        If boxrole = "Group Leader" Or boxrole = "Team Leader" Or boxrole = "CSR" Then 'Nochange
                            If dt.Rows.Count >= 1 Then
                                If dt.Rows(0)("key").ToString = "5" Then
                                    isguat = True 'NOTE: isguat now really means "rogue month", or month that may differ from the project.
                                End If
                            End If
                        End If

                    End If
                    dt.DataSet.DataSetName = "Locations"
                    dt.TableName = "Location"
                    dt.WriteXml(writer)
                End Using
            End If

            If reloadall OrElse ismember(whichsplit, "Group") Then
                If qt("Location") = "each" Then
                    Using dt As New DataTable("Payperiod")
                        dt.Columns.Add(New DataColumn("key"))
                        dt.Columns.Add(New DataColumn("desc"))
                        Dim nr As DataRow = dt.NewRow()
                        nr("key") = "disabled"
                        nr("desc") = ""
                        dt.Rows.Add(nr)
                        dt.TableName = "Group"
                        Dim ds As New DataSet("Groups")
                        ds.Tables.Add(dt)
                        ds.WriteXml(writer)
                    End Using
                Else
                    If boxrole = "" Then
                        sql = ""
                        If qt("StartDate") <> "" Then
                            sql = "select distinct gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from KPI_HSTRY kh" & _
                                    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                    " inner join TEAM tm on tm.team_id=kh.team_id and tm.status in ('A','M')" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.loc_id=gp.loc_id and lc.status='A'"
                            If checkloc Then
                                sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                            End If
                            sql &= " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                    "EQUAL(pj.ProjectID,Project)," & _
                                    "EQUAL(lc.LOC_ID,Location)**/" & _
                                    " UNION"
                        End If
                        sql &= " select distinct gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID"
                        If checkloc Then
                            sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                        End If
                        sql &= " where gp.STATUS in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/" & _
                                    " order by [desc];"
                    ElseIf boxrole = "Group Leader" Then
                        If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "T" Then
                            sql = " select 0 as seq,gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where gp.STATUS in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(gp.SPVR_USER_ID,username))**/" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/"
                            sql &= " UNION select 1 as seq,gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join SPVR_GRP sgp on sgp.group_id=gp.group_id and sgp.user_id='" & db.reap(qt("username")) & "'" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where gp.STATUS in ('A','M')" & _
                                    " AND gp.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/"
                            sql &= " order by seq,[desc];"
                        Else
                            sql = " select distinct gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where gp.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/" & _
                                    " order by [desc];"
                        End If
                    ElseIf boxrole = "Team Leader" OrElse spvr_team_ids <> "0" Then 'Nochange
                        If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "T" _
                                OrElse urlprefix() = "collective-solution." Then 'And (Not _peerevaluate) Then
                            sql = " select 0 as seq,gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from TEAM tm" & _
                                    " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                        " AND (( 1=1 " & _
                                        " /**ANDBLOCK(EQUAL(tm.SPVR_USER_ID,username))**/" & _
                                        " ) OR tm.team_id in (" & spvr_team_ids & ") ) " & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/"
                            sql &= " UNION select distinct 1 as seq,gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from GRP gp" & _
                                    " inner join team tm on tm.group_id=gp.group_id" & _
                                    " inner join SPVR_TEAM stm on stm.team_id=tm.team_id and stm.user_id='" & db.reap(qt("username")) & "'" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where gp.STATUS in ('A','M') and tm.STATUS in ('A','M') " & _
                                    " AND tm.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/"
                            sql &= " order by seq,[desc];"
                        Else
                            sql = " select distinct gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from TEAM tm" & _
                                    " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID"
                            If checkloc Then
                                sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                            End If
                            sql &= " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)**/" & _
                                    " order by [desc];"
                        End If
                    ElseIf boxrole = "CSR" Then
                        'TODO: Too rich for now, maybe this can be a setting.
                        ' "select gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                        ' " from KPI_HSTRY kh" & _
                        ' " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                        ' " inner join TEAM tm on tm.team_id=kh.team_id" & _
                        ' " inner join GRP gp on gp.group_id=tm.group_id" & _
                        ' " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                        ' " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                        ' "EQUAL(pj.ProjectID,Project)," & _
                        ' "EQUAL(lc.LOC_ID,Location)," & _
                        ' "EQUAL(kh.user_id,username)**/" & _
                        ' " UNION" & _
                        If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "T" Then 'CSRsuprestrict
                            sql = " select gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                " from USR_TEAM ut" & _
                                " inner join TEAM tm on ut.TEAM_ID=tm.TEAM_ID" & _
                                " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where gp.status in ('A','M')" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(ut.user_id,username)**/" & _
                                " order by [desc];"
                        Else
                            sql = " select distinct gp.group_id as [key],dbo.dspGroupNameExpanded(gp.group_id) + case when gp.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                " from USR_TEAM ut" & _
                                " inner join TEAM tm on ut.TEAM_ID=tm.TEAM_ID" & _
                                " inner join GRP gp on gp.GROUP_ID = tm.GROUP_ID" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where gp.status in ('A','M')" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)**/" & _
                                " order by [desc];"
                        End If
                    End If
                    sql = substituteparams(sql, hiproject:=hiproject)
                    Using dt As DataTable = db.GetDataTable(sql)
                        If boxrole = "Team Leader" AndAlso qt("Group") = "" AndAlso dt.Rows.Count > 1 Then
                            groupstick = dt.Rows(0).Item("key").ToString
                        End If
                        dt.DataSet.DataSetName = "Groups"
                        dt.TableName = "Group"
                        dt.WriteXml(writer)
                    End Using
                End If
            End If

            'duck team start
            If reloadall OrElse ismember(whichsplit, "Team") Then
                If qt("Location") = "each" OrElse qt("Group") = "each" Then
                    Using dt As New DataTable("Payperiod")
                        dt.Columns.Add(New DataColumn("key"))
                        dt.Columns.Add(New DataColumn("desc"))
                        Dim nr As DataRow = dt.NewRow()
                        nr("key") = "disabled"
                        nr("desc") = ""
                        dt.Rows.Add(nr)
                        dt.TableName = "Team"
                        Dim ds As New DataSet("Teams")
                        ds.Tables.Add(dt)
                        ds.WriteXml(writer)
                    End Using
                Else
                    If boxrole = "" Then
                        sql = ""
                        If qt("StartDate") <> "" Then
                            sql = "select distinct tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from KPI_HSTRY kh" & _
                                    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                    " inner join TEAM tm on tm.team_id=kh.team_id and tm.status in ('A','M')" & _
                                    " inner join GRP gp on (gp.group_id=tm.group_id or (tm.roll_group_id is not null and gp.group_id=tm.roll_group_id)) and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.loc_id=gp.loc_id and lc.status='A'"
                            If checkloc Then
                                sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                            End If
                            sql &= " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                    "EQUAL(pj.ProjectID,Project)," & _
                                    "EQUAL(lc.LOC_ID,Location)," & _
                                     "EQUAL(gp.GROUP_ID,Group)**/" & _
                                     " UNION"
                        End If
                        sql &= " select tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from team tm" & _
                                    " inner join GRP gp on (gp.group_id=tm.group_id or (tm.roll_group_id is not null and gp.group_id=tm.roll_group_id)) and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID"
                        If checkloc Then
                            sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                        End If
                        sql &= " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)," & _
                                    "EQUAL(gp.GROUP_ID,Group)**/" & _
                                    " order by [desc];"
                    ElseIf boxrole = "Group Leader" Then
                        If (qt("suprestrict") = "Y") OrElse qt("suprestrict") = "T" Then
                            sql = " select 0 as seq,tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from team tm" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)" & _
                                    "EQUAL(gp.GROUP_ID,Group)," & _
                                    "EQUAL(gp.SPVR_USER_ID,username))**/"
                            If (qt("Group") <> "") Then 'Avoid Initial Pass
                                sql &= " UNION select 1 as seq,tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                        " from team tm" & _
                                        " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                        " inner join SPVR_GRP sgp on sgp.group_id=gp.group_id and sgp.user_id='" & db.reap(qt("username")) & "'" & _
                                        " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                        " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                        " where tm.status in ('A','M')" & _
                                        " AND gp.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                        "EQUAL(lc.LOC_ID,Location)" & _
                                        "EQUAL(gp.GROUP_ID,Group)**/"
                            End If
                            sql &= " order by seq,[desc];"
                        Else
                            sql = " select distinct tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from team tm" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)" & _
                                    "EQUAL(gp.GROUP_ID,Group))**/" & _
                                    " order by [desc];"
                        End If
                    ElseIf boxrole = "Team Leader" OrElse spvr_team_ids <> "0" Then 'Nochange
                        If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "T" Then 'And (Not _peerevaluate) Then
                            sql = " select 0 as seq,tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from team tm" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)" & _
                                    "EQUAL(gp.GROUP_ID,Group)**/" & _
                                        " AND (( 1=1 " & _
                                        " /**ANDBLOCK(EQUAL(tm.SPVR_USER_ID,username))**/" & _
                                        " ) OR tm.team_id in (" & spvr_team_ids & ") ) "
                            If groupstick <> "" Then
                                sql &= " AND gp.group_id='" & groupstick & "'"
                            End If

                            If (qt("Group") <> "") Then 'Avoid Initial Pass
                                sql &= " UNION select 1 as seq,tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                        " from team tm" & _
                                        " inner join SPVR_TEAM stm on stm.team_id=tm.team_id and stm.user_id='" & db.reap(qt("username")) & "'" & _
                                        " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                        " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                        " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                        " where tm.status in ('A','M')" & _
                                        " AND tm.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                        "EQUAL(lc.LOC_ID,Location)" & _
                                        "EQUAL(gp.GROUP_ID,Group)**/"
                            End If
                            sql &= " order by seq,[desc];"
                        Else
                            sql = " select distinct tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from team tm" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)" & _
                                    "EQUAL(gp.GROUP_ID,Group))**/" & _
                                    " order by [desc];"
                        End If
                    ElseIf boxrole = "CSR" Then
                        'TODO: Too rich for now, maybe this can be a setting.
                        ' "select tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                        '        " from KPI_HSTRY kh" & _
                        '        " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                        '        " inner join TEAM tm on tm.team_id=kh.team_id" & _
                        '        " inner join GRP gp on gp.group_id=tm.group_id" & _
                        '        " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                        '        " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                        '        "EQUAL(pj.ProjectID,Project)," & _
                        '        "EQUAL(lc.LOC_ID,Location)" & _
                        '         "EQUAL(gp.GROUP_ID,Group)," & _
                        '         "EQUAL(kh.user_id,username)**/" & _
                        '         " UNION" & _
                        If qt("suprestrict") = "Y" OrElse qt("suprestrict") = "T" Then 'CSRsuprestrict
                            sql = " select 0 as seq,tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from USR_TEAM ut" & _
                                    " inner join TEAM tm on ut.TEAM_ID=tm.TEAM_ID" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)" & _
                                    "EQUAL(gp.GROUP_ID,Group)," & _
                                    "EQUAL(ut.user_id,username)**/"
                            'If (qt("Group") <> "") Then 'Avoid Initial Pass
                            'sql &= " UNION select 1 as seq,tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                            '        " from team tm" & _
                            '        " inner join SPVR_TEAM stm on stm.team_id=tm.team_id and stm.user_id='" & db.reap(qt("username")) & "'" & _
                            '        " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                            '        " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                            '        " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                            '        " where tm.status in ('A','M')" & _
                            '        " AND tm.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                            '        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                            '        "EQUAL(lc.LOC_ID,Location)" & _
                            '        "EQUAL(gp.GROUP_ID,Group)**/"
                            'End If
                            sql &= " order by seq,[desc];"
                        Else
                            sql = " select distinct tm.TEAM_ID as [key],dbo.dspTeamNameExpanded(tm.team_id) + case when tm.status='M' then ' (Migrated)' else '' end as [desc]" & _
                                    " from USR_TEAM ut" & _
                                    " inner join TEAM tm on ut.TEAM_ID=tm.TEAM_ID" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                    " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    " where tm.status in ('A','M')" & _
                                    " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    "EQUAL(lc.LOC_ID,Location)" & _
                                    "EQUAL(gp.GROUP_ID,Group)**/" & _
                                    " order by [desc];"
                        End If
                    End If
                    sql = substituteparams(sql, hiproject:=hiproject)
                    Using dt As DataTable = db.GetDataTable(sql)
                        dt.DataSet.DataSetName = "Teams"
                        dt.TableName = "Team"
                        dt.WriteXml(writer)
                    End Using
                End If
            End If
            'duck team end

            'I MOVED PAYPERIODS BEFORE CSR SO I CAN HAVE THE PAYPERIOD FOR THE CSR QUERY
            If reloadall OrElse ismember(whichsplit, "Payperiod") Then

                '    dt.Columns.Add(New DataColumn("key"))
                '    dt.Columns.Add(New DataColumn("desc"))

                '    Dim _rightnow As Date = Date.Now
                '    Dim _earliestdate As Date = Convert.ToDateTime("2011-01-01")
                '    Dim rollingdate As Date
                '    Using dtlp As DataTable = db.GetDataTable("Select dbo.GetLastPayDate('" & _rightnow.ToShortDateString & "', 1);")
                '        rollingdate = dtlp.Rows(0).Item(0)
                '        rollingdate = rollingdate.AddDays(-1)  'You've been off by one day.
                '    End Using
                '    If rollingdate <> _rightnow Then
                '        rollingdate = rollingdate.AddDays(14) 'Start at the date of the NEXT pay period end.
                '    End If
                '    Dim cnt As Integer = 0
                '    'TODO: 9/25/2012 - Change the date interval mechanism.
                '    If (periodinterval = "" OrElse periodinterval = "each") AndAlso _periodrestrict <> "month" Then
                '        While rollingdate >= _earliestdate
                '            Dim nr As DataRow = dt.NewRow()
                '            Dim firstdate As Date = rollingdate.AddDays(-13)
                '            nr("key") = firstdate.ToShortDateString & "," & rollingdate.ToShortDateString
                '            If cnt = 0 Then
                '                nr("desc") = "Current Pay Period"
                '            ElseIf cnt = 1 Then
                '                nr("desc") = "Previous Pay Period"
                '            Else
                '                nr("desc") = "Pay Period " & firstdate.Month.ToString & "/" & firstdate.Day.ToString & "-" & rollingdate.Month.ToString & "/" & rollingdate.Day.ToString
                '            End If
                '            dt.Rows.Add(nr)
                '            cnt += 1
                '            rollingdate = rollingdate.AddDays(-14)
                '        End While
                '    End If
                '    If (periodinterval = "" OrElse periodinterval = "eachmonth") AndAlso _periodrestrict <> "payperiod" Then
                '        'Add the monthlies.
                '        rollingdate = Date.Now.Date
                '        cnt = 0
                '        rollingdate = rollingdate.AddDays(1 - rollingdate.Day)
                '        While rollingdate >= _earliestdate
                '            Dim nr As DataRow = dt.NewRow()
                '            Dim lastdate As Date = rollingdate.AddMonths(1).AddDays(-1)
                '            nr("key") = rollingdate.ToShortDateString & "," & lastdate.ToShortDateString
                '            If cnt = 0 Then
                '                nr("desc") = "Current Month"
                '            ElseIf cnt = 1 Then
                '                nr("desc") = "Last Month"
                '            Else
                '                nr("desc") = rollingdate.ToString("MMMM").Substring(0, 3) & "/" & rollingdate.Year.ToString
                '            End If
                '            dt.Rows.Add(nr)
                '            cnt += 1
                '            rollingdate = rollingdate.AddMonths(-1)
                '        End While
                '    End If
                '
                'TODO: 9/25/2012 - Change the date interval mechanism. 
                Using dt As New DataTable("Payperiod")
                    dt.Columns.Add(New DataColumn("key"))
                    dt.Columns.Add(New DataColumn("desc"))
                    If qt("loadperiods") <> "" Then 'Added 2017-05-03 - Allow an override on the periods to return (instead of running off the project)
                        Dim sts() As String = qt("loadperiods").Split(",")
                        Dim per As String = ""
                        If sts.Length >= 1 Then
                            For i As Integer = 0 To sts.Length - 1
                                If per <> "" Then
                                    per &= ","
                                End If
                                per &= "'" & sts(i) & "'"
                            Next
                        End If
                        If per = "" Then per = "Month"
                        sql = "select distinct t.id,t.name,d.startdate,d.enddate from iv_type t inner join iv_dates d on d.ivid=t.id where t.name in (" & per & ") and d.startdate <= getdate() order by t.id asc,d.enddate desc"
                    ElseIf qt("Model") = "3" Then
                        sql = "select distinct t.id,t.name,d.startdate,d.enddate from iv_type t inner join iv_dates d on d.ivid=t.id where t.name = 'Month' and d.startdate <= getdate() order by t.id asc,d.enddate desc" 'TODO: This is not general (ERS-Specific), to generalize I need a place to store it (like a setting).
                    Else
                        If (qt("Project") <> "") Then
                            sql = "select distinct p.ord,t.name,t.id,d.startdate,d.enddate from iv_project p" & _
                                " inner join iv_dates d on d.ivid=p.ivid" & _
                                " inner join iv_type t on t.id=p.ivid" & _
                                " where d.startdate <= getdate()"
                            If qt("nodaterestriction") = "" Then
                                sql &= " and d.enddate >= dateadd(yyyy,-1,getdate())"
                            End If
                            If CONFMGR.AppSettings(urlprefix() & "client") = "29" Then 'CLUGUE: It will never by appguatmoduleloc and bgr at the same time
                                If (qt("location") = "5") Then
                                    sql &= " and (t.name='Pay Period')"
                                ElseIf (qt("location") = "4") OrElse (qt("location") = "6") Then
                                    sql &= " and (t.name='Sales')"
                                End If
                            ElseIf (qt("ApmGuatModuleLoc") <> "") Then
                                If isguat OrElse (qt("location") = qt("ApmGuatModuleLoc")) Then
                                    sql &= " and (t.name='Month')"
                                End If
                            End If
                            sql &= " /**ANDBLOCK(EQUAL(p.projectid,Project)**/" & _
                                " order by p.ord asc,d.enddate desc"
                        Else
                            sql = "select distinct t.name,t.id,d.startdate,d.enddate from iv_type t" & _
                                " inner join iv_dates d on d.ivid=t.id" & _
                                " where d.startdate <= getdate()"
                            If qt("nodaterestriction") = "" Then
                                sql &= " and d.enddate >= dateadd(yyyy,-1,getdate())"
                            End If
                            If CONFMGR.AppSettings(urlprefix() & "client") = "29" Then 'CLUGUE: It will never by appguatmoduleloc and bgr at the same time
                                If isguat OrElse (qt("location") = "5") Then
                                    sql &= " and (t.name='Pay Period')"
                                ElseIf (qt("location") = "4") Then
                                    sql &= " and (t.name='Sales')"
                                End If
                            ElseIf (qt("ApmGuatModuleLoc") <> "") Then
                                If isguat OrElse (qt("location") = qt("ApmGuatModuleLoc")) Then
                                    sql &= " and (t.name='Month')"
                                End If
                            End If
                            sql &= " order by t.id asc,d.enddate desc"
                        End If
                    End If

                    sql = substituteparams(sql, hiproject)
                    Using dat As DataTable = db.GetDataTable(sql)
                        Dim curname As String = ""
                        Dim curid As String = ""
                        Dim cnt As Integer = 0
                        Dim nr As DataRow
                        For Each row As DataRow In dat.Rows
                            nr = dt.NewRow()
                            If row("name").ToString <> curname Then
                                If curname <> "" Then
                                    nr("desc") = "Each " + curname
                                    nr("key") = "each_" + curid
                                    dt.Rows.Add(nr)
                                    nr = dt.NewRow()
                                End If
                                curname = row("name").ToString
                                curid = row("id").ToString
                                nr("desc") = "Current " + row("name").ToString
                                cnt = 0
                            ElseIf cnt = 1 Then
                                nr("desc") = "Previous " + row("name").ToString
                            Else
                                nr("desc") = row("name").ToString
                                If nr("desc") = "Month" Then
                                    nr("desc") &= " " & months(row("startdate").Month) & " " & (row("startdate").Year).ToString
                                ElseIf nr("desc") = "Day" Then
                                    nr("desc") &= " " & months(row("startdate").Month) & " " & (row("startdate").day).ToString
                                Else
                                    nr("desc") &= " " & row("startdate").month.ToString & "/" & row("startdate").day.ToString & "-" & row("enddate").ToShortDateString
                                End If
                            End If
                            nr("key") = row("startdate").ToShortDateString & "," & row("enddate").ToShortDateString & "," & row("id").ToString
                            dt.Rows.Add(nr)
                            cnt += 1
                        Next
                        If curname <> "" Then
                            nr = dt.NewRow()
                            nr("desc") = "Each " + curname
                            nr("key") = "each_" + curid
                            dt.Rows.Add(nr)
                        End If

                    End Using

                    'dt.DataSet.DataSetName = "Payperiods"
                    dt.TableName = "Payperiod"
                    Dim ds As New DataSet("Payperiods")
                    ds.Tables.Add(dt)
                    ds.WriteXml(writer)
                End Using

            End If


            If reloadall OrElse ismember(whichsplit, "CSR") Then
                If qt("Location") = "each" OrElse ((qt("Group") = "each" OrElse qt("Team") = "each") AndAlso (qt("model") <> "3")) Then
                    Using dt As New DataTable("Payperiod")
                        dt.Columns.Add(New DataColumn("key"))
                        dt.Columns.Add(New DataColumn("desc"))
                        Dim nr As DataRow = dt.NewRow()
                        nr("key") = "disabled"
                        nr("desc") = ""
                        dt.Rows.Add(nr)
                        dt.TableName = "CSR"
                        Dim ds As New DataSet("CSRs")
                        ds.Tables.Add(dt)
                        ds.WriteXml(writer)
                    End Using
                Else
                    If (qt("model") = "3") Then
                        'TODO: Can this be restricted by Agency, Office, Project, Location?
                        '  - What if the agent has been removed from their team/project?
                        '  - How are you going to handle unioning it with the inactive?

                        '---First Attempt - I think this retrieves everyone.
                        sql = "select USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when STAT='7' then ' (In Training)' else case when STAT='2' then '(Inactive)' else '' end end as [desc] from ("
                        sql &= " select us.USER_ID, us.LASTNM, us.FIRSTNM, us.STATUS as STAT" & _
                        " from KPI_HSTRY kh" & _
                        " inner join USR us on us.USER_ID=kh.USER_ID" & _
                        " inner join TEAM tm on tm.team_id=kh.team_id" & _
                        " inner join GRP gp on gp.group_id=tm.group_id" & _
                        " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                        " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                        "EQUAL(lc.LOC_ID,Location)**/" & _
                        " group by us.user_id, us.lastnm,us.firstnm,us.status"
                        sql &= " ) comp" & _
                                " order by LASTNM,FIRSTNM;"

                        '---Second Attempt - Similar to open role search, but with inactive people added (for the time frame) and agency/ofofice criteria added.
                        If boxrole = "" Then
                            sql = "select USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when STAT='7' then ' (In Training)' else case when STAT='2' then '(Inactive)' else '' end end as [desc] from ("
                            If qt("StartDate") <> "" Then
                                sql &= " select us.USER_ID, us.LASTNM, us.FIRSTNM, us.STATUS as STAT" & _
                                " from KPI_HSTRY kh" & _
                                " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                                " LEFT OUTER JOIN USR_JSON uja on uja.user_id=kh.user_id and uja.[key]='employment' and uja.name='recruitedBy'" & _
                                " LEFT OUTER JOIN USR_JSON ujo on ujo.user_id=kh.user_id and ujo.[key]='employment' and ujo.name='recruitingOffice'" & _
                                " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                "EQUAL(pj.ProjectID,Project)" & _
                                "EQUAL(lc.LOC_ID,Location)" & _
                                "EQUAL(uja.val,Agency)" & _
                                "EQUAL(ujo.val,Agencyoffice)**/" & _
                                " UNION"
                            End If
                            sql &= " select us.USER_ID, us.LASTNM, us.FIRSTNM, us.STATUS as STAT" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " LEFT OUTER JOIN USR_JSON uja on uja.user_id=us.user_id and uja.[key]='employment' and uja.name='recruitedBy'" & _
                                " LEFT OUTER JOIN USR_JSON ujo on ujo.user_id=us.user_id and ujo.[key]='employment' and ujo.name='recruitingOffice'" & _
                                " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))," & _
                                "EQUAL(lc.LOC_ID,Location)" & _
                                "EQUAL(uja.val,Agency)" & _
                                "EQUAL(ujo.val,Agencyoffice)**/" & _
                                " ) comp" & _
                                " order by LASTNM,FIRSTNM;"
                        End If
                    Else
                        If boxrole = "" Then
                            sql = "select USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when STAT='7' then ' (In Training)' else '' end as [desc] from ("
                            If qt("StartDate") <> "" Then
                                sql &= " select distinct us.USER_ID, us.LASTNM, us.FIRSTNM, us.STATUS as STAT" & _
                                " from KPI_HSTRY kh" & _
                                " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.loc_id=gp.loc_id"
                                If checkloc Then
                                    sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                                End If
                                sql &= " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                "EQUAL(pj.ProjectID,Project)" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)" & _
                                "EQUAL(tm.TEAM_ID,Team)**/" & _
                                " UNION"
                            End If
                            sql &= " select distinct us.USER_ID, us.LASTNM, us.FIRSTNM, us.STATUS as STAT" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID"
                            If checkloc Then
                                sql &= " inner join usr_loc ul on ul.loc_id=lc.loc_id and ul.user_id='" & qt("username") & "'"
                            End If
                            sql &= " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)" & _
                                "EQUAL(tm.TEAM_ID,Team)**/" & _
                                " ) comp" & _
                                " order by LASTNM,FIRSTNM;"
                        ElseIf boxrole = "Group Leader" Then
                            If qt("suprestrict") = "Y" Then
                                sql = "select 0 as seq,us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)," & _
                                "EQUAL(gp.SPVR_USER_ID,username)," & _
                                "EQUAL(tm.TEAM_ID,Team))**/"
                                If (qt("Group") <> "") Then 'Avoid Initial Pass
                                    sql &= " UNION select 1 as seq,us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                            " from USR us" & _
                                            " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                            " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                            " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                            " inner join SPVR_GRP sgp on sgp.group_id=gp.group_id and sgp.user_id='" & db.reap(qt("username")) & "'" & _
                                            " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                            " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                            " where us.STATUS<>'2'" & _
                                            " AND gp.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                                            " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                            "EQUAL(lc.LOC_ID,Location)," & _
                                            "EQUAL(gp.GROUP_ID,Group)," & _
                                            "EQUAL(tm.TEAM_ID,Team))**/"
                                End If
                                sql &= " order by seq,[desc];"
                            Else
                                sql = "select distinct us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)," & _
                                "EQUAL(tm.TEAM_ID,Team))**/" & _
                                " order by [desc];"
                            End If
                        ElseIf boxrole = "Team Leader" OrElse InSpvrSet(qt("team"), spvr_team_ids_subset) Then
                            If qt("suprestrict") = "Y" Or _peerevaluate Then
                                sql = "select 0 as seq,us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)," & _
                                "EQUAL(tm.TEAM_ID,Team))**/" & _
                                        " AND (( 1=1 " & _
                                        " /**ANDBLOCK(EQUAL(tm.SPVR_USER_ID,username))**/" & _
                                        " ) OR tm.team_id in (" & spvr_team_ids & ") ) "
                                If (qt("Group") <> "") Then 'Avoid Initial Pass
                                    sql &= " UNION select 1 as seq,us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                            " from USR us" & _
                                            " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                            " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                            " inner join SPVR_TEAM stm on stm.team_id=tm.team_id and stm.user_id='" & db.reap(qt("username")) & "'" & _
                                            " inner join GRP gp on gp.group_id=tm.group_id and gp.status in ('A','M')" & _
                                            " inner join LOC lc on lc.LOC_ID = gp.LOC_ID and lc.status='A'" & _
                                            " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                            " where us.STATUS<>'2'" & _
                                            " AND tm.SPVR_USER_ID <> '" & db.reap(qt("username")) & "'" & _
                                            " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                            "EQUAL(lc.LOC_ID,Location)," & _
                                            "EQUAL(gp.GROUP_ID,Group)," & _
                                            "EQUAL(tm.TEAM_ID,Team))**/"
                                End If
                                sql &= " order by seq,[desc];"
                            Else
                                sql = "select distinct us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)," & _
                                "EQUAL(tm.TEAM_ID,Team))**/" & _
                                " order by [desc];"
                            End If
                        ElseIf boxrole = "CSR" Then
                            spvr_substitution = False
                            If (spvr_team_ids_subset <> "0") Then 'See if the current team is in the list of spvr_team_ids
                                If qt("Team") <> "" Then
                                    'sql = "select tm.team_id" & _
                                    '" from TEAM tm" & _
                                    '" inner join GRP gp on gp.group_id=tm.group_id" & _
                                    '" inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                    '" inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                    '" where tm.team_id in (" & spvr_team_ids & ")" & _
                                    '" /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                    '"EQUAL(lc.LOC_ID,Location)," & _
                                    '"EQUAL(gp.GROUP_ID,Group)," & _
                                    '"EQUAL(tm.TEAM_ID,Team))**/"
                                    sql = "select team_id from team where team_id in (" & spvr_team_ids_subset & ") and team_id in (" & qt("Team") & ")"
                                Else 'If team is blank then you're checking to to see if the CSR is a spvr of their own team.
                                    sql = "select team_id from usr_team where user_id='" & qt("username") & "' and team_id in (" & spvr_team_ids_subset & ")"
                                End If 'duck
                                sql = substituteparams(sql) 'No hiproject here, would implicitly return no CSRs, which is the desired result.
                                Using dts As DataTable = db.GetDataTable(sql)
                                    If dts.Rows.Count > 0 Then
                                        spvr_substitution = True
                                    End If
                                End Using
                            End If
                            If spvr_substitution Then
                                sql = "select distinct us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where us.STATUS<>'2'" & _
                                " AND tm.TEAM_ID in (" & spvr_team_ids & ")" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)," & _
                                "EQUAL(tm.TEAM_ID,Team))**/" & _
                                " order by [desc];"
                            ElseIf qt("suprestrict") = "Y" Then 'CSRsuprestrict
                                sql = "select us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                                            " from USR us" & _
                                                            " /**WHEREBLOCK(EQUAL(us.USER_ID,username))**/"
                            Else
                                sql = "select distinct us.USER_ID as [key],LASTNM + ', ' + FIRSTNM + case when us.STATUS='7' then ' (In Training)' else '' end as [desc]" & _
                                " from USR us" & _
                                " inner join USR_TEAM ut on ut.USER_ID=us.USER_ID" & _
                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                " inner join LOC lc on lc.LOC_ID = gp.LOC_ID" & _
                                " inner join PROJECT pj on pj.ProjectID = gp.PROJECT_ID" & _
                                " where us.STATUS<>'2'" & _
                                " /**ANDBLOCK(EQUAL(pj.ProjectID,Project))" & _
                                "EQUAL(lc.LOC_ID,Location)," & _
                                "EQUAL(gp.GROUP_ID,Group)," & _
                                "EQUAL(tm.TEAM_ID,Team))**/" & _
                                " order by [desc];"
                            End If
                        End If
                    End If
                    sql = substituteparams(sql) 'No hiproject here, would implicitly return no CSRs, which is the desired result.
                    Using dt As DataTable = db.GetDataTable(sql)
                        dt.DataSet.DataSetName = "CSRs"
                        dt.TableName = "CSR"
                        dt.WriteXml(writer)
                    End Using
                End If
            End If
            If reloadall OrElse ismember(whichsplit, "KPI") Then
                Dim scorecardquery = " and (mq.scorecard is null or mq.scorecard = '1') "
                If qt("scorecard").Split(",")(0) <> "" And qt("scorecard").Split(",")(0) <> "1" Then
                    scorecardquery = " and mq.scorecard = '" & db.reap(qt("scorecard").Split(",")(0)) & "' "
                End If
                If urlprefix() <> "cox." Then scorecardquery = ""

                If (qt("isdashboard") <> "") AndAlso CONFMGR.AppSettings(urlprefix() & "client") = "51" Then 'Category machinery
                    sql = "SET ARITHABORT ON;with kpilist as (select k.id as id,clump = stuff((select ',' + cast(/*idkpi*/kk.mqf# as varchar) from /*kpi_klb*/kpi_mqf kk inner join /*klb*/kpi_category klb on klb.id=/*kk.idklb*/kk.kpi_category where k.id=klb.id /*add:*/and kk.line#='1' and kk.level#='1' for xml path(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') from /*klb*/kpi_category k)" & _
                        " Select distinct k.clump as [key],'All ' + klb.txt as [desc],1 as section" & _
                        " from kpi_mqf mq" & _
                        " inner join kpi_category klb on klb.id=mq.kpi_category" & _
                        " inner join kpilist k on k.id=klb.id" & _
                        " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                        " /**ANDBLOCK(EQUAL(mq.Project_id,Project)**/" & _
                        " group by klb.id,klb.txt,k.clump" & _
                        " UNION" & _
                        " select cast(mq.MQF# as varchar) as [key], mq.TXT + ' ' + cast(CAST((mq.WEIGHT_FACTOR*100) as decimal) as varchar(5)) + '%' AS [desc],2 as section" & _
                        " from KPI_MQF mq" & _
                        " inner join PROJECT pj on pj.projectID=mq.project_id" & _
                        " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                        scorecardquery & _
                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project)**/" & _
                        " group by mq.MQF#,mq.TXT,mq.WEIGHT_FACTOR" & _
                        " order by section,[desc]"
                ElseIf (qt("isdashboard") <> "") AndAlso (urlprefix() = "nex.") Then 'Labels machinery
                    sql = " select 'eachlabel' as [key],'(Each Label)' as [desc], 0 as section" & _
                        " UNION" & _
                        " Select distinct 'label_' + cast(klb.id as varchar) as [key],'Label:' + klb.name as [desc],1 as section" & _
                        " from kpi_mqf mq" & _
                        " inner join kpi_klb kk on kk.idkpi=mq.mqf#" & _
                        " inner join klb on klb.id=kk.idklb" & _
                        " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                        " /**ANDBLOCK(EQUAL(mq.Project_id,Project)**/" & _
                        " group by klb.id,klb.name" & _
                        " UNION" & _
                        " select cast(mq.MQF# as varchar) as [key], mq.TXT + ' ' + cast(CAST((mq.WEIGHT_FACTOR*100) as decimal) as varchar(5)) + '%' AS [desc],2 as section" & _
                        " from KPI_MQF mq" & _
                        " inner join PROJECT pj on pj.projectID=mq.project_id" & _
                        " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                        scorecardquery & _
                        " /**ANDBLOCK(EQUAL(pj.ProjectID,Project)**/" & _
                        " group by mq.MQF#,mq.TXT,mq.WEIGHT_FACTOR" & _
                        " order by section,[desc]"
                ElseIf qt("Model") = "3" Then 'Model 3 (Source) has a single "Project", and the Project filter is used to filter CSRs, not for the scoring basis.
                    sql = "select mq.MQF# as [key], mq.TXT + ' ' + cast(CAST((mq.WEIGHT_FACTOR*100) as decimal) as varchar(5)) + '%' AS [desc]" & _
                          " from KPI_MQF mq" & _
                          " inner join PROJECT pj on pj.projectID=mq.project_id" & _
                          " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                          " AND pj.model_id='3'" & _
                          " group by mq.MQF#,mq.TXT,mq.WEIGHT_FACTOR" & _
                          " order by mq.TXT;"
                Else
                    sql = "select mq.MQF# as [key], mq.TXT + ' ' + cast(CAST((mq.WEIGHT_FACTOR*100) as decimal) as varchar(5)) + '%' AS [desc]" & _
                          " from KPI_MQF mq" & _
                          " inner join PROJECT pj on pj.projectID=mq.project_id" & _
                          " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                          scorecardquery & _
                          " /**ANDBLOCK(EQUAL(pj.ProjectID,Project)**/" & _
                          " group by mq.MQF#,mq.TXT,mq.WEIGHT_FACTOR" & _
                          " order by mq.TXT;"
                End If
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "KPIs"
                    dt.TableName = "KPI"
                    dt.WriteXml(writer)
                End Using
            End If

            If reloadall OrElse ismember(whichsplit, "SubKPI") Then
                If qt("KPI") = "" Or qt("KPI") = "each" Then
                    sql = "select '' as [key],'' as [desc] from subtype where (1=0);"
                Else
                    sql = "select st.SubTypeID as [key],st.SubTypeDesc as [desc]" & _
                        " from kpi_mqf mq" & _
                        " inner join subtype st on st.kpi_id=mq.mqf#" & _
                        " where (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                        " /**ANDBLOCK(EQUAL(mq.MQF#,KPI)**/" & _
                        " order by st.SubTypeDesc;"
                End If
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "SubKPIs"
                    dt.TableName = "SubKPI"
                    dt.WriteXml(writer)
                End Using
            End If

            If reloadall OrElse ismember(whichsplit, "Xaxis") Then
                Using dt As New DataTable("Xaxis")
                    dt.Columns.Add(New DataColumn("key"))
                    dt.Columns.Add(New DataColumn("desc"))
                    Dim nr As DataRow = dt.NewRow()
                    nr("key") = "KPI"
                    nr("desc") = "KPI"
                    dt.Rows.Add(nr)
                    Using dat As DataTable = db.GetDataTable("select * from iv_type")
                        For Each rowdat As DataRow In dat.Rows
                            nr = dt.NewRow()
                            nr("key") = "each_" & rowdat("id").ToString
                            nr("desc") = rowdat("name")
                            dt.Rows.Add(nr)
                        Next
                    End Using
                    'nr = dt.NewRow()
                    'nr("key") = "Month"
                    'nr("desc") = "Month"
                    'dt.Rows.Add(nr)
                    'nr = dt.NewRow() 'Not finished, take out for now.
                    'nr("key") = "CSR"
                    'nr("desc") = "CSR"
                    'dt.Rows.Add(nr)
                    dt.TableName = "Xaxis"
                    Dim ds As New DataSet("Xaxiss")
                    ds.Tables.Add(dt)
                    ds.WriteXml(writer)
                End Using
            End If

            If reloadall OrElse ismember(whichsplit, "Trendby") Then
                Using dt As New DataTable("Trendby")
                    dt.Columns.Add(New DataColumn("key"))
                    dt.Columns.Add(New DataColumn("desc"))
                    Dim nr As DataRow
                    If qt("Model") = "3" Then
                        sql = "select t.id,t.name from iv_type t where name = 'Month'" 'TODO: This is not general (ERS-Specific), to generalize I need a place to store it (like a setting).
                    Else
                        sql = "select t.id,t.name from iv_type t inner join iv_project p on p.ivid = t.id /**WHEREBLOCK(EQUAL(p.projectid,Project)**/"
                    End If
                    sql = substituteparams(sql, hiproject:=hiproject)
                    Using dat As DataTable = db.GetDataTable(sql)
                        For Each rowdat As DataRow In dat.Rows
                            nr = dt.NewRow()
                            nr("key") = rowdat("id").ToString
                            nr("desc") = rowdat("name")
                            dt.Rows.Add(nr)
                        Next
                    End Using
                    dt.TableName = "Trendby"
                    Dim ds As New DataSet("Trendbys")
                    ds.Tables.Add(dt)
                    ds.WriteXml(writer)
                End Using
            End If

            If ismember(whichsplit, "Evaluator") Then
                sql = "select innerkey as [key],uso.LASTNM + ', ' + uso.FIRSTNM + case when uso.STATUS='7' then ' (In Training)' else '' end as [desc] from" & _
                        " (select DISTINCT us2.user_id as innerkey" & _
                        " from MONITOR_HSTRY mh" & _
                        " inner join USR us on mh.user_id=us.user_id" & _
                        " inner join USR us2 on mh.entby=us2.user_id" & _
                        " inner join PROJECT pj on pj.projectID=mh.project_id" & _
                        " inner join TEAM tm on tm.team_id=mh.team_id" & _
                        " inner join GRP gp on gp.group_id=tm.group_id" & _
                        " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                        " inner join kpi_hstry kh on mh.monitor_id=kh.reference_id" & _
                        " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                       " EQUAL(pj.ProjectID,Project)" & _
                       " EQUAL(lc.LOC_ID,Location)" & _
                       " EQUAL(gp.GROUP_ID,Group)" & _
                       " EQUAL(tm.TEAM_ID,Team)" & _
                       " EQUAL(us.USER_ID,CSR)**/" & _
                       " ) ij" & _
                       " inner join USR uso on uso.user_id=innerkey" & _
                       " order by uso.LASTNM,uso.FIRSTNM;"
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "Evaluators"
                    dt.TableName = "Evaluator"
                    dt.WriteXml(writer)
                End Using
            End If


            'TODONOW: DONE? - Do a union with the global forms.
            If ismember(whichsplit, "Qualityform") Then
                sql = "select mns.SQF_CODE as [key],mns.SQF_NAME as [desc],case when mns.status='A' then 1 else case when mns.status='L' then 1 else case when mns.status='I' then 100 else 0 end end end as displaystatus" & _
                    " from MONITOR_SQFCODE mns" & _
                   " inner join PROJECT pj on pj.projectID=mns.project_id" & _
                    " /**WHEREBLOCK(EQUAL(pj.ProjectID,Project))," & _
                    "**/" & _
                    " UNION select mns.SQF_CODE as [key],'GLOBAL: ' + mns.SQF_NAME as [desc],case when mns.status='A' then 1 else case when mns.status='L' then 1 else case when mns.status='I' then 100 else 0 end end end as displaystatus" & _
                    " from MONITOR_SQFCODE mns" & _
                   " where mns.project_id='0'" & _
                    " order by displaystatus,mns.SQF_NAME;"
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "Qualityforms"
                    dt.TableName = "Qualityform"
                    dt.WriteXml(writer)
                End Using
            End If

            'TODONOW: - DONE? - Do a union with the global form here also.
            If ismember(whichsplit, "Quizname") Then
                sql = "select ems.SQF_CODE as [key],ems.SQF_NAME as [desc]" & _
                    " from EMP_SQFCODE ems" & _
                   " inner join PROJECT pj on pj.projectID=ems.project_id" & _
                    " /**WHEREBLOCK(EQUAL(pj.ProjectID,Project))," & _
                    "**/" & _
                    " UNION select ems.SQF_CODE as [key],'GLOBAL: ' + ems.SQF_NAME as [desc]" & _
                    " from EMP_SQFCODE ems" & _
                   " inner join PROJECT pj on pj.projectID=ems.project_id" & _
                   " where pj.ProjectID='0'" & _
                    " order by ems.SQF_NAME;"
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "Quiznames"
                    dt.TableName = "Quizname"
                    dt.WriteXml(writer)
                End Using
            End If

            'TODONOW: - Do a union with the global form here also.

            If ismember(whichsplit, "Skillarea") Then 'TODO:  I don't like this search.  Make this more correct.
                sql = "select distinct mnq.mqf# as [key],mnq.Txt as [desc]" & _
                    " from monitor_hstry mnh" & _
                    " inner join monitor_resp mnr on mnr.monitor_id = mnh.monitor_id and mnr.yes_flag='Y'" & _
                    " inner join monitor_mqf mnq on mnr.mqf#=mnq.mqf# and mnq.line#=1 and mnq.level#=1 AND mnq.TXT<>''" & _
                    " inner join monitor_sqfcode mns on mnr.sqf_code=mns.sqf_code" & _
                   "  inner join PROJECT pj on pj.projectID=mns.project_id" & _
                    " /**WHEREBLOCK(EQUAL(pj.ProjectID,Project))," & _
                    "EQUAL(mns.sqf_code, Qualityform)" & _
                    "**/" & _
                    " UNION select distinct mnq.mqf# as [key],'GLOBAL: ' + mnq.Txt as [desc]" & _
                    " from monitor_hstry mnh" & _
                    " inner join monitor_resp mnr on mnr.monitor_id = mnh.monitor_id and mnr.yes_flag='Y'" & _
                    " inner join monitor_mqf mnq on mnr.mqf#=mnq.mqf# and mnq.line#=1 and mnq.level#=1 AND mnq.TXT<>''" & _
                    " inner join monitor_sqfcode mns on mnr.sqf_code=mns.sqf_code" & _
                   "  inner join PROJECT pj on pj.projectID=mns.project_id" & _
                   " where pj.ProjectID='0'" & _
                    " /**ANDBLOCK(mns.sqf_code, Qualityform)**/" & _
                   " order by mnq.Txt;"
                sql = substituteparams(sql)
                Using dt As DataTable = db.GetDataTable(sql)
                    dt.DataSet.DataSetName = "Skillareas"
                    dt.TableName = "Skillarea"
                    dt.WriteXml(writer)
                End Using
            End If

            If ismember(whichsplit, "ACDDate") Then 'TODO:  I don't like this search.  Make this more correct.
                'WAS:
                'sql = "select distinct convert(varchar(10),segstart, 101) as [key],convert(varchar(10),segstart, 101) as [desc] from cms_raw order by [key] desc"
                'sql = substituteparams(sql)
                'Using dt As DataTable = db.GetDataTable(sql)
                '    dt.DataSet.DataSetName = "ACDDates"
                '    dt.TableName = "ACDDate"
                '    dt.WriteXml(writer)
                'End Using

                'IS:
                Dim ds As New DataSet("ACDDates")
                Dim dt As New DataTable()
                Dim dc As New DataColumn("key")
                dt.Columns.Add(dc)
                dc = New DataColumn("desc")
                dt.Columns.Add(dc)

                Dim sd As Date = Date.Now().Date 'Note: This will include today - this is important since this is used for more than just querying the CMS tables now.
                Dim ed As Date = Convert.ToDateTime("07/01/2011")
                While sd >= ed
                    Dim dr As DataRow = dt.NewRow()
                    dr.Item("key") = sd.Month.ToString.PadLeft(2, "0") & "/" & sd.Day.ToString.PadLeft(2, "0") & "/" & sd.Year.ToString.PadLeft(4, "0")
                    dr.Item("desc") = dr.Item("key")
                    dt.Rows.Add(dr)
                    sd = sd.AddDays(-1)
                End While
                dt.TableName = "ACDDate"
                ds.Tables.Add(dt)
                ds.WriteXml(writer)
            End If

            'EQUAL(mns.sqf_code, Qualityform)

            writer.WriteEndElement()
            writer.WriteEndDocument()
            writer.Close()
            sbXML = sbXML.Replace("encoding=""utf-16""", "")
            Return sbXML.ToString
        End Using

    End Function

    Private Function substituteparams(ByVal sql As String, Optional hiproject As String = "") As String
        Dim bld As String = ""
        While sql.IndexOf("/**") >= 0
            bld &= sql.Substring(0, sql.IndexOf("/**"))

            Dim wk As String = sql.Substring(sql.IndexOf("/**") + 3)
            wk = wk.Substring(0, wk.IndexOf("**/"))
            Dim tk As String = "WHEREBLOCK"
            Dim sep(5) As Char
            sep(0) = "{"
            sep(1) = ","
            sep(2) = "("
            sep(3) = ")"
            sep(4) = "}"
            Dim wksplit() As String = wk.Split(sep)
            '"{{CONDITIONBLOCK{DATERANGE{kh.RESPDT,StartDate,EndDate}}}"
            Dim n As Integer = 0

            Dim whereblock As Boolean = False
            Dim daterangeq As Boolean = False
            Dim equalq As Boolean = False
            Dim firstcondition As Boolean
            While n < wksplit.Length
                If wksplit(n).Trim = "WHEREBLOCK" Then
                    whereblock = True
                    firstcondition = True
                    n += 1
                ElseIf wksplit(n).Trim = "ANDBLOCK" Then
                    whereblock = True
                    firstcondition = False
                    n += 1
                Else
                    If whereblock Then
                        If wksplit(n).Trim = "DATERANGE" Then
                            daterangeq = True
                            n += 1
                        ElseIf wksplit(n).Trim = "EQUAL" Then
                            equalq = True
                            n += 1
                        Else
                            If daterangeq Then
                                If (n + 3) <= wksplit.Length Then
                                    bld &= daterangesubstitution(firstcondition, wksplit(n).Trim, wksplit(n + 1).Trim, wksplit(n + 2).Trim)
                                    n += 3
                                Else
                                    n += 1
                                End If
                                daterangeq = False
                            ElseIf equalq Then
                                If (n + 2) <= wksplit.Length Then
                                    bld &= equalsubstitution(firstcondition, wksplit(n).Trim, wksplit(n + 1).Trim, hiproject:=hiproject)
                                    n += 2
                                Else
                                    n += 1
                                End If
                            Else
                                n += 1
                            End If
                        End If
                    Else
                        n += 1
                    End If
                End If
            End While
            sql = sql.Substring(sql.IndexOf("**/") + 3)
        End While
        bld &= sql
        Return bld

    End Function

    '"{{CONDITIONBLOCK{DATERANGE{kh.RESPDT,StartDate,EndDate}}}"
    Private Function daterangesubstitution(ByRef firstcondition As Boolean, variable As String, stname As String, edname As String) As String
        Dim bld As String = ""
        If qt(stname) <> "" Then
            If qt(edname) <> "" Then
                If firstcondition Then
                    bld &= " WHERE "
                Else
                    bld &= " AND "
                End If
                firstcondition = False
                If qt(stname).Length >= 4 AndAlso qt(stname).Substring(0, 4) = "each" Then
                    bld &= variable & " >= '" & _earliestdate.ToShortDateString & "' AND " & variable & " <= '" & Date.Now.Date.ToShortDateString & "' "
                Else
                    bld &= variable & " >= '" & qt(stname) & "' AND " & variable & " <= '" & qt(edname) & "' "
                End If
            End If
        End If
        Return bld

        'Dim bld As String = ""
        'If _context.Request.QueryString(stname) IsNot Nothing AndAlso _context.Request.QueryString(stname) <> "" Then
        '    If _context.Request.QueryString(edname) IsNot Nothing AndAlso _context.Request.QueryString(edname) <> "" Then
        '        If firstcondition Then
        '            bld &= " WHERE "
        '        Else
        '            bld &= " AND "
        '        End If
        '        firstcondition = False
        '        bld &= variable & " >= '" & _context.Request.QueryString(stname) & "' AND " & variable & " <= '" & _context.Request.QueryString(edname) & "' "
        '    End If
        'End If
        'Return bld
    End Function

    Private Function equalsubstitution(ByRef firstcondition As Boolean, variable As String, name As String, Optional hiproject As String = "") As String
        Dim bld As String = ""
        Dim isproject As Boolean = (name.ToUpper = "PROJECT")
        If qt(name) <> "" AndAlso qt(name) <> "each" Then
            If (Not isproject) OrElse (isproject And (qt(name) <> "0")) Then
                If firstcondition Then
                    bld &= " WHERE "
                Else
                    bld &= " AND "
                End If
                firstcondition = False
                'MODIFIED 2017-03-7 - Change = 'X' to be IN ('X').  This should work in all cases.
                'WAS:
                'If name = "Project" AndAlso hiproject <> "" Then
                'bld &= variable & " = '" & hiproject & "' "
                'Else
                'bld &= variable & " = '" & qt(name) & "' "
                'End If
                If name = "Project" AndAlso hiproject <> "" Then
                    bld &= variable & " IN ('" & hiproject & "') "
                Else
                    bld &= variable & " IN ("
                    Dim sp() As String = qt(name).Split(",")
                    Dim first As Boolean = True
                    For i As Integer = 0 To sp.Length - 1
                        If Not first Then bld &= ","
                        bld &= "'" & sp(i) & "'"
                        first = False
                    Next
                    bld &= ")"
                End If
            End If
        End If
        Return bld

        'Dim bld As String = ""
        'If _context.Request.QueryString(name) IsNot Nothing AndAlso _context.Request.QueryString(name) <> "" Then
        '    If firstcondition Then
        '        bld &= " WHERE "
        '    Else
        '        bld &= " AND "
        '    End If
        '    firstcondition = False
        '    bld &= variable & " = '" & _context.Request.QueryString(name) & "' "
        'End If
        'Return bld
    End Function

    Private Function qt(str As String) As String
        If _context.Request.QueryString(str) Is Nothing Then
            Return ""
        Else
            Return _context.Request.QueryString(str)
        End If
    End Function

    Private Function ismember(str() As String, label As String) As Boolean
        Try
            For Each st As String In str
                Dim sts() As String = st.Split("/")
                If label = "Payperiod" Then
                    If sts.Length > 1 Then
                        For i As Integer = 1 To sts.Length - 1
                            Select Case sts(i).ToLower
                                Case "month", "payperiod"
                                    _periodrestrict = sts(i).ToLower
                            End Select
                        Next
                    End If
                End If
                If sts(0) = label Then
                    Return True
                End If
            Next
        Catch ex As Exception

        End Try
        Return False
    End Function

    Private Function InSpvrSet(str As String, splitstr As String) As Boolean
        Dim ss() = splitstr.Split(",")
        For Each s As String In ss
            If s = str Then
                Return True
            End If
        Next
        Return False
    End Function

    Public Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function

End Class
