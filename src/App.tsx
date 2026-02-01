import { Topbar } from '@/sections/Topbar';
import { Hero } from '@/sections/Hero';
import { Gallery } from '@/sections/Gallery';
import { Analytics } from '@/sections/Analytics';
import { Footer } from '@/sections/Footer';
import { AdminDashboard } from '@/components/AdminDashboard';
import { AdminLogin } from '@/components/AdminLogin';
import { useRatings } from '@/hooks/useRatings';
import { useComments } from '@/hooks/useComments';
import { mockImages } from '@/data/mockImages';
import { useMemo, useState } from 'react';

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  const { 
    ratings, 
    isLoaded, 
    setRating, 
    getTotalRatings, 
    getChartData 
  } = useRatings();

  const {
    comments,
    isLoaded: commentsLoaded,
    addComment,
    getAllComments,
    deleteComment,
    exportData,
    clearAllComments,
  } = useComments();

  const totalRatings = getTotalRatings();
  const chartData = getChartData();

  // Merge images with their ratings
  const imagesWithRatings = useMemo(() => {
    return mockImages.map(image => ({
      ...image,
      ratedValue: ratings[image.id]
    }));
  }, [ratings]);

  const handleRate = (imageId: string, value: number) => {
    // Only allow rating if not already rated (double protection)
    if (ratings[imageId] === undefined) {
      setRating(imageId, value);
    }
  };

  const handleAddComment = (imageId: string, text: string, author: string, outfitLink?: string) => {
    addComment(imageId, text, author, outfitLink);
  };

  // Handle admin access request (from triple-click on logo)
  const handleAdminRequest = () => {
    if (isAdminAuthenticated) {
      // Already logged in, show dashboard directly
      setShowAdminLogin(false);
    } else {
      // Show login modal
      setShowAdminLogin(true);
    }
  };

  // Handle successful admin login
  const handleAdminLoginSuccess = () => {
    setShowAdminLogin(false);
    setIsAdminAuthenticated(true);
  };

  // Show loading state while localStorage is being read
  if (!isLoaded || !commentsLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed Topbar */}
      <Topbar onAdminClick={handleAdminRequest} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero 
          totalRatings={totalRatings} 
          totalImages={mockImages.length} 
        />

        {/* Gallery Section */}
        <Gallery 
          images={imagesWithRatings}
          ratings={ratings}
          onRate={handleRate}
          totalRatings={totalRatings}
          totalImages={mockImages.length}
          comments={comments}
          onAddComment={handleAddComment}
        />

        {/* Analytics Section */}
        <Analytics 
          chartData={chartData}
          totalRatings={totalRatings}
          ratings={ratings}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Login Modal */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Admin Dashboard Modal (only when authenticated) */}
      <AdminDashboard
        isOpen={isAdminAuthenticated}
        onClose={() => setIsAdminAuthenticated(false)}
        comments={getAllComments()}
        ratings={ratings}
        onDeleteComment={deleteComment}
        onClearComments={clearAllComments}
        onExportData={exportData}
      />
    </div>
  );
}

export default App;
