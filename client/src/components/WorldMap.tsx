import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Globe, MapPin } from "lucide-react";

interface CountryData {
  country: string;
  visitors: number;
  percentage: number;
}

interface WorldMapProps {
  countries: CountryData[];
  totalUsers: number;
}

export default function WorldMap({ countries, totalUsers }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  // Create a simple visual representation of world regions with user data
  const getCountryColor = (country: string, visitors: number) => {
    if (visitors === 0) return "fill-gray-200 dark:fill-gray-700";
    if (visitors >= 10) return "fill-green-500";
    if (visitors >= 5) return "fill-yellow-500";
    if (visitors >= 1) return "fill-blue-500";
    return "fill-gray-300 dark:fill-gray-600";
  };

  const getCountryIntensity = (visitors: number, maxVisitors: number) => {
    if (maxVisitors === 0) return 0.1;
    const intensity = visitors / maxVisitors;
    return Math.max(0.2, Math.min(1, intensity));
  };

  const maxVisitors = countries.length > 0 ? Math.max(...countries.map(c => c.visitors)) : 0;

  return (
    <div className="w-full mt-8">
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-gray-600" />
            <h3 className="text-base font-medium text-gray-900">Global User Distribution</h3>
          </div>
        </div>
        <div className="p-6">
          {/* Interactive world map visualization */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 mb-6">
            <div className="relative h-64 flex items-center justify-center">
              {/* Simplified world map visualization */}
              <svg
                viewBox="0 0 800 400"
                className="w-full h-full max-w-4xl"
                style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
              >
              {/* World continents - simplified shapes */}
              
              {/* Africa */}
              <path
                d="M380 160 L400 140 L420 145 L440 160 L450 180 L455 200 L450 220 L440 240 L420 250 L400 245 L385 235 L375 210 L380 180 Z"
                className={`transition-all duration-300 cursor-pointer stroke-gray-300 dark:stroke-gray-600 stroke-1 ${
                  countries.find(c => c.country === 'South Africa') 
                    ? 'fill-green-400 hover:fill-green-500' 
                    : 'fill-gray-200 dark:fill-gray-700 hover:fill-gray-300'
                }`}
                onClick={() => setSelectedCountry('South Africa')}
                opacity={countries.find(c => c.country === 'South Africa') 
                  ? getCountryIntensity(countries.find(c => c.country === 'South Africa')?.visitors || 0, maxVisitors) 
                  : 0.3}
              />
              
              {/* Europe */}
              <path
                d="M380 100 L420 95 L450 100 L460 110 L455 125 L440 130 L420 125 L400 120 L385 115 Z"
                className={`transition-all duration-300 cursor-pointer stroke-gray-300 dark:stroke-gray-600 stroke-1 ${
                  countries.find(c => c.country === 'United Kingdom' || c.country === 'Germany' || c.country === 'France') 
                    ? 'fill-blue-400 hover:fill-blue-500' 
                    : 'fill-gray-200 dark:fill-gray-700 hover:fill-gray-300'
                }`}
                onClick={() => setSelectedCountry('Europe')}
                opacity={0.4}
              />
              
              {/* North America */}
              <path
                d="M150 120 L250 110 L280 130 L270 160 L250 180 L200 185 L150 180 L120 160 L130 140 Z"
                className={`transition-all duration-300 cursor-pointer stroke-gray-300 dark:stroke-gray-600 stroke-1 ${
                  countries.find(c => c.country === 'United States' || c.country === 'Canada') 
                    ? 'fill-purple-400 hover:fill-purple-500' 
                    : 'fill-gray-200 dark:fill-gray-700 hover:fill-gray-300'
                }`}
                onClick={() => setSelectedCountry('North America')}
                opacity={0.4}
              />
              
              {/* Asia */}
              <path
                d="M500 120 L600 115 L650 130 L670 150 L660 170 L640 180 L600 175 L550 170 L520 160 L505 140 Z"
                className={`transition-all duration-300 cursor-pointer stroke-gray-300 dark:stroke-gray-600 stroke-1 ${
                  countries.find(c => c.country === 'India' || c.country === 'China' || c.country === 'Japan') 
                    ? 'fill-orange-400 hover:fill-orange-500' 
                    : 'fill-gray-200 dark:fill-gray-700 hover:fill-gray-300'
                }`}
                onClick={() => setSelectedCountry('Asia')}
                opacity={0.4}
              />
              
              {/* Australia */}
              <path
                d="M580 280 L620 275 L640 285 L635 300 L615 305 L590 300 L580 290 Z"
                className={`transition-all duration-300 cursor-pointer stroke-gray-300 dark:stroke-gray-600 stroke-1 ${
                  countries.find(c => c.country === 'Australia') 
                    ? 'fill-teal-400 hover:fill-teal-500' 
                    : 'fill-gray-200 dark:fill-gray-700 hover:fill-gray-300'
                }`}
                onClick={() => setSelectedCountry('Australia')}
                opacity={0.4}
              />

              {/* User location markers */}
              {countries.map((country, index) => {
                const positions: Record<string, { x: number; y: number }> = {
                  'South Africa': { x: 420, y: 220 },
                  'United States': { x: 200, y: 150 },
                  'United Kingdom': { x: 400, y: 110 },
                  'Canada': { x: 180, y: 130 },
                  'Australia': { x: 610, y: 290 },
                  'Germany': { x: 420, y: 115 },
                  'France': { x: 400, y: 120 },
                  'India': { x: 550, y: 160 },
                  'Brazil': { x: 280, y: 220 },
                  'Nigeria': { x: 390, y: 180 }
                };

                const position = positions[country.country];
                if (!position || country.visitors === 0) return null;

                return (
                  <g key={country.country}>
                    {/* Pulsing circle for active locations */}
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="8"
                      className="fill-red-500 animate-pulse"
                      opacity="0.7"
                    />
                    <circle
                      cx={position.x}
                      cy={position.y}
                      r="4"
                      className="fill-red-600"
                    />
                    {/* User count badge */}
                    <text
                      x={position.x}
                      y={position.y - 15}
                      textAnchor="middle"
                      className="text-xs font-bold fill-gray-800 dark:fill-gray-200"
                    >
                      {country.visitors}
                    </text>
                  </g>
                );
              })}
              </svg>

              {/* Legend */}
              <div className="absolute bottom-4 left-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-lg">
                  <div className="text-xs font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Active Users
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600 dark:text-gray-400">Live Users</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Country statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {countries.length > 0 ? (
              countries.slice(0, 6).map((country, index) => (
                <div
                  key={country.country}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                    selectedCountry === country.country
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedCountry(country.country)}
                >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-sm">{country.country}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    #{index + 1}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {country.visitors}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {country.percentage.toFixed(1)}% of total users
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, country.percentage)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Geographic Data Available
              </h3>
              <p className="text-gray-500 dark:text-gray-500">
                User location data will appear here as visitors sign up from different countries
              </p>
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {countries.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Countries</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Users</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {countries.length > 0 ? countries[0].country : 'N/A'}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Top Country</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {countries.length > 0 ? countries[0].percentage.toFixed(1) : '0'}%
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Top Share</div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}