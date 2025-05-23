using System;
using System.Web;
using System.Web.UI;
using jglib;

public partial class jq_debugqtip : SitePage {

    protected override void OnPreInit(EventArgs e)
    {
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
         * */
        /*
         * else if (HttpContext.Current.Request.Url.Host.ToString().ToLower().IndexOf("acuity") >= 0)
        {
            Page.Theme = "Acuity";
            Session["theme"] = Page.Theme;
        }
         * */
    }
    protected void Page_Load(object sender, EventArgs e) {
        /*
        if (false) //turn off for now
        {
            using (VirtualStorage cds = new VirtualStorage()) {
                String bodyid = (!string.IsNullOrEmpty(Request.QueryString["cid"])) ? Request.QueryString["cid"] : "";
                Page mp = (Page)this;
                cds.Register(ref mp , bodyid, false); //true loads jquery
            }
        }
        */
    }
}
