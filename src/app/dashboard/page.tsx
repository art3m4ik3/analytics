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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Plus,
  Globe,
  Eye,
  Calendar,
  TrendingUp,
  ArrowRight,
  Settings,
} from "lucide-react";

interface Counter {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  isActive: boolean;
}

export default function DashboardPage() {
  const [counters, setCounters] = useState<Counter[]>([]);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = localStorage.getItem("analytics_token");
    const savedCounters = localStorage.getItem("analytics_counters");

    if (savedToken) {
      setToken(savedToken);
      loadCountersFromServer(savedToken);
    } else if (savedCounters) {
      try {
        setCounters(JSON.parse(savedCounters));
      } catch (error) {
        console.error("Ошибка парсинга сохраненных счетчиков:", error);
      }
    }
    setLoading(false);
  }, []);

  const loadCountersFromServer = async (authToken: string) => {
    try {
      const response = await fetch("/api/counter/list", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCounters(data.counters || []);
        localStorage.setItem(
          "analytics_counters",
          JSON.stringify(data.counters || []),
        );
      }
    } catch (error) {
      console.error("Ошибка загрузки счетчиков:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const handleViewStats = (counterId: string) => {
    router.push(`/stats/${counterId}`);
  };

  const handleSettings = (counterId: string) => {
    router.push(`/stats/${counterId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Navigation />
        <div className="container max-w-6xl mx-auto px-4 py-16 pt-32">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!token || counters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <Navigation />
        <div className="container max-w-6xl mx-auto px-4 py-16 pt-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Добро пожаловать в Analytics
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              У вас пока нет счетчиков аналитики. Создайте первый счетчик, чтобы
              начать отслеживать посетителей вашего сайта.
            </p>

            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm mb-8">
              <CardContent className="p-8 pt-8">
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-4">
                      <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Создайте счетчик</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Настройте отслеживание для вашего сайта
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mb-4">
                      <Globe className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Установите код</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Добавьте код отслеживания на сайт
                    </p>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-xl flex items-center justify-center mb-4">
                      <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="font-semibold mb-2">Анализируйте</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Изучайте поведение посетителей
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={() => router.push("/create")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Создать первый счетчик
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />{" "}
      <div className="container max-w-7xl mx-auto px-4 py-16 pt-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Панель управления
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Управляйте вашими счетчиками аналитики
              </p>
            </div>
            <Button
              onClick={() => router.push("/create")}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mt-4 md:mt-0"
            >
              <Plus className="h-5 w-5 mr-2" />
              Новый счетчик
            </Button>
          </div>

          <div className="grid gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Обзор
                </CardTitle>
                <CardDescription>
                  Общая статистика по всем счетчикам
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {counters.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Всего счетчиков
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {counters.filter((c) => c.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Активных
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {new Set(counters.map((c) => c.domain)).size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Доменов
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-1">
                      24/7
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Мониторинг
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ваши счетчики
            </h2>

            <div className="grid gap-6">
              {counters.map((counter) => (
                <Card
                  key={counter.id}
                  className="border-0 shadow-lg hover:shadow-xl transition-all duration-200 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm group"
                >
                  <CardContent className="p-6 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                              {counter.name}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <Globe className="h-4 w-4" />
                              {counter.domain}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Создан {formatDate(counter.createdAt)}
                          </div>
                          <Badge
                            variant={counter.isActive ? "default" : "secondary"}
                            className={
                              counter.isActive
                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                                : ""
                            }
                          >
                            {counter.isActive ? "Активен" : "Неактивен"}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          onClick={() => handleViewStats(counter.id)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Статистика
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>{" "}
                        <Button
                          onClick={() => handleSettings(counter.id)}
                          variant="outline"
                          size="icon"
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
