$(document).ready(function(){
   let refUrl = "myTeamManagement.aspx";
   let params = appLib.getallparams()

   if(params != null && params != "")
   {
      refUrl += "?" + params.toString();
   }
   $("#lnkMyTeamManagement").attr("href", refUrl);
});