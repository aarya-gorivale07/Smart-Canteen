import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UtensilsCrossed, Mail, Lock, AlertCircle, Sparkles, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login, registerUser } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (mode === 'register') {
      const result = registerUser(email, name, password);
      if (!result.ok) {
        setError(result.message ?? 'Registration failed.');
        return;
      }

      setSuccess(result.message ?? 'Registration submitted for approval.');
      setMode('login');
      setPassword('');
      setName('');
      return;
    }

    const result = login(email, password);
    if (!result.ok) setError(result.message ?? 'Invalid credentials. Please try again.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4 relative overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-20 left-10 text-6xl opacity-20"
        animate={{ y: [-10, 10, -10], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      >🍕</motion.div>
      <motion.div
        className="absolute top-40 right-16 text-5xl opacity-20"
        animate={{ y: [10, -10, 10], rotate: [0, -15, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
      >🍔</motion.div>
      <motion.div
        className="absolute bottom-32 left-20 text-5xl opacity-20"
        animate={{ y: [-8, 8, -8], rotate: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 3.5 }}
      >☕</motion.div>
      <motion.div
        className="absolute bottom-20 right-10 text-6xl opacity-20"
        animate={{ y: [8, -8, 8], rotate: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 4.5 }}
      >🍛</motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center pb-2">
            <motion.div
              className="mx-auto mb-4 w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-lg glow-primary"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <UtensilsCrossed className="w-10 h-10 text-primary-foreground" />
            </motion.div>
            <CardTitle className="text-3xl font-display text-gradient">Universal Canteen</CardTitle>
            <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1">
              <Sparkles className="w-4 h-4 text-accent" /> Sign in with your college email
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-5 rounded-xl bg-muted/60 p-1">
              <Button
                type="button"
                variant={mode === 'login' ? 'default' : 'ghost'}
                onClick={() => setMode('login')}
                className={mode === 'login' ? 'gradient-primary text-primary-foreground' : ''}
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
              <Button
                type="button"
                variant={mode === 'register' ? 'default' : 'ghost'}
                onClick={() => setMode('register')}
                className={mode === 'register' ? 'gradient-primary text-primary-foreground' : ''}
              >
                <UserPlus className="w-4 h-4 mr-2" /> Register
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'register' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">College Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="firstname.lastname@universal.edu.in"
                    value={email}
                    onChange={e => setEmail(e.target.value.toLowerCase())}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-canteen-green text-sm bg-canteen-green/10 p-3 rounded-lg"
                >
                  {success}
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </motion.div>
              )}
              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold text-lg h-12 shadow-lg hover:shadow-xl transition-all glow-primary">
                {mode === 'login' ? 'Sign In' : 'Register'}
              </Button>
            </form>
            <p className="text-center text-xs text-muted-foreground mt-4">
              {mode === 'login'
                ? 'Use your official Universal College email to login'
                : 'Registration will be reviewed by the admin before access is granted'}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
