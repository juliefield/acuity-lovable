const DEFAULT_LANG_TAG = "en-us";
const DEFAULT_ENV_TAG = "usw2.pure.cloud";
const DEFAULT_USER_TYPE = "unknown";
const APP_NAME = "AcuityIntegration";

const platformClient = require('platformClient');
const client = platformClient.ApiClient.instance;
client.setPersistSettings(true, APP_NAME);
client.setEnvironment(DEFAULT_ENV_TAG);

const usersApi = new platformClient.UsersApi();

var userInfo = null;

function PerformIntegrationCheck()
{
   let clientId = "64b7ad33-cf41-45ef-a633-60a4aeb3a533";
   let redirectUri = window.location.origin + window.location.pathname;   
   
   client.loginImplicitGrant(clientId, redirectUri)
      .then((data) => {
         return usersApi.getUsersMe({expand: ["organization"]});
      })
      .then((user)=>{
         return user?.organization?.id || "0";
      })
      .then((userOrgId)=>{
         let urlForRedirection = GetUrlForRedirection(userOrgId);
         return urlForRedirection;
      })
      .then((redirectUrl) =>{         
         RedirectToProperAcuityInstance(redirectUrl);
      })
      .catch((err) => {
         // Handle failure response
         console.log(err);
      });
}
function GetUrlForRedirection(orgId)
{
   let returnUrl = "";
   a$.ajax({
      type:"POST",
      service: "C#",
      async: false,
      data:{
         lib:"selfserve",
         cmd:"getUrlRedirection",
         id: orgId
      },
      dataType: "json",
      error: function(response){
         console.log(response);
      },
      success: function(data){
         if(data.errormessage == "true" || data.errormessage == true)
         {
            console.log(data.msg);
            alert(data.msg.replace("<br />", "\n"));
         }
         else
         {
            let urlFromDb = data.urlForRedirection;
            returnUrl = urlFromDb;
         }
      }
   });
   return returnUrl;
}
function RedirectToProperAcuityInstance(urlForRedirection)
{
   console.log(urlForRedirection);
   document.location.href = urlForRedirection;
}

$(document).ready(function(){
   PerformIntegrationCheck();   
});

