import React from 'react'

const HeaderDescription = ({ title, subtitle }: { title: string, subtitle?: string }) => {
  return (
    <>
      <h2 className="text-2xl font-bold">{title}</h2>
      {subtitle && <p className="text-lg mt-4">{subtitle}</p>}
    </>
  )
}

export default HeaderDescription