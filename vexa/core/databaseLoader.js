console.log(`\x1b[93m────────── DATABASE ─────────────\x1b[0m`);
const path = require('path');

module.exports = async function () {
  const controller = await require(path.join(__dirname, "..", "..", "database/controller/index.js"))(globalFCA); 
  const { threadModel, userModel, globalModel, threadsData, usersData, globalData } = controller;

  const totalUsers = await usersData.getAll();
  const totalGroups = await threadsData.getAll();
  log.info("DBINFO", `${totalUsers.length} Users and ${totalGroups.length} Groups.`);
  return {
    threadModel,
    userModel,
    globalModel,
    threadsData,
    usersData,
    globalData
  };
};