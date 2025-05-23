1. The SDK files are located in the jqwidgets directory
 
 In general you need to use files from this directory only.

 Files list & description:

  Files required in all projects using the SDK:

  jqxcore.js: Core jQWidgets framework

  Stylesheet files. Include at least one stylesheet Theme file and the images folder:

  styles/jqx.base.css: Stylesheet for the base Theme. The jqx.base.css file should be always included in your project.
  
  styles/jqx.classic.css: Stylesheet for the Classic Theme
  styles/jqx.darkblue.css: Stylesheet for the DarkBlue Theme
  styles/jqx.energyblue.css: Stylesheet for the EnergyBlue Theme
  styles/jqx.shinyblack.css: Stylesheet for the ShinyBlack Theme
  styles/jqx.summer.css: Stylesheet for the Summer Theme

  styles/images: contains images referenced in the stylesheet files
  
  Files for individual widgets and plug-ins. Include depending on project needs:
	
  jqxdata.js: Data Source plug-in  
  jqxgrid.js: Grid widget
  jqxgrid.sort.js: Grid Sort plug-in
  jqxgrid.filter.js: Grid Filter plug-in
  jqxgrid.grouping.js: Grid Grouping plug-in
  jqxgrid.selection.js: Grid Selection plug-in
  jqxgrid.columnsresize.js: Grid Columns Resize plug-in
  jqxgrid.pager.js: Grid paging plug-in
  jqxgrid.edit.js: Grid edit plug-in
  jqxchart.js: Chart widget
  jqxbutton.js: Button, RepeatButton, SubmitButton & ToggleButton widgets
  jqxcalendar.js: impements Calendar widget
  jqxdatetimeinput.js: impements DateTimeInput widget
  jqxdockpanel.js: DockPanel widget
  jqxdropdownlist.js: DropDownList widget
  jqxcombobox.js: ComboBox widget
  jqxtabs.js: Tabs widget
  jqxtree.js: Tree widget
  jqxcheckbox.js: CheckBox widget   
  jqxradiobutton.js: RadioButton widget   
  jqxexpander.js: Expander widget
  jqxlistbox.js: ListBox widget
  jqxmaskedinput.js: Masked TextBox widget
  jqxmenu.js: Menu widget
  jqxnavigationbar.js: NavigationBar widget
  jqxnumberinput.js: NumberInput TextBox widget
  jqxpanel.js: Panel widget
  jqxpopup.js: impements PopUp widget
  jqxprogressbar.js: ProgressBar widget
  jqxscrollbar.js: ScrollBar widget
  jqxtooltip.js: ToolTip widget
  jqxrating.js: Rating widget
  jqxwindow.js: Window widget
  jqxslider.js: Slider widget
  jqxsplitter.js: Splitter widget
  jqxdocking.js Docking widget
  jqxdragdrop.js DragDrop plug-in
  jqxvalidator.js Validator plug-in

  File for all widgets and plug-ins:

  jqx-all.js

2.Examples

  The index.htm file starts the demo/examples browser
  Individual widget examples are located in the /demos directory
  Any examples that use Ajax need to be on a web server in order to work correctly.

3.Documentation

  Browse the documentation and examples through the index.htm file
  Individual documentation files are located in the /documentation directory
   
4.Other files

  The /scripts, /images, /styles folders contain the jquery library and
  other files used by the demo only.

5.Unit tests
  
  All jQWidget unit tests are located in the tests directory.
  You can use the unit tests if you're planning to modify some of the widgets.

6.License & Purchase

   For more information regarding the licensing, please visit: http://www.jqwidgets.com/license

