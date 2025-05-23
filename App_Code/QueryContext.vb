Imports Microsoft.VisualBasic
Imports System.Web
Imports System.Xml
Imports System.Data
Imports jglib

'Things that need updated in query15.
'   The Decimal conversions for the Score and Raw
'   Pass mq.FMT when xaxis=kpi
'   pass weight as calls for subkpi (AHT).
'   ...There may be more.

Public Class QueryContext
    Private _connection As String = ""
    Private _utilities As String = ""
    Private CONFMGR As ConfMgr = New ConfMgr()

    Private _context As HttpContext

    Public Sub New(ByRef context As HttpContext)
        _context = context
    End Sub

    Private _intervaltable As String = "ABC_PAYPERIODS"

    Private _locations() As String = Nothing
    Private _groups() As String = Nothing
    Private _teams() As String = Nothing
    Private _CSRs() As String = Nothing
    Private _KPIs() As String = Nothing
    Private _Payperiods() As String = Nothing
    Private _locationsCount As Integer = 0
    Private _groupsCount As Integer = 0
    Private _teamsCount As Integer = 0
    Private _CSRsCount As Integer = 0
    Private _KPIsCount As Integer = 0
    Private _PayperiodsCount As Integer = 0
    Private _earliestdate As Date = Convert.ToDateTime("2011-01-01")

    Private _zerofill As ArrayList = Nothing

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

    Public Function ProcessRequest() As String
        _context.Response.ContentType = "text/xml"
        Try
            _connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            _utilities = CONFMGR.ConnectionStrings(urlprefix() & "Utilities").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            If qt("Connection") <> "" Then
                _connection = CONFMGR.ConnectionStrings(urlprefix() & qt("Connection")).ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            End If
        Catch ex As Exception

        End Try


        Select Case qt("Xaxis")
            Case "CSR" 'I think this is only half done.
                _xes = New xaxis("CSR", _
                  "'CSR=' + us.USER_ID as [key],us.USER_ID AS x,sum(kr.KPI_SCORE)/COUNT(*) as y", _
                  "group by us.USER_ID", _
                  "order by y", _
                  "'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end As y from (select sum(kr.KPI_SCORE)/COUNT(*) as AvgScore, mq.WEIGHT_FACTOR*100 as Weight", _
                  "group by mq.TXT,mq.WEIGHT_FACTOR", _
                  ") a")
            Case "Payperiod"
                'YEAR PART (insert 2 lines down - this is out because of crowded labels):    "+'/'+cast((DATEPART(yy,pp.startdate)-2000) as varchar(5))" & _
                _xes = New xaxis("Payperiod", _
                  "'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key], cast(DATEPART(m,pp.startdate) as varchar(5))+'/'+cast(DATEPART(dd,pp.startdate) as varchar(5))" & _
                    " AS x,sum(kr.KPI_SCORE)/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw", _
                  "group by pp.startdate,pp.enddate", _
                  "order by pp.startdate asc", _
                  "'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], cast(DATEPART(m,myend) as varchar(5))+'/'+cast(DATEPART(dd,myend) as varchar(5)) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end As y  from (select sum(kr.KPI_SCORE)/COUNT(*) as AvgScore,mq.WEIGHT_FACTOR*100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                  "group by mq.TXT,mq.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                  "order by mystart asc")
                If qt("Xaxis") = "Month" Then
                    _intervaltable = "ABC_MONTHS"
                End If
            Case "Month"
                'YEAR PART (insert 2 lines down):    
                _xes = New xaxis("Payperiod", _
                  "'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key], cast(DATEPART(m,pp.startdate) as varchar(5))" & _
                    "+'/'+cast((DATEPART(yy,pp.startdate)-2000) as varchar(5))" & _
                    " AS x,sum(kr.KPI_SCORE)/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw", _
                  "group by pp.startdate,pp.enddate", _
                  "order by pp.startdate asc", _
                  "'StartDate=' + convert(varchar,mystart,101) + '&EndDate=' + convert(varchar,myend,101) as [key], cast(DATEPART(m,mystart) as varchar(5))+'/'+cast(DATEPART(dd,myend) as varchar(5)) AS x,case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end As y  from (select sum(kr.KPI_SCORE)/COUNT(*) as AvgScore,mq.WEIGHT_FACTOR*100 as Weight,pp.startdate As mystart,pp.enddate as myend ", _
                  "group by mq.TXT,mq.WEIGHT_FACTOR,pp.startdate,pp.enddate) a group by mystart,myend", _
                  "order by mystart asc")
                If qt("Xaxis") = "Month" Then
                    _intervaltable = "ABC_MONTHS"
                End If
            Case Else 'Includes KPI as default
                'TODO: To order by NAME, change "order by mq.WEIGHT_FACTOR" desc to "order by y"
                _xes = New xaxis("KPI", _
                  "'KPI=' + cast(kr.MQF# as varchar(10)) as [key],mq.TXT + ' ' + cast(CAST((mq.WEIGHT_FACTOR*100) as decimal) as varchar(5)) + '%' AS x,sum(kr.KPI_SCORE)/COUNT(*) as y,sum(kr.RANGE)/COUNT(*) as raw,mq.FMT as fmt", _
                  "group by kr.MQF#,mq.TXT,mq.WEIGHT_FACTOR,mq.FMT", _
                  "order by mq.WEIGHT_FACTOR desc", _
                  "'KPI=' as [key],'All KPIs' As x, case when sum(Weight) = 0 then 0 else SUM(AvgScore * Weight) / SUM(Weight) end As y from (select sum(kr.KPI_SCORE)/COUNT(*) as AvgScore, mq.WEIGHT_FACTOR*100 as Weight", _
                  "group by mq.TXT,mq.WEIGHT_FACTOR", _
                  ") a")
        End Select

        If _context.Request.QueryString("StartDate") IsNot Nothing AndAlso _context.Request.QueryString("StartDate") = "eachmonth" Then
            _intervaltable = "ABC_MONTHS"
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

            Dim alertmsg As String = ""
            Dim abort As Boolean = False
            Dim seriescount As Integer = 0
            If Not abort Then
                GetEach("Location", _locations)
                GetEach("Group", _groups)
                GetEach("Team", _teams)
                GetEach("CSR", _CSRs)
                GetEach("KPI", _KPIs)
                GetEach("Payperiod", _Payperiods)
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
                If product > 75 Then
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
            If Not abort Then
                For _PayperiodsCount As Integer = _Payperiods.Length - 1 To 0 Step -1
                    For _KPIsCount As Integer = 0 To _KPIs.Length - 1
                        For _locationsCount As Integer = 0 To _locations.Length - 1
                            For _groupsCount As Integer = 0 To _groups.Length - 1
                                For _teamsCount As Integer = 0 To _teams.Length - 1
                                    For _CSRsCount As Integer = 0 To _CSRs.Length - 1
                                        Dim ds As New DataSet("Series" & seriescount.ToString)
                                        seriescount += 1
                                        Dim bld As String = ""
                                        Dim pad As String = ""
                                        If qt("CSR") <> "" Then
                                            Using dt As DataTable = db.exec("SELECT FIRSTNM,LASTNM FROM USR where USER_ID='" & qt("CSR") & "'")
                                                If dt.Rows.Count > 0 Then
                                                    bld &= pad & dt.Rows(0).Item("FIRSTNM").ToString.Trim & " " & dt.Rows(0).Item("LASTNM").ToString.Trim & " (" & qt("CSR") & ")"
                                                    pad = " "
                                                End If
                                            End Using
                                        Else
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
                                                        Using dt As DataTable = db.exec("SELECT ProjectDesc FROM PROJECT where ProjectID='" & qt("Project") & "'")
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
                                        If qt("InTraining") = "Exclude" And qt("CSR") = "" Then
                                            bld &= pad & "(No In-Training)"
                                        End If
                                        If qt("pass_Caption").ToString <> "" Then
                                            bld = qt("pass_Caption")
                                        End If
                                        If qt("StartDate") <> "" Then
                                            Dim mydate As Date = Convert.ToDateTime(qt("StartDate"))
                                            bld &= pad & mydate.Month.ToString & "/" & mydate.Day.ToString
                                        End If
                                        If qt("EndDate") <> "" Then
                                            Dim mydate As Date = Convert.ToDateTime(qt("EndDate"))
                                            bld &= "-" & mydate.Month.ToString & "/" & mydate.Day.ToString
                                        End If
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
                                        ElseIf _xes._key = "Payperiod" Or _xes._key = "Month" Or qt("qid") = "KPITable" Then
                                            If qt("KPI") <> "" Then
                                                Using dt As DataTable = db.exec("SELECT TXT FROM KPI_MQF where line#=1 and level#=1 and mqf#='" & qt("KPI") & "'")
                                                    If dt.Rows.Count > 0 Then
                                                        bld &= pad & "- " & dt.Rows(0).Item("TXT").ToString.Trim
                                                        pad = " "
                                                    End If
                                                End Using
                                            Else
                                                bld &= pad & "- All KPIs"
                                            End If
                                        End If

                                        If bld = "" Then bld = "Everything"

                                        Dim params As String = ""
                                        params &= eachval("Project")
                                        params &= eachval("Location")
                                        params &= eachval("Group")
                                        params &= eachval("Team")
                                        params &= eachval("CSR")
                                        params &= eachval("StartDate")
                                        params &= eachval("EndDate")
                                        params &= eachval("KPI")
                                        params &= eachval("Xaxis")  'I don't think this matters.
                                        params &= "&InTraining=" + qt("InTraining")
                                        params &= "&Connection=" + qt("Connection")

                                        Dim dtname As New DataTable()
                                        dtname.Columns.Add("Name")
                                        dtname.Columns.Add("Params")
                                        Dim dr As DataRow = dtname.NewRow()
                                        dr("Name") = bld
                                        dr("Params") = params
                                        dtname.Rows.Add(dr)
                                        dtname.TableName = "Spec"
                                        ds.Tables.Add(dtname)
                                        If qt("qid") = "KPIChart" Then
                                            sql = "select /**SELECTX()**/" & _
                                                " from KPI_HSTRY kh" & _
                                                " inner join KPI_RESP kr on kr.KPI_ID = kh.KPI_ID" & _
                                                " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                                                " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                                                " inner join " & _intervaltable & " pp on pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT" & _
                                                " where pp.startdate > '" & (Now.Year - 1).ToString.PadLeft(4, "0") & "-" & Now.Month.ToString.PadLeft(2, "0") & "-" & Now.Day.ToString.PadLeft(2, "0") & "' " & _
                                                " /**ANDBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                                "EQUAL(pj.ProjectID,Project)" & _
                                                "EQUAL(lc.LOC_ID,Location)" & _
                                                "EQUAL(gp.GROUP_ID,Group)" & _
                                                "EQUAL(tm.TEAM_ID,Team)" & _
                                                "EQUAL(us.USER_ID,CSR)" & _
                                                "EQUAL(mq.MQF#,KPI)**/" & _
                                                " /**GROUPX()**/" & _
                                                " /**ORDERX()**/;"
                                            If qt("InTraining") = "Exclude" And qt("CSR") = "" Then
                                                sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID and us.status<>'7'")
                                            End If
                                        ElseIf qt("qid") = "PayChart" Then
                                            Dim backdate As Date = DateAdd("d", -(8 * 14), Now.Date)
                                            sql = "select [key],x," & _
                                                " case when sum(total_hours) > 0 then sum(y * total_hours) / sum(total_hours) else 0 end as y," & _
                                                " case when sum(total_hours) <= 0 then 'C' else case when (sum(y * total_hours) / sum(total_hours)) >= 8 then 'A' else case when (sum(y * total_hours) / sum(total_hours)) >= 4 then 'B' else 'C' end end end  as paylevel," & _
                                                " sum(regular_hours) as regular_hours," & _
                                                " case when sum(regular_hours) > 0 then sum(regular_total)/sum(regular_hours) else 0.0 end as regular_payrate," & _
                                                " sum(regular_total) as regular_total," & _
                                                " sum(overtime_hours) as overtime_hours," & _
                                                " case when sum(overtime_hours) > 0 then sum(overtime_total)/sum(overtime_hours) else 0.0 end as overtime_payrate," & _
                                                " sum(overtime_total) as overtime_total," & _
                                                " sum(total_pay) as total_pay,locked" & _
                                                " from (" & _
                                                " select pp.startdate," & _
                                                " tm.project_id," & _
                                                " lc.loc_id," & _
                                                " gp.group_id," & _
                                                " tm.team_id," & _
                                                " pay.user_id," & _
                                                " 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                                " case when pp.enddate >= getdate() then 'Current' else cast(DATEPART(m,pp.enddate) as varchar(5))+'/'+cast(DATEPART(dd,pp.enddate) as varchar(5))+'/'+cast(DATEPART(yyyy,pp.enddate) as varchar(5)) end AS x," & _
                                                " sum(pay.payscore)/count(*) as y," & _
                                                " pay.paylevel as paylevel," & _
                                                " sum(case when pay.paytype='RegularHours' then pay.payqty else 0.0 end) as regular_hours," & _
                    " sum(case when pay.paytype='RegularHours' then pay.paytotal else 0.0 end) as regular_total," & _
                    " sum(case when pay.paytype='OvertimeHours' then pay.payqty else 0.0 end) as overtime_hours," & _
                    " sum(case when pay.paytype='OvertimeHours' then pay.paytotal else 0.0 end) as overtime_total," & _
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
                    " inner join abc_payperiods pp on pp.startdate = payperiod_begin and pp.enddate=payperiod_end" & _
                    " where pp.startdate >= '" & backdate.Year.ToString.PadLeft(4, "0") & "-" & backdate.Month.ToString.PadLeft(2, "0") & "-" & backdate.Day.ToString.PadLeft(2, "0") & "' " & _
                                                        "/**ANDBLOCK(lc.LOC_ID,Location)" & _
                                                        "EQUAL(tm.PROJECT_ID,Project)" & _
                                                        "EQUAL(gp.GROUP_ID,Group)" & _
                                                        "EQUAL(tm.TEAM_ID,Team)" & _
                                                        "EQUAL(us.USER_ID,CSR)**/" & _
                    " group by pp.startdate,pp.enddate,pay.paylevel,lock.locked,pay.user_id,tm.team_id,gp.group_id,lc.loc_id,tm.project_id) a" & _
                    " group by [key],x,startdate,locked" & _
                    " order by startdate asc"
                                            'sql = "select 'StartDate=' + convert(varchar,pp.startdate,101) + '&EndDate=' + convert(varchar,pp.enddate,101) as [key]," & _
                                            '    " case when pp.enddate >= getdate() then 'Current' else cast(DATEPART(m,pp.enddate) as varchar(5))+'/'+cast(DATEPART(dd,pp.enddate) as varchar(5))+'/'+cast(DATEPART(yyyy,pp.enddate) as varchar(5)) end AS x," & _
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
                                                Using dta As DataTable = db.GetDataTable("select txt from kpi_mqf where line#='1' and level#='1' and mqf#='" & qt("KPI") & "'")
                                                    If dta.Rows(0)("txt") = "AHT" Then isaht = True
                                                End Using
                                            End If
                                            If Not isaht Then
                                                sql = "select convert(varchar,kh.RESPDT,101) As [Date],ProjectDesc As Project,lc.loc_name as Location,gp.group_name as [Group],tm.team_name as Team,us.lastnm + ', ' + us.firstnm as Name,mq.TXT + ' ' + cast(CAST((mq.WEIGHT_FACTOR*100) as decimal) as varchar(5)) + '%' AS KPI,convert(decimal(10,2),sum(kr.KPI_SCORE)/COUNT(*)) as Score"
                                                'TODO: Update this in query15context
                                                If qt("Connection") <> "SLA" AndAlso qt("Connection") <> "Program" AndAlso qt("Connection") <> "Enterprise" AndAlso qt("Connection") <> "Financial" Then
                                                    sql &= ",sum(kr.RANGE)/COUNT(*) as Raw"
                                                Else
                                                    sql &= ",convert(decimal(10,0), sum(kr.RANGE)/COUNT(*)) as Raw"
                                                End If
                                                sql &= " from KPI_HSTRY kh" & _
                                                    " inner join KPI_RESP kr on kr.KPI_ID = kh.KPI_ID" & _
                                                    " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                                                    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                    " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                    " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                    " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                                                    " inner join " & _intervaltable & " pp on pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT" & _
                                                    " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                                    "EQUAL(pj.ProjectID,Project)" & _
                                                    "EQUAL(lc.LOC_ID,Location)" & _
                                                    "EQUAL(gp.GROUP_ID,Group)" & _
                                                    "EQUAL(tm.TEAM_ID,Team)" & _
                                                    "EQUAL(us.USER_ID,CSR)" & _
                                                    "EQUAL(mq.MQF#,KPI)**/" & _
                                                    " group by kh.RESPDT,pj.ProjectDesc,lc.loc_name,gp.group_name,tm.team_name,us.lastnm,us.firstnm,mq.TXT,mq.WEIGHT_FACTOR" & _
                                                    " order by mq.TXT;"
                                            Else
                                                sql = "select convert(varchar,kh.RESPDT,101) As [Date],ProjectDesc As Project,lc.loc_name as Location,gp.group_name as [Group],tm.team_name as Team,us.lastnm + ', ' + us.firstnm as Name,st.subtypedesc as Split,convert(decimal(10,2),sum(kr.KPI_SCORE)/COUNT(*)) as Score,convert(decimal(10,0),sum(kr.WEIGHT)) as Calls,convert(decimal(10,0),sum(kr.RANGE)/COUNT(*)) as Raw" & _
                                                    " from SUBKPI_HSTRY kh" & _
                                                    " inner join SUBKPI_RESP kr on kr.KPI_ID = kh.KPI_ID" & _
                                                    " inner join subtype st on st.subtypeid=kr.subtype_id" & _
                                                    " inner join KPI_MQF mq on (mq.MQF# = kr.MQF#) AND (mq.LINE#='1') and (mq.LEVEL#='1')" & _
                                                    " inner join PROJECT pj on pj.projectID=kh.project_id" & _
                                                    " inner join USR us on us.USER_ID=kh.USER_ID" & _
                                                    " inner join TEAM tm on tm.team_id=kh.team_id" & _
                                                    " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                    " inner join LOC lc on lc.loc_id=gp.loc_id" & _
                                                    " inner join " & _intervaltable & " pp on pp.startdate <= kh.RESPDT AND pp.enddate >= kh.RESPDT" & _
                                                    " /**WHEREBLOCK(DATERANGE(kh.RESPDT,StartDate,EndDate))," & _
                                                    "EQUAL(pj.ProjectID,Project)" & _
                                                    "EQUAL(lc.LOC_ID,Location)" & _
                                                    "EQUAL(gp.GROUP_ID,Group)" & _
                                                    "EQUAL(tm.TEAM_ID,Team)" & _
                                                    "EQUAL(us.USER_ID,CSR)" & _
                                                    "EQUAL(mq.MQF#,KPI)**/" & _
                                                    " group by kh.RESPDT,pj.ProjectDesc,lc.loc_name,gp.group_name,tm.team_name,us.lastnm,us.firstnm,mq.TXT,mq.WEIGHT_FACTOR,st.subtypedesc" & _
                                                    " order by mq.TXT;"
                                            End If
                                            If qt("InTraining") = "Exclude" And qt("CSR") = "" Then
                                                sql = sql.Replace("inner join USR us on us.USER_ID=kh.USER_ID", "inner join USR us on us.USER_ID=kh.USER_ID and us.status<>'7'")
                                            End If
                                        ElseIf qt("qid") = "PayTable" Then
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
                                                " sum(pay.payqty) as total_hours," & _
                                                " sum(pay.paytotal) as total_pay," & _
                                                " lock.locked as results_locked" & _
                                                " from abc_pay_userdtl pay" & _
                                                " inner join abc_paylock lock on lock.enddate=pay.payperiod_end and lock.location=pay.loc_id" & _
                                                " inner join usr us on us.user_id = pay.user_id" & _
                                                " inner join usr_team ut on ut.user_id=us.user_id" & _
                                                " inner join user_id ui on ui.user_id=us.user_id and ui.idtype='1'" & _
                                                " inner join TEAM tm on tm.team_id=ut.team_id" & _
                                                " inner join PROJECT pj on pj.projectID=tm.project_id" & _
                                                " inner join GRP gp on gp.group_id=tm.group_id" & _
                                                " inner join loc lc on lc.loc_id=pay.loc_id" & _
                                                " inner join abc_payperiods pp on pp.startdate = payperiod_begin and pp.enddate=payperiod_end" & _
                                                            " /**WHEREBLOCK(EQUAL(pp.startdate,StartDate))," & _
                                                            "EQUAL(pp.enddate,EndDate)" & _
                                                            "EQUAL(pj.ProjectID,Project)" & _
                                                            "EQUAL(lc.LOC_ID,Location)" & _
                                                            "EQUAL(gp.GROUP_ID,Group)" & _
                                                            "EQUAL(tm.TEAM_ID,Team)" & _
                                                            "EQUAL(us.USER_ID,CSR)**/" & _
                                                " group by pp.startdate,pp.enddate,pay.paylevel,lock.locked,pay.user_id,tm.team_id,gp.group_id,lc.loc_id,tm.project_id,lc.loc_name,ui.emp_id,us.lastnm,us.firstnm"
                                        ElseIf qt("qid") = "TableSQL" OrElse qt("qid") = "ChartSQL" Then
                                            Dim con As String = CONFMGR.ConnectionStrings(urlprefix() & "Utilities").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
                                            Using udb As New DbBaseSql(con)
                                                sql = "SELECT * FROM CDS where projectnumber='ACUITY' AND bodyid='" & qt("cid") & "' AND tagid='" & qt("qid") & "' AND state = 'L' ORDER BY moddate DESC, remaining DESC"
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

                                        sql = substituteparams(sql)
                                        Try
                                            'TODO: Implement staging HERE.  (maybe substute GetDataTable for GetStagedTable).                                        
                                            Using dt As DataTable = db.GetStagedTable(sql, _utilities, New TimeSpan(2, 0, 0), alertmsg, savethresholdinseconds:=120)
                                                If dt Is Nothing Then 'build is in progress (and within the allowed timespan).
                                                    abort = True
                                                    'now set in GetStagedTable
                                                    ' alertmsg = "This Table is in the process of building (from a previous request).  Please wait a few minutes then try again."
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
                                    Next
                                Next
                            Next
                        Next
                    Next
                Next
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
                    If dr.Item(col.ColumnName).GetType.tostring <> "System.String" AndAlso dr.Item(col.ColumnName).GetType.ToString <> "System.DateTime" Then
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
                    bld &= variable & " >= '" & _earliestdate.ToShortDateString & "' AND " & variable & " <= '" & Date.Now.Date.ToShortDateString & "' "
                Else
                    bld &= variable & " >= '" & qt(stname) & "' AND " & variable & " <= '" & qt(edname) & "' "
                End If
            End If
        End If
        Return bld
    End Function

    Private Function equalsubstitution(ByRef firstcondition As Boolean, variable As String, name As String) As String
        variable = variable.Replace("{", "").Replace("}", "")
        Dim bld As String = ""
        If qt(name) <> "" And (qt(name).Length < 4 OrElse qt(name).Substring(0, 4) <> "each") Then
            If firstcondition Then
                bld &= " WHERE "
            Else
                bld &= " AND "
            End If
            firstcondition = False
            bld &= variable & " = '" & qt(name) & "' "
        End If
        Return bld
    End Function

    Private Function qt(str As String) As String
        If _context.Request.QueryString(str) Is Nothing Then
            Return ""
        Else
            Select Case str
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
                    If _xes._key = "Payperiod" Or _xes._key = "Month" Then
                        Return _KPIs(_KPIsCount)
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
        If _context.Request.QueryString(searchfor) Is Nothing Then 'OrElse 
            strs = "".Split(",") 'note there will still be one member even if this is blank.
        ElseIf _context.Request.QueryString(searchfor).Length < 4 OrElse _context.Request.QueryString(searchfor).Substring(0, 4) <> "each" Then 'Note: Can't use qt() here, I hijacked it.
            If paramname = "Payperiod" Then
                strs = (_context.Request.QueryString(searchfor).ToString & "~" & _context.Request.QueryString("EndDate").ToString).Split(",")
            Else
                strs = _context.Request.QueryString(searchfor).Split(",") 'note there will still be one member even if this is blank.
            End If
        Else
            If _xes._key = paramname Then
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
                                                If Not first Then bld &= ","
                                                bld &= ktag.InnerText.Replace(",", "~") 'In case commas get in, also to handle payperiod.
                                                first = False
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

    Public Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function

End Class
