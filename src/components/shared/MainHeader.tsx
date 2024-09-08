import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

const MainHeader = () => {
  return (
    <header className='px-5 h-[64px] w-full bg-muted flex flex-row items-center justify-between'>
      <div className='gap-x-10 hidden md:flex'>
        <div><h1>My App</h1></div>
        <nav>
          <ul className='flex gap-5'>
            <Link href='/' className='hover:underline'><li>Home</li></Link>
            <Link href='/gallery' className='hover:underline'><li>Gallery</li></Link>
            <Link href='/' className='hover:underline'><li>Noteboard</li></Link>
          </ul>
        </nav>
      </div>
      
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        <SignInButton />
      </SignedOut>
    </header>
  )
}

export default MainHeader