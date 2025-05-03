// Organization schema for CSE Motors
document.addEventListener('DOMContentLoaded', () => {
  const organizationScript = document.createElement('script');
  organizationScript.type = 'application/ld+json';
  organizationScript.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "name": "CSE Motors",
    "image": "/images/site/icon.png",
    "url": "https://csemotors.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 CSE Street",
      "addressLocality": "Kisumu",
      "addressRegion": "Kisumu County",
      "postalCode": "40100",
      "addressCountry": "KE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "-0.1021",
      "longitude": "34.7617"
    },
    "telephone": "+254-700-000000",
    "priceRange": "$$$",
    "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
    "sameAs": [
      "https://www.facebook.com/csemotors",
      "https://twitter.com/csemotors"
    ]
  });
  
  document.head.appendChild(organizationScript);
});