using System;
using System.Web.UI;


public partial class _PurePlay : SitePage {

    protected override void OnPreInit(EventArgs e)
    {
        //Page.Theme = "AcuityMV";
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        //Content Manager
        /*
        if (true)
        {
            using (VirtualStorage cds = new VirtualStorage())
            {
                String bodyid = (!string.IsNullOrEmpty(Request.QueryString["cid"])) ? Request.QueryString["cid"] : "";
                Page mp = (Page)this;
                cds.Register(ref mp, bodyid, false, ""); //true injects jquery (which we don't need here because it's loaded manually).
            }
        }
        */
    }
}
