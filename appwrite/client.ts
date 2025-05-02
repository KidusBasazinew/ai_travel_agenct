import { Account, Client, Databases, Storage } from "appwrite";

export const appwriteConfig = {
  endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_API_ENDPOINT,
  projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
  apiKey: process.env.NEXT_PUBLIC_APPWRITE_API_KEY,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
  userCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID,
  tripCollectionId: process.env.NEXT_PUBLIC_APPWRITE_TRIPS_COLLECTION_ID,
};

const client = new Client()
  .setEndpoint(appwriteConfig.endpointUrl as string)
  .setProject(appwriteConfig.projectId as string);

const account = new Account(client);
const database = new Databases(client);
const storage = new Storage(client);

export { client, account, database, storage };
