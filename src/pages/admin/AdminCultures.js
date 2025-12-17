import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '@/App';
import { useAuth } from '@/context/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const ALLOWED_STATUTS = [
  { value: 'en_preparation', label: 'En préparation' },
  { value: 'en_production', label: 'En production' },
  { value: 'hors_saison', label: 'Hors saison' },
];

const mapLegacyStatut = (s) => {
  if (!s) return 'en_preparation';
  const legacyMap = {
    'recolte': 'en_production',
    'termine': 'hors_saison',
    'planifie': 'en_preparation',
    // ajoute d'autres mappings si nécessaire
  };
  return legacyMap[s] ?? s;
};

const AdminCultures = () => {
  const { getAuthHeader } = useAuth();
  const [cultures, setCultures] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    type_culture: '',
    surface: 0,
    periode_production: '',
    statut: 'en_preparation',
  });

  useEffect(() => {
    fetchCultures();
  }, []);

  const fetchCultures = async () => {
    try {
      const res = await axios.get(`${API}/admin/cultures`, { headers: getAuthHeader() });
      setCultures(res.data);
    } catch (err) {
      console.error('fetchCultures error', err);
      toast.error('Impossible de récupérer les cultures');
    }
  };

  const resetForm = () => {
    setFormData({
      type_culture: '',
      surface: 0,
      periode_production: '',
      statut: 'en_preparation',
    });
    setEditing(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalisation des valeurs héritées
      const statutNormalized = mapLegacyStatut(formData.statut);

      // Vérifier que la valeur normalisée est autorisée
      const allowedValues = ALLOWED_STATUTS.map((s) => s.value);
      if (!allowedValues.includes(statutNormalized)) {
        toast.error('Statut invalide. Choisissez une valeur valide.');
        setLoading(false);
        return;
      }

      // Construire payload explicite (éviter d'envoyer des champs inattendus)
      const payload = {
        type_culture: (formData.type_culture || '').trim(),
        surface: Number(formData.surface) || 0,
        periode_production: (formData.periode_production || '').trim(),
        statut: statutNormalized,
      };

      // validations client simples
      if (!payload.type_culture) {
        toast.error('Type de culture requis');
        setLoading(false);
        return;
      }
      if (isNaN(payload.surface)) {
        toast.error('Surface invalide');
        setLoading(false);
        return;
      }

      console.log('Payload envoyé:', payload);

      if (editing) {
        const res = await axios.put(`${API}/admin/cultures/${editing}`, payload, { headers: getAuthHeader() });
        console.log('PUT response:', res.data);
        toast.success('Culture modifiée');
      } else {
        const res = await axios.post(`${API}/admin/cultures`, payload, { headers: getAuthHeader() });
        console.log('POST response:', res.data);
        toast.success('Culture ajoutée');
      }

      await fetchCultures();
      setOpen(false);
      resetForm();
    } catch (err) {
      console.error('handleSubmit error', err);
      if (err.response && err.response.data) {
        console.error('Validation details:', err.response.data);
        toast.error(`Erreur serveur: ${JSON.stringify(err.response.data)}`);
      } else {
        toast.error('Erreur lors de l\'enregistrement');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette culture ?')) return;
    try {
      await axios.delete(`${API}/admin/cultures/${id}`, { headers: getAuthHeader() });
      toast.success('Culture supprimée');
      fetchCultures();
    } catch (err) {
      console.error('handleDelete error', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (c) => {
    setFormData({
      type_culture: c.type_culture ?? '',
      surface: c.surface ?? 0,
      periode_production: c.periode_production ?? '',
      statut: mapLegacyStatut(c.statut ?? 'en_preparation'),
    });
    setEditing(c.id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Cultures</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouvelle Culture
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier' : 'Nouvelle'} Culture</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Type de culture</Label>
                <Input
                  value={formData.type_culture}
                  onChange={(e) => setFormData({ ...formData, type_culture: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Surface (ha)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.surface}
                  onChange={(e) => setFormData({ ...formData, surface: parseFloat(e.target.value || '0') })}
                  required
                />
              </div>

              <div>
                <Label>Période de production</Label>
                <Input
                  value={formData.periode_production}
                  onChange={(e) => setFormData({ ...formData, periode_production: e.target.value })}
                  placeholder="Ex: Mars - Juillet"
                />
              </div>

              <div>
                <Label>Statut</Label>
                <Select value={formData.statut} onValueChange={(v) => setFormData({ ...formData, statut: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ALLOWED_STATUTS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full bg-primary" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cultures.map((c) => (
          <div key={c.id} className="card p-4 border rounded">
            <h3 className="font-semibold text-lg">{c.type_culture}</h3>
            <p className="text-sm text-gray-600">Surface: {c.surface} ha</p>
            <p className="text-sm mt-1">Période: {c.periode_production || '—'}</p>
            <p className="text-sm mt-1">Statut: <strong>{mapLegacyStatut(c.statut ?? 'en_preparation')}</strong></p>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => handleEdit(c)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(c.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCultures;