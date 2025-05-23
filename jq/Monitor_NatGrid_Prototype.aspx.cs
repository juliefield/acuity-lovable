using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;
using jglib;

public partial class _Monitor_NatGrid_Prototype : SitePage
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
        _connection1 = CONFMGR.ConnectionStrings(/*urlprefix()*/"ers." + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(/*urlprefix()*/"ers." + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
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
                        //National Grid might not have a monitor_imprvmnt record.
                        lblAcknowledgementRequired.Text = "No";
                        lblAcknowledgementDate.Text = "";
                        using (DataTable dtmi = db1.GetDataTable("select ack_required,case when ack_date is null then '' else convert(varchar,ack_date,0) end as ack_date from monitor_imprvmnt where monitor_id='" + lblMonitorId.Text + "'"))
                        {
                            foreach (DataRow rowmi in dtmi.Rows)
                            {
                                lblAcknowledgementRequired.Text = rowmi["ack_required"].ToString();
                                lblAcknowledgementDate.Text = rowmi["ack_date"].ToString();
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
                        "(81/*HARDCODED*/,'" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "','" + dtaux.Rows[0]["group_id"].ToString() + "','" + dtaux.Rows[0]["loc_id"].ToString() + "',51/*HARDCODED*/,'" + lblCallid.Text + "','" + lblCalldate.Text + "','" + lblCalldate.Text + "',100,0,100," + txtTotal.Value + "," + txtTotal.Value + ",getdate(),'" + lblSupervisor.Text + "');select scope_identity();"))
                        {
                            if (dtins.Rows.Count > 0) {
                                monitorid = dtins.Rows[0][0].ToString();
                            }
                        }
                        //I need the kpi_score and kpi_weight factor before calling this.
                        //DONE: Add new KPI HSTRY/RESP
                        int kpi_score = 0;
                        double kpi_weight = 0.0;
                        getscoreandweight(txtTotal.Value, ref kpi_score, ref kpi_weight);
                        using (DataTable dtkins = db1.GetDataTable("insert into KPI_HSTRY (user_id,team_id,respdt,entdt,entby,project_id,reference_id) values " +
                            "('" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "','" + lblCalldate.Text.Split(' ')[0] + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',51/*HARDCODED*/,'" + monitorid + "');select scope_identity();"))
                        {
                            db1.Update("insert into KPI_RESP (kpi_id,mqf#,line#,level#,range,kpi_score,kpi_weight_factor,entdt,entby,project_id) values " +
                                "('" + dtkins.Rows[0][0].ToString() + "',268/*HARDCODED*/,1,1,'" + txtTotal.Value + "','" + kpi_score.ToString() + "','" + kpi_weight.ToString() + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',51/*HARDCODED*/)");
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
                db1.Update("update monitor_hstry set raw_score='" + txtTotal.Value + "',pct_score='" + txtTotal.Value + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where monitor_id='" + monitorid + "'");
                //DONE: Update KPI HSTRY/RESP
                int kpi_score = 0;
                double kpi_weight = 0.0;
                getscoreandweight(txtTotal.Value, ref kpi_score, ref kpi_weight);
                using (DataTable dtkpi = db1.GetDataTable("select kpi_id from kpi_hstry where reference_id='" + monitorid + "'"))
                {
                    if (dtkpi.Rows.Count > 0)
                    {
                        db1.Update("update kpi_resp set range='" + txtTotal.Value + "',kpi_score='" + kpi_score.ToString() + "',kpi_weight_factor='" + kpi_weight.ToString() + "',upddt=getdate(),updby='" + lblSupervisor.Text + "' where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
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
            db1.Update("delete from monitor_imprvmnt where monitor_id='" + monitorid + "'");
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
            Response.Redirect("//ers.acuityapm.com/monitor/monitor.aspx");
        }
        else
        {
            Response.Redirect("//ers.acuityapm.com/monitor/monitor_review.aspx");
        }
    }

    protected void fillv2resp(String monitorid)
    {
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            db1.Update("delete from monitor_resp_v2prototype where monitor_id='" + monitorid + "'");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q1','" + txtQ1.Value + "','" + txtQ1text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q2','" + txtQ2.Value + "','" + txtQ2text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q3','" + txtQ3.Value + "','" + txtQ3text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q4','" + txtQ4.Value + "','" + txtQ4text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q5','" + txtQ5.Value + "','" + txtQ5text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q6','" + txtQ6.Value + "','" + txtQ6text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q7','" + txtQ7.Value + "','" + txtQ7text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q8','" + txtQ8.Value + "','" + txtQ8text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q9','" + txtQ9.Value + "','" + txtQ9text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q10','" + txtQ10.Value + "','" + txtQ10text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q11','" + txtQ11.Value + "','" + txtQ11text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q12','" + txtQ12.Value + "','" + txtQ12text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q13','" + txtQ13.Value + "','" + txtQ13text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q14','" + txtQ14.Value + "','" + txtQ14text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q15','" + txtQ15.Value + "','" + txtQ15text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q16','" + txtQ16.Value + "','" + txtQ16text.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer,answertext) values ('" + monitorid + "',81/*HARDCODED*/,'Q17','" + txtQ17.Value + "','" + txtQ17text.Value + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q1Comments','" + db1.reap(txtQ1Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q2Comments','" + db1.reap(txtQ2Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q3Comments','" + db1.reap(txtQ3Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q4Comments','" + db1.reap(txtQ4Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q5Comments','" + db1.reap(txtQ5Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q6Comments','" + db1.reap(txtQ6Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q7Comments','" + db1.reap(txtQ7Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q8Comments','" + db1.reap(txtQ8Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q9Comments','" + db1.reap(txtQ9Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q10Comments','" + db1.reap(txtQ10Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q11Comments','" + db1.reap(txtQ11Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q12Comments','" + db1.reap(txtQ12Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q13Comments','" + db1.reap(txtQ13Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q14Comments','" + db1.reap(txtQ14Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q15Comments','" + db1.reap(txtQ15Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q16Comments','" + db1.reap(txtQ16Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Q17Comments','" + db1.reap(txtQ17Comments.Value) + "')");
            
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Comments','" + db1.reap(txtComments.Value) + "')");

            db1.Update("insert into monitor_imprvmnt (monitor_id,sqf_code,TXT,client_dept,ack_required,entdt,entby) values ('" + monitorid + "',81/*HARDCODED*/,'','','CES',getdate(),'" + lblSupervisor.Text + "')");

            if ((txtCalllength_HH.Value != "") || (txtCalllength_MM.Value != "") || (txtCalllength_SS.Value != ""))
            {
                if (txtCalllength_SS.Value == "")
                {
                    txtCalllength_SS.Value = txtCalllength_MM.Value;
                    txtCalllength_MM.Value = txtCalllength_HH.Value;
                    txtCalllength_HH.Value = "0";
                }
                if (txtCalllength_SS.Value == "")
                {
                    txtCalllength_SS.Value = txtCalllength_MM.Value;
                    txtCalllength_MM.Value = txtCalllength_HH.Value;
                    txtCalllength_HH.Value = "0";
                }
                txtCalllength_HH.Value = txtCalllength_HH.Value.PadLeft(2, '0');
                txtCalllength_MM.Value = txtCalllength_MM.Value.PadLeft(2, '0');
                txtCalllength_SS.Value = txtCalllength_SS.Value.PadLeft(2, '0');
                db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'calllength','" + db1.reap(txtCalllength_HH.Value) + ":" + db1.reap(txtCalllength_MM.Value) + ":" + db1.reap(txtCalllength_SS.Value) + "')");
            }
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'sitelocation','" + db1.reap(txtSitelocation.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'jurisdiction','" + db1.reap(txtJurisdiction.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'calltype','" + db1.reap(txtCalltype.Value) + "')");
            if (txtCalltype.Value == "Collections")
            {
                db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'category','" + db1.reap(txtCategory_collections.Value) + "')");
            }
            else
            {
                db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'category','" + db1.reap(txtCategory_move.Value) + "')");
            }
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'language','" + db1.reap(txtLanguage.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'eligible','" + db1.reap(txtEligible.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'validtransfer','" + db1.reap(txtValidtransfer.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',81/*HARDCODED*/,'Total','" + txtTotal.Value + "')");
        }

    }

    protected void getscoreandweight(String raw,ref int kpi_score, ref double kpi_weight)
    {
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            using (DataTable dt = db1.GetDataTable("select score from kpi_scoring where mqf#=268/*HARDCODED*/ and " + raw + " >= range1low and " + raw + " <= range1high"))
            {
                kpi_score = Convert.ToInt32(dt.Rows[0][0]);
            }
            using (DataTable dt2 = db1.GetDataTable("select weight_factor from kpi_mqf where mqf#=268/*HARDCODED*/ and txt<>''"))
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