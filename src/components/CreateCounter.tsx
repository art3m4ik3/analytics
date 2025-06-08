"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Copy,
  Check,
  Globe,
  Tag,
  Code,
  Zap,
  BarChart3,
  ArrowLeft,
} from "lucide-react";

interface Counter {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  isActive: boolean;
}

interface CreateCounterProps {
  onCounterCreated: (counter: Counter, token: string) => void;
  onBack?: () => void;
  token?: string;
}

export function CreateCounter({
  onCounterCreated,
  onBack,
  token,
}: CreateCounterProps) {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptUrl, setScriptUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch("/api/counter/create", {
        method: "POST",
        headers,
        body: JSON.stringify({ name, domain }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка создания счетчика");
      }

      const scriptUrl = `${window.location.origin}/api/script?id=${data.counterId}`;
      setScriptUrl(scriptUrl);
      onCounterCreated(data.counter, data.token);
      setName("");
      setDomain("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setLoading(false);
    }
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `<script async defer src="${scriptUrl}"></script>`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

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
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к списку
        </Button>
      )}
      <Card className="border-2">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Создать новый счетчик</CardTitle>
          <CardDescription className="text-base">
            Настройте отслеживание аналитики для вашего сайта
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Название сайта
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Мой замечательный сайт"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Введите понятное название для идентификации счетчика
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="domain"
                className="text-sm font-medium flex items-center gap-2"
              >
                <Globe className="h-4 w-4" />
                Домен сайта
              </label>
              <Input
                id="domain"
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="example.com"
                required
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                Укажите домен без протокола (http/https)
              </p>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full h-11">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Создание счетчика...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Создать счетчик
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>{" "}
      {scriptUrl && (
        <Card className="border-2 border-green-800 bg-green-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-200">
              <Code className="h-5 w-5" />
              Код для установки
              <Badge
                variant="secondary"
                className="bg-green-800 text-green-100"
              >
                Готов к использованию
              </Badge>
            </CardTitle>
            <CardDescription className="text-green-300">
              Скопируйте и вставьте этот код в тег &lt;head&gt; вашего сайта
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative bg-slate-900 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm text-green-400 font-mono">
                {`<script async defer src="${scriptUrl}"></script>`}
              </code>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-slate-800 border-slate-600 hover:bg-slate-700"
                onClick={copyToClipboard}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4 text-slate-400" />
                )}
              </Button>
            </div>            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border">
                <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">
                    Автоматический трекинг
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Отслеживание всех переходов по страницам
                  </p>
                </div>
              </div>              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border">
                <div className="w-8 h-8 bg-purple-900 rounded-lg flex items-center justify-center">
                  <Zap className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Цели через JS</h4>
                  <p className="text-xs text-muted-foreground">
                    analytics.goal(&apos;название&apos;)
                  </p>
                </div>
              </div>              <div className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg border">
                <div className="w-8 h-8 bg-emerald-900 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-medium text-sm">Реальное время</h4>
                  <p className="text-xs text-muted-foreground">
                    Мгновенное получение данных
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
