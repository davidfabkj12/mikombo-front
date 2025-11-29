import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/App';
import { useAuth } from '@/context/AuthContext';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ALLOWED_STATUTS = [
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee', label: 'Confirmée' },
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'prete', label: 'Prête' },
  { value: 'livree', label: 'Livrée' },
  { value: 'retiree', label: 'Retirée' },
  { value: 'annulee', label: 'Annulée' },
];

// Mapper les valeurs héritées vers des valeurs acceptées par le backend
const mapLegacyCommandeStatut = (s) => {
  if (!s) return 'en_attente';
  const legacyMap = {
    'en_livraison': 'en_preparation', // choix conservateur : map vers en_preparation
    'en_route': 'en_preparation',
    'delivered': 'livree',
    'picked_up': 'retiree',
    'confirmed': 'confirmee',
    // ajoute d'autres mappings si nécessaire
  };
  return legacyMap[s] ?? s;
};

const AdminCommandes = () => {
  const { getAuthHeader } = useAuth();
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchCommandes();
  }, []);

  const fetchCommandes = async () => {
    try {
      const res = await axios.get(`${API}/admin/commandes`, { headers: getAuthHeader() });
      // Normaliser localement les statuts hérités pour l'affichage
      const normalized = res.data.map(c => ({ ...c, statut: mapLegacyCommandeStatut(c.statut) }));
      setCommandes(normalized);
    } catch (err) {
      console.error('fetchCommandes error', err);
      toast.error('Impossible de récupérer les commandes');
    }
  };

  const updateCommandeStatut = async (commandeId, newStatut) => {
    if (!newStatut) return;
    const statutNormalized = mapLegacyCommandeStatut(newStatut);
    const allowed = ALLOWED_STATUTS.map(s => s.value);
    if (!allowed.includes(statutNormalized)) {
      toast.error('Statut invalide. Choisissez une valeur valide.');
      return;
    }

    setUpdatingId(commandeId);
    try {
      await axios.put(
        `${API}/admin/commandes/${commandeId}/statut`,
        null,
        {
          headers: getAuthHeader(),
          params: { statut: statutNormalized },
        }
      );

      toast.success('Statut mis à jour');
      setCommandes((prev) =>
        prev.map(c =>
          c.id === commandeId ? { ...c, statut: statutNormalized, updated_at: new Date().toISOString() } : c
        )
      );
    } catch (err) {
      console.error('updateCommandeStatut error', err);
      if (err.response && err.response.data) {
        console.error('Validation details:', err.response.data);
        toast.error(`Erreur serveur: ${JSON.stringify(err.response.data)}`);
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
      await fetchCommandes();
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString();
    } catch {
      return iso || '—';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Commandes</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {commandes.map((c) => (
          <div key={c.id} className="card p-4 border rounded">
            <h3 className="font-semibold text-lg">Commande #{c.id}</h3>
            <p className="text-sm text-gray-600">{c.user_name || '—'} — {c.user_email || c.user_telephone}</p>

            <div className="mt-2 text-sm">
              <div>Mode retrait: <strong>{c.mode_retrait || '—'}</strong></div>
              {c.adresse_livraison ? <div>Adresse: {c.adresse_livraison}</div> : null}
              <div className="mt-2">Total: <strong>{c.total}</strong></div>
              <div className="mt-1 text-xs text-gray-500">Créée: {formatDate(c.created_at)}</div>
              <div className="text-xs text-gray-500">Dernière MAJ: {formatDate(c.updated_at)}</div>
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-500 block mb-1">Statut</label>
              <Select
                value={c.statut}
                onValueChange={(v) => updateCommandeStatut(c.id, v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALLOWED_STATUTS.map(s => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-3">
              <label className="text-xs text-gray-500 block mb-1">Articles</label>
              <div className="space-y-2">
                {(Array.isArray(c.items) ? c.items : []).map((it, i) => (
                  <div key={i} className="text-sm">
                    {it.nom || it.name || `Item ${i+1}`} — qty: {it.quantite ?? it.quantity ?? 1} — prix: {it.prix ?? it.price ?? '—'}
                  </div>
                ))}
                {(Array.isArray(c.items) && c.items.length === 0) && <div className="text-sm text-gray-400">Aucun article</div>}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigator.clipboard?.writeText(JSON.stringify(c))}
                title="Copier les détails"
              >
                <Edit className="w-4 h-4" />
              </Button>

              <div className="text-xs text-gray-500">
                {updatingId === c.id ? 'Mise à jour...' : `Statut actuel: ${c.statut}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCommandes;