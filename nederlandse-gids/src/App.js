import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Menu, 
  Search, 
  Globe, 
  ChevronDown, 
  Moon, 
  Sun,
  BookmarkPlus,
  User 
} from 'lucide-react';

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// Article Card Component
const ArticleCard = ({ article, onClick }) => {
  return (
    <article 
      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(article)}
    >
      <img 
        src={article.image_url || "/api/placeholder/800/400"} 
        alt={article.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.read_time}</span>
        </div>
        <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
        <p className="text-gray-600 mb-4">{article.excerpt}</p>
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-medium">{article.author}</p>
              <p className="text-xs text-gray-500">
                {new Date(article.created_at).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

// Article Detail Component
const ArticleDetail = ({ article, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-6 px-4 py-2 border rounded-lg hover:bg-gray-50"
      >
        ← Terug
      </button>
      
      <article>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="w-6 h-6 text-gray-500" />
          </div>
          <div>
            <p className="font-medium">{article.author}</p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{new Date(article.created_at).toLocaleDateString('nl-NL')}</span>
              <span>•</span>
              <span>{article.read_time}</span>
            </div>
          </div>
        </div>
        
        <img 
          src={article.image_url || "/api/placeholder/800/400"}
          alt={article.title}
          className="w-full rounded-lg mb-8"
        />
        
        <div className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: article.content }}>
        </div>
      </article>
    </div>
  );
};

// Main Layout Component
const Layout = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data);
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <nav className="fixed top-0 left-0 right-0 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="ml-4 text-lg font-semibold">Nederlandse Gids</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Zoeken..."
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                />
              </div>
              
              <button className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Globe className="h-4 w-4" />
                <span>NL</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside className={`fixed left-0 top-16 h-full w-64 border-r transform 
          ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          transition-transform duration-200 ease-in-out md:translate-x-0 
          bg-white dark:bg-gray-900`}
        >
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Categorieën</h2>
            {categories.map((category) => (
              <div key={category.id} className="mb-4">
                <h3 className="font-medium mb-2">{category.name}</h3>
                <ul className="space-y-1">
                  {category.subcategories?.map((sub, subIdx) => (
                    <li key={subIdx}>
                      <a 
                        href="#"
                        className="block px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        <main className={`flex-1 transition-all duration-200 ease-in-out ${isMenuOpen ? 'ml-64' : 'ml-0'} md:ml-64`}>
          <div className="max-w-4xl mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// Home Page Component
const HomePage = ({ onArticleClick }) => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching articles:', error);
      return;
    }

    setArticles(data);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Welkom bij Nederlandse Gids</h1>
      
      <section className="space-y-6">
        <h2 className="text-2xl font-bold">Uitgelichte Artikelen</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article}
              onClick={onArticleClick}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

// Main App Component
const BlogPlatform = () => {
  const [currentView, setCurrentView] = useState('home');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setCurrentView('article');
  };

  const handleBackClick = () => {
    setSelectedArticle(null);
    setCurrentView('home');
  };

  return (
    <Layout>
      {currentView === 'home' ? (
        <HomePage onArticleClick={handleArticleClick} />
      ) : (
        <ArticleDetail 
          article={selectedArticle}
          onBack={handleBackClick}
        />
      )}
    </Layout>
  );
};

export default BlogPlatform;