import React from "react";
import { Add } from "@material-ui/icons";
import "./css/SidebarOptions.css";

function SidebarOptions({ onCategoryClick }) {
  const categories = [
    { name: "History", img: "https://cdn.pixabay.com/photo/2014/01/18/10/14/vaulted-cellar-247391_640.jpg" },
    { name: "Business", img: "https://media.istockphoto.com/id/1350415370/photo/partnership-multi-exposure-of-investor-businessman-handshake-with-partner-for-successful.jpg?s=2048x2048&w=is&k=20&c=Q6CFBhfj3-XRT-NZ26RTXJPgrpLCr0WoDPw1Iw5SGls=" },
    { name: "Psychology", img: "https://cdn.pixabay.com/photo/2014/11/24/18/50/mind-544404_1280.png" },
    { name: "Cooking", img: "https://cdn.pixabay.com/photo/2016/11/21/16/03/campfire-1846142_1280.jpg" },
    { name: "Music", img: "https://media.istockphoto.com/id/1451301857/photo/golden-3d-podcast-icon-isolated-on-white-background-3d-illustration.webp" },
    { name: "Science", img: "https://media.istockphoto.com/id/1414916333/photo/metaverse-and-future-digital-technology-businessman-hand-holding-virtual-global-internet.webp" },
    { name: "Health", img: "https://cdn.pixabay.com/photo/2017/07/02/19/24/dumbbells-2465478_640.jpg" },
    { name: "Movies", img: "https://media.istockphoto.com/id/534129330/photo/reel-of-film.webp" },
    { name: "Technology", img: "data:image/jpeg;base64,...", },
    { name: "Education", img: "data:image/png;base64,...", }
  ];

  return (
    <div className="sidebarOptions">
      {categories.map((cat) => (
        <div
          key={cat.name}
          className="sidebarOption"
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
