using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using jglib;
using System;
using System.Text;
using System.IO;
using System.Security.Cryptography;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Data;
using jglib;


public partial class _ReportEditorQuiz : SitePage {
    String _connection = "";
    String _connection1 = "";
    String _client = "0";
    HtmlGenericControl bodyDiv;
    Boolean loadAI = false;

    public string DevBumper = DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + DateTime.Now.Hour.ToString() + DateTime.Now.Second.ToString();
    
    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Acuity3";
        _connection1 = CONFMGR.ConnectionStrings(urlprefix() + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(urlprefix() + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
        _client = CONFMGR.AppSettings(urlprefix() + "client");
    }
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            using (VirtualStorage cds = new VirtualStorage())
            {
                //DONE: bodyid needs replaced with the logged-in user_id (need the user id server-side).
                //DONE: projectnumber needs replaced with ACUITY.ers  (need the client number server-side).
                //DONE: the page name needs replaced with the role of the currently logged in person (need the role server-side).
                //OLD: String bodyid = urlprefix() + "." + Session["TP1Username"].ToString();
                String panelcid = "";

                if ((Request.QueryString["uid"] != null) && (Request.QueryString["uid"] != ""))
                {
                    String uid = Request.QueryString["uid"].ToString();
                    using (DbBaseSql db1 = new DbBaseSql(_connection1, ""))
                    {
                        using (DbBaseSql db = new DbBaseSql(_connection, ""))
                        {

                            using (DataTable dt = db.GetDataTable("select field,val from PRT where guid='" + uid + "' order by field,remaining desc"))
                            {
                                String vp = "";
                                foreach (DataRow row in dt.Rows)
                                {
                                    switch (row["field"].ToString())
                                    {
                                        case "panelcid":
                                            lblPanelcid.Text = row["val"].ToString().Split('?')[0];
                                            panelcid = lblPanelcid.Text;
                                            break;
                                        case "viewparams":
                                            vp = vp + row["val"].ToString();
                                            break;
                                        case "title":
                                            lblTitle.Text = row["val"].ToString();
                                            break;
                                        case "creator":
                                            lblCreator.Text = row["val"].ToString();
                                            break;
                                        case "sup":
                                            //lblSupervisor.Text = row["val"].ToString();
                                            break;
                                        case "mode":
                                            //isnew = row["val"].ToString() == "new";
                                            break;
                                        case "viewer":
                                            //lblViewer.Text = row["val"].ToString();
                                            break;
                                        case "MONITOR_ID":
                                            //lblMonitorId.Text = row["val"].ToString();
                                            break;
                                        case "sqfcode":
                                            //lblSqfcode.Text = row["val"].ToString();
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                lblViewparams.Text = vp;

                            }
                        }
                    }
                }
                else if (Request.QueryString["panelcid"] != null)
                {
                    panelcid = Request.QueryString["panelcid"].ToString();
                }
                if (panelcid != "")
                {
                    Page mp = (Page)this;
                    //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                    //TODO: RESTORE THIS: cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
                    cds.Register(ref mp, panelcid, false, "", "", "ACUITY", urlprefix()); //Find best value for "Report.test"
                    bodyDiv = (HtmlGenericControl)FindControl("Body1");
                    HtmlGenericControl htmlDiv = (HtmlGenericControl)FindControl("CDS_HTMLContent");
                    if ((htmlDiv != null) && (bodyDiv != null))
                    {
                        String srch = htmlDiv.InnerHtml;
                        if (srch.IndexOf("<ng-acuity-page-ai ") >= 0) loadAI = true;
                        if (loadAI)
                        {
                            int startPos = srch.IndexOf("<ng-acuity-page-ai ") + "<ng-acuity-page-ai ".Length;
                            int defPos = srch.IndexOf("prompts=\"", startPos) + "prompts=\"".Length;
                            int endPos = srch.IndexOf("\"", defPos);

                            string promptstring = srch.Substring(defPos, endPos - defPos);
                            MakeOrAssignControl(bodyDiv, "div", "aiPromptAnchor", promptstring);

                            //lblDebug.Text = "promptstring=" + promptstring;

                            string[] prompts = promptstring.Split(',');
                            foreach (string prompt in prompts)
                            {
                                MakeOrAssignControl(bodyDiv, "div", "CDSPROMPT_" + prompt.Split('|')[0] + "Content", "");
                                MakeOrAssignControl(bodyDiv, "label", "lblAI_" + prompt.Split('|')[0], "");
                            }
                        }
                        cds.Register(ref mp, "PROMPTS." + panelcid, false, "", "", "AI_PROMPTS", urlprefix(true).ToLower()); //PROMPTS.mycid
                    }

                    if (loadAI)
                    {
                        //TODO: I need to know what to key from in the ai_hstry chain (for monitors, it's simply monitor_id).

                    }

                }


            }

        }
    /* This is useless
	//private static string DecryptString(string InputText, string Password)
	//{
		RijndaelManaged  RijndaelCipher = new RijndaelManaged();
        byte[] Ciphertext = Encoding.ASCII.GetBytes("766D9A5273BDCAF1C2C84D032A5793E1AEC40F6FF1BA0749A1F2E4BD37A767E548320ED1EC7C6664E53BE140CD6D75923AAF0CC309385C125211AF204EBDDEC1");
        byte[] Key = Encoding.ASCII.GetBytes("AC341433624731C30E1F8D3381085E42");
        byte[] IV = Encoding.ASCII.GetBytes("D41B1C9C53F50023B09D2D8DD18F9EF8");
        byte[] Password = Encoding.ASCII.GetBytes("Albatros1");
		byte[] Salt = Encoding.ASCII.GetBytes("saltines");
        //Making of the key for decryption
		PasswordDeriveBytes SecretKey = new PasswordDeriveBytes(Password, Salt);
        //Creates a symmetric Rijndael decryptor object.
		ICryptoTransform Decryptor = RijndaelCipher.CreateDecryptor(Key,IV);
		MemoryStream  memoryStream = new MemoryStream(Ciphertext);
        //Defines the cryptographics stream for decryption.THe stream contains decrpted data
		CryptoStream  cryptoStream = new CryptoStream(memoryStream, Decryptor, CryptoStreamMode.Read);
		byte[] PlainText = new byte[Ciphertext.Length];
        int DecryptedCount = cryptoStream.Read(PlainText, 0, PlainText.Length);
		memoryStream.Close();
		cryptoStream.Close();
        //Converting to string
		string DecryptedData = Encoding.Unicode.GetString(PlainText, 0, DecryptedCount);
		//return DecryptedData;

	//}
    */
    }

}
