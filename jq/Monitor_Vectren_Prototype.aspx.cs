using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Data;
using jglib;

public partial class _Monitor_Vectren_Prototype : SitePage
{
    String _connection = "";
    String _connection1 = "";
    Boolean isnew = false;

    protected void Page_PreInit(object sender, EventArgs e)
    {
        Page.Theme = "Touchpoint";
        _connection1 = CONFMGR.ConnectionStrings(/*urlprefix()*/"ers." + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(/*urlprefix()*/"ers." + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
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
                        using (DataTable dtup = db1.GetDataTable("select * from monitor_resp_v2prototype where monitor_id='" + lblMonitorId.Text + "'"))
                        {
                            foreach (DataRow rowup in dtup.Rows)
                            {
                                switch (rowup["question"].ToString())
                                {
                                    case "Q1":
                                        txtQ1.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q2":
                                        txtQ2.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q3":
                                        txtQ3.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q4":
                                        txtQ4.Value = rowup["answer"].ToString();
                                        break;
                                    case "Q5":
                                        txtQ5.Value = rowup["answer"].ToString();
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
                                    case "Address":
                                        txtAddress.Value = rowup["answer"].ToString();
                                        break;
                                    default:
                                        break;
                                }
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
                        using (DataTable dtins = db1.GetDataTable("insert into MONITOR_HSTRY (sqf_code,user_id,team_id,group_id,loc_id,project_id,call_id,call_date,call_time,form_value,na_score,net_value,raw_score,pct_score,entdt,entby) values " + 
                        "(50/*HARDCODED*/,'" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "','" + dtaux.Rows[0]["group_id"].ToString() + "','" + dtaux.Rows[0]["loc_id"].ToString() + "',21/*HARDCODED*/,'" + lblCallid.Text + "','" + lblCalldate.Text + "','" + lblCalldate.Text + "',100,0,100," + txtTotal.Value + "," + txtTotal.Value + ",getdate(),'" + lblSupervisor.Text + "');select scope_identity();"))
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
                            "('" + lblAgent.Text + "','" + dtaux.Rows[0]["team_id"].ToString() + "','" + lblCalldate.Text.Split(' ')[0] + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',21/*HARDCODED*/,'" + monitorid + "');select scope_identity();"))
                        {
                            db1.Update("insert into KPI_RESP (kpi_id,mqf#,line#,level#,range,kpi_score,kpi_weight_factor,entdt,entby,project_id) values " +
                                "('" + dtkins.Rows[0][0].ToString() + "',132/*HARDCODED*/,1,1,'" + txtTotal.Value + "','" + kpi_score.ToString() + "','" + kpi_weight.ToString() + "',cast(floor(cast(getdate() as float)) as datetime),'" + lblSupervisor.Text + "',21/*HARDCODED*/)");
                        }

                    }
                }
                fillv2resp(monitorid);
            }
            else {
                //update
                monitorid = lblMonitorId.Text;
                db1.Update("update monitor_hstry set raw_score='" + db1.reap(txtTotal.Value) + "',pct_score='" + db1.reap(txtTotal.Value) + "',upddt=getdate(),updby='" + db1.reap(lblSupervisor.Text) + "' where monitor_id='" + monitorid + "'");
                //DONE: Update KPI HSTRY/RESP
                int kpi_score = 0;
                double kpi_weight = 0.0;
                getscoreandweight(txtTotal.Value, ref kpi_score, ref kpi_weight);
                using (DataTable dtkpi = db1.GetDataTable("select kpi_id from kpi_hstry where reference_id='" + monitorid + "'"))
                {
                    if (dtkpi.Rows.Count > 0)
                    {
                        db1.Update("update kpi_resp set range='" + db1.reap(txtTotal.Value) + "',kpi_score='" + db1.reap(kpi_score.ToString()) + "',kpi_weight_factor='" + db1.reap(kpi_weight.ToString()) + "',upddt=getdate(),updby='" + db1.reap(lblSupervisor.Text) + "' where kpi_id='" + dtkpi.Rows[0][0].ToString() + "'");
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

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q1','" + txtQ1.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q2','" + txtQ2.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q3','" + txtQ3.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q4','" + txtQ4.Value + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q5','" + txtQ5.Value + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q1Comments','" + db1.reap(txtQ1Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q2Comments','" + db1.reap(txtQ2Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q3Comments','" + db1.reap(txtQ3Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q4Comments','" + db1.reap(txtQ4Comments.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Q5Comments','" + db1.reap(txtQ5Comments.Value) + "')");

            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Address','" + db1.reap(txtAddress.Value) + "')");
            db1.Update("insert into monitor_resp_v2prototype (monitor_id,sqf_code,question,answer) values ('" + monitorid + "',50/*HARDCODED*/,'Total','" + txtTotal.Value + "')");
        }

    }

    protected void getscoreandweight(String raw,ref int kpi_score, ref double kpi_weight)
    {
        using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
        {
            using (DataTable dt = db1.GetDataTable("select score from kpi_scoring where mqf#=132/*HARDCODED*/ and " + raw + " >= range1low and " + raw + " <= range1high"))
            {
                kpi_score = Convert.ToInt32(dt.Rows[0][0]);
            }
            using (DataTable dt2 = db1.GetDataTable("select weight_factor from kpi_mqf where mqf#=132/*HARDCODED*/ and txt<>''"))
            {
                kpi_weight = Convert.ToDouble(dt2.Rows[0][0]);
            }
        }
    }

}
