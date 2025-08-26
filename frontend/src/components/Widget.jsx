import React from "react";
import "./css/Widget.css";

const ads = [
  {
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    title: "Upgrade your skills with Coursera!",
    description: "Get 50% off on all online courses. Limited time offer.",
    link: "https://www.coursera.org/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
    title: "Adobe Creative Cloud - Student Discount",
    description: "Save big on Photoshop, Illustrator, and more.",
    link: "https://www.adobe.com/creativecloud/buy/students.html",
  },
  {
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    title: "Plan your dream vacation with Expedia",
    description: "Exclusive deals on flights and hotels. Book now!",
    link: "https://www.expedia.com/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
    title: "iPhone 15 Pro - Now Available",
    description: "Experience the next level of innovation. Shop now.",
    link: "https://www.apple.com/iphone-15-pro/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    title: "Nike Shoes - New Arrivals",
    description: "Step into comfort and style. Explore the latest collection.",
    link: "https://www.nike.com/in/",
  },
  {
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80",
    title: "Fitbit Versa 4 - Fitness Tracker",
    description: "Track your health and fitness goals. Buy now!",
    link: "https://www.fitbit.com/global/in/products/smartwatches/versa4",
  },
];

function Widget() {
  return (
    <div className="widget widget--ads">
      <div className="widget__header widget__header--ads">
        <h5>Advertisements</h5>
      </div>
      <div className="widget__ads-list">
        {ads.map((ad, idx) => (
          <a
            key={idx}
            href={ad.link}
            target="_blank"
            rel="noopener noreferrer"
            className="widget__ad-card"
          >
            <img src={ad.image} alt={ad.title} className="widget__ad-img" />
            <div className="widget__ad-info">
              <div className="widget__ad-title">{ad.title}</div>
              <div className="widget__ad-desc">{ad.description}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Widget;
