"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AnalyticsFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (startDate) params.set("startDate", startDate);
    else params.delete("startDate");

    if (endDate) params.set("endDate", endDate);
    else params.delete("endDate");

    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    router.push("?");
  };

  return (
    <Card className="relative">
      <CardContent className=" grid grid-cols-2 md:grid-cols-3 items-end gap-4">
        <div className="grid gap-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleApply} className="bg-main hover:bg-main/90">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filter
          </Button>
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              onClick={handleClear}
              size="sm"
              className="absolute bottom-4 right-4"
            >
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsFilter;
