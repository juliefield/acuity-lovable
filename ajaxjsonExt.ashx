<%@ WebHandler Language="C#" Class="ajaxjsonExt" %>

//NOTE: This handler is DEPRECATED - had has been renamed to vcHandler.ashx

using System;
using System.Collections.Generic;
using System.Web;
using System.Xml;
using System.Net;
using System.Text;
using System.Data;
using jglib;
using dkslib;
using lib.cslib.userprofile;
using lib.cslib.flex;
using lib.cslib.selfserv;

//TODO: There are some apostrophes that cause it to crash (noticed on vrt insert).  Use db.reap on all.
//TODO: This is the C# Data Handler.  The VB one is called vbHandler, and the js one is called jsHandler.
//           The name of this one should be vcHandler, and a duplicate has been made for this.
//           They can be used interchangeably for a while.

public class ajaxjsonExt : IHttpHandler
{

    String _connection, _utilities, _connection1;
    ConfMgr CONFMGR = new ConfMgr();

    public void ProcessRequest(HttpContext context)
    {
        context.Response.AddHeader("Access-Control-Allow-Origin", "*");
        context.Response.AddHeader("Access-Control-Allow-Methods", "GET, POST");
        context.Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept");
        
        
        _connection1 = CONFMGR.ConnectionStrings(urlprefix() + "Connection").ConnectionString; // +";Provider=SQLOLEDB;";
        _connection = CONFMGR.ConnectionStrings(urlprefix() + "Connection20").ConnectionString; // +";Provider=SQLOLEDB;";
        _utilities = CONFMGR.ConnectionStrings(urlprefix() + "Utilities").ConnectionString; // +";Provider=SQLOLEDB;";

        System.Collections.Specialized.NameValueCollection q = context.Request.QueryString;
        //If no members in the querystring, assume it's a POST.
        if (q.Count == 0) q = context.Request.Form;
        
        commonService cs = new commonService();
        cs._formrouting = new commonService.fr[] {
            new commonService.fr("contactform","Acuity 2.0 Website", "Contact Submission from Acuity 2.0 Website", "jeffgack2@gmail.com"),
            new commonService.fr("workorder","Acuity 2.0 Website", "Work Order Submission from Acuity 2.0 Website", "jeffgack2@gmail.com", true),
        };
        cs._authenticating = true;
        cs._connectionstring = _connection;
        cs._connectionstring1 = _connection1;
        cs._ip = context.Request.UserHostAddress;
        cs._preclient = CONFMGR.AppSettings(urlprefix() + "ClientID_V2").ToString();
        cs._urlprefix = urlprefix();

        cs._subdomain = "notfound";
        String p = HttpContext.Current.Request.Url.Host + HttpContext.Current.Request.RawUrl;
        int e = p.ToLower().IndexOf(".");
        if (e >= 0)
        {
            p = p.ToLower().Substring(0, e);
            string[] s = p.Split('/');
            p = s[s.Length - 1];
            cs._subdomain = p + ".";
        }
        


        Boolean authenticated = false;
        /*try
        {
        */
        if (q["acuitytoken"] == null || q["acuitytoken"] != "F7D9DFCB832B77EBF91A256823999")
        {
            cs._msg = "Token not found or invalid.";
        }
        else if (!cs.serviceRequest(q, ref authenticated))
        {
            if (authenticated)
            {
                Boolean found = false;
                
                if (q["lib"] == "userprofile")
                {
                    found = lib.cslib.userprofile.UserprofileLib.Process(cs._user, q, ref cs.json);
                }
                else if (q["lib"] == "flex")
                {
                    found = lib.cslib.flex.FlexLib.Process(cs._user, q, ref cs.json);
                }
                else if ((q["lib"] == "selfserv") || (q["lib"] == "selfserve"))
                {
                    found = lib.cslib.selfserv.SelfservLib.Process(cs._user, q, ref cs.json);
                }
                if (!found)
                {
                    using (DbBaseSql db = new DbBaseSql(_connection, ""))
                    {
                        if (cs.cmd("clientstats"))
                        {
                            cs._useoldjsonstring = true;
                            using (DataTable dtcocnt = db.GetDataTable("select count(*) from co where client='" + cs._user.client + "'"))
                            {
                                using (DataTable dtpcocnt = db.GetDataTable("select count(*) from pco where client='" + cs._user.client + "'"))
                                {
                                    cs.bld += cs.cma(0) + "\"CO Count\":\"" + dtcocnt.Rows[0].ItemArray[0].ToString() + "\"";
                                    cs.bld += ",\"PCO Count\":\"" + dtpcocnt.Rows[0].ItemArray[0].ToString() + "\"";
                                }
                            }
                        }
                        else
                        {
                            cs._msg = "Command Not Recognized";
                        }
                    }
                }
            }
        }
        if ((cs._msg != "") && (q["lib"] == "selfserve") && ((q["cmd"] == "getUrlRedirection") || (q["cmd"] == "saveClientIntegrationInfo"))) //Not authenticated is OK
        {
            cs._msg = "";
            Boolean found = lib.cslib.selfserv.SelfservLib.Process(cs._user, q, ref cs.json);
        }
        if (cs.cmd("help"))
        {
            cs._msg = "";
            List<dkslib.KV> app = new List<dkslib.KV>();// { };

            if (authenticated)
            {
                List<dkslib.KV> clientsettings = new List<dkslib.KV>();// { };
                clientsettings.Add(new dkslib.KV("cmd", "clientsettings"));
                clientsettings.Add(new dkslib.KV("auth", "Authorization Object - passed automatically."));
                clientsettings.Add(new dkslib.KV("EXAMPLE", "{ cmd:'clientsettings' }"));
                app.Add(new dkslib.KV("Get Client Settings", clientsettings));
            }

            cs.json.Insert(0, new dkslib.KV("App", app));

            //login
            //clientsettings
            //etc

        }

        /*}
        catch (System.Exception e)
        {
            cs._msg = "System Error: " + e.Message;
        }
        */
        cs.WriteToContext(context);
    }

    public bool IsReusable
    {
        get
        {
            return false;
        }
    }

    private String urlprefix()
    {
        SitePage sp = new SitePage();
        String test = sp.urlprefix();
        return test;
    }
}


