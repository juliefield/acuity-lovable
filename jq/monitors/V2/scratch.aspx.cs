using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Data;
using jglib;

public partial class _scratch : SitePage
{
    String _connection = "";
    String _connection1 = "";
    Boolean isnew = false;

    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Monitors";
        _connection1 = CONFMGR.ConnectionStrings(urlprefix() + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(urlprefix() + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
    }

    protected void Page_PreInit(object sender, EventArgs e)
    {
    }

    protected void Page_Load(object sender, EventArgs e)
    {
        Page.Header.DataBind();
    }

    /*
    protected void submitme_click(object sender, EventArgs e)
    {
    }

    protected void deleteme_click(object sender, EventArgs e)
    {
    }

    protected void closeme_click(object sender, EventArgs e)
    {
    }
    */
}