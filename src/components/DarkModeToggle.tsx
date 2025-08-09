// DarkModeToggle.tsx

// 親からisDarkModeとsetIsDarkModeをpropsとして受け取る
type DarkModeToggleProps = {
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void; // isDarkという変数の型はtrueかfalseだが、その変数が何を受け取っても何も返さないという関数
};

const DarkModeToggle = ({ isDarkMode, setIsDarkMode} : DarkModeToggleProps) => {
  return (
    <button className='modeBtn' onClick={() => setIsDarkMode(!isDarkMode)}>
      <span className='modeBtnLetter'>
        {isDarkMode ? 'LIGHTMODE': 'DARKMODE'}
      </span>
    </button>
  )
}

export default DarkModeToggle;