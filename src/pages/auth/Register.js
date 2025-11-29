import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ email: '', password: '', nom: '', prenom: '', telephone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
      toast.success('Inscription réussie !');
      navigate('/mon-compte');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: 'var(--beige)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/"><h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display', color: 'var(--brown)' }}>Mikombo Park</h1></Link>
          <p className="text-gray-600 mt-2">Créez votre compte</p>
        </div>
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label htmlFor="prenom">Prénom</Label><Input type="text" id="prenom" name="prenom" value={formData.prenom} onChange={handleChange} required /></div>
              <div><Label htmlFor="nom">Nom</Label><Input type="text" id="nom" name="nom" value={formData.nom} onChange={handleChange} required /></div>
            </div>
            <div><Label htmlFor="email">Email</Label><Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
            <div><Label htmlFor="telephone">Téléphone</Label><Input type="tel" id="telephone" name="telephone" value={formData.telephone} onChange={handleChange} required /></div>
            <div><Label htmlFor="password">Mot de passe</Label><Input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" /></div>
            <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-dark"><UserPlus className="w-4 h-4 mr-2" />{loading ? 'Inscription...' : 'S\'inscrire'}</Button>
          </form>
          <div className="mt-4 text-center text-sm"><span className="text-gray-600">Déjà un compte ? </span><Link to="/login" className="font-medium" style={{ color: 'var(--primary)' }}>Se connecter</Link></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
