using System;
using System.Configuration;
using System.Web;
using System.Web.UI;
using System.Data;
using jglib;

public partial class jq_DashboardAsync : SitePage
{

    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Acuity3";
        //Page.Theme = CONFMGR.AppSettings(urlprefix() + "theme"].ToString();
        /*
        String host = HttpContext.Current.Request.Url.Host;
        base.OnPreInit(e);
        if (Request.QueryString["theme"] != null)
        {
            Page.Theme = Request.QueryString["theme"].ToString();
        }
        else if (Session["theme"] != null)
        {
            Session["theme"] = Page.Theme;
        }
        else if (HttpContext.Current.Request.Url.Host.ToString().ToLower().IndexOf("acuity") >= 0)
        {
            Page.Theme = "Acuity";
            Session["theme"] = Page.Theme;
        }
     * */
    }

    protected String xss(String par) {
        return par.Replace(";", "").Replace("\"", "").Replace("(", "").Replace(")", "");
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        //                    Session("TP1Username") = Request.QueryString("username")
        //            Session("TP1Role") = Request.QueryString("role").ToString
        Boolean inframe = false;
        if (Request.QueryString["inframe"] != null)
        {
            if (Request.QueryString["inframe"].ToString() != "")
            {
                inframe = true;
            }
        }
        if (!inframe)
        {
            if ((Session["TP1Role"] != null) && (Session["TP1Username"] != null))
            {
                using (VirtualStorage cds = new VirtualStorage())
                {
                    String username = "";
                    if (Session["TP1Username"] != null)
                    {
                        username = Session["TP1Username"].ToString();
                    }

                    String role = "";
                    if (Session["TP1Role"] != null)
                    {
                        role = Session["TP1Role"].ToString();
                    }

                    //DONE: bodyid needs replaced with the logged-in user_id (need the user id server-side).
                    //DONE: projectnumber needs replaced with ACUITY.ers  (need the client number server-side).
                    //DONE: the page name needs replaced with the role of the currently logged in person (need the role server-side).
                    //OLD: String bodyid = urlprefix() + "." + Session["TP1Username"].ToString();
                    Page mp = (Page)this;
                    //throw new Exception("debug:test");
                    //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                    cds.RegisterApp("ACUITY", urlprefix(), role, username, ref mp, "");
                }
            }
            else
            {
                String username = "NULL";
                if (Session["TP1Username"] != null)
                {
                    username = Session["TP1Username"].ToString();
                }

                String role = "NULL";
                if (Session["TP1Role"] != null)
                {
                    role = Session["TP1Role"].ToString();
                }

                //throw new Exception("debug: TP1Role=" + role + ", TP1Username=" + username);
                Response.Redirect("login.aspx?url=DashboardAsync.aspx");
            }
        }
        else //inframe method.
        {
            String jv = "";
            String R = "\r\n";

            String username1 = null;
            String role1 = null;

            if (Request.QueryString["ad"] != null)
            {
            }
            else
            {
                if (Request.QueryString["username"] != null)
                {
                    username1 = xss(Request.QueryString["username"].ToString());
                }
                if (Request.QueryString["role"] != null)
                {
                    role1 = xss(Request.QueryString["role"].ToString());
                }
            }

            String up = urlprefix();

            Boolean sitedown = false;
            try
            {
                String connection = CONFMGR.ConnectionStrings(up + "Connection20").ConnectionString.ToString().Trim() + ";Provider=\"SQLOLEDB\";";
                using (DbBaseSql db = new DbBaseSql(connection, ""))
                {
                    using (DataTable ds = db.GetDataTable("select webready from cln where id='" + CONFMGR.AppSettings(up + "client") + "'"))
                    {
                        if (ds.Rows.Count > 0)
                        {
                            if (ds.Rows[0][0].ToString().ToLower() == "down")
                            {
                                sitedown = true;
                            }
                        }
                    }
                    if ((username1 != null) && (Request.QueryString["url"] != null))
                    {
                        String cp = "";
                        if (Request.QueryString["cp"] != null)
                        {
                            cp = xss(Request.QueryString["cp"]).ToString();
                        }
                        if (cp != "Y")
                        {  //MAKEDEV
                            //CALL EXPLICITLY TO SEE IF PASSWORD NEEDS CHANGED.
                            String ul = username1.ToLower();
                            //ADDED: 2018-03-13
                            if (up == "ers.")
                            {
                                using (DataTable du = db.GetDataTable("select case when datediff(D,lastpasswordupdate,getdate()) > 180 then 'Y' else 'N' end as changepassword from fan_player_stg where client='" + CONFMGR.AppSettings(up + "client") + "' and user_id='" + db.reap(username1) + "'"))
                                {
                                    if (du.Rows.Count > 0)
                                    {
                                        if (du.Rows[0][0].ToString() == "Y")
                                        {
                                            cp = "Y";
                                        }
                                    }
                                }
                            }
                        }
                        if (!ClientScript.IsStartupScriptRegistered("authscript"))
                        {
                            jv = "<script type=\"text/javascript\">" + R;                            
                            jv += "$.cookie(\"TP1Username\",\"" + username1 + "\");" + R;
                            jv += "$.cookie(\"username\",\"" + username1 + "\");" + R;
                            jv += "$.cookie(\"uid\",\"" + xss(Request.QueryString["uid"].ToString()) + "\");" + R;
                            jv += "$.cookie(\"TP1Role\",\"" + xss(Request.QueryString["role"].ToString()) + "\");" + R;

                            jv += "$.cookie(\"TP1ChangePassword\",\"" + cp + "\");" + R;
                            if (Request.QueryString["boxfilter"] != null)
                            {
                                jv += "$.cookie(\"TP1Boxfilter\",\"" + xss(Request.QueryString["boxfilter"].ToString()) + "\");" + R;
                            }
                            jv += "$.cookie(\"TP1Roleset\",\"" + xss(Request.QueryString["roleset"].ToString()) + "\");" + R;
                            if (Request.QueryString["project"].ToString().ToLower() == "pse")
                            {
                                jv += "$.cookie(\"ApmProject\",\"PSE&G\");" + R; //sorry...
                            }
                            else
                            {
                                jv += "$.cookie(\"ApmProject\",\"" + xss(Request.QueryString["project"].ToString()) + "\");" + R;
                            }
                            if (Request.QueryString["indallas"] != null)
                            {
                                jv += "$.cookie(\"ApmInDallas\",\"" + xss(Request.QueryString["indallas"].ToString()) + "\");" + R;
                            }
                            else
                            {
                                jv += "$.cookie(\"ApmInDallas\",\"\");" + R;
                            }
                            if (Request.QueryString["projectfilter"] != null)
                            {
                                if (Request.QueryString["projectfilter"].ToString().ToLower() == "pse")
                                {
                                    jv += "$.cookie(\"ApmProjectFilter\",\"PSE&G\");" + R; //sorry...
                                }
                                else
                                {
                                    jv += "$.cookie(\"ApmProjectFilter\",\"" + xss(Request.QueryString["projectfilter"].ToString()) + "\");" + R;
                                }
                            }
                            //jv += "alert('debug:cookie is ' + $.cookie(\"ApmProject\"));" + R
                            if (Request.QueryString["prefix"] != null)
                            {
                                //jv += "alert(\"debug:inframe going to: " + xss(Request.QueryString["url"]) + "?prefix=" + xss(Request.QueryString["prefix"]) + "&inframe=" + Request.QueryString["inframe"].ToString() + "\");" + R;
                                jv += "window.location=\"" + xss(Request.QueryString["url"]) + "?prefix=" + xss(Request.QueryString["prefix"]) + "&inframe=" + Request.QueryString["inframe"].ToString() + "\";";
                            }
                            else
                            {
                                //jv += "alert(\"debug:inframe going to: " + xss(Request.QueryString["url"]) + "?username=" + username1 + "&role=" + xss(Request.QueryString["role"].ToString()) + "&uid=" + xss(Request.QueryString["uid"].ToString()) + "&inframe=" + Request.QueryString["inframe"].ToString() + "\");" + R;
                                jv += "window.location=\"" + xss(Request.QueryString["url"]) + "?username=" + username1 + "&role=" + xss(Request.QueryString["role"].ToString()) + "&uid=" + xss(Request.QueryString["uid"].ToString()) + "&inframe=" + Request.QueryString["inframe"].ToString() + "\";";
                            }
                            jv += "</script>" + R;

                            //Throw New Exception("DEBUGGING: jv=" + jv + ",username=" + username1 + ",role=" + xss(Request.QueryString("role").ToString()))
                            ClientScript.RegisterStartupScript(Page.GetType(), "authscript", jv);
                        }
                        Session["TP1Username"] = username1;
                        role1 = xss(Request.QueryString["role"].ToString());
                        Session["TP1Role"] = xss(Request.QueryString["role"].ToString());
                        Session["TP1ChangePassword"] = cp;
                        Session["LoginSide"] = "TP1";
                        //Throw New Exception("DEBUGGING: jv=" + jv + ",Session_TP1Username=" + Session("TP1Username").ToString() + ",Session_TP1Role=" + Session("TP1Role").ToString())
                    }
                }
            }
            catch (Exception ex)
            {
                sitedown = true;
            }
            if (sitedown)
            {
                Response.Redirect("SiteMaintenance.htm");
            }

            //TODO: END OF Touchpointauthentication Equivalent

            if ((username1 != null) && (role1 != null))
            {
                using (VirtualStorage cds = new VirtualStorage())
                {
                    /*
                    String username = "";
                    if (Session["TP1Username"] != null)
                    {
                        username = Session["TP1Username"].ToString();
                    }

                    String role = "";
                    if (Session["TP1Role"] != null)
                    {
                        role = Session["TP1Role"].ToString();
                    }
                     * */

                    //DONE: bodyid needs replaced with the logged-in user_id (need the user id server-side).
                    //DONE: projectnumber needs replaced with ACUITY.ers  (need the client number server-side).
                    //DONE: the page name needs replaced with the role of the currently logged in person (need the role server-side).
                    //OLD: String bodyid = urlprefix() + "." + Session["TP1Username"].ToString();
                    Page mp = (Page)this;
                    //throw new Exception("debug:test");
                    //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                    cds.RegisterApp("ACUITY", urlprefix(), role1, username1, ref mp, "");
                }
            }
            else
            {
                String username = "NULL";
                if (Session["TP1Username"] != null)
                {
                    username = Session["TP1Username"].ToString();
                }

                String role = "NULL";
                if (Session["TP1Role"] != null)
                {
                    role = Session["TP1Role"].ToString();
                }

                //throw new Exception("debug: TP1Role=" + role + ", TP1Username=" + username);
                Response.Redirect("login.aspx?url=DashboardAsync.aspx&inframe=" + Request.QueryString["inframe"].ToString());
            }

        }

        /*
        if (!Page.ClientScript.IsClientScriptBlockRegistered("importerversion")
        {
            String jv = "<script type=\"text/javascript\">";
            jv += "var ImporterVersion='" + CONFMGR.AppSettings(urlprefix() + "ImporterVersion"].ToString() + "';";

        }
         * */
        /*
                If Not Page.ClientScript.IsClientScriptBlockRegistered("themevar") Then
            jv = "<script type=""text/javascript"">" & R
            jv &= "var pageTheme='" & Page.Theme & "';" & R
            jv &= "</script>" & R
            Page.ClientScript.RegisterClientScriptBlock(Me.GetType, "themevar", jv)
        End If
         * */


    }
}
