const Users = require('../users/users-model');

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  console.log('restricting access to authed users only');
  next();
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const { username } = req.body;
  const trimmed = username.trim();
  const allUsernames = await Users.find();
  const indexOfName = allUsernames.indexOf(trimmed);
  console.log(allUsernames);

  if (indexOfName < 0) {
    res.status(422).json({ message: 'Username taken' });
  } else {
    next();
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  try {
    const { username, password } = req.body;
    const existing = await Users.findBy({ username });
    if (existing.length) {
      console.log(existing);
      next();
    } else {
      next({ status: 401, message: 'invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
};
