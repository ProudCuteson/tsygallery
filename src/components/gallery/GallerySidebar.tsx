'use client'
import React from 'react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'
import { navLinks } from '@/lib/gallery/constants'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Button } from '../ui/button'
import { UserButton } from "@clerk/nextjs";
import { ThemeToggle } from '../ThemeToggle'

const GallerySidebar = () => {

  const pathname = usePathname();

  return (
    <aside className='flex-col space-y-5 p-5 justify-between min-h-screen hidden h-screen w-72 shadow-md border-r lg:flex'>
      <div className='append'>
        <div className='flex flex-row gap-4'>
          <Link href='/gallery' className='flex gap-3 items-center'>
            <Image src="/assets/images/logo-text.svg" alt="logo" width={180} height={28} />
          </Link>
        </div>
        <Separator className='my-5' />
        <SignedIn>
          {<ul className='flex flex-col space-y-3'>
            {navLinks.map((link) => {
              const isActive = link.route === pathname
              return (
                <li key={link.route} className={isActive ? 'text-foreground' : 'text-foreground/80'}>
                  <Link href={link.route} className='w-full flex item-center gap-2'>
                    <Image
                      src={link.icon}
                      alt='logo'
                      width={24}
                      height={24}
                      className={`${isActive && 'brightness-200'}`}
                    />
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>}
        </SignedIn>

      </div>
      <div className='flex flex-col space-y-5'>
        <ThemeToggle />
        <UserButton />
        <SignedOut>
          <Button asChild variant={'default'}>
            <Link href='/sign-in'>Login</Link>
          </Button>
        </SignedOut>
      </div>
    </aside>
  )
}

export default GallerySidebar