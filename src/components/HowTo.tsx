// HowTo.tsx

const HowTo = () => <div className="className">
  <div className="HowToInner">
    <div className="HowToListWrap">
      <h1 className="HowToTitle">使い方</h1>
      <ul className="HowToList">
        <li className="HowToItem">「都市名を調べる」の欄に天気を調べたい都市を記入して「天気を調べる」ボタンを押してください。仕様上できれば英語、ローマ字でのご記入をお願いします。日本語入力では誤った回答になる場合がございますのであらかじめご了承くださいませ。</li>
        <li className="HowToItem">「最近の検索履歴」に最近調べた都市名が表示されるので、クリックすると再度その都市の天気が表示されます。</li>
        <li className="HowToItem">右上の「暗くする」ボタンを押すと暗い画面のダークモードになり、「明るくする」ボタンを押すと戻ります。</li>
      </ul>
    </div>
    <div className="HowToListWrap">
      <h1 className="HowToTitle">使用技術</h1>
      
        <p className="HowToText">React, TypeScript, Chart.js, API, Vite, HTML, SASS, Git</p>
      
    </div>
  </div>
</div>

export default HowTo;