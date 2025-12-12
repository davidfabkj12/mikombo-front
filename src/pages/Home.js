import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Users, Heart, ShoppingBag, Calendar, MapPin } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Produits 100% Bio',
      description: 'Légumes, fruits et viande issus de notre production locale et durable'
    },
    {
      icon: Users,
      title: 'Visites Guidées',
      description: 'Découvrez nos animaux dans un cadre naturel et préservé'
    },
    {
      icon: Heart,
      title: 'Agriculture Durable',
      description: 'Pratiques agricoles respectueuses de l\'environnement'
    }
  ];

  return (
    <div data-testid="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content fade-in-up">
          <h1 className="hero-title" data-testid="hero-title">Bienvenue au Mikombo Park</h1>
          <h1 className="hero-title" data-testid="hero-title">Bienvenue au Park Mikombo</h1>
          <p className="hero-subtitle" data-testid="hero-subtitle">
            Découvrez un espace unique où agriculture bio et tourisme animalier se rencontrent près de Lubumbashi
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/reserver" data-testid="reserve-visit-button">
              <button className="btn-primary">
                <Calendar className="w-5 h-5" />
                Réserver une visite
              </button>
            </Link>
            <Link to="/produits" data-testid="shop-products-button">
              <button className="btn-secondary">
                <ShoppingBag className="w-5 h-5" />
                 Nos produits bio
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <h2 className="section-title">Pourquoi Mikombo Park ?</h2>
          <h2 className="section-title">Pourquoi Park Mikombo ?</h2>
          <p className="section-subtitle">
            Un engagement pour la qualité, la durabilité et le bien-être animal
          </p>
          <div className="grid-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card text-center" data-testid={`feature-card-${index}`}>
                  <div className="w-16 h-16 mx-auto mb-4 bg-primary bg-opacity-10 rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="section" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container">
          <h2 className="section-title">Nos Activités</h2>
          <div className="grid-2">
            <div className="card" data-testid="activity-visits">
              <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg mb-4 flex items-center justify-center">
                <Users className="w-20 h-20 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Visites du Parc</h3>
              <h3 className="text-2xl font-semibold mb-3">Visites du Park</h3>
              <p className="text-gray-600 mb-4">
                Explorez notre parc et rencontrez nos animaux : lions, girafes et bien d'autres espèces dans leur habitat naturel.
                Explorez notre park et rencontrez nos animaux : lions, girafes et bien d'autres espèces dans leur habitat naturel.
              </p>
              <Link to="/visites" data-testid="learn-more-visits">
                <button className="btn-primary">En savoir plus</button>
              </Link>
            </div>
            <div className="card" data-testid="activity-products">
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mb-4 flex items-center justify-center">
                <ShoppingBag className="w-20 h-20 text-orange-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Produits Bio</h3>
              <p className="text-gray-600 mb-4">
                Commandez nos produits frais : légumes, fruits et viande bio, cultivés et élevés localement avec soin.
              </p>
              <Link to="/produits" data-testid="learn-more-products">
                <button className="btn-secondary">Découvrir</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="section" style={{ backgroundColor: 'var(--white)' }}>
        <div className="container">
          <h2 className="section-title">Nous Trouver</h2>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="w-6 h-6" style={{ color: 'var(--secondary)' }} />
              <p className="text-lg">Près de Lubumbashi, RDC</p>
            </div>
            <p className="text-gray-600 mb-6">
              Notre parc est situé à quelques kilomètres de Lubumbashi, facilement accessible en voiture.
              Notre park est situé à quelques kilomètres de Lubumbashi, facilement accessible en voiture.
              Venez nous rendre visite pour une expérience inoubliable !
            </p>
            <Link to="/a-propos" data-testid="contact-us-button">
              <button className="btn-primary">Nous contacter</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
