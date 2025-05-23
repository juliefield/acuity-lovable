using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using jglib;

public partial class _Monitor_DEMO_CAR : SitePage
{
    String _connection = "";
    String _connection1 = "";
    Boolean isnew = false;
    String _client = "0";

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
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
            using (VirtualStorage cds = new VirtualStorage())
            {
                //DONE: bodyid needs replaced with the logged-in user_id (need the user id server-side).
                //DONE: projectnumber needs replaced with ACUITY.ers  (need the client number server-side).
                //DONE: the page name needs replaced with the role of the currently logged in person (need the role server-side).
                //OLD: String bodyid = urlprefix() + "." + Session["TP1Username"].ToString();
                Page mp = (Page)this;
                //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                //TODO: RESTORE THIS: cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
                cds.Register(ref mp, "ACUITY.54.1", false, "", "", "QA");
            }

        Page.Header.DataBind();
        String uid = Context.Request.QueryString["uid"];
        String filterid = "";
        if (!IsPostBack) {

            lblClient.Text = _client;
            lblMonitorId.Text = "";

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
                                    filterid = lblSqfcode.Text; //NOTE: This will not be a direct match if we add more SQFCODES.
                                    break;
                                default:
                                    break;
                            }
                        }
                        using (DataTable dn = db1.GetDataTable("select sqf_name from monitor_sqfcode where sqf_code='" + db1.reap(lblSqfcode.Text) + "'"))
                        {
                            lblSqfname.Text = "Not Found";
                            foreach (DataRow row in dn.Rows)
                            {
                                lblSqfname.Text = row["sqf_name"].ToString();
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
                    String monid = "0";
                    if (lblMonitorId.Text != "") {
                        monid = lblMonitorId.Text;
                    }

                    using (DataTable dtmh = db1.GetDataTable("select dbo.GetPreviousPoints('" + monid + "','" + lblAgent.Text + "') as Prevscore"))  //"select top 1 cast(pct_score as decimal(10,2)) as PrevScore from monitor_hstry where user_id='" + lblAgent.Text + "' and cast(call_date as date) < '" + lblCalldate.Text + "' order by cast(call_time as date) desc"))
                    {
                        lblPrevScore.Text = "Not Found";
                        foreach (DataRow rowmh in dtmh.Rows)
                        {
                            lblPrevScore.Text = rowmh["PrevScore"].ToString();
                        }
                    }

                    using (DataTable dtmh = db1.GetDataTable("select dbo.Get90DayPoints('" + monid + "','" + lblAgent.Text + "') as Score")) //"select cast(sum(pct_score) as decimal(10,2)) as Score from monitor_hstry where user_id='" + lblAgent.Text + "' and cast(call_date as date) < '" + lblCalldate.Text + "' and cast(call_date as date) >= dateadd(d,-90,'" + lblCalldate.Text + "')"))
                    {
                        lbl90Score.Text = "Not Found";
                        foreach (DataRow rowmh in dtmh.Rows)
                        {
                            lbl90Score.Text = rowmh["Score"].ToString();
                        }
                    }


                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,isnull(hiredt,'') as hiredt from usr where user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            lblAgentHireDate.Text = dtan.Rows[0]["hiredt"].ToString();
                        }
                    }

                    
                    //Performant-Recovery Specific (I don't like it, but keep in mind this stuff only exists for highly-customized monitors).

                    //TODO: Can this be a general flag?  For most cases this is either someone in the "Quality Assurance" role and/or someone with USR_GRP access.
                    using (DataTable dt = db1.GetDataTable("select user_id from usr us where user_id='" + lblViewer.Text + "' and us.USER_ID in (select USER_ID from dbo.getPerformantMGMTFilterUsers(3))"))
                    {
                        lblAuthorized_QA.Text = "No";
                        if (dt.Rows.Count >= 1)
                        {
                            lblAuthorized_QA.Text = "Yes";
                        }
                    }

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
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,group_name,gp.spvr_user_id,loc_name from loc lc inner join grp gp on gp.loc_id=lc.loc_id inner join team tm on tm.group_id=gp.group_id inner join usr_team ut on ut.team_id=tm.team_id left outer join usr on usr.user_id=gp.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            if (dtan.Rows[0]["lastnm"].ToString()!="") {
                              lblAgentGroupLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            }
                            lblAgentGroupName.Text = dtan.Rows[0]["group_name"].ToString();
                            lblAgentGroupLeader.Text = dtan.Rows[0]["spvr_user_id"].ToString();
                            lblAgentLocationName.Text = dtan.Rows[0]["loc_name"].ToString();
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


                    lblCSRAuth.Text = "";
                    using (DataTable dtan = db1.GetDataTable("select filter_name from USR_MGMT_FILTER uf inner join mgmt_filter_type ft on uf.filter_id=ft.filter_id and uf.filter_id in ('" + filterid + "') where uf.user_id='" + lblAgent.Text + "' order by uf.filter_id desc"))
                    {
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            lblCSRAuth.Text = "Yes";
                            break;
                        }
                    }

                    lblMonitorAuth.Text = "";
                    using (DataTable dtan = db1.GetDataTable("select filter_name from USR_MGMT_FILTER uf inner join mgmt_filter_type ft on uf.filter_id=ft.filter_id and uf.filter_id in ('" + filterid + "') where uf.user_id='" + lblViewer.Text + "' order by uf.filter_id desc"))
                    {
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            lblMonitorAuth.Text = "Yes";
                            break;
                        }
                    }

                    //Special Auditing Flags duck
                    lblSpecialAuth.Text = "";
                    using (DataTable dtan = db1.GetDataTable("select filter_name from USR_MGMT_FILTER uf inner join mgmt_filter_type ft on uf.filter_id=ft.filter_id and uf.filter_id in (3,4,5) where uf.user_id='" + lblViewer.Text + "' order by uf.filter_id desc"))
                    {
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            lblSpecialAuth.Text = dtan.Rows[i]["filter_name"].ToString();
                            break;
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
                                lblManagers.Text += dtan.Rows[i]["user_id"] + "~" + dtan.Rows[i]["lastnm"] + ", " + dtan.Rows[i]["firstnm"] + " (" + dtan.Rows[i]["user_id"] + ")";
                            }
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select distinct lastnm,firstnm,us.user_id from usr us inner join usr_mgmt_filter mf on us.user_id=mf.user_id and mf.filter_id='" + filterid + "' inner join grp gp on us.user_id=gp.spvr_user_id order by lastnm,firstnm,us.user_id"))
                    {
                        Boolean first = true;

                        //if (dtan.Rows.Count >= 1)
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            if (dtan.Rows[i]["lastnm"].ToString() != "")
                            {
                                if (!first)
                                {
                                    lblDMs.Text += "|";
                                }
                                first = false;
                                lblDMs.Text += dtan.Rows[i]["user_id"] + "~" + dtan.Rows[i]["lastnm"] + ", " + dtan.Rows[i]["firstnm"] + " (" + dtan.Rows[i]["user_id"] + ")";
                            }
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select distinct lastnm,firstnm,us.user_id from usr us inner join usr_mgmt_filter mf on us.user_id=mf.user_id and mf.filter_id='" + filterid + "' inner join team tm on us.user_id=tm.spvr_user_id order by lastnm,firstnm,us.user_id"))
                    {
                        Boolean first = true;

                        //if (dtan.Rows.Count >= 1)
                        for (int i = 0; i < dtan.Rows.Count; i++)
                        {
                            if (dtan.Rows[i]["lastnm"].ToString() != "")
                            {
                                if (!first)
                                {
                                    lblTMs.Text += "|";
                                }
                                first = false;
                                lblTMs.Text += dtan.Rows[i]["user_id"] + "~" + dtan.Rows[i]["lastnm"] + ", " + dtan.Rows[i]["firstnm"] + " (" + dtan.Rows[i]["user_id"] + ")";
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
