using System;
using System.Web.UI;
using jglib;

public partial class _SCDefault : AuthorizedPage {
    protected void Page_Load(object sender, EventArgs e) {
        using (VirtualStorage cds = new VirtualStorage()) {
            String bodyid = (!string.IsNullOrEmpty(Request.QueryString["cid"])) ? Request.QueryString["cid"] : "";
            Page mp = (Page)this;
            cds.Register(ref mp , bodyid, false); //true loads jquery
        }
    }
}
