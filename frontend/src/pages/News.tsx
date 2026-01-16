import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, ChevronRight, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cmsApi } from '../api/cms';
import { ROUTES } from '../router/routes';
import { useFetch } from '../hooks/useFetch';

const News: React.FC = () => {
   const { i18n, t } = useTranslation(); // Get i18n instance

   // State for filters
   const [search, setSearch] = useState('');
   const [category, setCategory] = useState<string>('');
   const [debouncedSearch, setDebouncedSearch] = useState('');
   const [page, setPage] = useState(1);

   // Debounce search
   useEffect(() => {
      const timer = setTimeout(() => {
         setDebouncedSearch(search);
         setPage(1); // Reset to page 1 on new search
      }, 500);
      return () => clearTimeout(timer);
   }, [search]);

   // Reset page when category changes
   useEffect(() => {
      setPage(1);
   }, [category]);

   const fetchNews = useCallback(() => {
      const params: any = { page }; // Add page param
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      return cmsApi.getNews(params);
   }, [debouncedSearch, category, page, i18n.language]); // Added i18n.language dependency

   const { data: newsData, loading } = useFetch(fetchNews);
   const news = newsData?.results || [];
   const totalCount = newsData?.count || 0;
   const totalPages = Math.ceil(totalCount / 10); // Assuming page_size is 10

   // Hardcoded categories list mapped to model choices
   // In a real scenario, we might fetch these from an API endpoint like /cms/news/categories/
   const CATEGORIES = [
      { label: t('newsPage.categories.all', 'Tất cả'), value: '' },
      { label: t('newsPage.categories.academy_news', 'Tin Học viện'), value: 'academy_news' },
      { label: t('newsPage.categories.buddhist_news', 'Phật sự'), value: 'buddhist_news' },
      { label: t('newsPage.categories.khmer_festival', 'Lễ hội Khmer'), value: 'khmer_festival' },
      { label: t('newsPage.categories.announcement', 'Thông báo'), value: 'announcement' },
      { label: t('newsPage.categories.event', 'Sự kiện'), value: 'event' },
   ];

   if (loading && !newsData) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6]">
            <div className="w-16 h-16 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   // Client-side sort if needed, but API should handle it. 
   // We trust API order for pagination, but can still sort the current page if really needed.
   // Ideally, we shouldn't sort client-side with pagination because it only sorts the CURRENT page.
   // So we rely on API order.
   const featuredNews = (page === 1 && !debouncedSearch && !category && news.length > 0) ? news[0] : null;
   const otherNews = featuredNews ? news.slice(1) : news;

   return (
      <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">
         {/* HEADER SECTION */}
         <div className="bg-[#6B2C2C] text-white py-16 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
            <div className="container mx-auto relative z-10 text-center">
               <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 drop-shadow-md animate-fade-in-up">
                  {t('newsPage.title', 'Tin Tức & Sự Kiện')}
               </h1>
               <div className="w-32 h-1 bg-[#DAA520] mx-auto mb-6"></div>
               <p className="text-[#E5CFA0] text-lg max-w-2xl mx-auto italic animate-fade-in-up delay-100">
                  {t('newsPage.subtitle', 'Cập nhật những hoạt động Phật sự, văn hóa và lễ hội mới nhất từ Học viện Phật giáo Nam tông Khmer.')}
               </p>
            </div>
         </div>

         <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-10">
               {/* Main Content */}
               <div className="lg:w-3/4">

                  {/* HERO NEWS (Featured) - Only show on Page 1 if no filter */}
                  {featuredNews && (
                     <div className="mb-12 group animate-fade-in-up delay-200">
                        <Link to={`${ROUTES.NEWS}/${featuredNews.slug}`} className="block relative h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#DAA520]">
                           <img
                              src={featuredNews.featured_image_url || "https://picsum.photos/id/1029/1200/800"}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                              alt={featuredNews.title_vi}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8 md:p-12">
                              <span className="inline-block bg-[#DAA520] text-[#6B2C2C] text-xs font-bold px-3 py-1 rounded-full mb-4 w-fit uppercase tracking-wider">
                                 {CATEGORIES.find(c => c.value === featuredNews.category)?.label || featuredNews.category || 'Nổi bật'}
                              </span>
                              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-[#E5CFA0] transition-colors shadow-black drop-shadow-lg">
                                 {featuredNews.title || featuredNews.title_vi}
                              </h2>
                              <div className="flex items-center text-gray-300 text-sm mb-4 space-x-4">
                                 <span className="flex items-center"><Calendar size={14} className="mr-1 text-[#DAA520]" /> {new Date(featuredNews.published_at || featuredNews.created_at).toLocaleDateString(i18n.language === 'km' ? 'km-KH' : 'vi-VN')}</span>
                              </div>
                              <p className="text-gray-200 text-lg line-clamp-2 max-w-3xl font-light">
                                 {featuredNews.excerpt || featuredNews.excerpt_vi}
                              </p>
                           </div>
                        </Link>
                     </div>
                  )}

                  {/* GRID NEWS */}
                  {otherNews.length > 0 ? (
                     <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {otherNews.map((item, index) => (
                              <article key={item.id} className={`bg-white rounded-[16px] shadow-sm hover:shadow-xl border border-[#E5CFA0]/50 overflow-hidden group transition-all duration-300 flex flex-col h-full animate-fade-in-up delay-[${index * 100}ms]`}>
                                 {/* Image Container */}
                                 <div className="relative h-60 overflow-hidden">
                                    <img
                                       src={item.featured_image_url || "https://picsum.photos/500/300"}
                                       className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                       alt={item.title || item.title_vi}
                                    />

                                    {/* Category Badge - Floating */}
                                    <div className="absolute top-4 left-4">
                                       <span className="bg-[#DAA520] text-[#4E342E] text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                          {CATEGORIES.find(c => c.value === item.category)?.label || item.category || 'Tin tức'}
                                       </span>
                                    </div>

                                    {/* Date Badge - Floating Right */}
                                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[11px] font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                                       <Calendar size={12} className="text-[#DAA520]" />
                                       {new Date(item.published_at || item.created_at).toLocaleDateString(i18n.language === 'km' ? 'km-KH' : 'vi-VN')}
                                    </div>
                                 </div>

                                 {/* Content */}
                                 <div className="p-6 flex flex-col flex-grow">
                                    <Link to={`${ROUTES.NEWS}/${item.slug}`} className="block">
                                       <h3 className="font-serif font-bold text-[1.25rem] text-[#4E342E] mb-3 group-hover:text-[#DAA520] transition-colors leading-[1.4] line-clamp-2">
                                          {item.title || item.title_vi}
                                       </h3>
                                    </Link>

                                    <p className="text-gray-600 text-[0.925rem] line-clamp-3 mb-6 leading-relaxed flex-grow font-light">
                                       {item.excerpt || item.excerpt_vi}
                                    </p>

                                    {/* Footer Metadata */}
                                    <div className="pt-5 border-t border-[#F5E6D3] flex items-center justify-between text-xs text-gray-500 font-medium mt-auto">
                                       <div className="flex items-center gap-2">
                                          <Eye size={14} className="text-gray-400" />
                                          {item.view_count || 0} {t('common.views', 'Lượt xem')}
                                       </div>

                                       <Link to={`${ROUTES.NEWS}/${item.slug}`} className="flex items-center text-[#8B4513] hover:text-[#DAA520] transition-colors gap-1 font-bold group/btn">
                                          {t('newsPage.viewDetail', 'XEM CHI TIẾT')}
                                          <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                       </Link>
                                    </div>
                                 </div>
                              </article>
                           ))}
                        </div>

                        {/* PAGINATION CONTROLS */}
                        {totalPages > 1 && (
                           <div className="mt-12 flex justify-center items-center gap-2">
                              <button
                                 onClick={() => setPage(p => Math.max(1, p - 1))}
                                 disabled={page === 1}
                                 className="px-4 py-2 rounded-lg bg-white border border-[#E5CFA0] text-[#6B2C2C] hover:bg-[#FFF8E1] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 {t('common.prev', 'Trước')}
                              </button>

                              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                 <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${page === pageNum
                                       ? 'bg-[#6B2C2C] text-[#FFD700] border border-[#6B2C2C]'
                                       : 'bg-white text-[#6B2C2C] border border-[#E5CFA0] hover:bg-[#FFF8E1]'
                                       }`}
                                 >
                                    {pageNum}
                                 </button>
                              ))}

                              <button
                                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                 disabled={page === totalPages}
                                 className="px-4 py-2 rounded-lg bg-white border border-[#E5CFA0] text-[#6B2C2C] hover:bg-[#FFF8E1] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                 {t('common.next', 'Sau')}
                              </button>
                           </div>
                        )}
                     </>
                  ) : (
                     <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5CFA0]">
                        <p className="text-gray-500 italic">{t('newsPage.noResults', 'Không tìm thấy tin tức nào phù hợp.')}</p>
                     </div>
                  )}
               </div>

               {/* SIDEBAR */}
               <div className="lg:w-1/4 space-y-8">
                  {/* Search Widget */}
                  <div className="bg-white p-6 rounded-xl shadow-gold-sm border border-[#E5CFA0]">
                     <h3 className="font-serif font-bold text-[#6B2C2C] text-xl mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#DAA520]">
                        {t('newsPage.searchTitle', 'Tìm kiếm')}
                     </h3>
                     <div className="relative">
                        <input
                           type="text"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           placeholder={t('newsPage.searchPlaceholder', 'Tìm tin tức...')}
                           className="w-full pl-4 pr-10 py-3 bg-[#FDF5E6] border border-[#E5CFA0] rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] text-sm text-[#6B2C2C] placeholder-[#8B4513]/50"
                        />
                        <Search className="absolute right-3 top-3 text-[#DAA520]" size={18} />
                     </div>
                  </div>

                  {/* Categories Widget */}
                  <div className="bg-white p-6 rounded-xl shadow-gold-sm border border-[#E5CFA0]">
                     <h3 className="font-serif font-bold text-[#6B2C2C] text-xl mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#DAA520]">
                        {t('newsPage.categoriesTitle', 'Danh mục')}
                     </h3>
                     <ul className="space-y-3 text-sm">
                        {CATEGORIES.map(cat => (
                           <li key={cat.value}>
                              <button
                                 onClick={() => setCategory(cat.value)}
                                 className={`flex items-center w-full text-left transition-colors group ${category === cat.value ? 'text-[#DAA520] font-bold' : 'text-[#5D4037] hover:text-[#DAA520]'}`}
                              >
                                 <span className={`w-2 h-2 rounded-full mr-3 transition-colors ${category === cat.value ? 'bg-[#DAA520]' : 'bg-[#E5CFA0] group-hover:bg-[#DAA520]'}`}></span>
                                 {cat.label}
                              </button>
                           </li>
                        ))}
                     </ul>
                  </div>



               </div>
            </div>
         </div>
      </div>
   );
};

export default News;