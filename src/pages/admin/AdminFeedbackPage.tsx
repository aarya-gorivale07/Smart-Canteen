import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, CheckCircle, XCircle, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminFeedbackPage = () => {
  const { feedbacks, updateFeedbackStatus, orders } = useApp();

  const reviews = orders.filter(o => o.rating);

  return (
    <div className="container py-6 px-4">
      <h1 className="font-display text-2xl text-gradient mb-6">Feedback & Reviews</h1>

      <Tabs defaultValue="feedback">
        <TabsList className="mb-4">
          <TabsTrigger value="feedback">Feedback & Suggestions</TabsTrigger>
          <TabsTrigger value="reviews">Order Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback">
          <div className="space-y-3">
            {feedbacks.map((f, i) => (
              <motion.div key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="font-semibold">{f.userName}</span>
                        <Badge variant="outline" className="capitalize">{f.type}</Badge>
                        <Badge className={`border-0 ${
                          f.status === 'accepted' ? 'bg-canteen-green/10 text-canteen-green' :
                          f.status === 'rejected' ? 'bg-destructive/10 text-destructive' :
                          'bg-warning/10 text-warning'
                        }`}>{f.status}</Badge>
                        {f.suggestedCategory && (
                          <Badge variant="secondary" className="capitalize text-xs">{f.suggestedCategory}</Badge>
                        )}
                        {f.suggestedPrice && (
                          <Badge variant="outline" className="text-xs gap-1">
                            <IndianRupee className="w-3 h-3" />{f.suggestedPrice}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{f.createdAt.toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm mb-3">{f.message}</p>
                    {f.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => updateFeedbackStatus(f.id, 'accepted')} className="bg-canteen-green text-canteen-green-foreground gap-1">
                          <CheckCircle className="w-3 h-3" /> Accept
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => updateFeedbackStatus(f.id, 'rejected')} className="text-destructive gap-1">
                          <XCircle className="w-3 h-3" /> Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {feedbacks.length === 0 && <p className="text-center text-muted-foreground py-8">No feedback yet</p>}
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <div className="space-y-3">
            {reviews.map((o, i) => (
              <motion.div key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">Order #{o.tokenNumber}</span>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-4 h-4 ${s <= o.rating! ? 'fill-accent text-accent' : 'text-muted'}`} />
                        ))}
                      </div>
                    </div>
                    {o.review && <p className="text-sm text-muted-foreground">"{o.review}"</p>}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {reviews.length === 0 && <p className="text-center text-muted-foreground py-8">No reviews yet</p>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminFeedbackPage;
