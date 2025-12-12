import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API } from '@/App';
import { Calendar, Users, Clock } from 'lucide-react';
import { toast } from 'sonner';

const Visites = () => {
  const [animaux, setAnimaux] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimaux();
  }, []);

  const fetchAnimaux = async () => {
    try {
      const response = await axios.get(`${API}/animaux`);
      setAnimaux(response.data);
    } catch (error) {
      console.error('Error fetching animaux:', error);
      toast.error('Erreur lors du chargement des animaux');
    } finally {
      setLoading(false);
    }
  };

  const visitTypes = [
    {
      title: 'Visite Famille',
      description: 'Parfait pour une sortie en famille, découvrez tous nos animaux avec un guide',
      duration: '2-3 heures',
      price: 'Adulte: 10 USD | Enfant: 5 USD'
    },
    {
      title: 'Visite Groupe Scolaire',
      description: 'Éducative et ludique pour les élèves, avec activités pédagogiques',
      duration: '3-4 heures',
      price: 'Sur devis'
    },
    {
      title: 'Visite VIP',
      description: 'Expérience premium avec accès exclusif et guide privé',
      duration: '4-5 heures',
      price: 'Sur demande'
    }
  ];

  return (
    <div data-testid="visites-page">
      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
            Visites & Animaux
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez notre collection d'animaux dans un environnement naturel et préservé
          </p>
        </div>
      </section>

      {/* Types de Visites */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Types de Visites</h2>
          <div className="grid-3">
            {visitTypes.map((visit, index) => (
              <div key={index} className="card" data-testid={`visit-type-${index}`}>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                  <h3 className="text-xl font-semibold">{visit.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{visit.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{visit.duration}</span>
                </div>
                <p className="font-semibold" style={{ color: 'var(--secondary)' }}>{visit.price}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/reserver" data-testid="book-visit-button">
              <button className="btn-primary">
                <Calendar className="w-5 h-5" />
                Réserver maintenant
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Nos Animaux */}
      <section className="section" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container">
          <h2 className="section-title">Nos Animaux</h2>
          <p className="section-subtitle">
            Rencontrez les habitants de notre parc
            Rencontrez les habitants de notre park
          </p>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--primary)' }}></div>
            </div>
          ) : animaux.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Aucun animal disponible pour le moment
            </div>
          ) : (
            <div className="grid-4">
              {animaux.map((animal) => (
                <div key={animal.id} className="card" data-testid={`animal-card-${animal.id}`}>
                  <div className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {animal.photo ? (
                      <img
                        src={`${process.env.REACT_APP_BACKEND_URL}${animal.photo}`}
                        src={`${API}${animal.photo}`}
                        alt={animal.nom}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl">🦁</span>
                      <span className="text-4xl"></span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{animal.nom}</h3>
                  <p className="text-sm" style={{ color: 'var(--primary)' }}>{animal.espece}</p>
                  {animal.description && (
                    <p className="text-sm text-gray-600 mt-2">{animal.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Enclos: {animal.enclos}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Informations Pratiques */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Informations Pratiques</h2>
          <div className="max-w-3xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Conseils pour votre visite</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span>Arrivez au moins 15 minutes avant l'heure de votre réservation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span>Portez des vêtements et chaussures confortables</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span>N'oubliez pas votre crème solaire et chapeau</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span>Les photos sont autorisées mais respectez les animaux</span>
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--primary)' }}>•</span>
                  <span>Ne nourrissez pas les animaux sans autorisation du guide</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Visites;
