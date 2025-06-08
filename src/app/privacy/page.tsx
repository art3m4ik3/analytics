import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Eye,
  UserCheck,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const privacyPrinciples = [
  {
    icon: Shield,
    title: "Никаких cookies",
    description:
      "Мы не используем cookies или другие технологии отслеживания для идентификации пользователей.",
  },
  {
    icon: Lock,
    title: "Анонимные данные",
    description:
      "Все собираемые данные полностью анонимны и не могут быть связаны с конкретными пользователями.",
  },
  {
    icon: Eye,
    title: "Открытость",
    description:
      "Мы четко объясняем, какие данные собираем и как их используем. Никаких скрытых механизмов.",
  },
  {
    icon: UserCheck,
    title: "Соответствие GDPR",
    description:
      "Наша система полностью соответствует требованиям GDPR и другим международным стандартам.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Navigation />

      <div className="container mx-auto max-w-4xl px-4 py-16 pt-32">
        <div className="flex items-center gap-4 mb-8">
          {" "}
          <Button asChild variant="outline" size="icon">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Политика приватности
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Последнее обновление: 7 июня 2025 года
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {privacyPrinciples.map((principle, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
            >
              <CardContent className="p-6 pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <principle.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{principle.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {principle.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>1. Какие данные мы собираем</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Analytics собирает минимальный набор анонимных данных для
                предоставления статистики веб-сайтов:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">URL посещенных страниц</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">
                    HTTP referer (источник перехода)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">
                    User agent браузера (тип устройства и браузера)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">
                    IP-адрес (используется только для определения страны)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm">Временные метки посещений</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>2. Что мы НЕ собираем</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Мы принципиально не собираем персональные данные:
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  • Не используем cookies или локальное хранилище для
                  отслеживания
                </p>
                <p>• Не собираем email адреса или другие контактные данные</p>
                <p>• Не отслеживаем пользователей между сессиями</p>
                <p>• Не создаем профили пользователей</p>
                <p>• Не передаем данные третьим лицам для рекламы</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>3. Как мы используем данные</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Собранные данные используются исключительно для:
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Подсчета количества посетителей и просмотров страниц</p>
                <p>• Анализа популярных страниц веб-сайта</p>
                <p>• Определения источников трафика</p>
                <p>• Выявления трендов посещаемости</p>
                <p>
                  • Предоставления агрегированной статистики владельцам сайтов
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>4. Хранение и безопасность данных</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Мы обеспечиваем безопасность данных:
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Данные хранятся на защищенных серверах с шифрованием</p>
                <p>• Доступ к данным имеют только авторизованные сотрудники</p>
                <p>
                  • Регулярное создание резервных копий для предотвращения
                  потери данных
                </p>
                <p>
                  • Мониторинг безопасности и защита от несанкционированного
                  доступа
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>5. Ваши права</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Поскольку мы не собираем персональные данные, большинство прав
                GDPR неприменимы. Однако вы можете:
              </p>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>• Запросить информацию о том, какие данные мы собираем</p>
                <p>• Попросить владельца сайта удалить счетчик аналитики</p>
                <p>
                  • Использовать блокировщики скриптов для предотвращения
                  отслеживания
                </p>
                <p>• Связаться с нами по любым вопросам приватности</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>6. Изменения в политике</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                Мы можем обновлять данную политику приватности время от времени.
                Существенные изменения будут опубликованы на этой странице с
                обновленной датой.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
