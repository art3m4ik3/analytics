"use client";

import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Code,
  Copy,
  ArrowLeft,
  BookOpen,
  Settings,
  BarChart3,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const installationSteps = [
  {
    step: 1,
    title: "Создайте счетчик",
    description:
      "Перейдите на страницу создания и укажите название и домен вашего сайта.",
    action: "Создать счетчик",
  },
  {
    step: 2,
    title: "Скопируйте код",
    description: "Получите уникальный код отслеживания для вашего сайта.",
    action: "Скопировать код",
  },
  {
    step: 3,
    title: "Установите на сайт",
    description:
      "Добавьте код перед закрывающим тегом </body> на всех страницах.",
    action: "Установить код",
  },
  {
    step: 4,
    title: "Проверьте работу",
    description:
      "Откройте ваш сайт и убедитесь, что данные поступают в панель аналитики.",
    action: "Проверить статистику",
  },
];

export default function DocsPage() {
  const [copiedText, setCopiedText] = useState("");

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(""), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navigation />

      <div className="container mx-auto max-w-6xl px-4 py-16 pt-32">
        <div className="flex items-center gap-4 mb-8">
          {" "}
          <Button asChild variant="outline" size="icon">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Документация
            </h1>
            <p className="text-gray-300">
              Все, что нужно знать для начала работы с Analytics
            </p>
          </div>
        </div>
        <div className="grid lg:grid-cols-4 gap-6 mb-12">
          {" "}
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Быстрый старт</h3>
              <p className="text-sm text-gray-400">
                Установите аналитику за 5 минут
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-green-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">API</h3>
              <p className="text-sm text-gray-400">Интеграция через API</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Settings className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Настройка</h3>
              <p className="text-sm text-gray-400">Продвинутые настройки</p>
            </CardContent>
          </Card>{" "}
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-orange-900/50 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="font-semibold mb-2">Примеры</h3>
              <p className="text-sm text-gray-400">Готовые решения</p>
            </CardContent>
          </Card>
        </div>{" "}
        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Быстрая установка
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {installationSteps.map((step) => (
                  <div
                    key={step.step}
                    className="text-center p-4 rounded-lg bg-slate-700/50"
                  >
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-medium">
                      {step.step}
                    </div>
                    <h4 className="font-semibold mb-2 text-sm">{step.title}</h4>
                    <p className="text-xs text-gray-400 mb-3">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>{" "}
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Код для установки
              </CardTitle>
            </CardHeader>{" "}
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Добавьте этот код в секцию &lt;head&gt; всех страниц вашего
                сайта:
              </p>{" "}
              <div className="bg-gray-900 rounded-lg p-4 relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2 h-8 px-2"
                  onClick={() =>
                    copyToClipboard(
                      '<script async src="http://localhost:3000/api/script?id=YOUR_COUNTER_ID"></script>',
                    )
                  }
                >
                  <Copy className="h-3 w-3" />
                  {copiedText ===
                  '<script async src="http://localhost:3000/api/script?id=YOUR_COUNTER_ID"></script>'
                    ? "Скопировано!"
                    : ""}
                </Button>
                <pre className="text-green-400 text-sm overflow-x-auto">
                  {`<script async src="http://localhost:3000/api/script?id=YOUR_COUNTER_ID"></script>`}
                </pre>
              </div>{" "}
              <p className="text-sm text-gray-400">
                Замените{" "}
                <code className="bg-gray-700 px-1 rounded">
                  YOUR_COUNTER_ID
                </code>{" "}
                на ID вашего счетчика.
              </p>
              <div className="mt-6">
                <h4 className="font-semibold mb-3 text-gray-200">
                  Альтернативная установка
                </h4>
                <p className="text-gray-300 mb-4">
                  Если вы не можете использовать внешний скрипт, интегрируйте
                  трекинг напрямую:
                </p>
                <div className="bg-gray-900 rounded-lg p-4">
                  <pre className="text-green-400 text-sm overflow-x-auto">
                    {`<script>
(function() {
  var counterId = 'YOUR_COUNTER_ID';
  var apiUrl = 'http://localhost:3000';
  var sessionId = localStorage.getItem('analytics_session_' + counterId);

  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 12);
    localStorage.setItem('analytics_session_' + counterId, sessionId);
  }

  function sendData(data) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(apiUrl + '/api/track/pageview',
        JSON.stringify(data));
    } else {
      fetch(apiUrl + '/api/track/pageview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(function() {});
    }
  }

  sendData({
    counterId: counterId,
    url: window.location.href,
    referrer: document.referrer,
    sessionId: sessionId
  });
})();
</script>`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Отслеживание целей</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Для отслеживания пользовательских событий (целей) отправляйте
                POST-запросы на API:
              </p>
              <div className="bg-gray-900 rounded-lg p-4">
                <pre className="text-green-400 text-sm overflow-x-auto">
                  {`// JavaScript пример
fetch('http://localhost:3000/api/track/goal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    counterId: 'YOUR_COUNTER_ID',
    goalName: 'button_click',
    sessionId: 'user_session_id' // опционально
  })
});

// Примеры целей:
// - button_click (клик по кнопке)
// - form_submit (отправка формы)
// - file_download (скачивание файла)
// - video_play (воспроизведение видео)`}
                </pre>
              </div>
            </CardContent>
          </Card>{" "}
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {" "}
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs font-medium">
                      GET
                    </span>
                    <code className="text-sm">/api/script?id=COUNTER_ID</code>
                  </div>
                  <p className="text-sm text-gray-400">
                    Получение скрипта трекинга для установки на сайт
                  </p>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  {" "}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                      POST
                    </span>
                    <code className="text-sm">/api/track/pageview</code>
                  </div>
                  <p className="text-sm text-gray-400">
                    Отслеживание просмотра страницы
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Параметры: counterId, url, referrer, sessionId
                  </div>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                      POST
                    </span>
                    <code className="text-sm">/api/track/goal</code>
                  </div>
                  <p className="text-sm text-gray-400">
                    Отслеживание пользовательских целей и событий
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Параметры: counterId, goalName, sessionId
                  </div>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-900/50 text-green-400 px-2 py-1 rounded text-xs font-medium">
                      GET
                    </span>
                    <code className="text-sm">/api/stats</code>
                  </div>{" "}
                  <p className="text-sm text-gray-400">
                    Получение статистики счетчика (требует авторизации)
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Параметры: counterId, period (1d, 7d, 30d, 90d)
                  </div>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-xs font-medium">
                      POST
                    </span>
                    <code className="text-sm">/api/counter/create</code>
                  </div>
                  <p className="text-sm text-gray-400">
                    Создание нового счетчика аналитики
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Параметры: name, domain, userId
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Популярные CMS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {" "}
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">WordPress</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Добавьте код в файл header.php вашей темы перед закрывающим
                    тегом &lt;/head&gt; или используйте плагин для вставки кода
                    в заголовок.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-2">
                    <code className="text-green-400 text-xs">
                      wp_head(); перед &lt;/head&gt;
                    </code>
                  </div>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Next.js</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Добавьте код в компонент _document.js в секцию Head или
                    используйте next/head.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-2">
                    <code className="text-green-400 text-xs">
                      import Head from &apos;next/head&apos;
                    </code>
                  </div>
                </div>{" "}
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">React</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Добавьте код в public/index.html в секцию head или создайте
                    компонент Analytics.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-2">
                    <code className="text-green-400 text-xs">
                      &lt;head&gt; section в index.html
                    </code>
                  </div>
                </div>
                <div className="border border-gray-700 rounded-lg p-4">
                  <h4 className="font-semibold mb-2">HTML/CSS</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Просто вставьте код в секцию &lt;head&gt; на каждой странице
                    вашего сайта.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-2">
                    <code className="text-green-400 text-xs">
                      &lt;head&gt;...скрипт...&lt;/head&gt;
                    </code>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          <Card className="border-0 shadow-lg bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Возможности аналитики
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-200">
                    📊 Основная статистика
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Общее количество просмотров страниц</li>
                    <li>• Уникальные посетители</li>
                    <li>• Показатель отказов (bounce rate)</li>
                    <li>• Средняя длительность сессии</li>
                  </ul>{" "}
                  <h4 className="font-semibold text-gray-200 pt-4">
                    📈 Графики и визуализация
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Интерактивные графики посещений</li>
                    <li>• Динамика по дням</li>
                    <li>• Барные диаграммы популярных страниц</li>
                    <li>• Анализ источников трафика</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-200">
                    🌍 География и устройства
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Определение стран посетителей</li>
                    <li>• Использование IP-API.com для геолокации</li>
                    <li>• Анализ браузеров и операционных систем</li>
                    <li>• Отслеживание мобильного трафика</li>
                  </ul>

                  <h4 className="font-semibold text-gray-200 pt-4">
                    ⚡ Периоды анализа
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Последние 24 часа</li>
                    <li>• Последние 7 дней</li>
                    <li>• Последние 30 дней</li>
                    <li>• Последние 90 дней</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 border-0 text-white mt-12">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Готовы начать?</h3>
            <p className="mb-6 opacity-90">
              Создайте свой первый счетчик аналитики и получите детальную
              статистику уже сегодня.
            </p>{" "}
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-slate-800 text-blue-400 hover:bg-slate-700"
            >
              <Link href="/create">
                <BarChart3 className="h-5 w-5 mr-2" />
                Создать счетчик
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
