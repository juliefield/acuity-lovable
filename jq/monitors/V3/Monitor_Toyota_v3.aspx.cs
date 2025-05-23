using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using jglib;

public partial class _Monitor_Toyota_v3 : SitePage
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
        _connection1 = CONFMGR.ConnectionStrings(/*urlprefix()*/"act." + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(/*urlprefix()*/"act." + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Page.Header.DataBind();
        String uid = Context.Request.QueryString["uid"];
        if (!IsPostBack)
        {
            using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
            {
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
                            using (DataTable ddt = db.GetDataTable("select getdate() as currentdate"))
                            {
                                foreach (DataRow row in ddt.Rows)
                                {
                                    lblCurrentDate.Text = row["currentdate"].ToString();
                                }
                            }
                        }
                        else
                        {
                            lblMode.Text = "update";
                            using (DataTable ddt = db1.GetDataTable("select entdt as currentdate from monitor_hstry where monitor_id='" + lblMonitorId.Text + "'"))
                            {
                                foreach (DataRow row in ddt.Rows)
                                {
                                    lblCurrentDate.Text = row["currentdate"].ToString();
                                }
                            }
                        }
                        if (lblSupervisor.Text == lblAgent.Text)
                        {
                            selReviewType.Value = "Self-Observation";
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
                            if (dtan.Rows[0]["lastnm"].ToString() != "")
                            {
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
                        lblRole.Text = "NEW";
                    }
                }
            }
        }
    }

    protected void submitme_click(object sender, EventArgs e)
    {
        return; //DEBUG

        String uid = Context.Request.QueryString["uid"];
        String monitorid = "";
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            if (lblMode.Text == "new")
            {
                //Get aux fields
                using (DataTable dtaux = db1.GetDataTable("select tm.team_id,tm.group_id,grp.loc_id from usr_team ut inner join team tm on tm.team_id=ut.team_id inner join grp on grp.group_id=tm.group_id where ut.user_id='" + lblAgent.Text + "'"))
                {
                    if (dtaux.Rows.Count > 0)
                    {
                        //Get a new monitor ID
                        //duck stgInclude_NA_In_Calculation
                        using (DataTable dtins = db1.GetDataTable("insert into MONITOR_HSTRY (sqf_code,user_id,team_id,group_id,loc_id,project_id,call_id,call_date,call_time,form_value,na_score,net_value,raw_score,pct_score,entdt,entby) values " +
                        "(8/*HARDCODED*/,'" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "','" + dtaux.Rows[0]["group_id"].ToString() + "','" + dtaux.Rows[0]["loc_id"].ToString() + "',2/*HARDCODED*/,'" + lblCallid.Text + "','" + lblCalldate.Text + "','" + lblCalldate.Text + "',100,0,100," + txtSuccessRate.Value.Replace("%", "") + "," + txtSuccessRate.Value.Replace("%", "") + ",getdate(),'" + lblSupervisor.Text + "');select scope_identity();"))
                        {
                            if (dtins.Rows.Count > 0)
                            {
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
                            getscoreandweight("33", txtSuccessRate.Value.Replace("%", ""), ref kpi_score, ref kpi_weight);
                            //BLUEGREEN EXCEPTION:  Store the monitors on the REVIEW DATE (for all others it's by call date (which actually should be revisited).  WAS: '" + lblCalldate.Text.Split(' ')[0] + "' for respdt
                            using (DataTable dtkins = db1.GetDataTable("insert into KPI_HSTRY (user_id,team_id,respdt,entdt,entby,project_id,reference_id) values " +
                                "('" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "',cast(floor(cast(getdate() as float)) as datetime),cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',2/*HARDCODED*/,'" + monitorid + "');select scope_identity();"))
                            {
                                //Owner Services Group (16) > mqf# "Quality (OS)" (31)
                                String qmqf = "33"; //Quality (SM)
                                using (DataTable dtos = db1.GetDataTable("select usr.user_id from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id where tm.group_id='16' and usr.user_id='" + lblAgent.Text + "'"))
                                {
                                    if (dtos.Rows.Count > 0)
                                    {
                                        qmqf = "31"; //Quality (OS)
                                    }
                                }
                                //Call Transfer Group (28) > mqf# "Quality (CT)" (48)
                                using (DataTable dtos = db1.GetDataTable("select usr.user_id from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id where tm.group_id='28' and usr.user_id='" + lblAgent.Text + "'"))
                                {
                                    if (dtos.Rows.Count > 0)
                                    {
                                        qmqf = "48"; //Quality (CT)
                                    }
                                }
                                db1.Update("insert into KPI_RESP (kpi_id,mqf#,line#,level#,range,kpi_score,kpi_weight_factor,entdt,entby,project_id) values " +
                                    "('" + dtkins.Rows[0][0].ToString() + "'," + qmqf + "/*HARDCODED*/,1,1,'" + txtSuccessRate.Value.Replace("%", "") + "','" + kpi_score.ToString() + "','" + kpi_weight.ToString() + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',2/*HARDCODED*/)");
                            }
                        }
                        if (txtQA4.Value == "")
                        {
                            saveme = false;
                        }
                        if (saveme) //This is the QUALITY ASSURANCE KPI
                        {
                            int kpi_score = 0;
                            double kpi_weight = 0.0;
                            getscoreandweight("34", txtAssuranceTotal.Value.Replace("%", ""), ref kpi_score, ref kpi_weight);
                            //BLUEGREEN EXCEPTION:  Store the monitors on the REVIEW DATE (for all others it's by call date (which actually should be revisited).  WAS: '" + lblCalldate.Text.Split(' ')[0] + "' for respdt
                            using (DataTable dtkins = db1.GetDataTable("insert into KPI_HSTRY (user_id,team_id,respdt,entdt,entby,project_id,reference_id) values " +
                                "('" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "',cast(floor(cast(getdate() as float)) as datetime),cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',2/*HARDCODED*/,'" + monitorid + "');select scope_identity();"))
                            {
                                //TODO:
                                String qmqf = "34"; //Assurance (SM)
                                /* No different KPI for OS for Quality Assurance (It's on a different project anyway, this will bite me at some point).
                                    BUT, the Call Transfer group uses "Assurance (CT)", which is mqf# 49
                                */
                                using (DataTable dtos = db1.GetDataTable("select usr.user_id from usr inner join usr_team ut on ut.user_id=usr.user_id inner join team tm on tm.team_id=ut.team_id where tm.group_id='28' and usr.user_id='" + lblAgent.Text + "'"))
                                {
                                    if (dtos.Rows.Count > 0)
                                    {
                                        qmqf = "49"; //Assurance (CT)
                                    }
                                }
                                db1.Update("insert into KPI_RESP (kpi_id,mqf#,line#,level#,range,kpi_score,kpi_weight_factor,entdt,entby,project_id) values " +
                                    "('" + dtkins.Rows[0][0].ToString() + "'," + qmqf + "/*HARDCODED*/,1,1,'" + txtAssuranceTotal.Value.Replace("%", "") + "','" + kpi_score.ToString() + "','" + kpi_weight.ToString() + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',2/*HARDCODED*/)");
                            }
                        }
                    }
                }
                fillv2resp(monitorid);
            }
            else
            {
                //update
                monitorid = lblMonitorId.Text;
                //duck
                //stgInclude_NA_In_Calculation
                db1.Update("update monitor_hstry set raw_score='" + txtSuccessRate.Value.Replace("%", "") + "',pct_score='" + txtSuccessRate.Value.Replace("%", "") + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where monitor_id='" + monitorid + "'");
                if (true)
                {
                    //DONE: Update KPI HSTRY/RESP
                    int kpi_score = 0;
                    double kpi_weight = 0.0;
                    getscoreandweight("33", txtSuccessRate.Value.Replace("%", ""), ref kpi_score, ref kpi_weight);
                    using (DataTable dtkpi = db1.GetDataTable("select kh.kpi_id from kpi_hstry kh inner join kpi_resp kr on kr.kpi_id=kh.kpi_id where mqf#=33 and reference_id='" + monitorid + "'"))
                    {
                        if (dtkpi.Rows.Count > 0)
                        {
                            db1.Update("update kpi_resp set range='" + txtSuccessRate.Value.Replace("%", "") + "',kpi_score='" + kpi_score.ToString() + "',kpi_weight_factor='" + kpi_weight.ToString() + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
                        }
                    }
                    fillv2resp(monitorid);
                }
                if (true) // Update QUALITY ASSURANCE KPI
                {
                    //DONE: Update KPI HSTRY/RESP
                    int kpi_score = 0;
                    double kpi_weight = 0.0;
                    getscoreandweight("34", txtAssuranceTotal.Value.Replace("%", ""), ref kpi_score, ref kpi_weight);
                    using (DataTable dtkpi = db1.GetDataTable("select kh.kpi_id from kpi_hstry kh inner join kpi_resp kr on kr.kpi_id=kh.kpi_id where mqf#=34 and reference_id='" + monitorid + "'"))
                    {
                        if (dtkpi.Rows.Count > 0)
                        {
                            db1.Update("update kpi_resp set range='" + txtAssuranceTotal.Value.Replace("%", "") + "',kpi_score='" + kpi_score.ToString() + "',kpi_weight_factor='" + kpi_weight.ToString() + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
                        }
                    }
                    fillv2resp(monitorid);
                }


            }
        }
        closeme_click(sender, e);
    }

    protected void deleteme_click(object sender, EventArgs e)
    {
        return; //DEBUG

        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            String monitorid = lblMonitorId.Text;
            if (Convert.ToInt32(monitorid) > 0)
            {
                db1.Update("delete from monitor_hstry where monitor_id='" + monitorid + "'");
                //DONE: Delete KPI HSTRY/RESP
                using (DataTable dtkpi = db1.GetDataTable("select kpi_id from kpi_hstry where reference_id='" + monitorid + "'"))
                {
                    foreach (DataRow row in dtkpi.Rows)
                    {
                        db1.Update("delete from kpi_resp where kpi_id='" + row["kpi_id"].ToString() + "'");
                        db1.Update("delete from kpi_hstry where kpi_id='" + row["kpi_id"].ToString() + "'");
                    }
                }
                db1.Update("delete from monitor_resp_v2prototype where monitor_id='" + monitorid + "'");
            }
        }
        closeme_click(sender, e);
    }

    protected void closeme_click(object sender, EventArgs e)
    {
        return; //DEBUG

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
        return; //DEBUG
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            db1.Update("delete from monitor_resp_v2prototype where monitor_id='" + monitorid + "'");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q1','" + txtQ1.Value + "','" + txtQ1text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q2','" + txtQ2.Value + "','" + txtQ2text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q3','" + txtQ3.Value + "','" + txtQ3text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q4','" + txtQ4.Value + "','" + txtQ4text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q5','" + txtQ5.Value + "','" + txtQ5text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q6','" + txtQ6.Value + "','" + txtQ6text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q7','" + txtQ7.Value + "','" + txtQ7text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q8','" + txtQ8.Value + "','" + txtQ8text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q9','" + txtQ9.Value + "','" + txtQ9text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q10','" + txtQ10.Value + "','" + txtQ10text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q11','" + txtQ11.Value + "','" + txtQ11text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q12','" + txtQ12.Value + "','" + txtQ12text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q13','" + txtQ13.Value + "','" + txtQ13text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q14','" + txtQ14.Value + "','" + txtQ14text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q15','" + txtQ15.Value + "','" + txtQ15text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q16','" + txtQ16.Value + "','" + txtQ16text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q17','" + txtQ17.Value + "','" + txtQ17text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q18','" + txtQ18.Value + "','" + txtQ18text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'Q19','" + txtQ19.Value + "','" + txtQ19text.Value + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'Comments','" + db1.reap(txtComments.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA1C','" + txtQA1C.Value + "','" + txtQA1Ctext.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA1E','" + txtQA1E.Value + "','" + txtQA1Etext.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'QA1Comments','" + db1.reap(txtQA1Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA2C','" + txtQA2C.Value + "','" + txtQA2Ctext.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA2E','" + txtQA2E.Value + "','" + txtQA2Etext.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'QA2Comments','" + db1.reap(txtQA2Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA3C','" + txtQA3C.Value + "','" + txtQA3Ctext.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA3E','" + txtQA3E.Value + "','" + txtQA3Etext.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'QA3Comments','" + db1.reap(txtQA3Comments.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA4','" + txtQA4.Value + "','" + txtQA4text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA5','" + txtQA5.Value + "','" + txtQA5text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA6','" + db1.reap(txtQA6.Value) + "','" + db1.reap(txtQA6text.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA7','" + txtQA7.Value + "','" + txtQA7text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA8','" + txtQA8.Value + "','" + txtQA8text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',8/*HARDCODED*/,'QA9','" + txtQA9.Value + "','" + txtQA9text.Value + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'QA7Comments','" + db1.reap(txtQA7Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'QA8Comments','" + db1.reap(txtQA8Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'QA9Comments','" + db1.reap(txtQA9Comments.Value) + "')");


            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'reviewtype','" + db1.reap(txtReviewType.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'callpartytype','" + db1.reap(txtCallpartyType.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'onlineguidance','" + db1.reap(txtOnlineGuidance.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'Total','" + txtSuccessRate.Value.Replace("%", "") + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'AssuranceTotal','" + txtAssuranceTotal.Value.Replace("%", "") + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',8/*HARDCODED*/,'reviewname','" + db1.reap(txtReviewName.Value) + "')");
        }

    }

    protected void getscoreandweight(String KPI, String raw, ref int kpi_score, ref double kpi_weight)
    {
        return; //DEBUG
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            //TODO: Test for OS - 2
            String qmqf = KPI;
            using (DataTable dt = db1.GetDataTable("select score from kpi_scoring where mqf#=" + qmqf + "/*HARDCODED*/ and " + raw + " >= range1low and " + raw + " <= range1high"))
            {
                kpi_score = Convert.ToInt32(dt.Rows[0][0]);
            }
            using (DataTable dt2 = db1.GetDataTable("select weight_factor from kpi_mqf where mqf#=33/*HARDCODED*/ and txt<>''"))
            {
                kpi_weight = Convert.ToDouble(dt2.Rows[0][0]);
            }
        }
    }

}

/*
50 -> 56 -> 81
132 -> 95 -> 268
21 -> 17 -> 51
*/
