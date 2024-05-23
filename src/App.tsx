import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const [items, setItems] = useState<
    {
      body: string;
      title: string;
      id: string;
      userId: string;
    }[]
  >([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const target = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (isLoading) return;
    const option = {
      root: null,
      threshold: 1,
    };

    const handleObserver = (
      entries: IntersectionObserverEntry[],
      observer: IntersectionObserver
    ) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        if (!entry.isIntersecting) {
          return;
        }
        if (!isLoading) {
          setPage((prev) => prev + 10);
        }
        observer.unobserve(entry.target);
        observer.observe(target.current as HTMLElement);
      });
    };

    const observer = new IntersectionObserver(handleObserver, option);
    if (target.current) observer.observe(target.current);

    return () => observer && observer.disconnect();
  }, [isLoading]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`https://jsonplaceholder.typicode.com/posts?_start=${page}&_limit=10`)
      .then((response) => response.json())
      .then((data) => {
        setItems((prev) => [...prev, ...data]);
        setIsLoading(false);
      });
  }, [page]);

  return (
    <div className="App">
      <ul>
        {items.map((item, index) => {
          return (
            <li ref={items.length === index + 1 ? target : null} key={item.id}>
              <p>{item.id}</p>
              <p>{item.title}</p>
              <p>{item.body}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default App;
