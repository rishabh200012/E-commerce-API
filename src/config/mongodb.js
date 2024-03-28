
import {MongoClient} from 'mongodb';


let client;

export const connectToMongodb=()=>{
    MongoClient.connect(process.env.DB_URL)
    .then(clientInstance=>{
        client=clientInstance;
        console.log("Mongodb is connected.")
        createCounter(client.db());
        Index(client.db());
    })
    .catch(err=>{
        console.log(err);
    })
}


export const getClient = ()=>{
  return client;
}

export const getDb = ()=>{
  return  client.db();
}

const createCounter=async (db)=>{
    const existingCounter=await db.collection("counters").findOne({_id:"cartItem"});
    if(!existingCounter){
        await db.collection("counters").insertOne({_id:"cartItem",value:0});
    }
}

const Index= async (db)=>{
    try{
      await db.collection("products").createIndex({price:1});
      await db.collection("products").createIndex({name:1,category:-1});
      await db.collection("products").createIndex({desc:"text"});
    }
    catch(err){
      console.log(err);
    }
}

