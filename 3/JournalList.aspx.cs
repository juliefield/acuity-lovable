using System;
using System.Configuration;
using System.Web;
using System.Web.UI;
using jglib;

public partial class three_JournalList : SitePage {

    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "AcuityV3";
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
    protected void Page_Load(object sender, EventArgs e) {
//                    Session("TP1Username") = Request.QueryString("username")
//            Session("TP1Role") = Request.QueryString("role").ToString

        if ((Session["TP1Role"] != null) && (Session["TP1Username"] != null))
        {
            using (VirtualStorage cds = new VirtualStorage())
            {
                //DONE: bodyid needs replaced with the logged-in user_id (need the user id server-side).
                //DONE: projectnumber needs replaced with ACUITY.ers  (need the client number server-side).
                //DONE: the page name needs replaced with the role of the currently logged in person (need the role server-side).
                //OLD: String bodyid = urlprefix() + "." + Session["TP1Username"].ToString();
                Page mp = (Page)this;
                //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
            }
        }
        else
        {
            Response.Redirect("login.aspx?url=DashboardAsync.aspx");
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
