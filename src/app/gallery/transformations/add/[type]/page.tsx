import React from 'react'
import { redirect } from 'next/navigation'
import HeaderDescription from '@/components/gallery/HeaderDescription'
import TransformationForm from '@/components/gallery/TransformationForm'
import { transformationTypes } from '@/lib/gallery/constants'
import { auth } from '@clerk/nextjs/server'
import { getUserById } from '@/actions/gallery/user.actions'

const TransTypeAddPage = async ({ params: { type } }: SearchParamProps) => {

  const transformation = transformationTypes[type];

  //This is the clerk auth ID
  const { userId } = auth();
  if(!userId) redirect('/sign-in');

  console.log( userId);
  //This is the db user ID
  const user = await getUserById(userId);
  
  return (

    <>
      <HeaderDescription 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
      <TransformationForm 
        action="Add"
        userId={user?._id}
        type={transformation.type as TransformationTypeKey}
        creditBalance={user.creditBalance}
      />
    </>
  )
}

export default TransTypeAddPage