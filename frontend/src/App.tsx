import { BookCheck, Menu, Package, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';
import { TabButton } from './components/TabButton';
import Inventory from './views/Inventory';
import Orders from './views/Orders';
import Recipes from './views/Recipes';

function App() {
  const [tab, setTab] = useState<'orders' | 'inventory' | 'recipes'>('orders');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Mobile header */}
      <header
        data-role="mobile-header"
        className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-b-gray-200 bg-white px-4 sm:static md:hidden"
      >
        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-900 hover:bg-gray-100 md:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-semibold">
            {tab === 'orders' && 'Ordenes'}
            {tab === 'inventory' && 'Inventario'}
            {tab === 'recipes' && 'Platillos'}
          </h1>
        </div>
      </header>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white p-6 sm:max-w-sm">
            <X
              className="absolute right-4 top-4 h-4 w-4 rounded-sm opacity-70 hover:opacity-100"
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="grid gap-2 text-lg font-medium mt-8">
              <TabButton
                variant={tab === 'orders' ? 'active' : 'default'}
                onClick={() => {
                  setTab('orders');
                  setMobileMenuOpen(false);
                }}
              >
                <ShoppingCart className="h-5 w-5" />
                Ordenes
              </TabButton>
              <TabButton
                variant={tab === 'inventory' ? 'active' : 'default'}
                onClick={() => {
                  setTab('inventory');
                  setMobileMenuOpen(false);
                }}
              >
                <Package className="h-5 w-5" />
                Inventario
              </TabButton>
              <TabButton
                variant={tab === 'recipes' ? 'active' : 'default'}
                onClick={() => {
                  setTab('recipes');
                  setMobileMenuOpen(false);
                }}
              >
                <BookCheck className="h-5 w-5" />
                Platillos
              </TabButton>
            </nav>
          </div>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar navigation (desktop) */}
        <aside className="hidden w-64 flex-col border-r border-r-gray-200 bg-gray-50 md:flex">
          <div className="flex h-14 items-center border-b border-b-gray-200 px-4 py-2">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
          </div>
          <nav className="grid gap-2 p-4 text-sm">
            <TabButton
              variant={tab === 'orders' ? 'active' : 'default'}
              onClick={() => setTab('orders')}
            >
              <ShoppingCart className="h-5 w-5" />
              Ordenes
            </TabButton>
            <TabButton
              variant={tab === 'inventory' ? 'active' : 'default'}
              onClick={() => setTab('inventory')}
            >
              <Package className="h-5 w-5" />
              Inventario
            </TabButton>
            <TabButton
              variant={tab === 'recipes' ? 'active' : 'default'}
              onClick={() => setTab('recipes')}
            >
              <BookCheck className="h-5 w-5" />
              Platillos
            </TabButton>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Desktop header */}
          <header className="sticky top-0 z-30 hidden h-14 items-center border-b border-b-gray-200 bg-white px-6 md:flex">
            <h1 className="text-xl font-semibold">
              {tab === 'orders' && 'Ordenes'}
              {tab === 'inventory' && 'Inventario'}
              {tab === 'recipes' && 'Platillos'}
            </h1>
          </header>

          {/* Content based on active tab */}
          <div className="container mx-auto p-4 md:p-6">
            {tab === 'orders' && <Orders />}
            {tab === 'inventory' && <Inventory />}
            {tab === 'recipes' && <Recipes />}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
