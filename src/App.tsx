import { useState, useEffect } from 'react'
import Title from './components/Title'
import Form from './components/Form'
import Results from './components/Results'
import Loading from './components/Loading'
import DarkModeToggle from './components/DarkModeToggle'
// import HowTo from './components/HowTo'
import './App.scss'

type ResultsStateType = {
  country: string;
  cityName: string;
  temperature: string;
  conditionText: string;
  icon: string;
}

function App() {
  // ダークモード切替
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // ローディング
  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>("");
  const [results, setResults] = useState<ResultsStateType>({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: ""
  });

  // 検索履歴の管理
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('weather_search_history', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);
  useEffect(() => {
    const savedHistory = localStorage.getItem('weather_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  // 共通のAPI呼び出しロジックをまとめた新しい非同期関数を作成
  // getWeatherとhandleSearchの両方から呼び出すことでコードの重複をなくす
  const fetchWeatherData = async (targetCity: string) => {
    setLoading(true);

    try {
      const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${targetCity}&aqi=no`);
      const data = await res.json();

      setResults({
        country: data.location.country,
        cityName: data.location.name,
        temperature: data.current.temp_c,
        conditionText: data.current.condition.text,
        icon: data.current.condition.icon
      });
      setCity("");

      //  検索が成功したタイミングで、履歴を更新するロジックを追加
      setSearchHistory(prevHistory => {
        // 重複を避けて、新しい都市を配列の先頭に追加
        const newHistory = [targetCity, ...prevHistory.filter(c => c !== targetCity)];
        // 最新の5件を保持
        return newHistory.slice(0, 5);
      });

    } catch (error) {
      alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。");
    } finally {
      setLoading(false);
    }
  };

  // 変更点3: フォームからの検索処理を修正し、fetchWeatherDataを呼び出すように変更
  const getWeather = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetchWeatherData(city);
  };

  // 変更点4: 履歴リストのクリック時に呼ばれる新しい関数を定義
  const handleSearch = async (city: string) => {
    setCity(city); // フォーム入力欄にクリックした都市名を表示
    await fetchWeatherData(city); // 共通ロジックで天気情報を取得
  };

  return (
    <>
      <div className="wrapper">
        <div className="container">
          <div className="containerInner">
            <DarkModeToggle isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}></DarkModeToggle>
            <Title />
            <Form setCity={setCity} getWeather={getWeather} city={city} />
            {loading ? <Loading /> : <Results results={results} />}
            {searchHistory.length > 0 && (
              <div className='history'>
                <h3>Recent Search History</h3>
                <ul>
                  {/* 変更点5: `onClick`ハンドラを`handleSearch`に修正 */}
                  {searchHistory.map((historyCity, index) => (
                    <li key={index} onClick={() => handleSearch(historyCity)}>
                      <span className="historyCityName">
                        {historyCity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {/* <div className="container">
          <HowTo />
        </div> */}
      </div>
    </>
  );
}

export default App;