let userSelectedTheme = "default";
$(document).ready(function () {
   HideAll();
   HandlePageTabs();
   LoadUserThemeBackground();   
   //$("#userPrizeCatalogTab_fullCatalog").click();
});
function HandlePageTabs() {
   //let userRole = $.cookie("TP1Role");
   $("[id^='userPrizeCatalogTab_'").off("click").on("click", function(){
      HandlePrizeCatalogTabClick(this.id);
   });

}
function HandlePrizeCatalogTabClick(tabId)
{
   WriteLoadingMessage("Loading information...");
   ShowLoadingMessage();
   window.setTimeout(function(){
      $("[id^='userPrizeCatalogTab_'").removeClass("active");
      $(`#${tabId}`).addClass("active");
      let tabOption = tabId.split("_")[1];
      HideAllTabContents();
      let forceRefresh = false;
      switch(tabOption.toLowerCase())
      {
         case "fullCatalog".toLowerCase():
            forceLoad = $("#userPrizeCatalogDisplayHolder_Content").is(":visible");
            ShowPrizeCatalogDisplay();
            ko.postbox.publish("userPrizeCatalogLoad", !forceLoad);
            break;
         case "userPrizes".toLowerCase():
            forceLoad = $("#userPrizeEarnedDisplayHolder_Content").is(":visible");
            ShowUserPrizesEarnedHolder();
            ko.postbox.publish("userRedeemedPrizesLoad", !forceLoad);
            break;
         case "userLedger".toLowerCase():
            forceLoad = $("#userPrizeRedeemLedgerHolder_Content").is(":visible");
            ShowUserRedemptionLedgerHolder();
            ko.postbox.publish("userPrizesRedeemedLedgerLoad", !forceLoad);
            break;
         case "catalogAdmin".toLowerCase():
            forceLoad = $("#userPrizeCatalogAdminHolder_Content").is(":visible");
            ShowUserPrizeCatalogAdminHolder();
            ko.postbox.publish("userPrizeCatalogAdminLoad", !forceLoad);
            break;
         case "tangoCard".toLowerCase():
            forceLoad = $("#userTangoCardHolder_Content").is(":visible");
            ShowTangoCardHolder();
            ko.postbox.publish("tangoCardLoad", !forceLoad);
            break;
         default:
            alert(`Tab functionality for ${tabOption} not found.`);
            console.log(`Tab functionality for ${tabOption} not found.`);
            break;
      }
   }, 500);
   
}
function LoadUserThemeBackground(themeToLoad)
{
   if(themeToLoad != null)
   {
      userSelectedTheme = themeToLoad;
   }
   let themeBackground = `../../../../applib/css/images/themes/${userSelectedTheme}/Background.jpg`;
   $("#userThemeBackgroundHolder").css("background-image", `url('${themeBackground}?rn=${new Date().getTime()}')`);
}
function HideAll()
{
   HideLoadingMessage();
   HideAllTabContents();
}

function HideAllTabContents()
{
   HidePrizeCatalogDisplay();
   HideUserPrizesEarnedHolder();
   HideUserRedemptionLedgerHolder();
   HideUserPrizeCatalogAdminHolder();
   HideTangoCardHolder();
}

function HidePrizeCatalogDisplay()
{
   $("#userPrizeCatalogDisplayHolder_Content").hide();
}
function ShowPrizeCatalogDisplay()
{
   $("#userPrizeCatalogDisplayHolder_Content").show();   
}
function HideUserPrizesEarnedHolder()
{
   $("#userPrizeEarnedDisplayHolder_Content").hide();
}
function ShowUserPrizesEarnedHolder()
{
   $("#userPrizeEarnedDisplayHolder_Content").show();
}
function HideUserRedemptionLedgerHolder()
{
   $("#userPrizeRedeemLedgerHolder_Content").hide();
}
function ShowUserRedemptionLedgerHolder()
{
   $("#userPrizeRedeemLedgerHolder_Content").show();
}
function HideUserPrizeCatalogAdminHolder()
{
   $("#userPrizeCatalogAdminHolder_Content").hide();
}
function ShowUserPrizeCatalogAdminHolder()
{
   $("#userPrizeCatalogAdminHolder_Content").show();
}
function HideTangoCardHolder()
{
   $("#userTangoCardHolder_Content").hide();
}
function ShowTangoCardHolder()
{
   $("#userTangoCardHolder_Content").show();
}
function HideLoadingMessage()
{
   $("#userPrizeCatalogDisplayHolder_LoadingMessage").hide();
}
function ShowLoadingMessage()
{
   $("#userPrizeCatalogDisplayHolder_LoadingMessage").show();
}
function WriteLoadingMessage(messageToWrite)
{
   $("#userMessageTextHolder").empty();
   $("#userMessageTextHolder").append(messageToWrite);   
}
ko.postbox.subscribe("userPrizeThemeChange", function (newThemeName) {
   userSelectedTheme = newThemeName;
   LoadUserThemeBackground(newThemeName);
});

ko.postbox.subscribe("userPrizeWidgetLoadComplete", function(){   
   HideLoadingMessage();   
});
