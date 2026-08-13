import { LocationPoint, MotorizadoRider, RestaurantStore, DeliveryOrder, HuancayoDistrict, PackageSize } from '../types';

export const HUANCAYO_HOTSPOTS: LocationPoint[] = [
  {
    address: 'Real Plaza Huancayo, Av. Ferrocarril 1035',
    district: 'Huancayo Centro',
    reference: 'Frente a la estación del tren',
    lat: -12.0655,
    lng: -75.2120,
  },
  {
    address: 'Plaza Constitución, Calle Real cdra 5',
    district: 'Huancayo Centro',
    reference: 'Catedral de Huancayo',
    lat: -12.0683,
    lng: -75.2100,
  },
  {
    address: 'Parque Huamanmarca, Calle Real / Jr. Puno',
    district: 'Huancayo Centro',
    reference: 'Frente a la Municipalidad Provincial de Huancayo',
    lat: -12.0722,
    lng: -75.2084,
  },
  {
    address: 'UNCP - Universidad Nacional del Centro del Perú',
    district: 'El Tambo',
    reference: 'Av. Mariscal Castilla 3909',
    lat: -12.0321,
    lng: -75.2340,
  },
  {
    address: 'Universidad Continental (Campus Huancayo)',
    district: 'San Carlos',
    reference: 'Av. San Carlos 1980',
    lat: -12.0560,
    lng: -75.1920,
  },
  {
    address: 'Universidad Peruana Los Andes (UPLA)',
    district: 'Huancayo Centro',
    reference: 'Av. Giráldez 230 / Chorrillos',
    lat: -12.0630,
    lng: -75.2050,
  },
  {
    address: 'Hospital Nacional Ramiro Prialé Prialé (EsSalud)',
    district: 'El Tambo',
    reference: 'Av. Independencia s/n',
    lat: -12.0512,
    lng: -75.2185,
  },
  {
    address: 'Hospital Regional Docente Daniel Alcides Carrión',
    district: 'Huancayo Centro',
    reference: 'Av. San Carlos 1400',
    lat: -12.0610,
    lng: -75.1980,
  },
  {
    address: 'Hospital Materno Infantil El Carmen',
    district: 'Huancayo Centro',
    reference: 'Jr. Puno 950',
    lat: -12.0740,
    lng: -75.2040,
  },
  {
    address: 'Open Plaza Huancayo, Av. Ferrocarril / Jr. San Martín',
    district: 'Huancayo Centro',
    reference: 'Zona comercial Tottus & Sodimac',
    lat: -12.0580,
    lng: -75.2145,
  },
  {
    address: 'Mercado Mayorista Maltería de Huancayo',
    district: 'El Tambo',
    reference: 'Av. Huancavelica cdra 18',
    lat: -12.0490,
    lng: -75.2230,
  },
  {
    address: 'Terminal Terrestre Huancayo',
    district: 'El Tambo',
    reference: 'Av. Evitamiento y Av. Mariscal Castilla',
    lat: -12.0395,
    lng: -75.2300,
  },
  {
    address: 'Parque de la Identidad Huanca',
    district: 'San Carlos',
    reference: 'Jr. San Fernando / Jr. Santa Rosa',
    lat: -12.0540,
    lng: -75.1950,
  },
  {
    address: 'Parque de los Sombreros',
    district: 'El Tambo',
    reference: 'Av. Huancavelica y Av. Julio Sumar',
    lat: -12.0430,
    lng: -75.2280,
  },
  {
    address: 'Parque Bolognesi (El Tambo)',
    district: 'El Tambo',
    reference: 'Av. Mariscal Castilla y Jr. Bolognesi',
    lat: -12.0480,
    lng: -75.2220,
  },
  {
    address: 'Calle Real y Jr. 9 de Diciembre (Chilca)',
    district: 'Chilca',
    reference: 'Parque Los Héroes Chilca',
    lat: -12.0850,
    lng: -75.2020,
  },
  {
    address: 'Municipalidad Distrital de Chilca',
    district: 'Chilca',
    reference: 'Jr. Mariano Melgar 425',
    lat: -12.0880,
    lng: -75.2010,
  },
  {
    address: 'Puente Pilcomayo / Entrada a Chupaca',
    district: 'Pilcomayo',
    reference: 'Carretera Central Oeste',
    lat: -12.0520,
    lng: -75.2500,
  },
  {
    address: 'Plaza Principal de Pilcomayo',
    district: 'Pilcomayo',
    reference: 'Av. Las Palmas s/n',
    lat: -12.0495,
    lng: -75.2530,
  },
  {
    address: 'Mercado Modelo de Huancayo',
    district: 'Huancayo Centro',
    reference: 'Jr. Mantaro y Jr. Calixto',
    lat: -12.0710,
    lng: -75.2140,
  },
  {
    address: 'Mercado Raez Patiño',
    district: 'Huancayo Centro',
    reference: 'Jr. Ferrocarril y Jr. Cajamarca',
    lat: -12.0695,
    lng: -75.2115,
  },
  {
    address: 'Estadio Huancayo (IPD)',
    district: 'Huancayo Centro',
    reference: 'Av. Giráldez / Jr. Huancavelica',
    lat: -12.0620,
    lng: -75.2060,
  },
  {
    address: 'Urb. San Carlos - Av. Cantuta / Jr. Los Rosales',
    district: 'San Carlos',
    reference: 'Zona residencial San Carlos',
    lat: -12.0565,
    lng: -75.1975,
  },
  {
    address: 'Plaza Principal de San Jerónimo de Tunán',
    district: 'San Jerónimo',
    reference: 'Cuna de los orfebres de plata',
    lat: -11.9560,
    lng: -75.2850,
  },
  {
    address: 'Sapallanga Plaza Principal',
    district: 'Sapallanga',
    reference: 'Santuario Virgen de Cocharcas',
    lat: -12.1260,
    lng: -75.1850,
  },
  {
    address: 'Huancán - Av. Panamericana Sur',
    district: 'Huancán',
    reference: 'Entrada principal a Huancán',
    lat: -12.1020,
    lng: -75.1950,
  }
];

