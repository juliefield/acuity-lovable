// let validQuestionIds = [
// 	"ED853909-F414-437F-B54C-247AFFC8F8F2",
// 	"3CDB7EC6-0250-4CB1-AE3B-2D78FA9729B1",
// 	"0697281E-AB9C-450A-A03B-8F89813F39CB",
// 	"5126E7D5-C28B-476D-A3D8-95C7E6AF9F03",
// 	"AA7D6E81-B40B-487B-A97C-C75AD04E63A4",
// 	"CB0A63F6-575B-44DA-88C5-E70200D0EBB2",
// 	"CB0A63F6-575B-44DA-88C5-E70200D0EBB3",
// 	"CB0A63F6-575B-44DA-88C5-E70200D0EBB4",
// 	"CB0A63F6-575B-44DA-88C5-E70200D0EBB5",
// ]
// let validResponseId = [
// 	"54E0D73D-9302-4F9A-BB9C-1DA250128E75",
// 	"894CA575-48D4-4E9C-B229-28D1CB6997E4",
// 	"1A82F1C7-33D1-48A5-8C62-6282013A4E69",
// 	"FEEE846D-B6F0-4F7F-AFBC-98281458A49A",
// 	"FEEE846D-B6F0-4F7F-AFBC-98281458A49B",
// 	"FEEE846D-B6F0-4F7F-AFBC-98281458A49C",
// 	"FEEE846D-B6F0-4F7F-AFBC-98281458A49D",
// 	"FEEE846D-B6F0-4F7F-AFBC-98281458A49E",
// 	"FEEE846D-B6F0-4F7F-AFBC-98281458A49F",
// 	"0F76D41C-9C5F-4010-A247-AEF74222E56F",
// 	"19F9A2F7-0DE2-487D-B197-C371255AFCC5",
// 	"288075EF-5478-4225-9A76-FB84AA51C56A",
// ];
let availableQuizes = [];
let availableQuestions = [];
let availableResponses = [];

function LoadEvents()
{
	$("#btnTest").off("click").on("click", function(){
		RunSaveQuizObject();
	});
	$("#btnLoadQuestionTypes").off("click").on("click", function(){
		LoadQuestionTypes();
	});
	$("#btnLoadQuizes").off("click").on("click", function(){
		LoadQuizes(function(){
			LoadQuizSelector();
		});
	});
	$("#btnSaveQuiz").off("click").on("click", function(){
		RunSaveQuizObject();
	});
	$("#btnSaveQuestion").off("click").on("click", function(){
		SaveQuestion();
	});
	$("#btnLoadQuestions").off("click").on("click", function(){
		console.log("Loading questions...");
		LoadQuestions(function(){
			LoadQuestionSelector();
		});
	});
	$("#btnLoadResponses").off("click").on("click", function(){
		LoadResponses(function(){
			LoadResponseSelector();
		});
	});
	$("#btnAssignResponseToQuestion").off("click").on("click", function(){
		AssignResponseToQuestion(function(){
			LoadQuestions();
			LoadResponses();
			LoadSelectors();
		});
	});
	$("#quizSelector").off("change").on("change", function(){
		let quizId = $(this).val();
		console.log("🚀  |  quizingTest.js:69  |  $  |  quizId:", quizId);
		let quizObject = availableQuizes.find(i => i.Id == quizId);
		console.log("🚀  |  quizingTest.js:71  |  $  |  Load Quiz Object");
		console.log("🚀  |  quizingTest.js:71  |  $  |  quizObject:", quizObject);
	});
	$("#questionSelector").off("change").on("change", function(){
		let questionId = $(this).val();
		console.log("🚀  |  quizingTest.js:79  |  $  |  questionId:", questionId);
		let questionObject = availableQuestions.find(i => i.Id == questionId);
		console.log("🚀  |  quizingTest.js:81  |  $  |  questionObject:", questionObject);
		alert(`Load Question information for ${questionObject.Text || ""} (${questionId})`);
	});
	$("#responseSelector").off("change").on("change", function(){
		let responseId = $(this).val();
		console.log("🚀  |  quizingTest.js:86  |  $  |  responseId:", responseId);
		let responseObject = availableResponses.find(i => i.Id == responseId);
		console.log("🚀  |  quizingTest.js:89  |  $  |  responseObject:", responseObject);
		alert(`Load Response information for ${responseObject.Text || ""} (${responseId})`);
	});
	$("#btnAssignQuestionToQuiz").off("click").on("click", function(){
		AssignQuestionToQuiz(function(){
			LoadQuizes();
			LoadQuestions();
			LoadResponses();
			LoadSelectors();
		});
	})
}

