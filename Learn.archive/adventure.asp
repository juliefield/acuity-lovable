<% @Language=VBScript %>
<%
dim r(100)
if request("gotoroom") = "" then
  toroom="Living Room"
else
  toroom = request("toroom")
end if
if toroom = "Living Room" then
  r(1)="Back Porch"
  r(2)="Foot of Stairs"
  r(3)="Kitchen"
elseif toroom="Back Porch" then
  r(1)="Living Room"
elseif toroom="Foot of Stairs" then
  r(1)="Living Room"
  r(2)="Front Porch"
elseif toroom="Kitchen" then
  r(1)="Living Room"
elseif toroom="Front Porch" then
  r(1)="Foot of Stairs"
end if
%>
<html>
  <head><title>Adventure</title></head>
  <body>
    Your Location: <b><%=toroom%></b>
    <form id="adventure" action="adventure.asp" method="post">
      <input type="hidden" name="fromroom" value="<%=toroom%>" />
      <select size="3" name="toroom">
        <% i=1
        while r(i)<>"" %>
	      <option
	      <% if i=1 then %>
	      	selected
	      <% end if %>
	      value="<%=r(i)%>"><%=r(i)%></option>
	      <% i = i + 1
	    wend %>
      </select>
      <input type="submit" name="gotoroom" value="Go" />
    </form>
  </body>
</html>