import mongodb from "mongodb";



const client = new mongodb.MongoClient(process.env.MONGODB_URI || "", {
    
})


const connectDb = async () => {
    try {
    } catch (error) {
        console.error("Error connecting DB: ", error);
    }
}