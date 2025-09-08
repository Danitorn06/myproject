import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Sliceshow.css';

const Slideshow = () => {
  return (
    <Carousel className="carousel-container" interval={4000} fade>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/ad-banner.png"
          alt="First slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/cardio.png"
          alt="Second slide"
        />
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/yoga.png"
          alt="Third slide"
        />
      </Carousel.Item>
    </Carousel>
  );
};

export default Slideshow;
