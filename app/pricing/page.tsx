import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { Sparkles, Check } from 'lucide-react';
import { stripe } from '@/utils/stripe/server';
import { ProductWithPrices } from '@/types/stripe';

async function getProducts(): Promise<ProductWithPrices[]> {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price'],
  });

  const productsWithPrices: ProductWithPrices[] = [];

  for (const product of products.data) {
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
    });

    productsWithPrices.push({
      id: product.id,
      active: product.active,
      name: product.name,
      description: product.description,
      image: product.images[0] || null,
      metadata: product.metadata,
      prices: prices.data.map((price) => ({
        id: price.id,
        product_id: product.id,
        active: price.active || false,
        description: null,
        unit_amount: price.unit_amount || 0,
        currency: price.currency,
        type: price.type,
        interval: price.recurring?.interval || null,
        interval_count: price.recurring?.interval_count || null,
        trial_period_days: price.recurring?.trial_period_days || null,
        metadata: price.metadata,
      })),
    });
  }

  return productsWithPrices;
}

export default async function PricingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const products = await getProducts();

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(amount / 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold">WatermarkRemover</span>
            </Link>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Dashboard
                  </Link>
                  <Link href="/account" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Account
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/signin" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 flex flex-col"
              >
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {product.description}
                </p>
                {product.prices.map((price) => (
                  <div key={price.id} className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold">
                        {formatPrice(price.unit_amount, price.currency)}
                      </span>
                      {price.interval && (
                        <span className="text-gray-600 dark:text-gray-400 ml-2">
                          /{price.interval}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                <Link
                  href={user ? `/api/create-checkout-session?priceId=${product.prices[0]?.id}` : "/signin"}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-semibold mb-6"
                >
                  {user ? "Subscribe" : "Get Started"}
                </Link>
                <div className="space-y-3 flex-grow">
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited watermark removal</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">High-quality processing</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-600 dark:text-gray-400">
              No pricing plans available yet. Please check back later.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
