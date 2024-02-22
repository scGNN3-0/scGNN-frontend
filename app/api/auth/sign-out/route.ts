import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })

  await supabase.auth.signOut()

  const urlStr = process.env.ORIG_URL??request.url;
  const url = new URL(urlStr);
  return NextResponse.redirect(`${url.origin}/login`, {
    // a 301 status is required to redirect from a POST to a GET route
    status: 301,
  })
}
