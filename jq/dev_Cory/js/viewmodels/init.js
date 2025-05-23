/* global ko, a$, UserViewModel, userProfile */
// Select a user and initial view 
function NavSection (name, selected) {
    this.name = name;
    this.isSelected = ko.computed(function() {
       return this === selected();  
    }, this);
}


function User() {
    var self = this;
    self.viewModel = ko.observable();
}

function InitViewModel( lists ) {

	var self = this;
	self.availableUsers = ko.observableArray( ["- none -", "test" ]);
	self.selected = ko.observable(null);
	// Navigation
	self.selectedSection = ko.observable().publishOn("section");

	self.sections = ko.observableArray([
		new NavSection( "Demographics", self.selectedSection),
		new NavSection( "Recruitment Summary", self.selectedSection),
		new NavSection( "Interviews", self.selectedSection),
		new NavSection( "Corrective Actions", self.selectedSection)
	]);

	if ( lists ) {
		ko.mapping.fromJS( lists, {}, self );
	}
}

// hold master view model for user so we avoid multiple bindings
var userVM = new User();
ko.applyBindings(userVM, document.getElementById("userProfileGrid"));

InitViewModel.prototype.userChanged = function() {
	var self = this;
	var user = self.selected();
	if (user && user !== "- none -") {
	    a$.ajax({
	        type: "GET", 
	        service: "JScript", 
	        async: true, 
	        data: { lib: 'userprofile', cmd: 'getfullprofile', user: user },
	        dataType: "json", 
	        cache: false, 
	        error: a$.ajaxerror,
	        success: function(json) { 
	        	 if (!a$.jsonerror(json)) {
			        var user = json;
			        if (user.name) {
			         // now pass to the user.viewModel observable
			         	userVM.viewModel(new UserViewModel( user, userProfile.lists ) );
			            self.selectedSection(self.sections()[0]);
			        }
		   		}   
		   	}
			});
	}
};


