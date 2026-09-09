import { Link } from 'react-router-dom';
import heroImg from '../../../assets/images/hero-2.png';
import brandVersace from '../../../assets/images/brand-1.png';
import brandCalvin from '../../../assets/images/brand-last.png';
import brandZara from '../../../assets/images/zara-logo-1 1.png';
import brandPrada from '../../../assets/images/prada-logo-1 1.png';
import brandGucci from '../../../assets/images/gucci-logo-1 1.png';

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <h1 className="hero__heading">
            FIND CLOTHES THAT MATCH YOUR STYLE
          </h1>
          <p className="hero__para">
            Browse through our diverse range of meticulously crafted garments, designed
            to bring out your individuality and cater to your sense of style.
          </p>
          <Link to="/products" className="hero__btn">
            Shop Now
          </Link>

          <div className="hero__stats">
            <div className="hero__stats-item">
              <h3>200+</h3>
              <p>International Brands</p>
            </div>
            <div className="hero__stats-divider"></div>
            <div className="hero__stats-item">
              <h3>2,000+</h3>
              <p>High-Quality Products</p>
            </div>
            <div className="hero__stats-divider"></div>
            <div className="hero__stats-item">
              <h3>30,000+</h3>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>

        <div className="hero__image-box">
          <img src={heroImg} alt="Models showcasing Shop.co apparel" className="hero__image" />
        </div>
      </div>

      <div className="hero__brands">
        <div className="hero__brands-container">
          <img src={brandVersace} alt="Versace" />
          <img src={brandZara} alt="Zara" />
          <img src={brandGucci} alt="Gucci" />
          <img src={brandPrada} alt="Prada" />
          <img src={brandCalvin} alt="Calvin Klein" />
        </div>
      </div>
    </section>
  );
}

export default Hero;

