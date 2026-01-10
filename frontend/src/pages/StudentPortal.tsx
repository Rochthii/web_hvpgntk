import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { academicApi } from '../api/academic';
import { AcademicYear, Semester, Enrollment } from '../types/academic';
import { Book, Calendar, Clock, User, LogOut, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../router/routes';

const StudentPortal: React.FC = () => {
   const { user, isAuthenticated, login, logout, isLoading: authLoading } = useAuth();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   // Academic Data State
   const [currentYear, setCurrentYear] = useState<AcademicYear | null>(null);
   const [currentSemester, setCurrentSemester] = useState<Semester | null>(null);
   const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
   const [studentStats, setStudentStats] = useState<any>(null);
   const [dataLoading, setDataLoading] = useState(false);

   useEffect(() => {
      if (isAuthenticated) {
         const fetchData = async () => {
            setDataLoading(true);
            try {
               // Fetch basic academic context
               const [yearRes, semRes] = await Promise.all([
                  academicApi.getCurrentYear(),
                  academicApi.getCurrentSemester()
               ]);
               setCurrentYear(yearRes.data);
               setCurrentSemester(semRes.data);

               // Fetch student specific data
               const [enrollRes, statsRes] = await Promise.all([
                  academicApi.getMyEnrollments(),
                  academicApi.getStudentStats()
               ]);
               setEnrollments(enrollRes.data);
               setStudentStats(statsRes.data);
            } catch (err) {
               console.error("Error fetching academic data", err);
            } finally {
               setDataLoading(false);
            }
         };
         fetchData();
      }
   }, [isAuthenticated]);

   const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
         await login(email, password);
      } catch (err) {
         setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      }
   };

   const handleLogout = () => {
      logout();
   };

   if (authLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-cream">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (!isAuthenticated) {
      return (
         <div className="min-h-screen bg-cream flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-amber-100">
               <div className="text-center mb-8">
                  <img src="/logo-hvpgntk.png" alt="Logo" className="w-20 h-20 mx-auto mb-4" />
                  <h1 className="text-2xl font-serif font-bold text-secondary">Cổng Thông Tin Tăng Sinh</h1>
                  <p className="text-gray-500 text-sm mt-2">Vui lòng đăng nhập để tiếp tục</p>
               </div>

               <form onSubmit={handleLogin} className="space-y-6">
                  {error && (
                     <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                        {error}
                     </div>
                  )}

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Email hoặc Số điện thoại</label>
                     <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="Nhập email/SĐT..."
                        required
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                     <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                        required
                     />
                  </div>

                  <button
                     type="submit"
                     className="w-full bg-secondary text-white py-3 rounded-lg font-bold hover:bg-secondary-accent transition-colors shadow-md"
                  >
                     Đăng Nhập
                  </button>

                  <div className="text-center mt-4">
                     <Link to={ROUTES.HOME} className="text-sm text-gray-500 hover:text-primary">Quay về trang chủ</Link>
                  </div>
               </form>
            </div>
         </div>
      );
   }

   // Get student code from profile
   const studentCode = user?.monk_profile?.student_code || user?.layperson_profile?.student_code || "Chưa cập nhật";
   const userRoleDisplay = user?.user_type === 'monk' ? 'Tăng sinh' : 'Cư sĩ';

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Portal Header */}
         <header className="bg-secondary text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
               <div className="flex items-center space-x-3">
                  <img src="/logo-hvpgntk.png" alt="Logo" className="w-10 h-10 bg-white rounded-full p-1" />
                  <span className="font-serif font-bold hidden md:block">Cổng Thông Tin Đào Tạo</span>
               </div>
               <div className="flex items-center space-x-4">
                  <div className="text-right hidden sm:block">
                     <div className="font-bold text-sm">{user?.display_name}</div>
                     <div className="text-xs text-white/80">{studentCode}</div>
                  </div>
                  <button
                     onClick={handleLogout}
                     className="p-2 hover:bg-white/10 rounded-full transition-colors"
                     title="Đăng xuất"
                  >
                     <LogOut size={20} />
                  </button>
               </div>
            </div>
         </header>

         <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               {/* Sidebar Info */}
               <div className="md:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                     <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-4">
                           <User size={40} />
                        </div>
                        <h2 className="font-bold text-lg text-secondary">{user?.display_name}</h2>
                        <p className="text-gray-500 text-sm mb-2">{userRoleDisplay}</p>
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Đang học</span>
                     </div>
                     <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
                        <div className="flex justify-between">
                           <span className="text-gray-500">Mã số:</span>
                           <span className="font-medium">{studentCode}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500">Khóa:</span>
                           <span className="font-medium">{studentStats?.cohort || 'Chưa có dữ liệu'}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500">Hệ đào tạo:</span>
                           <span className="font-medium">{studentStats?.program_name || 'Cử nhân Phật học'}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Main Stats & Schedule */}
               <div className="md:col-span-3 space-y-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 flex items-center justify-between">
                        <div>
                           <p className="text-gray-500 text-xs uppercase font-bold">Tín chỉ tích lũy</p>
                           <h3 className="text-2xl font-bold text-secondary mt-1">{studentStats?.earned_credits || 0}/{studentStats?.total_credits || 140}</h3>
                        </div>
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-primary">
                           <Book size={20} />
                        </div>
                     </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 flex items-center justify-between">
                        <div>
                           <p className="text-gray-500 text-xs uppercase font-bold">Điểm T.Bình (GPA)</p>
                           <h3 className="text-2xl font-bold text-secondary mt-1">--</h3>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                           <Clock size={20} />
                        </div>
                     </div>
                     <div className="bg-white p-5 rounded-xl shadow-sm border border-amber-100 flex items-center justify-between">
                        <div>
                           <p className="text-gray-500 text-xs uppercase font-bold">Học kỳ hiện tại</p>
                           <h3 className="text-lg font-bold text-secondary mt-1">{currentSemester ? `HK${currentSemester.term === 'SEMESTER_1' ? '1' : '2'} / ${currentYear?.name}` : '...'}</h3>
                        </div>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                           <Calendar size={20} />
                        </div>
                     </div>
                  </div>

                  {/* Schedule / Enrollments */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                     <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-secondary flex items-center">
                           <Calendar size={18} className="mr-2 text-primary" />
                           Lịch Học / Môn Đăng Ký
                        </h3>
                        <span className="text-xs text-gray-500 italic">Dữ liệu thực tế</span>
                     </div>
                     <div className="p-6">
                        {dataLoading ? (
                           <div className="text-center py-8 text-gray-500">Đang tải dữ liệu...</div>
                        ) : enrollments.length > 0 ? (
                           <div className="overflow-x-auto">
                              <table className="w-full text-sm text-left">
                                 <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs">
                                    <tr>
                                       <th className="px-4 py-3">Mã MH</th>
                                       <th className="px-4 py-3">Tên Môn Học</th>
                                       <th className="px-4 py-3">TC</th>
                                       <th className="px-4 py-3">Lịch học</th>
                                       <th className="px-4 py-3">Phòng</th>
                                       <th className="px-4 py-3">Trạng thái</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-gray-100">
                                    {enrollments.map((enr) => (
                                       <tr key={enr.id} className="hover:bg-gray-50 transition-colors">
                                          <td className="px-4 py-3 font-medium text-gray-900">{enr.class_info.course.code}</td>
                                          <td className="px-4 py-3 text-secondary font-medium">{enr.class_info.course.name_vi}</td>
                                          <td className="px-4 py-3">{enr.class_info.course.credits}</td>
                                          <td className="px-4 py-3">
                                             {enr.class_info.schedule_day && enr.class_info.schedule_time
                                                ? `${enr.class_info.schedule_day}, ${enr.class_info.schedule_time}`
                                                : 'Chưa xếp lịch'}
                                          </td>
                                          <td className="px-4 py-3">{enr.class_info.classroom || '--'}</td>
                                          <td className="px-4 py-3">
                                             <span className={`px-2 py-1 rounded text-xs font-semibold
                                                    ${enr.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                   enr.status === 'REGISTERED' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {enr.status}
                                             </span>
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                        ) : (
                           <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                              <p className="text-gray-500 mb-2">Chưa có môn học nào được đăng ký trong học kỳ này.</p>
                              <button className="text-primary font-medium hover:underline text-sm">Đăng ký môn học ngay</button>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default StudentPortal;