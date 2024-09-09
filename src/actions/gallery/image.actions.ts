'use server'
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/gallery/database/mongoose";
import { revalidatePath } from "next/cache";
import User from "@/lib/gallery/database/models/user.model";
import Image from "@/lib/gallery/database/models/image.model";

const populateUser = ( query : any ) => query.populate({
  path: "author",
  model: User,
  select: "_id firstName lastName",
});

// ADD IMAGE
export async function addImage({image, userId, path} : AddImageParams) {
  try {

    await connectDB();
    const author = await User.findById(userId);
    if (!author) throw new Error("User not found");
    const newImage = await Image.create({ 
      ...image, 
      author: author._id,
     });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newImage));
    
  } catch (error) {
    console.log(error);
  }
};

// Update IMAGE
export async function updateImage({image, userId, path} : UpdateImageParams) {
  try {
    
    await connectDB();
    const imageToUpdate = await Image.findById(image._id);
    if (!imageToUpdate || imageToUpdate.author.toHexString() !== userId) throw new Error("Unauthorized or Image not found");
    const updatedImage = await Image.findByIdAndUpdate( 
      imageToUpdate._id,
      image,
      {new: true},
    );
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedImage));
    
  } catch (error) {
    console.log(error);
  }
};

// Delete IMAGE
export async function deleteImage(imageId : string) {
  try {
    
    await connectDB();
    await Image.findByIdAndDelete(imageId);
   
  } catch (error) {
    console.log(error);
  } finally {
    redirect("/gallery");
  }
};

// GET IMAGE
export async function getImageById( imageId : string) {
  try {
    
    await connectDB();
    const image = await populateUser(Image.findById(imageId));
    if (!image) throw new Error("Image not found");
    return JSON.parse(JSON.stringify(image));

  } catch (error) {

    console.log(error);
    
  }
};