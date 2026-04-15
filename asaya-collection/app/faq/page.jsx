import FaqUI from '@/components/Faq/FaqUi';

// ✅ Enable caching
export const revalidate = 60;

// 🌟 THE SEO ENGINE: Tailored specifically for your FAQ page
export const metadata = {
  title: 'FAQ & Client Services | Asaya Collection',
  description: 'Find answers to common questions about Asaya Collection shipping, returns, warranty, and care instructions for our handmade luxury bags.',
  keywords: ['FAQ Asaya Collection', 'luxury bags shipping', 'purse returns', 'handmade bag warranty', 'customer service', 'purse care'],
  openGraph: {
    title: 'FAQ & Client Services | Asaya Collection',
    description: 'Find answers to common questions about our handmade luxury bags, shipping, and returns.',
    url: 'https://www.asayacollection.com/faq', // Update with your actual live domain
    siteName: 'Asaya Collection',
    images: [
      {
        url: '/Logo.png',
        width: 1200,
        height: 630,
        alt: 'Asaya Collection Client Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ & Client Services | Asaya Collection',
    description: 'Find answers to common questions about our handmade luxury bags, shipping, and returns.',
    images: ['/Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  }
};

export default function FaqPage() {
  return <FaqUI />;
}