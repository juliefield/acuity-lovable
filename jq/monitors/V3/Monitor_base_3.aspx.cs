using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using jglib;

public partial class _Monitor_base_3 : SitePage
{
    String _connection = "";
    String _connection1 = "";
    String _client = "0";
    Boolean isnew = false;
    String _roleperson = "";


    // V2 MONITOR System Specs
    // N/A included in numerator and denominator.
    //   NOTE: National Grid is the only prototype that has N/A's (I screwed up CarePayment, but that's ok... ...).
    //TODO: Add this as an option?
    //Boolean stgInclude_NA_In_Calculation = true; //Include N/A in the numerator/denominator - This is National Grid only, but should be a generalized setting.
    // Autofail.
    // Inclusion of additional info with monitor.
    // Points by questions, grouping a separate matter.
    // N/A functionality intact (applies to both Monitors and Surveys).
    // Answers can be anything.
    // Comments allowed overall and also with any question.


    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Acuity3";
        _connection1 = CONFMGR.ConnectionStrings(urlprefix() + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(urlprefix() + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
        _client = CONFMGR.AppSettings(urlprefix() + "client");
        if (_client == "68") _client = "60";
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Page.Header.DataBind();
        String uid = Context.Request.QueryString["uid"];
        String entdt = "New";
        if (!IsPostBack)
        {

            lblClient.Text = _client;

            using (DbBaseSql db1 = new DbBaseSql(_connection1, "")) {
                using (DbBaseSql db = new DbBaseSql(_connection, ""))
                {
                    lblSqfcode.Text = "0"; //Default
                    using (DataTable ddt = db.GetDataTable("select getdate() as currentdate,cast(cast(DATEADD(DAY, (DATEDIFF(DAY, 0, GETDATE()) / 7) * 7 + 7, 0/*0=Monday,1=Tuesday*/) as Date)as varchar) + ' 09:00' AS NextMonday"))
                    {
                        foreach (DataRow row in ddt.Rows)
                        {
                            lblCurrentDate.Text = row["currentdate"].ToString();
                            inputReleaseDate.Value = row["NextMonday"].ToString();
                            lblNextMonday.Value = row["NextMonday"].ToString();
                            break;
                        }
                    }
                    using (DataTable dt = db.GetDataTable("select field,val from PRT where guid='" + uid + "'"))
                    {
                        foreach (DataRow row in dt.Rows)
                        {
                            switch (row["field"].ToString())
                            {
                                case "agent":
                                    lblAgent.Text = row["val"].ToString();
                                    break;
                                case "callid":
                                    lblCallid.Text = row["val"].ToString();
                                    break;
                                case "calldate":
                                    lblCalldate.Text = row["val"].ToString();
                                    break;
                                case "sup":
                                    lblSupervisor.Text = row["val"].ToString();
                                    break;
                                case "mode":
                                    isnew = row["val"].ToString() == "new";
                                    break;
                                case "viewer":
                                    lblViewer.Text = row["val"].ToString();
                                    break;
                                case "MONITOR_ID":
                                    lblMonitorId.Text = row["val"].ToString();
                                    break;
                                case "sqfcode":
                                    lblSqfcode.Text = row["val"].ToString();
                                    break;
                                default:
                                    break;
                            }
                        }

                        using (VirtualStorage cds = new VirtualStorage())
                        {
                            //DONE: bodyid needs replaced with the logged-in user_id (need the user id server-side).
                            //DONE: projectnumber needs replaced with ACUITY.ers  (need the client number server-side).
                            //DONE: the page name needs replaced with the role of the currently logged in person (need the role server-side).
                            //OLD: String bodyid = urlprefix() + "." + Session["TP1Username"].ToString();
                            Page mp = (Page)this;
                            //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                            //TODO: RESTORE THIS: cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
                            String mysqfcode = lblSqfcode.Text;
                            if (Request.QueryString["anchorsqfcode"] != null)
                            {
                                mysqfcode = Request.QueryString["anchorsqfcode"].ToString();

                            }
                            cds.Register(ref mp, "MONITOR." + _client + "." + mysqfcode, false, "", "", "QA", urlprefix(true).ToLower()); //MONITOR.26.137
                        }

                        using (DataTable dn = db1.GetDataTable("select sqf_name,kpi_id from monitor_sqfcode where sqf_code='" + db1.reap(lblSqfcode.Text) + "'"))
                        {
                            lblSqfname.Text = "Not Found";
                            lblKPI.Text = "0";
                            foreach (DataRow row in dn.Rows)
                            {
                                lblSqfname.Text = row["sqf_name"].ToString();
                                lblKPI.Text = row["kpi_id"].ToString();
                            }
                        }

                        if (isnew)
                        {
                            lblMode.Text = "new";
                        }
                        else
                        {
                            lblMode.Text = "update";
                        }

                    }

                    using (DataTable df = db.GetDataTable("select id from qafrm where sqf_code='" + db.reap(lblSqfcode.Text) + "' and client='" + lblClient.Text + "' order by id desc"))
                    {
                        lblFormId.Text = "0";
                        foreach (DataRow row in df.Rows)
                        {
                            lblFormId.Text = row["id"].ToString();
                        }
                    }

                    lblAcknowledgementRequired.Text = "N/A";
                    lblAcknowledgementDate.Text = "";

                    entdt = "New";
                    lblMonitordate.Text = "New";

                    if (lblMode.Text == "new")
                    {
                        if (urlprefix().ToLower() == "km2.")
                        {
                            if (lblSqfcode.Text == "61") {
                                using (DataTable dts = db1.GetDataTable("select answertext from qa_hstry qh inner join qa_resp qr on qr.idqa=qh.id and qr.idquestion=15498 where qh.examinee='" + lblAgent.Text + "'"))
                                {
                                    foreach (DataRow row in dts.Rows) {
                                        if (lblPastReviewDates.Text != "") { lblPastReviewDates.Text += "~"; }
                                        lblPastReviewDates.Text += row["answertext"].ToString();
                                    }
                                }
                            }
                        }
                        /* TODO: I need the right idquestion.
                        if (urlprefix().ToLower() == "collective-solution.")
                        {
                            if (lblSqfcode.Text == "19")
                            {
                                using (DataTable dts = db1.GetDataTable("select answertext from qa_hstry qh inner join qa_resp qr on qr.idqa=qh.id and qr.idquestion=15498 where qh.examinee='" + lblAgent.Text + "'"))
                                {
                                    foreach (DataRow row in dts.Rows)
                                    {
                                        if (lblPastReviewDates.Text != "") { lblPastReviewDates.Text += "~"; }
                                        lblPastReviewDates.Text += row["answertext"].ToString();
                                    }
                                }
                            }
                        }
                        */
                    }
                    if (lblMode.Text == "update")
                    {
                        using (DataTable dtmh = db1.GetDataTable("select * from monitor_hstry where monitor_id='" + lblMonitorId.Text + "'"))
                        {
                            foreach (DataRow rowmh in dtmh.Rows)
                            {
                                lblAgent.Text = rowmh["user_id"].ToString();
                                lblCallid.Text = rowmh["call_id"].ToString();
                                lblCalldate.Text = rowmh["call_date"].ToString();
                                lblSupervisor.Text = rowmh["entby"].ToString();
                                entdt = "'" + rowmh["entdt"].ToString() + "'"; //sql-ready as a literal
                                lblMonitordate.Text = rowmh["entdt"].ToString() + " ( # " + rowmh["monitor_id"].ToString() + " )";
                                if (urlprefix().ToLower() == "km2.")
                                {
                                    if (rowmh["complete_flag"].ToString() == "Y")
                                    {
                                        lblMonitorComplete.Text = "Y";
                                    }
                                }

                            }
                        }


                        using (DataTable dtmi = db1.GetDataTable("select ack_required,case when ack_date is null then '' else convert(varchar,ack_date,0) end as ack_date from monitor_imprvmnt where monitor_id='" + lblMonitorId.Text + "'"))
                        {
                            foreach (DataRow rowmi in dtmi.Rows)
                            {
                                lblAcknowledgementRequired.Text = rowmi["ack_required"].ToString();
                                lblAcknowledgementDate.Text = rowmi["ack_date"].ToString();
                            }
                        }
                    }

                    lblPrevScore.Text = "Not Found";
                    lbl90Score.Text = "Not Found";
                    try
                    {
                        using (DataTable dtmh = db1.GetDataTable("select top 1 cast(pct_score as decimal(10,2)) as PrevScore from monitor_hstry where user_id='" + lblAgent.Text + "' and cast(call_date as date) < '" + lblCalldate.Text + "' order by cast(call_time as date) desc"))
                        {
                            foreach (DataRow rowmh in dtmh.Rows)
                            {
                                lblPrevScore.Text = rowmh["PrevScore"].ToString();
                            }
                        }

                        using (DataTable dtmh = db1.GetDataTable("select cast(sum(pct_score) as decimal(10,2)) as Score from monitor_hstry where user_id='" + lblAgent.Text + "' and cast(call_date as date) < '" + lblCalldate.Text + "' and cast(call_date as date) >= dateadd(d,-90,'" + lblCalldate.Text + "')"))
                        {
                            foreach (DataRow rowmh in dtmh.Rows)
                            {
                                lbl90Score.Text = rowmh["Score"].ToString();
                            }
                        }
                    }
                    catch (Exception e2)
                    {
                    }

                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,role,isnull(hiredt,'') as hiredt from usr where user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            lblAgentRole.Text = dtan.Rows[0]["role"].ToString();
                            lblAgentHireDate.Text = dtan.Rows[0]["hiredt"].ToString();
                        }
                    }

                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm from usr where user_id='" + lblSupervisor.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            lblSupervisorName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,tm.spvr_user_id from team tm inner join usr_team ut on ut.team_id=tm.team_id inner join usr on usr.user_id=tm.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentTeamLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            lblAgentTeamLeader.Text = dtan.Rows[0]["spvr_user_id"].ToString();
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,group_name,gp.spvr_user_id,loc_name,projectdesc from loc lc inner join grp gp on gp.loc_id=lc.loc_id  inner join project pj on pj.projectid=gp.project_id inner join team tm on tm.group_id=gp.group_id inner join usr_team ut on ut.team_id=tm.team_id left outer join usr on usr.user_id=gp.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            if (dtan.Rows[0]["lastnm"].ToString()!="") {
                              lblAgentGroupLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            }
                            lblAgentGroupName.Text = dtan.Rows[0]["group_name"].ToString();
                            lblAgentGroupLeader.Text = dtan.Rows[0]["spvr_user_id"].ToString();
                            lblAgentLocationName.Text = dtan.Rows[0]["loc_name"].ToString();
                            lblAgentProjectName.Text = dtan.Rows[0]["projectdesc"].ToString();
                        }
                    }
                    if (!isnew) //Override with USR_TEAM_HSTRY if it's available.
                    {
                        using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,group_name,gp.spvr_user_id,loc_name from loc lc inner join grp gp on gp.loc_id=lc.loc_id inner join team tm on tm.group_id=gp.group_id inner join usr_team_hstry ut on ut.team_id=tm.team_id and ut.recdate in (select cast(entdt as date) from monitor_hstry where monitor_id='" + lblMonitorId.Text + "') left outer join usr on usr.user_id=gp.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                        {
                            if (dtan.Rows.Count >= 1)
                            {
                                if (dtan.Rows[0]["lastnm"].ToString() != "")
                                {
                                    lblAgentGroupLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                                }
                                lblAgentGroupName.Text = dtan.Rows[0]["group_name"].ToString();
                                lblAgentGroupLeader.Text = dtan.Rows[0]["spvr_user_id"].ToString();
                                lblAgentLocationName.Text = dtan.Rows[0]["loc_name"].ToString();
                            }
                        }
                    }
                    /* performant-specific for now.
                    using (DataTable dtan = db1.GetDataTable("select us.user_id from mgr_team mt inner join usr us on us.user_id=mt.user_id inner join usr_team ut on ut.team_id=mt.team_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        lblAgentManager.Text = "";
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentManager.Text = dtan.Rows[0]["user_id"].ToString();
                        }
                    }
                    */
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,user_id from usr usr where status='1' and role not in ('CSR','Admin') UNION select lastnm,firstnm,user_id from team tm inner join usr us on us.user_id=tm.spvr_user_id where tm.status='A' order by lastnm,firstnm,user_id"))
                    {
                        Boolean first = true;
                        
                        //if (dtan.Rows.Count >= 1)
                        for (int i=0;i<dtan.Rows.Count;i++)
                        {
                            if (dtan.Rows[i]["lastnm"].ToString() != "")
                            {
                                if (!first)
                                {
                                    lblManagers.Text += "|";
                                }
                                first = false;
                                lblManagers.Text += dtan.Rows[i]["user_id"] + "~" + dtan.Rows[i]["lastnm"] + ", " + dtan.Rows[i]["firstnm"] + " (" + dtan.Rows[i]["user_id"] + ")";
                            }
                        }
                    }

                    using (DataTable dtan = db1.GetDataTable("select distinct client_dept from monitor_imprvmnt /* where project_id='17' */ order by client_dept"))
                    {
                        Boolean first = true;

                        //if (dtan.Rows.Count >= 1)
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            if (!first)
                            {
                                lblClientDept.Text += "|";
                            }
                            first = false;
                            lblClientDept.Text += dtan.Rows[i]["client_dept"];
                        }
                    }

