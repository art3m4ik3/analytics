"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  Copy,
  Check,
  Calendar,
  Globe,
  TrendingUp,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Counter {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  isActive: boolean;
}

interface CounterListProps {
  onViewStats: (counterId: string) => void;
  counters?: Counter[];
}

export function CounterList({
  onViewStats,
  counters: propCounters,
}: CounterListProps) {
  const [counters, setCounters] = useState<Counter[]>(propCounters || []);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    if (propCounters) {
      setCounters(propCounters);
    }
  }, [propCounters]);

  const copyScript = async (counterId: string) => {
    const scriptUrl = `${window.location.origin}/api/script?id=${counterId}`;
    const scriptTag = `<script async defer src="${scriptUrl}"></script>`;

    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopiedId(counterId);
      setTimeout(() => setCopiedId(null), 2000);

      toast({
        title: "Код скопирован!",
        description: "Код счетчика успешно скопирован в буфер обмена.",
        variant: "success",
      });
    } catch (err) {
      console.error("Ошибка копирования:", err);
      toast({
        title: "Ошибка копирования",
        description: "Не удалось скопировать код в буфер обмена.",
        variant: "destructive",
      });
    }
  };

  if (counters.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">У вас пока нет счетчиков</p>
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Мои счетчики</h2>
        <Badge variant="secondary" className="px-3 py-1">
          {counters.length} {counters.length === 1 ? "счетчик" : "счетчиков"}
        </Badge>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {counters.map((counter) => (
          <Card
            key={counter.id}
            className="group hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/20"
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg leading-none">
                      {counter.name}
                    </CardTitle>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span className="font-mono text-xs">{counter.domain}</span>
                  </div>
                </div>
                <Badge
                  variant={counter.isActive ? "default" : "secondary"}
                  className="shrink-0"
                >
                  {counter.isActive ? "Активен" : "Неактивен"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Создан {formatDate(counter.createdAt)}</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyScript(counter.id)}
                  className="w-full justify-start"
                >
                  {copiedId === counter.id ? (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copiedId === counter.id ? "Скопировано!" : "Скопировать код"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => onViewStats(counter.id)}
                  className="w-full justify-start"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Статистика
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
