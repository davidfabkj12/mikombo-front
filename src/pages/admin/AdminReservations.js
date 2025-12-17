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
  { value: 'annulee', label: 'Annulée' },
];

const AdminRéservations = () => {
  const { getAuthHeader } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${API}/admin/reservations`, { headers: getAuthHeader() });
      setReservations(res.data);
    } catch (err) {
      console.error('fetchReservations error', err);
      toast.error('Impossible de récupérer les réservations');
    }
  };

  const updateReservationStatut = async (reservationId, newStatut) => {
    if (!newStatut) return;
    setUpdatingId(reservationId);
    try {
      // Envoi du statut en query param (body vide)
      await axios.put(
        `${API}/admin/reservations/${reservationId}/statut`,
        null,
        {
          headers: getAuthHeader(),
          params: { statut: newStatut },
        }
      );

      toast.success('Statut mis à jour');
      setReservations((prev) => prev.map(r => r.id === reservationId ? { ...r, statut: newStatut } : r));
    } catch (err) {
      console.error('updateReservationStatut error', err);
      if (err.response && err.response.data) {
        console.error('Validation details:', err.response.data);
        toast.error(`Erreur serveur: ${JSON.stringify(err.response.data)}`);
      } else {
        toast.error('Erreur lors de la mise à jour du statut');
      }
      await fetchReservations();
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Réservations</h1>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map((r) => (
          <div key={r.id} className="card p-4 border rounded">
            <h3 className="font-semibold text-lg">{r.user_name || '—'}</h3>
            <p className="text-sm text-gray-600">{r.user_email || r.user_telephone}</p>
            <p className="text-sm mt-1">Visite: {r.date_visite} à {r.heure_visite}</p>
            <p className="text-sm mt-1">Type: {r.type_visite}</p>
            <p className="text-sm mt-1">Adultes: {r.nb_adultes} — Enfants: {r.nb_enfants}</p>
            <p className="text-sm mt-1">Prix total: <strong>{r.prix_total}</strong></p>

            <div className="mt-3">
              <label className="text-xs text-gray-500 block mb-1">Statut</label>
              <Select
                value={r.statut}
                onValueChange={(v) => updateReservationStatut(r.id, v)}
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

            <div className="flex items-center gap-3 mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigator.clipboard?.writeText(JSON.stringify(r))}
                title="Copier les détails"
              >
                <Edit className="w-4 h-4" />
              </Button>

              <div className="text-xs text-gray-500">
                {updatingId === r.id ? 'Mise à jour...' : `Statut actuel: ${r.statut}`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRéservations;