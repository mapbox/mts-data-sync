// calculation code from https://github.com/mapbox/pricebook/blob/master/lib/sku-invoice.js
// pricing from https://github.com/mapbox/pricebook/blob/master/lib/skus/skus-event.js
// to update pricing, replace the skus object with the data in skus-event.js

import { format } from "d3-format";

const THOUSAND = 1000;
const MILLION = 1000 * THOUSAND;
const BILLION = 1000 * MILLION;
const TRILLION = 1000 * BILLION;


const formatDollars = dollar => {
  // some sku pricing tiers can go below a cent
  if (dollar < 0.01 && dollar !== 0) {
    return format("$,.5~f")(dollar);
  } else {
    return format("$,.2f")(dollar);
  }
};

const formatCents = cents => formatDollars(cents / 100);

// , => separate thousands
// d => format as an integer, prevent scientific notation
const formatCount = format(",d");

const skus = {
  processing10m: {
    type: "event",
    id: "processing10m",
    name: "Tileset Processing 10m",
    description:
      "The event of creating a tileset with a max zoom between 6-10 or a GeoTIFF\
      tileset with a max zoom between 7-11. Cost depends on the area of all tiles that\
      were created. Tilesets created in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#processing10m",
    subunitDescription: "square kilometer",
    contactSalesThreshold: 1.5 * TRILLION,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 1.5 * BILLION, price: 0 },
          { min: 1.5 * BILLION + 1, max: 15 * BILLION, price: 0.04 },
          { min: 15 * BILLION + 1, max: 150 * BILLION, price: 0.032 },
          { min: 150 * BILLION + 1, max: 1.5 * TRILLION, price: 0.024 },
          { min: 1.5 * TRILLION + 1, price: 0.016 }
        ]
      }
    }
  },
  processing1m: {
    type: "event",
    id: "processing1m",
    name: "Tileset Processing 1m",
    description:
      "The event of creating a tileset with a max zoom between 11-13 or a GeoTIFF\
      tileset with a max zoom between 12-14. Cost depends on the area of all tiles that\
      were created. Tilesets created in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#processing1m",
    subunitDescription: "square kilometer",
    contactSalesThreshold: 1 * BILLION,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 1 * MILLION, price: 0 },
          { min: 1 * MILLION + 1, max: 10 * MILLION, price: 0.8 },
          { min: 10 * MILLION + 1, max: 100 * MILLION, price: 0.64 },
          { min: 100 * MILLION + 1, max: 1 * BILLION, price: 0.48 },
          { min: 1 * BILLION + 1, price: 0.32 }
        ]
      }
    }
  },
  processing30cm: {
    type: "event",
    id: "processing30cm",
    name: "Tileset Processing 30cm",
    description:
      "The event of creating a tileset with a max zoom between 14-16 or a GeoTIFF\
      tileset with a max zoom between 15-17. Cost depends on the area of all tiles that\
      were created. Tilesets created in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#processing30cm",
    subunitDescription: "square kilometer",
    contactSalesThreshold: 20 * MILLION,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 20 * THOUSAND, price: 0 },
          { min: 20 * THOUSAND + 1, max: 200 * THOUSAND, price: 25 },
          { min: 200 * THOUSAND + 1, max: 2 * MILLION, price: 20 },
          { min: 2 * MILLION + 1, max: 20 * MILLION, price: 15 },
          { min: 20 * MILLION + 1, price: 10 }
        ]
      }
    }
  },
  processing1cm: {
    type: "event",
    id: "processing1cm",
    name: "Tileset Processing 1cm",
    description:
      "The event of creating a tileset with a max zoom greater than 16 or a GeoTIFF\
      tileset with a max zoom greater than 17. Cost depends on the area of all tiles that\
      were created. Tilesets created in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#processing1cm",
    subunitDescription: "square kilometer",
    contactSalesThreshold: 350 * THOUSAND,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 350, price: 0 },
          { min: 351, max: 3.5 * THOUSAND, price: 200 },
          { min: 3.5 * THOUSAND + 1, max: 35 * THOUSAND, price: 160 },
          { min: 35 * THOUSAND + 1, max: 350 * THOUSAND, price: 120 },
          { min: 350 * THOUSAND + 1, price: 80 }
        ]
      }
    }
  },
  hosting10m: {
    type: "event",
    id: "hosting10m",
    name: "Tileset Hosting 10m",
    description:
      "The event of storing a tileset with a max zoom between 6-10 or a GeoTIFF\
      tileset with a max zoom between 7-11. Cost depends on the area of all tiles that\
      were created multiplied by the number of days each tileset has existed in your\
      account during your billing period. Mapbox default tilesets and tilesets created\
      in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#hosting10m",
    subunitDescription: "square kilometer day",
    contactSalesThreshold: 1.5 * TRILLION,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000000,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 1.5 * BILLION, price: 0 },
          { min: 1.5 * BILLION + 1, max: 15 * BILLION, price: 0.04 },
          { min: 15 * BILLION + 1, max: 150 * BILLION, price: 0.032 },
          { min: 150 * BILLION + 1, max: 1.5 * TRILLION, price: 0.024 },
          { min: 1.5 * TRILLION + 1, price: 0.016 }
        ]
      }
    }
  },
  hosting1m: {
    type: "event",
    id: "hosting1m",
    name: "Tileset Hosting 1m",
    description:
      "The event of storing a tileset with a max zoom between 11-13 or a GeoTIFF\
      tileset with a max zoom between 12-14. Cost depends on the area of all tiles that\
      were created multiplied by the number of days each tileset has existed in your\
      account during your billing period. Mapbox default tilesets and tilesets created\
      in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#hosting1m",
    subunitDescription: "square kilometer day",
    contactSalesThreshold: 1 * BILLION,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000000,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 1 * MILLION, price: 0 },
          { min: 1 * MILLION + 1, max: 10 * MILLION, price: 0.8 },
          { min: 10 * MILLION + 1, max: 100 * MILLION, price: 0.64 },
          { min: 100 * MILLION + 1, max: 1 * BILLION, price: 0.48 },
          { min: 1 * BILLION + 1, price: 0.32 }
        ]
      }
    }
  },
  hosting30cm: {
    type: "event",
    id: "hosting30cm",
    name: "Tileset Hosting 30cm",
    description:
      "The event of storing a tileset with a max zoom between 14-16 or a GeoTIFF\
      tileset with a max zoom between 15-17. Cost depends on the area of all tiles that\
      were created multiplied by the number of days each tileset has existed in your\
      account during your billing period. Mapbox default tilesets and tilesets create\
      in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#hosting30cm",
    subunitDescription: "square kilometer day",
    contactSalesThreshold: 20 * MILLION,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000000,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 20 * THOUSAND, price: 0 },
          { min: 20 * THOUSAND + 1, max: 200 * THOUSAND, price: 25 },
          { min: 200 * THOUSAND + 1, max: 2 * MILLION, price: 20 },
          { min: 2 * MILLION + 1, max: 20 * MILLION, price: 15 },
          { min: 20 * MILLION + 1, price: 10 }
        ]
      }
    }
  },
  hosting1cm: {
    type: "event",
    id: "hosting1cm",
    name: "Tileset Hosting 1cm",
    description:
      "The event of storing a tileset with a max zoom greater than 16 or a GeoTIFF\
      tileset with a max zoom greater than 17. Cost depends on the area of all tiles that\
      were created multiplied by the number of days each tileset has existed in your\
      account during your billing period. Mapbox default tilesets and tilesets created\
      in Mapbox Studio are exempt.",
    documentationUrl: "https://mapbox.com/pricing/#hosting1cm",
    subunitDescription: "square kilometer day",
    contactSalesThreshold: 350 * THOUSAND,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1,
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 350, price: 0 },
          { min: 351, max: 3.5 * THOUSAND, price: 0.2 },
          { min: 3.5 * THOUSAND + 1, max: 35 * THOUSAND, price: 0.16 },
          { min: 35 * THOUSAND + 1, max: 350 * THOUSAND, price: 0.12 },
          { min: 350 * THOUSAND + 1, price: 0.08 }
        ]
      }
    }
  },
  testevent: {
    type: "event",
    id: "testevent",
    name: "Test event SKU",
    description: "TESTING PLACEHOLDER UNTIL WE GET A REAL EVENT SKU.",
    documentationUrl: "https://docs.mapbox.com/help/glossary/test-event/",
    subunitDescription: "thing",
    contactSalesThreshold: 1000000,
    pricing: {
      latest: {
        subunitsPerBillingUnit: 1000,
        pricingTiers: [
          { min: 1, max: 50000, price: 0 },
          { min: 50001, max: 100000, price: 500 },
          { min: 100001, max: 200000, price: 400 },
          { min: 200001, max: 1000000, price: 300 },
          { min: 1000001, max: 2000000, price: 250 },
          { min: 2000001, max: 20000000, price: 125 },
          { min: 20000001, price: 100 }
        ]
      },
      v1: {
        subunitsPerBillingUnit: 1000,
        description: "Older preview pricing",
        isPreview: true,
        pricingTiers: [
          { min: 1, max: 50000, price: 0 },
          { min: 50001, max: 100000, price: 500 },
          { min: 100001, max: 200000, price: 400 },
          { min: 200001, max: 1000000, price: 300 },
          { min: 1000001, max: 2000000, price: 250 },
          { min: 2000001, max: 20000000, price: 125 },
          { min: 20000001, price: 100 }
        ]
      }
    }
  }
};