                    if (lblViewer.Text != "")
                    {
                        _roleperson = lblViewer.Text;
                        using (DataTable dtrl = db1.GetDataTable("select role from usr where user_id='" + lblViewer.Text + "'"))
                        {
                            if (dtrl.Rows.Count >= 1)
                            {
                                lblRole.Text = dtrl.Rows[0]["role"].ToString();
                            }
                        }
                    }
                    else
                    {
                        _roleperson = lblSupervisor.Text;
                        using (DataTable dtrl = db1.GetDataTable("select role from usr where user_id='" + lblSupervisor.Text + "'"))
                        {
                            if (dtrl.Rows.Count >= 1)
                            {
                                lblRole.Text = dtrl.Rows[0]["role"].ToString();
                            }
                        }
                    }

                    //duck
                    //Handle the special case where a CSR is acting as a team leader because they're in the SPVR_TEAM table.
                    //If they're the evaluator, and are evaluating someone on a team which they can, then their role would be temporarily team leader.
                    if (lblRole.Text == "CSR")
                    {
                        if (_roleperson != lblAgent.Text) //Can't be a team leader for your own monitor if you're a CSR
                        { 
                            using (DataTable dtst = db1.GetDataTable("select ut.user_id from usr_team ut inner join spvr_team st on st.team_id=ut.team_id where ut.team_id=st.team_id and st.user_id='" + _roleperson + "' and ut.user_id='" + lblAgent.Text + "'"))
                            {
                                if (dtst.Rows.Count >= 1)
                                {
                                    lblRole.Text = "Team Leader"; //Acting Team Leader
                                }
                            }
                        }
                    }



