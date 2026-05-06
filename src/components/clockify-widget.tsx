import { Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseClockifyDuration } from "@/lib/utils/maintenance";
import type { ClockifyProject } from "@/types";

interface ClockifyWidgetProps {
  data: ClockifyProject;
  label: string;
}

export function ClockifyWidget({ data, label }: ClockifyWidgetProps) {
  const estimateStr = data.timeEstimate?.estimate
    ? data.estimate.estimate
    : "PT0H";

  const estimated = parseClockifyDuration(estimateStr);
  const actual = parseClockifyDuration(data.duration);
  const ratio = estimated > 0 ? actual / estimated : 0;
  const budgetUsed = data.budgetEstimate ? ratio * data.budgetEstimate : null;

  const isOver = ratio > 1;
  const isWarning = ratio > 0.8 && !isOver;

  const TrendIcon = isOver ? TrendingDown : isWarning ? Minus : TrendingUp;
  const trendColor = isOver ? "text-red-500" : isWarning ? "text-yellow-500" : "text-green-500";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Temps passé / estimé</span>
            <span className={trendColor}>{Math.round(ratio * 100)}%</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                isOver ? "bg-red-500" : isWarning ? "bg-yellow-500" : "bg-green-500"
              }`}
              style={{ width: `${Math.min(ratio * 100, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className="font-medium">{actual.toFixed(1)}h réelles</span>
            <span className="text-muted-foreground">{estimated.toFixed(0)}h budget</span>
          </div>
        </div>

        {data.budgetEstimate && (
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Budget contrat</p>
              <p className="text-sm font-semibold mt-0.5">{data.budgetEstimate}€</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Coût réel estimé</p>
              <p className={`text-sm font-semibold mt-0.5 flex items-center gap-1 ${trendColor}`}>
                <TrendIcon className="w-3.5 h-3.5" />
                {budgetUsed ? `${Math.round(budgetUsed)}€` : "—"}
              </p>
            </div>
          </div>
        )}

        {data.hourlyRate && (
          <p className="text-xs text-muted-foreground">
            TJM : {(data.hourlyRate.amount / 100).toFixed(0)}€/h
          </p>
        )}
      </CardContent>
    </Card>
  );
}
