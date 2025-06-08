import Link from "next/link";
import { BarChart3 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Analytics</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Быстрая, приватная и современная аналитика для ваших сайтов.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Продукт</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/create"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Создать счетчик
              </Link>
              <Link
                href="/dashboard"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Панель управления
              </Link>
              <Link
                href="/docs"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Документация
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Поддержка</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/help"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Помощь
              </Link>
              <Link
                href="/privacy"
                className="block text-muted-foreground hover:text-foreground transition-colors"
              >
                Приватность
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>Analytics &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
