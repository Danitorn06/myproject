import { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sliceshow.css";

const Slideshow = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/v1/news");
      const data = await res.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <Carousel className="carousel-container" interval={4000} fade>
      {news.map((item) => (
        <Carousel.Item key={item.news_id}>
          <img
            className="d-block w-100"
            src={item.image_url}
            alt={item.title}
          />

          <Carousel.Caption>
            <h3>{item.title}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Slideshow;