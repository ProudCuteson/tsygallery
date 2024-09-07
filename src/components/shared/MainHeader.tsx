import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs'

const MainHeader = () => {
  return (
    <header className='px-5 h-[64px] bg-muted flex flex-row items-center justify-between'>
      <h1>My App</h1>
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