import { BellIcon, ChevronDownIcon, GithubIcon, MenuIcon, SearchIcon } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu'

import { cn } from '@/lib/utils'

import LogoSvg from '@/assets/svg/logo'
import NotificationDropdown from '@/components/shadcn-studio/blocks/dropdown-notification'
import ProfileDropdown from '@/components/shadcn-studio/blocks/dropdown-profile'
import MenuSheet from '@/components/shadcn-studio/blocks/menu-sheet'
import type { NavigationSection } from '@/components/shadcn-studio/blocks/menu-sheet'

const Navbar = ({ navigationData }: { navigationData: NavigationSection[] }) => {
  return (
    <header className='bg-background sticky top-0 z-50 border-b'>
      <div className='border-b'>
        <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-3 sm:px-6'>
          <div className='flex items-center gap-4'>
            <MenuSheet
              logoName='Job Management'
              navigationData={navigationData}
              trigger={
                <Button variant='outline' size='icon' className='inline-flex lg:hidden'>
                  <MenuIcon />
                  <span className='sr-only'>Menu</span>
                </Button>
              }
            />
            <a href='#'>
              <div className='flex items-center'>
                <LogoSvg className='size-8' />
                <span className='ml-3 hidden text-xl font-semibold sm:block'>shadcn/studio</span>
              </div>
            </a>
          </div>
          <div className='relative max-md:hidden'>
            <div className='text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50'>
              <SearchIcon className='size-4' />
              <span className='sr-only'>Search</span>
            </div>
            <Input type='text' placeholder='Type here' className='peer pl-9' />
          </div>
          <div className='flex items-center gap-1.5 md:gap-4'>
            <Button variant='ghost' size='icon' className='flex md:hidden'>
              <SearchIcon />
            </Button>

            <NotificationDropdown
              trigger={
                <Button variant='ghost' size='icon' className='relative'>
                  <BellIcon />
                  <span className='bg-destructive absolute top-2 right-2.5 size-2 rounded-full' />
                </Button>
              }
            />
            <ProfileDropdown
              trigger={
                <Button variant='ghost' className='h-full p-0'>
                  <Avatar className='size-9.5 rounded-md'>
                    <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              }
            />
          </div>
        </div>
      </div>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 py-1.5 sm:px-6'>
        <NavigationMenu viewport={false} className='hidden lg:block'>
          <NavigationMenuList className='flex-wrap justify-start'>
            {navigationData.map(navItem => {
              if (navItem.href) {
                // Root link item
                return (
                  <NavigationMenuItem key={navItem.title}>
                    <NavigationMenuLink
                      href={navItem.href}
                      className={cn(navigationMenuTriggerStyle(), 'flex flex-row items-center gap-1.5')}
                    >
                      {navItem.icon}
                      {navItem.title}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                )
              }

              // Section with dropdown
              return (
                <NavigationMenuItem key={navItem.title}>
                  <NavigationMenuTrigger className='gap-1.5'>
                    {navItem.icon}
                    {navItem.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className='data-[motion=from-start]:slide-in-from-left-30! data-[motion=to-start]:slide-out-to-left-30! data-[motion=from-end]:slide-in-from-right-30! data-[motion=to-end]:slide-out-to-right-30! absolute w-auto'>
                    <ul className='grid w-38 gap-4'>
                      <li>
                        {navItem.items?.map(item => (
                          <NavigationMenuLink key={item.title} href={item.href}>
                            {item.title}
                          </NavigationMenuLink>
                        ))}
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>
              <GithubIcon />
              Github_Store
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuGroup>
              <DropdownMenuItem>Store Overview</DropdownMenuItem>
              <DropdownMenuItem>Manage Account</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>FAQs</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default Navbar
