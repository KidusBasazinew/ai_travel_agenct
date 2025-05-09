import { ID, OAuthProvider, Query } from "appwrite";
import { account, database, appwriteConfig } from "@/appwrite/client";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Models } from "appwrite";

// Function to check if a user already exists in the database
export const getExistingUser = async (id: string) => {
  try {
    // Query the database for documents where accountId matches the provided id
    const { documents, total } = await database.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.userCollectionId as string,
      [Query.equal("accountId", id)]
    );

    // If a user is found (total > 0), return the first document, else return null
    return total > 0 ? documents[0] : null;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Function to store a new user's data in the database
export const storeUserData = async () => {
  try {
    // Fetch the currently logged-in user's account info
    const user = await account.get();

    // If the user is not logged in, throw an error
    if (!user) throw new Error("User not found");

    // Get the current session and extract the OAuth2 access token
    const { providerAccessToken } = (await account.getSession("current")) || {};

    // If access token exists, use it to get the user's Google profile picture
    const profilePicture = providerAccessToken
      ? await getGooglePicture(providerAccessToken)
      : null;

    // Create a new user document in the database with the user's data
    const createdUser = await database.createDocument(
      appwriteConfig.databaseId as string,
      appwriteConfig.userCollectionId as string,
      ID.unique(), // Generate a unique document ID
      {
        accountId: user.$id,
        email: user.email,
        name: user.name,
        imageUrl: profilePicture,
        joinedAt: new Date().toISOString(), // Store the current timestamp
      }
    );

    // If the document was not created successfully, redirect to sign-in
    if (!createdUser.$id) redirect("/sign-in");
  } catch (error) {
    console.error("Error storing user data:", error);
  }
};

// This function retrieves the user's Google profile picture using their OAuth access token
const getGooglePicture = async (accessToken: string) => {
  try {
    // Make an API request to the Google People API to get the user's photo
    const response = await fetch(
      "https://people.googleapis.com/v1/people/me?personFields=photos",
      {
        // Pass the access token in the Authorization header
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If the response is not successful, throw an error
    if (!response.ok) throw new Error("Failed to fetch Google profile picture");

    // Parse the JSON response and extract the 'photos' field
    const { photos } = await response.json();

    // Return the URL of the first photo, or null if it's not available
    return photos?.[0]?.url || null;
  } catch (error) {
    // Log any errors that occur and return null as fallback
    console.error("Error fetching Google picture:", error);
    return null;
  }
};

// Function to log in a user using Google's OAuth2
export const loginWithGoogle = async () => {
  try {
    // Initiates an OAuth2 session with Google
    account.createOAuth2Session(
      OAuthProvider.Google,
      `${window.location.origin}/`, // Redirect on success
      `${window.location.origin}/404` // Redirect on failure
    );
  } catch (error) {
    console.error("Error during OAuth2 session creation:", error);
  }
};

// Function to log out the currently logged-in user
export const logoutUser = async () => {
  try {
    // Deletes the current session, logging the user out
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during logout:", error);
  }
};

// Function to fetch the currently authenticated user's information
export const getUser = async () => {
  try {
    // Get the current logged-in user's basic account info
    const user = await account.get();

    // If no user is found, redirect to sign-in page
    if (!user) return redirect("/sign-in");

    // Fetch the user's document from the database based on their account ID
    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.userCollectionId as string,
      [
        Query.equal("accountId", user.$id), // Match with the logged-in user's ID
        Query.select(["name", "email", "imageUrl", "joinedAt", "accountId"]), // Only retrieve specific fields
      ]
    );

    // If user data is found, return the first document; otherwise redirect
    return documents.length > 0 ? documents[0] : redirect("/sign-in");
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

// Function to get a paginated list of all users
export const getAllUsers = async (limit: number, offset: number) => {
  try {
    // Fetch users from the database with pagination
    const { documents: users, total } = await database.listDocuments(
      appwriteConfig.databaseId as string,
      appwriteConfig.userCollectionId as string,
      [
        Query.limit(limit), // Limit the number of results
        Query.offset(offset), // Skip the first `offset` users
      ]
    );

    // If no users are found, return an empty array and total 0
    if (total === 0) return { users: [], total };

    // Return users and total count
    return { users, total };
  } catch (e) {
    console.log("Error fetching users");
    return { users: [], total: 0 };
  }
};

export function useAuth() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        console.error("No user found", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
    }
  };

  return { user, loading, logout };
}