export const HUANCAYO_DISTRICTS: HuancayoDistrict[] = [
  'Huancayo Centro',
  'El Tambo',
  'Chilca',
  'San Carlos',
  'Pilcomayo',
  'San Jerónimo',
  'Cajas',
  'Sapallanga',
  'Huancán',
];

export function guessDistrictFromText(text: string): HuancayoDistrict {
  const lower = text.toLowerCase();
  if (lower.includes('tambo') || lower.includes('uncp') || lower.includes('malter') || lower.includes('sombreros') || lower.includes('priale') || lower.includes('independencia') || lower.includes('evitamiento') || lower.includes('bolognesi') || lower.includes('julio sumar')) {
    return 'El Tambo';
  }
  if (lower.includes('chilca') || lower.includes('9 de diciembre') || lower.includes('heroes') || lower.includes('mariano melgar') || lower.includes('azapampa')) {
    return 'Chilca';
  }
  if (lower.includes('san carlos') || lower.includes('continental') || lower.includes('cantuta') || lower.includes('rosales') || lower.includes('identidad')) {
    return 'San Carlos';
  }
  if (lower.includes('pilcomayo') || lower.includes('chupaca') || lower.includes('palmas') || lower.includes('puente')) {
    return 'Pilcomayo';
  }
  if (lower.includes('sapallanga') || lower.includes('cocharcas')) {
    return 'Sapallanga';
  }
  if (lower.includes('huancan') || lower.includes('huancán')) {
    return 'Huancán';
  }
  if (lower.includes('san jeronimo') || lower.includes('san jerónimo')) {
    return 'San Jerónimo';
  }
  if (lower.includes('cajas')) {
    return 'Cajas';
  }
  return 'Huancayo Centro';
}

export function searchHuancayoLocations(query: string): LocationPoint[] {
  if (!query || !query.trim()) {
    return HUANCAYO_HOTSPOTS.slice(0, 8);
  }
  const clean = query.toLowerCase().trim();
  const matched = HUANCAYO_HOTSPOTS.filter((h) => 
    h.address.toLowerCase().includes(clean) ||
    h.district.toLowerCase().includes(clean) ||
    (h.reference && h.reference.toLowerCase().includes(clean))
  );

  if (matched.length > 0) return matched;

  // If not matched, generate a dynamic location object with guessed district
  const district = guessDistrictFromText(query);
  return [
    {
      address: query,
      district,
      reference: 'Dirección personalizada en Huancayo',
      lat: -12.0683,
      lng: -75.2100,
    },
    ...HUANCAYO_HOTSPOTS.slice(0, 4)
  ];
}

