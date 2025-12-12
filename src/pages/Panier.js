import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { API } from '@/App';
import { Trash2, ShoppingBag, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';

const Panier = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotal } = useCart();
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [modeRetrait, setModeRetrait] = useState('sur_place');
  const [adresseLivraison, setAdresseLivraison] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleQuantityChange = (produitId, newQuantite) => {
    if (newQuantite >= 1) {
      updateQuantity(produitId, newQuantite);
    }
  };

  const handleCommander = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour passer commande');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    if (modeRetrait === 'livraison' && !adresseLivraison.trim()) {
      toast.error('Veuillez entrer une adresse de livraison');
      return;
    }

    setProcessing(true);

    try {
      const commandeData = {
        items: cart,
        mode_retrait: modeRetrait,
        adresse_livraison: modeRetrait === 'livraison' ? adresseLivraison : ''
      };

      await axios.post(`${API}/commandes`, commandeData, {
        headers: getAuthHeader()
      });

      toast.success('Commande passée avec succès !');
      clearCart();
      navigate('/mon-compte');
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Erreur lors de la commande');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--beige)' }} data-testid="panier-page">
      <div className="container">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
          Mon Panier
        </h1>

        {cart.length === 0 ? (
          <div className="max-w-md mx-auto card text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl text-gray-600 mb-4">Votre panier est vide</p>
            <Button
              onClick={() => navigate('/produits')}
              className="bg-primary hover:bg-primary-dark"
              data-testid="go-to-produits-button"
            >
              Découvrir nos produits
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items List */}
            
            {/* ✅ Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.produit_id} className="card flex items-center gap-4" data-testid={`cart-item-${item.produit_id}`}>
                  <div className="w-20 h-20 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🥬</span>
                <div
                  key={item.produit_id}
                  className="card flex flex-col sm:flex-row items-center sm:items-start gap-4"
                  data-testid={`cart-item-${item.produit_id}`}
                >
                  <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-50 to-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl"></span>
                  </div>
                  <div className="flex-1">

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-semibold text-lg">{item.nom}</h3>
                    <p className="text-sm text-gray-500">{item.prix} USD / {item.unite}</p>
                    <p className="text-sm text-gray-500">{item.prix} FC / {item.unite}</p>
                  </div>
                  <div className="flex items-center gap-2">

                  <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.produit_id, item.quantite - 1)}
                      data-testid={`decrease-quantity-${item.produit_id}`}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium" data-testid={`item-quantity-${item.produit_id}`}>

                    <span className="w-12 text-center font-medium">
                      {item.quantite}
                    </span>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleQuantityChange(item.produit_id, item.quantite + 1)}
                      data-testid={`increase-quantity-${item.produit_id}`}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">

                  <div className="text-center sm:text-right w-full sm:w-auto">
                    <p className="font-bold text-lg" style={{ color: 'var(--secondary)' }}>
                      {(item.prix * item.quantite).toFixed(2)} USD
                      {(item.prix * item.quantite).toFixed(2)} FC
                    </p>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromCart(item.produit_id)}
                    className="text-red-500 hover:text-red-700"
                    data-testid={`remove-item-${item.produit_id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Summary and Checkout */}
            {/* ✅ Summary */}
            <div className="lg:col-span-1">
              <div className="card sticky top-20">
              <div className="card sm:sticky sm:top-20">
                <h2 className="text-xl font-bold mb-4">Résumé de la commande</h2>
                

                <div className="space-y-2 mb-4 pb-4 border-b">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{getTotal().toFixed(2)} USD</span>
                    <span>{getTotal().toFixed(2)} FC</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span style={{ color: 'var(--secondary)' }} data-testid="cart-total">
                      {getTotal().toFixed(2)} USD
                    <span style={{ color: 'var(--secondary)' }}>
                      {getTotal().toFixed(2)} FC
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-4">
                  <Label className="font-semibold">Mode de retrait</Label>
                  <RadioGroup value={modeRetrait} onValueChange={setModeRetrait} data-testid="mode-retrait-group">
                  <RadioGroup value={modeRetrait} onValueChange={setModeRetrait}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="sur_place" id="sur_place" data-testid="retrait-sur-place" />
                      <RadioGroupItem value="sur_place" id="sur_place" />
                      <Label htmlFor="sur_place" className="cursor-pointer">Retrait sur place</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="livraison" id="livraison" data-testid="retrait-livraison" />
                      <RadioGroupItem value="livraison" id="livraison" />
                      <Label htmlFor="livraison" className="cursor-pointer">Livraison à domicile</Label>
                    </div>
                  </RadioGroup>

                  {modeRetrait === 'livraison' && (
                    <div>
                      <Label htmlFor="adresse">Adresse de livraison</Label>
                      <Input
                        id="adresse"
                        placeholder="Entrez votre adresse complète"
                        value={adresseLivraison}
                        onChange={(e) => setAdresseLivraison(e.target.value)}
                        className="mt-1"
                        data-testid="adresse-livraison-input"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCommander}
                  disabled={processing}
                  className="w-full bg-primary hover:bg-primary-dark"
                  data-testid="commander-button"
                >
                  {processing ? 'Traitement...' : 'Commander'}
                </Button>

                {!user && (
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    Vous devez être connecté pour commander
                  </p>
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Panier;
