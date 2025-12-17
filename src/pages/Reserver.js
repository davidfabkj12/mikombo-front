import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { API } from '@/App';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const Reserver = () => {
  const { user, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    date_visite: '',
    heure_visite: '09:00',
    type_visite: 'Famille',
    nb_adultes: 1,
    nb_enfants: 0
  });
  const [processing, setProcessing] = useState(false);

  const typesVisite = ['Famille', 'Groupe Scolaire', 'VIP'];
  const horaires = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const calculateTotal = () => {
    const prixAdulte = 10;
    const prixEnfant = 5;
    return (formData.nb_adultes * prixAdulte) + (formData.nb_enfants * prixEnfant);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Veuillez vous connecter pour réserver');
      navigate('/login');
      return;
    }

    if (!formData.date_visite) {
      toast.error('Veuillez sélectionner une date');
      return;
    }

    setProcessing(true);

    try {
      await axios.post(`${API}/reservations`, formData, {
        headers: getAuthHeader()
      });

      toast.success('Réservation confirmée ! Vérifiez votre email.');
      navigate('/mon-compte');
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error(error.response?.data?.detail || 'Erreur lors de la réservation');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12" style={{ backgroundColor: 'var(--beige)' }} data-testid="reserver-page">
      <div className="container max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
          Réserver une Visite
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Planifiez votre visite au Mikombo Park et découvrez nos animaux
        </p>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6" data-testid="reservation-form">
            {/* Type de visite */}
            <div>
              <Label htmlFor="type_visite">Type de visite</Label>
              <Select
                value={formData.type_visite}
                onValueChange={(value) => handleChange('type_visite', value)}
              >
                <SelectTrigger data-testid="type-visite-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typesVisite.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div>
              <Label htmlFor="date_visite">Date de la visite</Label>
              <Input
                type="date"
                id="date_visite"
                value={formData.date_visite}
                onChange={(e) => handleChange('date_visite', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                data-testid="date-visite-input"
              />
            </div>

            {/* Heure */}
            <div>
              <Label htmlFor="heure_visite">Heure de la visite</Label>
              <Select
                value={formData.heure_visite}
                onValueChange={(value) => handleChange('heure_visite', value)}
              >
                <SelectTrigger data-testid="heure-visite-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {horaires.map(h => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nombre d'adultes */}
            <div>
              <Label htmlFor="nb_adultes">Nombre d'adultes (10 USD/adulte)</Label>
              <Input
                type="number"
                id="nb_adultes"
                value={formData.nb_adultes}
                onChange={(e) => handleChange('nb_adultes', parseInt(e.target.value) || 0)}
                min="1"
                required
                data-testid="nb-adultes-input"
              />
            </div>

            {/* Nombre d'enfants */}
            <div>
              <Label htmlFor="nb_enfants">Nombre d'enfants (5 USD/enfant)</Label>
              <Input
                type="number"
                id="nb_enfants"
                value={formData.nb_enfants}
                onChange={(e) => handleChange('nb_enfants', parseInt(e.target.value) || 0)}
                min="0"
                data-testid="nb-enfants-input"
              />
            </div>

            {/* Total */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Prix total:</span>
                <span className="text-2xl font-bold" style={{ color: 'var(--secondary)' }} data-testid="reservation-total">
                  {calculateTotal()} USD
                </span>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={processing}
              className="w-full bg-primary hover:bg-primary-dark"
              data-testid="submit-reservation-button"
            >
              {processing ? 'Réservation en cours...' : 'Confirmer la réservation'}
            </Button>

            {!user && (
              <p className="text-sm text-gray-500 text-center">
                Vous devez être connecté pour réserver
              </p>
            )}
          </form>
        </div>

        {/* Info */}
        <div className="mt-8 card">
          <h3 className="font-semibold mb-3">Informations importantes:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Arrivez 15 minutes avant l'heure de votre réservation</li>
            <li>• Vous recevrez un email de confirmation</li>
            <li>• Les visites durent environ 2-3 heures</li>
            <li>• Portez des vêtements confortables</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Reserver;
