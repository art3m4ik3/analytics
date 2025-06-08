import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const faqData = [
  {
    question: "Как создать и установить счетчик аналитики?",
    answer:
      "Перейдите на страницу создания счетчика, введите название и домен сайта. После создания вы получите код для установки, который нужно добавить на ваш сайт перед закрывающим тегом </body>.",
  },
  {
    question: "Как работает отслеживание без cookies?",
    answer:
      "Наша система использует анонимные идентификаторы и не сохраняет персональные данные пользователей. Мы отслеживаем только просмотры страниц и базовую информацию о сеансах без использования cookies.",
  },
  {
    question: "Сколько сайтов можно отслеживать?",
    answer:
      "Вы можете создать неограниченное количество счетчиков для ваших сайтов. Каждый счетчик работает независимо и имеет свою статистику.",
  },
  {
    question: "Как долго хранятся данные аналитики?",
    answer:
      "Данные аналитики хранятся неограниченное время. Вы можете в любой момент просмотреть историю посещений и статистику за любой период.",
  },
  {
    question: "Можно ли экспортировать данные?",
    answer:
      "Да, в разделе статистики есть кнопка экспорта данных. Вы можете загрузить отчеты в различных форматах для дальнейшего анализа.",
  },
  {
    question: "Как настроить отслеживание целей?",
    answer:
      "Для отслеживания целей используйте специальный API endpoint. В коде вашего сайта вызовите функцию отслеживания цели с указанием названия события.",
  },
  {
    question: "Влияет ли счетчик на скорость загрузки сайта?",
    answer:
      "Скрипт очень легкий (менее 2KB) и загружается асинхронно, поэтому не влияет на скорость загрузки вашего сайта.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />

      <div className="container mx-auto max-w-6xl px-4 py-16 pt-32">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Помощь и FAQ
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Ответы на часто задаваемые вопросы о веб-аналитике
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Часто задаваемые вопросы</h2>

          {faqData.map((faq, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
            >
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-lg">
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-xs font-medium text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0">
                    {index + 1}
                  </div>
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent className="pl-12">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {faq.answer}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
