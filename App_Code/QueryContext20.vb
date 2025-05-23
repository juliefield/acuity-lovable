Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports System.Web.Script.Serialization
Imports jglib

'Things that need updated in query15.
'   The Decimal conversions for the Score and Raw
'   Pass mq.FMT when xaxis=kpi
'   pass weight as Count for subkpi (AHT).
'   ...There may be more.

Public Class QueryContext20
    Private _connection As String = ""
    Private _utilities As String = ""
    Private _client As String = ""
    Private _scope As String = ""
    Private CONFMGR As ConfMgr = New ConfMgr()

    Private _context As HttpContext
    Public Sub New(ByRef context As HttpContext)
        _context = context
    End Sub

    'Private _intervaltable As String = "ABC_PAYPERIODS"
    Private _agencys() As String = Nothing
    Private _agencyoffices() As String = Nothing
    Private _projects() As String = Nothing
    Private _locations() As String = Nothing
    Private _groups() As String = Nothing
    Private _teams() As String = Nothing
    Private _CSRs() As String = Nothing
    Private _KPIs() As String = Nothing
    Private _SubKPIs() As String = Nothing
    Private _Payperiods() As String = Nothing
    Private _locationsCount As Integer = 0
    Private _agencysCount As Integer = 0
    Private _agencyofficesCount As Integer = 0
    Private _projectsCount As Integer = 0
    Private _groupsCount As Integer = 0
    Private _teamsCount As Integer = 0
    Private _CSRsCount As Integer = 0
    Private _KPIsCount As Integer = 0
    Private _SubKPIsCount As Integer = 0
    Private _PayperiodsCount As Integer = 0
    Private _earliestdate As Date = Convert.ToDateTime("2011-01-01")

    Private _y As String = "KPI_SCORE"

    Private _up As String = Nothing

    Private _zerofill As ArrayList = Nothing

    Private NoAggregation As Boolean = False

    Private Class zerofill
        Public _name As String
        Public _cnt As Integer
        Public _val As ArrayList
        Public _sort As Integer
        Public _i As Integer
        Public Sub New(name As String)
            _name = name
            _cnt = 0
            _sort = 0
            _val = New ArrayList
        End Sub
    End Class

    Private _zf(10) As zerofill
    Private _zfcnt As Integer

    Private Class xaxis
        Public _key As String
        Public _selectx As String
        Public _groupx As String
        Public _orderx As String
        Public _selectxALL As String
        Public _groupxALL As String
        Public _orderxALL As String
        Public Sub New(key As String, selectx As String, groupx As String, orderx As String, selectxAll As String, groupxAll As String, orderxAll As String)
            _key = key
            _selectx = " " & selectx & " "
            _groupx = " " & groupx & " "
            _orderx = " " & orderx & " "
            _selectxALL = " " & selectxAll & " "
            _groupxALL = " " & groupxAll & " "
            _orderxALL = " " & orderxAll & " "
        End Sub
    End Class

    Private _xes As xaxis
    Private _interval As String = "1"
    Private _tier As String = "1"

    Private _killhighfilters As Boolean = False

    Public Function ProcessRequest() As String
        _context.Response.ContentType = "text/xml"
        _up = urlprefix()

        Try
            _client = CONFMGR.AppSettings(_up & "ClientID_V2")
            _connection = CONFMGR.ConnectionStrings(_up & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            _utilities = CONFMGR.ConnectionStrings(_up & "Utilities").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            If qt("Connection") <> "" Then
                _connection = CONFMGR.ConnectionStrings(_up & qt("Connection")).ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            End If
        Catch ex As Exception

        End Try

        Dim _scope As String = "CSR"
        If _context.Request.QueryString("CSR") = "" Then
            _scope = "Team"
            If _context.Request.QueryString("Team") = "" Then
                _scope = "Group"
                If _context.Request.QueryString("Group") = "" Then
                    _scope = "Location"
                    If _context.Request.QueryString("Location") = "" Then
                        _scope = "Project"
                    End If
                End If
            End If
        End If

        Dim mytier As String = "Tier 1"

        Dim FilterOrTrend As String = "Filter"

        'FORGRID
        Dim FilterComposite As String = ""
        If _up = "cox." Then
            If (qt("scorecard") <> "") Then
                If FilterComposite <> "" Then FilterComposite &= "&"
                FilterComposite &= "scorecard=" & qt("scorecard").Split(",")(0)
            End If
        End If
        If _context.Request.QueryString("CSR") = "" Then '_client = "47" Then
            If (qt("InTraining") <> "") Then
                If FilterComposite <> "" Then FilterComposite &= "&"
                FilterComposite &= "InTraining=" & qt("InTraining").Split(",")(0)
            End If
            If (qt("AgentStatus") <> "") AndAlso (qt("AgentStatus") <> "null") Then
                If FilterComposite <> "" Then FilterComposite &= "&"
                FilterComposite &= "AgentStatus=" & qt("AgentStatus").Split(",")(0)
            End If
            If (qt("hiredate") <> "") Then
                If FilterComposite <> "" Then FilterComposite &= "&"
                FilterComposite &= "hiredate=" & qt("Hiredate")
            End If
            If (qt("Filterbuild") <> "") Then
                If FilterComposite <> "" Then FilterComposite &= "&"
                FilterComposite &= qt("Filterbuild")
            End If
        ElseIf _up = "collective-solution." Then 'Model 4 testing only on collective-solution for now.
            If qt("model") = "3" OrElse qt("model") = "4" Then 'Only Model 4 (and I guess 3) requires a Model= if the CSR=all.  Model 2 has no CSR level.
                If FilterComposite <> "" Then FilterComposite &= "&"
                FilterComposite &= "Model=" & qt("Model")
            End If
        End If

        'DEBUG
        'If _up = "collective-solution." Then
        'Using db As New DbBaseSql(_connection)
        'db.Update("insert into goldencrm.dbo.err (msg,client,entdt) values ('DEBUG2: filtercomposite=" & db.reap(FilterComposite) & "',59,getdate())")
        'End Using
        'End If


        If (qt("Filterbuild") <> "") Then
            'This converts Filter0=13&Not0=Y to Not0=13 (which is what the dsp functions are expecting.
            'DONE: Client-side, produce a composite filter instead of doing it here (and in serverDVLib and serverTooltipLib).
            '   Alternatively, Dean can redo all of his, but you'll need to construct it anyway so the composite might as well convert too.
            Using db As New DbBaseSql(_connection)
                Using dt As DataTable = db.exec("SELECT FILTER_NAME from FILTER_TYPE where FILTER_ID='" & qt("Filter0") & "' and FILTER_NAME like '%Tier%'")
                    If dt.Rows.Count > 0 Then
                        mytier = dt.Rows(0).Item("FILTER_NAME")
                    End If
                End Using
            End Using
        Else
            If _context.Request.QueryString("CSR") <> "" AndAlso _context.Request.QueryString("CSR") <> "each" Then 'Turns out this IS needed.
                Using db As New DbBaseSql(_connection)
                    If (qt("daterange") = "") AndAlso _context.Request.QueryString("EndDate") <> "" Then
                        'Using dt As DataTable = db.exec("select ft.filter_name from usr_filter uf inner join filter_type ft on ft.filter_id=uf.filter_id where user_id='" & _context.Request.QueryString("CSR") & "' and filter_name like '%tier%'")
                        Using dt As DataTable = db.exec("select case when fth.filter_name is not null then fth.filter_name else ft.filter_name end as filter_name from usr_filter uf inner join filter_type ft on ft.filter_id=uf.filter_id left outer join usr_filter_hstry uh on uh.user_id=uf.user_id and uh.recdate=case when '" & _context.Request.QueryString("EndDate") & "' > cast(getdate() as date) then dateadd(d,-1,cast(getdate() as date)) else '" & _context.Request.QueryString("EndDate") & "' end left outer join filter_type fth on fth.filter_id=uh.filter_id where uf.user_id='" & _context.Request.QueryString("CSR") & "' and ft.filter_name like '%tier%' and (fth.filter_name is null or fth.filter_name like '%tier%')")
                            If dt.Rows.Count > 0 Then
                                mytier = dt.Rows(0).Item("FILTER_NAME")
                            End If
                        End Using
                    End If
                End Using
            ElseIf _context.Request.QueryString("CSR") = "" Then 'This is a rollup.  If scope=team, then see if all CSRs are in the same tier.
                Using db As New DbBaseSql(_connection)
                    If (qt("daterange") = "") AndAlso _context.Request.QueryString("EndDate") <> "" Then
                        If _context.Request.QueryString("Team") <> "" AndAlso _context.Request.QueryString("Team") <> "each" Then
                            Dim testtier As String = ""
                            Dim sametier As Boolean = True
                            Using dt As DataTable = db.exec("select case when fth.filter_name is not null then fth.filter_name else ft.filter_name end as filter_name from usr_filter uf inner join filter_type ft on ft.filter_id=uf.filter_id left outer join usr_filter_hstry uh on uh.user_id=uf.user_id and uh.recdate=case when '" & _context.Request.QueryString("EndDate") & "' > cast(getdate() as date) then dateadd(d,-1,cast(getdate() as date)) else '" & _context.Request.QueryString("EndDate") & "' end left outer join filter_type fth on fth.filter_id=uh.filter_id where uf.user_id in (select user_id from usr_team ut where ut.team_id in (" & _context.Request.QueryString("Team") & ")) and ft.filter_name like '%tier%' and (fth.filter_name is null or fth.filter_name like '%tier%')")
                                For Each row As DataRow In dt.Rows
                                    If testtier = "" Then
                                        testtier = row.Item("FILTER_NAME")
                                    End If
                                    If (testtier <> row.Item("FILTER_NAME")) Then
                                        sametier = False
                                        Exit For
                                    End If
                                Next
                            End Using
                            If sametier Then
                                mytier = testtier
                            End If
                        End If
                    End If
                    'TODO: Extend the logic to Group, Location, Project (if entire is in the same tier).
                End Using
            Else 'Each CSR.  TODO: Display a warning if all agents aren't on the same tier (ask them to select a tier).
            End If
        End If

        Select Case mytier
            Case "Tier 2"
                _tier = "2"
                Exit Select
            Case "Tier 3"
                _tier = "3"
                Exit Select
            Case "Tier 4"
                _tier = "4"
                Exit Select
        End Select

        'DONE: 9/25/2012 - Change the interval mechanism for each, etc.
        If _context.Request.QueryString("StartDate") IsNot Nothing AndAlso _context.Request.QueryString("StartDate").Length > 5 AndAlso _context.Request.QueryString("StartDate").Substring(0, 5) = "each_" Then
            _interval = _context.Request.QueryString("StartDate").Substring(5)
        Else
            'DONE: Attach this to the IV_LOCATION table.  For now, just make it a 1.
            Using db As New DbBaseSql(_connection)
                Using dt As DataTable = db.exec("select org_interval from org")
                    _interval = dt.Rows(0).Item(0).ToString
                End Using
            End Using
        End If

        'United temp teable Secondary catch (to be sure we get the date if it wasn't changed.
        'FORGRID
        'TODO: Turn on usr_CHECK_GRID_WH/FILTER based on ConfigParam USES_NUM_DENOM_CALC.

        If (True) Then 'urlprefix(True).IndexOf("mnt") <> 0 Then
            If (_client = "26") OrElse (_client = "29") OrElse (_client = "51") OrElse (_client = "43") OrElse (_client = "47") OrElse (_client = "48") OrElse (_client = "59") OrElse (_client = "60") OrElse (_client = "61") OrElse (_client = "67") OrElse (_client = "70") OrElse (_client = "72") Then
                If _context.Request.QueryString("StartDate") IsNot Nothing AndAlso _context.Request.QueryString("StartDate").Length > 5 AndAlso _context.Request.QueryString("StartDate").Substring(0, 5) <> "each_" Then
                    Using db As New DbBaseSql(_connection)
                        If False Then 'This is now obsolete
                            db.Update("exec usr_CHECK_GRID_WH '" & db.reap(_context.Request.QueryString("StartDate")) & "','" & db.reap(_context.Request.QueryString("EndDate")) & "',''")
                        End If
                    End Using
                Else
                    FilterOrTrend = "Trend" 'Trend functions don't use the grid tables.
                End If
            End If
            '2022-09-19: REMOVING OrElse (_client = "59") from this call (the scope is blank)
            '2023-02-23: Put "59" back in
            If (_client = "26") OrElse (_client = "29") OrElse (_client = "42") OrElse (_client = "43") OrElse (_client = "47") OrElse (_client = "48") OrElse (_client = "59") OrElse (_client = "60") OrElse (_client = "61") OrElse (_client = "63") OrElse (_client = "67") OrElse (_client = "70") OrElse (_client = "72") Then 'TODO: Is there a usr_CHECK_GRID_WH_FILTER for United?
                If _context.Request.QueryString("StartDate") IsNot Nothing AndAlso _context.Request.QueryString("StartDate").Length > 5 AndAlso _context.Request.QueryString("StartDate").Substring(0, 5) <> "each_" Then
                    Using db As New DbBaseSql(_connection)
                        db.Update("exec usr_CHECK_GRID_WH_FILTER '" & db.reap(_context.Request.QueryString("StartDate")) & "','" & db.reap(_context.Request.QueryString("EndDate")) & "','','" & FilterComposite & "'")
                    End Using
                Else
                    FilterOrTrend = "Trend" 'Trend functions don't use the grid tables.
                End If
            End If
        End If

        'Walgreens Trend functions call Trend.

        'Establishing consisent rules on whether to call Filter or Trend.  Starting with Walgreens.
        '-Any actual trend
        '_Any custom filter (Filterbuild)
        '_Hire Date (This should be unavailable if we don't have them, or if Dean doesn't process the filter for them.)
        '_AgentStatus  - What is this?  Do later, doesn't apply to Walgreens.
        If _context.Request.QueryString("CSR") = "" Then 'NEVER call Trend if looking at specific CSRs
            If (_client = "67") AndAlso ( _
                ((qt("daterange") <> "") AndAlso (qt("trendby") <> "0")) _
                 OrElse (qt("Filterbuild") <> "") _
                 OrElse (qt("hiredate") <> "")
               ) Then
                FilterOrTrend = "Trend"
            End If
        End If

        If qt("y") = "raw" Then
            _y = "RANGE"
        End If

        Dim sql As String = ""

        Dim whichsplit() As String = Nothing
        Dim reloadall As Boolean = True
        If _context.Request.QueryString("reload") IsNot Nothing AndAlso _context.Request.QueryString("reload") <> "" Then
            If _context.Request.QueryString("reload") <> "All" Then
                whichsplit = _context.Request.QueryString("reload").Split(",")
                reloadall = False
            End If
        End If
        Using db As New DbBaseSql(_connection)
            Dim sbXML As New StringBuilder
            Dim writer As XmlWriter = XmlWriter.Create(sbXML)
            writer.WriteStartElement("Query")

            If (_client = "44") Then 'accunetix-make40 apptrana (44)
                Dim ds As New DataSet("Communication")
                Dim dtmsg As New DataTable()
                dtmsg.Columns.Add("Message")
                Dim dr As DataRow = dtmsg.NewRow()
                dr("Message") = "vulnerability scan query20 bypass."
                dtmsg.Rows.Add(dr)
                dtmsg.TableName = "Alert"
                ds.Tables.Add(dtmsg)
                ds.WriteXml(writer)

                writer.WriteEndElement()
                writer.WriteEndDocument()
                writer.Close()
                sbXML = sbXML.Replace("encoding=""utf-16""", "")
                Return sbXML.ToString
            End If

            Dim alertmsg As String = ""
            Dim abort As Boolean = False
            Dim seriescount As Integer = 0
            'Added 12/28/2016 - Defeat Daily Trend Drilldown dailytrend
            If (qt("qid") = "KPITable") AndAlso (_context.Request.QueryString("StartDate") <> "") AndAlso (_context.Request.QueryString("StartDate") = _context.Request.QueryString("EndDate")) AndAlso (_client <> "47") AndAlso (_client <> "60") AndAlso (_client <> "61") Then
                abort = True
                alertmsg = "Drilling down on daily logs is not supported.  Please select a different 'Trend By' interval."

                'If qt("StartDate") <> "" Then
            End If

            'Added 2019-07-08
            'DONE: Bluegreen is blowing up on trend of agents, this is probably to blame.
            If (True) Then '((_client = "42" OrElse _client = "26" OrElse _client = "47")) Then 'Chime only for now.
                If _context.Request.QueryString("CSR") <> "each" AndAlso _context.Request.QueryString("CSR") <> "" Then
                    _killhighfilters = True
                End If
            End If

            If Not abort Then 'DONE: - add Agency, Agencyoffice, Project.  Will make fall-throughs if model<>3
                GetEach("Agency", _agencys)
                GetEach("Agencyoffice", _agencyoffices)
                GetEach("Project", _projects)
                GetEach("Location", _locations)
                GetEach("Group", _groups)
                GetEach("Team", _teams)
                GetEach("CSR", _CSRs)
                GetEach("KPI", _KPIs)
                GetEach("SubKPI", _SubKPIs)
                GetEach("Payperiod", _Payperiods)
                If (qt("trendby") = "0" AndAlso (_client <> "47") AndAlso (_client <> "60")) AndAlso qt("daterange") <> "" Then
                    If (qt("kpi").ToString.Length >= 6) AndAlso ((qt("kpi").Substring(0, 6) = "label_") OrElse (qt("kpi") = "eachlabel")) Then
                        abort = True
                        alertmsg = "Trending on labels is not yet supported, please trend on individual KPIs, (All), or (Each) KPI"
                    End If
                    'DONE?: SubKPI differential probably needs to be here, but unsure when this gets used.
                    _xes = New xaxis("Payperiod", _
                        "SELECT 'StartDate=' + convert(varchar,kh.startdate,101) + '&EndDate=' + convert(varchar,kh.startdate,101) as [key], " & _
                      "cast(DATEPART(m,kh.startdate) as varchar)+'/'+cast(DATEPART(dd,kh.startdate) as varchar)+'/'+cast(DATEPART(yy,kh.startdate)-2000 as varchar) " & _
                        " AS x,sum(kh." & _y & ")/COUNT(*) as y,sum(kh.RANGE)/COUNT(*) as raw", _
                      "group by kh.startdate", _
                      "order by kh.startdate asc", _
                      "SELECT 'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,mystart,101) as [key], cast(DATEPART(m,mystart) as varchar)+'/'+cast(DATEPART(dd,mystart) as varchar)+'/'+cast(DATEPART(yy,mystart)-2000 as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y  from (select sum(kh." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60')  */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,kh.startdate As mystart ", _
                      "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,kh.startdate) a group by mystart", _
                      "order by mystart asc")
                Else
                    If qt("dayweight") = "" Then
                        Select Case qt("Xaxis")
                            Case "CSR" 'I think this is only half done.
                                _xes = New xaxis("CSR", _
                                  "SELECT 'CSR=' + us.USER_ID as [key],us.USER_ID AS x,sum(kr." & _y & ")/COUNT(*) as y", _
                                  "group by us.USER_ID", _
                                  "order by y", _
                                  "SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                  "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                  ") a")
                            Case "KPI" 'Includes KPI as default
                                'DONE: To order by NAME, change "order by mq.WEIGHT_FACTOR" desc to "order by y"
                                If (qt("kpi").ToString.Length >= 6) AndAlso ((qt("kpi").Substring(0, 6) = "label_") OrElse (qt("kpi") = "eachlabel")) Then
                                    Dim wh As String = "inner join kpi_klb kk on kk.idkpi=mq.mqf# inner join klb on klb.id=kk.idklb inner join kpilist k on k.id=klb.id"
                                    If (qt("kpi").Substring(0, 6) = "label_") Then
                                        wh &= " and klb.id='" & qt("kpi").Substring(6) & "'"
                                    End If
                                    wh &= " group by k.clump,klb.name,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,klb.fmt,kr.mqf#) A GROUP BY [key],x,fmt"
                                    _xes = New xaxis("KPI", _
                                      "SET ARITHABORT ON;with kpilist as (select k.id as id,clump = stuff((select ',' + cast(idkpi as varchar) from kpi_klb kk inner join klb on klb.id=kk.idklb where k.id=klb.id for xml path(''), TYPE).value('.', 'NVARCHAR(MAX)'), 1, 1, '') from klb k) select [key],x,sum(y * weight)/sum(weight) as y,sum([raw] * weight)/sum(weight) as [raw], fmt from (select  'KPI=' + k.clump as [key],klb.name AS x,sum(kr.KPI_SCORE)/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw,count(*) as weight, klb.fmt as fmt", _
                                      wh, _
                                      "order by x asc", _
                                      "SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                      "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                      ") a")
                                ElseIf qt("model") = "3" Then 'Added 8/8/2015
                                    _xes = New xaxis("KPI", _
                                      "select [key],x,case when txt='Attrition' then ks.score else y end as y,[raw],fmt,RAWTOTAL,UNIQUEUSRCOUNT,NEWUSRCOUNT from (SELECT 'KPI=' + cast(kr.MQF# as varchar) as [key],mq.TXT + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' AS x,sum(kr." & _y & ")/COUNT(*) as y,case when mq.txt='Attrition' then 100.0 * (sum(kr.RANGE) / (count(distinct us.user_id)-sum(kr.kpi_score))) else sum(kr.RANGE)/COUNT(*) end as raw,mq.txt,mq.mqf#,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END  as WEIGHT_FACTOR,mq.FMT as fmt, sum(kr.RANGE) as RAWTOTAL,count(distinct us.user_id) as UNIQUEUSRCOUNT, sum(kr.kpi_score) as NEWUSRCOUNT", _
                                      "group by kr.MQF#,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,mq.FMT,mq.mqf#) a left outer join kpi_scoring ks on ks.mqf# = a.mqf# and ks.range1low <= [raw] and ks.range1high >= [raw]", _
                                      "order by WEIGHT_FACTOR desc", _
                                      "select [key],x,y from (SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(case when txt='Attrition' then ks.score else AvgScore end * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,case when mq.txt='Attrition' then 100.0 * (sum(kr.RANGE) / (count(distinct us.user_id)-sum(kr.kpi_score))) else sum(kr.RANGE)/COUNT(*) end as raw,mq.txt,mq.mqf#,sum(kr.RANGE) as RAWTOTAL,count(distinct us.user_id) as UNIQUEUSRCOUNT, sum(kr.kpi_score) as NEWUSRCOUNT ", _
                                      "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,mq.mqf# ", _
                                      ") a left outer join kpi_scoring ks on ks.mqf# = a.mqf# and ks.range1low <= [raw] and ks.range1high >= [raw]) b")
                                ElseIf qt("SubKPI") <> "" Then 'Added 9/26/2016
                                    If (_client = "67") AndAlso ((qt("role") = "Group Leader") OrElse (qt("role") = "Team Leader") OrElse (qt("role") = "CSR")) Then 'Walgreens, don't show the call count if you're a Group Leader, Team Leader, or CSR
                                        _xes = New xaxis("SubKPI", _
                                          "SELECT 'SubKPI=' + cast(st.subtypeid as varchar) as [key],st.subtypedesc /* + ' (' + replace(cast(sum(kr.weight) as varchar),'.0000','') + ')' */ as x, sum(kr.kpi_score)/count(*) as y, sum(kr.range)/count(*) as raw, sum(kr.weight) as Count,st.fmt as fmt ", _
                                          "group by st.subtypeid,st.subtypedesc,kr.mqf#,st.fmt ", _
                                          "order by st.subtypedesc asc", _
                                          "SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                          "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                          ") a")
                                    Else
                                        _xes = New xaxis("SubKPI", _
                                          "SELECT 'SubKPI=' + cast(st.subtypeid as varchar) as [key],st.subtypedesc + ' (' + replace(cast(sum(kr.weight) as varchar),'.0000','') + ')' as x, sum(kr.kpi_score)/count(*) as y, sum(kr.range)/count(*) as raw, sum(kr.weight) as Count,st.fmt as fmt ", _
                                          "group by st.subtypeid,st.subtypedesc,kr.mqf#,st.fmt ", _
                                          "order by st.subtypedesc asc", _
                                          "SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                          "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                          ") a")
                                    End If
                                Else
                                    If False Then 'True OrElse _up = "km2-make40." OrElse _up = "km2." Then 'debug
                                        _xes = New xaxis("KPI", _
                                          "SELECT 'KPI=' + cast(kr.MQF# as varchar) as [key],mq.TXT + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' AS x,[BAR_VALUE_SUBSTITUTION] as raw,mq.FMT as fmt", _
                                          "group by kr.MQF#,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,mq.FMT", _
                                          "order by mqh.WEIGHT_FACTOR desc,mq.WEIGHT_FACTOR desc", _
                                          "SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                          "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                          ") a")
                                    Else
                                        _xes = New xaxis("KPI", _
                                          "SELECT 'KPI=' + cast(kr.MQF# as varchar) as [key],mq.TXT + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' AS x,sum(kr." & _y & ")/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw,mq.FMT as fmt", _
                                          "group by kr.MQF#,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,mq.FMT", _
                                          "order by mqh.WEIGHT_FACTOR desc,mq.WEIGHT_FACTOR desc", _
                                          "SELECT 'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                          "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                          ") a")
                                    End If
                                End If
                            Case Else
                                If (qt("kpi").ToString.Length >= 6) AndAlso ((qt("kpi").Substring(0, 6) = "label_") OrElse (qt("kpi") = "eachlabel")) Then
                                    abort = True
                                    alertmsg = "Trending on labels is not yet supported, please trend on individual KPIs, (All), or (Each) KPI"
                                End If

                                'YEAR PART (insert 2 lines down - this is out because of crowded labels):    "+'/'+cast((DATEPART(yy,pp.startdate)-2000) as varchar)" & _
                                If qt("model") = "3" Then 'TODO: CHANGE THIS
                                    _xes = New xaxis("Payperiod", _
                                      "select [key],x,case when txt='Attrition' then ks.score else y end as y,[raw] from (SELECT 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                      "case when pp.startdate<>pp.enddate then cast(DATEPART(m,pp.startdate) as varchar)+'/'+cast(DATEPART(dd,pp.startdate) as varchar) +'-' else '' end + cast(DATEPART(m,pp.enddate) as varchar)+'/'+cast(DATEPART(dd,pp.enddate) as varchar)+'/'+cast(DATEPART(yy,pp.enddate)-2000 as varchar)" & _
                                        " AS x,sum(kr." & _y & ")/COUNT(*) as y,case when mq.txt='Attrition' then 100.0 * (sum(kr.RANGE) / (count(distinct us.user_id)-sum(kr.kpi_score))) else sum(kr.RANGE)/COUNT(*) end as raw,pp.startdate,mq.txt,mq.mqf#,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END  as WEIGHT_FACTOR,sum(kr.RANGE) as RAWTOTAL,count(distinct us.user_id) as UNIQUEUSRCOUNT, sum(kr.kpi_score) as NEWUSRCOUNT", _
                                      "group by pp.startdate,pp.enddate,mq.mqf#,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR  ) a left outer join kpi_scoring ks on ks.mqf# = a.mqf# and ks.range1low <= [raw] and ks.range1high >= [raw]", _
                                      "order by startdate asc", _
                                      "select [key],x,y from (SELECT 'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], case when mystart<>myend then cast(DATEPART(m,mystart) as varchar)+'/'+cast(DATEPART(dd,mystart) as varchar)+'-' else '' end + cast(DATEPART(m,myend) as varchar)+'/'+cast(DATEPART(dd,myend) as varchar)+'/'+cast(DATEPART(yy,myend)-2000 as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(case when txt='Attrition' then ks.score else AvgScore end * Weight) / SUM(Weight) end as y,mystart from (select sum(kr." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,pp.startdate As mystart,pp.enddate as myend,case when mq.txt='Attrition' then 100.0 * (sum(kr.RANGE) / (count(distinct us.user_id)-sum(kr.kpi_score))) else sum(kr.RANGE)/COUNT(*) end as raw,pp.startdate,mq.txt,mq.mqf#,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END  as WEIGHT_FACTOR,sum(kr.RANGE) as RAWTOTAL,count(distinct us.user_id) as UNIQUEUSRCOUNT, sum(kr.kpi_score) as NEWUSRCOUNT  ", _
                                      "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,pp.startdate,pp.enddate,mq.mqf#) a left outer join kpi_scoring ks on ks.mqf# = a.mqf# and ks.range1low <= [raw] and ks.range1high >= [raw] group by mystart,myend) b", _
                                      "order by mystart asc")
                                Else
                                    If qt("SubKPI") <> "" Then
                                        _xes = New xaxis("Payperiod", _
                                          "SELECT 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                          "case when pp.startdate<>pp.enddate then cast(DATEPART(m,pp.startdate) as varchar)+'/'+cast(DATEPART(dd,pp.startdate) as varchar) +'-' else '' end + cast(DATEPART(m,pp.enddate) as varchar)+'/'+cast(DATEPART(dd,pp.enddate) as varchar)+'/'+cast(DATEPART(yy,pp.enddate)-2000 as varchar)" & _
                                            " AS x,sum(kr." & _y & ")/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw,st.fmt as fmt", _
                                          "group by pp.startdate,pp.enddate,st.fmt", _
                                          "order by pp.startdate asc", _
                                          "SELECT 'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], case when mystart<>myend then cast(DATEPART(m,mystart) as varchar)+'/'+cast(DATEPART(dd,mystart) as varchar)+'-' else '' end + cast(DATEPART(m,myend) as varchar)+'/'+cast(DATEPART(dd,myend) as varchar)+'/'+cast(DATEPART(yy,myend)-2000 as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y  from (select sum(kr." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                                          "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                                          "order by mystart asc")
                                    Else
                                        _xes = New xaxis("Payperiod", _
                                          "SELECT 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                          "case when pp.startdate<>pp.enddate then cast(DATEPART(m,pp.startdate) as varchar)+'/'+cast(DATEPART(dd,pp.startdate) as varchar) +'-' else '' end + cast(DATEPART(m,pp.enddate) as varchar)+'/'+cast(DATEPART(dd,pp.enddate) as varchar)+'/'+cast(DATEPART(yy,pp.enddate)-2000 as varchar)" & _
                                            " AS x,sum(kr." & _y & ")/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw,MQ.fmt as fmt", _
                                          "group by pp.startdate,pp.enddate,MQ.fmt", _
                                          "order by pp.startdate asc", _
                                          "SELECT 'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], case when mystart<>myend then cast(DATEPART(m,mystart) as varchar)+'/' + cast(DATEPART(dd,mystart) as varchar)+'-' else '' end + cast(DATEPART(m,myend) as varchar)+'/'+cast(DATEPART(dd,myend) as varchar)+'/'+cast(DATEPART(yy,myend)-2000 as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y  from (select sum(kr." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                                          "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                                          "order by mystart asc")
                                    End If
                                End If ' -- fmt
                                'If qt("Xaxis") = "Month" Then
                                '_intervaltable = "ABC_MONTHS"
                                'End If

                                'Case "Month"
                                '    'YEAR PART (insert 2 lines down):    
                                '    _xes = New xaxis("Payperiod", _
                                '      "'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key], cast(DATEPART(m,pp.startdate) as varchar)" & _
                                '        "+'/'+cast((DATEPART(yy,pp.startdate)-2000) as varchar)" & _
                                '        " AS x,sum(kr." & _y & ")/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw", _
                                '      "group by pp.startdate,pp.enddate", _
                                '      "order by pp.startdate asc", _
                                '      "'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], cast(DATEPART(m,mystart) as varchar)+'/'+cast(DATEPART(dd,myend) as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y  from (select sum(kr." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                                '      "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                                '      "order by mystart asc")
                                '    If qt("Xaxis") = "Month" Then
                                '        _intervaltable = "ABC_MONTHS"
                                '    End If
                        End Select
                    Else
                        Select Case qt("Xaxis")
                            Case "KPI" 'Includes KPI as default
                                ' To order by NAME, change "order by weight desc" to "order by y"
                                _xes = New xaxis("KPI", _
                                  "'KPI=' + cast(kpi# as varchar) as [key],kpidesc + ' ' + replace(cast(CAST((Weight) as decimal(10,1)) as varchar),'.0','') + '%' AS x,sum(ScoreSum / TotalCount) as y from (select kr.MQF# as kpi#, mq.TXT as kpidesc, sum(kr." & _y & " * dbo.DayWeight(hst.spanstart,hst.spanend,'" & qt("StartDate") & "','" & qt("EndDate") & "')) as ScoreSum, sum(dbo.DayWeight(hst.spanstart,hst.spanend,'" & qt("StartDate") & "','" & qt("EndDate") & "')) as TotalCount, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                  "group by kr.MQF#,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR) a group by kpi#,kpidesc,Weight", _
                                  "order by Weight desc", _
                                  "'KPI=' as [key],'All KPIs' As x, SUM((ScoreSum / TotalCount) * Weight) / SUM(Weight) as y from (select sum(kr." & _y & " * dbo.DayWeight(hst.spanstart,hst.spanend,'" & qt("StartDate") & "','" & qt("EndDate") & "')) as ScoreSum, sum(dbo.DayWeight(hst.spanstart,hst.spanend,'" & qt("StartDate") & "','" & qt("EndDate") & "')) as TotalCount, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                  "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                  ") a")

                                '"'KPI=' + cast(kr.MQF# as varchar) as [key],mq.TXT + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' AS x,sum(kr." & _y & ")/COUNT(*) as y", _
                                '"group by kr.MQF#,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR", _
                                '"order by y", _
                                'WAS:"'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y from (select sum(kr." & _y & ")/COUNT(*) as AvgScore, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight", _
                                'IS: "'KPI=' as [key],'All KPIs' As x, SUM((ScoreSum / TotalCount) * Weight) / SUM(Weight) as y from (select sum(kr." & _y & " * dbo.DayWeight(hst.spanstart,hst.spanend,'" & qt("StartDate") & "','" & qt("EndDate") & "')) as ScoreSum, sum(dbo.DayWeight(hst.spanstart,hst.spanend,'" & qt("StartDate") & "','" & qt("EndDate") & "')) as TotalCount, case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight
                            Case Else
                                'YEAR PART (insert 2 lines down - this is out because of crowded labels):    "+'/'+cast((DATEPART(yy,pp.startdate)-2000) as varchar)" & _
                                _xes = New xaxis("Payperiod", _
                                  "'StartDate=' + convert(varchar,sdate,101) + '&EndDate=' + convert(varchar,edate,101) as [key]," & _
                                  "case when sdate<>edate then cast(DATEPART(m,sdate) as varchar)+'/'+cast(DATEPART(dd,sdate) as varchar) +'-' else '' end + cast(DATEPART(m,edate) as varchar)+'/'+cast(DATEPART(dd,edate) as varchar)+'/'+cast(DATEPART(yy,edate)-2000 as varchar)" & _
                                    " AS x,SUM(ScoreSum / TotalCount) as y from ( select pp.startdate as sdate,pp.enddate as edate, sum(kr." & _y & " * dbo.DayWeight(hst.spanstart,hst.spanend,pp.startdate,pp.enddate)) as ScoreSum, sum(dbo.DayWeight(hst.spanstart,hst.spanend,pp.startdate,pp.enddate)) as TotalCount", _
                                  "group by pp.startdate,pp.enddate ) a group by sdate,edate", _
                                  "order by sdate asc", _
                                  "'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], case when mystart<>myend then cast(DATEPART(m,mystart) as varchar)+'/'+cast(DATEPART(dd,mystart) as varchar)+'-' else '' end + cast(DATEPART(m,myend) as varchar)+'/'+cast(DATEPART(dd,myend) as varchar)+'/'+cast(DATEPART(yy,myend)-2000 as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y  from (select sum(kr." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                                  "group by mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                                  "order by mystart asc")
                                'If qt("Xaxis") = "Month" Then
                                '_intervaltable = "ABC_MONTHS"
                                'End If
                                'Case "Month"
                                '    'YEAR PART (insert 2 lines down):    
                                '    _xes = New xaxis("Payperiod", _
                                '      "'StartDate=' + convert(varchar,sdate,101) + '&EndDate=' + convert(varchar,edate,101) as [key], cast(DATEPART(m,sdate) as varchar)" & _
                                '        "+'/'+cast((DATEPART(yy,sdate)-2000) as varchar)" & _
                                '        " AS x,SUM(ScoreSum / TotalCount) as y from ( select pp.startdate as sdate,pp.enddate as edate, sum(kr." & _y & " * dbo.DayWeight(hst.spanstart,hst.spanend,pp.startdate,pp.enddate)) as ScoreSum, sum(dbo.DayWeight(hst.spanstart,hst.spanend,pp.startdate,pp.enddate)) as TotalCount", _
                                '      "group by pp.startdate,pp.enddate ) a group by sdate,edate", _
                                '      "order by sdate asc", _
                                '      "'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], cast(DATEPART(m,mystart) as varchar)+'/'+cast(DATEPART(dd,myend) as varchar) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end as y  from (select sum(kr." & _y & ")/COUNT(*) as AvgScore,case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                                '      "group by mq.TXT,mq.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                                '      "order by mystart asc")
                                '    If qt("Xaxis") = "Month" Then
                                '        _intervaltable = "ABC_MONTHS"
                                '    End If
                        End Select
                    End If
                End If
                Dim product As Integer
                Select Case qt("qid")
                    Case "PayChart", "PayTable"
                        product = _locations.Length * _groups.Length * _teams.Length * _CSRs.Length
                        If product > 1 Then
                            alertmsg = "(Each) is not supported for pay display.  Instead, select (All), then click on the bars to see the results in a table."
                            abort = True
                        End If
                    Case Else
                        product = _locations.Length * _groups.Length * _teams.Length * _CSRs.Length * _Payperiods.Length
                End Select
                If product > 1000 Then
                    If _Payperiods.Length > 1 Then
                        alertmsg = "There are " & product.ToString & " series in this plotting.  The information won't fit in this type of chart.  When displaying for each pay period, please consider using a trend chart."
                        abort = True
                    Else
                        alertmsg = "There are " & product.ToString & " series in this plotting (the chart won't display this many and even if it could it would be very difficult to read).  Pleae try a more refined set of filters."
                        abort = True
                    End If
                End If
            End If
            Select Case qt("qid")
                Case "KPIChart"
                Case "KPITable"
                Case "PayChart", "PayTable"
                    _KPIs = "".Split(",") 'Defeat these (special case).
                    _Payperiods = "".Split(",")
                Case "TableSQL"
                Case Else
                    abort = True
                    alertmsg = "Invalid qid, please specify."
            End Select

            Dim scorecardquery As String = " and (mq.scorecard is null or mq.scorecard = '1') "
            If qt("scorecard").Split(",")(0) <> "" And qt("scorecard").Split(",")(0) <> "1" Then
                scorecardquery = " and mq.scorecard = '" & db.reap(qt("scorecard").Split(",")(0)) & "' "
            End If
            If _up <> "cox." Then scorecardquery = ""

            Dim displayscreenquery As String = ""
            If qt("DisplayScreen").Split(",")(0) <> "" Then
                displayscreenquery = " and mq.display_screen in ('0','" & db.reap(qt("DisplayScreen").Split(",")(0)) & "') "
            End If
            If _up <> "bgr." AndAlso _up <> "da." Then displayscreenquery = ""

            If Not abort Then
                For Me._PayperiodsCount = _Payperiods.Length - 1 To 0 Step -1
                    For Me._SubKPIsCount = 0 To _SubKPIs.Length - 1
                        For Me._KPIsCount = 0 To _KPIs.Length - 1
                            For Me._agencysCount = 0 To _agencys.Length - 1
                                For Me._agencyofficesCount = 0 To _agencyoffices.Length - 1
                                    For Me._projectsCount = 0 To _projects.Length - 1
                                        For Me._locationsCount = 0 To _locations.Length - 1
                                            For Me._groupsCount = 0 To _groups.Length - 1
                                                For Me._teamsCount = 0 To _teams.Length - 1
                                                    For Me._CSRsCount = 0 To _CSRs.Length - 1
                                                        Dim ds As New DataSet("Series" & seriescount.ToString)
                                                        seriescount += 1
                                                        Dim bld As String = ""
                                                        Dim pad As String = ""
                                                        If qt("Model") = "3" Then
                                                            If (qt("Agency") <> "") Then
                                                                Using dt As DataTable = db.exec("SELECT TSC_NAME FROM TSC where TSC_ID='" & qt("Agency") & "'")
                                                                    bld &= pad & dt.Rows(0).Item("TSC_NAME").ToString.Trim
                                                                    pad = " "
                                                                End Using
                                                            End If
                                                            If (qt("Agencyoffice") <> "") Then
                                                                Using dt As DataTable = db.exec("SELECT * FROM LOC where LOC_ID='" & qt("Agencyoffice") & "'")
                                                                    If dt.Rows.Count > 0 Then
                                                                        bld &= pad & dt.Rows(0).Item("LOC_NAME").ToString.Trim
                                                                    End If
                                                                End Using
                                                            End If
                                                            If (qt("Agency") <> "") Or (qt("Agencyoffice") <> "") Then
                                                                pad = " - "
                                                            End If
                                                        End If
                                                        If qt("CSR") <> "" Then
                                                            Using dt As DataTable = db.exec("SELECT FIRSTNM,LASTNM FROM USR where USER_ID='" & qt("CSR") & "'")
                                                                If dt.Rows.Count > 0 Then
                                                                    bld &= pad & dt.Rows(0).Item("FIRSTNM").ToString.Trim & " " & dt.Rows(0).Item("LASTNM").ToString.Trim & " (" & qt("CSR") & ")"
                                                                    pad = " "
                                                                End If
                                                            End Using
                                                            If _killhighfilters Then
                                                                Using dt As DataTable = db.exec("SELECT PROJECTDESC FROM PROJECT where PROJECTID='" & qt("Project").Split(",")(0) & "' and model_id='" & qt("model").Split(",")(0) & "'")
                                                                    If dt.Rows.Count > 0 Then
                                                                        bld &= pad & "- " & dt.Rows(0).Item("PROJECTDESC").ToString.Trim
                                                                        pad = " "
                                                                    End If
                                                                End Using
                                                            End If
                                                        Else
                                                            If qt("model") <> "3" Then

                                                                If qt("Team") <> "" Then
                                                                    Using dt As DataTable = db.exec("SELECT TEAM_NAME FROM TEAM where TEAM_ID='" & qt("Team") & "'")
                                                                        If dt.Rows.Count > 0 Then
                                                                            bld &= pad & dt.Rows(0).Item("TEAM_NAME").ToString.Trim
                                                                            pad = " "
                                                                        End If
                                                                    End Using
                                                                Else
                                                                    If qt("Group") <> "" Then
                                                                        Using dt As DataTable = db.exec("SELECT GROUP_NAME FROM GRP where GROUP_ID='" & qt("Group") & "'")
                                                                            If dt.Rows.Count > 0 Then
                                                                                bld &= pad & dt.Rows(0).Item("GROUP_NAME").ToString.Trim
                                                                                pad = " "
                                                                            End If
                                                                        End Using
                                                                    Else
                                                                        If qt("Project") <> "" Then
                                                                            Using dt As DataTable = db.exec("SELECT ProjectDesc FROM PROJECT where ProjectID='" & qt("Project").Split(",")(0) & "'")
                                                                                If dt.Rows.Count > 0 Then
                                                                                    bld &= pad & dt.Rows(0).Item("ProjectDesc").ToString.Trim
                                                                                    pad = " "
                                                                                End If
                                                                            End Using
                                                                        End If
                                                                        If qt("Location") <> "" Then
                                                                            Using dt As DataTable = db.exec("SELECT * FROM LOC where LOC_ID='" & qt("Location") & "'")
                                                                                If dt.Rows.Count > 0 Then
                                                                                    bld &= pad & dt.Rows(0).Item("LOC_NAME").ToString.Trim
                                                                                    pad = " "
                                                                                End If
                                                                            End Using
                                                                        End If
                                                                    End If
                                                                End If
                                                            End If
                                                            If qt("model") = "3" Then
                                                                If qt("Project") <> "" Then
                                                                    Using dt As DataTable = db.exec("SELECT ProjectDesc FROM PROJECT where ProjectID='" & qt("Project").Split(",")(0) & "'")
                                                                        If dt.Rows.Count > 0 Then
                                                                            bld &= pad & dt.Rows(0).Item("ProjectDesc").ToString.Trim
                                                                            pad = " "
                                                                        End If
                                                                    End Using
                                                                End If
                                                                If qt("Location") <> "" Then
                                                                    Using dt As DataTable = db.exec("SELECT * FROM LOC where LOC_ID='" & qt("Location") & "'")
                                                                        If dt.Rows.Count > 0 Then
                                                                            bld &= pad & dt.Rows(0).Item("LOC_NAME").ToString.Trim
                                                                            pad = " "
                                                                        End If
                                                                    End Using
                                                                End If
                                                            End If
                                                        End If
                                                        'TODO: WHAT ARE THE RULES FOR THESE??????
                                                        If qt("InTraining") = "Exclude" And qt("CSR") = "" Then
                                                            If qt("Model") = "1" OrElse qt("Model") = "4" OrElse qt("Model") = "" Then

                                                                If ((_client = "42" OrElse _client = "47")) Then 'Chime
                                                                    'bld &= pad & "(Not Including Training)"
                                                                Else
                                                                    bld &= pad & "(In-Training Excluded)"
                                                                End If
                                                            End If
                                                        ElseIf qt("InTraining") = "Include" And qt("CSR") = "" Then
                                                            If ((_client = "42" OrElse _client = "47")) Then 'Chime
                                                                bld &= pad & "(In-Training Included)"
                                                            End If
                                                        ElseIf qt("InTraining") = "Only" And qt("CSR") = "" Then
                                                            bld &= pad & "(In-Training ONLY)"
                                                        End If
                                                        If qt("hiredate") <> "" Then
                                                            Dim hdspl() As String = qt("hiredate").Split(",")
                                                            bld &= pad & "(Hired " & hdspl(0) & "-" & hdspl(1) & ")"
                                                        End If
                                                        If qt("pass_Caption").ToString <> "" Then
                                                            bld = qt("pass_Caption")
                                                        End If
                                                        If qt("qid") <> "KPITable" Then
                                                            If _xes._key <> "KPI" AndAlso _xes._key <> "SubKPI" Then
                                                                If qt("KPI") <> "" Then
                                                                    Dim sqlmqf As String
                                                                    If qt("StartDate") <> "" AndAlso qt("EndDate") <> "" AndAlso (True) Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                        sqlmqf = "SELECT case when mqh.txt is not null then mqh.txt else mq.txt end as TXT FROM KPI_MQF mq left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' where mq.line#=1 and mq.level#=1 and mq.mqf# in (" & qt("KPI") & ")"
                                                                    Else
                                                                        sqlmqf = "SELECT TXT FROM KPI_MQF where line#=1 and level#=1 and mqf# in (" & qt("KPI") & ")"
                                                                    End If
                                                                    Using dt As DataTable = db.exec(sqlmqf)
                                                                        If (dt.Rows.Count > 0) Then
                                                                            bld &= pad & "- "
                                                                            Dim first As Boolean = True
                                                                            For Each row As DataRow In dt.Rows
                                                                                If Not first Then bld &= ","
                                                                                bld &= row.Item("TXT")
                                                                                first = False
                                                                            Next
                                                                        End If
                                                                        pad = " "
                                                                    End Using
                                                                Else
                                                                    bld &= pad & "- All KPIs"
                                                                End If
                                                            End If
                                                            If _xes._key <> "KPI" AndAlso _xes._key <> "SubKPI" Then
                                                                If qt("SubKPI") <> "" Then
                                                                    Using dt As DataTable = db.exec("select subtypedesc from subtype where subtypeid in (" & qt("SubKPI") & ")")
                                                                        If (dt.Rows.Count > 0) Then
                                                                            bld &= pad & "- "
                                                                            Dim first As Boolean = True
                                                                            For Each row As DataRow In dt.Rows
                                                                                If Not first Then bld &= ","
                                                                                bld &= row.Item("subtypedesc")
                                                                                first = False
                                                                            Next
                                                                        End If
                                                                        pad = " "
                                                                    End Using
                                                                Else
                                                                    'Removed 2015-02-15: bld &= pad & "- All Splits"
                                                                End If
                                                            End If
                                                        End If
                                                        If qt("Filter0") <> "" Then
                                                            Dim n As Integer = 0
                                                            Dim firstfilter As Boolean = True
                                                            'bld &= " Filters:"
                                                            While qt("Filter" & n.ToString) <> ""
                                                                Using dt As DataTable = db.exec("SELECT FILTER_NAME from FILTER_TYPE where FILTER_ID='" & qt("Filter" & n.ToString) & "'")
                                                                    If dt.Rows.Count > 0 Then
                                                                        If Not firstfilter Then
                                                                            bld &= ","
                                                                        End If
                                                                        firstfilter = False
                                                                        If qt("Not" & n.ToString) <> "" Then
                                                                            bld &= " Not"
                                                                        End If
                                                                        bld &= " " & dt.Rows(0).Item("FILTER_NAME").ToString.Trim
                                                                    End If
                                                                End Using
                                                                n += 1
                                                            End While
                                                        End If

                                                        Try
                                                            If qt("StartDate") <> "" Then
                                                                Dim mydate As Date = Convert.ToDateTime(qt("StartDate"))
                                                                bld &= pad & mydate.Month.ToString & "/" & mydate.Day.ToString
                                                            End If
                                                            If qt("EndDate") <> "" Then
                                                                Dim mydate As Date = Convert.ToDateTime(qt("EndDate"))
                                                                bld &= "-" & mydate.Month.ToString & "/" & mydate.Day.ToString
                                                            End If
                                                        Catch ex As Exception
                                                            abort = True
                                                            alertmsg = "Invalid date range for this type of report, please select a single period."
                                                        End Try

                                                        If qt("Skillarea") <> "" Then
                                                            Using dt As DataTable = db.exec("select txt from MONITOR_MQF where MQF#='" & qt("Skillarea") & "' and LINE#='1' and LEVEL#='1'")
                                                                If dt.Rows.Count > 0 Then
                                                                    bld = pad & dt.Rows(0).Item("txt").ToString.Trim
                                                                    pad = " "
                                                                End If
                                                            End Using
                                                        ElseIf qt("Qualityform") <> "" Then
                                                            bld = "Not Done Yet 64234"
                                                        End If

                                                        If qt("qid") = "PayChart" Or qt("qid") = "PayTable" Then
                                                            bld &= pad & " - Pay History"
                                                        ElseIf (_xes._key.Length >= 5 AndAlso _xes._key.Substring(0, 5) = "each_") Or qt("qid") = "KPITable" Then
                                                            If qt("KPI") <> "" Then
                                                                Dim sqlmqf As String
                                                                If qt("StartDate") <> "" AndAlso qt("EndDate") <> "" AndAlso (True) Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                    sqlmqf = "SELECT case when mqh.txt is not null then mqh.txt else mq.txt end as TXT FROM KPI_MQF mq left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' where mq.line#=1 and mq.level#=1 and mq.mqf# in (" & qt("KPI") & ")"
                                                                Else
                                                                    sqlmqf = "SELECT TXT FROM KPI_MQF where line#=1 and level#=1 and mqf# in (" & qt("KPI") & ")"
                                                                End If
                                                                Using dt As DataTable = db.exec(sqlmqf)
                                                                    If (dt.Rows.Count > 0) Then
                                                                        bld &= pad & "- "
                                                                        Dim first As Boolean = True
                                                                        For Each row As DataRow In dt.Rows
                                                                            If Not first Then bld &= ","
                                                                            bld &= row.Item("TXT")
                                                                            first = False
                                                                        Next
                                                                    End If
                                                                    pad = " "
                                                                End Using
                                                            Else
                                                                bld &= pad & "- All KPIs"
                                                            End If
                                                            If qt("SubKPI") <> "" Then
                                                                Using dt As DataTable = db.exec("select subtypedesc from subtype where subtypeid in (" & qt("SubKPI") & ")")
                                                                    If (dt.Rows.Count > 0) Then
                                                                        bld &= pad & "- "
                                                                        Dim first As Boolean = True
                                                                        For Each row As DataRow In dt.Rows
                                                                            If Not first Then bld &= ","
                                                                            bld &= row.Item("subtypedesc")
                                                                            first = False
                                                                        Next
                                                                    End If
                                                                    pad = " "
                                                                End Using
                                                            Else
                                                                'Removed 2015-02-15: bld &= pad & "- All Splits"
                                                            End If

                                                        End If

                                                        If bld = "" Then bld = "Everything"

                                                        Dim params As String = ""
                                                        If qt("Model") = "3" Then
                                                            params &= eachval("Agency")
                                                            params &= eachval("Agencyoffice")
                                                        End If
                                                        params &= eachval("Project")
                                                        params &= eachval("Location")
                                                        params &= eachval("Group")
                                                        params &= eachval("Team")
                                                        params &= eachval("CSR")
                                                        params &= eachval("StartDate")
                                                        params &= eachval("EndDate")
                                                        params &= eachval("KPI")
                                                        params &= eachval("SubKPI")
                                                        params &= eachval("Xaxis")  'I don't think this matters.
                                                        params &= "&InTraining=" + qt("InTraining")
                                                        params &= "&AgentStatus=" + qt("AgentStatus")
                                                        params &= "&hiredate=" + qt("hiredate")
                                                        If qt("Filter0") <> "" Then
                                                            Dim n As Integer = 0
                                                            While qt("Filter" & n) <> ""
                                                                params &= "&Filter" & n.ToString & "=" & qt("Filter" & n.ToString)
                                                                params &= "&Not" & n.ToString & "=" & qt("Not" & n.ToString)
                                                                n += 1
                                                            End While
                                                        End If
                                                        If (qt("trendby") = "0" AndAlso (_client <> "47") AndAlso (_client <> "60")) AndAlso qt("daterange") <> "" Then
                                                            params &= "&ExpandToInterval=" & _interval 'Added to enable the right interval to be pulled in the case of a drill on logs (in other cases, the StartDate and EndDate express the range).
                                                        End If
                                                        params &= "&Connection=" + qt("Connection")
                                                        params &= "&Model=" + qt("Model")

                                                        Dim dtname As New DataTable()
                                                        dtname.Columns.Add("Name")
                                                        dtname.Columns.Add("Params")
                                                        dtname.Columns.Add("DVCode")
                                                        Dim dr As DataRow = dtname.NewRow()
                                                        dr("Name") = bld
                                                        dr("Params") = params
                                                        Dim mydvcode As String = ""
                                                        If qt("qid") = "KPITable" Then
                                                            Dim json As New JavaScriptSerializer
                                                            Dim _connection2 As String = CONFMGR.ConnectionStrings(_up & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                                                            Using db2 As New DbBaseSql(_connection2)
                                                                Using dtkcl As DataTable = db2.GetDataTable("select stg_dv from kcl where client='" & _client & "' and idkpi='" & qt("KPI") & "'")
                                                                    If (dtkcl.Rows.Count > 0) Then
                                                                        Dim stgdv As stg_calc = json.Deserialize(Of stg_calc)(dtkcl.Rows(0).Item("stg_dv").ToString)
                                                                        If stgdv.type = "Coded" Then
                                                                            mydvcode = stgdv.code.ToUpper
                                                                        End If
                                                                    End If
                                                                End Using
                                                            End Using
                                                        End If
                                                        dr("DVCode") = mydvcode

                                                        dtname.Rows.Add(dr)
                                                        dtname.TableName = "Spec"
                                                        ds.Tables.Add(dtname)
                                                        If qt("qid") = "KPIChart" Then
                                                            sql = "/**SELECTX()**/"
                                                            If (qt("trendby") = "0" AndAlso (_client <> "47") AndAlso (_client <> "60")) AndAlso (qt("daterange") <> "") Then 'Disable this section for Veyo
                                                                sql &= " from kpi_log kh"
                                                                sql &= " inner join KPI_MQF mq on (mq.MQF# = kh.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery & _
                                                                    " inner join USR us on us.USER_ID=kh.scope_id" & _
                                                                    " inner join TEAM tm on tm.team_id=kh.up_id" & _
                                                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                    " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                If qt("Group") <> "" Then
                                                                    sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                                End If
                                                                If qt("model") = "3" Then
                                                                    sql &= " LEFT OUTER JOIN USR_JSON uja on uja.user_id=kh.user_id and uja.[key]='employment' and uja.name='recruitedBy'" & _
                                                                            " LEFT OUTER JOIN USR_JSON ujo on ujo.user_id=kh.user_id and ujo.[key]='employment' and ujo.name='recruitingOffice'"
                                                                End If
                                                                If (qt("daterange") <> "") Then
                                                                    Dim drspl() As String = qt("daterange").Split(",")
                                                                    If True Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                        sql &= " left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & drspl(0) & "' and mqh.PAYPERIOD_END='" & drspl(1) & "' "
                                                                    End If
                                                                    sql &= " WHERE kh.startdate >= '" & drspl(0) & "' and kh.startdate <= '" & drspl(1) & "' and kh.scope='A' and kh.ivid='" & _interval & "' and kh.model_id='1' and kh.SubTypeID is null "
                                                                Else
                                                                    sql &= " left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' "
                                                                    sql &= " WHERE (1 = 1) " 'I give up on the Whereblock/Andblock syncing in this area, converting everything to andblocks.
                                                                End If

                                                                'sql &= " /**ANDBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate)),"
                                                                Dim mod3sub As Boolean = False
                                                                If qt("model") = "3" Then
                                                                    Using dt As DataTable = db.exec("select projectid from project where model_id='3'")
                                                                        If dt.Rows.Count = 1 Then
                                                                            mod3sub = True
                                                                            sql &= " AND (mq.Project_ID = '" & dt.Rows(0).Item(0).ToString & "') "
                                                                        End If
                                                                    End Using
                                                                End If
                                                                If qt("model") <> "3" Then
                                                                    sql &= " /**ANDBLOCK(EQUAL(mq.Project_ID,Project)"
                                                                    sql &= "EQUAL(gp.GROUP_ID,Group)" & _
                                                                        "EQUAL(tm.TEAM_ID,Team)"
                                                                Else
                                                                    sql &= " /**ANDBLOCK(EQUAL(tm.Project_ID,Project)"
                                                                    sql &= "EQUAL(uja.val,Agency)" & _
                                                                        "EQUAL(ujo.val,Agencyoffice)"
                                                                End If
                                                                sql &= "EQUAL(us.USER_ID,CSR)" & _
                                                                    "EQUAL(mq.MQF#,KPI)" & _
                                                                    "EQUAL(lc.LOC_ID,Location)"
                                                                sql &= "**/" & _
                                                                    " /**GROUPX()**/" & _
                                                                    " /**ORDERX()**/;"

                                                                If qt("model") = "3" AndAlso (Not mod3sub) Then
                                                                    'TODO: This section doesn't place a WHERE, it just strings it as a condition of the last join.  Since it's an inner join it still works, but it's messy.
                                                                    sql &= "/**ANDBLOCK(EQUAL(mq.Project_ID,Project)" & _
                                                                    "EQUAL(lc.LOC_ID,Location)" & _
                                                                    "EQUAL(gp.GROUP_ID,Group)" & _
                                                                    "EQUAL(tm.TEAM_ID,Team)" & _
                                                                    "EQUAL(us.USER_ID,CSR)" & _
                                                                    "EQUAL(mq.MQF#,KPI)**/" & _
                                                                    " /**GROUPX()**/" & _
                                                                    " /**ORDERX()**/;"
                                                                End If

                                                                If qt("InTraining") = "Exclude" And qt("CSR") = "" And qt("model") <> "3" Then
                                                                    sql = sql.Replace("inner join USR us on us.USER_ID=kh.scope_id", "inner join USR us on us.USER_ID=kh.scope_id and us.status<>'7' ")
                                                                End If
                                                                If qt("hiredate") <> "" Then
                                                                    Dim hdspl() As String = qt("hiredate").Split(",")
                                                                    sql = sql.Replace("inner join USR us on us.USER_ID=kh.scope_id", "inner join USR us on us.USER_ID=kh.scope_id and ((convert(datetime,hiredt) >='" & hdspl(0) & "' and convert(datetime,hiredt) <='" & hdspl(1) & "') or hiredt is null)")
                                                                End If
                                                                If qt("Filter0") <> "" Then
                                                                    Dim n As Integer = 0
                                                                    While qt("Filter" & n.ToString) <> ""
                                                                        If qt("Not" & n.ToString) = "" Then
                                                                            sql = sql.Replace("inner join USR us on us.USER_ID=kh.scope_id", "inner join USR us on us.USER_ID=kh.scope_id inner join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'")
                                                                        Else 'DONE: How do you do the non-existence of an inner join? left outer
                                                                            sql = sql.Replace("inner join USR us on us.USER_ID=kh.scope_id", "inner join USR us on us.USER_ID=kh.scope_id left outer join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'")
                                                                            sql = sql.Replace("WHERE (1 = 1)", "WHERE (1 = 1) AND uf" & n.ToString & ".filter_id is null")
                                                                        End If
                                                                        n += 1
                                                                    End While
                                                                End If
                                                            ElseIf False Then ' qt("trendby") = "0" AndAlso (qt("daterange") <> "") Then 'New daily trend (testing on Veyo, see previous condition).
                                                                abort = True
                                                                alertmsg = "Daily Trend log is under construction."
                                                            Else
                                                                If _xes._key = "SubKPI" Then
                                                                    sql &= " from SUBKPI_HSTRY kh with(nolock)" & _
                                                                            " inner join SUBKPI_RESP kr with(nolock) on kr.KPI_ID = kh.KPI_ID" & _
                                                                            " inner join subtype st on st.subtypeid=kr.subtype_id"
                                                                    If qt("dayweight") <> "" Then
                                                                        sql &= " inner join HST on hst.refid = kr.kpi_id"
                                                                    End If
                                                                    sql &= " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery & _
                                                                        " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                                        " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                                        " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                                        " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                        " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                ElseIf _xes._key = "Payperiod" And qt("SubKPI") <> "" Then
                                                                    If (_client = "67") AndAlso (_scope = "Project" OrElse _scope = "Location") Then
                                                                        NoAggregation = True
                                                                        sql &= " from subtype st "
                                                                        If qt("dayweight") <> "" Then
                                                                            sql &= " inner join HST on hst.refid = kr.kpi_id"
                                                                        End If
                                                                        sql &= " inner join KPI_MQF mq on (mq.MQF# = st.kpi_id) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery
                                                                        If _scope = "Project" Then
                                                                        ElseIf _scope = "Location" Then
                                                                            sql &= " inner join GRP gp on gp.project_id=mq.project_id" & _
                                                                            " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                        Else 'This will fail, but is kept for reference.
                                                                            sql &= " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                                            " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                                            " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                                            " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                            " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                        End If

                                                                    Else

                                                                        sql &= " from SUBKPI_HSTRY kh with(nolock)" & _
                                                                            " inner join SUBKPI_RESP kr with(nolock) on kr.KPI_ID = kh.KPI_ID" & _
                                                                            " inner join subtype st on st.subtypeid=kr.subtype_id"
                                                                        If qt("dayweight") <> "" Then
                                                                            sql &= " inner join HST on hst.refid = kr.kpi_id"
                                                                        End If
                                                                        'removed: " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                                                                        'put back in, why was it removed long ago?  Needs testing.
                                                                        sql &= " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery & _
                                                                            " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                                            " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                                            " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                                            " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                            " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                    End If
                                                                Else
                                                                    sql &= " from KPI_HSTRY kh with(nolock)" & _
                                                                        " inner join KPI_RESP kr with(nolock) on kr.KPI_ID = kh.KPI_ID"
                                                                    If qt("dayweight") <> "" Then
                                                                        sql &= " inner join HST on hst.refid = kr.kpi_id"
                                                                    End If
                                                                    sql &= " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery & _
                                                                        " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                                        " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                                        " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                                        " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                        " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                End If
                                                                If qt("Group") <> "" Then
                                                                    sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                                End If
                                                                If qt("model") = "3" Then
                                                                    sql &= " LEFT OUTER JOIN USR_JSON uja on uja.user_id=kh.user_id and uja.[key]='employment' and uja.name='recruitedBy'" & _
                                                                            " LEFT OUTER JOIN USR_JSON ujo on ujo.user_id=kh.user_id and ujo.[key]='employment' and ujo.name='recruitingOffice'"
                                                                End If
                                                                If qt("dayweight") <> "" Then
                                                                    'sql &= " inner join " & _intervaltable & " pp on pp.startdate <= hst.spanend AND pp.enddate >= hst.spanstart"
                                                                    sql &= " inner join iv_dates pp on pp.ivid='" & _interval & "' and pp.startdate <= hst.spanend AND pp.enddate >= hst.spanstart"
                                                                Else
                                                                    'sql &= " inner join " & _intervaltable & " pp on pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT"
                                                                    'CHANGE: 1/14/2015 - removed the following line.
                                                                    'CHANGE: 1/19/2015 - put this line back in?
                                                                    If (qt("Xaxis").ToString.Length > 5) AndAlso (qt("Xaxis").Substring(0, 5) = "each_") Then
                                                                        If NoAggregation Then
                                                                            sql &= " inner join iv_dates pp on pp.ivid='" & _interval & "'"
                                                                        Else
                                                                            sql &= " inner join iv_dates pp on pp.ivid='" & _interval & "' and pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT"
                                                                        End If
                                                                    End If
                                                                End If

                                                                If (qt("daterange") <> "") Then
                                                                    Dim drspl() As String = qt("daterange").Split(",")
                                                                    sql &= " AND pp.startdate >= '" & drspl(0) & "' and pp.enddate <= '" & drspl(1) & "'"
                                                                End If
                                                                If (qt("daterange") <> "") Then
                                                                    Dim drspl() As String = qt("daterange").Split(",")
                                                                    If True Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                        If sql.IndexOf("KPI_MQF mq") >= 0 Then
                                                                            sql &= " left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & drspl(0) & "' and mqh.PAYPERIOD_END='" & drspl(1) & "' "
                                                                        End If
                                                                    End If
                                                                    sql &= " WHERE pp.startdate >= '" & drspl(0) & "' and pp.enddate <= '" & drspl(1) & "'"
                                                                Else
                                                                    sql &= " left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' "
                                                                    sql &= " WHERE (1 = 1) " 'I give up on the Whereblock/Andblock syncing in this area, converting everything to andblocks.
                                                                End If

                                                                Dim mod3sub As Boolean = False
                                                                If qt("model") = "3" Then
                                                                    Using dt As DataTable = db.exec("select projectid from project where model_id='3'")
                                                                        If dt.Rows.Count = 1 Then
                                                                            mod3sub = True
                                                                            sql &= " AND (mq.Project_ID = '" & dt.Rows(0).Item(0).ToString & "') "
                                                                        End If
                                                                    End Using
                                                                End If
                                                                If qt("dayweight") <> "" Then
                                                                    sql &= " /**ANDBLOCK(DATERANGE(hst.span,StartDate,EndDate)),"
                                                                Else
                                                                    sql &= " /**ANDBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate)),"
                                                                End If
                                                                If qt("model") <> "3" Then

                                                                    If (_xes._key = "Payperiod" AndAlso qt("SubKPI") <> "") Then
                                                                        If NoAggregation Then
                                                                            sql &= " /**ANDBLOCK(EQUAL(mq.Project_ID,Project)"
                                                                        Else
                                                                            sql &= " /**ANDBLOCK(EQUAL(kh.Project_ID,Project)"
                                                                        End If

                                                                    Else
                                                                        sql &= " /**ANDBLOCK(EQUAL(mq.Project_ID,Project)"
                                                                    End If

                                                                    sql &= "EQUAL(gp.GROUP_ID,Group)" & _
                                                                        "EQUAL(tm.TEAM_ID,Team)"
                                                                Else
                                                                    sql &= " /**ANDBLOCK(EQUAL(tm.Project_ID,Project)"
                                                                    sql &= "EQUAL(uja.val,Agency)" & _
                                                                        "EQUAL(ujo.val,Agencyoffice)"
                                                                End If
                                                                sql &= "EQUAL(us.USER_ID,CSR)" & _
                                                                    "EQUAL(lc.LOC_ID,Location)"

                                                                If Not (_xes._key = "Payperiod" AndAlso qt("SubKPI") <> "") Then
                                                                    sql &= "EQUAL(mq.MQF#,KPI)"
                                                                End If

                                                                If (_xes._key = "SubKPI") OrElse (_xes._key = "Payperiod" AndAlso qt("SubKPI") <> "") Then
                                                                    sql &= "EQUAL(st.subtypeid,SubKPI)"
                                                                End If

                                                                sql &= "**/" & _
                                                                    " /**GROUPX()**/" & _
                                                                    " /**ORDERX()**/;"

                                                                If qt("InTraining") = "Exclude" And qt("CSR") = "" And qt("model") <> "3" Then
                                                                    sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID and us.status<>'7' ")
                                                                End If
                                                                If qt("hiredate") <> "" Then
                                                                    Dim hdspl() As String = qt("hiredate").Split(",")
                                                                    sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID and ((convert(datetime,hiredt) >='" & hdspl(0) & "' and convert(datetime,hiredt) <='" & hdspl(1) & "') or hiredt is null)")
                                                                End If
                                                                If qt("Filter0") <> "" Then
                                                                    Dim n As Integer = 0
                                                                    While qt("Filter" & n.ToString) <> ""
                                                                        If qt("Not" & n.ToString) = "" Then
                                                                            sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID inner join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'")
                                                                        Else 'DONE: How do you do the non-existence of an inner join? left outer
                                                                            sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID left outer join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'")
                                                                            sql = sql.Replace("WHERE (1 = 1)", "WHERE (1 = 1) AND uf" & n.ToString & ".filter_id is null")
                                                                        End If
                                                                        n += 1
                                                                    End While
                                                                End If
                                                            End If
                                                        ElseIf qt("qid") = "PayChart" Then
                                                            Dim guatblock As String = ""
                                                            Dim ppblock As String = " abc_payperiods pp on "
                                                            If (qt("ApmGuatModuleLoc") <> "") Then
                                                                If ((qt("Location") <> qt("ApmGuatModuleLoc")) And (qt("Group") = "") And (qt("Team") = "") And (qt("CSR") = "")) Then
                                                                    guatblock = " and lc.loc_id<>'" & qt("ApmGuatModuleLoc") & "' "
                                                                End If
                                                                If qt("Location") = qt("ApmGuatModuleLoc") Then
                                                                    ppblock = " iv_dates pp on ivid=2 and "
                                                                End If
                                                            End If

                                                            Dim backdate As Date = DateAdd("d", -(8 * 14), Now.Date)

                                                            If (_client = "29") Then 'Or (_up = "make40.") bgr
                                                                sql = "select [key],x,sum(y)/count(*) as y,"
                                                            Else
                                                                sql = "select [key],x," & _
                                                                    " case when sum(total_hours) > 0 then sum(y * total_hours) / sum(total_hours) else 0 end as y,"
                                                            End If

                                                            sql &= " case when sum(total_hours) <= 0 then 'C' else case when (sum(y * total_hours) / sum(total_hours)) >= 8 then 'A' else case when (sum(y * total_hours) / sum(total_hours)) >= 4 then 'B' else 'C' end end end  as paylevel," & _
                                                                " sum(regular_hours) as regular_hours," & _
                                                                " case when sum(regular_hours) > 0 then sum(regular_total)/sum(regular_hours) else 0.0 end as regular_payrate," & _
                                                                " sum(regular_total) as regular_total," & _
                                                                " sum(overtime_hours) as overtime_hours," & _
                                                                " case when sum(overtime_hours) > 0 then sum(overtime_total)/sum(overtime_hours) else 0.0 end as overtime_payrate," & _
                                                                " sum(overtime_total) as overtime_total," & _
                                                                " sum(Bonus) as Bonus," & _
                                                                " sum(total_pay) as total_pay,locked" & _
                                                                " from (" & _
                                                                " select pp.startdate," & _
                                                                " tm.project_id," & _
                                                                " lc.loc_id," & _
                                                                " gp.group_id," & _
                                                                " tm.team_id," & _
                                                                " pay.user_id," & _
                                                                " 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                                                " case when pp.enddate >= getdate() then 'Current' else cast(DATEPART(m,pp.enddate) as varchar)+'/'+cast(DATEPART(dd,pp.enddate) as varchar)+'/'+cast(DATEPART(yyyy,pp.enddate) as varchar) end AS x," & _
                                                                " sum(pay.payscore)/count(*) as y," & _
                                                                " pay.paylevel as paylevel," & _
                                                                " sum(case when pay.paytype='RegularHours' then pay.payqty else 0.0 end) as regular_hours," & _
                                    " sum(case when pay.paytype='RegularHours' then pay.paytotal else 0.0 end) as regular_total," & _
                                    " sum(case when pay.paytype='OvertimeHours' then pay.payqty else 0.0 end) as overtime_hours," & _
                                    " sum(case when pay.paytype='OvertimeHours' then pay.paytotal else 0.0 end) as overtime_total," & _
                                    " sum(case when pay.paytype='Bonus' then pay.paytotal else 0.0 end) as Bonus," & _
                                    " sum(pay.payqty) as total_hours," & _
                                    " sum(pay.paytotal) as total_pay," & _
                                    " lock.locked as locked" & _
                                    " from abc_pay_userdtl pay" & _
                                    " inner join abc_paylock lock on lock.enddate=pay.payperiod_end and lock.location=pay.loc_id" & _
                                    " inner join usr us on us.user_id = pay.user_id" & _
                                    " inner join usr_team ut on ut.user_id=us.user_id" & _
                                    " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                    " inner join loc lc on lc.loc_id=pay.loc_id" & _
                                    " inner join " & ppblock & " pp.startdate = payperiod_begin and pp.enddate=payperiod_end" & _
                                    " where pp.startdate >= '" & backdate.Year.ToString.PadLeft(4, "0") & "-" & backdate.Month.ToString.PadLeft(2, "0") & "-" & backdate.Day.ToString.PadLeft(2, "0") & "' " & _
                                                                        guatblock & "/**ANDBLOCK(EQUAL(lc.LOC_ID,Location)" & _
                                                                        "EQUAL(tm.PROJECT_ID,Project)" & _
                                                                        "EQUAL(gp.GROUP_ID,Group)" & _
                                                                        "EQUAL(tm.TEAM_ID,Team)" & _
                                                                        "EQUAL(us.USER_ID,CSR)**/" & _
                                                                        " AND pay.paytype<>'RankPoints'" & _
                                    " group by pp.startdate,pp.enddate,pay.paylevel,lock.locked,pay.user_id,tm.team_id,gp.group_id,lc.loc_id,tm.project_id) a" & _
                                    " group by [key],x,startdate,locked" & _
                                    " order by startdate asc"
                                                            If qt("Group") <> "" Then
                                                                sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                            End If
                                                            'Added 3/31/2015 - Modify query to pass the rank on (instead of calculating) if this is a CSR view and a ranking-based paylevel (contains the string (Ranked))
                                                            'Modified 3/14/2016 to make UNRANKED show a B instead of a C (it always has been).
                                                            If qt("CSR") <> "" Then
                                                                sql = sql.Replace("startdate,locked", "startdate,locked,paylevel")
                                                                sql = sql.Replace("sum(total_hours) else 0 end as y,", "sum(total_hours) else 0 end as y, case when charindex('(Ranked)',paylevel) > 0 then paylevel else case when charindex('UNRANKED',paylevel) > 0 then 'B' else ")
                                                                sql = sql.Replace("'C' end end end", "'C' end end end end end")
                                                            End If
                                                            'sql = "select 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                                            '    " case when pp.enddate >= getdate() then 'Current' else cast(DATEPART(m,pp.enddate) as varchar)+'/'+cast(DATEPART(dd,pp.enddate) as varchar)+'/'+cast(DATEPART(yyyy,pp.enddate) as varchar) end AS x," & _
                                                            '    " sum(pay.payscore)/count(*) as y," & _
                                                            '    " pay.paylevel as paylevel," & _
                                                            '    " sum(case when pay.paytype='RegularHours' then pay.payqty else 0.0 end) as regular_hours," & _
                                                            '    " sum(case when pay.paytype='RegularHours' then pay.payrate else 0.0 end) as regular_payrate," & _
                                                            '    " sum(case when pay.paytype='RegularHours' then pay.paytotal else 0.0 end) as regular_total," & _
                                                            '    " sum(case when pay.paytype='OvertimeHours' then pay.payqty else 0.0 end) as overtime_hours," & _
                                                            '    " sum(case when pay.paytype='OvertimeHours' then pay.payrate else 0.0 end) as overtime_payrate," & _
                                                            '    " sum(case when pay.paytype='OvertimeHours' then pay.paytotal else 0.0 end) as overtime_total," & _
                                                            '    " sum(pay.paytotal) as total_pay," & _
                                                            '    " lock.locked as locked" & _
                                                            '    " from abc_pay_userdtl pay" & _
                                                            '    " inner join abc_paylock lock on lock.enddate=pay.payperiod_end and lock.location=pay.loc_id" & _
                                                            '    " inner join usr us on us.user_id = pay.user_id" & _
                                                            '    " inner join usr_team ut on ut.user_id=us.user_id" & _
                                                            '    " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                                            '    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                            '    " inner join loc lc on lc.loc_id=pay.loc_id" & _
                                                            '    " inner join abc_payperiods pp on pp.startdate = payperiod_begin and pp.enddate=payperiod_end" & _
                                                            '    " where pp.startdate >= '" & backdate.Year.ToString.PadLeft(4, "0") & "-" & backdate.Month.ToString.PadLeft(2, "0") & "-" & backdate.Day.ToString.PadLeft(2, "0") & "' " & _
                                                            '    "/**ANDBLOCK(lc.LOC_ID,Location)" & _
                                                            '    "EQUAL(gp.GROUP_ID,Group)" & _
                                                            '    "EQUAL(tm.TEAM_ID,Team)" & _
                                                            '    "EQUAL(us.USER_ID,CSR)**/" & _
                                                            '    " group by pp.startdate,pp.enddate,pay.paylevel,lock.locked" & _
                                                            '    " order by pp.startdate asc"

                                                        ElseIf qt("qid") = "KPITable" Then
                                                            Dim isaht As Boolean = False
                                                            If qt("KPI") <> "" AndAlso qt("KPI") <> "each" Then
                                                                Dim sqlmqf As String
                                                                If qt("StartDate") <> "" AndAlso qt("EndDate") <> "" AndAlso (True) Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                    sqlmqf = "SELECT case when mqh.txt is not null then mqh.txt else mq.txt end as TXT FROM KPI_MQF mq left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' where mq.line#=1 and mq.level#=1 and mq.mqf# in (" & qt("KPI") & ")"
                                                                Else
                                                                    sqlmqf = "SELECT TXT FROM KPI_MQF where line#=1 and level#=1 and mqf# in (" & qt("KPI") & ")"
                                                                End If
                                                                Using dta As DataTable = db.GetDataTable(sqlmqf)
                                                                    'DONE: Modify this query to check for the existence of a SubKPI.  Use the same approach as in adminLib.js, whatever that is.
                                                                    'NOTE: There is also a scalar function called dbo.cntSubkpi(mqf#) that can serve this purpose.
                                                                    Using dts As DataTable = db.GetDataTable("select count(*) from subtype where kpi_id in (" & qt("KPI") & ")")
                                                                        If dts.Rows(0).Item(0) > 0 Then
                                                                            isaht = True
                                                                        End If
                                                                    End Using
                                                                    'Old (and embarrasing) way:
                                                                    'If dta.Rows(0)("txt") = "AHT" Then isaht = True
                                                                    'If dta.Rows(0)("txt") = "CPH/EPH" Then isaht = True
                                                                    'If (_up = "cthix.") AndAlso (dta.Rows(0)("txt") = "Service Level") Then isaht = True
                                                                    'If (_up = "cthix-program.") AndAlso (dta.Rows(0)("txt") = "Service Level") Then isaht = True
                                                                    'If (_up = "rcm.") AndAlso (dta.Rows(0)("txt") = "Productivity") Then isaht = True
                                                                End Using
                                                            End If
                                                            If Not isaht Then 'TODO: Generalize this - "AHT" is a specific case of a subkpi.
                                                                If qt("dayweight") <> "" Then
                                                                    sql = "select us.user_id as UserId,mq.MQF# as KPInum,convert(varchar,hst.spanstart,101) As [Start],convert(varchar,hst.spanend,101) As [End],ProjectDesc As Project,lc.loc_name as Location,gp.group_name as [Group],tm.team_name as Team,us.lastnm + ', ' + us.firstnm as Name,mq.TXT + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' AS KPI,sum(kr." & _y & ")/COUNT(*) as Scored"
                                                                Else
                                                                    sql = "select us.user_id as UserId,mq.MQF# as KPInum,convert(varchar,kh.RESPDT,101) As [Date],convert(varchar,kh.entdt,20) as [ImportTime],ProjectDesc As Project,lc.loc_name as Location,gp.group_name as [Group],tm.team_name as Team,us.lastnm + ', ' + us.firstnm as Name,mq.TXT + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' AS KPI,convert(decimal(10,2),kr." & _y & ") as Scored"
                                                                End If
                                                                If qt("model") = "3" Then
                                                                    sql = sql.Replace(",ProjectDesc As Project,", ",TSC.TSC_NAME as Agency,ao.LOC_NAME as Office,hp.ProjectDesc As Project,")
                                                                    sql = sql.Replace("AS KPI,", "AS KPI,case when mq.txt like 'Attrition%' then case when kr." & _y & " = 1 then 'New' else case when kr.range = 1 then 'Terminated' else 'Headcount' end end else 'N/A' end as [Type],ujv0.val as 'Call Center In-Bound',ujv1.val as 'Data Entry',ujv2.val as 'Call Center Listening',ujv3.val as 'Telephone Etiquette',ujv4.val as 'Business Etiquette',ujv5.val as 'Spelling & Grammar',ujv6.val as 'Environment',ujv7.val as 'Typing',ujv8.val as 'Bi-Lingual',")
                                                                End If
                                                                If qt("Connection") <> "SLA" AndAlso qt("Connection") <> "Program" AndAlso qt("Connection") <> "Enterprise" AndAlso qt("Connection") <> "Financial" Then
                                                                    sql &= ",kr.RANGE as Standard"
                                                                Else
                                                                    sql &= ",convert(decimal(10,0), kr.RANGE) as Standard"
                                                                End If
                                                                If _up <> "ers." AndAlso _up <> "ces." AndAlso _up <> "rcm." AndAlso _up <> "act." Then
                                                                    sql &= ",isnull(kr.NUMERATOR,0) as Num,isnull(kr.DENOMINATOR,0) as Den"
                                                                End If
                                                                sql &= ",mq.fmt as fmt" 'Added 5/24/2013
                                                                sql &= " from KPI_HSTRY kh with(nolock)" & _
                                                                    " inner join KPI_RESP kr with(nolock) on kr.KPI_ID = kh.KPI_ID"
                                                                If qt("dayweight") <> "" Then
                                                                    sql &= " inner join HST on hst.refid = kr.kpi_id"
                                                                End If
                                                                sql &= " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery & _
                                                                        " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                                        " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                                        " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                                        " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                        " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                If qt("Group") <> "" Then
                                                                    sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                                End If
                                                                If qt("model") = "3" Then
                                                                    sql &= " LEFT OUTER JOIN USR_JSON uja on uja.user_id=kh.user_id and uja.[key]='employment' and uja.name='recruitedBy'" & _
                                                                            " LEFT OUTER JOIN USR_JSON ujo on ujo.user_id=kh.user_id and ujo.[key]='employment' and ujo.name='recruitingOffice'" & _
    " left outer join usr_json ujn0 on ujn0.user_id=kh.user_id and ujn0.[key]='recruitment.testing' and ujn0.name='name' and ujn0.val='Call Center In-Bound'" & _
    " left outer join usr_json ujv0 on ujv0.user_id=ujn0.user_id and ujv0.[key]=ujn0.[key] and ujv0.name='score' and ujv0.[index]=ujn0.[index]" & _
    " left outer join usr_json ujn1 on ujn1.user_id=kh.user_id and ujn1.[key]='recruitment.testing' and ujn1.name='name' and ujn1.val='Data Entry'" & _
    " left outer join usr_json ujv1 on ujv1.user_id=ujn1.user_id and ujv1.[key]=ujn1.[key] and ujv1.name='score' and ujv1.[index]=ujn1.[index]" & _
    " left outer join usr_json ujn2 on ujn2.user_id=kh.user_id and ujn2.[key]='recruitment.testing' and ujn2.name='name' and ujn2.val='Call Center Listening'" & _
    " left outer join usr_json ujv2 on ujv2.user_id=ujn2.user_id and ujv2.[key]=ujn2.[key] and ujv2.name='score' and ujv2.[index]=ujn2.[index]" & _
    " left outer join usr_json ujn3 on ujn3.user_id=kh.user_id and ujn3.[key]='recruitment.testing' and ujn3.name='name' and ujn3.val='Telephone Etiquette'" & _
    " left outer join usr_json ujv3 on ujv3.user_id=ujn3.user_id and ujv3.[key]=ujn3.[key] and ujv3.name='score' and ujv3.[index]=ujn3.[index]" & _
    " left outer join usr_json ujn4 on ujn4.user_id=kh.user_id and ujn4.[key]='recruitment.testing' and ujn4.name='name' and ujn4.val='Business Etiquette'" & _
    " left outer join usr_json ujv4 on ujv4.user_id=ujn4.user_id and ujv4.[key]=ujn4.[key] and ujv4.name='score' and ujv4.[index]=ujn4.[index]" & _
    " left outer join usr_json ujn5 on ujn5.user_id=kh.user_id and ujn5.[key]='recruitment.testing' and ujn5.name='name' and ujn5.val='Spelling & Grammar'" & _
    " left outer join usr_json ujv5 on ujv5.user_id=ujn5.user_id and ujv5.[key]=ujn5.[key] and ujv5.name='score' and ujv5.[index]=ujn5.[index]" & _
    " left outer join usr_json ujn6 on ujn6.user_id=kh.user_id and ujn6.[key]='recruitment.testing' and ujn6.name='name' and ujn6.val='Environment'" & _
    " left outer join usr_json ujv6 on ujv6.user_id=ujn6.user_id and ujv6.[key]=ujn6.[key] and ujv6.name='score' and ujv6.[index]=ujn6.[index]" & _
    " left outer join usr_json ujn7 on ujn7.user_id=kh.user_id and ujn7.[key]='recruitment.testing' and ujn7.name='name' and ujn7.val='Typing'" & _
    " left outer join usr_json ujv7 on ujv7.user_id=ujn7.user_id and ujv7.[key]=ujn7.[key] and ujv7.name='score' and ujv7.[index]=ujn7.[index]" & _
    " left outer join usr_json ujn8 on ujn8.user_id=kh.user_id and ujn8.[key]='recruitment.testing' and ujn8.name='name' and ujn8.val='Bi-Lingual'" & _
    " left outer join usr_json ujv8 on ujv8.user_id=ujn8.user_id and ujv8.[key]=ujn8.[key] and ujv8.name='score' and ujv8.[index]=ujn8.[index]" & _
                                                                            " LEFT OUTER JOIN TSC on TSC.TSC_ID=uja.val" & _
                                                                            " LEFT OUTER JOIN LOC ao on ao.loc_id=ujo.val" & _
                                                                            " LEFT OUTER JOIN PROJECT hp on hp.projectID=tm.project_id"
                                                                End If
                                                                If qt("Group") <> "" Then
                                                                    sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                                End If
                                                                If qt("StartDate") <> "" And qt("EndDate") <> "" Then
                                                                    If True Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                        sql &= " left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' "
                                                                    End If
                                                                End If
                                                                sql &= " WHERE (1 = 1) " 'I give up on the Whereblock/Andblock syncing in this area, converting everything to andblocks.
                                                                If qt("model") = "3" Then
                                                                    Using dt As DataTable = db.exec("select projectid from project where model_id='3'")
                                                                        If dt.Rows.Count = 1 Then
                                                                            sql &= " AND (mq.Project_ID = '" & dt.Rows(0).Item(0).ToString & "') "
                                                                        End If
                                                                    End Using
                                                                End If
                                                                If qt("dayweight") <> "" Then
                                                                    sql &= " inner join iv_dates pp on pp.ivid='" & _interval & "'and pp.startdate <= hst.spanend AND pp.enddate >= hst.spanstart" & _
                                                                    " /**ANDBLOCK(DATERANGE(hst.span,StartDate,EndDate))**/"
                                                                Else
                                                                    'CHANGE: 1/14/2015 - Was:
                                                                    'sql &= " inner join iv_dates pp on pp.ivid='" & _interval & "' and pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT" & _
                                                                    '    " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate)),"
                                                                    'Is:
                                                                    If qt("ExpandToInterval") <> "" Then
                                                                        sql &= " inner join iv_dates pp on pp.ivid='" & qt("ExpandToInterval") & "' and pp.startdate <= '" & qt("StartDate") & "' AND pp.enddate >= '" & qt("StartDate") & "'"
                                                                        sql &= " and kh.respdt >= pp.startdate and kh.respdt <= pp.enddate **/"
                                                                    Else
                                                                        sql &= " /**ANDBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))**/"
                                                                    End If
                                                                End If

                                                                If qt("model") <> "3" Then
                                                                    sql &= " /**ANDBLOCK(EQUAL(pj.ProjectID,Project)"
                                                                    sql &= "EQUAL(gp.GROUP_ID,Group)" & _
                                                                        "EQUAL(tm.TEAM_ID,Team)"
                                                                Else
                                                                    sql &= " /**ANDBLOCK(EQUAL(tm.Project_ID,Project)"
                                                                    sql &= "EQUAL(uja.val,Agency)" & _
                                                                        "EQUAL(ujo.val,Agencyoffice)"
                                                                End If
                                                                sql &= "EQUAL(us.USER_ID,CSR)" & _
                                                                    "EQUAL(mq.MQF#,KPI)" & _
                                                                    "EQUAL(lc.LOC_ID,Location)"
                                                                sql &= "**/"

                                                                If qt("dayweight") <> "" Then
                                                                    sql &= " group by hst.spanstart,hst.spanend,pj.ProjectDesc,lc.loc_name,gp.group_name,tm.team_name,us.lastnm,us.firstnm,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,us.user_id,mq.mqf#,mq.fmt,kr.kpi_score,kr.range"
                                                                Else
                                                                    'MODIFIED 11/10/14 - NO GROUPING: sql &= " group by kh.RESPDT,pj.ProjectDesc,lc.loc_name,gp.group_name,tm.team_name,us.lastnm,us.firstnm,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,us.user_id,mq.mqf#,mq.fmt,kr.kpi_score,kr.range"
                                                                End If
                                                                sql &= " order by mq.TXT;"
                                                            Else
                                                                sql = "select us.user_id as UserId,mq.MQF# as KPInum,st.subtypeid as SUBKPInum,convert(varchar,kh.RESPDT,101) As [Date],convert(varchar,max(kh.entdt),20) as [ImportTime], ProjectDesc As Project,lc.loc_name as Location,gp.group_name as [Group],tm.team_name as Team,us.lastnm + ', ' + us.firstnm as Name,st.subtypedesc as Split,convert(decimal(10,2),sum(kr.KPI_SCORE)/COUNT(*)) as Scored,convert(decimal(10,0),sum(kr.WEIGHT)) as Count,convert(decimal(10,0),sum(kr.RANGE)/COUNT(*)) as Standard"
                                                                If _up <> "ers." AndAlso _up <> "ces." AndAlso _up <> "rcm." AndAlso _up <> "act." Then
                                                                    sql &= ",isnull(kr.NUMERATOR,0) as Num,isnull(kr.DENOMINATOR,0) as Den"
                                                                End If
                                                                sql &= " from SUBKPI_HSTRY kh with(nolock)" & _
                                                                    " inner join SUBKPI_RESP kr with(nolock) on kr.KPI_ID = kh.KPI_ID" & _
                                                                    " inner join subtype st on st.subtypeid=kr.subtype_id" & _
                                                                    " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & scorecardquery & displayscreenquery & _
                                                                    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                                    " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                                    " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                    " inner join LOC lc on lc.loc_id=gp.loc_id"
                                                                If qt("StartDate") <> "" And qt("EndDate") <> "" Then
                                                                    If True Then '(_client = "42" OrElse _client = "26" OrElse _client = "47") Then
                                                                        sql &= " left outer join kpi_mqf_hstry mqh on mqh.tier='" & _tier & "' and mqh.mqf#=mq.mqf# and mqh.line#=mq.line# and mqh.level#=mq.level# and mqh.PAYPERIOD_BEGIN='" & qt("StartDate") & "' and mqh.PAYPERIOD_END='" & qt("EndDate") & "' "
                                                                    End If
                                                                End If
                                                                sql &= " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                                                    "EQUAL(pj.ProjectID,Project)" & _
                                                                    "EQUAL(lc.LOC_ID,Location)" & _
                                                                    "EQUAL(gp.GROUP_ID,Group)" & _
                                                                    "EQUAL(tm.TEAM_ID,Team)" & _
                                                                    "EQUAL(us.USER_ID,CSR)" & _
                                                                    "EQUAL(st.subtypeid,SubKPI)" & _
                                                                    "EQUAL(mq.MQF#,KPI)**/" & _
                                                                    " group by us.user_id,mq.mqf#,st.subtypeid,kh.respdt,pj.projectdesc,lc.loc_name,gp.group_name,tm.team_name,us.firstnm,us.lastnm,st.subtypedesc,mq.txt"
                                                                If _up <> "ers." AndAlso _up <> "ces." AndAlso _up <> "rcm." AndAlso _up <> "act." Then
                                                                    sql &= ",kr.NUMERATOR,kr.DENOMINATOR"
                                                                End If

                                                                sql &= " order by mq.TXT;"
                                                                If qt("Group") <> "" Then
                                                                    sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                                End If
                                                                'CHANGE: 1/14/2015 - No iv_dates inner join - Was: " inner join iv_dates pp on pp.ivid='" & _interval & "' and pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT" & _
                                                                'CHANGE: 1/19/2015 - Um, I need that if it's a trend graph, so:
                                                                'If (qt("Xaxis").ToString.Length > 5) AndAlso (qt("Xaxis").Substring(0, 5) = "each_") Then
                                                                'sql = sql.Replace("=gp.loc_id", "=gp.loc_id inner join iv_dates pp on pp.ivid='" & _interval & "' and pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT")
                                                                'End If
                                                                'MODIFIED 11/10/14 - NO GROUPING: " group by kh.RESPDT,pj.ProjectDesc,lc.loc_name,gp.group_name,tm.team_name,us.lastnm,us.firstnm,mq.TXT,mq.WEIGHT_FACTOR,mqh.WEIGHT_FACTOR,st.subtypedesc,us.user_id,mq.mqf#,st.subtypeid" & _
                                                                'MODIFIED 12/9/14 - I put the grouping back in for the Subkpi, it doesn't work otherwise.
                                                            End If
                                                            If qt("InTraining") = "Exclude" And qt("CSR") = "" And qt("model") <> "3" Then
                                                                sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID and us.status<>'7'")
                                                            End If
                                                            If qt("hiredate") <> "" Then
                                                                Dim hdspl() As String = qt("hiredate").Split(",")
                                                                sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID and ((convert(datetime,hiredt) >='" & hdspl(0) & "' and convert(datetime,hiredt) <='" & hdspl(1) & "') or hiredt is null)")
                                                            End If
                                                            If qt("Filter0") <> "" Then
                                                                Dim n As Integer = 0
                                                                While qt("Filter" & n.ToString) <> ""
                                                                    If qt("Not" & n.ToString) = "" Then
                                                                        sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID inner join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'")
                                                                    Else 'DONE: How do you do the non-existence of an inner join? left outer
                                                                        sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID left outer join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'")
                                                                        sql = sql.Replace("WHERE (1 = 1)", "WHERE (1 = 1) AND uf" & n.ToString & ".filter_id is null")
                                                                    End If
                                                                    n += 1
                                                                End While
                                                            End If 'as score as raw
                                                        ElseIf qt("qid") = "PayTable" Then
                                                            Dim ppblock As String = " abc_payperiods pp on "
                                                            Dim guatblock As String = ""
                                                            If (qt("ApmGuatModuleLoc") <> "") Then
                                                                If ((qt("Location") <> qt("ApmGuatModuleLoc")) And (qt("Group") = "") And (qt("Team") = "") And (qt("CSR") = "")) Then
                                                                    guatblock = " and lc.loc_id<>'" & qt("ApmGuatModuleLoc") & "' "
                                                                End If
                                                                If qt("Location") = qt("ApmGuatModuleLoc") Then
                                                                    ppblock = "iv_dates pp on ivid=2 and "
                                                                End If
                                                            End If
                                                            If (qt("ApmGuatModuleLoc") <> "") AndAlso qt("Location") = qt("ApmGuatModuleLoc") Then
                                                                'NOTE: 1/1/2014 - This is IDENTICAL to below except for some removal/rearrangement of columns.'
                                                                'NOTE: 4/9/2019 - This now eliminates dup entries caused by CSRs on multiple teams - so no longer identical.
                                                                sql = "select PayStart,PayEnd,Location,KRONOS,Name,RawScore,paylevel,Bonus,results_locked from (select convert(varchar,pp.startdate,101) As PayStart," & _
                    " convert(varchar,pp.enddate,101) As PayEnd," & _
                    " lc.loc_name as Location," & _
                    " ui.emp_id as KRONOS," & _
                    " us.lastnm + ', ' + us.firstnm as Name," & _
                    " sum(pay.payscore)/count(*) as RawScore," & _
                    " pay.paylevel as paylevel," & _
                    " /* sum(case when pay.paytype='RegularHours' then pay.payqty else 0.0 end) as regular_hours, */" & _
                    " /* sum(case when pay.paytype='RegularHours' then pay.payrate else 0.0 end) as regular_rate, */" & _
                    " /* sum(case when pay.paytype='RegularHours' then pay.paytotal else 0.0 end) as regular_total, */" & _
                    " /* sum(case when pay.paytype='OvertimeHours' then pay.payqty else 0.0 end) as overtime_hours, */" & _
                    " /* sum(case when pay.paytype='OvertimeHours' then pay.paytotal else 0.0 end) as overtime_total, */" & _
                    " sum(case when pay.paytype='Bonus' then pay.paytotal else 0.0 end) as Bonus," & _
                    " /* sum(pay.payqty) as total_hours, */" & _
                    " /* sum(pay.paytotal) as total_pay, */" & _
                    " lock.locked as results_locked" & _
                    " from abc_pay_userdtl pay" & _
                    " inner join abc_paylock lock on lock.enddate=pay.payperiod_end and lock.location=pay.loc_id" & _
                    " inner join usr us on us.user_id = pay.user_id" & _
                    " inner join usr_team ut on ut.user_id=us.user_id" & _
                    " left outer join user_id ui on ui.user_id=us.user_id and ui.idtype='1'" & _
                    " inner join TEAM tm on tm.team_id=ut.team_id" & _
                    " inner join PROJECT pj on pj.projectID=tm.project_id" & _
                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                    " inner join loc lc on lc.loc_id=pay.loc_id" & _
                    " inner join " & ppblock & " pp.startdate = payperiod_begin and pp.enddate=payperiod_end" & _
                                " where (1=1) " & guatblock & " /**ANDBLOCK(EQUAL(pp.startdate,StartDate))," & _
                                "EQUAL(pp.enddate,EndDate)" & _
                                "EQUAL(pj.ProjectID,Project)" & _
                                "EQUAL(lc.LOC_ID,Location)" & _
                                "EQUAL(gp.GROUP_ID,Group)" & _
                                "EQUAL(tm.TEAM_ID,Team)" & _
                                "EQUAL(us.USER_ID,CSR)**/" & _
                                " AND pay.paytype<>'RankPoints'" & _
                    " group by pp.startdate,pp.enddate,pay.paylevel,lock.locked,pay.user_id,tm.team_id,gp.group_id,lc.loc_id,tm.project_id,lc.loc_name,ui.emp_id,us.lastnm,us.firstnm" & _
                    ") a group by PayStart,PayEnd,Location,KRONOS,Name,RawScore,paylevel,Bonus,results_locked"
                                                            Else
                                                                sql = "select convert(varchar,pp.startdate,101) As PayStart," & _
                                                                    " convert(varchar,pp.enddate,101) As PayEnd," & _
                                                                    " lc.loc_name as Location," & _
                                                                    " ui.emp_id as KRONOS," & _
                                                                    " us.lastnm + ', ' + us.firstnm as Name," & _
                                                                    " sum(pay.payscore)/count(*) as RawScore," & _
                                                                    " pay.paylevel as paylevel," & _
                                                                    " sum(case when pay.paytype='RegularHours' then pay.payqty else 0.0 end) as regular_hours," & _
                                                                    " sum(case when pay.paytype='RegularHours' then pay.payrate else 0.0 end) as regular_rate," & _
                                                                    " sum(case when pay.paytype='RegularHours' then pay.paytotal else 0.0 end) as regular_total," & _
                                                                    " sum(case when pay.paytype='OvertimeHours' then pay.payqty else 0.0 end) as overtime_hours," & _
                                                                    " sum(case when pay.paytype='OvertimeHours' then pay.paytotal else 0.0 end) as overtime_total," & _
                                                                    " sum(case when pay.paytype='Bonus' then pay.paytotal else 0.0 end) as Bonus," & _
                                                                    " sum(pay.payqty) as total_hours," & _
                                                                    " sum(pay.paytotal) as total_pay," & _
                                                                    " lock.locked as results_locked" & _
                                                                    " from abc_pay_userdtl pay" & _
                                                                    " inner join abc_paylock lock on lock.enddate=pay.payperiod_end and lock.location=pay.loc_id" & _
                                                                    " inner join usr us on us.user_id = pay.user_id" & _
                                                                    " inner join usr_team ut on ut.user_id=us.user_id" & _
                                                                    " left outer join user_id ui on ui.user_id=us.user_id and ui.idtype='1'" & _
                                                                    " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                                                    " inner join PROJECT pj on pj.projectID=tm.project_id" & _
                                                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                                    " inner join loc lc on lc.loc_id=pay.loc_id" & _
                                                                    " inner join " & ppblock & " pp.startdate = payperiod_begin and pp.enddate=payperiod_end" & _
                                                                                " where (1=1) " & guatblock & " /**ANDBLOCK(EQUAL(pp.startdate,StartDate))," & _
                                                                                "EQUAL(pp.enddate,EndDate)" & _
                                                                                "EQUAL(pj.ProjectID,Project)" & _
                                                                                "EQUAL(lc.LOC_ID,Location)" & _
                                                                                "EQUAL(gp.GROUP_ID,Group)" & _
                                                                                "EQUAL(tm.TEAM_ID,Team)" & _
                                                                                "EQUAL(us.USER_ID,CSR)**/" & _
                                                                                " AND pay.paytype<>'RankPoints'" & _
                                                                    " group by pp.startdate,pp.enddate,pay.paylevel,lock.locked,pay.user_id,tm.team_id,gp.group_id,lc.loc_id,tm.project_id,lc.loc_name,ui.emp_id,us.lastnm,us.firstnm"
                                                            End If
                                                            If qt("Group") <> "" Then
                                                                sql = sql.Replace("inner join GRP gp on gp.group_id=tm.group_id", "inner join GRP gp on (gp.group_id=tm.group_id) or (gp.group_id=tm.roll_group_id)")
                                                            End If

                                                        ElseIf qt("qid") = "TableSQL" OrElse qt("qid") = "ChartSQL" Then
                                                            Dim con As String = CONFMGR.ConnectionStrings(_up & "Utilities").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                                                            Using udb As New DbBaseSql(con)
                                                                sql = "SELECT * FROM CDS where projectnumber='" & CONFMGR.AppSettings(_up & "ClientNumber") & "' AND bodyid='" & qt("cid") & "' AND tagid='" & qt("qid") & "' AND state = 'L' ORDER BY moddate DESC, remaining DESC"
                                                                Dim contentaccum As String = ""
                                                                Using udt As DataTable = udb.exec(sql)
                                                                    For Each row As DataRow In udt.Rows
                                                                        contentaccum &= row.Item("content")
                                                                        If row.Item("remaining") Is DBNull.Value OrElse row.Item("remaining") = 0 Then
                                                                            Exit For
                                                                        End If
                                                                    Next
                                                                End Using
                                                                sql = contentaccum 'If there is nothing here, it will simply blow up.  This will do for now.
                                                            End Using
                                                            sql = sql.Replace(vbCrLf, " ")
                                                            'sql = sql.Replace("  ", " ").Replace("  ", " ")
                                                            sql = sql.Replace(Chr(160), " ")
                                                        End If

                                                        'Quick fix - only return scores of the given model.
                                                        If (qt("model") <> "") Then
                                                            sql = sql.Replace("WHERE (1 = 1)", "WHERE (1 = 1) AND pj.model_id='" & db.reap(qt("model").Split(",")(0)) & "'")
                                                        End If

                                                        '2022-04-01 - Add condition to eliminate KPIs that are inactive.
                                                        If sql.IndexOf("kpi_mqf_hstry mqh") >= 0 Then
                                                            sql = sql.Replace("WHERE (1 = 1)", "WHERE (1 = 1) AND (mqh.STATUS is null OR mqh.STATUS<>'I')")
                                                        End If

                                                        sql = substituteparams(sql) 'dspBarValue anchor

                                                        If False Then 'True OrElse _up = "km2." OrElse _up = "km2-make40." Then
                                                            'DONE: I have to convert the startdate and enddate to Dean's format.
                                                            'DONE: I have to get the scope and val.
                                                            Dim scope As String = "Team" 'Test Debug
                                                            Dim val As String = qt("Team") 'Test Debug
                                                            Dim mykpi = qt("KPI")
                                                            If mykpi = "" Then mykpi = "0"
                                                            Dim mysubkpi = qt("SubKPI")
                                                            If mysubkpi = "" Then mysubkpi = "0"
                                                            sql = sql.Replace("[BAR_VALUE_SUBSTITUTION]", "dbo.dspBarValue" & FilterOrTrend & "('" & deansDate(qt("StartDate")) & "','" & deansDate(qt("EndDate")) & "','" & scope & "','" & val & "','" & mykpi & "','" & mysubkpi & "','" & FilterComposite & "') ")
                                                        End If
                                                        'RANKING add-on (should be integrated into the dynamic substitution, but added quickly).
                                                        'CHANGED: 2017-12-31 - Don't return AcuityRank or points items if we're showing each.
                                                        If qt("model") = "1" AndAlso qt("qid") = "KPIChart" AndAlso _context.Request.QueryString("CSR") <> "each" AndAlso qt("CSR") <> "" AndAlso qt("rank") <> "" Then
                                                            Dim myday As Date = Date.Now.AddDays(-1) 'Make it wait until after kpi_log has been updated for a given day.
                                                            If qt("EndDate") <> "" Then
                                                                Dim ed As Date = Convert.ToDateTime(qt("EndDate"))
                                                                If myday > ed Then
                                                                    myday = ed
                                                                End If
                                                            End If
                                                            If (qt("kpi").ToString.Length >= 6) AndAlso ((qt("kpi").Substring(0, 6) = "label_") OrElse (qt("kpi") = "eachlabel")) Then
                                                                Dim sqlins As String = ",dbo.AcuityRank('" & myday.Year.ToString.PadLeft(4, "0") & "-" & myday.Month.ToString.PadLeft(2, "0") & "-" & myday.Day.ToString.PadLeft(2, "0") & "','CSR','" & qt("rank") & "',"
                                                                sqlins &= "clump"
                                                                sqlins &= ",'" & qt("CSR") & "') as [rank] "
                                                                sql = sql.Replace("[raw], fmt", "[raw], fmt" & sqlins)
                                                                sql = sql.Replace("x,fmt", "x,fmt,clump ")
                                                                sql = sql.Replace("klb.fmt as fmt", "klb.fmt as fmt,k.clump as clump ")
                                                            Else
                                                                Dim sqlins As String = ",dbo.AcuityRank('" & myday.Year.ToString.PadLeft(4, "0") & "-" & myday.Month.ToString.PadLeft(2, "0") & "-" & myday.Day.ToString.PadLeft(2, "0") & "','CSR','" & qt("rank") & "',"
                                                                If (qt("KPI") = "") Or (qt("SubKPI") <> "") Then
                                                                    sqlins &= "''"
                                                                Else
                                                                    sqlins &= "kr.mqf#"
                                                                End If
                                                                sqlins &= ",'" & qt("CSR") & "') as [rank] "
                                                                If (qt("KPI") = "") Then  'NOTE: 2/12/2014 - Cluge added to a cluge (should by part of _xes, except I need to dynamically vary the CSR).
                                                                    'ADDED 9/8/2014 - Points are associated with RANK and CSR.  I DON'T LIKE THE SEPARATION, BUT THIS IS WHERE IT SHOULD GO.
                                                                    sqlins &= ",dbo.AcuityPointsBalance('" & qt("CSR") & "') as pointsbalance "
                                                                    sql = sql.Replace("as y ", "as y " & sqlins)
                                                                Else
                                                                    sql = sql.Replace("as fmt ", "as fmt " & sqlins)
                                                                    sql = sql.Replace("group by ", "group by kr.mqf#,")
                                                                End If
                                                            End If
                                                        ElseIf qt("model") = "2" AndAlso qt("Team") <> "" Then
                                                            If (qt("KPI") = "") Then ' NOTE: Really Gross
                                                                Dim sqlins As String
                                                                sqlins = ",dbo.AcuityPointsBalance(spvr_user_id) as pointsbalance,spvr_user_id "
                                                                sql = sql.Replace("as y ", "as y " & sqlins)
                                                                sql = sql.Replace("from (select", "from (select tm.spvr_user_id,")
                                                                sql = sql.Replace("group by ", "group by tm.spvr_user_id,")
                                                                sql = sql.Replace(";", " group by spvr_user_id;")
                                                            End If
                                                        ElseIf qt("model") = "1" AndAlso qt("qid") = "KPIChart" AndAlso _context.Request.QueryString("CSR") <> "each" AndAlso qt("CSR") <> "" AndAlso _client = "51" Then
                                                            Dim sqlins As String
                                                            sqlins = ",dbo.AcuityPointsBalance('" & qt("CSR") & "') as pointsbalance "
                                                            sql = sql.Replace("as y ", "as y " & sqlins)
                                                        End If

                                                        'TODO: WHAT HAPPENS IF THERE ARE SUBTYPES?!?!?!?
                                                        If qt("model").Split(",")(0) = "1" AndAlso qt("qid") = "KPIChart" Then
                                                            If (sql.IndexOf("myend") < 0) Then
                                                                sql = sql.Replace("group by ", "group by mq.mqf#,")
                                                            End If
                                                            Dim mb As String = "" 'Main build (dspScoreValue)
                                                            Dim bb As String = "" 'Bar build (dspBarValue)
                                                            Dim mykpi = qt("KPI")
                                                            If mykpi = "" Then mykpi = "0"
                                                            Dim mysubkpi = qt("SubKPI")
                                                            If mysubkpi = "" Then mysubkpi = "0"
                                                            If mysubkpi = "each" Then
                                                                mysubkpi = "st.subtypeid"
                                                            Else
                                                                mysubkpi = "'" & mysubkpi & "'"
                                                            End If


                                                            If qt("KPI") <> "" Then
                                                                mb = ",dbo.dspScoreValue" & FilterOrTrend & "("
                                                                If qt("daterange") = "" Then
                                                                    mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                Else
                                                                    If (sql.IndexOf("myend") >= 0) Then
                                                                        mb &= "mystart,myend"
                                                                    Else
                                                                        mb &= "pp.startdate,pp.enddate"
                                                                    End If
                                                                End If
                                                                If _scope = "Location" Then
                                                                    mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "',mq.MQF#," & mysubkpi & ",'" & FilterComposite & "')"
                                                                Else
                                                                    mb &= ",'" & _scope & "','" & qt(_scope) & "',mq.MQF#," & mysubkpi & ",'" & FilterComposite & "')"
                                                                End If
                                                                'Added 2021-09-17 TESTING
                                                                bb = mb.Replace("dspScoreValue", "dspBarValue")

                                                            Else
                                                                'DONE?: Add iby and oby here (for DA Dial America), Client 70
                                                                mb = ""
                                                                If (_client = "70") Then
                                                                    mb &= ",dbo.dspBalScoreValueTrendOB("
                                                                    If qt("daterange") = "" Then
                                                                        mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                    Else
                                                                        If (sql.IndexOf("myend") >= 0) Then
                                                                            mb &= "mystart,myend"
                                                                        Else
                                                                            mb &= "pp.startdate,pp.enddate"
                                                                        End If
                                                                    End If
                                                                    If _scope = "Location" Then
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                    Else
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                    End If
                                                                    mb &= " as oby"
                                                                    mb &= ",dbo.dspBalScoreValueTrendIB("
                                                                    If qt("daterange") = "" Then
                                                                        mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                    Else
                                                                        If (sql.IndexOf("myend") >= 0) Then
                                                                            mb &= "mystart,myend"
                                                                        Else
                                                                            mb &= "pp.startdate,pp.enddate"
                                                                        End If
                                                                    End If
                                                                    If _scope = "Location" Then
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                    Else
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                    End If
                                                                    mb &= " as iby"

                                                                    'TODO: Add lgy and sly (for CE's LG and SL)
                                                                    'dspBalScoreValueTrendLegacy
                                                                    'dspBalScoreValueTrendSales

                                                                    mb &= ",dbo.dspBalScoreValueTrendLegacy("
                                                                    If qt("daterange") = "" Then
                                                                        mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                    Else
                                                                        If (sql.IndexOf("myend") >= 0) Then
                                                                            mb &= "mystart,myend"
                                                                        Else
                                                                            mb &= "pp.startdate,pp.enddate"
                                                                        End If
                                                                    End If
                                                                    If _scope = "Location" Then
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                    Else
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                    End If
                                                                    mb &= " as lgy"
                                                                    mb &= ",dbo.dspBalScoreValueTrendSales("
                                                                    If qt("daterange") = "" Then
                                                                        mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                    Else
                                                                        If (sql.IndexOf("myend") >= 0) Then
                                                                            mb &= "mystart,myend"
                                                                        Else
                                                                            mb &= "pp.startdate,pp.enddate"
                                                                        End If
                                                                    End If
                                                                    If _scope = "Location" Then
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                    Else
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                    End If
                                                                    mb &= " as sly"

                                                                    'hvcy and hgvy

                                                                    mb &= ",dbo.dspBalScoreValueTrendHVC("
                                                                    If qt("daterange") = "" Then
                                                                        mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                    Else
                                                                        If (sql.IndexOf("myend") >= 0) Then
                                                                            mb &= "mystart,myend"
                                                                        Else
                                                                            mb &= "pp.startdate,pp.enddate"
                                                                        End If
                                                                    End If
                                                                    If _scope = "Location" Then
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                    Else
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                    End If
                                                                    mb &= " as hvcy"

                                                                    mb &= ",dbo.dspBalScoreValueTrendHGV("
                                                                    If qt("daterange") = "" Then
                                                                        mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                    Else
                                                                        If (sql.IndexOf("myend") >= 0) Then
                                                                            mb &= "mystart,myend"
                                                                        Else
                                                                            mb &= "pp.startdate,pp.enddate"
                                                                        End If
                                                                    End If
                                                                    If _scope = "Location" Then
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                    Else
                                                                        mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                    End If
                                                                    mb &= " as hgvy"

                                                                End If
                                                                mb &= ",dbo.dspBalScoreValue" & FilterOrTrend & "("
                                                                If qt("daterange") = "" Then
                                                                    mb &= "'" & qt("StartDate") & "','" & qt("EndDate") & "'"
                                                                Else
                                                                    If (sql.IndexOf("myend") >= 0) Then
                                                                        mb &= "mystart,myend"
                                                                    Else
                                                                        mb &= "pp.startdate,pp.enddate"
                                                                    End If
                                                                End If
                                                                If _scope = "Location" Then
                                                                    mb &= ",'" & _scope & "','" & qt(_scope) & "|" & qt("Project") & "','" & FilterComposite & "')"
                                                                Else
                                                                    mb &= ",'" & _scope & "','" & qt(_scope) & "','" & FilterComposite & "')"
                                                                End If
                                                                'mb &= " as y"

                                                            End If
                                                            If Not ((qt("trendby") = "0" AndAlso (_client <> "47")) AndAlso qt("daterange") <> "") Then 'No replacement if doing daily logs
                                                                If NoAggregation Then
                                                                    sql = sql.Replace("sum(kr.KPI_SCORE)/COUNT(*) as y,", "'1' as one" & mb & " as y")
                                                                Else
                                                                    sql = sql.Replace("as y", "as yold" & mb & " as y")
                                                                End If

                                                                'Added 2021-09-17 TESTING
                                                                'Experiment with raw replacement, Cox Only for now.
                                                                If _up = "cox." OrElse _up = "walgreens." Then
                                                                    If bb <> "" Then
                                                                        If NoAggregation Then
                                                                            sql = sql.Replace("sum(kr.RANGE)/COUNT(*) as raw,", ",'2' as two" & bb & " as raw,")
                                                                        Else
                                                                            sql = sql.Replace("as raw", "as rawold" & bb & " as raw")
                                                                        End If
                                                                    End If
                                                                End If
                                                            End If
                                                        End If


                                                        If Not abort Then
                                                            Try
                                                                'TODO: Implement staging HERE.  (maybe substute GetDataTable for GetStagedTable).                                        
                                                                Using dt As DataTable = db.GetStagedTable(sql, _utilities, New TimeSpan(2, 0, 0), alertmsg, savethresholdinseconds:=120)
                                                                    If dt Is Nothing Then 'build is in progress (and within the allowed timespan).
                                                                        abort = True
                                                                        'now set in GetStagedTable
                                                                        ' alertmsg = "This Table is in the process of building (from a previous request).  Please wait a few minutes then try again."
                                                                        'ElseIf dt.Rows.Count = 1 AndAlso qt("Filter0") <> "" AndAlso qt("CSR") <> "" AndAlso dt.Rows(0).Item("y") Is DBNull.Value Then
                                                                        'ADDED: 2017-12-31 to keep agents that violate the filter from being displayed
                                                                        'Do nothing, skip recording this iteration.
                                                                    Else
                                                                        'Using dt As DataTable = db.GetDataTable(sql)
                                                                        Dim dtout As DataTable = Nothing
                                                                        If _zerofill IsNot Nothing Then
                                                                            'dt is the table
                                                                            _zfcnt = 0
                                                                            Dim i As Integer
                                                                            For Each zfstr As String In _zerofill
                                                                                Dim zsplit() As String = zfstr.Split("/")
                                                                                _zf(_zfcnt) = New zerofill(zsplit(0))
                                                                                'If zsplit.Length > 1 Then 'Either /L#/H#/S# or poll all values in dt.
                                                                                Dim low As Integer = 0
                                                                                Dim high As Integer = 0
                                                                                Dim sort As Integer = 0
                                                                                For i = 1 To zsplit.Length - 1
                                                                                    If zsplit(i).Substring(0, 1) = "L" Then
                                                                                        low = Convert.ToInt32(zsplit(i).Substring(1))
                                                                                    ElseIf zsplit(i).Substring(0, 1) = "H" Then
                                                                                        high = Convert.ToInt32(zsplit(i).Substring(1))
                                                                                    ElseIf zsplit(i).Substring(0, 1) = "S" Then
                                                                                        sort = Convert.ToInt32(zsplit(i).Substring(1))
                                                                                    End If
                                                                                Next
                                                                                If sort > 0 Then
                                                                                    _zf(_zfcnt)._sort = sort
                                                                                End If

                                                                                If Not (low = 0 AndAlso high = 0) Then
                                                                                    For i = low To high
                                                                                        _zf(_zfcnt)._val.Add(i.ToString)
                                                                                    Next
                                                                                Else
                                                                                    For Each row As DataRow In dt.Rows
                                                                                        Dim found As Boolean = False
                                                                                        For Each str As String In _zf(_zfcnt)._val
                                                                                            If str = row(_zf(_zfcnt)._name) Then
                                                                                                found = True
                                                                                                Exit For
                                                                                            End If
                                                                                        Next
                                                                                        If Not found Then
                                                                                            _zf(_zfcnt)._val.Add(row(_zf(_zfcnt)._name))
                                                                                        End If
                                                                                    Next
                                                                                End If
                                                                                _zfcnt += 1
                                                                            Next
                                                                            Dim dthold As DataTable = dt.Clone()
                                                                            For i = 0 To dt.Rows.Count - 1
                                                                                dthold.ImportRow(dt.Rows(i))
                                                                            Next

                                                                            zfill(dt, dthold, -1)
                                                                            'DONE:  Sort by columns here.
                                                                            Dim dvout As New DataView(dthold)
                                                                            Dim srt As String = ""
                                                                            Dim first As Boolean = True
                                                                            Dim srtcnt As Integer = 1
                                                                            Dim found1 As Boolean = True
                                                                            While found1
                                                                                found1 = False
                                                                                For Each zf As zerofill In _zf
                                                                                    If zf IsNot Nothing Then
                                                                                        If zf._sort = srtcnt Then
                                                                                            If Not first Then
                                                                                                srt &= ","
                                                                                            End If
                                                                                            srt &= zf._name
                                                                                            found1 = True
                                                                                            first = False
                                                                                            srtcnt += 1
                                                                                            Exit For
                                                                                        End If
                                                                                    End If
                                                                                Next
                                                                            End While
                                                                            dvout.Sort = srt
                                                                            dtout = dvout.ToTable
                                                                        Else
                                                                            'The table is in dt.
                                                                            If (dt.TableName <> "") Then dt.DataSet.Tables.Remove(dt.TableName)
                                                                            dtout = dt
                                                                        End If
                                                                        Dim dtschema As New DataTable()
                                                                        dtschema.Columns.Add("Name")
                                                                        For Each col As DataColumn In dtout.Columns
                                                                            Dim drs As DataRow = dtschema.NewRow()
                                                                            drs("Name") = col.ColumnName
                                                                            dtschema.Rows.Add(drs)
                                                                        Next
                                                                        dtschema.TableName = "Schema"
                                                                        ds.Tables.Add(dtschema)

                                                                        dtout.TableName = "Point"
                                                                        ds.Tables.Add(dtout)
                                                                        ds.WriteXml(writer)
                                                                    End If
                                                                End Using
                                                            Catch ex As Exception
                                                                abort = True
                                                                alertmsg = "SQL Error: " & ex.Message & vbCrLf & vbCrLf & "SQL DUMP: " & sql
                                                            End Try
                                                        End If
                                                    Next
                                                Next
                                            Next
                                        Next
                                    Next
                                Next
                            Next
                        Next
                    Next
                Next
            End If
            If Not abort Then 'xinfo
                If False Then 'Or _up = "dev." Then 'Was Nexxlinx specific ("nex.")
                    If qt("Xaxis") = "KPI" And qt("KPI") <> "" Then
                        If qt("Model") = "1" OrElse qt("Model") = "4" OrElse qt("Model") = "" Then
                            Dim dsx As New DataSet("CategoryInfo")
                            Dim dtx As New DataTable()
                            Dim _connection2 As String = CONFMGR.ConnectionStrings(_up & "Connection20").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                            Using db2 As New DbBaseSql(_connection2)
                                'TODO: A & B Goals are incomplete if there's a bell curve on the ranges.  It can be fixed,
                                If (qt("kpi").ToString.Length >= 6) AndAlso ((qt("kpi").Substring(0, 6) = "label_") OrElse (qt("kpi") = "eachlabel")) Then
                                    sql = "select mq.mqf#,klb.name as name,case when ((ksa.range1low is null) or (ks10.range1high is null)) then 'Unknown' else case when ks10.range1low < ksa.range1low then convert(varchar,CONVERT(DECIMAL(10,2),ks10.range1low)) +':' + convert(varchar,CONVERT(DECIMAL(10,2),ksa.range1high)) else convert(varchar,CONVERT(DECIMAL(10,2),ksA.range1low)) +':' + convert(varchar,CONVERT(DECIMAL(10,2),ks10.range1high)) end  end as AGoal,case when ((ksb.range1low is null) or (ksa.range1low is null)) then 'Unknown' else case when ksa.range1low < ksb.range1low then convert(varchar,CONVERT(DECIMAL(10,2),ksa.range1high)) + ':' + convert(varchar,CONVERT(DECIMAL(10,2),ksb.range1high)) else convert(varchar,CONVERT(DECIMAL(10,2),ksb.range1low)) + ':' + convert(varchar,CONVERT(DECIMAL(10,2),ksa.range1low)) end end as BGoal from kpi_mqf mq NOT_UPGRADED inner join kpi_klb kk on kk.idkpi=mq.mqf# inner join klb on klb.id=kk.idklb left outer join kpi_scoring ks10 on ks10.mqf#=mq.mqf# and ks10.score=10 left outer join kpi_scoring ksB on ksb.mqf#=mq.mqf# and ksB.score=4 left outer join kpi_scoring ksA on ksA.mqf#=mq.mqf# and ksA.score=8 where mq.line#=1 and mq.level#=1 and mq.txt<>'' order by mq.txt asc"
                                Else
                                    sql = "select mq.mqf#,mq.txt + ' ' + replace(cast(CAST((case when /* ('" & _client & "' = '42'  OR '" & _client & "' = '26' OR '" & _client & "' = '47' OR '" & _client & "' = '60') AND */ mqh.WEIGHT_FACTOR is not null then mqh.WEIGHT_FACTOR else mq.WEIGHT_FACTOR END *100) as decimal(10,1)) as varchar),'.0','') + '%' as name,case when ((ksa.range1low is null) or (ks10.range1high is null)) then 'Unknown' else case when ks10.range1low < ksa.range1low then convert(varchar,CONVERT(DECIMAL(10,2),ks10.range1low)) +':' + convert(varchar,CONVERT(DECIMAL(10,2),ksa.range1high)) else convert(varchar,CONVERT(DECIMAL(10,2),ksA.range1low)) +':' + convert(varchar,CONVERT(DECIMAL(10,2),ks10.range1high)) end end as AGoal,case when ((ksb.range1low is null) or (ksa.range1low is null)) then 'Unknown' else case when ksa.range1low < ksb.range1low then convert(varchar,CONVERT(DECIMAL(10,2),ksa.range1high)) + ':' + convert(varchar,CONVERT(DECIMAL(10,2),ksb.range1high)) else convert(varchar,CONVERT(DECIMAL(10,2),ksb.range1low)) + ':' + convert(varchar,CONVERT(DECIMAL(10,2),ksa.range1low)) end  end as BGoal from kpi_mqf mq NOT_UPGRADED left outer join kpi_scoring ks10 on ks10.mqf#=mq.mqf# and ks10.score=10  left outer join kpi_scoring ksB on ksb.mqf#=mq.mqf# and ksB.score=4 left outer join kpi_scoring ksA on ksA.mqf#=mq.mqf# and ksA.score=8 where mq.line#=1 and mq.level#=1 and mq.txt<>'' order by mq.txt asc"
                                End If
                                Using dtk As DataTable = db.GetDataTable(sql)
                                    dtx = dtk.Clone()
                                    dtx.Columns.Add("loaddate")
                                    Dim lname As String = ""
                                    For Each rowk As DataRow In dtk.Rows
                                        If rowk("name") <> lname Then
                                            Dim rowx As DataRow = dtx.NewRow
                                            rowx("mqf#") = rowk("mqf#")
                                            rowx("name") = rowk("name")
                                            rowx("AGoal") = rowk("AGoal")
                                            rowx("BGoal") = rowk("BGoal")
                                            rowx("loaddate") = "Not Found" 'TODO: Finish this by searching the verticals (punting for now so I don't end up with nothing tomorrow).
                                            Using dtdas As DataTable = db2.GetDataTable("select das.defivid,kpi_das.idkpi,filetype from das inner join kpi_das on kpi_das.iddas=das.id where(das.client = '" & _client & "'  and das.verticals='interval' and kpi_das.client = '" & _client & "') and kpi_das.idkpi='" & rowk("mqf#") & "'")
                                                If dtdas.Rows.Count > 0 Then
                                                    Using dtname As DataTable = db.GetDataTable("select top 10 '_' + replace(convert(varchar,startdate,111),'/','') + '_' + replace(convert(varchar,enddate,111),'/','') as datename from iv_type it inner join iv_dates id on id.ivid=it.id where(it.id in ( case when '" & dtdas.Rows(0).Item("defivid") & "' = '0' then (select org_interval from org) else '" & dtdas.Rows(0).Item("defivid") & "' end)) order by enddate desc")
                                                        Dim found As Boolean = False
                                                        For Each rowname As DataRow In dtname.Rows
                                                            sql = "select top 1 vh1.recdate from vh" & rowname("datename") & " vh1 "
                                                            Dim firstrow As Boolean = True
                                                            Dim cnt As Integer = 1
                                                            For Each rowdas As DataRow In dtdas.Rows
                                                                If Not firstrow Then
                                                                    sql &= " inner join vh" & rowname("datename") & " vh" & cnt.ToString & " on vh" & cnt.ToString & ".recdate=vh1.recdate and vh" & cnt.ToString & ".filetype='" & rowdas("filetype") & "'"
                                                                End If
                                                                cnt += 1
                                                                firstrow = False
                                                            Next
                                                            sql &= " where vh1.filetype='" & dtdas.Rows(0).Item("filetype") & "' order by vh1.recdate desc"
                                                            Using dtmatch As DataTable = db.GetDataTable(sql)
                                                                If dtmatch.Rows.Count > 0 Then
                                                                    rowx("loaddate") = dtmatch.Rows(0).Item("recdate").ToShortDateString
                                                                    found = True
                                                                End If
                                                            End Using
                                                            If found Then
                                                                Exit For
                                                            End If
                                                        Next
                                                    End Using
                                                Else
                                                    If False Then 'Or _up = "dev." Then 'Assume AVAYA by itself - was "nex." - specific
                                                        Using dtav As DataTable = db.GetDataTable("select top 1 row_date from avaya_raw order by row_date desc")
                                                            If (dtav.Rows.Count >= 1) Then
                                                                rowx("loaddate") = dtav.Rows(0).Item("row_date").ToShortDateString
                                                            End If
                                                        End Using
                                                    End If
                                                End If
                                            End Using
                                            dtx.Rows.Add(rowx)
                                            lname = rowk("name")
                                        End If
                                    Next
                                End Using
                            End Using
                            dtx.TableName = "Xinfo"
                            dsx.Tables.Add(dtx)
                            dsx.WriteXml(writer)
                        End If
                    End If
                End If
                'sql = "select"
                '            inner join kpi_klb kk on kk.idkpi=mq.mqf# inner join klb on klb.id=kk.idklb inner join kpilist k on k.id=klb.id
            End If

            If abort Then
                Dim ds As New DataSet("Communication")
                Dim dtmsg As New DataTable()
                dtmsg.Columns.Add("Message")
                Dim dr As DataRow = dtmsg.NewRow()
                dr("Message") = alertmsg
                dtmsg.Rows.Add(dr)
                dtmsg.TableName = "Alert"
                ds.Tables.Add(dtmsg)
                ds.WriteXml(writer)
            End If
            writer.WriteEndElement()
            writer.WriteEndDocument()
            writer.Close()
            sbXML = sbXML.Replace("encoding=""utf-16""", "")
            Return sbXML.ToString
        End Using

    End Function

    Private Sub zfill(ByRef dt As DataTable, ByRef dtout As DataTable, ByVal depth As Integer)
        If (depth + 1) < _zfcnt Then
            For i As Integer = 0 To _zf(depth + 1)._val.Count - 1
                _zf(depth + 1)._i = i
                zfill(dt, dtout, depth + 1)
            Next
        Else
            Dim match As Boolean = False
            For Each row As DataRow In dt.Rows
                match = True
                For i As Integer = 0 To _zfcnt - 1
                    If row(_zf(i)._name) <> _zf(i)._val(_zf(i)._i) Then
                        match = False
                        Exit For
                    End If
                Next
                If match Then Exit For
            Next
            If Not match Then
                Dim dr As DataRow = dtout.NewRow()
                For Each col As DataColumn In dtout.Columns
                    If dr.Item(col.ColumnName).GetType.ToString <> "System.String" AndAlso dr.Item(col.ColumnName).GetType.ToString <> "System.DateTime" Then
                        dr.Item(col.ColumnName) = 0
                    End If
                Next
                For i As Integer = 0 To _zfcnt - 1
                    dr.Item(_zf(i)._name) = _zf(i)._val(_zf(i)._i)
                Next
                dtout.Rows.Add(dr)
            End If
        End If
    End Sub

    Private Function eachval(key As String) As String
        Dim bld As String = ""
        If key <> _xes._key Then
            If _xes._key = "Payperiod" And (key = "StartDate" Or key = "EndDate") Then
            Else
                bld &= "&" & key & "=" & qt(key)
            End If
        End If
        Return bld
    End Function

    Private Function deansDate(dt As String) As String
        Dim bld As String = ""
        Dim sp() As String = dt.Split("/")
        bld = sp(2) & sp(0).PadLeft(2, "0") & sp(1).PadLeft(2, "0")
        Return bld
    End Function

    Public Function substituteparams(ByVal sql As String) As String
        Dim bld As String = ""
        While sql.IndexOf("/**") >= 0
            bld &= sql.Substring(0, sql.IndexOf("/**"))
            Dim wk As String = sql.Substring(sql.IndexOf("/**") + 3)
            wk = wk.Substring(0, wk.IndexOf("**/"))
            Dim sep(3) As Char
            'sep(0) = "{"
            sep(0) = ","
            sep(1) = "("
            sep(2) = ")"
            'sep(4) = "}"
            'DONE: This needs to not split in the following situations:
            '  If inside {} brackets.
            '  If inside quotes.
            '  In other words, it needs to be a real parser.
            'Existing Way
            'Dim wksplit() As String = wk.Split(sep)
            'New Way
            Dim wksplit() As String = parsesplit(wk, sep)
            '"{{CONDITIONBLOCK{DATERANGE{kh.RESPDT,StartDate,EndDate}}}"
            Dim n As Integer = 0

            Dim whereblock As Boolean = False
            Dim daterangeq As Boolean = False
            Dim startdrill As Boolean = False
            Dim bgcolorbyval As Boolean = False
            Dim monitorfields As Boolean = False
            Dim monitorjoins As Boolean = False
            Dim equalq As Boolean = False
            Dim firstcondition As Boolean
            Dim zerofill As Boolean = False
            While n < wksplit.Length
                If wksplit(n).Trim = "WHEREBLOCK" Then
                    whereblock = True
                    firstcondition = True
                    n += 1
                ElseIf wksplit(n).Trim = "ANDBLOCK" Then
                    whereblock = True
                    firstcondition = False
                    n += 1
                ElseIf wksplit(n).Trim = "MONITORFIELDS" Then
                    monitorfields = True
                    n += 1
                ElseIf wksplit(n).Trim = "MONITORJOINS" Then
                    monitorjoins = True
                    n += 1
                ElseIf wksplit(n).Trim = "START_DRILL" Then
                    startdrill = True
                    n += 1
                ElseIf wksplit(n).Trim = "END_DRILL" Then
                    bld &= " + '</a>'"
                    n += 1
                ElseIf wksplit(n).Trim = "START_BGCOLORBYVAL" Then
                    bgcolorbyval = True
                    n += 1
                ElseIf wksplit(n).Trim = "END_BGCOLORBYVAL" Then
                    bld &= " + '</span>'"
                    n += 1
                ElseIf wksplit(n).Trim = "ZERO_FILL" Then
                    zerofill = True
                    n += 1
                ElseIf wksplit(n).Trim = "SELECTX" Then
                    If _context.Request.QueryString("KPI") = "" Then
                        bld &= _xes._selectxALL
                    Else
                        bld &= _xes._selectx
                    End If
                    n += 1
                ElseIf wksplit(n).Trim = "GROUPX" Then
                    If _context.Request.QueryString("KPI") = "" Then
                        bld &= _xes._groupxALL
                    Else
                        bld &= _xes._groupx
                    End If
                    n += 1
                ElseIf wksplit(n).Trim = "ORDERX" Then
                    If _context.Request.QueryString("KPI") = "" Then
                        bld &= _xes._orderxALL
                    Else
                        bld &= _xes._orderx
                    End If
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
                                    bld &= equalsubstitution(firstcondition, wksplit(n).Trim, wksplit(n + 1).Trim)
                                    n += 2
                                Else
                                    n += 1
                                End If
                            Else
                                n += 1
                            End If
                        End If
                    ElseIf startdrill Then
                        bld &= "'<a href=""" & wksplit(n).Trim.Replace("{", "'+").Replace("}", "+'") & """>' + "
                        startdrill = False
                        n += 1
                    ElseIf bgcolorbyval Then
                        Dim nc As Integer = Convert.ToInt32(wksplit(n + 1).Trim)
                        Dim i As Integer
                        bld &= "'<span style=""margin-top:0px;display:block;color:white;background-color:' + CASE"
                        For i = 0 To nc - 1
                            bld &= " WHEN (" & wksplit(n).Trim.Replace("{", "").Replace("}", "") & ")"
                            bld &= " >= " & wksplit(n + 2 + (2 * i)) & " THEN '" & wksplit(n + 2 + (2 * i) + 1) & "'"
                        Next
                        bld &= " ELSE 'black' END + ';"">' + "
                        bgcolorbyval = False
                    ElseIf zerofill Then
                        If _zerofill Is Nothing Then
                            _zerofill = New ArrayList()
                        End If
                        If wksplit(n) <> "" Then
                            _zerofill.Add(wksplit(n))
                        End If
                        n += 1
                    ElseIf monitorfields Then
                        Using db As New DbBaseSql(_connection)
                            Using dt As DataTable = db.exec("select mq1.mqf_id as mqf_id_section,mq1.txt as Section,mq2.mqf_id as mqf_id_question,mq2.txt as Question from monitor_sqf ms inner join monitor_mqf mq1 on mq1.mqf_id=ms.mqf_id inner join monitor_mqf mq2 on mq2.mqf#=mq1.mqf# and mq2.line#=2 and mq2.txt<>'' where ms.sqf_code = '" & qt(wksplit(n).Trim()) & "' order by ms.sqf# asc,mq2.level# asc")
                                Dim seccnt As Integer = 0
                                Dim section As String = ""
                                For Each row As DataRow In dt.Rows
                                    If (row("mqf_id_section").ToString <> section) Then
                                        section = row("mqf_id_section").ToString
                                        seccnt += 1
                                        bld &= ",mq" & section & ".txt as 'Section " & seccnt.ToString & "'"
                                    End If
                                    Dim question As String = row("mqf_id_question").ToString
                                    bld &= ",case when mq" & question & ".yes_value_resp is not null then 'Yes' else case when mq" & question & ".no_value_resp is not null then 'No' else case when mq" & question & ".partial_value_resp is not null then 'Partial' else case when mq" & question & ".na_value_resp is not null then 'N/A' else 'Unknown' end end end end as '" & row("Question") & "'"
                                Next
                            End Using
                        End Using
                        n += 1
                        monitorfields = False
                    ElseIf monitorjoins Then
                        Using db As New DbBaseSql(_connection)
                            Using dt As DataTable = db.exec("select mq1.mqf_id as mqf_id_section,mq1.txt as Section,mq2.mqf_id as mqf_id_question,mq2.txt as Question from monitor_sqf ms inner join monitor_mqf mq1 on mq1.mqf_id=ms.mqf_id inner join monitor_mqf mq2 on mq2.mqf#=mq1.mqf# and mq2.line#=2 and mq2.txt<>'' where ms.sqf_code = '" & qt(wksplit(n).Trim()) & "' order by ms.sqf# asc,mq2.level# asc")
                                Dim mnh As String = wksplit(n + 1).Trim()
                                Dim seccnt As Integer = 0
                                Dim section As String = ""
                                For Each row As DataRow In dt.Rows
                                    If (row("mqf_id_section").ToString <> section) Then
                                        section = row("mqf_id_section").ToString
                                        seccnt += 1
                                        bld &= " left outer join monitor_mqf mq" & section & " on mq" & section & ".mqf_id=" & section & " "
                                    End If
                                    Dim question As String = row("mqf_id_question").ToString
                                    bld &= " left outer join  monitor_resp mq" & question & " on mq" & question & ".monitor_id=" & mnh & ".monitor_id and mq" & question & ".mqf_id=" & question & " "
                                Next
                            End Using
                        End Using
                        n += 2
                        monitorjoins = False
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
        variable = variable.Replace("{", "").Replace("}", "")
        Dim bld As String = ""
        If qt(stname) <> "" And (qt(stname).Length < 4 OrElse qt(stname).Substring(0, 4) <> "each") Then
            If qt(edname) <> "" Then
                If firstcondition Then
                    bld &= " WHERE "
                Else
                    bld &= " AND "
                End If
                firstcondition = False
                If qt(stname).Length >= 4 AndAlso qt(stname).Substring(0, 4) = "each" Then
                    If variable.ToLower = "hst.span" Then
                        bld &= "hst.spanend" & " >= '" & _earliestdate.ToShortDateString & "' AND " & "hst.spanstart" & " <= '" & Date.Now.Date.ToShortDateString & "' "
                    Else
                        bld &= variable & " >= '" & _earliestdate.ToShortDateString & "' AND " & variable & " <= '" & Date.Now.Date.ToShortDateString & "' "
                    End If
                Else
                    If variable.ToLower = "hst.span" Then
                        bld &= "hst.spanend" & " >= '" & qt(stname) & "' AND " & "hst.spanstart" & " <= '" & qt(edname) & "' "
                    Else
                        bld &= variable & " >= '" & qt(stname) & "' AND " & variable & " <= '" & qt(edname) & "' "
                    End If
                End If
            End If
        End If
        Return bld
    End Function

    Private Function equalsubstitution(ByRef firstcondition As Boolean, variable As String, name As String) As String
        variable = variable.Replace("{", "").Replace("}", "")
        Dim bld As String = ""
        Dim iskpi As Boolean = (name.ToUpper = "KPI")
        Dim isproject As Boolean = (name.ToUpper = "PROJECT")
        Dim isagency As Boolean = (name.ToUpper = "AGENCY")

        'TODO: add isproject here.  If the project is global (0), then there is no filter.
        If isproject AndAlso (qt("project") = "0") Then
            'Don't substitute
        ElseIf iskpi AndAlso (name.ToUpper = "KPI") AndAlso (qt("kpi").ToString.Length >= 5) AndAlso ((qt("kpi").Substring(0, 5) = "label") OrElse (qt("kpi") = "eachlabel")) Then
            'Don't substitute
        Else
            If qt(name) <> "" And (qt(name).Length < 4 OrElse qt(name).Substring(0, 4) <> "each") Then
                If (Not isproject) OrElse (isproject And (qt(name) <> "0")) Then
                    If firstcondition Then
                        bld &= " WHERE "
                    Else
                        bld &= " AND "
                    End If
                    firstcondition = False
                    If iskpi Then
                        bld &= variable & " in (" & qt(name) & ") "
                    ElseIf isagency AndAlso qt(name) = "1" Then
                        bld &= "(" & variable & " IN ('1') OR " & variable & " is null)" '"Direct Hire" is assumed if no RecruitedBy record exists.
                    Else
                        'MODIFIED 2017-03-7 - Change = 'X' to be IN ('X').  This should work in all cases.
                        'WAS:
                        'bld &= variable & " = '" & qt(name) & "' "
                        bld &= variable & " IN ("
                        Dim sp() As String = qt(name).Split(",")
                        For i As Integer = 0 To sp.Length - 1
                            Dim first As Boolean = True
                            If Not first Then bld &= ","
                            bld &= "'" & sp(i) & "'"
                            first = False
                        Next
                        bld &= ")"

                    End If
                End If
            End If
        End If
        Return bld
    End Function

    Private Function qt(str As String) As String
        If _context.Request.QueryString(str) Is Nothing Then
            Return ""
        Else
            Select Case str
                Case "Agency"
                    Return _agencys(_agencysCount)
                Case "Agencyoffice"
                    Return _agencyoffices(_agencyofficesCount)
                Case "Project"
                    Return _projects(_projectsCount)
                Case "Location"
                    Return _locations(_locationsCount)
                Case "Group"
                    Return _groups(_groupsCount)
                Case "Team"
                    Return _teams(_teamsCount)
                Case "CSR"
                    Return _CSRs(_CSRsCount)
                Case "StartDate"
                    If qt("qid") = "PayTable" Then Return _context.Request.QueryString(str)
                    If _Payperiods(_PayperiodsCount) = "" Then Return ""
                    If _Payperiods(_PayperiodsCount).IndexOf("~") >= 0 Then
                        Return _Payperiods(_PayperiodsCount).Split("~")(0)
                    Else
                        Return _context.Request.QueryString(str)  '.Split(",")(0) 'check this.
                    End If
                Case "EndDate"
                    If qt("qid") = "PayTable" Then Return _context.Request.QueryString(str)
                    If _Payperiods(_PayperiodsCount) = "" Then Return ""
                    If _Payperiods(_PayperiodsCount).IndexOf("~") >= 0 Then
                        Return _Payperiods(_PayperiodsCount).Split("~")(1)
                    Else
                        Return _context.Request.QueryString(str)  '.Split(",")(0) 'check this.
                    End If
                Case "KPI"
                    'If (_xes._key.Length >= 5 AndAlso _xes._key.Substring(0, 5) = "each_") Then
                    If (_xes._key <> "KPI") Then
                        If _KPIsCount < _KPIs.Length Then
                            Return _KPIs(_KPIsCount)
                        Else
                            Return ""
                        End If
                    Else
                        Return _context.Request.QueryString(str)
                    End If
                Case "SubKPI"
                    'If (_xes._key.Length >= 5 AndAlso _xes._key.Substring(0, 5) = "each_") Then
                    If (_xes IsNot Nothing) AndAlso (_xes._key <> "SubKPI") Then
                        If _SubKPIsCount < _SubKPIs.Length Then
                            Return _SubKPIs(_SubKPIsCount)
                        Else
                            Return ""
                        End If
                    Else
                        Return _context.Request.QueryString(str)
                    End If
                Case Else
                    Return _context.Request.QueryString(str)  '.Split(",")(0) 'check this.
            End Select
        End If
    End Function

    Private Sub GetEach(ByVal paramname As String, ByRef strs() As String)
        Dim searchfor As String = paramname
        If paramname = "Payperiod" Then
            searchfor = "StartDate"
        End If
        If (_killhighfilters) AndAlso ((paramname = "Location") OrElse (paramname = "Group") OrElse (paramname = "Team")) Then
            strs = "".Split(",") 'note there will still be one member even if this is blank.
        ElseIf (_killhighfilters AndAlso paramname = "Project" AndAlso Not String.IsNullOrEmpty(_context.Request.QueryString("StartDate")) AndAlso _context.Request.QueryString("StartDate").Length > 5 AndAlso _context.Request.QueryString("StartDate").Substring(0, 5) <> "each_") Then
            'ADDED 2019-07-08 - Find all Projects used by this agent within the date range and return them.
            Using db As New DbBaseSql(_connection)
                Dim bld As String = ""
                Dim first As Boolean = True
                Using dt As DataTable = db.exec("SELECT distinct pj.projectid,pj.projectdesc from kpi_hstry kh inner join project pj on pj.projectid=kh.project_id where user_id='" & db.reap(_context.Request.QueryString("CSR").ToString) & "' and kh.respdt >= '" & db.reap(_context.Request.QueryString("StartDate").ToString) & "' and kh.respdt <= '" & db.reap(_context.Request.QueryString("EndDate").ToString) & "' and pj.model_id='1' order by pj.projectdesc")
                    For Each row As DataRow In dt.Rows
                        If Not first Then bld &= ","
                        bld &= row.Item("projectid")
                        first = False
                    Next
                    strs = bld.Split(",")
                End Using
            End Using
        ElseIf _context.Request.QueryString(searchfor) Is Nothing Then 'OrElse 
            strs = "".Split(",") 'note there will still be one member even if this is blank.
        ElseIf paramname = "KPI" And (qt("QID") = "KPITable" OrElse (qt("QID") = "KPIChart" AndAlso qt("daterange") = "")) Then
            strs = _context.Request.QueryString(searchfor).Split("!") 'Split by something that will never be there (we want to maintain the comma-separated string, except when trending).
        ElseIf (_context.Request.QueryString(searchfor).Length < 4 OrElse _context.Request.QueryString(searchfor).Substring(0, 4) <> "each") Then 'Note: Can't use qt() here, I hijacked it.
            If paramname = "Payperiod" Then
                strs = (_context.Request.QueryString(searchfor).ToString & "~" & _context.Request.QueryString("EndDate").ToString).Split(",")
            Else
                strs = _context.Request.QueryString(searchfor).Split(",") 'note there will still be one member even if this is blank.
            End If
        Else
            If (Not (paramname = "KPI" AndAlso (qt("trendby") = "0" AndAlso (_client <> "47")) AndAlso qt("daterange") <> "")) _
                    AndAlso ((paramname = "Payperiod" AndAlso (qt("Xaxis").Length >= 5 AndAlso qt("Xaxis").Substring(0, 5) = "each_")) _
                    OrElse (paramname = qt("Xaxis")) OrElse ((paramname = "SubKPI") And (qt("Xaxis") = "KPI"))) Then
                strs = "".Split(",") 'Pass through eaches if this is the xaxis.
            Else
                'TODO: Copy the existing context.
                'Replace all of the "Each"es with Blanks.
                'Add a "reload=" parameter for the paramname in question
                Dim fc As New FilterContext(_context)
                Dim io As System.IO.Stream = fc.ProcessRequestIOStream(reloadoverride:=paramname, periodinterval:=_context.Request.QueryString(searchfor))
                Dim lmx As New XmlDocument
                lmx.Load(io)
                Dim bld As String = ""
                Dim first As Boolean = True
                For Each maintag As XmlNode In lmx.GetElementsByTagName("Combofilters")
                    For Each otag As XmlNode In lmx.GetElementsByTagName(paramname & "s")
                        For Each ntag As XmlNode In lmx.GetElementsByTagName(paramname & "s")
                            For Each tag As XmlNode In otag.ChildNodes
                                If tag.Name = paramname Then
                                    For Each ktag As XmlNode In tag.ChildNodes
                                        If ktag.Name = "key" Then
                                            If ktag.InnerText <> "" AndAlso ktag.InnerText <> "disabled" Then
                                                Dim suppress = False
                                                If paramname = "CSR" AndAlso qt("Filter0") <> "" Then
                                                    'ADDED: 2017-12-31 to keep agents from being returned if they violate the filters.
                                                    'This ONLY works for EACH.
                                                    Dim n As Integer = 0
                                                    Dim mysql As String = "select us.user_id from usr us"
                                                    While qt("Filter" & n.ToString) <> ""
                                                        'NOTE: This iterates for every single attribute and will be a pig.  (this is being discontinued soon anyway).
                                                        If qt("Not" & n.ToString) = "" Then
                                                            mysql &= " inner join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'"
                                                            mysql &= " where us.user_id = '" & ktag.InnerText.Replace(",", "~") & "'"
                                                        Else 'TODO: How do you do the non-existence of an inner join? left outer
                                                            mysql &= " left outer join usr_filter uf" & n.ToString & " on uf" & n.ToString & ".user_id = us.user_id and uf" & n.ToString & ".filter_id='" & qt("Filter" & n.ToString) & "'"
                                                            mysql &= " WHERE us.user_id = '" & ktag.InnerText.Replace(",", "~") & "' AND uf" & n.ToString & ".filter_id is null"
                                                        End If
                                                        Using db As New DbBaseSql(_connection)
                                                            Using dt As DataTable = db.exec(mysql)
                                                                If dt.Rows.Count = 0 Then
                                                                    suppress = True
                                                                End If
                                                            End Using
                                                        End Using
                                                        n += 1
                                                    End While
                                                End If
                                                If Not suppress Then
                                                    If Not first Then bld &= ","
                                                    bld &= ktag.InnerText.Replace(",", "~") 'In case commas get in, also to handle payperiod.
                                                    first = False
                                                End If
                                            End If
                                        End If
                                    Next
                                End If
                            Next
                        Next
                    Next
                Next
                strs = bld.Split(",")
            End If
        End If
    End Sub

    Private Function ismember(str() As String, label As String) As Boolean
        For Each st As String In str
            If st = label Then
                Return True
            End If
        Next
        Return False
    End Function

    'sep(0) = "{"
    '        sep(0) = ","
    '        sep(1) = "("
    '        sep(2) = ")"
    'sep(4) = "}"
    'TODO: This needs to not split in the following situations:
    '  If inside {} brackets.
    '  If inside quotes.
    '  In other words, it needs to be a real parser.
    'Existing Way
    'Dim wksplit() As String = wk.Split(sep)
    'New Way

    Private Function parsesplit(wk As String, sep() As Char) As String()
        'Convert "(  , , {  ( , } )' to
        '        "(  , , {  ~01 ~00 } )'
        'TODO: Add quote and double-quote capabilities
        'TODO: Allow for nested curlies
        Dim wk2 As String = ""
        Dim i As Integer
        Dim j As Integer
        Dim incurly As Boolean = False
        For Each c As Char In wk.ToCharArray
            If c = "{" Then
                incurly = True
            ElseIf c = "}" Then
                incurly = False
            End If
            If Not incurly Then
                wk2 &= c
            Else
                Dim o As String = c
                For i = 0 To sep.Length - 1
                    If c = sep(i) Then
                        o = "~" & i.ToString.PadLeft(2, "0")
                        Exit For
                    End If
                Next
                wk2 &= o
            End If
        Next
        Dim wksplit() As String = wk2.Split(sep)
        For i = 0 To wksplit.Length - 1
            For j = 0 To sep.Length - 1
                wksplit(i) = wksplit(i).Replace("~" & j.ToString.PadLeft(2, "0"), sep(j))
            Next
        Next
        Return wksplit
    End Function

    Public Function urlprefix(Optional BypassParam As Boolean = False) As String
        Dim sp As New SitePage
        Return sp.urlprefix(BypassParam)
    End Function

End Class
