import React from "react";
import { Add } from "@material-ui/icons";
import "./css/SidebarOptions.css";

function SidebarOptions({ onCategoryClick, selectedCategory }) {
  const categories = [
    { name: "History", img: "https://cdn.pixabay.com/photo/2014/01/18/10/14/vaulted-cellar-247391_640.jpg" },
    { name: "Business", img: "https://media.istockphoto.com/id/1418476287/photo/businessman-analyzing-companys-financial-balance-sheet-working-with-digital-augmented-reality.webp" },
    { name: "Psychology", img: "https://cdn.pixabay.com/photo/2023/07/04/07/25/self-consciousness-8105584_1280.jpg" },
    { name: "Cooking", img: "https://media.istockphoto.com/id/1390248034/photo/cute-girl-chef-in-uniform-holding-a-platter-or-cloche-restaurant-cook-mascot-on-pink.webp" },
    { name: "Music", img: "https://media.istockphoto.com/id/1451301857/photo/golden-3d-podcast-icon-isolated-on-white-background-3d-illustration.webp" },
    { name: "Science", img: "https://media.istockphoto.com/id/1414916333/photo/metaverse-and-future-digital-technology-businessman-hand-holding-virtual-global-internet.webp" },
    { name: "Health", img: "https://cdn.pixabay.com/photo/2017/07/02/19/24/dumbbells-2465478_640.jpg" },
    { name: "Movies", img: "https://media.istockphoto.com/id/534129330/photo/reel-of-film.webp" },
    { name: "Technology", img: "data:image/jpeg;base64,..." },
    { name: "Education", img: "data:image/png;base64,..." }
  ];

  return (
    <div className="sidebarOptions">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className={`sidebarOption ${selectedCategory === cat.name ? "active" : ""}`}
          onClick={() => onCategoryClick(cat.name)}
        >
          <img src={cat.img} alt={cat.name} />
          <p>{cat.name}</p>
        </div>
      ))}

      <div className="sidebarOption">
        <Add />
        <p className="text">Discover Spaces</p>
      </div>
    </div>
  );
}

export default SidebarOptions;
