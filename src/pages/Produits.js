import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/App';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategorie, setSelectedCategorie] = useState('');
  const { addToCart } = useCart();

  const categories = ['Tous', 'Légumes', 'Fruits', 'Viande', 'Autres'];

  useEffect(() => {
    fetchProduits();
  }, [selectedCategorie]);

  const fetchProduits = async () => {
    try {
      const url = selectedCategorie && selectedCategorie !== 'Tous'
        ? `${API}/produits?categorie=${selectedCategorie}`
        : `${API}/produits`;
      const response = await axios.get(url);
      setProduits(response.data);
    } catch (error) {
      console.error('Error fetching produits:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (produit) => {
    addToCart(produit, 1);
    toast.success(`${produit.nom} ajouté au panier`);
  };

  return (
    <div data-testid="produits-page">
      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
            Nos Produits Bio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Légumes, fruits et viande de qualité, cultivés et élevés localement avec amour
          </p>
        </div>
      </section>

      {/* Produits */}
      <section className="section">
        <div className="container">
          {/* Filtres */}
          <div className="flex flex-wrap gap-3 justify-center mb-8" data-testid="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategorie(cat === 'Tous' ? '' : cat)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  (cat === 'Tous' && !selectedCategorie) || selectedCategorie === cat
                    ? 'bg-primary text-gray shadow-md ring-1 ring-white/20 active:brightness-95 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                data-testid={`category-filter-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Liste des produits */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
            </div>
          ) : produits.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun produit disponible pour le moment
            </div>
          ) : (
            <div className="grid-4">
              {produits.map(produit => (
                <div key={produit.id} className="card" data-testid={`produit-card-${produit.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {produit.photos && produit.photos.length > 0 ? (
                      <img
                        src={`${API}${produit.photos[0]}`}
                        alt={produit.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-5xl">🥬</span>
                      <span className="text-5xl"></span>
                    )}
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{produit.nom}</h3>
                    {produit.saison && (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Saison
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{produit.categorie}</p>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{produit.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-bold" style={{ color: 'var(--secondary)' }}>
                        {produit.prix} USD
                        {produit.prix} FC
                      </p>
                      <p className="text-xs text-gray-500">par {produit.unite}</p>
                    </div>
                    <Button
                      onClick={() => handleAddToCart(produit)}
                      size="sm"
                      className="bg-primary text-gray hover:bg-primary-dark"
                      data-testid={`add-to-cart-${produit.id}`}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Panier
                    </Button>
                  </div>
                  {produit.stock <= 5 && (
                    <p className="text-xs text-orange-600 mt-2">Stock limité</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="section" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
              Qualité Garantie
            </h2>
            <p className="text-gray-600 mb-4">
              Tous nos produits sont cultivés sans pesticides chimiques et dans le respect de l'environnement.
              Notre viande provient d'animaux élevés en liberté avec une alimentation naturelle.
            </p>
            <p className="text-gray-600">
              Commandez dès maintenant et choisissez le retrait sur place ou la livraison à domicile.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Produits;
