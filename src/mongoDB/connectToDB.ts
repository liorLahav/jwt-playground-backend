import { config } from "dotenv";
import { MongoClient } from "mongodb";

config();
const mongoUri = process.env.MONGO_URL || "mongodb://localhost:27017";
const mongoClient : MongoClient = new MongoClient(mongoUri);

export const connectToDB = async () => {
    try{
        await mongoClient.connect();
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.error("Failed to connect to MongoDB", err);
        process.exit(1);
    }
}

const db = mongoClient.db("JWT-Playground");

export const usersCollection = db.collection("users");
export const postsCollection = db.collection("posts");