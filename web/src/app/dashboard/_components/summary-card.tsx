import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ReactNode } from "react";

const SummaryCard = ({
  value,
  icon: Icon,
  title,
  description,
  href,
}: {
  value: number;
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium hover:text-main">
          <Link href={href}>{title}</Link>
        </CardTitle>
        {Icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
