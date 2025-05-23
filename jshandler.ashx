<%@ WebHandler Language="JScript" Class="jshandler" %>
import System;
import System.Collections.Generic;
import System.Web;
import System.Web.Caching;
import GScript;
import dkslib;

/*
This is a prototype SERVER-SIDE JSCRIPT handler.
It works great and would be the best server-side language for an all-json API.
BUT - There are some problems.

1) I don't think you can make a class library for it (at least not in visual studio).
You can access .NET class libraries written in other languages, but
I would need to make a library of jscript classes/modules for this to be worthwhile.
THIS HAS BEEN SOLVED - YOU CAN MAKE A JSCRIPT CLASS LIBRARY.

2) There is no debugger, at least not in visual studio.  No intellisense either.

If I could make a class library, I might choose this option - debugger or not.

It looks like I might be able to make a class library by compiling the jscript into a .dll using a command line compiler.
Does this possibility compel me to try this?

PROS
    Would build json to output json - easier logic.
    Easier to read and understand.
    Would discourage/lock out traditional .NET development.
    Sets up for more portable development - server-side javascript works on many other platforms.

CONS
    JScript may die in the future - few are using it, it seems.
    No debugger may get annoying (but I do have debugging methods).


*/


public class jshandler implements IHttpHandler{
    // Override the ProcessRequest method.

    var CONFMGR = new ConfMgr();

    var wh = new WebHandler();

    function IHttpHandler.ProcessRequest(context : HttpContext){

        if (context.Request.QueryString.Count > 0) {
            //Assume it's a GET
            wh.QueryString = context.Request.QueryString;
        }
        else {
            //Assume it's a POST
            wh.QueryString = context.Request.Form;
        }

        function urlprefix(BypassParam) {
          if (!BypassParam) {
             var par = null;
             if (context.Request.QueryString.Count > 0) {
               par = context.Request.QueryString["prefix"];
             }
             else {
               //Assume it's a POST
               par = context.Request.Form["prefix"];
             }
             if (par) {
               if (par != "") {
                 return par + ".";
               }
            }
          }
          var p =  HttpContext.Current.Request.Url.Host + HttpContext.Current.Request.RawUrl;
          var ix = p.indexOf("." + CONFMGR.AppSettings("urlsuffix").ToString());
          if (ix >= 0) {
            p = p.substr(0, ix);
            var ps = p.split("/");
            p = ps[ps.length - 1];
            return p + ".";
          }
          return "";
        }

        var up = urlprefix();
        wh.Connection1 = CONFMGR.ConnectionStrings(up + "Connection").ConnectionString;
        wh.Connection = CONFMGR.ConnectionStrings(up + "Connection20").ConnectionString;
        wh.ConnectionUtilities = CONFMGR.ConnectionStrings(up + "Utilities").ConnectionString;
        wh.RootPath = System.Web.HttpContext.Current.Server.MapPath("~");        
        wh.Urlprefix = up;
        wh.Rawprefix = urlprefix(true);        


        wh.Ip = context.Request.UserHostAddress;
        wh.ClientNumber = CONFMGR.AppSettings(up + "ClientNumber");
        wh.Preclient = CONFMGR.AppSettings(up + "ClientID_V2");
        wh.ImporterVersion  = CONFMGR.AppSettings(up + "ImporterVersion");
        if (context.Request.Files.Count > 0) {
            wh.File = context.Request.Files[context.Request.Files.Count - 1];
        }
        else {
            wh.File = null;
        }

        //Caching must be done at this level

        var cachefound = false;
        var cachelook = false;


        if (false) {
            if (context.Request.QueryString["cmd"] == "getstats") { //Should test for lib="fan" as well, but I don't want to bog this down.
                var val = HttpRuntime.Cache[HttpContext.Current.Request.RawUrl];
                if (val != null) {
                    cachefound = true;
                    context.Response.Write(val);
                    context.Response.ContentType = "text/plain";
                }
                else {
                    cachelook = true;
                }
            }
        }

        if (!cachefound) {
            var obj = wh.PreProcess();
            if (exists(obj.cmd)) {
                if (obj.cmd == "THROW") {
                    throw obj.msg;
                }
            }
            if (typeof obj.msg != 'undefined') {
                if (obj.msg != "") obj.errormessage=true;
            }
            obj.ServiceMark = "JScript";

            //Test Object
            /*
            var obj = {
                test: 0,
                another: "string",
                withquotes: 'The "very" hungry fox',
                testobject: { p: 1, q:2,r:3 },
                firstarray: [1,2,{myobj:"myobjstring"}],
                convertme: function(pwd) { return pwd + "ay"; },
                yetanother: 4.3
            };
            */

            if (!obj.mime) {
                var jo = new JsonIO();
                jo.Format = context.Request.QueryString["fmt"];
                if (jo.Format) context.Response.ContentType = "text/html";
                else context.Response.ContentType = "text/plain";
                if (cachelook) {
                    HttpRuntime.Cache[HttpContext.Current.Request.RawUrl] = jo.Write(obj);
                }
                context.Response.Write(jo.Write(obj));
            }
        }
    }

    // Override the IsReusable property.
    function get IHttpHandler.IsReusable() : Boolean{
        return true
    }

    function exists(me) {
        return (typeof me != 'undefined');
    }
}
