<% @Language=VBScript %>
<html>
  <head><title>Averaging</title></head>
  <body>
    <% if request.form("submitbutton") <> "" then %>
      The AVERAGE is: <%=( request.form("num1") - (-request.form("num2")) ) / 2.0%>
      <br /><br />
    <% end if %>
    Input 2 Numbers: <br />
    <form id="test" action="average.asp" method="post">
      Number 1: <input type="text" name="num1" size="5" /><br />
      Number 2: <input type="text" name="num2" size="5" /><br />
      <input type="submit" name="submitbutton" value="Find Average" />
    </form>
  </body>
</html>