import toast from "react-hot-toast";
import { User } from "../types";

// Fetch all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) {
      throw new Error("Something went wrong with the fetch request");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch users data");
  }
};

// Fetch a single user by ID
export const getUser = async (id: string): Promise<User> => {
  try {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
    if (!res.ok) {
      throw new Error("Something went wrong with the fetch request");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw new Error("Failed to fetch user data or user not found");
  }
};

// Create a new user
export const createUser = async (user: User): Promise<User> => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users", {
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!res.ok) {
      throw new Error("Something went wrong with the fetch request");
    }
    const data = await res.json();
    toast.success("User created successfully");
    return data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

// Update an existing user
export const updateUser = async (user: User): Promise<User> => {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    if (!res.ok) {
      throw new Error("Something went wrong with the fetch request");
    }
    const data = await res.json();
    toast.success("User updated successfully");
    return data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update data");
  }
};

// Delete a user by ID
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      { method: "DELETE" },
    );
    if (!res.ok) {
      throw new Error("Something went wrong with the fetch request");
    }
    toast.success("User deleted successfully");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user data");
  }
};
