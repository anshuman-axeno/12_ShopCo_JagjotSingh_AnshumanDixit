import "../../styles/components/_hero.scss";

function Hero() {
  return (
    <section className="hero">
      <div className="hero__div">
        <h1 className="hero__heading">
          FIND CLOTHES THAT MATCH YOUR STYLE
        </h1>

        <p className="hero__para">
          Browse through our diverse range of meticulously crafted garments,
          designed to bring out your individuality and cater to your sense of
          style.
        </p>

        <a href="#new-arrivals" className="hero__btn">
          Shop now
        </a>

        <img
          src="/assets/images/hero-2.png"
          alt=""
          className="hero__image"
        />
      </div>

      <div className="hero__brands">
        <img src="/assets/images/brand-1.png" alt="" />
        <img src="/assets/images/brand-last.png" alt="" />
        <img src="/assets/images/zara-logo-1 1.png" alt="" />
        <img src="/assets/images/prada-logo-1 1.png" alt="" />
        <img src="/assets/images/gucci-logo-1 1.png" alt="" />
      </div>
    </section>
  );
}

export default Hero;