                    //Client-specific pulls & settings.

                    /* Sprint for ERS is multi-project for the Quality KPI */
                    if (urlprefix().ToLower() == "ers.")
                    {
                        if (lblSqfcode.Text == "136")
                        {
                            lblKPI.Text = "Text:Quality";
                        }
                    }

                    if (urlprefix().ToLower() == "da.") {
                        using (DataTable dtrl = db1.GetDataTable("select ActionRequired,Supervisor from DA_WH_Home_QA_V2 where callid='" + db1.reap(lblCallid.Text) + "'"))
                        {
                            if (dtrl.Rows.Count >= 1)
                            {
                                lblActionRequired.Text = dtrl.Rows[0]["ActionRequired"].ToString();
                                lblActionRequiredSupervisorName.Text = dtrl.Rows[0]["Supervisor"].ToString();
                            }
                            else {
                                lblActionRequired.Text = "N/A";
                            }
                        }
                    }


                    /*
                    //Performant Recovery
                    using (DataTable dtpr = db1.GetDataTable("select EXT,CLIENT from usr_client where user_id='" + lblAgent.Text + "'"))
                    {
                        lblAgentExtension.Text = "";
                        lblAgentClient.Text = "";
                        if (dtpr.Rows.Count >= 1)
                        {
                            lblAgentExtension.Text = dtpr.Rows[0]["EXT"].ToString();
                            lblAgentClient.Text = dtpr.Rows[0]["CLIENT"].ToString();
                        }
                    }

                    using (DataTable dtan = db1.GetDataTable("select vrGHP_NGHP.val as GHP_NGHP,vrLETTER_NUMBER.val as LETTER_NUMBER,vrLETTER_TYPE.val as LETTER_TYPE from verticalheader vh inner join verticalrecords vrGHP_NGHP on vrGHP_NGHP.id=vh.id and vrGHP_NGHP.field='GHP_NGHP' inner join verticalrecords vrLETTER_NUMBER on vrLETTER_NUMBER.id=vh.id and vrLETTER_NUMBER.field='LETTER_NUMBER' inner join verticalrecords vrLETTER_TYPE on vrLETTER_TYPE.id=vh.id and vrLETTER_TYPE.field='LETTER_TYPE' where filetype='lettertypes' order by GHP_NGHP,LETTER_NUMBER"))
                    {
                        Boolean first = true;

                        //if (dtan.Rows.Count >= 1)
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            if (!first)
                            {
                                lblLetterTypes.Text += "|";
                            }
                            first = false;
                            lblLetterTypes.Text += dtan.Rows[i]["GHP_NGHP"] + "~" + dtan.Rows[i]["LETTER_NUMBER"] + "~" + dtan.Rows[i]["LETTER_TYPE"];
                        }
                    }
                    */

