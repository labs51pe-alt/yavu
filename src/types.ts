export type Role = 'client' | 'rider';

export type ServiceType = 'courier' | 'shopper' | 'food';

export type PackageSize = 'envelope' | 'small' | 'medium' | 'heavy';

export type HuancayoDistrict = 
  | 'El Tambo' 
  | 'Huancayo Centro' 
  | 'Chilca' 
  | 'San Carlos' 
  | 'Pilcomayo' 
  | 'Huancán' 
  | 'Sapallanga' 
  | 'San Jerónimo' 
  | 'Cajas';

export type OrderStatus = 
  | 'created' 
  | 'searching_rider' 
  | 'rider_assigned' 
  | 'at_pickup' 
  | 'in_transit' 
  | 'at_destination' 
  | 'delivered' 
  | 'cancelled';

export type Screen = 
  | 'splash' 
  | 'onboarding' 
  | 'role-selection'
  | 'client-home'
  | 'courier-new'
  | 'shopper-new'
  | 'food-catalog'
  | 'order-tracking'
  | 'order-history'
  | 'price-calculator'
  | 'security-hub'
  | 'profile'
  | 'rider-dashboard'
  | 'rider-active-delivery'
  | 'rider-earnings';

export interface LocationPoint {
  address: string;
  district: HuancayoDistrict;
  reference?: string;
  lat: number;
  lng: number;
}

export interface MotorizadoRider {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  rating: number;
  completedDeliveries: number;
  motorcycleModel: string;
  plate: string;
  soatCompany: string;
  soatValidUntil: string;
  licenseNumber: string;
  helmetCertified: boolean;
  currentLat: number;
  currentLng: number;
  isAvailable: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  role: Role;
  dni?: string;
  district?: HuancayoDistrict;
  isVerified: boolean;
  loginMethod: 'phone' | 'google' | 'rider_dni' | 'guest';
  // If rider
  motorcycleModel?: string;
  plate?: string;
  soatValidUntil?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

export interface RestaurantStore {
  id: string;
  name: string;
  category: 'Pollería' | 'Comida Huancaína' | 'Chifa' | 'Pizzería' | 'Cafetería & Panadería' | 'Farmacia' | 'Supermercado';
  address: string;
  district: HuancayoDistrict;
  rating: number;
  deliveryTimeMin: number;
  deliveryFee: number;
  image: string;
  isOpen: boolean;
  items: MenuItem[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  notes?: string;
}

export interface DeliveryOrder {
  id: string;
  serviceType: ServiceType;
  title: string;
  pickup: LocationPoint;
  destination: LocationPoint;
  
  // Courier specific
  packageSize?: PackageSize;
  isFragile?: boolean;
  packageDescription?: string;
  senderName: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  
  // Shopper specific
  shopperStoreName?: string;
  shopperItemList?: string;
  shopperEstimatedBudget?: number;
  
  // Food specific
  restaurantId?: string;
  restaurantName?: string;
  cartItems?: CartItem[];
  
  // Pricing & Security
  distanceKm: number;
  estimatedMinutes: number;
  basePrice: number;
  serviceFee: number;
  deliveryPrice: number;
  itemsPrice?: number;
  totalPrice: number;
  
  paymentMethod: 'yape' | 'plin' | 'cash';
  securityPin: string; // 4-digit code receiver must provide to rider
  
  status: OrderStatus;
  createdAt: string;
  rider?: MotorizadoRider;
  deliveryProofPhoto?: string;
  clientRating?: number;
  clientFeedback?: string;
}
