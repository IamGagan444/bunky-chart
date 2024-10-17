import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
  useNewUrlParser?:boolean
};

const connection: ConnectionObject = {};

async function dbConnect() {
  if (connection.isConnected) {
    return console.log(" database is already connected");
  }
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}`, {
      dbName: "Bunky-chat",
    serverSelectionTimeoutMS: 30000,
    });

    connection.isConnected = connect.connection.readyState;
    console.log("database connected",connect.connection.readyState);
  } catch (error) {
    console.log("database connecion error:", error);
    process.exit(1);
  }
}

export default dbConnect;