                    if ((urlprefix().ToLower() == "act.") || (urlprefix().ToLower() == "ces.") || (urlprefix().ToLower() == "rcm."))
                    {
                        Boolean iscsr = false;
                        using (DataTable dtan = db1.GetDataTable("select role from usr where user_id='" + lblAgent.Text + "'"))
                        {
                            if (dtan.Rows.Count >= 1)
                            {
                                if (dtan.Rows[0]["role"].ToString() == "CSR")
                                {
                                    iscsr = true;
                                }
                            }
                        }
                        String mysql = "";
                        if (iscsr)
                        {
                            mysql = "SELECT clientdept from monitor_client_dept where project_id in (select tm.project_id from usr_team ut inner join team tm on tm.team_id=ut.team_id where ut.user_id='" + lblAgent.Text + "') order by clientdept asc";
                        }
                        else
                        {
                            mysql = "SELECT distinct clientdept from monitor_client_dept order by clientdept asc";
                        }

                        using (DataTable dtan = db1.GetDataTable(mysql))
                        {
                            Boolean first = true;

                            //if (dtan.Rows.Count >= 1)
                            for (int i = 0; i < dtan.Rows.Count; i++)
                            {
                                if (!first)
                                {
                                    lblClientDept.Text += "|";
                                }
                                first = false;
                                lblClientDept.Text += dtan.Rows[i]["clientdept"];
                            }
                        }
                    }


