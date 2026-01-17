import { motion } from 'framer-motion';

interface BudgetVisualizerProps {
  estimated: number;
  spent: number;
  currency?: string;
}

export function BudgetVisualizer({ estimated, spent, currency = '₺' }: BudgetVisualizerProps) {
  const percentage = Math.min(Math.round((spent / estimated) * 100), 100);
  const formatter = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 });

  return (
    <div className="my-8 p-6 bg-surface border border-border rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-text mb-4">Financial Transparency</h3>
      
      <div className="flex items-end justify-between mb-2">
         <div>
            <div className="text-xs text-text/50 uppercase tracking-wider">Spent</div>
            <div className="text-2xl font-bold text-primary">{formatter.format(spent)}</div>
         </div>
         <div className="text-right">
            <div className="text-xs text-text/50 uppercase tracking-wider">Estimated Budget</div>
            <div className="text-sm font-medium text-text/70">{formatter.format(estimated)}</div>
         </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-black/5 rounded-full overflow-hidden relative">
         <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${percentage > 90 ? 'bg-red-500' : 'bg-primary'}`}
         />
      </div>
      <div className="mt-2 flex justify-between text-xs text-text/50">
         <span>0%</span>
         <span>{percentage}% used</span>
         <span>100%</span>
      </div>

      <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg text-xs text-text/70">
         ℹ️ Costs are updated daily via Smart Contracts. Last sync: Today, 09:30 AM.
      </div>
    </div>
  );
}
