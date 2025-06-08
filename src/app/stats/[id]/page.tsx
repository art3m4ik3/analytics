"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import {
  BarChart3,
  ArrowLeft,
  Globe,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  RefreshCw,
  Download,
  Copy,
  Check,
  Code,
} from "lucide-react";

interface Counter {
  id: string;
  name: string;
  domain: string;
  createdAt: string;
  isActive: boolean;
}

interface StatsData {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  dailyStats: Array<{ date: string; pageviews: number; visitors: number }>;
  referrers: Array<{ source: string; visits: number }>;
  countries: Array<{ country: string; visits: number }>;
}

export default function StatsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const counterId = params.id as string;
  const [counter, setCounter] = useState<Counter | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("7d");
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  useEffect(() => {
    const loadCounterData = async () => {
      try {
        const savedCounters = localStorage.getItem("analytics_counters");
        if (savedCounters) {
          const counters = JSON.parse(savedCounters);
          const foundCounter = counters.find(
            (c: Counter) => c.id === counterId,
          );
          if (foundCounter) {
            setCounter(foundCounter);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки данных счетчика:", error);
      }
    };
    const loadStatsData = async (authToken: string) => {
      try {
        const response = await fetch(
          `/api/stats?counterId=${counterId}&period=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          console.log("Получены данные статистики:", data);
          setStats(data.stats);
        } else {
          setError("Ошибка загрузки статистики");
        }
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
        setStats({
          totalPageviews: 1250,
          uniqueVisitors: 890,
          avgSessionDuration: 180,
          bounceRate: 35,
          topPages: [
            { path: "/", views: 450 },
            { path: "/about", views: 230 },
            { path: "/contact", views: 180 },
            { path: "/services", views: 150 },
            { path: "/blog", views: 100 },
          ],
          dailyStats: [],
          referrers: [],
          countries: [],
        });
      } finally {
        setLoading(false);
      }
    };
    const savedToken = localStorage.getItem("analytics_token");
    if (savedToken) {
      loadCounterData();
      loadStatsData(savedToken);
    } else {
      setError("Токен не найден");
      setLoading(false);
    }
  }, [counterId, timeRange]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".export-menu-container")) {
        setShowExportMenu(false);
      }
    };

    if (showExportMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showExportMenu]);

  const refreshStats = async () => {
    const savedToken = localStorage.getItem("analytics_token");
    if (savedToken) {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/stats?counterId=${counterId}&period=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${savedToken}`,
            },
          },
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Обновленные данные статистики:", data);
          setStats(data.stats);
        } else {
          setError("Ошибка загрузки статистики");
        }
      } catch (error) {
        console.error("Ошибка загрузки статистики:", error);
      } finally {
        setLoading(false);
      }
    }
  };
  const copyTrackingCode = async () => {
    if (!counter) return;

    const scriptUrl = `${window.location.origin}/api/script?id=${counterId}`;
    const scriptTag = `<script async defer src="${scriptUrl}"></script>`;

    try {
      await navigator.clipboard.writeText(scriptTag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);

      toast({
        title: "Код скопирован!",
        description: "Код счетчика успешно скопирован в буфер обмена.",
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

  const exportToCSV = () => {
    if (!stats || !counter) return;

    const csvData = [];
    csvData.push(["Метрика", "Значение"]);
    csvData.push(["Название счетчика", counter.name]);
    csvData.push(["Домен", counter.domain]);
    csvData.push(["Период", getTimeRangeLabel(timeRange)]);
    csvData.push(["Дата экспорта", new Date().toLocaleDateString("ru-RU")]);
    csvData.push([""]);
    csvData.push(["Общая статистика", ""]);
    csvData.push(["Просмотры страниц", stats.totalPageviews.toString()]);
    csvData.push(["Уникальные посетители", stats.uniqueVisitors.toString()]);
    csvData.push(["Показатель отказов (%)", stats.bounceRate.toString()]);
    csvData.push([""]);

    if (stats.topPages && stats.topPages.length > 0) {
      csvData.push(["Популярные страницы", ""]);
      csvData.push(["Путь", "Просмотры"]);
      stats.topPages.forEach((page) => {
        csvData.push([page.path, page.views.toString()]);
      });
      csvData.push([""]);
    }

    if (stats.referrers && stats.referrers.length > 0) {
      csvData.push(["Источники трафика", ""]);
      csvData.push(["Источник", "Визиты"]);
      stats.referrers.forEach((referrer) => {
        csvData.push([referrer.source, referrer.visits.toString()]);
      });
      csvData.push([""]);
    }

    if (stats.dailyStats && stats.dailyStats.length > 0) {
      csvData.push(["Ежедневная статистика", ""]);
      csvData.push(["Дата", "Просмотры", "Посетители"]);
      stats.dailyStats.forEach((day) => {
        csvData.push([
          new Date(day.date).toLocaleDateString("ru-RU"),
          day.pageviews.toString(),
          day.visitors.toString(),
        ]);
      });
    }

    const csvContent = csvData
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\ufeff" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_${counter.name}_${timeRange}_${
        new Date().toISOString().split("T")[0]
      }.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Экспорт завершен",
      description: "Статистика экспортирована в CSV файл.",
    });
  };

  const exportToJSON = () => {
    if (!stats || !counter) return;

    const exportData = {
      counter: {
        id: counter.id,
        name: counter.name,
        domain: counter.domain,
        isActive: counter.isActive,
        createdAt: counter.createdAt,
      },
      exportInfo: {
        period: timeRange,
        periodLabel: getTimeRangeLabel(timeRange),
        exportDate: new Date().toISOString(),
        exportDateFormatted: new Date().toLocaleDateString("ru-RU"),
      },
      statistics: stats,
    };

    const jsonContent = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonContent], {
      type: "application/json;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `analytics_${counter.name}_${timeRange}_${
        new Date().toISOString().split("T")[0]
      }.json`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Экспорт завершен",
      description: "Статистика экспортирована в JSON файл.",
    });
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(num);
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "1d":
        return "Сегодня";
      case "7d":
        return "7 дней";
      case "30d":
        return "30 дней";
      case "90d":
        return "3 месяца";
      default:
        return "7 дней";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-6xl mb-6">📊</div>
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              Ошибка загрузки статистики
            </h1>
            <p className="text-gray-400 mb-8">{error}</p>
            <Button onClick={() => router.push("/dashboard")} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Вернуться к панели управления
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />{" "}
      <div className="container max-w-7xl mx-auto px-4 py-16 pt-32">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="outline"
                size="icon"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {counter?.name || "Статистика"}
                </h1>
                {counter && (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Globe className="h-4 w-4" />
                    {counter.domain}
                    <Badge
                      variant={counter.isActive ? "default" : "secondary"}
                      className={
                        counter.isActive
                          ? "bg-green-900/20 text-green-400 border-green-800"
                          : ""
                      }
                    >
                      {counter.isActive ? "Активен" : "Неактивен"}
                    </Badge>
                  </div>
                )}
              </div>
            </div>{" "}
            <div className="flex items-center gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-600 rounded-lg bg-slate-800"
              >
                <option value="1d">Сегодня</option>
                <option value="7d">7 дней</option>
                <option value="30d">30 дней</option>
                <option value="90d">3 месяца</option>
              </select>
              <Button
                onClick={copyTrackingCode}
                variant="outline"
                size="icon"
                title="Копировать код счетчика"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Code className="h-4 w-4" />
                )}
              </Button>{" "}
              <Button
                onClick={refreshStats}
                variant="outline"
                size="icon"
                title="Обновить статистику"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <div className="relative export-menu-container">
                <Button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  variant="outline"
                  size="icon"
                  title="Экспорт данных"
                >
                  <Download className="h-4 w-4" />
                </Button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          exportToCSV();
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Экспорт в CSV
                      </button>
                      <button
                        onClick={() => {
                          exportToJSON();
                          setShowExportMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Экспорт в JSON
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {stats && (
            <div className="space-y-8">
              {" "}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm min-h-[140px] pt-8">
                  <CardContent className="p-6 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Просмотры страниц
                        </p>
                        <p className="text-3xl font-bold text-blue-400">
                          {formatNumber(stats?.totalPageviews || 0)}
                        </p>
                      </div>{" "}
                      <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center">
                        <Eye className="h-6 w-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
                <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm min-h-[140px] pt-8">
                  <CardContent className="p-6 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Уникальные посетители
                        </p>
                        <p className="text-3xl font-bold text-green-400">
                          {formatNumber(stats?.uniqueVisitors || 0)}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center">
                        <Users className="h-6 w-6 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>{" "}
                <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm min-h-[140px] pt-8">
                  <CardContent className="p-6 flex items-center">
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <p className="text-sm text-gray-400 mb-2">
                          Показатель отказов
                        </p>
                        <p className="text-3xl font-bold text-orange-400">
                          {stats?.bounceRate || 0}%
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-900/50 rounded-xl flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Популярные страницы
                    </CardTitle>
                    <CardDescription>
                      Самые посещаемые страницы за{" "}
                      {getTimeRangeLabel(timeRange).toLowerCase()}
                    </CardDescription>
                  </CardHeader>{" "}
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.topPages?.map((page, index) => (
                        <div
                          key={page.path}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-blue-900/50 rounded-full flex items-center justify-center text-xs font-medium text-blue-400">
                              {index + 1}
                            </div>
                            <span className="font-medium">{page.path}</span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatNumber(page.views)}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">
                          Нет данных
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Источники трафика
                    </CardTitle>
                    <CardDescription>
                      Откуда приходят ваши посетители
                    </CardDescription>
                  </CardHeader>{" "}
                  <CardContent>
                    <div className="space-y-4">
                      {stats?.referrers?.map((referrer, index) => (
                        <div
                          key={referrer.source}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-green-900/50 rounded-full flex items-center justify-center text-xs font-medium text-green-400">
                              {index + 1}
                            </div>
                            <span className="font-medium">
                              {referrer.source}
                            </span>
                          </div>
                          <span className="text-sm text-gray-400">
                            {formatNumber(referrer.visits)}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500 text-center py-4">
                          Нет данных
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Статистика по дням
                  </CardTitle>
                  <CardDescription>
                    Динамика посещений за{" "}
                    {getTimeRangeLabel(timeRange).toLowerCase()}
                  </CardDescription>
                </CardHeader>{" "}
                <CardContent>
                  <div className="space-y-4">
                    {stats?.dailyStats?.map((day) => (
                      <div
                        key={day.date}
                        className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                      >
                        <div className="font-medium">
                          {new Date(day.date).toLocaleDateString("ru-RU", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>
                              {formatNumber(day.pageviews)} просмотров
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span>
                              {formatNumber(day.visitors)} посетителей
                            </span>
                          </div>
                        </div>
                      </div>
                    )) || (
                      <p className="text-gray-500 text-center py-4">
                        Нет данных за выбранный период
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-lg bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5 text-blue-400" />
                    Код для установки
                  </CardTitle>
                  <CardDescription>
                    Добавьте этот код в секцию &lt;head&gt; вашего сайта для
                    начала отслеживания
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-950 rounded-lg p-4 relative">
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{`<script async defer src="${window.location.origin}/api/script?id=${counterId}"></script>`}</code>
                    </pre>
                    <Button
                      onClick={copyTrackingCode}
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Скопировано
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Копировать
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="mt-4 text-sm text-gray-400">
                    <p className="mb-2">
                      <strong>Инструкция по установке:</strong>
                    </p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Скопируйте код выше</li>
                      <li>Откройте HTML файл вашего сайта</li>
                      <li>
                        Вставьте код перед закрывающим тегом &lt;/head&gt;
                      </li>
                      <li>Сохраните файл и загрузите на сервер</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
