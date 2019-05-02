https://www.quora.com/Whats-the-best-view-engine-for-node-js-ejs-jade-or-handlebars


mongodb commands

unzip tar
mongod --dbpath /Users/mauli.pravasi/MauliData/learning/node/mongoDatabse 

database - database
collection - table
documents – rows
column	-Field
Table Join	- Embedded Documents
Primary Key -	 Primary Key (Default key _id provided by mongodb itself)


https://medium.com/chingu/an-overview-of-mongodb-mongoose-b980858a8994
https://levelup.gitconnected.com/async-await-vs-promises-4fe98d11038f

mongoose - helps for data modeling , validation , ODM - object doc model
Moongose uses mongodb behind the scenes

Model.find(query, fields, options, callback)

COMPARISON query operators - https://examples.javacodegeeks.com/software-development/mongodb/mongodb-comparison-query-operators-example/
2.1 $eq, $gt, $gte, $lt, and $lte Operators 
2.2 $in and $nin Operators
2.3 $ne Operator

LOGICAL operators
AND, NOT, OR, NOR


both are equal
// With a JSON doc

Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec(callback);

// Using query builder
Person.
  find({ occupation: /host/ }).
  where('name.last').equals('Ghost').
  where('age').gt(17).lt(66).
  where('likes').in(['vaporizing', 'talking']).
  limit(10).
  sort('-occupation').
  select('name occupation').
  exec(callback);


regex - https://dl.icewarp.com/online_help/203030104.htm -https://mongoosejs.com/docs/schematypes.html

//SCHEMA TYPES: SchemaTypes handle definition of path defaults, validation, getters, setters, field selection defaults for queries, and other general characteristics for Mongoose document properties.
required: boolean or function, if true adds a required validator for this property
default: Any or function, sets a default value for the path. If the value is a function, the return value of the function is used as the default.
select: boolean, specifies default projections for queries
validate: function, adds a validator function for this property
get: function, defines a custom getter for this property using Object.defineProperty().
set: function, defines a custom setter for this property using Object.defineProperty().
alias: string, mongoose >= 4.10.0 only. Defines a virtual with the given name that gets/sets this path.



**************EBDON-500****************

JWT signing options
// SIGNING OPTIONS
var signOptions = {
 issuer:  i,
 subject:  s,
 audience:  a,
 expiresIn:  "12h",
 algorithm:  "RS256"
};

https://stackoverflow.com/questions/13546249/authorization-approaches-and-design-patterns-for-node-js-applications


**************EBDON-501****************
logging 
morgan :  there is no way to log to some other log storage source, such as a database or a service like Loggly. But if we look at the documentation a little bit, we can see that Morgan allows us to define an output stream.

Adding a try/catch block to every route handler is repetitive and time consuming. 
Use express-async-errors module. This module will monkey-patch your route handlers at runtime. It’ll wrap your code within a try/catch block and pass unhandled errors to your error middleware.