                    if (urlprefix().ToLower() == "performant-healthcare.")
                    {
                        Boolean first = true;
                        using (DataTable dtan = db1.GetDataTable("select us.user_id,lastnm,firstnm from usr us inner join usr_filter uf on uf.user_id=us.user_id and uf.filter_id='3'"))
                        {                       
                            //if (dtan.Rows.Count >= 1)
                            for (int i=0;i<dtan.Rows.Count;i++)
                            {
                                if (dtan.Rows[i]["lastnm"].ToString() != "")
                                {
                                    if (!first)
                                    {
                                        lblDocAuditors.Text += "|";
                                    }
                                    first = false;
                                    lblDocAuditors.Text += dtan.Rows[i]["user_id"] + "~" + dtan.Rows[i]["lastnm"] + ", " + dtan.Rows[i]["firstnm"] + " (" + dtan.Rows[i]["user_id"] + ")";
                                }
                            }
                        }

                    }

                    if (urlprefix().ToLower() == "km2.")
                    {
                        if (entdt == "New")
                        {
                            entdt = "cast(getdate() as Date)";
                        }

                        //using (DataTable dtkm2 = db1.GetDataTable("select CC,DEPT,JOB_CLS,us.EMP_ID from usr_client uc inner join usr us on us.user_id=uc.user_id where uc.user_id='" + lblAgent.Text + "'"))
                        using (DataTable dtkm2 = db1.GetDataTable("select uc.TITLE,dbo.getKM2MonitorCenter(" + entdt + ",'" + lblAgent.Text + "') as CC,dbo.getKM2MonitorProject(" + entdt + ",'" + lblAgent.Text + "') as DEPT,dbo.getKM2MonitorLOB(" + entdt + ",'" + lblAgent.Text + "') as JOB_CLS,us.EMP_ID from usr_client uc inner join usr us on us.user_id=uc.user_id where uc.user_id='" + lblAgent.Text + "'"))
                        {
                            lblAgentCenter.Text = "";
                            lblAgentClient.Text = "";
                            lblAgentLOB.Text = "";
                            lblAgentEMP_ID.Text = "";
                            lblAgentTitle.Text = "";
                            if (dtkm2.Rows.Count >= 1)
                            {
                                lblAgentCenter.Text = dtkm2.Rows[0]["CC"].ToString();
                                lblAgentClient.Text = dtkm2.Rows[0]["DEPT"].ToString();
                                lblAgentLOB.Text = dtkm2.Rows[0]["JOB_CLS"].ToString();
                                lblAgentEMP_ID.Text = dtkm2.Rows[0]["EMP_ID"].ToString();
                                lblAgentTitle.Text = dtkm2.Rows[0]["TITLE"].ToString();
                            }
                        }
                        lblComplianceAllowed.Text = "No";
                        if (lblViewer.Text.ToLower() == "michele.ward") lblComplianceAllowed.Text = "Yes";
                        if (lblRole.Text == "Admin") lblComplianceAllowed.Text = "Yes";
                        if (urlprefix(true).ToLower() == "mnt.") lblComplianceAllowed.Text = "Yes";
                        using (DataTable dtkm2 = db1.GetDataTable("select CC,DEPT,JOB_CLS,us.EMP_ID from usr_client uc inner join usr us on us.user_id=uc.user_id where job_cls in ('Compliance') AND uc.user_id='" + lblViewer.Text + "'"))
                        {
                            if (dtkm2.Rows.Count >= 1) lblComplianceAllowed.Text = "Yes";
                        }

                        lblDisputeReviewer.Text = "No";
                        if (lblRole.Text == "Admin") lblDisputeReviewer.Text = "Yes";
                        using (DataTable dtkm3 = db1.GetDataTable("select user_id from usr_mgmt_filter where user_id='" + lblViewer.Text + "' and filter_id='1'"))
                        {
                            if (dtkm3.Rows.Count >= 1) lblDisputeReviewer.Text = "Yes";
                        }

                        using (DataTable dtkm3 = db1.GetDataTable("select user_id from usr_mgmt_filter where user_id='" + lblViewer.Text + "' and filter_id='4'"))
                        {
                            if (dtkm3.Rows.Count >= 1) lblHumanResources.Text = "Yes";
                        }

                        lblActingSupervisor.Text = "No"; //Presence in the SPVR_GRP table for managers.
                        using (DataTable dtkm7 = db1.GetDataTable("select gp.user_id from usr us inner join usr_team ut on ut.user_id=us.user_id inner join team tm on tm.team_id=ut.team_id inner join spvr_grp gp on gp.group_id=tm.group_id where (us.user_id='" + db1.reap(lblAgent.Text) + "' or tm.spvr_user_id='" + db1.reap(lblAgent.Text) + "') and gp.user_id='" + db1.reap(lblViewer.Text) + "'"))
                        {
                            if (dtkm7.Rows.Count >= 1) lblActingSupervisor.Text = "Yes";
                        }

                        //In KM2, if a user is the SPVR_USER_ID group leader, they should behave as a "Group Leader" regardless of actual role.

                        //Actually, to avoid unintended consequences, only attempt this substitution if the role is "Management"

                        if (lblRole.Text == "Management")
                        {
                            using (DataTable dtkm5 = db1.GetDataTable("select user_id from usr_mgmt_filter where user_id='" + lblViewer.Text + "' and filter_id='3'"))
                            {
                                if (dtkm5.Rows.Count >= 1) lblRole.Text = "Quality Assurance";
                            }

                            using (DataTable dtkm4 = db1.GetDataTable("select gp.spvr_user_id from usr us inner join usr_team ut on ut.user_id=us.user_id inner join team tm on tm.team_id=ut.team_id inner join grp gp on gp.group_id=tm.group_id where us.user_id='" + db1.reap(lblAgent.Text) + "' and gp.spvr_user_id='" + db1.reap(lblViewer.Text) + "'"))
                            {
                                if (dtkm4.Rows.Count >= 1) lblRole.Text = "Group Leader";
                            }
                            try
                            {
                                using (DataTable dtkm6 = db1.GetDataTable("select case when dbo.getKM2OpsManager('" + db1.reap(lblAgent.Text) + "') = '' then dbo.getKM2OpsManager('" + db1.reap(lblAgent.Text) + "')  else left(dbo.getKM2OpsManager('" + db1.reap(lblAgent.Text) + "'),charindex('/',dbo.getKM2OpsManager('" + db1.reap(lblAgent.Text) + "')) - 1) end as OM"))
                                {
                                    foreach (DataRow row in dtkm6.Rows)
                                    {
                                        if (row["OM"].ToString().ToLower() == lblViewer.Text.ToLower())
                                        {
                                            lblRole.Text = "Group Leader";
                                        }
                                    }
                                }
                            }
                            catch (Exception e2)
                            {
                            }
                        }

                        //TEST
                        //if (lblViewer.Text.ToLower() == "jeffgack") lblComplianceAllowed.Text = "No";

                    }
                    else
                    {
                        if (urlprefix(true).ToLower() == "mnt.") lblComplianceAllowed.Text = "Yes";
                    }



                }
            }
        }
    }

    protected void submitme_click(object sender, EventArgs e)
    {
        return; //DEBUG
    }

    protected void deleteme_click(object sender, EventArgs e)
    {
        return; //DEBUG
    }

    protected void closeme_click(object sender, EventArgs e)
    {
        return; //DEBUG
    }

    protected void fillv2resp(String monitorid)
    {
        return; //DEBUG
    }

    protected void getscoreandweight(String KPI, String raw,ref int kpi_score, ref double kpi_weight)
    {
        return; //DEBUG
    }

}

/*
50 -> 56 -> 81
132 -> 95 -> 268
21 -> 17 -> 51
*/
