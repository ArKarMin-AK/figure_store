const {hellotask}=require("./taskservice");
const {CronJob} = require("cron");
const everyMinute = new CronJob(
    "* * * * *",
    hellotask,
    null,
    true
)
module.exports = { everyMinute }