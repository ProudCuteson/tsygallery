'use server'
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/gallery/database/mongoose";
import { revalidatePath } from "next/cache";
import User from "@/lib/gallery/database/models/user.model";
import Image from "@/lib/gallery/database/models/image.model";
import { v2 as cloudinary } from "cloudinary";

const populateUser = ( query : any ) => query.populate({
  path: "author",
  model: User,
  select: "_id firstName lastName clerkId",
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

// GET ALL IMAGES

export async function getAllImages({ limit = 10, page = 1, searchQuery = "" } : {
  limit?: number;
  page: number;
  searchQuery?: string;
}) {
  try {
    
    await connectDB();
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    
    let expression = 'folder=imaginify';

    if (searchQuery) {
      expression += ` AND ${searchQuery}`;
    };

    const { resources } = await cloudinary.search
      .expression(expression)
      .execute();

    const resourceIds = resources.map((resource : any) => resource.public_id);

    let query = {};

    if(searchQuery) {
      query = { 
        publicId: { $in: resourceIds },
      };
    };

    const skipAmount = (Number(page)-1) * limit;

    const images = await populateUser(Image.find(query))
      .sort({ updateAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find(query).countDocuments();
    const savedImages = await Image.find().countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPage: Math.ceil(totalImages / limit),
      savedImages,
    };
    
  } catch (error) {
    console.log(error);
  }
};

// GET IMAGES BY USER
export async function getUserImages({
  limit = 9,
  page = 1,
  userId,
}: {
  limit?: number;
  page: number;
  userId: string;
}) {
  try {
    await connectDB();

    const skipAmount = (Number(page) - 1) * limit;

    const images = await populateUser(Image.find({ author: userId }))
      .sort({ updatedAt: -1 })
      .skip(skipAmount)
      .limit(limit);

    const totalImages = await Image.find({ author: userId }).countDocuments();

    return {
      data: JSON.parse(JSON.stringify(images)),
      totalPages: Math.ceil(totalImages / limit),
    };
  } catch (error) {
    console.log(error);
  }
}