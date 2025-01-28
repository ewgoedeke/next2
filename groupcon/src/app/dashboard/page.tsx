import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/createClient/server'
// import SideNav from "@/app/ui/dashboard/sidenav"; // Import your SideNav


async function page() {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        redirect('/auth/login')
    }

    console.log(data)

    console.log(data.user.id)



    
}

export default page
