using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using jglib;


public partial class _3_AgameFlex :  SitePage
{
    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "AcuityV3";

        base.OnPreInit(e);
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if ((Session["TP1Role"] != null) && (Session["TP1Username"] != null))
        {
            using (VirtualStorage cds = new VirtualStorage())
            {
                Page mp = (Page)this;
                cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
            }
        }
        else
        {
            Response.Redirect("login.aspx?url=AgameFlex.aspx");
        }

    }
}