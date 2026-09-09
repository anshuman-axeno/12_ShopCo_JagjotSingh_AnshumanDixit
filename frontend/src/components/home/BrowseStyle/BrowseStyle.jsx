import { Link } from 'react-router-dom';
import browseCasual from '../../../assets/images/browse-1.png';
import browseFormal from '../../../assets/images/browse-2.png';
import browseParty from '../../../assets/images/browse-3.png';
import browseGym from '../../../assets/images/browse-4.png';

function BrowseStyle() {
  return (
    <section className="browse-styles">
      <div className="browse-styles__container">
        <h2 className="browse-styles__heading">BROWSE BY DRESS STYLE</h2>

        <div className="browse-styles__row browse-styles__row--top">
          <Link to="/products?categoryName=Casual" className="browse-styles__card">
            <span>Casual</span>
            <img src={browseCasual} alt="Casual fashion" loading="lazy" />
          </Link>
          <Link to="/products?categoryName=Formal" className="browse-styles__card">
            <span>Formal</span>
            <img src={browseFormal} alt="Formal fashion" loading="lazy" />
          </Link>
        </div>

        <div className="browse-styles__row browse-styles__row--bottom">
          <Link to="/products?categoryName=Party" className="browse-styles__card">
            <span>Party</span>
            <img src={browseParty} alt="Party fashion" loading="lazy" />
          </Link>
          <Link to="/products?categoryName=Gym" className="browse-styles__card">
            <span>Gym</span>
            <img src={browseGym} alt="Gym & Workout fashion" loading="lazy" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default BrowseStyle;

