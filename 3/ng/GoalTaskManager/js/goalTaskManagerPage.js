$(document).ready(function(){
   HandleButtons();
   HideAll();   
   let areaToLoad = a$.gup("area");

   if(areaToLoad == null || areaToLoad == "")
   {
      areaToLoad = "tasks";
   }
   if(areaToLoad == "goals")
   {
      ShowGoalContainer();
      $("#goalsTab").addClass("active");
      $("#tasksTab").removeClass("active");
   }
   else
   {
      ShowTaskContainer();
      $("#tasksTab").addClass("active");
      $("#goalsTab").removeClass("active");
   }
});

function HandleButtons()
{
   $("#goalsTab").off("click").on("click", function(){
      HideAll();
      ShowGoalContainer();
      $("#goalsTab").addClass("active");
      $("#tasksTab").removeClass("active");
   });
   $("#tasksTab").off("click").on("click", function(){
      HideAll();
      ShowTaskContainer();
      $("#tasksTab").addClass("active");
      $("#goalsTab").removeClass("active");
   });
}

function HideAll()
{
   HideGoalContainer();
   HideTaskContainer();
}
function ShowTaskContainer()
{
   $("#tasksContainer").show();
}
function HideTaskContainer()
{
   $("#tasksContainer").hide();
}
function ShowGoalContainer()
{
   $("#goalsContainer").show();  
}
function HideGoalContainer()
{
   $("#goalsContainer").hide();  
}
