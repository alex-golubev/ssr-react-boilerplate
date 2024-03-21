import { useEffect, useState } from 'react';

export const Counter = () => {
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prevState => prevState + 1);
    }, 3000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const onClickHandler = () => {
    setCounter(prevState => prevState + 1);
  };

  return (
    <main className="flex items-center flex-col justify-between h-screen">
      <div className="flex items-center flex-col mt-10">
        <h1 className="text-2xl">Counter</h1>
        <p className="mt-10 text-3xl">{counter}</p>
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded mt-10"
          onClick={onClickHandler}
        >
          Increment
        </button>
      </div>
    </main>
  );
};
