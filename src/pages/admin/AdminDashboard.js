import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/App';
import { useAuth } from '@/context/AuthContext';
import { Package, PawPrint, Sprout, Calendar, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const { getAuthHeader } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/admin/stats`, { headers: getAuthHeader() });
      setStats(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const statCards = [
    { label: 'Produits', value: stats?.total_produits || 0, icon: Package, color: 'bg-blue-100 text-blue-600' },
    { label: 'Animaux', value: stats?.total_animaux || 0, icon: PawPrint, color: 'bg-green-100 text-green-600' },
    { label: 'Cultures', value: stats?.total_cultures || 0, icon: Sprout, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Réservations', value: stats?.total_reservations || 0, icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { label: 'Commandes', value: stats?.total_commandes || 0, icon: ShoppingBag, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div><h1 className="text-3xl font-bold mb-8">Tableau de Bord</h1><div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">{statCards.map((stat, idx) => { const Icon = stat.icon; return (<div key={idx} className="card"><div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}><Icon className="w-6 h-6" /></div><p className="text-gray-600 text-sm">{stat.label}</p><p className="text-2xl font-bold">{stat.value}</p></div>); })}</div></div>
  );
};

export default AdminDashboard;
