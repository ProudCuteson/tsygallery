import { redirect } from 'next/navigation'
import HeaderDescription from '@/components/gallery/HeaderDescription'
import { transformationTypes } from '@/lib/gallery/constants'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/actions/gallery/user.actions'
import TransformationForm from '@/components/gallery/TransformationForm'

const TransTypeAddPage = async ({ params: { type } }: SearchParamProps) => {

  const transformation = transformationTypes[type];
  const { userId } = auth();  // Clerk user ID
  if (!userId) redirect('/sign-in');
  const user = await getUserById(userId);
  const id = user._id.toString(); // MongoDB user ID

  return (

    <div>
      <HeaderDescription
        title={transformation.title}
        subtitle={transformation.subTitle}
      />

      <section className="mt-8">
        <TransformationForm
          action="Add"
          userId={id}
          type={transformation.type as TransformationTypeKey}
          creditBalance={user.creditBalance}
        />
      </section>
    </div>
  )
}

export default TransTypeAddPage