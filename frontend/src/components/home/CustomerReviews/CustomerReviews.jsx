import { useRef } from 'react';
import starImg from '../../../assets/images/Frame 10.png';

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah M.',
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 2,
    name: 'Alex K.',
    comment:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes.',
  },
  {
    id: 3,
    name: 'James L.',
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with trends.",
  },
  {
    id: 4,
    name: 'Elon M.',
    comment:
      "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
  },
  {
    id: 5,
    name: 'Donald T.',
    comment:
      'Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.',
  },
  {
    id: 6,
    name: 'John D.',
    comment:
      "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
  },
];

function CustomerReviews() {
  const scrollRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="customer-reviews">
      <div className="customer-reviews__container">
        <h2 className="customer-reviews__heading">OUR HAPPY CUSTOMERS</h2>
        <div className="customer-reviews__header">
          <h2 className="customer-reviews__heading">OUR HAPPY CUSTOMERS</h2>
          <div className="customer-reviews__nav">
            <button
              type="button"
              className="customer-reviews__arrow"
              onClick={() => handleScroll('left')}
              aria-label="Previous review"
            >
              ←
            </button>
            <button
              type="button"
              className="customer-reviews__arrow"
              onClick={() => handleScroll('right')}
              aria-label="Next review"
            >
              →
            </button>
          </div>
        </div>

        <div className="customer-reviews__grid">
        <div className="customer-reviews__grid" ref={scrollRef}>
          {REVIEWS.map((rev) => (
            <article key={rev.id} className="customer-reviews__card">
              <img src={starImg} alt="5 stars" className="stars" />
              <h4>{rev.name}</h4>
              <p>"{rev.comment}"</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerReviews;

