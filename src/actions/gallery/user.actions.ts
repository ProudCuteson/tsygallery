"use server";

import User from "@/lib/gallery/database/models/user.model";
import { connectDB } from "@/lib/gallery/database/mongoose";

// CREATE
export async function createUser(user: any) {
  try {
    await connectDB();

    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));

  } catch (error) {
    console.log(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    console.log(user);

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
    
  } catch (error) {
    console.log(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: any) {
  try {
    await connectDB();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.log(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectDB();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    console.log(error);
  }
}

// USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    await connectDB();

    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee }},
      { new: true }
    )

    if(!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
    
  } catch (error) {
    console.log(error);
  }
}