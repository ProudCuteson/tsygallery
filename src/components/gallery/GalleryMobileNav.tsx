'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { 
  Sheet,
  SheetContent,
  SheetTrigger,
 } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

import { SignedIn, UserButton } from '@clerk/nextjs'
import { SignedOut } from '@clerk/nextjs'

import { navLinks } from '@/lib/gallery/constants'

const GalleryMobileNav = () => {

  const pathname = usePathname();
  
  return (
    <header className='mt-8 flex w-full flex-col items-start gap-5 md:hidden'>
      <Link href={'/gallery'} className='flex items-center gap-2 md:py-2'>
        <Image
          src='/assets/images/logo-text.svg'
          alt='logo'
          width={100}
          height={28}
        />
      </Link>
      <nav className='flex gap-2'>
        <SignedIn>
          <UserButton />
          <Sheet>
            <SheetTrigger>
              <Image 
                src='/assets/icons/menu.svg'
                alt='menu'
                width={28}
                height={28}
                className='cursor-pointer'
              />
            </SheetTrigger>
            <SheetContent className='sm:w-64'>
              <>
              <Image 
                src='/assets/images/logo-text.svg'
                alt='logo'
                width={152}
                height={23}
              />
              <ul className='flex flex-col space-y-3'>
            {navLinks.map((link) => {
              const isActive = link.route === pathname
              return (
                <li key={link.route} className={isActive ? 'text-foreground/70' : 'text-foreground/30'}>
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
          </ul>
              </>
            </SheetContent>  
          </Sheet>
        </SignedIn>
        <SignedOut>
          <Button asChild variant={'default'}>
            <Link href='/sign-in'>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  )
}

export default GalleryMobileNav