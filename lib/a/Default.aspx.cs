using System;
using System.Web.UI;
using jglib;

public partial class app_Default : Page {

    protected void Page_Load(object sender, EventArgs e) {
        if (false) //turn off for now
        {
            using (VirtualStorage cds = new VirtualStorage()) {
                String bodyid = (!string.IsNullOrEmpty(Request.QueryString["cid"])) ? Request.QueryString["cid"] : "";
                Page mp = (Page)this;
                cds.Register(ref mp , bodyid, false); //true loads jquery
            }
        }
    }
}
