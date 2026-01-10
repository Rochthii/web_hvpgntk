import React, { useState, useEffect, useCallback } from 'react';
import { Search, Calendar, ChevronRight, Clock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cmsApi } from '../api/cms';
import { ROUTES } from '../router/routes';
import { useFetch } from '../hooks/useFetch';

const News: React.FC = () => {
   // State for filters
   const [search, setSearch] = useState('');
   const [category, setCategory] = useState<string>('');
   const [debouncedSearch, setDebouncedSearch] = useState('');

   // Debounce search
   useEffect(() => {
      const timer = setTimeout(() => setDebouncedSearch(search), 500);
      return () => clearTimeout(timer);
   }, [search]);

   const fetchNews = useCallback(() => {
      const params: any = {};
      if (debouncedSearch) params.search = debouncedSearch;
      if (category) params.category = category;
      return cmsApi.getNews(params);
   }, [debouncedSearch, category]);

   const { data: news, loading } = useFetch(fetchNews);

   // Hardcoded categories list mapped to model choices
   // In a real scenario, we might fetch these from an API endpoint like /cms/news/categories/
   const CATEGORIES = [
      { label: 'Tất cả', value: '' },
      { label: 'Phật sự', value: 'PHAT_SU' },
      { label: 'Hoằng pháp', value: 'HOANG_PHAP' },
      { label: 'Giáo dục', value: 'GIAO_DUC' },
      { label: 'Từ thiện', value: 'TU_THIEN' },
      { label: 'Văn hóa', value: 'VAN_HOA' },
      { label: 'Thông báo', value: 'THONG_BAO' },
   ];

   if (loading && !news) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-[#FDF5E6]">
            <div className="w-16 h-16 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
         </div>
      );
   }

   // Client-side sort if API doesn't order by published_at (it should, but safety first)
   const sortedNews = news ? [...news].sort((a, b) => new Date(b.published_at || b.created_at).getTime() - new Date(a.published_at || a.created_at).getTime()) : [];
   const featuredNews = sortedNews.length > 0 ? sortedNews[0] : null;
   const otherNews = sortedNews.slice(1);

   return (
      <div className="min-h-screen bg-[#FDF5E6] pb-20 font-sans">
         {/* HEADER SECTION */}
         <div className="bg-[#6B2C2C] text-white py-16 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
            <div className="container mx-auto relative z-10 text-center">
               <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 drop-shadow-md">Tin Tức & Sự Kiện</h1>
               <div className="w-32 h-1 bg-[#DAA520] mx-auto mb-6"></div>
               <p className="text-[#E5CFA0] text-lg max-w-2xl mx-auto italic">
                  Cập nhật những hoạt động Phật sự, văn hóa và lễ hội mới nhất từ Học viện Phật giáo Nam tông Khmer.
               </p>
            </div>
         </div>

         <div className="container mx-auto px-4 py-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row gap-10">
               {/* Main Content */}
               <div className="lg:w-3/4">

                  {/* HERO NEWS (Featured) - Only show if no search filter active to focus results */}
                  {!debouncedSearch && !category && featuredNews && (
                     <div className="mb-12 group">
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
                                 {featuredNews.title_vi}
                              </h2>
                              <div className="flex items-center text-gray-300 text-sm mb-4 space-x-4">
                                 <span className="flex items-center"><Calendar size={14} className="mr-1 text-[#DAA520]" /> {new Date(featuredNews.published_at || featuredNews.created_at).toLocaleDateString('vi-VN')}</span>
                              </div>
                              <p className="text-gray-200 text-lg line-clamp-2 max-w-3xl font-light">
                                 {featuredNews.excerpt_vi}
                              </p>
                           </div>
                        </Link>
                     </div>
                  )}

                  {/* GRID NEWS */}
                  {((!debouncedSearch && !category) ? otherNews : sortedNews).length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {((!debouncedSearch && !category) ? otherNews : sortedNews).map((item) => (
                           <div key={item.id} className="bg-white rounded-xl shadow-gold-sm border border-[#E5CFA0] overflow-hidden group hover:shadow-gold-md transition-all hover:-translate-y-1 duration-300">
                              <div className="relative h-56 overflow-hidden">
                                 <img
                                    src={item.featured_image_url || "https://picsum.photos/500/300"}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    alt={item.title_vi}
                                 />
                                 <div className="absolute top-4 right-4 bg-[#6B2C2C] text-white text-xs font-bold px-3 py-1 rounded shadow-lg">
                                    {new Date(item.published_at || item.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
                                 </div>
                              </div>
                              <div className="p-6">
                                 <div className="text-[#DAA520] text-xs font-bold uppercase mb-2 tracking-wide">
                                    {CATEGORIES.find(c => c.value === item.category)?.label || item.category || 'Tin tức'}
                                 </div>
                                 <Link to={`${ROUTES.NEWS}/${item.slug}`}>
                                    <h3 className="font-serif font-bold text-xl text-[#6B2C2C] mb-3 group-hover:text-[#8B4513] transition-colors line-clamp-2 height-[3.5rem]">
                                       {item.title_vi}
                                    </h3>
                                 </Link>
                                 <p className="text-gray-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                                    {item.excerpt_vi}
                                 </p>
                                 <Link to={`${ROUTES.NEWS}/${item.slug}`} className="inline-flex items-center text-[#8B4513] font-bold text-sm hover:text-[#DAA520] transition-colors group/link">
                                    XEM CHI TIẾT <ChevronRight size={16} className="ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                                 </Link>
                              </div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="text-center py-20 bg-white rounded-xl border border-dashed border-[#E5CFA0]">
                        <p className="text-gray-500 italic">Không tìm thấy tin tức nào phù hợp.</p>
                     </div>
                  )}
               </div>

               {/* SIDEBAR */}
               <div className="lg:w-1/4 space-y-8">
                  {/* Search Widget */}
                  <div className="bg-white p-6 rounded-xl shadow-gold-sm border border-[#E5CFA0]">
                     <h3 className="font-serif font-bold text-[#6B2C2C] text-xl mb-4 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#DAA520]">
                        Tìm kiếm
                     </h3>
                     <div className="relative">
                        <input
                           type="text"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           placeholder="Tìm tin tức..."
                           className="w-full pl-4 pr-10 py-3 bg-[#FDF5E6] border border-[#E5CFA0] rounded-lg focus:outline-none focus:border-[#DAA520] focus:ring-1 focus:ring-[#DAA520] text-sm text-[#6B2C2C] placeholder-[#8B4513]/50"
                        />
                        <Search className="absolute right-3 top-3 text-[#DAA520]" size={18} />
                     </div>
                  </div>

                  {/* Categories Widget */}
                  <div className="bg-white p-6 rounded-xl shadow-gold-sm border border-[#E5CFA0]">
                     <h3 className="font-serif font-bold text-[#6B2C2C] text-xl mb-6 relative pb-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-12 after:h-0.5 after:bg-[#DAA520]">
                        Danh mục
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

                  {/* Featured Banner (Ad) */}
                  <div className="rounded-xl overflow-hidden shadow-gold-md relative h-64 group cursor-pointer">
                     <img src="https://phatsuonline.com/wp-content/uploads/2024/02/1-4-10.jpg" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Ad" />
                     <div className="absolute inset-0 bg-gradient-to-t from-[#6B2C2C]/90 to-transparent flex flex-col justify-end p-6 text-center">
                        <h4 className="text-white font-serif font-bold text-lg mb-2">Đại lễ khánh thành 2025</h4>
                        <button className="bg-[#DAA520] text-[#6B2C2C] text-xs font-bold py-2 px-4 rounded-full self-center hover:bg-white transition-colors">
                           XEM CHI TIẾT
                        </button>
                     </div>
                  </div>

               </div>
            </div>
         </div>
      </div>
   );
};

export default News;