'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowLeft, Eye, Target, Users, TrendingUp } from 'lucide-react';

interface StatsProps {
  counterId: string;
  token: string;
  onBack: () => void;
}

interface Stats {
  totalPageviews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ path: string; views: number }>;
  referrers: Array<{ source: string; visits: number }>;
  dailyStats: Array<{ date: string; pageviews: number; visitors: number }>;
  countries: Array<{ country: string; visits: number }>;
}

export function Stats({ counterId, token, onBack }: StatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/stats?counterId=${counterId}&period=${period}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        }      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [counterId, token, period]);

  const periods = [
    { value: '1d', label: '1 день' },
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' },
    { value: '90d', label: '90 дней' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Не удалось загрузить статистику</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>
      </div>    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад
        </Button>

        <div className="flex gap-2">
          {periods.map((p) => (
            <Button
              key={p.value}
              variant={period === p.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Просмотры страниц</CardTitle>
            <Eye className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalPageviews.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Уникальные посетители</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Средняя длительность сессии</CardTitle>
            <Target className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{Math.round(stats.avgSessionDuration)}с</div>
          </CardContent>
        </Card>

        <Card className="min-h-[120px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Показатель отказов</CardTitle>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.bounceRate}%</div>
          </CardContent>
        </Card>
      </div>

      {stats.dailyStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Динамика посещений</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="pageviews"
                  stroke="#8884d8"
                  name="Просмотры"
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#82ca9d"
                  name="Посетители"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">        {stats.topPages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Популярные страницы</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={stats.topPages.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="path" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-4">
                {stats.topPages.slice(0, 5).map((page, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="truncate flex-1">
                      <Badge variant="outline" className="mr-2">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{page.path}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {page.views}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {stats.referrers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Источники трафика</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {stats.referrers.slice(0, 5).map((referrer, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="truncate flex-1">
                      <Badge variant="outline" className="mr-2">
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{referrer.source}</span>
                    </div>
                    <div className="text-sm font-medium">
                      {referrer.visits}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {stats.countries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>География посетителей</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.countries.slice(0, 10).map((country, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="truncate flex-1">
                    <Badge variant="outline" className="mr-2">
                      {index + 1}
                    </Badge>
                    <span className="text-sm">{country.country}</span>
                  </div>
                  <div className="text-sm font-medium">
                    {country.visits}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
