import { useState } from 'react'
import Title from './components/Title'
import Form from './components/Form'
import Results from './components/Results'
import Loading from './components/Loading'
import './App.css'

type ResultsStateType = {
  country: string;
  cityName: string;
  temperature: string;
  conditionText: string;
  icon: string;
}
function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [city, setCity] = useState<string>(""); // cityがstate(保管場所)setCityがstateにデータを書き込んだり操作する仕組み 他の名前でも可能だが慣例的にset+state名
  const [results, setResults] = useState<ResultsStateType>({
    country: "",
    cityName: "",
    temperature: "",
    conditionText: "",
    icon: ""
  });
  // ここで環境変数からAPIキーを取得
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

  const getWeather = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // APIキーを変数として使用
    fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`)
      .then(res => res.json())
      .then(data => {
        setResults({
          country: data.location.country,
          cityName: data.location.name,
          temperature: data.current.temp_c,
          conditionText: data.current.condition.text,
          icon: data.current.condition.icon
        })
        setCity("");
        setLoading(false);
      })
      .catch(() => alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。"))
  }
  return (
    <>
      <div className="wrapper">
        <div className="container">
          <Title />
          <Form setCity={setCity} getWeather={getWeather} city={city} />
          {loading? <Loading />: <Results results={results} />}
        </div>
      </div>
    </>
  )
}

export default App
