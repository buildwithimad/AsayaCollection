import Contact from '@/components/Contact/Contact'

// ✅ Enable caching
export const revalidate = 60;

// 🌟 THE SEO ENGINE: Tailored specifically for your Contact page
export const metadata = {
  title: 'Contact Us | Asaya Collection',
  description: 'Have questions about our handmade luxury purses? Contact the Asaya Collection team for customer support, bespoke inquiries, and assistance.',
  keywords: ['contact Asaya Collection', 'customer support', 'luxury bags support', 'bespoke purses inquiries', 'contact artisan bag makers'],
  openGraph: {
    title: 'Contact Us | Asaya Collection',
    description: 'Have questions about our handmade luxury purses? Contact the Asaya Collection team for assistance.',
    url: 'https://www.asayacollection.com/contact', // Update with your actual live domain
    siteName: 'Asaya Collection',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Contact Asaya Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us | Asaya Collection',
    description: 'Have questions about our handmade luxury purses? Contact the Asaya Collection team for assistance.',
    images: ['/Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

const ContactPage = () => {
  return (
    <main>
        <Contact />
    </main>
  )
}

export default ContactPage