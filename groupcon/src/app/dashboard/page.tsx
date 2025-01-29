import React from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/createClient/server'
import { getUserId } from '@/lib/actions/actions'

async function page() {
    // const supabase = await createClient()

    // const { data, error } = await supabase.auth.getUser()
    // if (error || !data?.user) {
    //     redirect('/auth/login')
    // }

    const data = getUserId()

    

    console.log(data)

    // console.log(data.user.id)

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome, {data}!</p>
        </>
        

    )

    
}

export default page
