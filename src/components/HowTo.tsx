// HowTo.tsx

const HowTo = () => <div className="className">
  <div className="HowToInner">
    <h1 className="HowToTitle">使い方</h1>
    <ul className="HowToList">
      <li className="HowToItem">「都市名」の欄に天気を調べたい都市を記入して「Get Weather」ボタンを押してください。日本語では時々不正確になるため英語、ローマ字推奨です。</li>
      <li className="HowToItem">「Recent Search History」に最近調べた都市名が表示されるので、クリックすると再度その都市の天気が表示されます。</li>
    </ul>
  </div>
</div>

export default HowTo;