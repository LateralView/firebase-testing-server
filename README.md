# Firebase testing server

Base project to run tests against local Firebase server. Useful to test the security rules and any function interacting with the Firebase database.
Based on [urish / firebase-server](https://github.com/urish/firebase-server).
Tests are written with [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/).

### Installation

```
host $ git clone https://github.com/LateralView/firebase-testing-server.git
host $ cd firebase-testing-server
host $ npm install
```

### Configuration & usage

* The security rules are stored in the **rules.json** file.
* The **data.json** file contains the initial data stored in the Firebase database. Keep in mind that the server is created and destroyed on each test, so this initial data is loaded again between tests.
* Add your specs under the **test** folder.
* The server runs by default on port 45000. You can change this editing the **lib/config.json** file.
* Run the tests!

```
host $ npm test
```

Happy Testing!