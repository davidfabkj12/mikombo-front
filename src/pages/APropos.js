import React, { useState } from 'react';
import axios from 'axios';
import { API } from '@/App';
import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const APropos = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await axios.post(`${API}/contact`, formData);
      toast.success('Message envoyé avec succès !');
      setFormData({ nom: '', email: '', telephone: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div data-testid="apropos-page">
      {/* Hero */}
      <section className="py-20" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
            À Propos de Nous
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez l'histoire et la mission du Park Mikombo
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="section">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
              Notre Histoire
            </h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Le Park Mikombo est né d'une passion pour l'agriculture durable et le bien-être animal.
                Situé à quelques kilomètres de Lubumbashi en République Démocratique du Congo, notre park
                s'étend sur plusieurs hectares de terres préservées.
              </p>
              <p>
                Nous combinons l'agro-tourisme et la production biologique pour offrir une expérience unique
                à nos visiteurs tout en contribuant à la sécurité alimentaire locale avec des produits sains
                et de qualité.
              </p>
              <p>
                Notre équipe dévouée travaille chaque jour pour maintenir un équilibre harmonieux entre
                agriculture, élevage et conservation de la faune.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre Mission */}
      <section className="section" style={{ backgroundColor: 'var(--beige)' }}>
        <div className="container">
          <h2 className="text-3xl font-bold mb-6 text-center" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
            Notre Mission
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary)' }}>
                Agriculture Durable
              </h3>
              <p className="text-gray-600 text-sm">
                Produire des aliments sains sans pesticides chimiques en respectant l'environnement
              </p>
            </div>
            <div className="card text-center">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary)' }}>
                Bien-être Animal
              </h3>
              <p className="text-gray-600 text-sm">
                Assurer des conditions de vie optimales pour tous nos animaux
              </p>
            </div>
            <div className="card text-center">
              <h3 className="font-semibold text-lg mb-3" style={{ color: 'var(--primary)' }}>
                Éducation
              </h3>
              <p className="text-gray-600 text-sm">
                Sensibiliser le public à l'importance de la biodiversité et de l'agriculture bio
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-center" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>
            Contactez-nous
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Informations de Contact</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 mt-1" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium">Adresse</p>
                  <p className="text-gray-600">Près de Lubumbashi, RDC</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 mt-1" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium">Téléphone</p>
                  <p className="text-gray-600">+243 XXX XXX XXX</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 mt-1" style={{ color: 'var(--primary)' }} />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-gray-600">info@mikombopark.com</p>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="font-medium mb-2">Horaires d'ouverture</h4>
                <p className="text-gray-600">Lundi - Dimanche: 8h00 - 18h00</p>
              </div>
            </div>

            {/* Form */}
            <div className="card">
              <h3 className="text-xl font-semibold mb-4">Envoyez-nous un message</h3>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="contact-form">
                <div>
                  <Input
                    type="text"
                    name="nom"
                    placeholder="Votre nom"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    data-testid="contact-nom-input"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Votre email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    name="telephone"
                    placeholder="Votre téléphone"
                    value={formData.telephone}
                    onChange={handleChange}
                    required
                    data-testid="contact-telephone-input"
                  />
                </div>
                <div>
                  <Textarea
                    name="message"
                    placeholder="Votre message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    data-testid="contact-message-input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark"
                  disabled={sending}
                  data-testid="contact-submit-button"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {sending ? 'Envoi...' : 'Envoyer'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default APropos;
