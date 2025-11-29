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
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AdminAnimaux = () => {
  const { getAuthHeader } = useAuth();
  const [animaux, setAnimaux] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // animal id when editing
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    espece: '',
    nom: '',
    enclos: '',
    etat_sante: '',
    description: '',
    photo: '', // url string returned by backend
    visible: true,
  });

  useEffect(() => {
    fetchAnimaux();
  }, []);

  const fetchAnimaux = async () => {
    try {
      const res = await axios.get(`${API}/admin/animaux`, { headers: getAuthHeader() });
      setAnimaux(res.data);
    } catch (err) {
      console.error('fetchAnimaux error', err);
      toast.error('Impossible de récupérer la liste des animaux');
    }
  };

  const resetForm = () => {
    setFormData({
      espece: '',
      nom: '',
      enclos: '',
      etat_sante: '',
      description: '',
      photo: '',
      visible: true,
    });
    setPhotoFile(null);
    setEditing(null);
  };

  const uploadPhotoForAnimal = async (animalId) => {
    if (!photoFile) return null;
    try {
      const fd = new FormData();
      fd.append('file', photoFile);
      const res = await axios.post(`${API}/admin/animaux/${animalId}/upload-photo`, fd, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.photo_url ?? null;
    } catch (err) {
      console.error('uploadPhoto error', err);
      toast.error('Erreur lors de l\'upload de la photo');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Prepare payload (exclude photo field when sending JSON; backend sets created_at)
      const payload = {
        espece: formData.espece,
        nom: formData.nom,
        enclos: formData.enclos,
        etat_sante: formData.etat_sante,
        description: formData.description,
        visible: formData.visible,
      };

      let savedAnimal = null;

      if (editing) {
        // Update animal (JSON)
        const res = await axios.put(`${API}/admin/animaux/${editing}`, payload, { headers: getAuthHeader() });
        savedAnimal = res.data;
        toast.success('Animal modifié');
      } else {
        // Create animal (JSON)
        const res = await axios.post(`${API}/admin/animaux`, payload, { headers: getAuthHeader() });
        savedAnimal = res.data;
        toast.success('Animal ajouté');
      }

      // If a photo file was selected, upload it to the dedicated endpoint
      if (photoFile && savedAnimal && savedAnimal.id) {
        const photoUrl = await uploadPhotoForAnimal(savedAnimal.id);
        if (photoUrl) {
          // Option 1: refresh full list from server to get updated photo URL
          await fetchAnimaux();
        } else {
          // If upload failed, still refresh list to reflect changes (or keep as is)
          await fetchAnimaux();
        }
      } else {
        // No photo to upload: refresh list to reflect create/update
        await fetchAnimaux();
      }

      setOpen(false);
      resetForm();
    } catch (err) {
      console.error('handleSubmit error', err);
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet animal ?')) return;
    try {
      await axios.delete(`${API}/admin/animaux/${id}`, { headers: getAuthHeader() });
      toast.success('Animal supprimé');
      fetchAnimaux();
    } catch (err) {
      console.error('handleDelete error', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (animal) => {
    setFormData({
      espece: animal.espece ?? '',
      nom: animal.nom ?? '',
      enclos: animal.enclos ?? '',
      etat_sante: animal.etat_sante ?? '',
      description: animal.description ?? '',
      photo: animal.photo ?? '',
      visible: animal.visible ?? true,
    });
    setPhotoFile(null);
    setEditing(animal.id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Animaux</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Animal
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier' : 'Nouveau'} Animal</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Espèce</Label>
                <Input
                  value={formData.espece}
                  onChange={(e) => setFormData({ ...formData, espece: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Nom</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Enclos</Label>
                <Input
                  value={formData.enclos}
                  onChange={(e) => setFormData({ ...formData, enclos: e.target.value })}
                />
              </div>

              <div>
                <Label>État de santé</Label>
                <Select
                  value={formData.etat_sante}
                  onValueChange={(v) => setFormData({ ...formData, etat_sante: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Excellent', 'Bon', 'Moyen', 'Faible'].map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <Label>Photo (optionnel)</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] ?? null;
                    setPhotoFile(file);
                  }}
                />
                {formData.photo && !photoFile && (
                  <p className="text-sm text-gray-500 mt-1">Photo actuelle: {formData.photo}</p>
                )}
                {photoFile && <p className="text-sm text-gray-500 mt-1">Fichier sélectionné: {photoFile.name}</p>}
              </div>

              <div>
                <Label>Visible</Label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visible"
                      checked={formData.visible === true}
                      onChange={() => setFormData({ ...formData, visible: true })}
                    />
                    <span>Oui</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="visible"
                      checked={formData.visible === false}
                      onChange={() => setFormData({ ...formData, visible: false })}
                    />
                    <span>Non</span>
                  </label>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animaux.map((p) => (
          <div key={p.id} className="card p-4 border rounded">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {p.photo ? (
                  // Si ton backend renvoie des URLs relatives (/uploads/...), adapte si besoin : `${API}${p.photo}`
                  <img src={p.photo.startsWith('/') ? `${API}${p.photo}` : p.photo} alt={p.nom} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No photo</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{p.nom}</h3>
                <p className="text-sm text-gray-600">{p.espece} — {p.enclos}</p>
                <p className="text-sm mt-1">Santé: <strong>{p.etat_sante}</strong></p>
                <p className="text-sm mt-2 text-gray-700">{p.description}</p>
                <p className="text-xs mt-2 text-gray-500">Visible: {p.visible ? 'Oui' : 'Non'}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => handleEdit(p)}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(p.id)}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnimaux;