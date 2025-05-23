<%@ Page Language="C#" AutoEventWireup="true" CodeFile="scratch.aspx.cs" ValidateRequest="false" Inherits="_scratch
" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title>Monitor Prototype</title>
    <meta name="viewport" content="width=device-width, minimum-scale=1, maximum-scale=1" />
    <script type="text/javascript" src='<%# ResolveUrl("~/lib/jquery/ui/js/jquery-1.6.2.min.js") %>'></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.cookie.js") %>" type="text/javascript"></script>
    <script src="<%# ResolveUrl("~/lib/jquery/plugins/jquery.dump.js") %>" type="text/javascript"></script>
    <script type="text/javascript" src="<%# ResolveUrl("~/applib/js/appLib-1.1.15.js") %>"></script>

    <style>
        .editshow 
        {
            display:none;
        }
    </style>
</head>
<body id="Body1" runat="server" style="overflow-y:scroll; width: 100%; font-size:20px;">

    <div style="padding:20px;">
        <div style="float:right;">
            <input class="editme" type="checkbox" value="On" /> Edit
        </div>
        <div>
            <p class="editable">
                Edit my text!
            </p>
        </div>
        <div>
            <select class="editable">
                <option>One</option>
                <option>Twp</option>
                <option>Three</option>
                <option>Four</option>
            </select>
        </div>

    </div>

<script type="text/javascript" language="javascript">
    $(document).ready(function () {
        var editme = false;
        var addtext = "--Add--";
        var removetext = "--Remove--";
        var carrotwidth = 24;
        $(".editme").bind("click", function () {
            editme = $(this).prop("checked");
            if (editme) {
                $(".editinject").remove();
            }
            $(".editable").each(function () {
                if (editme) {
                    if ($(this).prop("tagName") == "SELECT") {
                        if (addtext != "") $(this).append('<option class="editinject" value="' + addtext + '">' + addtext + '</option>');
                        if (removetext != "") $(this).append('<option class="editinject" value="' + removetext + '">' + removetext + '</option>');
                        var inputadd = '<input type="text" value="' + $(this).val() + '" class="editinject" style="position:absolute;top:0px;left:0px;height: ' + ($(this).height() - 4) + 'px; width: ' + ($(this).width() - carrotwidth) + 'px;" />';
                        $(this).parent().css("position", "relative").append(inputadd);
                    }
                    else {
                        $(this).attr("contenteditable", "true");
                    }
                }
                else {
                    if ($(this).prop("tagName") == "SELECT") {
                    }
                    else {
                        $(this).removeAttr("contenteditable");
                    }
                }
            });
            if (editme) {
                $(".editshow").show();
                $("select.editable").each(function () {
                    $(this).attr("previousVal", $(this).val());
                    var me = this;
                    $("input.editinject", $(this).parent()).each(function () {
                        $(this).val($(me).val());
                    });
                });
                $("input.editinject").unbind().bind("keyup", function () {
                    var me = this;
                    var isel = $("select", $(this).parent());
                    if ($(isel).attr("previousVal") == addtext) {
                        $(isel).append('<option selected="selected" value="' + $(me).val() + '">' + $(me).val() + '</option>');
                        $(isel).attr("previousVal", $(me).val());
                        $("option.editinject", isel).each(function () {
                            $(this).remove();
                        });
                        if (addtext != "") $(isel).append('<option class="editinject" value="' + addtext + '">' + addtext + '</option>');
                        if (removetext != "") $(isel).append('<option class="editinject" value="' + removetext + '">' + removetext + '</option>');
                    }
                    else {
                        $("option:selected", $(isel)).each(function () {
                            if ($(isel).attr("previousVal") == $(this).val()) {
                                $(this).val($(me).val());
                                $(this).text($(me).val());
                                $(isel).attr("previousVal", $(me).val());
                            }
                        });
                    }
                    $(me).width(($(isel).width() - carrotwidth) + "px");
                });
            }
            else $(".editshow").hide();
        });
        $("select.editable").bind("focus", function () {
            $(this).attr("previousVal", $(this).val());
        }).bind("change", function () {
            var me = this;
            if ((removetext != "") && ($(me).val() == removetext)) {
                $(me).val($(me).attr("previousVal"));
                $("option:selected", me).each(function () {
                    $(this).remove();
                });
                $(me).val(addtext);
                $(me).trigger("change");
                return;
            }
            //alert("debug:Previous=" + $(this).attr("previousVal") + ", current=" + $(this).val());
            $("input.editinject", $(me).parent()).each(function () {
                if ($(me).val() == addtext) {
                    $(this).val("");
                } else {
                    $(this).val($(me).val());
                }
            });

            $(this).attr("previousVal", $(this).val());
        });

    });
    function exists(me) {
        return (typeof me != 'undefined');
    }
</script>


</body>
</html>