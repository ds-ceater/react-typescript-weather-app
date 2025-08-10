// Form.tsx
type FormPropsType ={
  city:string;
  setCity:React.Dispatch<React.SetStateAction<string>>;
  getWeather:(e: React.FormEvent<HTMLFormElement>) => void;
}
const Form = ({city,setCity,getWeather}:FormPropsType) => { 
  return(
    <form className="form" onSubmit={getWeather}>
      <input type="text" name="city" placeholder="都市名を入力" onChange={e => setCity(e.target.value)} value={city} />

      <button type="submit">天気を調べる</button>
    </form>
  );
};

export default Form;