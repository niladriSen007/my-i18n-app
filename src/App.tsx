import React, { useState, useEffect, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import './App.css';

interface Content {
  title: string;
  description: string;
}

const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [content, setContent] = useState<Content>({ title: '', description: '' });

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    fetchContent(lng);
  };

  const fetchContent = async (language: string) => {
    try {
      const response = await axios.get<Content>(`https://your-cloudfront-domain/${language}/content.json`);
      setContent(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  useEffect(() => {
    fetchContent(i18n.language);
  }, [i18n.language]);

  return (
    <Suspense fallback="loading">
      <div className="App">
        <header className="App-header">
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <select onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="hi">Hindi</option>
            {/* Add more languages as needed */}
          </select>
        </header>
      </div>
    </Suspense>
  );
};

export default App;