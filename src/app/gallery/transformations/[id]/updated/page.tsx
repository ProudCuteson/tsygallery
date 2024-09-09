import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import HeaderDescription from "@/components/gallery/HeaderDescription";
import TransformationForm from "@/components/gallery/TransformationForm";
import { transformationTypes } from "@/lib/gallery/constants";
import { getUserById } from "@/actions/gallery/user.actions";
import { getImageById } from "@/actions/gallery/image.actions";


const UpdatedPage = async ({ params: { id } }: SearchParamProps) => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const user = await getUserById(userId);
  const dbid = user._id.toString();
  const image = await getImageById(id);

  const transformation =
    transformationTypes[image.transformationType as TransformationTypeKey];

  return (
    <>
      <HeaderDescription title={transformation.title} subtitle={transformation.subTitle} />

      <section className="mt-10">
        <TransformationForm
          action="Update"
          userId={dbid}
          type={image.transformationType as TransformationTypeKey}
          creditBalance={user.creditBalance}
          config={image.config}
          data={image}
        />
      </section>
    </>
  );
};

export default UpdatedPage;