function LoadSelectors(){
	LoadQuizSelector();
	LoadQuestionSelector();
	LoadResponseSelector();
}

function LoadQuestionTypes(callback)
{
	a$.ajax({
		type: "POST",
		service: "C#",
		async: true,
		data: {
			lib: "selfserv",
			cmd:"getQuestionTypesList",
		},
		dataType: "json",
		cache: false,
		error: function (response) {
			a$.ajaxerror(response);
		},
		success: function (data) {
			if (data.errormessage != null && data.errormessage == "true") {
				a$.jsonerror(data);
				return;
			}
			else {
				let returnData = JSON.parse(data.questionTypesList);
				console.log("🚀  |  quizingTest.js:33  |  data.questionTypesList:", returnData);

				if(callback != null)
				{
					callback(returnData);
				}
				else
				{
					return returnData;
				}
			}
		}
	});

}
function LoadQuizes(callback){
	a$.ajax({
		type: "POST",
		service: "C#",
		async: true,
		data: {
			lib: "selfserv",
			cmd:"getAllQuizes",
		},
		dataType: "json",
		cache: false,
		error: function (response) {
			a$.ajaxerror(response);
		},
		success: function (data) {
			if (data.errormessage != null && data.errormessage == "true") {
				a$.jsonerror(data);
				return;
			}
			else {
				//let returnData = JSON.parse(data.questionTypesList);
				let returnData = JSON.parse(data.quizList);
				availableQuizes.length = 0;
				availableQuizes = [... returnData];

				console.log("🚀  |  quizingTest.js:71  |  LoadQuizes  |  quizList:", returnData);

				if(callback != null)
				{
					callback(returnData);
				}
				else
				{
					return returnData;
				}
			}
		}
	});
}
function RunSaveQuizObject(callback){
	alert("not available.");
	// let emptyGuid = "00000000-0000-0000-0000-000000000000";
	// let quizObject = {};
	// quizObject.QuizOptionId = emptyGuid;
	// quizObject.QuizName = "Test Quiz Saving 3";
	// quizObject.StartDate = new Date().toLocaleDateString();
	// quizObject.EndDate = new Date().toLocaleDateString();
	// quizObject.QuizOptionTypeId = 1; //Quiz
	// quizObject.DisplayQuestionsOneAtTime = false;
	// quizObject.QuizStatus= "A";
	// quizObject.EntDt = new Date().toLocaleDateString();
	// quizObject.EntBy = "Tester";
	// quizObject.UpdDt = null;
	// quizObject.UpdBy = "Tester";

	// quizObject.Questions = [];
	// let qCounter = 1;

	// while(qCounter <= 5){
	// 	let questionObject = {};
	// 	questionObject.QuizOptionQuizQuestionId = emptyGuid;
	// 	questionObject.QuizOptionId = quizObject.QuizOptionId;
	// 	questionObject.QuizQuestionId = validQuestionIds[qCounter];
	// 	questionObject.QuestionPoints = parseFloat(Math.floor(Math.random() * 10));
	// 	questionObject.QuizQuestionOrder = qCounter;
	// 	questionObject.AllowPartialPoints = false;
	// 	questionObject.IsActive = true;
	// 	questionObject.EntDt = new Date().toLocaleDateString();
	// 	questionObject.EntBy = "Tester";
	// 	questionObject.UpdDt = null;
	// 	questionObject.UpdBy = "Tester";

	// 	quizObject.Questions.push(questionObject);
	// 	qCounter++;
	// }

	// console.log("🚀  |  quizingTest.js:145  |  RunSaveQuizObject  |  quizObject:", quizObject);


	// a$.ajax({
	// 	type: "POST",
	// 	service: "C#",
	// 	async: true,
	// 	data: {
	// 		lib: "selfserv",
	// 		cmd:"saveQuizOption",
	// 		quizOption: JSON.stringify(quizObject),
	// 	},
	// 	dataType: "json",
	// 	cache: false,
	// 	error: function (response) {
	// 		a$.ajaxerror(response);
	// 	},
	// 	success: function (data) {
	// 		if (data.errormessage != null && data.errormessage == "true") {
	// 			a$.jsonerror(data);
	// 			return;
	// 		}
	// 		else {
	// 			let returnData = JSON.parse(data.quizOption);
	// 			let quizId = data.quizId;
	// 			console.log("🚀  |  quizingTest.js:127  |  RunSaveQuizObject  |  data.quizId:", quizId);
	// 			console.log("🚀  |  quizingTest.js:33  |  data.quizOption:", returnData);

	// 			if(callback != null)
	// 			{
	// 				callback(returnData);
	// 			}
	// 			else
	// 			{
	// 				return returnData;
	// 			}
	// 		}
	// 	}
	// });
}
function SaveQuestion(callback)
{
	alert("not available.")
	// let emptyGuid = "00000000-0000-0000-0000-000000000000";
	// let questionObject = {};
	// questionObject.QuizQuestionOptionId = emptyGuid;
	// questionObject.QuestionText = "CDJ Test Question X";
	// questionObject.QuestionStatus = "A";
	// questionObject.QuizQuestionTypeId = 5; //multiple choice
	// questionObject.EntDt = new Date().toLocaleDateString();
	// questionObject.EntBy = "Tester";
	// questionObject.UpdDt = null;
	// questionObject.UpdBy = "Tester";

	// questionObject.AvailableResponses = [];
	// questionObject.Tags = [];
	// console.log("🚀  |  quizingTest.js:209  |  questionObject:", questionObject);

	// a$.ajax({
	// 	type: "POST",
	// 	service: "C#",
	// 	async: true,
	// 	data: {
	// 		lib: "selfserv",
	// 		cmd:"saveQuizQuestionOption",
	// 		questionOption: JSON.stringify(questionObject),
	// 	},
	// 	dataType: "json",
	// 	cache: false,
	// 	error: function (response) {
	// 		a$.ajaxerror(response);
	// 	},
	// 	success: function (data) {
	// 		if (data.errormessage != null && data.errormessage == "true") {
	// 			a$.jsonerror(data);
	// 			return;
	// 		}
	// 		else {
	// 			let returnData = JSON.parse(data.quizQuestionOptionList);
	// 			console.log("🚀  |  quizingTest.js:33  |  data.quizQuestionOptionList:", returnData);

	// 			if(callback != null)
	// 			{
	// 				callback(returnData);
	// 			}
	// 			else
	// 			{
	// 				return returnData;
	// 			}
	// 		}
	// 	}
	// });
}
function LoadQuestions(callback)
{
	a$.ajax({
		type: "POST",
		service: "C#",
		async: true,
		data: {
			lib: "selfserv",
			cmd:"getAllPossibleQuizModuleQuestionOptions",
			deepLoad:true,
		},
		dataType: "json",
		cache: false,
		error: function (response) {
			a$.ajaxerror(response);
		},
		success: function (data) {
			if (data.errormessage != null && data.errormessage == "true") {
				a$.jsonerror(data);
				return;
			}
			else {
				//let returnData = JSON.parse(data.questionTypesList);
				let returnData = JSON.parse(data.quizQuestionOptionList);
				console.log("🚀  |  quizingTest.js:71  |  LoadQuestions  |  data.quizQuestionOptionList:", returnData);
				availableQuestions.length = 0;
				availableQuestions = [... returnData];
				if(callback != null)
				{
					callback(returnData);
				}
				else
				{
					return returnData;
				}
			}
		}
	});
}

