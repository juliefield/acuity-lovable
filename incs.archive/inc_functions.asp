<%
Function withap(strField)
	for i76=1 to len(strField)
		if (mid(strField,i76,1)="~") then
			strTemp = ""
			if (i76 > 1) then
				strTemp = left(strField,i76-1)
			end if
			strTemp = strTemp & "'"
			if (i76 < len(strField)) then
				strTemp = strTemp & right(strField,len(strField)-i76)
			end if
			strField = strTemp
		end if
	next
	withap = strField
End Function

Function noap(strField)
	for i75 =1 to len(strField)
		if (mid(strField,i75,1)="'") then
			strTemp = ""
			if (i75 > 1) then
				strTemp = left(strField,i75 - 1)
			end if
			strTemp = strTemp & "~"
			if (i75 < len(strField)) then
				strTemp = strTemp & right(strField,len(strField)-i75)
			end if
			strField = strTemp
		end if
	next
	noap = strField
End Function
%>