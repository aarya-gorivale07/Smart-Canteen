import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Lightbulb, Send, IndianRupee, Tag } from 'lucide-react';

const FeedbackPage = () => {
  const { feedbacks, addFeedback, user } = useApp();
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'feedback' | 'suggestion'>('feedback');
  const [suggestedPrice, setSuggestedPrice] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<'breakfast' | 'lunch' | 'snacks' | 'beverages'>('lunch');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    addFeedback(
      message.trim(),
      type,
      type === 'suggestion' && suggestedPrice ? Number(suggestedPrice) : undefined,
      type === 'suggestion' ? suggestedCategory : undefined
    );
    setMessage('');
    setSuggestedPrice('');
  };

  const myFeedbacks = feedbacks.filter(f => f.userId === user?.email);

  return (
    <div className="container py-6 px-4 max-w-2xl">
      <h1 className="font-display text-2xl text-gradient mb-6">Feedback & Suggestions</h1>

      <Card className="mb-6 border-2 border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Share Your Thoughts</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType('feedback')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  type === 'feedback' ? 'border-primary bg-primary/10 text-primary shadow-md' : 'border-border hover:border-primary/30'
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Feedback
              </button>
              <button
                type="button"
                onClick={() => setType('suggestion')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                  type === 'suggestion' ? 'border-secondary bg-secondary/10 text-secondary shadow-md' : 'border-border hover:border-secondary/30'
                }`}
              >
                <Lightbulb className="w-4 h-4" /> Menu Suggestion
              </button>
            </div>

            <Textarea
              placeholder={type === 'feedback' ? 'How was your experience today?' : 'Suggest a food item for tomorrow\'s menu...'}
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="resize-none"
            />

            {type === 'suggestion' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 p-4 rounded-xl bg-muted/50 border"
              >
                <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Suggestion Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs">Suggested Price (₹)</Label>
                    <div className="relative">
                      <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        placeholder="e.g. 60"
                        value={suggestedPrice}
                        onChange={e => setSuggestedPrice(e.target.value)}
                        className="pl-9"
                        min={1}
                        max={500}
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Category</Label>
                    <Select value={suggestedCategory} onValueChange={v => setSuggestedCategory(v as typeof suggestedCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">🌅 Breakfast</SelectItem>
                        <SelectItem value="lunch">🍛 Lunch</SelectItem>
                        <SelectItem value="snacks">🍟 Snacks</SelectItem>
                        <SelectItem value="beverages">🥤 Beverages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </motion.div>
            )}

            <Button type="submit" className="gradient-primary text-primary-foreground w-full gap-2 h-11 text-base font-bold shadow-lg hover:shadow-xl transition-shadow">
              <Send className="w-4 h-4" /> Submit
            </Button>
          </form>
        </CardContent>
      </Card>

      {myFeedbacks.length > 0 && (
        <>
          <h2 className="font-display text-lg mb-3">Your Submissions</h2>
          <div className="space-y-3">
            {myFeedbacks.map((f, i) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-card rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="capitalize">{f.type}</Badge>
                  <Badge className={
                    f.status === 'accepted' ? 'bg-canteen-green/10 text-canteen-green border-0' :
                    f.status === 'rejected' ? 'bg-destructive/10 text-destructive border-0' :
                    'bg-warning/10 text-warning border-0'
                  }>
                    {f.status}
                  </Badge>
                  {f.suggestedCategory && (
                    <Badge variant="secondary" className="capitalize text-xs">{f.suggestedCategory}</Badge>
                  )}
                  {f.suggestedPrice && (
                    <Badge variant="outline" className="text-xs">₹{f.suggestedPrice}</Badge>
                  )}
                </div>
                <p className="text-sm">{f.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.createdAt.toLocaleDateString()}</p>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FeedbackPage;
