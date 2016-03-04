	// Adam & David's Final Project

	//****************************************************************************************************************
	//TABLE OF CONTENTS
	//****************************************************************************************************************
	// I. SUMMARY
	// II. REFERENCES
	// 1. DATABASE OBJECT
	// 2. SORT FUNCTION
	// 3. INITIALIZE TABLE AND SORT
	// 4. ADD A NEW CUSTOMER FORM
	// 5. EDIT FORM ON DASHBOARD
	// 6. EDIT FORM ON SEARCH PAGE
	// 7. DOM ELEMENTS FOR EDIT FORMS ONLY
	// 8. METHODS FOR ADDING, EDITING THE TABLE AND THE STORAGE
	// 9. DOM ELEMENTS FOR ADDING CUSTOMER FORM, DATABASE INDEX, CLEAR STORAGE
	// 10. CLEAR STORAGE AND SESSION FUNCTION
	// 11. SEARCH ELEMENTS AND FUNCTION
	// 12. INITIALIZE DATABASE OBJECT
	
	
	//****************************************************************************************************************
	// I. SUMMARY
	//****************************************************************************************************************
	
//For our final project, we made a customer management system. It will, on a high level allow for the management of data attached to a specific person, and group them in an array, making each entry its own object. The entire application is encapsulated within an object. There are two types of actions being done, the ones to the table, and the ones to the storage. The only things exposed are the methods and properties needed to perform the actions, such as adding and editing an entry. Each entry is stored in local storage with a specific ID that is auto procured field named "index". All keys have a prefix of "Database" to avoid any type of naming conflict, and ends with an Integer. Any objects that do not meet this requirement will not be recognized. Entries are stored in JSON strings. There are three different forms: 1. A form for adding a new customer. 2. A form for editing a customer from the dashboard. 3. And a form for editing a customer from the search page. Each time an entry is added, it resorts. Each time an entry is edited, it clears the table and resorts to ensure accuracy. 

	
	//****************************************************************************************************************
	// II. REFERENCES
	//****************************************************************************************************************

	//1) Jquery easy tabs, used and edited for the tabular presentation and AJAX loading. 
	//2) Key storage method. The key storage method is used to retreiving the keys from the storage and ultimately populating the table and used for the search form (Alexandru Mărășteanu) addressbook. Thanks to Alexei for answering all our questions. 
	

	//****************************************************************************************************************
	// 1. DATABASE OBJECT
	//****************************************************************************************************************
	
	var Database = {
		
		
	//****************************************************************************************************************
	// 2. SORT FUNCTION
	//***************************************************************************************************************
	
	dbsort:function(){// This function loops through every object in storage, tests if theit key is valid and then adds a new row to the table. 
	if (window.localStorage.length - 1) {
	var customer_list = [], i, key;
	for (i = 0; i < window.localStorage.length; i++) {
	key = window.localStorage.key(i);//key method for retrieving a key's index
	if (/Database:\d+/.test(key)) {
	customer_list.push(JSON.parse(window.localStorage.getItem(key)));//Get the values associated with each key, such as First Name/Last Name, etc.
		}
	}
	
	
	if (customer_list.length) {// Since the data is deep inside a property of the array object and not the array itself, we must manually define the function that is being used to sort alphabetically, and which field is being used to sort. This compares two strings, and then adds performs TabbleAdd
	customer_list.sort(function(obj1, obj2){
	var nameA = obj1.last_name.toLowerCase(), nameB = obj2.last_name.toLowerCase()
	if (nameA < nameB)//ascending
	return -1
	if (nameA > nameB)
	return 1
	return 0 
	}).forEach(Database.tableAdd);
	
			}
		}		
	},
	
	
	//****************************************************************************************************************
	// 3. INITIALIZE DATABASE, SORT
	//****************************************************************************************************************
	
	init: function() {//initializes Database	

	Database.dbsort();// Sorts the table and loops through to weed through valid and non valid objects. Populates accordingly.
	
	var edit_stuff = function (event){//function, replaced anonymous handlers, called from both edit forms on submission, adds
	var entry = {
	id: parseInt(this.id_entry.value),						
	first_name: this.first_name.value,
	last_name: this.last_name.value,
	contact: this.contact.value,
	email: this.email.value,
	street: this.street.value,
	city: this.city.value,
	state: this.state.value,
	zip: this.zip.value,
	occu: this.occu.value
	};
	Database.JSONedit(entry);//calls methods to replace entries in storage and on the table. 
	Database.tableEdit(entry);
	Database.$record = "";// clears table
	Database.dbsort();// resorts to keep current with alphabetical order
	this.reset();
	this.id_entry.value = 0;
	event.preventDefault();
	};
	
	
	var discard = function(event) {//discard function, resets all forms with a confirmation to double check
	if(confirm('Are You Sure?'))
	Database.$form.reset();
	Database.$edit_form.reset();
	Database.$edit_form2.reset();
	Database.$form.id_entry.value = 0;
	};
	
	if (!Database.index) {
	window.localStorage.setItem("Database:index", Database.index = 1);//Initial value of the index property is 1. Increments afterwards, to ensure a unique ID.
	}
	
	
	//****************************************************************************************************************
	// 4. ADD A NEW CUSTOMER FORM
	//****************************************************************************************************************
	
	Database.$form.reset();
	Database.$button_discard.addEventListener("click", discard, true);
	Database.$form.addEventListener("submit", function(event) {//Event listener for a submission of a new "entry"
	var entry = {//entry variable, will be referred to numerous times.
	id: parseInt(this.id_entry.value),
	first_name: this.first_name.value,
	last_name: this.last_name.value,
	contact: this.contact.value,
	email: this.email.value,
	street: this.street.value,
	city: this.city.value,
	state: this.state.value,
	zip: this.zip.value,
	occu: this.occu.value
	};
	Database.JSONadd(entry);//Once submitted, this calls the methods of adding a new entry to the table and to storage, passing through "entry" as a variable, which is all of the information that was gather.
	Database.tableAdd(entry);
	Database.$record = "";// clears table
	Database.dbsort();// resorts to keep current with alphabetical order
	this.reset();
	this.id_entry.value = 0;
	event.preventDefault();
	}, true);
	
	
	//****************************************************************************************************************
	// 5. EDIT FORM ON DASHBOARD
	//****************************************************************************************************************
	
	Database.$edit_form.reset();
	Database.$button_discard_edit.addEventListener("click", discard, true);
	Database.$edit_form.addEventListener("submit", edit_stuff, true);
	Database.$record.addEventListener("click", function(event) {// Event listener on the entire table. Record is the table, so we don't have to add an event listener to each action link. 
	var op = event.target.getAttribute("data-op");//Attribute from the link, labeled data-op
	if (/edit/.test(op)) {//if the edit button is hit....
	var entry = JSON.parse(window.localStorage.getItem("Database:"+ event.target.getAttribute("data-id")));//pulls the entry ID, or data-id from the local storage, matching up the right entry.
	if (op == "edit") {//here the $edit_form is populated with the respective information.
	Database.$edit_form.first_name.value = entry.first_name;
	Database.$edit_form.last_name.value = entry.last_name;
	Database.$edit_form.contact.value = entry.contact;
	Database.$edit_form.email.value = entry.email;
	Database.$edit_form.street.value = entry.street;
	Database.$edit_form.city.value = entry.city;
	Database.$edit_form.state.value = entry.state;
	Database.$edit_form.zip.value = entry.zip;
	Database.$edit_form.occu.value = entry.occu;
	Database.$edit_form.id_entry.value = entry.id;
	}
	event.preventDefault();
		}
	}, true);
	
	
	//****************************************************************************************************************
	// 6. EDIT FORM ON SEARCH PAGE
	//****************************************************************************************************************

	Database.$edit_form2.reset();
	Database.$button_discard_edit2.addEventListener("click", discard, true);
	Database.$edit_form2.addEventListener("submit", edit_stuff, true);
	Database.$search_record.addEventListener("click", function(event) {//Event listener for search_record. Same as $record, just a new part of the DOM, for the search table to be populated, not the main-dashboard table.
	var op = event.target.getAttribute("data-op");
	if (/edit/.test(op)) {
	var entry = JSON.parse(window.localStorage.getItem("Database:"+ event.target.getAttribute("data-id")));
	if (op == "edit") {//Populates the edit form
	Database.$edit_form2.first_name.value = entry.first_name;
	Database.$edit_form2.last_name.value = entry.last_name;
	Database.$edit_form2.contact.value = entry.contact;
	Database.$edit_form2.email.value = entry.email;
	Database.$edit_form2.street.value = entry.street;
	Database.$edit_form2.city.value = entry.city;
	Database.$edit_form2.state.value = entry.state;
	Database.$edit_form2.zip.value = entry.zip;
	Database.$edit_form2.occu.value = entry.occu;
	Database.$edit_form2.id_entry.value = entry.id;
	}
	event.preventDefault();
			}
		}, true);
	},
	
	
	//****************************************************************************************************************
	// 7. DOM ELEMENTS FOR EDIT FORMS ONLY
	//****************************************************************************************************************
	
	//These are the DOM elements being called, for the edit forms, and the buttons that go along with them for submission and discarding
	$edit_form: document.getElementById("edit-form"),
	$edit_form2: document.getElementById("edit-form2"),
	$button_update: document.getElementById("contacts-op-edit2"),
	$button_update2: document.getElementById("contacts-op-edit"),
	$button_discard_edit: document.getElementById("edit-op-discard"),
	$button_discard_edit2: document.getElementById("edit-op-discard2"),
	
	
	//****************************************************************************************************************
	// 8. METHODS FOR ADDING, EDITING THE TABLE AND THE STORAGE
	//****************************************************************************************************************
	
	tableAdd: function(entry) {//Table add method, this adds a new row to the existing table on the dashboard screen
	var $tr = document.createElement("tr"), $td, key;
	for (key in entry) {//DOM element, tr being made into a variable, keys are the elements being called in each entry. Each key  will populate a new "td", for each piece of information. i.e. First Name, Last Name
	if (entry.hasOwnProperty(key)) {
	$td = document.createElement("td");
	$td.appendChild(document.createTextNode(entry[key]));//Creates the actual text within the cell
	$tr.appendChild($td);//Appends a TD to the TR
		}
	}
	$td = document.createElement("td");//Creates the element for the TD
	$tr.appendChild($td);
	$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a>';//Inner HTML populated with the edit link
	$tr.setAttribute("id", "entry-"+ entry.id);//Gives each TR an entry ID to be identified with.
	Database.$record.appendChild($tr);//Appends the final TR to the table, which is identified as $record
	
	},
	
	
	search_tableAdd: function(entry) {//Same as above, for the search table
	var $tr = document.createElement("tr"), $td, key;
	for (key in entry) {
	if (entry.hasOwnProperty(key)) {
	$td = document.createElement("td");
	$td.appendChild(document.createTextNode(entry[key]));
	$tr.appendChild($td);
		}
	}
	$td = document.createElement("td");
	$tr.appendChild($td);
	$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a>';
	$tr.setAttribute("id", "entry-"+ entry.id);
	Database.$search_record.appendChild($tr);
	},
	
	
	JSONedit: function(entry) {//Storage editing method. Sets the item back into storage, using the key Database: and entry id. Stringifying it
	window.localStorage.setItem("Database:"+ entry.id, JSON.stringify(entry));
	},
	
	
	JSONadd: function(entry) {//Adds to storage, used when a new entry is added.
	entry.id = Database.index;//declares entry.id as Database:index
	window.localStorage.setItem("Database:index", ++Database.index);
	window.localStorage.setItem("Database:"+ entry.id, JSON.stringify(entry));//sets the item, the object into storage
	},
	
	
	tableEdit: function(entry) {//Edits the table item
	var $tr = document.getElementById("entry-"+ entry.id), $td, key;
	$tr.innerHTML = "";
	for (key in entry) {
	if (entry.hasOwnProperty(key)) {
	$td = document.createElement("td");
	$td.appendChild(document.createTextNode(entry[key]));
	$tr.appendChild($td);
		}
	}
	$td = document.createElement("td");
	$td.innerHTML = '<a data-op="edit" data-id="'+ entry.id +'">Edit</a>';
	$tr.appendChild($td);
	},
	
	
	//****************************************************************************************************************
	// 9. DOM ELEMENTS FOR ADDING CUSTOMER FORM, DATABASE INDEX, CLEAR STORAGE
	//****************************************************************************************************************
	
	//DOM elements for the original forms, adding. 
	index: window.localStorage.getItem("Database:index"),//The local storage item being called, Database:index is where everything is
	$record: document.getElementById("cust-table"),//This is the table being appended to
	$form: document.getElementById("contacts-form"),//Form for adding
	$search_record:document.getElementById("search-table"),//Search table
	$button_save: document.getElementById("contacts-op-save"),//Saving a new entry
	$button_discard: document.getElementById("contacts-op-discard"),
	$clear: document.getElementById("clear_database"),//Clear the database
	};
	
	
	//****************************************************************************************************************
	// 10. CLEAR STORAGE AND SESSION FUNCTION
	//****************************************************************************************************************
	
	function readEye() {//Function for starting over
	if(confirm('Do You Really Want To Clear?'))
	localStorage.clear();
	sessionStorage.clear();
	}  
	
	
	//****************************************************************************************************************
	// 11. SEARCH ELEMENTS AND FUNCTION
	//****************************************************************************************************************

	var searchField = document.getElementById("search-field"),
	searchForm = document.getElementById("search-form"),
	count = window.localStorage.getItem("Database:index");//The variable that will be referred to in place of the local storage being called
	
	if (window.localStorage.length - 1) {
	var customer_list = [], i, key;
	for (i = 0; i < window.localStorage.length; i++) {
	key = window.localStorage.key(i);
	if (/Database:\d+/.test(key)) {
	customer_list.push(JSON.parse(window.localStorage.getItem(key)));
		}
	}
	
	var addr = {			
	search : function(event){
	var searchValue = searchField.value, i;	
	event.preventDefault();
	if(count > 0 && searchValue !== ""){
	for(i = 0; i < count; i = i + 1) {
	var obj = customer_list[i],
	isItFound = obj.first_name.indexOf(searchValue);//Searches through the array, customer_list, going through the first names. Once it is found the object is then pushed to the table in the same manner as when we add a brand new entry to the array.
	if(isItFound !== -1) {
	Database.search_tableAdd(obj);//search table adding method, obj is used instead of entry being passed through.
						} 
					}
				}
			}		
		}
	}
	
	searchForm.addEventListener("submit", addr.search, false);
	
	
	//****************************************************************************************************************
	// 12. INITIALIZE DATABASE OBJECT
	//****************************************************************************************************************
	
	Database.init();
	
	