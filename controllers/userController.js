const controller = {};
const models = require("../models");

// controller.show = async (req, res) => {
//   const page = parseInt(req.params.page) || 1;
//   const limit = 5;
//   const skip = (page - 1) * limit;

//   res.locals.users = await models.User.findAll({
//     attributes: [
//       "id",
//       "imagePath",
//       "username",
//       "firstName",
//       "lastName",
//       "mobile",
//       "isAdmin",
//     ],
//     order: [["createdAt", "DESC"]],
//   });
//   res.render("user-management");
// };

controller.show = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 5;
  const offset = (page - 1) * limit;

  try {
    // Fetch the total number of users for pagination
    const totalUsers = await models.User.count();

    // Fetch the users with pagination
    const users = await models.User.findAll({
      attributes: [
        "id",
        "imagePath",
        "username",
        "firstName",
        "lastName",
        "mobile",
        "isAdmin",
      ],
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit);

    // Render the view with users and pagination data
    res.render("user-management", {
      users: users,
      totalUsers: totalUsers,
      totalPages: totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).send("An error occurred while fetching users.");
  }
};

controller.addUser = async (req, res) => {
  const { firstName, lastName, username, mobile, isAdmin } = req.body;

  if (!firstName || !lastName || !username) {
    return res.render("user-management", {
      errorMessage: "First name, last name, and email are required.",
    });
  }

  try {
    await models.User.create({
      firstName,
      lastName,
      username,
      mobile,
      isAdmin: isAdmin ? true : false,
    });

    res.redirect("/users");
  } catch (error) {
    console.error("Error adding user:", error);
    res.send("Can not add user!");
    console.error(error);
  }
};

controller.editUser = async (req, res) => {
  let { id, firstName, lastName, mobile, isAdmin } = req.body;
  try {
    console.log(id, firstName, lastName, mobile, isAdmin);
    const result = await models.User.update(
      {
        firstName,
        lastName,
        mobile,
        isAdmin: isAdmin ? true : false,
      },
      {
        where: { id },
      }
    );
    if (result[0] > 0) {
      res.status(200).send("User updated successfully");
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(401).send("cannot update user!");
    console.error(error);
  }
};

controller.deleteUser = async (req, res) => {
  try {
    await models.User.destroy({ where: { id: parseInt(req.params.id) } });
    res.send("User deleted!");
  } catch (error) {
    res.status(401).send("Can not delete user!");
    console.error(error);
  }
};

module.exports = controller;
