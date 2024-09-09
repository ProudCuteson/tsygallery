import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Collection } from "@/components/gallery/Collection";
import HeaderDescription from "@/components/gallery/HeaderDescription";
import { getUserImages } from "@/actions/gallery/image.actions";

import { getUserById } from "@/actions/gallery/user.actions";

const Profile = async ({ searchParams }: SearchParamProps) => {
  const page = Number(searchParams?.page) || 1;

  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const user = await getUserById(userId);3
  console.log(user);

  const images = await getUserImages({ page, userId: user._id });

  return (
    <>
      <HeaderDescription title="Profile" />

      <section className="mt-5 flex flex-col gap-5 sm:flex-row md:mt-8 md:gap-10">
        <div className=" w-full rounded-[16px] border p-5 shadow-lg md:px-6 md:py-8">
          <p className="text-xl md:text-lg">CREDITS AVAILABLE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/coins.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="text-2xl font-bold">{user.creditBalance}</h2>
          </div>
        </div>

        <div className="w-full rounded-[16px] border p-5 shadow-lg md:px-6 md:py-8">
          <p className="text-lg font-semibold md:texl-xl">IMAGE MANIPULATION DONE</p>
          <div className="mt-4 flex items-center gap-4">
            <Image
              src="/assets/icons/photo.svg"
              alt="coins"
              width={50}
              height={50}
              className="size-9 md:size-12"
            />
            <h2 className="text-2xl font-bold">{images?.data.length}</h2>
          </div>
        </div>
      </section>

      <section className="mt-8 md:mt-14">
        <Collection
          images={images?.data}
          totalPages={images?.totalPages}
          page={page}
        />
      </section>
    </>
  );
};

export default Profile;