"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
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
  Plus,
} from "lucide-react";

interface Counter {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  isActive: boolean;
}

export default function CreateCounterPage() {
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scriptUrl, setScriptUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [token, setToken] = useState<string>("");
  const [createdCounter, setCreatedCounter] = useState<Counter | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("analytics_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

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

      if (response.ok) {
        const newCounter = data.counter;
        const newToken = data.token;

        if (!token && newToken) {
          setToken(newToken);
          localStorage.setItem("analytics_token", newToken);
        }

        setCreatedCounter(newCounter);
        setScriptUrl(
          `${window.location.origin}/api/script?id=${newCounter.id}`,
        );

        const savedCounters = localStorage.getItem("analytics_counters");
        const existingCounters = savedCounters ? JSON.parse(savedCounters) : [];
        const updatedCounters = [newCounter, ...existingCounters];
        localStorage.setItem(
          "analytics_counters",
          JSON.stringify(updatedCounters),
        );

        toast({
          title: "Счетчик создан!",
          description:
            "Теперь вы можете установить код отслеживания на свой сайт.",
        });
      } else {
        setError(data.error || "Произошла ошибка при создании счетчика");
      }
    } catch (err) {
      setError("Произошла ошибка при создании счетчика");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (scriptUrl) {
      try {
        await navigator.clipboard.writeText(
          `<script defer async src="${scriptUrl}"></script>`,
        );
        setCopied(true);
        toast({
          title: "Скопировано!",
          description: "Код отслеживания скопирован в буфер обмена.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Ошибка копирования:", err);
      }
    }
  };

  if (createdCounter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navigation />

        <div className="container max-w-6xl mx-auto px-4 py-16 pt-32">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <Check className="h-10 w-10 text-white" />
                </div>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                Счетчик успешно создан!
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Теперь установите код отслеживания на ваш сайт, чтобы начать
                собирать данные о посетителях.
              </p>
            </div>{" "}
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-0 shadow-lg bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Информация о счетчике
                      </CardTitle>
                      <CardDescription>
                        Детали вашего нового счетчика
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-400">Название</p>
                      <p className="font-medium">{createdCounter.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-400">Домен</p>
                      <p className="font-medium">{createdCounter.domain}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full" />
                    <div>
                      <p className="text-sm text-gray-400">Статус</p>
                      <Badge
                        variant="outline"
                        className="bg-green-900/20 text-green-400 border-green-800"
                      >
                        Активен
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>{" "}
              <Card className="border-0 shadow-lg bg-slate-800/70 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <Code className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        Код отслеживания
                      </CardTitle>
                      <CardDescription>
                        Установите этот код на ваш сайт
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`<script async defer src="${scriptUrl}"></script>`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute top-2 right-2 h-8 w-8 p-0"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    Добавьте этот код в секцию &lt;head&gt; вашего сайта для
                    начала отслеживания.
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white mb-8">
              <CardContent className="p-8 pt-8">
                <div className="flex items-center gap-4 mb-4">
                  {" "}
                  <div className="w-12 h-12 bg-slate-800/50 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Что дальше?</h3>
                    <p className="opacity-90">
                      Следующие шаги для настройки аналитики
                    </p>
                  </div>
                </div>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  {" "}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="font-semibold mb-2">1. Установите код</div>
                    <p className="opacity-90">
                      Добавьте код отслеживания в HTML вашего сайта
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="font-semibold mb-2">
                      2. Проверьте работу
                    </div>
                    <p className="opacity-90">
                      Перейдите на сайт и убедитесь, что данные поступают
                    </p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="font-semibold mb-2">3. Анализируйте</div>
                    <p className="opacity-90">
                      Изучайте статистику в панели управления
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => router.push(`/stats/${createdCounter.id}`)}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
              >
                <BarChart3 className="h-5 w-5 mr-2" />
                Посмотреть статистику
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                variant="outline"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />К панели управления
              </Button>
              <Button
                onClick={() => {
                  setCreatedCounter(null);
                  setName("");
                  setDomain("");
                  setScriptUrl("");
                  setError("");
                }}
                size="lg"
                variant="outline"
              >
                <Plus className="h-5 w-5 mr-2" />
                Создать еще один
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      <div className="container max-w-6xl mx-auto px-4 py-16 pt-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Plus className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Создать новый счетчик
            </h1>
            <p className="text-xl text-gray-300">
              Настройте отслеживание для вашего сайта за несколько минут
            </p>
          </div>

          <Card className="border-0 shadow-xl bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl text-center">
                Информация о сайте
              </CardTitle>
              <CardDescription className="text-center">
                Введите данные вашего сайта для создания счетчика аналитики
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    <Tag className="h-4 w-4" />
                    Название счетчика
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Мой сайт"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Удобное название для идентификации счетчика
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
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    required
                    className="h-12 text-lg"
                  />
                  <p className="text-sm text-muted-foreground">
                    Домен вашего сайта без протокола (http/https)
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-800 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Создание счетчика...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Создать счетчик
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              Уже есть счетчики?{" "}
              <Button
                variant="link"
                className="p-0 h-auto text-blue-600 hover:text-blue-700"
                onClick={() => router.push("/dashboard")}
              >
                Перейти к панели управления
              </Button>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
