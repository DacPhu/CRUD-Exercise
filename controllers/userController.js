const controller = {};
const models = require("../models");

controller.show = async (req, res) => {
  res.locals.users = await models.User.findAll({
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
  });
  res.render("user-management");
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
  console.log(id);
  try {
    await models.User.update(
      { firstName, lastName, mobile, isAdmin: isAdmin ? true : false },
      { where: { id } }
    );
  } catch (error) {
    res.status(401).send("Can not update user!");
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
