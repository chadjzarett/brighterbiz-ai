import {
  ArrowLeft, Clock, DollarSign, BarChart3, Loader2, Lightbulb, Calendar, Mail, Megaphone,
  MessageCircle, Users, Settings, CalendarCheck, Instagram, FileText, CheckCircle2
} from 'lucide-react';

// Map keywords/categories to icons for recommendations
const getRecommendationIcon = (rec: Recommendation) => {
  const title = rec.title.toLowerCase();
  const category = rec.category.toLowerCase();
  if (title.match(/schedule|appointment|booking|reservation/)) return CalendarCheck;
  if (title.match(/reminder|follow/)) return Mail;
  if (title.match(/marketing|campaign|promotion/)) return Megaphone;
  if (title.match(/analytics|feedback|insight|report/)) return BarChart3;
  if (title.match(/review|sentiment/)) return MessageCircle;
  if (title.match(/customer|client|patient/)) return Users;
  if (title.match(/automation|tool|auto/)) return Settings;
  if (title.match(/social|post|instagram/)) return Instagram;
  if (title.match(/payment|invoice|cost|price/)) return DollarSign;
  if (title.match(/complete|done|success/)) return CheckCircle2;
  if (category.match(/analytics/)) return BarChart3;
  if (category.match(/marketing/)) return Megaphone;
  if (category.match(/customer/)) return Users;
  if (category.match(/operations/)) return Settings;
  if (category.match(/automation/)) return Settings;
  return Lightbulb;
};

// ... inside ResultsPage render ...
        <div className="grid gap-4 md:grid-cols-2">
          {sortRecommendationsByDifficulty(recommendations).map((recommendation) => {
            const Icon = getRecommendationIcon(recommendation);
            return (
              <Card key={recommendation.id} className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center mb-2">
                  <div className="w-7 h-7 bg-blue-50 rounded-md flex items-center justify-center mr-2">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 leading-tight flex-1">
                    {recommendation.title}
                  </h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ml-2 ${getCategoryColor(recommendation.category)}`}>
                    {recommendation.category}
                  </span>
                </div>
                <p className="text-gray-600 mb-3 text-sm leading-snug">
                  {recommendation.description}
                </p>
                <div className="space-y-2 border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      Difficulty:
                    </span>
                    <span className={`font-medium ${getDifficultyColor(recommendation.difficulty)}`}> 
                      {recommendation.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Est. Cost:
                    </span>
                    <span className="font-medium text-gray-900">
                      {recommendation.estimatedCost}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Timeline:
                    </span>
                    <span className="font-medium text-gray-900">
                      {recommendation.timeToImplement}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div> 