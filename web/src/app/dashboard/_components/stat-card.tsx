import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string;
  iconBgClass?: string;
  trendIconClass?: string;
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  className,
  iconBgClass,
  trendIconClass,
}: StatCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden group hover:shadow-lg transition-all duration-1000 bg-linear-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 hover:to-cyan-500/20 border-blue-200",
        className
      )}
    >
      <CardHeader className="flex items-center justify-between mb-4">
        <div
          className={cn(
            "p-3 rounded-xl shadow-lg group-hover:scale-110 transition-all duration-500 bg-linear-to-br from-blue-500 to-cyan-500",
            iconBgClass
          )}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
        <TrendingUp className={cn("h-5 w-5 text-blue-600", trendIconClass)} />
      </CardHeader>
      <CardContent>
        <div>
          <CardTitle className="text-sm font-medium text-primary mb-1">
            {title}
          </CardTitle>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {description && (
            <CardDescription className="text-xs text-muted-foreground mt-1">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
