import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { API } from '@/App';
import { Calendar, ShoppingBag, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MonCompte = () => {
  const { user, getAuthHeader } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [commandes, setCommandes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resRes, cmdRes] = await Promise.all([
        axios.get(`${API}/reservations/mes-reservations`, { headers: getAuthHeader() }),
        axios.get(`${API}/commandes/mes-commandes`, { headers: getAuthHeader() })
      ]);
      setReservations(resRes.data);
      setCommandes(cmdRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'confirmee': 'text-green-600 bg-green-100',
      'en_attente': 'text-yellow-600 bg-yellow-100',
      'annulee': 'text-red-600 bg-red-100'
    };
    return colors[status] || 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--beige)' }}>
      <div className="container max-w-6xl">
        <h1 className="text-4xl font-bold mb-8" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>Mon Compte</h1>
        
        <div className="card mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center"><User className="w-8 h-8 text-white" /></div>
            <div><h2 className="text-xl font-semibold">{user?.prenom} {user?.nom}</h2><p className="text-gray-600">{user?.email}</p></div>
          </div>
        </div>

        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="grid w-full grid-cols-2"><TabsTrigger value="reservations">Mes Réservations</TabsTrigger><TabsTrigger value="commandes">Mes Commandes</TabsTrigger></TabsList>
          
          <TabsContent value="reservations" className="space-y-4">
            {reservations.length === 0 ? (
              <div className="card text-center py-12"><Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" /><p className="text-gray-600">Aucune réservation</p></div>
            ) : (
              reservations.map(res => (
                <div key={res.id} className="card"><div className="flex justify-between items-start"><div><h3 className="font-semibold text-lg">{res.type_visite}</h3><p className="text-sm text-gray-600">Date: {res.date_visite} à {res.heure_visite}</p><p className="text-sm text-gray-600">Adultes: {res.nb_adultes} | Enfants: {res.nb_enfants}</p></div><div className="text-right"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(res.statut)}`}>{res.statut}</span><p className="mt-2 font-bold text-lg" style={{ color: 'var(--secondary)' }}>{res.prix_total} USD</p></div></div></div>
              ))
            )}
          </TabsContent>

          <TabsContent value="commandes" className="space-y-4">
            {commandes.length === 0 ? (
              <div className="card text-center py-12"><ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-400" /><p className="text-gray-600">Aucune commande</p></div>
            ) : (
              commandes.map(cmd => (
                <div key={cmd.id} className="card"><div className="flex justify-between items-start mb-3"><div><h3 className="font-semibold">Commande #{cmd.id.slice(0,8)}</h3><p className="text-sm text-gray-600">{new Date(cmd.created_at).toLocaleDateString()}</p></div><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cmd.statut)}`}>{cmd.statut}</span></div><div className="space-y-2">{cmd.items.map((item, idx) => (<div key={idx} className="flex justify-between text-sm"><span>{item.nom} x{item.quantite}</span><span>{(item.prix * item.quantite).toFixed(2)} USD</span></div>))}</div><div className="mt-3 pt-3 border-t flex justify-between"><span className="font-semibold">Total:</span><span className="font-bold text-lg" style={{ color: 'var(--secondary)' }}>{cmd.total} USD</span></div><p className="text-sm text-gray-600 mt-2">Mode: {cmd.mode_retrait}</p></div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MonCompte;
