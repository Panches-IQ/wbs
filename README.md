### Prerequisites
**npm install**
**npm run flow**
**npm run build**

### Usage
npm install --save ../sdk
```javascript
const famapp = require("famapp-sdk");
const app = firebase.initializeApp(config);
module.exports.famapp = famapp(app);
```
### Methods reference
#### User
* ##### _promise_ **famapp.User.signIn(**_object_ **config**);
	###### **config:**
		password: string
		email: string
		provider: string
	```javascript 
	famapp.User.signIn({
		password: "my_secret",
		email: "johndoe@mysite.com",
		provider: "password"
	});
	```
* ##### _promise_ **famapp.User.signOut();**
* ##### _promise_ **famapp.User.signUp();** 
* ##### _promise_ **famapp.User.signUpAndJoinFamily();**
* ##### _promise_ **famapp.User.sendEmailVerification();**
* ##### _promise_ **famapp.User.sendPwdReset(**_string_ **email);**
* ##### _promise_ **famapp.User.getCurrentFamilyId();**
* ##### _promise_ **famapp.User.getFamilyIds();**
* ##### _object_ **famapp.User.getCurrentUser();**
	```javascript
	const user = famapp.User.getCurrentUser();
	if (user.emailVerified) {
		// .... some code here
	}
	```

#### Auth
* ##### _void_ famapp.Auth.listen().filter(e => e.type === "auth/state-changed").do(console.log);

#### Lists
* ##### _promise_ **famapp.Lists.create(**_object_ **list);**
	_adds new list to collection and returns db-reference to it_
* ##### _promise_ **famapp.Lists.update(**_object_ **list);**
* ##### _promise_ **famapp.Lists.remove(**_object_ **list);**
* ##### _promise_ **famapp.Lists.restore(**_object_ **list);**
* ##### _promise_ **famapp.Lists.trash(**_object_ **list);** 
* ##### _object_ **famapp.Lists.getDefaultLists();**
	_returns an empty array of lists_
* ##### _object_ **famapp.Lists.getDefaultList();**
	_returns pre-defined list object_
	```javascript
	const list = famapp.Lists.getDefaultList();
	// list = { title:"", deadline:"", status:"A", items:[] };
	```
* ##### _promise_ **famapp.Lists.setItems(** _object_ **items,** _string_ **listId);**
	_updates list with id=**listId** with new fields taken from the **items** object_
* ##### _promise_ **famapp.Lists.removeItem(**_string_ **itemId,** _string_ **listId);**
* ##### _void_ **famapp.Lists.subscribe(**_object_ **config);**
	###### **config:** 
		order: object
		order.dir: string
		order.by: string
		id: string
		type: string
	***will force to emit single list firestore changes:***
	```javascript
	famapp.Lists.subscribe({
		id: "my_list_id",
		type: "list/update" // Note: can be omitted if id presented
	});
	```
	***will force to emit whole lists firestore changes:***
	```javascript
	famapp.Lists.subscribe({
		type: "lists/update", // Note: can be omitted if no id presented
		order: {
			dir: "desc", // default is "desc"
			by: "created" // default is "created"
		}
	});
	```
* ##### _void_ **famapp.Lists.unsubscribe();**
	_tells famapp to stop emitting firestore Lists changes_
* ##### _nullable string_ **famapp.Lists.getCurrentSubscriberType();**
	_returns current subscriber type or null if no subscriber presents_
	```javascript
	famapp.Lists.subscribe({});
	console.log(famapp.Lists.getCurrentSubscriberType()); // prints "lists/update"
	famapp.Lists.unsubscribe();
	console.log(famapp.Lists.getCurrentSubscriberType()); // prints null
	```
* ##### _void_ **famapp.Lists.listen().filter(e => e.type === "lists/update").do(callback);**
