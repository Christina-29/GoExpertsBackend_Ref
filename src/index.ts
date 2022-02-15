import app from './app';
import connectToDB from "./database/db";
import logger from "./config/winston";

connectToDB();

const port = process.env.PORT || "5000";
app.listen(port, () => {
    logger.info(`Listen on ${port}`);
});