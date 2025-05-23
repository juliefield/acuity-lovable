using System;
using System.Configuration;
using System.Web;
using System.Web.UI;
using jglib;

public partial class jq_ReportTableGDS : SitePage {

    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Acuity3";
        Page.Theme = CONFMGR.AppSettings(urlprefix() + "theme").ToString();
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

        if (true) //turn ON for now
        {
            using (VirtualStorage cds = new VirtualStorage()) {
                String bodyid = (!string.IsNullOrEmpty(Request.QueryString["cid"])) ? Request.QueryString["cid"] : "";
                Page mp = (Page)this;
                cds.Register(ref mp , bodyid, false,"","",""); //true loads jquery
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
    /*
    private String url_BAD_prefix()
    {
        String p = HttpContext.Current.Request.Url.Host + HttpContext.Current.Request.RawUrl;
        int e = p.ToLower().IndexOf("." + CONFMGR.AppSettings("urlsuffix"].ToString());
        if (e >= 0)
        {
            p = p.ToLower().Substring(0, e);
            String[] s = p.Split('/');
            p = s[s.Length - 1];
            return p + ".";
        }
        else
        {
            return "";
        }
    }
     * */

}
