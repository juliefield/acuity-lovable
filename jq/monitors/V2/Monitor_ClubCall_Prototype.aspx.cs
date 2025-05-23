using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using jglib;

public partial class _Monitor_ClubCall_Prototype : SitePage
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
        Page.Theme = "Monitors";
        _connection1 = CONFMGR.ConnectionStrings(/*urlprefix()*/"bgr." + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(/*urlprefix()*/"bgr." + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Page.Header.DataBind();
        String uid = Context.Request.QueryString["uid"];
        if (!IsPostBack) {
            using (DbBaseSql db1 = new DbBaseSql(_connection1, "")) {
                using (DbBaseSql db = new DbBaseSql(_connection, ""))
                {
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
                        if (lblSupervisor.Text == lblAgent.Text)
                        {
                            selReviewType.Value = "Self-Observation";
                        }

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
                            }
                        }
                        Boolean found_eligible = false;
                        Boolean found_validtransfer = false;
                        Boolean found_category = false;
                        using (DataTable dtup = db1.GetDataTable("select * from monitor_resp_v2prototype where monitor_id='" + lblMonitorId.Text + "'"))
                        {
                            foreach (DataRow rowup in dtup.Rows)
                            {
                                switch (rowup["question"].ToString())
                                {
                                    case "Q1":
                                        txtQ1.Value = rowup["answer"].ToString();
                                        txtQ1text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q2":
                                        txtQ2.Value = rowup["answer"].ToString();
                                        txtQ2text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q3":
                                        txtQ3.Value = rowup["answer"].ToString();
                                        txtQ3text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q4":
                                        txtQ4.Value = rowup["answer"].ToString();
                                        txtQ4text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q5":
                                        txtQ5.Value = rowup["answer"].ToString();
                                        txtQ5text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q6":
                                        txtQ6.Value = rowup["answer"].ToString();
                                        txtQ6text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q7":
                                        txtQ7.Value = rowup["answer"].ToString();
                                        txtQ7text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q8":
                                        txtQ8.Value = rowup["answer"].ToString();
                                        txtQ8text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q9":
                                        txtQ9.Value = rowup["answer"].ToString();
                                        txtQ9text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q10":
                                        txtQ10.Value = rowup["answer"].ToString();
                                        txtQ10text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q11":
                                        txtQ11.Value = rowup["answer"].ToString();
                                        txtQ11text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q12":
                                        txtQ12.Value = rowup["answer"].ToString();
                                        txtQ12text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q13":
                                        txtQ13.Value = rowup["answer"].ToString();
                                        txtQ13text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q14":
                                        txtQ14.Value = rowup["answer"].ToString();
                                        txtQ14text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q15":
                                        txtQ15.Value = rowup["answer"].ToString();
                                        txtQ15text.Value = rowup["answertext"].ToString();
                                        break;
                                    case "Q16":
                                        txtQ16.Value = rowup["answer"].ToString();
                                        txtQ16text.Value = rowup["answertext"].ToString();
                                        break;
                                        case "Q17":
                                            txtQ17.Value = rowup["answer"].ToString();
                                            txtQ17text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q18":
                                            txtQ18.Value = rowup["answer"].ToString();
                                            txtQ18text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q19":
                                            txtQ19.Value = rowup["answer"].ToString();
                                            txtQ19text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q20":
                                            txtQ20.Value = rowup["answer"].ToString();
                                            txtQ20text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q21":
                                            txtQ21.Value = rowup["answer"].ToString();
                                            txtQ21text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q22":
                                            txtQ22.Value = rowup["answer"].ToString();
                                            txtQ22text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q23":
                                            txtQ23.Value = rowup["answer"].ToString();
                                            txtQ23text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q24":
                                            txtQ24.Value = rowup["answer"].ToString();
                                            txtQ24text.Value = rowup["answertext"].ToString();
                                            break;
                                        case "Q1Comments":
                                        txtQ1Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q2Comments":
                                        txtQ2Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q3Comments":
                                        txtQ3Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q4Comments":
                                        txtQ4Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q5Comments":
                                        txtQ5Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q6Comments":
                                        txtQ6Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q7Comments":
                                        txtQ7Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q8Comments":
                                        txtQ8Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q9Comments":
                                        txtQ9Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q10Comments":
                                        txtQ10Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q11Comments":
                                        txtQ11Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q12Comments":
                                        txtQ12Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q13Comments":
                                        txtQ13Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q14Comments":
                                        txtQ14Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q15Comments":
                                        txtQ15Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q16Comments":
                                        txtQ16Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q17Comments":
                                        txtQ17Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q18Comments":
                                        txtQ18Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q19Comments":
                                        txtQ19Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q20Comments":
                                        txtQ20Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q21Comments":
                                        txtQ21Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q22Comments":
                                        txtQ22Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q23Comments":
                                        txtQ23Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q24Comments":
                                        txtQ24Comments.Value = rowup["answer"].ToString();
                                        break;
                                    case "Comments":
                                        txtComments.Value = rowup["answer"].ToString();
                                        break;
                                    case "calllength":
                                        String cl = rowup["answer"].ToString();
                                        String[] cls = cl.Split(':');
                                        if (cls.Length == 3)
                                        {
                                            inpCalllength_HH.Value = cls[0];
                                            inpCalllength_MM.Value = cls[1];
                                            inpCalllength_SS.Value = cls[2];
                                        }
                                        break;
                                    case "sitelocation":
                                        selSitelocation.Value = rowup["answer"].ToString();
                                        break;
                                    case "jurisdiction":
                                        selJurisdiction.Value = rowup["answer"].ToString();
                                        break;
                                    case "reviewtype":
                                        selReviewType.Value = rowup["answer"].ToString();
                                        break;
                                    case "callpartytype":
                                        selCallpartyType.Value = rowup["answer"].ToString();
                                        break;
                                    case "onlineguidance":
                                        selOnlineGuidance.Value = rowup["answer"].ToString();
                                        break;
                                    case "reviewname":
                                        inpReviewName.Value = rowup["answer"].ToString();
                                        break;
                                    case "calltype":
                                        selCalltype.Value = rowup["answer"].ToString();
                                        break;
                                    case "category":
                                        if (rowup["answer"].ToString() != "") found_category = true;
                                        selCategory_collections.Value = rowup["answer"].ToString(); //Sloppy, but safe to do this.
                                        selCategory_move.Value = rowup["answer"].ToString();
                                        break;
                                    case "language":
                                        selLanguage.Value = rowup["answer"].ToString();
                                        break;
                                    case "eligible":
                                        if (rowup["answer"].ToString()!="") found_eligible = true;
                                        selEligible.Value = rowup["answer"].ToString();
                                        break;
                                    case "validtransfer":
                                        if (rowup["answer"].ToString()!="") found_validtransfer = true;
                                        selValidtransfer.Value = rowup["answer"].ToString();
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        if (!found_eligible)
                        {
                            selEligible.Items.Add(new ListItem("-SELECT-", ""));
                            selEligible.SelectedIndex = selEligible.Items.Count - 1;
                        }
                        if (!found_validtransfer)
                        {
                            selValidtransfer.Items.Add(new ListItem("-SELECT-", ""));
                            selValidtransfer.SelectedIndex = selValidtransfer.Items.Count - 1;
                        }
                        if (!found_category)
                        {
                            selCategory_collections.Items.Add(new ListItem("-SELECT-", ""));
                            selCategory_collections.SelectedIndex = selCategory_collections.Items.Count - 1;
                            selCategory_move.Items.Add(new ListItem("-SELECT-", ""));
                            selCategory_move.SelectedIndex = selCategory_move.Items.Count - 1;
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
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm from team tm inner join usr_team ut on ut.team_id=tm.team_id inner join usr on usr.user_id=tm.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            lblAgentTeamLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                        }
                    }
                    using (DataTable dtan = db1.GetDataTable("select lastnm,firstnm,group_name from grp gp inner join team tm on tm.group_id=gp.group_id inner join usr_team ut on ut.team_id=tm.team_id left outer join usr on usr.user_id=gp.spvr_user_id where ut.user_id='" + lblAgent.Text + "'"))
                    {
                        if (dtan.Rows.Count >= 1)
                        {
                            if (dtan.Rows[0]["lastnm"].ToString()!="") {
                              lblAgentGroupLeaderName.Text = dtan.Rows[0]["lastnm"] + ", " + dtan.Rows[0]["firstnm"];
                            }
                            lblAgentGroupName.Text = dtan.Rows[0]["group_name"].ToString();
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
                        lblRole.Text="NEW";
                    }
                }
            }
        }
    }

    protected void submitme_click(object sender, EventArgs e)
    {
        String uid = Context.Request.QueryString["uid"];
        String monitorid = "";
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            if (lblMode.Text == "new")
            {
                //Get aux fields
                using (DataTable dtaux = db1.GetDataTable("select tm.team_id,tm.group_id,grp.loc_id from usr_team ut inner join team tm on tm.team_id=ut.team_id inner join grp on grp.group_id=tm.group_id where ut.user_id='" + lblAgent.Text + "'")) {
                    if (dtaux.Rows.Count > 0) {
                        //Get a new monitor ID
                        //duck stgInclude_NA_In_Calculation
                        using (DataTable dtins = db1.GetDataTable("insert into MONITOR_HSTRY (sqf_code,user_id,team_id,group_id,loc_id,project_id,call_id,call_date,call_time,form_value,na_score,net_value,raw_score,pct_score,entdt,entby) values " +
                        "(4/*HARDCODED*/,'" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "','" + dtaux.Rows[0]["group_id"].ToString() + "','" + dtaux.Rows[0]["loc_id"].ToString() + "',1/*HARDCODED*/,'" + lblCallid.Text + "','" + lblCalldate.Text + "','" + lblCalldate.Text + "',100,0,100," + txtSuccessRate.Value.Replace("%","") + "," + txtSuccessRate.Value.Replace("%","") + ",getdate(),'" + lblSupervisor.Text + "');select scope_identity();"))
                        {
                            if (dtins.Rows.Count > 0) {
                                monitorid = dtins.Rows[0][0].ToString();
                            }
                        }
                        //I need the kpi_score and kpi_weight factor before calling this.
                        //DONE: Add new KPI HSTRY/RESP

                        //agent - lblAgent.Text
                        //supervisor - lblSupervisor.Text
                        Boolean saveme = true;

                        if (lblAgent.Text == lblSupervisor.Text)
                        {
                            using (DataTable dtan = db1.GetDataTable("select role from usr where user_id='" + lblAgent.Text + "'"))
                            {
                                if (dtan.Rows.Count >= 1)
                                {
                                    if (dtan.Rows[0]["role"].ToString() == "CSR")
                                    {
                                        saveme = false;
                                    }
                                }
                            }
                        }
                        if (saveme)
                        {
                            int kpi_score = 0;
                            double kpi_weight = 0.0;
                            getscoreandweight(txtSuccessRate.Value.Replace("%",""), ref kpi_score, ref kpi_weight);
                            //BLUEGREEN EXCEPTION:  Store the monitors on the REVIEW DATE (for all others it's by call date (which actually should be revisited).  WAS: '" + lblCalldate.Text.Split(' ')[0] + "' for respdt
                            using (DataTable dtkins = db1.GetDataTable("insert into KPI_HSTRY (user_id,team_id,respdt,entdt,entby,project_id,reference_id) values " +
                                "('" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "',cast(floor(cast(getdate() as float)) as datetime),cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',1/*HARDCODED*/,'" + monitorid + "');select scope_identity();"))
                            {
                                //TODO: Test for OS - 1
                                String qmqf = "29";
                                using (DataTable dtos = db1.GetDataTable("select usr.user_id from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id where tm.group_id='16' and usr.user_id='" + lblAgent.Text + "'"))
                                {
                                    if (dtos.Rows.Count > 0)
                                    {
                                        qmqf = "31";
                                    }
                                }
                                //2021-09-01 - MQF is "Quality (NS)" if the role of the reviewer is not in the Quality Assurance role.
                                // 2021-11-11 - Owner Services no longer wants Quality(NS) for any case.
                                //   NOTE:  This was set up for ONLY 31, now changed to all EXCEPT 31.  Not sure why OS was the ONLY one here previously.                               
                                if ((qmqf != "31"))
                                {
                                    using (DataTable dtrole = db1.GetDataTable("select role from usr where user_id='" + lblSupervisor.Text + "' and role in ('Quality Assurance')"))
                                    {
                                        if (dtrole.Rows.Count <= 0)
                                        {
                                            //2024-01-22 - Redirect Quality (NS) to Quality
                                            //WAS: qmqf = "130"; //Always Project 1 (I don't think this will ever be reached).
                                            qmqf = "29";
                                        }
                                    }
                                }
                                db1.Update("insert into KPI_RESP (kpi_id,mqf#,line#,level#,range,kpi_score,kpi_weight_factor,entdt,entby,project_id) values " +
                                    "('" + dtkins.Rows[0][0].ToString() + "'," + qmqf + "/*HARDCODED*/,1,1,'" + txtSuccessRate.Value.Replace("%","") + "','" + kpi_score.ToString() + "','" + kpi_weight.ToString() + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',1/*HARDCODED*/)");
                            }
                        }
                    }
                }
                fillv2resp(monitorid);
            }
            else {
                //update
                monitorid = lblMonitorId.Text;
                //duck
                //stgInclude_NA_In_Calculation
                db1.Update("update monitor_hstry set raw_score='" + txtSuccessRate.Value.Replace("%","") + "',pct_score='" + txtSuccessRate.Value.Replace("%","") + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where monitor_id='" + monitorid + "'");
                //DONE: Update KPI HSTRY/RESP
                int kpi_score = 0;
                double kpi_weight = 0.0;
                getscoreandweight(txtSuccessRate.Value.Replace("%",""), ref kpi_score, ref kpi_weight);
                using (DataTable dtkpi = db1.GetDataTable("select kpi_id from kpi_hstry where reference_id='" + monitorid + "'"))
                {
                    if (dtkpi.Rows.Count > 0)
                    {
                        db1.Update("update kpi_resp set range='" + txtSuccessRate.Value.Replace("%","") + "',kpi_score='" + kpi_score.ToString() + "',kpi_weight_factor='" + kpi_weight.ToString() + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
                    }
                }

                fillv2resp(monitorid);
            }
        }
        closeme_click(sender, e);
    }

    protected void deleteme_click(object sender, EventArgs e)
    {
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            String monitorid = lblMonitorId.Text;
            db1.Update("delete from monitor_hstry where monitor_id='" + monitorid + "'");
            //DONE: Delete KPI HSTRY/RESP
            using (DataTable dtkpi = db1.GetDataTable("select kpi_id from kpi_hstry where reference_id='" + monitorid + "'"))
            {
                if (dtkpi.Rows.Count > 0)
                {
                    db1.Update("delete from kpi_resp where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
                    db1.Update("delete from kpi_hstry where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
                }
            }
            db1.Update("delete from monitor_resp_v2prototype where monitor_id='" + monitorid + "'");
        }
        closeme_click(sender, e);
    }

    protected void closeme_click(object sender, EventArgs e)
    {
        if (lblMode.Text == "new")
        {
            Response.Redirect("//bgr.acuityapm.com/monitor/monitor.aspx");
        }
        else
        {
            Response.Redirect("//bgr.acuityapm.com/monitor/monitor_review.aspx");
        }
    }

    protected void fillv2resp(String monitorid)
    {
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            db1.Update("delete from monitor_resp_v2prototype where monitor_id='" + monitorid + "'");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q1','" + txtQ1.Value + "','" + txtQ1text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q2','" + txtQ2.Value + "','" + txtQ2text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q3','" + txtQ3.Value + "','" + txtQ3text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q4','" + txtQ4.Value + "','" + txtQ4text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q5','" + txtQ5.Value + "','" + txtQ5text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q6','" + txtQ6.Value + "','" + txtQ6text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q7','" + txtQ7.Value + "','" + txtQ7text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q8','" + txtQ8.Value + "','" + txtQ8text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q9','" + txtQ9.Value + "','" + txtQ9text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q10','" + txtQ10.Value + "','" + txtQ10text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q11','" + txtQ11.Value + "','" + txtQ11text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q12','" + txtQ12.Value + "','" + txtQ12text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q13','" + txtQ13.Value + "','" + txtQ13text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q14','" + txtQ14.Value + "','" + txtQ14text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q15','" + txtQ15.Value + "','" + txtQ15text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q16','" + txtQ16.Value + "','" + txtQ16text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q17','" + txtQ17.Value + "','" + txtQ17text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q18','" + txtQ18.Value + "','" + txtQ18text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q19','" + txtQ19.Value + "','" + txtQ19text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q20','" + txtQ20.Value + "','" + txtQ20text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q21','" + txtQ21.Value + "','" + txtQ21text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q22','" + txtQ22.Value + "','" + txtQ22text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',4/*HARDCODED*/,'Q23','" + txtQ23.Value + "','" + txtQ23text.Value + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'Q24Comments','" + db1.reap(txtQ24Comments.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'Comments','" + db1.reap(txtComments.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'reviewtype','" + db1.reap(txtReviewType.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'callpartytype','" + db1.reap(txtCallpartyType.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'onlineguidance','" + db1.reap(txtOnlineGuidance.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'Total','" + txtSuccessRate.Value.Replace("%","") + "')");
 
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',4/*HARDCODED*/,'reviewname','" + db1.reap(txtReviewName.Value) + "')");
        }

    }

    protected void getscoreandweight(String raw,ref int kpi_score, ref double kpi_weight)
    {
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            //TODO: Test for OS - 2
            String qmqf = "29";
            using (DataTable dtos = db1.GetDataTable("select usr.user_id from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id where tm.group_id='16' and usr.user_id='" + lblAgent.Text + "'"))
            {
                if (dtos.Rows.Count > 0)
                {
                    qmqf = "31";
                }
            }
            using (DataTable dt = db1.GetDataTable("select score from kpi_scoring where mqf#=" + qmqf + "/*HARDCODED*/ and " + raw + " >= range1low and " + raw + " <= range1high"))
            {
                kpi_score = Convert.ToInt32(dt.Rows[0][0]);
            }
            using (DataTable dt2 = db1.GetDataTable("select weight_factor from kpi_mqf where mqf#=" + qmqf + "/*HARDCODED*/ and txt<>''"))
            {
                kpi_weight = Convert.ToDouble(dt2.Rows[0][0]);
            }
            //2021-09-01 - Weight=0 (and KPI change elsewhere) if the role of the reviewer is not in the Quality Assurance role.
            if ((qmqf == "31"))
            {
                using (DataTable dtrole = db1.GetDataTable("select role from usr where user_id='" + lblSupervisor.Text + "' and role in ('Quality Assurance')"))
                {
                    if (dtrole.Rows.Count <= 0)
                    {
                        kpi_weight = 0;
                    }
                }
            }
        }
    }

}

/*
50 -> 56 -> 81
132 -> 95 -> 268
21 -> 17 -> 51
*/
