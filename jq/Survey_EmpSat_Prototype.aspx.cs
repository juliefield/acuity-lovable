using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Data;
using jglib;

public partial class _Survey_EmpSat_Prototype : SitePage
{
    String _connection = "";
    String _connection1 = "";

    protected void Page_PreInit(object sender, EventArgs e)
    {
        _connection1 = CONFMGR.ConnectionStrings(/*urlprefix()*/"ers." + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(/*urlprefix()*/"ers." + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        String surveyid = Context.Request.QueryString["surveyid"];
        String sqf = Context.Request.QueryString["sqf"];

        if (!IsPostBack) {
            using (DbBaseSql db1 = new DbBaseSql(_connection1, "")) {
                using (DbBaseSql db = new DbBaseSql(_connection, ""))
                {
                    if (surveyid != "")
                    {
                        //See if this has been answered before.
                        using (DataTable dta = db1.GetDataTable("select * from emp_resp_v2prototype where srvy_id='" + surveyid + "'"))
                        {
                            if (dta.Rows.Count > 0)
                            {
                                Response.Redirect("//ers.acuityapmr.com/jq/survey_EmpSat_Prototype.aspx?pastsubmission=1");
                            }    
                        }

                        using (DataTable dt = db1.GetDataTable("select pj.projectid,pj.projectdesc,usr.user_id,usr.firstnm + ' ' + usr.lastnm as name from emp_srvy es inner join usr on usr.user_id=es.user_id inner join project pj on pj.projectid=es.project_id where es.srvy_id='" + surveyid + "'"))
                        {
                            foreach (DataRow row in dt.Rows)
                            {
                                lblAgent.Text = row["user_id"].ToString();
                                lblAgentName.Text = row["name"].ToString();
                                lblProject.Text = row["projectid"].ToString();
                                lblProjectName.Text = row["projectdesc"].ToString();
                                lblProjectName2.Text = row["projectdesc"].ToString();
                            }
                        }
                    }
                }
            }
        }
    }

    protected void submitme_click(object sender, EventArgs e)
    {
        fillv2resp();
        Response.Redirect("//ers.acuityapmr.com/jq/survey_EmpSat_Prototype.aspx?thanks=1");
    }

    protected void closeme_click(object sender, EventArgs e)
    {
        /*
        if (lblMode.Text == "new")
        {
            Response.Redirect("//ers.acuityapm.com/monitor/monitor.aspx");
        }
        else
        {
            Response.Redirect("//ers.acuityapm.com/monitor/monitor_review.aspx");
        }
         * */
    }

    protected void fillv2resp()
    {
        String surveyid = Context.Request.QueryString["surveyid"];
        String sqf = Context.Request.QueryString["sqf"];

        if (surveyid!="")
        {
            using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
            {
                using (DataTable dt = db1.GetDataTable("select sqf_code from emp_srvy where srvy_id='" + surveyid + "'"))
                {
                    foreach (DataRow row in dt.Rows)
                    {
                        db1.Update("delete from emp_resp_v2prototype where srvy_id='" + surveyid + "'");

                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q1','" + txtQ1.Value + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q2','" + txtQ2.Value + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q3','" + txtQ3.Value + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q4','" + txtQ4.Value + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q5','" + txtQ5.Value + "')");

                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q1Comments','" + db1.reap(txtQ1Comments.Value) + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q2Comments','" + db1.reap(txtQ2Comments.Value) + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q3Comments','" + db1.reap(txtQ3Comments.Value) + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q4Comments','" + db1.reap(txtQ4Comments.Value) + "')");
                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Q5Comments','" + db1.reap(txtQ5Comments.Value) + "')");

                        db1.Update("insert into emp_resp_v2prototype (srvy_id,sqf_code,question,answer) values ('" + surveyid + "','" + row["sqf_code"].ToString() + "','Total','" + txtTotal.Value + "')");

                        db1.Update("update emp_srvy set respdt=getdate() where srvy_id='" + surveyid + "'");
                    }
                }

            }
        }
    }
}
