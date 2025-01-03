import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Search, Plus, Upload } from 'lucide-react';
import { 
  Alert,
  AlertTitle,
  AlertDescription 
} from '@/components/ui/alert';

const EShopTrubus = () => {
  const [products, setProducts] = useState([
    { id: 1, name: 'Produk 1', price: 100000, stock: 10, image: '/api/placeholder/200/200' },
    { id: 2, name: 'Produk 2', price: 150000, stock: 15, image: '/api/placeholder/200/200' },
  ]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
  const [showUploadProof, setShowUploadProof] = useState(false);
  const [notification, setNotification] = useState(null);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showNotification('Produk ditambahkan ke keranjang');
  };

  const handleLikeProduct = () => {
    showNotification('Terima kasih, Barakallah fiikum');
  };

  const handleAdminLogin = () => {
    if (adminPassword === '123455') {
      setShowAdminPanel(true);
      setAdminPassword('');
    } else {
      showNotification('Password salah');
    }
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newProduct = {
      id: products.length + 1,
      name: formData.get('name'),
      price: parseFloat(formData.get('price')),
      stock: parseInt(formData.get('stock')),
      image: '/api/placeholder/200/200', // In real app, handle image upload
    };
    setProducts([...products, newProduct]);
    showNotification('Produk berhasil ditambahkan');
    event.target.reset();
  };

  const handlePayment = () => {
    const message = encodeURIComponent(
      `Assalamu'alaikum, saya telah melakukan pembayaran untuk pesanan dari E-Shop Trubus\n\n` +
      `Detail Pesanan:\n${cart.map(item => 
        `${item.name} x${item.quantity} = Rp${(item.price * item.quantity).toLocaleString()}`
      ).join('\n')}\n\nTotal: Rp${totalAmount.toLocaleString()}`
    );
    const waLink = `https://wa.me/6281532920683?text=${message}`;
    window.open(waLink, '_blank');
    setShowPaymentInfo(true);
    generatePDF();
  };

  const generatePDF = () => {
    // In a real application, implement PDF generation here
    const dummyPDF = new Blob(['Sample PDF content'], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(dummyPDF);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pesanan-eshop-trubus.pdf';
    a.click();
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">E-Shop Trubus v.1</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                className="p-2 border rounded"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button
              className="relative"
              onClick={() => setShowCart(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        {/* Admin Panel */}
        <div className="mb-8">
          {!showAdminPanel ? (
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="Admin password"
                className="p-2 border rounded"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAdminLogin}
              >
                Login Admin
              </button>
            </div>
          ) : (
            <form onSubmit={handleAddProduct} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-bold mb-4">Tambah Produk Baru</h2>
              <div className="grid gap-4">
                <input
                  name="name"
                  placeholder="Nama produk"
                  className="p-2 border rounded"
                  required
                />
                <input
                  name="price"
                  type="number"
                  placeholder="Harga"
                  className="p-2 border rounded"
                  required
                />
                <input
                  name="stock"
                  type="number"
                  placeholder="Stok"
                  className="p-2 border rounded"
                  required
                />
                <input
                  name="image"
                  type="file"
                  accept="image/*"
                  className="p-2 border rounded"
                  required
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Tambah Produk
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products
            .filter(product => 
              product.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map(product => (
              <div key={product.id} className="bg-white p-4 rounded shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-4"
                />
                <h3 className="text-lg font-bold">{product.name}</h3>
                <p className="text-gray-600">Rp{product.price.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Stok: {product.stock}</p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleAddToCart(product)}
                  >
                    Beli Sekarang
                  </button>
                  <button
                    className="text-red-500"
                    onClick={handleLikeProduct}
                  >
                    <Heart className="h-6 w-6" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Shopping Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Keranjang Belanja</h2>
              <button
                className="text-gray-500"
                onClick={() => setShowCart(false)}
              >
                ✕
              </button>
            </div>
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center mb-2">
                <div>
                  <h3>{item.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x Rp{item.price.toLocaleString()}
                  </p>
                </div>
                <p>Rp{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp{totalAmount.toLocaleString()}</span>
              </div>
              <button
                className="w-full bg-green-500 text-white py-2 rounded mt-4"
                onClick={handlePayment}
              >
                Bayar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Info Modal */}
      {showPaymentInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Informasi Pembayaran</h2>
            <p className="mb-4">
              Silahkan transfer ke rekening:
              <br />
              BSI 7177124359
              <br />
              a.n. Pondok Pesantren Trubus Iman
            </p>
            <div className="border-t pt-4">
              <h3 className="font-bold mb-2">Detail Pesanan:</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between mb-1">
                  <span>{item.name} x{item.quantity}</span>
                  <span>Rp{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="font-bold mt-2">
                Total: Rp{totalAmount.toLocaleString()}
              </div>
            </div>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded mt-4"
              onClick={() => setShowUploadProof(true)}
            >
              Upload Bukti Transfer
            </button>
            <button
              className="w-full border border-gray-300 py-2 rounded mt-2"
              onClick={() => setShowPaymentInfo(false)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Alert className="fixed bottom-4 right-4 max-w-md">
          <AlertTitle>Notifikasi</AlertTitle>
          <AlertDescription>{notification}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default EShopTrubus;