function LoadResponses(callback)
{
	a$.ajax({
		type: "POST",
		service: "C#",
		async: true,
		data: {
			lib: "selfserv",
			cmd:"getAllPossibleQuizModuleResponseOptions",
			deepLoad:true,
		},
		dataType: "json",
		cache: false,
		error: function (response) {
			a$.ajaxerror(response);
		},
		success: function (data) {
			if (data.errormessage != null && data.errormessage == "true") {
				a$.jsonerror(data);
				return;
			}
			else {
				//let returnData = JSON.parse(data.questionTypesList);
				let returnData = JSON.parse(data.quizResponseOptionList);
				availableResponses.length = 0;
				availableResponses = [... returnData];
				console.log("🚀  |  quizingTest.js:71  |  LoadResponses  |  data.quizResponseOptionList:", returnData);

				if(callback != null)
				{
					callback(returnData);
				}
				else
				{
					return returnData;
				}
			}
		}
	});
}

function AssignResponseToQuestion(callback)
{
	let questionId = $("#questionSelector").val();
	let responseId = $("#responseSelector").val();
	a$.ajax({
		type: "POST",
		service: "C#",
		async: true,
		data: {
			lib: "selfserv",
			cmd:"assignResponseIdToQuestionId",
			responseId:responseId,
			questionId:questionId,
		},
		dataType: "json",
		cache: false,
		error: function (response) {
			a$.ajaxerror(response);
		},
		success: function (data) {
			if (data.errormessage != null && data.errormessage == "true") {
				a$.jsonerror(data);
				return;
			}
			else {
				//let returnData = JSON.parse(data.questionTypesList);
				let returnData = JSON.parse(data.quizResponseOptionList);
				console.log("🚀  |  quizingTest.js:71  |  LoadResponses  |  data.quizResponseOptionList:", returnData);

				if(callback != null)
				{
					callback(returnData);
				}
				else
				{
					return returnData;
				}
			}
		}
	});
}

