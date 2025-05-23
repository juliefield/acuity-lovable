using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class jq_testvcs : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {


    }
    protected void ddlTest_OnSelectedIndexChanged(object sender, EventArgs e) 
    {
        divPrompt.InnerHtml = "<p>Your selection is: " + ddlTest.SelectedItem.Text + "</p>";
    }
}