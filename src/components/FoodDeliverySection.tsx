import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Star, 
  Clock, 
  Plus, 
  Minus, 
  ShoppingBag, 
  X, 
  ArrowRight, 
  MapPin, 
  Sparkles,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { RestaurantStore, MenuItem, CartItem, DeliveryOrder, LocationPoint } from '../types';
import { MOCK_RESTAURANTS, MOCK_RIDERS } from '../data/huancayoData';
import { LocationSearchInput } from './LocationSearchInput';

interface FoodDeliverySectionProps {
  onOrderCreated: (order: DeliveryOrder) => void;
  onBack: () => void;
}

export const FoodDeliverySection: React.FC<FoodDeliverySectionProps> = ({ onOrderCreated, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantStore | null>(null);
  const [cart, setCart] = useState<{ [restaurantId: string]: CartItem[] }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [deliveryLocation, setDeliveryLocation] = useState<LocationPoint | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const categories = ['Todos', 'Pollerías', 'Comida Huancaína', 'Chifa', 'Pizzería', 'Farmacia'];

  const filteredRestaurants = MOCK_RESTAURANTS.filter((r) => {
    if (selectedCategory === 'Todos') return true;
    return r.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // Calculate items in current active restaurant cart
  const currentCartItems = activeRestaurant ? cart[activeRestaurant.id] || [] : [];
  const currentCartCount = currentCartItems.reduce((acc, c) => acc + c.quantity, 0);
  const currentCartTotal = currentCartItems.reduce((acc, c) => acc + c.item.price * c.quantity, 0);

  const addToCart = (restaurant: RestaurantStore, item: MenuItem) => {
    const existing = cart[restaurant.id] || [];
    const itemIndex = existing.findIndex((c) => c.item.id === item.id);

    if (itemIndex > -1) {
      const updated = [...existing];
      updated[itemIndex].quantity += 1;
      setCart({ ...cart, [restaurant.id]: updated });
    } else {
      setCart({ ...cart, [restaurant.id]: [...existing, { item, quantity: 1 }] });
    }
  };

  const updateQuantity = (restaurantId: string, itemId: string, delta: number) => {
    const existing = cart[restaurantId] || [];
    const updated = existing
      .map((c) => {
        if (c.item.id === itemId) {
          return { ...c, quantity: c.quantity + delta };
        }
        return c;
      })
      .filter((c) => c.quantity > 0);

    setCart({ ...cart, [restaurantId]: updated });
  };

  const handleCheckout = (restaurant: RestaurantStore) => {
    const items = cart[restaurant.id] || [];
    if (items.length === 0) return;

    if (!deliveryLocation || !deliveryLocation.address.trim()) {
      setCheckoutError('Por favor ingresa o busca la dirección de entrega en Huancayo.');
      return;
    }

    const itemsPrice = items.reduce((acc, c) => acc + c.item.price * c.quantity, 0);
    const deliveryFee = restaurant.deliveryFee;
    const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
    const orderId = `YAVU-FOOD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: DeliveryOrder = {
      id: orderId,
      serviceType: 'food',
      title: `${restaurant.name}: ${items[0].item.name}${items.length > 1 ? ` y ${items.length - 1} más` : ''}`,
      pickup: {
        address: restaurant.address,
        district: restaurant.district,
        lat: -12.0660,
        lng: -75.2110,
      },
      destination: deliveryLocation,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      cartItems: items,
      distanceKm: 3.2,
      estimatedMinutes: restaurant.deliveryTimeMin,
      basePrice: 4.00,
      serviceFee: 1.00,
      deliveryPrice: deliveryFee,
      itemsPrice,
      totalPrice: itemsPrice + deliveryFee,
      paymentMethod: 'yape',
      securityPin: generatedPin,
      status: 'searching_rider',
      createdAt: 'Ahora mismo',
      senderName: restaurant.name,
      senderPhone: 'Central Huancayo',
      receiverName: 'Cliente YAVU',
      receiverPhone: '964 888 777',
      rider: MOCK_RIDERS[0],
    };

    setIsCartOpen(false);
    onOrderCreated(newOrder);
  };

  return (
    <div className="space-y-5 pb-32">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-zipp-red/15 via-zipp-yellow/10 to-transparent border border-zipp-red/30 p-4 rounded-3xl flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zipp-red text-white flex items-center justify-center font-black shadow-lg shadow-zipp-red/30">
            <Utensils size={24} />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-lg text-zipp-text">Restaurantes & Gastronomía Huancaína</h3>
            <p className="text-xs text-zipp-text-muted">Delivery express en moto directo a tu puerta</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? 'bg-zipp-red text-white border-zipp-red shadow-md shadow-zipp-red/30'
                : 'bg-zipp-surface border-zipp-border text-zipp-text-muted hover:border-zipp-red/30 hover:text-zipp-text'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* If looking at restaurant menu */}
      {activeRestaurant ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveRestaurant(null)}
              className="text-xs font-bold text-zipp-yellow flex items-center gap-1 hover:underline"
            >
              ← Volver a todos los restaurantes
            </button>
            <span className="text-[10px] font-bold text-zipp-text-muted">
              {activeRestaurant.district}
            </span>
          </div>

          {/* Restaurant Banner Card */}
          <div className="relative rounded-3xl overflow-hidden border border-zipp-border h-44 shadow-md">
            <img
              src={activeRestaurant.image}
              alt={activeRestaurant.name}
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 flex flex-col justify-end">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-zipp-red text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                  {activeRestaurant.category}
                </span>
                <span className="flex items-center gap-1 bg-black/70 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full backdrop-blur-md">
                  <Star size={12} fill="currentColor" /> {activeRestaurant.rating}
                </span>
              </div>
              <h2 className="font-display font-black text-2xl text-white leading-tight">
                {activeRestaurant.name}
              </h2>
              <div className="flex items-center gap-3 text-xs text-white/80 mt-1">
                <span className="flex items-center gap-1">
                  <Clock size={12} /> {activeRestaurant.deliveryTimeMin} min
                </span>
                <span>•</span>
                <span className="text-white font-bold">Delivery S/ {activeRestaurant.deliveryFee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-zipp-text-muted">
              Platos & Productos Disponibles
            </h4>
            {activeRestaurant.items.map((item) => {
              const inCart = currentCartItems.find((c) => c.item.id === item.id);
              return (
                <div
                  key={item.id}
                  className="bg-zipp-surface border border-zipp-border rounded-2xl p-4 flex gap-4 items-center justify-between hover:border-zipp-red/30 transition-all shadow-sm"
                >
                  <div className="flex-1 space-y-1">
                    {item.popular && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-amber-500/15 text-amber-500 px-2 py-0.5 rounded-full border border-amber-500/30">
                        🔥 Más pedido en Huancayo
                      </span>
                    )}
                    <h5 className="font-bold text-sm text-zipp-text">{item.name}</h5>
                    <p className="text-[11px] text-zipp-text-muted line-clamp-2">{item.description}</p>
                    <div className="text-sm font-black text-zipp-yellow pt-1">
                      S/ {item.price.toFixed(2)}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover border border-zipp-border"
                    />
                    {inCart ? (
                      <div className="flex items-center gap-2 bg-zipp-surface-2 border border-zipp-red/30 rounded-xl p-1">
                        <button
                          onClick={() => updateQuantity(activeRestaurant.id, item.id, -1)}
                          className="w-6 h-6 rounded-lg bg-zipp-surface-3 flex items-center justify-center text-zipp-text text-xs hover:bg-zipp-red hover:text-white"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-black text-zipp-text px-1">{inCart.quantity}</span>
                        <button
                          onClick={() => updateQuantity(activeRestaurant.id, item.id, 1)}
                          className="w-6 h-6 rounded-lg bg-zipp-red flex items-center justify-center text-white text-xs"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => addToCart(activeRestaurant, item)}
                        className="bg-zipp-red text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md shadow-zipp-red/20 hover:brightness-110 flex items-center gap-1"
                      >
                        <Plus size={12} /> Pedir
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Restaurant Cards Grid */
        <div className="space-y-4">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => setActiveRestaurant(restaurant)}
              className="bg-zipp-surface border border-zipp-border hover:border-zipp-red/40 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 group shadow-md"
            >
              <div className="h-36 relative overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-90"
                />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-amber-400 font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10">
                  <Star size={12} fill="currentColor" /> {restaurant.rating}
                </div>
                <div className="absolute bottom-3 left-3 bg-zipp-red text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                  {restaurant.category}
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-extrabold text-base text-zipp-text group-hover:text-zipp-red transition-colors">
                    {restaurant.name}
                  </h4>
                  <ChevronRight size={18} className="text-zipp-text-muted group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="flex items-center gap-3 text-xs text-zipp-text-muted">
                  <span className="flex items-center gap-1">
                    <Clock size={12} className="text-amber-500" /> {restaurant.deliveryTimeMin} min en moto
                  </span>
                  <span>•</span>
                  <span>📍 {restaurant.district}</span>
                  <span>•</span>
                  <span className="text-zipp-text font-bold">Delivery S/ {restaurant.deliveryFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating Cart Pill Bar */}
      {activeRestaurant && currentCartCount > 0 && (
        <div className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onClick={() => setIsCartOpen(true)}
            className="bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white p-4 rounded-2xl shadow-2xl shadow-zipp-red/50 flex items-center justify-between cursor-pointer border border-white/20 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
                {currentCartCount}
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider">Ver Canasta de Pedido</div>
                <div className="text-[11px] text-white/80">{activeRestaurant.name}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-display font-black text-base">
                S/ {(currentCartTotal + activeRestaurant.deliveryFee).toFixed(2)}
              </span>
              <ArrowRight size={18} />
            </div>
          </motion.div>
        </div>
      )}

      {/* Checkout Bottom Sheet Modal */}
      <AnimatePresence>
        {isCartOpen && activeRestaurant && (
          <div className="fixed inset-0 z-[200] flex items-end justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full max-w-md bg-zipp-surface border border-zipp-red/30 rounded-t-[36px] p-6 pb-10 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-zipp-border">
                <div>
                  <h3 className="font-display font-black text-lg text-zipp-text">Tu Pedido en {activeRestaurant.name}</h3>
                  <p className="text-xs text-zipp-text-muted">{currentCartCount} productos seleccionados</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-8 h-8 rounded-full bg-zipp-surface-2 flex items-center justify-center text-zipp-text-muted hover:text-zipp-text"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {currentCartItems.map((c) => (
                  <div key={c.item.id} className="flex justify-between items-center bg-zipp-surface-2 border border-zipp-border p-3 rounded-xl">
                    <div>
                      <div className="text-xs font-bold text-zipp-text">{c.quantity}x {c.item.name}</div>
                      <div className="text-[10px] text-zipp-text-muted">S/ {c.item.price.toFixed(2)} c/u</div>
                    </div>
                    <div className="text-xs font-black text-zipp-yellow">
                      S/ {(c.item.price * c.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address in Huancayo */}
              <div className="pt-2">
                <LocationSearchInput
                  label="Dirección de Entrega en Huancayo"
                  placeholder="Escribe calle, urbanización o busca en el mapa..."
                  pointType="destination"
                  selectedLocation={deliveryLocation}
                  onLocationChange={(loc) => {
                    setDeliveryLocation(loc);
                    if (checkoutError) setCheckoutError(null);
                  }}
                  required
                />
              </div>

              {checkoutError && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center gap-2 text-xs font-bold text-red-500">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 pt-2 border-t border-zipp-border text-xs">
                <div className="flex justify-between text-zipp-text-muted">
                  <span>Subtotal comida:</span>
                  <span className="text-zipp-text font-medium">S/ {currentCartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zipp-text-muted">
                  <span>Delivery express en moto:</span>
                  <span className="text-zipp-text font-medium">S/ {activeRestaurant.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-baseline pt-2 border-t border-zipp-border text-base font-black">
                  <span className="text-zipp-text">Total a pagar (Yape / Efectivo):</span>
                  <span className="text-zipp-yellow text-xl">
                    S/ {(currentCartTotal + activeRestaurant.deliveryFee).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Confirm button */}
              <button
                onClick={() => handleCheckout(activeRestaurant)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-zipp-red to-zipp-red-dark text-white font-display font-black text-sm shadow-xl shadow-zipp-red/30 hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>Confirmar Pedido & Enviar Moto</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