export function reverseGeocodeHuancayo(lat: number, lng: number): LocationPoint {
  // Find closest hotspot to coordinates
  let closest = HUANCAYO_HOTSPOTS[0];
  let minDistance = 999999;

  for (const spot of HUANCAYO_HOTSPOTS) {
    const d = Math.sqrt(Math.pow(spot.lat - lat, 2) + Math.pow(spot.lng - lng, 2));
    if (d < minDistance) {
      minDistance = d;
      closest = spot;
    }
  }

  // If very close, return it; otherwise return nearby address with coordinates
  if (minDistance < 0.005) {
    return closest;
  }

  // Guess district based on latitude
  let district: HuancayoDistrict = 'Huancayo Centro';
  if (lat > -12.052) {
    district = lng < -75.24 ? 'Pilcomayo' : 'El Tambo';
  } else if (lat < -12.078) {
    district = lat < -12.11 ? 'Sapallanga' : 'Chilca';
  } else {
    district = lng > -75.200 ? 'San Carlos' : 'Huancayo Centro';
  }

  return {
    address: `Punto en ${district} (Calle / Av. de Huancayo)`,
    district,
    reference: `Coordenadas: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    lat,
    lng,
  };
}

export const MOCK_RIDERS: MotorizadoRider[] = [
  {
    id: 'rider-1',
    name: 'Marco Quispe Cárdenas',
    phone: '+51 964 123 456',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    rating: 4.95,
    completedDeliveries: 1420,
    motorcycleModel: 'Honda CB 125F (Roja)',
    plate: 'W3-5892',
    soatCompany: 'La Positiva Seguros',
    soatValidUntil: '15/12/2026',
    licenseNumber: 'B-IIc 45982103',
    helmetCertified: true,
    currentLat: -12.0670,
    currentLng: -75.2110,
    isAvailable: true,
  },
  {
    id: 'rider-2',
    name: 'Raúl Huamán Tacunan',
    phone: '+51 954 789 123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 4.88,
    completedDeliveries: 890,
    motorcycleModel: 'Bajaj Pulsar 150 (Negro Mate)',
    plate: '4512-4W',
    soatCompany: 'Rímac Seguros',
    soatValidUntil: '20/10/2026',
    licenseNumber: 'B-IIc 71029384',
    helmetCertified: true,
    currentLat: -12.0450,
    currentLng: -75.2260,
    isAvailable: true,
  },
  {
    id: 'rider-3',
    name: 'Brayan Canchanya Ramos',
    phone: '+51 988 321 654',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 4.98,
    completedDeliveries: 2150,
    motorcycleModel: 'Yamaha FZ-FI 150 (Azul/Negro)',
    plate: 'W1-9034',
    soatCompany: 'Pacífico Seguros',
    soatValidUntil: '08/04/2027',
    licenseNumber: 'B-IIc 38920194',
    helmetCertified: true,
    currentLat: -12.0730,
    currentLng: -75.2070,
    isAvailable: true,
  }
];

export const MOCK_RESTAURANTS: RestaurantStore[] = [
  {
    id: 'rest-1',
    name: 'Pollería El Mesón Wanka',
    category: 'Pollería',
    address: 'Av. Giráldez 284, Huancayo Centro',
    district: 'Huancayo Centro',
    rating: 4.9,
    deliveryTimeMin: 22,
    deliveryFee: 4.5,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    items: [
      {
        id: 'p1',
        name: '1 Pollo a la Brasa + Papas Nativas Huancaínas',
        description: 'Crujiente pollo con aderezo secreto, papas nativas fritas, ensalada clásica y todas las cremas caseras (ají wanka y vinagreta).',
        price: 58.00,
        category: 'Pollos',
        popular: true,
        image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'p2',
        name: '1/2 Pollo a la Brasa + Papas + Ensalada',
        description: 'Medio pollo dorado con crocantes papas huancaínas y salsas al gusto.',
        price: 32.00,
        category: 'Pollos',
        popular: true,
        image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'p3',
        name: '1/4 Pollo Parte Pecho con Papas',
        description: 'Cuarto de pollo generoso con abundante papa frita y ensalada.',
        price: 18.00,
        category: 'Pollos',
        image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'p4',
        name: 'Inca Kola 1.5 Litros Helada',
        description: 'Bebida gaseosa helada para acompañar tu almuerzo o cena.',
        price: 8.50,
        category: 'Bebidas',
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&auto=format&fit=crop&q=80',
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Tradición Wanka & Típicos',
    category: 'Comida Huancaína',
    address: 'Jr. Puno 420, Plaza Huamanmarca',
    district: 'Huancayo Centro',
    rating: 4.85,
    deliveryTimeMin: 28,
    deliveryFee: 5.0,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    items: [
      {
        id: 'tw1',
        name: 'Pachamanca 3 Carnes (Cerdo, Res, Pollo)',
        description: 'Elaborada en olla de barro con habas, camote, choclo tierno, papas huancaínas y humita dulce tradicional.',
        price: 36.00,
        category: 'Platos Típicos',
        popular: true,
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'tw2',
        name: 'Trucha Frita Dorada del Río Mantaro',
        description: 'Fresca trucha dorada acompañada de papas doradas, arroz graneado, ensalada fresca y salsa criolla.',
        price: 24.00,
        category: 'Pescados',
        popular: true,
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'tw3',
        name: 'Papa a la Huancaína Clásica',
        description: 'Papas nativas sancochadas bañadas en cremosa salsa a base de ají amarillo, queso fresco del valle y leche, decorada con huevo y aceituna.',
        price: 15.00,
        category: 'Entradas',
        popular: true,
        image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=300&auto=format&fit=crop&q=80',
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Chifa Dragón Dorado Huancayo',
    category: 'Chifa',
    address: 'Av. Mariscal Castilla 1420, El Tambo',
    district: 'El Tambo',
    rating: 4.75,
    deliveryTimeMin: 20,
    deliveryFee: 4.0,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    items: [
      {
        id: 'ch1',
        name: 'Chaufa Especial de 3 Carnes',
        description: 'Arroz al wok con pollo tierno, lomo de res, chancho asado al estilo oriental y wantanes fritos.',
        price: 22.00,
        category: 'Chaufas',
        popular: true,
        image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'ch2',
        name: 'Aeropuerto Combinado con Tallarín',
        description: 'Generosa porción de arroz chaufa combinado con tallarín saltado criollo y huevo montado.',
        price: 24.00,
        category: 'Combinados',
        image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'ch3',
        name: 'Sopa Wantan Especial Familiar',
        description: 'Caldo reconfortante con wantanes rellenos, verduras chinas, pollo, chancho y huevo de codorniz.',
        price: 20.00,
        category: 'Sopas',
        image: 'https://images.unsplash.com/photo-1547928576-a4a33237cbc3?w=300&auto=format&fit=crop&q=80',
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Pizzería & Trattoria Di Fiori',
    category: 'Pizzería',
    address: 'Jr. San Carlos 412, San Carlos',
    district: 'San Carlos',
    rating: 4.88,
    deliveryTimeMin: 25,
    deliveryFee: 4.5,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    items: [
      {
        id: 'pz1',
        name: 'Pizza Familiar Huancaína Especial (Masa Artesanal)',
        description: 'Queso mozzarella del valle, lomo saltado flameado, toques de ají amarillo suave y cebollas caramelizadas.',
        price: 45.00,
        category: 'Pizzas Especiales',
        popular: true,
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'pz2',
        name: 'Pizza Americana Familiar',
        description: 'Masa fina a la piedra con salsa pomodoro casera, queso mozzarella fundido y jamón inglés.',
        price: 36.00,
        category: 'Pizzas Clásicas',
        image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&auto=format&fit=crop&q=80',
      }
    ]
  },
  {
    id: 'rest-5',
    name: 'Farmacias Express Huancayo',
    category: 'Farmacia',
    address: 'Calle Real 620, Huancayo Centro',
    district: 'Huancayo Centro',
    rating: 4.95,
    deliveryTimeMin: 15,
    deliveryFee: 4.0,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80',
    isOpen: true,
    items: [
      {
        id: 'fm1',
        name: 'Kit Antigripal & Alivio Inmediato',
        description: 'Panadol Antigripal NF (10 tabletas) + Vitamina C efervescente + Té con miel.',
        price: 18.50,
        category: 'Medicinas',
        popular: true,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80',
      },
      {
        id: 'fm2',
        name: 'Termómetro Digital Rápido',
        description: 'Medición precisa en 10 segundos con alarma de fiebre y estuche rígido.',
        price: 15.00,
        category: 'Cuidado Personal',
        image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80',
      }
    ]
  }
];

export const INITIAL_ORDERS: DeliveryOrder[] = [
  {
    id: 'YAVU-7821',
    serviceType: 'courier',
    title: 'Envío de Documentos Notariales',
    pickup: {
      address: 'Notaría Rodríguez, Jr. Puno 340',
      district: 'Huancayo Centro',
      lat: -12.0690,
      lng: -75.2095,
    },
    destination: {
      address: 'Facultad de Derecho UNCP, Av. Mariscal Castilla 3909',
      district: 'El Tambo',
      lat: -12.0321,
      lng: -75.2340,
    },
    packageSize: 'envelope',
    packageDescription: 'Sobre manila cerrado con documentos de grado',
    isFragile: false,
    senderName: 'Dra. Patricia Gómez',
    senderPhone: '+51 964 888 111',
    receiverName: 'Lic. Jorge Valerio',
    receiverPhone: '+51 954 222 333',
    distanceKm: 4.8,
    estimatedMinutes: 14,
    basePrice: 4.00,
    serviceFee: 1.00,
    deliveryPrice: 8.50,
    totalPrice: 8.50,
    paymentMethod: 'yape',
    securityPin: '4829',
    status: 'delivered',
    createdAt: 'Hoy, 10:45 AM',
    rider: MOCK_RIDERS[0],
    deliveryProofPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=300&auto=format&fit=crop&q=80',
    clientRating: 5,
    clientFeedback: '¡Llegó súper rápido a El Tambo! Muy amable el motorizado.',
  },
  {
    id: 'YAVU-7822',
    serviceType: 'food',
    title: '1 Pollo a la Brasa + Papas Nativas',
    pickup: {
      address: 'Pollería El Mesón Wanka, Av. Giráldez 284',
      district: 'Huancayo Centro',
      lat: -12.0660,
      lng: -75.2110,
    },
    destination: {
      address: 'Jr. Los Rosales 245, Urb. San Carlos',
      district: 'San Carlos',
      lat: -12.0570,
      lng: -75.1970,
    },
    restaurantId: 'rest-1',
    restaurantName: 'Pollería El Mesón Wanka',
    senderName: 'Pollería El Mesón Wanka',
    senderPhone: '064-213456',
    receiverName: 'Ana Lucía Méndez',
    receiverPhone: '+51 964 555 444',
    cartItems: [
      {
        item: MOCK_RESTAURANTS[0].items[0],
        quantity: 1,
        notes: 'Papas bien doradas y ají extra por favor',
      }
    ],
    distanceKm: 2.3,
    estimatedMinutes: 11,
    basePrice: 4.00,
    serviceFee: 1.00,
    deliveryPrice: 5.50,
    itemsPrice: 58.00,
    totalPrice: 63.50,
    paymentMethod: 'yape',
    securityPin: '9174',
    status: 'in_transit',
    createdAt: 'Hace 8 min',
    rider: MOCK_RIDERS[1],
  }
];

export function calculateDeliveryRate(pickupDistrict: string, destDistrict: string, size: string = 'small'): { distanceKm: number; estMin: number; price: number } {
  // Approximate matrix between Huancayo districts
  const isSameDistrict = pickupDistrict === destDistrict;
  let distanceKm = 2.0;
  let estMin = 8;
  let price = 4.50;

  if (!isSameDistrict) {
    if (
      (pickupDistrict === 'Huancayo Centro' && destDistrict === 'El Tambo') ||
      (pickupDistrict === 'El Tambo' && destDistrict === 'Huancayo Centro')
    ) {
      distanceKm = 4.2;
      estMin = 14;
      price = 7.00;
    } else if (
      (pickupDistrict === 'Huancayo Centro' && destDistrict === 'Chilca') ||
      (pickupDistrict === 'Chilca' && destDistrict === 'Huancayo Centro')
    ) {
      distanceKm = 3.8;
      estMin = 12;
      price = 6.50;
    } else if (
      (pickupDistrict === 'El Tambo' && destDistrict === 'Chilca') ||
      (pickupDistrict === 'Chilca' && destDistrict === 'El Tambo')
    ) {
      distanceKm = 7.5;
      estMin = 22;
      price = 11.00;
    } else if (pickupDistrict === 'Pilcomayo' || destDistrict === 'Pilcomayo') {
      distanceKm = 8.0;
      estMin = 25;
      price = 12.50;
    } else {
      distanceKm = 5.0;
      estMin = 16;
      price = 8.50;
    }
  }

  // Size adjust
  if (size === 'envelope') price = Math.max(4.00, price - 0.50);
  if (size === 'medium') price += 2.00;
  if (size === 'heavy') price += 4.00;

  return { distanceKm, estMin, price };
}
