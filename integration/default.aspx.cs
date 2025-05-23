using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using jglib;

public partial class IntegrationDefault : Page {

    public string DevBumper = DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Second.ToString();

    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Acuity3";
        
    }
    protected void Page_Load(object sender, EventArgs e)
    {
    }

}
