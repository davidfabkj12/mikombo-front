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

const AdminProduits = () => {
  const { getAuthHeader } = useAuth();
  const [produits, setProduits] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // id when editing
  const [selectedFiles, setSelectedFiles] = useState([]); // multiple files
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nom: '',
    categorie: 'Légumes',
    description: '',
    prix: 0,
    unite: 'kg',
    stock: 0,
    photos: [], // array of urls
    visible: true,
  });

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const res = await axios.get(`${API}/admin/produits`, { headers: getAuthHeader() });
      setProduits(res.data);
    } catch (err) {
      console.error('fetchProduits error', err);
      toast.error('Impossible de récupérer les produits');
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      categorie: 'Légumes',
      description: '',
      prix: 0,
      unite: 'kg',
      stock: 0,
      photos: [],
      visible: true,
    });
    setSelectedFiles([]);
    setEditing(null);
  };

  const uploadPhotoForProduct = async (productId, file) => {
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API}/admin/produits/${productId}/upload-photo`, fd, {
        headers: { ...getAuthHeader(), 'Content-Type': 'multipart/form-data' },
      });
      return res.data?.photo_url ?? null;
    } catch (err) {
      console.error('uploadPhoto error', err);
      toast.error(`Erreur upload ${file.name}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        nom: formData.nom,
        categorie: formData.categorie,
        description: formData.description,
        prix: formData.prix,
        unite: formData.unite,
        stock: formData.stock,
        visible: formData.visible,
      };

      let savedProduct = null;

      if (editing) {
        const res = await axios.put(`${API}/admin/produits/${editing}`, payload, { headers: getAuthHeader() });
        savedProduct = res.data;
        toast.success('Produit modifié');
      } else {
        const res = await axios.post(`${API}/admin/produits`, payload, { headers: getAuthHeader() });
        savedProduct = res.data;
        toast.success('Produit ajouté');
      }

      // If files selected, upload them one by one and refresh list after
      if (selectedFiles.length > 0 && savedProduct && savedProduct.id) {
        for (const file of selectedFiles) {
          await uploadPhotoForProduct(savedProduct.id, file);
        }
      }

      await fetchProduits();
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
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await axios.delete(`${API}/admin/produits/${id}`, { headers: getAuthHeader() });
      toast.success('Produit supprimé');
      fetchProduits();
    } catch (err) {
      console.error('handleDelete error', err);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (prod) => {
    setFormData({
      nom: prod.nom ?? '',
      categorie: prod.categorie ?? 'Légumes',
      description: prod.description ?? '',
      prix: prod.prix ?? 0,
      unite: prod.unite ?? 'kg',
      stock: prod.stock ?? 0,
      photos: prod.photos ?? [],
      visible: prod.visible ?? true,
    });
    setSelectedFiles([]);
    setEditing(prod.id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestion des Produits</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Produit
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editing ? 'Modifier' : 'Nouveau'} Produit</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Nom</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label>Catégorie</Label>
                <Select value={formData.categorie} onValueChange={(v) => setFormData({ ...formData, categorie: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {['Légumes', 'Fruits', 'Viande', 'Autres'].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Prix (FC)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.prix}
                    onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>

                <div>
                  <Label>Unité</Label>
                  <Input
                    value={formData.unite}
                    onChange={(e) => setFormData({ ...formData, unite: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Stock</Label>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value || '0', 10) })}
                  required
                />
              </div>

              <div>
                <Label>Photos (optionnel)</Label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setSelectedFiles(files);
                  }}
                />
                <div className="flex gap-2 mt-2">
                  {selectedFiles.length > 0 &&
                    selectedFiles.map((f, idx) => (
                      <div key={idx} className="text-xs text-gray-600">{f.name}</div>
                    ))}
                </div>
                {formData.photos && formData.photos.length > 0 && selectedFiles.length === 0 && (
                  <div className="flex gap-2 mt-2">
                    {formData.photos.map((url, i) => (
                      <img
                        key={i}
                        src={url.startsWith('/') ? `${API}${url}` : url}
                        alt={`photo-${i}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
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
        {produits.map((p) => (
          <div key={p.id} className="card p-4 border rounded">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {p.photos && p.photos.length > 0 ? (
                  <img
                    src={p.photos[0].startsWith('/') ? `${API}${p.photos[0]}` : p.photos[0]}
                    alt={p.nom}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">No photo</div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-lg">{p.nom}</h3>
                <p className="text-sm text-gray-600">{p.categorie}</p>
                <p className="text-lg font-bold mt-2" style={{ color: 'var(--secondary)' }}>
                  {p.prix} FC/{p.unite}
                </p>
                <p className="text-sm">Stock: {p.stock}</p>
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

export default AdminProduits;