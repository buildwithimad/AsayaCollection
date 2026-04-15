import Checkout from '@/components/Checkout/Checkout'

// 🌟 THE SEO ENGINE: Secure configuration for Checkout
export const metadata = {
  title: 'Secure Checkout | Asaya Collection',
  description: 'Complete your purchase of luxury handmade purses and artisanal bags securely with Asaya Collection.',
  // 🔒 CRITICAL: Tells Google NOT to show this private page in search results
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Secure Checkout | Asaya Collection',
    description: 'Complete your purchase securely.',
    url: 'https://www.asayacollection.com/checkout', // Update with your actual live domain
    siteName: 'Asaya Collection',
    locale: 'en_US',
    type: 'website',
  }
};

const CheckoutPage = () => {
  return (
    <main>
        <Checkout />
    </main>
  )
}

export default CheckoutPage