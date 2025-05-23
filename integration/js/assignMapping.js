function DoUrlAssignment()
{
   let orgId = a$.gup("oid") || "0000";   
   let clientPrefix = a$.gup("pid");
   if(clientPrefix != "" && orgId != "0000")
   {
      AssignUrlToClient(orgId, clientPrefix);
   }
   else
   {
      console.log("Unknown Prefix and organization id");
   }
}
function AssignUrlToClient(orgId, clientPrefix)
{
   //let fullUrl = "https://" + clientPrefix + ".acuityapmr.com";   

   let returnUrl = "";
   a$.ajax({
      type:"POST",
      service: "C#",
      CORS: true,
      async: false,
      data:{
         lib:"selfserve",
         cmd:"saveClientIntegrationInfo",
         id: orgId,
         pid: clientPrefix
      },
      dataType: "json",
      error: function(response){         
         console.log(response);
      },
      success: function(data){         
         returnUrl = data.clientUrl;
         return returnUrl;
      }
   });
   //}, fullUrl);

   
}
 $(document).ready(function(){
   DoUrlAssignment();
 });

