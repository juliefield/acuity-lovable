<% @Language=VBScript %>
<html>
  <head><title>IO</title></head>
  <body>
    <% if request.form("submitbutton") <> "" then %>
      You Typed In: <%=request.form("num1")%><br />
    <% end if %>
    <form id="test" action="io.asp" method="post">
      Type In Something: <input type="text" name="num1" size="5" /><br />
      <input type="submit" name="submitbutton" value="Submit" />
    </form>
  </body>
</html>