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
using System.Data;
using jglib;


public partial class _ReportEditor : SitePage {

    protected override void OnPreInit(EventArgs e)
    {
        Page.Theme = "Acuity3";
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
                if (Request.QueryString["panelcid"] != null)
                {
                    if (Request.QueryString["panelcid"].ToString() != "")
                    {
                        Page mp = (Page)this;
                        //OLD: cds.Register(ref mp, bodyid, false, "", Session["TP1Role"].ToString(), "ACUITY." + urlprefix()); //true loads jquery
                        //TODO: RESTORE THIS: cds.RegisterApp("ACUITY", urlprefix(), Session["TP1Role"].ToString(), Session["TP1Username"].ToString(), ref mp, "");
                        cds.Register(ref mp, Request.QueryString["panelcid"].ToString(), false, "", "", "ACUITY"); //Find best value for "Report.test"
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
