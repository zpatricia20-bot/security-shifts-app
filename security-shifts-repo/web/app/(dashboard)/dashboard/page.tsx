// app/(dashboard)/dashboard/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useShifts } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function DashboardPage() {
  const [today, setToday] = useState(new Date());
  const { data: shifts = [], isLoading } = useShifts(
    { date: today.toISOString().split('T')[0] },
    { enabled: true }
  );

  const inProgressCount = shifts.filter((s: any) => s.status === "IN_PROGRESS").length;
  const completedCount = shifts.filter((s: any) => s.status === "COMPLETED").length;
  const pendingCount = shifts.filter((s: any) => s.status === "PLANNED").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">{format(today, "EEEE, MMMM d, yyyy")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Planned Shifts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Shifts */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Shifts</CardTitle>
          <CardDescription>{shifts.length} shifts</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Loading...</p>
          ) : shifts.length === 0 ? (
            <p className="text-gray-500">No shifts scheduled for today</p>
          ) : (
            <div className="space-y-4">
              {shifts.map((shift: any) => (
                <div key={shift.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">{shift.shop.name}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(shift.startAt), "HH:mm")} - {format(new Date(shift.endAt), "HH:mm")}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{shift.assignments.length} operators</p>
                    </div>
                    <Badge
                      variant={
                        shift.status === "IN_PROGRESS"
                          ? "default"
                          : shift.status === "COMPLETED"
                          ? "outline"
                          : "secondary"
                      }
                    >
                      {shift.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
