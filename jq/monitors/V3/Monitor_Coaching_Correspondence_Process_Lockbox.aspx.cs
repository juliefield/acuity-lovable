using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using jglib;

public partial class _Monitor_Coaching_Correspondence_Process_Lockbox : SitePage
{
    String _connection = "";
    String _connection1 = "";
    Boolean isnew = false;


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
        _connection1 = CONFMGR.ConnectionStrings(/*urlprefix()*/"performant." + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(/*urlprefix()*/"performant." + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Page.Header.DataBind();
        String uid = Context.Request.QueryString["uid"];
        lblWorkid.Text = "";
        if (!IsPostBack) {
            using (DbBaseSql db1 = new DbBaseSql(_connection1, "")) {
                using (DbBaseSql db = new DbBaseSql(_connection, ""))
                {
                    using (DataTable ddt = db.GetDataTable("select cast(cast(getdate() as Date) as varchar) as today,getdate() as currentdate,cast(cast(DATEADD(DAY, (DATEDIFF(DAY, 0, GETDATE()) / 7) * 7 + 7, 0/*0=Monday,1=Tuesday*/) as Date)as varchar) + ' 09:00' AS NextMonday"))
                    {
                        foreach (DataRow row in ddt.Rows)
                        {
                            lblCurrentDate.Text = row["currentdate"].ToString();
                            lblToday.Value = row["today"].ToString();
                            //inputReleaseDate.Value = row["NextMonday"].ToString(); //Overwritten if this is an update.
                            inputReleaseDate.Value = row["today"].ToString(); //Overwritten if this is an update.
                            lblNextMonday.Value = row["NextMonday"].ToString();
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
                                case "workid":
                                    lblWorkid.Text = row["val"].ToString();
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
                                default:
                                    break;
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

                    lblAcknowledgementRequired.Text = "N/A";
                    lblAcknowledgementDate.Text = "";
                    if (lblMode.Text == "update")
                    {
                        using (DataTable dtmh = db1.GetDataTable("select * from monitor_hstry where monitor_id='" + lblMonitorId.Text + "'"))
                        {
                            foreach (DataRow rowmh in dtmh.Rows)
                            {
                                lblAgent.Text = rowmh["user_id"].ToString();
                                lblCallid.Text = rowmh["call_id"].ToString();
                                lblWorkid.Text = rowmh["work_id"].ToString();
                                lblCalldate.Text = rowmh["call_date"].ToString();
                                lblSupervisor.Text = rowmh["entby"].ToString();
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
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm from usr where user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
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
                    lblAgentGroupName.Text = "";
                    lblAgentGroupLeader.Text = "";
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,group_name,gp.spvr_user_id from grp gp inner join team tm on tm.group_id=gp.group_id inner join usr_team ut on ut.team_id=tm.team_id left outer join usr on usr.user_id=gp.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            if (dtan.Rows[0]["lastnm"].ToString()!="") {
                              lblAgentGroupLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            }
                            lblAgentGroupName.Text = dtan.Rows[0]["group_name"].ToString();
                            lblAgentGroupLeader.Text = dtan.Rows[0]["spvr_user_id"].ToString();
                        }
                    }
                    if (lblAgentGroupName.Text == "")
                    {
                        using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,group_name,gp.spvr_user_id from grp gp inner join team tm on tm.group_id=gp.group_id left outer join usr on usr.user_id=gp.spvr_user_id where tm.spvr_user_id='" + lblAgent.Text + "'"))
                        {
                            if (dtan.Rows.Count >= 1)
                            {
                                if (dtan.Rows[0]["lastnm"].ToString() != "")
                                {
                                    lblAgentGroupLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                                }
                                lblAgentGroupName.Text = dtan.Rows[0]["group_name"].ToString();
                                lblAgentGroupLeader.Text = dtan.Rows[0]["spvr_user_id"].ToString();
                            }
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select us.user_id from mgr_team mt inner join usr us on us.user_id=mt.user_id inner join usr_team ut on ut.team_id=mt.team_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        lblAgentManager.Text = "";
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentManager.Text = dtan.Rows[0]["user_id"].ToString();
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,user_id from usr usr where status='1' and role not in ('CSR','Admin') order by lastnm,firstnm,user_id"))
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
                                lblManagers.Text += dtan.Rows[i]["user_id"] + "~" + dtan.Rows[i]["lastnm"] + ", " + dtan.Rows[i]["firstnm"]; // +" (" + dtan.Rows[i]["user_id"] + ")";
                            }
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
                    ///////NOTE idquestion///////
                    using (DataTable dtat = db1.GetDataTable("select distinct answertext from qa_resp where answertext<>'' and idquestion=1195 order by answertext"))
                    {
                        Boolean first = true;

                        //if (dtan.Rows.Count >= 1)
                        for (int i = 0; i < dtat.Rows.Count; i++)
                        {
                            if (!first)
                            {
                                lblTags.Text += "|";
                            }
                            first = false;
                            lblTags.Text += dtat.Rows[i]["answertext"];
                        }
                    }

                    ///////NOTE project_id///////
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
                        using (DataTable dtrl = db1.GetDataTable("select role from usr where user_id='" + lblSupervisor.Text + "'"))
                        {
                            if (dtrl.Rows.Count >= 1)
                            {
                                lblRole.Text = dtrl.Rows[0]["role"].ToString();
                            }
                        }
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
