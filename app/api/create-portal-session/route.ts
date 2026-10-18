import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/utils/stripe/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // Get customer
  const { data: customer } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!customer?.stripe_customer_id) {
    return NextResponse.json(
      { error: 'No customer found' },
      { status: 400 }
    );
  }

  // Create portal session
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account`,
  });

  return NextResponse.redirect(session.url);
}
