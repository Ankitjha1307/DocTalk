
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Footer from './components/Footer';
import Header from './components/Header';
import ChatBot from './components/ChatBot';
import FileUploadModal from './components/FileUploadModal'; // Import the modal
import NotFoundPage from './components/NotFoundPage'
function App() {

  console.log(
  "%c💊 Welcome to DocTalk Console!\n%cCuriosity is the best medicine. Glad you're here!",
  "background:#0ea5e9; color:white; padding: 10px; font-size: 18px; font-weight:600;",
  "color:#0ea5e9; font-size: 14px;"
  );
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isFileUploadOpen, setIsFileUploadOpen] = useState(false);
  const handleFilesUpload = (uploadedFiles) => {
    console.log('Uploaded files:', uploadedFiles);
    // Here you can handle the uploaded files - send to backend, process, etc.
    alert(`Successfully uploaded ${uploadedFiles.length} file(s)!`);
  };

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans">
        <Header
          isChatbotOpen={isChatbotOpen}
          onChatbotToggle={setIsChatbotOpen}
        />        <main>
          <Routes>
            <Route path="/" element={<Home onOpenFileUpload={() => setIsFileUploadOpen(true)} // Pass to home page
              onOpenChatbot={() => setIsChatbotOpen(true)} />} />
            <Route path="/chat" element={<ChatBot />} />
            <Route path='*' element={<NotFoundPage/>}/>
          </Routes>
        </main>
        <Footer />
        <ChatBot
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
        <FileUploadModal
          isOpen={isFileUploadOpen}
          onClose={() => setIsFileUploadOpen(false)}
          onFilesUpload={handleFilesUpload}
        />
      </div>
    </Router>
  );
}

export default App;