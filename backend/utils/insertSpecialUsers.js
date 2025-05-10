const bcrypt = require("bcrypt");
const User = require("../models/User");

const insertSpecialUsers = async () => {
  const hashedDevPass = await bcrypt.hash(process.env.DEV_PASS, 10);
  const hashedAdminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);

  const specialUsers = [
    {
      username: process.env.DEV_USER,
      password: hashedDevPass,
      email: process.env.DEV_EMAIL,
      role: "dev",
      name: "Developer",
    },
    {
      username: "admin",
      password: hashedAdminPass,
      email: "erp@skit.ac.in",
      role: "admin",
      name: "Administrator",
    },
  ];

  const ops = specialUsers.map((user) => ({
    updateOne: {
      filter: { email: user.email },
      update: { $set: user },
      upsert: true,
    },
  }));

  await User.bulkWrite(ops);
};

module.exports = insertSpecialUsers;
