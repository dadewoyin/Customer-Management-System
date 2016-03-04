# Customer-Management-System
A customer management system. It will, on a high level allow for the management of data attached to a specific person, and group them in an array, making each entry its own object. The entire application is encapsulated within an object. There are two types of actions being done, the ones to the table, and the ones to the storage. The only things exposed are the methods and properties needed to perform the actions, such as adding and editing an entry. Each entry is stored in local storage with a specific ID that is auto procured field named "index". All keys have a prefix of "Database" to avoid any type of naming conflict, and ends with an Integer. Any objects that do not meet this requirement will not be recognized. Entries are stored in JSON strings. There are three different forms: 
  1. A form for adding a new customer. 
  2. A form for editing a customer from the dashboard. 
  3. And a form for editing a customer from the search page. Each time an entry is added, it resorts. Each time an entry is edited, it clears the table and resorts to ensure accuracy. 