function LoadQuestionSelector(callback)
{
	$("#questionSelector").empty();
	let emptyOption = $(`<option />`);
	$("#questionSelector").append(emptyOption);
	availableQuestions.forEach(function(qItem){
		let questionOption = $(`<option value="${qItem.Id}">${qItem.Text}</option>`);
		$("#questionSelector").append(questionOption);
	});
	if(callback != null)
	{
		callback();
	}
}
function LoadResponseSelector(callback)
{
	$("#responseSelector").empty();
	let emptyOption = $(`<option />`);
	$("#responseSelector").append(emptyOption);
	availableResponses.forEach(function(rItem){
		let responseOption = $(`<option value="${rItem.Id}">${rItem.Text}</option>`);
		$("#responseSelector").append(responseOption);
	});
	if(callback != null)
	{
		callback();
	}
}

function LoadQuizSelector(callback)
{
	$("#quizSelector").empty();
	let emptyOption = $(`<option />`);
	$("#quizSelector").append(emptyOption);
	availableQuizes.forEach(function(qItem){
		let quizOption = $(`<option value="${qItem.Id}">${qItem.Name}</option>`);
		$("#quizSelector").append(quizOption);
	});
	if(callback != null)
	{
		callback();
	}
}

function AssignQuestionToQuiz(callback)
{
	let quizId = $("#quizSelector").val();
	let questionId = $("#questionSelector").val();
	debugger;
	a$.ajax({
		type: "POST",
		service: "C#",
		async: true,
		data: {
			lib: "selfserv",
			cmd:"assignQuestionIdToQuizId",
			questionId:questionId,
			quizId:quizId,
		},
		dataType: "json",
		cache: false,
		error: function (response) {
			a$.ajaxerror(response);
		},
		success: function (data) {
			if (data.errormessage != null && data.errormessage == "true") {
				a$.jsonerror(data);
				return;
			}
			else {
				//let returnData = JSON.parse(data.questionTypesList);
				let returnData = JSON.parse(data.quizList);
				console.log("🚀  |  quizingTest.js:505  |  data.quizList:", data.quizList);
				availableQuizes.length = 0;
				availableQuizes = [... returnData];

				if(callback != null)
				{
					callback(returnData);
				}
				else
				{
					return returnData;
				}
			}
		}
	});

	//saveQuizQuestionOption

	console.log(`Assign question (${questionId}) to quiz (${quizId}).`);
	if(callback != null)
	{
		callback();
	}
}
