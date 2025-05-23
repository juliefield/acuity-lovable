function WriteAdminStatus(message)
{
    
    var statusMessage = $(".admin-status-output").html();
    statusMessage = message + "<br />" + statusMessage;

    $(".admin-status-output").html(statusMessage);

}

function WriteUserStatus(message, displayForTiming)
{
    $(".user-status").html(message);
    ShowUserStatus(displayForTiming);

}
function ShowUserStatus(displayForTiming) {
    var currentDisplayStatus = $(".user-status").css("display");

    if (displayForTiming == null) {
        displayForTiming = 60000 //1 minute is default for displaying data. 
    }

    if (currentDisplayStatus == "none") {
        $(".user-status").show();
        window.setTimeout(function() {
            HideItem(".user-status");
        }, displayForTiming);
    }
};
function HideUserStatus() {
    var currentDisplayStatus = $(".user-status").css("display");

    if (currentDisplayStatus != "none") {
        $(".user-status").hide();
    }
};
function HideAll()
{
    $("[class*='editor-holder']").hide();
}

function ShowItem(itemToShow)
{
    $(itemToShow).show();
}
function HideItem(itemToShow)
{
    $(itemToShow).hide();
}

function toDate(value)
{
    if(value != null)
    {
        return new Date(value).toLocaleDateString("en-US");
    }
    else
    {
        return null;
    }
}