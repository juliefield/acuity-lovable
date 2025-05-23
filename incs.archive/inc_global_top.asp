<% @Language=VBScript %><!-- METADATA TYPE="typelib"
		FILE="C:\Program Files\Common Files\System\ado\msado15.dll" -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">

<% 'Vars used for inc communications (declared explicitly for documentation purposes.


dim siteRoot
siteAddress = "www.jeffgack.com"
siteRoot = "http://" & siteAddress 'no trailing slash

dim strtitle
dim strdesc
dim strkeywords

dim strmenuname(20)
dim strmenulink(20)
dim fmenuselected(20)
dim fmenudevelop(20)

dim imenucount
dim im
dim imenudefault
imenudefault= 0
dim fplaceloginmenu
fplaceloginmenu = 1

dim strpromptname(20)
dim strpromptlink(20)
dim strprompttip(20)
dim fpromptselected(20)
dim ipromptcount
dim ipromptdefault
ipromptdefault= 1

dim fplacepromptmenu

' create an instance of the Browser Capabilities component
Set browserdetect = Server.CreateObject("MSWC.BrowserType")

' find some properties of the browser being used to view this page
BI_browser=browserdetect.Browser
BI_version=browserdetect.Version
BI_majorver=browserdetect.Majorver
BI_minorver=browserdetect.Minorver
BI_platform=browserdetect.Platform
BI_frames=browserdetect.Frames
BI_tables=browserdetect.Tables
BI_cookies=browserdetect.Cookies
BI_javascript=browserdetect.JavaScript

GLOBAL_vercode_printer = "thunder"

%>

