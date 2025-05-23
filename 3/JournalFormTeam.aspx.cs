using System;
using System.Configuration;
using System.Web;
using System.Web.UI;
using jglib;

public partial class three_JournalFormTeam : SitePage {

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
                Page mp = (Page)this;
                //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
            }
        }
        else
        {
            //Don't redirect, but register the content as a CSR
            //Response.Redirect("login.aspx?url=DashboardAsync.aspx");
            using (VirtualStorage cds = new VirtualStorage())
            {
                Page mp = (Page)this;
                //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                cds.RegisterApp("ACUITY", urlprefix(), "CSR", "TESTPERSON", ref mp, "");
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
