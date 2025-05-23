<%@ WebHandler Language="VB" Class="ACDDownload" %>

Imports System
Imports System.Web
Imports System.Data
Imports jglib

Public Class ACDDownload : Implements IHttpHandler

    Private _connection As String = ""
    Private _utilities As String = ""
    Private CONFMGR As New ConfMgr()
    Private _cid As String = ""


    Public Sub ProcessRequest(ByVal context As HttpContext) Implements IHttpHandler.ProcessRequest
        
        Dim debug As Boolean = False

        Dim valid As Boolean = True
        Dim mydate As Date
        Dim myfilename As String = ""
        Dim delimiter As String = ""

        Try
            _connection = CONFMGR.ConnectionStrings(urlprefix() & "Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            _utilities = CONFMGR.ConnectionStrings(urlprefix() & "Utilities").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        Catch ex As Exception

        End Try
        
        'Make sure a valid date has been specified.
        If valid Then
            valid = False
            If context.Request("ACDDate") IsNot Nothing Then
                Try
                    mydate = Convert.ToDateTime(context.Request("ACDDate"))
                    valid = True
                Catch ex As Exception

                End Try
            End If
        End If
        If debug Then
            _cid = "CHcalldetail".ToLower
            mydate = Convert.ToDateTime("12/25/2019")
            valid = True
            _connection = CONFMGR.ConnectionStrings("ERS.Connection").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
            _utilities = CONFMGR.ConnectionStrings("ERS.Utilities").ConnectionString.ToString.Trim & ";Provider=""SQLOLEDB"";"
        Else
            _cid = context.Request("cid").ToLower
        End If

        'Make sure a valid report has been requested.
        If valid Then
            valid = False
            If _cid <> "" Then
                Select Case _cid
                    Case "CROP101AugustaNoCARE".ToLower 'Case "CROP101Augusta".ToLower
                        myfilename = "756812_clcalls_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = "||"
                        valid = True
                    Case "CROP101Mont".ToLower
                        myfilename = "399300_clcalls_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = "||"
                        valid = True
                    Case "CROP101Guat".ToLower
                        myfilename = "331459_clcalls_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = "||"
                        valid = True
                    Case "DailyACDNewCombined".ToLower
                        myfilename = "ERS_Sprint_Inbound_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & "_014.csv"
                        delimiter = ","
                        valid = True
                    Case "MontgomeryData".ToLower
                        myfilename = "ERS_Sprint_Inbound_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & "_015.csv"
                        delimiter = ","
                        valid = True
                    Case "VDNTransfer".ToLower
                        myfilename = "ERS_Sprint_Inbound_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & "_012.csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDsplitGuat".ToLower
                        myfilename = "ERS_Dsplit_Guatemala_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".txt"
                        delimiter = ","
                        valid = True
                    Case "FTTQDsplitMont".ToLower
                        myfilename = "ERS_Dsplit_Montgomery_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".txt"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentGuat".ToLower
                        myfilename = "ERS_Dagent_Guatemala_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".txt"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentMont".ToLower
                        myfilename = "ERS_Dagent_Montgomery_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".txt"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailGuat".ToLower
                        myfilename = "ERS_CallDetail_Guatemala_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".txt"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailMont".ToLower
                        myfilename = "ERS_CallDetail_Montgomery_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".txt"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentMont".ToLower
                        myfilename = "Montgomery_Dagent_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailMont".ToLower
                        myfilename = "Montgomery_CallDetail_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentAugusta".ToLower
                        myfilename = "Augusta_Dagent_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailAugusta".ToLower
                        myfilename = "Augusta_CallDetail_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentGuat".ToLower
                        myfilename = "Guatemala_Dagent_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailGuat".ToLower
                        myfilename = "Guatemala_CallDetail_" & mydate.Year.ToString.PadLeft(4, "0") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentAllNoAugCARE".ToLower  'Case "FTTQDagentAll".ToLower
                        myfilename = "ERS_Dagent_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailAllNoAugCARE".ToLower 'Case "FTTQCallDetailAll".ToLower
                        myfilename = "ERS_CallDetail_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDsplitNoCARE".ToLower 'Case "FTTQDsplit".ToLower
                        myfilename = "ERS_Dsplit_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQCallDetailAugustaCARE".ToLower
                        myfilename = "ERS_CallDetail_Augusta_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDagentAugustaCARE".ToLower
                        myfilename = "ERS_Dagent_Augusta_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "FTTQDsplitCARE".ToLower
                        myfilename = "ERS_Dsplit_Augusta_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "CHcalldetail".ToLower
                        myfilename = "convergent_" & mydate.ToString("yyyy") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".txt"
                        delimiter = "|"
                        valid = True
                    Case "MTDVolume".ToLower
                        myfilename = "Sprint_MTD_Volume_" & mydate.ToString("yyyy") & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "TWCdvdn".ToLower
                        myfilename = "convergent_dvdn_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yyyy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "TWCivdn".ToLower
                        myfilename = "convergent_ivdn_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yyyy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "TWCdsplit".ToLower
                        myfilename = "convergent_dsplit_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yyyy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case "TWCisplit".ToLower
                        myfilename = "convergent_isplit_" & mydate.Month.ToString.PadLeft(2, "0") & mydate.Day.ToString.PadLeft(2, "0") & mydate.ToString("yyyy") & ".csv"
                        delimiter = ","
                        valid = True
                    Case Else
                        myfilename = context.Request("cid").ToLower & ".csv"
                        delimiter = ","
                        valid = True
                End Select
            End If
        End If

        'Make sure the imports have been completed for the date specified (cms_summary_v2 will be populated).
        'TODO: Tighten this up by having a "completed" status set somewhere for the given date.  If in the middle of a _v2 build, this test would pass.
        
        'Added 2019-12-25 - Allow the Central Hudson report through even if cms_summary_v2 fails.
        If _cid <> "CHcalldetail".ToLower Then            
            If valid Then
                valid = False
                Using db As New DbBaseSql(_connection)
                    Using dt As DataTable = db.GetDataTable("select top 2 * from cms_summary_v2 where calldate='" & mydate.Month.ToString.PadLeft(2, "0") & "/" & mydate.Day.ToString.PadLeft(2, "0") & "/" & mydate.Year.ToString.PadLeft(4, "0") & "'")
                        If dt.Rows.Count > 0 Then
                            valid = True
                        End If
                    End Using
                End Using
            End If
        End If
        
        If valid Then
            context.Response.ContentType = "text/csv"
            context.Response.AddHeader("Content-Disposition", "attachment; filename=" & myfilename)
            'TODO: Output the file!
            '1) Get the sql using the cid.
            Dim sql As String = ""
            Using udb As New DbBaseSql(_utilities)
                sql = "SELECT * FROM CDS where projectnumber='ACUITY' AND bodyid='" & context.Request("cid") & "' AND tagid='TableSQL' AND state = 'L' ORDER BY moddate DESC, remaining DESC"
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

            '2) Substitute Params (I'm counting on ACDDate being there).
            Dim query As New QueryContext20(context)
            sql = query.substituteparams(sql)
            
            '3) Run the sql and get the table.  Output them pipe-delimited (that's all I have at this point).
            Using db As New DbBaseSql(_connection)
                Using dt As DataTable = db.GetDataTable(sql)
                    If True Then 'Add Headers (might want a flag later)
                        Dim str As String = ""
                        For c As Integer = 0 To dt.Columns.Count - 1
                            If c <> 0 Then
                                str &= delimiter
                            End If
                            str &= dt.Columns(c).ColumnName.Trim
                        Next
                        context.Response.Write(str & vbCrLf)
                    End If
                    For Each row As DataRow In dt.Rows
                        Dim str As String = ""
                        For c As Integer = 0 To dt.Columns.Count - 1
                            If c <> 0 Then
                                str &= delimiter
                            End If
                            str &= row.Item(c).ToString.Trim
                        Next
                        context.Response.Write(str & vbCrLf)
                    Next
                End Using
            End Using
        Else
            context.Response.Write("cid (report) not found")
        End If
    End Sub
 
    Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
        Get
            Return False
        End Get
    End Property

    Public Function urlprefix() As String
        Dim sp As New SitePage
        Return sp.urlprefix()
    End Function
    
End Class