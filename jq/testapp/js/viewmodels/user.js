    /* global ko */

function Project(name, supervisor, start, end) {
	var self = this;
	self.name = ko.observable(name);
	self.supervisor = ko.observable(supervisor);
	self.startDate = ko.observable(start);
	self.enddate = ko.observable(end);
}

function Interview(type, date, notes) {
    var self = this;
    self.type = ko.observable(type);
    self.date = ko.observable(date);
    self.notes = ko.observable(notes);
    self.results = ko.observableArray([]);
}

function InterviewResult( section, score ) {
    var self = this;
    self.section = ko.observable(section);
    self.score = ko.observable( score );
}



function UserViewModel( user, lists ) {
    var self = this;

    // navigation hide/show panels
    // "Demographics" "Project Summary" "Recruitment Summary" "Interviews" "Corrective Actions"
    self.demoVisible = ko.observable().subscribeTo("section", function(section) {
        return section.name === "Demographics";
    });
    self.projVisible = ko.observable().subscribeTo("section", function(section) {
        return section.name === "Project Summary";
    });

    self.recruitmentVisible = ko.observable().subscribeTo("section", function(section) {
        return section.name === "Recruitment Summary";
    });

    self.interviewsVisible = ko.observable().subscribeTo("section", function(section) {
        return section.name === "Interviews";
    });

    self.corrVisible = ko.observable().subscribeTo("section", function(section){
        return section.name === "Corrective Actions";
    });

    // recruiting list added in, others should be added here as well
    /// this way we can handle the selects for these values
    self.ethnicityList = ko.observableArray( lists.ethnicity );
    self.ageRangeList = ko.observableArray( lists.ageRange );
    self.educationList = ko.observableArray( lists.education );
    self.testingList = ko.observableArray( lists.testing );
    self.recruitedByList = ko.observableArray( lists.recruitedBy );
    self.interviewTypeList = ko.observableArray( lists.interviewType );
    self.correctiveRoleList = ko.observableArray( lists.correctiveRole );
    self.workLocationList = ko.observableArray( lists.workLocation );
    self.recruitList = ko.observableArray( lists.recruitingOffice );

    // new project
    self.newprojectname = ko.observable("");
    self.newprojectsuper = ko.observable("");
    self.newprojectstart = ko.observable("");
    self.newprojectend = ko.observable("");

    // new interviews
    self.newinterviewtype = ko.observable("");
    self.newinterviewdate = ko.observable("");
    self.newinterviewnotes = ko.observable("");
    // results
    self.newinterviewscores = ko.observableArray( ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10" ]);
    self.newinterviewontime = ko.observable("");
    self.newinterviewappearance = ko.observable("");
    self.newinterviewarticulate = ko.observable("");
    self.newinterviewprofessional = ko.observable("");
    self.newinterviewenthusiasm = ko.observable("");
    self.newinterviewother1 = ko.observable("");
    self.newinterviewother2 = ko.observable("");

    // we can get everything in here provided its in the user object that is passed to this function
    if ( user ) {
        ko.mapping.fromJS( user, {}, self );
        // get lists
        // self.demoVisible = true;
    }

    self.name.full = ko.computed(self.getFullName, self);
}

// Methods
UserViewModel.prototype.save = function() {
    var self = this;
     // take the view model and throw it to the ajax post
    console.log( ko.mapping.toJSON(self) ); 
};

UserViewModel.prototype.getFullName = function() {
    var self = this;
    if (self.name) {
        return self.name.first() + " " + self.name.last();
    } else {
        return '';
    }
};

// // unneccessary, unless I need to convert back to text value
// UserViewModel.prototype.recruitingOfficeChanged = function() {
//     var self = this;
//     console.log( self.employment.recruitingOffice());
// };


UserViewModel.prototype.addProject = function() {
    var self = this;

    if (self.newprojectname) {
    	self.employment.project.push(new Project(self.newprojectname(), self.newprojectsuper(), self.newprojectstart(), self.newprojectend()));
        self.newprojectname(""); 
        self.newprojectsuper(""); 
        self.newprojectstart(""); 
        self.newprojectend("");
    }
};

UserViewModel.prototype.addInterview = function() {
    var self = this;
    // maybe this should be more like .isinterviewcomplete and check multiple fields?
    if (self.newinterviewtype) {
        var newInterview = new Interview( self.newinterviewtype(), self.newinterviewdate(), self.newinterviewnotes() );
        newInterview.results.push( new InterviewResult( "On Time", self.newinterviewontime() ) );
        newInterview.results.push( new InterviewResult( "Appearance", self.newinterviewappearance() ) );
        newInterview.results.push( new InterviewResult( "Articulate", self.newinterviewarticulate() ) );
        newInterview.results.push( new InterviewResult( "Professionalism", self.newinterviewprofessional() ) );
        newInterview.results.push( new InterviewResult( "Enthusiasm", self.newinterviewenthusiasm() ) );
        newInterview.results.push( new InterviewResult( "Other 1", self.newinterviewother1() ) );
        newInterview.results.push( new InterviewResult( "Other 2", self.newinterviewother2() ) );
        self.employment.recruitment.interviews.push( newInterview );
        self.newinterviewtype("");
        self.newinterviewdate("");
        self.newinterviewnotes("");
        self.newinterviewontime("");
        self.newinterviewappearance("");
        self.newinterviewarticulate("");
        self.newinterviewprofessional("");
        self.newinterviewenthusiasm("");
        self.newinterviewother1("");
        self.newinterviewother2("");
    }
};