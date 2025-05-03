// Vehicle schema for featured Jeep Wrangler
document.addEventListener('DOMContentLoaded', () => {
  // Only add this schema on pages that feature the vehicle
  if (document.getElementById('featured-vehicle')) {
    const vehicleScript = document.createElement('script');
    vehicleScript.type = 'application/ld+json';
    vehicleScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Vehicle",
      "name": "Jeep Wrangler",
      "manufacturer": {
        "@type": "Organization",
        "name": "Jeep"
      },
      "vehicleConfiguration": "4x4 Off-road",
      "vehicleInteriorType": "Removable doors & roof",
      "description": "Adventure ready Jeep Wrangler perfect for Kenyan terrain with 4x4 off-road capability.",
      "offers": {
        "@type": "Offer",
        "availability": "https://schema.org/InStock",
        "price": "42000",
        "priceCurrency": "USD",
        "seller": {
          "@type": "AutoDealer",
          "name": "CSE Motors",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "Kisumu",
            "addressCountry": "Kenya"
          }
        }
      },
      "review": {
        "@type": "Review",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "4.9",
          "bestRating": "5"
        },
        "author": {
          "@type": "Person",
          "name": "Safari Enthusiast"
        }
      }
    });
    
    document.head.appendChild(vehicleScript);
  }
});