export default function skuInvoice(skuId, subunitCount, { pricingVersion = "latest" } = {}) {
  const sku = skus[skuId];

  if (subunitCount === undefined) {
    throw new Error("subunitCount is required");
  }

  const pricingTiers = sku.pricing[pricingVersion].pricingTiers;
  const subunitsPerBillingUnit =
    sku.pricing[pricingVersion].subunitsPerBillingUnit;
  const isPreview = Boolean(sku.pricing[pricingVersion].isPreview);

  let outstandingSubunits = subunitCount;
  let totalCharge = 0;
  const invoiceTiers = [];
  for (let tierIndex = 0; tierIndex < pricingTiers.length; tierIndex++) {
    const tier = pricingTiers[tierIndex];
    const tierMax = tier.max === undefined ? Infinity : tier.max;
    // We add 1 to max - min because both bounds are inclusive.
    // E.g. 1-10 is 10 units; 10 - 1 = 9, so add 1.
    const tierSubunits = Math.min(outstandingSubunits, tierMax - tier.min + 1);
    // We don't calculate fractional SKUs, so round up.
    const tierSkus = Math.ceil(tierSubunits / subunitsPerBillingUnit);
    // Since we cannot charge fractional value of a cent, round up.
    const tierCharge = Math.ceil(tierSkus * tier.price);
    totalCharge += tierCharge;

    invoiceTiers.push({
      charge: tierCharge,
      formattedCharge: formatCents(tierCharge),
      subunits: tierSubunits,
      formattedSubunits: formatCount(tierSubunits),
      tierDescription: renderTierDescription(tier)
    });

    outstandingSubunits = outstandingSubunits - tierSubunits;
    if (outstandingSubunits <= 0) break;
  }

  const formattedTotalSubunits = [
    formatCount(subunitCount),
    pluralableSubunitDescription(sku, subunitCount)
  ].join(" ");

  const result = {
    totalCharge,
    formattedTotalCharge: formatCents(totalCharge),
    totalSubunits: subunitCount,
    formattedTotalSubunits,
    tiers: invoiceTiers,
    skuId: sku.id,
    skuName: sku.name
  };

  if (isPreview) {
    return Object.assign({}, result, {
      totalCharge: 0,
      formattedTotalCharge: formatCents(0),
      // stripe metadata only accepts strings
      isPreview: "yes",
      previewTotalCharge: totalCharge,
      previewFormattedTotalCharge: formatCents(totalCharge)
    });
  }

  return result;

  function renderTierDescription(tier) {
    if (tier.price === 0) {
      return [
        `up to ${formatCount(tier.max)} ${pluralableSubunitDescription(
          sku,
          2
        )}`,
        "free"
      ].join(" — ");
    }

    const maxPhrase = tier.max ? `to ${formatCount(tier.max)}` : "and up";

    return [
      `${formatCount(tier.min)} ${maxPhrase}`,
      `${formatCents(tier.price)} / ${formatCount(subunitsPerBillingUnit)}`
    ].join(" — ");
  }
}

// This is a very simple pluralization, so we need to be aware if
// new SKU subunit descriptions require more deliberate plurals.
function pluralableSubunitDescription(sku, count) {
  return count === 1 ? sku.subunitDescription : `${sku.subunitDescription}s`;
}
