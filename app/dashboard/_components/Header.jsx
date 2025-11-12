"use client"
import React, { useEffect } from 'react'
import Image from 'next/image';
import { UserButton } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

const Header = () => {
    const path = usePathname();
    const router = useRouter();

    useEffect(() => { 
        console.log(path);
    },[path])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={"/logo.svg"} alt="Logo" width={160} height={100} />
        <ul className='hidden md:flex gap-6'>
            <li 
                onClick={() => router.push('/dashboard')}
                className={`hover:text-primary hover:font-bold transition-all 
                cursor-pointer` + (path === "/dashboard" ? " text-primary font-extrabold" : "")}>
                Dashboard
            </li>

            <li  
                onClick={() => router.push('/dashboard/questions')}
                className={`hover:text-primary hover:font-bold transition-all 
                cursor-pointer` + (path === "/dashboard/questions" ? " text-primary font-extrabold" : "")}>
                Questions
            </li>

            <li  
                onClick={() => router.push('/dashboard/upgrade')}
                className={`hover:text-primary hover:font-bold transition-all 
                cursor-pointer` + (path === "/dashboard/upgrade" ? " text-primary font-extrabold" : "")}>
                Upgrade
            </li>

            <li  
                onClick={() => router.push('/dashboard/how')}
                className={`hover:text-primary hover:font-bold transition-all 
                cursor-pointer` + (path === "/dashboard/how" ? " text-primary font-extrabold" : "")}>
                How it Works?
            </li>
        </ul>
       <UserButton />
    </div>
  )
}

export default Header